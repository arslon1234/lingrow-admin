import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";

export const useSessionsStore = defineStore("sessions", () => {
  const sessions = ref<SessionResponse[]>([]);
  const session = ref<SessionResponse>();
  const sessionId = ref<string>();
  const totalCount = ref<number>();

  async function getSessionsFilter(params: any) {
    const result = await useAxios().getRequest(ApiUrls.SESSIONS_FILTER_URL, params);
    if (result.status === 200) {
      sessions.value = result.data.successResult.data;
      totalCount.value = result.data.successResult.totalCount;
    }
  }

  async function getSession(id: string) {
    try {
      const result = await useAxios().getRequest(`${ApiUrls.SESSIONS_URL}/${id}`);
      if (result.status === 200) {
        session.value = result.data.successResult;
        sessionId.value = session.value?.id;
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function addSession(model: SessionRequest) {
    const result = await useAxios().postRequest(ApiUrls.SESSIONS_URL, model);
    if (result.status === 200) {
      sessionId.value = result.data.successResult.id;
    }
    return false;
  }

  async function updateSession(model: SessionUpdateRequest, id: string) {
    const result = await useAxios().putRequest(`${ApiUrls.SESSIONS_URL}/${id}`, model);
    if (result.status === 200) {
      return true;
    }
    return false;
  }

  async function deleteSession(id: string) {
    const result = await useAxios().deleteRequest(`${ApiUrls.SESSIONS_URL}/${id}`);
    if (result.status === 200) {
      return true;
    }
    return false;
  }

  return {
    // stores
    session,
    sessionId,
    sessions,
    totalCount,

    // get requests
    getSession,
    getSessionsFilter,

    // post requests
    addSession,

    // put requests
    updateSession,

    // delete requests
    deleteSession,
  }
});