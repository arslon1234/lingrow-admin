import { useBoostStore } from '~/store/boost';
import { useBoostEventsStore } from '~/store/boostEvents';
import { useChart } from '~/store/chart';
import { useDriverDailyFormsStore } from '~/store/driverDailyForms';
import { useDriverLogs } from '~/store/driverLogs';
import { useDriversStore } from '~/store/drivers';
import { useSessionsStore } from '~/store/sessions';
import { useTabsStore } from '~/store/tabs';

import { Dayjs } from 'dayjs';
import { useTimeZoneHelper } from '~/helpers/timezone';
export const logsFormService = {
	// Stores getter
	getStores() {
		return {
			tabStore: useTabsStore(),
			boostStore: useBoostStore(),
			chartStore: useChart(),
			boostEventsStore: useBoostEventsStore(),
			sessionStore: useSessionsStore(),
			driversStore: useDriversStore(),
			driverDailyFormsStore: useDriverDailyFormsStore(),
			driverLogsStore: useDriverLogs()
		};
	},

	async editDriverDailyFormModal(editDriverDailyForm: EditDriverDailyForm, state: LogsState) {
		const { driverDailyFormsStore, driversStore } = this.getStores();
		const { driverDailyForm } = storeToRefs(driverDailyFormsStore);
		await driversStore.getDriversFilter();
		editDriverDailyForm.coDrivers = driverDailyForm.value?.coDriver?.id ?? '';
		editDriverDailyForm.shippingDocs = driverDailyForm.value?.shippingDocuments.join(',') ?? '';
		editDriverDailyForm.trailers = driverDailyForm.value?.trailers.join(',') ?? '';
		editDriverDailyForm.signaturePath = driverDailyForm.value?.signaturePath ?? '';
		state.modals.editProfileModal = true;
	},

	async submitDriverDailyForm(
		editDriverDailyForm: EditDriverDailyForm,
		state: LogsState,
		headerDate: Dayjs,
		getDriverDailyForm: () => void,
		driverId: string
	) {
		const { formatToUTC, convertToTimeZone } = useTimeZoneHelper();
		const { driverDailyFormsStore } = this.getStores();
		const model: DriverDailyFormsRequest = {
			driverId: driverId,
			certifiedDate: formatToUTC(convertToTimeZone()),
			formDate: formatToUTC(headerDate),
			coDriverId: editDriverDailyForm.coDrivers,
			shippingDocuments: editDriverDailyForm.shippingDocs.split(','),
			trailers: editDriverDailyForm.trailers.split(','),
			signaturePath: editDriverDailyForm.signaturePath
		};

		try {
			state.loading = true;
			await driverDailyFormsStore.updateDriverDailyForms(model);
		} catch (error) {
			console.error(error);
		} finally {
			state.loading = false;
			getDriverDailyForm();
			state.modals.editProfileModal = false;
		}
	},

	async getDriverDailyForm(driverId: string, headerDate: Dayjs) {
		const { driverDailyFormsStore } = this.getStores();
		const { formatToUTC } = useTimeZoneHelper();
		const model = {
			driverId: driverId,
			dateTime: formatToUTC(headerDate)
		};
		await driverDailyFormsStore.getDriverDailyFormsByDate(model);
	},

	validateEditDriverDailyForm(editDriverDailyForm: EditDriverDailyForm) {
		const errors = [];
		if (!editDriverDailyForm.coDrivers) errors.push({ path: 'co-drivers', message: errorMessages.blank });
		if (!editDriverDailyForm.shippingDocs) errors.push({ path: 'shipping-docs', message: errorMessages.blank });
		if (!editDriverDailyForm.trailers) errors.push({ path: 'trailers', message: errorMessages.blank });
		if (!editDriverDailyForm.signaturePath) errors.push({ path: 'signature', message: errorMessages.blank });
		if (!editDriverDailyForm.signaturePath.endsWith('.jpg'))
			errors.push({
				path: 'signature',
				message: errorMessages.jpg
			});

		return errors;
	},

	validateStatusForm(statusForm: EventsByOtherRequest, state: LogsState) {
		const { driverLogsStore } = this.getStores();
		const { chartData } = storeToRefs(driverLogsStore);
		const errors = [];
		let new_err = '';
		if (!state.event.editEventStart) errors.push({ path: 'event-start', message: errorMessages.blank });
		if (!state.event.editEventEnd) errors.push({ path: 'event-end', message: errorMessages.blank });
		if (!statusForm.latitude) errors.push({ path: 'latitude', message: errorMessages.blank });
		if (!statusForm.longitude) errors.push({ path: 'longitude', message: errorMessages.blank });
		if (!statusForm.calculatedLocation) errors.push({ path: 'location', message: errorMessages.blank });
		if (isNaN(statusForm.totalEngineHours)) errors.push({ path: 'engineHours', message: errorMessages.blank });
		if (isNaN(statusForm.totalVehicleMiles)) errors.push({ path: 'odometer', message: errorMessages.blank });
		if (!statusForm.annotation) errors.push({ path: 'notes', message: errorMessages.blank });
		if (overlapsWithDrivingEvents(transformToTimeString(state.event.editEventStart), transformToTimeString(state.event.editEventEnd), chartData.value, state.ui.screenResolution)) {
			console.log('error with intersection with driving event', state.action.statusAction);
			new_err = `${state.action.statusAction == 'edit' ? 'Edit' : 'New'} event is intersecting with driving event`;
			errors.push({ path: 'event-start', message: 'errorMessages.intersectsWithDriving' });
			errors.push({ path: 'event-end', message: 'errorMessages.intersectsWithDriving' });
		}
		return { errors, new_err };
	}
};
