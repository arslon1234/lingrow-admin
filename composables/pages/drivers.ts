import { transformIssuerState } from '~/helpers/issuerState';
import { useCargoTypesStore } from '~/store/cargoTypes';
import { useCarrierStore } from '~/store/carrier';
import { useDriversStore } from '~/store/drivers';
import { useHosRolesStore } from '~/store/hosRoles';
import { useIssuerStatesStore } from '~/store/issuerState';
import { useRestBreaksStore } from '~/store/restBreaks';
import { useRestartsStore } from '~/store/restart';
import { useVehiclesStore } from '~/store/vehicles';

export const useDrivers = async () => {
	// route
	const route = useRoute();

	// stores
	const carrierStore = useCarrierStore();
	const driverStore = useDriversStore();
	const vehicleStore = useVehiclesStore();
	const issuerStateStore = useIssuerStatesStore();

	// hos roles
	const hosRuleStore = useHosRolesStore();
	const hosRoles = computed(() => hosRuleStore.hosRoles);
	// cargo types
	const cargoTypeStore = useCargoTypesStore();
	const cargoTypes = computed(() => cargoTypeStore.cargoTypes);
	// restarts
	const restartStore = useRestartsStore();
	const restarts = computed(() => restartStore.restarts);
	// rest breaks
	const restBreakStore = useRestBreaksStore();
	const restBreaks = computed(() => restBreakStore.restBreaks);

	// drivers
	const drivers = computed(() => driverStore.drivers ?? []);
	// issuer states
	const issuerStates = computed(() => transformIssuerState(issuerStateStore.issuerStates));
	// driver options(changing its structure & simplifying for ui purpose)
	const driverOptions = computed(
		() =>
			driverStore.drivers?.map((driver) => ({
				id: driver.id,
				fullname: driver.user.firstName + ' ' + driver.user.lastName
			})) ?? []
	);
	// vehicles
	const vehicles = computed(() => vehicleStore.vehicles);

	// home terminals
	const homeTerminalOptions = computed(() =>
		carrierStore.carrier && carrierStore.carrier.carrierTerminals.length > 0
			? carrierStore.carrier?.carrierTerminals.map((terminal: any) => ({
					id: terminal.id,
					name: terminal.street + ', ' + terminal.city + ', ' + terminal.stateCode + ', ' + terminal.zipCode
			  }))
			: []
	);

	// pagination
	const driversTotal = computed(() => driverStore.drivers?.length ?? 0);
	const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	// loading
	const loading = ref<boolean>(false);

	// driver filtering parameter
	const selectedStatus = ref<string>('all');
	const selectedDriver = ref<string>('all');

	// modals
	const addOrUpdateDriverModal = ref<boolean>(false);
	const activateModal = ref<boolean>(false);
	const issuerStateParentId = ref<string>('');
	// driver id for activating/deactiving
	const modalSelectedDriverId = ref<string>('');
	// proper driver status for activating/deactiving
	const statusDriverModal = computed(() => {
		return filteredRows.value.find((driver) => driver.id === modalSelectedDriverId.value && modalSelectedDriverId.value !== '')?.status ?? false;
	});

	// Modal report form
	const driverForm = reactive<DriverRequest>({
		firstName: '',
		lastName: '',
		userName: '',
		phoneNumber: '',
		email: '',
		password: '',
		passwordConfirm: '',
		issuerStateId: '',
		licenseNumber: '',
		homeTerminalId: '',
		assignedVehicleIds: [],
		exemptDriver: false,
		shortHaulException: false,
		allowPersonalUse: false,
		allowYardMoves: false,
		unlimitedTrailers: false,
		unlimitedShippingDocuments: false,
		hosRuleId: '',
		cargoTypeId: '',
		restartId: '',
		restBreakId: '',
		carrierId: ''
	});

	//log settings
	const logSettings = [
		{
			label: 'Exempt driver',
			value: 'exempt_driver'
		},
		{
			label: 'Unlimited trailers',
			value: 'unlimited_trailers'
		},
		{
			label: 'Allow personal use',
			value: 'allow_personal_use'
		},
		{
			label: 'Short haul exception',
			value: 'short_haul_exception'
		},
		{
			label: 'Unlimited shipping documents',
			value: 'unlimited_shipping_documents'
		},
		{
			label: 'Allow yard moves',
			value: 'allow_yard_moves'
		}
	];

	// Validation function
	const validateDot = () => {
		const errors = [];
		if (!driverForm.firstName) errors.push({ path: 'firstName', message: errorMessages.blank });
		if (!driverForm.lastName) errors.push({ path: 'lastName', message: errorMessages.blank });
		if (!driverForm.userName) errors.push({ path: 'userName', message: errorMessages.blank });
		if (!driverForm.phoneNumber) errors.push({ path: 'phoneNumber', message: errorMessages.blank });
		if (!driverForm.email) errors.push({ path: 'email', message: errorMessages.blank });
		if (!driverForm.password) errors.push({ path: 'password', message: errorMessages.blank });
		if (!driverForm.passwordConfirm) errors.push({ path: 'passwordConfirm', message: errorMessages.blank });
		if (!driverForm.issuerStateId) errors.push({ path: 'issuerStateId', message: errorMessages.blank });
		if (!driverForm.licenseNumber) errors.push({ path: 'licenseNumber', message: errorMessages.blank });
		if (!driverForm.homeTerminalId) errors.push({ path: 'homeTerminalId', message: errorMessages.blank });
		if (!driverForm.assignedVehicleIds || !driverForm.assignedVehicleIds.length) errors.push({ path: 'assignedVehicleIds', message: errorMessages.blank });

		return errors;
	};

	const statusOptions = [
		{ label: 'Active', value: 'active' },
		{ label: 'Inactive', value: 'inactive' }
	];

	// Table data
	const columns = [
		{ key: 'counter', label: '#', class: 'w-24' },
		{ key: 'fullName', label: 'Name' },
		{ key: 'unit', label: 'Unit' },
		{ key: 'userName', label: 'Username' },
		{ key: 'app_version', label: 'App Version' },
		{ key: 'event_time', label: 'Event Time' },
		{ key: 'status', label: 'Status' }
	];

	// filtered drivers based on selected driver & selected status (active/inactive)
	const filteredRows = computed(() => {
		if (!drivers.value) return [];
		const filtered = drivers.value.filter((driver: DriverResponse) => {
			// if (filterStatus.value === 'all') return true;
			// return filterStatus.value === 'active' ? driver.user.isActive : !driver.user.isActive;
			const driverStatus = driver?.isActive;
			const statusMatch = selectedStatus.value === 'all' || driver.isActive === (selectedStatus.value.toLowerCase() === 'active');
			const idMatch = selectedDriver.value === 'all' || driver.id === selectedDriver.value;
			return statusMatch && idMatch;
		});

		return filtered.map((driver: DriverResponse, index: number) => ({
			counter: pageSize.value * (currentPage.value - 1) + index + 1,
			id: driver.id,
			fullName: driver.user?.firstName + ' ' + driver.user.lastName,
			unit: driver.currentVehicleUnit ?? 'N/A',
			user: driver.user,
			userName: driver.user?.userName ?? 'N/A',
			app_version: `(${driver.deviceInfo?.appVersion ?? 'N/A'}) ${driver.deviceInfo?.osVersion ?? ''}`,
			event_time: driver.deviceInfo?.dateTime ? formatTime(driver.deviceInfo?.dateTime, 'MMM D, hh:mm A') : 'N/A',
			status: driver.isActive
		}));
	});

	const assignFormDriverValues = (driver?: DriverResponse) => {
		console.log(driver, 'driver');
		if(driver){
			driverForm.firstName = driver?.user?.firstName ?? '';
			driverForm.lastName = driver?.user?.lastName ?? '';
			driverForm.userName = driver?.user?.userName ?? '';
			driverForm.phoneNumber = driver?.user?.phoneNumber ?? '';
			driverForm.email = driver?.user?.email ?? '';
			driverForm.issuerStateId = driver?.driverLicense?.issuerState?.id ?? '';
			driverForm.licenseNumber = driver?.driverLicense?.licenseNumber ?? '';
			driverForm.homeTerminalId = driver?.homeTerminal?.id ?? '';
			driverForm.assignedVehicleIds = driver?.vehicles && driver.vehicles.length > 0 ? driver.vehicles.filter(vehicle => vehicle.id !== null && vehicle.id !== undefined).map(vehicle => vehicle.id as string) : [];
			driverForm.exemptDriver = driver?.exemptDriver ?? false;
			driverForm.shortHaulException = driver?.shortHaulException ?? false;
			driverForm.allowPersonalUse = driver?.allowPersonalUse ?? false;
			driverForm.unlimitedTrailers = driver?.unlimitedShippingDocuments ?? false;
			driverForm.allowYardMoves = driver?.allowYardMoves ?? false;
			driverForm.unlimitedShippingDocuments = driver?.unlimitedShippingDocuments ?? false;
			driverForm.hosRuleId = driver?.hosRule?.id ?? '';
			driverForm.cargoTypeId = driver?.cargoType?.id ?? '';
			driverForm.restartId = driver?.restart?.id ?? '';
			driverForm.restBreakId = driver?.restBreak?.id ?? '';
			driverForm.carrierId = (driver?.carrier?.id ?? getCarrierId())!;
			issuerStateParentId.value = driver?.driverLicense?.issuerState?.parentId
		} else {
			driverForm.carrierId = getCarrierId()!;
		}
	};

	const openAddOrUpdateDriverModal = async (id?: string) => {
		resetForm();
		addOrUpdateDriverModal.value = true;
		if (id) {
			modalSelectedDriverId.value = id;
			const driver = await driverStore.getDriverById(id);
			assignFormDriverValues(driver!);
		} else {
			assignFormDriverValues();
		}

		console.log("driver in form", driverForm);
	};

	const closeAddOrUpdateDriverModal = () => {
		addOrUpdateDriverModal.value = false;
	};

	const openStatusModal = (id: string) => {
		activateModal.value = true;
		modalSelectedDriverId.value = id;
	};

	const closeStatusModal = () => {
		activateModal.value = false;
	};

	const changeDriverStatus = async (id: string) => {
		if (!id) return;
		try {
			loading.value = true;
			const driver = filteredRows.value.find((driver) => driver.id === id);
			if (!driver) return;
			await driverStore.changeDriverStatus(id, driver.status ? 1 : 0);
		} catch (error) {
			console.log(error);
		} finally {
			await fetchDatas();
			activateModal.value = false;
			loading.value = false;
		}
	};

	const resetForm = () => {
		clearObject(driverForm);

		modalSelectedDriverId.value = '';
	};

	const addOrUpdateDriver = async () => {

		driverForm.exemptDriver ??= false;
		driverForm.shortHaulException ??= false;
		driverForm.allowPersonalUse ??= false;
		driverForm.allowYardMoves ??= false;
		driverForm.unlimitedTrailers ??= false;
		driverForm.unlimitedShippingDocuments ??= false;

		try {
			loading.value = true;
			if (modalSelectedDriverId.value) {
				const res = await driverStore.updateDriver(driverForm, modalSelectedDriverId.value);
				if(res?.status === 200) {
					closeAddOrUpdateDriverModal();
				}
			} else {
				const res = await driverStore.addDriver(driverForm);
				if(res?.status === 200) {
					closeAddOrUpdateDriverModal();
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			await fetchDatas();
			loading.value = false;
		}
	};

	const fetchDatas = async () => {
		await driverStore.getDriversFilter(true);
		await vehicleStore.getVehiclesFilter(false, null);
		await issuerStateStore.getIssuerStates(false);
		await carrierStore.getCarrier(getCarrierId());
		await hosRuleStore.getHosRoles(false);
		await cargoTypeStore.getCargoTypes(false);
		await restartStore.getRestarts(false);
		await restBreakStore.getRestBreaks(false);
	};

	const isAddOrUpdateDriverDisabled = computed(() => loading.value || !!validateDot().length);

	watch(
		() => currentPage.value,
		async () => {
			if (currentPage.value <= 1) await navigateTo('/drivers');
			else navigateTo({ query: { pageNumber: currentPage.value, pageSize: pageSize.value } });

			await driverStore.getDriversFilter(true);
		}
	);
	
	watch(
		[hosRoles, driverForm],
		() => {
			if (hosRoles.value && hosRoles.value.length > 0 && !driverForm.hosRuleId) {
				driverForm.hosRuleId = hosRoles.value[0].id;
			}
		},
		{ immediate: true }
	);

	watch(
		[cargoTypes, driverForm],
		() => {
			if (cargoTypes.value && cargoTypes.value.length > 0 && !driverForm.cargoTypeId) {
				driverForm.cargoTypeId = cargoTypes.value[0].id;
			}
		},
		{ immediate: true }
	);
	
	watch(
		[restarts, driverForm],
		() => {
			if (restarts.value && restarts.value.length > 0 && !driverForm.restartId) {
				driverForm.restartId = restarts.value[0].id;
			}
		},
		{ immediate: true }
	);

	watch(
		[restBreaks, driverForm],
		() => {
			if (restBreaks.value && restBreaks.value.length > 0 && !driverForm.restBreakId) {
				driverForm.restBreakId = restBreaks.value[0].id;
			}
		},
		{ immediate: true }
	);

	onMounted(async () => {
		await fetchDatas();
	});

	return {
		loading,
		isAddOrUpdateDriverDisabled,
		drivers,
		driverOptions,
		currentPage,
		pageSize,
		driversTotal,
		issuerStates,
		vehicles,
		activateModal,
		driverForm,
		validateDot,
		columns,
		filteredRows,
		statusOptions,
		logSettings,
		selectedDriver,
		selectedStatus,
		openAddOrUpdateDriverModal,
		addOrUpdateDriver,
		addOrUpdateDriverModal,
		modalSelectedDriverId,
		homeTerminalOptions,
		closeAddOrUpdateDriverModal,
		hosRoles,
		cargoTypes,
		restarts,
		restBreaks,
		openStatusModal,
		closeStatusModal,
		statusDriverModal,
		issuerStateParentId,
		changeDriverStatus
	};
};
