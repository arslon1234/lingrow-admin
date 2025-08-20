// Importing Stores
import { useBoostStore } from '~/store/boost';
import { useBoostEventsStore } from '~/store/boostEvents';
import { useChart } from '~/store/chart';
import { useTabsStore } from '~/store/tabs';
import { useSessionsStore } from '~/store/sessions';
import { useDriversStore } from '~/store/drivers';
import { useTransferEventsStore } from '~/store/transferEvents';
import { useDriverLogs } from '~/store/driverLogs';

// Importing Helpers
import { convertSecondsToHours } from '~/helpers/time';
import { useTimeZoneHelper } from '~/helpers/timezone';
export const logsEventService = {
	// Stores getter
	getStores() {
		return {
			tabStore: useTabsStore(),
			boostStore: useBoostStore(),
			chartStore: useChart(),
			boostEventsStore: useBoostEventsStore(),
			sessionStore: useSessionsStore(),
			driverStore: useDriversStore(),
			transferEventsStore: useTransferEventsStore(),
			driverLogsStore: useDriverLogs()
		};
	},
	async historyTransferEventsSubmit(state: LogsState) {
		const { transferEventsStore, tabStore, sessionStore } = this.getStores();
		const { selectedTab } = storeToRefs(tabStore);
		const { sessionId } = storeToRefs(sessionStore);
		try {
			await transferEventsStore.setTransferEventsByIds({
				tabId: selectedTab.value?.id as string,
				sessionId: sessionId.value as string,
				eventIds: state.table.selectedRow.map((row: any) => row.eventId)
			});
		} catch (error) {
			console.log(error);
		} finally {
			state.table.selectedRow = [];
            state.modals.historyTransferEventsModal = false;
		}
	},

	async historyTransferLogsByPeriodSubmit(forms:LogsForm, state: LogsState) {
		const { transferEventsStore, tabStore, sessionStore } = this.getStores();
		const { selectedTab } = storeToRefs(tabStore);
		const { sessionId } = storeToRefs(sessionStore);
		const { getStartOf, formatToUTC, getEndOf } = useTimeZoneHelper();

		if (!forms.historyTransferForm.dateRangeSubmit) {
			forms.historyTransferForm.dateRangeSubmit = true;
		} else {
			try {
				await transferEventsStore.setTransferEventsByDateRange({
					tabId: selectedTab.value?.id as string,
					sessionId: sessionId.value as string,
					startDate: formatToUTC(getStartOf(forms.historyTransferForm.dateRange[0])),
					endDate: formatToUTC(getEndOf(forms.historyTransferForm.dateRange[1]))
				});
			} catch (error) {
				console.log(error);
			} finally {
				state.table.selectedRow = [];
				forms.historyTransferForm.dateRangeSubmit = false;
                state.modals.historyTransferLogsByPeriodModal = false;
			}
		}
	},

	async getDailyEvents(modelDailyEvents: DriverLogsDailyEventsRequest, tab: string, signal?: AbortSignal) {
		const { transferEventsStore, tabStore, sessionStore, driverLogsStore } = this.getStores();
		const { selectedTab } = storeToRefs(tabStore);
		const { sessionId } = storeToRefs(sessionStore);
		if (tab === 'history') {
			await transferEventsStore.getOriginalTransferEvents({
				tabId: selectedTab.value?.id as string,
				sessionId: sessionId.value as string
			});
		} else {
			await driverLogsStore.getDriverLogsDailyEvents(modelDailyEvents, signal);
		}
	},

	async getDutyEventStatus(editEvent: EditDutyEvent, state:LogsState, editModelChart: DriverDateTimeRequest) {
		let [startHours, startMinutes, startSeconds] = convertPixelToDate(editModelChart.screenResolution, editEvent.x1)?.split(':');
		state.event.editEventStart.hours = parseInt(startHours);
		state.event.editEventStart.minutes = parseInt(startMinutes);
		state.event.editEventStart.seconds = parseInt(startSeconds);

		let [endHours, endMinutes, endSeconds] = convertPixelToDate(editModelChart.screenResolution, editEvent.x2)?.split(':');
		state.event.editEventEnd.hours = parseInt(endHours);
		state.event.editEventEnd.minutes = parseInt(endMinutes);
		state.event.editEventEnd.seconds = parseInt(endSeconds);
	},
	mapSingleEvent(dailyEvent: DriverLogsDailyEventsResponse) {
        const { acceptAsTimeZone} = useTimeZoneHelper();
		return {
			sequence: dailyEvent?.sequenceId,
			time: acceptAsTimeZone(dailyEvent?.dateTime)?.format('MMM D, hh:mm:ss A'),
			event: getEventText(dailyEvent?.eventType, dailyEvent?.eventCode),
			eventType: dailyEvent?.eventType,
			eventCode: dailyEvent?.eventCode,
			eventId: dailyEvent?.id,
			duration: [1, 3].includes(dailyEvent.eventType) ? convertSecondsToHours(dailyEvent?.durationInSeconds ?? 0) : '',
			location:
				dailyEvent?.locationOrigin == 1 || !Number.isInteger(dailyEvent?.locationOrigin)
					? dailyEvent?.calculatedLocation || dailyEvent.manualLocation
					: dailyEvent?.manualLocation || dailyEvent.calculatedLocation,
			odometer: dailyEvent?.totalVehicleMiles,
			hours: dailyEvent?.totalEngineHours,
			recordOrigin: dailyEvent?.recordOrigin ?? 1,
			recordStatus: dailyEvent?.recordStatus ?? 1,
			notes: dailyEvent?.annotation ?? ''
		};
	}
};





// edit daily events
	// const mapDailyEvents = (dailyEvents: DriverLogsDailyEventsResponse[]) =>
	// 	dailyEvents && dailyEvents.length > 0
	// 		? [
	// 				...dailyEvents.map((dailyEvent, ind) => ({
	// 					sequence: dailyEvent?.sequenceId,
	// 					time: acceptAsTimeZone(dailyEvent?.dateTime)?.format('MMM D, hh:mm:ss A'),
	// 					event: getEventText(dailyEvent?.eventType, dailyEvent?.eventCode),
	// 					eventType: dailyEvent?.eventType,
	// 					eventCode: dailyEvent?.eventCode,
	// 					eventId: dailyEvent?.id,
	// 					duration: [1, 3].includes(dailyEvent.eventType) ? convertSecondsToHours(dailyEvent?.durationInSeconds ?? 0) : '',
	// 					location:
	// 						dailyEvent?.locationOrigin == 1 || !Number.isInteger(dailyEvent?.locationOrigin)
	// 							? dailyEvent?.calculatedLocation || dailyEvent.manualLocation
	// 							: dailyEvent?.manualLocation || dailyEvent.calculatedLocation,
	// 					odometer: dailyEvent?.totalVehicleMiles,
	// 					hours: dailyEvent?.totalEngineHours,
	// 					recordOrigin: dailyEvent?.recordOrigin ?? 1,
	// 					recordStatus: dailyEvent?.recordStatus ?? 1,
	// 					notes: dailyEvent?.annotation ?? ''
	// 				}))
	// 		  ]
	// 		: [];