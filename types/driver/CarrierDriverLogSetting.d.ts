declare interface CarrierDriverLogSetting {
	id: string;
	exemptDriver: boolean;
	hosRule: Name;
	cargoType: Name;
	restart: Name;
	restBreak: Name;
	shortHaulException: boolean;
	allowYardMoves: boolean;
	allowPersonalUse: boolean;
	startingTime24HourPeriod: string | null;
	allowIFTA: boolean;
	allowTracking: boolean;
}
