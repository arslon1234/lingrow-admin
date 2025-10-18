// Violation descriptions
enum OfficialViolations {
    Shift = "14 - Hour on duty limit",
    Driving = "11 - Hour on driving limit",
    Cycle = "USA 70/8 - cycle limit",
    RestBreak = "30 Minutes rest break",
}; 

enum ResetPinTimesEnum {
    Shift = "10h",
    Cycle = "34h"
};

const violationTypeToDesc: Record<string, OfficialViolations> = Object.freeze(Object.fromEntries([
    [ResetPinTimesEnum.Shift, OfficialViolations.Shift],
    [ResetPinTimesEnum.Cycle, OfficialViolations.Cycle]
]));

const violationDescToType: Record<string, ResetPinTimesEnum> = Object.freeze(Object.fromEntries([
    [OfficialViolations.Shift, ResetPinTimesEnum.Shift],
    [OfficialViolations.Cycle, ResetPinTimesEnum.Cycle]
]));   

function getViolationDescByType(type: string): OfficialViolations | null {
    return violationTypeToDesc[type as ResetPinTimesEnum] ?? null;
}

function getViolationTypeByDesc(stringType: string): ResetPinTimesEnum | null {
    return violationDescToType[stringType as OfficialViolations] ?? null;
}

function getEventViolationsBlock(e: { 
    violations: ViolationPixelResponse[];
    type: string;
    resetPinTimes: ResetPinTimes[];
    stringType: string;
    headerDate: string;
    endTime: string; 
    screenResolution: number; 
}): [ViolationPixelResponse[], [number, number][]] {
    let { violations, type, resetPinTimes, stringType, headerDate, endTime, screenResolution } = e;  
    
    console.log("screenResolution", screenResolution);
    console.log("violations before filter", violations.length);

    // Filtering for necessary type
    const currViolations = violations?.filter(v => v?.description == stringType); 
    violations = violations?.filter(v => v?.description !== stringType);

    // Filtering for necessary type
    const currPintimes = parseInt(type) == 34 ? resetPinTimes?.filter(r => r?.type == type) : resetPinTimes; 

    // Sorting in inreasing order 
    if (currViolations.length > 0) {
        currViolations.sort((x: ViolationPixelResponse, y: ViolationPixelResponse) => 
            2 * Number(x.startedAt.localeCompare(y.startedAt)) - 1
        ); 
    }

    // Sorting in inreasing order 
    if (currPintimes.length > 0) {
        currPintimes.sort((x, y) => 
           2 * Number(x.time.localeCompare(y.time)) - 1
        );
    }

    // Answer
    const newViolations: [number, number][] = [];

    if (currViolations.length == 0) {
        return [violations, newViolations];
    }

    // Pointers and sizes for arrays
    let i: number = 0;
    const n: number = currViolations.length;

    let j: number = 0;
    const m: number = currPintimes.length;

    while (i < n && j < m) {
        const violationStartPixel: number = currViolations[i].position;

        while (j < m && currPintimes?.[j]?.time.localeCompare(currViolations[i].startedAt) < 0) {
            j++;
        }

        if (j >= m) {
            break;
        }

        // const violationTime: number = getDateStringSeconds(currViolations[i].startedAt) - getDateStringSeconds(headerDate) - parseInt(type) * 3600;
        // const violationEndPixel: number = convertSecondsToPixels(screenResolution, violationTime); 
        const violationEndPixel: number = currPintimes?.[j]?.prevPosition;
        
        console.log("Violation block type, start and end times", stringType, type, currViolations[i].startedAt, currPintimes?.[j]?.time, new Date((new Date(currPintimes?.[j]?.time).getTime() / 1000 - parseInt(type) * 3600) * 1000), violationStartPixel, violationEndPixel);
        newViolations.push([violationStartPixel, violationEndPixel - violationStartPixel]); 
        violations.push(currViolations[i]);

        while (i < n && currViolations[i].startedAt.localeCompare(currPintimes?.[j]?.time) <= 0) {
            i++; 
        }
        
        j++;
    }

    if (i < n) {
        const violationStartPixel: number = currViolations[i].position;
      
        // const violationTime: number = getDateStringSeconds(endTime) - getDateStringSeconds(headerDate) - parseInt(type) * 3600;
        // const violationEndPixel: number = convertSecondsToPixels(screenResolution, violationTime); 

        const violationEndSeconds = getDateStringSeconds(endTime) - getDateStringSeconds(headerDate) - parseInt(type) * 3600;
        const violationEndPixel: number = violationEndSeconds / (getDateStringSeconds(currViolations[i].startedAt) - getDateStringSeconds(headerDate)) * currViolations[i].position;

        console.log("Violation block type, start and end times, screenResolution -> ", stringType, type, currViolations[i].startedAt, endTime, new Date((new Date(endTime).getTime() / 1000 - parseInt(type) * 3600) * 1000), violationStartPixel, violationEndPixel, screenResolution);
        newViolations.push([violationStartPixel, violationEndPixel - violationStartPixel]);
        violations.push(currViolations[i]);
    }

    // console.log(currViolations, currPintimes, "violations", "pintimes");
    // console.log(newViolations, "filtered");
    return [violations, newViolations];
}

export { OfficialViolations, ResetPinTimesEnum, getEventViolationsBlock, getViolationDescByType, getViolationTypeByDesc };
