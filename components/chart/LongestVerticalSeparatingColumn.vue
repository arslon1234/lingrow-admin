<template>
  <path fill="none" :d="`M 0 0 ${path}`"
        stroke-width="1" stroke-opacity="1" :stroke="colorMode.value === 'dark' ? '#DCDCDC1A' : '#DCDCDC'"></path>
</template>

<script setup>
const props = defineProps({
  count: {
    type: Number,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
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

// Calculate the longest vertical separating column based on count and props
const calculateLongestVerticalSeparatingColumn = (count) => {
  let start = props.distance;
  let newPath = "";
  for (let i = 0; i < count; i++) {
    let newX = start + (i * props.distance);
    newPath += `M ${newX} ${props.topOffset} L ${newX} ${props.height * 5}, `;
  }
  newPath = `M 1 ${props.topOffset} L 1 ${props.height * 5}, ${newPath}`;
  return newPath;
};


// Watch for changes in `count` and `distance` props
watch([() => props.count, () => props.distance], ([newCount]) => {
  path.value = calculateLongestVerticalSeparatingColumn(newCount);
});

// Initialize path and separator values on mounted
onMounted(() => {
  path.value = calculateLongestVerticalSeparatingColumn(props.count);
});
</script>
