declare interface CarrierTerminalRequest {
  id?: string | null,
  timeZoneId: string;
  street: string;
  city: string;
  zipCode: string;
  issuerStateId: string;
}