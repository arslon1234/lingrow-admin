import { boostEventService, boostWebWorkerService } from '~/services';
import { useBoostStore } from '~/store/boost';
import { useBoostEventsStore } from '~/store/boostEvents';
import { useOptimizeStore } from '~/store/optimize';
export const useBoostSelectionComposable = (detailList: any, uiStates: BoostUiStates) => {
	const route = useRoute();

	const boostStore = useBoostStore();
	const boostEventsStore = useBoostEventsStore();
	const optimizeStore = useOptimizeStore();

	const { selectedRowSet, selectedRows } = storeToRefs(boostStore);
	const { unchangedEventIds, changedEventIdsSet } = storeToRefs(boostEventsStore);
	const { optimizeCategories } = storeToRefs(optimizeStore);

	const selectionStates = reactive<BoostSelectedState>({
		selectedDriver: route?.params?.id as string,
		firstChecked: null,
		lastChecked: null,
		selectedOptimizeCategories: {},
		selectAllOptimizeCategories: false
	});

	const toggleEvents = async (all: boolean) => {
		const action = all ? 'selectAll' : 'clearAll';
		await boostWebWorkerService.workerToggleEvents(detailList.value, action, (selectedIds: Set<any>, selectedEvents: any[]) => {
			selectedRowSet.value = selectedIds;
			triggerRef(selectedRowSet);

			if (!all) {
				selectionStates.firstChecked = null;
				selectionStates.lastChecked = null;
			}
		});
	};

	const selectEvent = (row: any) => {
		let parentIndex = null,
			childIndex = null;
		let firstNewChecked = null,
			lastNewChecked = null;

		for (let i = 0; i < detailList.value.length; i++) {
			for (let j = 0; j < detailList.value[i].events.length; j++)
				if (detailList.value[i].events[j].id == row.id) {
					parentIndex = i;
					childIndex = j;
					break;
				}
		}

		if (parentIndex == null || childIndex == null) {
			return;
		}

		if (uiStates.isShiftPressed && selectionStates.firstChecked && selectionStates.lastChecked) {
			if (
				selectionStates.firstChecked.parentIndex > parentIndex ||
				(selectionStates.firstChecked.parentIndex === parentIndex && selectionStates.firstChecked.childIndex > childIndex) ||
				selectionStates.lastChecked.parentIndex > parentIndex ||
				(selectionStates.lastChecked.parentIndex === parentIndex && selectionStates.lastChecked.childIndex > childIndex)
			) {
				selectionStates.firstChecked = { parentIndex, childIndex };
			}
			if (
				selectionStates.lastChecked.parentIndex < parentIndex ||
				(selectionStates.lastChecked.parentIndex === parentIndex && selectionStates.lastChecked.childIndex < childIndex)
			) {
				selectionStates.lastChecked = { parentIndex, childIndex };
			}

			const { parentIndex: firstParentIndex, childIndex: firstChildIndex } = selectionStates.firstChecked;
			const { parentIndex: lastParentIndex, childIndex: lastChildIndex } = selectionStates.lastChecked;

			for (let parentInd = firstParentIndex; parentInd <= lastParentIndex; parentInd++) {
				const parent = detailList.value[parentInd].events;
				const startChildInd: number = parentInd == firstParentIndex ? firstChildIndex : 0;
				const endChildInd: number = parentInd == lastParentIndex ? lastChildIndex + 1 : parent.length;
				for (let j = startChildInd; j < endChildInd; j++) {
					if (selectedRowSet.value.has(parent[j].id)) {
						selectedRowSet.value.delete(parent[j].id);
					} else {
						selectedRowSet.value.add(parent[j].id);
						selectedRows.value.push(unproxify(parent[j]));
						if (firstNewChecked == null) {
							firstNewChecked = {
								parentIndex: parentInd,
								childIndex: j
							};
						}
						lastNewChecked = {
							parentIndex: parentInd,
							childIndex: j
						};
					}
				}
			}

			selectionStates.firstChecked = firstNewChecked;
			selectionStates.lastChecked = lastNewChecked;

			selectedRows.value = selectedRows.value.filter((rowItem: any) => selectedRowSet.value.has(rowItem.id));
		} else if (!uiStates.isShiftPressed) {
			if (!selectedRowSet.value.has(row.id)) {
				selectedRowSet.value.add(row.id);
			} else {
				selectedRowSet.value.delete(row.id);
			}

			selectedRows.value.push(row);
			selectedRows.value = selectedRows.value.filter((row: any) => selectedRowSet.value.has(row.id));
		}

		if (!selectionStates.lastChecked) selectionStates.lastChecked = { parentIndex, childIndex };
		if (!selectionStates.firstChecked) selectionStates.firstChecked = { parentIndex, childIndex };
	};

	const handleEventSelect = (newValue: any) => {
		boostEventService.handleEventSelect(newValue, uiStates);
	};
	watch(
		() => selectedRowSet.value,
		(newValue) => {
			const currentUnchanged = unchangedEventIds.value;
			const changedSet = changedEventIdsSet.value;

			// Early exit for no-op cases
			if (newValue.size === 0 && currentUnchanged.size === 0) {
				return;
			}

			// Smart algorithm selection based on data size
			if (newValue.size < currentUnchanged.size / 2) {
				// Rebuild approach (faster for small selections)
				const newUnchangedIds = new Set<string>();

				for (const id of newValue) {
					if (id && !changedSet.has(id)) {
						newUnchangedIds.add(id);
					}
				}

				for (const id of currentUnchanged) {
					if (changedSet.has(id)) {
						newUnchangedIds.add(id);
					}
				}

				unchangedEventIds.value = newUnchangedIds;
				triggerRef(unchangedEventIds);
			} else {
				// Batch operations approach
				const toRemove = [];
				const toAdd = [];

				for (const id of currentUnchanged) {
					if (!newValue.has(id) && !changedSet.has(id)) {
						toRemove.push(id);
					}
				}

				for (const id of newValue) {
					if (id && !changedSet.has(id) && !currentUnchanged.has(id)) {
						toAdd.push(id);
					}
				}

				if (toRemove.length > 0 || toAdd.length > 0) {
					const newUnchangedIds = new Set(currentUnchanged);
					toRemove.forEach((id) => newUnchangedIds.delete(id));
					toAdd.forEach((id) => newUnchangedIds.add(id));

					unchangedEventIds.value = newUnchangedIds;
					triggerRef(unchangedEventIds);
				}
			}
		},
		{ deep: false }
	);

	watch(
		() => selectionStates.selectAllOptimizeCategories,
		(value) => {
			if (value) {
				optimizeCategories.value.forEach((category) => {
					selectionStates.selectedOptimizeCategories[category.id] = true;
				});
			} else {
				selectionStates.selectedOptimizeCategories = {};
			}
		}
	);

	return { selectionStates, toggleEvents, selectEvent, handleEventSelect };
};
