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
      meta: { requiresAuth: false },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/DashBoardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'perfil',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/pei',
      name: 'pei',
      component: () => import('../views/pei/PeiViewList.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pei/nuevo',
      name: 'peiNuevo',
      component: () => import('../views/pei/PeiNuevoView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pei/:id/detalle',
      name: 'detallePei',
      component: () => import('../views/pei/PeiDetalleView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pei/:id/editar',
      name: 'editarPei',
      component: () => import('../views/pei/PeiEditView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pei/:id/objetivos',
      name: 'editarObjetivos',
      component: () => import('../views/pei/PeiObjetivoView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pei/:id/indicadores',
      name: 'editarIndicadores',
      component: () => import('../views/pei/PeiIndicadoresView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pei/:id/planificar',
      name: 'planificarPei',
      component: () => import('@/views/peiplanificacion/PeiPlanificarView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/proyecto',
      name: 'proyecto',
      component: () => import('../views/proyecto/ProyectoListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/proyecto/:id/detalle',
      name: 'detalleProyecto',
      component: () => import('@/views/proyecto/ProyectoDetalleView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/proyecto/:id/editar',
      name: 'editarProyecto',
      component: () => import('@/views/proyecto/ProyectoEditView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/proyecto/:id/estructura',
      name: 'estructuraProyecto',
      component: () => import('@/views/proyecto/ProyectoEstructuraView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/proyecto/:id/marco-logico',
      name: 'marcologico',
      component: () => import('@/views/proyecto/ProyectoMLView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/proyecto/nuevo',
      name: 'proyectoNuevo',
      component: () => import('@/views/proyecto/ProyectoNuevoView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/proyectos/mis-proyectos/',
      name: 'proyectoMisProyectos',
      component: () => import('@/views/proyecto/UserMisProyectosView.vue'),
    },
    {
      path: '/proyecto/actividades/tareas/',
      name: 'proyectoActividadesTarea',
      component: () => import('@/views/planeamiento/ActividadesListTareasView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/planificacion',
      name: 'planificacionHome',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/planificacion/actividades',
      name: 'listaProyectosActividades',
      component: () => import('@/views/planeamiento/ProyectosActividadesListaView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/planificacion/pei/:id/actividad',
      name: 'addActividadesPei',
      component: () => import('@/views/planeamiento/PeiAddActividadView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/planificacion/historial/',
      name: 'planificacionHistorial',
      component: () => import('@/views/planeamiento/PlanificacionSeguimientoView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/proyecto/:id/planificar',
      name: 'planificarProyecto',
      component: () => import('@/views/proyecto/ProyectoPlanificarView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/planificacion/proyecto/:id/actividad',
      name: 'addActividadesProyecto',
      component: () => import('@/views/planeamiento/ProyectoAddActividadView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/planificacion/cronogramas',
      name: 'cronogramas',
      component: () => import('@/views/planeamiento/ActividadesGantView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/usuario/perfil/',
      name: 'usuarioPerfil',
      component: () => import('@/views/usuario/PerfilUsuarioView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/usuariosDashboard/',
      name: 'usuarioDashboard',
      component: () => import('@/views/usuario/DashboardUsuarioView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/usuarios/',
      name: 'usuarios',
      component: () => import('@/views/usuario/UserAdminView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/roles',
      name: 'roles',
      component: () => import('@/views/usuario/RolUsuarioView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/permisos',
      name: 'permisos',
      component: () => import('@/views/usuario/PermisosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashBoardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/auditoria',
      name: 'auditoria',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/configuracion',
      name: 'settingsApp',
      component: () => import('@/views/settings/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/programas/',
      name: 'programasareasproyecto',
      component: () => import('@/views/programas/ProgramasAreasView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/notificaciones',
      name: 'notificaciones',
      component: () => import('@/views/notificacion/NotificacionesDashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/notificaciones/configuracion',
      name: 'notificaciones-configuracion',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/notificaciones',
      name: 'admin-notificaciones',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/notificaciones/plantillas',
      name: 'admin-notificaciones-plantillas',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/notificaciones/configuracion',
      name: 'admin-notificaciones-configuracion',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/reportes/estructura',
      name: 'reportesEstructura',
      //component: () => import('@/views/reportes/ProyectoEstructuraView.vue'),
      component: () => import('@/views/reportes/FIltroActividadesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/estructura/inicio',
      name: 'homeEstructura',
      component: () => import('@/views/notificacion/NotificacionesDashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/planificacion/inicio',
      name: 'homePlanificacion',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    /****************************Monitoreo ************************************************/
    {
      path: '/pei/listaactividades/',
      name: 'listadeActividades',
      component: () => import('@/views/pei/PeiListaActividades.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pei/listaactividadespei/',
      name: 'listaActividadesPei',
      component: () => import('@/views/pei/PeiListaActividadespei.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/inicio',
      name: 'homeMonitoreo',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    // {
    //   path: '/pei/listaactividades/',
    //   name: 'listadeActividades',
    //   component: () => import('@/views/pei/PeiListaActividades.vue'),
    //   meta: { requiresAuth: true },
    // },
    {
      path: '/monitoreo/inicio',
      name: 'homeMonitoreo',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/formulario01/:id',
      component: () => import('@/views/monitoreo/SolicitudDeFondos.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/formulario011/:id',
      component: () => import('@/views/monitoreo/SolicitudDeFondosValidar.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/formulario02/:id',
      component: () => import('@/views/monitoreo/RendicionDeCuentas.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/formulario022/:id',
      component: () => import('@/views/monitoreo/RendicionDeCuentasValidar.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/formulario033/:id',
      component: () => import('@/views/monitoreo/SolicitudDeReposicionValidar.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/formulario03/:id',
      component: () => import('@/views/monitoreo/SolicitudDeReposicion.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/formulario05/:id',
      component: () => import('@/views/monitoreo/SolicitudDeViaje.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/formulario055/:id',
      component: () => import('@/views/monitoreo/SolicitudDeViajeValidar.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/formulario08/:id',
      component: () => import('@/views/monitoreo/SolicitudDePagoDirecto.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/formulario088/:id',
      component: () => import('@/views/monitoreo/SolicitudDePagoDirectoValidar.vue'),
      meta: { requiresAuth: true },
    },
    ////////////////////////////////pei//////////////////////////////
    {
      path: '/monitoreo/pei/formulariopei01/:id',
      component: () => import('@/views/monitoreo/SolicitudDeFondosPei.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/pei/formulariopei011/:id',
      component: () => import('@/views/monitoreo/SolicitudDeFondosValidarPei.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/pei/formulariopei02/:id',
      component: () => import('@/views/monitoreo/RendicionDeCuentasPei.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/pei/formulariopei022/:id',
      component: () => import('@/views/monitoreo/RendicionDeCuentasValidarPei.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/pei/formulariopei033/:id',
      component: () => import('@/views/monitoreo/SolicitudDeReposicionValidarPei.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/pei/formulariopei03/:id',
      component: () => import('@/views/monitoreo/SolicitudDeReposicionPei.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/pei/formulariopei05/:id',
      component: () => import('@/views/monitoreo/SolicitudDeViajePei.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/pei/formulariopei055/:id',
      component: () => import('@/views/monitoreo/SolicitudDeViajeValidarPei.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/pei/formulariopei08/:id',
      component: () => import('@/views/monitoreo/SolicitudDePagoDirectoPei.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/pei/formulariopei088/:id',
      component: () => import('@/views/monitoreo/SolicitudDePagoDirectoValidarPei.vue'),
      meta: { requiresAuth: true },
    },
    /////////////////////////////////////////////////////////////////
    {
      path: '/monitoreo/formularioInf/:id',
      component: () => import('@/views/monitoreo/InformeActividadView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/informe-actividad/:id',
      name: 'informeActividades',
      component: () => import('@/views/monitoreo/InformeActividadView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/informe-subactividad/:id',
      name: 'InformeSubActividad',
      component: () => import('@/views/monitoreo/InformeSubActividad.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/informes-actividad-subactividad/:id',
      name: 'ListaInformesActividadSubActividad',
      component: () => import('@/views/monitoreo/InformesActividadSubactividadView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/informe-actividad-pei/:id',
      name: 'informeActividadesPei',
      component: () => import('@/views/monitoreo/InformeActividadPeiView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/informe-subactividad-pei/:id',
      name: 'InformeSubActividadPei',
      component: () => import('@/views/monitoreo/InformeSubactividadPei.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/informes-actividad-subactividad-pei/:id',
      name: 'ListaInformesActividadSubActividadPei',
      component: () => import('@/views/monitoreo/InformesActividadSubactividadPeiView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/monitoreo/informe-actividad-ver/:id',
      name: 'VerInformeDeActividadPrincipal',
      component: () => import('@/views/monitoreo/InformeActividadPrincipalVerView.vue'),
    },
    {
      path: '/actividades/informe/',
      name: 'actividades',
      component: () => import('@/views/monitoreo/InformeListaActividadView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/actividades/informe-pei/',
      name: 'actividadesPei',
      component: () => import('@/views/monitoreo/InformeListaActividadPeiView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reporte/inicio',
      name: 'homeReporte',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reporte/proyectos',
      name: 'reporteListaProyectos',
      component: () => import('@/views/reportes/ProyectoReportesListaProyectos.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reporte/proyectos/:id/',
      name: 'reporteProyecto',
      component: () => import('@/views/reportes/ReporteProyectoView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reporte/actividades',
      name: 'reporteListaActividades',
      component: () => import('@/views/reportes/ActividadReporteListaActividades.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/usuarios/inicio',
      name: 'homeUsuariosInicio',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/notificaciones/inicio',
      name: 'homeNotificaciones',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/fonfosc/lista',
      name: 'fonfoscLista',
      component: () => import('@/views/fonfosc/ListaProyectosFonFoscView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/fonfosc/:id/marcologico',
      name: 'fonfoscMarcoLogico',
      component: () => import('@/modules/fonfosc/components/FonFoscMarcoLogico.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/fonfosc/:id/meta',
      name: 'fonfoscMetaInformacion',
      component: () => import('@/views/fonfosc/InformacionMetaFonFoscView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/fonfosc/:id/presupuesto',
      name: 'informacionPresupuestaria',
      component: () => import('@/views/fonfosc/PresupuestoFonFoscView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/fonfosc/informes-proyectos',
      name: 'informesProyectosLista',
      component: () => import('@/views/fonfosc/InformesListaFonFoscView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/fonfosc/crear-nuevo-proyecto-fonfosc',
      name: 'crearNuevoProyectoFonFosc',
      component: () => import('@/views/fonfosc/CrearNuevoProyectoFonFoscView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Función para inicializar la autenticación
async function initializeAuth() {
  const userStore = useUserStore()

  if (!userStore.initialized) {
    try {
      await userStore.initialize()
    } catch (error) {
      console.error('Error inicializando autenticación:', error)
    }
  }

  return userStore
}

// Guardia de navegación global
router.beforeEach(async (to, from, next) => {
  // Inicializar autenticación
  const userStore = await initializeAuth()

  // Verificar si la ruta requiere autenticación
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Si la ruta requiere autenticación y el usuario NO está autenticado
  if (requiresAuth && !userStore.isAuthenticated) {
    console.log('Acceso denegado. Redirigiendo a login...')
    next('/')
    return
  }

  // Si el usuario está autenticado y trata de acceder al login
  if (to.path === '/' && userStore.isAuthenticated) {
    console.log('Usuario ya autenticado. Redirigiendo a home...')
    next('/home')
    return
  }

  // Si hay rol requerido, verificarlo
  if (to.meta.requiredRole && !userStore.hasRole(to.meta.requiredRole)) {
    console.warn(`Acceso denegado. Se requiere rol: ${to.meta.requiredRole}`)
    next('/home')
    return
  }

  // Si hay múltiples roles requeridos, verificarlos
  if (to.meta.requiredRoles && !userStore.hasAnyRole(to.meta.requiredRoles)) {
    console.warn(
      `Acceso denegado. Se requiere uno de estos roles: ${to.meta.requiredRoles.join(', ')}`,
    )
    next('/home')
    return
  }

  // Permitir acceso
  next()
})

export default router
