declare interface DailyEventGroup {
  date: Dayjs;
  certifield: boolean;
  events: DailyEvent[];
}