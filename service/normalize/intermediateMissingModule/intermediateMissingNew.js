// importing packages
import dayjs from 'dayjs';

// importing helpers
import { isDrivingEvent, isDrivingorIntermediateEvent, isIntermediateEvent } from '@/utils/events';
import { addErrorMessage } from '../addMessage';
// Constants for status filtering
const NON_ELIGIBLE_STATUSES = [
  "DR_CERT_1", "DR_CERT_2", "DR_CERT_3",
  "DR_CERT_4", "DR_CERT_5", "DR_CERT_6",
  "DR_CERT_7", "DR_CERT_8", "DR_CERT_9"
];

const SPECIAL_STATUSES = ["INTER_NORMAL_PRECISION", "INTER_REDUCED_PERCISION"];
let errorCount = 0;
// Function to log errors for intermediate issues
function logIntermediateError(events, currentEvent, errorTitle, errorMessage) {
  events.forEach(event => {
    if (dayjs(event.dateTime).isSame(currentEvent.dateTime)) {
      addErrorMessage(event, errorTitle, errorMessage);
      errorCount++;
    }
  });
}

// Main processing function
function processEntriesIntermediateMissingNew(entries) {
  errorCount = 0;

  // Pre-filter entries by status types (single pass)
  const validEntries = [];

  entries.forEach(entry => {
    if (!NON_ELIGIBLE_STATUSES.includes(entry.eventCodeDescription)) {
      validEntries.push(entry);
    }
  });

  // Sort valid entries by dateTime once
  validEntries.sort((a, b) => dayjs(a.dateTime).diff(dayjs(b.dateTime)));

  // Step 2: Check for incorrect placement
  for (let i = 1; i < validEntries.length; i++) {
    const currentEntry = validEntries[i];
    const previousEntry = validEntries[i-1];

    if (isIntermediateEvent(currentEntry) &&
      !isDrivingorIntermediateEvent(previousEntry)) {
      logIntermediateError(entries, currentEntry, "Intermediate Missing", "Intermediate Incorrect Placement Error");
    }
  }

  // Step 3: Check for missing intermediates after DS_D entries
  for (let i = 0; i < validEntries.length; i++) {
    if (isDrivingEvent(validEntries[i])) {
      // Find next valid entry after this DS_D
      const nextValidEntry = validEntries[i + 1];
      if (nextValidEntry) {
        // Check for time gap
        const timeDifference = dayjs(nextValidEntry.dateTime).diff(dayjs(validEntries[i].dateTime), 'minutes');
        if (Math.round(timeDifference) > 60) {
          logIntermediateError(entries, nextValidEntry, isIntermediateEvent(nextValidEntry) ? "Intermediate difference error" : "Intermediate missing", "Intermediate Missing Error");
        }
      }
    }
  }

  console.log(errorCount + " new error count");
}

export { processEntriesIntermediateMissingNew };
