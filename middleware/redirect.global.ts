export default defineNuxtRouteMiddleware((to, from) => {
 const router = useRouter();
  const route = router.resolve(to.path);

  // Home sahifadan listening sahifasiga redirect
  if (to.path === '/') {
    return navigateTo('/listening');
  }

  // Check if the route exists
  // if (!route.matched.length) {
  //   return abortNavigation();
  // }
});
