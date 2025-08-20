// Not Shut-down Event Error and No Power-up Event Error - errors checked and confirmed.

// importing packages
import dayjs from 'dayjs';

// importing helpers
import { addErrorMessage } from "../addMessage";

/* ------------------------------------
   Helper Constants and Functions
------------------------------------ */
const Nge = [
  "DR_CERT_1", "DR_CERT_2", "DR_CERT_3",
  "DR_CERT_4", "DR_CERT_5", "DR_CERT_6",
  "DR_CERT_7", "DR_CERT_8", "DR_CERT_9"
];
const Tge = "ENG_DOWN_NORMAL";
const _ge = "ENG_UP_NORMAL";
const NO_POWER_UP = 'No Power-up Event';
const NO_SHUT_DOWN = 'No Shut-down Event';

/**
 * Polyfill for "findLast" (if not using modern JS):
 */
function findLast(array, predicate) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
  return undefined;
}

/**
 * Xge function as in original, but using native JS + dayjs
 */
function Xge(events, referenceEvent, eventLabel, errorLabel) {
  if (!referenceEvent) return;

  events.forEach((ev) => {
    if (dayjs(ev.dateTime).isSame(referenceEvent.dateTime)) {
      // console.log(eventLabel, errorLabel);
      addErrorMessage(ev, eventLabel, errorLabel);
    }
  });
}

/* ------------------------------------
   The Main Function
------------------------------------ */
function processEventsPowerUpShutDown(e, t) {
  // 1) Filter 't' so we only keep times AFTER e[0]?.dateTime
  t = t.filter((timeItem) => {
    const firstDate = e[0]?.dateTime;
    return dayjs(timeItem.time).isAfter(firstDate);
  });

  // 2) Iterate over each element in 't'
  t.forEach((timeItem, r) => {
    // a) 'a' = events in 'e' such that timeItem.time is after event.dateTime
    //           AND the event.eventCodeDescription is not in 'Nge'.
    const a = e.filter((ev) => {
      return (
        dayjs(timeItem.time).isAfter(ev.dateTime) &&
        !Nge.includes(ev.eventCodeDescription)
      );
    });

    // b) If we have any such events, proceed
    if (a && a.length > 0) {
      // Find next events after timeItem.time with specific eventCodeDescriptions
      const o = e.find(
        (ev) => dayjs(ev.dateTime).isAfter(timeItem.time) && ev.eventCodeDescription === _ge
      );
      const i = e.find(
        (ev) => dayjs(ev.dateTime).isAfter(timeItem.time) && ev.eventCodeDescription === "DS_D"
      );
      const s = e.find(
        (ev) => dayjs(ev.dateTime).isAfter(timeItem.time) && ev.eventCodeDescription === "DS_ON"
      );

      // Find last event (before s?.dateTime) whose eventCodeDescription is in [_ge, Tge]
      const l = findLast(e, (ev) => {
        return (
          dayjs(ev.dateTime).isBefore(s?.dateTime) &&
          [_ge, Tge].includes(ev.eventCodeDescription)
        );
      });

      // -- Step 1: Evaluate the "bigCondition" from the ternary
      const bigCondition =
        !dayjs(o?.dateTime).isAfter(i?.dateTime) ||
        (l?.eventCodeDescription === _ge) ||
        (i && i?.errorTitles?.includes(NO_POWER_UP));

      // We'll replicate the ternary "side effect" logic exactly:
      if (bigCondition) {
        // If bigCondition is TRUE, then run the OR-chain:
        // (!dayjs(o).isAfter(s) || l.eventCodeDescription===_ge || i.powerUpAndDownError || s.powerUpAndDownError || Xge(...))

        // That OR-chain only calls Xge(...) if **all** the left conditions are false.
        let chainTriggered = false;

        if (!dayjs(o?.dateTime).isAfter(s?.dateTime)) {
          chainTriggered = true; // short-circuits => do NOT call Xge
        } else if (l?.eventCodeDescription === _ge) {
          chainTriggered = true; // do NOT call Xge
        } else if (i && i?.errorTitles?.includes(NO_POWER_UP)) {
          chainTriggered = true;
        } else if (s && s?.errorTitles?.includes(NO_POWER_UP)) {
          chainTriggered = true;
        } else {
          // All previous are false => call Xge
          Xge(e, s, NO_POWER_UP, "No Power-up Event Error");
        }

        // We do NOT do anything with chainTriggered after this,
        // because the original code doesn't. The expression is
        // just a side effect.
      } else {
        // If bigCondition is FALSE => call Xge(e, i, ...)
        Xge(e, i, NO_POWER_UP, "No Power-up Event Error");
      }

      // -- Step 2: Now replicate the "comma operator" portion:
      // preserving the original meaning: only if t[r+1] is truthy, we proceed.
      if (t[r + 1]) {
        // Filter events that start after timeItem.time and before t[r+1].time
        const c = e.filter((ev) => {
          return (
            dayjs(ev.dateTime).isAfter(timeItem.time) &&
            dayjs(ev.dateTime).isBefore(t[r + 1].time)
          );
        });

        // Find the first event in 'c' that has eventCodeDescription === Tge
        const u = c.find((ev) => ev.eventCodeDescription === Tge);

        // Find the last event in 'c' whose eventCodeDescription is NOT in Nge
        const d = findLast(c, (ev) => !Nge.includes(ev.eventCodeDescription));

        // If we found no Tge event but we do have a 'd', 
        // => "No Shut-Down Event" error
        if (!u && d) {
          Xge(e, d, NO_SHUT_DOWN, "No Shut-Down Event Error");
        }
      }
    } // END if (a && a.length)
  }); // END forEach
}

export { processEventsPowerUpShutDown };
