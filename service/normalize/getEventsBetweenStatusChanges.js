import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export function getEventsBetweenStatusChanges(events, previousChange, currentChange) {
  return events.filter(event =>
    dayjs(previousChange.dateTime).isSameOrBefore(dayjs(event.dateTime)) &&
    dayjs(currentChange.dateTime).isSameOrAfter(dayjs(event.dateTime))
  );
}