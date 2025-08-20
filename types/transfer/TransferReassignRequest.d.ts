declare interface TransferReassignRequest {
	driverId: string;
	startDate: Dayjs | string;
	endDate: Dayjs | string;
	assignedDriverId: string;
	eventIds: string[];
}
