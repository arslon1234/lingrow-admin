// importing packages
// importing stores
import { useDotInspectionsStore } from '~/store/dotInspections';
import { useDriversStore } from '~/store/drivers';
import { useCarrierStore } from '~/store/carrier';

// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

export const useToolsDot = async () => {
	// decalaring route
	const route = useRoute();

	// declaring stores
	const dotInspectionsStore = useDotInspectionsStore();
	const driversStore = useDriversStore();
	const carrierStore = useCarrierStore();

	// destructuring stores
	const { dotInspections, dotInspectionsTotal, dotInspection } = storeToRefs(dotInspectionsStore);
	const { drivers } = storeToRefs(driversStore);
	const { carriers } = storeToRefs(carrierStore);

	// destructuring helpers
	const { convertToTimeZone, acceptAsTimeZone, formatToUTC, getStartOf, getEndOf } = useTimeZoneHelper();

	// header data
	const selectedCompany = ref<string | null>(getCarrierId() ?? null);
	const selectedDriver = ref<string | null>(null);
	const selectedTab = ref<number>(0);

	// loading
	const loading = ref(false);

	watch(selectedCompany, async (newValue) => {
		if (newValue) {
			try {
				await driversStore.getDriversFilter(false, newValue, false);
				selectedDriver.value = drivers.value![0].id ?? '';
				await changingHeaders();
			} catch (error) {
				console.error(error);
			}
		}
	});

	const changingHeaders = async () => {
		await getDotInspections();
		dotForm.driver = selectedDriver.value as string;
		dotForm.company = selectedCompany.value as string;
	};

	const tabsChanged = async (index: number) => {
		selectedTab.value = index;
		await getDotInspections();
	};

	// modals
	const createDotModal = ref(false);
	const actionModal = ref(false);

	// modal report form
	const dotForm = reactive({
		date: [subtract(convertToTimeZone(), 1, 'day'), convertToTimeZone()],
		company: '',
		driver: '',
		description: ''
	});

	const validateDot = () => {
		const errors = [];
		if (!dotForm.company) errors.push({ path: 'company', message: errorMessages.blank });
		if (!dotForm.driver) errors.push({ path: 'driver', message: errorMessages.blank });
		if (!dotForm.description) errors.push({ path: 'description', message: errorMessages.blank });

		return errors;
	};

	// get dot inspection
	const getDotInspections = async () => {
		try {
			await dotInspectionsStore.getDotInspections({
				driverId: selectedDriver.value as string,
				status: selectedTab.value ? selectedTab.value - 1 : null,
				carrierId: selectedCompany.value as string,
			}, true);
		} catch (error) {
			console.error(error);
		}
	};

	// create dot inspection
	const createDotInspection = async () => {
		loading.value = true;
		try {
			const model: DotInspectionCreateRequest = {
				carrierId: dotForm.company as string,
				driverId: dotForm.driver as string,
				startDate: formatToUTC(getStartOf(dotForm.date[0])),
				endDate: formatToUTC(getEndOf(dotForm.date[1])),
				description: dotForm.description,
				status: selectedTab.value
			};
			const result = await dotInspectionsStore.addDotInspection(model);
			if (result) {
				createDotModal.value = false;
				dotForm.description = '';
				await getDotInspections();
			}

		} catch (error) {
			console.error(error);
		} finally {
			loading.value = false;
		}
	};

	// open actions modal
	const actionDelete = ref(false);
	const actionSwitch = ref(false);

	const openActionsModal = async (actionName: string, id: string) => {
		try {
			await dotInspectionsStore.getDotInspection(id);
		} catch (error) {
			console.error(error);
		}

		actionDelete.value = false;
		actionSwitch.value = false;

		if (actionName === 'delete') {
			actionDelete.value = true;
		} else if (actionName === 'switch') {
			actionSwitch.value = true;
		}
		actionModal.value = true;
	};

	const submitAction = async () => {
		loading.value = true;
		try {
			if (actionDelete.value) {
				await dotInspectionsStore.deleteDotInspection(dotInspection.value?.id as string);
			} else if (actionSwitch.value) {
				await dotInspectionsStore.updateDotInspectionStatus(dotInspection.value?.id as string, dotInspection.value?.status ? 0 : 1);
			}
			actionModal.value = false;
			await getDotInspections();
		} catch (error) {
			console.error(error);
		} finally {
			loading.value = false;
		}
	};

	// pagination
	const selectedNavigation = ref<number>(parseInt(route.query?.pageNumber as string) || 1);
	const pageSize = ref(parseInt(route.query?.pageSize as string) || 10);

	watch(() => selectedNavigation.value, async () => {
		if (selectedNavigation.value <= 1) await navigateTo('/tools/dot-inspection');
		else await navigateTo({ query: { pageNumber: selectedNavigation.value, pageSize: 10 } });

		await getDotInspections();
	});

	// table data
	const columns = [
		{ key: 'count', label: 'Id' },
		{ key: 'system', label: 'System' },
		{ key: 'driver', label: 'Driver' },
		{ key: 'company', label: 'Company' },
		{ key: 'lock_date', label: 'Lock Date' },
		{ key: 'status', label: 'Status' },
		{ key: 'created', label: 'Created (date/time)' },
		{ key: 'action', label: 'Actions', class: 'w-36' }
	];

	const rows = computed(() => dotInspections.value?.map((dot: DotInspectionsResponse, ind: number) => ({
		id: dot.id,
		count: (ind+1 + (selectedNavigation.value-1)*pageSize.value),
		system: dot.description,
		driver: dot.driverName,
		company: dot.carrierName,
		lock_date: `${acceptAsTimeZone(dot.startDate).format('YYYY/MM/DD')} - ${acceptAsTimeZone(dot.endDate).format('YYYY/MM/DD')}`,
		status: !!dot.status,
		created: acceptAsTimeZone(dot.dateTime).format('YYYY/MM/DD hh:mm a')
	})));

	onMounted(async () => {
		await Promise.all([
			driversStore.getDriversFilter(),
			carrierStore.getCarriesFilter()
		]);
		selectedDriver.value = drivers.value[0].id;

		await changingHeaders();
	});

	return {
		loading,
		selectedCompany,
		selectedDriver,
		selectedTab,
		createDotModal,
		actionModal,
		dotForm,
		validateDot,
		selectedNavigation,
		columns,
		dotInspectionsTotal,
		rows,
		carriers,
		drivers,
		createDotInspection,
		changingHeaders,
		tabsChanged,
		openActionsModal,
		actionSwitch,
		actionDelete,
		submitAction,
		dotInspection
	};
};
