declare interface DriverLogsDailyEventsResponse {
	id: string;
	dateTime: Dayjs;
	sequenceId: number;
	eventCode: number;
	eventType: number;
	durationInSeconds: number | null;
	locationOrigin?: number | null;
	calculatedLocation: string | null;
	manualLocation: string | null;
	totalVehicleMiles: number;
	totalEngineHours: number;
	annotation: string;
	recordOrigin: number;
	recordStatus: number;
}
