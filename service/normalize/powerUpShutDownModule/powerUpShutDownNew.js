import dayjs from 'dayjs';
import { addErrorMessage } from "../addMessage";

// Constants
const Nge = [
  "DR_CERT_1", "DR_CERT_2", "DR_CERT_3",
  "DR_CERT_4", "DR_CERT_5", "DR_CERT_6",
  "DR_CERT_7", "DR_CERT_8", "DR_CERT_9"
];
const Tge = "ENG_DOWN_NORMAL";
const _ge = "ENG_UP_NORMAL";
const NO_POWER_UP = 'No Power-up Event';
const NO_SHUT_DOWN = 'No Shut-down Event';
const ERROR_MESSAGES = {
  NO_POWER_UP: "No Power-up Event Error",
  NO_SHUT_DOWN: "No Shut-down Event Error"
};

// Preprocess events and times to add timestamps
function preprocessEventsAndTimes(e, t) {
  return {
    events: e.map(ev => ({ ...ev, timestamp: dayjs(ev.dateTime).valueOf() })),
    times: t.map(timeItem => ({ ...timeItem, timestamp: dayjs(timeItem.time).valueOf() }))
  };
}

// Find last event matching a predicate
function findLast(array, predicate) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) return array[i];
  }
  return undefined;
}

// Add error message to events with matching timestamp
function Xge(events, referenceEvent, eventLabel, errorLabel) {
  if (!referenceEvent) return;
  events.forEach(ev => {
    if (ev.timestamp === referenceEvent.timestamp) {
      // console.log(eventLabel, errorLabel);
      addErrorMessage(ev, eventLabel, errorLabel);
    }
  });
}

// Handle power-up error logic
function handlePowerUpCondition(events, nextPowerUp, nextDsD, nextDsOn, lastRelevantEvent) {
  const hasPowerUpError = (nextDsD?.errorTitles?.includes(NO_POWER_UP) || 
                          nextDsOn?.errorTitles?.includes(NO_POWER_UP));
  const isInvalidSequence = !(nextPowerUp?.timestamp > (nextDsD?.timestamp ?? Infinity)) || 
                            lastRelevantEvent?.eventCodeDescription === _ge;

  if (isInvalidSequence || hasPowerUpError) {
    if ((nextPowerUp?.timestamp ?? Infinity) > (nextDsOn?.timestamp ?? Infinity) && 
        !hasPowerUpError && lastRelevantEvent?.eventCodeDescription !== _ge) {
      Xge(events, nextDsOn, NO_POWER_UP, ERROR_MESSAGES.NO_POWER_UP);
    }
  } else {
    Xge(events, nextDsD, NO_POWER_UP, ERROR_MESSAGES.NO_POWER_UP);
  }
}

// Handle shut-down error logic
function handleShutDownCondition(events, times, timeItem, r, eventIndex) {
  if (!times[r + 1]) return;

  const nextTimeTs = times[r + 1].timestamp;
  const eventsInTimeRange = [];
  for (let i = eventIndex; i < events.length && events[i].timestamp < nextTimeTs; i++) {
    if (events[i].timestamp > timeItem.timestamp) {
      eventsInTimeRange.push(events[i]);
    }
  }

  const shutDownEvent = eventsInTimeRange.find(ev => ev.eventCodeDescription === Tge);
  const lastNonNgeEvent = findLast(eventsInTimeRange, ev => !Nge.includes(ev.eventCodeDescription));

  if (!shutDownEvent && lastNonNgeEvent) {
    Xge(events, lastNonNgeEvent, NO_SHUT_DOWN, ERROR_MESSAGES.NO_SHUT_DOWN);
  }
}

// Process a single time item using sliding window
function processTimeItem(events, times, timeItem, r, eventIndex) {
  // Find valid events (equivalent to 'a')
  const validEvents = [];
  let newEventIndex = eventIndex;
  for (let i = eventIndex; i < events.length && events[i].timestamp <= timeItem.timestamp; i++) {
    if (!Nge.includes(events[i].eventCodeDescription)) {
      validEvents.push(events[i]);
    }
    newEventIndex = i + 1; // Advance index to skip processed events
  }

  if (validEvents.length > 0) {
    // Find nextPowerUp, nextDsD, nextDsOn starting from eventIndex
    let nextPowerUp, nextDsD, nextDsOn;
    for (let i = newEventIndex; i < events.length; i++) {
      const ev = events[i];
      if (ev.timestamp > timeItem.timestamp) {
        if (!nextPowerUp && ev.eventCodeDescription === _ge) {
          nextPowerUp = ev;
        }
        if (!nextDsD && ev.eventCodeDescription === "DS_D") {
          nextDsD = ev;
        }
        if (!nextDsOn && ev.eventCodeDescription === "DS_ON") {
          nextDsOn = ev;
        }
        // Stop early if all events are found
        if (nextPowerUp && nextDsD && nextDsOn) break;
      }
    }

    // Find lastRelevantEvent before nextDsOn?.timestamp
    const lastRelevantEvent = findLast(events.slice(0, events.findIndex(ev => ev === nextDsOn) + 1), 
      ev => ev.timestamp < (nextDsOn?.timestamp ?? Infinity) && 
            [_ge, Tge].includes(ev.eventCodeDescription)
    );

    handlePowerUpCondition(events, nextPowerUp, nextDsD, nextDsOn, lastRelevantEvent);
    handleShutDownCondition(events, times, timeItem, r, newEventIndex);
  }

  return newEventIndex; // Return updated index for next iteration
}

/**
 * Processes sorted events and times to detect missing power-up and shut-down events.
 * @param {Object[]} events - Array of events with dateTime and eventCodeDescription.
 * @param {Object[]} times - Array of time items with time property.
 */
function processEventsPowerUpShutDownNew(e, t) {
  if (!e.length || !t.length) return;

  const { events, times } = preprocessEventsAndTimes(e, t);
  
  // Filter times after first event
  const firstEventTs = events[0]?.timestamp;
  const filteredTimes = times.filter(timeItem => timeItem.timestamp > firstEventTs);

  let eventIndex = 0;
  filteredTimes.forEach((timeItem, r) => {
    eventIndex = processTimeItem(events, filteredTimes, timeItem, r, eventIndex);
  });
}

export { processEventsPowerUpShutDownNew };
