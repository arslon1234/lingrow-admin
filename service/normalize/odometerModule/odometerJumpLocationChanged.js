
//Location Changed and Odometer Jump error types check
//This method is checked and confirmed to be working for all above errors as expected

// importing helpers
import { isCertificationEvent, isDrivingorIntermediateEvent } from '@/utils/events';
import { addErrorMessage } from '../addMessage';

function checkForOdometerJumpAndLocationChanged(events) {
    // Filter out unreliable statuses
    const filteredEvents = events.filter((event) => !isCertificationEvent(event));

    // ✅ Find the first occurrence of "DS_D"
    const firstDSDIndex = filteredEvents.findIndex(event => event?.eventCodeDescription === "DS_D");

    // ✅ Slice the data points starting from the first "DS_D"
    const relevantEvents = firstDSDIndex !== -1 ? filteredEvents.slice(firstDSDIndex) : filteredEvents;

    // ✅ Iterate through the relevant data points
    for (let i = 0; i < relevantEvents.length - 1; i++) {
        const currentEvent = relevantEvents[i];
        const nextEvent = relevantEvents[i + 1];

        // Skip comparison if either point has a suspicious status
        if (isDrivingorIntermediateEvent(currentEvent) || isDrivingorIntermediateEvent(nextEvent)) {
            continue;
        }

        // Find the next point's original index in the full dataset
        const nextEventOriginalIndex = events.findIndex(event => event?.id === nextEvent?.id);
        if (nextEventOriginalIndex === -1) continue;

        const nextEventOriginal = events[nextEventOriginalIndex];

        // ✅ Check for odometer jump
        if (currentEvent?.totalVehicleMiles > nextEvent?.totalVehicleMiles) {
            addErrorMessage(nextEventOriginal, "Odometer Jump");
        }

        // ✅ Check for location change
        if (currentEvent?.calculatedLocation !== nextEvent?.calculatedLocation) {
            addErrorMessage(nextEventOriginal, "Location Changed");
        }
    }
}

export { checkForOdometerJumpAndLocationChanged };
