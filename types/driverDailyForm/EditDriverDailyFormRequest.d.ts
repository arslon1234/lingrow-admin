declare interface EditDriverDailyFormRequest {
	driverId: string;
	assignedVehicleIds: string[];
	trailers: string[];
	shippingDocuments: string[];
	coDriverId: string | null;
	formDate: Dayjs;
	certifiedDate: Dayjs;
	signaturePath: string | null;
	tabId: string;
	sessionId: string;
}