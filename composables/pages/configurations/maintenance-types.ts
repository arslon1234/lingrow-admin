import { useMaintenanceTypesStore } from '~/store/maintenanceTypes';

export const useConfigurationsMaintenanceTypes = async () => {
	// route
	const route = useRoute();

	// stores
	const maintenanceTypesStore = useMaintenanceTypesStore();

	// maintenance types
	const maintenanceTypes = ref<MaintenanceTypesResponse[]>([]);

	// pagination
	const maintenanceTypesTotal = computed(() => maintenanceTypesStore.maintenanceTypesTotal);
	const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	// loading
	const loading = ref<boolean>(false);

	watch(
		() => maintenanceTypesStore.maintenanceTypes,
		(newVal) => {
			maintenanceTypes.value = newVal;
		},
		{ immediate: true }
	);

	// modals
	const maintenanceTypeModal = ref<boolean>(false);
	const editMaintenanceTypeModal = ref<boolean>(false);
	const deleteModal = ref<boolean>(false);
	const selectedMaintenanceTypeId = ref<string>('');

	const maintenanceTypeForm = reactive({
		name: ''
	});

	// validator
	const validateMaintenanceType = () => {
		const errors = [];
		if (!maintenanceTypeForm.name) errors.push({ path: 'name', message: errorMessages.blank });
		return errors;
	};

	const columns = [
		{ key: 'counter', label: '#', class: 'w-24' },
		{ key: 'name', label: 'Name' },
		{ key: 'action', label: 'Actions', class: 'w-36' }
	];

	const rows = computed(() =>
		maintenanceTypes.value.map((maintenanceType, index) => ({
			counter: pageSize.value * (currentPage.value - 1) + index + 1,
			id: maintenanceType.id,
			name: maintenanceType.name
		}))
	);

	const openAddMaintenanceTypeModal = () => {
		resetForm();
		editMaintenanceTypeModal.value = false;
		maintenanceTypeModal.value = true;
	};

	const openEditMaintenanceTypeModal = (maintenanceType: any) => {
		resetForm();
		editMaintenanceTypeModal.value = true;
		maintenanceTypeModal.value = true;
		selectedMaintenanceTypeId.value = maintenanceType.id;
		maintenanceTypeForm.name = maintenanceType.name;
	};

	const closeMaintenanceTypeModal = () => {
		editMaintenanceTypeModal.value = false;
		maintenanceTypeModal.value = false;
	};

	const resetForm = () => {
		selectedMaintenanceTypeId.value = '';
		maintenanceTypeForm.name = '';
	};

	const updateOrAddMaintenanceType = async () => {
		try {
			loading.value = true;
			const model: MaintenanceTypesRequest = {
				name: maintenanceTypeForm.name
			};
			if (editMaintenanceTypeModal.value && selectedMaintenanceTypeId.value) {
				await maintenanceTypesStore.updateMaintenanceType(model, selectedMaintenanceTypeId.value);
			} else {
				await maintenanceTypesStore.addMaintenanceType(model);
			}
		} catch (error) {
			console.log(error);
		} finally {
			closeMaintenanceTypeModal();
			await fetchMaintenanceTypes();
			loading.value = false;
		}
	};

	const openDeleteMaintenanceTypeModal = (maintenanceType: any) => {
		deleteModal.value = true;
		selectedMaintenanceTypeId.value = maintenanceType.id;
	};

	const deleteMaintenanceType = async () => {
		try {
			loading.value = true;
			if (selectedMaintenanceTypeId.value) {
				await maintenanceTypesStore.deleteMaintenanceType(selectedMaintenanceTypeId.value);
			}
		} catch (error) {
			console.log(error);
		} finally {
			deleteModal.value = false;
			await fetchMaintenanceTypes();
			loading.value = false;
		}
	};

	const fetchMaintenanceTypes = async () => {
		try {
			await maintenanceTypesStore.getMaintenanceTypes(true);
		} catch (error) {
			console.error('Error fetching maintenance types:', error);
		}
	};

	const isAddOrUpdateMaintenanceTypeDisabled = computed(() => loading.value || !!validateMaintenanceType().length);

	watch(
		() => currentPage.value,
		async () => {
			if (currentPage.value <= 1) await navigateTo('/configurations/maintenance-types');
			else await navigateTo({ query: { pageNumber: currentPage.value, pageSize: pageSize.value } });

			await fetchMaintenanceTypes();
		}
	);

	onMounted(async () => {
		await fetchMaintenanceTypes();
	});

	return {
		loading,
		isAddOrUpdateMaintenanceTypeDisabled,
		maintenanceTypes,
		maintenanceTypeModal,
		editMaintenanceTypeModal,
		closeMaintenanceTypeModal,
		openAddMaintenanceTypeModal,
		openEditMaintenanceTypeModal,
		openDeleteMaintenanceTypeModal,
		updateOrAddMaintenanceType,
		validateMaintenanceType,
		currentPage,
		pageSize,
		maintenanceTypesTotal,
		maintenanceTypeForm,
		deleteModal,
		selectedMaintenanceTypeId,
		columns,
		rows,
		deleteMaintenanceType
	};
};
