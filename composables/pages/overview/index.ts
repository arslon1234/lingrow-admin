// importing stores
import { useTrackingsStore } from '~/store/tracking';

export const useOverview = async () => {
	// search settings
	const search = ref('');

	// declaring stores
	const trackingsStore = useTrackingsStore();

	// destructuring stores
	const { lastTrackings } = storeToRefs(trackingsStore);

	return {
		// header search
		search,

		// trackings
		lastTrackings
	};
};
