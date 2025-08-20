// Code checked and confirmed for the given errors

// importing packages
import dayjs from 'dayjs';

// importing helpers
import { addErrorMessage, addWarningMessage } from "../addMessage";

function processEventsPtiCheck(events, times) {
    // Filter times to include only those after the first event's dateTime
    const firstEventStartDate = events[0]?.dateTime;
    times = times.filter(timeEntry => {
        return dayjs(timeEntry.time).isAfter(firstEventStartDate);
    });

    times.forEach(timeEntry => {
        // Filter events that occur after the current time entry and do not have excluded statuses
        const validEvents = events.filter(event => {
            return dayjs(timeEntry.time).isAfter(event.dateTime) && !excludedStatuses.includes(event.eventCodeDescription);
        });

        if (validEvents.length > 0) {
            // Find the first "DS_D" event after the current time
            const dsdEvent = events.find(event => {
                return dayjs(event.dateTime).isAfter(timeEntry.time) && event.eventCodeDescription === "DS_D";
            });

            // Find the first "DS_ON" event after the current time
            const dsonEvent = events.find(event => {
                return dayjs(event.dateTime).isAfter(timeEntry.time) && event.eventCodeDescription === "DS_ON";
            });

            if (dsonEvent && dsdEvent) {
                if (
                    !dayjs(dsonEvent?.dateTime).isAfter(dsdEvent?.dateTime) || dsdEvent?.warningTitles?.includes("No PTI")
                ) {
                    if (!ptiRegex.test(dsonEvent?.annotation) && (!dsonEvent?.warningTitles?.includes("No PTI"))) {
                        addWarning(events, dsonEvent, "No PTI", "No PTI Error", "warning");
                    }

                    const ptiDurationMinutes = Math.round(
                        dayjs(dsdEvent.dateTime).diff(dayjs(dsonEvent.dateTime), 'minutes')
                    );

                    if (ptiDurationMinutes < 15 && ptiDurationMinutes > 0) {
                        addWarning(events, dsonEvent, "PTI Duration", "PTI Duration is less than 15 minutes", "error");
                    }
                }
            }
        }
    });
}

// Helper function to add warnings to events
function addWarning(events, eventToUpdate, warningMessage, errorMessage, messageType) {
    if (!eventToUpdate) return;

    events.forEach(event => {
        if (dayjs(event.dateTime).isSame(eventToUpdate.dateTime)) {
            // console.log(warningMessage, errorMessage);
            if(messageType === "error") {
                addErrorMessage(event, warningMessage, errorMessage);
            } else if (messageType === "warning") {
                addWarningMessage(event, warningMessage, errorMessage);
            }
        }
    });
}

// Regular expression to match PTI-related notes
const ptiRegex = /\b(PTI|pre-trip(\sinspection)?)\b/i;

// Excluded statuses that should not trigger warnings
const excludedStatuses = [
    "DR_CERT_1", "DR_CERT_2", "DR_CERT_3", "DR_CERT_4",
    "DR_CERT_5", "DR_CERT_6", "DR_CERT_7", "DR_CERT_8", "DR_CERT_9"
];

export { processEventsPtiCheck };
