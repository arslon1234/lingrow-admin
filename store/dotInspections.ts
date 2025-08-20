import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addSuccess } from '~/helpers/notification';

export const useDotInspectionsStore = defineStore('dotInspections', () => {
	const dotInspections = ref<DotInspectionsResponse[]>([]);
	const dotInspection = ref<DotInspectionsResponse>();
	const dotInspectionsTotal = ref<number>(0);

	async function getDotInspections(model: { driverId: string, status: number | null, carrierId?: string | null  }, getPartial: boolean) {
		const requestModel = {
			driverId: model.driverId,
			status: model.status,
			carrierId: model.carrierId ?? getCarrierId(),
			...pagination(getPartial)
		};
		const response = await useAxios().getRequest(ApiUrls.DOT_INSPECTION_URL, capitalizeKeys(requestModel));
		if (response.status === 200) {
			dotInspections.value = response.data.successResult.data as DotInspectionsResponse[];
			dotInspectionsTotal.value = response.data.successResult.totalCount as number;
		}
	}

	async function getDotInspection(id: string) {
		const response = await useAxios().getRequest(`${ApiUrls.DOT_INSPECTION_URL}/${id}`);
		if (response.status === 200) {
			dotInspection.value = response.data.successResult as DotInspectionsResponse;
		}
	}

	async function updateDotInspectionStatus(id: string, status: number) {
		const response = await useAxios().putRequest(`${ApiUrls.DOT_INSPECTION_URL}/${id}/status`, { status });
		if (response.status === 200) {
			addSuccess(successMessages.updated);
			return true;
		}
		return false;

	}

	async function deleteDotInspection(id: string) {
		const response = await useAxios().deleteRequest(`${ApiUrls.DOT_INSPECTION_URL}/${id}`);
		if (response.status === 200) {
			addSuccess(successMessages.deleted);
			return true;
		}
		return false;
	}

	async function addDotInspection(model: DotInspectionCreateRequest) {
		const response = await useAxios().postRequest(ApiUrls.DOT_INSPECTION_URL, model);
		if (response.status === 200) {
			addSuccess(successMessages.created);
			return true;
		}
		return false;
	}

	return {
		dotInspection,
		dotInspections,
		dotInspectionsTotal,
		getDotInspections,
		getDotInspection,
		updateDotInspectionStatus,
		deleteDotInspection,
		addDotInspection
	};
});
