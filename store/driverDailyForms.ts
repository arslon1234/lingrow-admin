import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

// importing packages
import { Dayjs } from 'dayjs';

export const useDriverDailyFormsStore = defineStore('driverDailyForms', () => {
	const driverDailyForm = ref<DriverDailyFormsResponse>();

	async function getDriverDailyFormsByDate(model: {driverId: string; dateTime: Dayjs | string}) {
		const response = await useAxios().getRequest(`${ApiUrls.DRIVER_DAILY_FORMS_URL}/${model.driverId}/by-date`, model);
		if (response.status === 200) {
			driverDailyForm.value = response.data.successResult;
		}
	}

  async function updateDriverDailyForms(model: DriverDailyFormsRequest) {
		const response = await useAxios().postRequest(`${ApiUrls.DRIVER_DAILY_FORMS_URL}/save`, model);
		if (response.status === 200) {
			driverDailyForm.value = response.data.successResult;
		}
	}

	return {
		driverDailyForm,
		getDriverDailyFormsByDate,
    updateDriverDailyForms
	};
});
