import dayjs, { Dayjs } from 'dayjs';
import NormalizeWorker from '~/public/workers/normalizeWorker?worker';
import PixelViolationWorker from '~/public/workers/pixelViolationWorker?worker';
import ToggleEventsWorker from '~/public/workers/toggleEventsWorker?worker';
import { useTimeZoneHelper } from '~/helpers/timezone';


export const boostWebWorkerService = {
	async webWorkerNormalize(events: BoostEventResponse[], pinTimes: any[], updateCallback: (newEvents: BoostEventResponse[]) => void) {
		return new Promise((resolve, reject) => {
			const worker = new NormalizeWorker();

			worker.addEventListener('message', (e) => {
				if (e.data.success) {
					updateCallback(e.data.data);
					resolve(e.data.data);
				} else {
					reject(new Error(e.data.error));
				}
				worker.terminate();
			});

			worker.addEventListener('error', (error) => {
				reject(error);
				worker.terminate();
			});

			worker.postMessage({
				events: structuredClone(events),
				pinTimes: structuredClone(pinTimes)
			});
		});
	},

	async workerPixelViolation(pixelViolations: any[], pinTimes: any[], headerDate: Ref<[Dayjs, Dayjs]>, screenResolution: Ref<number>, allViolationBlocks: Ref<any[]>) {
		const { getStartOf, getEndOf } = useTimeZoneHelper();
		return new Promise((resolve, reject) => {
			const worker = new PixelViolationWorker();
			worker.addEventListener('message', (e) => {
				const results = e.data as {
					stringType: string;
					violations: ViolationPixelResponse[];
					violationBlocks: [number, number][];
				}[];

				allViolationBlocks.value = results.map((r) => ({
					stringType: r.stringType,
					violationBlocks: r.violationBlocks
				}));

				resolve(true);
				worker.terminate();
			});

			worker.addEventListener('error', (error) => {
				console.error('Shift Violation Worker error:', error);
				reject(error);
				worker.terminate();
			});

			const serializedPinTimes = pinTimes.map((pin) => ({
				...pin,
				time: pin.time instanceof dayjs ? (pin.time as Dayjs).toISOString() : pin.time // Convert Dayjs to ISO string
			}));

			const serializedPixelViolations = pixelViolations.map((violation) => ({
				...violation,
				startedAt: violation.startedAt instanceof dayjs ? (violation.startedAt as Dayjs).toISOString() : violation.startedAt // Convert if Dayjs
			}));

			worker.postMessage([
				{
					violations: serializedPixelViolations, //pixelViolations,
					type: ResetPinTimesEnum.Shift as string,
					resetPinTimes: serializedPinTimes, //pinTimes,
					stringType: OfficialViolations.Shift,
					headerDate: getStartOf(headerDate.value[0]).format('YYYY-MM-DDTHH:mm:ss'),
					endTime: getEndOf(headerDate.value[1]).format('YYYY-MM-DDTHH:mm:ss'),
					screenResolution: screenResolution.value
				},
				{
					violations: serializedPixelViolations, //pixelViolations,
					type: ResetPinTimesEnum.Cycle as string,
					resetPinTimes: serializedPinTimes, //pinTimes,
					stringType: OfficialViolations.Cycle,
					headerDate: getStartOf(headerDate.value[0]).format('YYYY-MM-DDTHH:mm:ss'),
					endTime: getEndOf(headerDate.value[1]).format('YYYY-MM-DDTHH:mm:ss'),
					screenResolution: screenResolution.value
				},
				{
					violations: serializedPixelViolations, //pixelViolations,
					type: ResetPinTimesEnum.Shift as string,
					resetPinTimes: serializedPinTimes, //pinTimes,
					stringType: OfficialViolations.Driving,
					headerDate: getStartOf(headerDate.value[0]).format('YYYY-MM-DDTHH:mm:ss'),
					endTime: getEndOf(headerDate.value[1]).format('YYYY-MM-DDTHH:mm:ss'),
					screenResolution: screenResolution.value
				},
				{
					violations: serializedPixelViolations, //pixelViolations,
					type: ResetPinTimesEnum.Shift as string,
					resetPinTimes: serializedPinTimes, //pinTimes,
					stringType: OfficialViolations.RestBreak,
					headerDate: getStartOf(headerDate.value[0]).format('YYYY-MM-DDTHH:mm:ss'),
					endTime: getEndOf(headerDate.value[1]).format('YYYY-MM-DDTHH:mm:ss'),
					screenResolution: screenResolution.value
				}
			]);
		});
	},

	async workerToggleEvents(detailList: any[], action: 'selectAll' | 'clearAll', updateCallback: (selectedIds: Set<any>, selectedEvents: any[]) => void):Promise<{ selectedIds: Set<any>, selectedEvents: any[] }> {
		return new Promise((resolve, reject) => {
			const worker = new ToggleEventsWorker();
			worker.addEventListener('message', (e: MessageEvent<any>) => {
				if (e.data.success && e.data.data) {
					const selectedIds = new Set(e.data.data.selectedIds);
					const selectedEvents = e.data.data.selectedEvents;
					
					// Update UI via callback
					updateCallback(selectedIds, selectedEvents);
					
					// Resolve promise
					resolve({
						selectedIds,
						selectedEvents
					});
				} else {
					reject(new Error(e.data.error || 'Worker failed'));
				}
				worker.terminate();
			});

			worker.addEventListener('error', (error) => {
				reject(error);
				worker.terminate();
			});
			worker.postMessage({
				detailList: structuredClone(detailList),
				action,
			});
		})
	}
};
