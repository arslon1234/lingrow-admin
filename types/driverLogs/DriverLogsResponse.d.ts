declare interface DriverLogsResponse {
	driverId: string;
	driverName: string;
	vehicleUnit: string | null;
	isConnected: boolean;
	eventCode: number;
	eventType: number;
	calculatedLocation: string | null;
	dateTime: Dayjs;
	violation: ViolationResponse | null;
	hosTimeRemainder: HosTimeRemainder;
}
