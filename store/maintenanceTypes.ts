import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addSuccess } from '~/helpers/notification';

export const useMaintenanceTypesStore = defineStore('maintenanceTypes', () => {
	const maintenanceTypes = ref<MaintenanceTypesResponse[]>([]);
	const maintenanceTypesTotal = ref<number>(0);

	async function getMaintenanceTypes(getPartial: boolean = false) {
		const paginationRequest: PaginationRequest = { ...pagination(getPartial) };
		const result = await useAxios().getRequest(ApiUrls.MAINTENANCE_TYPES_URL, paginationRequest);
		if (result.status === 200) {
			maintenanceTypesTotal.value = result.data.successResult.totalCount;
			maintenanceTypes.value = result.data.successResult.data;
		}
	}

	async function addMaintenanceType(model: MaintenanceTypesRequest) {
		const result = await useAxios().postRequest(ApiUrls.MAINTENANCE_TYPES_URL, model);
		if (result.status === 200) {
			addSuccess(successMessages.created);
		}
	}

	async function updateMaintenanceType(model: MaintenanceTypesRequest, id: string) {
		const result = await useAxios().putRequest(`${ApiUrls.MAINTENANCE_TYPES_URL}/${id}`, model);
		if (result.status === 200) {
			addSuccess(successMessages.updated);
		}
	}

	async function deleteMaintenanceType(id: string) {
		const result = await useAxios().deleteRequest(`${ApiUrls.MAINTENANCE_TYPES_URL}/${id}`);
		if (result.status === 200) {
			addSuccess(successMessages.deleted);
		}
	}

	return {
		maintenanceTypes,
		maintenanceTypesTotal,
		getMaintenanceTypes,
		addMaintenanceType,
		updateMaintenanceType,
		deleteMaintenanceType
	};
});
