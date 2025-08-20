import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

// importing packages
import { Dayjs } from 'dayjs';
import { addSuccess } from '~/helpers/notification';

export const useLogsStore = defineStore('logs', () => {
	const driversLogs = ref<LogsDriverResponse[]>([]);
	const driverLogs = ref<LogDriverResponse[]>([]);
	const driversLogsTotal = ref<number>(0);
	const driverLogsTotal = ref<number>(0);

	async function getDriversLogs(model: { startTime: string | Dayjs; endTime: string | Dayjs; type: number | null }) {

		const response = await useAxios().getRequest(ApiUrls.LOGS_DRIVERS_URL, capitalizeKeys({ ...model, carrierId: getCarrierId(), ...pagination() }));
		if (response.status === 200) {
			driversLogs.value = response.data.successResult.data;
			driversLogsTotal.value = response.data.successResult.totalCount;
		}
	}

	async function getDriverLogs(model: { driverId: string; startTime: string | Dayjs; endTime: string | Dayjs; type: number | null }) {
		const response = await useAxios().getRequest(ApiUrls.LOGS_DRIVER_URL, capitalizeKeys({...model, ...pagination()}));
		if (response.status === 200) {
			driverLogs.value = response.data.successResult.data;
			driverLogsTotal.value = response.data.successResult.totalCount;
		}
	}

	async function transferDriverLogs(model: { driverId: string; currentTime: string | Dayjs; transferType: number; comment: string | null }) {
		const response = await useAxios().postRequest(ApiUrls.LOGS_TRANSFER_URL, model);
		if (response.status === 200) {
			addSuccess(successMessages.transferred)
			return response.data.successResult;
		}
	}

	async function downloadLogPdf(model: {driverId: string; startDateUtc: Dayjs | string; endDateUtc: Dayjs | string; displayLocation: string}) {
		const result = await useAxios().postRequest(ApiUrls.LOGS_DOWNLOAD_LOG_PDF_URL, model);
		if (result.status === 200) {
			addSuccess(successMessages.downloaded);
			return result.data.successResult;
		}
		return false;
	}

	return {
		driversLogsTotal,
		driverLogsTotal,
		driversLogs,
		driverLogs,
		getDriversLogs,
		getDriverLogs,
		transferDriverLogs,
		downloadLogPdf
	};
});
