declare interface LogsResponse {
	driverId: string;
	fullName: string;
	phone: string;
	email: string;
	hosRuleName: string;
	macAddress: string;
	drivingState: DriverState;
	recap: Recap;
	violations: ViolationResponse[];
	violationsByDate: {
		date: string;
		violations: ViolationResponse[];
	}[];
	lastFourteenDaysDrivingSummary: DrivingSummaryResponse[];
	currentDailySummary: DailySummaryResponse;
}

declare interface EditDutyEvent {
	x1: number;
	x2: number;
	eventCode: number;
	eventType: number;
	duration: number;
}

declare interface EditEvents {
	hours: number;
	minutes: number;
	seconds: number;
}
declare interface HistoryTransferForm {
	dateRange: any[];
	dateRangeSubmit: boolean;
}

declare interface LogsState {
	loading: boolean;
	modals: {
		editProfileModal: boolean;
		statusModal: boolean;
		driverLogsModal: boolean;
		historyTransferEventsModal: boolean;
		historyTransferLogsByPeriodModal: boolean;
	};
	ui: {
		trackingCollapse: boolean;
		selectedToggle: boolean;
		screenResolution: number;
	};
	driver: {
		searchDriver: string;
		driverListFiltered: any;
		selectedDriver: string;
	};
	event: {
		editEventId: string | number | null;
		editEventType: string | number | null;
		editEventCode: string | number | null;
		editEventStatus: string;
		editEventStart: { hours: number; minutes: number; seconds: number };
		editEventEnd: { hours: number; minutes: number; seconds: number };
	};
	table: {
		selectedRow: any[];
	};
	action: {
		statusAction: string;
	};
}

declare interface LogsForm {
	historyTransferForm: HistoryTransferForm;
	statusForm: EventsByOtherRequest;
	editDriverDailyForm: EditDriverDailyForm;
}
declare interface LogsApiModels {
	modelChart: DriverDateTimeRequest;
	editModelChart: DriverDateTimeRequest;
	modelDailyEvents: DriverLogsDailyEventsRequest;
	modelWeeklyViolations: DriverLogsDailyEventsRequest;
}

declare interface LogsTableColumns {
	key: string;
	label: string;
	class?: string;
}
