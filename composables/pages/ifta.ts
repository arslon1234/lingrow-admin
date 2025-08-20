// importing packages
import { useTimeZoneHelper } from '~/helpers/timezone';
import { useIftaStore } from '~/store/ifta';
import { useVehiclesStore } from '~/store/vehicles';

export const useIfta = async () => {
	// route
	const route = useRoute();

	// time zone utils
	const { getStartOf, getEndOf, formatToUTC, convertToTimeZone } = useTimeZoneHelper();

	// stores
	const iftaStore = useIftaStore();
	const vehicleStore = useVehiclesStore();

	// iftas
	const { iftaItems, iftaTotalCount } = storeToRefs(iftaStore);

	// vehicles
	const { vehicles } = storeToRefs(vehicleStore);

	// modals
	const addReportModal = ref<boolean>(false);

	// modal report form
	const formReport = reactive({
		vehicleIds: [],
		date: [convertToTimeZone(), convertToTimeZone()]
	});

	const validateReport = () => {
		const errors = [];
		if (!formReport.vehicleIds.length) errors.push({ path: 'vehicle', message: errorMessages.blank });

		return errors;
	};

	// pagination
	const selectedNavigation = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	// loading
	const loading = ref<boolean>(false);

	// statuses
	const statuses = [
		{ value: 'processing', label: 'Processing', color: '#ABB0BC' },
		{ value: 'ready', label: 'Ready', color: '#578B02' }
	];

	// table data
	const selectedRows = ref<{ id: number; [key: string]: any }[]>([]);

	const tableRowSelect = (row: any) => {
		if (selectedRows.value.some((r) => r.id === row.id)) {
			selectedRows.value = selectedRows.value.filter((r) => r.id !== row.id);
		} else {
			selectedRows.value.push(row);
		}
	};

	const columns = [
		{ label: '#', key: 'count', class: 'w-8' },
		{ label: 'Submitted', key: 'submitted' },
		{ label: 'From', key: 'from' },
		{ label: 'To', key: 'to' },
		{ label: 'Vehicle id', key: 'vehicle_id' },
		{ label: 'Status', key: 'status' },
		{ label: 'Report (PDF & CSV)', key: 'report', class: 'w-60' }
	];

	const rows = computed(() => {
		return iftaItems.value.map((row: IftaResponse, ind: number) => {
			return {
				id: row.id,
				count: ind + 1,
				submitted: formatTime(row.dateTime, 'MMM D, hh:mm A'),
				from: formatTime(row.startDate, 'YYYY/MM/DD'),
				to: formatTime(row.endDate, 'YYYY/MM/DD'),
				vehicle_id: row.vehicle.unit,
				status: 'ready',
				pdfPath: row.pdfPath,
				csvPath: row.csvPath
			};
		});
	});


	const addIfta = async () => {
		try {
			loading.value = true;
			const model: IftaAddRequest = {
				vehicleIds: formReport.vehicleIds,
				startDate: formatToUTC(getStartOf(formReport.date[0])),
				endDate: formatToUTC(getEndOf(formReport.date[1])),
				carrierId: getCarrierId()!
			};
			await iftaStore.addIfta(model);
			addReportModal.value = false;
			await iftaStore.getIfta(true);
			clearObject(formReport);
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
		}
	};

	const isAddIftaDisabled = computed(() => loading.value || !!validateReport().length);

	watch(() => selectedNavigation.value, async () => {
		if (selectedNavigation.value <= 1) await navigateTo('/ifta');
		else await navigateTo({ query: { pageNumber: selectedNavigation.value, pageSize: pageSize.value } });

		await iftaStore.getIfta(true);
	});

	onMounted(async () => {
		await Promise.all([
			vehicleStore.getVehiclesFilter(),
			iftaStore.getIfta(true)
		]);
	});

	return {
		loading,
		isAddIftaDisabled,
		addReportModal,
		formReport,
		iftaTotalCount,
		validateReport,
		selectedNavigation,
		statuses,
		selectedRows,
		tableRowSelect,
		columns,
		rows,
		addIfta,
		vehicles
	};
};
