export default defineNuxtRouteMiddleware((to, from) => {
  const router = useRouter();
  const route = router.resolve(to.path);
  const accessToken = useCookie('access_token');

  if (!from.path.includes("/auth/register") && to.path.includes("/auth/register")) {
    return navigateTo("/auth/register");
  }

  if (!accessToken.value && !to.path.includes("/auth/login") && !to.path.includes("/auth/register")) {
    return navigateTo("/auth/login");
  }

  // If it's the home path, redirect to /overview
  if (to.path === '/') {
    return navigateTo('/carriers');
  }

  // Redirect to / carrier if carrierId is missing and not on excluded routes
  const excludedPaths = ["/auth/login", "/auth/register", "/carriers", "/clients"];
  if (!excludedPaths.includes(to.path) && !getCarrierId()) {
    return navigateTo("/carriers");
  }

  if (["/carriers", "/clients"].includes(to.path) && getCarrierId()) {
    return navigateTo("/logs");
  }

  // Check if the route exists
  if (!route.matched.length) {
    return abortNavigation();
  }
});
