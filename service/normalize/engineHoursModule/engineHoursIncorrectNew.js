// importing packages
import dayjs from 'dayjs';

// importing packages

// importing helpers
import { addErrorMessage } from '../addMessage';
import { calculateDurationBetweenEvents } from '../calculateDurationBetweenEvents';

// Constants
const ENG_UP_NORMAL = "ENG_UP_NORMAL";
const ENG_DOWN_NORMAL = "ENG_DOWN_NORMAL";
const IgeSet = new Set([
    "DR_CERT_1", "DR_CERT_2", "DR_CERT_3", "DR_CERT_4", "DR_CERT_5",
    "DR_CERT_6", "DR_CERT_7", "DR_CERT_8", "DR_CERT_9", "DR_LOGOUT", "DR_LOGIN"
]);
let errorCount = 0;

// Main function to process engine hours and status changes
function processEngineHoursAndStatusNew(events) {
    const NORMAL_ENGINE_UP = ENG_UP_NORMAL;
    const NORMAL_ENGINE_DOWN = ENG_DOWN_NORMAL;

    // Create a deep copy of events using JSON methods,
    // reverse the array and add a timestamp property to each event.
    const processedEvents = [];
    const engineStatusChanges = [];
    let maxEngineHours = -Infinity;

    events.forEach(event => {
        if (event.totalEngineHours > maxEngineHours) {
            maxEngineHours = event.totalEngineHours;
        }
        if (!IgeSet.has(event.eventCodeDescription)) {
            const processedEvent = {
                ...event,
                timestamp: dayjs(event.dateTime).valueOf()
            };
            processedEvents.push(processedEvent);
            if (event.eventCodeDescription === ENG_UP_NORMAL ||
                event.eventCodeDescription === ENG_DOWN_NORMAL) {
                engineStatusChanges.push(processedEvent);
            }
        }
    });
    processedEvents.reverse();
    engineStatusChanges.reverse();

    const eventMap = new Map();
    processedEvents.forEach(event => {
        eventMap.set(`${event.id}_${event.timestamp}_${event.eventCodeDescription}`, event);
    });

    // Process events after the first status change, if available.
    if (engineStatusChanges.length) {
        const firstStatusTimestamp = engineStatusChanges[0].timestamp;
        const eventsAfterFirstChange = processedEvents.filter(event =>
          event.timestamp > firstStatusTimestamp
        );

        let currentVehicleId = null;
        if (eventsAfterFirstChange.length) {
            // Process events occurring after the first status change.
            [currentVehicleId, maxEngineHours] = processVehicleEngineHours(
              currentVehicleId,
              eventsAfterFirstChange,
              maxEngineHours
            );
            maxEngineHours = validateEngineHours(eventsAfterFirstChange, maxEngineHours, eventMap);
        }

        // Process events for each engine status change.
        // let currentVehicleIdForStatus = currentVehicleId;
        // engineStatusChanges.forEach((statusChange, index) => {
        //     let relevantEvents = [];
        //     // Locate the event index matching the current status change.
        //     const eventIndex = processedEvents.findIndex(event =>
        //       isSameDateTime(event, statusChange) &&
        //       event.eventCodeDescription === statusChange.eventCodeDescription
        //     );

        //     // For the first status change, use a slice from start; otherwise, get events between changes.
        //     relevantEvents = index === 0
        //       ? processedEvents.slice(0, eventIndex + 1)
        //       : getEventsBetweenStatusChanges(processedEvents, statusChange, engineStatusChanges[index - 1]);

        //     [currentVehicleIdForStatus, maxEngineHours] = processVehicleEngineHours(
        //       currentVehicleIdForStatus,
        //       relevantEvents,
        //       maxEngineHours
        //     );
        //     maxEngineHours = validateEngineHours(relevantEvents, maxEngineHours, eventMap);
        // });
        // Sliding window to process events between status changes
        let windowStartIndex = 0;
        let currentVehicleIdForStatus = currentVehicleId;

        // Iterate through status changes in reverse order (earliest to latest in original ascending order)
        for (let index = engineStatusChanges.length - 1; index >= 0; index--) {
            const statusChange = engineStatusChanges[index];
            const endTimestamp = statusChange.timestamp;
            const startTimestamp = index > 0 ? engineStatusChanges[index - 1].timestamp : Infinity;

            // Find the index of the current status change in processedEvents
            const eventIndex = processedEvents.findIndex(event =>
                event.timestamp === statusChange.timestamp &&
                event.eventCodeDescription === statusChange.eventCodeDescription
            );

            // Collect events in the window [endTimestamp, startTimestamp]
            const relevantEvents = [];
            for (let i = windowStartIndex; i < processedEvents.length; i++) {
                const event = processedEvents[i];
                if (event.timestamp > startTimestamp) continue; // Skip events beyond the window
                if (event.timestamp < endTimestamp) break; // End of window
                relevantEvents.push(event);
            }
            windowStartIndex = eventIndex + 1; // Move window start to after current status change

            // For the first status change (last in reverse order), include all events up to eventIndex
            if (index === engineStatusChanges.length - 1) {
                relevantEvents.push(...processedEvents.slice(0, eventIndex + 1));
            }

            // Process the events in the window
            [currentVehicleIdForStatus, maxEngineHours] = processVehicleEngineHours(
                currentVehicleIdForStatus,
                relevantEvents,
                maxEngineHours
            );
            maxEngineHours = validateEngineHours(relevantEvents, maxEngineHours, eventMap);
        }
    }

    console.log("error count ", errorCount);
    // Optionally return values if needed.
}

// Process engine hours for vehicle changes between status changes.
function processVehicleEngineHours(currentVehicleId, events, maxEngineHours) {
    if (!currentVehicleId) {
        // Use findLast if available; otherwise reverse iterate.
        const eventWithId = events.slice().reverse().find(event => event.vehicleId);
        currentVehicleId = eventWithId?.vehicleId;
    }

    // Identify events with a different vehicleId.
    const differentVehicleEvents = events.filter(event =>
      event.vehicleId?.toString() !== currentVehicleId?.toString()
    );

    if (differentVehicleEvents.length) {
        const lastEvent = differentVehicleEvents[differentVehicleEvents.length - 1];
        currentVehicleId = lastEvent?.vehicleId;
        maxEngineHours = lastEvent?.totalEngineHours;
    }
    return [currentVehicleId, maxEngineHours];
}

// Validate engine hours between consecutive events.
function validateEngineHours(events, maxEngineHours, eventMap) {
    for (let i = 0; i < events.length - 1; i++) {
        const currentEvent = events[i];
        const nextEvent = events[i + 1];
        // Compute the engine hours difference and fix the decimal precision.
        const engineHoursDiff = parseFloat(
          (currentEvent.totalEngineHours - nextEvent.totalEngineHours).toFixed(1)
        ).toFixed(1);

        const minutesDiff = calculateDurationBetweenEvents(currentEvent, nextEvent);

        if (currentEvent.eventCodeDescription !== ENG_UP_NORMAL) {
            const expectedEngineHours = calculateExpectedEngineHours(minutesDiff);
            maxEngineHours = parseFloat(maxEngineHours - expectedEngineHours).toFixed(1);
            checkEngineHoursMismatch(currentEvent, engineHoursDiff, expectedEngineHours, eventMap);
        }
    }
    return maxEngineHours;
}

// Check for engine hours mismatch and update error messages.
function checkEngineHoursMismatch(event, actualDiff, expectedDiff, eventMap) {
    if (+actualDiff !== +expectedDiff) {
        // Instead of mapping through the full array each time, look for the matching event.
        // const matchingEvent = eventsArr.find(originalEvent =>
        //   isSameDateTime(originalEvent, event) &&
        //   originalEvent.id === event.id &&
        //   originalEvent.eventCodeDescription === event.eventCodeDescription
        // );
        const matchingEvent = eventMap.get(`${event.id}_${event.timestamp}_${event.eventCodeDescription}`);
        if (matchingEvent && Math.round(10 * (actualDiff - expectedDiff)) / 10 > 0.1) {
            const errorMessage = `Engine Hours incorrect: Current (${actualDiff}), Correct (${expectedDiff})`;
            // console.log(errorMessage);
            addErrorMessage(matchingEvent, errorMessage, errorMessage);
            errorCount += 1;
        }
    }
}

// Calculate expected engine hours based on the duration (in minutes) between events.
function calculateExpectedEngineHours(minutesDiff) {
    if (minutesDiff < 6) return parseFloat(0).toFixed(1);
    if (minutesDiff < 12) return parseFloat(0.1).toFixed(1);

    const hoursDecimal = 0.0166666666666667 * minutesDiff;
    const [hours, decimal] = hoursDecimal > -1 ? hoursDecimal.toString().split('.') : ['0', '0'];
    return parseFloat(`${hours}.${decimal?.charAt(0)}`).toFixed(1);
}

export { processEngineHoursAndStatusNew };
