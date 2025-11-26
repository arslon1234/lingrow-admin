export default defineNuxtRouteMiddleware((to, from) => {
	// Faqat client-side da ishlashi uchun
	if (process.server) return;
  console.log(from.path, 'path')
	// Access token ni tekshirish
	const accessToken = useCookie('accessToken').value;

	// Agar allaqachon /listening da bo'lsa, hech narsa qilmaslik
	if (to.path === '/listening') {
		return;
	}

	// Agar token bo'lmasa va auth sahifada bo'lmasa, login ga yo'naltirish
	if (!accessToken && !to.path.startsWith('/auth')) {
		return navigateTo('/auth/login');
	}

	// Agar token bor bo'lsa va auth sahifada bo'lsa, listening ga yo'naltirish
	if (accessToken && to.path.startsWith('/auth')) {
		return navigateTo('/listening/books');
		// return navigateTo(from.path);
	}

	// Home sahifadan listening sahifasiga redirect (faqat token bor bo'lsa)
	if (to.path === '/' && accessToken) {
		return navigateTo('/listening/books');
		// return navigateTo(from.path);
	}

	// Home sahifadan login ga redirect (token bo'lmasa)
	if (to.path === '/' && !accessToken) {
		return navigateTo('/auth/login');
	}

	// 404 holatida ham tegishli sahifaga yo'naltirish
	if (to.matched.length === 0) {
		if (accessToken) {
			// return navigateTo('/listening/books');
			return navigateTo(from.path);
		} else {
			return navigateTo('/auth/login');
		}
	}
});
