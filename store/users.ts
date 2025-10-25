import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";
import { addError, addSuccess } from "~/helpers/notification";

export const useUsersStore = defineStore("users", () => {
  const users = ref<any[]>([]);
  const usersTotal = ref<number>(0);

  
  async function getUsers() {
    const model = {
      ...getServiceProviderAndCarrierIds(),
      ...pagination()
    }
    const result = await useAxios().postRequest(ApiUrls.USERS_FILTER_URL, model);
    if (result.status === 200) {
      usersTotal.value = result.data.successResult.totalCount;
      users.value = result.data.successResult.data;
    }
  }

  async function addUser(model: any): Promise<boolean> {
    const result = await useAxios().postRequest(ApiUrls.USERS_URL, model);
    if (result.status === 200) {
      addSuccess(successMessages.created);
      return true;
    } else {
      addError(result.message);
      return false;
    }
  }

  async function updateUser(model: any, id: string): Promise<boolean> {
    const result = await useAxios().putRequest(`${ApiUrls.USERS_URL}/${id}`, model);
    if (result.status === 200) {
      addSuccess(successMessages.updated);
      return true;
    }
    return false;
  }

  async function updateStatusUser(state: number, id: string): Promise<boolean> {
    const result = await useAxios().putRequest(`${ApiUrls.USERS_URL}/${id}/state`, { state });
    if (result.status === 200) {
      addSuccess(successMessages.updated);
      return true;
    }
    return false;
  }

  async function deleteUser(id: string): Promise<boolean> {
    const result = await useAxios().deleteRequest(`${ApiUrls.USERS_URL}/${id}`);
    if (result.status === 200) {
      addSuccess(successMessages.deleted);
      return true;
    }
    return false;
  }

  return {
    users,
    getUsers,
    addUser,
    updateUser,
    updateStatusUser,
    deleteUser,
    usersTotal,
  };
});
