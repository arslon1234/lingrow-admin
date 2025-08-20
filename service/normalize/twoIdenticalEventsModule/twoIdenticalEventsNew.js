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
let errorCountNew = 0;

// Function to check if an event should be flagged with "Two Identical Events Error"
const shouldFlagTwoIdenticalEvents = (event) => {
	// Check if the event already has the error
	if (event?.errorTitles) {
		for (let i = 0; i < event.errorTitles.length; i++) {
			if (event.errorTitles[i] === 'Two Identical Events') {
				return false;
			}
		}
	}

	// Use a switch statement for faster status checking
	switch (event.eventCodeDescription) {
		case EventStatuses.ENG_UP_NORMAL:
		case EventStatuses.ENG_DOWN_NORMAL:
		case EventStatuses.DR_LOGIN:
		case EventStatuses.DR_LOGOUT:
			return true;
		default:
			return false;
	}
};

// Function to flag consecutive identical events
const flagConsecutiveIdenticalEvents = (events) => {
	// Build one Set once
	const excluded = new Set([
		'INTER_NORMAL_PRECISION',
		'INTER_REDUCED_PERCISION',
		...CertificationStatuses
	]);

	// Assume you still want to use the existing, outer-scope errorCount:
	// don’t re-declare it here!
	let prevDesc = null;

	// Start at 1 since there is no previous for index 0
	for (let i = 1; i < events.length; i++) {
		const current = events[i];
		const desc    = current.eventCodeDescription;

		if (
			desc === prevDesc &&          // consecutive identical
			!excluded.has(desc)           // not in your exclude list
		) {
			addErrorMessage(current,
				'Two Identical Events',
				'Two Identical Events Error'
			);
			errorCountNew++;                 // increments your outer errorCount
		}

		// Always set prevDesc to this one (even if it was excluded)
		prevDesc = desc;
	}

	return events;
};


// Function to process events and flag duplicates based on counts
const processEventCounts = (events) => {
	// Create a Set for faster lookups
	const certificationStatusesSet = new Set(CertificationStatuses);

	// Early mapping of statuses to avoid repeated comparisons
	const statusMap = {
		[EventStatuses.ENG_UP_NORMAL]: 'ENG_UP_COUNT',
		[EventStatuses.ENG_DOWN_NORMAL]: 'ENG_DOWN_COUNT',
		[EventStatuses.DR_LOGIN]: 'LOGIN_COUNT',
		[EventStatuses.DR_LOGOUT]: 'LOGOUT_COUNT'
	};

	// Initialize counters
	const counters = {
		ENG_UP_COUNT: 0,
		ENG_DOWN_COUNT: 0,
		LOGIN_COUNT: 0,
		LOGOUT_COUNT: 0
	};

	// Define opposing counter pairs for reset logic
	const opposites = {
		ENG_UP_COUNT: 'ENG_DOWN_COUNT',
		ENG_DOWN_COUNT: 'ENG_UP_COUNT',
		LOGIN_COUNT: 'LOGOUT_COUNT',
		LOGOUT_COUNT: 'LOGIN_COUNT'
	};

	// Process events in a single pass
	for (let i = 0; i < events.length; i++) {
		const currentEvent = events[i];
		const { eventCodeDescription, dateTime } = currentEvent;

		// Skip certification statuses
		if (certificationStatusesSet.has(eventCodeDescription)) {
			continue;
		}

		// Check if this is a tracked status
		const counterKey = statusMap[eventCodeDescription];
		if (counterKey) {
			// Reset opposite counter if needed
			if (counters[opposites[counterKey]] > 0) {
				counters[opposites[counterKey]] = 0;
			}

			// Increment the counter
			counters[counterKey] += 1;

			// Match original logic: check for duplicate counts on any of the three conditions
			if (counters.ENG_UP_COUNT > 1 || counters.ENG_DOWN_COUNT > 1 || counters.LOGIN_COUNT > 1) {
				// Use findIndex like the original to check ALL events
				const duplicateIndex = events.findIndex(
					(event) => dayjs(event.dateTime).isSame(dateTime) &&
						event.eventCodeDescription === eventCodeDescription
				);

				if (duplicateIndex !== -1 && shouldFlagTwoIdenticalEvents(events[duplicateIndex])) {
					const duplicateEvent = events[duplicateIndex];
					addErrorMessage(duplicateEvent, 'Two Identical Events', 'Two Identical Events Error');
					// Use the same counter variable as the original
					errorCountNew++;
				}
			}
		}
	}

	return events;
};

const processEventsTwoIdenticalNew = (events) => {
	// First pass: Flag consecutive identical events
	let updatedEvents = flagConsecutiveIdenticalEvents(events);

	// Second pass: Process counts and flag duplicates
	updatedEvents = processEventCounts(updatedEvents);

	console.log("errors new", errorCountNew);
	//return updatedEvents;
	return updatedEvents;
};

export { processEventsTwoIdenticalNew };
