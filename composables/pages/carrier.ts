// importing stores
import { getTimeZoneShortNameObject } from '~/helpers/timezone';
import { useCarrierStore } from '~/store/carrier';
import { useIssuerStatesStore } from '~/store/issuerState';

export const useCarrier = async () => {
  // route
  const route = useRoute();

  // stores
  const carrierStore = useCarrierStore();
  const issuerStateStore = useIssuerStatesStore();

  // carriers
  const carriers = computed(() => carrierStore.carriers ?? []);
  // dots
  const dotList = computed(() => Array.from(new Set(carriers.value?.map(({ usdotNumber }) => usdotNumber))).map(dot => ({ id: dot, name: dot })));
  // time zones
  const timeZones = computed(() => carrierStore.timeZones?.map(timeZone => getTimeZoneShortNameObject(timeZone)));
  // issuer states
  const issuerStates = computed(() => issuerStateStore.issuerStates);
  // parent issuer states
  const parentIssuerStates = computed(() => issuerStateStore.parentIssuerStates);

  // header data
  const selectedCarrier = ref<string>('');
  const selectedCurrency = ref<string>('');

  // pagination
  const carriersTotal = computed(() => carrierStore.carriersTotal);
  const currentPage = ref<number>(parseInt(route.query.pageNumber as string) || 1);
  const pageSize = ref<number>(parseInt(route.query.pageSize as string) || 10);

  // loadings
  const loading = ref<boolean>(false);

  // modals
  const createModal = ref<boolean>(false);

  // Filtered carriers due to carrier id | status
  const filteredCarrierRowDatas = ref(Array.isArray(carriers.value) ? carrierStore.carriers?.map((rowItem: CarrierResponse, index: number) => ({
    ...rowItem,
    order: pageSize.value * (currentPage.value - 1) + index + 1,
    address: rowItem?.address ?? "N/A",
    timezone: rowItem?.timeZoneInfo?.displayName ?? "N/A"
  })) : []);

  // create form
  const formCreate = reactive<CarrierRequest>({
    providerId: getProviderId()!,
    name: '',
    phoneNumber: '',
    usdotNumber: '',
    street: '',
    city: '',
    zipCode: '',
    email: '',
    timeZoneId: '',
    issuerStateId: '',
    carrierTerminals: [],
    carrierDriverLogSetting: null,
  });

  // form create parent form issuer state
  const issuerStateParentId = ref<string>("");

  const validateFormCreate = () => {
    const errors = [];
    if (!formCreate.name) errors.push({ path: 'name', message: errorMessages.blank });
    if (!formCreate.phoneNumber) errors.push({ path: 'phoneNumber', message: errorMessages.blank });
    if (!formCreate.usdotNumber) errors.push({ path: 'usdotNumber', message: errorMessages.blank });
    if (!formCreate.street) errors.push({ path: 'street', message: errorMessages.blank });
    if (!formCreate.city) errors.push({ path: 'city', message: errorMessages.blank });
    if (!formCreate.zipCode) errors.push({ path: 'zipCode', message: errorMessages.blank });
    if (!formCreate.email) errors.push({ path: 'email', message: errorMessages.blank });
    if (!formCreate.timeZoneId) errors.push({ path: 'timeZoneId', message: errorMessages.blank });
    if (!issuerStateParentId) errors.push({ path: 'issuerStateParentId', message: errorMessages.blank });
    if (!formCreate.issuerStateId) errors.push({ path: 'issuerStateId', message: errorMessages.blank });
    return errors;
  };

  const handleSelectCarrier = (row: any) => {
    setCarrierId(row.id);
    setCarrierName(row.name)
    setCarrierGroupName(row.provider.name);
    setCarrierTimeZoneId(row.timeZoneInfo.ianaId);
    navigateTo('/logs');
  }

  const filterCarrier = () => {
    filteredCarrierRowDatas.value = carriers.value.filter(carrier => {
      const carrierIdMatch = !selectedCarrier.value || carrier.id === selectedCarrier.value;
      const dotNumberMatch = !selectedCurrency.value || carrier.usdotNumber === selectedCurrency.value;
      return carrierIdMatch && dotNumberMatch;
    }).map((carrier, index) => ({
      ...carrier,
      order: pageSize.value * (currentPage.value - 1) + index + 1,
      address: carrier?.address ?? "N/A",
      timezone: carrier?.timeZoneInfo?.shortName ?? carrier?.timeZoneInfo?.displayName ?? "N/A"
    }));
  };

  const resetForm = () => {
    clearObject(formCreate);

    issuerStateParentId.value = "";
  };
  const openAddCarrierModal = () => {
    resetForm();
    createModal.value = true;
    formCreate.providerId = getProviderId()!;
  };

  const closeAddCarrierModal = () => {
    createModal.value = false;
  };

  const addCarrier = async () => {
    try {
      loading.value = true;
      const result = await carrierStore.addCarrier(formCreate);
      if(result.status === 200) {
       closeAddCarrierModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
      await carrierStore.getCarriesFilter(true, null, null);
    }
  };

  const isDisabledAddCarrier = computed(() => loading.value || !!validateFormCreate().length);

  watch(() => carriers.value, () => {
    filteredCarrierRowDatas.value = Array.isArray(carriers.value) ? carrierStore.carriers?.map((rowItem: CarrierResponse, index: number) => ({
      ...rowItem,
      order: pageSize.value * (currentPage.value - 1) + index + 1,
      address: rowItem?.address ?? "N/A",
      timezone: rowItem?.timeZoneInfo?.shortName ?? rowItem?.timeZoneInfo?.displayName ?? "N/A"
    })) : []
  });

  watch(() => currentPage.value, async (newValue) => {
    if (newValue <= 1) await navigateTo('/carriers');
    else await navigateTo({ query: { pageNumber: newValue, pageSize: pageSize.value } });

    await carrierStore.getCarriesFilter(true, null, null);
  });

  // Filtered carriers due to carrier id | dot number
  watch([() => selectedCarrier.value, () => selectedCurrency.value], () => {
    filterCarrier();
  });

  onMounted(async () => {
    await carrierStore.getCarriesFilter(true, null, null);
    await issuerStateStore.getParentIssuerStates();
    await issuerStateStore.getIssuerStates(false);
    await carrierStore.getCarrierTimeZones();
  });

  // table data
  const columns: {
    key: string,
    label: string
  }[] = [
      {
        key: 'order',
        label: 'No'
      },
      {
        key: 'name',
        label: 'Company name'
      },
      {
        key: 'usdotNumber',
        label: 'USDOT'
      },
      {
        key: 'address',
        label: 'Address',
      },
      {
        key: 'timezone',
        label: 'Time zone'
      }
    ];

  return {
    pageSize,
    currentPage,
    carriersTotal,
    isDisabledAddCarrier,
    loading,
    columns, createModal, formCreate, selectedCarrier,
    selectedCurrency, validateFormCreate, filteredCarrierRowDatas,
    carriers, dotList, handleSelectCarrier, issuerStateParentId,
    timeZones, issuerStates, parentIssuerStates, addCarrier, openAddCarrierModal, closeAddCarrierModal
  };
}