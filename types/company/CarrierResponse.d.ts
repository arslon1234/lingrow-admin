declare interface CarrierResponse {
  id: string;
  name: string;
  usdotNumber: string;
  timeZoneInfo: TimeZoneInfoResponse;
  street: string;
  city: string;
  zipCode: string;
  issuerState: IssuerStateResponse;
  carrierTerminals: CarrierTerminalResponse[];
  driverDefaultLogSettings: DriverDefaultLogSettingsResponse;
  provider: ServiceProviderResponse;
  drivers: DriverResponse[];
}