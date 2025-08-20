import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

export const useOptimizeStore = defineStore('optimize', () => {
	const optimizeCategories = ref<Name[]>([]);

	async function getOptimizeCategories() {
		const result = await useAxios().getRequest(ApiUrls.OPTIMIZE_CATEGORIES_URL);
		if (result.status === 200) {
			optimizeCategories.value = result.data.successResult;
		}
	}

	async function optimizeSelectedCategories(model: {sessionId: string; tabId: string; eventCategoryInfos: Name[]}) {
		const result = await useAxios().postRequest(ApiUrls.OPTIMIZE_URL, model);
		if (result.status === 200) {
			return result.data.successResult;
		}
	}

	return {
		optimizeCategories,
		getOptimizeCategories,
		optimizeSelectedCategories
	};
});
