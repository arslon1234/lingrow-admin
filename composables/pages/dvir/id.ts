import { useDvirStore } from "~/store/dvir";

export const useDvirId = async () => {
	// stores
	const dvirStore = useDvirStore();

	// edit disable button
	const isEditDvirDisabled = ref<boolean>(true);

	// destructuring stores
	const { dvir } = storeToRefs(dvirStore);

	// routes
	const route = useRoute();

	// edit form
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
	}>({
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
	});

	// loading
	const loading = ref(false);

	const mergeFormDvir = (form: any) => {
    mergeObjectValues(formDvir, form);
  }

  const submitEditFormDvir = async () => {
    const model: DvirAddRequest = {
      driverId: formDvir.driver,
      dateTime: dvir.value?.dateTime,
      location: formDvir.location,
      odometer: formDvir.odometer,
      remarks: formDvir.remarks,
      dvirStatusId: formDvir.status,
      vehicleId: formDvir.vehicle,
      vehicleDefectIds: formDvir.vehicleDefects,
      trailerDefectIds: formDvir.trailerDefects,
      trailers: [],
      signaturePath: formDvir.signaturePath
    }

    model.trailers.push(formDvir.trailer);

    try {
      loading.value = true;
      await dvirStore.putDvir(route.params.id as string, model);
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  }

	const removeDvir = async () => {
		try {
			await dvirStore.deleteDvir(route.params.id as string);
		} catch (error) {
			console.log(error);
		} finally {
			navigateTo('/dvir')
		}
	};

	onMounted(async () => {
		await dvirStore.getDvir(route.params.id as string);

		formDvir.vehicle = dvir.value?.vehicle.id as string,
		formDvir.driver = dvir.value?.driver.id as string,
		formDvir.location = dvir.value?.location as string,
		formDvir.odometer = dvir.value?.odometer as number,
		formDvir.trailer = dvir.value?.trailers.join(',') as string,
		formDvir.vehicleDefects = dvir.value?.vehicleDefects?.map((defect: DefectResponse) => defect.id) as string[],
		formDvir.trailerDefects = dvir.value?.trailerDefects?.map((defect: DefectResponse) => defect.id) as string[],
		formDvir.signaturePath = dvir.value?.signaturePath as string,
		formDvir.status = dvir.value?.dvirStatus.id as string,
		formDvir.remarks = dvir.value?.remarks as string
	})

  return {
    formDvir,
		isEditDvirDisabled,
		mergeFormDvir,
		submitEditFormDvir,
		removeDvir,
		loading
  }
};
