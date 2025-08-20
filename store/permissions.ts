import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addSuccess } from '~/helpers/notification';

export const usePermissionsStore = defineStore('permissions', () => {
	const permissions = ref<PermissionResponse[]>([]);
	const permissionsTotal = ref<number>(0);

	async function getPermissions(getPartial: boolean = false) {
		const paginationRequest: PaginationRequest = { ...pagination(getPartial) };
		const result = await useAxios().getRequest(ApiUrls.PERMISSIONS_URL, paginationRequest);
		if (result.status === 200) {
			permissionsTotal.value = result.data.successResult.totalCount;
			permissions.value = result.data.successResult.data;
		}
	}

	async function addPermission(model: PermissionRequest) {
		const result = await useAxios().postRequest(ApiUrls.PERMISSIONS_URL, model);
		if (result.status === 200) {
			addSuccess(successMessages.created);
		}
	}

	async function updatePermission(model: PermissionRequest, id: string) {
		const result = await useAxios().putRequest(`${ApiUrls.PERMISSIONS_URL}/${id}`, model);
		if (result.status === 200) {
			addSuccess(successMessages.updated);
		}
	}

	async function deletePermission(id: string) {
		const result = await useAxios().deleteRequest(`${ApiUrls.PERMISSIONS_URL}/${id}`);
		if (result.status === 200) {
			addSuccess(successMessages.deleted);
		}
	}

	return {
		permissions,
		permissionsTotal,
		getPermissions,
		addPermission,
		updatePermission,
		deletePermission
	};
});
