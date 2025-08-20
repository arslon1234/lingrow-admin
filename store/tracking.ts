import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";

export const useTrackingsStore = defineStore("tracking", () => {
  const dailyTrackings = ref<DailyTrackingResponse>();
  const lastTrackings = ref<LastTrackingResponse[]>([]);
  const everyTrackings = ref<EveryTrackingResponse[]>([]);
  const trackingTooltips = ref<{ [key: string]: Boolean }>({});

  async function getDriverDailyTrackings(model: DriverLogsDailyEventsRequest, signal?: AbortSignal) {
    const result = await useAxios().getRequest(ApiUrls.TRACKING_DRIVER_DAILY_EVENTS_URL, capitalizeKeys(model), {}, signal);
    if (result.status === 200) {
      dailyTrackings.value = result.data.successResult;
    }
  }



  async function getDriverEveryTrackings(model: DriverLogsDailyEventsRequest, signal?: AbortSignal) {
    const result = await useAxios().getRequest(ApiUrls.TRACKING_DRIVERS_EVERY_URL, capitalizeKeys(model), {}, signal);
    if (result.status === 200) {
      everyTrackings.value = result.data.successResult;
    }
  }

  return {
    trackingTooltips,
    dailyTrackings,
    getDriverDailyTrackings,
    lastTrackings,
    everyTrackings,
    getDriverEveryTrackings
  }
});