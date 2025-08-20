// /** IMPORTING SERVICES **/
// import { processEventsPowerUpShutDownNew } from "./powerUpShutDownModule/powerUpShutDownNew";

// 1. CERTIFICATION
// import { collectCertificationErrors } from './certification/certificationIssues';
import { collectCertificationErrorsNew } from "./certification/certificationIssuesNew";

// // 2. ENGINE HOURS
// import { checkEngineHoursErrors } from './engineHoursModule/engineHoursErrors';
import { processEngineHoursAndStatusNew } from './engineHoursModule/engineHoursIncorrectNew';

// 3. INCORRECT EVENT PLACEMENT
import { checkIncorrectEventPlacementNew } from './incorrectEventPlacementModule/incorrectEventPlacementNew';

// // // 4. INTERMEDIATE MISSING
// import { processEntriesIntermediateMissing } from './intermediateMissingModule/intermediateMissing';
import { processEntriesIntermediateMissingNew } from './intermediateMissingModule/intermediateMissingNew';

// // 5. LOGIN LOGOUT
import { processLoginLogoutEvents } from './loginLogoutModule/loginLogoutWarning';

// 6. ODOMETER
import { checkOdometerErrors } from './odometerModule/odometerErrors';
import { checkForOdometerJumpAndLocationChanged } from './odometerModule/odometerJumpLocationChanged';

// // 7. POWER UP SHUT DOWN
// import { processEventsPowerUpShutDown } from './powerUpShutDownModule/powerUpShutDown';
import { processEventsPowerUpShutDownNew } from "./powerUpShutDownModule/powerUpShutDownNew";

// 8. PTI
import { processEventsPtiCheckNew } from "./ptiCheckModule/ptiChecknew";

// 9. SPEED LIMIT
import { checkSpeedLimit } from './speedModule/speedLimit';

// // 10.  TWO IDENTICAL EVENTS
// import { processEventsTwoIdentical } from './twoIdenticalEventsModule/twoIdenticalEvents';
// import { processEventsTwoIdenticalNew } from './twoIdenticalEventsModule/twoIdenticalEventsNew.js';
import { engineHoursAndLoginLogoutErrors } from './mergedMethods/EngineHoursAndLoginLogoutErrorsCollection.js';
import { processEventsTwoIdenticalNew } from './twoIdenticalEventsModule/twoIdenticalEventsNew';

// 11. WARNINGS
// import { checkEventWarnings } from './warningModule/warnings';

/** ASYNC FUNCTION TO COLLECT WARNINGS AND ERRORS **/
function collectEventWarningAndErrors(events, pinTimes) {
	try {
		console.time('collectEventWarningAndErrors');

		//Run each method sequentially and log timing for each step.

		console.time('processLoginLogoutEvents');
		processLoginLogoutEvents(events);
		console.timeEnd('processLoginLogoutEvents');

		console.time('engineHoursAndLoginLogoutErrors');
		engineHoursAndLoginLogoutErrors(events);
		console.timeEnd('engineHoursAndLoginLogoutErrors');
		
		console.time('collectCertificationErrors new');
		collectCertificationErrorsNew(events);
		console.timeEnd('collectCertificationErrors new');
		
		console.time('processEngineHoursAndStatus new');
		processEngineHoursAndStatusNew(events);
		console.timeEnd('processEngineHoursAndStatus new');
		
		console.time('checkIncorrectEventPlacement new');
		checkIncorrectEventPlacementNew(events);
		console.timeEnd('checkIncorrectEventPlacement new');
		
		console.time('processEntriesIntermediateMissing new');
		processEntriesIntermediateMissingNew(events);
		console.timeEnd('processEntriesIntermediateMissing new');
		
		console.time('checkOdometerErrors');
		checkOdometerErrors(events);
		console.timeEnd('checkOdometerErrors');
		
		console.time('checkForOdometerJumpAndLocationChanged');
		checkForOdometerJumpAndLocationChanged(events);
		console.timeEnd('checkForOdometerJumpAndLocationChanged');
		
		console.time('processEventsPowerUpShutDown new');
		processEventsPowerUpShutDownNew(events, pinTimes);
		console.timeEnd('processEventsPowerUpShutDown new');
		
		console.time('processEventsPtiCheck new');
		processEventsPtiCheckNew(events, pinTimes);
		console.timeEnd('processEventsPtiCheck new');
		
		console.time('checkSpeedLimit');
		checkSpeedLimit(events);
		console.timeEnd('checkSpeedLimit');

		console.time("process two identical new");
		processEventsTwoIdenticalNew(events);
		console.timeEnd("process two identical new");


		// ### process entries intermediate missing
		// console.time('processEntriesIntermediateMissing');
		// processEntriesIntermediateMissing(events);
		// console.timeEnd('processEntriesIntermediateMissing');
		
		// console.log("#################");
		
		// console.time('processEntriesIntermediateMissingNEw');
		// processEntriesIntermediateMissingNew(events);
		// console.timeEnd('processEntriesIntermediateMissingNEw');


		// ### two identical
		// const freshEventsForNew = JSON.parse(JSON.stringify(events));
		// console.time('processEventsTwoIdenticalNew');
		// processEventsTwoIdenticalNew(events);
		// console.timeEnd('processEventsTwoIdenticalNew');

		// console.log("#################");

		// const freshEventsForOld = JSON.parse(JSON.stringify(events));
		// console.time('processEventsTwoIdentical');
		// processEventsTwoIdentical(freshEventsForOld);
		// console.timeEnd('processEventsTwoIdentical');


		// ### process engine hours and status 
		// const freshEventsNew = deepClone(events);
		// console.time("engine hours incorrect new")
		// processEngineHoursAndStatusNew(freshEventsNew);
		// console.timeEnd("engine hours incorrect new")

		// console.log("#################");

		// const freshEvents = deepClone(events); 
		// console.time("engine hours incorrect");
		// processEngineHoursAndStatus(freshEvents);
		// console.timeEnd("engine hours incorrect");


		// ### incorrect event placement
		// const freshEvents = deepClone(events);
		// console.time("incorrect event placement");
		// checkIncorrectEventPlacement(freshEvents);
		// console.timeEnd("incorrect event placement");

		// console.log("#################");

		// const freshEventsNew = deepClone(events);
		// console.time("incorrect event placement new");
		// checkIncorrectEventPlacementNew(freshEventsNew);
		// console.timeEnd("incorrect event placement new");


		// ### process events power up shut down
		// const freshEventsNew = deepClone(events); 
		// console.time('processEventsPowerUpShutDown new');
		// processEventsPowerUpShutDownNew(freshEventsNew, pinTimes);
		// console.timeEnd('processEventsPowerUpShutDown new');

		// console.log("#################");

		// const freshEvents = deepClone(events); 
		// console.time('processEventsPowerUpShutDown');
		// processEventsPowerUpShutDown(freshEvents, pinTimes);
		// console.timeEnd('processEventsPowerUpShutDown');

		// console.time('checkEventWarnings');
		// checkEventWarnings(events);
		// console.timeEnd('checkEventWarnings');

		// ### collect certification errors
		// const freshEvents = structuredClone(events);
		// console.time('collect certification errors');
		// collectCertificationErrors(freshEvents);
		// console.timeEnd('collect certification errors');

		// console.log("#################");	

		// const freshEventsNew = structuredClone(events);
		// console.time('collect certification errors new');
		// collectCertificationErrorsNew(freshEventsNew);
		// console.timeEnd('collect certification errors new');

		// ### process events pti check 
		// const freshEventsNew = structuredClone(events);	
		// console.time('processEventsPtiCheck new');
		// processEventsPtiCheckNew(freshEventsNew, pinTimes);
		// console.timeEnd('processEventsPtiCheck new');

		// console.log("#################");

		// const freshEvents = structuredClone(events);
		// console.time('processEventsPtiCheck');
		// processEventsPtiCheck(freshEvents, pinTimes);
		// console.timeEnd('processEventsPtiCheck');

		console.timeEnd('collectEventWarningAndErrors');
		return events;
	} catch (error) {
		console.error('Error collecting warnings and errors:', error);
		throw error; // Re-throw so the caller knows something went wrong.
	}
}

export { collectEventWarningAndErrors };
// DONE OPTIMIZATIONS
// processEntries intermediate done
// two identical errors done
// process engine hours and status done
// incorrect event placement done
// certification collect done
// pti check done