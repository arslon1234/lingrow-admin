// importing packages
import dayjs from 'dayjs';

// importing helpers
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
function processEntriesIntermediateMissing(entries) {

  // Step 1: Filter entries with "DS_D" status
  const dsDEntries = entries.filter(entry => isDrivingEvent(entry));

  // Step 2: Check for incorrect placement and missing intermediate entries
  entries.forEach((currentEntry, index) => {
    const previousEntries = entries.slice(0, index);
    const lastValidEntry = previousEntries.reverse().find(entry => !NON_ELIGIBLE_STATUSES.includes(entry?.eventCodeDescription));

    if (
      entries[index - 1] &&
      isIntermediateEvent(currentEntry) &&
      !isDrivingorIntermediateEvent(lastValidEntry)
    ) {
      console.log("Intermediate missing", currentEntry, lastValidEntry);
      logIntermediateError(entries, currentEntry, "Intermediate Missing", "Intermediate Incorrect Placement Error");
    }
  });

  // Step 3: Further checks on filtered entries
  dsDEntries.forEach(filteredEntry => {
    const filteredIndex = entries.findIndex(entry => dayjs(entry.dateTime).isSame(filteredEntry.dateTime));
    const remainingEntries = entries.slice(filteredIndex + 1);

    const nextValidEntry = remainingEntries.find(entry => !NON_ELIGIBLE_STATUSES.includes(entry.eventCodeDescription));
    if (nextValidEntry) {
      const nextValidIndex = entries.findIndex(entry => dayjs(entry.dateTime).isSame(nextValidEntry.dateTime));
      const intermediateEntries = entries.slice(filteredIndex, nextValidIndex + 1)
        .filter(entry => !NON_ELIGIBLE_STATUSES.includes(entry.eventCodeDescription));

      intermediateEntries.forEach((entry, i) => {
        if (i > 0) {
          const timeDifference = dayjs(entry.dateTime).diff(dayjs(intermediateEntries[i - 1].dateTime), 'minutes');
          if (Math.round(timeDifference) > 60) {
            logIntermediateError(entries, entry, "Intermediate error", "Intermediate Missing Error");
          }
        }
      });
    }
  });

  console.log(errorCount + " old error count");
}

export { processEntriesIntermediateMissing };
