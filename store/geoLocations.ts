import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";

export const useGeoLocations = defineStore('geoLocations', () => {
  const calculatedAddress = ref<string>();
  
  async function getCalculatedAddress(model: {latitude: number, longitude: number}) {
    const result = await useAxios().getRequest(ApiUrls.CALCULATE_GEOLOCATION_URL, model);
    if (result.status === 200) {
      calculatedAddress.value = result.data.successResult;
      return result.data.successResult;
    }
    return false;
  }

  return {
    getCalculatedAddress,
    calculatedAddress
  }
});