import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

// importing packages
import { Dayjs } from 'dayjs';

export const useTransferEventsStore = defineStore('transfer', () => {
	const originalDailyEvents = ref<DriverLogsDailyEventsResponse[]>([]);

	async function resignTransferEvents(model: TransferReassignRequest) {
		const result = await useAxios().postRequest(ApiUrls.TRANSFER_REASSIGN_URL, model);
		return result.status === 200;

	}

	async function getOriginalTransferEvents(model: { tabId: string; sessionId: string }) {
		const result = await useAxios().getRequest(ApiUrls.TRANSFER_ORIGINAL_URL, capitalizeKeys(model));
		if (result.status === 200) {
			originalDailyEvents.value = result.data.successResult;
		}
	}

	async function getGraphTransferEvents(model: { tabId: string; sessionId: string; screenResolution: number }) {
		const result = await useAxios().getRequest(ApiUrls.TRANSFER_GRAPH_URL, capitalizeKeys(model));
		if (result.status === 200) {
			return result.data.successResult;
		}
		return false;
	}

	async function getDailySummaryTransferEvents(model: { tabId: string; sessionId: string }) {
		const result = await useAxios().getRequest(ApiUrls.TRANSFER_DAILY_SUMMARY_URL, capitalizeKeys(model));
		if (result.status === 200) {
			return result.data.successResult;
		}
		return false;
	}

	async function setTransferEventsByDateRange(model: { tabId: string; sessionId: string; startDate: string | Dayjs; endDate: string | Dayjs }) {
		const result = await useAxios().postRequest(ApiUrls.TRANSFER_DATE_RANGE_URL, model);
		return result.status === 200;

	}

	async function setTransferEventsByIds(model: { tabId: string; sessionId: string; eventIds: string[] }) {
		const result = await useAxios().postRequest(ApiUrls.TRANSFER_IDS_URL, model);
		return result.status === 200;

	}

	return {
		originalDailyEvents,
		resignTransferEvents,
		getOriginalTransferEvents,
		setTransferEventsByDateRange,
		setTransferEventsByIds,
		getGraphTransferEvents,
		getDailySummaryTransferEvents
	};
});
