import dayjs from 'dayjs';

export function isSameDateTime(event1, event2) {
	return dayjs(dayjs(event1.dateTime).format('YYYY-MM-DDTHH:mm:ss.SSS')).isSame(dayjs(event2.dateTime).format('YYYY-MM-DDTHH:mm:ss.SSS'));
}
