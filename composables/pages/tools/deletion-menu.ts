import { useDeletionMenuStore } from "~/store/deletionMenu";

export const useDeletionMenu = async () => {
	// route
	const route = useRoute();

	// stores
	const deletionMenuStore = useDeletionMenuStore();

	// destructuring stores
	const { deletionMenuProviders, deletionMenuCarriers, deletionMenuCarriersTotal } = storeToRefs(deletionMenuStore);

	// pagination
	const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	// loading
	const loading = ref<boolean>(false);

	// Table data
	const columns = [
		{ key: 'counter', label: '#', class: "w-24" },
		{ key: 'system', label: 'System', class: 'w-24' },
		{ key: 'company', label: 'Company', class: 'w-1/3' },
		{ key: 'driver', label: 'Driver' },
	];

	const rows = computed(() => deletionMenuCarriers.value.map((deletionMenu, index) => ({
		counter: pageSize.value * (currentPage.value - 1) + index + 1,
		id: deletionMenu.id,
		system: deletionMenu.providerName || "N/A",
		company: deletionMenu.name || "N/A",
		drivers: deletionMenu.drivers,
		testDriverId: deletionMenu.drivers.find(driver => driver.isTestDriver)?.driverId,
	})));

	const assignDriver = async (driverId: string, carrierId: string) => {
		await deletionMenuStore.assignDeletionMenuTestDriver({driverId, carrierId, isTestDriver: true});
		fetchDeletionMenu();
	}

	const fetchDeletionMenu = async () => {
		await Promise.all([
			deletionMenuStore.getDeletionMenuProviders(),
			deletionMenuStore.getDeletionMenuCarriers(true),
		])
	};

	watch(() => currentPage.value, async () => {
		if (currentPage.value <= 1) await navigateTo('/tools/deletion-menu');
		else await navigateTo({ query: { pageNumber: currentPage.value, pageSize: pageSize.value } });

		await fetchDeletionMenu();
	});

	onMounted(async () => {
		await fetchDeletionMenu();
	});

	return {
		loading,
		currentPage,
		pageSize,
		deletionMenuCarriersTotal,
		columns,
		rows,
		assignDriver
	};
};