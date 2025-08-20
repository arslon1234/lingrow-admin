declare interface DvirRequest extends PaginationRequest {
	startDate: Dayjs | string;
	endDate: Dayjs | string;
	vehicleId: string | null;
	driverId: string | null;
	carrierId: string;
}
