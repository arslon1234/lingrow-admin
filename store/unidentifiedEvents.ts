import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

// importing helpers
import { addError, addSuccess } from '~/helpers/notification';

// importing packages
import { Dayjs } from 'dayjs';

export const useUnidentifiedEventsStore = defineStore('unidentifiedEvents', () => {
	const unidentifiedEvents = ref<UnidentifiedEventsResponse[]>([]);
	const unidentifiedEventsTotal = ref<number>(0);

	async function getUnidentifiedEvents(dateTime: Dayjs | string | null, vehicleId: string | null) {
		const model = {
			dateTime,
			vehicleId,
			carrierId: getCarrierId(),
			...pagination()
		};
		const result = await useAxios().getRequest(ApiUrls.UNIDENTIFIED_EVENTS_FIlTER_URL, capitalizeKeys(model));
		if (result.status === 200) {
			unidentifiedEventsTotal.value = result.data.successResult.totalCount;
			unidentifiedEvents.value = result.data.successResult.data;
		}
	}

	async function selectUnidentifiedEvents(model: {eventIds: string[]; eventCode: number; eventType: number}): Promise<boolean> {
		const result = await useAxios().postRequest(ApiUrls.UNIDENTIFIED_EVENTS_SELECT_URL, model);
		if (result.status === 200) {
			addSuccess(successMessages.selected);
			return true;
		} else {
			addError(result.message);
			return false;
		}
	}

	async function reassignUnidentifiedEvents(model: {eventIds: string[]; driverId: string}): Promise<boolean> {
		const result = await useAxios().postRequest(ApiUrls.UNIDENTIFIED_EVENTS_REASSIGN_URL, model);
		if (result.status === 200) {
			addSuccess(successMessages.reassign);
			return true;
		} else {
			addError(result.message);
			return false;
		}
	}


	return {
		unidentifiedEvents,
		unidentifiedEventsTotal,
		getUnidentifiedEvents,
		selectUnidentifiedEvents,
		reassignUnidentifiedEvents
	};
});
