declare interface DriverLogsWeeklyViolationResponse {
	dateOfViolations: Dayjs;
	violations: ViolationResponse[] | Array<undefined>;
}
