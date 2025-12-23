// importing packages
import dayjs from 'dayjs';
import { defineStore } from 'pinia';

// importing apis
import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

// importing stores
import { useUsersStore } from './users';

// importing helpers
import { addSuccess } from '~/helpers/notification';

export const useAuthStore = defineStore('auth', () => {
	// Token cookies
	const accessTokenCookie = useCookie('accessToken');
	const refreshTokenCookie = useCookie('refreshToken');
	const usersStore = useUsersStore()
	const loading = ref(false);

	/**
	 * @param model - Login Request Credentials
	 */
	async function login(model: LoginRequest) {
		try {
			loading.value = true;
			const modelRequest = {
				phoneNumber: model.phoneNumber,
				tempPassword: model.tempPassword
			};

			const result = await useAxios().postRequest(ApiUrls.AUTH_LOGIN_URL, modelRequest);
			if (result?.status === 200) {
				console.log(result);
				const { accessToken, refreshToken } = result.data;

				// Save tokens and user data
				await setSession(accessToken, refreshToken);
				await usersStore.getUsers()
				// saveUserData(user);

				// userService.updateUser();
				addSuccess('Successfully Logged in');
				// navigateTo('/');
			} else {
				throw new Error('Invalid login response or status code.');
			}
		} catch (error) {
			console.error('Login failed:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	}

	/**
	 * Logs out a user and clears session data.
	 */
	function logout() {
		clearSession();
		navigateTo('/auth/login');
	}

	/**
	 * Refreshes the authentication token using the refresh token.
	 */
	async function refreshToken() {
		try {
			const result = await useAxios().postRequest(ApiUrls.AUTH_REFRESH_TOKEN_URL, {
				refreshToken: refreshTokenCookie.value
			});

			if (result?.status === 200 && result.data) {
				const { accessToken, refreshToken } = result.data;

				// Update tokens
				setSession(accessToken, refreshToken);
			} else {
				throw new Error('Invalid token refresh response.');
			}
		} catch (error) {
			console.error('Token refresh failed:', error);
			throw error;
		}
	}

	/**
	 * Saves tokens and expiration time.
	 * @param token - Access token
	 * @param refreshToken - Refresh token
	 * @param expireTime - Token expiration time
	 */
	async function setSession(accessToken: string, refreshToken: string) {
		accessTokenCookie.value = accessToken;
		refreshTokenCookie.value = refreshToken;
	}
	/**
	 * Clears tokens
	 */
	function clearSession() {
		accessTokenCookie.value = null;
		refreshTokenCookie.value = null;
	}

	return {
		login,
		loading,
		logout,
		refreshToken
	};
});
