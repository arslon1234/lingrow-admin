declare interface VehicleResponse {
	id: string;
	macAddress: string | null;
	make: string | null;
	model: string | null;
	serialNumber: string | null;
	status: boolean;
	unit: string | null;
	vin: string | null;
}
