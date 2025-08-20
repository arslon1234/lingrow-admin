// importing packages
import { Dayjs } from 'dayjs';

// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

// importing stores
import { useLogsStore } from '~/store/logs';
import { useDriverInfosStore } from '~/store/driverInfos';

export const useLogsDriverComposable = async () => {
	// declaring stores
	const logsStore = useLogsStore();
	const driverInfosStore = useDriverInfosStore();

	// destructuring stores
	const { driverLogs, driverLogsTotal } = storeToRefs(logsStore);
	const { driverInfos } = storeToRefs(driverInfosStore);

	// declaring route
	const route = useRoute();

	// declaring helpers
	const { formatToUTC, convertToTimeZone, getStartOf, getEndOf } = useTimeZoneHelper();

	// loading
	const loading = ref(false);

	// header settings
	const headerDate = ref<[Dayjs, Dayjs]>([subtract(convertToTimeZone(), 2, 'week'), convertToTimeZone()]);
	const selectedViolation = ref(1);
	const selectedDriver = ref<string>((route.params.id as string) || '');

	watch([headerDate, selectedViolation], async () => {
		await getDriverLogs();
	});

	// upload and download Modal
	const downloadModal = ref(false);
	const uploadModal = ref(false);

	const formUpload = reactive({
		date: convertToTimeZone(),
		data_transfer_type: 0,
		comment: null,
	});

	const formDownload = reactive({
		date: [subtract(convertToTimeZone(), 2, 'week'), convertToTimeZone()]
	});

	const validateUpload = () => {
		let errors = [];
		if (!formUpload.date) errors.push({ path: 'date', message: errorMessages.blank });
		if (!formUpload.comment ) errors.push({ path: 'comment', message: errorMessages.blank });

		return errors;
	};

	const validateDownload = () => {
		let errors = [];
		if (!formDownload.date[0] && !formDownload.date[1]) errors.push({ path: 'date', message: errorMessages.blank });

		return errors;
	};

	const isUploadFormDisabled = computed(() => loading.value || !!validateUpload().length);
	const isDownloadFormDisabled = computed(() => loading.value || !!validateDownload().length);

	const submitUploadLogs = async () => {
		loading.value = true;
		try {
			const model = {
				driverId: selectedDriver.value,
				transferType: formUpload.data_transfer_type,
				currentTime: formatToUTC(formUpload.date),
				comment: formUpload.comment,
			};
			const result = await logsStore.transferDriverLogs(model);
			if (result) {
				uploadModal.value = false;
				await getDriverLogs();
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
		}
	};

	const submitDownloadLogs = async () => {
		loading.value = true;
		try {
			const model = {
				driverId: selectedDriver.value,
				startDateUtc: formatToUTC(formDownload.date[0]),
				endDateUtc: formatToUTC(formDownload.date[1]),
				displayLocation: ''
			};
			const result = await logsStore.downloadLogPdf(model);
			if (result) {
				downloadFile(result?.fileUrl);
				downloadModal.value = false;
				await getDriverLogs();
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
		}
	};

	const getDriverLogs = async () => {
		const model = {
			driverId: selectedDriver.value,
			startTime: formatToUTC(getStartOf(headerDate.value[0])),
			endTime: formatToUTC(getEndOf(headerDate.value[1])),
			type: (selectedViolation.value || 1) - 2 === -1 ? null : (selectedViolation.value || 1) - 2
		};

		await logsStore.getDriverLogs(model);
	};

	// driver infos
	const getDriverInfos = async () => {
		const model = {
			driverId: route.params.id as string,
			dateTime: formatToUTC(headerDate.value[1])
		};
		await driverInfosStore.getDriverInfos(model);
		// await driverInfosStore.getDriverTimeZone(route.params.id as string);
	};

	// pagination
	const selectedNavigation = ref<number>(parseInt(route.query?.pageNumber as string) || 1);
	const pageSize = ref(parseInt(route.query?.pageSize as string) || 10);

	watch(() => selectedNavigation.value, async () => {
		if (selectedNavigation.value <= 1) await navigateTo({query: { pageNumber: undefined, pageSize: undefined }});
		else await navigateTo({ query: { pageNumber: selectedNavigation.value, pageSize: 10 } });

		await getDriverLogs();
	});

	// table data
	const columns = [
		{
			key: 'date',
			label: 'Date'
		},
		{
			key: 'driver',
			label: 'Driver'
		},
		{
			key: 'droveHours',
			label: 'Drove Hours'
		},
		{
			key: 'onDutyHours',
			label: 'On Duty Hours'
		},
		{
			key: 'violations',
			label: 'Violations'
		}
	];

	const rows = computed(() =>
		driverLogs.value?.map((log: LogDriverResponse) => ({
			date: formatTime(log.dateTime, 'DD/MM/YYYY'),
			driver: log.driverName,
			droveHours: formatDuration(log.dailyDriving),
			onDutyHours: formatDuration(log.dailyOnDuty),
			violations: log.hasViolation ? 'Has Violations' : 'No Violations'
		}))
	);

	onMounted(async () => {
		await Promise.all([getDriverInfos(), getDriverLogs()]);
	});

	return {
		loading,
		headerDate,
		driverInfos,
		selectedViolation,
		downloadModal,
		uploadModal,
		formUpload,
		formDownload,
		validateUpload,
		validateDownload,
		selectedNavigation,
		pageSize,
		columns,
		rows,
		driverLogsTotal,
		isUploadFormDisabled,
		isDownloadFormDisabled,
		submitUploadLogs,
		submitDownloadLogs
	};
};
