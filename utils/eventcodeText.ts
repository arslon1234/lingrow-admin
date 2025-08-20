import { EventType } from "./eventtype";

// EventType 1
const dutyStatusChangeMap: { [key: number]: string } = {
  [EventCodes.DutyStatusChangedToOffDuty]: 'Off Duty',
  [EventCodes.DutyStatusChangedToSleeperBerth]: 'Sleeper Berth',
  [EventCodes.DutyStatusChangedToDriving]: 'Driving',
  [EventCodes.DutyStatusChangedToOnDutyNotDriving]: 'On Duty'
};

// EventType 2
const intermediateLogMap: { [key: number]: string } = {
  [EventCodes.IntermediateLogWithConventionalLocationPrecision]: 'Intermediate w/ CLP',
  [EventCodes.IntermediateLogWithReducedLocationPrecision]: 'Intermediate w/ RLP',
};

// EventType 3
const personalUseMap: { [key: number]: string } = {
  [EventCodes.AuthorizedPersonalUse]: 'Personal Use',
  [EventCodes.YardMoves]: 'Yard Moves',
  [EventCodes.PersonalUseCleared]: 'Pers.Use Cleared'
};

// EventType 4
const driverCertificationMap: { [key: number]: string } = {
  [EventCodes.DriversCertificationOfDailyRecordFirst]: 'Certification (1)',
  [EventCodes.DriversCertificationOfDailyRecordSecond]: 'Certification (2)',
  [EventCodes.DriversCertificationOfDailyRecordThird]: 'Certification (3)',
  [EventCodes.DriversCertificationOfDailyRecordFourth]: 'Certification (4)',
  [EventCodes.DriversCertificationOfDailyRecordFifth]: 'Certification (5)',
  [EventCodes.DriversCertificationOfDailyRecordSixth]: 'Certification (6)',
  [EventCodes.DriversCertificationOfDailyRecordSeventh]: 'Certification (7)',
  [EventCodes.DriversCertificationOfDailyRecordEigth]: 'Certification (8)',
  [EventCodes.DriversCertificationOfDailyRecordNinth]: 'Certification (>=9)',
};

// EventType 5
const driverLoginLogoutMap: { [key: number]: string } = {
  [EventCodes.AuthenticatedDriverEldLoginEvent]: 'Login',
  [EventCodes.AuthenticatedDriverEldLogoutEvent]: 'Logout'
};

// EventType 6
const enginePowerDownMap: { [key: number]: string } = {
  [EventCodes.EnginePowerUpWithConventionalLocationPrecision]: 'Engine Power-up w/ CLP',
  [EventCodes.EnginePowerUpWithReducedLocationPrecision]: 'Engine Power-up w/ RLP',
  [EventCodes.EngineShutDownWithConventionalLocationPrecision]: 'Engine Shut-down w/ CLP',
  [EventCodes.EngineShutDownWithReducedLocationPrecision]: 'Engine Shut-down w/ RLP',
};

// EventType 7
const malfunctionDataDiagnosticMap: { [key: number]: string } = {
  [EventCodes.MalfunctionLogged]: 'Malfunc. Logged',
  [EventCodes.MalfunctionCleared]: 'Malfunc. Cleared',
  [EventCodes.DataDiagnosticLogged]: 'Data Diag. Logged',
  [EventCodes.DataDiagnosticCleared]: 'Data Diag. Cleared',
};

// All EVENTS
export const allEvents = [
  { label: 'Off Duty', eventCode: 1, eventType: 1 },
  { label: 'Sleeper Berth', eventCode: 2, eventType: 1 },
  { label: 'Driving', eventCode: 3, eventType: 1 },
  { label: 'On Duty', eventCode: 4, eventType: 1 },
  { label: 'Intermediate w/ CLP', eventCode: 1, eventType: 2 },
  { label: 'Intermediate w/ RLP', eventCode: 2, eventType: 2 },
  { label: 'Personal Use', eventCode: 1, eventType: 3 },
  { label: 'Yard Moves', eventCode: 2, eventType: 3 },
  { label: 'Pers.Use Cleared', eventCode: 0, eventType: 3 },
  { label: 'Certification (1)', eventCode: 1, eventType: 4 },
  { label: 'Certification (2)', eventCode: 2, eventType: 4 },
  { label: 'Certification (3)', eventCode: 3, eventType: 4 },
  { label: 'Certification (4)', eventCode: 4, eventType: 4 },
  { label: 'Certification (5)', eventCode: 5, eventType: 4 },
  { label: 'Certification (6)', eventCode: 6, eventType: 4 },
  { label: 'Certification (7)', eventCode: 7, eventType: 4 },
  { label: 'Certification (8)', eventCode: 8, eventType: 4 },
  { label: 'Certification (>=9)', eventCode: 9, eventType: 4 },
  { label: 'Login', eventCode: 1, eventType: 5 },
  { label: 'Logout', eventCode: 2, eventType: 5 },
  { label: 'Engine Power-up w/ CLP', eventCode: 1, eventType: 6 },
  { label: 'Engine Power-up w/ RLP', eventCode: 2, eventType: 6 },
  { label: 'Engine Shut-down w/ CLP', eventCode: 3, eventType: 6 },
  { label: 'Engine Shut-down w/ RLP', eventCode: 4, eventType: 6 },
  { label: 'Malfunc. Logged', eventCode: 1, eventType: 7 },
  { label: 'Malfunc. Cleared', eventCode: 2, eventType: 7 },
  { label: 'Data Diag. Logged', eventCode: 3, eventType: 7 },
  { label: 'Data Diag. Cleared', eventCode: 4, eventType: 7 },
]

// Main function to get the status text
export function getEventText(eventType: EventType, eventCode: number): string {
  switch (eventType) {
    // EventType 1
    case EventType.DutyStatusChange:
      return dutyStatusChangeMap[eventCode] || 'Unknown Duty Status Change';
    // EventType 2
    case EventType.IntermediateLog:
      return intermediateLogMap[eventCode] || "Unknown Intermediate Log";
    // EventType 3
    case EventType.ChangeInDriversIndicationOfAuthorizedPersonalUseOfCMVOrYardMoves:
      return personalUseMap[eventCode] || 'Unknown Personal Use';
    // EventType 4
    case EventType.DriversCertificationRecertificationOfRecords:
      return driverCertificationMap[eventCode] || 'Unknown Certification Record';
    // EventType 5
    case EventType.DriversLoginLogoutActivity:
      return driverLoginLogoutMap[eventCode] || 'Unknown Driver Login Logout Activity';
    // EventType 6
    case EventType.CMVsEnginePowerUpShutdownActivity:
      return enginePowerDownMap[eventCode] || 'Unknown Engine Power Shutdown Activity';

    // EventType 7
    case EventType.MalfunctionOrDataDiagnosticDetectionOccurrence:
      return malfunctionDataDiagnosticMap[eventCode] || 'Unknown Diagnostic Event';

    // Default
    default:
      return "Unknown Event Type";

  }
}

const dutyStatusIconTextMap: { [key: number]: string } = {
  1: 'text-warning',
  2: 'text-danger',
  3: 'text-success',
  4: 'text-primary',
  5: 'text-info', // default
  6: 'text-info', // default
};

// Main function to get the icon text class
export function getStatusIconClass(dutyStatus: number): string {
  return dutyStatusIconTextMap[dutyStatus] || 'text-info';
}

const eventTypeIconTextClassMap: { [key in EventType]: string } = {
  [EventType.DutyStatusChange]: 'icon-text-duty-status-change',
  [EventType.IntermediateLog]: 'icon-text-intermediate-log',
  [EventType.ChangeInDriversIndicationOfAuthorizedPersonalUseOfCMVOrYardMoves]: 'icon-text-personal-use',
  [EventType.DriversCertificationRecertificationOfRecords]: 'icon-text-certification',
  [EventType.DriversLoginLogoutActivity]: 'icon-text-login-logout',
  [EventType.CMVsEnginePowerUpShutdownActivity]: 'icon-text-engine-power',
  [EventType.MalfunctionOrDataDiagnosticDetectionOccurrence]: 'icon-text-diagnostic'
};

export function getIconTextClass(eventType: EventType, eventCode: number): string {
  let baseClass = eventTypeIconTextClassMap[eventType] || 'icon-text-unknown';

  if (eventType === EventType.DutyStatusChange) {
    if (eventCode === EventCodes.DutyStatusChangedToOffDuty) {
      baseClass = 'text-warning';
    } else if (eventCode === EventCodes.DutyStatusChangedToSleeperBerth) {
      baseClass = 'text-danger';
    } else if (eventCode === EventCodes.DutyStatusChangedToDriving) {
      baseClass = 'text-success';
    } else if (eventCode === EventCodes.DutyStatusChangedToOnDutyNotDriving) {
      baseClass = 'text-primary';
    }
  }

  return baseClass;
}