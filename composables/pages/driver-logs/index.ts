// importing packages
import { Dayjs } from 'dayjs';

// importing stores
import { useDriversStore } from '~/store/drivers';
import { useLogsStore } from '~/store/logs';

// importing services
import { collectEventWarningAndErrors } from '~/service/normalize';

// importing helpers
import { toRaw } from 'vue';
import { useTimeZoneHelper } from '~/helpers/timezone';
import { downloadFile } from '~/utils/download';

export const useDriverLogs = async () => {
	// declaring stores
	const logsStore = useLogsStore();
	const driversStore = useDriversStore();

	// destructuring stores
	const { driversLogs, driversLogsTotal } = storeToRefs(logsStore);
	const { drivers } = storeToRefs(driversStore);

	// declaring route
	const route = useRoute();

	// loading
	const loading = ref(false);

	// timezone helpers
	const { convertToTimeZone, formatToUTC, acceptAsTimeZone, getStartOf, getEndOf } = useTimeZoneHelper();

	// header data
	const headerDate = ref<Dayjs>(route.query?.date ? getStartOf(acceptAsTimeZone(route.query?.date as string)) : convertToTimeZone());
	const selectedDriver = ref<string | null>('all');
	const selectedViolation = ref<number | null>(1);
	const selectedFormErrors = ref<number | null>(0);

	watch(headerDate, () => {
		if (compareDates(headerDate.value, convertToTimeZone())) {
			navigateTo({ query: { date: undefined } });
		} else {
			navigateTo({ query: { date: formatTime(headerDate.value, 'YYYY-MM-DD') } });
		}
	});

	// upload and download Modal
	const downloadModal = ref(false);
	const uploadModal = ref(false);

	const formUpload = reactive({
		driverId: '',
		date: convertToTimeZone(),
		data_transfer_type: 0,
		comment: null,
	});

	const formDownload = reactive({
		driverId: '',
		date: [subtract(convertToTimeZone(), 2, 'week'), convertToTimeZone()]
	});

	const validateUpload = () => {
		let errors = [];
		if (!formUpload.driverId) errors.push({ path: 'driver', message: errorMessages.blank });
		if (!formUpload.date) errors.push({ path: 'date', message: errorMessages.blank });
		if (!formUpload.comment) errors.push({ path: 'comment', message: errorMessages.blank });

		return errors;
	};

	const validateDownload = () => {
		let errors = [];
		if (!formDownload.driverId) errors.push({ path: 'driver', message: errorMessages.blank });
		if (!formDownload.date) errors.push({ path: 'date', message: errorMessages.blank });

		return errors;
	};

	const isUploadFormDisabled = computed(() => loading.value || !!validateUpload().length);
	const isDownloadFormDisabled = computed(() => loading.value || !!validateDownload().length);

	const submitUploadLogs = async () => {
		loading.value = true;
		try {
			const model = {
				driverId: formUpload.driverId,
				transferType: formUpload.data_transfer_type,
				currentTime: formatToUTC(formUpload.date),
				comment: formUpload.comment,
			};
			const result = await logsStore.transferDriverLogs(model);
			if (result) {
				uploadModal.value = false;
				await getDriversLogs()
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
		}
	}

	const submitDownloadLogs = async () => {
		loading.value = true;
		try {
			const model = {
				driverId: formDownload.driverId,
				startDateUtc: formatToUTC(formDownload.date[0]),
				endDateUtc: formatToUTC(formDownload.date[1]),
				displayLocation: ''
			}
			const result = await logsStore.downloadLogPdf(model);
			if (result) {
				downloadFile(result?.fileUrl);
				downloadModal.value = false;
				await getDriversLogs()
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
		}
	}

	const getDriversLogs = async () => {
		const model = {
			startTime: formatToUTC(getStartOf(headerDate.value)),
			endTime: formatToUTC(getEndOf(headerDate.value)),
			driverId: selectedDriver.value === 'all' ? null : selectedDriver.value,
			type: ((selectedViolation.value || 1) - 2) === -1 ? null : ((selectedViolation.value || 1) - 2)
		};

		await logsStore.getDriversLogs(model);
	};

	watch([headerDate, selectedViolation, selectedDriver], async () => {
		await getDriversLogs();
	});

	// table data
	const columns = [
		{ label: '#', key: 'count' },
		{ label: 'DRIVER', key: 'driver' },
		{ label: 'HOS VIOLATIONS ', key: 'violation' },
		{ label: 'FORMS & MANNER ERRORS', key: 'errors' },
		{ label: 'LAST SYNC', key: 'sync' }
	];

	const rows = computed(() =>
		driversLogs.value?.map((log: LogsDriverResponse, ind: number) => ({
			id: ind + 1,
			count: ind + 1,
			driverId: log.driverId,
			driver: log.driverName,
			violation: log.hasViolation ? 'Has Violation' : 'No Violation',
			errors: collectAllBoostEventsErrorsAndWarnings(log.events, log.resetPinTimes),
			sync: formatTime(log.dateTime, 'MMM D, hh:mm:ss a'),
		}))
	);

	// collect all errors
	const collectAllBoostEventsErrorsAndWarnings = (events?: BoostEventResponse[] | null, pinTimes?: {time: Dayjs | string, type: string}[]) => {
		const eventsWithoutArchived = events?.filter(e => e.actionState != 4);	
		collectEventWarningAndErrors(toRaw(eventsWithoutArchived), toRaw(pinTimes));
		return events
			?.flatMap((item: BoostEventResponse) => item?.errorTitles)
			.filter((item) => item !== undefined)
			.concat(events?.flatMap((item: BoostEventResponse) => item?.warningTitles).filter((item) => item !== undefined));
	};

	// pagination
	const selectedNavigation = ref<number>(parseInt(route.query?.pageNumber as string) || 1);
	const pageSize = ref(parseInt(route.query?.pageSize as string) || 10);

	watch(() => selectedNavigation.value, async () => {
		if (selectedNavigation.value <= 1) await navigateTo({query: { pageNumber: undefined, pageSize: undefined }});
		else await navigateTo({ query: { pageNumber: selectedNavigation.value, pageSize: 10 } });

		await getDriversLogs();
	});

	// lifecycle hooks
	onMounted(async () => {
		await Promise.all([getDriversLogs(), driversStore.getDriversFilter()]);
	});
	return {
		loading,
		columns,
		rows,
		drivers,
		headerDate,
		selectedDriver,
		selectedViolation,
		selectedFormErrors,
		selectedNavigation,
		driversLogsTotal,
		downloadModal,
		uploadModal,
		formUpload,
		formDownload,
		pageSize,
		isUploadFormDisabled,
		isDownloadFormDisabled,
		validateUpload,
		validateDownload,
		submitUploadLogs,
		submitDownloadLogs
	};
};
