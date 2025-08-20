declare interface DotInspectionCreateRequest {
	carrierId: string,
	driverId: string,
	startDate: Dayjs | string,
	endDate: Dayjs | string,
	description: string,
	status: number | null
}