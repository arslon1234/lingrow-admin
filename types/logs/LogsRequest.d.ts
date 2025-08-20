declare interface LogsRequest {
  fromDateTimeInUtc: string;
  toDateTimeInUtc: string;
  driverId?: string | null;
  violations: boolean;
  formManner: boolean;
  sortByDate: boolean;
  currentPage: number;
}