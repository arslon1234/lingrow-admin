// importing packages
import dayjs from 'dayjs';
import { defineStore } from 'pinia';

// importing apis
import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

// importing helpers
import { addSuccess } from '~/helpers/notification';
import { userService } from '~/helpers/user';

export const useAuthStore = defineStore('auth', () => {
	// Token cookies
	const accessTokenCookie = useCookie('accessToken');
	const refreshTokenCookie = useCookie('refreshToken');

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

				// // Save tokens and user data
				setSession(accessToken, refreshToken, add(dayjs(), 10, 'hour').format());
				// saveUserData(user);

				// // Initialize services
				// scheduleTokenRefresh();
				// userService.updateUser();
				// addSuccess('Successfully Logged in');
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
		clearUserData();
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
				setSession(accessToken, refreshToken, add(dayjs(), 10, 'hour').format());
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
	function setSession(accessToken: string, refreshToken: string, expireTime: string) {
		accessTokenCookie.value = accessToken;
		refreshTokenCookie.value = refreshToken;
		setExpireTime(expireTime);
	}
	/**
	 * Clears tokens and expiration time.
	 */
	function clearSession() {
		accessTokenCookie.value = null;
		refreshTokenCookie.value = null;
		removeExpireTime();
		removeCarrierId();
		removeCarrierTimeZoneId();
	}

	/**
	 * Saves user data to localStorage.
	 * @param user - User object
	 */
	function saveUserData(user: UserAuth) {
		setUser(user);
		setRoles(user?.roles);
		setProviderId(user?.providerId);
	}

	/**
	 * Clears user data from localStorage.
	 */
	function clearUserData() {
		removeUser();
		removeRoles();
		removeProviderId();
	}

	return {
		login,
		loading,
		logout,
		refreshToken
	};
});
