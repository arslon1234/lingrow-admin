declare interface EveryTrackingResponse {
	driverId: string;
	vehicleId: string;
	latitude: number | null;
	longitude: number | null;
	status: number;
	locationType: number;
	currentTime: Dayjs | string;
}
