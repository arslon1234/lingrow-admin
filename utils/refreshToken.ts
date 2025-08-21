import dayjs from 'dayjs';
import { useAuthStore } from '~/store/auth';

export const scheduleTokenRefresh = async () => {
	const expire_time = getExpireTime();
	const authStore = useAuthStore();
	if (expire_time) {
		const expirationTime = dayjs(expire_time);
		const refreshTime = expirationTime.subtract(2, 'minute').diff(dayjs(), 'millisecond');
		console.log(refreshTime);
		if (refreshTime > 0) {
			setTimeout(async () => {
				if(expire_time) {
					await authStore.refreshToken();
					scheduleTokenRefresh(); // Schedule the next refresh
				}
			}, refreshTime);
		} else {
      authStore.logout();
    }
	} else {
		authStore.logout();
	}
};