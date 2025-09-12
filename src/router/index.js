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
      path: '/monitoreo/formulario01/:id/',
       // name: 'editarIndicadores',
      component: () => import('../views/monitoreo/PeiFormulario01.vue'),
    },
    {
      path: '/monitoreo/formulario02/:id',
      // name: 'editarIndicadores',
      component: () => import('../views/monitoreo/PeiFormulario02.vue'),
    },
    {
      path: '/monitoreo/formulario03/:id',
      // name: 'editarIndicadores',
      component: () => import('../views/monitoreo/PeiFormulario03.vue'),
    },
    {
      path: '/monitoreo/formulario05/:id',
      // name: 'editarIndicadores',
      component: () => import('../views/monitoreo/PeiFormulario05.vue'),
    },
    {
      path: '/monitoreo/formulario08/:id',
      // name: 'editarIndicadores',
      component: () => import('../views/monitoreo/PeiFormulario08.vue'),
    },
    {
      path: '/monitoreo/formularioinf/:id',
      // name: 'editarIndicadores',
      component: () => import('../views/monitoreo/PeiFormularioInf.vue'),
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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/solicitud-viajes/',
      name: 'solicitudViajes',
      component: () => import('@/views/pei/PeiComposableViajes.vue'),
    },
    {  path: '/reportes/estructura',
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
    {
      path: '/monitoreo/inicio',
      name: 'homeMonitoreo',
      component: () => import('@/views/HomeView.vue'),
    },
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
    {
      path: '/fpp/inicio',
      name: 'homeFpp',
      component: () => import('@/views/fpp/FppView.vue'),
    },
    {
      path: '/fonfosc/inicio',
      name: 'homeFonFosc',
      component: () => import('@/views/fonfosc/FonFoscView.vue'),
    },
  ],
})

export default router
