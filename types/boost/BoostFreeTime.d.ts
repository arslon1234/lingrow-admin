declare interface BoostFreeTime {
	eventId: string;
	eventType: number;
	eventCode: number;
	eventDateTime: Dayjs | string;
	startedFreeTime: Dayjs | string;
	endedFreeTime: Dayjs | string;
	freeDurationInSeconds: number;
	eventDurationInSeconds: number;
	startPosition: number;
	endPosition: number;
}