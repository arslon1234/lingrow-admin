// Incorrect Event Placement Error - checked and confirmed

import dayjs from "dayjs";
import { addErrorMessage } from "../addMessage";

// importing helpers

const INCORRECTLY_PLACED_STATUSES = new Set(["DR_LOGIN", "DR_LOGOUT", "DR_CERT_1", "DR_CERT_2", "DR_CERT_3", "DR_CERT_4", "DR_CERT_5", "DR_CERT_6", "DR_CERT_7", "DR_CERT_8", "DR_CERT_9"]);
const PRECEDING_STATUSES = new Set(["INTER_NORMAL_PRECISION", "INTER_REDUCED_PERCISION", "DS_D"]);
const MOMENT_FORMAT = "YYYY-MM-DDTHH:mm:ss";

function convertToTimeStamp(dateTime) {
    return dateTime ? dayjs(dateTime).format(MOMENT_FORMAT).valueOf() : "nullish";
}

function checkIncorrectEventPlacementNew(allEvents) {
    if (!allEvents || !Array.isArray(allEvents)) {
        console.error("Invalid input: allEvents must be an array.");
        return;
    }

    const eventsGroupDict = new Map();

    allEvents.forEach(currentEvent => {
        const timestamp = convertToTimeStamp(currentEvent.dateTime);
        const key = `${timestamp}|${currentEvent.eventCodeDescription}`;
        const prevList = eventsGroupDict.get(key) ?? [];
        prevList.push(currentEvent);
        eventsGroupDict.set(key, prevList);
    });

    const previousEvents = [];

    allEvents.forEach((currentEvent, currentIndex) => {
        if (currentIndex > 0) {
            // const previousEvents = allEvents.slice(0, currentIndex);
            // const lastValidPreviousEvent = previousEvents.filter(event => !INCORRECTLY_PLACED_STATUSES.includes(event.eventCodeDescription)).pop();
            const lastValidPreviousEvent = previousEvents?.at(-1) ?? null;

            if (lastValidPreviousEvent && PRECEDING_STATUSES.has(lastValidPreviousEvent.eventCodeDescription) && INCORRECTLY_PLACED_STATUSES.has(currentEvent.eventCodeDescription)) {
                markEventWithError(eventsGroupDict, currentEvent, "Incorrect Event Placement", "Incorrect Event Placement Error");
            }

            if (!INCORRECTLY_PLACED_STATUSES.has(currentEvent.eventCodeDescription)) {
                previousEvents.push(currentEvent);
            }
        }
    });
}

function markEventWithError(eventsGroupByDict, targetEvent, errorMessageTitle, errorMessage) {
    // allEvents.map(eventInAllEvents => {
    //     if (formatTime(eventInAllEvents.dateTime, MOMENT_FORMAT) === formatTime(targetEvent.dateTime, MOMENT_FORMAT) && eventInAllEvents.eventCodeDescription === targetEvent.eventCodeDescription) {
    //         console.log(errorMessageTitle, errorMessage);
    //         addErrorMessage(eventInAllEvents, errorMessageTitle, errorMessage);
    //     }
    //     return eventInAllEvents;
    // });
    const timestamp = convertToTimeStamp(targetEvent.dateTime);
    const key = `${timestamp}|${targetEvent.eventCodeDescription}`;
    const matchingEvents = eventsGroupByDict.get(key) ?? [];

    matchingEvents.forEach(compatEv => {
        // console.log(errorMessageTitle, errorMessage);
        addErrorMessage(compatEv, errorMessageTitle, errorMessage);
    });
}

export { checkIncorrectEventPlacementNew };
