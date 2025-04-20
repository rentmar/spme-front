import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/pei',
      name: 'pei',
      component: () => import('../views/pei/PeiViewList.vue'),
    },
    {
      path: '/proyecto',
      name: 'proyecto',
      component: () => import('../views/proyecto/ProyectoListView.vue'),
    },
    {
      path: '/proyecto/:id/detalle',
      name: 'detalleProyecto',
      component: () => import('@/views/proyecto/ProyectoDetalleView.vue'),
    },
    {
      path: '/proyecto/:id/marcologico',
      name: 'marcologico',
      component: () => import('@/views/proyecto/ProyectoMLView.vue'),
    },
    {
      path: '/proyecto/nuevo',
      name: 'nuevo',
      component: () => import('@/views/proyecto/ProyectoNuevoView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/help',
      name: 'help',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HelpView.vue'),
    },
    /*
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },*/
  ],
})

export default router
