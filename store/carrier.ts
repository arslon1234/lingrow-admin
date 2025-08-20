import { defineStore } from "pinia";
import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";
import { addSuccess } from "~/helpers/notification";

export const useCarrierStore = defineStore("carriers", () => {
  const carriers = ref<CarrierResponse[]>([]);
  const carriersTotal = ref<number>(0);
  const carrier = ref<CarrierResponse>();
  const timeZones = ref<TimeZoneResponse[]>();

  async function getCarriers(getPartial: boolean = false) {
    const paginationRequest = {
      ...pagination(getPartial),
    }
    const result = await useAxios().getRequest(ApiUrls.CARRIER_URL, paginationRequest);
    if (result?.status === 200) {
      carriers.value = result.data.successResult.data;
      carriersTotal.value = result.data.successResult.totalCount;
    }
  }

  async function getCarriesFilter(getPartial: boolean = false, dotNumber?: string | number | null, providerId?: number | string | null) {
    const carriersFilterRequest = {
      ...pagination(getPartial),
      usdotNumber: dotNumber,
      providerId: providerId ?? getProviderId(),
    };
    const result = await useAxios().postRequest(ApiUrls.CARRIER_FILTER_URL, carriersFilterRequest);
    if (result.status === 200) {
      carriers.value = result.data.successResult.data;
      carriersTotal.value = result.data.successResult.totalCount;
    }
  }

  async function addCarrier(model: CarrierRequest) {
    const result = await useAxios().postRequest(ApiUrls.CARRIER_URL, model);
    if (result.status === 200) {
      addSuccess(successMessages.created);
    }
    return result
  }

  async function getCarrierTimeZones() {
    const result = await useAxios().getRequest(ApiUrls.CARRIER_TIME_ZONE_URL);
    if (result.status === 200) {
      timeZones.value = result.data.successResult;
    }
  }


  async function getCarrier(carrierId: string | null) {
    if (!carrierId) return;
    const result = await useAxios().getRequest(`${ApiUrls.CARRIER_URL}/${carrierId}`);
    if (result.status === 200) {
      carrier.value = result.data.successResult;
    }
  }

  async function updateCarrier(model: CarrierRequest, id: string) {
    const result = await useAxios().putRequest(`${ApiUrls.CARRIER_URL}/${id}`, model);
    if (result.status === 200) {
      addSuccess(successMessages.updated);
    }
  }

  return {
    carrier,
    carriers,
    carriersTotal,
    getCarriers,
    getCarriesFilter,
    timeZones,
    getCarrierTimeZones,
    addCarrier,
    getCarrier,
    updateCarrier,
  }
});