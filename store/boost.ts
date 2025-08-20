import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";

// importing packages
import dayjs from 'dayjs';

// importing helpers
import { useTimeZoneHelper } from "~/helpers/timezone";

export const useBoostStore = defineStore("boost", () => {
  // timezone helpers
  const { formatToUTC, getStartOf, getEndOf, acceptAsTimeZone } = useTimeZoneHelper();

  // Time Remainder
  const boostTimeRemainder = ref<HosTimeRemainder>();
  const isBoostTimeMoved = ref<{ [key: string]: Boolean }>({});
  // Summaries
  const boostSummaries = shallowRef<DailyDictionarySummaryResponse>({});

  // Violations
  const boostViolations = shallowRef<ViolationResponse[]>([]);
  const boostPixelViolations = shallowRef<ViolationPixelResponse[]>([]);

  // Free Times
  const boostFreeTimes = shallowRef<BoostFreeTime[]>([]);

  // Selection
  const selectedRows = ref<any[]>([]);
	const selectedRowSet = shallowRef<any>(new Set<string>());

  // GET SUMMARIES
  async function getLatestBoostTimeRemainder(driverId: string) {
    let { fromDate, toDate } = dateRange();

    if (!driverId) return;
    if (!fromDate || !toDate) {
      fromDate = subtract(dayjs(), 1, 'day').format();
      toDate = dayjs().format();
    }
    const model: BoostEventRequest = {
      driverId,
      startDate: formatToUTC(getStartOf(acceptAsTimeZone(fixDateFormat(fromDate)))),
      endDate: formatToUTC(getEndOf(acceptAsTimeZone(fixDateFormat(toDate)))),
    }

    const result = await useAxios().getRequest(ApiUrls.BOOST_LATEST_TIME_REMAINDER_URL, capitalizeKeys(model));
    if (result.status === 200) {
      boostTimeRemainder.value = result.data.successResult;
    }
  }

  async function getHistoryBoostTimeRemainder(model: {tabId: string; sessionId: string}, signal?: AbortSignal) {
    const result = await useAxios().getRequest(ApiUrls.BOOST_HISTORY_TIME_REMAINDER_URL, capitalizeKeys(model), {}, signal);
    if (result.status === 200) {
      boostTimeRemainder.value = result.data.successResult
    }
  }

  // GET SUMMARIES
  async function getLatestBoostSummaries(driverId: string) {
    let { fromDate, toDate } = dateRange();

    if (!driverId) return;
    if (!fromDate || !toDate) {
      fromDate = subtract(dayjs(), 1, 'day').format();
      toDate = dayjs().format();
    }

    const model: BoostEventRequest = {
      driverId,
      startDate: formatToUTC(getStartOf(acceptAsTimeZone(fixDateFormat(fromDate)))),
      endDate: formatToUTC(getEndOf(acceptAsTimeZone(fixDateFormat(toDate)))),
    }

    const result = await useAxios().getRequest(ApiUrls.BOOST_LATEST_SUMMARIES_URL, capitalizeKeys(model));
    if (result.status === 200) {
      boostSummaries.value = result.data.successResult;
    }
  }

  async function getHistoryBoostSummaries(model: {tabId: string; sessionId: string}, signal?: AbortSignal) {
    const result = await useAxios().getRequest(ApiUrls.BOOST_HISTORY_SUMMARIES_URL, capitalizeKeys(model), {}, signal);
    if (result.status === 200) {
      boostSummaries.value = result.data.successResult
    }
  }

  // GET VIOLATIONS
  async function getLatestBoostViolations(driverId: string) {
    let { fromDate, toDate } = dateRange();

    if (!driverId) return;
    if (!fromDate || !toDate) {
      fromDate = subtract(dayjs(), 1, 'day').format();
      toDate = dayjs().format();
    }

    const model: BoostEventRequest = {
      driverId,
      startDate: formatToUTC(getStartOf(acceptAsTimeZone(fixDateFormat(fromDate)))),
      endDate: formatToUTC(getEndOf(acceptAsTimeZone(fixDateFormat(toDate)))),
    }
    
    const result = await useAxios().getRequest(ApiUrls.BOOST_LATEST_VIOLATIONS_URL, capitalizeKeys(model));
    if (result.status === 200) {
      boostViolations.value = result.data.successResult;
    }
  }
  async function getBoostViolations(model: BoostViolationRequest, signal?:AbortSignal){
    const result = await useAxios().getRequest(ApiUrls.BOOST_PIXEL_VIOLATIONS, capitalizeKeys(model), {}, signal)
    if(result.status === 200){
      boostPixelViolations.value = result.data.successResult.flat();
    }
  }
  async function getHistoryBoostViolations(model: {tabId: string; sessionId: string}, signal?: AbortSignal) {
    const result = await useAxios().getRequest(ApiUrls.BOOST_HISTORY_VIOLATIONS_URL, capitalizeKeys(model), {}, signal);
    if (result.status === 200) {
      boostViolations.value = result.data.successResult
    }
  }

  // GET FREE TIMES
  async function getLatestFreeTimes(model: DriverDateTimeRequest) {
    const response = await useAxios().getRequest(ApiUrls.BOOST_LATEST_FREE_TIMES_URL, capitalizeKeys(model));
    if (response.status === 200) {
      boostFreeTimes.value = response.data.successResult;
    }
  }

  async function getHistoryFreeTimes(model: {tabId: string; sessionId: string, screenResolution: number}, signal?:AbortSignal) {
    const response = await useAxios().getRequest(ApiUrls.BOOST_HISTORY_FREE_TIMES_URL, capitalizeKeys(model), {}, signal);
    if (response.status === 200) {
      boostFreeTimes.value = response.data.successResult;
    }
  }

  return {
    // time remainder
    boostTimeRemainder,
    getLatestBoostTimeRemainder,
    getHistoryBoostTimeRemainder,

    // summaries
    boostSummaries,
    getLatestBoostSummaries,
    getHistoryBoostSummaries,

    // violations
    boostViolations,
    getLatestBoostViolations,
    getHistoryBoostViolations,
    getBoostViolations,
    boostPixelViolations,
    isBoostTimeMoved,
    // free times
    boostFreeTimes,
    getLatestFreeTimes,
    getHistoryFreeTimes,

    // selection
    selectedRows,
    selectedRowSet,
  }
});