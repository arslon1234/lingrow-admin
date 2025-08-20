// importing stores
import { useProvidersStore } from '~/store/providers';
import { useCarrierStore } from '~/store/carrier';

export const useClients = async () => {
	// declaring routes
	const route = useRoute();

	// declaring stores
	const providersStore = useProvidersStore();
	const carrierStore = useCarrierStore();

	// destructuring stores
	const { providers, provider, providersTotal } = storeToRefs(providersStore);
	const { carriers } = storeToRefs(carrierStore);

	// header data
	const selectedCompany = ref('');
	const selectedStatus = ref<number | null>(1);

	const modifiedStatus = computed(() => (selectedStatus.value === 1 ? null : selectedStatus.value !== 2));

	watch([selectedStatus, selectedCompany], async () => {
		await providersStore.getProviders(modifiedStatus.value);
	});

	// loading
	const loading = ref(false);

	// modals
	const manageClientModal = ref(false);
	const statusModal = ref(false);

	interface FormClient {
		client_name: string;
		phone_number: string;
		email: string;
		password: string;
		first_name: string;
		last_name: string;
		user_name: string;
		edit: boolean;
		tools: Record<string, boolean>; // Or a more specific type
	}

	// form data
	const client = reactive<{ edit: boolean; id: string; status: boolean }>({
		edit: false,
		id: '',
		status: false
	});

	const formClient = reactive<FormClient>({
		client_name: '',
		phone_number: '',
		email: '',
		password: '',
		first_name: '',
		last_name: '',
		user_name: '',
		edit: false,
		tools: {
			// all: false,
			activity: false,
			monitoring: false,
			dot_inspection: false,
			audit: false,
			users: false,
			statistics_admin: false,
			statistics_company: false
		}
	});

	const formTools = ref([
		// { label: 'All', value: 'all' },
		{ label: 'Activity', value: 'activity' },
		{ label: 'Monitoring', value: 'monitoring' },
		{ label: 'DOT Inspection', value: 'dot_inspection' },
		{ label: 'Audit', value: 'audit' },
		{ label: 'Users', value: 'users' },
		{ label: 'Statistics Admin', value: 'statistics_admin' },
		{ label: 'Statistics Company', value: 'statistics_company' }
	]);

	const toggleAll = (value: boolean) => {
		Object.keys(formClient.tools).forEach((key) => {
			formClient.tools[key] = value;
		});
	};

	watch(
		() => formClient.tools,
		(value) => {
			formClient.tools.all = Object.keys(value)
				.filter((key) => key !== 'all') // Exclude the "all" tool itself
				.every((key) => value[key]);
		},
		{ deep: true }
	);

	const validateClient = () => {
		const errors = [];
		if (!formClient.client_name) errors.push({ path: 'client_name', message: errorMessages.blank });
		if (!formClient.phone_number) errors.push({ path: 'phone_number', message: errorMessages.blank });
		if (!formClient.first_name) errors.push({ path: 'first_name', message: errorMessages.blank });
		if (!formClient.last_name) errors.push({ path: 'last_name', message: errorMessages.blank });
		if (!formClient.user_name) errors.push({ path: 'user_name', message: errorMessages.blank });
		if (!formClient.email) errors.push({ path: 'email', message: errorMessages.blank });
		if (!formClient.password && !client.edit) errors.push({ path: 'password', message: errorMessages.blank });

		return errors;
	};

	const isDisabled = computed(() => !!validateClient().length || loading.value);

	const openStatusModal = (id: string, isActive: boolean) => {
		try {
			client.status = isActive;
			client.id = id;
		} catch (error) {
			console.log(error);
		} finally {
			statusModal.value = true;
		}
	};

	const openManageClientModal = async (action: 'edit' | 'add', id?: string) => {
		try {
			clearObject(formClient);
			if (action === 'edit') {
				client.edit = true;
				client.id = id as string;
				await providersStore.getProvider(id as string);
				formClient.first_name = provider.value?.user.firstName as string;
				formClient.last_name = provider.value?.user.lastName as string;
				formClient.user_name = provider.value?.user.userName as string;
				formClient.email = provider.value?.email as string;
				formClient.phone_number = provider.value?.phoneNumber as string;
				formClient.client_name = provider.value?.name as string;
				Object.keys(formClient.tools).forEach((key, ind) => {
					if (provider.value?.user?.toolCodes?.some((tool: number) => tool === ind)) {
						formClient.tools[key as keyof typeof formClient.tools] = true;
					}
				});
				// formClient.tools.all = Object.keys(formClient.tools)
				// 	.filter((key) => key !== 'all') // Exclude the "all" tool itself
				// 	.every((key) => formClient.tools[key]);
			} else {
				client.edit = false;
				client.id = '';
			}
		} catch (error) {
			console.log(error);
		} finally {
			manageClientModal.value = true;
		}
	};

	const submitClient = async () => {
		loading.value = true;
		try {
			const model: ProviderRequest = {
				name: formClient.client_name,
				email: formClient.email,
				phoneNumber: formClient.phone_number,
				providerClient: {
					firstName: formClient.first_name,
					lastName: formClient.last_name,
					userName: formClient.user_name,
					password: formClient.password || '',
					selectedTools: Object.keys(formClient.tools)
						.filter((key) => (formClient.tools as Record<string, boolean>)[key])
						.map((key) => {
							const index = formTools.value.findIndex((tool) => tool.value === key);
							return index !== -1 ? index : null; // Handle cases where the value is not found
						})
						.filter((index): index is number => index !== null) // Ensure only valid numbers remain
				}
			};
			let result;
			if (client.edit) {
				result = await providersStore.updateProvider(model, client.id);
			} else {
				result = await providersStore.addProvider(model);
			}
			if (result) {
				manageClientModal.value = false;
				await providersStore.getProviders(modifiedStatus.value);
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
		}
	};

	const submitStatus = async () => {
		loading.value = true;
		try {
			const result = await providersStore.updateStatusProvider(client.status ? 1 : 0, client.id);
			if (result) {
				statusModal.value = false;
				await providersStore.getProviders(modifiedStatus.value);
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
		}
	};

	// table data
	const columns = [
		{
			key: 'count',
			label: 'No'
		},
		{
			key: 'manage_client',
			label: 'Manage Client'
		},
		{
			key: 'user_id',
			label: 'User id'
		},
		{
			key: 'email',
			label: 'Email'
		},
		{
			key: 'phone_number',
			label: 'Phone number'
		},
		{
			key: 'carrier',
			label: 'Carrier'
		},
		{
			key: 'trucks',
			label: 'Trucks'
		},
		{
			key: 'work',
			label: 'Work'
		},
		{
			key: 'action',
			label: 'Action'
		}
	];

	const rows = computed(() =>
		providers.value?.map((client: ProviderResponse, ind: number) => ({
			id: client.id,
			count: ind + 1 + (selectedNavigation.value - 1) * pageSize.value,
			manage_client: client.name,
			user_id: client.user?.userName,
			email: client.email,
			phone_number: client.phoneNumber,
			carrier: client.carriersCount,
			trucks: client.vehiclesCount,
			work: client.isActive
		}))
	);

	// pagination
	const selectedNavigation = ref<number>(parseInt(route.query?.pageNumber as string) || 1);
	const pageSize = ref(parseInt(route.query?.pageSize as string) || 10);

	watch(
		() => selectedNavigation.value,
		async () => {
			if (selectedNavigation.value <= 1) await navigateTo({ query: { pageNumber: undefined, pageSize: undefined } });
			else await navigateTo({ query: { pageNumber: selectedNavigation.value, pageSize: 10 } });

			await providersStore.getProviders(modifiedStatus.value);
		}
	);

	onMounted(async () => {
		await Promise.all([carrierStore.getCarriesFilter(), providersStore.getProviders(modifiedStatus.value)]);
	});

	return {
		client,
		selectedCompany,
		selectedStatus,
		manageClientModal,
		statusModal,
		formClient,
		formTools,
		validateClient,
		columns,
		rows,
		providersTotal,
		selectedNavigation,
		pageSize,
		carriers,
		isDisabled,
		loading,
		toggleAll,
		submitClient,
		submitStatus,
		openStatusModal,
		openManageClientModal
	};
};
