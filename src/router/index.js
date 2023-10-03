import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/:id',
      name: 'answer.name',
      component: () => import('@/views/Friend.vue')
    },
    {
      path: '/404',
      name: 'notFound',
      component: () => import('@/components/notFound.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'notFound' }
    }
  ]
})
export default router
