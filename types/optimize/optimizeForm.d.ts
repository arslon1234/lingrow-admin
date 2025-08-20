declare interface OptimizeEditStatus {
	id: number;
	eventId: string;
	event: any;
	startDate: any;
	origin: number | null;
	vehicle: string | null;
	vehicleId: string | null;
	odometer: number | null;
	engine_hours: number | null;
	location_origin: number | null;
	latitude: number | string | null;
	longitude: number | string | null;
	location: string | null;
	location_note: string | null;
	notes: string | null;
}
