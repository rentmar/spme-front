import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/DashBoardView.vue'),
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
      name: 'listadeActividades',
      component: () => import('../views/pei/PeiListaActividades.vue'),
    },
    {
      path: '/pei/formulario01/:id/',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiFormulario01.vue'),
    },
    {
      path: '/pei/formulario02/:id',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiFormulario02.vue'),
    },
    {
      path: '/pei/formulario03/:id',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiFormulario03.vue'),
    },
    {
      path: '/pei/formulario05/:id',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiFormulario05.vue'),
    },
    {
      path: '/pei/formulario08/:id',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiFormulario08.vue'),
    },
    {
      path: '/pei/formularioinf/:id',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiFormularioInf.vue'),
    },
    {
      path: '/pei/prueba2',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiPrueba2.vue'),
    },
        {
      path: '/pei/prueba1',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiPrueba1.vue'),
    },
    {
      path: '/pei/prueba3',
      // name: 'editarIndicadores',
      component: () => import('@/views/pei/PeiComposableView.vue'),
    },
    {
      path: '/pei/prueba4',
      // name: 'editarIndicadores',
      component: () => import('../views/pei/PeiPrueba4.vue'),
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
      path: '/proyecto/actividades/tareas/',
      name: 'proyectoActividadesTarea',
      component: () => import('@/views/planeamiento/ActividadesListTareasView.vue'),
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
      path: '/usuario/perfil/',
      name: 'usuarioPerfil',
      component: () => import('@/views/usuario/PerfilUsuarioView.vue'),
    },
    {
      path: '/admin/usuariosDashboard/',
      name: 'usuarioDashboard',
      component: () => import('@/views/usuario/DashboardUsuarioView.vue'),
    },
    {
      path: '/admin/usuarios/',
      name: 'usuarios',
      component: () => import('@/views/usuario/UserAdminView.vue'),
    },
    {
      path: '/admin/roles',
      name: 'roles',
      component: () => import('@/views/usuario/RolUsuarioView.vue'),
    },
    {
      path: '/admin/permisos',
      name: 'permisos',
      component: () => import('@/views/usuario/PermisosView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashBoardView.vue'),
    },
    {
      path: '/admin/auditoria',
      name: 'auditoria',
      component: HomeView,
    },
    {
      path: '/admin/configuracion',
      name: 'settingsApp',
      component: () => import('@/views/settings/SettingsView.vue'),
    },
    /****************** Notificaciones **********************/
    {
      path: '/notificaciones',
      name: 'notificaciones',
      component: HomeView,
    },
    {
      path: '/notificaciones/configuracion',
      name: 'notificaciones-configuracion',
      component: HomeView,
    },
    {
      path: '/admin/notificaciones',
      name: 'admin-notificaciones',
      component: HomeView,
    },
    {
      path: '/admin/notificaciones/plantillas',
      name: 'admin-notificaciones-plantillas',
      component: HomeView,
    },
    {
      path: '/admin/notificaciones/configuracion',
      name: 'admin-notificaciones-configuracion',
      component: HomeView,
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
    {
      path: '/solicitud-viajes/',
      name: 'solicitudViajes',
      component: () => import('@/views/pei/PeiComposableViajes.vue'),
    },
  ],
})

export default router
