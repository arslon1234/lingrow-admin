declare interface LastTrackingResponse {
	driverDetails: DriverDetails;
	eventType: number;
	eventCode: number;
	calculatedLocation: string;
	manualLocation: string;
	latitude: number;
	longitude: number;
	vehicleSpeed: number;
}
