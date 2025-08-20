import { useGroupStore } from '~/store/group';

export const useGroups = async () => {
	// route
	const route = useRoute();

	// stores
	const groupStore = useGroupStore();
	const groups = computed(() => groupStore.groups);
	const permissionsGroups = computed(() => groupStore.permissionGroups);

	// pagination
	const groupsTotal = computed(() => groupStore.groupsTotal);
	const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	const loading = ref<boolean>(false);

	// modals
	const groupModal = ref<boolean>(false);
	const editGroupModal = ref<boolean>(false);
	const deleteModal = ref<boolean>(false);
	const selectedGroupId = ref<string>('');

	// form
	const groupForm = reactive({
		name: '',
		type: 0,
		permissions: []
	});

	const validateGroup = () => {
		const errors = [];
		if (!groupForm.name) errors.push({ path: 'name', message: errorMessages.blank });
		return errors;
	};

	// pagination
	const selectedNavigation = ref<number>(1);

	const columns = [
		{ key: 'counter', label: '#', class: 'w-24' },
		{ key: 'name', label: 'Name' },
		{ key: 'permissions', label: 'Permissions' },
		{ key: 'action', label: 'Actions', class: 'w-36' }
	];

	const rows = computed(() =>
		groupStore.groups?.map((group: GroupResponse, index: number) => ({
			counter: pageSize.value * (currentPage.value - 1) + index + 1,
			id: group.id,
			type: group.type,
			name: group.name,
			permissions: group.permissions
		}))
	);

	const openAddGroupModal = () => {
		resetForm();
		editGroupModal.value = false;
		groupModal.value = true;
	};

	const openEditGroupModal = (group: any) => {
		resetForm();
		editGroupModal.value = true;
		groupModal.value = true;
		selectedGroupId.value = group.id;
		groupForm.type = group.type;
		groupForm.name = group.name;
		groupForm.permissions = group.permissions?.map((permission: PermissionResponse) => permission.id);
	};

	const closeGroupModal = () => {
		groupModal.value = false;
	};

	const resetForm = () => {
		selectedGroupId.value = '';
		groupForm.name = '';
		groupForm.permissions = [];
	};

	const updateOrAddGroup = async () => {
		try {
			loading.value = true;
			const model: GroupRequest = {
				type: groupForm.type,
				permissionIds: groupForm.permissions,
				name: groupForm.name
			};
			if (editGroupModal.value && selectedGroupId.value) {
				await groupStore.updateGroup(model, selectedGroupId.value);
			} else {
				await groupStore.addGroup(model);
			}
		} catch (error) {
			console.log(error);
		} finally {
			closeGroupModal();
			await fetchGroups();
			loading.value = false;
		}
	};

	const openDeleteGroupModal = (group: any) => {
		deleteModal.value = true;
		selectedGroupId.value = group.id;
	};

	const deleteGroup = async () => {
		try {
			loading.value = true;
			if (selectedGroupId.value) {
				await groupStore.deleteGroup(selectedGroupId.value);
			}
		} catch (error) {
			console.log(error);
		} finally {
			deleteModal.value = false;
			await fetchGroups();
			loading.value = false;
		}
	};

	const fetchGroups = async () => {
		try {
			await groupStore.getGroups(true);
			await groupStore.getPermissionGroups();
		} catch (error) {
			console.error(error);
		}
	};

	const isAddOrUpdateGroupDisabled = computed(() => loading.value || !!validateGroup().length);

	watch(
		() => currentPage.value,
		async () => {
			if (currentPage.value <= 1) await navigateTo('/user-manager/group');
			else await navigateTo({ query: { pageNumber: currentPage.value, pageSize: pageSize.value } });

			await fetchGroups();
		}
	);

	onMounted(async () => {
		await fetchGroups();
	});

	return {
		loading,
		isAddOrUpdateGroupDisabled,
		groups,
		groupModal,
		editGroupModal,
		closeGroupModal,
		openAddGroupModal,
		openEditGroupModal,
		openDeleteGroupModal,
		updateOrAddGroup,
		validateGroup,
		groupsTotal,
		permissionsGroups,
		currentPage,
		pageSize,
		groupForm,
		deleteModal,
		selectedGroupId,
		selectedNavigation,
		columns,
		rows,
		deleteGroup
	};
};
