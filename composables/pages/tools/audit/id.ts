// importing packages
import dayjs, { Dayjs } from 'dayjs';

// importing stores
import { useDriverDailyFormsStore } from '~/store/driverDailyForms';
import { useDriversStore } from '~/store/drivers';
import { useAuditStore } from '~/store/audit';
import { useDriverLogs } from '~/store/driverLogs';
import { useDriverInfosStore } from '~/store/driverInfos';
import { useIndex } from '~/store';

// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';
import { convertSecondsToHours } from '~/helpers/time';

export const useToolsAuditId = async () => {
	// stores
	const driverDailyFormsStore = useDriverDailyFormsStore();
	const driversStore = useDriversStore();
	const auditStore = useAuditStore();
	const driverLogsStore = useDriverLogs();
	const driverInfosStore = useDriverInfosStore();

	// destructuring stores
	const { sidebar } = storeToRefs(useIndex());
	const { auditChartData, auditDailyEvents, auditDailySummary, auditWeeklyViolations, auditWeightStations, auditTrackings } = storeToRefs(auditStore);
	const { drivers } = storeToRefs(driversStore);
	const { driverDailyForm } = storeToRefs(driverDailyFormsStore);
	const { dailyPixelViolations } = storeToRefs(driverLogsStore);
	const { driverTimeZone } = storeToRefs(driverInfosStore);

	// destructuring helpers
	const { getStartOf, getEndOf, formatToUTC, convertToTimeZone, acceptAsTimeZone } = useTimeZoneHelper();

	// route
	const route = useRoute();

	// loading
	const loading = ref<boolean>(false);

	// screenResolution
	const screenResolution = ref<number>(0);

	// edit profile
	const editProfileModal = ref(false);

	// table data
	const selectedRow = ref([]);

	// tracking
	const tracking = ref(false);

	// tooltips
	const trackingTooltips = ref<{ [key: string]: Boolean }>({});

	watch(tracking, async () => {
		await Promise.all([getTrackings(), getWeightStations()]);
	});
	
	// date settings
	const headerDate = ref<Dayjs>(route.query?.date ? acceptAsTimeZone(route.query.date as string) : convertToTimeZone());

	// driver daily form
	const getDriverDailyForm = async () => {
		const model = {
			driverId: route.params.id as string,
			dateTime: formatToUTC(headerDate.value)
		};
		await driverDailyFormsStore.getDriverDailyFormsByDate(model);
	};

	// user edit form
	const editDriverDailyForm = reactive({
		// vehicles: [''],
		coDrivers: '',
		shippingDocs: '',
		trailers: '',
		signaturePath: ''
	});

	// validate edit form
	const validateEditDriverDailyForm = () => {
		const errors = [];
		// if (!editDriverDailyForm.vehicles) errors.push({ path: 'vehicles', message: errorMessages.blank });
		if (!editDriverDailyForm.coDrivers) errors.push({ path: 'co-drivers', message: errorMessages.blank });
		if (!editDriverDailyForm.shippingDocs) errors.push({ path: 'shipping-docs', message: errorMessages.blank });
		if (!editDriverDailyForm.trailers) errors.push({ path: 'trailers', message: errorMessages.blank });
		if (!editDriverDailyForm.signaturePath) errors.push({ path: 'signature', message: errorMessages.blank });
		if (!editDriverDailyForm.signaturePath.endsWith('.jpg'))
			errors.push({
				path: 'signature',
				message: errorMessages.jpg
			});

		return errors;
	};

	// edit driver daily form
	const editDriverDailyFormModal = async () => {
		await driversStore.getDriversFilter();

		// editDriverDailyForm.vehicles = driverDailyForm.value?.assignedVehicles.map(vehicle => vehicle.id as string) ?? [];
		editDriverDailyForm.coDrivers = driverDailyForm.value?.coDriver?.id ?? '';
		editDriverDailyForm.shippingDocs = driverDailyForm.value?.shippingDocuments.join(',') ?? '';
		editDriverDailyForm.trailers = driverDailyForm.value?.trailers.join(',') ?? '';
		editDriverDailyForm.signaturePath = driverDailyForm.value?.signaturePath ?? '';
		editProfileModal.value = true;
	};

	// disable button edit daily form
	const disableEditDailyForm = computed(() => {
		return loading.value || validateEditDriverDailyForm().length > 0;
	});

	// submit edit form
	const submitDriverDailyForm = async () => {
		const model: DriverDailyFormsRequest = {
			// assignedVehicles: editDriverDailyForm.vehicles,
			driverId: route.params.id as string,
			certifiedDate: formatToUTC(convertToTimeZone()),
			formDate: formatToUTC(headerDate.value),
			coDriverId: editDriverDailyForm.coDrivers,
			shippingDocuments: editDriverDailyForm.shippingDocs.split(','),
			trailers: editDriverDailyForm.trailers.split(','),
			signaturePath: editDriverDailyForm.signaturePath
		};

		try {
			loading.value = true;
			await driverDailyFormsStore.updateDriverDailyForms(model);
		} catch (error) {
			console.error(error);
		} finally {
			loading.value = false;
			await getDriverDailyForm();
			editProfileModal.value = false;
		}
	};

	// get daily events and chart

	// pixel violations
	const getPixelViolations = async () => {
		const model = reactive<DriverDateTimeRequest>({
			startDate: formatToUTC(getStartOf(headerDate.value)),
			endDate: formatToUTC(getEndOf(headerDate.value)),
			driverId: route.params.id as string,
			screenResolution: screenResolution.value
		});
		await driverLogsStore.getDriverLogsDailyPixelViolations(model);
	};

	const getChart = async () => {
		const model = {
			driverId: route.params.id as string,
			startDate: formatToUTC(getStartOf(headerDate.value)),
			endDate: formatToUTC(getEndOf(headerDate.value)),
			screenResolution: screenResolution.value
		};
		await auditStore.getAuditGraph(model);
	};

	// get chart svgContainer width
	const getChartWidth = async (width: number): Promise<void> => {
		screenResolution.value = width;

		await Promise.all([getChart(), getPixelViolations()]);
	};

	// daily events
	const getDailyEvents = async () => {
		const model = {
			driverId: route.params.id as string,
			startDate: formatToUTC(getStartOf(headerDate.value)),
			endDate: formatToUTC(getEndOf(headerDate.value))
		};
		await auditStore.getAuditEvents(model);
	};

	// daily summary
	const getDailySummary = async () => {
		const model = {
			driverId: route.params.id as string,
			startDate: formatToUTC(getStartOf(headerDate.value)),
			endDate: formatToUTC(getEndOf(headerDate.value))
		};
		await auditStore.getAuditSummary(model);
	};

	// driver logs weekly violations
	const modelWeeklyViolations = reactive<DriverLogsDailyEventsRequest>({
		startDate: formatToUTC(getStartOf(subtract(headerDate.value, 1, 'week'))),
		endDate: formatToUTC(getEndOf(headerDate.value)),
		driverId: route.params.id as string
	});

	const getWeeklyViolations = async () => {
		await auditStore.getAuditViolations(modelWeeklyViolations);
	};

	// driver infos
	const getDriverTimeZone = async () => {
		await driverInfosStore.getDriverTimeZone(route.params.id as string);
	};

	// get trackings
	const getTrackings = async () => {
		const model = {
			driverId: route.params.id as string,
			auditId: route.params.auditId as string,
			tripNumber: JSON.parse(localStorage.getItem('tripNumbers') || '[]') as number[]	
		};
		await auditStore.getAuditTracking(model);
	};

	// get weight stations
	const getWeightStations = async () => {
		await auditStore.getAuditWeightStations();
	};

	// violations date settings
	watch(headerDate, async (newValue) => {
		if (compareDates(auditWeeklyViolations.value?.at(0)?.dateOfViolations, newValue)) {
			modelWeeklyViolations.startDate = formatToUTC(getStartOf(subtract(newValue, 1, 'day')));
			modelWeeklyViolations.endDate = formatToUTC(getEndOf(add(newValue, 6, 'day')));
			await getWeeklyViolations();
		} else if (compareDates(auditWeeklyViolations.value?.at(-1)?.dateOfViolations, newValue) && dayjs(newValue).isBefore(convertToTimeZone(), 'day')) {
			modelWeeklyViolations.startDate = formatToUTC(getStartOf(subtract(newValue, 6, 'day')));
			modelWeeklyViolations.endDate = formatToUTC(getEndOf(add(newValue, 1, 'day')));
			await getWeeklyViolations();
		} else if (!auditWeeklyViolations.value?.some((violation) => compareDates(violation.dateOfViolations, newValue))) {
			modelWeeklyViolations.startDate = formatToUTC(getStartOf(subtract(newValue, 6, 'day')));
			modelWeeklyViolations.endDate = formatToUTC(getEndOf(add(newValue, 1, 'day')));
			await getWeeklyViolations();
		}

		navigateTo({ query: { ...route.query, date: formatTime(newValue, 'YYYY-MM-DD') } });

		await Promise.all([getPixelViolations(), getChart(), getDailyEvents(), getDailySummary(), getDriverDailyForm()]);
	});

	const columns = computed(() => [
		{
			key: 'sequence',
			label: '#'
		},
		{
			key: 'time',
			label: `Time (${driverTimeZone.value?.shortName})`
		},
		{
			key: 'event',
			label: 'Event'
		},
		{
			key: 'duration',
			label: 'Duration'
		},
		{
			key: 'location',
			label: 'Location'
		},
		{
			key: 'odometer',
			label: 'Odometer'
		},
		{
			key: 'hours',
			label: 'Engine Hours'
		},
		{
			key: 'recordOrigin',
			label: 'Record Origin'
		},
		{
			key: 'recordStatus',
			label: 'Record Status'
		},
		{
			key: 'notes',
			label: 'Notes'
		}
	]);

	// edit daily events
	const mapDailyEvents = (dailyEvents: DriverLogsDailyEventsResponse[]) =>
		dailyEvents && dailyEvents.length > 0
			? [
					...dailyEvents.map((dailyEvent, ind) => ({
						sequence: dailyEvent?.sequenceId,
						time: acceptAsTimeZone(dailyEvent?.dateTime)?.format('MMM D, hh:mm:ss A'),
						event: getEventText(dailyEvent?.eventType, dailyEvent?.eventCode),
						eventType: dailyEvent?.eventType,
						eventCode: dailyEvent?.eventCode,
						eventId: dailyEvent?.id,
						duration: [1, 3].includes(dailyEvent.eventType) ? convertSecondsToHours(dailyEvent?.durationInSeconds ?? 0) : '',
						location: dailyEvent?.calculatedLocation ?? dailyEvent.manualLocation ?? '',
						odometer: dailyEvent?.totalVehicleMiles,
						hours: dailyEvent?.totalEngineHours,
						recordOrigin: dailyEvent?.recordOrigin ?? 1,
						recordStatus: dailyEvent?.recordStatus ?? 1,
						notes: dailyEvent?.annotation ?? ''
					}))
			  ]
			: [];

	const detailList = computed(() => mapDailyEvents(auditDailyEvents.value as DriverLogsDailyEventsResponse[]));

	onMounted(async () => {
		screenResolution.value = document.documentElement.clientWidth - 244 - (sidebar.value === 'open' ? 170 : 0);
		if (!route.query?.date) {
			navigateTo({ query: { date: formatTime(headerDate.value, 'YYYY-MM-DD') } });
		}
		await Promise.all([driversStore.getDriversFilter(), getDailyEvents(), getDailySummary(), getDriverTimeZone(), getDriverDailyForm(), getWeeklyViolations()]);
	});

	return {
		// loading
		loading,

		// drivers by carrierId
		drivers,

		// trackings
		auditTrackings,

		// weight stations,
		auditWeightStations,

		// violations
		auditWeeklyViolations,
		dailyPixelViolations,

		// daily summary
		auditDailySummary,

		// driver daily form
		driverDailyForm,

		// graph
		auditChartData,
		getChartWidth,

		// daily driver form
		editProfileModal,
		editDriverDailyForm,
		disableEditDailyForm,
		editDriverDailyFormModal,
		submitDriverDailyForm,
		validateEditDriverDailyForm,

		// header date
		headerDate,

		// table
		columns,
		detailList,
		selectedRow,

		// tracking
		tracking,
		trackingTooltips,
		// timezone
		acceptAsTimeZone,
		convertToTimeZone
	};
};
