import dayjs, { Dayjs } from "dayjs";
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

// let defaultTimezoneId = localStorage.getItem('carrier_timezoneid') || dayjs.tz.guess();
const getInitialTimeZone = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('carrier_timezoneid') || dayjs.tz.guess();
  }
  return dayjs.tz.guess();
};

let defaultTimezoneId = getInitialTimeZone();
export function useTimeZoneHelper() {
  const setDefaultTimeZoneId = (newTimeZoneId: string) => {
    if (!newTimeZoneId || !newTimeZoneId.trim()) return;
    defaultTimezoneId = newTimeZoneId;
  };

  const getDefaultTimeZoneId = () => {
    return defaultTimezoneId;
  }

  const acceptAsTimeZone = (date: string | Dayjs, timeZoneId: string = defaultTimezoneId) => {
    if (dayjs.isDayjs(date)) {
      return date.tz(timeZoneId, true);
    }
    return dayjs(date).tz(timeZoneId, true);
  };

  const convertToTimeZone = (date?: string | Dayjs | null, timezoneId: string = defaultTimezoneId) => {
    if (!date) {
      return dayjs().tz(timezoneId);
    }
    const dateString = typeof date === "string" ? date : dayjs(date).tz(timezoneId).format();
    return dayjs(dateString).tz(timezoneId);
  };

  const convertToUTC = (date: string | Dayjs, timeZoneId: string = defaultTimezoneId) => {
    const dateString = typeof date === "string" ? date : dayjs(date).tz(timeZoneId).format();
    return convertToTimeZone(dateString, timeZoneId).utc();
  };

  const formatToTimeZone = (date: string | Dayjs | null, timeZoneId: string = defaultTimezoneId, formatType: string = "") => {
    return convertToTimeZone(date, timeZoneId).format(formatType);
  };

  const formatToUTC = (date: string | Dayjs, timeZoneId: string = defaultTimezoneId, formatType: string = "") => {
    return convertToUTC(date, timeZoneId).format(formatType);
  };

  const getStartOf = (date?: Dayjs | string | null, timeZoneId: string = defaultTimezoneId) => {
    if (!date) {
      return dayjs().tz(timeZoneId).startOf('day');
    }
    return dayjs(date).tz(timeZoneId).startOf('day');
  };

  const getEndOf = (date?: string | Dayjs | null, timeZoneId: string = defaultTimezoneId) => {
    if (!date) {
      return dayjs().tz(timeZoneId).endOf('day');
    }
    const currentDate = dayjs().tz(timeZoneId);
    const dateInDayjs = dayjs.isDayjs(date) ? date.tz(timeZoneId).endOf('day') : dayjs(date).tz(timeZoneId).endOf('day');
    if (dateInDayjs.format('YYYY-MM-DD') === currentDate.format('YYYY-MM-DD')) {
      return currentDate;
    }
    return dateInDayjs;
  };

  const formatTimeDynamic = (seconds:number) => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(seconds / 31536000);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
};

  return { acceptAsTimeZone, formatToTimeZone, convertToTimeZone, formatToUTC, convertToUTC, getStartOf, getEndOf, setDefaultTimeZoneId, getDefaultTimeZoneId, formatTimeDynamic };
}

const getAbbreviation = (words: string) => {
  return words.trim().split(" ").map(word => word[0]).join("");
};

export const getTimeZoneShortNameObject = (timeZone: TimeZoneResponse) => {
  if (timeZone.shortName) {
    return {
      id: timeZone.id,
      shortName: timeZone.shortName
    }
  }
  if (timeZone.daylightName) {
    return {
      id: timeZone.id,
      shortName: getAbbreviation(timeZone.daylightName),
    };
  }
  if (timeZone.displayName) {
    const words = timeZone.displayName.trim().split(" ").slice(1, -1);
    return {
      id: timeZone.id,
      shortName: getAbbreviation(words.join(" ")),
    };
  }
  return {
    id: timeZone.id,
    shortName: "",
  };
};