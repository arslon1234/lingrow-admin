declare interface DriverDailyFormsRequest {
  driverId: string;
  trailers: string[];
  shippingDocuments: string[];
  coDriverId: string;
  certifiedDate: Dayjs;
  formDate: Dayjs;
  signaturePath: string;
}