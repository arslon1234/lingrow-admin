// Will store a simplified record of errors

// importing packages
import dayjs from 'dayjs';

// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';
import { addErrorMessage } from "../addMessage";
import { generateDateRange } from "../generateDateRange";

// destructuring
const { acceptAsTimeZone, getStartOf, formatToUTC, getEndOf } = useTimeZoneHelper();

const CERT_EVENT_PREFIX = 'DR_CERT_';

function collectCertificationErrorsNew(events) {
	// 1. Filter to only certification events
	const certEvents = events.filter((event) => event.eventCodeDescription.startsWith(CERT_EVENT_PREFIX));

	// 2. Sort by certifiedDate, then by certification number
	certEvents.sort((a, b) => {
		if (!a.certifiedDate || !b.certifiedDate || !a.certifiedDate.length || !b.certifiedDate.length || !dayjs(a.certifiedDate).isValid() || !dayjs(b.certifiedDate).isValid()) {
			// If same date, sort by numeric suffix: DR_CERT_x
			const numA = parseInt(a.eventCodeDescription.split('_')[2], 10);
			const numB = parseInt(b.eventCodeDescription.split('_')[2], 10);

			return numA - numB;
		}

		const dateA = getStartOf(acceptAsTimeZone(a.certifiedDate));
		const dateB = getStartOf(acceptAsTimeZone(b.certifiedDate));

		if (dateA.isBefore(dateB)) return -1;
		if (dateA.isAfter(dateB)) return 1;

		// If same date, sort by numeric suffix: DR_CERT_x
		const numA = parseInt(a.eventCodeDescription.split('_')[2], 10);
		const numB = parseInt(b.eventCodeDescription.split('_')[2], 10);
		return numA - numB;
	});

	// certificate event missing errors
	collectCertificationMissing(events, certEvents);

	let errorCount = 0;
	// 3. Walk through each certification event in sorted order
	certEvents.forEach((currentEvent, index) => {
		const currentCertNumber = parseInt(currentEvent.eventCodeDescription.split('_')[2], 10);
		const currentCertDate = getStartOf(acceptAsTimeZone(currentEvent.certifiedDate));

		const startDateFormatted = acceptAsTimeZone(currentEvent.dateTime);
		const certDateFormatted = acceptAsTimeZone(currentEvent.certifiedDate);

		let msg = "";
		if (index > 0) {
			// Compare to the previous event
			const previousEvent = certEvents[index - 1];
			const previousCertNumber = parseInt(previousEvent.eventCodeDescription.split('_')[2], 10);
			const previousCertDate = getStartOf(acceptAsTimeZone(previousEvent.certifiedDate));

			if (currentCertDate.isSame(previousCertDate)) {
				// === Same date ===
				// If the current number is *less* than the previous => "Incorrect"
				if (currentCertNumber < previousCertNumber) {
					addErrorMessage(currentEvent, 'Incorrect Certification Order');
					msg = 'Incorrect Certification Order';
				} else if (currentCertNumber === previousCertNumber) {
					addErrorMessage(currentEvent, 'Duplicate Certification Orders');
					msg = 'Duplicate Certification Orders';
				} else if (currentCertNumber - previousCertNumber > 1) {
					addErrorMessage(currentEvent, 'Certification Order Missing');
					msg = 'Certification Order Missing';
				}
			} else {
				// === New date ===
				// The first cert on a *new* date must be DR_CERT_1.
				if (currentCertNumber !== 1) {
					addErrorMessage(currentEvent, 'Incorrect Certification Order', 'Certification Order Missing');
					msg = 'Incorrect Certification Order'; 
				}
			}
		} else {
			// === The very first cert event ===
			// Must also be DR_CERT_1; if not => "Incorrect Certification Order."
			if (currentCertNumber !== 1) {
				addErrorMessage(currentEvent, 'Incorrect Certification Order', 'Certification Order Missing');
				msg = 'Incorrect Certification Order';
			}
		}
		if (msg) {
			// console.log(msg);
			errorCount++;
		}

		if (startDateFormatted.isBefore(certDateFormatted, 'day') || currentEvent?.errorTitles?.includes('Incorrect Certification Date')) {
			addErrorMessage(currentEvent, 'Incorrect Certification Date');
			msg = 'Incorrect Certification Date';
			// console.log(msg);
			errorCount++;
		}
	});

	console.log("Error count", errorCount);

}

const MOMENT_FORMAT = "YYYY-MM-DDTHH:mm:ss";
function convertToTimeStamp(dateTime) {
    return dateTime ? dayjs(dateTime).format(MOMENT_FORMAT) : "nullish";
}

/**
 * Observe all certified events and checks for days in which events were not certified
 */
function collectCertificationMissing(events, certEvents) {
	let minMoment = null;
	let maxMoment = null;

	events.forEach((ev) => {
		// parse in the specified timezone
		const m = getStartOf(acceptAsTimeZone(ev.dateTime)); // ev.dateTime;

		// Min
		if (!minMoment || m.isBefore(minMoment)) {
			minMoment = m.clone();
		}
		// Max
		if (!maxMoment || m.isAfter(maxMoment)) {
			maxMoment = m.clone();
		}
	});

	// If for some reason no valid dates, just return
	if (!minMoment || !maxMoment) {
		return;
	}

	// We'll generate the date range from earliest to latest "dateTime"
	const minDateStr = minMoment.format('YYYY-MM-DD');
	const maxDateStr = maxMoment.format('YYYY-MM-DD');
	const allDates = generateDateRange(minDateStr, maxDateStr);

	const eventsIndByCertifiedDate = new Map();
	const uniqEventsByDate = [];
	events.forEach((ev, ind) => {
		const key = convertToTimeStamp(ev.certifiedDate);
		if (!eventsIndByCertifiedDate.has(key)) {
			eventsIndByCertifiedDate.set(key, ind);
			uniqEventsByDate.push(ev);
		}
	});
	const eventsMap = {};

	const uniqEventsByDateSet = new Set(uniqEventsByDate.map(ev => convertToTimeStamp(ev.certifiedDate)));  

	const nonCertItems = events.filter((ev) => !ev.eventCodeDescription.startsWith('DR_CERT'));
	nonCertItems.reverse();

	// console.log("Non certified events");
	// nonCertItems.forEach(ev => console.log(ev.dateTime, ev.eventCodeDescription, ev.id));

	allDates.forEach((date) => {
		const formattedEndDate = formatToUTC(getEndOf(acceptAsTimeZone(date))) //.tz(timezone);

		while (nonCertItems.length > 0 && convertToTimeStamp(date) <= convertToTimeStamp(nonCertItems.at(-1).dateTime)) {
			nonCertItems.pop();
		}

		// Check if the date exists in the "uniqEventsByDate" array
		// if (!uniqEventsByDate.some((item) => dayjs(item.certifiedDate).isSame(date))) {
		if (uniqEventsByDateSet.has(convertToTimeStamp(date))) {
			// Find the event that starts after the formattedEndDate
			// const event = nonCertItems.find((item) => dayjs(item.dateTime).isAfter(formattedEndDate));
			const event = nonCertItems?.at(-1) ?? null;
			if (event) {
				// Update the map with the event date
				if (eventsMap[event.dateTime]) {
					eventsMap[event.dateTime].push(date);
				} else {
					eventsMap[event.dateTime] = [date];
				}
			}
		}
	});


	const eventsGroupMapByDate = new Map();
	events.forEach(ev => {
		const key = convertToTimeStamp(ev.dateTime);	
		const prevList = eventsGroupMapByDate.get(key) ?? [];
		prevList.push(ev);
		eventsGroupMapByDate.set(key, prevList);
	});

	// Process and update events with missing certification events
	if (Object.keys(eventsMap).length > 0) {
		const processEvent = (startDate) => {
			const key = convertToTimeStamp(startDate);
			const list = eventsGroupMapByDate.get(key) ?? []; 
			const missingDates = eventsMap[startDate].map((date) => formatTime(date, 'MM-DD-YYYY')).join(", ");
			list.forEach(ev => {
				addErrorMessage(ev, `Certification event for this dates (${missingDates}) is missing`);
			});
			// events.forEach((ev) => {
			// 	if (dayjs(ev.dateTime).isSame(startDate)) {
			// 		const missingDates = eventsMap[startDate].map((date) => formatTime(date, 'MM-DD-YYYY'));
			// 		addErrorMessage(ev, `Certification event for this dates (${missingDates.join(', ')}) is missing`);
			// 	}
			// });
		};

		// Process each event date in the map
		Object.keys(eventsMap).forEach(processEvent);
	}
}

export {
	collectCertificationErrorsNew
};
