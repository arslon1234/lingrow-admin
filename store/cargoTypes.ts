import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

export const useCargoTypesStore = defineStore('cargoTypes', () => {
	const cargoTypes = ref<CargoTypesResponse[]>([]);
	const cargoTypesTotal = ref<number>(0);

	async function getCargoTypes(getPartial: boolean = false) {
		const paginationRequest: PaginationRequest = { ...pagination(getPartial) };
		const result = await useAxios().getRequest(ApiUrls.CARGO_TYPE_URL, paginationRequest);
		if (result.status === 200) {
			cargoTypes.value = result.data.successResult.data;
			cargoTypesTotal.value = result.data.successResult.totalCount;
		}
	}

	async function addCargoType(model: CargoTypesRequest) {
		const result = await useAxios().postRequest(ApiUrls.CARGO_TYPE_URL, model);
	}

	async function updateCargoType(model: CargoTypesRequest, id: string) {
		const result = await useAxios().putRequest(`${ApiUrls.CARGO_TYPE_URL}/${id}`, model);
	}

	async function deleteCargoType(id: string) {
		const result = await useAxios().deleteRequest(`${ApiUrls.CARGO_TYPE_URL}/${id}`);
	}

	return {
		cargoTypes,
		cargoTypesTotal,
		getCargoTypes,
		addCargoType,
		updateCargoType,
		deleteCargoType
	};
});
