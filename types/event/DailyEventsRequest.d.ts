declare interface DailyEventsRequest {
  from: Dayjs | string;
  to: Dayjs | string;
  driverId: string;
  eventsOrder: boolean;
}