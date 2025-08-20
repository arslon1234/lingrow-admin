import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";
import { addSuccess } from '~/helpers/notification';

export const useDriversStore = defineStore("drivers", () => {
  // Route
	const route = useRoute();

  const drivers = shallowRef<DriverResponse[]>([]);
  // const selectedDriver = ref<string | null>(route?.params?.id as string);
  async function getDriversFilter(getPartial: boolean = false, carrierId: string | number | null = null, enableDefaultCarrier: boolean = true) {
    let assignedCarrierId: string | number | null = carrierId;
    if (enableDefaultCarrier) assignedCarrierId ??= getCarrierId();

    const driversFilterRequest = {
      ...pagination(getPartial),
      carrierId: assignedCarrierId,
    };
    const result = await useAxios().postRequest(ApiUrls.DRIVERS_FILTER_URL, driversFilterRequest);
    if (result.status === 200) {
      drivers.value = result.data.successResult.data;
    }
  }

  async function addDriver(driver: DriverRequest) {
    const result = await useAxios().postRequest(ApiUrls.DRIVERS_URL, driver);
    return result
  }

  async function updateDriver(driver: DriverRequest, id: string) {
    const result = await useAxios().putRequest(`${ApiUrls.DRIVERS_URL}/${id}`, driver);
    return result
  }

  async function getDriverById(id: string): Promise<DriverResponse | null> {
    const result = await useAxios().getRequest(`${ApiUrls.DRIVERS_URL}/${id}`);
    if (result.status === 200) {
      return result.data.successResult;
    }
    return null;
  }

  async function changeDriverStatus(id: string, status: boolean | number) {
    const result = await useAxios().putRequest(`${ApiUrls.DRIVERS_URL}/${id}/state`, { state: status });
    if (result.status === 200) {
      addSuccess(successMessages.updated);
      return result.data.successResult;
    }
    return false;
  }

  return {
    addDriver,
    updateDriver,
    drivers,
    getDriverById,
    getDriversFilter,
    changeDriverStatus,
    // selectedDriver
  }
});