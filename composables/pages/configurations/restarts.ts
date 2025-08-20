import { useRestartsStore } from '~/store/restart';

export const useRestarts = async () => {
	// route
	const route = useRoute();

	// stores
	const restartsStore = useRestartsStore();
	const restarts = computed(() => restartsStore.restarts);

	// restars
	const restartsTotal = computed(() => restartsStore.restartsTotal);

	// pagination
	const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	// loading
	const loading = ref<boolean>(false);

	// modals
	const restartModal = ref(false);
	const editRestartModal = ref(false);
	const deleteModal = ref(false);

	const selectedRestartId = ref<string>('');

	// form
	const restartForm = reactive({
		name: ''
	});

	// validation
	const validateRestart = () => {
		const errors = [];
		if (!restartForm.name) errors.push({ path: 'name', message: errorMessages.blank });
		return errors;
	};

	const columns = [
		{ key: 'counter', label: '#', class: 'w-24' },
		{ key: 'name', label: 'Name' },
		{ key: 'action', label: 'Actions', class: 'w-36' }
	];

	const rows = computed(() =>
		restartsStore.restarts?.map((restart: RestartsResponse, index: number) => ({
			counter: pageSize.value * (currentPage.value - 1) + index + 1,
			id: restart.id,
			name: restart.name
		}))
	);

	const openAddRestartModal = () => {
		resetForm();
		editRestartModal.value = false;
		restartModal.value = true;
	};

	const openEditRestartModal = (restart: any) => {
		resetForm();
		editRestartModal.value = true;
		restartModal.value = true;
		selectedRestartId.value = restart.id;
		restartForm.name = restart.name;
	};

	const closeRestartModal = () => {
		restartModal.value = false;
	};

	const resetForm = () => {
		selectedRestartId.value = '';
		restartForm.name = '';
	};

	const updateOrAddRestart = async () => {
		try {
			loading.value = true;
			const model: RestartsRequest = {
				name: restartForm.name
			};

			if (editRestartModal.value && selectedRestartId.value) {
				await restartsStore.updateRestart(model, selectedRestartId.value);
			} else {
				await restartsStore.addRestart(model);
			}
		} catch (error) {
			console.error(error);
		} finally {
			closeRestartModal();
			await fetchRestarts();
			loading.value = false;
		}
	};

	const openDeleteRestartModal = (restart: any) => {
		deleteModal.value = true;
		selectedRestartId.value = restart.id;
	};

	const deleteRestart = async () => {
		try {
			loading.value = true;
			if (selectedRestartId.value) {
				await restartsStore.deleteRestart(selectedRestartId.value);
			}
		} catch (error) {
			console.error(error);
		} finally {
			deleteModal.value = false;
			await fetchRestarts();
			loading.value = false;
		}
	};

	const fetchRestarts = async () => {
		try {
			await restartsStore.getRestarts(true);
		} catch (error) {
			console.error('Error fetching restarts:', error);
		}
	};

	const isAddOrUpdateRestartDisabled = computed(() => loading.value || !!validateRestart().length);

	watch(
		() => currentPage.value,
		async () => {
			if (currentPage.value <= 1) await navigateTo('/configurations/restarts');
			else navigateTo({ query: { pageNumber: currentPage.value, pageSize: pageSize.value } });

			await fetchRestarts();
		}
	);

	onMounted(async () => {
		await fetchRestarts();
	});

	return {
		loading,
		isAddOrUpdateRestartDisabled,
		restarts,
		restartModal,
		editRestartModal,
		closeRestartModal,
		openAddRestartModal,
		openEditRestartModal,
		openDeleteRestartModal,
		updateOrAddRestart,
		validateRestart,
		restartsTotal,
		currentPage,
		pageSize,
		restartForm,
		deleteModal,
		selectedRestartId,
		columns,
		rows,
		deleteRestart
	};
};
