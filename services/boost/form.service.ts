import { Dayjs } from 'dayjs';
import { useBoostStore } from '~/store/boost';
import { useBoostEventsStore } from '~/store/boostEvents';
import { useChart } from '~/store/chart';
import { useDriversStore } from '~/store/drivers';
import { useEditDriverDailyFormsStore } from '~/store/editDriverDailyForms';
import { useSessionsStore } from '~/store/sessions';
import { useTabsStore } from '~/store/tabs';

// Importing Helpers
import { useTimeZoneHelper } from '~/helpers/timezone';
import { all } from 'axios';
export const boostFormService = {
	getStores() {
		return {
			tabStore: useTabsStore(),
			boostStore: useBoostStore(),
			chartStore: useChart(),
			boostEventsStore: useBoostEventsStore(),
			sessionStore: useSessionsStore(),
			driverStore: useDriversStore(),
			editDriverDailyFormsStore: useEditDriverDailyFormsStore()
		};
	},
	validateStatusForm(editStatus: BoostEventStatusForm) {
		let errors = [];
		if (editStatus.location_origin === 1 && !editStatus.latitude) {
			errors.push({ path: 'latitude', message: errorMessages.blank });
		}
		if (editStatus.location_origin === 1 && !editStatus.longitude) {
			errors.push({ path: 'longitude', message: errorMessages.blank });
		}
		if (editStatus.location_origin === 1 && !editStatus.location) {
			errors.push({ path: 'location', message: errorMessages.blank });
		}
		if (editStatus.location_origin === 2 && !editStatus.location_note) {
			errors.push({ path: 'locationNote', message: errorMessages.blank });
		}
		return errors;
	},

	validateProfileForm(editProfile: BoostEventEditProfile) {
		let errors = [];
		if (!editProfile.trailer) {
			errors.push({ path: 'trailer', message: errorMessages.blank });
		}
		if (!editProfile.shipping_docs) {
			errors.push({ path: 'shipping_docs', message: errorMessages.blank });
		}
		if (!editProfile.signature) {
			errors.push({ path: 'signature', message: errorMessages.blank });
		}
		return errors;
	},

	validateBoostForm(formBoost: BoostForm) {
		let errors = [];
		if (!formBoost.transferring_time) {
			errors.push({ path: 'transferring_time', message: errorMessages.blank });
		}
		return errors;
	},

	async submitBoostForm(loadingState: BoostLoadingState, getBoostActions: (num: number) => void, formBoost: BoostForm, modalState: BoostModalState) {
		const { boostEventsStore, tabStore, sessionStore, chartStore, boostStore } = this.getStores();
		const { selectedTab } = storeToRefs(tabStore);
		const { sessionId } = storeToRefs(sessionStore);
		const { chart } = storeToRefs(chartStore);
		const { isBoostTimeMoved } = storeToRefs(boostStore);
		const { selectedMoveEvents, isMoveTimeEventsReversed, selectedMoveEventsDurations } = storeToRefs(boostEventsStore);
		try {
			loadingState.loading = true;
			const { hours, minutes, seconds } = formBoost.transferring_time;
			const allSeconds = hours * 3600 + minutes * 60 + seconds;

			const model: BoostEventMoveTimeRequest = {
				moveEventTimeType: 0,
				timeAmount: isMoveTimeEventsReversed.value ? -allSeconds : allSeconds,
				eventIds: selectedMoveEvents.value[selectedTab.value?.id as string].map((event: GraphDuties) => event?.eventId),
				sessionId: sessionId.value as string,
				tabId: selectedTab.value?.id as string,
				eventsDurations: selectedMoveEventsDurations.value,
			};
			await boostEventsStore.moveTimeBoostEvents(model);
			selectedMoveEvents.value[selectedTab.value?.id as string] = [];
			isBoostTimeMoved.value[selectedTab.value?.id as string] = true;
			getBoostActions(3);
		} catch (error) {
			console.log(error);
		} finally {
			loadingState.loading = false;
			modalState.boostModal = false;
			chart.value.clearSelectedEvents();
		}
	},

	async submitEditDailyForm(loadingState: BoostLoadingState, getBoostActions: () => void, editProfile: BoostEventEditProfile, modalState: BoostModalState, selectedState: BoostSelectedState) {
		const { tabStore, sessionStore, driverStore, editDriverDailyFormsStore } = this.getStores();
		const { selectedTab } = storeToRefs(tabStore);
		const { sessionId } = storeToRefs(sessionStore);
		// const { selectedDriver } = storeToRefs(driverStore);
		const { convertToTimeZone, formatToUTC } = useTimeZoneHelper();
		try {
			loadingState.loading = true;
			const editDriverDailyFormModel: EditDriverDailyFormRequest = {
				driverId: selectedState.selectedDriver as string,
				assignedVehicleIds: editProfile.assignedVehicleIds,
				trailers: editProfile.trailer?.split(',') as string[],
				shippingDocuments: editProfile.shipping_docs?.split(',') as string[],
				coDriverId: editProfile.co_driver,
				formDate: editProfile.date,
				certifiedDate: formatToUTC(convertToTimeZone()),
				signaturePath: editProfile.signature,
				tabId: selectedTab.value?.id as string,
				sessionId: sessionId.value as string
			};

			if (!editProfile.dailyFormId) {
				await editDriverDailyFormsStore.addEditDriverDailyForm(editDriverDailyFormModel);
			} else {
				await editDriverDailyFormsStore.updateEditDriverDailyForm(editProfile.dailyFormId, editDriverDailyFormModel);
			}
		} catch (error) {
			console.log(error);
		} finally {
			loadingState.loading = false;
			modalState.editProfileModal = false;
			getBoostActions();
		}
	},

	async getEditDriverDailyForm(editProfile: BoostEventEditProfile) {
		const { tabStore, sessionStore, editDriverDailyFormsStore } = this.getStores();
		const { selectedTab } = storeToRefs(tabStore);
		const { sessionId } = storeToRefs(sessionStore);
		const { editDriverDailyForm } = storeToRefs(editDriverDailyFormsStore);
		const { formatToUTC } = useTimeZoneHelper();

		await editDriverDailyFormsStore.getEditDriverDailyForm({
			tabId: selectedTab.value?.id as string,
			sessionId: sessionId.value as string,
			dateTime: formatToUTC(editProfile.date)
		});
		editProfile.co_drivers = editDriverDailyForm.value?.coDrivers || [];
		editProfile.co_driver =
			(editDriverDailyForm.value?.coDrivers?.find((driver) => driver.driverId === editDriverDailyForm.value?.driverDailyForm?.coDriver?.id)?.driverId as string) || null;
		editProfile.shipping_docs = (editDriverDailyForm.value?.driverDailyForm?.shippingDocuments.join(',') as string) || null;
		editProfile.signature = editDriverDailyForm.value?.driverDailyForm?.signaturePath || (editDriverDailyForm.value?.signaturePath as string) || null;
		editProfile.trailer = (editDriverDailyForm.value?.driverDailyForm?.trailers.join(',') as string) || null;
		editProfile.dailyFormId = editDriverDailyForm.value?.driverDailyForm?.id || null;
		editProfile.assignedVehicleIds = editDriverDailyForm.value?.driverDailyForm?.assignedVehicles.map((vehicle) => vehicle.id as string) || [];
	},

	async openEditDriverDailyForm(editProfile: BoostEventEditProfile, modalState: BoostModalState, date: string | Dayjs) {
		const { getStartOf, acceptAsTimeZone } = useTimeZoneHelper();
		clearObject(editProfile, ['date']);
		try {
			editProfile.date = getStartOf(acceptAsTimeZone(date));
			await this.getEditDriverDailyForm(editProfile);
		} catch (error) {
			console.log(error);
		} finally {
			modalState.editProfileModal = true;
		}
	}
};
