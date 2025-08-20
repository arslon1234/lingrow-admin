import { useBoostStore } from '~/store/boost';
import { useBoostEventsStore } from '~/store/boostEvents';
import { useChart } from '~/store/chart';
import { useTabsStore } from '~/store/tabs';
import { useSessionsStore } from '~/store/sessions';
import { useDriversStore } from '~/store/drivers';

// Importing Helpers
import { useTimeZoneHelper } from '~/helpers/timezone';
export const boostEventService = {
	// Stores getter
	getStores() {
		return {
			tabStore: useTabsStore(),
			boostStore: useBoostStore(),
			chartStore: useChart(),
			boostEventsStore: useBoostEventsStore(),
			sessionStore: useSessionsStore(),
			driverStore: useDriversStore()
		};
	},
	async copyBoostEvent(eventId: string, getBoostActions: () => void) {
		const { tabStore, boostEventsStore, sessionStore } = this.getStores();
		const { selectedTab } = storeToRefs(tabStore);
		const { sessionId } = storeToRefs(sessionStore);
		try {
			const model: BoostEventActionRequest = {
				tabId: selectedTab.value?.id as string,
				sessionId: sessionId.value as string,
				eventId
			};
			await boostEventsStore.copyBoostEvent(model);
		} catch (error) {
			console.log(error);
		} finally {
			getBoostActions();
		}
	},
	async revertBoostEvent(eventId: string, getBoostActions: () => void) {
		const { tabStore, boostEventsStore, sessionStore } = this.getStores();
		const { selectedTab } = storeToRefs(tabStore);
		const { sessionId } = storeToRefs(sessionStore);
		try {
			const model: BoostEventActionRequest = {
				tabId: selectedTab.value?.id as string,
				sessionId: sessionId.value as string,
				eventId
			};
			await boostEventsStore.revertBoostEvent(model);
		} catch (error) {
			console.log(error);
		} finally {
			getBoostActions();
		}
	},
	async deleteBoostEvent(eventId: string, getBoostActions: () => void) {
		const { tabStore, boostEventsStore, sessionStore } = this.getStores();
		const { selectedTab } = storeToRefs(tabStore);
		const { sessionId } = storeToRefs(sessionStore);
		try {
			const model: BoostEventActionRequest = {
				tabId: selectedTab.value?.id as string,
				sessionId: sessionId.value as string,
				eventId
			};
			await boostEventsStore.deleteBoostEvent(model);
		} catch (error) {
			console.log(error);
		} finally {
			getBoostActions();
		}
	},
	async submitBoostEvents(getBoostActions: () => void, loadingState: BoostLoadingState) {
		const { boostEventsStore, sessionStore } = this.getStores();
		const { sessionId } = storeToRefs(sessionStore);
		const { submitsCount, totalEvents } = storeToRefs(boostEventsStore);
		const { simulateSubmit, addResponseTime } = useProgress();
		try {
			loadingState.isBoostEventsSubmitLoaded = true
			await simulateSubmit(totalEvents.value);
			const start = Date.now();
			const submitRes = await boostEventsStore.submitBoostEvents(sessionId.value as string);
			const end = Date.now();

			if (submitRes) {
				loadingState.isBoostEventsSubmitted = true;
				console.log(roundNumberByDecimalDig((end - start) / 1000, 3), 'response-time');
				addResponseTime(roundNumberByDecimalDig((end - start) / 1000, 3));
				submitsCount.value = totalEvents.value;
			} else {
				loadingState.isBoostEventsSubmitted = false;
			}
		} catch (error) {
			console.log(error);
			submitsCount.value = 0;
		} finally {
			loadingState.isBoostEventsSubmitLoaded = false
			getBoostActions();
		}
	},
	async openEditBoostEvent(id: string, editStatus: BoostEventStatusForm, modalState: BoostModalState) {
		const { boostEventsStore, driverStore } = this.getStores();
		const { boostEvent } = storeToRefs(boostEventsStore);
		const { acceptAsTimeZone } = useTimeZoneHelper();
		try {
			clearObject(editStatus, ['startDate', 'location_origin']);
			await boostEventsStore.getBoostEvent(id);
			var driver = await driverStore.getDriverById(boostEvent.value?.driver.driverId as string);
			editStatus.id = boostEvent.value?.sequenceId as number;
			editStatus.eventId = boostEvent.value?.id as string;
			editStatus.startDate = acceptAsTimeZone(boostEvent.value?.dateTime as string);
			editStatus.origin = boostEvent.value?.recordOrigin as number;
			editStatus.event = { eventCode: boostEvent.value?.eventCode as number, eventType: boostEvent.value?.eventType as number };
			//editStatus.vehicle = boostEvent.value?.driver.vehicleUnit as string;
			editStatus.vehicles = driver?.vehicles || [];
			editStatus.vehicleId = boostEvent.value?.driver.vehicleId as string;
			editStatus.odometer = boostEvent.value?.totalVehicleMiles as number;
			editStatus.engine_hours = boostEvent.value?.totalEngineHours as number;
			editStatus.location_origin = boostEvent.value?.locationOrigin as number;
			editStatus.longitude = boostEvent.value?.longitude as number;
			editStatus.latitude = boostEvent.value?.latitude as number;
			editStatus.location = boostEvent.value?.calculatedLocation as string;
			editStatus.location_note = boostEvent.value?.manualLocation as string;
			editStatus.notes = boostEvent.value?.annotation as string;
			editStatus.certifiedDate = boostEvent.value?.certifiedDate as string;

			// if (editStatus.latitude && editStatus.longitude) {
			// 	editStatus.location_origin = 1;
			// } else {
			// 	editStatus.location_origin = 2;
			// }
		} catch (error) {
			console.log(error);
		} finally {
			modalState.editStatusModal = true;
		}
	},
	async submitEditBoostEvent(loadingState: BoostLoadingState, editStatus: BoostEventStatusForm, modalState: BoostModalState, selectedState: BoostSelectedState, getBoostActions: () => void) {
		const { boostEventsStore, driverStore, tabStore, sessionStore } = this.getStores();
		const { selectedTab } = storeToRefs(tabStore);
		const { sessionId } = storeToRefs(sessionStore);
		// const { selectedDriver } = storeToRefs(driverStore);
		const { acceptAsTimeZone, formatToUTC, getStartOf } = useTimeZoneHelper();
		try {
			loadingState.loading = true;
			const model: BoostEventAddUpdateRequest = {
				tabId: selectedTab.value?.id as string,
				sessionId: sessionId.value as string,
				driverId: selectedState.selectedDriver as string,
				vehicleId: editStatus.vehicleId as string,
				sequenceId: editStatus.id,
				recordStatus: 1,
				recordOrigin: editStatus.origin as number,
				eventType: editStatus.event.eventType as number,
				eventCode: editStatus.event.eventCode as number,
				dateTime: formatToUTC(acceptAsTimeZone(editStatus.startDate)),
				totalVehicleMiles: editStatus.odometer as number,
				totalEngineHours: editStatus.engine_hours as number,
				locationOrigin: editStatus.location_origin as number,
				latitude: editStatus.latitude as number,
				longitude: editStatus.longitude as number,
				calculatedLocation: editStatus.location,
				manualLocation: editStatus.location_note,
				annotation: editStatus.notes,
				certifiedDate: formatToUTC(acceptAsTimeZone(getStartOf(editStatus.certifiedDate)))
			};
			
			const res = await boostEventsStore.updateBoostEvent(editStatus.eventId, model);
			if (res) {
				getBoostActions();
			}

		} catch (error) {
			console.log(error);
		} finally {
			loadingState.loading = false;
			modalState.editStatusModal = false;
		}
	},
	getEventLocation(event: any) {
		if (event?.locationOrigin === 1 || !Number.isInteger(event?.locationOrigin)) {
			return event.calculatedLocation || event.manualLocation;
		}
		return event.manualLocation || event.calculatedLocation;
	},
	mapSingleEvent(boostDailyEvent: any) {
		const hasErrors = (boostDailyEvent?.errorTitles?.length ?? 0) > 0;
		const hasWarnings = (boostDailyEvent?.warningTitles?.length ?? 0) > 0;

		return {
			id: boostDailyEvent.id,
			count: boostDailyEvent.sequenceId,
			est: formatTime(boostDailyEvent.dateTime, 'MMM D, YYYY hh:mm:ss A'),
			event: {
				eventType: boostDailyEvent.eventType,
				eventCode: boostDailyEvent.eventCode
			},
			certifiedDate: boostDailyEvent.certifiedDate,
			duration: boostDailyEvent.durationInSeconds > 0 || [1, 3].includes(boostDailyEvent.eventType) ? formatDuration(boostDailyEvent.durationInSeconds, true) : '',
			location: boostDailyEvent.eventType === 4 ? '' : this.getEventLocation(boostDailyEvent),
			system: RecordOrigin[boostDailyEvent.recordOrigin as keyof typeof RecordOrigin].shortName,
			odometer: boostDailyEvent.eventType === 4 ? '' : boostDailyEvent.totalVehicleMiles,
			hours: boostDailyEvent.eventType === 4 ? '' : boostDailyEvent.totalEngineHours,
			notes: boostDailyEvent.annotation,
			recordStatus: boostDailyEvent.recordStatus,
			recordOrigin: boostDailyEvent.recordOrigin,
			status: boostDailyEvent.actionState,
			isDOTInspected: boostDailyEvent.isDOTInspected,
			errorTitles: boostDailyEvent?.errorTitles,
			warningTitles: boostDailyEvent?.warningTitles,
			class: hasErrors
				? '!bg-red-0/[.2] hover:!bg-red-0/[.3] dark:!bg-red-0/[.1] dark:hover:!bg-red-0/[.2]'
				: hasWarnings
				? '!bg-yellow-1/[.2] hover:!bg-yellow-1/[.3] dark:!bg-yellow-1/[.1] dark:hover:!bg-yellow-1/[.2]'
				: ''
		};
	},
	detectNearestErrorOrWarningEvent(detailList: Ref<any>, chartStates: BoostChartStates, table: Ref<any>) {
		const errorEvents = detailList.value?.flatMap((item: any) => toRaw(item.events)).filter((event: any) => event?.errorTitles?.length > 0 || event?.warningTitles?.length > 0);

		const ind = errorEvents?.findIndex((e: any) => e.id == chartStates.selectedErrorEvent?.id) ?? -1;

		if (ind === -1) {
			chartStates.selectedErrorEvent = errorEvents?.[0];
		} else if (ind + 1 < errorEvents.length) {
			chartStates.selectedErrorEvent = errorEvents[ind + 1];
		}

		console.log('error event', chartStates.selectedErrorEvent);

		if (chartStates.selectedErrorEvent) {
			table.value?.scrollToRow(chartStates.selectedErrorEvent.id, false);
		}
	},
	handleEventSelect(newValue:any, uiStates: BoostUiStates) {
		const { eventType } = newValue;
		if (eventType === 4) {
			uiStates.isVisibleCertifiedDate = false;
		}
	}
};





// const mapBoostEvents = (boostEvents?: BoostEventsResponse[] | null) =>
// 	boostEvents && boostEvents.length > 0
// 		? [
// 				...boostEvents.map((dailyEvent) => ({
// 					date: acceptAsTimeZone(dailyEvent.date).format('YYYY-MM-DD'),
// 					dailyForm: editDriverDailyForms.value.find((form) => compareDates(form.formDate, dailyEvent.date)),
// 					events:
// 						dailyEvent.events && dailyEvent.events.length > 0
// 							? [
// 									...dailyEvent.events.map((boostDailyEvent, ind) => ({
// 										id: boostDailyEvent.id,
// 										count: boostDailyEvent.sequenceId,
// 										est: formatTime(boostDailyEvent.dateTime, 'MMM D, YYYY hh:mm:ss A'),
// 										event: {
// 											eventType: boostDailyEvent.eventType,
// 											eventCode: boostDailyEvent.eventCode
// 										},
// 										certifiedDate: boostDailyEvent.certifiedDate,
// 										duration: boostDailyEvent.durationInSeconds > 0 || [1, 3].includes(boostDailyEvent.eventType) ? formatDuration(boostDailyEvent.durationInSeconds, true) : '',
// 										location:
// 											boostDailyEvent.eventType == 4
// 												? ''
// 												: boostDailyEvent?.locationOrigin == 1 || !Number.isInteger(boostDailyEvent?.locationOrigin)
// 												? boostDailyEvent.calculatedLocation || boostDailyEvent.manualLocation
// 												: boostDailyEvent.manualLocation || boostDailyEvent.calculatedLocation,
// 										system: RecordOrigin[boostDailyEvent.recordOrigin as keyof typeof RecordOrigin].shortName,
// 										odometer: boostDailyEvent.eventType == 4 ? '' : boostDailyEvent.totalVehicleMiles,
// 										hours: boostDailyEvent.eventType == 4 ? '' : boostDailyEvent.totalEngineHours,
// 										notes: boostDailyEvent.annotation,
// 										recordStatus: boostDailyEvent.recordStatus,
// 										recordOrigin: boostDailyEvent.recordOrigin,
// 										status: boostDailyEvent.actionState,
// 										isDOTInspected: boostDailyEvent.isDOTInspected,
// 										errorTitles: boostDailyEvent?.errorTitles,
// 										warningTitles: boostDailyEvent?.warningTitles,
// 										class:
// 											boostDailyEvent?.errorTitles?.length ?? 0 > 0
// 												? '!bg-red-0/[.2] hover:!bg-red-0/[.3] dark:!bg-red-0/[.1] dark:hover:!bg-red-0/[.2]'
// 												: (boostDailyEvent?.warningTitles?.length ?? 0) > 0
// 												? '!bg-yellow-1/[.2] hover:!bg-yellow-1/[.3]  dark:!bg-yellow-1/[.1] dark:hover:!bg-yellow-1/[.2]'
// 												: ''
// 									}))
// 							  ]
// 							: []
// 				}))
// 		  ]
// 		: [];
