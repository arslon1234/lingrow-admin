declare interface DriverResponse {
  id: string;
  currentVehicleId?: string | null;
  currentVehicleUnit?: string | null;
  user: DriverUser;
  homeTerminal: HomeTerminalResponse;
  hosRule: Name;
  cargoType: Name;
  restart: Name;
  restBreak: Name;
  driverLicense: DriverLicense;
  vehicles: VehicleResponse[];
  exemptDriver: boolean;
  shortHaulException: boolean;
  allowPersonalUse: boolean;
  unlimitedTrailers: boolean;
  allowYardMoves: boolean;
  unlimitedShippingDocuments: boolean;
  deviceInfo?: DeviceInfoResponse | null;
  carrier: CarrierResponse;
  isActive: boolean;
}