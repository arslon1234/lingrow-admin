declare interface Trip {
	bolNumber: string;
	trailerNumber: string;
	odometer: number;
	engineHours: number;
	dailyDistanceInMile: number;
	from: {
		latitude: number;
		longitude: number;
		address: string;
		locationType: number;
	};
	to: {
		latitude: number;
		longitude: number;
		address: string;
		locationType: number;
	};
	fuelLocations: [
		{
			latitude: number;
			longitude: number;
			address: string;
			locationType: number;
		}
	] | [];
}
