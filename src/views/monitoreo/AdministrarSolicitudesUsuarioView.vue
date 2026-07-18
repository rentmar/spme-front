<template>
  <v-container fluid class="mis-solicitudes-view pa-0">
    <!--Overlay de carga-->
    <v-overlay :model-value="loading" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" width="6" />
        <p class="mt-4 text-h6">Cargando solicitudes...</p>
      </div>
    </v-overlay>
    <template v-if="!loading">
      <!-- Encabezado con estadísticas -->
      <UsuarioEstadisticas
        :total="conteoTotalSolicitudes"
        :pendientes="conteoPendientes"
        :aprobadas="conteoAprobadas"
        :rechazadas="conteoRechazadas"
        :sin-revisor="conteoSinRevisores"
        :por-revisar="conteoPendientesPorRevisar"
      ></UsuarioEstadisticas>

      <!-- Contenido principal -->
      <v-row class="ma-0 px-4 pt-0 pb-2">
        <v-col cols="12" class="pa-0">
          <v-card class="main-card">
            <!-- Tabs de navegación -->
            <MisSolicitudesTabs
              v-model="tabActivo"
              :total-solicitudes="conteoTotalSolicitudes"
              :count-fondos="conteoSolFondos"
              :count-viajes="conteoSolDeViajes"
              :count-pago-directo="conteoSolPagoDirecto"
              :count-reposicion="conteoSolReposicion"
              :count-rendicion="conteoRendicionCuentas"
              :count-revisiones="conteoRevisadasPorRevisar"
              :count-pendientes="conteoPendientesPorRevisar"
            ></MisSolicitudesTabs>

            <v-divider />
            <!-- Contenido de tabs -->
            <v-tabs-window v-model="tabActivo">
              <v-tabs-window-item value="todas">
                <PanelTodasSolicitudes
                  :filtros="filtrosTodos"
                  :solicitudes="solicitudesFiltradasTodos"
                  @update:filtros="filtrosTodos = $event"
                  @limpiar-filtros="limpiarFiltrosTodos"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="fondos">
                <PanelSolicitudesFondos
                  :filtros="filtrosSolFondos"
                  :solicitudes="solicitudesFiltradasFondos"
                  @update:filtros="filtrosSolFondos = $event"
                  @limpiar-filtros="limpiarFiltrosFondos"
                ></PanelSolicitudesFondos>
              </v-tabs-window-item>
              <v-tabs-window-item value="viajes"
                ><PanelSolicitudesViajes
                  :filtros="filtrosSolViajes"
                  :solicitudes="solicitudesFiltradasViajes"
                  @update:filtros="filtrosSolViajes = $event"
                  @limpiar-filtros="limpiarFiltrosViajes"
                ></PanelSolicitudesViajes>
              </v-tabs-window-item>
              <v-tabs-window-item value="pago_directo">
                <PanelPagoDirecto
                  :filtros="filtrosSolPagoDirecto"
                  :solicitudes="solicitudesFiltradasPagoDirecto"
                  @update:filtros="filtrosSolPagoDirecto = $event"
                  @limpiar-filtros="limpiarFiltrosPagoDirecto"
                ></PanelPagoDirecto>
              </v-tabs-window-item>
              <v-tabs-window-item value="reposicion">
                <PanelReposicion
                  :filtros="filtrosSolReposicion"
                  :solicitudes="solicitudesFiltradasReposicion"
                  @update:filtros="filtrosSolReposicion = $event"
                  @limpiar-filtros="limpiarFiltrosReposicion"
                ></PanelReposicion>
              </v-tabs-window-item>
              <v-tabs-window-item value="rendicion">
                <PanelRendicion
                  :filtros="filtrosSolRendicion"
                  :solicitudes="solicitudesFiltradasRendicion"
                  @update:filtros="filtrosSolRendicion = $event"
                  @limpiar-filtros="limpiarFiltrosRendicion"
                ></PanelRendicion
              ></v-tabs-window-item>
              <v-tabs-window-item value="revisiones">
                <PanelTodasRevisiones
                  :filtros="filtroSolRevisadasPorRevisar"
                  :solicitudes="solicitudesFiltradasRevisadasPorRevisar"
                  @update:filtros="filtroSolRevisadasPorRevisar = $event"
                  @limpiar-filtros="limpiarFiltroSolRevisadasPorRevisar"
                ></PanelTodasRevisiones>
              </v-tabs-window-item>
              <v-tabs-window-item value="pendientes">
                <PanelParaRevisar
                  :filtros="filtroSolicitudesPorRevisar"
                  :solicitudes="solicitudesFiltradasPorRevisar"
                  @update:filtros="filtroSolicitudesPorRevisar = $event"
                  @limpiar-filtros="limpiarFiltroSolicitudesPorRevisar"
                ></PanelParaRevisar>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import UsuarioEstadisticas from '@/modules/administrarSolicitudes/usuarioRegular/components/UsuarioEstadisticas.vue'
import MisSolicitudesTabs from '@/modules/administrarSolicitudes/usuarioRegular/components/MisSolicitudesTabs.vue'
import PanelTodasSolicitudes from '@/modules/administrarSolicitudes/usuarioRegular/components/PanelTodasSolicitudes.vue'
import PanelSolicitudesFondos from '@/modules/administrarSolicitudes/usuarioRegular/components/PanelSolicitudesFondos.vue'
import PanelSolicitudesViajes from '@/modules/administrarSolicitudes/usuarioRegular/components/PanelSolicitudesViajes.vue'
import PanelPagoDirecto from '@/modules/administrarSolicitudes/usuarioRegular/components/PanelPagoDirecto.vue'
import PanelReposicion from '@/modules/administrarSolicitudes/usuarioRegular/components/PanelReposicion.vue'
import PanelRendicion from '@/modules/administrarSolicitudes/usuarioRegular/components/PanelRendicion.vue'
import PanelParaRevisar from '@/modules/administrarSolicitudes/usuarioRegular/components/PanelParaRevisar.vue'
import PanelTodasRevisiones from '@/modules/administrarSolicitudes/usuarioRegular/components/PanelTodasRevisiones.vue'
//composables
import { useSnackbar } from '@/composables/useSnackbar'
//store
import { useMisSolicitudesStore } from '@/modules/administrarSolicitudes/usuarioRegular/store/useMisSolicitudesStore'

//Estados
const loading = ref(false)
const tabActivo = ref('todas')

//Inicializar el store
const storeSolicitudes = useMisSolicitudesStore()

//Inicializar composables
const { successMsg, errorMsg } = useSnackbar()

/***********************************************************
  Datos para estadisticas
************************************************************/
//Total de las solicitudes
const conteoTotalSolicitudes = computed(() => {
  return storeSolicitudes.totalSolicitudes
})

//Solicitudes pendientes
const conteoPendientes = computed(() => {
  return storeSolicitudes.solicitudesPendientes
})

//Solicitudes aprobadas
const conteoAprobadas = computed(() => {
  return storeSolicitudes.solicitudesAprobadas
})

//Sol rechazadas
const conteoRechazadas = computed(() => {
  return storeSolicitudes.solicitudesRechazadas
})

//SOl sin revisores asignados
const conteoSinRevisores = computed(() => {
  return storeSolicitudes.solicitudesSinRevisores
})

//Sol por revisar
const conteoPendientesPorRevisar = computed(() => {
  return storeSolicitudes.totalPendientesRevision
})

//Sol revisadas y por revisar
const conteoRevisadasPorRevisar = computed(() => {
  return storeSolicitudes.totalPorRevisarRevisadas || 0
})

//Conteo de sol de fondos
const conteoSolFondos = computed(() => {
  return storeSolicitudes.countFondos
})
//COnteo de sol de viajes
const conteoSolDeViajes = computed(() => {
  return storeSolicitudes.countViajes
})
//Conteo de sol pago directo
const conteoSolPagoDirecto = computed(() => {
  return storeSolicitudes.countPagoDirecto
})
//Conteo de sol de reposicion
const conteoSolReposicion = computed(() => {
  return storeSolicitudes.countReembolso
})
//Conteo de rendicion de cuentas
const conteoRendicionCuentas = computed(() => {
  return storeSolicitudes.countRendiciones
})

/***********************************************************
  Todas las Solicitudes
************************************************************/
//Filtro
const filtrosTodos = ref({ estado: null, busqueda: '' })
//Solicitudes filtradas
const solicitudesFiltradasTodos = computed(() => {
  return storeSolicitudes.todasLasSolicitudes.filter((s) => {
    // Acceder con .value
    if (filtrosTodos.value.estado && s.estadoConsolidado !== filtrosTodos.value.estado) {
      return false
    }
    if (filtrosTodos.value.busqueda) {
      const search = filtrosTodos.value.busqueda.toLowerCase()
      return (
        s.numeroForm?.toLowerCase().includes(search) ||
        s.subtipo?.toLowerCase().includes(search) ||
        s.usuarioSolicitante?.nombre?.toLowerCase().includes(search) ||
        s.actividad?.codigo?.toLowerCase().includes(search)
      )
    }
    return true
  })
})

const limpiarFiltrosTodos = () => {
  filtrosTodos.value.estado = null
  filtrosTodos.value.busqueda = ''
}

/***********************************************************
  Solicitudes de Fondos
************************************************************/
const filtrosSolFondos = ref({ estado: null, actividad: '', montoMinimo: null })
// Fondos
const solicitudesFiltradasFondos = computed(() => {
  return storeSolicitudes.solicitudesFondos.filter((s) => {
    if (filtrosSolFondos.value.estado && s.estadoConsolidado !== filtrosSolFondos.value.estado)
      return false
    if (
      filtrosSolFondos.value.actividad &&
      !s.actividad?.codigo?.toLowerCase().includes(filtrosSolFondos.value.actividad.toLowerCase())
    )
      return false
    if (
      filtrosSolFondos.value.montoMinimo &&
      s.montoSolicitado < parseFloat(filtrosSolFondos.value.montoMinimo)
    )
      return false
    return true
  })
})
const limpiarFiltrosFondos = () => {
  filtrosSolFondos.value = { estado: null, actividad: '', montoMinimo: null }
}
/***********************************************************
  Solicitudes de viajes
************************************************************/
const filtrosSolViajes = ref({ estado: null, destino: '', busqueda: '' })

// Viajes
const solicitudesFiltradasViajes = computed(() => {
  return storeSolicitudes.solicitudesViaje.filter((s) => {
    if (filtrosSolViajes.value.estado && s.estadoConsolidado !== filtrosSolViajes.value.estado)
      return false
    if (
      filtrosSolViajes.value.destino &&
      !s.lugarEvento?.toLowerCase().includes(filtrosSolViajes.value.destino.toLowerCase())
    )
      return false
    if (filtrosSolViajes.value.busqueda) {
      const search = filtrosSolViajes.value.busqueda.toLowerCase()
      return (
        s.numeroForm?.toLowerCase().includes(search) || s.evento?.toLowerCase().includes(search)
      )
    }
    return true
  })
})

const limpiarFiltrosViajes = () => {
  filtrosSolViajes.value = { estado: null, destino: '', busqueda: '' }
}
/***********************************************************
  Solicitudes de pago directo
************************************************************/
const filtrosSolPagoDirecto = ref({ estado: null, proveedor: '', factura: '' })
// Pago Directo
const solicitudesFiltradasPagoDirecto = computed(() => {
  return storeSolicitudes.solicitudPagoDirecto.filter((s) => {
    if (
      filtrosSolPagoDirecto.value.estado &&
      s.estadoConsolidado !== filtrosSolPagoDirecto.value.estado
    )
      return false
    if (
      filtrosSolPagoDirecto.value.proveedor &&
      !s.proveedor?.toLowerCase().includes(filtrosSolPagoDirecto.value.proveedor.toLowerCase())
    )
      return false
    if (
      filtrosSolPagoDirecto.value.factura &&
      !s.factura?.toLowerCase().includes(filtrosSolPagoDirecto.value.factura.toLowerCase())
    )
      return false
    return true
  })
})

const limpiarFiltrosPagoDirecto = () => {
  filtrosSolPagoDirecto.value = { estado: null, proveedor: '', factura: '' }
}
/***********************************************************
  Solicitudes de reposicion
************************************************************/
const filtrosSolReposicion = ref({ estado: null, tipoGasto: '', montoMinimo: null })

const solicitudesFiltradasReposicion = computed(() => {
  return storeSolicitudes.solicitudReposicion.filter((s) => {
    if (
      filtrosSolReposicion.value.estado &&
      s.estadoConsolidado !== filtrosSolReposicion.value.estado
    )
      return false
    if (
      filtrosSolReposicion.value.tipoGasto &&
      !s.tipo_gasto?.toLowerCase().includes(filtrosSolReposicion.value.tipoGasto.toLowerCase())
    )
      return false
    if (
      filtrosSolReposicion.value.montoMinimo &&
      s.montoSolicitado < parseFloat(filtrosSolReposicion.value.montoMinimo)
    )
      return false
    return true
  })
})

const limpiarFiltrosReposicion = () => {
  filtrosSolReposicion.value = { estado: null, tipoGasto: '', montoMinimo: null }
}
/***********************************************************
  Rendicion de cuentas
************************************************************/
const filtrosSolRendicion = ref({ estado: null, solicitudAsociada: '', cumplimiento: null })
// Rendición
const solicitudesFiltradasRendicion = computed(() => {
  return storeSolicitudes.rendicionCuentas.filter((s) => {
    if (
      filtrosSolRendicion.value.estado &&
      s.estadoConsolidado !== filtrosSolRendicion.value.estado
    )
      return false
    if (
      filtrosSolRendicion.value.solicitudAsociada &&
      !s.solicitud_asociada
        ?.toLowerCase()
        .includes(filtrosSolRendicion.value.solicitudAsociada.toLowerCase())
    )
      return false
    return true
  })
})
const limpiarFiltrosRendicion = () => {
  filtrosSolRendicion.value = { estado: null, solicitudAsociada: '', cumplimiento: null }
}

/***********************************************************
  Solicitudes por revisar
************************************************************/
/***********************************************************
  Solicitudes por revisar
************************************************************/
const filtroSolicitudesPorRevisar = ref({
  tipoDocumento: null,
  busqueda: '',
})

const solicitudesFiltradasPorRevisar = computed(() => {
  const pendientes = storeSolicitudes.totalSolRevisionesPorRevisar || []

  return pendientes.filter((s) => {
    // Filtro por tipo de documento
    if (
      filtroSolicitudesPorRevisar.value.tipoDocumento &&
      s.tipoDocumento !== filtroSolicitudesPorRevisar.value.tipoDocumento
    )
      return false

    // Filtro por búsqueda: código seguimiento, código documento, solicitante
    if (filtroSolicitudesPorRevisar.value.busqueda) {
      const search = filtroSolicitudesPorRevisar.value.busqueda.toLowerCase()
      const codigoSeguimiento = (s.codigoSeguimiento || '').toLowerCase()
      const codigoDocumento = (s.solicitudCodigo || s.documentoCodigo || '').toLowerCase()
      const solicitante = (s.solicitanteNombre || '').toLowerCase()

      if (
        !codigoSeguimiento.includes(search) &&
        !codigoDocumento.includes(search) &&
        !solicitante.includes(search)
      )
        return false
    }

    return true
  })
})

const limpiarFiltroSolicitudesPorRevisar = () => {
  filtroSolicitudesPorRevisar.value = { tipoDocumento: null, busqueda: '' }
}
/***********************************************************
  Solicitudes revisadas/por revisar (TODAS LAS REVISIONES)
************************************************************/
const filtroSolRevisadasPorRevisar = ref({
  estado: null,
  tipoDocumento: null,
  busqueda: '',
})

const solicitudesFiltradasRevisadasPorRevisar = computed(() => {
  const revisiones = storeSolicitudes.totalSolRevisionesPorRevisar || []
  return revisiones.filter((s) => {
    // Filtro por estado
    if (
      filtroSolRevisadasPorRevisar.value.estado &&
      s.estado !== filtroSolRevisadasPorRevisar.value.estado
    )
      return false

    // Filtro por tipo de documento
    if (
      filtroSolRevisadasPorRevisar.value.tipoDocumento &&
      s.tipoDocumento !== filtroSolRevisadasPorRevisar.value.tipoDocumento
    )
      return false

    // Filtro por búsqueda: código seguimiento, código documento, solicitante
    if (filtroSolRevisadasPorRevisar.value.busqueda) {
      const search = filtroSolRevisadasPorRevisar.value.busqueda.toLowerCase()
      const codigoSeguimiento = (s.codigoSeguimiento || '').toLowerCase()
      const codigoDocumento = (s.solicitudCodigo || s.documentoCodigo || '').toLowerCase()
      const solicitante = (s.solicitanteNombre || '').toLowerCase()

      if (
        !codigoSeguimiento.includes(search) &&
        !codigoDocumento.includes(search) &&
        !solicitante.includes(search)
      )
        return false
    }

    return true
  })
})

const limpiarFiltroSolRevisadasPorRevisar = () => {
  filtroSolRevisadasPorRevisar.value = { estado: null, tipoDocumento: null, busqueda: '' }
}
/***********************************************************
  Carga de Informacion
**********************************************************/
//Funcion para cargar datos
const cargarDatos = async () => {
  loading.value = true
  try {
    await storeSolicitudes.inicializar()
    successMsg('Solicitudes Cargadas')
  } catch (error) {
    console.error('Error al cargar datos:', error)
    errorMsg(`Error de carga solicitudes: ${error}`)
  } finally {
    loading.value = false
  }
}
//Hook
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.mis-solicitudes-view {
  background: #f5f5f5;
  min-height: 100vh;
  max-width: 100% !important;
  margin: 0 !important;
}

.main-card {
  background: white !important;
  border: 1px solid #e0e0e0;
}

.fab-nueva-solicitud {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.fab-nueva-solicitud:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

@media (max-width: 960px) {
  .fab-nueva-solicitud {
    bottom: 16px;
    right: 16px;
  }
}
</style>
