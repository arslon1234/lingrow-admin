//Excessive login warning checked, confirmed
//Excessive logout   checked, confirmed

// importing helpers
import { addErrorMessage } from "../addMessage";

const LOGIN_LOGOUT_EVENT_TYPE = 5; // Assuming 5 is the event type for login/logout events
const LOGIN_EVENT_CODE = 1;
const LOGOUT_EVENT_CODE = 2;
const DR_LOGIN = "DR_LOGIN";
const DR_LOGOUT = "DR_LOGOUT";
const MOMENT_FORMAT = "YYYY-MM-DDTHH:mm:ss";

function processLoginLogoutEvents(events) {
    let loginCount = 0;
    let logoutCount = 0;

    for (let i = 0; i < events.length; i++) {
        const currentEvent = events[i];

        if (currentEvent.eventType !== LOGIN_LOGOUT_EVENT_TYPE) continue; // Skip non-login/logout events

        // Process excessive login warnings
        // if (currentEvent?.eventCodeDescription === DR_LOGIN) {
        if (currentEvent?.eventCode == LOGIN_EVENT_CODE) {
            if (loginCount > 0) {
                console.warn("Excessive Events", "Excessive Login Warning");
                addErrorMessage(currentEvent, "Excessive Events", "Excessive Login Warning");
            }
            loginCount++;
            logoutCount = 0; // Reset logout count on login event
        }

        // Process excessive logout warnings
        // else if (currentEvent?.eventCodeDescription === DR_LOGOUT) {
        else if (currentEvent?.eventCode == LOGOUT_EVENT_CODE) {
            if (logoutCount > 0) {
                console.warn("Excessive Events", "Excessive Logout Warning");
                addErrorMessage(currentEvent, "Excessive Events", "Excessive Logout Warning");
            }
            logoutCount++;
            loginCount = 0; // Reset login count on logout event
        }
    }
}

export { processLoginLogoutEvents };