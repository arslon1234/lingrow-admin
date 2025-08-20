export default defineNuxtRouteMiddleware((to, from) => {
  const router = useRouter();
  const route = router.resolve(to.path);

  // Vercel'da auth redirect'ini bekor qilish
  // Agar /auth/login ga redirect bo'layotgan bo'lsa, listening ga qaytarish
  if (to.path === '/auth/login' && from?.path !== '/auth/login') {
    return navigateTo('/listening');
  }

  // Home sahifadan listening sahifasiga redirect
  if (to.path === '/') {
    return navigateTo('/listening');
  }

  // Auth sahifalarini listening ga yo'naltirish (auth qismi yo'q bo'lgani uchun)
  const authPaths = ['/auth/login', '/auth/register', '/auth', '/login', '/register'];
  if (authPaths.some(path => to.path.startsWith(path))) {
    return navigateTo('/listening');
  }

});