declare interface HomeTerminalResponse {
  id: string;
  timeZoneInfo: TimeZoneInfoResponse;
  street: string;
  city: string;
  zipCode: string;
  issuerState: IssuerStateResponse;
}