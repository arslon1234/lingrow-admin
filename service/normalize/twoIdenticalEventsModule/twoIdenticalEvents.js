// Two identical events error - fully corrected version

// importing packages
import dayjs from 'dayjs';

// importing helpers
import { addErrorMessage } from "../addMessage";

const EventStatuses = {
	NonDrivingEvents: ['DS_ON', 'DS_OFF', 'DS_SB', 'DR_IND_PC', 'DR_IND_YM'],
	MainDrivingEvents: ['DS_ON', 'DS_OFF', 'DS_SB', 'DR_IND_PC', 'DR_IND_YM', 'DS_D'],
	ENG_UP_NORMAL: 'ENG_UP_NORMAL',
	ENG_DOWN_NORMAL: 'ENG_DOWN_NORMAL',
	DR_LOGIN: 'DR_LOGIN',
	DR_LOGOUT: 'DR_LOGOUT'
};

// Array of certification statuses to exclude
const CertificationStatuses = ['DR_CERT_1', 'DR_CERT_2', 'DR_CERT_3', 'DR_CERT_4', 'DR_CERT_5', 'DR_CERT_6', 'DR_CERT_7', 'DR_CERT_8', 'DR_CERT_9'];
let errorCount = 0;

// Function to check if an event should be flagged with "Two Identical Events Error"
const shouldFlagTwoIdenticalEvents = (event) => {
	const hasError = event?.errorTitles?.includes('Two Identical Events');
	const isRelevantStatus =
		event.eventCodeDescription === EventStatuses.ENG_UP_NORMAL ||
		event.eventCodeDescription === EventStatuses.ENG_DOWN_NORMAL ||
		event.eventCodeDescription === EventStatuses.DR_LOGIN ||
		event.eventCodeDescription === EventStatuses.DR_LOGOUT;

	return !hasError && isRelevantStatus;
};

// Function to flag consecutive identical events
const flagConsecutiveIdenticalEvents = (events) => {
	const excludedStatuses = ['INTER_NORMAL_PRECISION', 'INTER_REDUCED_PERCISION', ...CertificationStatuses];

	return events.map((currentEvent, index) => {
		const previousEvent = events[index - 1];

		if (previousEvent && !excludedStatuses.includes(currentEvent.eventCodeDescription) && currentEvent.eventCodeDescription === previousEvent.eventCodeDescription) {
      addErrorMessage(currentEvent, 'Two Identical Events', 'Two Identical Events Error');
			errorCount++;
		}

		return currentEvent;
	});
};

// Function to process events and flag duplicates based on counts
const processEventCounts = (events) => {
	// Exclude certification statuses
	const filteredEvents = events.filter((event) => !CertificationStatuses.includes(event.eventCodeDescription));

	// Initialize counters
	const counters = {
		ENG_UP_COUNT: 0,
		ENG_DOWN_COUNT: 0,
		LOGIN_COUNT: 0,
		LOGOUT_COUNT: 0
	};

	filteredEvents.forEach((currentEvent) => {
		// Update ENG_UP_COUNT and ENG_DOWN_COUNT
		if (currentEvent.eventCodeDescription === EventStatuses.ENG_UP_NORMAL) {
			if (counters.ENG_DOWN_COUNT > 0) counters.ENG_DOWN_COUNT = 0;
			counters.ENG_UP_COUNT += 1;
		} else if (currentEvent.eventCodeDescription === EventStatuses.ENG_DOWN_NORMAL) {
			if (counters.ENG_UP_COUNT > 0) counters.ENG_UP_COUNT = 0;
			counters.ENG_DOWN_COUNT += 1;
		}

		// Update LOGIN_COUNT and LOGOUT_COUNT
		if (currentEvent.eventCodeDescription === EventStatuses.DR_LOGIN) {
			if (counters.LOGOUT_COUNT > 0) counters.LOGOUT_COUNT = 0;
			counters.LOGIN_COUNT += 1;
		} else if (currentEvent.eventCodeDescription === EventStatuses.DR_LOGOUT) {
			if (counters.LOGIN_COUNT > 0) counters.LOGIN_COUNT = 0;
			counters.LOGOUT_COUNT += 1;
		}

		// Check for duplicate counts
		if (counters.ENG_UP_COUNT > 1 || counters.ENG_DOWN_COUNT > 1 || counters.LOGIN_COUNT > 1) {
			const duplicateIndex = events.findIndex((event) => dayjs(event.dateTime).isSame(currentEvent.dateTime) && event.eventCodeDescription === currentEvent.eventCodeDescription);

			if (duplicateIndex !== -1 && shouldFlagTwoIdenticalEvents(events[duplicateIndex])) {
				const duplicateEvent = events[duplicateIndex];
        addErrorMessage(duplicateEvent, 'Two Identical Events', 'Two Identical Events Error');
				errorCount++;
			}
		}
	});

	return events;
};

const processEventsTwoIdentical = (events) => {
	// First pass: Flag consecutive identical events
	let updatedEvents = flagConsecutiveIdenticalEvents(events);

	// Second pass: Process counts and flag duplicates
	updatedEvents = processEventCounts(updatedEvents);

	console.log("errors ", errorCount);
	//return updatedEvents;
	return updatedEvents;
};

export { processEventsTwoIdentical };
