declare interface UnidentifiedEventsResponse {
	eventIds: Array<string>;
	vehicleId: string;
	vehicleUnit: string;
	totalMiles: number;
	dateTime: Dayjs | string;
	durationInSeconds: number;
	startedLocation: string;
	endedLocation: string;
	eventCode: number | null;
	eventType: number | null;
}
