// importing plugins

// importing helpers
import { transformIssuerState } from '~/helpers/issuerState';

// importing stores
import { useEldConnectionInterfacesStore } from '~/store/eldConnectionInterface';
import { useIssuerStatesStore } from '~/store/issuerState';
import { useVehicleFuelsStore } from '~/store/vehicleFuels';
import { useVehiclesStore } from '~/store/vehicles';
// import { useCarrier } from './carrier';
// const { issuerStateParentId } = await useCarrier()
export const useVehiclesComposable = async () => {
  // route
  const route = useRoute();

  // stores
  const vehiclesStore = useVehiclesStore();
  const vehicleFuelsStore = useVehicleFuelsStore();
  const issuerStateStore = useIssuerStatesStore();
  const eldConnectionInterfaceStore = useEldConnectionInterfacesStore();

  // vehicles
  const vehicles = computed(() => vehiclesStore.vehicles ?? []);

  // pagination
  const vehiclesTotal = computed(() => vehiclesStore.vehiclesTotal);
  const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
  const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

  // loadings
  const loading = ref<boolean>(false);

  // filtered vehicles due to vehicle id | status
  const filteredVehicleRowDatas = ref<Array<any>>(Array.isArray(vehicles.value) ? vehicles.value.map((vehicle, index) => ({
    ...vehicle,
    counter: pageSize.value * (currentPage.value - 1) + index + 1,
    eld: vehicle.serialNumber ?? "N/A",
  })) : []);

  // Fuels computed for showing fuels in add/edit vehicle form
  const fuels = computed(() => vehicleFuelsStore.vehicleFuels);
  const fuelOptions = ref<string[]>(['Gasoline', 'Propane', 'Liquid Natural Gas', 'Ethanol']);
  // const issuerStates = computed(() => issuerStateStore.issuerStates);

  // issuer states computed for showing fuels in add/edit vehicle form
  const issuerStateOptions = computed(() => {
    return transformIssuerState(issuerStateStore.issuerStates);
  });
  // eld connection interfaces computed for showing interfaces in add/edit vehicle form
  const eldConnectionInterfaces = computed(() => eldConnectionInterfaceStore.eldconnectionInterfaces);

  // page | status filtering parameters
  const selectedStatus = ref<string>('All Status');
  const selectedVehicle = ref<string>('all');

  // modals
  const addOrUpdateVehicleModal = ref<boolean>(false);
  const activateModal = ref<boolean>(false);
  const modalSelectedVehicleId = ref<string | undefined>('');
  const statusVehicleModal = computed(() => filteredVehicleRowDatas.value.find(vehicle => vehicle.id === modalSelectedVehicleId.value && modalSelectedVehicleId.value !== '')?.status ?? false);
  const issuerStateParentId = ref<string>("");
  // Vehicle modal form
  const formVehicle = reactive<VehicleRequest>({
    unit: '',
    manufactureYear: 0,
    make: '',
    model: '',
    vin: '',
    vehicleFuelId: 0,
    eldVehicleConnectionId: 0,
    carrierId: '',
  });

  const licensePlate = reactive<LicensePlateRequest>({
    issuerStateId: '',
    plateNumber: ''
  });

  // Validator
  const validateVehicle = () => {
    const errors = [];

    if (!formVehicle.unit) errors.push({ path: 'unit', message: errorMessages.blank });
    if (!formVehicle.manufactureYear) errors.push({ path: 'manufactureYear', message: errorMessages.blank });
    if (!formVehicle.make) errors.push({ path: 'make', message: errorMessages.blank });
    if (!formVehicle.model) errors.push({ path: 'model', message: errorMessages.blank });
    if (!licensePlate.issuerStateId) errors.push({ path: 'issuerStateId', message: errorMessages.blank });
    if (!licensePlate.plateNumber) errors.push({ path: 'plateNumber', message: errorMessages.blank });
    if (!formVehicle.vehicleFuelId) errors.push({ path: 'vehicleFuelId', message: errorMessages.blank });
    if (!formVehicle.vin) errors.push({ path: 'vin', message: errorMessages.blank });

    return errors;
  };

  // Table data
  const columns = [
    {
      key: 'counter',
      label: '#'
    },
    {
      key: 'unit',
      label: 'Unit #'
    },
    {
      key: 'model',
      label: 'Model'
    },
    {
      key: 'make',
      label: 'Make'
    },
    {
      key: 'eld',
      label: 'ELD'
    },
    {
      key: 'vin',
      label: 'VIN'
    },
    {
      key: 'status',
      label: 'Status'
    }
  ];

  const people = reactive<{
    id: number,
    unit: number,
    model: string,
    make: string,
    eld: string,
    vin: string,
    state: number,
  }[]>([
    {
      id: 1,
      unit: 5646196,
      model: 'Freightliner',
      make: 'TR',
      eld: '3B4000173851 (FB:7D:80:B2:8F:B2)',
      vin: '1FT8W3DT7KED20817',
      state: 0
    },
    {
      id: 2,
      unit: 5646196,
      model: 'Freightliner',
      make: 'TR',
      eld: '3B4000173851 (FB:7D:80:B2:8F:B2)',
      vin: '1FT8W3DT7KED20817',
      state: 0
    },
    {
      id: 3,
      unit: 5646196,
      model: 'Freightliner',
      make: 'TR',
      eld: '3B4000173851 (FB:7D:80:B2:8F:B2)',
      vin: '1FT8W3DT7KED20817',
      state: 0
    },
    {
      id: 4,
      unit: 5646196,
      model: 'Freightliner',
      make: 'TR',
      eld: '3B4000173851 (FB:7D:80:B2:8F:B2)',
      vin: '1FT8W3DT7KED20817',
      state: 0
    },
    {
      id: 5,
      unit: 5646196,
      model: 'Freightliner',
      make: 'TR',
      eld: '3B4000173851 (FB:7D:80:B2:8F:B2)',
      vin: '1FT8W3DT7KED20817',
      state: 0
    }
  ]);

  // Function, which filters vehicles by selected specific status/vehicle
  const filterVehicles = () => {
    filteredVehicleRowDatas.value = vehicles.value.filter(vehicle => {
      const vehicleStatus = vehicle.status;
      const statusMatch = selectedStatus.value === 'All Status'
        || (vehicleStatus === (selectedStatus.value === 'Active'));
      const idMatch = selectedVehicle.value === 'all' || vehicle.id === selectedVehicle.value;

      return idMatch && statusMatch;
    }).map((vehicle, index) => ({
      ...vehicle,
      eld: vehicle.serialNumber ?? "N/A",
      counter: pageSize.value * (currentPage.value - 1) + index + 1,
    }));
  };

  // opens activate/deactivate modal
  const openStatusModal = (id: string) => {
    activateModal.value = true;
    modalSelectedVehicleId.value = id;
  };

  // closes activate/deactivate modal
  const closeStatusModal = () => {
    activateModal.value = false;
    modalSelectedVehicleId.value = '';
  };

  // Changes selected vehicle status activated/deactivated
  const changeVehicleStatus = async (id: string) => {
    if (!id) return;
    try {
      loading.value = true;
      const vehicle = filteredVehicleRowDatas.value.find(vehicle => vehicle.id === id);
      if (!vehicle) return;
      await vehiclesStore.changeVehicleStatus(id, vehicle.status ? 1 : 0);
    } catch (error) {
      console.log(error);
    } finally {
      activateModal.value = false;
      await fetchDatas();
      filterVehicles();
      loading.value = false;
    }
  };

  const assignFormVehicleValues = (vehicleResponse?: VehicleSingleResponse | null) => {
    // const vehicle = vehicles.value.find(vehicle => vehicle.id === id);
    if (vehicleResponse) {
      formVehicle.unit = vehicleResponse.unit ?? '';
      formVehicle.manufactureYear = vehicleResponse.manufactureYear ?? 0;
      formVehicle.make = vehicleResponse.make ?? '';
      formVehicle.model = vehicleResponse.model ?? '';
      formVehicle.vin = vehicleResponse.vin ?? '';
      formVehicle.vehicleFuelId = vehicleResponse.vehicleFuel.id;
      formVehicle.eldVehicleConnectionId = vehicleResponse.eldVehicleConnection.id;
      licensePlate.issuerStateId = vehicleResponse.licensePlate.issuerState.id;
      licensePlate.plateNumber = vehicleResponse.licensePlate.plateNumber;
      issuerStateParentId.value = vehicleResponse.licensePlate.issuerState.parentId
    }

    formVehicle.carrierId = getCarrierId()!;
  }

  const openAddOrUpdateVehicleModal = async (id?: string) => {
    resetForm();
    if (id) {
      modalSelectedVehicleId.value = id;
      const vehicle = await vehiclesStore.getVehicle(id);
      console.log(vehicle)
      if (!vehicle) return;
      assignFormVehicleValues(vehicle);
    } else {
      assignFormVehicleValues();
    }
    addOrUpdateVehicleModal.value = true;
  }

  const addOrUpdateVehicle = async () => {
    licensePlate.plateNumber = licensePlate.plateNumber.toString();
    formVehicle.licensePlate = licensePlate;
    try {
      loading.value = true;
      if (modalSelectedVehicleId.value) {
        await vehiclesStore.updateVehicle(formVehicle, modalSelectedVehicleId.value);
      } else {
        await vehiclesStore.addVehicle(formVehicle);
      }
    } catch (error) {
      console.log(error);
    } finally {
      closeAddOrUpdateVehicleModal();
      await fetchDatas();
      loading.value = false;
    }
  };

  const closeAddOrUpdateVehicleModal = () => {
    addOrUpdateVehicleModal.value = false;
  };

  const resetForm = () => {
    clearObject(formVehicle);

    licensePlate.issuerStateId = '';
    licensePlate.plateNumber = '';

    modalSelectedVehicleId.value = '';
  };

  const fetchDatas = async () => {
    const requestArray = [
      vehiclesStore.getVehiclesFilter(true),
      vehicleFuelsStore.getVehicleFuels(false),
      issuerStateStore.getIssuerStates(false),
      eldConnectionInterfaceStore.getEldConnectionInterfaces(false, null, null)
    ];
    await Promise.all(requestArray);
  };
  const isAddOrUpdateVehicleDisabled = computed(() => loading.value || !!validateVehicle().length);

  watch(() => currentPage.value, async (newValue) => {
    if (newValue <= 1) await navigateTo('/vehicles');
    else await navigateTo({ query: { pageNumber: newValue, pageSize: pageSize.value } });

    await vehiclesStore.getVehiclesFilter(true);
  });

  // Updating filtered vehicles due to vehicles in store change
  watch(() => vehicles.value, () => {
    filteredVehicleRowDatas.value = Array.isArray(vehicles.value) ? vehicles.value.map((vehicle, index) => ({
      ...vehicle,
      eld: vehicle.serialNumber ?? "N/A",
      counter: pageSize.value * (currentPage.value - 1) + index + 1,
    })) : [];
  });

  // Filtered vehicles due to vehicle id | status
  watch([() => selectedVehicle.value, () => selectedStatus.value], () => filterVehicles());

  onMounted(async () => {
    await fetchDatas();
  });

  return {
    isAddOrUpdateVehicleDisabled,
    loading,
    selectedStatus,
    selectedVehicle,
    statusVehicleModal,
    modalSelectedVehicleId,
    addOrUpdateVehicleModal,
    closeAddOrUpdateVehicleModal,
    addOrUpdateVehicle,
    resetForm,
    activateModal,
    formVehicle,
    licensePlate,
    eldConnectionInterfaces,
    changeVehicleStatus,
    validateVehicle,
    columns,
    people,
    vehicles,
    filteredVehicleRowDatas,
    fuels,
    issuerStateOptions,
    fuelOptions,
    openAddOrUpdateVehicleModal,
    openStatusModal,
    vehiclesTotal,
    pageSize,
    currentPage,
    closeStatusModal,
    issuerStateParentId
  };
}