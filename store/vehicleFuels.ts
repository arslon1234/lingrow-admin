import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addSuccess } from '~/helpers/notification';

export const useVehicleFuelsStore = defineStore('vehicleFuels', () => {
	const vehicleFuels = ref<VehicleFuelsResponse[]>([]);
	const vehicleFuelsTotal = ref<number>(0);

	async function getVehicleFuels(getPartial: boolean = false) {
		const paginationRequest: PaginationRequest = { ...pagination(getPartial) };
		const result = await useAxios().getRequest(ApiUrls.VEHICLE_FUEL_URL, paginationRequest);
		if (result.status === 200) {
			vehicleFuelsTotal.value = result.data.successResult.totalCount;
			vehicleFuels.value = result.data.successResult.data;
		}
	}

	async function addVehicleFuel(model: VehicleFuelsRequest) {
		const result = await useAxios().postRequest(ApiUrls.VEHICLE_FUEL_URL, model);
		if (result.status === 200) {
			addSuccess(successMessages.created);
		}
	}

	async function updateVehicleFuel(model: VehicleFuelsRequest, id: string) {
		const result = await useAxios().putRequest(`${ApiUrls.VEHICLE_FUEL_URL}/${id}`, model);
		if (result.status === 200) {
			addSuccess(successMessages.updated);
		}
	}

	async function deleteVehicleFuel(id: string) {
		const result = await useAxios().deleteRequest(`${ApiUrls.VEHICLE_FUEL_URL}/${id}`);
		if (result.status === 200) {
			addSuccess(successMessages.deleted);
		}
	}

	return {
		vehicleFuels,
		vehicleFuelsTotal,
		getVehicleFuels,
		addVehicleFuel,
		updateVehicleFuel,
		deleteVehicleFuel
	};
});
