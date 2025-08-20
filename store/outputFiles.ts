import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

// importing packages
import type { Dayjs } from 'dayjs';

// importing helpers
import { addSuccess } from '~/helpers/notification';

export const useOutputFilesStore = defineStore('outputFiles', () => {
	async function sendLogPdfEmail(model: {driverId: string; driverEmail: string; dateTime: Dayjs | string; displayLocation: string}) {
		const result = await useAxios().postRequest(ApiUrls.OUTPUT_FILES_SEND_LOG_URL, model);
		if (result.status === 200) {
			addSuccess(successMessages.sent);
			return result.data.successResult;
		}
		return false;
	}

	return {
		sendLogPdfEmail
	};
});
