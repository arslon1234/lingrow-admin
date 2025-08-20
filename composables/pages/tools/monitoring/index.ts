// importing stores
import { useMonitoringStore } from '~/store/monitoring';
import { useCarrierStore } from '~/store/carrier';

export const useToolsMonitoring = async () => {
	// declaring stores
	const monitoringStore = useMonitoringStore();
	const carrierStore = useCarrierStore();

	// destructuring stores
	const { providerMonitoring, providerMonitoringTotal } = storeToRefs(monitoringStore);
	const { carriers } = storeToRefs(carrierStore);

	// header data
	const selectedCarrier = ref<string>('all');
	const progressBarMax = 2192;
	const progressBarValue = 124;

	// update selectedCarrier
	watch(selectedCarrier, async () => {
		await Promise.all([monitoringStore.getMonitoringProvider(true, selectedCarrier.value === 'all' ? null : selectedCarrier.value)]);
	})

	// table data
	const columns = [
		{ label: 'Driver', key: 'driver' },
		{ label: 'Last events', key: 'event' },
		{ label: 'Truck', key: 'truck' },
		{ label: 'Break', key: 'break' },
		{ label: 'Drive', key: 'drive' },
		{ label: 'Shift', key: 'shift' },
		{ label: 'Cycle', key: 'cycle' },
		{ label: 'Violated', key: 'violated' },
		{ label: 'Certified', key: 'certified' },
		{ label: 'Last updated', key: 'updated' },
		{ label: 'Actions', key: 'action' }
	];

	const expand = ref({
		openedRows: [],
		row: {}
	});

	// inner table data
	const columnsInner = [
		{ label: 'Date', key: 'date', class: 'w-1/6' },
		{ label: 'Time Drivin', key: 'driven', class: 'w-1/6' },
		{ label: 'Time on Duty', key: 'duty', class: 'w-1/6' },
		{ label: 'Has Profile Forms', key: 'profile', class: 'w-1/6' },
		{ label: 'Violation', key: 'violation', class: 'w-1/6' },
		{ label: 'Certification', key: 'certification', class: 'w-1/6' },
	];

	const monitorings = computed(() =>
		providerMonitoring.value?.map((mnting: MonitoringResponse) => ({
			label: mnting.carrierName,
			id: mnting.carrierId,
			drivers: mnting.monitoringDrivers.map((driver) => ({
				driver: driver.driverName,
				driverId: driver.driverId,
				event: {eventCode: driver.eventCode, eventType: driver.eventType},
				truck: driver.vehicleUnit,
				break: formatDuration(driver.hosTimeRemainder.breakDuration),
				drive: formatDuration(driver.hosTimeRemainder.drivingDuration),
				shift: formatDuration(driver.hosTimeRemainder.shiftDuration),
				cycle: formatDuration(driver.hosTimeRemainder.cycleDuration),
				violated: driver.hasViolation,
				certified: driver.isCertified,
				updated: formatTime(driver.dateTime, 'MMM D, hh:mm A'),
				records: driver.hosRecords?.map(record => ({
					date: formatTime(record.dateTime, 'MMM D, dddd'),
					driven: record.dailyDriving || 0,
					duty: record.dailyOnDuty || 0,
					profile: record.hasDriverDailyForm,
					violation: record.hasViolation,
					certification: record.isCertified,
				}))
			}))
		}))
	);

	// Pagination
	const selectedNavigation = ref<number>(1);

	onMounted(async () => {
		await Promise.all([monitoringStore.getMonitoringProvider(true, selectedCarrier.value === 'all' ? null : selectedCarrier.value)]);
	});

	return {
		selectedCarrier,
		carriers,
		columns,
		expand,
		columnsInner,
		monitorings: monitorings,
		progressBarValue,
		progressBarMax,
		selectedNavigation
	};
};
