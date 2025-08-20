import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";
import { addSuccess } from "~/helpers/notification";

export const useIssuerStatesStore = defineStore("issuerStates", () => {
  const issuerStates = ref<IssuerStateResponse[]>([]);
  const parentIssuerStates = ref<IssuerStateResponse[]>([]);
  const issuerStatesTotal = ref<number>(0);

  async function getParentIssuerStates() {
    const result = await useAxios().getRequest(ApiUrls.ISSUER_STATE_PARENT_URL);
    if (result.status === 200) {
      parentIssuerStates.value = result.data.successResult;
    }
  }

  async function getIssuerStates(getPartial: boolean = false) {
    const paginationRequest: PaginationRequest = { ...pagination(getPartial) };
    const result = await useAxios().getRequest(ApiUrls.ISSUER_STATE_URL, paginationRequest);
    if (result.status === 200) {
      issuerStates.value = result.data.successResult.data;
      issuerStatesTotal.value = result.data.successResult.totalCount;
    }
  }

  async function addIssuerState(model: IssuerStateRequest): Promise<boolean> {
    const result = await useAxios().postRequest(ApiUrls.ISSUER_STATE_URL, model);
    if (result.status === 200) {
      addSuccess(successMessages.created);
      return true;
    }
    return false;
  }

  async function updateIssuerState(model: IssuerStateRequest, id: string): Promise<boolean> {
    const result = await useAxios().putRequest(`${ApiUrls.ISSUER_STATE_URL}/${id}`, model);
    if (result.status === 200) {
      addSuccess(successMessages.updated);
      return true;
    }
    return false;
  }

  async function deleteIssuerState(id: string): Promise<boolean> {
    const result = await useAxios().deleteRequest(`${ApiUrls.ISSUER_STATE_URL}/${id}`);
    if (result.status === 200) {
      addSuccess(successMessages.deleted);
      return true;
    }
    return false;
  }

  return {
    issuerStates,
    getIssuerStates,
    addIssuerState,
    updateIssuerState,
    deleteIssuerState,
    parentIssuerStates,
    issuerStatesTotal,
    getParentIssuerStates
  };
});
