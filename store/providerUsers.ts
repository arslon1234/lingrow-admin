import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";
import { addError, addSuccess } from "~/helpers/notification";

export const useProviderUsersStore = defineStore("providerUsers", () => {
  const providerUser = ref<ProviderUserResponse>();
  const providerUsers = ref<ProviderUserResponse[]>([]);
  const providerUsersTotal = ref<number>(0);

  
  async function getProviderUsers() {
    const result = await useAxios().getRequest(ApiUrls.PROVIDER_USERS_FILTER_URL, capitalizeKeys({...pagination(), ...getServiceProviderAndCarrierIds()}));
    if (result.status === 200) {
      providerUsersTotal.value = result.data.successResult.totalCount;
      providerUsers.value = result.data.successResult.data;
    }
  }

  async function getProviderUser(id: string) {
    const result = await useAxios().getRequest(`${ApiUrls.PROVIDER_USERS_URL}/${id}`);
    if (result.status === 200) {
      providerUser.value = result.data.successResult;
    }
  }

  async function addProviderUser(model: ProviderUserRequest): Promise<boolean> {
    const result = await useAxios().postRequest(ApiUrls.PROVIDER_USERS_URL, model);
    if (result.status === 200) {
      addSuccess(successMessages.created);
      return true;
    } else {
      addError(result.message);
      return false;
    }
  }

  async function updateProviderUser(model: ProviderUserRequest, id: string): Promise<boolean> {
    const result = await useAxios().putRequest(`${ApiUrls.PROVIDER_USERS_URL}/${id}`, model);
    if (result.status === 200) {
      addSuccess(successMessages.updated);
      return true;
    }
    return false;
  }

  async function updateStatusProviderUser(state: number, id: string): Promise<boolean> {
    const result = await useAxios().putRequest(`${ApiUrls.PROVIDER_USERS_URL}/${id}/state`, { state });
    if (result.status === 200) {
      addSuccess(successMessages.updated);
      return true;
    }
    return false;
  }

  async function deleteProviderUser(id: string): Promise<boolean> {
    const result = await useAxios().deleteRequest(`${ApiUrls.PROVIDER_USERS_URL}/${id}`);
    if (result.status === 200) {
      addSuccess(successMessages.deleted);
      return true;
    }
    return false;
  }

  return {
    providerUser,
    providerUsers,
    providerUsersTotal,
    getProviderUser,
    getProviderUsers,
    addProviderUser,
    updateProviderUser,
    updateStatusProviderUser,
    deleteProviderUser,
  };
});
