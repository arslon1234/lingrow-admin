import { usePermissionsStore } from '~/store/permissions';

export const usePermissions = async () => {
	// route
	const route = useRoute();

	// stores
	const permissionsStore = usePermissionsStore();
	const permissions = computed(() => permissionsStore.permissions);

	// pagination
	const permissionsTotal = computed(() => permissionsStore.permissionsTotal);
	const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	// loading
	const loading = ref<boolean>(false);

	// modals
	const permissionModal = ref<boolean>(false);
	const editPermissionModal = ref<boolean>(false);
	const deleteModal = ref<boolean>(false);

	const selectedPermissionId = ref<string>('');

	// form
	const permissionForm = reactive({
		name: ''
	});

	// validator
	const validatePermission = () => {
		const errors = [];
		if (!permissionForm.name) errors.push({ path: 'name', message: errorMessages.blank });
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
		permissionsStore.permissions?.map((permission: PermissionResponse, index: number) => ({
			counter: pageSize.value * (currentPage.value - 1) + index + 1,
			id: permission.id,
			name: permission.name
		}))
	);

	const openAddPermissionModal = () => {
		resetForm();
		editPermissionModal.value = false;
		permissionModal.value = true;
	};

	const openEditPermissionModal = (permission: any) => {
		resetForm();
		editPermissionModal.value = true;
		permissionModal.value = true;
		selectedPermissionId.value = permission.id;
		permissionForm.name = permission.name;
	};

	const closePermissionModal = () => {
		permissionModal.value = false;
	};

	const resetForm = () => {
		selectedPermissionId.value = '';
		permissionForm.name = '';
	};

	const updateOrAddPermission = async () => {
		try {
			loading.value = true;
			const model: PermissionRequest = {
				name: permissionForm.name,
				methodName: 'Test'
			};
			if (editPermissionModal.value && selectedPermissionId.value) {
				await permissionsStore.updatePermission(model, selectedPermissionId.value);
			} else {
				await permissionsStore.addPermission(model);
			}
		} catch (error) {
			console.log(error);
		} finally {
			closePermissionModal();
			await fetchPermissions();
			loading.value = false;
		}
	};

	const openDeletePermissionModal = (permission: any) => {
		deleteModal.value = true;
		selectedPermissionId.value = permission.id;
	};

	const deletePermission = async () => {
		try {
			loading.value = true;
			if (selectedPermissionId.value) {
				await permissionsStore.deletePermission(selectedPermissionId.value);
			}
		} catch (error) {
			console.log(error);
		} finally {
			deleteModal.value = false;
			await fetchPermissions();
			loading.value = false;
		}
	};

	const fetchPermissions = async () => {
		try {
			await permissionsStore.getPermissions(true);
		} catch (error) {
			console.error(error);
		}
	};

	const isAddOrUpdatePermissionDisabled = computed(() => loading.value || !!validatePermission().length);

	watch(
		() => currentPage.value,
		async () => {
			if (currentPage.value <= 1) await navigateTo('/user-manager/permissions');
			else await navigateTo({ query: { pageNumber: currentPage.value, pageSize: pageSize.value } });

			await fetchPermissions();
		}
	);

	onMounted(async () => {
		await fetchPermissions();
	});

	return {
		loading,
		isAddOrUpdatePermissionDisabled,
		permissions,
		permissionModal,
		editPermissionModal,
		closePermissionModal,
		openAddPermissionModal,
		openEditPermissionModal,
		openDeletePermissionModal,
		updateOrAddPermission,
		validatePermission,
		permissionsTotal,
		currentPage,
		pageSize,
		permissionForm,
		deleteModal,
		selectedPermissionId,
		selectedNavigation,
		columns,
		rows,
		deletePermission
	};
};
