import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('../views/Welcome.vue')
    },
    {
      path: '/cq',
      name: 'quizes.create',
      component: () => import('../views/CreateQuizes.vue')
    },

    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/CreateQuizes.vue') },
  ]
})

export default router
