<template>
  <div class="monitoring-card">
    <!-- Card Header -->
    <div class="card-header">
      <h3 class="card-title">{{ title }}</h3>
    </div>
    
    <!-- Statistics Row -->
    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-label">Highest Point</div>
       <div class="flex items-center gap-2">
         <div class="stat-value">{{ highestValue }}</div>
        <div class="stat-unit">{{ unit }}</div>
       </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-label">Lowest Point</div>
        <div class="flex items-center gap-2">
          <div class="stat-value">{{ lowestValue }}</div>
          <div class="stat-unit">{{ unit }}</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-label">{{ averageLabel }}</div>
        <div class="flex items-center gap-2">
          <div class="stat-value">{{ averageValue }}</div>
          <div class="stat-unit">{{ unit }}</div>
        </div>
      </div>
    </div>
    
    <!-- ECharts Container -->
    <div class="chart-section">
      <div 
        ref="chartContainer" 
        class="chart-container"
        :style="{ width: '100%', height: chartHeight + 'px' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Speed'
  },
  unit: {
    type: String,
    default: 'mi/h'
  },
  averageLabel: {
    type: String,
    default: 'Average Speed'
  },
  chartColor: {
    type: String,
    default: '#4A90E2'
  },
  data: {
    type: Object,
    default: () => ({})
  },
  chartHeight: {
    type: Number,
    default: 200
  }
});

// Reactive state
const chartContainer = ref(null);
const chartInstance = ref(null);

// Process data for ECharts
const processedData = computed(() => {
  if (!props.data?.series || !Array.isArray(props.data.series)) {
    return {
      times: [],
      values: [],
      formattedTimes: []
    };
  }
  
  const times = [];
  const values = [];
  const formattedTimes = [];
  
  props.data.series.forEach(item => {
    const date = new Date(item.timestamp);
    
    // Time for chart axis
    times.push(date.getTime());
    
    // Value
    values.push(parseFloat(item.value));
    
    // Formatted time for display
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    formattedTimes.push(timeStr);
  });
  
  return { times, values, formattedTimes };
});

// Statistics
const highestValue = computed(() => {
  if (props.data?.statistics?.highest !== undefined) {
    return parseFloat(props.data.statistics.highest).toFixed(1);
  }
  if (processedData.value.values.length === 0) return '0.0';
  return Math.max(...processedData.value.values).toFixed(1);
});

const lowestValue = computed(() => {
  if (props.data?.statistics?.lowest !== undefined) {
    return parseFloat(props.data.statistics.lowest).toFixed(1);
  }
  if (processedData.value.values.length === 0) return '0.0';
  return Math.min(...processedData.value.values).toFixed(1);
});

const averageValue = computed(() => {
  if (props.data?.statistics?.average !== undefined) {
    return parseFloat(props.data.statistics.average).toFixed(1);
  }
  if (processedData.value.values.length === 0) return '0.0';
  const sum = processedData.value.values.reduce((a, b) => a + b, 0);
  return (sum / processedData.value.values.length).toFixed(1);
});

// Create ECharts configuration
const createChartOption = () => {
  const { times, values, formattedTimes } = processedData.value;
  
  if (values.length === 0) {
    return {
      title: {
        text: 'No Data Available',
        left: 'center',
        top: 'middle',
        textStyle: {
          color: '#9ca3af',
          fontSize: 14
        }
      }
    };
  }

  return {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '8%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      textStyle: {
        color: '#ffffff',
        fontSize: 12
      },
      formatter: function(params) {
        const point = params[0];
        const timeIndex = times.findIndex(t => t === point.value[0]);
        const timeStr = formattedTimes[timeIndex] || '';
        const dateStr = new Date(point.value[0]).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        
        return `
          <div style="font-weight: 600; margin-bottom: 4px; color: #ffffff;">${timeStr}</div>
          <div style="font-size: 11px; color: #d1d5db; margin-bottom: 6px;">${dateStr}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; min-width: 100px;">
            <span style="color: #d1d5db; font-size: 11px;">${props.title}:</span>
            <span style="color: #ffffff; font-weight: bold; font-family: 'Courier New', monospace;">
              ${point.value[1].toFixed(2)} ${props.unit}
            </span>
          </div>
        `;
      },
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: props.chartColor,
          width: 1,
          opacity: 0.5
        },
        crossStyle: {
          color: props.chartColor,
          width: 1,
          opacity: 0.5
        }
      }
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        formatter: function(value) {
          const date = new Date(value);
          return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
        },
        color: '#6b7280',
        fontSize: 11,
        fontWeight: 500
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f1f5f9',
          width: 1
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 11,
        formatter: function(value) {
          return value.toFixed(0);
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f1f5f9',
          width: 1
        }
      }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        smoothMonotone: 'x',
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: props.chartColor,
          borderColor: '#ffffff',
          borderWidth: 2
        },
        lineStyle: {
          color: props.chartColor,
          width: 3,
          shadowColor: props.chartColor,
          shadowBlur: 8,
          shadowOffsetY: 2
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
                color: props.chartColor + '60' // 60% opacity
              },
              {
                offset: 0.5,
                color: props.chartColor + '30' // 30% opacity
              },
              {
                offset: 1,
                color: props.chartColor + '10' // 10% opacity
              }
            ]
          }
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: props.chartColor
          },
          lineStyle: {
            width: 4
          }
        },
        data: times.map((time, index) => [time, values[index]])
      }
    ],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  };
};

// Initialize chart
const initChart = async () => {
  if (!chartContainer.value) return;
  
  await nextTick();
  
  // Dispose existing chart
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
  
  // Create new chart instance
  chartInstance.value = echarts.init(chartContainer.value, null, {
    renderer: 'canvas',
    useDirtyRect: false
  });
  
  // Set option
  const option = createChartOption();
  chartInstance.value.setOption(option);
  
  // Auto resize
  const resizeObserver = new ResizeObserver(() => {
    if (chartInstance.value) {
      chartInstance.value.resize();
    }
  });
  
  resizeObserver.observe(chartContainer.value);
  
  // Store observer for cleanup
  chartInstance.value._resizeObserver = resizeObserver;
};

// Update chart when data changes
const updateChart = () => {
  if (!chartInstance.value) return;
  
  const option = createChartOption();
  chartInstance.value.setOption(option, true); // true for not merge
};

// Watch for data changes
watch(() => props.data, () => {
  updateChart();
}, { deep: true });

watch(() => props.chartColor, () => {
  updateChart();
});

// Lifecycle
onMounted(async () => {
  await nextTick();
  initChart();
});

onUnmounted(() => {
  if (chartInstance.value) {
    // Clean up resize observer
    if (chartInstance.value._resizeObserver) {
      chartInstance.value._resizeObserver.disconnect();
    }
    
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
});

// Expose methods
defineExpose({
  updateChart,
  getChartInstance: () => chartInstance.value
});
</script>

<style scoped>
.monitoring-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;
}

.monitoring-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  margin-bottom: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 20px;
}

.stat-item {
  flex: 1;
  text-align: left;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  line-height: 1;
  font-family: 'Courier New', monospace;
  transition: color 0.3s ease;

}
.stat-unit {
  font-size: 16px;
  color: #6b7280;
  font-weight: 600;
}

.monitoring-card:hover .stat-value,
.monitoring-card:hover .stat-unit {
  color: v-bind(chartColor);
}

.chart-section {
  flex: 1;
  min-height: 140px;
  margin-top: auto;
}

.chart-container {
  width: 100%;
  position: relative;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .monitoring-card {
    padding: 16px;
  }
  
  .stats-row {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .card-title {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .monitoring-card {
    padding: 12px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .chart-section {
    min-height: 120px;
  }
}
</style>