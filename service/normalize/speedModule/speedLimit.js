// speed limit test checked

// importing packages
import dayjs from 'dayjs';

// importing helpers
import { addErrorMessage, addWarningMessage } from "../addMessage";

const wge = [
  "DS_OFF", "DS_SB", "DS_D", "DS_ON", "DS_WT", "DR_IND_YM", "DR_LOGIN",
  "DR_IND_PC", "ELD_DIAG_CLEARED", "ELD_DIAG", "ELD_MALF_CLEARED", "ELD_MALF",
  "ENG_DOWN_REDUCED", "ENG_DOWN_NORMAL", "ENG_UP_REDUCED", "ENG_UP_NORMAL",
  "DR_LOGOUT", "DR_IND_CLEARED", "INTER_REDUCED_PERCISION", "INTER_NORMAL_PRECISION"
];

const Nge = [
  "DR_CERT_1", "DR_CERT_2", "DR_CERT_3", "DR_CERT_4", "DR_CERT_5",
  "DR_CERT_6", "DR_CERT_7", "DR_CERT_8", "DR_CERT_9"
];

function checkSpeedLimit(events) {
  const SPEED_LIMIT = 75; // mph
  const SPEED_MARGIN = 7; // mph

  for (let i = 0; i < events.length - 1; i++) {
    const currentEvent = events[i];
    const nextEvent = events[i + 1];

    // Validate event statuses
    if (!currentEvent || !nextEvent ||
      !wge.includes(currentEvent.eventCodeDescription) ||
      !wge.includes(nextEvent.eventCodeDescription)) {
      continue;
    }

    // Validate location
    const locationParts = (nextEvent?.calculatedLocation || nextEvent?.manualLocation)?.split(",");
    const lastLocationPart = locationParts?.[locationParts.length - 1]?.trim();
    if (!lastLocationPart) {
      continue;
    }

    // Calculate speed
    const distance = Number(nextEvent.totalVehicleMiles) - Number(currentEvent.totalVehicleMiles);
    const timeDifference = dayjs(nextEvent.dateTime).diff(dayjs(currentEvent.dateTime), 'hour', true);
    const speed = distance / timeDifference;

    // console.log(currentEvent.duration, nextEvent.duration, currentEvent.dateTime, nextEvent.dateTime, currentEvent.odometer, nextEvent.odometer, distance, timeDifference, speed, " speed");

    if (!distance || !timeDifference) {
      continue;
    }

    // Check for high-speed warnings/errors
    if (speed > SPEED_LIMIT) {
      const severity = Math.abs(speed - SPEED_LIMIT) > SPEED_MARGIN ? "error" : "warning";
      const message = `Speed: ${Math.round(speed)}mph, Speed Limit: ${SPEED_LIMIT}mph`;

      // Update nextEvent with warnings/errors
      if (severity === "error") {
        addErrorMessage(nextEvent, message);
      } else {
        addWarningMessage(nextEvent,  message);
      }
    }
  }
};

export { checkSpeedLimit };