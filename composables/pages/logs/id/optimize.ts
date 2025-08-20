// Importing external dependencies
import dayjs, { Dayjs } from 'dayjs';

// Importing services
import { collectEventWarningAndErrors } from '~/service/normalize/index.js';

// Importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

// Importing stores
import { useBoostStore } from '~/store/boost';
import { useBoostEventsStore } from '~/store/boostEvents';
import { useDriverInfosStore } from '~/store/driverInfos';
import { useDriversStore } from '~/store/drivers';
import { useEditDriverDailyFormsStore } from '~/store/editDriverDailyForms';
import { useGeoLocations } from '~/store/geoLocations';
import { useOptimizeStore } from '~/store/optimize';
import { useSessionsStore } from '~/store/sessions';
import { useTabsStore } from '~/store/tabs';
import { useChart } from '~/store/chart';

// Importing services
import { boostTabService, optimizeFormService, optimizeEventService } from '~/services';

// Importing constants
import { createBoostTableColums, errorAndWarningColumns } from '../constants';

export const useLogsOptimizeComposable = async () => {
	// Time zone helpers
	const { acceptAsTimeZone, convertToTimeZone, getStartOf, getEndOf, formatToUTC } = useTimeZoneHelper();

	// Route
	const route = useRoute();

	// Stores
	const chartStore = useChart();
	const tabStore = useTabsStore();
	const sessionStore = useSessionsStore();
	const boostStore = useBoostStore();
	const driverStore = useDriversStore();
	const boostEventsStore = useBoostEventsStore();
	const editDriverDailyFormsStore = useEditDriverDailyFormsStore();
	const driverInfosStore = useDriverInfosStore();
	const geoLocationsStore = useGeoLocations();
	const optimizeStore = useOptimizeStore();

	// Destructuring stores
	const { tabs, selectedTab } = storeToRefs(tabStore);
	const { screenResolution } = storeToRefs(chartStore);
	const { sessionId, session } = storeToRefs(sessionStore);
	const { boostEvents, pinTimes } = storeToRefs(boostEventsStore);
	const { boostSummaries, boostTimeRemainder } = storeToRefs(boostStore);
	const { driverInfos, driverTimeZone } = storeToRefs(driverInfosStore);
	const { optimizeCategories } = storeToRefs(optimizeStore);
	const { calculatedAddress } = storeToRefs(geoLocationsStore);

	// Header date
	const headerDate = ref<[Dayjs, Dayjs]>([
		route.query.fromDate ? acceptAsTimeZone(fixDateFormat(String(route.query.fromDate))) : convertToTimeZone(subtract(dayjs(), 2, 'week')),
		route.query.toDate ? acceptAsTimeZone(fixDateFormat(String(route.query.toDate))) : convertToTimeZone(dayjs())
	]);

	const selectedDriver = ref<string | null>(route.params.id as string);
	const editStatusModal = ref<boolean>(false);
	const violationModal = ref<boolean>(false);
	const showAllErrorsAndWarningsModal = ref<boolean>(false);
	const selectedRow = ref<any[]>([]);
	const selectedOptimizeCategories = ref<{ [key: string]: Boolean }>({});
	const selectAllOptimizeCategories = ref<boolean>(false);

	// Loading states
	const loading = ref<boolean>(false);
	const isOptimized = ref<{ [key: string]: Boolean }>({});
	const isOptimizeEventsLoaded = ref<boolean>(false);
	const loadingOptimizeEvents = ref<boolean>(false);

	// Optimize events related variables
	const detailList = ref();
	const loadingTable = ref<boolean>(false);
	const isOptimizeEventsSubmitted = ref<boolean>(false);

	// Status form reactive object
	const editStatus = reactive<OptimizeEditStatus>({
		id: 32,
		eventId: '',
		event: { eventCode: null, eventType: null },
		startDate: dayjs(),
		origin: 0,
		vehicle: null,
		vehicleId: '',
		odometer: 934,
		engine_hours: 99347,
		location_origin: 0,
		latitude: 21.938873533,
		longitude: -21.938873533,
		location: '31.7 mi W of Deming, NM',
		location_note: 'Location',
		notes: 'Pick up'
	});

	if (!route.query.fromDate || !route.query.toDate) {
		navigateTo({
			query: {
				fromDate: getStartOf(convertToTimeZone(subtract(dayjs(), 2, 'week'))).format('YYYY-MM-DDTHH:mm:ss'),
				toDate: getEndOf(convertToTimeZone(dayjs())).format('YYYY-MM-DDTHH:mm:ss')
			}
		});
	}

	// Computed properties
	const drivers = computed(() => {
		if (!driverStore.drivers?.length) return [];

		return driverStore.drivers.map((driver) => ({
			id: driver.id,
			name: `${driver.user.firstName} ${driver.user.lastName}`,
			// Cache key qo'shish
			_cacheKey: `${driver.id}-${driver.user.firstName}-${driver.user.lastName}`
		}));
	});

	const columns = computed(() => {
		return createBoostTableColums(driverTimeZone.value?.shortName);
	});

	const isOptimizeEventsDisabled = computed(() => loading.value || validateStatusForm().length > 0);

	// Driver infos
	const getDriverInfos = async () => {
		const model = {
			driverId: route.params.id as string,
			dateTime: formatToUTC(headerDate.value[0])
		};

		await Promise.allSettled([driverInfosStore.getDriverInfos(model), driverInfosStore.getDriverTimeZone(route.params.id as string)]);
	};

	const tableRowSelect = (row: any) => {
		if (selectedRow.value.some((r: any) => r.id === row.id)) {
			selectedRow.value = selectedRow.value.filter((r: any) => r.id !== row.id);
		} else {
			selectedRow.value.push(row);
		}
	};

	const getBoostActions = async (tabType: number = 2) => {
		const model = {
			tabId: selectedTab.value?.id as string,
			sessionId: sessionId.value as string,
			screenResolution: screenResolution.value
		};

		if (selectedTab.value?.type !== tabType) {
			await boostTabService.updateTab(tabType);
		}

		await Promise.allSettled([
			boostEventsStore.getHistoryBoostEvents(model),
			boostEventsStore.getHistoryBoostResetPinTimes(model)
			// boostStore.getHistoryBoostSummaries(model),
			// boostStore.getHistoryBoostTimeRemainder(model),
			// editDriverDailyFormsStore.getEditDriverDailyForms(model)
		]);

		await collectAllBoostEventsErrorsAndWarnings(boostEvents.value);
	};

	const validateStatusForm = () => {
		return optimizeFormService.validateStatusForm(editStatus);
	};

	const debouncedChangeLocation = debounce(async (lat: number | string | null, long: number | string | null) => {
		if (lat && long) {
			await geoLocationsStore.getCalculatedAddress({ latitude: lat as number, longitude: long as number });
			editStatus.location = calculatedAddress.value as string;
		}
	}, 300);

	// Optimize Events
	const openEditOptimizeEvent = async (id: string) => {
		await optimizeEventService.openEditOptimizeEvent(editStatus, id, editStatusModal);
	};
	const submitEditOptimizeEvent = async () => {
		await optimizeEventService.submitEditOptimizeEvent(loading, editStatus, editStatusModal, getBoostActions, selectedDriver);
	};
	const submitOptimizeEvents = async () => {
		try {
			await Promise.all([boostEventsStore.submitBoostEvents(sessionId.value as string), editDriverDailyFormsStore.submitEditDriverDailyForm(sessionId.value as string)]);
		} catch (error) {
			console.log(error);
		} finally {
			isOptimizeEventsSubmitted.value = true;
			getBoostActions();
		}
	};
	const copyOptimizeEvent = async (eventId: string) => {
		await optimizeEventService.copyOptimizeEvent(eventId, getBoostActions);
	};
	const revertOptimizeEvent = async (eventId: string) => {
		await optimizeEventService.revertOptimizeEvent(eventId, getBoostActions);
	};
	const deleteOptimizeEvent = async (eventId: string) => {
		await optimizeEventService.deleteOptimizeEvent(eventId, getBoostActions);
	};

	const loadOptimizeEvents = async (isSessionCreated: boolean = false) => {
		loadingOptimizeEvents.value = true;
		const sessionModel: SessionRequest = {
			driverId: selectedDriver.value as string,
			type: 2,
			status: 0,
			startDate: formatToUTC(getStartOf(headerDate.value.at(0))),
			endDate: formatToUTC(getEndOf(headerDate.value.at(-1)))
		};

		isOptimizeEventsLoaded.value = false;

		try {
			if (!isSessionCreated) {
				await sessionStore.addSession(sessionModel);
			}

			// gettings tabs by session
			await tabStore.getTabs(sessionId.value as string);
			selectedTab.value = tabs.value?.at(-1);

			await getBoostActions(!isSessionCreated ? 1 : selectedTab.value?.type);

			// setting sessionId to route
			navigateTo({ query: { ...route.query, sessionId: sessionId.value } });
			isOptimizeEventsLoaded.value = true;
		} catch (error) {
			isOptimizeEventsLoaded.value = false;
			console.log(error);
		} finally {
			loadingOptimizeEvents.value = false;
		}
	};

	const submitOptimizeCategories = async () => {
		try {
			loading.value = true;
			await optimizeStore.optimizeSelectedCategories({
				sessionId: sessionId.value as string,
				tabId: selectedTab.value?.id as string,
				eventCategoryInfos: optimizeCategories.value.filter((category) => selectedOptimizeCategories.value[category.id])
			});
			await getBoostActions(4);
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
			isOptimized.value[selectedTab.value?.id as string] = true;
		}
	};

	// REST
	const collectAllBoostEventsErrorsAndWarnings = async (events?: BoostEventsResponse[] | null) => {
		const allEvents = events?.flatMap((item) => toRaw(item.events));
		try {
			loadingTable.value = true;
			// if (allEvents) {
			// 	await webWorkerNormalize(allEvents, pinTimes.value);
			// }
			const eventsWithoutArchived = allEvents?.filter((e) => e.actionState != 4);
			console.time('collectEventWarningAndErrors Timer');
			collectEventWarningAndErrors(eventsWithoutArchived, pinTimes.value);
			console.timeEnd('collectEventWarningAndErrors Timer');
			// dotInspectionAlert.value = !!allEvents?.some((event: BoostEventResponse) => event.isDOTInspected);
			detailList.value = mapBoostEvents(boostEvents.value);
		} catch (error) {
			console.log(error);
		} finally {
			loadingTable.value = false;
			// console.log(
			// 	"Event's Warnings",
			// 	allEvents?.flatMap((item: BoostEventResponse) => item?.warningTitles).filter((item) => item !== undefined)
			// );
		}
	};
	const mapBoostEvents = (boostEvents?: BoostEventsResponse[] | null) =>
		boostEvents?.flatMap(
			(dailyEvent) =>
				dailyEvent.events?.map((event) => {
					const hasErrors = (event.errorTitles?.length ?? 0) > 0;
					const hasWarnings = (event.warningTitles?.length ?? 0) > 0;
					const useCalculated = event.locationOrigin === 1 || !Number.isInteger(event.locationOrigin);

					return {
						id: event.id,
						count: event.sequenceId,
						est: formatTime(event.dateTime, 'MMM D, YYYY hh:mm A'),
						event: { eventType: event.eventType, eventCode: event.eventCode },
						duration: formatDuration(event.durationInSeconds, true),
						location: useCalculated ? event.calculatedLocation || event.manualLocation || '' : event.manualLocation || event.calculatedLocation || '',
						system: RecordOrigin[event.recordOrigin as keyof typeof RecordOrigin]?.shortName || '',
						odometer: event.totalVehicleMiles,
						hours: event.totalEngineHours,
						notes: event.annotation || '',
						recordStatus: event.recordStatus,
						recordOrigin: event.recordOrigin,
						status: event.actionState,
						isDOTInspected: event.isDOTInspected,
						errorTitles: event.errorTitles,
						warningTitles: event.warningTitles,
						class: hasErrors
							? '!bg-red-0/[.2] hover:!bg-red-0/[.3] dark:!bg-red-0/[.1] dark:hover:!bg-red-0/[.2]'
							: hasWarnings
							? '!bg-yellow-1/[.2] hover:!bg-yellow-1/[.3] dark:!bg-yellow-1/[.1] dark:hover:!bg-yellow-1/[.2]'
							: ''
					};
				}) || []
		) || [];

	// Watchers
	watch(
		() => [headerDate.value.at(0), headerDate.value.at(-1)],
		() => {
			if (!selectedDriver.value) return;

			const dateQuery =
				headerDate.value.at(0) && headerDate.value.at(-1)
					? `?fromDate=${getStartOf(headerDate.value.at(0)).format('YYYY-MM-DDTHH:mm:ss')}&toDate=${getEndOf(headerDate.value.at(-1)).format('YYYY-MM-DDTHH:mm:ss')}`
					: '';

			navigateTo(`/logs/${selectedDriver.value}/optimize` + dateQuery);

			isOptimizeEventsLoaded.value = false;
			isOptimizeEventsSubmitted.value = false;

			loadOptimizeEvents();
		}
	);

	watch([() => editStatus.latitude, () => editStatus.longitude], async ([newLat, newLong]) => {
		debouncedChangeLocation(newLat, newLong);
	});

	watch(selectAllOptimizeCategories, (value) => {
		if (value) {
			optimizeCategories.value.forEach((category) => {
				selectedOptimizeCategories.value[category.id] = true;
			});
		} else {
			selectedOptimizeCategories.value = {};
		}
	});

	// On mounted
	onMounted(async () => {
		await Promise.allSettled([optimizeStore.getOptimizeCategories(), getDriverInfos()]);

		if (route.query?.sessionId) {
			let result = await sessionStore.getSession(route.query.sessionId as string);
			if (!result) {
				navigateTo({
					query: { fromDate: getStartOf(headerDate.value.at(0)).format('YYYY-MM-DDTHH:mm:ss'), toDate: getEndOf(headerDate.value.at(-1)).format('YYYY-MM-DDTHH:mm:ss') }
				});
			} else {
				// isBoostEventsSubmitted.value = !!session.value?.isSubmitted;
				isOptimizeEventsLoaded.value = !!session.value?.isSubmitted;
				await loadOptimizeEvents(true);
			}
		} else {
			await loadOptimizeEvents(false);
		}
	});

	// Returning all the reactive data and methods
	return {
		// loading
		loading,

		// Drivers and Header
		drivers,
		driverInfos,
		headerDate,
		selectedDriver,

		// Modals
		editStatusModal,
		showAllErrorsAndWarningsModal,
		violationModal,

		// Optimization Settings
		isOptimized,
		optimizeCategories,
		selectedOptimizeCategories,
		selectAllOptimizeCategories,
		submitOptimizeCategories,

		// Tabs
		tabs,
		selectedTab,

		// Status Form
		editStatus,
		validateStatusForm,

		// Optimize events
		detailList,
		loadingTable,
		openEditOptimizeEvent,
		submitEditOptimizeEvent,
		isOptimizeEventsDisabled,
		isOptimizeEventsSubmitted,
		isOptimizeEventsLoaded,
		loadingOptimizeEvents,
		loadOptimizeEvents,
		deleteOptimizeEvent,
		revertOptimizeEvent,
		copyOptimizeEvent,
		submitOptimizeEvents,

		// Summaries
		boostSummaries,

		// Time Remainder
		boostTimeRemainder,

		selectedRow,
		tableRowSelect,
		columns,
		errorAndWarningColumns
	};
};
