<template>
	<VueDatePicker ref="dp" :enable-time-picker="showTimePicker" :enable-seconds="showSeconds"
		:dark="$colorMode.value === 'dark'" :range="!!Array.isArray(date)" :multi-calendars="!!Array.isArray(date)"
		:max-date="add(convertToTimeZone(), 1, 'day').format(formatType)" :is-24="false" v-model="date" class="shrink-0"
		:timezone="{ timezone: getCarrierTimeZoneId() }">
		<!-- :timezone="{ timezone: getCarrierTimeZoneId() }" -->
		<template #trigger>
			<slot></slot>
		</template>
		<template #calendar-header="{ index, day }">
			<div class="text-grey-0">
				{{ day }}
			</div>
		</template>
		<template #action-buttons>
			<div class="mt-2 border-t border-grey-border dark:border-white/[.05] pt-4 flex w-full gap-x-2">
				<button
					class="flex-1 px-4 py-2 rounded-lg bg-grey-2 hover:bg-grey-1 duration-200 text-white dark:bg-dark-button-0 dark:hover:bg-dark-button-0/[0.8]"
					@click.capture.stop.prevent="closePicker">
					Cancel
				</button>
				<button
					class="flex-1 px-4 py-2 rounded-lg bg-purple hover:bg-purple/[.9] duration-200 text-white dark:bg-dark-button-1 dark:hover:bg-dark-button-1/[0.8]"
					@click.capture.stop.prevent="selectDate">
					Apply
				</button>
			</div>
		</template>
		<template #action-preview="{ value }"> </template>
	</VueDatePicker>
</template>

<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs';
import { useTimeZoneHelper } from '~/helpers/timezone';
import type { DatePickerInstance } from '@vuepic/vue-datepicker';

// emits
const emits = defineEmits(['update:model-value', 'cancelSubmit']);

// props
const props = defineProps({
	modelValue: {
		type: Object as PropType<[Dayjs, Dayjs] | Dayjs | null>,
		default: null,
		validator: (value: unknown) => {
			// Allow null
			if (value === null) return true;

			// Check if it's a Dayjs object
			if (dayjs.isDayjs(value)) return true;

			// Check if it's an array of two Dayjs objects
			if (Array.isArray(value) && value.length === 2 && dayjs.isDayjs(value[0]) && dayjs.isDayjs(value[1])) {
				return true;
			}

			// Invalid value
			console.warn('Invalid modelValue:', value);
			return false;
		}
	},
	showTimePicker: {
		type: Boolean,
		default: false
	},
	showSeconds: {
		type: Boolean,
		default: false
	},
	defaultOpen: {
		type: Boolean,
		default: false
	}
});

// Constants
const formatType = 'YYYY-MM-DDTHH:mm:ss';

// ref
const dp = ref<DatePickerInstance | null>(null);

// helpers
const { convertToTimeZone, acceptAsTimeZone, formatToUTC } = useTimeZoneHelper();

const formatTime = (value: Dayjs | string, format: string) => {
	return dayjs(value).format(format);
};

const date = computed({
	get: () => {
		if (!props.modelValue) return null;
		if (dayjs.isDayjs(props.modelValue)) {
			return acceptAsTimeZone(props.modelValue).format(); //formatToUTC(props.modelValue as Dayjs);
		}
		if (Array.isArray(props.modelValue)) {
			return [acceptAsTimeZone(props.modelValue[0]).format(), acceptAsTimeZone(props.modelValue[1]).format()]; //formatToUTC(props.modelValue[0] as Dayjs), formatToUTC(props.modelValue[1] as Dayjs)];
		}
		// return formatToUTC(props.modelValue);
		return acceptAsTimeZone(props.modelValue).format();
	},
	set: (value) => {
		if (Array.isArray(value)) {
			emits('update:model-value', [convertToTimeZone(value[0]?.toString() as string), convertToTimeZone(value[1]?.toString() as string)]);
		} else {
			emits('update:model-value', convertToTimeZone(value as string));
			console.log(value, convertToTimeZone(value as string).format(), "date and after formatting");
		}
	}
});

const selectDate = () => {
	if (dp.value) {
		dp.value.selectDate();
	}
};

const openPicker = () => {
	if (dp.value) {
		dp.value.openMenu();
	}
}

const closePicker = () => {
	if (dp.value) {
		dp.value.closeMenu();
		emits('cancelSubmit', true);
	}
};

onMounted(async () => {
	if (props.defaultOpen) {
		await nextTick();
		openPicker();
	}
})
</script>

<style scoped>
:deep(.dp__action_row) {
	padding: 0 12px 12px 12px;
}

:deep(.dp__action_buttons) {
	width: 100%;
	flex-grow: 1;
}

:deep(.dp__menu.dp__menu_index) {
	border-radius: 12px;
	overflow: hidden;
}

:deep(.dp__menu_inner.dp__flex_display) {
	padding: 12px 12px 0 12px;
}

:deep(.dp__theme_dark) {
	--dp-primary-color: #465a95;
	--dp-background-color: #303030;
	--dp-border-color: #ffffff10;
	--dp-menu-border-color: #ffffff10;
	--dp-border-color-hover: #ffffff10;
	--dp-border-color-focus: #ffffff10;
}

:deep(.dp__theme_light) {
	--dp-primary-color: #465a95;
	--dp-background-color: #fff;
	--dp-border-color: #eeeeee;
	--dp-menu-border-color: #eeeeee;
	--dp-border-color-hover: #eeeeee;
	--dp-border-color-focus: #eeeeee;
	--dp-range-between-dates-background-color: #465a9510;
}

:deep(.dp__btn.dp__month_year_select) {
	font-weight: 600;
}
</style>
