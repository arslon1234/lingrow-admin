interface EventItem {
	id: string | number;
	[key: string]: any;
}

interface EventGroup {
	events: EventItem[];
	[key: string]: any;
}

interface WorkerInput {
	detailList: EventGroup[];
	action: 'selectAll' | 'clearAll';
	currentSelection?: (string | number)[];
}

interface WorkerOutput {
	success: boolean;
	data?: {
		selectedIds: (string | number)[];
		selectedEvents: EventItem[];
	};
	error?: string;
}

self.addEventListener('message', (e: MessageEvent<WorkerInput>) => {
	try {
		const { detailList, action } = e.data;
		if (action === 'selectAll') {
			// Collect all event IDs and events
			const allEventIds: (string | number)[] = [];
			const allEvents: EventItem[] = [];

			let start = performance.now();
			for (const expandEvents of detailList) {
				if (expandEvents?.events) {
					for (const event of expandEvents.events) {
						if (event?.id != null) {
							allEventIds.push(event.id);
							allEvents.push(event);
						}
					}
				}
			}
			let end = performance.now();
			console.log('time', end - start);
			self.postMessage({
				success: true,
				data: {
					selectedIds: allEventIds,
					selectedEvents: allEvents
				}
			} as WorkerOutput);
		} else if (action === 'clearAll') {
			// Clear all selections
			self.postMessage({
				success: true,
				data: {
					selectedIds: [],
					selectedEvents: []
				}
			} as WorkerOutput);
		}
	} catch (error) {
		self.postMessage({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		} as WorkerOutput);
	}
});

// let start = performance.now()
// selectedRows.value = [];
// if (all) {
// 	detailList.value.forEach((expandEvents: any) => {
// 		expandEvents.events.forEach((ev: any) => {
// 			selectedRowSet.value.add(ev.id);
// 		});
// 	});
// } else {
// 	selectionStates.firstChecked = selectionStates.lastChecked = null;
// 	selectedRowSet.value.clear();
// }
// let end = performance.now()
// console.log('time', end-start)

// watch(
// 	() => selectedRowSet.value,
// 	(newValue) => {
// 		let start = performance.now()
// 		unchangedEventIds.value.forEach((id: any) => {
// 			if (!newValue.has(id) && !changedEventIdsSet.value.has(id)) {
// 				unchangedEventIds.value.delete(id);
// 			}
// 		});
// 		for (let id of newValue) {
// 			if (!changedEventIdsSet.value.has(id) && !unchangedEventIds.value.has(id)) {
// 				if (id) {
// 					unchangedEventIds.value.add(id);
// 				}
// 			}
// 		}
// 		let end = performance.now()
// 		console.log('watch time', end - start)
// 	},
// 	{ deep: false }
// );
