declare interface DvirAddRequest {
	driverId: string;
	dateTime: Dayjs;
	location: string;
	odometer: number;
	remarks: string;
	dvirStatusId: string;
	vehicleId: string;
	vehicleDefectIds: Array<string>;
	trailers: Array<string>;
	trailerDefectIds: Array<string>;
	signaturePath: string;
}
