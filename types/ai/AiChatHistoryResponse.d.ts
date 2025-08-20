declare interface AiChatHistoryResponse {
  id: string;
	driverId: string;
	tabId: string;
	sessionId: string;
	message: string;
	messageType: number;
	dateTime: Dayjs | string;
}
