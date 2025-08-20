declare interface BoostEventResponse {
	id: string;
	sequenceId: number;
	dateTime: string;
	certifiedDate: string | null;
	durationInSeconds: number;
	eventCode: number;
	eventType: number;
	eventCodeDescription: string;
	eventTypeDescription: string;
	isDOTInspected: boolean;
	calculatedLocation: string;
	manualLocation: string;
	recordStatus: number;
	recordOrigin: number;
	totalEngineHours: number;
	totalVehicleMiles: number;
	vehicleId: string;
	annotation: string;
	actionState: number;
	locationOrigin?: number | null;
	latitude: number | null;
	longitude: number | null;
	driverId: string;
	driver: DriverDetails;
	errorTitles?: string[];
	warningTitles?: string[];
}
