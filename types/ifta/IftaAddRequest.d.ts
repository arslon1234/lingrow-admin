declare interface IftaAddRequest {
  vehicleIds: string[];
  startDate: string | Dayjs;
  endDate: string | Dayjs;
  carrierId: string;
}