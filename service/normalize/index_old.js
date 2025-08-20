/** IMPORTING SERVICES **/

// 1. CERTIFICATION
import { collectCertificationErrors } from './certification/certificationIssues';

// 2. ENGINE HOURS
import { checkEngineHoursErrors } from './engineHoursModule/engineHoursErrors';
import { processEngineHoursAndStatus } from './engineHoursModule/engineHoursIncorrect';

// 3. INCORRECT EVENT PLACEMENT
import { checkIncorrectEventPlacement } from './incorrectEventPlacementModule/incorrectEventPlacement';

// 4. INTERMEDIATE MISSING
import { processEntriesIntermediateMissing } from './intermediateMissingModule/intermediateMissing';

// 5. LOGIN LOGOUT
import { processLoginLogoutEvents } from './loginLogoutModule/loginLogoutWarning';

// 6. ODOMETER
import { checkOdometerErrors } from './odometerModule/odometerErrors';
import { checkForOdometerJumpAndLocationChanged } from './odometerModule/odometerJumpLocationChanged';

// 7. POWER UP SHUT DOWN
import { processEventsPowerUpShutDown } from './powerUpShutDownModule/powerUpShutDown';

// 8. PTI
import { processEventsPtiCheck } from './ptiCheckModule/ptiCheck';

// 9. SPEED LIMIT
import { checkSpeedLimit } from './speedModule/speedLimit';

// 10.  TWO IDENTICAL EVENTS
import { processEventsTwoIdentical } from './twoIdenticalEventsModule/twoIdenticalEvents';
import { engineHoursAndLoginLogoutErrors } from './mergedMethods/EngineHoursAndLoginLogoutErrorsCollection.js';

// 11. WARNINGS
import { checkEventWarnings } from './warningModule/warnings';

/** ASYNC FUNCTION TO COLLECT WARNINGS AND ERRORS **/
async function collectEventWarningAndErrors(events, pinTimes) {
	try {
		// Create an array of all promises
		const promises = [
			engineHoursAndLoginLogoutErrors(events),
			collectCertificationErrors(events),
			//checkEngineHoursErrors(events),
			processEngineHoursAndStatus(events),
			checkIncorrectEventPlacement(events),
			processEntriesIntermediateMissing(events),
			//processLoginLogoutEvents(events),
			checkOdometerErrors(events),
			checkForOdometerJumpAndLocationChanged(events),
			processEventsPowerUpShutDown(events, pinTimes),
			processEventsPtiCheck(events, pinTimes),
			checkSpeedLimit(events),
			processEventsTwoIdentical(events),
			checkEventWarnings(events)
		];

		// Wait for all promises to resolve
		await Promise.all(promises);

		// Optionally, add another function for power-up and PTI if needed
		// async function processPowerUpAndPti(events, pinTimes) {
		//   await Promise.all([
		//     processEventsPowerUpShutDown(events, pinTimes),
		//     processEventsPtiCheck(events, pinTimes),
		//   ]);
		// }

		// Combine and return the results
		return events;
	} catch (error) {
		console.error('Error collecting warnings and errors:', error);
		throw error; // Re-throw to handle it outside the function
	}
}

export { collectEventWarningAndErrors };
