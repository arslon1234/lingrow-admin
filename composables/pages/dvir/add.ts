// importing packages
import dayjs from 'dayjs';

// importing helpers
import { useTimeZoneHelper } from '~/helpers/timezone';

// importing stores
import { useDvirStore } from '~/store/dvir';

export const useDvirAdd = async () => {
  // disabled or not
  const isAddDvirDisabled = ref<boolean>(true);

	// destructuring helpers
	const { convertToTimeZone, formatToUTC } = useTimeZoneHelper();

  // store
  const dvirsStore = useDvirStore();

  // loading
  const loading = ref(false);

  // form
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

  const mergeFormDvir = (form: any) => {
    mergeObjectValues(formDvir, form);
  }

  const submitFormDvir = async () => {
    const model: DvirAddRequest = {
      driverId: formDvir.driver,
      dateTime: formatToUTC(convertToTimeZone()),
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
      await dvirsStore.addDvir(model);
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  }

  return {
    formDvir,
    isAddDvirDisabled,
    loading,
    mergeFormDvir,
    submitFormDvir
  }
}