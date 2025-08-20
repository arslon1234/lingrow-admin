<template>
  <div v-if="findEventByTypeAndCode(eventType, eventCode)" class="flex items-center gap-x-2">
    <div :style="{ backgroundColor: findEventByTypeAndCode(eventType, eventCode)?.color }"
      :class="[size === 'sm' && 'w-3 h-4 rounded-[5px]' || size === 'md' && 'w-3.5 h-5 rounded-md']"></div>
    <p :style="{ color: findEventByTypeAndCode(eventType, eventCode)?.color }"
      :class="[size == 'sm' && 'text-xs' || size == 'md' && 'text-sm']">
      {{ findEventByTypeAndCode(eventType, eventCode)?.label }}
    </p>
  </div>
  <p v-else>
    {{ getEventText(eventType, eventCode) }}
    <span v-if="eventType === 4 && showDate">({{ getStartOf(acceptAsTimeZone(certifiedDate)).format('YYYY-MM-DD') }})</span>
  </p>
</template>

<script setup>
import { useTimeZoneHelper } from '~/helpers/timezone';
const { getStartOf, acceptAsTimeZone } = useTimeZoneHelper();
// props
const props = defineProps({
  eventType: {
    type: Number,
    required: true
  },
  eventCode: {
    type: Number,
    required: true
  },
  certifiedDate: {
    type: String,
    required: false
  },
  size: {
    type: String,
    default: 'md'
  },
  cell_size: {
    type: Number,
    default: 13
  },
  showDate: {
    type: Boolean,
    default: true
  }
})
// console.log(props.certifiedDate !== null && props.certifiedDate, 'certifiedDate')
</script>
