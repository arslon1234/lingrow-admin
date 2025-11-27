export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return

  const accessToken = useCookie('accessToken')
  const lastPage = useCookie<string | null>('lastPage')

  const isAuthPage = to.path.startsWith('/auth')
  const fromIsAuth = from.path?.startsWith('/auth')

  // ✅ auth bo‘lmagan sahifalarni saqlab boramiz
  if (!isAuthPage) {
    lastPage.value = to.fullPath
  }

  // ✅ token YO‘Q → protected page
  if (!accessToken.value && !isAuthPage) {
    return navigateTo('/auth/login')
  }

  // ✅ token BOR → auth page
  if (accessToken.value && isAuthPage) {
    // 🔥 AGAR auth page’dan chiqayotgan bo‘lsa → har doim books
    if (fromIsAuth) {
      return navigateTo('/listening/books')
    }

    // aks holda eski sahifaga
    return navigateTo(lastPage.value || '/listening/books')
  }

  // ✅ 404
  if (to.matched.length === 0) {
    return navigateTo(accessToken.value ? '/listening/books' : '/auth/login')
  }
})
