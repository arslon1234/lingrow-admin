declare interface MonitoringDrivers {
	driverId: string;
	driverName: string;
	vehicleId: string;
	vehicleUnit: string;
	eventCode: number;
	eventType: number;
	dateTime: string | Dayjs;
	hasViolation: boolean;
	isCertified: boolean;
	hosTimeRemainder: HosTimeRemainder;
	hosRecords?: Array<HosRecord>;
	events?: Array<BoostEventResponse>
	resetPinTimes?: ResetPinTimes[]
}
