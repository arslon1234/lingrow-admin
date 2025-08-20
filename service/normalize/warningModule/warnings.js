// importing packages
import { addErrorMessage, addWarningMessage } from "../addMessage";

const UNRELIABLE_STATUSES = ["DR_CERT_1", "DR_CERT_2", "DR_CERT_3", "DR_CERT_4", "DR_CERT_5", "DR_CERT_6", "DR_CERT_7", "DR_CERT_8", "DR_CERT_9"];
const INCORRECT_NOTES_STATUSES = ["DR_LOGIN", "DR_LOGOUT", "ENG_UP_NORMAL", "ENG_DOWN_NORMAL", ...UNRELIABLE_STATUSES, "INTER_NORMAL_PRECISION"];

function checkEventWarnings(events) {
  // Validate input
  if (!events || !Array.isArray(events)) {
    console.error("Invalid input: events must be an array.");
    return [];
  }

  // Process each event
  events.forEach((event, index) => {
    if (!event || typeof event !== 'object') {
      console.warn(`Invalid event at index ${index}: Skipping.`);
      return;
    }

    checkRecordStatusWarnings(event);
    checkOriginAndStatusWarnings(event);
    checkLocationWarnings(event);
    checkNotesWarnings(event);
  });

}

function checkRecordStatusWarnings(event) {
  switch (event.recordStatusDescription) {
    case "INACTIVE_CHANGED":
      addWarningMessage(event, "Inactive Change Warning");
      break;
    case "INACTIVE_CHANGE_REQUESTED":
      addWarningMessage(event, "Inactive Change Requested Warning");
      break;
    case "INACTIVE_CHANGE_REJECTED":
      addWarningMessage(event, "Inactive Change Rejected Warning");
      break;
  }
}

function checkOriginAndStatusWarnings(event) {
  if (event.recordOriginDescription === "DRIVER" && event.eventCodeDescription === "DS_D") {
    addWarningMessage(event, "Driving Origin Warning");
  }
}

function checkLocationWarnings(event) {
  const locationStatuses = ["DR_LOGIN", "DR_LOGOUT", ...UNRELIABLE_STATUSES];

  if (!event?.calculatedLocation && !locationStatuses.includes(event.eventCodeDescription)) {
    addErrorMessage(event, "Location Missing");
  }
}

function checkNotesWarnings(event) {
  if (Array.isArray(event.annotation) && event.annotation.some(note => note.trim() !== "")) {
    if (
      INCORRECT_NOTES_STATUSES.includes(event.eventCodeDescription) || 
      (event.eventCodeDescription === "DS_D" && event.recordOriginDescription === "AUTO")
    ) {
      addErrorMessage(event, "Incorrect Notes", "Notes in Incorrect Events Error");
    }
  }
}

export { checkEventWarnings };