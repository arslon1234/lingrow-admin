// importing packages
import dayjs from 'dayjs';
import { useEldStore } from '~/store/eld';

export const useToolsDot = async () => {
	// route
	const route = useRoute();

	// stores
	const eldStore = useEldStore();

	// header data
	const headerDate = ref<DatePicker>({ start: dayjs(), end: dayjs() });
	const selectedCompany = ref(null);
	const selectedDriver = ref(null);
	const selectedTab = ref<number>(route.query.status ? parseInt(route.query.status as string) : 2);

	// modals
	const createDotModal = ref<boolean>(false);
	const selectedRow = ref<number | string | null>(null);

	// loading
	const updateBtnloading = ref<boolean>(false);

	// modal report form
	const dotForm = reactive<EldUpdateRequest>({
		carrierId: null,
		applyToAllELDs: false,
		eldId: null,
		firmwareVersion: null,
	});
	const dotForms = reactive({
		eldDeviceId: null,
		eldFileId: null
	})
	const eldFiles = ref([])

	// computed
	const { elds, eldsTotalCount } = storeToRefs(eldStore);

	const validateDot = () => {
		const errors = [];
		if (!dotForm.firmwareVersion) errors.push({ path: 'firmwareVersion', message: errorMessages.blank });
		return errors;
	};

	// pagination
	const selectedNavigation = ref<number>(parseInt(route.query.pageNumber as string) || 1);
	const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

	// table data
	const columns = [
		{ key: 'id', label: 'Id' },
		{ key: 'mac', label: 'MAC' },
		{ key: 'sn', label: 'SN' },
		{ key: 'status', label: 'status' },
		{ key: 'eld_type', label: 'Eld Type' },
		{ key: 'vehicle', label: 'Vehicle' },
		{ key: 'malfunctions', label: 'Malfunctions' },
		{ key: 'fmversion', label: 'FM Version' }
	];

	const rows = computed(() => {
		return (
			elds.value?.map((eld: EldResponse, ind: number) => ({
				uuid: eld.id,
				id: pageSize.value * (selectedNavigation.value - 1) + ind + 1,
				mac: eld.macAddress || 'N/A',
				sn: eld.serialNumber || 'N/A',
				status: eld.isConnected,
				eld_type: eld.name || 'N/A',
				vehicle: eld?.vehicle?.unit || 'N/A',
				malfunctions: eld.malfunctions || 'N/A',
				fmversion: eld.mainVersionInfo || 'N/A',
				files: eld.files || []
			})) ?? []
		);
	});

	const updateBtnDisabled = computed(() => updateBtnloading.value || !!validateDot().length);

	const tableRowSelect = (row: any) => {
		
		eldFiles.value = row.files.flatMap((file:any) => file) || [];
		dotForms.eldDeviceId = row.uuid;

		selectedRow.value = row.uuid;

		clearObject(dotForm);
		dotForm.carrierId = getCarrierId();
		dotForm.applyToAllELDs = false;
		dotForm.eldId = selectedRow.value as string;

		createDotModal.value = true;
	};

	const getElds = async () => {
		await eldStore.getEldsByFilter({
			CarrierId: getCarrierId(),
			IsConnected: selectedTab.value === 2 ? null : Boolean(selectedTab.value),
			...pagination(true, pageSize.value)
		});
	};


	const updateFirmWare = async () => {
		console.log(dotForms)
		try {
			updateBtnloading.value = true;
			await eldStore.updateEld(dotForms);
		} catch (error) {
			console.log(error);
		} finally {
			createDotModal.value = false;
			updateBtnloading.value = false;
		}
	};

	// selected tab (inactive, active, all)
	watch(selectedTab, async (newValue) => {
		if (Number.isInteger(newValue)) {
			await navigateTo({ query: { ...route.query, status: newValue } });
			await getElds();
		}
	});

	// pagination
	watch(selectedNavigation, async (newValue) => {
		if (newValue <= 1) {
			await navigateTo({ query: { status: selectedTab.value } });
		} else {
			await navigateTo({ query: { ...route.query, pageNumber: selectedNavigation.value, pageSize: pageSize.value } });
		}
		await getElds();
	});

	onMounted(async () => {
		await getElds();
	});

	return {
		headerDate,
		selectedCompany,
		selectedDriver,

		// active, inactive, all tab selected
		selectedTab,

		// modal create
		createDotModal,

		// form
		dotForm,
		dotForms,
		eldFiles,
		validateDot,
		updateBtnloading,
		updateBtnDisabled,
		updateFirmWare,

		// selected row
		selectedRow,

		// row selected function
		tableRowSelect,

		// table columns
		columns,

		// row datas
		rows,
		
		// pagination
		selectedNavigation,
		pageSize,
		eldsTotalCount
	};
};
