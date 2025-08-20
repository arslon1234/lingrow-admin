import { useAxios } from "~/api";
import { ApiUrls } from "~/api/apis";

export const useRolesStore = defineStore("roles", () => {
  const roles = ref<RoleResponse[]>([]);
  const totalCount = ref<RoleResponse[]>([]);

  async function getRoles() {
    const result = await useAxios().getRequest(ApiUrls.ROLE_URL);
    if (result.status === 200) {
      roles.value = result.data.successResult.data;
      totalCount.value = result.data.successResult.totalCount;
    }
  }

  return {
    roles,
    totalCount,
    getRoles
  }
});