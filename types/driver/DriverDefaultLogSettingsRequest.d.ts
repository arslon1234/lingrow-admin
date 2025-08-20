declare interface DriverDefaultLogSettingsRequest {
  exemptDriver?: boolean | null;
  hosRuleId?: string | null;
  cargoTypeId?: string | null;
  restartId?: string | null;
  restBreakId?: string | null;
  shortHaulException?: boolean | null;
  allowYardMoves?: boolean | null;
  allowPersonalUse?: boolean | null;
  startingTime24HourPeriod: string | null;
  allowIFTA: boolean;
  allowTracking: boolean;
}