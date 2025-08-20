// engine hours incorrect errors test checked

// importing packages
import dayjs from 'dayjs';

// importing helpers
import { addErrorMessage } from '../addMessage';
import { getEventsBetweenStatusChanges } from '../getEventsBetweenStatusChanges';
import { calculateDurationBetweenEvents } from '../calculateDurationBetweenEvents';
import { isSameDateTime } from '../isSameDateTime';

// Constants
const ENG_UP_NORMAL = "ENG_UP_NORMAL";
const ENG_DOWN_NORMAL = "ENG_DOWN_NORMAL";
const Ige = ["DR_CERT_1", "DR_CERT_2", "DR_CERT_3", "DR_CERT_4", "DR_CERT_5", "DR_CERT_6", "DR_CERT_7", "DR_CERT_8", "DR_CERT_9", "DR_LOGOUT", "DR_LOGIN"];
let errorCount = 0;

// Main function to process engine hours and status changes
function processEngineHoursAndStatus(events) {

    const NORMAL_ENGINE_UP = ENG_UP_NORMAL;
    const NORMAL_ENGINE_DOWN = ENG_DOWN_NORMAL;

    // Create deep copy and reverse events
    // events.reverse();
    let processedEvents = JSON.parse(JSON.stringify([...events].reverse()));

    // Filter out ignored statuses
    processedEvents = processedEvents.filter(event => !Ige.includes(event.eventCodeDescription));

    // Get engine status changes
    const engineStatusChanges = processedEvents.filter(event =>
        [NORMAL_ENGINE_UP, NORMAL_ENGINE_DOWN].includes(event.eventCodeDescription)
    );

    // Get maximum engine hours from events
    let maxEngineHours = events.reduce((max, event) => {
        return event && event?.totalEngineHours > max ? event.totalEngineHours : max;
    }, -Infinity);

    // Get events after first status change
    const eventsAfterFirstChange = processedEvents.filter(event =>
        dayjs(event.dateTime).isAfter(engineStatusChanges[0]?.dateTime)
    );

    let currentVehicleId = null;

    // Process events after first status change
    if (eventsAfterFirstChange?.length) {
        [currentVehicleId, maxEngineHours] = processVehicleEngineHours(
            currentVehicleId,
            eventsAfterFirstChange,
            maxEngineHours
        );
        maxEngineHours = validateEngineHours(eventsAfterFirstChange, maxEngineHours, events);
    }

    // Process each engine status change
    if (engineStatusChanges?.length) {
        engineStatusChanges.forEach((statusChange, index) => {
            let relevantEvents = [];

            // Find event index matching current status change
            const eventIndex = processedEvents.findIndex(event =>
                isSameDateTime(event, statusChange) && event.eventCodeDescription === statusChange.eventCodeDescription
            );

            // Get relevant events for processing
            relevantEvents = index === 0
                ? processedEvents.slice(0, eventIndex + 1)
                : getEventsBetweenStatusChanges(processedEvents, engineStatusChanges[index - 1], statusChange);

            // Process engine hours for current set of events
            [currentVehicleId, maxEngineHours] = processVehicleEngineHours(
                currentVehicleId,
                relevantEvents,
                maxEngineHours
            );
            maxEngineHours = validateEngineHours(relevantEvents, maxEngineHours, events);
        });
    }

    console.log("error count ", errorCount);
}

// Process vehicle engine hours between status changes
function processVehicleEngineHours(currentVehicleId, events, maxEngineHours) {
    if (!currentVehicleId) {
        currentVehicleId = events.findLast(event => event.vehicleId)?.vehicleId;
    }

    const differentVehicleEvents = events.filter(event =>
        event.vehicleId?.toString() !== currentVehicleId?.toString()
    );

    if (differentVehicleEvents?.length) {
        const lastEvent = differentVehicleEvents[differentVehicleEvents.length - 1];
        currentVehicleId = lastEvent?.vehicleId;
        maxEngineHours = lastEvent?.totalEngineHours;
    }

    return [currentVehicleId, maxEngineHours];
}

// Validate engine hours between events
function validateEngineHours(events, maxEngineHours, originalEvents) {
    events.forEach((currentEvent, index) => {
        if (events[index + 1]) {
            const engineHoursDiff = parseFloat(
                (currentEvent.totalEngineHours - events[index + 1].totalEngineHours).toFixed(1)
            ).toFixed(1);

            const minutesDiff = calculateDurationBetweenEvents(currentEvent, events[index + 1]);

            if (currentEvent.eventCodeDescription !== ENG_UP_NORMAL) {
                const expectedEngineHours = calculateExpectedEngineHours(minutesDiff);
                maxEngineHours = parseFloat(maxEngineHours - expectedEngineHours).toFixed(1);
                checkEngineHoursMismatch(currentEvent, engineHoursDiff, expectedEngineHours, originalEvents);
            }
        }
    });
    return maxEngineHours;
}

// Check for engine hours mismatch and update warnings
function checkEngineHoursMismatch(event, actualDiff, expectedDiff, events) {
    if (+actualDiff !== +expectedDiff) {
        events = events.map(originalEvent => {
            if (isSameDateTime(originalEvent, event) &&
                originalEvent.id === event.id &&
                originalEvent.eventCodeDescription === event.eventCodeDescription &&
                Math.round(10 * (actualDiff - expectedDiff)) / 10 > 0.1) {

                const errorMessage = `Engine Hours incorrect: Current (${actualDiff}), Correct (${expectedDiff})`;

                addErrorMessage(originalEvent, errorMessage, errorMessage);
                errorCount += 1;
            }
            return originalEvent;
        });
    }
}

// Calculate expected engine hours based on time difference
function calculateExpectedEngineHours(minutesDiff) {
    if (minutesDiff < 6) return parseFloat(0).toFixed(1);
    if (minutesDiff > 6 && minutesDiff < 12) return parseFloat(0.1).toFixed(1);

    const hoursDecimal = 0.0166666666666667 * minutesDiff;
    const [hours, decimal] = hoursDecimal > -1
        ? hoursDecimal.toString().split('.')
        : ['0', '0'];

    return parseFloat(`${hours}.${decimal?.charAt(0)}`).toFixed(1);
}

export { processEngineHoursAndStatus };
