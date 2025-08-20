// Importing stores
import { useDriverLogs } from '~/store/driverLogs';

// Importing constants
import { logsTableColumns } from './constants';
export const useLogComposable = async () => {
	// stores
	const driverLogsStore = useDriverLogs();

	// destructuring stores
	const { driverLogs, totalCount } = storeToRefs(driverLogsStore);

	// routes
	const route = useRoute();

	const loading = ref<boolean>(false);
	const search = ref<string>('');
	const selectedEvent = ref<number | null>(0);
	const selectedViolation = ref<boolean>(route.query.hasViolation === 'true' || false);
	const selectedStatus = ref<number>(route.query.status === 'true' ? 1 : route.query.status === 'false' ? 2 : 0);
	const selectedNavigation = ref<number>(route?.query?.pageNumber ? Number(route.query.pageNumber) : 1);

	const columns: LogsTableColumns[] = logsTableColumns;
	// table data
	const filteredDriverLogs = computed(() =>
		driverLogs.value
			?.map((log: DriverLogsResponse, indx: number) => {
				return {
					id: log.driverId,
					counter: indx + 1,
					name: log.driverName,
					unit: log.vehicleUnit ? log.vehicleUnit : 'N/A',
					event: { eventCode: log.eventCode, eventType: log.eventType },
					time: formatTime(log.dateTime, 'MM/DD/YYYY hh:mm:ss A'),
					location: log.calculatedLocation ? log.calculatedLocation : 'N/A',
					break: log.hosTimeRemainder.breakDuration,
					driving: log.hosTimeRemainder.drivingDuration,
					shift: log.hosTimeRemainder.shiftDuration,
					cycle: log.hosTimeRemainder.cycleDuration,
					violations: log.violation ? log.violation.description.shortName : 'N/A',
					eld: log.isConnected
				};
			})
			.filter(
				(log: any) =>
					log.name.toLowerCase().includes(search.value.toLowerCase()) &&
					(selectedEvent.value === 0 || getDutyOrder(log.event.eventType, log.event.eventCode) === selectedEvent.value)
			)
	);

	const tableRowSelect = (row: any) => {
		navigateTo(`/logs/${row.id}`);
	};

	async function fetchLogs() {
		try {
			loading.value = true;
			await driverLogsStore.getDriverLogsFilter();
		} catch (err) {
			console.log(err);
		} finally {
			loading.value = false;
		}
	}

	watch(selectedNavigation, async (newValue) => {
		await navigateTo({
			query: {
				...route.query,
				pageNumber: newValue.toString()
			}
		});
		fetchLogs();
	});

	watch([selectedViolation, selectedStatus], async () => {
		if (selectedViolation.value) await navigateTo({ query: { ...route.query, hasViolation: 'true' } });
		else await navigateTo({ query: { ...route.query, hasViolation: undefined } });
		if (selectedStatus.value === 1) await navigateTo({ query: { ...route.query, status: 'true' } });
		else if (selectedStatus.value === 2) await navigateTo({ query: { ...route.query, status: 'false' } });
		else await navigateTo({ query: { ...route.query, status: undefined } });
		await fetchLogs();
	});

	onMounted(async () => {
		await fetchLogs();
	});

	return { columns, filteredDriverLogs, search, selectedEvent, selectedNavigation, selectedStatus, selectedViolation, tableRowSelect, totalCount, loading };
};
