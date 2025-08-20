export default defineNuxtRouteMiddleware((to, from) => {
  if(!to.query.tab) {
    return navigateTo(`${to.path}?tab=carrier`);
  }
});