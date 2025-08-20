import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

// importing packages
import { Dayjs } from 'dayjs';

export const useDriverInfosStore = defineStore('driverInfos', () => {
	const driverInfos = ref<DriverInfosResponse>();
	const driverTimeZone = ref<DriverInfosTimeZoneResponse>();

	async function getDriverInfos(model: {driverId: string; dateTime: Dayjs | string}, signal?: AbortSignal) {
		const response = await useAxios().getRequest(ApiUrls.DRIVER_INFOS_URL, capitalizeKeys(model), {}, signal);
		if (response.status === 200) {
			driverInfos.value = response.data.successResult;
		}
	}

	async function getDriverTimeZone(driverId: string, signal?:AbortSignal) {
		const response = await useAxios().getRequest(`${ApiUrls.DRIVER_INFOS_URL}/${driverId}/time-zone`, {}, {}, signal);
		if (response.status === 200) {
			driverTimeZone.value = response.data.successResult;
		}
	}

	return {
		driverInfos,
		driverTimeZone,
		getDriverInfos,
		getDriverTimeZone
	};
});
