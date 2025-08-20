<template>
  <g>
    <text
      ref="verticalSeparator"
      v-for="(item, key) in generatedLabels"
      :key="key"
      stroke-width="2"
      :font-weight="isNaN(item.label) ? 600 : 400"
      :font-size="(isNaN(item.label) && item.label.length > 1) ? (edit ? 12 : 16) : (edit ? 10 : 14)"
      :x="item.x"
      :y="item.y"
      :text-anchor="item.textAnchor"
      :fill="isNaN(item.label) ? (colorMode.value === 'dark' ? '#FFFFFFB2' : '') : (colorMode.value === 'dark' ? '#9295A1' : '#9295A1')"
    >
      {{ item.label }}
    </text>
  </g>
</template>

<script setup>
// Props
const props = defineProps({
  count: {
    type: Number,
    required: true
  },
  dayNames: {
    type: Array,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  edit: {
    type: Boolean,
    default: false
  }
});

// dark
const colorMode = useColorMode();

// Generate the hour label based on count and day names
const generateHourLabel = (hour, dayNames) => {
  const days = props.count / 24;
  const adjustedHour = (hour + days * 24) % 24;
  if (adjustedHour === 0 && dayNames.length > 0) {
    return dayNames[(hour / 24) % dayNames.length];
  } else if (adjustedHour === 12) {
    return 'N';
  } else {
    return adjustedHour % 12 || 12;
  }
};

// Computed property for generated labels
const generatedLabels = computed(() => {
  return Array.from({ length: props.count }, (_, i) => {
    const label = generateHourLabel(i, props.dayNames);
    return {
      label,
      x: i * props.distance,
      y: 14.104166666666668,
      textAnchor: i === 0 ? 'start' : 'middle'
    };
  });
});
</script>
