declare interface BoostEventMoveTimeRequest {
	moveEventTimeType: number;
	timeAmount: number;
	eventIds: string[];
	sessionId: string;
	tabId: string;
	eventsDurations: number[];
}
