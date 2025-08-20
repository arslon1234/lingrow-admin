<template>
  <div class="chart-wrapper">
    <div class="odometer-container">
      <!-- Digital Odometer Display -->
      <div class="digital-display">
        <div class="odometer-value">{{ formattedValue }}</div>
        <div class="odometer-unit">CURRENT ODOMETER</div>
      </div>
      
      <!-- Trip Meter -->
      <div class="trip-meter">
        <div class="trip-label">CURRENT ENGINE HOURS</div>
        <div class="trip-value">{{ formattedTrip }}</div>
      </div>
      
      <!-- Additional Info -->
      <div class="odometer-info">
        <div class="info-row">
          <span class="info-label">AVG SPEED:</span>
          <span class="info-value">{{ avgSpeed }} km/h</span>
        </div>
        <div class="info-row">
          <span class="info-label">FUEL ECON:</span>
          <span class="info-value">{{ fuelEconomy }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Odometer'
  },
  value: {
    type: Number,
    default: 125678
  },
  tripValue: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'kilometers'
  },
  avgSpeed: {
    type: Number,
    default: 0
  },
  fuelEconomy: {
    type: Number,
    default: 8.5
  },
  animationDuration: {
    type: Number,
    default: 2000
  }
});

// Reactive variables
const displayValue = ref(0);
const displayTrip = ref(0);
const animationFrame = ref(null);

// Computed properties
const formattedValue = computed(() => {
  return Math.floor(displayValue.value).toLocaleString('en-US', {
    minimumIntegerDigits: 6,
    useGroupingSeparator: true
  });
});

const formattedTrip = computed(() => {
  return displayTrip.value.toFixed(1);
});

// Animation functions
const animateValue = (start, end, duration, callback) => {
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const current = start + (end - start) * easeOutQuad;
    
    callback(current);
    
    if (progress < 1) {
      animationFrame.value = requestAnimationFrame(animate);
    }
  };
  
  animationFrame.value = requestAnimationFrame(animate);
};

const updateOdometer = (newValue) => {
  animateValue(displayValue.value, newValue, props.animationDuration, (value) => {
    displayValue.value = value;
  });
};

const updateTrip = (newValue) => {
  animateValue(displayTrip.value, newValue, props.animationDuration / 2, (value) => {
    displayTrip.value = value;
  });
};

// Watch for prop changes
watch(() => props.value, (newValue) => {
  updateOdometer(newValue);
});

watch(() => props.tripValue, (newValue) => {
  updateTrip(newValue);
});

// Lifecycle hooks
onMounted(() => {
  // Initial animation
  setTimeout(() => {
    updateOdometer(props.value);
    updateTrip(props.tripValue);
  }, 100);
});

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }
});

// Expose methods for parent component
defineExpose({
  updateValue: updateOdometer,
  updateTrip: updateTrip,
  resetTrip: () => updateTrip(0)
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
  position: relative;
  overflow: hidden;
}

.chart-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 12px 12px 0 0;
}

.chart-title {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.odometer-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.digital-display {
  text-align: center;
  background: rgba(103, 224, 227, 0.1);
  border-radius: 8px;
  padding: 15px 20px;
  min-width: 250px;
  border: 2px solid #37a2da;
  box-shadow: 
    0 0 10px rgba(55, 162, 218, 0.2),
    inset 0 0 5px rgba(55, 162, 218, 0.1);
}

.odometer-value {
  font-family: 'Courier New', monospace;
  font-size: 24px;
  font-weight: bold;
  color: #37a2da;
  letter-spacing: 2px;
  text-shadow: 
    0 0 5px rgba(55, 162, 218, 0.3),
    0 0 10px rgba(55, 162, 218, 0.2);
  line-height: 1;
}

.odometer-unit {
  font-size: 10px;
  color: #6b7280;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.trip-meter {
  background: rgba(253, 102, 109, 0.1);
  border-radius: 6px;
  padding: 8px 12px;
  border: 1px solid #fd666d;
  text-align: center;
  min-width: 250px;
}

.trip-label {
  font-size: 9px;
  color: #6b7280;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 2px;
}

.trip-value {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  color: #fd666d;
  text-shadow: 0 0 3px rgba(253, 102, 109, 0.3);
}

.odometer-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 200px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  padding: 4px 8px;
  background: rgba(103, 224, 227, 0.05);
  border-radius: 4px;
  border-left: 3px solid #67e0e3;
}

.info-label {
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  color: #374151;
  font-weight: 600;
  font-family: 'Courier New', monospace;
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
  
  .odometer-value {
    font-size: 28px;
  }
  
  .trip-value {
    font-size: 18px;
  }
  
  .info-row {
    font-size: 11px;
  }
}

@media (min-width: 1024px) {
  .chart-wrapper {
    min-height: 240px;
  }
  
  .chart-title {
    font-size: 18px;
  }
  
  .odometer-value {
    font-size: 32px;
  }
  
  .trip-value {
    font-size: 20px;
  }
  
  .info-row {
    font-size: 12px;
  }
}

@media (min-width: 1280px) {
  .chart-wrapper {
    min-height: 260px;
  }
  
  .odometer-value {
    font-size: 24px;
  }
  
  .trip-value {
    font-size: 24px;
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
  
  .odometer-value {
    font-size: 20px;
    letter-spacing: 1px;
  }
  
  .trip-value {
    font-size: 14px;
  }
  
  .info-row {
    font-size: 9px;
    padding: 3px 6px;
  }
  
  .digital-display {
    padding: 10px 15px;
  }
}

/* Animation effects */
@keyframes glow {
  0%, 100% {
    text-shadow: 
      0 0 5px rgba(55, 162, 218, 0.3),
      0 0 10px rgba(55, 162, 218, 0.2);
  }
  50% {
    text-shadow: 
      0 0 8px rgba(55, 162, 218, 0.5),
      0 0 15px rgba(55, 162, 218, 0.3);
  }
}

.odometer-value {
  animation: glow 3s ease-in-out infinite;
}
</style>