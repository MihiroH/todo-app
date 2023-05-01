import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/currents/' : '/',
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
