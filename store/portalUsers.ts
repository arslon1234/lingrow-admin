import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";
import { addError, addSuccess } from "~/helpers/notification";

export const usePortalUsersStore = defineStore("portalUsers", () => {
  const portalUsers = ref<UsersResponse[]>([]);
  const portalUsersTotal = ref<number>(0);

  
  async function getUsers() {
    const model = {
      ...getServiceProviderAndCarrierIds(),
      ...pagination()
    }
    const result = await useAxios().getRequest(ApiUrls.PORTAL_USERS_FILTER_URL, capitalizeKeys(model));
    if (result.status === 200) {
      portalUsersTotal.value = result.data.successResult.totalCount;
      portalUsers.value = result.data.successResult.data;
    }
  }

  async function addUser(model: UsersRequest): Promise<boolean> {
    const result = await useAxios().postRequest(ApiUrls.PORTAL_USERS_URL, model);
    if (result.status === 200) {
      addSuccess(successMessages.created);
      return true;
    } else {
      addError(result.message);
      return false;
    }
  }

  async function updateUser(model: UsersRequest, id: string): Promise<boolean> {
    const result = await useAxios().putRequest(`${ApiUrls.PORTAL_USERS_URL}/${id}`, model);
    if (result.status === 200) {
      addSuccess(successMessages.updated);
      return true;
    }
    return false;
  }

  async function updateStatusUser(state: number, id: string): Promise<boolean> {
    const result = await useAxios().putRequest(`${ApiUrls.PORTAL_USERS_URL}/${id}/state`, { state });
    if (result.status === 200) {
      addSuccess(successMessages.updated);
      return true;
    }
    return false;
  }

  async function deleteUser(id: string): Promise<boolean> {
    const result = await useAxios().deleteRequest(`${ApiUrls.PORTAL_USERS_URL}/${id}`);
    if (result.status === 200) {
      addSuccess(successMessages.deleted);
      return true;
    }
    return false;
  }

  return {
    portalUsers,
    getUsers,
    addUser,
    updateUser,
    updateStatusUser,
    deleteUser,
    portalUsersTotal,
  };
});
