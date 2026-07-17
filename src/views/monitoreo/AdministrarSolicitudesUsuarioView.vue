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
              :count-revisiones="conteoPendientesPorRevisar"
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
              <v-tabs-window-item value="fondos"
                >SOl de fondos{{ solicitudesFiltradasTodos }}</v-tabs-window-item
              >
              <v-tabs-window-item value="viajes">SOl de viajes</v-tabs-window-item>
              <v-tabs-window-item value="pago_directo">Sol de pago directo</v-tabs-window-item>
              <v-tabs-window-item value="reposicion">Sol de reposicion</v-tabs-window-item>
              <v-tabs-window-item value="rendicion">Rendicion de cuentas</v-tabs-window-item>
              <v-tabs-window-item value="revisiones">Revisiones pendientes</v-tabs-window-item>
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
  Solicitudes
************************************************************/
/***********************************************************
  Solicitudes
************************************************************/
/***********************************************************
  Solicitudes
************************************************************/
/***********************************************************
  Solicitudes
************************************************************/
/***********************************************************
  Solicitudes
************************************************************/
/***********************************************************
  Solicitudes
************************************************************/
/***********************************************************
  Solicitudes
************************************************************/

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

<style coped>
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
