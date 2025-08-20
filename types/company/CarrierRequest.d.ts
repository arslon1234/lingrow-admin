declare interface CarrierRequest {
  providerId: string;
  name: string;
  usdotNumber: string;
  timeZoneId: string;
  phoneNumber: string;
  email: string;
  street: string;
  city: string;
  zipCode: string;
  issuerStateId: string;
  carrierTerminals: CarrierTerminalRequest[];
  carrierDriverLogSetting: DriverDefaultLogSettingsRequest | null;
}