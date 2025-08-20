import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";
import { addSuccess } from "~/helpers/notification";

export const useEventsByOtherStore = defineStore("eventsByOthers", () => {
  const driverVehicles = ref<VehicleResponse[]>([]);

  async function getEventByOther(id: string) {
    const result = await useAxios().getRequest(`${ApiUrls.EVENT_BY_OTHER_USERS_URL}/${id}`);
    if (result?.data?.successResult) {
      const response = result.data.successResult;
      driverVehicles.value = response.driver.vehicles;
      return response;
    }
    return null;
  }

  async function saveEventByOther(model: EventsByOtherRequest) {
    const result = await useAxios().postRequest(ApiUrls.EVENT_SAVE_BY_OTHER_USERS_URL, model);
    if (result.successResult) {
      addSuccess(successMessages.created);
    }
  }

  async function addEventByOther(model: EventsByOtherRequest) {
    const result = await useAxios().postRequest(ApiUrls.EVENT_ADD_BY_OTHER_USERS_URL, model);
    if (result.successResult) {
      addSuccess(successMessages.created);
    }
  }

  async function updateEventByOther(model: EventsByOtherRequest, eventId: string) {
    const result = await useAxios().putRequest(`${ApiUrls.EVENT_UPDATE_BY_OTHER_USERS_URL}/${eventId}`, model);
    if (result.successResult) {
      addSuccess(successMessages.updated);
    }
  }

  return {
    driverVehicles,
    getEventByOther,
    saveEventByOther,
    addEventByOther,
    updateEventByOther
  }
});