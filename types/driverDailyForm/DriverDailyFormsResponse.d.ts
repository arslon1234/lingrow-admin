declare interface DriverDailyFormsResponse {
	id: string;
	driver: DriverResponse;
	assignedVehicles: VehicleResponse[];
	trailers: string[];
	shippingDocuments: string[];
	coDriver: DriverResponse;
	certifiedDate: Dayjs;
	formDate: Dayjs;
  carrier: CarrierResponse;
	signaturePath: string;
	modifiedSignatureCount: number;
}
