declare interface TimeZoneResponse {
  id: string;
  offset: number;
  displayName: string;
  daylightName: string;
  shortName?: string | null;
  ianaId?: string | null;
}