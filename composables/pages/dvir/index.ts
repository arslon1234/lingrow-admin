// importing packages
import dayjs, { Dayjs } from 'dayjs';

// importing stores
import { useDefectStore } from '~/store/defect';
import { useDriversStore } from '~/store/drivers';
import { useDvirStore } from '~/store/dvir';
import { useVehiclesStore } from '~/store/vehicles';

// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

export const useDvirComposable = async () => {
	const dvirStore = useDvirStore();
	const defectsStore = useDefectStore();
	const driversStore = useDriversStore();
	const vehiclesStore = useVehiclesStore();

	// destructuring store
	const { dvirs, totalCount } = storeToRefs(dvirStore);
	const { drivers } = storeToRefs(driversStore);
	const { vehicles } = storeToRefs(vehiclesStore);

	// declaring helperes
	const { convertToTimeZone, formatToUTC, getStartOf, getEndOf } = useTimeZoneHelper();

	// header data
	const headerDate = ref<[Dayjs, Dayjs]>([subtract(convertToTimeZone(), 2, 'week'), convertToTimeZone()]);
	const selectedDriver = ref('all');
	const selectedVehicle = ref('all');

	// pagination
	const selectedNavigation = ref<number>(1);

	// get dvirs when update
	watch([headerDate, selectedDriver, selectedVehicle], async () => {
		await fetchDvirs();
	})

	// table data
	const columns = [
		{ label: 'Driver', key: 'driver' },
		{ label: 'Time', key: 'time' },
		{ label: 'Vehicle', key: 'vehicle' },
		{ label: 'Status', key: 'status' },
		{ label: 'Defects', key: 'defects', class: 'w-[400px]' },
		{ key: 'action', class: 'w-20' }
	];

	const rows = computed(() => {
		return (
			dvirs.value?.map((item) => ({
				id: item.id,
				driver: `${item.driver?.user.firstName} ${item.driver?.user.lastName}`,
				time: dayjs(item.dateTime),
				vehicle: item.vehicle?.unit,
				status: item.dvirStatus?.name || 'N/A',
				defects: item.vehicleDefects?.map((d) => d.name).join(', ') || 'No defects'
			})) || []
		);
	});

	const fetchDvirs = async () => {
		const model: DvirRequest = {
			carrierId: getCarrierId() as string,
			startDate: formatToUTC(getStartOf(headerDate.value[0])),
			endDate: formatToUTC(getEndOf(headerDate.value[1])),
			vehicleId: selectedVehicle.value === 'all' ? null : selectedVehicle.value,
			driverId: selectedDriver.value === 'all' ? null : selectedDriver.value,
			...pagination()
		};

		await dvirStore.getDvirs(model);
	};

	const fetchData = async () => {
		await Promise.all([fetchDvirs(), driversStore.getDriversFilter(false), vehiclesStore.getVehiclesFilter(false)]);
	};

	// remove dvir
	const removeDvir = async (id: string) => {
		try {
			await dvirStore.deleteDvir(id);
		} catch (error) {
			console.log(error);
		} finally {
			await fetchDvirs();
		}
	};

	onMounted(async () => {
		await fetchData();
	});

	return {
		totalCount,
		drivers,
		vehicles,
		headerDate,
		selectedDriver,
		selectedVehicle,
		selectedNavigation,
		columns,
		rows,
		removeDvir
	};
};
