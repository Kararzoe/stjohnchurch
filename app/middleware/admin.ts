export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return

  const supabase = useSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return navigateTo('/admin/login')
  }
})
