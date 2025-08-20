import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";

export const useEldConnectionInterfacesStore = defineStore("eldConnectionInterfaces", () => {
  const eldconnectionInterfaces = ref<EldConnectionInterfaceResponse[]>([]);

  async function getEldConnectionInterfaces(getPartial: boolean = false, pageSize: number | null, pageNumber: number | null) {
    const paginationRequest: PaginationRequest = {
      ...pagination(getPartial),
    };
    const result = await useAxios().getRequest(ApiUrls.ELD_CONNECTION_URL, paginationRequest);
    if (result.status === 200) {
      eldconnectionInterfaces.value = result.data.successResult.data;
    }
  }

  return {
    eldconnectionInterfaces,
    getEldConnectionInterfaces,
  };
});
