<template>
  <div class="area-chart-wrapper">
    <div ref="chartContainer" class="area-chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import * as echarts from 'echarts';

// Props
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  height: {
    type: Number,
    default: 120
  },
  color: {
    type: String,
    default: '#4A90E2'
  },
  showGrid: {
    type: Boolean,
    default: false
  },
  smooth: {
    type: Boolean,
    default: true
  }
});

// Reactive variables
const chartContainer = ref(null);
const chart = ref(null);

// Chart initialization
const initChart = () => {
  if (!chartContainer.value) return;
  
  const chartDom = chartContainer.value;
  chart.value = echarts.init(chartDom);
  
  updateChart();
  
  // ResizeObserver for better responsiveness
  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => {
      if (chart.value) {
        chart.value.resize();
      }
    });
    resizeObserver.observe(chartContainer.value);
    
    // Store observer for cleanup
    chart.value._resizeObserver = resizeObserver;
  } else {
    // Fallback to window resize
    window.addEventListener('resize', handleResize);
  }
};

const updateChart = () => {
  if (!chart.value) return;

  const option = {
    grid: {
      left: 0,
      right: 0,
      top: 5,
      bottom: 5,
      containLabel: false
    },
    xAxis: {
      type: 'category',
      show: false,
      data: props.data.map((_, index) => index)
    },
    yAxis: {
      type: 'value',
      show: false,
      scale: true
    },
    series: [
      {
        type: 'line',
        data: props.data,
        smooth: props.smooth,
        symbol: 'none',
        lineStyle: {
          color: props.color,
          width: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: props.color + '80' // 50% opacity
              },
              {
                offset: 1,
                color: props.color + '10' // 6% opacity
              }
            ]
          }
        },
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        if (params && params[0]) {
          return `Value: ${params[0].value}`;
        }
        return '';
      },
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderColor: props.color,
      textStyle: {
        color: '#fff',
        fontSize: 12
      }
    }
  };
  
  chart.value.setOption(option);
};

const handleResize = () => {
  if (chart.value) {
    nextTick(() => {
      chart.value.resize();
    });
  }
};

// Watch for prop changes
watch(() => props.data, updateChart, { deep: true });
watch(() => props.color, updateChart);

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    initChart();
  });
});

onUnmounted(() => {
  if (chart.value) {
    // Clean up ResizeObserver
    if (chart.value._resizeObserver) {
      chart.value._resizeObserver.disconnect();
    }
    chart.value.dispose();
  }
  window.removeEventListener('resize', handleResize);
});

// Expose methods for parent component
defineExpose({
  updateChart
});
</script>

<style scoped>
.area-chart-wrapper {
  width: 100%;
  height: 100%;
}

.area-chart-container {
  width: 100%;
  height: 100%;
  min-height: 80px;
}
</style>