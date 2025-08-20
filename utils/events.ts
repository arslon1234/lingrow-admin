const events = [
  { key: 'offduty', label: 'Off duty', color: '#A99990', eventCode: 1, eventType: 1 },
  { key: 'onduty', label: 'On duty', color: '#C89D45', eventCode: 4, eventType: 1 },
  { key: 'sleeper', label: 'Sleeper', color: '#5F75B4', eventCode: 2, eventType: 1 },
  { key: 'driving', label: 'Driving', color: '#73AE71', eventCode: 3, eventType: 1 },
  { key: 'ym', label: 'YM', color: '#B09152', eventCode: 2, eventType: 3 },
  { key: 'pc', label: 'PC', color: '#9E9D9C', eventCode: 1, eventType: 3 }
];

const findEventByTypeAndCode = (eventType: number, eventCode: number) => {
  return events.find((event: any) => event.eventType === eventType && event.eventCode === eventCode);
};

// ######################################

// TC -> D
// T - Event type
// C - Event Code
// D - Duty number
// TC - decimal number
const dutyMapper: { [key: number]: number } = {
  31: 5,
  11: 1,
  12: 2,
  13: 3,
  14: 4,
  32: 6,
};

// Yard move come within on duty
// Personal use come within off duty 
const getEventCodeText = (duty: number) => {
  switch (duty) {
    case 1:
    case 6:
      return "OffDuty";
    case 2:
      return "SleeperBerth";
    case 3:
      return "Driving";
    case 4:
    case 5:
      return "OnDuty";
  }
};

const getDutyOrder = (eventType: number, eventCode: number): number => {
  return dutyMapper[10 * eventType + eventCode];
};

// ######################################

// Certification
const isCertificationEvent = (event: any) => {
  return event.eventType == 4;
}; 

// Driving or Intermediate
const isDrivingorIntermediateEvent = (event: any) => {
  return isDrivingEvent(event) || isIntermediateEvent(event);
};

// Driving
const isDrivingEvent = (event: any) => {
  return (event.eventType == 1 && event.eventCode == 3);
};

// Intermediate
const isIntermediateEvent = (event: any) => {
  return (event.eventType == 2 && event.eventCode == 1);
};

export { dutyMapper, events, findEventByTypeAndCode, getDutyOrder, getEventCodeText, isCertificationEvent, isDrivingEvent, isDrivingorIntermediateEvent, isIntermediateEvent };

