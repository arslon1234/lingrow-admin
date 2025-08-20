declare interface IftaResponse {
  id: string;
  startDate: string | Dayjs;
  endDate: string | Dayjs;
  pdfPath: string;
  csvPath: string;
  dateTime: string | Dayjs;
  vehicle: VehicleResponse;
}