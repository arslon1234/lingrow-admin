// importing stores
import { useDriverAlertsStore } from '~/store/driverAlerts';

// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

export const useAlerts = async () => {
	// declaring stores
	const driverAlertsStore = useDriverAlertsStore();

	// destructuring helpers
	const { convertToTimeZone } = useTimeZoneHelper();

	// destructuring stores
	const { driverAlerts, driverAlertsTotal, driverAlertsHistory } = storeToRefs(driverAlertsStore);

	// header data
	const headerSearch = ref('');

	// alerts
	const alerts = [
		{ value: 0, label: 'Thunder' },
		{ value: 1, label: 'Noisy' },
		{ value: 2, label: 'Loud' },
		{ value: 3, label: 'High Volume' },
		{ value: 4, label: 'Silent' }
	];

	// loading
	const loading = ref(false);

	// chat text
	interface ChatMessage {
		id: number;
		driverId: number | string;
		status: number;
		time: string;
		text: string;
	}

	const chatText = reactive<ChatMessage[]>([]);

	// chat settings
	const chat = ref<HTMLElement | null>(null);

	watch(chatText, () => {
		scrollToBottom();
	});

	const scrollToBottom = () => {
		nextTick(() => {
			if (chat.value) {
				chat.value.scrollTop = chat.value.scrollHeight;
			}
		});
	};

	// selected status
	const selectedStatus = ref<number | null>();

	const sendStatusAlert = (status: number) => {
		if (typeof selectedStatus.value === 'number') {
			chatText.push({
				id: chatText.length + 1,
				driverId: selectedRow.value!.id,
				status,
				time: convertToTimeZone().format(`YYYY/MM/DD (hh:mm A)`),
				text: alerts.find((alert) => alert.value === selectedStatus.value)?.label || 'Unknown'
			});
			selectedStatus.value = null;
		}
	};

	const submitStatusAlert = async () => {
		try {
			loading.value = true;
			await driverAlertsStore.addDriverAlert({
				driverId: selectedRow.value?.id as string,
				dateTime: convertToTimeZone(),
				musicType: selectedStatus.value as number,
			});
			sendStatusAlert(0);
		} catch (error) {
			console.error(error);
		} finally {
			loading.value = false;
		}
	};

	// pagination
	const selectedNavigation = ref(1);

	// table data
	const selectedRow = ref<{ id: string } | null>(null);

	const tableRowSelect = async (row: any) => {
		selectedRow.value = selectedRow.value?.id === row.id ? null : row;
		selectedStatus.value = null;
		await driverAlertsStore.getDriverAlertsHistory(row.id);
		chatText.splice(0, chatText.length);
		driverAlertsHistory.value?.forEach((alert: DriverAlertsHistoryResponse, ind: number) => {
			chatText.push({
				id: ind + 1,
				driverId: row.id,
				status: alert.status,
				time: convertToTimeZone(alert.dateTime).format(`YYYY/MM/DD (hh:mm A)`),
				text: alerts.find((alrt) => alrt.value === alert.musicType)?.label || 'Unknown'
			})
		})
	};

	const getSelectedDriverChats = () => {
		if (!selectedRow.value) return [];
		return chatText.filter((chat: ChatMessage) => chat.driverId === selectedRow.value!.id);
	};

	const columns = [
		{
			key: 'count',
			label: '#'
		},
		{
			key: 'fullname',
			label: 'Driver Name'
		},
		{
			key: 'unit',
			label: 'Unit #'
		},
		{
			key: 'odometer',
			label: 'Odometer'
		},
		{
			key: 'updated_time',
			label: 'Updated time'
		},
		{
			key: 'events',
			label: 'Events'
		},
		{
			key: 'eld',
			label: 'ELD'
		},
		{
			key: 'alert'
		}
	];

	const rows = computed(() => driverAlerts.value?.map((alert: DriverAlertsResponse, ind: number) => {
		return {
			id: alert.driverId,
			count: ind + 1,
			fullname: alert.firstName + ' ' + alert.lastName,
			unit: alert.vehicleUnit,
			odometer: alert.totalVehicleMiles,
			updated_time: formatTime(alert.dateTime, 'MMM D, hh:mm A'),
			event: {
				eventType: alert.eventType,
				eventCode: alert.eventCode
			},
			eld: alert.isConnected
		};
	}));

	const filteredRows = ref();

	const debounceDriverInput = debounce((e: Event) => {
		const query = (e.target as HTMLInputElement).value.toLowerCase();
		filteredRows.value = rows.value?.filter(row =>
			row.fullname.toLowerCase().includes(query)
		);
	}, 300);

	watch(() => selectedNavigation.value, async () => {
		if (selectedNavigation.value <= 1) await navigateTo('/alerts');
		else await navigateTo({ query: { pageNumber: selectedNavigation.value, pageSize: 10 } });

		await driverAlertsStore.getDriverAlerts({ search: null }, true);
	});

	onMounted(async () => {
		await Promise.all([
			driverAlertsStore.getDriverAlerts({ search: null }, true)
		]);
		filteredRows.value = rows.value;
	});

	return {
		loading,
		headerSearch,
		alerts,
		chatText,
		chat,
		selectedStatus,
		driverAlertsTotal,
		submitStatusAlert,
		selectedNavigation,
		selectedRow,
		tableRowSelect,
		getSelectedDriverChats,
		columns,
		rows,
		filteredRows,
		debounceDriverInput
	};
};
