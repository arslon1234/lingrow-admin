import { useChart } from '~/store/chart';
import { useBoostEventsStore } from '~/store/boostEvents';
import { useTabsStore } from '~/store/tabs';
export const useBoostChartComposable = () => {
	const chartStore = useChart();
	const boostEventsStore = useBoostEventsStore();
    const tabStore = useTabsStore()

	const { screenResolution, chart } = storeToRefs(chartStore);
	const { isMoveTimeEventsReversed, selectedMoveEvents, selectedMoveEventsDurations } = storeToRefs(boostEventsStore);
    const {selectedTab} = storeToRefs(tabStore)

	const table = ref<{ scrollToRow: (id: string, doSelect: boolean) => void } | null>(null);
    const chartStates = reactive<BoostChartStates>({
		copiedMoveEvents: {} as { [key: string]: GraphDuties[] },
		selectedErrorEvent: null
	});
	const freeTimeScroller = (freeTime: BoostFreeTime) => {
		chart.value.handleSelectedLineId(freeTime.eventId, freeTime.startPosition, freeTime.endPosition);
	};
	const updateChartWidth = async (width: number) => {
		screenResolution.value = width;
	};
	const handleMoveTimeEventsReversing = (value: boolean) => {
		isMoveTimeEventsReversed.value = value;
	};
	const reverseMoveTimeEvents = () => {
		isMoveTimeEventsReversed.value = !isMoveTimeEventsReversed.value;
	};
	const selectRowEvent = (id: string) => {
		chart.value.handleSelectedLineId(id);
	};
	const getSelectedEvent = (event: GraphDuties, doSelectEvent: boolean = false) => {
		table.value?.scrollToRow(event.eventId, doSelectEvent);
	};
    const getSelectedMoveEvents = (events: GraphDuties[], eventsDurations: number[]) => {
		events.forEach((event) => {
			if (event.eventType === 3 && event.eventCode === 5) {
				event.eventCode = 2;
			} else if (event.eventType === 3 && event.eventCode === 6) {
				event.eventCode = 1;
			}
		});
		selectedMoveEvents.value[selectedTab.value?.id as string] = events;
		chartStates.copiedMoveEvents[selectedTab.value?.id as string] = events;

		selectedMoveEventsDurations.value = eventsDurations;
	};
	return { table, chartStates, freeTimeScroller, updateChartWidth, handleMoveTimeEventsReversing, reverseMoveTimeEvents, selectRowEvent, getSelectedEvent, getSelectedMoveEvents };
};
