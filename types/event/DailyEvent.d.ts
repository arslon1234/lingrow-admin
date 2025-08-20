declare interface DailyEvent {
  id: number;
  dateTime: Date;
  eventType: EventType;
  eventCode: number;
  eventRecordStatus: number | null;
  eventRecordOrigin: number | null;
  locationDescription: string | null;
  manualLocation: string | null;
  odometer: number;
  engineHours: number;
  notes?: string | null;
  status: string | null;
  duration: number;
  eventSequenceId: number;
  driverFullName: string | null;
  locationOrigin: number;
  parentId?: number | null;
}