import { useCargoTypesStore } from '~/store/cargoTypes';

export const useConfigurationsCargoTypes = async () => {
	// route
	const route = useRoute();

	// stores
	const cargoTypesStore = useCargoTypesStore();
	const cargoTypes = computed(() => cargoTypesStore.cargoTypes);

	// pagination
	const cargoTypesTotal = computed(() => cargoTypesStore.cargoTypesTotal);
	const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	// loading
	const loading = ref<boolean>(false);

	// modals
	const cargoTypeModal = ref<boolean>(false);
	const editCargoTypeModal = ref<boolean>(false);
	const deleteModal = ref<boolean>(false);
	const selectedCargoTypeId = ref<string>('');

	// form
	const cargoTypeForm = reactive({
		name: ''
	});

	// validators
	const validateCargoType = () => {
		const errors = [];
		if (!cargoTypeForm.name) errors.push({ path: 'name', message: errorMessages.blank });
		return errors;
	};

	const columns = [
		{ key: 'counter', label: '#', class: 'w-24' },
		{ key: 'name', label: 'Name' },
		{ key: 'action', label: 'Actions', class: 'w-36' }
	];

	const rows = computed(() =>
		cargoTypesStore.cargoTypes?.map((cargoType: CargoTypesResponse, index: number) => ({
			counter: pageSize.value * (currentPage.value - 1) + index + 1,
			id: cargoType.id,
			name: cargoType.name
		}))
	);

	const openAddCargoTypeModal = () => {
		resetForm();
		editCargoTypeModal.value = false;
		cargoTypeModal.value = true;
	};

	const openEditCargoTypeModal = (cargoType: any) => {
		resetForm();
		editCargoTypeModal.value = true;
		cargoTypeModal.value = true;
		selectedCargoTypeId.value = cargoType.id;
		cargoTypeForm.name = cargoType.name;
	};

	const closeCargoTypeModal = () => {
		cargoTypeModal.value = false;
	};

	const resetForm = () => {
		selectedCargoTypeId.value = '';
		cargoTypeForm.name = '';
	};

	const updateOrAddCargoType = async () => {
		try {
			loading.value = true;
			const model: CargoTypesRequest = {
				name: cargoTypeForm.name,
				id: ''
			};
			if (editCargoTypeModal.value && selectedCargoTypeId.value) {
				await cargoTypesStore.updateCargoType(model, selectedCargoTypeId.value);
			} else {
				await cargoTypesStore.addCargoType(model);
			}
		} catch (error) {
			console.error('Error in updateOrAddCargoType:', error);
		} finally {
			closeCargoTypeModal();
			await fetchCargoTypes();
			loading.value = false;
		}
	};

	const openDeleteCargoTypeModal = (cargoType: any) => {
		deleteModal.value = true;
		selectedCargoTypeId.value = cargoType.id;
	};

	const deleteCargoType = async () => {
		try {
			loading.value = true;
			if (selectedCargoTypeId.value) {
				await cargoTypesStore.deleteCargoType(selectedCargoTypeId.value);
			}
		} catch (error) {
			console.log(error);
		} finally {
			deleteModal.value = false;
			await fetchCargoTypes();
			loading.value = false;
		}
	};

	const fetchCargoTypes = async () => {
		try {
			await cargoTypesStore.getCargoTypes(true);
		} catch (error) {
			console.error('Error fetching cargo types:', error);
		}
	};

	const isAddOrUpdateCargoTypeDisabled = computed(() => loading.value || !!validateCargoType().length);

	watch(
		() => currentPage.value,
		async () => {
			if (currentPage.value <= 1) await navigateTo('/configurations/cargo-types');
			else await navigateTo({ query: { pageNumber: currentPage.value, pageSize: pageSize.value } });

			await fetchCargoTypes();
		}
	);

	onMounted(async () => {
		await fetchCargoTypes();
	});

	return {
		loading,
		isAddOrUpdateCargoTypeDisabled,
		cargoTypes,
		cargoTypeModal,
		editCargoTypeModal,
		closeCargoTypeModal,
		openAddCargoTypeModal,
		openEditCargoTypeModal,
		openDeleteCargoTypeModal,
		updateOrAddCargoType,
		validateCargoType,
		cargoTypesTotal,
		currentPage,
		pageSize,
		cargoTypeForm,
		deleteModal,
		selectedCargoTypeId,
		columns,
		rows,
		deleteCargoType
	};
};
