// Importing packages
import dayjs, { Dayjs } from 'dayjs';

// Importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

// Importing stores
import { useIndex } from '~/store';
import { useDriverDailyFormsStore } from '~/store/driverDailyForms';
import { useDriverInfosStore } from '~/store/driverInfos';
import { useDriverLogs } from '~/store/driverLogs';
import { useDriversStore } from '~/store/drivers';
import { useEventsByOtherStore } from '~/store/eventByOthers';
import { useGeoLocations } from '~/store/geoLocations';
import { useSessionsStore } from '~/store/sessions';
import { useTabsStore } from '~/store/tabs';
import { useTrackingsStore } from '~/store/tracking';
import { useTransferEventsStore } from '~/store/transferEvents';

// Importing services
import { logsEventService, logsFormService } from '~/services';

// Import constants
import { createLogsTableColums } from '../constants';

export const useLogsId = async () => {
	// Routes
	const route = useRoute();

	// Helpers
	const { getStartOf, getEndOf, formatToUTC, convertToTimeZone, acceptAsTimeZone } = useTimeZoneHelper();

	// Stores
	const driversStore = useDriversStore();
	const driverLogsStore = useDriverLogs();
	const driverInfosStore = useDriverInfosStore();
	const driverDailyFormsStore = useDriverDailyFormsStore();
	const eventByOtherStore = useEventsByOtherStore();
	const geoLocationsStore = useGeoLocations();
	const transferEventsStore = useTransferEventsStore();
	const sessionStore = useSessionsStore();
	const tabStore = useTabsStore();
	const trackingsStore = useTrackingsStore();

	// Destructuring Stores
	const { sidebar } = storeToRefs(useIndex());
	const { tabs, selectedTab } = storeToRefs(tabStore);
	const { sessionId, session } = storeToRefs(sessionStore);
	const { drivers } = storeToRefs(driversStore);
	const { chartData, editChartData, dailyEvents, weeklyViolations, dailyPixelViolations, dailySummary, dailyTimeRemainder, isGraphLoading, isDailyEventsLoading } =
		storeToRefs(driverLogsStore);
	const { driverInfos, driverTimeZone } = storeToRefs(driverInfosStore);
	const { driverDailyForm } = storeToRefs(driverDailyFormsStore);
	const { driverVehicles } = storeToRefs(eventByOtherStore);
	const { calculatedAddress } = storeToRefs(geoLocationsStore);
	const { originalDailyEvents } = storeToRefs(transferEventsStore);
	const { dailyTrackings, everyTrackings, trackingTooltips } = storeToRefs(trackingsStore);

	// abort controller
	const currentAbortController = ref<AbortController | null>(null);
	// header date
	const headerDate = ref<Dayjs>(route.query?.date ? acceptAsTimeZone(route.query.date as string) : convertToTimeZone());

	const state = reactive<LogsState>({
		loading: false,
		modals: {
			editProfileModal: false,
			statusModal: false,
			driverLogsModal: false,
			historyTransferEventsModal: false,
			historyTransferLogsByPeriodModal: false
		},
		ui: {
			trackingCollapse: true,
			selectedToggle: true,
			screenResolution: 0
		},
		driver: {
			searchDriver: '',
			driverListFiltered: [],
			selectedDriver: (route.params.id as string) || ''
		},
		event: {
			editEventId: null,
			editEventType: null,
			editEventCode: null,
			editEventStatus: '',
			editEventStart: {
				hours: 0,
				minutes: 0,
				seconds: 0
			},
			editEventEnd: { hours: 0, minutes: 0, seconds: 0 }
		},
		table: {
			selectedRow: []
		},
		action: {
			statusAction: ''
		}
	});

	const forms = reactive<LogsForm>({
		historyTransferForm: {
			dateRange: [headerDate.value, headerDate.value],
			dateRangeSubmit: false
		},
		statusForm: {
			driverId: null,
			eventType: 0,
			eventCode: 0,
			startTime: '',
			endTime: '',
			locationOrigin: 0,
			latitude: null,
			longitude: null,
			calculatedLocation: null,
			manualLocation: null,
			annotation: '',
			totalVehicleMiles: 0,
			totalEngineHours: 0
		},
		editDriverDailyForm: {
			coDrivers: '',
			shippingDocs: '',
			trailers: '',
			signaturePath: ''
		}
	});

	const apiModels = reactive<LogsApiModels>({
		modelChart: {
			startDate: formatToUTC(getStartOf(headerDate.value)),
			endDate: formatToUTC(getEndOf(headerDate.value)),
			driverId: route.params.id as string,
			screenResolution: state.ui.screenResolution
		},
		editModelChart: {
			startDate: formatToUTC(getStartOf(headerDate.value)),
			endDate: formatToUTC(getEndOf(headerDate.value)),
			driverId: route.params.id as string,
			screenResolution: 0
		},
		modelDailyEvents: {
			startDate: formatToUTC(getStartOf(headerDate.value)),
			endDate: formatToUTC(getEndOf(headerDate.value)),
			driverId: route.params.id as string
		},
		modelWeeklyViolations: {
			startDate: formatToUTC(getStartOf(subtract(headerDate.value, 1, 'week'))),
			endDate: formatToUTC(getEndOf(headerDate.value)),
			driverId: route.params.id as string
		}
	});

	// Computed
	const detailList = computed(() =>
		mapDailyEvents(route.query?.tab === 'history' ? (originalDailyEvents.value as DriverLogsDailyEventsResponse[]) : (dailyEvents.value as DriverLogsDailyEventsResponse[]))
	);

	const disabledSubmit = computed(() => state.loading || !!validateStatusForm().errors.length);

	const columns = computed(() => {
		return createLogsTableColums(driverTimeZone.value?.shortName);
	});

	const chartError = computed(() => validateStatusForm().new_err);

	const disableEditDailyForm = computed(() => {
		return state.loading || validateEditDriverDailyForm().length > 0;
	});

	// Functions

	const debouncedInput = debounce(
		async (e: Event) => {
			const target = e.target as HTMLInputElement;
			state.driver.driverListFiltered = drivers.value?.filter((n) => `${n.user.firstName} ${n.user.lastName}`.toLowerCase().includes(target.value.toLowerCase()));
		},
		300 // timeout in ms
	);

	const selectReassignedDriver = async (driverId: string) => {
		state.driver.selectedDriver = driverId;
	};

	const applyReassignDriver = async () => {
		state.loading = true;
		try {
			const result = await transferEventsStore.resignTransferEvents({
				driverId: route.params.id as string,
				startDate: formatToUTC(getStartOf(headerDate.value)),
				endDate: formatToUTC(getEndOf(headerDate.value)),
				assignedDriverId: state.driver.selectedDriver as string,
				eventIds: state.table.selectedRow.map((row: any) => row.eventId)
			});
			if (result) {
				state.modals.driverLogsModal = false;
				await Promise.allSettled([validateQueryHistory(route.query?.tab as string), getDriverDailyForm(), getWeeklyViolations(), getDailyTimeRemainder()]);
				state.table.selectedRow = [];
			}
		} catch (error) {
			console.error(error);
		} finally {
			state.driver.driverListFiltered = drivers.value.filter((d) => d.id != state.driver.selectedDriver);
			state.loading = false;
		}
	};

	defineShortcuts({
		shift_enter: {
			handler: () => {
				console.log('clicked');
				if (JSON.stringify(state.table.selectedRow) === JSON.stringify(detailList.value)) {
					state.table.selectedRow = [];
				} else {
					state.table.selectedRow = detailList.value as never[];
				}
			}
		}
	});

	const onSelectRow = (...args: any[]) => {
		console.log(args);
	};

	const updateHeaderDate = async (date?: any) => {
		if (currentAbortController.value) {
			currentAbortController.value.abort();
			currentAbortController.value = null;
		}
		headerDate.value = acceptAsTimeZone(date[0]);
	};

	// Logs Events
	const historyTransferEventsSubmit = async () => {
		await logsEventService.historyTransferEventsSubmit(state);
	};
	const historyTransferLogsByPeriodSubmit = async () => {
		await logsEventService.historyTransferLogsByPeriodSubmit(forms, state);
	};
	const getDailyEvents = async (signal?: AbortSignal) => {
		await logsEventService.getDailyEvents(apiModels.modelDailyEvents, route.query?.tab as string, signal);
	};
	const getDutyEventStatus = (editEvent: EditDutyEvent) => {
		logsEventService.getDutyEventStatus(editEvent, state, apiModels.editModelChart);
		nextTick();
		validateStatusForm();
	};
	const mapDailyEvents = (dailyEvents: DriverLogsDailyEventsResponse[]) => {
		if (!dailyEvents?.length) return [];
		return dailyEvents.map((dailyEvent) => logsEventService.mapSingleEvent(dailyEvent));
	};
	const openDailyEvents = async (action: 'edit' | 'add', eventId?: string) => {
		if (!eventId && action === 'edit') return;
		state.action.statusAction = action;
		clearObject(forms.statusForm);

		// Reset
		state.event.editEventType = 1;
		state.event.editEventCode = 1;
		state.event.editEventStatus = '';

		state.event.editEventStart.hours = 0;
		state.event.editEventStart.minutes = 0;
		state.event.editEventStart.seconds = 0;

		state.event.editEventEnd.hours = 0;
		state.event.editEventEnd.minutes = 0;
		state.event.editEventEnd.seconds = 0;

		if (action === 'edit') {
			const selectedEvent = detailList.value.find((detail: any) => detail.eventId === eventId);
			if (!selectedEvent) return;

			const eventByOther = await eventByOtherStore.getEventByOther(eventId as string);

			// Assigning values
			state.event.editEventId = eventId as string;
			state.event.editEventType = (eventByOther?.eventType as number) ?? 1;
			state.event.editEventCode = (eventByOther?.eventCode as number) ?? 1;
			state.event.editEventStatus = findEventByTypeAndCode(state.event.editEventType as number, state.event.editEventCode as number)?.key ?? '';

			forms.statusForm.driverId = route.params.id as string;
			forms.statusForm.eventType = state.event.editEventType;
			forms.statusForm.eventCode = state.event.editEventCode;
			forms.statusForm.latitude = eventByOther?.latitude ?? null;
			forms.statusForm.longitude = eventByOther?.longitude ?? null;
			forms.statusForm.calculatedLocation = eventByOther?.calculatedLocation ?? null;
			forms.statusForm.manualLocation = eventByOther?.manualLocation ?? null;
			forms.statusForm.annotation = eventByOther?.annotation ?? '';
			forms.statusForm.totalVehicleMiles = eventByOther?.totalVehicleMiles ?? 0;
			forms.statusForm.totalEngineHours = eventByOther?.totalEngineHours ?? 0;
		} else {
			// Assigning values
			forms.statusForm.driverId = route.params.id as string;
			state.event.editEventId = '';
			state.event.editEventType = 1;
			state.event.editEventCode = 1;
			state.event.editEventStatus = findEventByTypeAndCode(state.event.editEventType as number, state.event.editEventCode as number)?.key ?? '';
		}

		state.modals.statusModal = true;
	};

	const validateQueryHistory = async (newTab: string = route.query?.tab as string, signal?: AbortSignal) => {
		if (newTab && newTab === 'history') {
			const isSessionCreated = !!route.query?.sessionId;
			const sessionModel: SessionRequest = {
				driverId: state.driver.selectedDriver as string,
				type: 4,
				startDate: formatToUTC(getStartOf(headerDate.value)),
				endDate: formatToUTC(getEndOf(headerDate.value)),
				status: 0
			};

			try {
				if (!isSessionCreated) {
					await sessionStore.addSession(sessionModel);
				} else {
					await sessionStore.getSession(route.query.sessionId as string);
					if (!compareDates(acceptAsTimeZone(session.value?.startDate), headerDate.value)) {
						headerDate.value = acceptAsTimeZone(session.value?.startDate);
					}
				}

				// getting tabs by session
				await tabStore.getTabs(sessionId.value as string);
				selectedTab.value = tabs.value?.at(-1);

				// setting sessionId to route
				navigateTo({ query: { ...route.query, sessionId: sessionId.value } });
			} catch (error) {
				console.log(error);
			}
		}
		await Promise.allSettled([getDailyEvents(signal), getDailySummary(signal)]);
	};

	const getChart = async (isEdit: boolean = false) => {
		if (route.query?.tab === 'history') {
			const result = await transferEventsStore.getGraphTransferEvents({
				tabId: selectedTab.value?.id as string,
				sessionId: sessionId.value as string,
				screenResolution: apiModels.modelChart.screenResolution
			});
			if (!!result) {
				chartData.value = result;
			}
		} else {
			// await driverLogsStore.getDriverLogsDailyGraph(isEdit ? editModelChart : modelChart, isEdit);
			await getDriverDailyGraphLogs(isEdit);
		}
	};

	// driver infos
	const getDriverInfos = async (signal?: AbortSignal) => {
		const model = {
			driverId: route.params.id as string,
			dateTime: formatToUTC(headerDate.value)
		};

		await Promise.allSettled([driverInfosStore.getDriverInfos(model, signal), driverInfosStore.getDriverTimeZone(route.params.id as string, signal)]);
	};

	// driver daily form
	const getDriverDailyForm = async () => {
		await logsFormService.getDriverDailyForm(route.params.id as string, headerDate.value);
	};
	const editDriverDailyFormModal = async () => {
		await logsFormService.editDriverDailyFormModal(forms.editDriverDailyForm, state);
	};
	const validateEditDriverDailyForm = () => {
		return logsFormService.validateEditDriverDailyForm(forms.editDriverDailyForm);
	};
	const submitDriverDailyForm = async () => {
		const driverId = route.params.id as string;
		await logsFormService.submitDriverDailyForm(forms.editDriverDailyForm, state, headerDate.value, getDriverDailyForm, driverId);
	};
	const validateStatusForm = () => {
		return logsFormService.validateStatusForm(forms.statusForm, state);
	};

	// pixel violations
	const getDriverDailyGraphLogs = async (isEdit: boolean = false, signal?: AbortSignal) => {
		await Promise.all([
			driverLogsStore.getDriverLogsDailyGraph(isEdit ? apiModels.editModelChart : apiModels.modelChart, isEdit, signal),
			driverLogsStore.getDriverLogsDailyPixelViolations(apiModels.modelChart, signal)
		]);
	};

	// daily summary
	const getDailySummary = async (signal?: AbortSignal) => {
		if (route.query?.tab === 'history') {
			const result = await transferEventsStore.getDailySummaryTransferEvents({
				tabId: selectedTab.value?.id as string,
				sessionId: sessionId.value as string
			});
			if (!!result) {
				dailySummary.value = result;
			}
		} else {
			await driverLogsStore.getDriverLogsDailySummary(apiModels.modelDailyEvents, signal);
		}
	};
	// get tracking
	const getTrackings = async () => {
		const model: DriverLogsDailyEventsRequest = {
			startDate: formatToUTC(getStartOf(headerDate.value)),
			endDate: formatToUTC(getEndOf(headerDate.value)),
			driverId: route.params.id as string
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

	// hos remainder
	const getDailyTimeRemainder = async () => {
		await driverLogsStore.getDriverLogsDailyTimeRemainder(apiModels.modelDailyEvents);
	};

	// driver logs weekly violations
	const getWeeklyViolations = async () => {
		await driverLogsStore.getDriverLogsWeeklyViolations(apiModels.modelWeeklyViolations);
	};

	// get chart svgContainer width
	const getChartWidth = async (width: number): Promise<void> => {
		state.ui.screenResolution = width;
		apiModels.modelChart.screenResolution = state.ui.screenResolution;
		if ((route.query?.tab === 'history' && sessionId.value && selectedTab.value?.id) || route.query?.tab !== 'history') {
			await getChart();
		}
		// await getDriverDailyGraphLogs();
	};
	const getChartEditWidth = async (width: number) => {
		if (width > 0) {
			apiModels.editModelChart.screenResolution = width;
			await getChart(true);
			await getDailySummary();
		}
	};

	const shouldBeLess = (a: TimeObject, b: TimeObject) => {
		const secondsA = convertToSeconds(transformToTimeString(a));
		const secondsB = convertToSeconds(transformToTimeString(b));
		return secondsA <= secondsB;
	};

	const debouncedChangeLocation = debounce(async (lat: number | string | null, long: number | string | null) => {
		if (lat && long) {
			await geoLocationsStore.getCalculatedAddress({ latitude: lat as number, longitude: long as number });
			forms.statusForm.calculatedLocation = calculatedAddress.value as string;
		}
	}, 300);

	const submitEventStatus = async () => {
		state.loading = true;
		try {
			forms.statusForm.eventType = state.event.editEventType as number;
			forms.statusForm.eventCode = state.event.editEventCode as number;
			forms.statusForm.startTime = formatToUTC(
				getStartOf(headerDate.value).add(
					convertToSeconds(`${state.event.editEventStart.hours}:${state.event.editEventStart.minutes}:${state.event.editEventStart.seconds}`),
					'seconds'
				)
			);
			forms.statusForm.endTime = formatToUTC(
				getStartOf(headerDate.value).add(convertToSeconds(`${state.event.editEventEnd.hours}:${state.event.editEventEnd.minutes}:${state.event.editEventEnd.seconds}`), 'seconds')
			);

			// await eventByOtherStore.saveEventByOther(statusForm);
			if (state.action.statusAction === 'edit') {
				await eventByOtherStore.updateEventByOther(forms.statusForm, state.event.editEventId!.toString());
			} else {
				await eventByOtherStore.addEventByOther(forms.statusForm);
			}
		} catch (error) {
			console.log(error);
		} finally {
			await getDailyEvents();
			state.modals.statusModal = false;
			state.loading = false;
		}
	};

	const cleanupController = () => {
		if (currentAbortController.value) {
			currentAbortController.value.abort();
			currentAbortController.value = null;
		}
	};
	const createNewController = () => {
		cleanupController();
		currentAbortController.value = new AbortController();
		return currentAbortController.value.signal;
	};

	// Watchers
	watch([() => forms.statusForm.latitude, () => forms.statusForm.longitude], async ([newLat, newLong]) => {
		debouncedChangeLocation(newLat, newLong);
	});

	watch(
		() => route.query.tab,
		async (newTab) => {
			await validateQueryHistory(newTab as string);
		}
	);

	watch(
		() => state.table.selectedRow,
		(newSelectedRow) => {
			console.log('selected row', newSelectedRow);
		}
	);

	// violations date settings
	watch(headerDate, async (newValue) => {
		if (route.query?.tab === 'history') {
			await navigateTo({
				query: {
					...route.query,
					sessionId: undefined,
					tab: undefined,
					fromDate: undefined,
					toDate: undefined,
					activity: undefined
				}
			});
		}
		if (compareDates(weeklyViolations.value?.at(0)?.dateOfViolations, newValue)) {
			apiModels.modelWeeklyViolations.startDate = formatToUTC(getStartOf(subtract(newValue, 1, 'day')));
			apiModels.modelWeeklyViolations.endDate = formatToUTC(getEndOf(add(newValue, 6, 'day')));
			await getWeeklyViolations();
		} else if (compareDates(weeklyViolations.value?.at(-1)?.dateOfViolations, newValue) && dayjs(newValue).isBefore(convertToTimeZone(), 'day')) {
			apiModels.modelWeeklyViolations.startDate = formatToUTC(getStartOf(subtract(newValue, 6, 'day')));
			apiModels.modelWeeklyViolations.endDate = formatToUTC(getEndOf(add(newValue, 1, 'day')));
			await getWeeklyViolations();
		} else if (!weeklyViolations.value?.some((violation) => compareDates(violation.dateOfViolations, newValue))) {
			apiModels.modelWeeklyViolations.startDate = formatToUTC(getStartOf(subtract(newValue, 6, 'day')));
			apiModels.modelWeeklyViolations.endDate = formatToUTC(getEndOf(add(newValue, 1, 'day')));
			await getWeeklyViolations();
		}

		apiModels.modelChart.startDate = formatToUTC(getStartOf(newValue));
		apiModels.modelChart.endDate = formatToUTC(getEndOf(newValue));

		apiModels.editModelChart.startDate = formatToUTC(getStartOf(newValue));
		apiModels.editModelChart.endDate = formatToUTC(getEndOf(newValue));

		apiModels.modelDailyEvents.startDate = formatToUTC(getStartOf(newValue));
		apiModels.modelDailyEvents.endDate = formatToUTC(getEndOf(newValue));

		navigateTo({ query: { ...route.query, date: formatTime(newValue, 'YYYY-MM-DD') } });
		const signal = createNewController();
		await getDriverDailyGraphLogs(false, signal);
		await validateQueryHistory(route.query.tab as string, signal);
		await Promise.allSettled([getDriverInfos(signal), getDriverDailyForm(), getTrackings()]);
	});

	onMounted(async () => {
		state.ui.screenResolution = document.documentElement.clientWidth - 244 - (sidebar.value === 'open' ? 170 : 0);

		if (!route.query?.date) {
			navigateTo({ query: { date: formatTime(headerDate.value, 'YYYY-MM-DD') } });
		}
		await Promise.allSettled([
			validateQueryHistory(route.query?.tab as string),
			getDriverInfos(),
			getDriverDailyForm(),
			getWeeklyViolations(),
			getDailyTimeRemainder(),
			driversStore.getDriversFilter()
		]);

		state.driver.driverListFiltered = drivers.value.filter((d) => d.id != state.driver.selectedDriver);
	});

	onUnmounted(() => {
		cleanupController();
	});
	return {
		// state
		...toRefs(state),

		// forms
		...toRefs(forms),
		// ...toRefs(apiModels),

		// loading
		isGraphLoading,
		isDailyEventsLoading,

		// disabled
		disabledSubmit,
		chartError,

		// graph
		chartData,
		editChartData,
		getChartWidth,
		getChartEditWidth,

		// driver logs
		drivers,
		driverInfos,

		// driver daily form
		driverDailyForm,

		// violations
		weeklyViolations,
		dailyPixelViolations,
		// daily time remainder
		dailyTimeRemainder,

		// daily summary
		dailySummary,

		// reassign form
		debouncedInput,
		selectReassignedDriver,
		applyReassignDriver,

		// history transfer
		historyTransferEventsSubmit,
		historyTransferLogsByPeriodSubmit,

		// header date
		headerDate,
		updateHeaderDate,

		// daily driver form
		disableEditDailyForm,
		editDriverDailyFormModal,
		submitDriverDailyForm,
		validateEditDriverDailyForm,

		// edit daily events
		getDutyEventStatus,
		openDailyEvents,
		validateStatusForm,
		shouldBeLess,
		submitEventStatus,
		driverVehicles,

		// table
		columns,
		detailList,
		onSelectRow,

		// timezone
		acceptAsTimeZone,
		convertToTimeZone
	};
};
