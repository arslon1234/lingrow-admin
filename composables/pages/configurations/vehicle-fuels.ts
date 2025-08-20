import { useVehicleFuelsStore } from '~/store/vehicleFuels';

export const useConfigurationsVehicleFuels = async () => {
	// route
	const route = useRoute();

	// stores
	const vehicleFuelsStore = useVehicleFuelsStore();

	// vehicle fuels
	const vehicleFuels = computed(() => vehicleFuelsStore.vehicleFuels);

	// pagination
	const vehicleFuelsTotal = computed(() => vehicleFuelsStore.vehicleFuelsTotal);
	const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	// loading
	const loading = ref<boolean>(false);

	// modals
	const vehicleFuelModal = ref<boolean>(false);
	const editVehicleFuelModal = ref<boolean>(false);
	const deleteModal = ref<boolean>(false);

	const selectedVehicleFuelId = ref<string>('');

	// form
	const vehicleFuelForm = reactive({
		name: ''
	});

	// validator
	const validateVehicleFuel = () => {
		const errors = [];
		if (!vehicleFuelForm.name) errors.push({ path: 'name', message: errorMessages.blank });
		return errors;
	};

	// pagination
	const selectedNavigation = ref(1);

	const columns = [
		{ key: 'counter', label: '#', class: 'w-24' },
		{ key: 'name', label: 'Name' },
		{ key: 'action', label: 'Actions', class: 'w-36' }
	];

	const rows = computed(() =>
		vehicleFuelsStore.vehicleFuels?.map((vehicleFuel, index) => ({
			counter: pageSize.value * (currentPage.value - 1) + index + 1,
			name: vehicleFuel.name,
			id: vehicleFuel.id
		}))
	);

	const openAddVehicleFuelModal = () => {
		resetForm();
		editVehicleFuelModal.value = false;
		vehicleFuelModal.value = true;
	};

	const openEditVehicleFuelModal = (vehicleFuel: { id: string; name: string }) => {
		resetForm();
		editVehicleFuelModal.value = true;
		vehicleFuelModal.value = true;
		selectedVehicleFuelId.value = vehicleFuel.id;
		vehicleFuelForm.name = vehicleFuel.name;
	};

	const closeVehicleFuelModal = () => {
		vehicleFuelModal.value = false;
	};

	const resetForm = () => {
		selectedVehicleFuelId.value = '';
		vehicleFuelForm.name = '';
	};

	const updateOrAddVehicleFuel = async () => {
		try {
			loading.value = true;
			const model: VehicleFuelsRequest = {
				name: vehicleFuelForm.name,
				id: ''
			};
			if (editVehicleFuelModal.value && selectedVehicleFuelId.value) {
				await vehicleFuelsStore.updateVehicleFuel(model, selectedVehicleFuelId.value);
			} else {
				await vehicleFuelsStore.addVehicleFuel(model);
			}
		} catch (error) {
			console.log(error);
		} finally {
			closeVehicleFuelModal();
			await fetchVehicleFuels();
			loading.value = false;
		}
	};

	const openDeleteVehicleFuelModal = (vehicleFuel: any) => {
		deleteModal.value = true;
		selectedVehicleFuelId.value = vehicleFuel.id;
	};

	const deleteVehicleFuel = async () => {
		try {
			loading.value = true;
			if (selectedVehicleFuelId.value) {
				await vehicleFuelsStore.deleteVehicleFuel(selectedVehicleFuelId.value);
			}
		} catch (error) {
			console.error('Error in deleteVehicleFuel:', error);
		} finally {
			deleteModal.value = false;
			await fetchVehicleFuels();
			loading.value = false;
		}
	};

	const fetchVehicleFuels = async () => {
		try {
			await vehicleFuelsStore.getVehicleFuels(true);
		} catch (error) {
			console.error('Error fetching vehicle fuels:', error);
		}
	};

	const isAddOrUpdateVehicFuelDisabled = computed(() => loading.value || !!validateVehicleFuel().length);

	watch(
		() => currentPage.value,
		async () => {
			if (currentPage.value <= 1) await navigateTo('/configurations/vehicle-fuels');
			else await navigateTo({ query: { pageNumber: currentPage.value, pageSize: pageSize.value } });

			await fetchVehicleFuels();
		}
	);

	onMounted(async () => {
		await fetchVehicleFuels();
	});

	return {
		loading,
		isAddOrUpdateVehicFuelDisabled,
		vehicleFuels,
		vehicleFuelModal,
		editVehicleFuelModal,
		closeVehicleFuelModal,
		openAddVehicleFuelModal,
		openEditVehicleFuelModal,
		openDeleteVehicleFuelModal,
		updateOrAddVehicleFuel,
		validateVehicleFuel,
		vehicleFuelsTotal,
		currentPage,
		pageSize,
		vehicleFuelForm,
		deleteModal,
		selectedVehicleFuelId,
		selectedNavigation,
		columns,
		rows,
		deleteVehicleFuel
	};
};
