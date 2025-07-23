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
      path: '/profile',
      name: 'perfil',
      component: HomeView,
    },
    {
      path: '/pei',
      name: 'pei',
      component: () => import('../views/pei/PeiViewList.vue'),
    },
    {
      path: '/pei/nuevo',
      name: 'peiNuevo',
      component: () => import('../views/pei/PeiNuevoView.vue'),
    },
    {
      path: '/pei/:id/detalle',
      name: 'detallePei',
      component: () => import('../views/pei/PeiDetalleView.vue'),
    },
    {
      path: '/pei/:id/editar',
      name: 'editarPei',
      component: () => import('../views/pei/PeiEditView.vue'),
    },
    {
      path: '/pei/:id/objetivos',
      name: 'editarObjetivos',
      component: () => import('../views/pei/PeiObjetivoView.vue'),
    },
    {
      path: '/pei/:id/indicadores',
      name: 'editarIndicadores',
      component: () => import('../views/pei/PeiIndicadoresView.vue'),
    },
    {
      path: '/pei/estructura',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiEstructuracionSpme.vue'),
    },
    {
      path: '/pei/listaactividades',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiListaActividades.vue'),
    },
    {
      path: '/pei/formulario01',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiFormulario01.vue'),
    },
    {
      path: '/pei/formulario02',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiFormulario02.vue'),
    },
    {
      path: '/pei/formulario03',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiFormulario03.vue'),
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
      path: '/proyecto/:id/editar',
      name: 'editarProyecto',
      component: () => import('@/views/proyecto/ProyectoEditView.vue'),
    },
    {
      path: '/proyecto/:id/estructura',
      name: 'estructuraProyecto',
      component: () => import('@/views/proyecto/ProyectoEstructuraView.vue'),
    },
    {
      path: '/proyecto/:id/marco-logico',
      name: 'marcologico',
      component: () => import('@/views/proyecto/ProyectoMLView.vue'),
    },
    {
      path: '/proyecto/nuevo',
      name: 'proyectoNuevo',
      component: () => import('@/views/proyecto/ProyectoNuevoView.vue'),
    },
    {
      path: '/planificacion',
      name: 'planificacionHome',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/planificacion/actividades',
      name: 'listaProyectosActividades',
      component: () => import('@/views/planeamiento/ProyectosActividadesListaView.vue'),
    },
    {
      path: '/planificacion/pei/:id/actividad',
      name: 'addActividadesPei',
      component: () => import('@/views/planeamiento/PeiAddActividadView.vue'),
    },
    {
      /* A la vista de planificacion del proyecto */
      path: '/proyecto/:id/planificar',
      name: 'planificarProyecto',
      component: () => import('@/views/proyecto/ProyectoPlanificarView.vue'),
    },
    {
      path: '/planificacion/proyecto/:id/actividad',
      name: 'addActividadesProyecto',
      component: () => import('@/views/planeamiento/ProyectoAddActividadView.vue'),
    },
    {
      path: '/planificacion/cronogramas',
      name: 'cronogramas',
      component: () => import('@/views/planeamiento/ActividadesKantView.vue'),
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
