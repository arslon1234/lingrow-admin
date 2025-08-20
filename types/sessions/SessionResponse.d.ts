declare interface SessionResponse {
	id: string;
	type: number;
	carrierId: string;
	carrierName: string;
	driverId: string;
	driverName: string;
	status: number;
	operator: {
		id: string;
		firstName: string;
		lastName: string;
	};
	currentTime: Dayjs;
	startDate: Dayjs;
	endDate: Dayjs;
	isSubmitted: boolean;
	shiftDuration: number;
}
