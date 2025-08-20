import { useHosRolesStore } from '~/store/hosRoles';

export const useHosRules = async () => {
	// route
	const route = useRoute();

	// stores
	const hosRolesStore = useHosRolesStore();
	const hosRoles = computed(() => hosRolesStore.hosRoles);

	// pagination
	const hosRolesTotal = computed(() => hosRolesStore.hosRolesTotal);
	const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	// loading
	const loading = ref<boolean>(false);

	// modals
	const hosRulesModal = ref<boolean>(false);
	const editHosRulesModal = ref<boolean>(false);
	const deleteModal = ref<boolean>(false);
	const selectedHosRulesId = ref<string>('');

	const hosRulesForm = reactive({
		name: ''
	});

	const validateHosRules = () => {
		const errors = [];
		if (!hosRulesForm.name) errors.push({ path: 'name', message: errorMessages.blank });
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
		hosRolesStore.hosRoles?.map((hosRoles: HosRolesResponse, index: number) => ({
			counter: pageSize.value * (currentPage.value - 1) + index + 1,
			id: hosRoles.id,
			name: hosRoles.name
		}))
	);

	const openAddHosRulesModal = () => {
		resetForm();
		editHosRulesModal.value = false;
		hosRulesModal.value = true;
		selectedHosRulesId.value = '';
	};

	const openEditHosRulesModal = (hosRules: any) => {
		resetForm();
		editHosRulesModal.value = true;
		hosRulesModal.value = true;
		selectedHosRulesId.value = hosRules.id;
		hosRulesForm.name = hosRules.name;
	};

	const closeHosRulesModal = () => {
		hosRulesModal.value = false;
	};

	const resetForm = () => {
		hosRulesForm.name = '';
	};

	const updateOrAddHosRules = async () => {
		try {
			loading.value = true;
			const model: HosRolesRequest = {
				name: hosRulesForm.name
			};

			if (editHosRulesModal.value && selectedHosRulesId.value) {
				await hosRolesStore.updateHosRoles(model, selectedHosRulesId.value);
			} else {
				await hosRolesStore.addHosRoles(model);
			}
		} catch (error) {
			console.log(error);
		} finally {
			closeHosRulesModal();
			await fetchHosRules();
			loading.value = false;
		}
	};

	const openDeleteHosRulesModal = (hosRules: any) => {
		deleteModal.value = true;
		selectedHosRulesId.value = hosRules.id;
	};

	const deleteHosRules = async () => {
		try {
			loading.value = true;
			if (selectedHosRulesId.value) {
				await hosRolesStore.deleteHosRoles(selectedHosRulesId.value);
			}
		} catch (error) {
			console.error(error);
		} finally {
			deleteModal.value = false;
			await fetchHosRules();
			loading.value = false;
		}
	};

	const fetchHosRules = async () => {
		try {
			await hosRolesStore.getHosRoles(true);
		} catch (error) {
			console.error('Error fetching hos rules:', error);
		}
	};

	const isAddOrUpdateHosRulesDisabled = computed(() => loading.value || !!validateHosRules().length);

	watch(
		() => currentPage.value,
		async () => {
			if (currentPage.value <= 1) await navigateTo('/configurations/hos-rules');
			else await navigateTo({ query: { pageNumber: currentPage.value, pageSize: pageSize.value } });

			await fetchHosRules();
		}
	);

	onMounted(async () => {
		await fetchHosRules();
	});

	return {
		loading,
		isAddOrUpdateHosRulesDisabled,
		hosRoles,
		hosRulesModal,
		editHosRulesModal,
		closeHosRulesModal,
		openAddHosRulesModal,
		openEditHosRulesModal,
		openDeleteHosRulesModal,
		updateOrAddHosRules,
		validateHosRules,
		hosRolesTotal,
		currentPage,
		pageSize,
		hosRulesForm,
		deleteModal,
		selectedHosRulesId,
		selectedNavigation,
		columns,
		rows,
		deleteHosRules
	};
};
