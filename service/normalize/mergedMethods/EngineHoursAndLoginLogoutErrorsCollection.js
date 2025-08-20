// Combined processing for Login/Logout events and Engine Hours errors

// Import the helper functions for messaging and calculating durations
import { addWarningMessage, addErrorMessage } from "../addMessage";
import { calculateDurationBetweenEvents } from "../calculateDurationBetweenEvents";

// Constants for Login/Logout events
const DR_LOGIN = "DR_LOGIN";
const DR_LOGOUT = "DR_LOGOUT";

// Constants for Engine Hours Checks
const CERT_EVENT_TYPE = 4; // Assuming 4 is the event type for certification event
const UNRELIABLE_STATUSES = [
	"DR_CERT_1", "DR_CERT_2", "DR_CERT_3", "DR_CERT_4",
	"DR_CERT_5", "DR_CERT_6", "DR_CERT_7", "DR_CERT_8", "DR_CERT_9"
];
const ENGINE_HOURS_EVENT_TYPE = 6;
const POWER_UP_EVENT_CODE = 1;
const SHUT_DOWN_EVENT_CODE = 3;
const ENGINE_HOURS_UNCHANGED_STATUS = "ENG_UP_NORMAL";

/**
 * Processes an array of events, checking for both excessive login/logout warnings
 * and engine hours errors. The function iterates through the events only once.
 *
 * @param {Array} events - Array of event objects.
 */
function engineHoursAndLoginLogoutErrors(events) {
	// Validate the input
	if (!Array.isArray(events)) {
		console.error("Invalid input: events must be an array.");
		return;
	}

	// Initialize login/logout counters
	let loginCount = 0;
	let logoutCount = 0;

	let previousEvent = null;
	let isEngineOn = false;

	// Process the events array in a single loop
	for (let i = 0; i < events.length; i++) {
		const currentEvent = events[i];

		// Skip invalid event objects
		if (!currentEvent || typeof currentEvent !== 'object') {
			console.warn(`Invalid event at index ${i}. Skipping this event.`);
			continue;
		}

		// *** Login/Logout Checks ***
		if (currentEvent.eventCodeDescription === DR_LOGIN) {
			if (loginCount > 0) {
				addWarningMessage(currentEvent, "Excessive Login Warning");
			}
			loginCount++;
			logoutCount = 0; // Reset logout counter when a login occurs
		} else if (currentEvent.eventCodeDescription === DR_LOGOUT) {
			if (logoutCount > 0) {
				addWarningMessage(currentEvent, "Excessive Logout Warning");
			}
			logoutCount++;
			loginCount = 0; // Reset login counter when a logout occurs
		}

		// *** Engine Hours Checks ***
		// Skip the engine hours error checks if the current event has an unreliable status.
		if (currentEvent.eventType == CERT_EVENT_TYPE && UNRELIABLE_STATUSES.includes(currentEvent.eventCodeDescription)) {
			continue;
		}

		// If there is a previous event and it is valid for comparison
		// This idea is not always correct, because if the one prev event is a certification event, 
		// there could be another reliable event before this certification event.
		// const previousEvent = events[i - 1];
		if (previousEvent && typeof previousEvent === 'object' && previousEvent.eventType != CERT_EVENT_TYPE) {
			// Calculate the duration between the previous and current events
			const durationInMinutes = calculateDurationBetweenEvents(previousEvent, currentEvent);

			// Convert engine hours values to numbers for comparison
			const currentEngineHours = Number(currentEvent.totalEngineHours);
			const previousEngineHours = Number(previousEvent.totalEngineHours);

			// Check 1: If the current engine hours are missing or invalid
			if (isNaN(currentEngineHours) || currentEngineHours <= 0) {
				addErrorMessage(currentEvent, "Engine Hours error", "Engine Hours missing");
			}

			// Check 2: If the previous event should have had a change but didn’t
			if (!isNaN(previousEngineHours) &&
				isEngineOn &&
				currentEngineHours === previousEngineHours &&
				durationInMinutes >= 6) {
				addErrorMessage(currentEvent, "Engine Hours error", "Engine Hours didn't change");
			}

			// Check 3: If the current engine hours are less than in the previous event
			if (!isNaN(previousEngineHours) && currentEngineHours < previousEngineHours) {
				addErrorMessage(currentEvent, "Engine Hours error", "Engine Hours is less than the previous status");
			}
		}

		if (currentEvent.eventType != CERT_EVENT_TYPE) {
			// Update the previous event only if it is not a certification event
			previousEvent = currentEvent;
			if (currentEvent.eventType == ENGINE_HOURS_EVENT_TYPE) {
				// Check if the engine is currently on or off
				isEngineOn = (currentEvent.eventCode == POWER_UP_EVENT_CODE);
			}
		}
	}
}

export { engineHoursAndLoginLogoutErrors };
