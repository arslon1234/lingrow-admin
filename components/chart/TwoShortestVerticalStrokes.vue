<template>
	<path
		fill="none"
		:d="`M 0 0 ${path}`"
		:stroke-dasharray="`0,${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6},${height*5/6},${height*1/6}`"
		stroke-width="1"
		stroke-opacity="1"
		:stroke="colorMode.value === 'dark' ? '#DCDCDC1A' : '#dcdcdc'"
	></path>
</template>

<script setup>
const props = defineProps({
  count: {
    type: Number,
		required: true
	},
  distance: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  topOffset: {
    type: Number,
    required: true,
		default: 20
  }
});

// dark
const colorMode = useColorMode();

const path = ref('');

const calculateTwoShorterVerticalStrokes = (count) => {
	let difference = props.distance / 6;
	let start = difference;
	let newPath = '';
	for (let i = 0; i < count; i++) {
		if((i % 4 === 0 || (i - 2) % 4 === 0) && i % 6 !== 2) {
			let newX = start + i * difference;
			newPath += `M ${newX} ${props.topOffset} L ${newX} ${props.height*5}, `;
		} else {
			count++;
		}
	}
	return newPath;
};

watch(
	[() => props.count,
	() => props.distance],
	([newCount]) => {
		path.value = calculateTwoShorterVerticalStrokes(newCount);
	}
);

onMounted(() => {
	path.value = calculateTwoShorterVerticalStrokes(props.count);
});
</script>
