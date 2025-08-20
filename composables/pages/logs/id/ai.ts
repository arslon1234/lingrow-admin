// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

// importing packages
import { Dayjs } from 'dayjs';

// importing stores
import { useIndex } from '~/store';
import { useAI } from '~/store/ai';
import { useBoostStore } from '~/store/boost';
import { useBoostEventsStore } from '~/store/boostEvents';
import { useDriversStore } from '~/store/drivers';
import { useSessionsStore } from '~/store/sessions';
import { useTabsStore } from '~/store/tabs';

import { chartColors } from '../constants'
export const useLogsAiComposable = async () => {
	// access token
	const accessToken = useCookie('access_token');

	// runtime config
	const runtimeConfig = useRuntimeConfig(); 
	const baseURLChat = runtimeConfig.public.BASE_URL_CHAT as string;

	// route
	const route = useRoute();

	// stores
	const index = useIndex();
	const driverStore = useDriversStore();
	const boostStore = useBoostStore();
	const boostEventsStore = useBoostEventsStore();
	const sessionStore = useSessionsStore();
	const tabStore = useTabsStore();
	const aiStore = useAI();

	// destructuring stores
	const { sidebar } = storeToRefs(index);
	const { drivers } = storeToRefs(driverStore);
	const { boostGraph } = storeToRefs(boostEventsStore);
	const { boostTimeRemainder, boostSummaries } = storeToRefs(boostStore);
	const { sessionId, session } = storeToRefs(sessionStore);
	const { tabs } = storeToRefs(tabStore);
	const { aiEventReport, aiMovedTimes, chatHistory } = storeToRefs(aiStore);

	// timezone helper
	const { convertToTimeZone, acceptAsTimeZone, formatToUTC, getStartOf, getEndOf } = useTimeZoneHelper();

	// chart
	const chart = ref();

	// websocket
	const ws = ref();

	// chat settings
	const aiInput = ref<{ $refs: { input: { focus: () => void } } } | null>(null);
	const chatDisabled = ref<boolean>(false);
	const chatPermanentlyDisabled = ref<boolean>(false);
	const chatText = reactive<{ id: number; text: string; time: string | Dayjs; type: string; loading: boolean }[]>([]);
	const chatInput = ref('');
	const chat = ref<HTMLDivElement | null>(null);
	const chatParent = ref<HTMLDivElement | null>(null);

	// chat height
	const chatHeight = ref<number | null>(null);
	const isSubmitted = ref<boolean>(false);
	const isFinished = ref<boolean>(false);
	const selectedTab = ref<TabResponse>();
	const submitLoading = ref<boolean>(false);
	const screenResolution = ref<number>(0);

	// selected events
	const selectedEvent = ref<GraphDuties>();
	const selectedCurrentTime = ref<Dayjs | string>();

	// table loading
	const tableLoading = ref<boolean>(false);

	// header date
	const headerDate = ref<[Dayjs, Dayjs]>([
		route.query?.fromDate ? acceptAsTimeZone(route.query.fromDate as string) : subtract(convertToTimeZone(), 2, 'week'),
		route.query?.toDate ? acceptAsTimeZone(route.query.toDate as string) : convertToTimeZone()
	]);
	const selectedDriver = ref<string>(route.params.id as string);

	const reportsList = computed(() =>
		aiEventReport?.value?.eventReportsByCategory?.map((report: AiEventReportsByCategory) => ({
			label: EventCategory[report.eventCategory as keyof typeof TabActionType],
			actionType: report.eventCategory,
			rows: report.eventReports?.map((tableReport: AiEventReport, ind: number) => ({
				count: ind + 1,
				id: tableReport.prevEventId,
				eventId: tableReport.curEventId,
				date: formatTime(tableReport.dateTime, 'MMM D, YYYY hh:mm A'),
				event: { eventType: tableReport.eventType, eventCode: tableReport.eventCode },
				duration: formatDuration(tableReport.totalDuration),
				time: formatDuration(tableReport.movedDuration),
				location: tableReport.calculatedLocation || tableReport.manualLocation || '-',
				dateChanged: tableReport.dateTimeChanged ? formatTime(tableReport.dateTimeChanged, 'MMM D, YYYY hh:mm A') : '-',
				engineChanged: tableReport.engineHoursChanged ? formatDuration(tableReport.engineHoursChanged) : '-',
				milesChanged: tableReport.vehicleMilesChanged ? tableReport.vehicleMilesChanged + 'mi' : '-',
				locationChanged: tableReport.locationChanged ? tableReport.locationChanged : '-'
			}))
		}))
	);

	const reportsHeader = computed(() => ({
		eventsRepaired: aiEventReport?.value?.eventsRepaired || 0,
		categoriesFailedToFix: aiEventReport?.value?.categoriesFailedToFix || 0,
		eventsModified: aiEventReport?.value?.eventsModified || 0,
		eventsUpdated: aiEventReport?.value?.eventsUpdated || 0,
		eventsCreated: aiEventReport?.value?.eventsCreated || 0,
		eventsDeleted: aiEventReport?.value?.eventsDeleted || 0,
		actionType: reportsList.value?.length && reportsList.value[0]?.actionType,
		failedCategories: aiEventReport?.value?.failedCategories?.map((failedCat) => EventCategory[failedCat]) ?? []
	}));

	// ai & booster chart data
	const pieChartSeries = computed(() => [
		reportsHeader.value.eventsRepaired,
		reportsHeader.value.categoriesFailedToFix,
		reportsHeader.value.eventsModified,
		reportsHeader.value.eventsDeleted,
		reportsHeader.value.eventsCreated,
		reportsHeader.value.eventsUpdated
	]);

	const pieChartOptions = computed(() => {
		return {
			chart: {
				type: 'donut'
			},
			plotOptions: {
				pie: {
					customScale: 1,
					expandOnClick: false,
					offsetX: 0, // Adjust if needed to fine-tune the positioning
					offsetY: 0, // Adjust if needed to fine-tune the positioning
					donut: {
						size: '60%' // Adjust this size for the hole size
					},
					borderRadius: 10, // Rounded corners for pie segments (increase the value to smoothen the edges)
					distributed: true // Adds some spacing between segments
				}
			},
			legend: {
				show: true,
				position: 'left'
			},
			colors: chartColors,
			tooltip: {
				style: {
					fontSize: '16px',
					fontFamily: 'SFPro-Text'
				}
			},
			dataLabels: {
				enabled: false
			},
			labels: ['Repaired', 'Failed', 'Changed Events', 'Deleted', 'Created', 'Updated']
		};
	});
	
	const updateSelectedTab = async (index: number) => {
		selectedTab.value = tabs.value[index];
		if (tabs.value.length !== index + 1 || selectedTab.value?.type === 0) {
			chatDisabled.value = true;

			await Promise.all([
				getAiActions(),
				getAiReports(),
				aiStore.getMovedTimes({ sessionId: sessionId.value as string, tabId: selectedTab.value?.id as string, screenResolution: screenResolution.value })
			]);
		} else {
			chatDisabled.value = false;
			aiMovedTimes.value = [];
			aiEventReport.value = { eventReportsByCategory: [] as AiEventReportsByCategory[] } as AiEventReportsResponse;
			await Promise.all([getAiActions()]);
		}
	};

	const loadAiActions = async () => {
		submitLoading.value = true;
		if (!selectedDriver.value) return;

		const sessionModel: SessionRequest = {
			driverId: selectedDriver.value as string,
			type: 3,
			startDate: formatToUTC(getStartOf(headerDate.value.at(0))),
			endDate: formatToUTC(getEndOf(headerDate.value.at(-1))),
			status: 0
		};

		// getting session
		await sessionStore.addSession(sessionModel);

		// getting tabs by session
		await tabStore.getTabs(sessionId.value as string);
		selectedTab.value = tabs.value?.at(-1);
		chatDisabled.value = false;

		const dateQuery =
			headerDate.value.at(0) && headerDate.value.at(-1)
				? `?fromDate=${getStartOf(headerDate.value.at(0)).format('YYYY-MM-DDTHH:mm:ss')}&toDate=${getEndOf(headerDate.value.at(-1)).format('YYYY-MM-DDTHH:mm:ss')}&sessionId=${
						sessionId.value
					}`
				: '';

		navigateTo(`/logs/${selectedDriver.value}/ai` + dateQuery);
		await Promise.all([getAiActions(), clearActions()]);
		submitLoading.value = false;
	};

	// chart handlers
	const updateChartWidth = async (width: number) => {
		screenResolution.value = width;

		if (selectedTab.value && sessionId.value) {
			await Promise.all([
				boostEventsStore.getHistoryBoostGraph({ tabId: selectedTab.value?.id as string, sessionId: sessionId.value as string, screenResolution: screenResolution.value }),
				aiStore.getMovedTimes({ sessionId: sessionId.value as string, tabId: selectedTab.value?.id as string, screenResolution: screenResolution.value })
			]);
		}
	};

	// clear actions
	const clearActions = () => {
		chatText.splice(0, chatText.length);
		chatHistory.value = [];
		aiEventReport.value = { eventReportsByCategory: [] as AiEventReportsByCategory[] } as AiEventReportsResponse;
		aiMovedTimes.value = [];
		isSubmitted.value = false;
		isFinished.value = false;
		chatDisabled.value = false;
		chatPermanentlyDisabled.value = false;
	};

	const updateHeight = () => {
		if (chat.value) {
			chatHeight.value = chatParent.value?.clientHeight as number;
		}
	};

	const selectEvent = (event: GraphDuties, currentTime: string | Dayjs) => {
		selectedEvent.value = event;
		selectedCurrentTime.value = currentTime;
	};

	const getAiReports = async () => {
		tableLoading.value = true;
		try {
			await aiStore.getEventReports({
				sessionId: sessionId.value as string,
				tabId: selectedTab.value?.id as string
			});
		} catch (error) {
			console.log(error);
		} finally {
			tableLoading.value = false;
		}
	};

	const chatEvents = async (event: string) => {
		chatText.push({
			id: chatText.length + 1,
			text: event,
			time: convertToTimeZone().format('hh:mm A'),
			type: 'client',
			loading: false
		});

		chatText.push({
			id: chatText.length + 1,
			text: '',
			time: '',
			type: 'system',
			loading: true
		});

		try {
			chatDisabled.value = true;
			await ws.value.send(
				JSON.stringify({
					sessionId: sessionId.value as string,
					tabSessionId: sessionId.value as string,
					tabId: selectedTab.value?.id as string,
					eventSelected: !!selectedEvent.value,
					event: selectedEvent.value ? { id: selectedEvent.value?.eventId, date: selectedCurrentTime.value } : null,
					token: accessToken.value,
					message: event,
					fromDate: convertToTimeZone(getStartOf(headerDate.value[0])).format(),
					toDate: convertToTimeZone(getEndOf(headerDate.value[1])).format(),
					currentDate: convertToTimeZone().format()
				})
			);
		} catch (error) {
			const lastChat = chatText.at(-1);
			if (lastChat) {
				'Error occured during opening shift ❌'.split(' ').forEach((char: string, index: number) => {
					setTimeout(() => {
						lastChat.text += (index !== 0 ? ' ' : '') + char;
					}, index * 150);
				});
				lastChat.time = convertToTimeZone().format('hh:mm A');
				lastChat.loading = false;
			}
		} finally {
			chatDisabled.value = false;
			await nextTick();
			aiInput.value?.$refs?.input.focus();
		}
	};

	const submitChatText = async () => {
		const chatMessage = chatInput.value.trim();
		if (chatMessage) {
			chatInput.value = '';
			chatText.push({
				id: chatText.length + 1,
				text: chatMessage,
				time: convertToTimeZone().format('hh:mm A'),
				type: 'client',
				loading: false
			});

			chatText.push({
				id: chatText.length + 1,
				text: '',
				time: '',
				type: 'system',
				loading: true
			});

			try {
				chatDisabled.value = true;
				await ws.value.send(
					JSON.stringify({
						sessionId: sessionId.value as string,
						tabSessionId: sessionId.value as string,
						tabId: selectedTab.value?.id as string,
						eventSelected: !!selectedEvent.value,
						event: selectedEvent.value ? { id: selectedEvent.value?.eventId, date: selectedCurrentTime.value } : null,
						token: accessToken.value,
						message: chatMessage,
						fromDate: convertToTimeZone(getStartOf(headerDate.value[0])).format(),
						toDate: convertToTimeZone(getEndOf(headerDate.value[1])).format(),
						currentDate: convertToTimeZone().format()
					})
				);
			} catch (error) {
				const lastChat = chatText.at(-1);
				if (lastChat) {
					'Error occured during opening shift ❌'.split(' ').forEach((char: string, index: number) => {
						setTimeout(() => {
							lastChat.text += (index !== 0 ? ' ' : '') + char;
						}, index * 150);
					});
					lastChat.time = convertToTimeZone().format('hh:mm A');
					lastChat.loading = false;
				}
			} finally {
				chatDisabled.value = false;
				await nextTick();
				aiInput.value?.$refs?.input.focus();
			}
		}
	};

	const scrollToBottom = () => {
		nextTick(() => {
			if (chat.value) {
				chat.value.scrollTop = chat.value.scrollHeight;
			}
		});
	};

	defineShortcuts({
		enter: {
			usingInput: 'chatInput',
			handler: () => {
				if (chatInput.value) {
					submitChatText();
				}
			}
		}
	});

	// table data
	const columns = [
		{
			key: 'count',
			label: '#'
		},
		{
			key: 'date',
			label: 'Date'
		},
		{
			key: 'event',
			label: 'Event'
		},
		{
			key: 'duration',
			label: 'Total duration'
		},
		{
			key: 'time',
			label: 'Moved time'
		},
		{
			key: 'location',
			label: 'Location'
		},
		{
			key: 'dateChanged',
			label: 'Date Changed'
		},
		{
			key: 'engineChanged',
			label: 'Engine Hours Changed'
		},
		{
			key: 'milesChanged',
			label: 'Vehicle Miles Changed'
		},
		{
			key: 'locationChanged',
			label: 'Location Changed'
		}
	];

	// get all actions
	const getAiActions = async () => {
		const model = {
			tabId: selectedTab.value?.id as string,
			sessionId: sessionId.value as string
		};
		await Promise.all([
			boostEventsStore.getHistoryBoostGraph({ ...model, screenResolution: screenResolution.value }),
			boostStore.getHistoryBoostSummaries(model),
			boostStore.getHistoryBoostTimeRemainder(model)
		]);
	};

	const submitAI = async () => {
		submitLoading.value = true;
		try {
			const result = await aiStore.submitAI(sessionId.value as string);
			if (result) {
				isSubmitted.value = true;
				isFinished.value = true;
			}
		} catch (error) {
			console.error(error);
		} finally {
			submitLoading.value = false;
		}
	};

	// watchers
	watch(
		() => [headerDate.value.at(0), headerDate.value.at(-1)],
		async () => {
			await loadAiActions()
		}
	);
	watch(chatText, () => {
		scrollToBottom();
	});

	watch(selectedDriver, (newValue) => {
		navigateTo(
			`/logs/${newValue}/ai?fromDate=${getStartOf(headerDate.value.at(0)).format('YYYY-MM-DDTHH:mm:ss')}&toDate=${getEndOf(headerDate.value.at(-1)).format('YYYY-MM-DDTHH:mm:ss')}`
		);
	});

	onMounted(() => {
		if (chatParent.value) {
			updateHeight(); // Initial height
			const resizeObserver = new ResizeObserver(updateHeight);
			resizeObserver.observe(chatParent.value);
		}
	});

	onMounted(async () => {
		if (!route.query.fromDate || !route.query.toDate) {
			navigateTo(
				`/logs/${selectedDriver.value}/ai?fromDate=${getStartOf(headerDate.value.at(0)).format('YYYY-MM-DDTHH:mm:ss')}&toDate=${getEndOf(headerDate.value.at(-1)).format(
					'YYYY-MM-DDTHH:mm:ss'
				)}`
			);
		}

		screenResolution.value = document.documentElement.clientWidth - 244 - (sidebar.value === 'open' ? 170 : 0);

		const sessionModel: SessionRequest = {
			driverId: selectedDriver.value as string,
			type: 3,
			startDate: formatToUTC(getStartOf(headerDate.value.at(0))),
			endDate: formatToUTC(getEndOf(headerDate.value.at(-1))),
			status: 0
		};

		// getting session
		if (!route.query?.sessionId) {
			await sessionStore.addSession(sessionModel);
			navigateTo({ query: { ...route.query, sessionId: sessionId.value } });
		} else {
			let result = await sessionStore.getSession(route.query.sessionId as string);
			if (!result) {
				await sessionStore.addSession(sessionModel);
				navigateTo({ query: { ...route.query, sessionId: sessionId.value } });
			} else {
				isSubmitted.value = session.value?.isSubmitted as boolean;
			}
		}

		// getting tabs by session
		await tabStore.getTabs(sessionId.value as string);
		selectedTab.value = tabs.value?.at(-1);

		await Promise.all([
			driverStore.getDriversFilter(false),
			aiStore.getChatHistory({ sessionId: sessionId.value as string, tabId: selectedTab.value?.id as string }),
			getAiActions(),
			getAiReports()
		]);

		// chat history
		chatHistory.value.forEach((chat, ind) => {
			chatText.push({
				id: ind + 1,
				text: chat.message,
				time: convertToTimeZone(chat.dateTime).format('hh:mm A'),
				type: chat.messageType === 1 ? 'system' : 'client',
				loading: false
			});
		});

		// websocket
		ws.value = new WebSocket(baseURLChat);
		// ws.value = new WebSocket('ws://localhost:8765');
		ws.value.onopen = () => console.log(`✅ WebSocket connected`);
		ws.value.onmessage = async (event: any) => {
			const message = JSON.parse(event.data);

			if (message.type === 'connection_established' || message.type === 'response' || message.type === 'final' || message.type === 'error') {
				let lastChat = chatText.at(-1);
				if (!lastChat) {
					chatText.push({
						id: chatText.length + 1,
						text: '',
						time: convertToTimeZone().format('hh:mm A'),
						type: 'system',
						loading: false
					});
				}
				lastChat = chatText.at(-1);
				if (lastChat) {
					message?.message.split(' ').forEach((char: string, index: number) => {
						setTimeout(() => {
							lastChat.text += (index !== 0 ? ' ' : '') + char;
						}, index * 150);
					});
					lastChat.time = convertToTimeZone().format('hh:mm A');
					lastChat.loading = false;
				}
				if (message.type === 'final') {
					// const tabModel: TabRequest = {
					// 	name: TabTypes[1],
					// 	type: 1,
					// 	sessionId: sessionId.value as string
					// };
					// const result = await tabStore.addTab(tabModel);
					// if (result) {
					await tabStore.getTabs(sessionId.value as string);
					selectedTab.value = tabs.value?.at(-1);
					chart.value.clearSelectedEvent();
					selectedEvent.value = undefined;
					selectedCurrentTime.value = undefined;
					await Promise.all([getAiActions(), getAiReports()]);
					// }
				}
			} else if (message.type === 'ack') {
				const lastChat = chatText.at(-1);
				if (lastChat) {
					// lastChat.text = 'Your request is being processed!';
					// lastChat.time = convertToTimeZone().format('hh:mm A');
					// lastChat.loading = false;

					// await aiStore.addChat({
					// 	driverId: selectedDriver.value as string,
					// 	tabId: selectedTab.value?.id as string,
					// 	sessionId: sessionId.value as string,
					// 	dateTime: formatToUTC(subtract(convertToTimeZone(), 1, 'second')),
					// 	message: 'Your request is being processed!',
					// 	messageType: 1
					// });

					// chatText.push({
					// 	id: chatText.length + 1,
					// 	text: '',
					// 	time: '',
					// 	type: 'system',
					// 	loading: true
					// });
					const lastChat = chatText.at(-1);
					if (lastChat) {
						lastChat.loading = false;
						message.message.split(' ').forEach((char: string, index: number) => {
							setTimeout(() => {
								lastChat.text += (index !== 0 ? ' ' : '') + char;
							}, index * 150);
						});
						lastChat.time = convertToTimeZone().format('hh:mm A');
					}
					chatText.push({
						id: chatText.length + 1,
						text: '',
						time: '',
						type: 'system',
						loading: true
					});
				}
			} else if (message.type === 'clear_history') {
				chatPermanentlyDisabled.value = true;
			}
		};
		ws.value.onclose = () => console.log(`❌ WebSocket disconnected`);
		ws.value.onerror = (error: any) => console.error(`⚠️ WebSocket error:`, error);
	});

	return {
		isFinished,
		isSubmitted,
		submitAI,
		submitLoading,
		chatParent,
		chart,
		aiInput,
		drivers,
		headerDate,
		selectedDriver,
		selectedTab,
		chatText,
		chatInput,
		chat,
		chatEvents,
		submitChatText,
		loadAiActions,
		columns,
		reportsHeader,
		reportsList,
		boostSummaries,
		boostTimeRemainder,
		boostGraph,
		updateChartWidth,
		tabs,
		updateSelectedTab,
		chatDisabled,
		chatPermanentlyDisabled,
		selectEvent,
		aiMovedTimes,
		chatHeight,
		pieChartSeries,
		pieChartOptions
	};
};
