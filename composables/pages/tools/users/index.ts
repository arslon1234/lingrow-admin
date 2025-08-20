// importing stores
import { useGroupStore } from '~/store/group';
import { useProviderUsersStore } from '~/store/providerUsers';
import { getProviderId } from '#imports';

export const useToolsUsers = async () => {
	// declaring routes
	const route = useRoute();

	// declaring stores
	const groupStore = useGroupStore();
	const providerUsersStore = useProviderUsersStore();

	// destructuring stores
	const { providerUser, providerUsers, providerUsersTotal } = storeToRefs(providerUsersStore);

	// Header data
	const selectedDriver = ref(null);
	const selectedStatus = ref<string>('all');

	// Modals
	const userModal = ref<boolean>(false);
	const addOrUpdateUserModal = ref<boolean>(false);
	const actionModal = ref<boolean>(false);

	// loading
	const loading = ref(false);

	// groups
	const groups = computed(() => groupStore.groups);

	// Modal user form
	const formUser = reactive({
		firstName: '',
		lastName: '',
		username: '',
		password: '',
		confirm_password: '',
		carrierId: '',
		roleId: '',
		showPassword: false,
		showPasswordConfirm: false
	});

	// Validate user form
	const validateUser = () => {
		const errors: { path: string; message: string }[] = [];

		if (!formUser.firstName) errors.push({ path: 'firstName', message: errorMessages.blank });
		if (!formUser.lastName) errors.push({ path: 'lastName', message: errorMessages.blank });
		if (!formUser.username) errors.push({ path: 'username', message: errorMessages.blank });
		if (!formUser.password) errors.push({ path: 'password', message: errorMessages.blank });
		if (!formUser.confirm_password) errors.push({ path: 'confirm_password', message: errorMessages.blank });
		if (formUser.confirm_password !== formUser.password) {
			errors.push({ path: 'confirm_password', message: errorMessages.passwordConfirm });
		}

		return errors;
	};

	// isUserFormDisabled
	const isUserFormDisabled = computed(() => loading.value || !!validateUser().length);

	// status user
	const userId = ref<string | null>(null);
	const userActive = ref<boolean | null>(null);

	const statusUser = async (id: string) => {
		userId.value = id;
		await providerUsersStore.getProviderUser(userId.value as string);
		userActive.value = providerUser.value?.isActive as boolean;
		actionModal.value = true;
	}

	const submitStatusUser = async () => {
		loading.value = true;
		try {
			const response = await providerUsersStore.updateStatusProviderUser(userActive.value ? 1 : 0, userId.value as string);
			if (response) {
				actionModal.value = false;
				await providerUsersStore.getProviderUsers();
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading.value = false;
		}
	}

	// Submit user form
	const submitUserForm = async () => {
		loading.value = true;
		try {
			// Prepare user data for submission
			const userData: ProviderUserRequest = {
				userName: formUser.username,
				firstName: formUser.firstName,
				lastName: formUser.lastName,
				password: formUser.password,
				passwordConfirm: formUser.confirm_password,
				providerId: getProviderId() as string,
				roleId: formUser.roleId
			};

			const response = await providerUsersStore.addProviderUser(userData);

			if (response) {
				await providerUsersStore.getProviderUsers();
				userModal.value = false;
				clearObject(formUser);
			}
		} catch (error) {
			console.error('Error submitting user form:', error);
			return { success: false, error: 'Failed to submit user form' };
		} finally {
			loading.value = false;
		}
	};

	const tableRowSelect = (row: any) => {
		// navigateTo(`/tools/users/${row.count}`);
	};

	const columns = [
		{ label: 'No', key: 'count', class: 'w-20' },
		{ label: 'Name', key: 'name' },
		{ label: 'Username', key: 'username' },
		{ label: 'Action', key: 'action' },
		{ label: 'Role', key: 'role' },
		{ label: 'Work', key: 'work', class: 'w-36' }
	];

	const rows = computed(() =>
		providerUsers.value
			?.map((user: ProviderUserResponse, ind: number) => ({
				id: user?.id,
				count: ind + 1 + (selectedNavigation.value - 1) * pageSize.value,
				name: user.firstName + ' ' + user.lastName,
				username: user.userName,
				action: user.isActive,
				role: user?.role?.name
			}))
			.filter((user) => {
				if (selectedStatus.value === 'all') return true;
				if (selectedStatus.value === 'active') return user?.action === true;
				if (selectedStatus.value === 'inactive') return user?.action === false;
				return false;
			})
	);

	// pagination
	const selectedNavigation = ref<number>(parseInt(route.query?.pageNumber as string) || 1);
	const pageSize = ref(parseInt(route.query?.pageSize as string) || 10);

	watch(
		() => selectedNavigation.value,
		async () => {
			if (selectedNavigation.value <= 1) await navigateTo({ query: { pageNumber: undefined, pageSize: undefined } });
			else await navigateTo({ query: { pageNumber: selectedNavigation.value, pageSize: 10 } });

			await providerUsersStore.getProviderUsers();
		}
	);

	onMounted(async () => {
		await Promise.all([providerUsersStore.getProviderUsers(), groupStore.getGroups()]);
	});


	return {
		actionModal,
		selectedDriver,
		selectedStatus,
		userModal,
		addOrUpdateUserModal,
		selectedNavigation,
		pageSize,
		formUser,
		validateUser,
		tableRowSelect,
		columns,
		rows,
		groups,
		submitUserForm,
		providerUsersTotal,
		loading,
		isUserFormDisabled,
		statusUser,
		submitStatusUser,
		userActive
	};
};
