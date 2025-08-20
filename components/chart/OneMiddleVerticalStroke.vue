<template>
  <path fill="none" :d="`M 0 0 ${path}`"
        :stroke-dasharray="`0,${height/2},${height/2},${height/2},${height/2},${height/2},${height/2},${height/2},${height/2},${height/2},${height/2},${height/2},${height/2},${height/2},${height/2},${height/2},${height/2}`"
        stroke-width="1" stroke-opacity="1" :stroke="colorMode.value === 'dark' ? '#DCDCDC1A' : '#dcdcdc'"></path>
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
    default: 20, // Default is only needed if it's optional
  },
});

// dark
const colorMode = useColorMode();

const path = ref('');

const calculateOneMiddleVerticalStrokes = (count) => {
  let start = props.distance / 2;
  let newPath = "";
  for (let i = 0; i < count; i++) {
    let newX = start + (i * props.distance);
    newPath += `M ${newX} ${props.topOffset} L ${newX} ${props.height*5}`;
  }
  return newPath;
};

watch([() => props.count, () => props.distance], ([newCount]) => {
  path.value = calculateOneMiddleVerticalStrokes(newCount);
});

onMounted(() => {
  path.value = calculateOneMiddleVerticalStrokes(props.count);
});
</script>
