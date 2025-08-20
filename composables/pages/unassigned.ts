// importing packages
import dayjs, { Dayjs } from 'dayjs';

// importing stores
import { useUnidentifiedEventsStore } from '~/store/unidentifiedEvents';
import { useDriversStore } from '~/store/drivers';
import { useVehiclesStore } from '~/store/vehicles';

// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';
import { formatDuration } from '~/utils/time';

export const useUnassigned = async () => {
	// declaring route
	const route = useRoute();

	// declaring stores
	const unidentifiedEventsStore = useUnidentifiedEventsStore();
	const vehiclesStore = useVehiclesStore();
	const driversStore = useDriversStore();

	// destructuring stores
	const { unidentifiedEvents, unidentifiedEventsTotal } = storeToRefs(unidentifiedEventsStore);
	const { drivers } = storeToRefs(driversStore);
	const { vehicles } = storeToRefs(vehiclesStore);

	// timezone helpers
	const { convertToTimeZone, formatToUTC, acceptAsTimeZone, getStartOf } = useTimeZoneHelper();

	// header data
	const headerDate = ref<Dayjs>(route.query?.date ? getStartOf(acceptAsTimeZone(route.query?.date as string)) : convertToTimeZone());
	const selectedDriver = ref<string | null>('');
	const selectedVehicle = ref<string | null>('all');
	const dateSelected = ref<boolean>(false);

	watch(headerDate, () => {
		dateSelected.value = true;
		if(compareDates(headerDate.value, convertToTimeZone())) {
			navigateTo({query: {date: undefined}})
		} else {
			navigateTo({query: {date: formatTime(headerDate.value, 'YYYY-MM-DD')}})
		}
	})

	watch([headerDate, selectedVehicle], async () => {
		await getUnassignedEvents();
	});

	// loading
	const loading = ref<boolean>(false);
	// modals
	const reassignModal = ref<boolean>(false);
	const statusModal = ref<boolean>(false);

	// status modal data
	const selectedStatus = ref<string | null>(null);

	// driver logs modal data
	const searchDriver = ref<string | null>(null);
	const driverListFiltered = ref();

	const debouncedInput = debounce(
		async (e: Event) => {
			const target = e.target as HTMLInputElement;
			driverListFiltered.value = drivers.value?.filter((n) => `${n.user.firstName} ${n.user.lastName}`.toLowerCase().includes(target.value.toLowerCase()));
		},
		300 // timeout in ms
	);

	// get unassigned events
	const getUnassignedEvents = async () => {
		await unidentifiedEventsStore.getUnidentifiedEvents(dateSelected.value ? formatToUTC(headerDate.value) : null, selectedVehicle.value === 'all' ? null : selectedVehicle.value);
	}

	const selectReassignedDriver = async (driverId: string) => {
		selectedDriver.value = driverId;
	};

	const submitReassignDriver = async () => {
		loading.value = true;
		try {
			const result = await unidentifiedEventsStore.reassignUnidentifiedEvents({ eventIds: selectedRows.value[0]?.ids, driverId: selectedDriver.value as string });
			if (result) {
				reassignModal.value = false;
				selectedDriver.value = null;
				selectedRows.value = [];
				await getUnassignedEvents()
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
		}
	};

	// select modal
	const selectedEventIds = ref<string[] | null>(null);

	const openSelectDrivingStatus = async (eventIds: string[], count: number) => {
		selectedEventIds.value = eventIds;
		const selectedRow = rows.value.find(row => row.count === count) || null;
		let selectedEvent;
		if (selectedRow) {
			selectedEvent = events.find(event => event.eventType === selectedRow.event.eventType && event.eventCode === selectedRow.event.eventCode);
		}
		selectedStatus.value = selectedEvent?.key as string || null;
		statusModal.value = true;
	};

	const submitSelectDrivingStatus = async () => {
		loading.value = true;

		const selectedEvent = events.find((event) => event.key === selectedStatus.value);
		try {
			const result = await unidentifiedEventsStore.selectUnidentifiedEvents({
				eventIds: selectedEventIds.value as string[],
				eventType: selectedEvent?.eventType as number,
				eventCode: selectedEvent?.eventCode as number
			});
			if (result) {
				statusModal.value = false;
				await getUnassignedEvents();
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
		}
	};

	// pagination
	const selectedNavigation = ref<number>(parseInt(route.query?.pageNumber as string) || 1);
	const pageSize = ref(parseInt(route.query?.pageSize as string) || 10);

	watch(
		() => selectedNavigation.value,
		async () => {
			if (selectedNavigation.value <= 1) await navigateTo({ query: { pageNumber: undefined, pageSize: undefined } });
			else await navigateTo({ query: { pageNumber: selectedNavigation.value, pageSize: 10 } });
			await getUnassignedEvents();
		}
	);

	// table data
	const selectedRows = ref<{ count: number; ids: Array<string> }[]>([]);

	const tableRowSelect = (row: any) => {
		selectedRows.value = [];
		if (!selectedRows.value.some((r: { count: number }) => r.count === row.count)) {
			selectedRows.value.push(row);
		}
	};

	const columns = [
		{
			key: 'vehicles_id',
			label: 'Vehicles id'
		},
		{
			key: 'distance',
			label: 'Distance'
		},
		{
			key: 'location',
			label: 'Location'
		},
		{
			key: 'submitted',
			label: 'Submitted'
		},
		{
			key: 'duration',
			label: 'Duration'
		},
		{
			key: 'event',
			label: 'Events'
		},
		{
			key: 'action'
		}
	];

	const rows = computed(() =>
		unidentifiedEvents.value?.map((event: UnidentifiedEventsResponse, ind: number) => ({
			ids: event.eventIds,
			count: ind + 1 + (selectedNavigation.value - 1) * pageSize.value,
			vehicles_id: event.vehicleUnit,
			distance: event.totalMiles,
			location: `${event.startedLocation || 'Location not specified'} -> ${event.endedLocation || 'Location not specified'}`,
			event: {eventCode: event.eventCode, eventType: event.eventType},
			submitted: formatTime(event.dateTime, 'MMM D, hh:mm a'),
			duration: formatDuration(event.durationInSeconds, true)
		}))
	);

	onMounted(async () => {
		if (route.query?.date) {
			dateSelected.value = true;
		}
		await Promise.all([getUnassignedEvents(), driversStore.getDriversFilter(), vehiclesStore.getVehiclesFilter()]);
		driverListFiltered.value = drivers.value;
	});

	return {
		loading,
		headerDate,
		selectedDriver,
		selectedVehicle,
		reassignModal,
		statusModal,
		selectedStatus,
		searchDriver,
		driverListFiltered,
		debouncedInput,
		selectedNavigation,
		pageSize,
		selectedRows,
		tableRowSelect,
		columns,
		rows,
		unidentifiedEventsTotal,
		drivers,
		vehicles,
		selectReassignedDriver,
		submitReassignDriver,
		submitSelectDrivingStatus,
		openSelectDrivingStatus
	};
};
