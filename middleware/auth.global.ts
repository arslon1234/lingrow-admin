import { useUsersStore } from '~/store/users';

export default defineNuxtRouteMiddleware(async (to, from) => {
	if (import.meta.server) return;

	const usersStore = useUsersStore();
	const accessToken = useCookie('accessToken');
  const refreshToken = useCookie('refreshToken')
	const lastPage = useCookie<string | null>('lastPage');

	const isAuthPage = to.path.startsWith('/auth');
	const fromIsAuth = from.path?.startsWith('/auth');

	if (!isAuthPage) {
		lastPage.value = to.fullPath;
	}

	if (!accessToken.value && !isAuthPage) {
		return navigateTo('/auth/login');
	}

	if (accessToken.value && !isAuthPage) {
		if (!usersStore.currentUser) {
			try {
				await usersStore.getUsers();
			} catch (error) {
				console.error('Failed to fetch user:', error);

				accessToken.value = null;
				return navigateTo('/auth/login');
			}
		}
	}


	if (accessToken.value && isAuthPage) {
		if (fromIsAuth) {
			return navigateTo('/listening/books');
		}

		return navigateTo(lastPage.value || '/listening/books');
	}

	if (to.matched.length === 0) {
		return navigateTo(accessToken.value ? '/listening/books' : '/auth/login');
	}
});
