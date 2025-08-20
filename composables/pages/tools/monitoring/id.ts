// importing stores
import { useCarrierStore } from '~/store/carrier';
import { useDriversStore } from '~/store/drivers';
import { useMonitoringStore } from '~/store/monitoring';
// importing services
import { collectEventWarningAndErrors } from '~/service/normalize/index.js';

// importing packages
import { Dayjs } from 'dayjs';

export const useToolsMonitoringId = async () => {
	// header
	const selectedDriver = ref<string>('all');

	// declaring route
	const route = useRoute();

	// declaring stores
	const monitoringStore = useMonitoringStore();
	const carrierStore = useCarrierStore();
	const driversStore = useDriversStore();

	// destructuring stores
	const { carrierMonitoring, carrierMonitoringTotal } = storeToRefs(monitoringStore);
	const { carrier } = storeToRefs(carrierStore);
	const { drivers } = storeToRefs(driversStore);

	// collect all errors
	const collectAllBoostEventsErrorsAndWarnings = (events?: BoostEventResponse[] | null, pinTimes?: {time: Dayjs | string, type: string}[]) => {
		const eventsWithoutArchived = events?.filter(e => e.actionState != 4);
		collectEventWarningAndErrors(toRaw(eventsWithoutArchived), toRaw(pinTimes));
		return events?.filter((event: BoostEventResponse | undefined) =>
			event && ((event?.errorTitles?.length ?? 0) > 0 || (event?.warningTitles?.length ?? 0) > 0)
		);
	};

	// table columns
	const columns1 = [
		{ label: 'Last event', key: 'event', class: 'w-[11.1%]' },
		{ label: 'Truck', key: 'truck', class: 'w-[11.1%]' },
		{ label: 'Break', key: 'break', class: 'w-[11.1%]' },
		{ label: 'Drive', key: 'drive', class: 'w-[11.1%]' },
		{ label: 'Shift', key: 'shift', class: 'w-[11.1%]' },
		{ label: 'Cycle', key: 'cycle', class: 'w-[11.1%]' },
		{ label: 'Has Profile Forms', key: 'profile', class: 'w-[11.1%]' },
		{ label: 'Violation', key: 'violation', class: 'w-[11.1%]' },
		{ label: 'Last updated', key: 'updated', class: 'w-[11.1%]' }
	];

	const columns2 = [
		{ label: 'Event', key: 'event', class: 'w-[28.4%]' },
		{ label: 'Error type', key: 'error', class: 'w-[14.2%]' },
		{ label: 'Time', key: 'time', class: 'w-[14.2%]' },
		{ label: 'Error massager', key: 'message', class: 'w-[42.6%]' }
	];

	// table rows
	const monitorings = computed(() =>
		carrierMonitoring.value?.map((mnting: MonitoringDrivers) => {
			const lastEvent: BoostEventResponse = mnting.events![0];
			const damagedEvents = collectAllBoostEventsErrorsAndWarnings(mnting?.events, mnting?.resetPinTimes);

			const titleCount = new Map<string, number>();
			let errorEvents = 0;
			let warningEvents = 0;

			damagedEvents?.forEach(event => {
				if ((event.errorTitles?.length ?? 0) > 0) {
					errorEvents++;
					event.errorTitles?.forEach(title => titleCount.set(title, (titleCount.get(title) ?? 0) + 1));
				}
				if ((event.warningTitles?.length ?? 0) > 0) {
					warningEvents++;
					event.warningTitles?.forEach(title => titleCount.set(title, (titleCount.get(title) ?? 0) + 1));
				}
			});

			const mostCommon = [...titleCount.entries()].reduce((a, b) => (b[1] > a[1] ? b : a), ["", 0])[0];

			return {
				driver: mnting.driverName,
				driverId: mnting.driverId,
				event: { eventCode: mnting.eventCode, eventType: mnting.eventType },
				truck: mnting.vehicleUnit,
				break: formatDuration(mnting.hosTimeRemainder.breakDuration),
				drive: formatDuration(mnting.hosTimeRemainder.drivingDuration),
				shift: formatDuration(mnting.hosTimeRemainder.shiftDuration),
				cycle: formatDuration(mnting.hosTimeRemainder.cycleDuration),
				violated: mnting.hasViolation,
				certified: mnting.isCertified,
				updated: formatTime(mnting.dateTime, 'MMM D, hh:mm A'),
				lastEvent: [
					{
						id: lastEvent?.id,
						event: { eventCode: lastEvent?.eventCode, eventType: lastEvent?.eventType },
						truck: mnting.vehicleUnit,
						break: mnting.hosTimeRemainder.breakDuration,
						drive: mnting.hosTimeRemainder.drivingDuration,
						shift: mnting.hosTimeRemainder.shiftDuration,
						cycle: mnting.hosTimeRemainder.cycleDuration,
						profile: mnting.isCertified,
						violation: mnting.hasViolation,
						updated: formatTime(mnting.dateTime, 'MMM D, hh:mm A'),
					}
				],
				events: damagedEvents?.map((event: BoostEventResponse) => ({
					id: event.id,
					event: {eventCode: event?.eventCode, eventType: event?.eventType},
					error: (event?.errorTitles?.length ?? 0) > 0 ? 'error' : 'warning',
					time: formatTime(event.dateTime, 'MMM D, hh:mm A'),
					message: (event?.errorTitles ?? [])?.join(', ') + ' ' + (event?.warningTitles ?? []).join(', '),
				})),
				errorEvents,
				warningEvents,
				mostCommon
			}
		})
	);

	const rows1 = ref([
		{
			id: 1,
			event: 'driving',
			truck: 5321,
			break: 523,
			drive: 4234,
			shift: 4235,
			cycle: 1233,
			profile: true,
			violation: false,
			updated: 'Frb 12'
		}
	]);

	const rows2 = ref([
		{
			id: 1,
			event: 'driving',
			error: 'error',
			time: 'Jan 28, 12:23:04 pm',
			message: 'THE SPEED WAS MUCH HIGHER THAN THE SPEED LIMIT IN IN (65 MPH)'
		},
		{
			id: 1,
			event: 'driving',
			error: 'warning',
			time: 'Jan 28, 12:23:04 pm',
			message: 'THE SPEED WAS MUCH HIGHER THAN THE SPEED LIMIT IN IN (65 MPH)'
		}
	]);

	// paginations
	const selectedNavigation = ref(1);

	// update monitoring when driver selected
	watch(selectedDriver, async () => {
		await monitoringStore.getMonitoringCarrier(true, route.params.id as string, selectedDriver.value === 'all' ? null : selectedDriver.value);
	})

	onMounted(async () => {
		await Promise.all([monitoringStore.getMonitoringCarrier(true, route.params.id as string, selectedDriver.value === 'all' ? null : selectedDriver.value), carrierStore.getCarrier(route.params.id as string), driversStore.getDriversFilter()]);
	});

	return {
		monitorings,
		drivers,
		selectedDriver,
		columns1,
		rows1,
		rows2,
		columns2,
		selectedNavigation,
		carrier
	};
};
