import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export const useCurrentTime = () => {
  const currentTime = ref<Dayjs>(dayjs());

  const updateCurrentTime = () => {
    currentTime.value = dayjs();
  };

  const updateTimeInterval = setInterval(updateCurrentTime, 1000);

  onBeforeUnmount(() => {
    clearInterval(updateTimeInterval);
  });

  return {
    currentTime,
  };
};
