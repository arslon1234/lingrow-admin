import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";

// importing helpers
import { addSuccess } from "~/helpers/notification";

export const useVehiclesStore = defineStore("vehicles", () => {
  const vehicles = ref<VehicleResponse[]>();
  const vehiclesTotal = ref<number>(0);

  async function getVehiclesFilter(getPartial: boolean = false, status: boolean | null = null) {
    const paginationRequest = {
      ...pagination(getPartial),
      unit: null,
      vin: null,
      carrierId: getCarrierId(),
      status: status ?? null
    };
    const result = await useAxios().postRequest(ApiUrls.VEHICLE_FILTER_URL, paginationRequest);
    if (result.status === 200) {
      vehicles.value = result.data.successResult.data;
      vehiclesTotal.value = result.data.successResult.totalCount;
    }
  }

  async function getVehicle(id: string) {
    const result = await useAxios().getRequest(`${ApiUrls.VEHICLE_URL}/${id}`);
    if (result.status === 200) {
      return result.data.successResult;
    }
    return null;
  }
  async function getVehicleDashboard(id: string) {
    const result = await useAxios().getRequest(`${ApiUrls.VEHICLE_DASHBOARD}/${id}`);
    if (result.status === 200) {
      return result.data.successResult;
    }
    return null;
  }
  async function getEldEventsByVehicleId(model:{vehicleId: string}) {
    const result = await useAxios().getRequest(ApiUrls.ELD_EVENTS_BY_VEHICLE_ID, model);
    if (result.status === 200) {
      return result.data.successResult;
    }
    return null;
  }
  async function getCurrentVehicleDriver(id:string) {
    const result = await useAxios().getRequest(`${ApiUrls.DRIVERS_CURRENT_VEHICLE}/${id}`);
    if (result.status === 200) {
      return result.data.successResult;
    }
    return null;
  }
  async function getVehicleSpeedMetrics(id:string) {
    const result = await useAxios().getRequest(`${ApiUrls.VEHICLE_URL}/${id}/metrics/speed`);
    if (result.status === 200) {
      return result.data.successResult;
    }
    return null;
  }

  async function getVehicleFuelMetrics(id:string) {
    const result = await useAxios().getRequest(`${ApiUrls.VEHICLE_URL}/${id}/metrics/fuel-rate`);
    if (result.status === 200) {
      return result.data.successResult;
    }
    return null;
  }
  async function getVehicleDefMetrics(id:string) {
    const result = await useAxios().getRequest(`${ApiUrls.VEHICLE_URL}/${id}/metrics/def-level`);
    if (result.status === 200) {
      return result.data.successResult;
    }
    return null;
  }

  async function addVehicle(model: VehicleRequest) {
    const result = await useAxios().postRequest(ApiUrls.VEHICLE_URL, model);
    if (result.status === 200) {
      addSuccess(successMessages.created);
      //   vehicles.value?.push(result.data.successResult);
    }
  }

  async function updateVehicle(model: VehicleRequest, id: string) {
    const result = await useAxios().putRequest(`${ApiUrls.VEHICLE_URL}/${id}`, model);
    if (result.status === 200) {
      addSuccess(successMessages.updated);
      //   vehicles.value = vehicles.value?.map(vehicle => vehicle.id === id ? result.data.successResult : vehicle);
    }
  }

  async function changeVehicleStatus(id: string, state: number): Promise<boolean> {
    const result = await useAxios().putRequest(`${ApiUrls.VEHICLE_URL}/${id}/state`, { state });
    if (result.status === 200) {
        addSuccess(successMessages.updated);
        return true;
    }
    return false;
  }


  return {
    vehicles,
    getVehiclesFilter,
    addVehicle,
    updateVehicle,
    vehiclesTotal,
    getVehicle,
    changeVehicleStatus,
    getVehicleDashboard,
    getEldEventsByVehicleId,
    getCurrentVehicleDriver,
    getVehicleSpeedMetrics,
    getVehicleFuelMetrics,
    getVehicleDefMetrics
  }
});