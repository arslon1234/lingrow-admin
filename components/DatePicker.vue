<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs';
import { useTimeZoneHelper } from '~/helpers/timezone';
import { DatePicker as VCalendarDatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';

const props = defineProps({
	modelValue: {
		type: [Object, Dayjs] as PropType<{ start: Dayjs; end: Dayjs } | Dayjs | null>,
		default: null
	}
});

// helpers
const { convertToTimeZone, acceptAsTimeZone } = useTimeZoneHelper();

const emit = defineEmits(['update:model-value', 'close']);

// Costantas
const formatType = 'YYYY-MM-DDTHH:mm:ss';

const date = computed({
	get: () => {
		if (!props.modelValue) return null;
		if ('start' in props.modelValue && 'end' in props.modelValue) {
			return {
				start: formatTime(props.modelValue.start, formatType),
				end: formatTime(props.modelValue.end, formatType)
			};
		}

		return formatTime(props.modelValue, formatType);
	},
	set: (value) => {
		if (value && typeof value === 'object' && 'start' in value && 'end' in value) {
			emit('update:model-value', {
				start: acceptAsTimeZone(value.start?.toString()),
				end: acceptAsTimeZone(value.end?.toString())
			});
		} else {
			emit('update:model-value', acceptAsTimeZone(value?.toString() as string));
		}
		emit('close');
	}
});

const attrs = {
	transparent: true,
	borderless: true,
	color: 'primary',
	'is-dark': { selector: 'html', darkClass: 'dark' },
	'first-day-of-week': 2,
	'disabled-dates': [{ start: add(convertToTimeZone(), 1, 'day'), end: null }]
};
</script>

<template>
	<VCalendarDatePicker
		v-if="date && typeof date === 'object' && 'start' in date && 'end' in date"
		v-model.range="date"
		:columns="2"
		v-bind="{ ...attrs, ...$attrs }"
		@dayclick="
			(_, event) => {
				event.target.blur();
			}
		"
	/>
	<VCalendarDatePicker
		v-else
		v-model="date"
		v-bind="{ ...attrs, ...$attrs }"
		@dayclick="
			(_, event) => {
				event.target.blur();
			}
		"
	/>
</template>

<style>
:root {
	--vc-gray-50: rgb(var(--color-gray-50));
	--vc-gray-100: rgb(var(--color-gray-100));
	--vc-gray-200: rgb(var(--color-gray-200));
	--vc-gray-300: rgb(var(--color-gray-300));
	--vc-gray-400: rgb(var(--color-gray-400));
	--vc-gray-500: rgb(var(--color-gray-500));
	--vc-gray-600: rgb(var(--color-gray-600));
	--vc-gray-700: rgb(var(--color-gray-700));
	--vc-gray-800: rgb(var(--color-gray-800));
	--vc-gray-900: rgb(var(--color-gray-900));
}

.vc-primary {
	--vc-accent-50: rgb(var(--color-primary-50));
	--vc-accent-100: rgb(var(--color-primary-100));
	--vc-accent-200: rgb(var(--color-primary-200));
	--vc-accent-300: rgb(var(--color-primary-300));
	--vc-accent-400: rgb(var(--color-primary-400));
	--vc-accent-500: rgb(var(--color-primary-500));
	--vc-accent-600: rgb(var(--color-primary-600));
	--vc-accent-700: rgb(var(--color-primary-700));
	--vc-accent-800: rgb(var(--color-primary-800));
	--vc-accent-900: rgb(var(--color-primary-900));
}
</style>
