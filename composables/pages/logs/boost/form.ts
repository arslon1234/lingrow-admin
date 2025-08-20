// Importing External Dependencies
import { Dayjs } from 'dayjs';

import { useEditDriverDailyFormsStore } from '~/store/editDriverDailyForms';
import { useGeoLocations } from '~/store/geoLocations';

import { boostFormService, boostLocationService } from '~/services';
import { editStatus, editProfile, formBoost } from '../constants';
import { useBoostLoadingComposable } from './loading';
import { useBoostUIComposable } from './ui';
export const useBoostFormComposable = () => {
	const editDriverDailyFormsStore = useEditDriverDailyFormsStore();
	const geoLocationsStore = useGeoLocations();

	const { editDriverDailyForms } = storeToRefs(editDriverDailyFormsStore);
	const { calculatedAddress } = storeToRefs(geoLocationsStore);

	const { loadingStates } = useBoostLoadingComposable();
	const { modalStates } = useBoostUIComposable();
	const formStates = reactive<BoostFormStates>({
		editStatus,
		editProfile,
		formBoost
	});

	const dailyFormsMap = computed(() => {
		const map = new Map();
		editDriverDailyForms.value?.forEach((form) => {
			const dateKey = formatTime(form.formDate, 'YYYY-MM-DD');
			map.set(dateKey, form);
		});
		return map;
	});

	const isEditDriverDailyFormDisabled = computed(() => loadingStates.loading || validateProfileForm().length > 0);
	const isBoostFormDisabled = computed(() => validateBoostForm().length > 0 || loadingStates.loading);
	const isEditBoostEventDisabled = computed(() => loadingStates.loading || validateStatusForm().length > 0);

	const getEditDriverDailyForm = async () => {
		await boostFormService.getEditDriverDailyForm(formStates.editProfile);
	};
	// const submitEditDailyForm = async () => {
	// 	await boostFormService.submitEditDailyForm(loadingStates, getBoostActions, formStates.editProfile, modalStates, selectionStates);
	// };
	// const submitBoostForm = async () => {
	// 	await boostFormService.submitBoostForm(loadingStates, getBoostActions, formStates.formBoost, modalStates);
	// };
	const validateBoostForm = () => {
		return boostFormService.validateBoostForm(formStates.formBoost);
	};
	const validateProfileForm = () => {
		return boostFormService.validateProfileForm(formStates.editProfile);
	};
	const validateStatusForm = () => {
		return boostFormService.validateStatusForm(formStates.editStatus);
	};
	const openEditDriverDailyForm = async (date: string | Dayjs) => {
		await boostFormService.openEditDriverDailyForm(formStates.editProfile, modalStates, date);
	};

	const setEditProfileDate = (type: 'add' | 'subtract') => {
		formStates.editProfile.date = type === 'add' ? add(formStates.editProfile.date, 1, 'day') : subtract(formStates.editProfile.date, 1, 'day');
		getEditDriverDailyForm();
	};

	// LocationService
	const copyLongLat = async () => {
		await boostLocationService.copyLongLat(formStates.editStatus);
	};
	const pasteLongLat = async () => {
		await boostLocationService.pasteLongLat(formStates.editStatus);
	};
	const redirectToMap = async () => {
		await boostLocationService.redirectToMap(formStates.editStatus);
	};
	const debouncedChangeLocation = debounce(async (lat: number | string | null, long: number | string | null) => {
		if (lat && long) {
			await geoLocationsStore.getCalculatedAddress({ latitude: lat as number, longitude: long as number });
			formStates.editStatus.location = calculatedAddress.value as string;
		}
	}, 300);

	watch([() => formStates.editStatus.latitude, () => formStates.editStatus.longitude], async ([newLat, newLong]) => {
		debouncedChangeLocation(newLat, newLong);
	});

	return {
		formStates,
		dailyFormsMap,
		isEditDriverDailyFormDisabled,
		isBoostFormDisabled,
		isEditBoostEventDisabled,
		validateProfileForm,
		validateStatusForm,
		openEditDriverDailyForm,
		validateBoostForm,
		setEditProfileDate,
		copyLongLat,
		pasteLongLat,
		redirectToMap
	};
};
