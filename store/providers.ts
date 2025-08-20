import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";
import { addError, addSuccess } from "~/helpers/notification";

export const useProvidersStore = defineStore("providers", () => {
  const provider = ref<ProviderResponse>();
  const providers = ref<ProviderResponse[]>([]);
  const providersTotal = ref<number>(0);

  
  async function getProviders(isActive: boolean | null) {
    const result = await useAxios().getRequest(ApiUrls.PROVIDERS_FILTER_URL, capitalizeKeys({...pagination(), isActive}));
    if (result.status === 200) {
      providersTotal.value = result.data.successResult.totalCount;
      providers.value = result.data.successResult.data;
    }
  }

  async function getProvider(id: string) {
    const result = await useAxios().getRequest(`${ApiUrls.PROVIDERS_URL}/${id}`);
    if (result.status === 200) {
      provider.value = result.data.successResult;
    }
  }

  async function addProvider(model: ProviderRequest): Promise<boolean> {
    const result = await useAxios().postRequest(ApiUrls.PROVIDERS_URL, model);
    if (result.status === 200) {
      addSuccess(successMessages.created);
      return true;
    } else {
      addError(result.message);
      return false;
    }
  }

  async function updateProvider(model: ProviderRequest, id: string): Promise<boolean> {
    const result = await useAxios().putRequest(`${ApiUrls.PROVIDERS_URL}/${id}`, model);
    if (result.status === 200) {
      addSuccess(successMessages.updated);
      return true;
    }
    return false;
  }

  async function updateStatusProvider(state: number, id: string): Promise<boolean> {
    const result = await useAxios().putRequest(`${ApiUrls.PROVIDERS_URL}/${id}/state`, { state });
    if (result.status === 200) {
      addSuccess(successMessages.updated);
      return true;
    }
    return false;
  }

  async function deleteProvider(id: string): Promise<boolean> {
    const result = await useAxios().deleteRequest(`${ApiUrls.PROVIDERS_URL}/${id}`);
    if (result.status === 200) {
      addSuccess(successMessages.deleted);
      return true;
    }
    return false;
  }

  return {
    provider,
    providers,
    providersTotal,
    getProvider,
    getProviders,
    addProvider,
    updateProvider,
    updateStatusProvider,
    deleteProvider,
  };
});
