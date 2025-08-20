// Incorrect Event Placement Error - checked and confirmed

// importing helpers
import { addErrorMessage } from '../addMessage';

const INCORRECTLY_PLACED_STATUSES = ["DR_LOGIN", "DR_LOGOUT", "DR_CERT_1", "DR_CERT_2", "DR_CERT_3", "DR_CERT_4", "DR_CERT_5", "DR_CERT_6", "DR_CERT_7", "DR_CERT_8", "DR_CERT_9"];
const PRECEDING_STATUSES = ["INTER_NORMAL_PRECISION", "INTER_REDUCED_PERCISION", "DS_D"];
const MOMENT_FORMAT = "YYYY-MM-DDTHH:mm:ss";

function checkIncorrectEventPlacement(allEvents) {
    if (!allEvents || !Array.isArray(allEvents)) {
        console.error("Invalid input: allEvents must be an array.");
        return;
    }

    allEvents.forEach((currentEvent, currentIndex) => {
        if (currentIndex > 0) {
            const previousEvents = allEvents.slice(0, currentIndex);
            const lastValidPreviousEvent = previousEvents.filter(event => !INCORRECTLY_PLACED_STATUSES.includes(event.eventCodeDescription)).pop();

            if (lastValidPreviousEvent && PRECEDING_STATUSES.includes(lastValidPreviousEvent.eventCodeDescription) && INCORRECTLY_PLACED_STATUSES.includes(currentEvent.eventCodeDescription)) {
                markEventWithError(allEvents, currentEvent, "Incorrect Event Placement", "Incorrect Event Placement Error");
            }
        }
    });
}

function markEventWithError(allEvents, targetEvent, errorMessageTitle, errorMessage) {
    allEvents.map(eventInAllEvents => {
        if (formatTime(eventInAllEvents.dateTime, MOMENT_FORMAT) === formatTime(targetEvent.dateTime, MOMENT_FORMAT) && eventInAllEvents.eventCodeDescription === targetEvent.eventCodeDescription) {
            // console.log(errorMessageTitle, errorMessage);
            addErrorMessage(eventInAllEvents, errorMessageTitle, errorMessage);
        }
        return eventInAllEvents;
    });
}

export { checkIncorrectEventPlacement };
