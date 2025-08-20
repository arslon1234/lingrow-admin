import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addSuccess } from '~/helpers/notification';

export const useRestBreaksStore = defineStore('restBreaks', () => {
	const restBreaks = ref<RestBreaksResponse[]>([]);
	const restBreaksTotal = ref<number>(0);

	async function getRestBreaks(getPartial: boolean = false) {
		const paginationRequest: PaginationRequest = { ...pagination(getPartial) };
		const result = await useAxios().getRequest(ApiUrls.REST_BREAK_URL, paginationRequest);
		if (result.status === 200) {
			restBreaksTotal.value = result.data.successResult.totalCount;
			restBreaks.value = result.data.successResult.data;
		}
	}

	async function addRestBreaks(model: RestBreaksRequest) {
		const result = await useAxios().postRequest(ApiUrls.REST_BREAK_URL, model);
		if (result.status === 200) {
			addSuccess(successMessages.created);
		}
	}

	async function updateRestBreaks(model: RestBreaksRequest, id: string) {
		const result = await useAxios().putRequest(`${ApiUrls.REST_BREAK_URL}/${id}`, model);
		if (result.status === 200) {
			addSuccess(successMessages.updated);
		}
	}

	async function deleteRestBreaks(id: string) {
		const result = await useAxios().deleteRequest(`${ApiUrls.REST_BREAK_URL}/${id}`);
		if (result.status === 200) {
			addSuccess(successMessages.deleted);
		}
	}

	return {
		restBreaks,
		restBreaksTotal,
		getRestBreaks,
		addRestBreaks,
		updateRestBreaks,
		deleteRestBreaks
	};
});
