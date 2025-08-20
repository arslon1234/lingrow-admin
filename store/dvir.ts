import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";
import { addError, addSuccess } from "~/helpers/notification";

export const useDvirStore = defineStore('dvir', () => {
  const dvirs = ref<DvirResponse[]>();
  const dvir = ref<DvirResponse>();
  const totalCount = ref<number>(0);
  const signatureAndLocation = reactive<{ location: string; signaturesPath: Array<string>}>({
    location: '',
    signaturesPath: []
  });
  const statuses = ref<{id: string; name: string}[]>();

  async function getDvirs(model: DvirRequest) {
    const result = await useAxios().getRequest(ApiUrls.DVIRS_FILTER_URL, model);
    if (result.status === 200) {
      dvirs.value = result.data.successResult.data;
      totalCount.value = result.data.successResult.totalCount;
    }
  }

  async function getDvir(id: string) {
    const result = await useAxios().getRequest(`${ApiUrls.DVIRS_URL}/${id}`);
    if (result.status === 200) {
      dvir.value = result.data.successResult;
    }
  }

  async function addDvir(model: DvirAddRequest) {
    const result = await useAxios().postRequest(ApiUrls.DVIRS_URL, model);
    if (result.status === 200) {
      addSuccess(successMessages.created);
      return navigateTo('/dvir');
    }
    addError(result.message);
    return false;
  } 

  async function putDvir(dvirId: string, dvirRequest: DvirAddRequest) {
    const result = await useAxios().putRequest(`${ApiUrls.DVIRS_URL}/${dvirId}`, dvirRequest);
    if (result.status === 200) {
      addSuccess(successMessages.updated);
      return navigateTo('/dvir');
    }
    addError(result.message);
    return false;
  }

  async function deleteDvir(dvirId: string) {
    const result = await useAxios().deleteRequest(`${ApiUrls.DVIRS_URL}/${dvirId}`);
    if (result.status === 200) {
      addSuccess(successMessages.deleted);
      return true;
    }
    addError(result?.message);
    return false;
  }

  async function getDvirLocationSignaturesByDriver(driverId: string) {
    const result = await useAxios().getRequest(`${ApiUrls.DVIRS_LOCATION_AND_SIGNATURES_URL}/${driverId}`);
    if(result.status = 200) {
      signatureAndLocation.location = result.data.successResult.location;
      signatureAndLocation.signaturesPath = result.data.successResult.signaturesPath;
    }
  }

  async function getDvirStatuses() {
    const result = await useAxios().getRequest(ApiUrls.DVIRS_STATUSES_URL);
    if(result.status = 200) {
      statuses.value = result.data.successResult
    }
  }
  
  return {
    dvirs,
    dvir,
    signatureAndLocation,
    totalCount,
    statuses,
    getDvirs,
    getDvir,
    getDvirStatuses,
    getDvirLocationSignaturesByDriver,
    addDvir,
    putDvir,
    deleteDvir
  }
});