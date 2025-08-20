declare interface LogDriverResponse {
	dateTime: Dayjs | string;
	driverId: string;
	driverName: string;
	dailyDriving: number;
	dailyOnDuty: number;
	hasViolation: boolean;
}

declare interface EditDriverDailyForm {
	coDrivers: string;
	shippingDocs: string;
	trailers: string;
	signaturePath: string;
}