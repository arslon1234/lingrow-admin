declare interface AuditRequest {
	carrierId: string;
	driverId: string;
	trips: Array<Trip>;
	startDate: Dayjs | string;
	startTime: {hours: number, minutes: number, seconds: number} | string;
}
