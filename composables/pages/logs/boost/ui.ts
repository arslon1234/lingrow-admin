import { useDriverInfosStore } from '~/store/driverInfos';
import { useDriversStore } from '~/store/drivers';

import { createBoostTableColums } from '../constants';

export const useBoostUIComposable = (formStates?:BoostFormStates) => {
	const driverInfosStore = useDriverInfosStore();
	const driverStore = useDriversStore()

	const { driverTimeZone } = storeToRefs(driverInfosStore);

	const drivers = ref<any>([]);
	const uiStates = reactive<BoostUiStates>({
		selectedStatus: 0,
		justifyClass: 'justify-start',
		scrollPosition: 0,
		isVisibleCertifiedDate: true,
		isShiftPressed: false,
		contentContainer: null,
		dotInspectionAlert: false
	});

	const modalStates = reactive<BoostModalState>({
		optimizeModal: false,
		editStatusModal: false,
		boostModal: false,
		editProfileModal: false,
		violationModal: false,
		showAllErrorsAndWarningsModal: false
	});

	const shouldShowActionButton = computed(() => {
		if (!uiStates.contentContainer) return false;
		return uiStates.contentContainer.scrollWidth > uiStates.contentContainer.clientWidth;
	});

	const isAtStart = computed(() => {
		// if (!uiStates.contentContainer) return true;
		return uiStates.scrollPosition <= 5;
	});

	const isAtEnd = computed(() => {
		if (!uiStates.contentContainer) return true;
		const container = uiStates.contentContainer;
		return uiStates.scrollPosition + container.clientWidth >= container.scrollWidth - 10;
	});

	const columns = computed(() => {
		return createBoostTableColums(driverTimeZone.value?.shortName);
	});

	const updateJustifyClass = async () => {
		await nextTick();
		if (uiStates.contentContainer) {
			const contentWidth = uiStates.contentContainer.scrollWidth;
			const containerWidth = uiStates.contentContainer.clientWidth;
			uiStates.justifyClass = contentWidth <= containerWidth ? 'justify-center' : 'justify-start';
		}
	};
	const scrollPrev = () => {
		if (uiStates.contentContainer) {
			uiStates.contentContainer.scrollBy({ left: -60, behavior: 'smooth' });
		}
	};
	const scrollNext = () => {
		if (uiStates.contentContainer) {
			uiStates.contentContainer.scrollBy({ left: 60, behavior: 'smooth' });
		}
	};

	const openBoostModal = () => {
		formStates!.formBoost.transferring_time = { hours: 0, minutes: 0, seconds: 0 };
		modalStates.boostModal = true;
	};

	window.addEventListener('keydown', (e) => {
		if (e.key == 'Shift') {
			uiStates.isShiftPressed = true;
		}
	});

	window.addEventListener('keyup', (e) => {
		if (e.key == 'Shift') {
			uiStates.isShiftPressed = false;
		}
	});

    watch(
		() => formStates?.editStatus?.event?.eventType,
		(newType) => {
			uiStates.isVisibleCertifiedDate = newType !== 4;
		},
		{ immediate: true }
	);

	watch(
		() => driverStore.drivers,
		(newDrivers) => {
			drivers.value = newDrivers?.map((driver) => ({
				id: driver.id,
				name: `${driver.user.firstName} ${driver.user.lastName}`
			}));
		},
		{ immediate: true }
	);

	return { uiStates, modalStates, shouldShowActionButton, isAtStart, isAtEnd, columns, updateJustifyClass, scrollPrev, scrollNext, openBoostModal, drivers };
};
