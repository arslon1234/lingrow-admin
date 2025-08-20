import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

// importing packages
import { Dayjs } from 'dayjs';

// importing helpers
import { addSuccess } from '~/helpers/notification';

export const useAuditStore = defineStore('Audit', () => {
	// driver logs chart data
	const auditChartData = ref<GraphResponse>();

	// driver logs daily events
	const auditDailyEvents = ref<DriverLogsDailyEventsResponse[]>([]);

	// driver logs daily summary
	const auditDailySummary = ref<DailySummaryResponse>();

	// driver weekly violations
	const auditWeeklyViolations = ref<DriverLogsWeeklyViolationResponse[]>([]);

	// tracking weight stations
	const auditWeightStations = ref<WeightStation[]>([]);

	// tracking
	const auditTrackings = ref<TrackingResponse[]>([]);

	async function addAudit(model: AuditRequest) {
		const response = await useAxios().postRequest(ApiUrls.AUDIT_URL, model);
		if (response.status === 200) {
			addSuccess(successMessages.created)
			return response.data.successResult;
		}
		return false;
	}

	async function getAuditEvents(model: {driverId: string; startDate: string | Dayjs; endDate: string | Dayjs;}) {
		const response = await useAxios().getRequest(ApiUrls.AUDIT_EVENTS_URL, capitalizeKeys(model));
		if (response.status === 200) {
			auditDailyEvents.value = response.data.successResult;
			return true;
		}
		return false;
	}

	async function getAuditSummary(model: {driverId: string; startDate: string | Dayjs; endDate: string | Dayjs;}) {
		const response = await useAxios().getRequest(ApiUrls.AUDIT_SUMMARY_URL, capitalizeKeys(model));
		if (response.status === 200) {
			auditDailySummary.value = response.data.successResult;
			return true;
		}
		return false;
	}

	async function getAuditGraph(model: {driverId: string; startDate: string | Dayjs; endDate: string | Dayjs; screenResolution: number}) {
		const response = await useAxios().getRequest(ApiUrls.AUDIT_GRAPH_URL, capitalizeKeys(model));
		if (response.status === 200) {
			auditChartData.value = response.data.successResult;
			return true;
		}
		return false;
	}

	async function getAuditViolations(model: {driverId: string; startDate: string | Dayjs; endDate: string | Dayjs;}) {
		const response = await useAxios().getRequest(ApiUrls.AUDIT_VIOLATIONS_URL, capitalizeKeys(model));
		if (response.status === 200) {
			auditWeeklyViolations.value = response.data.successResult;
			return true;
		}
		return false;
	}

	async function getAuditWeightStations() {
		const response = await useAxios().getRequest(ApiUrls.AUDIT_WEIGHT_STATIONS_URL);
		if (response.status === 200) {
			auditWeightStations.value = response.data.successResult;
			return true;
		}
		return false;
	}

	async function getAuditTracking(model: {driverId: string; auditId: string; tripNumber: number[];}) {
		const response = await useAxios().getRequest(ApiUrls.AUDIT_TRACKING_URL, capitalizeKeys(model));
		if (response.status === 200) {
			auditTrackings.value = response.data.successResult;
			return true;
		}
		return false;
	}

	return {
		auditWeeklyViolations,
		auditWeightStations,
		auditTrackings,
		auditChartData,
		auditDailyEvents,
		auditDailySummary,
		addAudit,
		getAuditEvents,
		getAuditSummary,
		getAuditGraph,
		getAuditViolations,
		getAuditWeightStations,
		getAuditTracking,
	};
});
