
import { collectEventWarningAndErrors } from '@/service/normalize/index.js';

interface BoostEventResponse {
	actionState?: number;
	// boshqa kerakli fieldlar bo‘lsa shu yerda qo‘shing
}

interface PinTime {
	time: string | Date;
	type: string;
}

interface WorkerInput {
	events: BoostEventResponse[];
	pinTimes: PinTime[];
}

self.addEventListener('message', (e: MessageEvent<WorkerInput>) => {
	const { events, pinTimes } = e.data;
	const eventsWithoutArchived = events.filter((event) => event.actionState !== 4);

	const processedEvents = collectEventWarningAndErrors(eventsWithoutArchived, pinTimes);

	self.postMessage({ success: true, data: processedEvents });
});
