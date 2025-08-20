<template>
	<div class="relative" ref="parentDiv" @mousemove="onEditMouseMove" @mouseleave="editMovingController = false"
		@mouseup="editControllerReleased"
		:style="{ cursor: editControllerStart || editControllerEnd ? 'grabbing' : '' }">
		<div class="w-full flex">
			<ChartLabelsForDutiesSingleDay :edit="props.edit || props.add" :height="height" :top-offset="topOffset" />
			<div ref="svgContainer" dir="rtl" :style="{ paddingBottom: props.edit || props.add ? `35px` : `10px` }"
				:class="[(props.edit || props.add || dutyTimesCopy?.dayNames?.length < 2) && 'overflow-x-hidden']"
				class="overflow-x-auto overflow-y-hidden flex-1 relative pt-2.5 [&::-webkit-scrollbar-thumb]:bg-purple [&::-webkit-scrollbar]:bg-background-grey_3 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:rounded-full dark:[&::-webkit-scrollbar]:bg-white/[0.1]">
				<svg v-if="dutyTimesCopy?.dayNames" ref="mySvg" xmlns="http://www.w3.org/2000/svg"
					:viewBox="`0 0 ${dutyTimesCopy?.svgViewBox ? dutyTimesCopy.svgViewBox : 1738} ${height * 4 + topOffset}`"
					:width="dutyTimesCopy?.svgWidth ? dutyTimesCopy?.svgWidth : 1438" class="event-chart duration-300"
					height="100%" @mousemove="onMouseMove" @mouseenter="isMovingDetailsVisible = true"
					@mouseleave="isMovingDetailsVisible = false">
					<g transform="translate(0, 0)" pointer-events="all">
						<ChartLabelsForDays :edit="props.edit || props.add" :distance="distance"
							:day-names="dutyTimesCopy?.dayNames ? dutyTimesCopy.dayNames : []"
							:count="dutyTimesCopy?.days ? dutyTimesCopy.days * 24 : 0" />
						<ChartHorizontalStrokes :height="height" :top-offset="topOffset" :distance="distance"
							:count="dutyTimesCopy?.days ? dutyTimesCopy.days * 24 : 0" />
						<ChartLongestVerticalSeparatingColumn :height="height" :top-offset="topOffset"
							:distance="distance" :count="dutyTimesCopy?.days ? dutyTimesCopy.days * 24 : 0"
							class="day-separator" />
						<ChartDaySeparator :height="height" :top-offset="topOffset" :distance="distance"
							:count="dutyTimesCopy?.days ? dutyTimesCopy.days * 24 : 0" class="day-separator"
							ref="daySeparatorComponent" />
						<ChartOneMiddleVerticalStroke :height="height" :top-offset="topOffset" :distance="distance"
							:count="dutyTimesCopy?.days ? dutyTimesCopy.days * 24 : 0" />
						<ChartTwoShorterVerticalStrokes :height="height" :top-offset="topOffset" :distance="distance"
							:count="dutyTimesCopy?.days ? dutyTimesCopy.days * 48 : 0" />
						<ChartTwoShortestVerticalStrokes :height="height" :top-offset="topOffset" :distance="distance"
							:count="dutyTimesCopy?.days ? dutyTimesCopy.days * 48 : 0" />

						<!-- DUTY EVENTS -->
						<g v-for="(dutyGroup, dutyIndex) in dutyTimesCopy?.duties" :key="dutyIndex">
							<template v-for="(item, key) in dutyGroup" :key="key">
								<text :x="(item.x1 + item.x2) / 2"
									:y="verticalEventPosition(+dutyIndex) - ((props.edit || props.add) ? 4 : 6)"
									text-anchor="middle" :font-size="(props.edit || props.add) ? 10 : 12"
									:fill="mainColor" font-weight="500"
									v-if="canBeDisplayed(item.x1, item.x2, item.duration) && (!props.edit || !props.add)">
									{{ formatDuration(item.duration) }}
								</text>
								<text :x="(item.x1 + item.x2) / 2"
									:y="verticalEventPosition(+dutyIndex) + ((props.edit || props.add) ? 13 : 15)"
									text-anchor="middle" :font-size="(props.edit || props.add) ? 10 : 12"
									:fill="mainColor" font-weight="500"
									v-if="canBeDisplayed(item.x1, item.x2, item.duration) && (!props.edit || !props.add)">
									{{ formatDuration(item.duration) }}
								</text>
								<line :id="'HosEvent-' + dutyIndex + '-' + key"
									:x1="item.x1 + (item.x2 - item.x1 <= 5 ? 0 : 2)"
									:x2="item.x2 - (item.x2 - item.x1 <= 5 ? 0 : 2)"
									:y1="verticalEventPosition(+dutyIndex)" :y2="verticalEventPosition(+dutyIndex)"
									:stroke-width="item.x2 - item.x1 <= 5 ? 2 : 5"
									:stroke-linecap="(item.x2 - item.x1 <= 5) ? 'butt' : 'round'" stroke-opacity="1"
									:stroke="mainColor"
									:stroke-dasharray="+dutyIndex === 6 || +dutyIndex === 5 ? '8' : ''"
									@mouseenter="+dutyIndex === 3 ? drivingMouse : null"></line>
							</template>
						</g>

						<!-- VERTICAL LINES -->
						<line v-for="(item, key) in dutyTimesCopy?.verticalLines" :key="key"
							id="HosEvent:ZIJ8jxerCn-0-vertical" :x1="item.x1" :x2="item.x2"
							:y1="verticalEventPosition(item.eventCodes[0])"
							:y2="verticalEventPosition(item.eventCodes[1])" stroke-width="1" stroke-opacity="1"
							:stroke="mainColor">
						</line>

						<!-- VIOLATIONS -->
						<line v-for="(violation, ind) in props?.violations" :key="ind" :x1="Array.isArray(violation) ? violation[0].position : violation?.position"
							:y1="topOffset" :x2="Array.isArray(violation) ? violation[0].position : violation?.position" :y2="height * 5" stroke-width="2"
							:stroke="errorColor">
						</line>

						<!-- EDIT EVENT LINES and RECTS -->
						<!-- top border -->
						<line v-if="props.edit || props.add" :x1="editEvent.x1" :y1="topOffset" :x2="editEvent.x2"
							:y2="topOffset" stroke-width="2" :stroke="editColor" stroke-dasharray="4"
							stroke-linecap="round"></line>

						<!-- two borders -->
						<line v-if="props.edit || props.add" :x1="editEvent.x1" :y1="topOffset" :x2="editEvent.x1"
							:y2="topOffset + height * 5" stroke-width="2" :stroke="editColor"></line>
						<line v-if="props.edit || props.add" :x1="editEvent.x2" :y1="topOffset" :x2="editEvent.x2"
							:y2="topOffset + height * 5" stroke-width="2" :stroke="editColor"></line>

						<rect v-if="props.edit || props.add" :stroke="editColor" :x="editEvent.x1" :y="topOffset"
							:width="editEvent.x2 - editEvent.x1" :fill="editColor" opacity="0.1" :height="height * 4">
						</rect>

						<!-- HORIZONTAL 2 RECTS -->
						<rect :stroke="mainColor" :x="0" :y="topOffset + height"
							:width="distance * dutyTimesCopy.days * 24" :fill="mainColor" opacity="0.04"
							:height="height"></rect>
						<rect :stroke="mainColor" :x="0" :y="topOffset + height * 3"
							:width="distance * dutyTimesCopy.days * 24" :fill="mainColor" opacity="0.04"
							:height="height"></rect>

						<!--MOVING VERTICAL LINE AND CIRCLE-->
						<line :x1="dynamicLine.x1" :y1="topOffset" :x2="dynamicLine.x2" :y2="height * 5"
							stroke-width="2" :stroke="mainColor"
							v-if="isMovingDetailsVisible && (!props.edit && !props.add)"></line>
						<circle :cx="circleObj.x" :cy="circleObj.y" r="5" :fill="mainColor" :stroke="mainColor"
							stroke-width="1" pointer-events="none"
							v-if="isMovingDetailsVisible && (!props.edit && !props.add) && rectObj.width"></circle>
						<template v-for="freeTime in freeTimes" :key="freeTime.eventId">
							<rect class="duration-200" :stroke="mainColor" :x="freeTime.startPosition" :y="topOffset"
								:width="freeTime.endPosition - freeTime.startPosition" fill="#0AD406" opacity="0.15"
								:height="height * 4">
							</rect>
						</template>

						<template v-for="event in selectedEvents" :key="event.eventId">
							<rect class="duration-200" :stroke="mainColor" :x="event.x1" :y="topOffset"
								:width="event.x2 - event.x1" :fill="mainColor" opacity="0.1" :height="height * 4">
							</rect>
						</template>

						<template v-if="selectedEvent">
							<rect class="duration-200" :stroke="mainColor" :x="selectedEvent.x1" :y="topOffset"
								:width="selectedEvent.x2 - selectedEvent.x1" :fill="mainColor" opacity="0.1"
								:height="height * 4"></rect>
						</template>

						<template v-if="props.allViolations?.length">
							<g v-for="violationGroup in props.allViolations" :key="violationGroup.stringType">
								<rect v-for="(block, index) in violationGroup.violationBlocks" :key="index"
									class="duration-200" :x="block[0]" :width="block[1]" :y="topOffset"
									:height="height * 4" fill="#f77963"
									fill-opacity="0.4" />
							</g>
						</template>
						
						<rect v-if="!props.edit && !props.add" class="duration-200" :stroke="mainColor" :x="rectObj.x"
							:y="topOffset" :width="rectObj.width" :fill="mainColor" opacity="0.1" :height="height * 4"
							@mousedown="handleMouseDown" @contextmenu.prevent @click="handleBlockClick">
						</rect>
					</g>
				</svg>

				<!-- VIOLATIONS -->
				<template v-if="!props.edit && !props.add">
					<div v-for="(violation, ind) in props.violations" :key="ind"
						:style="{ left: `calc(100% - ${dutyTimesCopy?.svgWidth - (Array.isArray(violation) ? violation?.[0]?.position : violation?.position)}px - 1px)` }"
						class="absolute duration-300 top-2.5 z-[10] bg-red-1 h-5 px-1.5 w-fit whitespace-nowrap rounded-full rounded-bl-none text-[10px] flex items-center justify-center text-white">
						{{ Array.isArray(violation) ? violation?.[0]?.description : violation?.description }}
					</div>
				</template>

				<div v-if="loading"
					class="absolute top-0 left-0 z-50 backdrop-blur-sm flex justify-center items-center w-full h-full">
					<UIcon name="i-lucide-loader-2" class="animate-spin text-[#222222B2] text-3xl"/>
				</div>
			</div>
			<ChartLabelsForDutyHoursSingleDay ref="labelsForDutyHours" :edit="props.edit || props.add" :height="height"
				:top-offset="topOffset" :day-name="separatorDate?.format('MMM D') ?? ''"
				:daily-summary="dailySummary" />
		</div>
		<div v-if="(!props.edit && !props.add) && rectObj.width" :style="{
			left: detailsToolTip + 'px',
			opacity: isMovingDetailsVisible ? 1 : 0,
			pointerEvents: isMovingDetailsVisible ? 'auto' : 'none',
			boxShadow: `0 0 15px -5px ${colorMode.value === 'dark' ? '#454545' : '#9295A1'}`
		}" class="absolute -translate-x-1/2 duration-200 top-42 !z-[21] bg-white dark:bg-dark-0 rounded-xl px-4 py-2 text-xs">
			<div style="clip-path: polygon(50% 0, 100% 100%, 0 100%)"
				class="absolute left-1/2 -translate-x-1/2 -top-1.5 w-6 h-2 bg-white dark:bg-dark-0"></div>
			<p class="text-center">
				<strong>{{ lineToolTipCurrentTime }}</strong>
			</p>
			<div class="space-y-2 mt-5 font-bold">
				<p class="flex gap-x-10 justify-between">
					<span class="uppercase">STATUS</span><span class="uppercase"
						:style="{ color: events.find((n) => n.key === lineToolTipStatus)?.color }">{{events.find((n) =>
							n.key
							===
							lineToolTipStatus)?.label}}</span>
				</p>
				<p class="flex gap-x-10 justify-between whitespace-nowrap">
					<span class="uppercase">EVENT TIME</span><span>{{ lineToolTipEventTime }}</span>
				</p>
				<p class="flex gap-x-10 justify-between">
					<span class="uppercase">DURATION</span><span>{{ lineToolTipDuration }}</span>
				</p>
			</div>
		</div>

		<!-- EDIT EVENT -->
		<!-- edit event controller -->
		<div v-if="props.edit || props.add"
			:style="{ left: `${editEvent.x1 + 47}px`, width: `${2 + (editEvent.x2 - editEvent.x1)}px` }"
			class="absolute top-[141px] z-[20] border-x-2 border-brown-0 h-[34px]">
			<UButton @mousedown="
				editMovingController = true;
			editControllerStart = true;
			" @mouseup="
				editMovingController = false;
			editControllerStart = false;
			" variant="solid" size="md"
				class="bg-brown-0 group hover:bg-brown-0 active:bg-brown absolute -left-1 bottom-0 -translate-x-full !cursor-grab active:!cursor-grabbing dark:bg-white/[0.1] dark:hover:bg-white/[0.2]">
				<template #leading>
					<ArrowBlockLeftIcon
						class="text-white !cursor-grab group-active:!cursor-grabbing [&>path]:!cursor-grab group-active:[&>path]:!cursor-grabbing" />
				</template>
			</UButton>
			<UButton @mousedown="
				editMovingController = true;
			editControllerEnd = true;
			" @mouseup="
				editMovingController = false;
			editControllerEnd = false;
			" variant="solid" size="md"
				class="bg-brown-0 group hover:bg-brown-0 active:bg-brown absolute -right-1 bottom-0 translate-x-full !cursor-grab active:!cursor-grabbing dark:bg-white/[0.1] dark:hover:bg-white/[0.2]">
				<template #leading>
					<ArrowBlockRightIcon
						class="text-white !cursor-grab group-active:!cursor-grabbing [&>path]:!cursor-grab group-active:[&>path]:!cursor-grabbing" />
				</template>
			</UButton>
		</div>

		<!-- edit event top tooltip -->
		<div v-if="props.edit || props.add"
			:style="{ left: `${editEvent.x1 + (editEvent.x2 - editEvent.x1) / 2 + 47}px` }"
			class="top-1 -translate-x-1/2 absolute rounded-lg bg-brown-0 px-2 py-1">
			<p class="text-xs text-white">{{ formatDuration(editEvent.duration, true) || '0h 0m' }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
// UTILS
import { getEventCodeText } from '~/utils/events';
import { contains, intersectsPos } from '~/utils/hos';

// ICONS
import ArrowBlockLeftIcon from '~/assets/icons/arrow-block-left.svg';
import ArrowBlockRightIcon from '~/assets/icons/arrow-block-right-2.svg';

// DAYJS
import dayjs, { Dayjs } from 'dayjs';

// STORES
import { useTimeZoneHelper } from '~/helpers/timezone';
import { useIndex } from '~/store';
import { useChart } from '~/store/chart';

// EMITS
const emits = defineEmits(['container:update', 'dutyEvent:update', 'selectedEvents', 'selectedEvent', 'updateReverseEvents']);

// PROPS
const props = defineProps({
	edit: {
		type: Boolean,
		default: false
	},
	add: {
		type: Boolean,
		default: false
	},
	eventId: {
		type: String
	},
	eventTime: {
		type: Dayjs
	},
	eventType: {
		type: [String, Number],
		default: '1'
	},
	eventCode: {
		type: [String, Number],
		default: '1'
	},
	chartData: {
		type: Object as () => GraphResponse,
		required: false
	},
	dailySummaries: {
		type: Object as () => DailyDictionarySummaryResponse,
		required: false
	},
	dailySummary: {
		type: Object as () => DailySummaryResponse,
		required: false
	},
	violations: {
		type: Array as () => ViolationPixelResponse[],
		required: false
	},
	// cycleViolations: {
	// 	type: Array as () => [number, number][],
	// 	required: false,
	// },
	// shiftViolations: {
	// 	type: Array as () => [number, number][],
	// 	required: false,
	// },
	allViolations: {
		type: Array as () => {
			stringType: string;
			violationBlocks: [number, number][];
		}[],
		required: false
	},
	x1: {
		type: [Number, String],
		required: false
	},
	x2: {
		type: [Number, String],
		required: false
	},
	freeTimes: {
		type: Array as () => BoostFreeTime[],
		required: false
	},
	ableToBoost: {
		type: Boolean,
		required: false,
		default: false
	},
	ableToSelect: {
		type: Boolean,
		required: false,
		default: false
	},
	loading: {
		type: Boolean,
		required: false,
		default: false
	}
});

const editEventType = computed(() => props.eventType);
const editEventCode = computed(() => props.eventCode);

// dark
const colorMode = useColorMode();
// route
const route = useRoute();

// CONSTANTAS
const secondInPixel = ref<number>(0);
const mainColor = computed(() => (colorMode.value === 'dark' ? '#7588BF' : '#465a95'));
const errorColor = '#AD1F38';
const editColor = '#56463D';

// chart
const chart = useChart();

// store to refs
const { sidebar } = storeToRefs(useIndex());
const { heightInPixel, topOffset, editHeightInPixel } = storeToRefs(useChart());

// properties of chart
const height = computed(() => ((props.edit || props.add) ? editHeightInPixel.value : heightInPixel.value));
const distance = computed(() => secondInPixel.value * 3600);

// duty times
const dutyTimes = computed(() => props.chartData ?? ({} as GraphResponse));
const dutyTimesCopy = ref<GraphResponse>(dutyTimes.value);
const dutyTimesCopyPrev = ref<GraphResponse>(dutyTimes.value);

// violations
const violations = computed(() => props?.violations ?? ([] as ViolationPixelResponse[]));

// const cycleViolations = computed(() => props.cycleViolations ?? ([] as [number, number][]));
// const shiftViolations = computed(() => props.shiftViolations ?? ([] as [number, number][]))

// free times
const freeTimes = computed(() => props.freeTimes);

// time zone
const { convertToTimeZone, getStartOf, acceptAsTimeZone, formatToUTC } = useTimeZoneHelper();

// current time composable
const timeCompose = useCurrentTime();

// current time
const currentTime = ref<Dayjs>(convertToTimeZone(timeCompose.currentTime.value));
watch(
	() => timeCompose.currentTime.value,
	() => {
		currentTime.value = convertToTimeZone(timeCompose.currentTime.value);
	}
);

// edit event time
const editEventTime = ref<Dayjs>(props.eventTime!);

// if edit is true, search for eventId
const editEvent = reactive({
	x1: parseInt(props.x1 as string) || 0,
	x2: parseInt(props.x2 as string) || 100,
	y1: 0,
	y2: 0,
	eventCode: (props.edit || props.add) ? parseInt(props.eventCode as string) : 0,
	eventType: (props.edit || props.add) ? parseInt(props.eventType as string) : 0,
	duration: 0,
	eventId: "edit_event_changing_id",
	eventTime: dayjs() as Dayjs,
	eventCodes: [] as number[],
});
const onceSetPrev = ref<boolean>(false);

// parentDiv
const parentDiv = ref<HTMLElement | undefined>();

const labelsForDutyHours = ref<HTMLElement | null>(null);
const separatorDayOrder = ref<number>(0);
const separatorDate = ref<Dayjs>(dayjs());

// daily summaries
const dailySummary = ref(
	(props.dailySummary as DailySummaryResponse) || (props.dailySummaries?.[formatTime(separatorDate.value, 'YYYY-MM-DDT00:00:00')] as DailySummaryResponse)
);

watch(() => [props.dailySummary, props.dailySummaries, separatorDate.value], () => {
	dailySummary.value = (props.dailySummary as DailySummaryResponse) || (props.dailySummaries?.[formatTime(separatorDate.value, 'YYYY-MM-DDT00:00:00')] as DailySummaryResponse);
});

const dynamicLine = ref({
	x1: 12000.000019221086,
	x2: 12000.000019221086,
	y1: topOffset.value,
	y2: topOffset.value * 4 + topOffset.value
});
const rectObj = ref({
	x: 0,
	y1: 0,
	y2: 0,
	width: 0,
	lineId: -1
});
const circleObj = ref({
	x: 0,
	y: 0
});
const isClickedBlock = ref<boolean>(false);
const isManualScroll = ref<boolean>(false);
const detailsToolTip = ref(0);
const lineToolTip = ref({
	duration: 100,
	status: 1,
	eventTime: dayjs(),
	currentTime: dayjs()
});

// dynamic moving lines
const isMovingDetailsVisible = ref<boolean>(false);
const editMovingController = ref<boolean>(false);
const editControllerStart = ref<boolean>(false);
const editControllerEnd = ref<boolean>(false);

const daySeparatorComponent = ref<DaySeparatorComponent | null>(null);
const svgContainer = ref<HTMLElement | any>(null);
const previousScrollLeft = ref<number>(0);
const mySvg = ref<any>(null);

// Vertical Position Based on Event Code
function verticalEventPosition(code: number) {
	switch (code) {
		case 0:
		case 1:
			return topOffset.value + height.value / 2;
		case 2:
			return topOffset.value + (height.value * 3) / 2;
		case 3:
			return topOffset.value + (height.value * 5) / 2;
		case 4:
			return topOffset.value + (height.value * 7) / 2;
		case 5:
			return topOffset.value + (height.value * 7) / 2;
		case 6:
			return topOffset.value + height.value / 2;
		default:
			return 1;
	}
}

function getFillColor(type: string) {
  switch (type) {
    case OfficialViolations.Cycle:
      return '#f77963';
    case OfficialViolations.Shift:
      return '#63b3f7';
    case OfficialViolations.Driving:
      return '#63f78c';
    case OfficialViolations.RestBreak:
      return '#f7e763';
    default:
      return '#cccccc';
  }
}
// tooltip
const lineToolTipDuration = computed(() => {
	const duration: number = lineToolTip.value.duration;
	const h: number = Math.floor(duration / 3600);
	const m: number = Math.floor((duration % 3600) / 60);
	const s: number = Math.floor((duration % 3600) % 60);
	return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
});

const lineToolTipStatus = computed(() => {
	switch (lineToolTip?.value.status) {
		case 1:
			return 'offduty';
		case 2:
			return 'sleeper';
		case 3:
			return 'driving';
		case 4:
			return 'onduty';
		case 5:
			return 'ym';
		case 6:
			return 'pc';
		default:
			return 'offduty';
	}
});

const dutyTimesXCoordinatesSorted = computed(() => {
	let arr: any = Object.values(dutyTimes.value?.duties).flat();
	arr.sort((a: HorizontalLine, b: HorizontalLine) => a.x1 != b.x1 ? a.x1 - b.x1 : a.x2 - b.x2);
	return arr;
});

const lineToolTipEventTime = computed(() => {
	return formatTime(lineToolTip.value.eventTime, 'MMM DD, hh:mm:ss A');
});

const lineToolTipCurrentTime = computed(() => {
	return formatTime(lineToolTip.value.currentTime, 'MMM DD, hh:mm:ss A');
});

function changeBlockBackground() {
	// Circle x coordinate handling
	circleObj.value.x = dynamicLine.value.x1;

	let l: number = 0,
		r: number = dutyTimesXCoordinatesSorted.value.length - 1,
		mid: number;

	// Binary search to find the segment containing the dynamicLine
	while (l <= r) {
		mid = Math.floor((l + r) / 2);
		const segment = dutyTimesXCoordinatesSorted.value[mid];

		if (dynamicLine.value.x1 >= segment.x1 && dynamicLine.value.x1 <= segment.x2) {
			// We've found the correct segment
			rectObj.value.x = segment.x1;
			rectObj.value.width = segment.x2 - segment.x1;
			rectObj.value.y1 = segment.y1;
			rectObj.value.y2 = segment.y2;

			if (isClickedBlock.value) {
				if (rectObj.value.lineId !== segment.eventId) {
					rectObj.value.lineId = segment.eventId;
				}
			}

			circleObj.value.y = verticalEventPosition(segment?.eventCode);

			lineToolTip.value.status = segment?.eventCode ?? 1;
			lineToolTip.value.duration = segment?.duration ?? 100;
			lineToolTip.value.eventTime = dayjs(segment?.eventTime) ?? dayjs();
			lineToolTip.value.currentTime = dayjs(segment?.eventTime).add(((dynamicLine.value.x1 - segment.x1) / secondInPixel.value) * 1000, 'milliseconds');
			return segment;
		} else if (dynamicLine.value.x1 < segment.x1) {
			r = mid - 1;
		} else {
			l = mid + 1;
		}
	}

	const lastDutyTime = dutyTimesXCoordinatesSorted.value.at(-1)?.eventTime;
	const lastX1 = dutyTimesXCoordinatesSorted.value.at(-1)?.x1;

	lineToolTip.value.currentTime = lastDutyTime ? dayjs(lastDutyTime).add((1000 * (dynamicLine.value.x1 - lastX1)) / secondInPixel.value, 'milliseconds') : dayjs();

	rectObj.value = { x: 0, width: 0, y1: 0, y2: 0, lineId: -1 };
	return null;
}

watch(
	() => dutyTimes.value,
	() => {
		if (dutyTimes?.value) {
			hosScrollHandling();
		}

		dutyTimesCopy.value = dutyTimes.value;
		dutyTimesCopyPrev.value = dutyTimes.value;

		if (props.edit || props.add) {
			const dutyEvent = dutyTimes.value.duties![editEventCode.value as keyof typeof dutyTimes.value.duties]?.find((event: GraphDuties) => event.eventId === props.eventId);
			editEvent.x1 = dutyEvent?.x1 || 1;
			editEvent.x2 = dutyEvent?.x2 || 3;
			editEvent.duration = dutyEvent?.duration || 0;

			// console.log("edit event has been changed under watch", editEvent);
			emits('dutyEvent:update', editEvent);
		}

		separatorDayOrder.value = dutyTimes.value?.dayNames.length ?? 0;
	}
);

const hosScrollHandling = () => {
	const labelsForDutyHoursEl = labelsForDutyHours.value;
	const separatorComponent = daySeparatorComponent.value;

	if (separatorComponent && separatorComponent.separatorRefs.length && labelsForDutyHoursEl) {
		const observer = new IntersectionObserver(handleIntersection, {
			root: null,
			rootMargin: '0px', // No margin adjustment
			threshold: 1.0
		});

		separatorComponent.separatorRefs.forEach((separator) => {
			observer.observe(separator);
		});

		if (labelsForDutyHoursEl instanceof HTMLElement) {
			observer.observe(labelsForDutyHoursEl);
		}
	}
};

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
	entries.forEach((entry: IntersectionObserverEntry) => {
		if (entry.isIntersecting && entry.intersectionRatio === 1) {
			const dataKey = entry.target.getAttribute('data-key');
			console.log(`Intersection detected between vertical separator and labels.${dataKey}`);
		}
	});
};

const drivingMouse = (event: MouseEvent) => {
	console.log('im here baby');
	console.log('im here baby');
};

// selected events
const selectedEvents = ref<GraphDuties[]>([]);
const selectedEvent = ref<GraphDuties | null>();

const handleBlockClick = (event: MouseEvent) => {
	let result = onMouseMove(event);
	console.log("clicked rect event", result);
	if (!props.ableToSelect) {
		if (result) {
			emits('selectedEvent', result, true);
		}
	}
	console.log('EventId', result.eventId);
	console.log('eventTime', result.eventTime);
	if (props.ableToBoost) {
		if (result && !selectedEvents.value.some((event) => event.eventId === result.eventId)) {
			selectedEvents.value.push(result);
			if (selectedEvents.value.length > 2) selectedEvents.value.shift();
		} else if (selectedEvents.value.some((event) => event.eventId === result.eventId)) {
			selectedEvents.value = selectedEvents.value.filter((event) => event.eventId !== result.eventId);
		}

		let min = Math.min(...selectedEvents.value.map((event) => event.x1));
		let max = Math.max(...selectedEvents.value.map((event) => event.x1));

		console.log(selectedEvents.value, selectedEvents.value.length >= 2 && selectedEvents.value[0].eventTime.localeCompare(selectedEvents.value[1].eventTime) >= 1);
		// if (selectedEvents.value.length <= 1 || +new Date(selectedEvents.value[0].eventTime) <= +new Date(selectedEvents.value[1].eventTime)) {
		if (selectedEvents.value.length <= 1 || selectedEvents.value[0].eventTime.localeCompare(selectedEvents.value[1].eventTime) <= -1) {
			emits('updateReverseEvents', false);
		} else if (selectedEvents.value.length >= 2) {
			emits('updateReverseEvents', true);
		}

		let twoEvents = dutyTimesXCoordinatesSorted.value.filter((event: GraphDuties) => min <= event.x1 && max >= event.x1);
		if (twoEvents.length > 1) twoEvents = [twoEvents[0], twoEvents.at(-1)];
		else if (twoEvents.length > 0) twoEvents = [twoEvents[0]];

		const selectedMoveEvensDurations = []; 
		const nextEventAfterFirstEvent = dutyTimesXCoordinatesSorted.value.find((event: GraphDuties) => event.x1 > twoEvents[0].x1);	
		selectedMoveEvensDurations.push(Math.abs(dayjs(nextEventAfterFirstEvent.eventTime)!.diff(dayjs(twoEvents[0].eventTime))) / 1000);		

		if (twoEvents.length > 1) {
			const nextEventAfterSecondEvent = dutyTimesXCoordinatesSorted.value.find((event: GraphDuties) => event.x1 > twoEvents[1].x1);
			selectedMoveEvensDurations.push(Math.abs(dayjs(nextEventAfterSecondEvent.eventTime)!.diff(dayjs(twoEvents[1].eventTime))) / 1000);
		}

		emits(
			'selectedEvents',
			twoEvents,
			selectedMoveEvensDurations,
		);
	}

	if (props.ableToSelect) {
		if (result && (!selectedEvent.value || selectedEvent.value.eventId !== result.eventId)) {
			selectedEvent.value = result;
		} else if (selectedEvent.value && selectedEvent.value.eventId === result.eventId) {
			selectedEvent.value = null;
		}

		emits(
			'selectedEvent',
			selectedEvent.value,
			true
		);
	}
};

const handleMouseDown = (event: MouseEvent) => {
	if (event.button === 2 && !props.ableToSelect) {
		let result = onMouseMove(event);
		if (result) {
			emits('selectedEvent', result);
		}
	} else if (event.button === 1 && props.ableToSelect) {
		handleBlockClick(event);
	}
}

const clearSelectedEvents = () => {
	selectedEvents.value = [];
}

const clearSelectedEvent = () => {
	selectedEvent.value = null;
}

// dynamic moving lines handle func
const onMouseMove = (event: MouseEvent) => {
	if (!mySvg.value) return;
	const svg: any = mySvg.value;
	const point = svg?.createSVGPoint();
	point.x = event?.clientX;
	point.y = event?.clientY;
	const cursorPoint = point?.matrixTransform(svg?.getScreenCTM().inverse());

	dynamicLine.value.x1 = cursorPoint.x;
	dynamicLine.value.x2 = cursorPoint.x;
	dynamicLine.value.y1 = cursorPoint.y;
	dynamicLine.value.y2 = cursorPoint.y;

	detailsToolTip.value = event.clientX - (sidebar.value === 'open' ? 274 : 104);
	return changeBlockBackground();
};

let prevX1 = ref<number>(editEvent.x1);
let prevX2 = ref<number>(editEvent.x2);

const onEditMouseMove = (event: MouseEvent | string | number, isLeft: boolean = false) => {
	// console.log("edit mouse move");
	// console.log("event", event);
	// console.log("props", props);
	// console.log("dutyTimes", dutyTimes);
	// console.log("edit moving controller", editMovingController.value);

	if ((!props.edit && !props.add) || !dutyTimes.value || !dutyTimes.value.duties) return;
	const originDutyEvent: any = props.edit ? deepClone(
		Object.values(dutyTimes.value.duties)
			.flat()
			.find((duty: any) => duty.eventId === props.eventId)
	) : { x1: 0, x2: distance.value };

	if (editMovingController.value) {
		console.log("mouse is moving and event is", event);
		if (typeof event !== 'number' && typeof event !== 'string') {
			let relativeX = event.pageX - svgContainer.value?.getBoundingClientRect()?.left;

			if (editControllerStart.value) editEvent.x1 = relativeX > -20 ? relativeX + 20 : 0;
			if (editControllerEnd.value) editEvent.x2 = relativeX - 20 < dutyTimes.value.svgWidth ? Math.max(relativeX - 20, 0) : dutyTimes.value.svgWidth;
			if (editEvent.x1 > editEvent.x2) editEvent.x1 = Math.max(editEvent.x2 - 2, 0);

		} else {
			// In this case we are passing event as date, so we need to convert it to pixel via screenResolution
			event = convertDateToPixel(svgContainer.value.clientWidth, event as string) as number;

			if (isLeft && +event <= editEvent.x2 && intersectsPos(+event, editEvent.x2, originDutyEvent.x1, originDutyEvent.x2) != -1) {
				editEvent.x1 = +event;
			} else if (editEvent.x1 <= +event && intersectsPos(editEvent.x1, +event, originDutyEvent.x1, originDutyEvent.x2) != -1) {
				editEvent.x2 = +event;
			}
		}

		// nextTick();
		changeEditHos();
	} else if (typeof event === 'number' || typeof event === 'string') {
		// In this case we are passing event as date, so we need to convert it to pixel via screenResolution
		event = convertDateToPixel(svgContainer.value.clientWidth, event as string) as number;

		// if (isLeft && +event <= editEvent.x2 && intersectsPos(+event, editEvent.x2, originDutyEvent.x1, originDutyEvent.x2) != -1) {
		// 	editEvent.x1 = +event;
		// } else if (editEvent.x1 <= +event && intersectsPos(editEvent.x1, +event, originDutyEvent.x1, originDutyEvent.x2) != -1) {
		// 	editEvent.x2 = +event;
		// }
		if (isLeft) {
			editEvent.x1 = +event;
		} else {
			editEvent.x2 = +event;
		}
		if (editEvent.x1 > editEvent.x2) editEvent.x1 = Math.max(editEvent.x2 - 2, 0);

		// nextTick();
		changeEditHos();
	}
};

// checking converted event time by endX pixels to date does exceed over given 'time' dayjs
const doesExceed = (endX: number, time: Dayjs) => {
	const seconds = convertPixelstoSeconds(svgContainer.value.clientWidth, endX);
	const convertedTime = getStartOf(editEventTime.value).add(seconds, 'seconds');
	// console.log('end time and current time', convertedTime.format(), time.format());
	// if (convertedTime.get('date') < time.get('date')) {
	// 	return false;
	// } else if (convertedTime.get('date') > time.get('date')) {
	// 	console.log('exceeds because greater than today');
	// 	return true;
	// } else if (convertedTime.diff(time) > 0) {
	// 	console.log('exceeds because greater than today');
	// 	return true;
	// }
	const exceeds = convertedTime.isAfter(time);

	if (exceeds) {
		console.log('Exceeds the reference time');
	}

	return exceeds;
};

const changeEditHos = () => {
	// Not found compatible event with given id
	if (
		props.edit &&
		((editEvent.x1 === 1 && editEvent.x2 === 3) ||
			!Object.values(dutyTimes.value.duties).flat().find((duty: any) => duty.eventId === props.eventId))
	) {
		console.error("Broken because edit event id has not been found");
		return;
	}

	// compatible event by id
	const originDutyEvent: any = props.edit ?
		deepClone(
			Object.values(dutyTimesCopyPrev.value.duties)
				.flat()
				.find((duty: any) => duty.eventId === props.eventId)
		) : editEvent;

	// previous origin duty event before compatible event
	let prevOriginDutyEvent: any = Object.values(dutyTimesCopyPrev.value.duties)
		.flat()
		.filter((duty: any) => duty.x2 >= originDutyEvent.x1)
		.reduce((acc: any, duty: any) => acc === null || duty.x2 < acc.x2 ? duty : acc, null);

	if (prevOriginDutyEvent) {
		prevOriginDutyEvent = deepClone(prevOriginDutyEvent);
	}

	// next origin duty event before compatible event
	let nextOriginDutyEvent: any = Object.values(dutyTimesCopyPrev.value.duties)
		.flat()
		.filter((duty: any) => duty.x1 <= originDutyEvent.x2)
		.reduce((acc: any, duty: any) => acc === null || duty.x1 > acc.x1 ? duty : acc, null);

	if (nextOriginDutyEvent) {
		nextOriginDutyEvent = deepClone(nextOriginDutyEvent);
	}

	// edit ending range cannot be higher than driving bound because in case
	// when this is high than driving range it can affect driving range
	const drivingDuty = '3';
	let drivingMinBoundX = firstFoundEventAfterPos(originDutyEvent.x2, dutyTimes.value, drivingDuty);
	let drivingMaxBoundX = lastFoundEventBeforePos(originDutyEvent.x1, dutyTimes.value, drivingDuty);

	// edit event should be intersecting with editing origin event
	// should not affect driving events also
	// should not exceed over current time
	// if moving event bound is no intersecting 
	//	 with original its event if editing mode
	//   or previous or next event is driving set its original x1 and x2 
	if (
		// props.edit && intersectsPos(editEvent.x1, editEvent.x2, originDutyEvent.x1, originDutyEvent.x2) === -1 ||
		(drivingMinBoundX && editEvent.x2 > drivingMinBoundX) ||
		(drivingMaxBoundX && editEvent.x1 < drivingMaxBoundX) ||
		doesExceed(editEvent.x2, currentTime.value)
	) {
		if (!onceSetPrev.value) {
			editEvent.x1 = originDutyEvent.x1;
			editEvent.x2 = originDutyEvent.x2;
		} else {
			editEvent.x1 = prevX1.value;
			editEvent.x2 = prevX2.value;
		}
		emits('dutyEvent:update', editEvent);
		return;
	}
	onceSetPrev.value = true;
	prevX1.value = editEvent.x1;
	prevX2.value = editEvent.x2;

	console.log("edit event", editEvent);

	if (prevOriginDutyEvent) {
		editEvent.eventTime = acceptAsTimeZone(prevOriginDutyEvent.eventTime).add(
			convertPixelstoSeconds(
				svgContainer.value.clientWidth,
				editEvent.x1 - prevOriginDutyEvent.x1
			),
			'seconds'
		);
	} else if (nextOriginDutyEvent) {
		editEvent.eventTime = acceptAsTimeZone(prevOriginDutyEvent.eventTime).add(
			convertPixelstoSeconds(
				svgContainer.value.clientWidth,
				nextOriginDutyEvent.x1 - editEvent.x1
			),
			'seconds'
		);
	}

	editEvent.duration = (3600 * (editEvent.x2 - editEvent.x1)) / distance.value;

	// freeing up dutyTimeCopy because after processing all events we push all of them to this object arrays
	dutyTimesCopy.value = deepClone(dutyTimesCopyPrev.value);
	for (let i = 1; i <= 6; i++) {
		dutyTimesCopy.value.duties[String(i) as keyof typeof dutyTimesCopy.value.duties] = [];
	}
	dutyTimesCopy.value.verticalLines = [];

	for (const i in dutyTimesCopyPrev.value.duties) {
		for (const duty of dutyTimesCopyPrev.value.duties[i as keyof typeof dutyTimesCopyPrev.value.duties]) {
			const dutyEvent = deepClone(duty);
			// current event
			if (dutyEvent.eventId === props.eventId) {
				dutyEvent.x1 = editEvent.x1;
				dutyEvent.x2 = editEvent.x2;
				dutyEvent.eventType = editEvent.eventType;
				dutyEvent.eventCode = editEvent.eventCode;

				const mappedDuty = getDutyOrder(editEvent.eventType, editEvent.eventCode);
				if (!dutyTimesCopy.value.duties[`${mappedDuty}` as keyof typeof dutyTimesCopy.value.duties]) {
					dutyTimesCopy.value.duties[`${mappedDuty}` as keyof typeof dutyTimesCopy.value.duties] = [];
				}
				dutyTimesCopy.value.duties[`${mappedDuty}` as keyof typeof dutyTimesCopy.value.duties].push(dutyEvent);
				continue;
			}

			// iterating event range is covering editing event range
			// in this case we part this event into two events:
			// first - before the editing event
			// second - after the editing event
			let covering: boolean = contains(dutyEvent.x1, dutyEvent.x2, editEvent.x1, editEvent.x2);
			if (covering && props.add) {
				console.log("Iterating graph event is covering edit event");
				const newDutyEvent = deepClone(dutyEvent);
				const mappedDuty = getDutyOrder(newDutyEvent.eventType, newDutyEvent.eventCode);
				dutyEvent.x2 = editEvent.x1;
				dutyTimesCopy.value.duties[`${mappedDuty}` as keyof typeof dutyTimesCopy.value.duties].push(dutyEvent);

				newDutyEvent.x1 = editEvent.x2;
				dutyTimesCopy.value.duties[`${mappedDuty}` as keyof typeof dutyTimesCopy.value.duties].push(newDutyEvent);
				continue;
			}

			// previous event
			if (prevOriginDutyEvent && dutyEvent.eventId === prevOriginDutyEvent.eventId && !contains(editEvent.x1, editEvent.x2, prevOriginDutyEvent.x1, prevOriginDutyEvent.x2)) {
				dutyEvent.x2 = editEvent.x1;
				dutyTimesCopy.value.duties[i as keyof typeof dutyTimesCopy.value.duties].push(dutyEvent);
				continue;
			}

			// next event
			if (nextOriginDutyEvent && dutyEvent.eventId === nextOriginDutyEvent.eventId && !contains(editEvent.x1, editEvent.x2, nextOriginDutyEvent.x1, nextOriginDutyEvent.x2)) {
				dutyEvent.x1 = editEvent.x2;
				dutyTimesCopy.value.duties[i as keyof typeof dutyTimesCopy.value.duties].push(dutyEvent);
				continue;
			}

			// iterating event range is between editing event range
			let doesContain: boolean = contains(editEvent.x1, editEvent.x2, dutyEvent.x1, dutyEvent.x2);
			if (doesContain) {
				continue;
			}

			// intersecting position between edit event and iterating event
			// if iterating event is came before than edit event -> pos 1
			// else edit event is came before iterating event -> pos 2
			// else they are not intersecting with each other -> pos -1
			let intersectPos: number = intersectsPos(editEvent.x1, editEvent.x2, dutyEvent.x1, dutyEvent.x2);
			console.log("intersect pos", intersectPos);
			if (intersectPos === 1) {
				dutyEvent.x2 = editEvent.x1;
			} else if (intersectPos === 2) {
				dutyEvent.x1 = editEvent.x2;
			}
			dutyTimesCopy.value.duties[i as keyof typeof dutyTimesCopy.value.duties].push(dutyEvent);
		}
	}

	// Vertical lines should not been inside edit event block
	// Vertical line which belongs to edit event original should not be added to vertical lines
	for (const verticalItem of dutyTimes.value.verticalLines) {
		const verticalLine = deepClone(verticalItem);
		if (contains(editEvent.x1, editEvent.x2, verticalLine.x1, verticalLine.x2) 
			|| intersectsPos(originDutyEvent.x1, originDutyEvent.x2, verticalLine.x1, verticalLine.x2) != -1) {
			continue;
		}
		dutyTimesCopy.value.verticalLines.push(verticalLine);
	}

	// add new event to duty times because this graph segment does not exists till now
	if (props.add) {
		const mappedDuty = getDutyOrder(editEvent.eventType, editEvent.eventCode);
		dutyTimesCopy.value.duties[`${mappedDuty}` as keyof typeof dutyTimesCopy.value.duties].push(editEvent);
	}

	dutyTimesCopyPrev.value = deepClone(dutyTimesCopy.value);

	emits('dutyEvent:update', editEvent);
	updateDailySummary();
};

// Update daily summary when edit graph changed
const updateDailySummary = () => {
	const editEventDutyText = getEventCodeText(getDutyOrder(editEvent.eventType, editEvent.eventCode));
	const keys: (keyof DailySummaryResponse)[] = [
		'dailyOffDuty',
		'dailySleeperBerth',
		'dailyDriving',
		'dailyOnDuty'
	];

	for (const key of keys) {
		if (key.startsWith('daily')) {
			// @ts-ignore
			dailySummary.value[key] = 0;
		}
	}

	const editKeyText: string = 'daily' + editEventDutyText;
	// @ts-ignore
	dailySummary.value[editKeyText] = convertPixelstoSeconds(svgContainer.value.clientWidth, editEvent.x2 - editEvent.x1) as Number;

	for (const i in dutyTimesCopy.value.duties) {
		for (const duty of dutyTimesCopy.value.duties[i as keyof typeof dutyTimesCopy.value.duties]) {
			const eventDutyText = 'daily' + getEventCodeText(getDutyOrder(duty.eventType, duty.eventCode));
			if (editKeyText === eventDutyText) {
				if (editEvent.eventType !== duty.eventType) {
					// @ts-ignore
					dailySummary.value[eventDutyText] += convertPixelstoSeconds(svgContainer.value.clientWidth, duty.x2 - duty.x1);
				}
			} else {
				// @ts-ignore
				dailySummary.value[eventDutyText] += convertPixelstoSeconds(svgContainer.value.clientWidth, duty.x2 - duty.x1);
			}
		}
	}
};

const editControllerReleased = (event: any) => {
	event.target.style.cursor = 'default';
	editControllerStart.value = false;
	editControllerEnd.value = false;
};

const getTextWidthApprox = (text: string, fontSize: number = 16) => {
	const averageCharWidth = 0.6 * fontSize; // Assume each character is 0.6 times the font size
	return text.length * averageCharWidth;
};

const canBeDisplayed = (x1: number, x2: number, duration: number): boolean => {
	if (duration <= 60 * 30) {
		return false;
	}
	const content = formatDuration(duration);
	const contentWidth = getTextWidthApprox(content.toString(), (props.edit || props.add) ? 12 : 14);
	return x2 - x1 - contentWidth >= 6;
};

const scrollToSegment = () => {
	if (!rectObj.value.lineId) {
		console.error('lineId is undefined or invalid:', rectObj.value.lineId);
		return Promise.reject('lineId is undefined or invalid');
	}
	for (let i = 0; i < dutyTimesXCoordinatesSorted.value.length; i++) {
		const segment = dutyTimesXCoordinatesSorted.value[i];
		console.log(segment, 'segment')
		if (segment.eventId === rectObj.value.lineId) {
			if (typeof segment.x1 !== 'number' || typeof segment.x2 !== 'number' || segment.x2 <= segment.x1) {
				console.error('Invalid segment dimensions:', segment);
				continue;
			}

			rectObj.value = {
				...rectObj.value,
				x: segment.x1,
				width: segment.x2 - segment.x1,
				y1: segment.y1,
				y2: segment.y2
			};

			if (svgContainer?.value) {
				const scrollTarget = segment.x1 - mySvg.value?.clientWidth + distance.value * 24 - svgContainer.value.clientWidth / 2 + (segment.x2 - segment.x1) / 2;
				return new Promise((resolve, reject) => {
					const onScroll = () => {
						// Check if the scroll position is approximately equal to the target
						const scrollLeft = svgContainer.value.scrollLeft;
						if (Math.abs(scrollLeft - scrollTarget) < 1) {
							svgContainer.value.removeEventListener('scroll', onScroll);
							resolve(undefined); // Resolve the promise
						}
					};

					svgContainer.value.addEventListener('scroll', onScroll);

					// Perform the scroll
					svgContainer.value.scroll({
						left: scrollTarget,
						top: 0,
						behavior: 'smooth'
					});
				});
			} else {
				console.warn('svgContainer is not defined or invalid.');
				return Promise.reject('svgContainer is not defined or invalid.');
			}
		}
	}

	return Promise.reject('No matching segment found.');
};

const handleSelectedLineId = async (newLineId: number) => {
	console.log(newLineId)
	rectObj.value.lineId = newLineId;
	svgContainer.value.removeEventListener('scroll', svgScrollHorizontalWithScroll);
	await scrollToSegment();
	svgContainer.value.addEventListener('scroll', svgScrollHorizontalWithScroll);
};

watch(
	() => isMovingDetailsVisible.value,
	(newValue: boolean) => {
		if (!newValue) {
			rectObj.value.x = 0;
			rectObj.value.width = 0;
			rectObj.value.y1 = 0;
			rectObj.value.y2 = 0;
		}
	}
);



// watch(svgContainer, (newValue, oldValue) => {
// 	if (newValue) {
// 		newValue.addEventListener('wheel', svgScrollHorizontallyWithMouseWheel);
// 		newValue.addEventListener('scroll', svgScrollHorizontalWithScroll);
// 	}

// 	if (oldValue) {
// 		oldValue.removeEventListener('wheel', svgScrollHorizontallyWithMouseWheel);
// 		oldValue.removeEventListener('scroll', svgScrollHorizontalWithScroll);
// 	}
// });

// const svgScrollHorizontallyWithMouseWheel = (event: any) => {
// 	event.preventDefault();

// 	if (svgContainer.value) {
// 		svgContainer.value.scrollLeft += Number(event.deltaY);
// 		previousScrollLeft.value = mySvg.value.clientWidth + svgContainer.value.scrollLeft - svgContainer.value.clientWidth;
// 	}
// 	isMovingDetailsVisible.value = false;
// 	separatorDayOrder.value = Math.floor((previousScrollLeft.value + svgContainer?.value.clientWidth * 0.8) / 24 / distance.value);
// 	if (route.query?.fromDate) {
// 		separatorDate.value = acceptAsTimeZone(route.query.fromDate as string).add(separatorDayOrder.value, 'day');
// 	}
// 	nextTick(() => {
// 		isMovingDetailsVisible.value = true;
// 	});
// };

// function svgScrollHorizontalWithScroll(event: any) {
// 	if (isManualScroll.value) {
// 		return;
// 	}
// 	if (svgContainer.value) {
// 		svgContainer.value.scrollLeft = event.target.scrollLeft;
// 		previousScrollLeft.value = mySvg.value.clientWidth + svgContainer.value.scrollLeft - svgContainer.value.clientWidth;
// 	}
// 	isMovingDetailsVisible.value = false;
// 	separatorDayOrder.value = Math.floor((previousScrollLeft.value + svgContainer?.value.clientWidth * 0.8) / 24 / distance.value);
// 	if (route.query?.fromDate) {
// 		separatorDate.value = acceptAsTimeZone(route.query.fromDate as string).add(separatorDayOrder.value, 'day');
// 	}
// 	nextTick(() => {
// 		isMovingDetailsVisible.value = true;
// 	});
// }


const svgScrollHorizontallyWithMouseWheel = (event: WheelEvent) => {
	event.preventDefault();

	if (svgContainer.value) {
		const isRTL = getComputedStyle(svgContainer.value).direction === 'rtl';
		const deltaX = (event.deltaX || (isRTL ? -event.deltaY : event.deltaY)) * 1.5; // Gorizontal harakat
		const deltaY = event.deltaY * 1.5; // Vertikal harakat

		// Gorizontal scroll
		if (Math.abs(deltaX) > 0) {
			svgContainer.value.scrollLeft += isRTL ? -deltaX : deltaX;
			previousScrollLeft.value = mySvg.value.clientWidth + svgContainer.value.scrollLeft - svgContainer.value.clientWidth;
		}

		// Vertikal scroll
		if (Math.abs(deltaY) > 0) {
			svgContainer.value.scrollTop += deltaY; // Vertikal harakatni qo'llab-quvvatlash
			// console.log('ScrollTop:', svgContainer.value.scrollTop, 'DeltaY:', deltaY); // Debugging uchun
		}

		isMovingDetailsVisible.value = false;
		separatorDayOrder.value = Math.floor((previousScrollLeft.value + svgContainer?.value.clientWidth * 0.8) / 24 / distance.value);
		if (route.query?.fromDate) {
			separatorDate.value = acceptAsTimeZone(route.query.fromDate as string).add(separatorDayOrder.value, 'day');
		}
		nextTick(() => {
			isMovingDetailsVisible.value = true;
		});
	}
};

function svgScrollHorizontalWithScroll(event: any) {
	if (isManualScroll.value) {
		return;
	}
	if (svgContainer.value) {
		svgContainer.value.scrollLeft = event.target.scrollLeft;
		previousScrollLeft.value = mySvg.value.clientWidth + svgContainer.value.scrollLeft - svgContainer.value.clientWidth;
	}
	isMovingDetailsVisible.value = false;
	separatorDayOrder.value = Math.floor((previousScrollLeft.value + svgContainer?.value.clientWidth * 0.8) / 24 / distance.value);
	if (route.query?.fromDate) {
		separatorDate.value = acceptAsTimeZone(route.query.fromDate as string).add(separatorDayOrder.value, 'day');
	}
	nextTick(() => {
		isMovingDetailsVisible.value = true;
	});
}

watch(svgContainer, (newValue, oldValue) => {
	if (newValue) {
		newValue.addEventListener('wheel', svgScrollHorizontallyWithMouseWheel);
		newValue.addEventListener('scroll', svgScrollHorizontalWithScroll);
	}

	if (oldValue) {
		oldValue.removeEventListener('wheel', svgScrollHorizontallyWithMouseWheel);
		oldValue.removeEventListener('scroll', svgScrollHorizontalWithScroll);
	}
});

watch(sidebar, async () => {
	setTimeout(() => {
		secondInPixel.value = svgContainer.value?.clientWidth / (24 * 3600);
		emits('container:update', svgContainer.value.clientWidth);
	}, 300);
});

watch(
	() => svgContainer.value,
	async (newValue: HTMLElement) => {
		secondInPixel.value = newValue.clientWidth / (24 * 3600);
		emits('container:update', newValue.clientWidth);
	}
);

watch(
	() => [props.x1, props.x2],
	([x1, x2]) => {
		editEvent.x1 = x1 !== undefined ? parseInt(x1.toString()) : 0;
		editEvent.x2 = x2 !== undefined ? parseInt(x2.toString()) : 0;
		editEvent.duration = (3600 * (editEvent.x2 - editEvent.x1)) / distance.value;
	}
);

watch(
	() => [props.eventType, props.eventCode],
	() => {
		// console.log("event type changed", props.eventType, props.eventCode);
		if (!dutyTimesCopy.value?.duties) return;
		editEvent.eventType = (props.edit || props.add) ? parseInt(editEventType.value as string) : 0;
		editEvent.eventCode = (props.edit || props.add) ? parseInt(editEventCode.value as string) : 0;
		changeEditHos();
	}
	// 	// Not found compatible event with given id
	// 	if (props.edit && 
	// 		(editEvent.x1 === 1 && editEvent.x2 === 3) ||
	// 		!Object.values(dutyTimes.value.duties)
	// 			.flat()
	// 			.find((duty: any) => duty.eventId === props.eventId)
	// 	) {
	// 		return;
	// 	}

	// 	// compatible event by id
	// 	const originDutyEvent: any = props.edit ? 
	// 		deepClone(
	// 			Object.values(dutyTimes.value.duties)
	// 				.flat()
	// 				.find((duty: any) => duty.eventId === props.eventId)
	// 		) : {x1: 0, x2: distance.value};

	// 	// previous origin duty event before compatible event
	// 	let prevOriginDutyEvent: any = Object.values(dutyTimes.value.duties)
	// 		.flat()
	// 		.find((duty: any) => duty.x2 === originDutyEvent.x1);
	// 	if (prevOriginDutyEvent) {
	// 		prevOriginDutyEvent = deepClone(prevOriginDutyEvent);
	// 	}

	// 	// next origin duty event before compatible event
	// 	let nextOriginDutyEvent: any = Object.values(dutyTimes.value.duties)
	// 		.flat()
	// 		.find((duty: any) => duty.x1 === originDutyEvent.x2);
	// 	if (nextOriginDutyEvent) {
	// 		nextOriginDutyEvent = deepClone(nextOriginDutyEvent);
	// 	}

	// 	// freeing up dutyTimeCopy because after processing all events we push all of them to this object arrays
	// 	dutyTimesCopy.value = deepClone(dutyTimes.value);
	// 	for (const i in dutyTimesCopy.value.duties) {
	// 		dutyTimesCopy.value.duties[i as keyof typeof dutyTimesCopy.value.duties] = [];
	// 	}
	// 	dutyTimesCopy.value.verticalLines = [];

	// 	for (const i in dutyTimes.value.duties) {
	// 		for (const duty of dutyTimes.value.duties[i as keyof typeof dutyTimesCopy.value.duties]) {
	// 			const dutyEvent = deepClone(duty);

	// 			// current event
	// 			if (dutyEvent.eventId === props.eventId) {
	// 				dutyEvent.x1 = editEvent.x1;
	// 				dutyEvent.x2 = editEvent.x2;
	// 				dutyEvent.eventType = editEvent.eventType;
	// 				dutyEvent.eventCode = editEvent.eventCode;

	// 				const mappedDuty = getDutyOrder(editEvent.eventType, editEvent.eventCode);
	// 				if (!dutyTimesCopy.value.duties[`${mappedDuty}` as keyof typeof dutyTimesCopy.value.duties]) {
	// 					dutyTimesCopy.value.duties[`${mappedDuty}` as keyof typeof dutyTimesCopy.value.duties] = [];
	// 				}
	// 				dutyTimesCopy.value.duties[`${mappedDuty}` as keyof typeof dutyTimesCopy.value.duties].push(dutyEvent);

	// 				continue;
	// 			}

	// 			// previous event
	// 			if (prevOriginDutyEvent && dutyEvent.eventId === prevOriginDutyEvent.eventId && !contains(editEvent.x1, editEvent.x2, prevOriginDutyEvent.x1, prevOriginDutyEvent.x2)) {
	// 				dutyEvent.x2 = editEvent.x1;
	// 				dutyTimesCopy.value.duties[i as keyof typeof dutyTimesCopy.value.duties].push(dutyEvent);

	// 				continue;
	// 			}

	// 			// next event
	// 			if (nextOriginDutyEvent && dutyEvent.eventId === nextOriginDutyEvent.eventId && !contains(editEvent.x1, editEvent.x2, nextOriginDutyEvent.x1, nextOriginDutyEvent.x2)) {
	// 				dutyEvent.x1 = editEvent.x2;
	// 				dutyTimesCopy.value.duties[i as keyof typeof dutyTimesCopy.value.duties].push(dutyEvent);

	// 				continue;
	// 			}

	// 			// iterating event range is between editing event range
	// 			let doesContain: boolean = contains(editEvent.x1, editEvent.x2, dutyEvent.x1, dutyEvent.x2);
	// 			if (doesContain) {
	// 				continue;
	// 			}

	// 			// intersecting position between edit event and iterating event
	// 			// if iterating event is came before than edit event -> pos 1
	// 			// else edit event is came before iterating event -> pos 2
	// 			// else they are not intersecting with each other -> pos -1
	// 			let intersectPos: number = intersectsPos(editEvent.x1, editEvent.x2, dutyEvent.x1, dutyEvent.x2);
	// 			if (intersectPos === 1) {
	// 				dutyEvent.x2 = editEvent.x1;
	// 			} else if (intersectPos === 2) {
	// 				dutyEvent.x1 = editEvent.x2;
	// 			}
	// 			dutyTimesCopy.value.duties[i as keyof typeof dutyTimesCopy.value.duties].push(dutyEvent);
	// 		}
	// 	}

	// 	// Vertical lines should not been inside edit event block
	// 	for (const verticalItem of dutyTimes.value.verticalLines) {
	// 		const verticalLine = deepClone(verticalItem);
	// 		if (
	// 			contains(editEvent.x1, editEvent.x2, verticalLine.x1, verticalLine.x2) ||
	// 			intersectsPos(originDutyEvent.x1, originDutyEvent.x2, verticalLine.x1, verticalLine.x2) !== -1
	// 		) {
	// 			continue;
	// 		}
	// 		dutyTimesCopy.value.verticalLines.push(verticalLine);
	// 	}

	// 	emits('dutyEvent:update', editEvent);

	// 	updateDailySummary();
	// }
);

defineExpose({
	secondInPixel,
	onEditMouseMove,
	handleSelectedLineId,
	clearSelectedEvents,
	clearSelectedEvent
});
</script>
