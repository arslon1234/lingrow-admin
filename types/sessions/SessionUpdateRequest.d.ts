declare interface SessionUpdateRequest {
	name: string;
	status: number;
	driverId: string;
	startDate: Dayjs;
	endDate: Dayjs;
}
