declare interface EventsByOtherRequest {
  driverId?: string | null;
  eventType: number;
  eventCode: number;
  startTime: string | Dayjs;
  endTime: string | Dayjs;
  locationOrigin?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  calculatedLocation?: string | null;
  manualLocation?: string | null;
  annotation: string;
  totalVehicleMiles: number;
  totalEngineHours: number;
  vehicleId?: string | number;
}

// driverId: null,
// vehicleId: null,
// eventType: 0,
// eventCode: 0,
// startTime: '',
// endTime: '',
// latitude: null,
// longitude: null,
// calculatedLocation: null,
// manualLocation: null,
// annotation: '',
// totalVehicleMiles: 0,
// totalEngineHours: 0,
