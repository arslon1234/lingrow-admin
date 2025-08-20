import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";

export const useTabsStore = defineStore("tabs", () => {
  const tabs = ref<TabResponse[]>([]);
  const tab = ref<TabResponse>();
  const selectedTab = ref<TabResponse>();
  const currentAbortController = ref<AbortController | null>(null);

  async function getTabs(sessiondId: string) {
    const result = await useAxios().getRequest(`${ApiUrls.TABS_SESSION_URL}/${sessiondId}`);
    if (result.status === 200) {
      tabs.value = result.data.successResult;
    }
  }

  async function getTab(id: string) {
    const result = await useAxios().getRequest(`${ApiUrls.TABS_URL}/${id}`);
    if (result.status === 200) {
      tab.value = result.data.successResult
    }
  }

  async function addTab(model: TabRequest) {
    const result = await useAxios().postRequest(`${ApiUrls.TABS_URL}/add`, model);
    return result.status === 200;

  }

  async function updateTab(id: string, model: TabRequest) {
    const result = await useAxios().putRequest(`${ApiUrls.TABS_URL}/update/${id}`, model);
    return result.status === 200;

  }

  async function deleteTab(id: string) {
    const result = await useAxios().deleteRequest(`${ApiUrls.TABS_URL}/${id}`);
    return result.status === 200;

  }

  return {
    // stores
    tab,
    tabs,
    selectedTab,
    
    // get requests
    getTab,
    getTabs,

    // post requests
    addTab,

    // put requests
    updateTab,

    // delete requests
    deleteTab,

    // abort controller
    currentAbortController
  }
});