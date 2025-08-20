declare interface EldResponse {
  id: string;
  name?: string;
  macAddress?: string;
  serialNumber?: string;
  mainVersionInfo?: string;
  bleVersionInfo?: string;
  vehicleId?: string;
  malfunctions?: string;
  dateTime: string;
  driverId: string;
  isConnected: boolean;
  vehicle?: VehicleResponse;
  driver?: DriverResponse;
  files?: any;
}
