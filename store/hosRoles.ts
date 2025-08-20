import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";
import { addSuccess } from "~/helpers/notification";

export const useHosRolesStore = defineStore("hosRoles", () => {
  const hosRoles = ref<HosRolesResponse[]>([]);
  const hosRolesTotal = ref<number>(0);

  async function getHosRoles(getPartial: boolean = false) {
    const paginationRequest: PaginationRequest = { ...pagination(getPartial) };
    const result = await useAxios().getRequest(ApiUrls.HOS_RULE_URL, paginationRequest);
    if (result.status === 200) {
      hosRolesTotal.value = result.data.successResult.totalCount;
      hosRoles.value = result.data.successResult.data;
    }
  }

  async function addHosRoles(model: HosRolesRequest) {
    const result = await useAxios().postRequest(ApiUrls.HOS_RULE_URL, model);
    if (result.status === 200) {
      addSuccess(successMessages.created);
    }
  }

  async function updateHosRoles(model: HosRolesRequest, id: string) {
    const result = await useAxios().putRequest(`${ApiUrls.HOS_RULE_URL}/${id}`, model);
    if (result.status === 200) {
      addSuccess(successMessages.updated);
    }
  }

  async function deleteHosRoles(id: string) {
    const result = await useAxios().deleteRequest(`${ApiUrls.HOS_RULE_URL}/${id}`);
    if (result.status === 200) {
      addSuccess(successMessages.deleted);
    }
  }

  return {
    hosRoles,
    hosRolesTotal,
    getHosRoles,
    addHosRoles,
    updateHosRoles,
    deleteHosRoles
  }
});
