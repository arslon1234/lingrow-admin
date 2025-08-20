// importing packages
import dayjs, { Dayjs } from 'dayjs';
import { useTimeZoneHelper } from '~/helpers/timezone';
import { userService } from '~/helpers/user';
import { useCarrierStore } from '~/store/carrier';
import { useDriversStore } from '~/store/drivers';
import { useSessionsStore } from '~/store/sessions';

export const useToolsActivity = async () => {
	// route
	const route = useRoute();

	// stores
	const sessionStore = useSessionsStore();
	const carrierStore = useCarrierStore();
	const driverStore = useDriversStore();

	// computed
	const { totalCount, sessions } = storeToRefs(sessionStore);

	// time zone
	const { formatToUTC, acceptAsTimeZone, convertToTimeZone, getStartOf, getEndOf } = useTimeZoneHelper();

	// carriers
	const { carriers } = storeToRefs(carrierStore);

	// drivers
	const { drivers } = storeToRefs(driverStore);

	// header data
	const headerDate = ref<[Dayjs, Dayjs]>([
		route.query.fromDate ? acceptAsTimeZone(fixDateFormat(String(route.query.fromDate))) : getStartOf(subtract(convertToTimeZone(dayjs()), 1, 'week')),
		route.query.toDate ? acceptAsTimeZone(fixDateFormat(String(route.query.toDate))) : getEndOf(convertToTimeZone(dayjs()))
	]);

	// activities loaded
	const isActivityLoaded = ref<boolean>(false);

	// activity params
	const selectedCompany = ref<string | null>(route.query.carrierId ? String(route.query.carrierId) : '');
	const selectedDriver = ref<string | null>(route.query.driverId ? String(route.query.driverId) : '');
	const selectedTab = ref<number>(route.query.tab ? parseInt(String(route.query.tab)) : 2);

	// pagination
	const selectedNavigation = ref<number>(parseInt(String(route.query.pageNumber)) || 1);
	const pageSize = ref<number>(parseInt(String(route.query.pageSize)) || 10);

	// table data
	const columns = [
		{ key: 'id', label: 'Id' },
		{ key: 'user', label: 'User' },
		{ key: 'tool', label: 'Tool' },
		{ key: 'company', label: 'Company' },
		{ key: 'driver', label: 'Driver' },
		{ key: 'period', label: 'Period' },
		{ key: 'duration', label: 'Shift/Repair' },
		{ key: 'created', label: 'Created (date/time)' },
		{ key: 'action', label: 'Actions' }
	];

	// sample row datas before api connection

	const rows = computed(() => {
		const idOffset = pageSize.value && selectedNavigation.value ? pageSize.value * (selectedNavigation.value - 1) : 0;
		return sessions.value?.map((s: SessionResponse, ind: number) => ({
			uuid: s.id,
			id: idOffset + ind + 1,
			user: s.operator.firstName + ' ' + s.operator.lastName,
			tool: s.type,
			company: s.carrierName,
			companyId: s.carrierId,
			driverId: s.driverId,
			driver: s.driverName,
			period: acceptAsTimeZone(s.startDate).format('YYYY-MM-DD') + ' - ' + acceptAsTimeZone(s.endDate).format('YYYY-MM-DD'),
			duration: s.shiftDuration ? formatDuration(s.shiftDuration) : '00h 00m',
			created: acceptAsTimeZone(s.currentTime).format('YYYY-MM-DD HH:MM'),
			startDate: s.startDate,
			endDate: s.endDate
		}));
	});


	/** ACTIVITY LOADER **/
	const loadActivities = async () => {
		try {
			const params = {
				OperatorId: userService.user?.id,
				CarrierId: selectedCompany.value || null,
				DriverId: selectedDriver.value || null,
				StartDate: formatToUTC(headerDate.value[0]),
				EndDate: formatToUTC(headerDate.value[1]),
				...pagination(true, pageSize.value)
			};
			await sessionStore.getSessionsFilter(params);
		} catch (error) {
			console.error(error);
		} finally {
			isActivityLoaded.value = true;
		}

	};

	/** GET DRIVERS FOR SPECIFIC COMPANY **/
	const loadDrivers = async () => {
		await driverStore.getDriversFilter(false, selectedCompany.value || null, false);
	};

	/** HEADER DATE HANDLERS **/
	const updateHeaderDate = async (date: DatePicker) => {
		headerDate.value[0] = getStartOf(convertToTimeZone(dayjs(date.start)));
		headerDate.value[1] = getEndOf(convertToTimeZone(dayjs(date.end)));
	};

	// query params updating with key-value pair param (with encoding)
	const updateQueryParams = async (keyValuePairs: Record<string, string | undefined>) => {
		const encodedParams = Object.fromEntries(
			Object.entries(keyValuePairs)
				.filter(([_, value]) => value !== null && value !== undefined) // Filter out undefined values
				.map(([key, value]) => [key, value!]) // Encode values
		);

		await navigateTo({
			query: {
				...route.query,
				...encodedParams
			}
		});
	};

	// row activity select
	const rowSelect = async (row: any) => {
		await navigateTo('/logs/' + row.driverId + (row.tool === 1 ? '/boost?' : row.tool === 2 ? '/optimize?' : row.tool === 3 ? '/ai?' : '?tab=history&')
			+ 'fromDate=' + acceptAsTimeZone(row.startDate).format('YYYY-MM-DDTHH:mm:ss')
			+ '&toDate=' + acceptAsTimeZone(row.endDate).format('YYYY-MM-DDTHH:mm:ss')
			+ '&sessionId=' + row.uuid
			+ '&activity=true'
		);
	};

	// pagination watcher
	watch(() => selectedNavigation.value, async (newValue) => {
		const updatedQuery = { ...route.query };

		if (newValue <= 1) {
			// Remove pageNumber and pageSize explicitly
			delete updatedQuery['pageNumber'];
			delete updatedQuery['pageSize'];
		} else {
			// Update pageNumber and pageSize
			updatedQuery.pageNumber = String(newValue);
			updatedQuery.pageSize = String(pageSize.value);
		}

		// Use the updated query for navigation
		await navigateTo({ query: updatedQuery });

		await loadActivities();
	});

	// tab watcher with router
	watch(selectedTab, async (newValue) => {
		await updateQueryParams({ tab: String(newValue) || undefined });

	});

	// company watcher with router
	watch(selectedCompany, async (newValue) => {
		await navigateTo({ query: { ...route.query, carrierId: newValue ? newValue : undefined } });
		await loadDrivers();
		if (selectedCompany.value) {
			selectedDriver.value = drivers.value[0]?.id || '';
		} else {
			selectedDriver.value = '';
		}
	});

	// driver watcher with route
	watch(selectedDriver, async (newValue) => {
		await navigateTo({ query: { ...route.query, driverId: !!newValue ? newValue : undefined } });
	});

	// date range watcher with route
	watch(headerDate, async (newHeaderDate) => {
		if (newHeaderDate[0] && newHeaderDate[1]) {
			await updateQueryParams({
				fromDate: getStartOf(newHeaderDate[0]).format('YYYY-MM-DDTHH:mm:ss'),
				toDate: getEndOf(newHeaderDate[1]).format('YYYY-MM-DDTHH:mm:ss')
			});
		}
	});

	onMounted(async () => {
		await carrierStore.getCarriesFilter();

		if (selectedCompany.value) {
			await loadDrivers();
			selectedDriver.value = drivers.value[0]?.id || '';
		}

		if (headerDate.value[0] && headerDate.value[1]) {
			navigateTo({
				query: {
					fromDate: getStartOf(headerDate.value[0]).format('YYYY-MM-DDTHH:mm:ss'),
					toDate: getEndOf(headerDate.value[1]).format('YYYY-MM-DDTHH:mm:ss'),
					carrierId: selectedCompany.value || undefined,
					driverId: selectedCompany.value ? selectedDriver.value || undefined : undefined,
					pageNumber: selectedNavigation.value !== 1 ? String( selectedNavigation.value || 0) : undefined,
					pageSize:  selectedNavigation.value !== 1 ? String(pageSize.value || 0) : undefined,
				}
			});
		}

		if (selectedNavigation.value && selectedNavigation.value > 1) {
			await loadActivities();
		}
	});

	return {
		// date range
		headerDate,
		// company
		selectedCompany,
		// driver
		selectedDriver,
		// activity tab
		selectedTab,

		// activity loaded
		isActivityLoaded,

		// pagination page order
		selectedNavigation,
		// pagination elements size
		pageSize,
		// activities total count
		totalCount,

		// data
		columns,
		rows,

		// activities get
		loadActivities,
		// row activity select
		rowSelect,

		// drivers get
		loadDrivers,

		// carriers list
		carriers,

		// drivers list
		drivers,

		// date range update
		updateHeaderDate
	};
};
