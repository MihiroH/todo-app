import Vue from 'vue'
import Router from 'vue-router'

import MyAbortController from '@/utils/myAbortController'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'Index',
      redirect: '/todos'
    },
    {
      path: '/todos',
      name: 'Todos',
      component: () => import('@/views/Todos')
    },
    {
      path: '/blogs',
      name: 'Blogs',
      component: () => import('@/views/Blogs')
    }
  ]
})

// ルートが変わるときにajax通信をキャンセルする
router.beforeEach((to, from, next) => {
  MyAbortController.abort()
  next()
})

export default router
