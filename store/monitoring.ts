import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

export const useMonitoringStore = defineStore('monitoring', () => {
	const providerMonitoring = ref<MonitoringResponse[]>([]);
	const providerMonitoringTotal = ref(0);

	const carrierMonitoring = ref<MonitoringDrivers[]>([]);
	const carrierMonitoringTotal = ref<number>(0);

	async function getMonitoringProvider(getPartial: boolean = false, carrierId: string | null = null) {
		const result = await useAxios().getRequest(ApiUrls.MONITORING_PROVIDER_URL, capitalizeKeys({ carrierId, providerId: getProviderId(), ...pagination(getPartial) }));
		if (result.status === 200) {
			providerMonitoring.value = result.data.successResult.data;
			providerMonitoringTotal.value = result.data.successResult.totalCount;
			return true;
		}
		return false;
	}

	async function getMonitoringCarrier(getPartial: boolean = false, carrierId: string | null = null, driverId: string | null = null) {
		const result = await useAxios().getRequest(ApiUrls.MONITORING_CARRIER_URL, capitalizeKeys({ driverId, carrierId: carrierId ? carrierId : getCarrierId(), ...pagination(getPartial) }));
		if (result.status === 200) {
			carrierMonitoring.value = result.data.successResult.data;
			carrierMonitoringTotal.value = result.data.successResult.totalCount;
			return true;
		}
		return false;
	}

	return {
		providerMonitoring,
		providerMonitoringTotal,
		carrierMonitoring,
		carrierMonitoringTotal,
		getMonitoringProvider,
		getMonitoringCarrier
	};
});
