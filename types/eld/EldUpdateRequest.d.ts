declare interface EldUpdateRequest {
  carrierId?: string | null;
  applyToAllELDs: boolean;
  eldId?: string | null;
  firmwareVersion?: string | null;
}

declare interface EldSetUpdateRequest {
  eldDeviceId?: string | null;
  eldFileId?: string | null;
}