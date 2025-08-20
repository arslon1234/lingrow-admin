declare interface AiChatAddRequest {
	driverId: string;
	tabId: string;
	sessionId: string;
	dateTime: Dayjs | string;
	message: string;
	messageType: number;
}
