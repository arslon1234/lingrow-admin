// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

// importing stores
import { useVehiclesStore } from '~/store/vehicles';

export const useVehicleDashboardComposable = async () => {
	// route
	const route = useRoute();

	// stores
	const vehiclesStore = useVehiclesStore();

	// time zone helper
	const { convertToTimeZone, formatTimeDynamic } = useTimeZoneHelper();

	const vehicleDashboard = ref<VehicleDashboard | null>(null);
	const currentDriver = ref<VehicleDriver | null>(null);
	const speedChartMetrics = ref<ChartMetrics | null>(null);
	const fuelChartMetrics = ref<ChartMetrics | null>(null);
	const defChartMetrics = ref<ChartMetrics | null>(null);
	const vehicleStatus = ref<string>('');

	const vehicleId = computed(() => {
		const id = route.params.id;
		return Array.isArray(id) ? id[0] : id;
	});
	const lastUpdated = computed(() => {
		const seconds = convertToTimeZone().diff(convertToTimeZone(vehicleDashboard.value?.createdAt as any), 'second');
		return formatTimeDynamic(seconds);
	});
    const diagnosticData = computed(() => [
		{ label: 'Engine Hours', value: vehicleDashboard.value?.totalEngineHours || '-' },
		{ label: 'Odometer', value: vehicleDashboard.value?.engineOdometer || '588579.9 mi' },
		{ label: 'Engine Speed', value: vehicleDashboard.value?.engineSpeed || '0 RPM' },
		{ label: 'Fuel Rate', value: vehicleDashboard.value?.engineFuelRate || '0 gal/h' },
		{ label: 'Fuel Level', value: `${vehicleDashboard.value?.fuelLevelPercent}%`, isProgress: true, progressValue: vehicleDashboard.value?.fuelLevelPercent },
		{ label: 'Fuel (Tank 2) Level', value: `${vehicleDashboard.value?.fuelLevel2Percent}%`, isProgress: true, progressValue: vehicleDashboard.value?.fuelLevel2Percent },
		{ label: 'DEF Level', value: `${vehicleDashboard.value?.defLevelPercent! * 100}%`, isProgress: true, progressValue: vehicleDashboard.value?.defLevelPercent! * 100 },
		{ label: 'Barometric Pressure', value: vehicleDashboard.value?.barometricPressure || '14.0 PSI' },
		{ label: 'Engine Oil Pressure', value: `${vehicleDashboard.value?.oilPressure} PSI` || '0.0 PSI' },
		{ label: 'Engine Coolant Temperature', value: `${vehicleDashboard.value?.coolantTemperature} °F` || '188.0 °F' },
		{ label: 'Ambient Air Temperature', value: `${vehicleDashboard.value?.ambientTemperature} °F` || 'N/A °F' },
		{ label: 'Engine Oil Temperature', value: `${vehicleDashboard.value?.oilTemperature} °F` || '174.0 °F' },
		{ label: 'Average Fuel Economy', value: `${vehicleDashboard.value?.engineFuelEconomy} MPG` || '- MPG' },
		{ label: 'ELD Type', value: vehicleDashboard.value?.eldType || '-' },
		{ label: 'Seatbelt Status', value: vehicleDashboard.value?.seatbeltStatus || 'On' },
		{ label: 'Current Gear', value: vehicleDashboard.value?.gear || '-' },
		{ label: 'PTO Hours', value: vehicleDashboard.value?.totalPtoTime || '-' },
		{ label: 'Idle Hours', value: vehicleDashboard.value?.totalEngineIdleTime || '-' },
		{ label: 'Total Idle Fuel Used', value: `${vehicleDashboard.value?.totalEngineIdleFuel} gal` || '0.0 gal' },
		{ label: 'Total Fuel Used', value: `${vehicleDashboard.value?.totalFuelUsed} gal` || '0.0 gal' }
	]);
	const getVehicleDashboard = async () => {
		if (!vehicleId.value) return;
		vehicleDashboard.value = await vehiclesStore.getVehicleDashboard(vehicleId.value);
	};
	const getEventsByVehicleId = async () => {
		if (!vehicleId.value) return;
		const model = {
			vehicleId: vehicleId.value
		};
		const { eventCode, eventType } = await vehiclesStore.getEldEventsByVehicleId(model);
		allEvents.forEach((event) => {
			if (event.eventCode === eventCode && event.eventType === eventType) {
				vehicleStatus.value = event.label;
			}
		});
	};
	const getVehicleCurrentDriver = async () => {
		if (!vehicleId.value) return;
		currentDriver.value = await vehiclesStore.getCurrentVehicleDriver(vehicleId.value);
	};
	const getSpeedChartMetrics = async () => {
		if (!vehicleId.value) return;
		speedChartMetrics.value = await vehiclesStore.getVehicleSpeedMetrics(vehicleId.value);
	};
	const getFuelChartMetrics = async () => {
		if (!vehicleId.value) return;
		fuelChartMetrics.value = await vehiclesStore.getVehicleFuelMetrics(vehicleId.value);
	};
	const getDefLevelChartMetrics = async () => {
		if (!vehicleId.value) return;
		const defLevel = await vehiclesStore.getVehicleDefMetrics(vehicleId.value);
		defChartMetrics.value = {
			series: defLevel?.series?.map((seriesItem: any) => ({
				timestamp: seriesItem.timestamp,
				value: seriesItem.value * 100
			})),
			statistics: {
				average: (defLevel?.statistics?.average || 0) * 100,
				highest: (defLevel?.statistics?.highest || 0) * 100,
				lowest: (defLevel?.statistics?.lowest || 0) * 100
			}
		};
	};
	const refreshData = async () => {
		await Promise.allSettled([getVehicleDashboard(), getEventsByVehicleId(), getVehicleCurrentDriver(), getSpeedChartMetrics(), getFuelChartMetrics(), getDefLevelChartMetrics()]);
	};
	onMounted(async () => {
		await refreshData();
	});
	onUnmounted(() => {
		vehicleDashboard.value = null;
		currentDriver.value = null;
		speedChartMetrics.value = null;
		fuelChartMetrics.value = null;
		defChartMetrics.value = null;
		vehicleStatus.value = '';
	});
	return {
		vehicleDashboard,
		diagnosticData,
		vehicleStatus,
		lastUpdated,
		currentDriver,
		speedChartMetrics,
		fuelChartMetrics,
		defChartMetrics
	};
};
