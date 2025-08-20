// Odometer missing, Odometer is less than the previous status, Odometer didn't change after driving
// The method checked and confirmed to be working as expected

// importing packages
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';
import { addErrorMessage } from '../addMessage';
import {isDrivingorIntermediateEvent} from '@/utils/events'
const { acceptAsTimeZone } = useTimeZoneHelper();

const UNRELIABLE_STATUSES = ['DR_CERT_1', 'DR_CERT_2', 'DR_CERT_3', 'DR_CERT_4', 'DR_CERT_5', 'DR_CERT_6', 'DR_CERT_7', 'DR_CERT_8', 'DR_CERT_9'];
const SUSPICIOUS_STATUSES = ['INTER_NORMAL_PRECISION', 'INTER_REDUCED_PERCISION'];

function checkOdometerErrors(events) {
	if (!events || !Array.isArray(events)) {
		console.error('Invalid input: events must be an array.');
		return [];
	}

	events.forEach((event, index) => {
		if (!event || typeof event !== 'object') {
			console.warn(`Invalid event at index ${index}: Skipping.`);
			return;
		}

		if (UNRELIABLE_STATUSES.includes(event.eventCodeDescription)) {
			return;
		}

		const previousEvent = events[index - 1];

		// ✅ Check for odometer decrease
		if (previousEvent && typeof previousEvent === 'object' && !UNRELIABLE_STATUSES.includes(previousEvent.eventCodeDescription)) {
			const currentOdometer = Number(event.totalVehicleMiles);
			const previousOdometer = Number(previousEvent.totalVehicleMiles);

			if (!isNaN(currentOdometer) && !isNaN(previousOdometer) && currentOdometer < previousOdometer) {
				addErrorMessage(event, 'Odometer is less than the previous status');
			}

			// if (!event.odometer) {
			//     addErrorMessage(event, "Odometer missing");
			// }
		}

		// ✅ Check for missing odometer (moved outside of previous event check)
		if (previousEvent && typeof previousEvent === 'object' && !event.totalVehicleMiles && !UNRELIABLE_STATUSES.includes(event.eventCodeDescription)) {
			addErrorMessage(event, 'Odometer missing');
		}

		// ✅ Check for odometer not changing after driving
		const previousValidEvent = events.slice(0, index).findLast((event) => !UNRELIABLE_STATUSES.includes(event.eventCodeDescription)) || null;
		if (previousValidEvent) {
			const durationInMinutes = dayjs.duration(acceptAsTimeZone(previousValidEvent.dateTime).diff(acceptAsTimeZone(event.dateTime))).asMinutes();

			if (previousValidEvent.totalVehicleMiles === event.totalVehicleMiles && durationInMinutes > 5 && ['DS_D', ...SUSPICIOUS_STATUSES].includes(event.eventCodeDescription)) {
				addErrorMessage(event, "Odometer didn't change after driving");
			} 
			// When prev is not driving event (driving or intermediate)
			// current event is driving event 
			// current event and prev event odometers should be equal
			else if (
				!isDrivingorIntermediateEvent(previousValidEvent) && 
				isDrivingorIntermediateEvent(event) &&
				previousValidEvent.totalVehicleMiles != event.totalVehicleMiles 
			) {
				addErrorMessage(event, "Odometer changed");	
			}
		}
	});
}

export { checkOdometerErrors };
