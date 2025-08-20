declare interface DriverAlertsResponse {
	driverId: string,
	firstName: string,
	lastName: string,
	eventCode: number,
	eventType: number,
	dateTime: Dayjs | string,
	vehicleUnit: string,
	isConnected: boolean,
	totalVehicleMiles: number
}