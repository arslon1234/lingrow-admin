<template>
  <div class="chart-wrapper">
    <h3 class="chart-title">{{ title }}</h3>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Speed'
  },
  value: {
    type: Number,
    default: 70
  },
  maxValue: {
    type: Number,
    default: 200
  },
  unit: {
    type: String,
    default: 'km/h'
  },
  colors: {
    type: Array,
    default: () => [
      [0.3, '#67e0e3'],
      [0.7, '#37a2da'],
      [1, '#fd666d']
    ]
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
  
  const option = {
    series: [
      {
        type: 'gauge',
        min: 0,
        max: props.maxValue,
        radius: '90%',
        center: ['50%', '60%'],
        startAngle: 200,
        endAngle: -20,
        axisLine: {
          lineStyle: {
            width: 15,
            color: props.colors
          }
        },
        pointer: {
          itemStyle: {
            color: 'auto'
          },
          width: 4
        },
        axisTick: {
          distance: -15,
          length: 6,
          lineStyle: {
            color: '#fff',
            width: 1
          }
        },
        splitLine: {
          distance: -15,
          length: 15,
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        axisLabel: {
          color: 'inherit',
          distance: 20,
          fontSize: 10,
          fontWeight: 'normal'
        },
        detail: {
          valueAnimation: true,
          formatter: `{value} ${props.unit}`,
          color: 'inherit',
          fontSize: 14,
          fontWeight: 'bold',
          offsetCenter: [0, '80%']
        },
        data: [
          {
            value: props.value
          }
        ]
      }
    ]
  };
  
  chart.value.setOption(option);
  
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

const handleResize = () => {
  if (chart.value) {
    nextTick(() => {
      chart.value.resize();
    });
  }
};

const updateChart = (newValue) => {
  if (chart.value) {
    chart.value.setOption({
      series: [
        {
          data: [
            {
              value: newValue
            }
          ]
        }
      ]
    });
  }
};

// Watch for prop changes
import { watch } from 'vue';
watch(() => props.value, (newValue) => {
  updateChart(newValue);
});

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
  updateValue: updateChart
});
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  min-height: 200px;
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.chart-title {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.chart-container {
  flex: 1;
  width: 100%;
  min-height: 150px;
  position: relative;
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .chart-wrapper {
    padding: 14px;
    min-height: 220px;
  }
  
  .chart-title {
    font-size: 16px;
    margin-bottom: 12px;
  }
  
  .chart-container {
    min-height: 180px;
  }
}

@media (min-width: 1024px) {
  .chart-wrapper {
    min-height: 240px;
  }
  
  .chart-title {
    font-size: 18px;
  }
  
  .chart-container {
    min-height: 200px;
  }
}

@media (min-width: 1280px) {
  .chart-wrapper {
    min-height: 260px;
  }
  
  .chart-container {
    min-height: 220px;
  }
}

/* For very small containers */
@media (max-width: 320px) {
  .chart-wrapper {
    padding: 8px;
    min-height: 180px;
  }
  
  .chart-title {
    font-size: 12px;
    margin-bottom: 4px;
  }
  
  .chart-container {
    min-height: 140px;
  }
}
</style>