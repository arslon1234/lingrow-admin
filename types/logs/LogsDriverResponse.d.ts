declare interface LogsDriverResponse {
	driverId: string;
	driverName: string;
	dateTime: Dayjs | string;
	hasViolation: true;
	events: BoostEventResponse[];
	resetPinTimes: ResetPinTimes[]
}
