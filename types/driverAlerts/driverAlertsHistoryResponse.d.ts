declare interface DriverAlertsHistoryResponse {
	id: string,
	driverId: string,
	musicType: number,
	musicTypeDescription: string,
	dateTime: string | Dayjs,
	status: number
}