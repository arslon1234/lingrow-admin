declare interface TrackingResponse {
	eventId: string;
	eventCode: number;
	eventType: number;
	calculatedLocation: string;
	manualLocation: string;
	latitude: number;
	longitude: number;
	startTime: Dayjs | string;
	endTime: Dayjs | string;
	duration: number;
	vehicleMiles: number;
	vehicleSpeed: number;
	vehicleUnit: string;
	annotation: string;
}
