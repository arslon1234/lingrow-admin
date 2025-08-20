import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export function calculateDurationBetweenEvents(event1, event2) {
	if (event1?.dateTime && event2?.dateTime) {
		const startDate1 = dayjs(event1.dateTime);
		const startDate2 = dayjs(event2.dateTime);
		return Math.abs(Math.round(dayjs.duration(startDate1.diff(startDate2)).asMinutes()));
	}
	return 0;
}
