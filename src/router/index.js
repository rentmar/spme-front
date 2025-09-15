import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { useUserStore } from '@/stores/user'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView,
      //meta: { requiresAuth: false },
    },
    {
      path: '/home',
      name: 'home',
      //component: () => import('@/views/DashBoardView.vue'),
      component: HomeView,
      //meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'perfil',
      component: HomeView,
      //meta: { requiresAuth: true, requiredRole: 'admin' },
    },

    {
      path: '/pei',
      name: 'pei',
      component: () => import('../views/pei/PeiViewList.vue'),
      //meta: { requiresAuth: true, requiredRole: 'admin' },
    },
    {
      path: '/pei/nuevo',
      name: 'peiNuevo',
      component: () => import('../views/pei/PeiNuevoView.vue'),
      //meta: { requiresAuth: true, requiredRole: 'admin' },
    },
    {
      path: '/pei/:id/detalle',
      name: 'detallePei',
      component: () => import('../views/pei/PeiDetalleView.vue'),
      //meta: { requiresAuth: true, requiredRole: 'admin' },
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
      component: () => import('@/views/planeamiento/ActividadesGantView.vue'),
      //meta: { requiresAuth: true, requiredRole: 'A' },
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
    /*************** ESTRUCTURACION ESPECIALES *****************/
    {
      path: '/programas/',
      name: 'programasareasproyecto',
      component: () => import('@/views/programas/ProgramasAreasView.vue'),
    },
    /****************** Notificaciones **********************/
    {
      path: '/notificaciones',
      name: 'notificaciones',
      component: () => import('@/views/notificacion/NotificacionesDashboardView.vue'),
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
    /*************************** REPORTES ****************************/
    {
      path: '/reportes/estructura',
      name: 'reportesEstructura',
      component: () => import('@/views/reportes/ProyectoEstructuraView.vue'),
    },
    /************************** Rutas limpias para Headers *******************/
    {
      path: '/estructura/inicio',
      name: 'homeEstructura',
      component: () => import('@/views/notificacion/NotificacionesDashboardView.vue'),
    },
    {
      path: '/planificacion/inicio',
      name: 'homePlanificacion',
      component: () => import('@/views/HomeView.vue'),
    },
    /****************************Monitoreo ************************************************/
    {
      path: '/pei/listaactividades/',
      name: 'listadeActividades',
      component: () => import('@/views/pei/PeiListaActividades.vue'),
    },
    {
      path: '/monitoreo/inicio',
      name: 'homeMonitoreo',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/monitoreo/formulario01/:id',
      component: () => import('@/views/monitoreo/SolicitudDeFondos.vue'),
    },
    {
      path: '/monitoreo/formulario02/:id',
      component: () => import('@/views/monitoreo/RendicionDeCuentas.vue'),
    },
    {
      path: '/monitoreo/formulario03/:id',
      component: () => import('@/views/monitoreo/SolicitudDeReposicion.vue'),
    },
    {
      path: '/monitoreo/formulario05/:id',
      component: () => import('@/views/monitoreo/SolicitudDeViaje.vue'),
    },
    {
      path: '/monitoreo/formulario08/:id',
      component: () => import('@/views/monitoreo/SolicitudDePagoDirecto.vue'),
    },
    {
      path: '/monitoreo/formularioInf/:id',
      component: () => import('@/views/monitoreo/InformeActividad.vue'),
    },

    /*************************  Reportes  **************************************************** */
    {
      path: '/reporte/inicio',
      name: 'homeReporte',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/reporte/proyectos',
      name: 'reporteListaProyectos',
      component: () => import('@/views/reportes/ProyectoReportesListaProyectos.vue'),
    },
    {
      path: '/reporte/proyectos/:id/',
      name: 'reporteProyecto',
      component: () => import('@/views/reportes/ReporteProyectoView.vue'),
    },
    {
      path: '/reporte/actividades',
      name: 'reporteListaActividades',
      component: () => import('@/views/reportes/ActividadReporteListaActividades.vue'),
    },
    {
      path: '/usuarios/inicio',
      name: 'homeUsuariosInicio',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/notificaciones/inicio',
      name: 'homeNotificaciones',
      component: () => import('@/views/HomeView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // Cargar datos del usuario desde sessionStorage si no están en memoria
  if (!userStore.userData) {
    userStore.loadFromSession()
  }

  // Verificar autenticación
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/')
    return
  }

  // Verificar rol requerido
  if (to.meta.requiredRole && !userStore.hasRole(to.meta.requiredRole)) {
    console.warn(`Acceso denegado. Se requiere rol: ${to.meta.requiredRole}`)
    next('/home')
    return
  }

  // Verificar múltiples roles
  if (to.meta.requiredRoles && !userStore.hasAnyRole(to.meta.requiredRoles)) {
    console.warn(
      `Acceso denegado. Se requiere uno de estos roles: ${to.meta.requiredRoles.join(', ')}`,
    )
    next('/home')
    return
  }

  next()
})

export default router
