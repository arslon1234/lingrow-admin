declare interface BoostEventAddUpdateRequest {
	tabId: string;
	sessionId: string;
	driverId: string;
	vehicleId: string;
	sequenceId: number;
	recordStatus: number;
	recordOrigin: number;
	eventType: number;
	eventCode: number;
	dateTime: Dayjs | string;
	totalVehicleMiles: number;
	totalEngineHours: number;
	locationOrigin?: number | null;
	latitude: number | null;
	longitude: number | null;
	calculatedLocation: string | null;
	manualLocation: string | null;
	annotation: string | null;
	certifiedDate?: string | null;
}

declare interface BoostEventStatusForm {
	id: number;
	eventId: string;
	event: { eventCode: number | null; eventType: number | null };
	startDate: Dayjs | string;
	origin: number | null;
	vehicle: string | null;
	vehicles: VehicleResponse[];
	vehicleId: string | null;
	odometer: number | null;
	engine_hours: number | null;
	location_origin: number | null;
	latitude: number | string | null;
	longitude: number | string | null;
	location: string | null;
	location_note: string | null;
	notes: string | null;
	certifiedDate: string | null;
}

declare interface BoostEventEditProfile {
	popover: boolean;
	date: Dayjs;
	co_drivers: DriverInfosResponse[];
	co_driver: string | null;
	trailer: string | null;
	shipping_docs: string | null;
	signature: string | null;
	dailyFormId: string | null;
	assignedVehicleIds: string[] | [];
}
