declare interface DotInspectionsResponse {
	id: string,
	providerId: string,
	providerName: string,
	carrierId: string
	carrierName: string,
	driverId: string
	driverName: string,
	startDate: Dayjs | string,
	endDate: Dayjs | string,
	description: string,
	status: number,
	dateTime: Dayjs | string
}