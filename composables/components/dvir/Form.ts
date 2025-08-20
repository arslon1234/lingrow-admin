// importing stores
import { useDefectStore } from '~/store/defect';
import { useVehiclesStore } from '~/store/vehicles';
import { useDriversStore } from '~/store/drivers';
import { useDvirStore } from '~/store/dvir';

export const useDvirForm = async (props: any, isDisabled: any, emits: any) => {
	// stores
	const defectsStore = useDefectStore();
	const vehiclesStore = useVehiclesStore();
	const driversStore = useDriversStore();
	const dvirsStore = useDvirStore();

	// destructuring stores
	const { vehicles } = storeToRefs(vehiclesStore);
	const { drivers } = storeToRefs(driversStore);
	const { signatureAndLocation, statuses } = storeToRefs(dvirsStore);

	// route
	const route = useRoute();

	// form data
	// props.form ||
	const formDvir = reactive<{
		vehicle: string;
		driver: string;
		location: string;
		odometer: number;
		trailer: string;
		vehicleDefects: Array<string>;
		trailerDefects: Array<string>;
		signaturePath: string;
		status: string;
		remarks: string;
	}>(
		props.form ?? {
			vehicle: '',
			driver: '',
			location: '',
			odometer: 0,
			trailer: '',
			vehicleDefects: [],
			trailerDefects: [],
			signaturePath: '',
			status: '',
			remarks: ''
		}
	);

	const validateDvir = () => {
		const errors = [];
		if (!formDvir.vehicle) errors.push({ path: 'vehicle', message: errorMessages.blank });
		if (!formDvir.driver) errors.push({ path: 'driver', message: errorMessages.blank });
		if (!formDvir.location) errors.push({ path: 'location', message: errorMessages.blank });
		if (!formDvir.odometer) errors.push({ path: 'odometer', message: errorMessages.blank });
		if (!formDvir.trailer) errors.push({ path: 'trailer', message: errorMessages.blank });
		if (!formDvir.signaturePath) errors.push({ path: 'signaturePath', message: errorMessages.blank });
		return errors;
	};

	watch(
		() => ({ ...formDvir }),
		() => {
			isDisabled.value = validateDvir().length > 0;
		},
		{ deep: true, immediate: true }
	);

	watch(isDisabled, (newValue) => {
		if (!newValue) emits('mergeFormDvir', formDvir);
	});

	const dvirDriverChanged = async (id: string) => {
		await dvirsStore.getDvirLocationSignaturesByDriver(id);
		formDvir.location = signatureAndLocation.value?.location as string || formDvir.location;
	};

	// filtered statuses based on defects
	const filteredStatuses = computed(() =>
		statuses.value?.map((status, ind) => {
			formDvir.status =
				!!formDvir.trailerDefects?.length || !!formDvir.vehicleDefects?.length
					? formDvir.status === statuses.value?.at(-1)?.id
						? statuses.value![1].id
						: formDvir.status
					: statuses.value!.at(-1)!.id;
			return {
				...status,
				disabled:
					ind + 1 === statuses.value?.length
						? !!formDvir.trailerDefects?.length || !!formDvir.vehicleDefects?.length
						: !formDvir.trailerDefects?.length && !formDvir.vehicleDefects?.length
			};
		})
	);

	// defects modal
	const vehicleDefectsList = computed(() => defectsStore.vehicleDefects || []);
	const trailerDefectsList = computed(() => defectsStore.trailerDefects || []);


	onMounted(async () => {
		if (!route.params.id) clearObject(formDvir);
		await Promise.all([defectsStore.getDefects(), vehiclesStore.getVehiclesFilter(), driversStore.getDriversFilter(), dvirsStore.getDvirStatuses()]);

		if (!!props.form) {
			await dvirDriverChanged(formDvir.driver);
		}
	});

	return {
		formDvir,
		vehicles,
		drivers,
		filteredStatuses,
		signatureAndLocation,
		validateDvir,
		dvirDriverChanged,
		vehicleDefectsList,
		trailerDefectsList
	};
};
