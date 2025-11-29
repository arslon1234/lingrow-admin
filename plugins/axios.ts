import axios from 'axios';
import { useAuthStore } from '~/store/auth';

export default defineNuxtPlugin((nuxtApp: any) => {
	const accessToken = useCookie('accessToken');
	const authStore = useAuthStore();

	const axiosInstance = axios.create({
		baseURL: nuxtApp.$config.public.BASE_URL
	});

	axiosInstance.interceptors.request.use(
		(config: any) => {
			// config.headers['Lang'] = nuxtApp.$i18n.locale.value;
			if (accessToken.value) {
				config.headers['Authorization'] = `Bearer ${accessToken.value}`;
			} else {
				authStore.logout();
			}
			return config;
		},
		(error: any) => {
			return Promise.reject(error);
		}
	);

	axiosInstance.interceptors.response.use(
		(response) => {
			return response;
		},
		async (error) => {
			if (error.status === 401) {
				// call a function to logout the user
				try {
					authStore.logout();
				} catch (error) {
					console.error(error);
				}
			} else if (error.status === 403 || error.response?.data?.code === 'EXPIRED') {
				try {
					await authStore.refreshToken();
				} catch (error) {
					authStore.logout();
					console.error(error);
				}
			}
			return Promise.reject(error);
		}
	);

	nuxtApp.provide('axios', axiosInstance);
});
