declare interface CarrierTerminalResponse {
  id: string;
  timeZoneInfo: TimeZoneInfoResponse;
  street: string;
  city: string;
  zipCode: string;
  issuerState: IssuerStateResponse;
}