import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";
import { addSuccess } from "~/helpers/notification";

export const useIftaStore = defineStore('ifta', () => {
  const iftaItems = ref<IftaResponse[]>([]);
  const iftaTotalCount = ref<number>(0);

  async function getIfta(getPartial: boolean = false, carrierId: string = getCarrierId()!) {
    const model: IftaRequest = {
      carrierId,
      ...pagination(getPartial),
    }

    const result = await useAxios().getRequest(ApiUrls.IFTA_GET_URL, model);
    if (result.status === 200) {
      iftaTotalCount.value = result.data.successResult.totalCount ?? 0;
      iftaItems.value = result.data.successResult.data ?? [];
    }
  }

  async function addIfta(model: IftaAddRequest) {
    const result = await useAxios().postRequest(ApiUrls.IFTA_ADD_URL, model);
    if (result.status === 200) {
      addSuccess(successMessages.created);
    }
  }

  return {
    iftaItems,
    iftaTotalCount,
    getIfta,
    addIfta
  }
});