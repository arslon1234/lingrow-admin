namespace EventCodes {
  // Duty Status Change Codes - EventType 1
  export const DutyStatusChangedToOffDuty = 1;
  export const DutyStatusChangedToSleeperBerth = 2;
  export const DutyStatusChangedToDriving = 3;
  export const DutyStatusChangedToOnDutyNotDriving = 4;

  // Intermediate Log Events Codes - EventType 2
  export const IntermediateLogWithConventionalLocationPrecision = 1;
  export const IntermediateLogWithReducedLocationPrecision = 2;

  // Authorized personal use of CMV or yard moves Codes - EventType 3
  export const AuthorizedPersonalUse = 1;
  export const YardMoves = 2;
  export const PersonalUseCleared = 0;

  // Driver certification/re-certification of records Codes - EventType 4
  export const DriversCertificationOfDailyRecordFirst = 1;
  export const DriversCertificationOfDailyRecordSecond = 2;
  export const DriversCertificationOfDailyRecordThird = 3;
  export const DriversCertificationOfDailyRecordFourth = 4;
  export const DriversCertificationOfDailyRecordFifth = 5;
  export const DriversCertificationOfDailyRecordSixth = 6;
  export const DriversCertificationOfDailyRecordSeventh = 7;
  export const DriversCertificationOfDailyRecordEigth = 8;
  export const DriversCertificationOfDailyRecordNinth = 9;

  // Driver Login/Logout Codes - EventType 5
  export const AuthenticatedDriverEldLoginEvent = 1;
  export const AuthenticatedDriverEldLogoutEvent = 2;

  // CMV's engine power up / shut down activity - Eventype 6
  export const EnginePowerUpWithConventionalLocationPrecision = 1;
  export const EnginePowerUpWithReducedLocationPrecision = 2;
  export const EngineShutDownWithConventionalLocationPrecision = 3;
  export const EngineShutDownWithReducedLocationPrecision = 4;

  // A malfunction or data diagnostic detection occurrence - EventType 7
  export const MalfunctionLogged = 1;
  export const MalfunctionCleared = 2;
  export const DataDiagnosticLogged = 3;
  export const DataDiagnosticCleared = 4;
}

const EventCodesInEventTypes: Record<number, number[]> = {
  1: [1, 2, 3, 4],
  2: [1, 2],
  3: [1, 2, 0],
  4: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  5: [1, 2],
  6: [1, 2, 3, 4],
  7: [1, 2, 3, 4],
}

const flatEventCodesInEventTypes = Object.keys(EventCodesInEventTypes).map(key => EventCodesInEventTypes[+key.toString()].map(item => [key, item])).flat();

const disableOriginByCodeAndEvent = (eventType: number, eventCode: number, eventRecordOrigin: number): boolean => {
  const calc: number = eventType * 100 + eventCode * 10 + eventRecordOrigin;
  const arr =
    [111, 121, 124, 212, 213, 222, 223, 311, 314, 321, 324, 411, 413, 414, 421,
      423, 424, 431, 433, 434, 441, 443, 444, 451, 453, 454, 461, 463, 464, 471,
      473, 474, 481, 483, 484, 491, 493, 494, 513, 514, 523, 524, 612, 613,
      622, 623, 632, 633, 642, 643];
  return arr.includes(calc);
};

const TimeZones: Record<number, string> = {
  1: "Pacific Standard Time",
  2: "US Eastern Standard Time",
  3: "Central Standard Time",
  4: "Mountain Standard Time"
};

// Record Origin
const EventRecordOrigins: Record<number, string> = {
  1: 'Auto',
  2: 'Driver',
  3: 'Other user',
  4: 'Unidentified driver',
};

// Record status
const EventRecordStatuses: Record<number, string> = {
  1: 'Active',
  2: 'Inactive',
  3: 'Inactive requested',
  4: 'Inactive rejected',
};


export { EventCodes, EventRecordOrigins, EventRecordStatuses, TimeZones, disableOriginByCodeAndEvent, flatEventCodesInEventTypes };