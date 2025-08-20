<script setup lang="ts">
// importing icons
import ChevronDownIcon from '~/assets/icons/chevron-down.svg';

const props = defineProps<{
	modelValue: { hours: number | string; minutes: number | string; seconds: number | string } | null;
	limitless: boolean;
	check?: (time: any) => boolean; 
}>();

const emit = defineEmits(['update:modelValue', 'change']);

// Function to format numbers to always show two digits
const formatTimePadStart = (value: number | string) => value.toString().padStart(2, '0');

// Reactive time object (ensures reactivity)
const time = reactive({
	hours: formatTimePadStart(props.modelValue?.hours ?? 0),
	minutes: formatTimePadStart(props.modelValue?.minutes ?? 0),
	seconds: formatTimePadStart(props.modelValue?.seconds ?? 0)
});

// Watch for prop changes and update `time`
watch(
	() => props.modelValue,
	(newVal) => {
		if (newVal) {
			time.hours = formatTimePadStart(newVal.hours);
			time.minutes = formatTimePadStart(newVal.minutes);
			time.seconds = formatTimePadStart(newVal.seconds);
		}
	},
	{ deep: true, immediate: true }
);

// Watch `time` and update `modelValue`
watch(
	time,
	(newVal) => {
		emit('update:modelValue', {
			hours: parseInt(newVal.hours),
			minutes: parseInt(newVal.minutes),
			seconds: parseInt(newVal.seconds)
		});
	},
	{ deep: true }
);

// Function to update time
const updateTime = (key: 'hours' | 'minutes' | 'seconds', delta: number) => {
	const newValue = { ...time };
	let numericValue = parseInt(String(newValue[key])) + delta;

	if (key === 'hours') {
		if (props.limitless) {
			if (numericValue > 999) {
				numericValue = 999;
			} else if (numericValue < 0) {
				numericValue = 0;
			}
		} else {
			// Standard 24-hour wrap-around
			numericValue = (numericValue + 24) % 24;
		}
	} else {
		// Minutes & seconds always wrap between 0-59
		numericValue = (numericValue + 60) % 60;
	}

	newValue[key] = formatTimePadStart(numericValue);

	if (!props.check || props.check(newValue)) {
		time[key] = newValue[key];
		emit('change', time);
	}
};

// handle key down
const handleKeydown = (event: KeyboardEvent, key: 'hours' | 'minutes' | 'seconds') => {
	if (time[key] === '00' && (event.key === 'Backspace' || event.key === 'Delete')) {
		event.preventDefault(); // Prevent clearing
	}
};

// handle input
const handleInput = (key: 'hours' | 'minutes' | 'seconds', event: Event) => {
	let numericValue = parseInt((event.target as HTMLInputElement).value.replace(/\D/g, '')); // Remove non-numeric characters
	console.log(numericValue, 'val')
	if (key === 'hours') {
		if (props.limitless) {
			if (numericValue > 9999) {
				numericValue = 9999;
			} else if (numericValue < 0) {
				numericValue = 0;
			}
		} else {
			// Standard 24-hour wrap-around
			numericValue = (numericValue + 24) % 24; 
		}
	} else {
		// Minutes & seconds always wrap between 0-59
		numericValue = (numericValue + 60) % 60;
	}

	time[key] = formatTimePadStart(numericValue);
	emit('change', time);
};
</script>

<!-- <script setup lang="ts">
import { reactive, watch } from 'vue';
import { debounce } from 'lodash';
import ChevronDownIcon from '~/assets/icons/chevron-down.svg';
// Props
const props = defineProps<{
	modelValue: {
		days?: number | string;
		hours: number | string;
		minutes: number | string;
		seconds: number | string;
	} | null;
	limitless: boolean;
	check?: (time: any) => boolean;
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const formatTimePadStart = (value: number | string) => value.toString().padStart(2, '0');

// Determine if `days` should be shown (from modelValue)
const hasDays = computed(() => props.modelValue?.days !== undefined);

// Reactive time object
const time = reactive<any>({
	hours: formatTimePadStart(props.modelValue?.hours ?? 0),
	minutes: formatTimePadStart(props.modelValue?.minutes ?? 0),
	seconds: formatTimePadStart(props.modelValue?.seconds ?? 0),
	...(hasDays.value ? { days: formatTimePadStart(props.modelValue?.days ?? 0) } : {})
});

// Debounced change emitter
const debouncedEmitChange = debounce((val: typeof time) => {
	emit('change', val);
}, 300);

// Watch modelValue and sync -> time
watch(
	() => props.modelValue,
	(newVal) => {
		if (!newVal) return;

		const newFormatted: any = {
			hours: formatTimePadStart(newVal.hours),
			minutes: formatTimePadStart(newVal.minutes),
			seconds: formatTimePadStart(newVal.seconds)
		};

		if (newVal.days !== undefined) {
			newFormatted.days = formatTimePadStart(newVal.days);
		}

		for (const key in newFormatted) {
			if (time[key] !== newFormatted[key]) {
				time[key] = newFormatted[key];
			}
		}
	},
	{ immediate: true, deep: true }
);

// Emit to parent if real change
const emitIfChanged = () => {
	const parsed: any = {
		hours: parseInt(time.hours),
		minutes: parseInt(time.minutes),
		seconds: parseInt(time.seconds)
	};

	if ('days' in time) {
		parsed.days = parseInt(time.days);
	}

	const current: any = props.modelValue ?? {};

	const isDifferent =
		parsed.hours !== current.hours || parsed.minutes !== current.minutes || parsed.seconds !== current.seconds || ('days' in parsed && parsed.days !== current.days);

	if (isDifferent) {
		emit('update:modelValue', parsed);
		debouncedEmitChange({ ...time });
	}
};

// Watch time changes and emit
watch(
	time,
	(newVal, oldVal) => {
		const keys = ['hours', 'minutes', 'seconds'];
		if ('days' in time) keys.push('days');

		const changed = keys.some((key) => newVal[key] !== oldVal[key]);
		if (changed && (!props.check || props.check(newVal))) {
			emitIfChanged();
		}
	},
	{ deep: true }
);

const updateTime = (key: 'days' | 'hours' | 'minutes' | 'seconds', delta: number) => {
	// if (key === 'days') {
	// 	numericValue = props.limitless ? Math.min(Math.max(numericValue, 0), 9999) : Math.max(numericValue, 0);
	// } else if (key === 'hours') {
	// 	numericValue = props.limitless ? Math.min(Math.max(numericValue, 0), 999) : (numericValue + 24) % 24;
	// } else {
	// 	numericValue = (numericValue + 60) % 60;
	// }
	const newValue = { ...time };
  let numericValue = parseInt(String(newValue[key])) + delta;

  if (key === 'days') {
    if (props.limitless) {
      if (numericValue > 999) {
        numericValue = 999;
      } else if (numericValue < 0) {
        numericValue = 0;
      }
    } else {
      if (numericValue < 0) numericValue = 0; // Pastki chegara
    }
  } else if (key === 'hours') {
    if (props.limitless) {
      if (numericValue > 999) {
        numericValue = 999;
      } else if (numericValue < 0) {
        numericValue = 0;
      }
    } else {
      // Standard 24-hour wrap-around
      numericValue = (numericValue + 24) % 24;
    }
  } else {
    // Minutes & seconds always wrap between 0-59
    numericValue = (numericValue + 60) % 60;
  }

	newValue[key] = formatTimePadStart(numericValue);

	if (!props.check || props.check(newValue)) {
		// faqat bor bo‘lgan property update qilinadi
		time[key] = newValue[key];
		emit('update:modelValue', time);
		// debouncedEmitChange({ ...time })
	}
};

// handle key down
const handleKeydown = (event: KeyboardEvent, key: 'days' | 'hours' | 'minutes' | 'seconds') => {
	// agar field yo‘q bo‘lsa (masalan, days yo‘q bo‘lsa), hech narsa qilmaydi
	if (!(key in time)) return;

	if (time[key] === '00' && (event.key === 'Backspace' || event.key === 'Delete')) {
		event.preventDefault();
	}
};

// handle input
const handleInput = (key: 'days' | 'hours' | 'minutes' | 'seconds', event: Event) => {
	if (!(key in time)) return;

	let numericValue = parseInt((event.target as HTMLInputElement).value.replace(/\D/g, ''));

	if (key === 'hours') {
    if (props.limitless) {
      if (numericValue > 9999) {
        numericValue = 9999;
      } else if (numericValue < 0) {
        numericValue = 0;
      }
    } else {
      numericValue = (numericValue + 24) % 24;
    }
  } else if (key === 'days') {
    if (props.limitless) {
      if (numericValue > 9999) {
        numericValue = 9999;
      } else if (numericValue < 0) {
        numericValue = 0;
      }
    } else {
      if (numericValue < 0) numericValue = 0;
    }
  } else {
    numericValue = (numericValue + 60) % 60;
  }

	time[key] = formatTimePadStart(numericValue);
	emit('update:modelValue', time);
	// debouncedEmitChange({ ...time })
};
</script> -->

<template>
	<UPopover :popper="{ arrow: true, placement: 'bottom-start' }" :ui="{ arrow: { placement: '!left-1/2 !-translate-x-1/2' } }">
		<slot></slot>
		<template #panel>
			<div :class="['px-4 bg-transparent rounded-lg shadow space-y-3 w-48']">
				<div class="flex justify-between items-center">
					<!-- <div v-if="hasDays" class="flex flex-col items-center">
						<button
							@click.capture.prevent.stop="updateTime('days', 1)"
							tabindex="-1"
							class="p-1 text-gray-700 hover:text-black dark:text-white/[.2] dark:hover:text-white/[.4] duration-200"
						>
							<ChevronDownIcon class="w-4 rotate-180" />
						</button>
						<FormInput
							v-maska="limitless ? '####' : '##'"
							:disable-clear="true"
							v-model="time.days"
							type="text"
							@keydown="handleKeydown($event, 'days')"
							@input="handleInput('days', $event)"
							class="w-12"
						/>
						<button
							@click.capture.prevent.stop="updateTime('days', -1)"
							tabindex="-1"
							class="p-1 text-gray-700 hover:text-black dark:text-white/[.2] dark:hover:text-white/[.4] duration-200"
						>
							<ChevronDownIcon class="w-4" />
						</button>
					</div>

					<span v-if="hasDays">:</span> -->

					<div class="flex flex-col items-center">
						<button
							@click.capture.prevent.stop="updateTime('hours', 1)"
							tabindex="-1"
							class="p-1 text-gray-700 hover:text-black dark:text-white/[.2] dark:hover:text-white/[.4] duration-200"
						>
							<ChevronDownIcon class="w-4 rotate-180" />
						</button>
						<!-- v-maska="limitless ? '####' : '##'" -->
						<FormInput
							:disable-clear="true"
							v-model="time.hours"
							type="text"
							@keydown="handleKeydown($event, 'hours')"
							@input="handleInput('hours', $event)"
							class="w-12"
						/>
						<button
							@click.capture.prevent.stop="updateTime('hours', -1)"
							tabindex="-1"
							class="p-1 text-gray-700 hover:text-black dark:text-white/[.2] dark:hover:text-white/[.4] duration-200"
						>
							<ChevronDownIcon class="w-4" />
						</button>
					</div>

					:

					<div class="flex flex-col items-center">
						<button
							@click.capture.prevent.stop="updateTime('minutes', 1)"
							tabindex="-1"
							class="p-1 text-gray-700 hover:text-black dark:text-white/[.2] dark:hover:text-white/[.4] duration-200"
						>
							<ChevronDownIcon class="w-4 rotate-180" />
						</button>
						<!-- v-maska="'##'" -->
						<FormInput
							:disable-clear="true"
							v-model="time.minutes"
							type="text"
							@keydown="handleKeydown($event, 'minutes')"
							@input="handleInput('minutes', $event)"
							class="w-12"
						/>
						<button
							@click.capture.prevent.stop="updateTime('minutes', -1)"
							tabindex="-1"
							class="p-1 text-gray-700 hover:text-black dark:text-white/[.2] dark:hover:text-white/[.4] duration-200"
						>
							<ChevronDownIcon class="w-4" />
						</button>
					</div>

					:

					<div class="flex flex-col items-center">
						<button
							@click.capture.prevent.stop="updateTime('seconds', 1)"
							tabindex="-1"
							class="p-1 text-gray-700 hover:text-black dark:text-white/[.2] dark:hover:text-white/[.4] duration-200"
						>
							<ChevronDownIcon class="w-4 rotate-180" />
						</button>
						<!-- v-maska="'##'" -->
						<FormInput
							:disable-clear="true"
							v-model="time.seconds"
							type="text"
							@keydown="handleKeydown($event, 'seconds')"
							@input="handleInput('seconds', $event)"
							class="w-12 !text-center"
						/>
						<button
							@click.capture.prevent.stop="updateTime('seconds', -1)"
							tabindex="-1"
							class="p-1 text-gray-700 hover:text-black dark:text-white/[.2] dark:hover:text-white/[.4] duration-200"
						>
							<ChevronDownIcon class="w-4" />
						</button>
					</div>
				</div>
			</div>
		</template>
	</UPopover>
</template>

<style scoped>
/* :deep(input[name='transferring_time']) {
	text-align: center;
} */
:deep(input) {
  text-align: center;
}

</style>
