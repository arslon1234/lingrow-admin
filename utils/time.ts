import dayjs, { Dayjs } from "dayjs";

const hosTimeRemainder: HosTimeRemainder = {
	breakDuration: 28800,
	drivingDuration: 39600,
	shiftDuration: 50400,
	cycleDuration: 252000
}

function add(date: Dayjs, num: number, measure: "week" | "day" | "hour" | "minute" | "second") {
	return date.add(num, measure);
}

function subtract(date: Dayjs, num: number, measure: "week" | "day" | "hour" | "minute" | "second") {
	return date.subtract(num, measure);
}

function fixDateFormat(dateString: string) {
	return dateString.trim().replace(' ', '+').replace('\n', '').replace('\t', '');
};

function formatTime(dateTime: Dayjs | Date | string, format: string) {
	if (!dayjs.isDayjs(dateTime)) {
		return dayjs(dateTime).format(format); 
	}
	return dateTime.format(format);
}

function compareDates(date1: Dayjs | Date, date2: Dayjs | Date) {
	return formatTime(date1, 'YYYY-MM-DD') === formatTime(date2, 'YYYY-MM-DD');
}

// Converts pixels to seconds
const convertPixelstoSeconds = (screenResolution: number, pixels: number): number => {
	return (pixels * 86400) / screenResolution;
};

// Converts seconds to pixels
const convertSecondsToPixels = (screenResolution: number, seconds: number): number => {
	return (seconds * screenResolution) / 86400;
};

// convert hh:mm:ss to timestamp (seconds)
function convertToSeconds(dateTime: string) {
	const [h, m, s] = dateTime.split(':').map(Number);
	return h * 3600 + m * 60 + s;
}

function formatDuration(duration: number, show: Boolean = false): string {
	let h: number = Math.floor(duration / 3600);
	let m: number = Math.floor((duration % 3600) / 60);
	let s: number = Math.floor((duration % 3600) % 60);

	m += +(s >= 60);
	h += +(m >= 60);
	m %= 60;
	let displayTime: string = '';
	if (h) {
		displayTime += h.toString() + 'h';
	}
	if (h && m || h && s) displayTime += ' ';
	if (m) {
		displayTime += m.toString() + 'm';
	}
	if (m && s && show) displayTime += ' ';
	if (s && show) {
		displayTime += s.toString() + 's';
	}

	if (duration === 0) {
		displayTime += '0s';
	}
	return displayTime;
};

function fixDatetimeFormat(dateTime: string) {
	let [hh, mm, ss] = dateTime.split(':').map(Number);
	if (hh >= 24) hh = 23;
	if (mm >= 60) mm = 59;
	if (ss >= 60) ss = 59;
	console.log("formatted", `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`);
	return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
}

function getDateStringSeconds(dateTime: string) {
	return new Date(dateTime).getTime() / 1000;
} 

export { add, compareDates, convertPixelstoSeconds, convertSecondsToPixels, convertToSeconds, fixDateFormat, fixDatetimeFormat, formatDuration, formatTime, getDateStringSeconds, hosTimeRemainder, subtract };

