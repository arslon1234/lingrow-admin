import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import type { Dayjs } from 'dayjs';

export const useDriverAlertsStore = defineStore('driverAlerts', () => {
	const driverAlerts = ref<DriverAlertsResponse[]>([]);
	const driverAlertsHistory = ref<DriverAlertsHistoryResponse[]>([]);
	const driverAlertsTotal = ref<number>(0);

	async function getDriverAlerts(model: {search: string | null}, getPartial: boolean = false) {
		const modelRequest = {
			carrierId: getCarrierId(),
			search: model.search,
			...pagination(getPartial)
		}
		const response = await useAxios().getRequest(ApiUrls.DRIVER_ALERTS_URL, capitalizeKeys(modelRequest));
		if (response.status === 200) {
			driverAlerts.value = response.data.successResult.data as DriverAlertsResponse[];
			driverAlertsTotal.value = response.data.successResult.totalCount;
		}
	}

	async function getDriverAlertsHistory(driverId: string) {
		const response = await useAxios().getRequest(`${ApiUrls.DRIVER_ALERTS_URL}/${driverId}`);
		if (response.status === 200) {
			driverAlertsHistory.value = response.data.successResult as DriverAlertsHistoryResponse[];
		}
	}

	async function addDriverAlert(model: {driverId: string; dateTime: string | Dayjs; musicType: number}) {
		const response = await useAxios().postRequest(ApiUrls.DRIVER_ALERTS_URL, model);
		return response.status === 200;
	}

	return {
		driverAlerts,
		driverAlertsTotal,
		driverAlertsHistory,
		getDriverAlerts,
		addDriverAlert,
		getDriverAlertsHistory
	};
});
