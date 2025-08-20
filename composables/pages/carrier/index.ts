// importing stores
import { useCarrierStore } from '~/store/carrier';

export const useCarrier = async () => {
	// stores
	const carrierStore = useCarrierStore();

	const carrier = computed(() => carrierStore.carrier);

	onMounted(async () => {
		const carrierId = getCarrierId();
		await carrierStore.getCarrier(carrierId);
	});

	return {
		carrier
	};
};