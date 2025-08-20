declare interface ViolationResponse {
  type: number;
  startedAt: string;
  violationDateTime: string;
  violationEventId: string;
  description: DescriptionResponse;
}