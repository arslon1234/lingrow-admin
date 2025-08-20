declare interface DriverLogsDailyEventsRequest {
  startDate: Dayjs;
  endDate: Dayjs;
  driverId: string;
}