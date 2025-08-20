import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { capitalizeKeys } from './../utils/objectValues';

export const useDeletionMenuStore = defineStore('deletionMenu', () => {
  const deletionMenuProviders = ref([]);
  const deletionMenuCarriers = ref<DeletionMenuCarriersResponse[]>([]);
  const deletionMenuCarriersTotal = ref(0);

  /* GET REQUESTS */
  async function getDeletionMenuProviders() {
    const result = await useAxios().getRequest(ApiUrls.DELETION_MENU_PROVIDERS_URL);
    if (result.status === 200) {
      deletionMenuProviders.value = result.data.successResult;
      return true;
    }
    return false;
  }

  async function getDeletionMenuCarriers(getPartial: boolean = false) {
    const paginationRequest: PaginationRequest = { ...pagination(getPartial) };
    const result = await useAxios().getRequest(ApiUrls.DELETION_MENU_CARRIERS_URL, capitalizeKeys({...paginationRequest, providerId: getProviderId()}));
    if (result.status === 200) {
      deletionMenuCarriers.value = result.data.successResult.data;
      deletionMenuCarriersTotal.value = result.data.successResult.totalCount;
      return true;
    }
    return false;
  }

  /* POST REQUESTS */
  async function assignDeletionMenuTestDriver(model: { driverId: string; carrierId: string; isTestDriver: boolean }) {
    const result = await useAxios().postRequest(ApiUrls.DELETION_MENU_ASSIGN_TEST_DRIVER_URL, model);
    if (result.status === 200) {
      return true;
    }
    return false;
  }

  return {
    deletionMenuProviders,
    getDeletionMenuProviders,
    deletionMenuCarriers,
    deletionMenuCarriersTotal,
    getDeletionMenuCarriers,
    assignDeletionMenuTestDriver
  };
});