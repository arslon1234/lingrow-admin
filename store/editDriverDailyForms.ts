import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

// importing packages
import { Dayjs } from 'dayjs';

export const useEditDriverDailyFormsStore = defineStore('editDriverDailyForms', () => {
	const editDriverDailyForms = ref<EditDriverDailyFormResponse[]>([]);
	const editDriverDailyForm = ref<EditDriverDailyFormByDateResponse>();

	//** GET REQUESTS  **//
	async function getEditDriverDailyForms(model: { tabId: string; sessionId: string }, signal: AbortSignal) {
		const response = await useAxios().getRequest(ApiUrls.EDIT_DRIVER_DAILY_FORMS_URL, capitalizeKeys(model), {}, signal);
		if (response.status === 200) {
			editDriverDailyForms.value = response.data.successResult;
		}
	}

	async function getEditDriverDailyForm(model: { tabId: string; sessionId: string; dateTime: Dayjs | string }) {
		const response = await useAxios().getRequest(ApiUrls.EDIT_DRIVER_DAILY_FORMS_BY_DATE_URL, capitalizeKeys(model));
		if (response.status === 200) {
			editDriverDailyForm.value = response.data.successResult;
		}
	}

	//** POST REQUESTS  **//
	async function addEditDriverDailyForm(model: EditDriverDailyFormRequest) {
		const response = await useAxios().postRequest(ApiUrls.EDIT_DRIVER_DAILY_FORMS_URL, model);
		if (response.status === 200) {
			return true;
		}
		return false;
	}

	//** PUT REQUESTS  **//
	async function updateEditDriverDailyForm(id: string, model: EditDriverDailyFormRequest) {
		const response = await useAxios().putRequest(`${ApiUrls.EDIT_DRIVER_DAILY_FORMS_URL}/${id}`, model);
		if (response.status === 200) {
			return true;
		}
		return false;
	}

	async function submitEditDriverDailyForm(sessionId: string) {
		const response = await useAxios().putRequest(`${ApiUrls.SUBMIT_DRIVER_DAILY_FORMS_BY_DATE_URL}/${sessionId}`);
		if (response.status === 200) {
			return true;
		}
		return false;
	}

	return {
		editDriverDailyForm,
		editDriverDailyForms,

		/** GET REQUESTS **/
		getEditDriverDailyForm,
		getEditDriverDailyForms,

		/** POST REQUESTS **/
		addEditDriverDailyForm,

		/** PUT REQUESTS **/
		updateEditDriverDailyForm,
		submitEditDriverDailyForm
	};
});
