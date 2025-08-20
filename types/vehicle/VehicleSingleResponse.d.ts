declare interface VehicleSingleResponse {
	id?: string | null;
	unit: string;
	make: string;
	model: string;
	manufactureYear?: number | null;
	vin: string;
	vehicleFuel: Name;
	licensePlate: LicensePlateResponse;
	eldVehicleConnection: Name;
}
