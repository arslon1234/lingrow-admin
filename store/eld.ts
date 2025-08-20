import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";
import { addSuccess } from "~/helpers/notification";

export const useEldStore = defineStore("eld-store", () => {
  const elds = ref<EldResponse[]>([]);
  const eldsTotalCount = ref<number>(0);

  async function getEldsByFilter(params: any) {
    const result = await useAxios().getRequest(ApiUrls.ELD_FILTER, params);
    if (result.data?.successResult) {
      eldsTotalCount.value = result.data.successResult.totalCount;
      elds.value = result.data.successResult.data;
    }
  }

  async function updateEld(model: EldSetUpdateRequest) {
    const result = await useAxios().postRequest(ApiUrls.ELD_UPDATE, model);
    if (!result.successResult) {
      addSuccess(successMessages.updated);
    }
  }

  return {
    elds,
    eldsTotalCount,
    getEldsByFilter,
    updateEld
  }
});