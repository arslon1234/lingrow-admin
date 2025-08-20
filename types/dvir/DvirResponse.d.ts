declare interface DvirResponse {
  id: string;
  dateTime: string;
  location: string;
  odometer: number;
  carrier: CarrierResponse;
  remarks: string;
  signaturePath: string;
  dvirStatus: Name;
  driver: DriverResponse;
  vehicle: VehicleResponse;
  vehicleDefects: DeviceDefectResponse[];
  trailers: string[];
  trailerDefects: DeviceDefectResponse[];
}