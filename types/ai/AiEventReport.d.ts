declare interface AiEventReport {
	sessionId: string;
	tabId: string;
	prevEventId: string;
	curEventId: string;
	parentId: string;
	eventCode: number;
	eventType: number;
	dateTime: Dayjs | string;
	movedDuration: number;
	totalDuration: number;
	calculatedLocation?: string | null;
	manualLocation?: string | null;
	actionState: number;
	dateTimeChanged?: Dayjs | string | null;
	engineHoursChanged?: number | null;
	vehicleMilesChanged?: number | null;
	locationChanged?: string | null;
	tabActionType?: number | null;
}
