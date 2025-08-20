import { useBoostStore } from '~/store/boost';
import { useBoostEventsStore } from '~/store/boostEvents';
import { useChart } from '~/store/chart';
import { useTabsStore } from '~/store/tabs';
import { useSessionsStore } from '~/store/sessions';
export const boostTabService = {
	// Stores getter
	getStores() {
		return {
			tabStore: useTabsStore(),
			boostStore: useBoostStore(),
			chartStore: useChart(),
			boostEventsStore: useBoostEventsStore(),
			sessionStore: useSessionsStore()
		};
	},

	selectTab(tab: TabResponse) {
		const { tabStore, boostStore, chartStore, boostEventsStore } = this.getStores();
		const { currentAbortController, selectedTab } = storeToRefs(tabStore);
		const { chart } = storeToRefs(chartStore);
		const { selectedRows, selectedRowSet } = storeToRefs(boostStore);
		const { selectedMoveEvents } = storeToRefs(boostEventsStore);

		if (currentAbortController.value) {
			currentAbortController.value.abort();
			currentAbortController.value = null;
		}
		selectedRows.value = [];
		selectedRowSet.value.clear();
		chart.value.clearSelectedEvents();
		selectedMoveEvents.value[selectedTab.value?.id as string] = [];
		selectedTab.value = tab;
	},

	async addTab(selectTab: (tab: TabResponse) => void) {
		const { tabStore, sessionStore } = this.getStores();
		const { tabs } = storeToRefs(tabStore);
		const { sessionId } = storeToRefs(sessionStore);
		const tabModel: TabRequest = {
			name: TabTypes[1],
			type: 1,
			sessionId: sessionId.value as string
		};
		try {
			await tabStore.addTab(tabModel);
		} catch (error) {
			console.log(error);
		} finally {
			await tabStore.getTabs(sessionId.value as string);
			const lastTab = tabs.value?.at(-1);
			if (lastTab) {
				selectTab(lastTab);
			}
		}
	},

	async updateTab(tabType: number) {
		const { tabStore, sessionStore } = this.getStores();
		const { sessionId } = storeToRefs(sessionStore);
		const { selectedTab } = storeToRefs(tabStore);

		const tabModel: TabRequest = {
			name: TabTypes[tabType as keyof typeof TabTypes],
			type: tabType,
			sessionId: sessionId.value as string
		};
		try {
			await tabStore.updateTab(selectedTab.value?.id as string, tabModel);
		} catch (error) {
			console.log(error);
		} finally {
			tabStore.getTabs(sessionId.value as string);
		}
	},

	async removeTab(tabId: string, selectTab: (tab: TabResponse) => void) {
		const { tabStore, sessionStore, boostEventsStore } = this.getStores();
		const { sessionId } = storeToRefs(sessionStore);
		const { tabs } = storeToRefs(tabStore);
		const { changedEventIdsSet, unchangedEventIds } = storeToRefs(boostEventsStore);
        
		try {
			await tabStore.deleteTab(tabId);
		} catch (error) {
			console.log(error);
		} finally {
			await tabStore.getTabs(sessionId.value as string);
			const lastTab = tabs.value?.at(-1);
			if (lastTab) {
				selectTab(lastTab);
			}
			unchangedEventIds.value.clear();
			changedEventIdsSet.value.clear();
		}
	}
};
