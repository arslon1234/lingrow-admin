// importing packages
import dayjs, { Dayjs } from 'dayjs';

// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

// improrting stores
import { useTrackingsStore } from '~/store/tracking';
import { useDriverLogs } from '~/store/driverLogs';

export const useOverviewId = async () => {
	// route
	const route = useRoute();

	// time zone helpers
	const { formatToUTC, convertToTimeZone, getStartOf, getEndOf } = useTimeZoneHelper();

	// date settings
	const headerDate = ref<[Dayjs, Dayjs]>([convertToTimeZone(subtract(dayjs(), 1, 'day')), convertToTimeZone(dayjs())]);
	const currentAbortController = ref<AbortController | null>(null);

	const updateHeaderDate = async (date: Array<Dayjs>) => {
		if (currentAbortController.value) {
			currentAbortController.value.abort();
		}
		
		headerDate.value = [getStartOf(date[0]), getEndOf(date[1])];
		await getTrackings();
	};
	// stores
	const trackingsStore = useTrackingsStore();
	const driverLogsStore = useDriverLogs();
	// destructuring stores
	const { dailyTrackings, everyTrackings, trackingTooltips } = storeToRefs(trackingsStore);

	const getTrackings = async () => {
		const model: DriverLogsDailyEventsRequest = {
			driverId: route.params.id as string,
			startDate: formatToUTC(getStartOf(headerDate.value[0])),
			endDate: formatToUTC(getEndOf(headerDate.value[1]))
		};
		await trackingsStore.getDriverDailyTrackings(model);
		await trackingsStore.getDriverEveryTrackings(model);

		if (dailyTrackings.value) {
			dailyTrackings.value.trackingEventResponse = dailyTrackings.value.trackingEventResponse.filter((tracking) => tracking.latitude && tracking.longitude);
			dailyTrackings.value.trackingEventResponse.forEach((tracking) => {
				trackingTooltips.value[tracking.eventId as string] = false;
			});
		}

		if (everyTrackings.value) {
			everyTrackings.value = everyTrackings.value.filter((tracking) => tracking.latitude && tracking.longitude);
		}
	};
	
	// selected event
	const selectedTrackingEvents = ref<EveryTrackingResponse[]>([]);
	const selectedEvent = ref<TrackingResponse | null>(null);
	const selectEvent: (event: TrackingResponse) => void = (event) => {
		if (selectedEvent.value?.eventId === event.eventId) selectedEvent.value = null;
		else selectedEvent.value = event;

		if (selectedEvent.value && selectedEvent.value?.eventCode === 3 && selectedEvent.value.eventType === 1) {
			selectedTrackingEvents.value = everyTrackings.value.filter((tracking) => {
				const eventTime = tracking.currentTime;
				const startTime = selectedEvent.value?.startTime;
				const endTime = selectedEvent.value?.endTime;

				return (dayjs(eventTime).isAfter(startTime) || dayjs(eventTime).isSame(startTime)) && (dayjs(eventTime).isBefore(endTime) || dayjs(eventTime).isSame(endTime));
			});
		} else {
			Object.keys(trackingTooltips.value).forEach(key => trackingTooltips.value[key] = false);
			trackingTooltips.value[selectedEvent.value?.eventId as string] = !trackingTooltips.value[selectedEvent.value?.eventId as string];
		}
	};

	onMounted(async () => {
		await Promise.allSettled([getTrackings()]);
	});

	return {
		headerDate,
		updateHeaderDate,
		dailyTrackings,
		everyTrackings,
		trackingTooltips,
		selectEvent,
		selectedEvent,
		selectedTrackingEvents
	};
};
