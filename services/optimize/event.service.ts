// Importing stores
import { useBoostStore } from '~/store/boost';
import { useBoostEventsStore } from '~/store/boostEvents';
import { useChart } from '~/store/chart';
import { useTabsStore } from '~/store/tabs';
import { useSessionsStore } from '~/store/sessions';
import { useDriversStore } from '~/store/drivers';

// Importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

export const optimizeEventService = {
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
	async copyOptimizeEvent(eventId: string, getBoostActions: () => void) {
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
	async openEditOptimizeEvent(editStatus: OptimizeEditStatus, id: string, editStatusModal: Ref<boolean>) {
		const { boostEventsStore } = this.getStores();
		const { boostEvent } = storeToRefs(boostEventsStore);
		const { acceptAsTimeZone } = useTimeZoneHelper();
		try {
			clearObject(editStatus, ['startDate']);
			await boostEventsStore.getBoostEvent(id);
			editStatus.id = boostEvent.value?.sequenceId as number;
			editStatus.eventId = boostEvent.value?.id as string;
			editStatus.startDate = acceptAsTimeZone(boostEvent.value?.dateTime as string);
			editStatus.origin = boostEvent.value?.recordOrigin as number;
			editStatus.event = { eventCode: boostEvent.value?.eventCode as number, eventType: boostEvent.value?.eventType as number };
			editStatus.vehicle = '';
			editStatus.vehicleId = boostEvent.value?.vehicleId as string;
			editStatus.odometer = boostEvent.value?.totalVehicleMiles as number;
			editStatus.engine_hours = boostEvent.value?.totalEngineHours as number;
			editStatus.location_origin = boostEvent.value?.locationOrigin as number;
			editStatus.longitude = boostEvent.value?.longitude as number;
			editStatus.latitude = boostEvent.value?.latitude as number;
			editStatus.location = boostEvent.value?.calculatedLocation as string;
			editStatus.location_note = boostEvent.value?.manualLocation as string;
			editStatus.notes = boostEvent.value?.annotation as string;

			// if (editStatus.latitude && editStatus.longitude) {
			// 	editStatus.location_origin = 1;
			// } else {
			// 	editStatus.location_origin = 2;
			// }
		} catch (error) {
			console.log(error);
		} finally {
			editStatusModal.value = true;
		}
	},
	async submitEditOptimizeEvent(loading: Ref<boolean>, editStatus: OptimizeEditStatus, editStatusModal: Ref<boolean>, getBoostActions: () => void, selectedDriver: Ref<string | null>) {
		const { boostEventsStore, driverStore, tabStore, sessionStore } = this.getStores();
		const { selectedTab } = storeToRefs(tabStore);
		const { sessionId } = storeToRefs(sessionStore);
		// const { selectedDriver } = storeToRefs(driverStore);
		const { acceptAsTimeZone, formatToUTC } = useTimeZoneHelper();
		try {
			loading.value = true;
			const model: BoostEventAddUpdateRequest = {
				tabId: selectedTab.value?.id as string,
				sessionId: sessionId.value as string,
				driverId: selectedDriver.value as string,
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
				annotation: editStatus.notes
			};
			await boostEventsStore.updateBoostEvent(editStatus.eventId, model);
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
			editStatusModal.value = false;
			getBoostActions();
		}
	},
	async revertOptimizeEvent(eventId: string, getBoostActions: () => void) {
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
	async deleteOptimizeEvent(eventId: string, getBoostActions: () => void) {
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
	
};





// const mapBoostEvents = (boostEvents?: BoostEventsResponse[] | null) =>
	// 	boostEvents && boostEvents.length > 0
	// 		? [
	// 				...boostEvents.map((dailyEvent) => ({
	// 					// date: acceptAsTimeZone(dailyEvent.date).format('YYYY-MM-DD'),
	// 					// dailyForm: editDriverDailyForms.value.find((form) => compareDates(form.formDate, dailyEvent.date)),
	// 					events:
	// 						dailyEvent.events && dailyEvent.events.length > 0
	// 							? [
	// 									...dailyEvent.events.map((boostDailyEvent, ind) => ({
	// 										id: boostDailyEvent.id,
	// 										count: boostDailyEvent.sequenceId,
	// 										est: formatTime(boostDailyEvent.dateTime, 'MMM D, YYYY hh:mm A'),
	// 										event: {
	// 											eventType: boostDailyEvent.eventType,
	// 											eventCode: boostDailyEvent.eventCode
	// 										},
	// 										duration: formatDuration(boostDailyEvent.durationInSeconds, true),
	// 										location:
	// 											boostDailyEvent?.locationOrigin == 1 || !Number.isInteger(boostDailyEvent?.locationOrigin)
	// 												? boostDailyEvent.calculatedLocation || boostDailyEvent.manualLocation
	// 												: boostDailyEvent.manualLocation || boostDailyEvent.calculatedLocation,
	// 										system: RecordOrigin[boostDailyEvent.recordOrigin as keyof typeof RecordOrigin].shortName,
	// 										odometer: boostDailyEvent.totalVehicleMiles,
	// 										hours: boostDailyEvent.totalEngineHours,
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
	// 												? '!bg-yellow-1/[.2] hover:!bg-yellow-1/[.3] dark:!bg-yellow-1/[.1] dark:hover:!bg-yellow-1/[.2]'
	// 												: ''
	// 									}))
	// 							  ]
	// 							: []
	// 				}))
	// 		  ]
	// 				.map((ev) => ev.events.flat())
	// 				.flat()
	// 		: [];