import { useRestBreaksStore } from '~/store/restBreaks';

export const useConfigurationsRestBreaks = async () => {
	// route
	const route = useRoute();

	// stores
	const restBreaksStore = useRestBreaksStore();

	// rest breaks
	const restBreaks = computed(() => restBreaksStore.restBreaks);

	// pagination
	const restBreaksTotal = computed(() => restBreaksStore.restBreaksTotal);
	const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	// loading
	const loading = ref<boolean>(false);

	// modals
	const restBreaksModal = ref<boolean>(false);
	const editRestBreaksModal = ref<boolean>(false);
	const deleteModal = ref<boolean>(false);
	const selectedRestBreaksId = ref<string>('');

	// forms
	const restBreaksForm = reactive({
		name: ''
	});

	// validators
	const validateRestBreaks = () => {
		const errors = [];
		if (!restBreaksForm.name) errors.push({ path: 'name', message: errorMessages.blank });
		return errors;
	};

	const columns = [
		{ key: 'counter', label: '#', class: 'w-24' },
		{ key: 'name', label: 'Name' },
		{ key: 'action', label: 'Actions', class: 'w-36' }
	];

	const rows = computed(() =>
		restBreaksStore.restBreaks?.map((restBreaks: RestBreaksResponse, index: number) => ({
			counter: pageSize.value * (currentPage.value - 1) + index + 1,
			id: restBreaks.id,
			name: restBreaks.name
		}))
	);

	const openAddRestBreaksModal = () => {
		resetForm();
		editRestBreaksModal.value = false;
		restBreaksModal.value = true;
	};

	const openEditRestBreaksModal = (restBreaks: any) => {
		resetForm();
		editRestBreaksModal.value = true;
		restBreaksModal.value = true;
		selectedRestBreaksId.value = restBreaks.id;
		restBreaksForm.name = restBreaks.name;
	};

	const closeRestBreaksModal = () => {
		restBreaksModal.value = false;
	};

	const resetForm = () => {
		selectedRestBreaksId.value = '';
		restBreaksForm.name = '';
	};

	const updateOrAddRestBreaks = async () => {
		try {
			loading.value = true;
			const model: RestBreaksRequest = {
				name: restBreaksForm.name,
				id: ''
			};
			if (editRestBreaksModal.value && selectedRestBreaksId.value) {
				await restBreaksStore.updateRestBreaks(model, selectedRestBreaksId.value);
			} else {
				await restBreaksStore.addRestBreaks(model);
			}
		} catch (error) {
			console.log(error);
		} finally {
			closeRestBreaksModal();
			await fetchRestBreaks();
			loading.value = false;
		}
	};

	const openDeleteRestBreaksModal = (restBreaks: any) => {
		deleteModal.value = true;
		selectedRestBreaksId.value = restBreaks.id;
	};

	const deleteRestBreaks = async () => {
		try {
			loading.value = true;
			if (selectedRestBreaksId.value) {
				await restBreaksStore.deleteRestBreaks(selectedRestBreaksId.value);
			}
		} catch (error) {
			console.log(error);
		} finally {
			deleteModal.value = false;
			await fetchRestBreaks();
			loading.value = false;
		}
	};

	const fetchRestBreaks = async () => {
		try {
			await restBreaksStore.getRestBreaks(true);
		} catch (error) {
			console.error('Error fetching rest breaks:', error);
		}
	};

	const isAddOrUpdateRestBreakDisabled = computed(() => loading.value || !!validateRestBreaks().length);

	watch(
		() => currentPage.value,
		async () => {
			if (currentPage.value <= 1) await navigateTo('/configurations/rest-breaks');
			else await navigateTo({ query: { pageNumber: currentPage.value, pageSize: pageSize.value } });

			await fetchRestBreaks();
		}
	);

	onMounted(async () => {
		await fetchRestBreaks();
	});

	return {
		loading,
		isAddOrUpdateRestBreakDisabled,
		restBreaks,
		restBreaksModal,
		editRestBreaksModal,
		closeRestBreaksModal,
		openAddRestBreaksModal,
		openEditRestBreaksModal,
		openDeleteRestBreaksModal,
		updateOrAddRestBreaks,
		validateRestBreaks,
		restBreaksTotal,
		currentPage,
		pageSize,
		restBreaksForm,
		deleteModal,
		selectedRestBreaksId,
		columns,
		rows,
		deleteRestBreaks
	};
};
