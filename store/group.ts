import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addSuccess } from '~/helpers/notification';

export const useGroupStore = defineStore('group', () => {
	const groups = ref<GroupResponse[]>([]);
	const groupsTotal = ref<number>(0);
	const permissionGroups = ref<PermissionResponse[]>([]);

	async function getPermissionGroups() {
		const result = await useAxios().getRequest(ApiUrls.PERMISSIONS_URL);
		if (result.status === 200) {
			permissionGroups.value = result.data.successResult.data;
		}
	}

	async function getGroups(getPartial: boolean = false) {
		const paginationRequest: PaginationRequest = { ...pagination(getPartial) };
		const result = await useAxios().getRequest(ApiUrls.ROLES_URL, paginationRequest);
		if (result.status === 200) {
			groupsTotal.value = result.data.successResult.totalCount;
			groups.value = result.data.successResult.data;
		}
	}

	async function addGroup(model: GroupRequest) {
		const result = await useAxios().postRequest(ApiUrls.ROLES_URL, model);
		if (result.status === 200) {
			addSuccess(successMessages.created);
		}
	}

	async function updateGroup(model: GroupRequest, id: string) {
		const result = await useAxios().putRequest(`${ApiUrls.ROLES_URL}/${id}`, model);
		if (result.status === 200) {
			addSuccess(successMessages.updated);
		}
	}

	async function deleteGroup(id: string) {
		const result = await useAxios().deleteRequest(`${ApiUrls.ROLES_URL}/${id}`);
		if (result.status === 200) {
			addSuccess(successMessages.deleted);
		}
	}

	return {
		groups,
		groupsTotal,
		permissionGroups,
		getPermissionGroups,
		getGroups,
		addGroup,
		updateGroup,
		deleteGroup
	};
});
