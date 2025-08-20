export default defineNuxtRouteMiddleware((to, from) => {
  // Faqat client-side da ishlashi uchun
  if (process.server) return;

  // Agar allaqachon /listening da bo'lsa, hech narsa qilmaslik
  if (to.path === '/listening') {
    return;
  }

  // Home sahifadan listening sahifasiga redirect
  if (to.path === '/') {
    return navigateTo('/listening');
  }

  // Auth sahifalarini listening ga yo'naltirish
  const authPaths = ['/auth/login', '/auth/register', '/auth', '/login', '/register'];
  if (authPaths.some(path => to.path.startsWith(path))) {
    return navigateTo('/listening');
  }

  // 404 holatida ham /listening ga yo'naltirish
  // Lekin faqat sahifa haqiqatan mavjud bo'lmasa
  if (to.matched.length === 0 && to.path !== '/listening') {
    return navigateTo('/listening');
  }
});