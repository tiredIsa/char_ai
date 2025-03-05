import { createRouter, createWebHistory } from 'vue-router'

const isMobile = () => {
  if ('__TAURI_INTERNALS__' in window) return true
  return navigator.maxTouchPoints > 0
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: isMobile()
        ? () => import('@/views/Mobile/Home.vue')
        : () => import('@/views/Desktop/Home.vue'),
    },
    {
      path: '/chat:id?',
      name: 'chat',
      component: isMobile()
        ? () => import('@/views/Mobile/Chat.vue')
        : () => import('@/views/Desktop/Chat.vue'),
    },
  ],
})

export default router
