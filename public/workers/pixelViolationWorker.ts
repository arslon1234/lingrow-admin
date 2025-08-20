import { getEventViolationsBlock } from '@/utils/violation';

export interface ViolationWorkerParams {
  violations: ViolationPixelResponse[];
  type: string;
  resetPinTimes: ResetPinTimes[];
  stringType: string;
  headerDate: string;
  endTime: string;
  screenResolution: number;
}

self.addEventListener('message', function(e) {
  const violationsArray = e.data; // array of 4 violations
  const results = violationsArray.map((v:ViolationWorkerParams) => {
    const [violations, blocks] = getEventViolationsBlock(v);
    return {
      stringType: v.stringType, // muhim
      violations,
      violationBlocks: blocks
    };
  });
  self.postMessage(results);
});
