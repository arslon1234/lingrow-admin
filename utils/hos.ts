// ranges containing and intersecting
const contains = (l: number, r: number, x: number, y: number): boolean => {
  return l < x && y < r;
};

const intersectsPos = (l: number, r: number, x: number, y: number): number => {
  if (Math.max(l, x) > Math.min(r, y)) {
    return -1;
  }
  if (x < l) {
    return 1;
  } else {
    return 2;
  }
};

const firstFoundEventAfterPos = (boundX: number, dutyTimes: any, dutyInd: number | string) => {
  if (!dutyTimes.duties[dutyInd] || !dutyTimes.duties[dutyInd].length) return null;

  let duties = JSON.parse(JSON.stringify(dutyTimes.duties[dutyInd]));
  duties = duties.filter((duty: any) => duty.x1 >= boundX);

  // console.log("driving after duties", boundX, duties);

  if (!duties.length) return null;

  let ans = Math.min(...duties.map((duty: any) => duty.x1));

  return boundX <= ans ? ans : null;
}

const lastFoundEventBeforePos = (boundX: number, dutyTimes: any, dutyInd: number | string) => {
  if (!dutyTimes.duties[dutyInd] || !dutyTimes.duties[dutyInd].length) return null;

  let duties = JSON.parse(JSON.stringify(dutyTimes.duties[dutyInd]));
  duties = duties.filter((duty: any) => duty.x2 <= boundX);

  // console.log("driving before duties", boundX, duties);

  if (!duties.length) return null;

  let ans = Math.max(...duties.map((duty: any) => duty.x2));

  return boundX >= ans ? ans : null;
}

const overlapsWithDrivingEvents = (startTime: string, endTime: string, chartData: GraphResponse | undefined, screenResolution: number): boolean => {
  if (chartData === undefined) return false;
  const startPixels: number = convertDateToPixel(screenResolution, startTime);
  const endPixels: number = convertDateToPixel(screenResolution, endTime);
  
  const drivingGraphDuties = chartData.duties['3'];
  const overlapping: boolean = drivingGraphDuties?.some(drDuty => Math.max(drDuty.x1, startPixels) < Math.min(drDuty.x2, endPixels));
  console.log("overlapping with driving event", overlapping);
  return overlapping;
};

// Converts pixels to HH:MM:SS
const convertPixelToDate = (screenResolution: number, pixels: number): string => {
  const seconds: number = convertPixelstoSeconds(screenResolution, pixels);
  const h: string = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m: string = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s: string = Math.floor(seconds % 60).toString().padStart(2, '0');

  // console.log(`Pixels: ${pixels}, Time: ${h}:${m}:${s}, Screen Resolution: ${screenResolution}`);

  return `${h}:${m}:${s}`;
};

// Converts HH:MM:SS to pixels
const convertDateToPixel = (screenResolution: number, date: string): number => {
  let totalSeconds: number = convertToSeconds(date);
  if (totalSeconds >= 86400) totalSeconds = 85399;

  const pixels = convertSecondsToPixels(screenResolution, totalSeconds);

  // console.log(`Time: ${date}, Total Seconds: ${totalSeconds}, Pixels: ${pixels}, Screen Resolution: ${screenResolution}`);

  return pixels;
};

export { contains, convertDateToPixel, convertPixelToDate, firstFoundEventAfterPos, intersectsPos, lastFoundEventBeforePos, overlapsWithDrivingEvents };

