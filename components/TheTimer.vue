<template>
	<svg width="90" height="90" viewBox="0 0 90 90">
		<!-- Background Rounded Rectangle -->
		<path
			d="M45,10 H65 A20,20 0 0 1 85,30 V60 A20,20 0 0 1 65,80 H25 A20,20 0 0 1 5,60 V30 A20,20 0 0 1 25,10 Z"
			fill="none"
			class="duration-300"
			:stroke="timeLeft <= 0 ? (isDark ? '#AD1F3826' : '#F4DCDA') : isDark ? '#7588BF26' : '#EEEEFF'"
			stroke-width="10"
		></path>

		<!-- Progress Rounded Rectangle -->
		<path
			d="M45,10 H65 A20,20 0 0 1 85,30 V60 A20,20 0 0 1 65,80 H25 A20,20 0 0 1 5,60 V30 A20,20 0 0 1 25,10 Z"
			fill="none"
			:stroke="activeColor"
			stroke-width="10"
			stroke-dasharray="265"
			:stroke-dashoffset="dashOffset"
			stroke-linecap="round"
			class="duration-300"
			v-if="timeLeft > 0"
			style="transform: rotateY(3.14rad) translateX(-100%)"
		></path>

		<!-- Timer Text -->
		<text x="45" y="50" text-anchor="middle" class="duration-300 class:fill-dark_icon" :fill="timeLeft > 0 ? activeColor : '#AD1F38'" font-size="15" font-weight="500">
			{{ formattedTime }}
		</text>
	</svg>
</template>

<script setup>
import { convertSecondsToHours } from '~/helpers/time';

const props = defineProps({
	duration: {
		type: Number
	},
	total: {
		type: Number
	}
});

// darkmode
const colorMode = useColorMode();
const isDark = computed({
	get() {
		return colorMode.value === 'dark';
	},
	set() {
		colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
	}
});

// colors
const activeColor = computed(() => (isDark.value ? '#566385' : '#465a95'));

const timeLeft = ref(props.duration ?? 0);
const dashOffset = ref(0);
const totalLength = 265; // Updated total length of the path

const formattedTime = computed(() => convertSecondsToHours(timeLeft.value, ':', ''));

const updateDashOffset = () => {
	dashOffset.value = (1 - (timeLeft.value / props.total > 1 ? 1 : timeLeft.value / props.total)) * totalLength;
};

const startCountdown = () => {
	const interval = setInterval(() => {
		if (timeLeft.value > 0) {
			timeLeft.value--;
			updateDashOffset();
		} else {
			clearInterval(interval);
		}
	}, 1000);
};

watch(
	() => props.duration,
	(newValue) => {
		timeLeft.value = newValue;
		updateDashOffset(); // startCountdown();
	}
);

onMounted(() => {
	dashOffset.value = totalLength; // Start from full path
	updateDashOffset();
});
</script>
