declare interface VehicleRequest {
  unit: string;
  make: string;
  model: string;
  manufactureYear: number;
  vin: string;
  vehicleFuelId: string | number;
  eldVehicleConnectionId: string | number;
  licensePlate?: LicensePlateRequest | null;
  carrierId: string;
}
