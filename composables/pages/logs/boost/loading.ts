import { useBoostStore } from '~/store/boost';
export const useBoostLoadingComposable = () => {
	const route = useRoute();
	const boostStore = useBoostStore();
	const { isBoostTimeMoved } = storeToRefs(boostStore);
	const loadingStates = reactive({
		loading: false,
		loadingBoostEvents: false,
		isBoostEventsSubmitted: false,
		isBoostEventsLoaded: false,
		isBoostEventsSubmitLoaded: false
	});
	const openNextLog = async () => {
		navigateTo({ query: { ...route.query, sessionId: undefined, activity: undefined } });
		loadingStates.isBoostEventsLoaded = false;
		loadingStates.isBoostEventsSubmitted = false;
		isBoostTimeMoved.value = {};
	};
	return { loadingStates, openNextLog };
};
