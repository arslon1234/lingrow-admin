import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addSuccess } from '~/helpers/notification';

export const useRestartsStore = defineStore('restarts', () => {
	const restarts = ref<RestartsResponse[]>([]);
	const restartsTotal = ref<number>(0);

	async function getRestarts(getPartial: boolean = false) {
		const paginationRequest: PaginationRequest = { ...pagination(getPartial) };
		const result = await useAxios().getRequest(ApiUrls.RESTART_URL, paginationRequest);
		if (result.status === 200) {
			restartsTotal.value = result.data.successResult.totalCount;
			restarts.value = result.data.successResult.data;
		}
	}

	async function addRestart(model: RestartsRequest) {
		const result = await useAxios().postRequest(ApiUrls.RESTART_URL, model);
		if (result.status === 200) {
			addSuccess(successMessages.created);
		}
	}

	async function updateRestart(model: RestartsRequest, id: string) {
		const result = await useAxios().putRequest(`${ApiUrls.RESTART_URL}/${id}`, model);
		if (result.status === 200) {
			addSuccess(successMessages.updated);
		}
	}

	async function deleteRestart(id: string) {
		const result = await useAxios().deleteRequest(`${ApiUrls.RESTART_URL}/${id}`);
		if (result.status === 200) {
			addSuccess(successMessages.deleted);
		}
	}

	return {
		restarts,
		restartsTotal,
		getRestarts,
		addRestart,
		updateRestart,
		deleteRestart
	};
});
