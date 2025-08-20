<template>
  <ul :style="{ marginTop: `${topOffset + 10}px`, fontSize: `${edit ? 11 : 13}px` }" class="h-fit shrink-0 w-16 relative">
    <li v-if="route.path.includes('boost') || route.path.includes('ai')" class="uppercase text-xs font-bold flex items-center justify-center absolute -top-[18px] left-3">
      {{ dayName }}
    </li>
    <li :style="{ height: `${height}px` }" class="uppercase font-bold flex items-center justify-center">
      {{ isNaN(dailySummary?.dailyOffDuty) ? '00:00' : convertSecondsToHours(dailySummary?.dailyOffDuty, ':', '') }}
    </li>
    <li :style="{ height: `${height}px` }" class="uppercase font-bold flex items-center justify-center">
      {{ isNaN(dailySummary?.dailySleeperBerth) ? '00:00' : convertSecondsToHours(dailySummary?.dailySleeperBerth, ':', '') }}
    </li>
    <li :style="{ height: `${height}px` }" class="uppercase font-bold flex items-center justify-center">
      {{ isNaN(dailySummary?.dailyDriving) ? '00:00' : convertSecondsToHours(dailySummary?.dailyDriving, ':', '') }}
    </li>
    <li :style="{ height: `${height}px` }" class="uppercase font-bold flex items-center justify-center">
      {{ isNaN(dailySummary?.dailyOnDuty) ? '00:00' : convertSecondsToHours(dailySummary?.dailyOnDuty, ':', '') }}
    </li>
  </ul>
</template>

<script setup lang="ts">
// importing helpers
import { convertSecondsToHours } from '~/helpers/time';

// route
const route = useRoute();

// Props
const props = defineProps<{
  dayName: string;
  dailySummary: DailySummaryResponse;
  height: number; // Replacing store value
  topOffset: number;     // Replacing store value
  edit: Boolean;
}>();
</script>
