import dayjs from 'dayjs';
import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { useTimeZoneHelper } from '~/helpers/timezone';
import { useTabsStore } from '~/store/tabs';
export const useBoostEventsStore = defineStore('boostEvents', () => {
	/** STORES **/
	const tabStore = useTabsStore();
	// destructuring stores
	const { tabs } = storeToRefs(tabStore);

	// store variables
	const boostEvents = shallowRef<BoostEventsResponse[]>();
	const boostEvent = ref<BoostEventResponse>();
	const boostGraph = ref<GraphResponse>();
	const pinTimes = shallowRef<ResetPinTimes[]>([]);
	const selectedMoveEvents = ref<{ [key: string]: GraphDuties[] }>({});
	const selectedMoveEventsDurations = ref<number[]>([]);
	const isMoveTimeEventsReversed = ref<boolean>(false);

	// loading
	const isBoostGraphLoading = ref<boolean>(false);
	const isBoostEventsLoading = ref<boolean>(false);

	// PROGRESS BAR EVENTS
	const totalEvents = ref<number>(0);
	const changedEventIdsSet = ref<Set<string>>(new Set<string>());
	const unchangedEventIds = ref<Set<string>>(new Set<string>());
	const submitsCount = ref<number>(0);
	// Persistent initial tab events set
	const INITIAL_TAB_EVENTS_KEY: string = 'initialTabEventsSet';
	const saved = localStorage.getItem(INITIAL_TAB_EVENTS_KEY);

	let parsed: unknown;

	try {
		parsed = saved ? JSON.parse(saved) : [];
	} catch (e) {
		parsed = [];
	}

	const initialTabEventsSet = ref<Set<string>>(Array.isArray(parsed) ? new Set<string>(parsed) : new Set<string>());

	// time zone helpers
	const { formatToUTC, getStartOf, getEndOf, acceptAsTimeZone } = useTimeZoneHelper();

	// *GET REQUESTS* //
	async function getLatestBoostEvents(driverId?: string | null) {
		let { fromDate, toDate } = dateRange();

		if (!driverId) return;
		if (!fromDate || !toDate) {
			fromDate = subtract(dayjs(), 1, 'day').format();
			toDate = dayjs().format();
		}

		const model: BoostEventRequest = {
			driverId,
			startDate: formatToUTC(getStartOf(acceptAsTimeZone(fixDateFormat(fromDate)))),
			endDate: formatToUTC(getEndOf(acceptAsTimeZone(fixDateFormat(toDate))))
		};

		const result = await useAxios().getRequest(ApiUrls.BOOST_EVENTS_LATEST_URL, model);

		if (result.status === 200) {
			boostEvents.value = result.data.successResult;
		}
	}

	async function getHistoryBoostEvents(model: { tabId: string; sessionId: string }, signal?: AbortSignal) {
		isBoostEventsLoading.value = true;
		const result = await useAxios().getRequest(ApiUrls.BOOST_EVENTS_HISTORY_URL, capitalizeKeys(model), {}, signal);

		if (result.status === 200) {
			boostEvents.value = result.data.successResult;
			if (tabs.value[0].id == model.tabId) {
				const newInitialSet = new Set<string>();
				boostEvents.value?.forEach((item: any) => {
					if (item.events.length > 0) {
						item?.events.forEach((ev: any) => {
							newInitialSet.add(ev.id);
						});
					}
				});
				initialTabEventsSet.value = newInitialSet;
				localStorage.setItem(INITIAL_TAB_EVENTS_KEY, JSON.stringify([...initialTabEventsSet.value]));
			}
			if (tabs.value?.at(-1)?.id == model.tabId) {
				totalEvents.value = 0;
				changedEventIdsSet.value.clear();
				boostEvents.value?.forEach((item: any) => {
					if (item.events.length > 0) {
						totalEvents.value += item?.events.length;
					}
					item.events.forEach((ev: any) => {
						if (!initialTabEventsSet.value.has(ev.id)) {
							changedEventIdsSet.value.add(ev.id);
						}
					});
				});
			}
			if (tabs.value.at(-1)?.type === 5) {
				submitsCount.value = totalEvents.value;
				console.log();
			}
		}
		isBoostEventsLoading.value = false;
	}

	async function getBoostEvent(eventId: string) {
		const result = await useAxios().getRequest(`${ApiUrls.BOOST_EVENTS_URL}/${eventId}`);

		if (result.status === 200) {
			boostEvent.value = result.data.successResult;
		}
	}

	async function getLatestBoostGraph(driverId?: string | null, screenResolution: number = 1728) {
		let { fromDate, toDate } = dateRange();

		if (!driverId) return;
		if (!fromDate || !toDate) {
			fromDate = subtract(dayjs(), 1, 'day').format();
			toDate = dayjs().format();
		}

		const model: DriverDateTimeRequest = {
			driverId,
			startDate: formatToUTC(getStartOf(acceptAsTimeZone(fixDateFormat(fromDate)))),
			endDate: formatToUTC(getEndOf(acceptAsTimeZone(fixDateFormat(toDate)))),
			screenResolution
		};

		const result = await useAxios().getRequest(ApiUrls.BOOST_EVENTS_GRAPH_LATEST_URL, capitalizeKeys(model));

		if (result.status === 200) {
			boostGraph.value = result.data.successResult;
		}
	}

	async function getHistoryBoostGraph(model: { tabId: string; sessionId: string; screenResolution: number }, signal?: AbortSignal) {
		isBoostGraphLoading.value = true;
		try {
			const result = await useAxios().getRequest(ApiUrls.BOOST_EVENTS_GRAPH_HISTORY_URL, capitalizeKeys(model), {}, signal);
			if (result.status === 200) {
				boostGraph.value = result.data.successResult;
			}
		} finally {
			isBoostGraphLoading.value = false;
		}
	}

	async function getLatestBoostResetPinTimes(driverId?: string | null) {
		let { fromDate, toDate } = dateRange();

		if (!driverId) return;
		if (!fromDate || !toDate) {
			fromDate = subtract(dayjs(), 1, 'day').format();
			toDate = dayjs().format();
		}

		const model: BoostEventRequest = {
			driverId,
			startDate: formatToUTC(getStartOf(acceptAsTimeZone(fixDateFormat(fromDate)))),
			endDate: formatToUTC(getEndOf(acceptAsTimeZone(fixDateFormat(toDate))))
		};

		const result = await useAxios().getRequest(ApiUrls.BOOST_EVENTS_RESET_PIN_TIMES_LATEST_URL, capitalizeKeys(model));

		if (result.status === 200) {
			pinTimes.value = result.data.successResult;
		}
	}

	async function getHistoryBoostResetPinTimes(model: { tabId: string; sessionId: string; screenResolution: number | null }, signal?: AbortSignal) {
		const result = await useAxios().getRequest(ApiUrls.BOOST_EVENTS_RESET_PIN_TIMES_HISTORY_URL, capitalizeKeys(model), {}, signal);
		if (result.status === 200) {
			pinTimes.value = result.data.successResult;
		}
	}

	// *POST REQUESTS* //
	async function addBoostEvent(model: BoostEventAddUpdateRequest) {
		const result = await useAxios().postRequest(ApiUrls.BOOST_EVENTS_ADD_URL, model);

		if (result.status === 200) {
			return true;
		}
		return false;
	}

	async function copyBoostEvent(model: BoostEventActionRequest) {
		const result = await useAxios().postRequest(ApiUrls.BOOST_EVENTS_COPY_URL, model);

		if (result.status === 200) {
			return true;
		}
		return false;
	}

	async function revertBoostEvent(model: BoostEventActionRequest) {
		const result = await useAxios().postRequest(ApiUrls.BOOST_EVENTS_REVERT_URL, model);

		if (result.status === 200) {
			return true;
		}
		return false;
	}

	// *PUT REQUESTS* //
	async function updateBoostEvent(eventId: string, model: BoostEventAddUpdateRequest) {
		const result = await useAxios().putRequest(`${ApiUrls.BOOST_EVENTS_UPDATE_URL}/${eventId}`, model);

		if (result.status === 200) {
			return result.data.successResult.wasChanged;
		}
		return false;
	}

	async function moveTimeBoostEvents(model: BoostEventMoveTimeRequest) {
		const result = await useAxios().putRequest(ApiUrls.BOOST_EVENTS_MOVE_TIME_URL, model);
		if (result.status === 200) {
			return true;
		}
		return false;
	}

	async function submitBoostEvents(sessionId: string) {
		const result = await useAxios().putRequest(`${ApiUrls.BOOST_EVENTS_SUBMIT_URL}/${sessionId}`);

		if (result.status === 200) {
			return true;
		}
		return false;
	}

	// *DELETE REQUESTS* //
	async function deleteBoostEvent(model: BoostEventActionRequest) {
		const result = await useAxios().deleteRequest(ApiUrls.BOOST_EVENTS_DELETE_URL, capitalizeKeys(model));

		if (result.status === 200) {
			return true;
		}
		return false;
	}

	return {
		// LOADING
		isBoostGraphLoading,
		isBoostEventsLoading,
		
		// STORES
		boostEvent,
		boostEvents,
		boostGraph,
		pinTimes,
		selectedMoveEvents,
		selectedMoveEventsDurations,
		isMoveTimeEventsReversed,
		// GET REQUESTS
		getBoostEvent,
		getLatestBoostEvents,
		getHistoryBoostEvents,
		getLatestBoostGraph,
		getHistoryBoostGraph,
		getLatestBoostResetPinTimes,
		getHistoryBoostResetPinTimes,

		// POST REQUESTS
		addBoostEvent,
		copyBoostEvent,
		revertBoostEvent,

		// PUT REQUESTS
		updateBoostEvent,
		moveTimeBoostEvents,
		submitBoostEvents,

		// DELETE REQUESTS
		deleteBoostEvent,

		// PROGRESS BAR EVENTS
		totalEvents,
		changedEventIdsSet,
		unchangedEventIds,
		initialTabEventsSet,
		submitsCount
	};
});
