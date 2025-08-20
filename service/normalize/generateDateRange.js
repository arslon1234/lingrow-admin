// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

// destructuring
const { acceptAsTimeZone, getStartOf } = useTimeZoneHelper();

export function generateDateRange(startDateStr, endDateStr) {
	// Parse the start/end in the desired timezone,
	// then move each to .startOf('day')
	const start = getStartOf(acceptAsTimeZone(startDateStr));
	const end = getStartOf(acceptAsTimeZone(endDateStr));

	const dates = [];
	const diffDays = end.diff(start, 'days');

	for (let i = 0; i <= diffDays; i++) {
		dates.push(start.add(i, 'days').format('YYYY-MM-DD'));
	}
	return dates;
}