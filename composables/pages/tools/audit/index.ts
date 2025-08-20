// importing stores
import { useAuditStore } from '~/store/audit';

// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

// importing packages
import { Dayjs } from 'dayjs';

export const useToolsAudit = async () => {
	// declaring stores
	const auditStore = useAuditStore();

	// loading
	const loading = ref<boolean>(false);
	// destructuring helpers
	const { convertToTimeZone, formatToUTC } = useTimeZoneHelper();

	// audit form
	const auditFormAll = reactive<AuditRequest>({
		carrierId: '',
		driverId: '',
		startDate: convertToTimeZone(),
		startTime: {
			hours: convertToTimeZone().hour(),
			minutes: convertToTimeZone().minute(),
			seconds: convertToTimeZone().second()
		},
		trips: [
			{
				bolNumber: '',
				trailerNumber: '',
				odometer: 0,
				engineHours: 0,
				dailyDistanceInMile: 0,
				from: {
					latitude: 0,
					longitude: 0,
					address: '',
					locationType: 2
				},
				to: {
					latitude: 0,
					longitude: 0,
					address: '',
					locationType: 3
				},
				fuelLocations: []
			}
		]
	});
	const tripNumbers = computed(() => {
		return Array.from({ length: auditFormAll.trips.length }, (_, index) => index + 1);
	});

	// audit data
	const selectedTrip = ref<Trip>(auditFormAll.trips[0]);
	const auditId = ref<string>('');
	// add audit
	const addTrip = () => {
		const emptyTrip: Trip = {
			bolNumber: '',
			trailerNumber: '',
			odometer: 0,
			engineHours: 0,
			dailyDistanceInMile: 0,
			from: {
				latitude: 0,
				longitude: 0,
				address: '',
				locationType: 2
			},
			to: {
				latitude: 0,
				longitude: 0,
				address: '',
				locationType: 3
			},
			fuelLocations: []
		};
		auditFormAll.trips.push(emptyTrip);

		selectedTrip.value = auditFormAll.trips.at(-1) as Trip;
	};

	const updateTrip = (trip: Trip, ind: number) => {
		auditFormAll.trips[ind] = trip;
		selectedTrip.value = trip;
	};

	const updateConstantas = (newConstants: {
		carrierId: string;
		driverId: string;
		date: Dayjs;
		time: { hours: number; minutes: number; seconds: number };
		odometer: number;
		engineHours: number;
		distance: number;
	}) => {
		auditFormAll.driverId = newConstants.driverId;
		auditFormAll.carrierId = newConstants.carrierId;
		auditFormAll.startDate = newConstants.date;
		auditFormAll.startTime = newConstants.time;
		auditFormAll.trips[0].odometer = newConstants.odometer;
		auditFormAll.trips[0].engineHours = newConstants.engineHours;
		auditFormAll.trips[0].dailyDistanceInMile = newConstants.distance;
	};

	const addAudit = async () => {
		loading.value = true;
		try {
			const model: AuditRequest = { ...auditFormAll };
			model.startDate = formatTime(auditFormAll.startDate, 'YYYY-MM-DD');
			if (typeof auditFormAll.startTime === 'object') {
				model.startTime = `${auditFormAll.startTime.hours.toString().padStart(2, '0')}:${auditFormAll.startTime.minutes
					.toString()
					.padStart(2, '0')}:${auditFormAll.startTime.seconds.toString().padStart(2, '0')}`;
			}
			const result = await auditStore.addAudit(model);
			if (result) {
				auditId.value = result.auditId;
				// auditFormAll.trips = [];
				localStorage.setItem('tripNumbers', JSON.stringify(tripNumbers.value));
				// clearObject(auditFormAll, ['startDate', 'startTime']);
				addTrip();
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
		}
	};

	return {
		loading,
		selectedTrip,
		auditFormAll,
		addAudit,
		auditId,
		addTrip,
		updateTrip,
		updateConstantas
	};
};
