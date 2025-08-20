import { useEldConnectionsStore } from '~/store/eldConnections';

export const useConfigurationsEldConnections = async () => {
	// route
	const route = useRoute();

	// stores
	const eldConnectionsStore = useEldConnectionsStore();

	// eld connections
	const eldConnections = computed(() => eldConnectionsStore.eldConnections);

	// pagination
	const eldConnectionsTotal = computed(() => eldConnectionsStore.eldConnectionsTotal);
	const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	// loading
	const loading = ref<boolean>(false);

	// modals
	const eldConnectionModal = ref<boolean>(false);
	const editEldConnectionModal = ref<boolean>(false);
	const deleteModal = ref<boolean>(false);

	const selectedEldConnectionId = ref<string>('');

	// form
	const eldConnectionForm = reactive({
		name: ''
	});

	// validator
	const validateEldConnection = () => {
		const errors = [];
		if (!eldConnectionForm.name) errors.push({ path: 'name', message: errorMessages.blank });
		return errors;
	};

	// pagination
	const selectedNavigation = ref<number>(1);

	const columns = [
		{ key: 'counter', label: '#', class: 'w-24' },
		{ key: 'name', label: 'Name' },
		{ key: 'action', label: 'Actions', class: 'w-36' }
	];

	const rows = computed(() =>
		eldConnectionsStore.eldConnections?.map((eldConnection: EldConnectionsResponse, index: number) => ({
			counter: pageSize.value * (currentPage.value - 1) + index + 1,
			id: eldConnection.id,
			name: eldConnection.name
		}))
	);

	const openAddEldConnectionModal = () => {
		resetForm();
		editEldConnectionModal.value = false;
		eldConnectionModal.value = true;
	};

	const openEditEldConnectionModal = (eldConnection: any) => {
		resetForm();
		editEldConnectionModal.value = true;
		eldConnectionModal.value = true;
		selectedEldConnectionId.value = eldConnection.id;
		eldConnectionForm.name = eldConnection.name;
	};

	const closeEldConnectionModal = () => {
		eldConnectionModal.value = false;
	};

	const resetForm = () => {
		selectedEldConnectionId.value = '';
		eldConnectionForm.name = '';
	};

	const updateOrAddEldConnection = async () => {
		try {
			loading.value = true;
			const model: EldConnectionsRequest = {
				name: eldConnectionForm.name,
				id: ''
			};
			if (editEldConnectionModal.value && selectedEldConnectionId.value) {
				await eldConnectionsStore.updateEldConnection(model, selectedEldConnectionId.value);
			} else {
				await eldConnectionsStore.addEldConnection(model);
			}
		} catch (error) {
			console.error(error);
		} finally {
			closeEldConnectionModal();
			await fetchEldConnections();
			loading.value = false;
		}
	};

	const openDeleteEldConnectionModal = (eldConnection: any) => {
		deleteModal.value = true;
		selectedEldConnectionId.value = eldConnection.id;
	};

	const deleteEldConnection = async () => {
		try {
			loading.value = true;
			if (selectedEldConnectionId.value) {
				await eldConnectionsStore.deleteEldConnection(selectedEldConnectionId.value);
			}
		} catch (error) {
			console.error('Error in deleteEldConnection:', error);
		} finally {
			deleteModal.value = false;
			await fetchEldConnections();
			loading.value = false;
		}
	};

	const fetchEldConnections = async () => {
		try {
			await eldConnectionsStore.getEldConnections(true);
		} catch (error) {
			console.error('Error fetching eld connections:', error);
		}
	};

	const isAddOrUpdateEldConnectionDisabled = computed(() => loading.value || !!validateEldConnection().length);

	watch(
		() => currentPage.value,
		async () => {
			if (currentPage.value <= 1) await navigateTo('/configurations/eld-connections');
			else await navigateTo({ query: { pageNumber: currentPage.value, pageSize: pageSize.value } });

			await fetchEldConnections();
		}
	);

	onMounted(async () => {
		await fetchEldConnections();
	});

	return {
		loading,
		isAddOrUpdateEldConnectionDisabled,
		eldConnections,
		eldConnectionModal,
		editEldConnectionModal,
		closeEldConnectionModal,
		openAddEldConnectionModal,
		openEditEldConnectionModal,
		openDeleteEldConnectionModal,
		updateOrAddEldConnection,
		validateEldConnection,
		eldConnectionsTotal,
		currentPage,
		pageSize,
		eldConnectionForm,
		deleteModal,
		selectedEldConnectionId,
		selectedNavigation,
		columns,
		rows,
		deleteEldConnection
	};
};
