// declare interface AiEventReportsResponse {
// 	eventsRepaired: number;
// 	eventsFailedToFix: number;
// 	eventsModified: number;
// 	eventsUpdated: number;
// 	eventsCreated: number;
// 	eventsDeleted: number;
// 	eventReportsByActionType: AiEventReportsByActionType[];
// }

declare interface AiEventReportsResponse {
	eventsRepaired: number;
	categoriesFailedToFix: number;
	eventsModified: number;
	eventsUpdated: number;
	eventsCreated: number;
	eventsDeleted: number;
	fixedAnyEvents: number;
	failedCategories: number[];
	eventReportsByCategory: AiEventReportsByCategory[];
}