import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    // {
    //   path: '/qc',
    //   name: 'quizes.create',
    //   component: () => import('../views/CreateQuizes.vue')
    // },
    // {
    //   path: '/c',
    //   name: 'quizes.copy',
    //   component: () => import('../views/CopyQuizes.vue')
    // },
    // {
    //   path: '/a/:id',
    //   name: 'quizes.answer',
    //   component: () => import('../views/Answer.vue')
    // },
    // {
    //   path: '/:id',
    //   name: 'answer.name',
    //   component: () => import('../views/AnswerQuizes.vue')
    // },
    // {
    //   path: '/:id',
    //   name: 'answer.result',
    //   component: () => import('../views/AnswerResult.vue')
    // },

    // { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/CreateQuizes.vue') },
  ]
})

export default router
