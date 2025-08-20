import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addSuccess } from '~/helpers/notification';

export const useEldConnectionsStore = defineStore('eldConnections', () => {
	const eldConnections = ref<EldConnectionsResponse[]>([]);
	const eldConnectionsTotal = ref<number>(0);

	async function getEldConnections(getPartial: boolean = false) {
		const paginationRequest: PaginationRequest = { ...pagination(getPartial) };
		const result = await useAxios().getRequest(ApiUrls.ELD_CONNECTION_URL, paginationRequest);
		if (result.status === 200) {
			eldConnectionsTotal.value = result.data.successResult.totalCount;
			eldConnections.value = result.data.successResult.data;
		}
	}

	async function addEldConnection(model: EldConnectionsRequest) {
		const result = await useAxios().postRequest(ApiUrls.ELD_CONNECTION_URL, model);
		if (result.status === 200) {
			addSuccess(successMessages.created);
		}
	}

	async function updateEldConnection(model: EldConnectionsRequest, id: string) {
		const result = await useAxios().putRequest(`${ApiUrls.ELD_CONNECTION_URL}/${id}`, model);
		if (result.status === 200) {
			addSuccess(successMessages.updated);
		}
	}

	async function deleteEldConnection(id: string) {
		const result = await useAxios().deleteRequest(`${ApiUrls.ELD_CONNECTION_URL}/${id}`);
		if (result.status === 200) {
			addSuccess(successMessages.deleted);
		}
	}

	return {
		eldConnections,
		eldConnectionsTotal,
		getEldConnections,
		addEldConnection,
		updateEldConnection,
		deleteEldConnection
	};
});
