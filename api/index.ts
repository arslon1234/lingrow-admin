import { addError } from '~/helpers/notification';

export function useAxios() {
	const { $axios } = useNuxtApp() as unknown as { $axios: any };

	async function getRequest(url: string, params: object = {}, headers: object = {}, signal?: AbortSignal) {
		try {
			const config: any = {
				params,
				headers,
				paramsSerializer: {
					indexes: null 
				}
			};
			if (signal) {
				config.signal = signal;
			}

			let res = await $axios.get(url, config);
			return res;
		} catch (error: any) {
			if (error.code === 'ERR_CANCELED' || error.name === 'AbortError' || error.message?.includes('canceled')) {
				console.log(`GET request to ${url} was aborted`);
				throw error;
			}
			handleError(error);
			throw error;
		}
	}

	async function postRequest(url: string, body: object = {}, headers: object = {}) {
		try {
			let res = await $axios.post(url, body, { headers });
			// addSuccess("Created");
			return res;
		} catch (error) {
			handleError(error);
		}
	}

	async function putRequest(url: string, body: object = {}, headers: object = {}) {
		try {
			let res = await $axios.put(url, body, { headers });
			// addSuccess("Updated");
			return res;
		} catch (error) {
			handleError(error);
		}
	}

	async function patchRequest(url: string, body: object = {}, headers: object = {}) {
		try {
			let res = await $axios.patch(url, body, { headers });
			// addSuccess("Updated");
			return res;
		} catch (error) {
			handleError(error);
		}
	}

	async function deleteRequest(url: string, params: object = {}, headers: object = {}) {
		try {
			let res = await $axios.delete(url, { params, headers });
			// addSuccess("Deleted");
			return res;
		} catch (error) {
			handleError(error);
		}
	}

	function handleError(error: any) {
		addError(error.response?.data?.message || error.message);
		// throw showError({
		// 	statusCode: error.response?.status || 404,
		// 	fatal: true,
		// 	message: error.message ?? 'Error'
		// });
	}

	return {
		getRequest,
		postRequest,
		putRequest,
		patchRequest,
		deleteRequest
	};
}
