// importing stores
import { useCargoTypesStore } from '~/store/cargoTypes';
import { useCarrierStore } from '~/store/carrier';
import { useHosRolesStore } from '~/store/hosRoles';
import { useIssuerStatesStore } from '~/store/issuerState';
import { useRestBreaksStore } from '~/store/restBreaks';
import { useRestartsStore } from '~/store/restart';

// header data
const selectedCarrier = ref<string>('');
const selectedCurrency = ref<string>('');

// modals
const createModal = ref<boolean>(false);

// create form
const formCreate = reactive<CarrierRequest>({
	providerId: '',
	name: '',
	usdotNumber: '',
	timeZoneId: '',
	phoneNumber: '',
	email: '',
	street: '',
	city: '',
	zipCode: '',
	issuerStateId: '',
	carrierTerminals: [],
	carrierDriverLogSetting: {
		exemptDriver: false,
		hosRuleId: '',
		cargoTypeId: '',
		restartId: '',
		restBreakId: '',
		shortHaulException: false,
		allowYardMoves: false,
		allowPersonalUse: false,
		startingTime24HourPeriod: '000000',
		allowIFTA: false,
		allowTracking: false
	}
});

// form create parent form issuer state
const issuerStateParentId = ref<string>('');
const terminalsIssuerStateParentIds = ref<string[]>(['']);

export const useCarrierEdit = async () => {
	// stores
	const carrierStore = useCarrierStore();
	const issuerStateStore = useIssuerStatesStore();

	const carriers = computed(() => carrierStore.carriers ?? []);
	const carrier = computed(() => carrierStore.carrier);
	// All dots
	const dotList = computed(() => Array.from(new Set(carriers.value?.map(({ usdotNumber }) => usdotNumber))).map((dot) => ({ id: dot, name: dot })));
	// All time zones
	const timeZones = computed(() => carrierStore.timeZones);
	// All issuer states
	const issuerStates = computed(() => issuerStateStore.issuerStates);
	// All parent issuer states
	const parentIssuerStates = computed(() => issuerStateStore.parentIssuerStates);
	// All hos roles
	const hosRuleStore = useHosRolesStore();
	const hosRoles = computed(() => hosRuleStore.hosRoles);
	// All cargo types
	const cargoTypeStore = useCargoTypesStore();
	const cargoTypes = computed(() => cargoTypeStore.cargoTypes);
	// All restarts
	const restartStore = useRestartsStore();
	const restarts = computed(() => restartStore.restarts);
	// All rest breaks
	const restBreakStore = useRestBreaksStore();
	const restBreaks = computed(() => restBreakStore.restBreaks);

	// Filtered carriers due to carrier id | status
	const filteredCarrierRowDatas = ref(
		Array.isArray(carrier.value)
			? carrierStore.carriers?.map((rowItem: CarrierResponse, index: number) => ({
					...rowItem,
					order: index + 1,
					street: rowItem?.street ?? 'N/A',
					timezone: rowItem?.timeZoneInfo?.displayName ?? 'N/A'
				}))
			: []
	);

	const validateFormCreate = () => {
		const errors: Array<{ path: string; message: string }> = [];
		if (!formCreate.name) errors.push({ path: 'name', message: errorMessages.blank });
		if (!formCreate.usdotNumber) errors.push({ path: 'usdotNumber', message: errorMessages.blank });
		if (!formCreate.timeZoneId) errors.push({ path: 'timeZoneId', message: errorMessages.blank });
		if (!formCreate.phoneNumber) errors.push({ path: 'phoneNumber', message: errorMessages.blank });
		if (!formCreate.email) errors.push({ path: 'email', message: errorMessages.blank });
		if (!formCreate.street) errors.push({ path: 'street', message: errorMessages.blank });
		if (!formCreate.city) errors.push({ path: 'city', message: errorMessages.blank });
		if (!formCreate.zipCode) errors.push({ path: 'zipCode', message: errorMessages.blank });
		if (!formCreate.issuerStateId) errors.push({ path: 'issuerStateId', message: errorMessages.blank });
		return errors;
	};

	const handleSelectCarrier = (row: CarrierResponse) => {
		setCarrierId(row.id);
		navigateTo('/logs');
	};

	const filterCarriers = () => {
		filteredCarrierRowDatas.value = carriers.value
			.filter((carrier) => {
				const carrierIdMatch = !selectedCarrier.value || carrier.id === selectedCarrier.value;
				return carrierIdMatch;
			})
			.map((carrier, index) => ({
				...carrier,
				order: index + 1,
				street: carrier?.street ?? 'N/A',
				timezone: carrier?.timeZoneInfo?.displayName ?? 'N/A'
			}));
	};

	const assignCarrierFormInitial = () => {
		formCreate.providerId = carrier.value?.provider?.id ?? '';
		formCreate.name = carrier.value?.name ?? '';
		formCreate.providerId = carrier.value?.provider?.id ?? '';
		formCreate.name = carrier.value?.name ?? '';
		formCreate.usdotNumber = carrier.value?.usdotNumber ?? '';
		formCreate.timeZoneId = carrier.value?.timeZoneInfo?.id ?? '';
		formCreate.phoneNumber = carrier.value?.phoneNumber ?? '';
		formCreate.email = carrier.value?.email ?? '';
		formCreate.street = carrier.value?.street ?? '';
		formCreate.city = carrier.value?.city ?? '';
		formCreate.zipCode = carrier.value?.zipCode ?? '';
		formCreate.issuerStateId = carrier.value?.issuerState?.id ?? '';
		formCreate.carrierTerminals =
			carrier.value!.carrierTerminals && carrier.value!.carrierTerminals!.length > 0
				? carrier.value!.carrierTerminals?.map((terminal: any) => ({
						id: terminal?.id,
						timeZoneId: terminal.timeZoneInfo?.id,
						street: terminal.street,
						city: terminal.city,
						zipCode: terminal.zipCode,
						issuerStateId: terminal.issuerState?.id
					}))
				: [
						{
							id: null,
							timeZoneId: '',
							street: '',
							city: '',
							zipCode: '',
							issuerStateId: ''
						}
					];
		formCreate.carrierDriverLogSetting = carrier.value?.carrierDriverLogSetting
			? {
					exemptDriver: carrier.value?.carrierDriverLogSetting.exemptDriver ?? false,
					hosRuleId: carrier.value?.carrierDriverLogSetting.hosRule?.id ?? '',
					cargoTypeId: carrier.value?.carrierDriverLogSetting.cargoType?.id ?? '',
					restartId: carrier.value?.carrierDriverLogSetting.restart?.id ?? '',
					restBreakId: carrier.value?.carrierDriverLogSetting.restBreak?.id ?? '',
					shortHaulException: carrier.value?.carrierDriverLogSetting.shortHaulException ?? '',
					allowYardMoves: carrier.value?.carrierDriverLogSetting.allowYardMoves ?? '',
					allowPersonalUse: carrier.value?.carrierDriverLogSetting.allowPersonalUse ?? '',
					startingTime24HourPeriod: carrier.value?.carrierDriverLogSetting.startingTime24HourPeriod ?? '000000',
					allowIFTA: carrier.value?.carrierDriverLogSetting.allowIFTA ?? false,
					allowTracking: carrier.value?.carrierDriverLogSetting.allowTracking ?? false
				}
			: {
					exemptDriver: false,
					hosRuleId: '',
					cargoTypeId: '',
					restartId: '',
					restBreakId: '',
					shortHaulException: false,
					allowYardMoves: false,
					allowPersonalUse: false,
					startingTime24HourPeriod: '000000',
					allowIFTA: false,
					allowTracking: false
				};

		issuerStateParentId.value = issuerStates.value.find(({ id }) => id === formCreate.issuerStateId)?.parentId ?? '';
		terminalsIssuerStateParentIds.value =
			formCreate.carrierTerminals && formCreate.carrierTerminals.length > 0
				? formCreate.carrierTerminals.map((terminal: any) => issuerStates.value.find(({ id }) => id === terminal.issuerStateId)?.parentId ?? '')
				: [''];
	};

	const addNewTerminal = () => {
		formCreate.carrierTerminals.push({
			id: null,
			timeZoneId: '',
			street: '',
			city: '',
			zipCode: '',
			issuerStateId: ''
		});
	};

	const deleteTerminal = (ind: number) => {
		formCreate.carrierTerminals = formCreate.carrierTerminals.filter((item: any, i: number) => i !== ind);
	};

	const resetForm = () => {
		formCreate.providerId = '';
		formCreate.name = '';
		formCreate.phoneNumber = '';
		formCreate.usdotNumber = '';
		formCreate.street = '';
		formCreate.city = '';
		formCreate.zipCode = '';
		formCreate.email = '';
		formCreate.timeZoneId = '';
		formCreate.issuerStateId = '';
		formCreate.carrierTerminals = [
			{
				id: '',
				timeZoneId: '',
				street: '',
				city: '',
				zipCode: '',
				issuerStateId: ''
			}
		];
		formCreate.carrierDriverLogSetting = {
			exemptDriver: false,
			hosRuleId: '',
			cargoTypeId: '',
			restartId: '',
			restBreakId: '',
			shortHaulException: false,
			allowYardMoves: false,
			allowPersonalUse: false,
			startingTime24HourPeriod: '000000',
			allowIFTA: false,
			allowTracking: false
		};

		issuerStateParentId.value = '';
		terminalsIssuerStateParentIds.value = [''];
	};

	// Filtered carriers due to carrier id | dot number
	watch([() => selectedCarrier.value, () => selectedCurrency.value], () => {
		filterCarriers();
	});

	onMounted(async () => {
		const carrierId = getCarrierId();
		await Promise.all([
			issuerStateStore.getIssuerStates(false),
			carrierStore.getCarrier(carrierId),
			carrierStore.getCarrierTimeZones(),
			issuerStateStore.getParentIssuerStates(),
			hosRuleStore.getHosRoles(false),
			cargoTypeStore.getCargoTypes(false),
			restartStore.getRestarts(false),
			restBreakStore.getRestBreaks(false)
		]);
		assignCarrierFormInitial();
	});

	return {
		createModal,
		formCreate,
		selectedCarrier,
		selectedCurrency,
		validateFormCreate,
		filteredCarrierRowDatas,
		carrier,
		dotList,
		handleSelectCarrier,
		issuerStateParentId,
		timeZones,
		issuerStates,
		parentIssuerStates,
		terminalsIssuerStateParentIds,
		addNewTerminal,
		deleteTerminal,
		resetForm,
		hosRoles,
		cargoTypes,
		restarts,
		restBreaks
	};
};
