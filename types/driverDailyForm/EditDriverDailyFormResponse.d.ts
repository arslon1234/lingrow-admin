declare interface EditDriverDailyFormResponse {
	id: string;
	trailers: string[];
	shippingDocuments: string[];
	formDate: Dayjs | string;
	isCertified: boolean;
	hasCoDriver: boolean;
}
