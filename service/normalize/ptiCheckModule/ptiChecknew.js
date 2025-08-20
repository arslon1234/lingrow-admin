// importing packages
import dayjs from 'dayjs';

// importing helpers
import { addErrorMessage, addWarningMessage } from "../addMessage";

// Regular expression to match PTI-related notes
const ptiRegex = /\b(PTI|pre-trip(\sinspection)?)\b/i;

// Excluded statuses that should not trigger warnings
const excludedStatuses = [
    "DR_CERT_1", "DR_CERT_2", "DR_CERT_3", "DR_CERT_4",
    "DR_CERT_5", "DR_CERT_6", "DR_CERT_7", "DR_CERT_8", "DR_CERT_9"
];

function processEventsPtiCheckNew(events, times) {
    // Validate the input
	if (!Array.isArray(events)) {
		console.error("Invalid input: events must be an array.");
		return;
	}

    // Sort events by dateTime in ascending order
    events = [...events].sort((a, b) => dayjs(a.dateTime).diff(dayjs(b.dateTime)));

    // // Sort times by time in ascending order
    times = [...times].sort((a, b) => dayjs(a.time).diff(dayjs(b.time)));

    // Filter times to include only those after the first event's dateTime
    const firstEventStartDate = events?.[0]?.dateTime;
    times = times.filter(timeEntry => {
        return dayjs(timeEntry.time).isAfter(firstEventStartDate);
    });

    let i = 0;
    const validEvents = [];

    // Pre-filter DS_D and DS_ON events
    const dsDEvents = events.filter(e => e.eventCodeDescription === "DS_D");
    const dsOnEvents = events.filter(e => e.eventCodeDescription === "DS_ON");

    // Reverse arrays for popping from the end
    dsDEvents.reverse();
    dsOnEvents.reverse();

    times.forEach(timeEntry => {
        // Build validEvents for events before timeEntry.time
        while (i < events.length && dayjs(timeEntry.time).isAfter(events[i].dateTime)) {
            if (!excludedStatuses.includes(events[i].eventCodeDescription)) {
                validEvents.push(events[i]);
            }
            i++;
        }

        // Pop DS_D events not after timeEntry.time
        while (dsDEvents.length > 0 && !dayjs(dsDEvents.at(-1).dateTime).isAfter(timeEntry.time)) {
            dsDEvents.pop();
        }

        // Pop DS_ON events not after timeEntry.time
        while (dsOnEvents.length > 0 && !dayjs(dsOnEvents.at(-1).dateTime).isAfter(timeEntry.time)) {
            dsOnEvents.pop();
        }

        if (validEvents.length > 0) {
            // Select the last DS_D and DS_ON events (first after timeEntry.time in original order)
            const dsdEvent = dsDEvents?.at(-1) ?? null;
            const dsonEvent = dsOnEvents?.at(-1) ?? null;

            if (dsonEvent && dsdEvent) {
                if (
                    (!dayjs(dsonEvent?.dateTime).isAfter(dsdEvent?.dateTime) || dsdEvent?.warningTitles?.includes("No PTI"))
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
            if (messageType === "error") {
                addErrorMessage(event, warningMessage, errorMessage);
            } else if (messageType === "warning") {
                addWarningMessage(event, warningMessage, errorMessage);
            }
        }
    });
}

export { processEventsPtiCheckNew };
