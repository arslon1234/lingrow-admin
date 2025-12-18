import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.hook('app:created', () => {

    // dayjs
		dayjs.extend(utc);
		dayjs.extend(timezone);
		dayjs.extend(duration);
	});
});
