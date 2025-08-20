
// Engine hours missing, Engine hours is less than the previous status - errors checked and confirmed
// Engine hours test checked

// importing helpers
import { calculateDurationBetweenEvents } from '../calculateDurationBetweenEvents';
import { addErrorMessage } from '../addMessage';

const UNRELIABLE_STATUSES = ["DR_CERT_1", "DR_CERT_2", "DR_CERT_3", "DR_CERT_4", "DR_CERT_5", "DR_CERT_6", "DR_CERT_7", "DR_CERT_8", "DR_CERT_9"];
const ENGINE_HOURS_UNCHANGED_STATUS = "ENG_UP_NORMAL";

function checkEngineHoursErrors(events) {
    if (!events || !Array.isArray(events)) {
        console.error("Invalid input: events must be an array.");
        return [];
    }

    events.forEach((event, index) => {
        if (!event || typeof event !== 'object') {
            console.warn(`Invalid event at index ${index}: Skipping.`);
            return event;
        }

        if (UNRELIABLE_STATUSES.includes(event.eventCodeDescription)) {
            return event;
        }

        const previousEvent = events[index - 1];

        if (previousEvent && typeof previousEvent === 'object' && !UNRELIABLE_STATUSES.includes(previousEvent.eventCodeDescription)) {
            const duration = calculateDurationBetweenEvents(previousEvent, event);
            const currentEngineHours = Number(event.totalEngineHours);
            const previousEngineHours = Number(previousEvent.totalEngineHours);

            if (isNaN(currentEngineHours) || currentEngineHours <= 0) {
                addErrorMessage(event, "Engine Hours missing");
            }

            if (!isNaN(previousEngineHours) && previousEvent.eventCodeDescription === ENGINE_HOURS_UNCHANGED_STATUS && currentEngineHours === previousEngineHours && duration > 5) {
                addErrorMessage(event, "Engine Hours didn't change");
            }

            if (!isNaN(previousEngineHours) && currentEngineHours < previousEngineHours) {
                addErrorMessage(event, "Engine Hours is less than the previous status");
            }
        }
        return event;
    });
}

export { checkEngineHoursErrors };