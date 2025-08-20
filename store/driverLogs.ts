import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

export const useDriverLogs = defineStore('driverLogs', () => {
	// route
	const route = useRoute();

	// driver processing events
	const driverLogs = ref<DriverLogsResponse[]>();
	const totalCount = ref<number>(0);

	// Loading states
	const isGraphDataLoading = ref(false);
	const isPixelDataLoading = ref(false);
	const isDailyEventsLoading = ref(false)
	// driver logs chart data
	const chartData = ref<GraphResponse>();
	const editChartData = ref<GraphResponse>();

	// driver logs daily events
	const dailyEvents = ref<DriverLogsDailyEventsResponse[]>();

	// driver logs daily time remainder
	const dailyTimeRemainder = ref<HosTimeRemainder>();

	// driver logs daily summary
	const dailySummary = ref<DailySummaryResponse>();

	// driver logs daily pixel violations
	const dailyPixelViolations = ref<ViolationPixelResponse[][]>([]);
	const weeklyViolations = ref<DriverLogsWeeklyViolationResponse[]>();

	// Computed loading state
	const isGraphLoading = computed(() => isGraphDataLoading.value || isPixelDataLoading.value);

	async function getDriverLogsFilter(getPartial: boolean = true) {
		const model = {
			carrierId: getCarrierId(),
			startDate: null,
			endDate: null,
			hasViolation: !route.query.hasViolation ? null : route.query.hasViolation === 'true',
			isConnected: !route.query.status ? null : route.query.status === 'true',
			...pagination(getPartial)
		};

		const response = await useAxios().getRequest(ApiUrls.DRIVER_LOGS_PROCESSING_URL, capitalizeKeys(model));

		if (response.status === 200) {
			driverLogs.value = response.data.successResult.data;
			totalCount.value = response.data.successResult.totalCount;
		}
	}

	async function getDriverLogsDailyGraph(model: DriverDateTimeRequest, isEdit: boolean = false, signal?: AbortSignal) {
		isGraphDataLoading.value = true;
		try {
			const response = await useAxios().getRequest(ApiUrls.DRIVER_LOGS_DAILY_GRAPH_URL, capitalizeKeys(model), {}, signal);
			if (response.status === 200) {
				if (!isEdit) chartData.value = response.data.successResult;
				else editChartData.value = response.data.successResult;
			}
		} finally {
			isGraphDataLoading.value = false;
		}
	}

	async function getDriverLogsDailyEvents(model: DriverLogsDailyEventsRequest, signal?:AbortSignal) {
		isDailyEventsLoading.value = true
		try{
			const response = await useAxios().getRequest(ApiUrls.DRIVER_LOGS_DAILY_EVENTS_URL, capitalizeKeys(model), {}, signal);

		if (response.status === 200) {
			dailyEvents.value = response.data.successResult || [];
		}
		}finally{
			isDailyEventsLoading.value = false
		}
		
	}

	async function getDriverLogsDailyTimeRemainder(model: DriverLogsDailyEventsRequest) {
		const response = await useAxios().getRequest(ApiUrls.DRIVER_LOGS_DAILY_TIME_REMAINDER_URL, capitalizeKeys(model));

		if (response.status === 200) {
			dailyTimeRemainder.value = response.data.successResult;
		}
	}

	async function getDriverLogsDailySummary(model: DriverLogsDailyEventsRequest,signal?:AbortSignal) {
		const response = await useAxios().getRequest(ApiUrls.DRIVER_LOGS_DAILY_SUMMARY_URL, capitalizeKeys(model), {}, signal);

		if (response.status === 200) {
			dailySummary.value = response.data.successResult;
		}
	}

	async function getDriverLogsDailyPixelViolations(model: DriverDateTimeRequest, signal?: AbortSignal) {
		isPixelDataLoading.value = true;
		try {
			const response = await useAxios().getRequest(ApiUrls.DRIVER_LOGS_DAILY_PIXEL_VIOLATIONS_URL, capitalizeKeys(model), {}, signal);
			if (response.status === 200) {
				dailyPixelViolations.value = response.data.successResult || [];
			}
		} finally {
			isPixelDataLoading.value = false;
		}
	}

	async function getDriverLogsWeeklyViolations(model: DriverLogsDailyEventsRequest) {
		const response = await useAxios().getRequest(ApiUrls.DRIVER_LOGS_WEEKLY_VIOLATIONS_URL, capitalizeKeys(model));

		if (response.status === 200) {
			weeklyViolations.value = response.data.successResult;
		}
	}

	return {
		chartData,
		isGraphLoading,
		isDailyEventsLoading,
		driverLogs,
		totalCount,
		dailyEvents,
		dailySummary,
		editChartData,
		weeklyViolations,
		dailyTimeRemainder,
		dailyPixelViolations,
		getDriverLogsFilter,
		getDriverLogsDailyGraph,
		getDriverLogsDailyEvents,
		getDriverLogsDailySummary,
		getDriverLogsWeeklyViolations,
		getDriverLogsDailyTimeRemainder,
		getDriverLogsDailyPixelViolations
	};
});
