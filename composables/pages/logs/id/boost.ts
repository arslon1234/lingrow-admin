// Importing External Dependencies
import dayjs, { Dayjs } from 'dayjs';

// Importing Helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

// Importing Stores
import { useIndex } from '~/store';
import { useBoostStore } from '~/store/boost';
import { useBoostEventsStore } from '~/store/boostEvents';
import { useChart } from '~/store/chart';
import { useDriverInfosStore } from '~/store/driverInfos';
import { useDriversStore } from '~/store/drivers';
import { useEditDriverDailyFormsStore } from '~/store/editDriverDailyForms';
import { useGeoLocations } from '~/store/geoLocations';
import { useOptimizeStore } from '~/store/optimize';
import { useSessionsStore } from '~/store/sessions';
import { useTabsStore } from '~/store/tabs';

// Importing composables
import { useBoostLoadingComposable } from '../boost/loading';
import { useBoostUIComposable } from '../boost/ui';
import { useBoostFormComposable } from '../boost/form';
import { useBoostSelectionComposable } from '../boost/selection';

// Importing Services
import { boostEventService, boostFormService, boostLocationService, boostTabService, boostWebWorkerService } from '~/services';

// Importing constants
import { SCREEN_RESOLUTION_OFFSET, createBoostTableColums, errorAndWarningColumns, eventFilterItems, editStatus, editProfile, formBoost } from '../constants';
import { useBoostChartComposable } from '../boost/chart';

export const useLogsBoostComposable = () => {
	// Route
	const route = useRoute();

	// Stores
	const tabStore = useTabsStore();
	const boostStore = useBoostStore();
	const driverStore = useDriversStore();
	const sessionStore = useSessionsStore();
	const boostEventsStore = useBoostEventsStore();
	const editDriverDailyFormsStore = useEditDriverDailyFormsStore();
	const driverInfosStore = useDriverInfosStore();
	const geoLocationsStore = useGeoLocations();
	const optimizeStore = useOptimizeStore();
	const chartStore = useChart();

	// Destructing Stores
	const { sidebar } = storeToRefs(useIndex());
	const { tabs, currentAbortController, selectedTab } = storeToRefs(tabStore);
	const { sessionId, session } = storeToRefs(sessionStore);
	const { screenResolution, chart } = storeToRefs(chartStore);
	const {
		boostEvents,
		boostGraph,
		pinTimes,
		totalEvents,
		changedEventIdsSet,
		unchangedEventIds,
		initialTabEventsSet,
		submitsCount,
		selectedMoveEvents,
		selectedMoveEventsDurations,
		isBoostGraphLoading,
		isBoostEventsLoading,
		isMoveTimeEventsReversed
	} = storeToRefs(boostEventsStore);
	const { boostSummaries, boostViolations, boostTimeRemainder, boostFreeTimes, boostPixelViolations, selectedRows, selectedRowSet, isBoostTimeMoved } = storeToRefs(boostStore);
	const { editDriverDailyForms } = storeToRefs(editDriverDailyFormsStore);
	const { driverTimeZone } = storeToRefs(driverInfosStore);
	const { calculatedAddress } = storeToRefs(geoLocationsStore);
	const { optimizeCategories } = storeToRefs(optimizeStore);

	// Helpers
	const { acceptAsTimeZone, convertToTimeZone, getStartOf, getEndOf, formatToUTC } = useTimeZoneHelper();
	const detailList = shallowRef();

	const { loadingStates, openNextLog } = useBoostLoadingComposable();
	const {
		formStates,
		dailyFormsMap,
		isBoostFormDisabled,
		isEditBoostEventDisabled,
		isEditDriverDailyFormDisabled,
		openEditDriverDailyForm,
		validateBoostForm,
		validateProfileForm,
		validateStatusForm,
		setEditProfileDate,
		copyLongLat,
		pasteLongLat,
		redirectToMap
	} = useBoostFormComposable();
	const { uiStates, modalStates, shouldShowActionButton, isAtStart, isAtEnd, columns, scrollNext, scrollPrev, updateJustifyClass, openBoostModal, drivers } =
		useBoostUIComposable(formStates);
	const { selectionStates, toggleEvents, selectEvent, handleEventSelect } = useBoostSelectionComposable(detailList, uiStates);
	const { table, chartStates, freeTimeScroller, updateChartWidth, handleMoveTimeEventsReversing, reverseMoveTimeEvents, selectRowEvent, getSelectedEvent, getSelectedMoveEvents} = useBoostChartComposable();

	// Header Data
	if (!route.query.fromDate || !route.query.toDate) {
		navigateTo({
			query: {
				fromDate: getStartOf(convertToTimeZone(subtract(dayjs(), 2, 'week'))).format('YYYY-MM-DDTHH:mm:ss'),
				toDate: getEndOf(convertToTimeZone(dayjs())).format('YYYY-MM-DDTHH:mm:ss')
			}
		});
	}
	const headerDate = ref<[Dayjs, Dayjs]>([
		route.query.fromDate ? acceptAsTimeZone(fixDateFormat(String(route.query.fromDate))) : convertToTimeZone(subtract(dayjs(), 2, 'week')),
		route.query.toDate ? acceptAsTimeZone(fixDateFormat(String(route.query.toDate))) : convertToTimeZone(dayjs())
	]);

	// Violation Blocks
	const allViolationBlocks = shallowRef<
		{
			stringType: string;
			violationBlocks: [number, number][];
		}[]
	>([]);

	// Loading States
	// const loadingStates = reactive<BoostLoadingState>({
	// 	loading: false,
	// 	loadingBoostEvents: false,
	// 	isBoostEventsSubmitted: false,
	// 	isBoostEventsLoaded: false,
	// 	isBoostEventsSubmitLoaded: false
	// });

	// Modals States
	// const modalStates = reactive<BoostModalState>({
	// 	optimizeModal: false,
	// 	editStatusModal: false,
	// 	boostModal: false,
	// 	editProfileModal: false,
	// 	violationModal: false,
	// 	showAllErrorsAndWarningsModal: false
	// });

	// Selection States
	// const selectionStates = reactive<BoostSelectedState>({
	// 	selectedDriver: route?.params?.id as string,
	// 	firstChecked: null,
	// 	lastChecked: null,
	// 	selectedOptimizeCategories: {},
	// 	selectAllOptimizeCategories: false
	// });

	// UI States
	// const uiStates = reactive<BoostUiStates>({
	// 	selectedStatus: 0,
	// 	justifyClass: 'justify-start',
	// 	scrollPosition: 0,
	// 	isVisibleCertifiedDate: true,
	// 	isShiftPressed: false,
	// 	contentContainer: null,
	// 	dotInspectionAlert: false
	// });

	// Chart States
	// const chartStates = reactive<BoostChartStates>({
	// 	copiedMoveEvents: {} as { [key: string]: GraphDuties[] },
	// 	selectedErrorEvent: null
	// });

	// Form States
	// const formStates = reactive<BoostFormStates>({
	// 	editStatus,
	// 	editProfile,
	// 	formBoost
	// });

	// Single Ref
	const isOptimized = ref<{ [key: string]: Boolean }>({});
	// const drivers = ref<any>([]);
	// const table = ref<{ scrollToRow: (id: string, doSelect: boolean) => void } | null>(null);
	const expand = reactive({
		openedRows: [],
		row: {}
	});

	// Computed Properties
	// const shouldShowActionButton = computed(() => {
	// 	if (!uiStates.contentContainer) return false;
	// 	return uiStates.contentContainer.scrollWidth > uiStates.contentContainer.clientWidth;
	// });

	// const isAtStart = computed(() => {
	// 	if (!uiStates.contentContainer) return true;
	// 	return uiStates.scrollPosition <= 5;
	// });

	// const isAtEnd = computed(() => {
	// 	if (!uiStates.contentContainer) return true;
	// 	const container = uiStates.contentContainer;
	// 	return uiStates.scrollPosition + container.clientWidth >= container.scrollWidth - 10;
	// });

	// const columns = computed(() => {
	// 	return createBoostTableColums(driverTimeZone.value?.shortName);
	// });

	// const dailyFormsMap = computed(() => {
	// 	const map = new Map();
	// 	editDriverDailyForms.value?.forEach((form) => {
	// 		const dateKey = formatTime(form.formDate, 'YYYY-MM-DD');
	// 		map.set(dateKey, form);
	// 	});
	// 	return map;
	// });

	// const isEditDriverDailyFormDisabled = computed(() => loadingStates.loading || validateProfileForm().length > 0);
	// const isBoostFormDisabled = computed(() => validateBoostForm().length > 0 || loadingStates.loading);
	// const isEditBoostEventDisabled = computed(() => loadingStates.loading || validateStatusForm().length > 0);

	// Methods
	// const updateJustifyClass = async () => {
	// 	await nextTick();
	// 	if (uiStates.contentContainer) {
	// 		const contentWidth = uiStates.contentContainer.scrollWidth;
	// 		const containerWidth = uiStates.contentContainer.clientWidth;
	// 		uiStates.justifyClass = contentWidth <= containerWidth ? 'justify-center' : 'justify-start';
	// 	}
	// };
	// const scrollPrev = () => {
	// 	if (uiStates.contentContainer) {
	// 		uiStates.contentContainer.scrollBy({ left: -60, behavior: 'smooth' });
	// 	}
	// };
	// const scrollNext = () => {
	// 	if (uiStates.contentContainer) {
	// 		uiStates.contentContainer.scrollBy({ left: 60, behavior: 'smooth' });
	// 	}
	// };

	// const freeTimeScroller = (freeTime: BoostFreeTime) => {
	// 	chart.value.handleSelectedLineId(freeTime.eventId, freeTime.startPosition, freeTime.endPosition);
	// };

	const submitOptimizeCategories = async () => {
		try {
			loadingStates.loading = true;
			await optimizeStore.optimizeSelectedCategories({
				sessionId: sessionId.value as string,
				tabId: selectedTab.value?.id as string,
				eventCategoryInfos: optimizeCategories.value.filter((category) => selectionStates.selectedOptimizeCategories[category.id])
			});
			await getBoostActions(4);
			isOptimized.value[selectedTab.value?.id as string] = true;
			selectedRows.value = [];
			selectedRowSet.value.clear();
		} catch (error) {
			console.log(error);
		} finally {
			loadingStates.loading = false;
			modalStates.optimizeModal = false;
			selectionStates.selectAllOptimizeCategories = false;
		}
	};

	// const updateChartWidth = async (width: number) => {
	// 	screenResolution.value = width;
	// };

	// const handleMoveTimeEventsReversing = (value: boolean) => {
	// 	isMoveTimeEventsReversed.value = value;
	// };
	// const reverseMoveTimeEvents = () => {
	// 	isMoveTimeEventsReversed.value = !isMoveTimeEventsReversed.value;
	// };

	// const getSelectedMoveEvents = (events: GraphDuties[], eventsDurations: number[]) => {
	// 	events.forEach((event) => {
	// 		if (event.eventType === 3 && event.eventCode === 5) {
	// 			event.eventCode = 2;
	// 		} else if (event.eventType === 3 && event.eventCode === 6) {
	// 			event.eventCode = 1;
	// 		}
	// 	});
	// 	selectedMoveEvents.value[selectedTab.value?.id as string] = events;
	// 	chartStates.copiedMoveEvents[selectedTab.value?.id as string] = events;

	// 	selectedMoveEventsDurations.value = eventsDurations;
	// };

	// const getSelectedEvent = (event: GraphDuties, doSelectEvent: boolean = false) => {
	// 	table.value?.scrollToRow(event.eventId, doSelectEvent);
	// };

	// const openBoostModal = () => {
	// 	formStates.formBoost.transferring_time = { hours: 0, minutes: 0, seconds: 0 };
	// 	modalStates.boostModal = true;
	// };

	// BoostForm
	// const getEditDriverDailyForm = async () => {
	// 	await boostFormService.getEditDriverDailyForm(formStates.editProfile);
	// };
	const submitEditDailyForm = async () => {
		await boostFormService.submitEditDailyForm(loadingStates, getBoostActions, formStates.editProfile, modalStates, selectionStates);
	};
	const submitBoostForm = async () => {
		await boostFormService.submitBoostForm(loadingStates, getBoostActions, formStates.formBoost, modalStates);
	};
	// const validateBoostForm = () => {
	// 	return boostFormService.validateBoostForm(formStates.formBoost);
	// };
	// const validateProfileForm = () => {
	// 	return boostFormService.validateProfileForm(formStates.editProfile);
	// };
	// const validateStatusForm = () => {
	// 	return boostFormService.validateStatusForm(formStates.editStatus);
	// };
	// const openEditDriverDailyForm = async (date: string | Dayjs) => {
	// 	await boostFormService.openEditDriverDailyForm(formStates.editProfile, modalStates, date);
	// };

	// const setEditProfileDate = (type: 'add' | 'subtract') => {
	// 	formStates.editProfile.date = type === 'add' ? add(formStates.editProfile.date, 1, 'day') : subtract(formStates.editProfile.date, 1, 'day');
	// 	getEditDriverDailyForm();
	// };

	// const toggleEvents = async (all: boolean) => {
	// 	const action = all ? 'selectAll' : 'clearAll';
	// 	await boostWebWorkerService.workerToggleEvents(detailList.value, action, (selectedIds: Set<any>, selectedEvents: any[]) => {
	// 		selectedRowSet.value = selectedIds;
	// 		triggerRef(selectedRowSet);

	// 		if (!all) {
	// 			selectionStates.firstChecked = null;
	// 			selectionStates.lastChecked = null;
	// 		}
	// 	});
	// };

	// const selectEvent = (row: any) => {
	// 	let parentIndex = null,
	// 		childIndex = null;
	// 	let firstNewChecked = null,
	// 		lastNewChecked = null;

	// 	for (let i = 0; i < detailList.value.length; i++) {
	// 		for (let j = 0; j < detailList.value[i].events.length; j++)
	// 			if (detailList.value[i].events[j].id == row.id) {
	// 				parentIndex = i;
	// 				childIndex = j;
	// 				break;
	// 			}
	// 	}

	// 	if (parentIndex == null || childIndex == null) {
	// 		return;
	// 	}

	// 	if (uiStates.isShiftPressed && selectionStates.firstChecked && selectionStates.lastChecked) {
	// 		if (
	// 			selectionStates.firstChecked.parentIndex > parentIndex ||
	// 			(selectionStates.firstChecked.parentIndex === parentIndex && selectionStates.firstChecked.childIndex > childIndex) ||
	// 			selectionStates.lastChecked.parentIndex > parentIndex ||
	// 			(selectionStates.lastChecked.parentIndex === parentIndex && selectionStates.lastChecked.childIndex > childIndex)
	// 		) {
	// 			selectionStates.firstChecked = { parentIndex, childIndex };
	// 		}
	// 		if (
	// 			selectionStates.lastChecked.parentIndex < parentIndex ||
	// 			(selectionStates.lastChecked.parentIndex === parentIndex && selectionStates.lastChecked.childIndex < childIndex)
	// 		) {
	// 			selectionStates.lastChecked = { parentIndex, childIndex };
	// 		}

	// 		const { parentIndex: firstParentIndex, childIndex: firstChildIndex } = selectionStates.firstChecked;
	// 		const { parentIndex: lastParentIndex, childIndex: lastChildIndex } = selectionStates.lastChecked;

	// 		for (let parentInd = firstParentIndex; parentInd <= lastParentIndex; parentInd++) {
	// 			const parent = detailList.value[parentInd].events;
	// 			const startChildInd: number = parentInd == firstParentIndex ? firstChildIndex : 0;
	// 			const endChildInd: number = parentInd == lastParentIndex ? lastChildIndex + 1 : parent.length;
	// 			for (let j = startChildInd; j < endChildInd; j++) {
	// 				if (selectedRowSet.value.has(parent[j].id)) {
	// 					selectedRowSet.value.delete(parent[j].id);
	// 				} else {
	// 					selectedRowSet.value.add(parent[j].id);
	// 					selectedRows.value.push(unproxify(parent[j]));
	// 					if (firstNewChecked == null) {
	// 						firstNewChecked = {
	// 							parentIndex: parentInd,
	// 							childIndex: j
	// 						};
	// 					}
	// 					lastNewChecked = {
	// 						parentIndex: parentInd,
	// 						childIndex: j
	// 					};
	// 				}
	// 			}
	// 		}

	// 		selectionStates.firstChecked = firstNewChecked;
	// 		selectionStates.lastChecked = lastNewChecked;

	// 		selectedRows.value = selectedRows.value.filter((rowItem: any) => selectedRowSet.value.has(rowItem.id));
	// 	} else if (!uiStates.isShiftPressed) {
	// 		if (!selectedRowSet.value.has(row.id)) {
	// 			selectedRowSet.value.add(row.id);
	// 		} else {
	// 			selectedRowSet.value.delete(row.id);
	// 		}

	// 		selectedRows.value.push(row);
	// 		selectedRows.value = selectedRows.value.filter((row: any) => selectedRowSet.value.has(row.id));
	// 	}

	// 	if (!selectionStates.lastChecked) selectionStates.lastChecked = { parentIndex, childIndex };
	// 	if (!selectionStates.firstChecked) selectionStates.firstChecked = { parentIndex, childIndex };
	// };

	// const selectRowEvent = (id: string) => {
	// 	chart.value.handleSelectedLineId(id);
	// };

	const selectTab = async (tab: TabResponse) => {
		boostTabService.selectTab(tab);
		await getBoostActions(selectedTab.value?.type);
	};
	const addTab = async () => {
		await boostTabService.addTab(selectTab);
	};
	const removeTab = async (tabId: string) => {
		await boostTabService.removeTab(tabId, selectTab);
	};

	const removeUnnecessaryViolations = () => {
		for (const [type, stringType] of [
			[ResetPinTimesEnum.Cycle, OfficialViolations.Cycle],
			[ResetPinTimesEnum.Shift, OfficialViolations.Shift],
			[ResetPinTimesEnum.Shift, OfficialViolations.Driving],
			[ResetPinTimesEnum.Shift, OfficialViolations.RestBreak]
		]) {
			const [newViolations, _] = getEventViolationsBlock({
				violations: boostPixelViolations.value.flat(),
				type: type as string,
				resetPinTimes: pinTimes.value,
				stringType: stringType,
				headerDate: getStartOf(headerDate.value[0]).format('YYYY-MM-DDTHH:mm:ss'),
				endTime: getEndOf(headerDate.value[1]).format('YYYY-MM-DDTHH:mm:ss'),
				screenResolution: screenResolution.value
			});
			boostPixelViolations.value = [...newViolations];
		}
	};

	const getBoostActions = async (tabType: number = 2) => {
		if (currentAbortController.value) {
			currentAbortController.value.abort();
		}
		currentAbortController.value = new AbortController();
		const { signal } = currentAbortController.value;

		if (tabs.value.length > 0 && initialTabEventsSet.value.size == 0) {
			const model = {
				tabId: tabs.value?.[0]?.id as string,
				sessionId: sessionId.value as string
			};
			await boostEventsStore.getHistoryBoostEvents(model, signal);
		}

		const model = {
			tabId: selectedTab.value?.id as string,
			sessionId: sessionId.value as string
		};
		if (selectedTab.value?.type !== tabType) {
			await boostTabService.updateTab(tabType);
		}

		await Promise.allSettled([
			boostEventsStore.getHistoryBoostGraph({ ...model, screenResolution: screenResolution.value }, signal),
			boostStore.getBoostViolations({ tabId: selectedTab.value?.id, sessionId: sessionId.value, screenResolution: screenResolution.value } as BoostViolationRequest, signal),
			boostEventsStore.getHistoryBoostEvents(model, signal),
			boostStore.getHistoryFreeTimes({ ...model, screenResolution: screenResolution.value }, signal),
			boostEventsStore.getHistoryBoostResetPinTimes({ ...model, screenResolution: screenResolution.value }, signal),
			boostStore.getHistoryBoostSummaries(model, signal),
			boostStore.getHistoryBoostViolations(model, signal),
			boostStore.getHistoryBoostTimeRemainder(model, signal),
			editDriverDailyFormsStore.getEditDriverDailyForms(model, signal)
		]);
		if (signal.aborted) {
			return;
		}
		loadingStates.isBoostEventsLoaded = true;
		console.timeEnd('all-requests');

		await updateJustifyClass();
		console.time('collect');
		collectAllBoostEventsErrorsAndWarnings(boostEvents.value);
		console.timeEnd('collect');

		/* REMOVE UNNECESSARY VIOLATIONS */
		console.log(boostPixelViolations.value.flat().length, 'boost pixel violations changed before');
		removeUnnecessaryViolations();
		console.log(boostPixelViolations.value.flat().length, 'boost pixel violations changed after');

		console.time('Pixel violations');
		workerPixelViolation(toRaw(boostPixelViolations.value), toRaw(pinTimes.value));
		console.timeEnd('Pixel violations');
		currentAbortController.value = null;
	};

	// LocationService
	// const copyLongLat = async () => {
	// 	await boostLocationService.copyLongLat(formStates.editStatus);
	// };
	// const pasteLongLat = async () => {
	// 	await boostLocationService.pasteLongLat(formStates.editStatus);
	// };
	// const redirectToMap = async () => {
	// 	await boostLocationService.redirectToMap(formStates.editStatus);
	// };
	// const debouncedChangeLocation = debounce(async (lat: number | string | null, long: number | string | null) => {
	// 	if (lat && long) {
	// 		await geoLocationsStore.getCalculatedAddress({ latitude: lat as number, longitude: long as number });
	// 		formStates.editStatus.location = calculatedAddress.value as string;
	// 	}
	// }, 300);

	// BoostEvents
	// const handleEventSelect = (newValue: any) => {
	// 	boostEventService.handleEventSelect(newValue, uiStates);
	// };
	const submitEditBoostEvent = async () => {
		await boostEventService.submitEditBoostEvent(loadingStates, formStates.editStatus, modalStates, selectionStates, getBoostActions);
	};
	const submitBoostEvents = async () => {
		await boostEventService.submitBoostEvents(getBoostActions, loadingStates);
	};
	const copyBoostEvent = async (eventId: string) => {
		await boostEventService.copyBoostEvent(eventId, getBoostActions);
	};
	const revertBoostEvent = async (eventId: string) => {
		await boostEventService.revertBoostEvent(eventId, getBoostActions);
	};
	const deleteBoostEvent = async (eventId: string) => {
		await boostEventService.deleteBoostEvent(eventId, getBoostActions);
	};
	const openEditBoostEvent = async (id: string) => {
		await boostEventService.openEditBoostEvent(id, formStates.editStatus, modalStates);
	};
	const detectNearestErrorOrWarningEvent = () => {
		boostEventService.detectNearestErrorOrWarningEvent(detailList, chartStates, table);
	};
	const updateBoostEventsWith = (newEvents: BoostEventResponse[]) => {
		const mp = new Map<string, BoostEventResponse>();
		newEvents.forEach((newEv) => {
			mp.set(newEv.id, newEv);
		});
		if (boostEvents.value) {
			const updatedBoostEvents = boostEvents.value.map((eventsGroup) => {
				if (eventsGroup?.events) {
					return {
						...eventsGroup,
						events: eventsGroup.events.map((ev, ind) => (mp.has(ev.id) ? mp.get(ev.id)! : ev))
					};
				}
				return eventsGroup;
			});

			detailList.value = mapBoostEvents(updatedBoostEvents);
		}
	};
	const mapBoostEvents = (boostEvents?: BoostEventsResponse[] | null) => {
		if (!boostEvents?.length) return [];

		return boostEvents.map((dailyEvent) => {
			const dateKey = formatTime(dailyEvent.date, 'YYYY-MM-DD');

			return {
				date: acceptAsTimeZone(dailyEvent.date).format('YYYY-MM-DD'),
				dailyForm: dailyFormsMap.value.get(dateKey),
				events: dailyEvent.events?.map((event) => boostEventService.mapSingleEvent(event)) || []
			};
		});
	};

	// WebWorker
	const webWorkerNormalize = async (events: BoostEventResponse[], pinTimes: { time: Dayjs; type: string }[]) => {
		return await boostWebWorkerService.webWorkerNormalize(events, pinTimes, updateBoostEventsWith);
	};
	const workerPixelViolation = async (pixelViolations: ViolationPixelResponse[], pinTimes: ResetPinTimes[]) => {
		return await boostWebWorkerService.workerPixelViolation(pixelViolations, pinTimes, headerDate, screenResolution, allViolationBlocks);
	};

	const collectAllBoostEventsErrorsAndWarnings = async (events?: BoostEventsResponse[] | null) => {
		const allEvents = events?.flatMap((item) => toRaw(item.events));
		try {
			loadingStates.isBoostEventsLoaded = true;
			const eventsWithoutArchived = allEvents?.filter((e) => e.actionState != 4);
			if (eventsWithoutArchived!.length > 0) {
				webWorkerNormalize(eventsWithoutArchived!, pinTimes.value);
			}
			detailList.value = mapBoostEvents(boostEvents.value);
		} catch (error) {
			console.log(error);
		} finally {
			isBoostEventsLoading.value = false;
			console.log(
				"Event's Errors",
				allEvents?.flatMap((item: BoostEventResponse) => item?.errorTitles).filter((item) => item !== undefined)
			);
			console.log(
				"Event's Warnings",
				allEvents?.flatMap((item: BoostEventResponse) => item?.warningTitles).filter((item) => item !== undefined)
			);
		}
	};

	// const openNextLog = async () => {
	// 	navigateTo({ query: { ...route.query, sessionId: undefined, activity: undefined } });
	// 	loadingStates.isBoostEventsLoaded = false;
	// 	loadingStates.isBoostEventsSubmitted = false;
	// 	isBoostTimeMoved.value = {};
	// };

	const loadBoostEvents = async (isSessionCreated: boolean = false) => {
		loadingStates.loadingBoostEvents = true;
		const sessionModel: SessionRequest = {
			driverId: selectionStates.selectedDriver as string,
			type: 1,
			startDate: formatToUTC(getStartOf(headerDate.value[0])),
			endDate: formatToUTC(getEndOf(headerDate.value[1])),
			status: 0
		};
		loadingStates.isBoostEventsLoaded = false;
		localStorage.setItem('initialTabEventsSet', JSON.stringify(new Set([])));
		initialTabEventsSet.value = new Set();
		submitsCount.value = 0;
		selectedRows.value = [];
		selectedRowSet.value.clear();
		try {
			if (!isSessionCreated) {
				await sessionStore.addSession(sessionModel);
			}

			// getting tabs by session
			await tabStore.getTabs(sessionId.value as string);
			selectedTab.value = tabs.value?.at(-1);

			await getBoostActions(!isSessionCreated ? 1 : selectedTab.value?.type);
			console.time('render');
			await nextTick(); // Wait for DOM update
			console.timeEnd('render');

			// setting sessionId to route
			navigateTo({ query: { ...route.query, sessionId: sessionId.value } });

			loadingStates.isBoostEventsLoaded = true;
		} catch (error) {
			loadingStates.isBoostEventsLoaded = false;
			console.log(error);
		} finally {
			loadingStates.loadingBoostEvents = false;
		}
	};

	// Watchers
	watch(
		() => selectionStates.selectedDriver,
		() => {
			navigateTo(
				`/logs/${selectionStates.selectedDriver}/boost` +
					`?fromDate=${getStartOf(headerDate.value[0]).format('YYYY-MM-DDTHH:mm:ss')}&toDate=${getEndOf(headerDate.value[1]).format('YYYY-MM-DDTHH:mm:ss')}`
			);
		}
	);

	// watch([() => formStates.editStatus.latitude, () => formStates.editStatus.longitude], async ([newLat, newLong]) => {
	// 	debouncedChangeLocation(newLat, newLong);
	// });

	// watch(
	// 	() => selectionStates.selectAllOptimizeCategories,
	// 	(value) => {
	// 		if (value) {
	// 			optimizeCategories.value.forEach((category) => {
	// 				selectionStates.selectedOptimizeCategories[category.id] = true;
	// 			});
	// 		} else {
	// 			selectionStates.selectedOptimizeCategories = {};
	// 		}
	// 	}
	// );

	// watch(
	// 	() => formStates.editStatus.event?.eventType,
	// 	(newType) => {
	// 		uiStates.isVisibleCertifiedDate = newType !== 4;
	// 	},
	// 	{ immediate: true }
	// );

	watch(
		() => boostEvents.value,
		() => {
			if (selectedTab.value?.id == tabs.value?.at(-1)?.id) {
				unchangedEventIds.value.clear();
				changedEventIdsSet.value.clear();
				boostEvents.value?.forEach((item: any) => {
					item.events.forEach((ev: any) => {
						if (!initialTabEventsSet.value.has(ev.id)) {
							changedEventIdsSet.value.add(ev.id);
						}
					});
				});
			}
		},
		{ immediate: true }
	);

	// watch(
	// 	() => driverStore.drivers,
	// 	(newDrivers) => {
	// 		drivers.value = newDrivers?.map((driver) => ({
	// 			id: driver.id,
	// 			name: `${driver.user.firstName} ${driver.user.lastName}`
	// 		}));
	// 	},
	// 	{ immediate: true }
	// );

	// watch(
	// 	() => selectedRowSet.value,
	// 	(newValue) => {
	// 		const currentUnchanged = unchangedEventIds.value;
	// 		const changedSet = changedEventIdsSet.value;

	// 		// Early exit for no-op cases
	// 		if (newValue.size === 0 && currentUnchanged.size === 0) {
	// 			return;
	// 		}

	// 		// Smart algorithm selection based on data size
	// 		if (newValue.size < currentUnchanged.size / 2) {
	// 			// Rebuild approach (faster for small selections)
	// 			const newUnchangedIds = new Set<string>();

	// 			for (const id of newValue) {
	// 				if (id && !changedSet.has(id)) {
	// 					newUnchangedIds.add(id);
	// 				}
	// 			}

	// 			for (const id of currentUnchanged) {
	// 				if (changedSet.has(id)) {
	// 					newUnchangedIds.add(id);
	// 				}
	// 			}

	// 			unchangedEventIds.value = newUnchangedIds;
	// 			triggerRef(unchangedEventIds);
	// 		} else {
	// 			// Batch operations approach
	// 			const toRemove = [];
	// 			const toAdd = [];

	// 			for (const id of currentUnchanged) {
	// 				if (!newValue.has(id) && !changedSet.has(id)) {
	// 					toRemove.push(id);
	// 				}
	// 			}

	// 			for (const id of newValue) {
	// 				if (id && !changedSet.has(id) && !currentUnchanged.has(id)) {
	// 					toAdd.push(id);
	// 				}
	// 			}

	// 			if (toRemove.length > 0 || toAdd.length > 0) {
	// 				const newUnchangedIds = new Set(currentUnchanged);
	// 				toRemove.forEach((id) => newUnchangedIds.delete(id));
	// 				toAdd.forEach((id) => newUnchangedIds.add(id));

	// 				unchangedEventIds.value = newUnchangedIds;
	// 				triggerRef(unchangedEventIds);
	// 			}
	// 		}
	// 	},
	// 	{ deep: false }
	// );

	watch(
		() => [headerDate.value[0], headerDate.value[1]],
		() => {
			if (!selectionStates.selectedDriver) return;

			const dateQuery =
				headerDate.value[0] && headerDate.value[1]
					? `?fromDate=${getStartOf(headerDate.value[0]).format('YYYY-MM-DDTHH:mm:ss')}&toDate=${getEndOf(headerDate.value[1]).format('YYYY-MM-DDTHH:mm:ss')}`
					: '';

			navigateTo(`/logs/${selectionStates.selectedDriver}/boost` + dateQuery);

			loadingStates.isBoostEventsLoaded = false;
			loadingStates.isBoostEventsSubmitted = false;
			isBoostTimeMoved.value = {};

			loadBoostEvents();
		}
	);

	// On Mounted
	onMounted(async () => {
		screenResolution.value = document.documentElement.clientWidth - SCREEN_RESOLUTION_OFFSET.BASE - (sidebar.value === 'open' ? SCREEN_RESOLUTION_OFFSET.SIDEBAR_OPEN : 0);
		await Promise.allSettled([driverStore.getDriversFilter(false), optimizeStore.getOptimizeCategories(), driverInfosStore.getDriverTimeZone(route.params.id as string)]);

		if (route.query?.sessionId) {
			let result = await sessionStore.getSession(route.query.sessionId as string);
			if (!result) {
				navigateTo({ query: { fromDate: getStartOf(headerDate.value[0]).format('YYYY-MM-DDTHH:mm:ss'), toDate: getEndOf(headerDate.value[1]).format('YYYY-MM-DDTHH:mm:ss') } });
			} else {
				loadingStates.isBoostEventsSubmitted = !!session.value?.isSubmitted;
				await loadBoostEvents(true);
			}
		} else {
			await loadBoostEvents(false);
		}
	});

	onUnmounted(() => {
		localStorage.setItem('initialTabEventsSet', JSON.stringify(new Set([])));
		initialTabEventsSet.value = new Set();
	});

	// Returning Data
	return {
		// Modal States
		...toRefs(modalStates),

		// Selection States
		...toRefs(selectionStates),

		// Loading States,
		...toRefs(loadingStates),

		// UI States
		...toRefs(uiStates),

		// Chart States
		...toRefs(chartStates),

		// Form States
		...toRefs(formStates),

		isBoostGraphLoading,
		isBoostEventsLoading,

		// Chart ref,
		chart,

		// Drivers and Header
		drivers,
		headerDate,

		// Edit driver daily form,
		setEditProfileDate,
		validateProfileForm,
		openEditDriverDailyForm,
		submitEditDailyForm,
		isEditDriverDailyFormDisabled,

		// Optimization Settings
		isOptimized,
		optimizeCategories,
		submitOptimizeCategories,
		screenResolution,

		// Tabs
		tabs,
		selectedTab,
		selectTab,
		addTab,
		removeTab,
		getBoostActions,
		validateStatusForm,
		copyLongLat,
		pasteLongLat,
		redirectToMap,

		// Boost Form
		table,
		selectedMoveEvents,
		isMoveTimeEventsReversed,
		isBoostFormDisabled,
		getSelectedMoveEvents,
		handleMoveTimeEventsReversing,
		reverseMoveTimeEvents,
		detectNearestErrorOrWarningEvent,
		openBoostModal,
		validateBoostForm,
		submitBoostForm,
		getSelectedEvent,

		// Table and Events
		selectedRows,
		columns,
		errorAndWarningColumns,
		expand,
		toggleEvents,
		selectEvent,
		selectRowEvent,

		// Boost Events
		detailList,
		openEditBoostEvent,
		submitEditBoostEvent,
		isEditBoostEventDisabled,
		copyBoostEvent,
		deleteBoostEvent,
		revertBoostEvent,
		submitBoostEvents,
		isBoostTimeMoved,

		// Chart and Graphs
		updateChartWidth,
		loadBoostEvents,
		boostGraph,
		handleEventSelect,

		// Violations
		boostViolations,
		boostPixelViolations,
		allViolationBlocks,
		// Event Filters
		eventFilterItems,

		// Summaries
		boostSummaries,

		// Time Remainder
		boostTimeRemainder,

		// Next Log
		openNextLog,

		// Boost Free Times
		boostFreeTimes,
		freeTimeScroller,
		scrollPrev,
		scrollNext,
		isAtStart,
		isAtEnd,
		shouldShowActionButton,

		// Progress Bar Events
		totalEvents,
		changedEventIdsSet,
		unchangedEventIds,
		submitsCount
	};
};
