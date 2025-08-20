declare interface CarrierResponse {
  id: string;
  name: string;
  usdotNumber: string;
  phoneNumber: string;
  email: string;
  street?: string | null;
  city?: string | null;
  zipCode?: string | null;
  address?: string | null;
  issuerStateId: string;
  issuerState: IssuerStateResponse;
  timeZoneInfo: TimeZoneInfoResponse;
  carrierTerminals: CarrierTerminalResponse[];
  carrierDriverLogSetting: CarrierDriverLogSetting;
  provider: ServiceProviderResponse;
}