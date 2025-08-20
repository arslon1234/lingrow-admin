declare interface HosRecord {
	dateTime: string | Dayjs;
	dailyDriving: number;
	dailyOnDuty: number;
	hasViolation: boolean;
	isCertified: boolean;
	hasDriverDailyForm: boolean;
}
