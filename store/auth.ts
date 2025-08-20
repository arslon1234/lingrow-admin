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
  const accessTokenCookie = useCookie('access_token');
  const refreshTokenCookie = useCookie('refresh_token');

  /**
   * Logs in a user and initializes the session.
   * @param model - Login credentials
   */
  async function login(model: LoginRequest) {
    try {
      const modelRequest = {
        userName: model.username,
        password: model.password
      };

      const result = await useAxios().postRequest(ApiUrls.AUTH_LOGIN_URL, modelRequest);
      if (result?.status === 200 && result.data?.successResult) {
        const { token, refreshToken, user } = result.data.successResult;

        // Save tokens and user data
        setSession(token, refreshToken, add(dayjs(), 10, "hour").format());
        saveUserData(user);

        // Initialize services
        scheduleTokenRefresh();
        userService.updateUser();
        addSuccess('Successfully Logged in');
        navigateTo('/');
      } else {
        throw new Error('Invalid login response or status code.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
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
      const result = await useAxios().getRequest(ApiUrls.AUTH_REFRESH_TOKEN_URL, {
        token: refreshTokenCookie.value,
      });

      if (result?.status === 200 && result.data?.successResult) {
        const { token, refreshToken } = result.data.successResult;

        // Update tokens
        setSession(token, refreshToken, add(dayjs(), 10, "hour").format());
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
  function setSession(token: string, refreshToken: string, expireTime: string) {
    accessTokenCookie.value = token;
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
    logout,
    refreshToken,
  };
});