import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addSuccess } from '~/helpers/notification';

export const useAI = defineStore('AI', () => {
	const aiEventReport = ref<AiEventReportsResponse>();
	const aiMovedTimes = ref<BoostFreeTime[]>([]);
	const chatHistory = ref<AiChatHistoryResponse[]>([]);

	async function addAIShift(model: { sessionId: string; tabId: string; filteredId: string | null; }) {
		const result = await useAxios().postRequest(ApiUrls.AI_SHIFT_URL, model);
		if (result.status === 200) {
			return result.data.successResult;
		}
    return false;
	}

	async function getEventReports(model: { sessionId: string; tabId: string; }) {
		const result = await useAxios().getRequest(ApiUrls.AI_EVENT_REPORTS_URL, capitalizeKeys(model));
		if (result.status === 200) {
			aiEventReport.value = result.data.successResult;
		}
	}

	async function getMovedTimes(model: { sessionId: string; tabId: string; screenResolution: number; }) {
		const result = await useAxios().getRequest(ApiUrls.AI_MOVED_TIMES_URL, capitalizeKeys(model));
		if (result.status === 200) {
			aiMovedTimes.value = result.data.successResult;
		}
	}

	async function getChatHistory(model: { sessionId: string; tabId: string; }) {
		const result = await useAxios().getRequest(ApiUrls.AI_CHAT_HISTORY_URL, capitalizeKeys(model));
		if (result.status === 200) {
			chatHistory.value = result.data.successResult;
		}
	}

	async function addChat(model: AiChatAddRequest) {
		const result = await useAxios().postRequest(ApiUrls.AI_CHAT_ADD_URL, [model]);
		if (result.status === 200) {
			return true;
		}
		return false;
	}

	async function submitAI(sessionId: string) {
		const result = await useAxios().postRequest(`${ApiUrls.AI_SUBMIT_URL}/${sessionId}`);
		if (result.status === 200) {
			addSuccess(successMessages.submitted);
			return result.data.successResult;
		}
		return false;
	}

	return {
		aiEventReport,
		aiMovedTimes,
		chatHistory,
		addAIShift,
		getEventReports,
		getMovedTimes,
		getChatHistory,
		addChat,
		submitAI
	};
});
