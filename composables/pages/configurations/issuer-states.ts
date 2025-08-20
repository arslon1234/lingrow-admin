import { getIssuerStateName } from "~/helpers/issuerState";
import { useIssuerStatesStore } from "~/store/issuerState";

export const useConfigurationsIssuer = async () => {
	// route
	const route = useRoute();

	// stores
	const issuerStateStore = useIssuerStatesStore();

	// issuer states
	const issuerStates = ref<IssuerStateResponse[]>([]);
	const parentIssuerStates = computed(() => issuerStateStore.parentIssuerStates);

	// pagination
	const issuerStatesTotal = computed(() => issuerStateStore.issuerStatesTotal);
	const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	// loading
	const loading = ref<boolean>(false);

	watch(() => issuerStateStore.issuerStates, (newVal) => {
		issuerStates.value = newVal;
	});

	// Modals
	const issuerModal = ref<boolean>(false);
	const editIssuerModal = ref<boolean>(false);
	const deleteModal = ref<boolean>(false);
	const selectedIssuerStateId = ref<string>('');

	// Modal report form
	const issuerForm = reactive({
		name: '',
		stateCode: '',
		parentId: '',
	});

	// Validation function
	const validateDot = () => {
		const errors = [];
		if (!issuerForm.name) errors.push({ path: 'name', message: errorMessages.blank });
		if (!issuerForm.stateCode) errors.push({ path: 'stateCode', message: errorMessages.blank });
		if (!issuerForm.parentId) errors.push({ path: 'parentId', message: errorMessages.blank });

		return errors;
	};

	// Table data
	const columns = [
		{ key: 'counter', label: '#', class: "w-24" },
		{ key: 'name', label: 'Name', class: '!w-1/2' },
		{ key: 'parent', label: 'Parent' },
		{ key: 'action', label: 'Actions', class: 'w-36' },
	];

	const rows = computed(() => issuerStates.value.map((issuerState, index) => ({
		counter: pageSize.value * (currentPage.value - 1) + index + 1,
		id: issuerState.id,
		name: issuerState.name,
		parentId: issuerState.parentId,
		parent: getIssuerStateName(issuerState.parentId, parentIssuerStates.value) || "N/A",
		stateCode: issuerState.stateCode,
	})));

	const openAddIssuerModal = () => {
		resetForm();
		issuerModal.value = true;
		editIssuerModal.value = false;
	};

	const openEditIssuerModal = (issuerState: any) => {
		resetForm();

		editIssuerModal.value = true;
		issuerModal.value = true;
		selectedIssuerStateId.value = issuerState.id;

		issuerForm.name = issuerState.name;
		issuerForm.stateCode = issuerState.stateCode;
		issuerForm.parentId = issuerState.parentId;
		// mergeObjectValues(issuerForm, issuerState as any);
	};

	const closeIssuerModal = () => {
		issuerModal.value = false;
	};

	const resetForm = () => {
		// issuerForm.name = '';
		// issuerForm.stateCode = '';
		// issuerForm.parentId = '';
		issuerModal.value = false;

		clearObject(issuerForm);
		selectedIssuerStateId.value = '';
	};

	const updateOrAddIssuerState = async () => {
		try {
			loading.value = true;
			const model: IssuerStateRequest = {
				name: issuerForm.name,
				stateCode: issuerForm.stateCode,
				parentId: issuerForm.parentId,
			};

			if (editIssuerModal.value && selectedIssuerStateId.value) {
				await issuerStateStore.updateIssuerState(model, selectedIssuerStateId.value);
			} else {
				await issuerStateStore.addIssuerState(model);
			}
		} catch (error) {
			console.log(error);
		} finally {
			issuerModal.value = false;
			await fetchIssuerStates();
			loading.value = false;
		}
	};

	const openDeleteIssuerModal = (issuerState: any) => {
		deleteModal.value = true;
		selectedIssuerStateId.value = issuerState.id;
	};

	const deleteIssuerState = async () => {
		try {
			loading.value = true;
			await issuerStateStore.deleteIssuerState(selectedIssuerStateId.value);
		} catch (error) {
			console.log(error);
		} finally {
			await fetchIssuerStates();
			deleteModal.value = false;
			loading.value = false;
		}
	}

	const fetchIssuerStates = async () => {
		await issuerStateStore.getIssuerStates(true);
		await issuerStateStore.getParentIssuerStates();
	};

	const isAddOrUpdateVehicleDisabled = computed(() => loading.value || !!validateDot().length);

	watch(() => currentPage.value, async () => {
		if (currentPage.value <= 1) await navigateTo('/configurations/issuer-states');
		else await navigateTo({ query: { pageNumber: currentPage.value, pageSize: pageSize.value } });

		await fetchIssuerStates();
	});

	onMounted(async () => {
		await fetchIssuerStates();
	});

	return {
		loading,
		isAddOrUpdateVehicleDisabled,
		issuerModal,
		editIssuerModal,
		closeIssuerModal,
		currentPage,
		pageSize,
		issuerStatesTotal,
		deleteModal,
		issuerForm,
		validateDot,
		openAddIssuerModal,
		openEditIssuerModal,
		columns,
		rows,
		updateOrAddIssuerState,
		deleteIssuerState,
		openDeleteIssuerModal,
		parentIssuerStates,
	};
};