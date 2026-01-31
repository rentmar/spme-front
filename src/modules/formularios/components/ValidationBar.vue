<template>
  <div class="validation-bar">
    <!-- Barra de botones principales - SOLO 5 ICONOS -->
    <div class="d-flex flex-wrap gap-1">
      <validation-button
        v-for="btn in botonesValidacion"
        :key="btn.type"
        :config="btn"
        :disabled="isButtonDisabled(btn.type)"
        @click="handleButtonClick(btn.type)"
      />
    </div>

    <!-- Diálogos de validación -->
    <!-- 1. Solicitud de Fondos -->
    <validation-dialog
      v-model="dialogs.solicitudFondos"
      title="Validar Solicitud de Fondos"
      :items="solicitudesFondos"
      loading-key="loadingSolicitudes"
      empty-message="No hay solicitudes de fondos pendientes de validación"
      @item-click="abrirFormulario011"
    >
      <template #item-content="{ item }">
        <div>
          <v-list-item-title class="font-weight-bold mb-1">
            Formulario: {{ item.numeroFormulario || `SF-${item.id}` }}
          </v-list-item-title>
          <div class="d-flex align-center flex-wrap">
            <span class="mr-2">Fecha: {{ formatDate(item.fechaSolicitud) }}</span>
          </div>
          <div class="text-caption mt-1">Lugar: {{ item.lugarSolicitud }}</div>
          <div class="text-caption mt-1">Monto: {{ formatCurrency(item.montoSolicitado) }}</div>
          <div class="text-caption mt-1">
            <v-chip
              v-if="item.validacionCoordinador && item.validacionResponsable"
              size="x-small"
              color="success"
              class="ml-1"
            >
              <v-icon x-small>mdi-check</v-icon>
              Completado
            </v-chip>
            <v-chip
              v-else-if="item.validacionCoordinador || item.validacionResponsable"
              size="x-small"
              color="warning"
              class="ml-1"
            >
              <v-icon x-small>mdi-clock</v-icon>
              Parcial
            </v-chip>
            <v-chip v-else size="x-small" color="error" class="ml-1">
              <v-icon x-small>mdi-alert</v-icon>
              Pendiente
            </v-chip>
          </div>
        </div>
      </template>
    </validation-dialog>

    <!-- 2. Solicitud de Viaje -->
    <validation-dialog
      v-model="dialogs.solicitudViaje"
      title="Validar Solicitud de Viaje"
      :items="solicitudesViaje"
      loading-key="loadingViajes"
      empty-message="No hay solicitudes de viaje pendientes de validación"
      @item-click="abrirFormularioSolicitudDeViajeParaValidar"
    >
      <template #item-content="{ item }">
        <div>
          <v-list-item-title class="font-weight-bold mb-1">
            Formulario: {{ item.numeroFormulario || `SV-${item.id}` }}
          </v-list-item-title>
          <div class="d-flex align-center flex-wrap">
            <span class="mr-2">Fecha: {{ formatDate(item.fechaSolicitud) }}</span>
          </div>
          <div class="text-caption mt-1">Destino: {{ item.destino || 'No especificado' }}</div>
          <div class="text-caption mt-1">Duración: {{ item.duracionDias || 0 }} días</div>
          <div class="text-caption mt-1">Lugar: {{ item.lugarSolicitud }}</div>
          <div class="text-caption mt-1">
            <v-chip
              v-if="item.validacionCoordinador && item.validacionResponsable"
              size="x-small"
              color="success"
              class="ml-1"
            >
              <v-icon x-small>mdi-check</v-icon>
              Completado
            </v-chip>
            <v-chip
              v-else-if="item.validacionCoordinador || item.validacionResponsable"
              size="x-small"
              color="warning"
              class="ml-1"
            >
              <v-icon x-small>mdi-clock</v-icon>
              Parcial
            </v-chip>
            <v-chip v-else size="x-small" color="error" class="ml-1">
              <v-icon x-small>mdi-alert</v-icon>
              Pendiente
            </v-chip>
          </div>
        </div>
      </template>
    </validation-dialog>

    <!-- 3. Solicitud de Pago Directo -->
    <validation-dialog
      v-model="dialogs.solicitudPagoDirecto"
      title="Validar Solicitud de Pago Directo"
      :items="solicitudesPagoDirecto"
      loading-key="loadingPagosDirectos"
      empty-message="No hay solicitudes de pago directo pendientes de validación"
      @item-click="abrirFormularioSolicitudDePagoDirectoParaValidar"
    >
      <template #item-content="{ item }">
        <div>
          <v-list-item-title class="font-weight-bold mb-1">
            Formulario: {{ item.numeroFormulario || `SPD-${item.id}` }}
          </v-list-item-title>
          <div class="d-flex align-center flex-wrap">
            <span class="mr-2">Fecha: {{ formatDate(item.fechaSolicitud) }}</span>
          </div>
          <div class="text-caption mt-1">Lugar: {{ item.lugarSolicitud }}</div>
          <div class="text-caption mt-1">
            Proveedor: {{ item.nombreProveedor || 'No especificado' }}
          </div>
          <div class="text-caption mt-1">Monto: {{ formatCurrency(item.montoSolicitado) }}</div>
          <div class="text-caption mt-1">
            <v-chip
              v-if="item.validacionCoordinador && item.validacionResponsable"
              size="x-small"
              color="success"
              class="ml-1"
            >
              <v-icon x-small>mdi-check</v-icon>
              Completado
            </v-chip>
            <v-chip
              v-else-if="item.validacionCoordinador || item.validacionResponsable"
              size="x-small"
              color="warning"
              class="ml-1"
            >
              <v-icon x-small>mdi-clock</v-icon>
              Parcial
            </v-chip>
            <v-chip v-else size="x-small" color="error" class="ml-1">
              <v-icon x-small>mdi-alert</v-icon>
              Pendiente
            </v-chip>
          </div>
        </div>
      </template>
    </validation-dialog>

    <!-- 4. Solicitud de Reposición -->
    <validation-dialog
      v-model="dialogs.solicitudReposicion"
      title="Validar Solicitud de Reposición"
      :items="solicitudesReposicion"
      loading-key="loadingReposiciones"
      empty-message="No hay solicitudes de reposición pendientes de validación"
      @item-click="abrirFormularioReposicion"
    >
      <template #item-content="{ item }">
        <div>
          <v-list-item-title class="font-weight-bold mb-1">
            Formulario: {{ item.numeroFormulario || `SREP-${item.id}` }}
          </v-list-item-title>
          <div class="d-flex align-center flex-wrap">
            <span class="mr-2">Fecha: {{ formatDate(item.fechaSolicitud) }}</span>
          </div>
          <div class="text-caption mt-1">Lugar: {{ item.lugarSolicitud }}</div>
          <div class="text-caption mt-1">
            Motivo: {{ item.motivoReposicion || 'No especificado' }}
          </div>
          <div class="text-caption mt-1">Monto: {{ formatCurrency(item.montoReposicion) }}</div>
          <div class="text-caption mt-1">
            <v-chip
              v-if="item.validacionCoordinador && item.validacionResponsable"
              size="x-small"
              color="success"
              class="ml-1"
            >
              <v-icon x-small>mdi-check</v-icon>
              Completado
            </v-chip>
            <v-chip
              v-else-if="item.validacionCoordinador || item.validacionResponsable"
              size="x-small"
              color="warning"
              class="ml-1"
            >
              <v-icon x-small>mdi-clock</v-icon>
              Parcial
            </v-chip>
            <v-chip v-else size="x-small" color="error" class="ml-1">
              <v-icon x-small>mdi-alert</v-icon>
              Pendiente
            </v-chip>
          </div>
        </div>
      </template>
    </validation-dialog>

    <!-- 5. Rendición de Cuentas -->
    <validation-dialog
      v-model="dialogs.rendicionCuentas"
      title="Validar Rendición de Cuentas"
      :items="rendicionesCuentas"
      loading-key="loadingRendiciones"
      empty-message="No hay rendiciones de cuentas pendientes de validación"
      @item-click="abrirFormularioRendicionCuentasValidar"
    >
      <template #item-content="{ item }">
        <div>
          <v-list-item-title class="font-weight-bold mb-1">
            Formulario: {{ item.numeroFormulario || `RC-${item.id}` }}
          </v-list-item-title>
          <div class="d-flex align-center flex-wrap">
            <span class="mr-2">Fecha Desembolso: {{ formatDate(item.fechaDesembolso) }}</span>
          </div>
          <div class="text-caption mt-1">Monto: {{ formatCurrency(item.montoDescargado) }}</div>
          <div class="text-caption mt-1">
            <v-chip
              v-if="
                item.validacionCoordinador &&
                item.validacionContador &&
                item.validacionAdministrador
              "
              size="x-small"
              color="success"
              class="ml-1"
            >
              <v-icon x-small>mdi-check-all</v-icon>
              Completado
            </v-chip>
            <v-chip
              v-else-if="
                item.validacionCoordinador ||
                item.validacionContador ||
                item.validacionAdministrador
              "
              size="x-small"
              color="warning"
              class="ml-1"
            >
              <v-icon x-small>mdi-clock-check</v-icon>
              Parcial
            </v-chip>
            <v-chip v-else size="x-small" color="error" class="ml-1">
              <v-icon x-small>mdi-alert</v-icon>
              Pendiente
            </v-chip>
          </div>
        </div>
      </template>
    </validation-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ValidationButton from './partials/ValidationButton.vue'
import ValidationDialog from './partials/ValidationDialog.vue'

// Props
const props = defineProps({
  // Configuración básica
  actividadId: {
    type: Number,
    required: true,
  },
  tareaId: {
    type: Number,
    default: null,
  },

  // Datos opcionales para pre-cargar
  actividadData: {
    type: Object,
    default: () => ({}),
  },

  // Control de carga
  autoLoad: {
    type: Boolean,
    default: false,
  },

  // Mostrar etiquetas de texto
  showLabels: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['loading-start', 'loading-end', 'error', 'button-click', 'item-selected'])

const router = useRouter()
const userStore = useUserStore()
const baseurl = import.meta.env.VITE_API_BASE

// Estados reactivos
const loadingStates = ref({
  solicitudesFondos: false,
  solicitudesViaje: false,
  solicitudesPagoDirecto: false,
  solicitudesReposicion: false,
  rendicionesCuentas: false,
})

// Datos de los diálogos
const solicitudesFondos = ref([])
const solicitudesViaje = ref([])
const solicitudesPagoDirecto = ref([])
const solicitudesReposicion = ref([])
const rendicionesCuentas = ref([])

// Control de diálogos
const dialogs = ref({
  solicitudFondos: false,
  solicitudViaje: false,
  solicitudPagoDirecto: false,
  solicitudReposicion: false,
  rendicionCuentas: false,
})

// ICONOS IDÉNTICOS A LA VISTA ORIGINAL
const botonesValidacion = ref([
  {
    type: 'solicitud_fondos',
    icon: 'mdi-thumb-up', // EXACTAMENTE IGUAL A LA VISTA ORIGINAL
    color: 'primary',
    tooltip: 'Validar Solicitud de Fondos',
    label: 'Fondos',
    visible: true,
    showLabel: props.showLabels,
    // Mismo color y estilo que en la vista original
  },
  {
    type: 'solicitud_viaje',
    icon: 'mdi-thumb-up', // EXACTAMENTE IGUAL A LA VISTA ORIGINAL
    color: 'deep-purple',
    tooltip: 'Validar Solicitud de Viaje',
    label: 'Viaje',
    visible: true,
    showLabel: props.showLabels,
  },
  {
    type: 'solicitud_pago_directo',
    icon: 'mdi-thumb-up', // EXACTAMENTE IGUAL A LA VISTA ORIGINAL
    color: 'teal-lighten-2',
    tooltip: 'Validar Solicitud de Pago Directo',
    label: 'Pago Directo',
    visible: true,
    showLabel: props.showLabels,
  },
  {
    type: 'solicitud_reposicion',
    icon: 'mdi-thumb-up', // EXACTAMENTE IGUAL A LA VISTA ORIGINAL
    color: 'warning',
    tooltip: 'Validar Solicitud de Reposición',
    label: 'Reposición',
    visible: true,
    showLabel: props.showLabels,
  },
  {
    type: 'rendicion_cuentas',
    icon: 'mdi-thumb-up', // EXACTAMENTE IGUAL A LA VISTA ORIGINAL
    color: 'error',
    tooltip: 'Validar Rendición de Cuentas',
    label: 'Rendición',
    visible: true,
    showLabel: props.showLabels,
  },
])

const usuario = computed(() => ({
  nombre: userStore.usuario,
  role: userStore.rol,
}))

// Métodos principales
const handleButtonClick = async (buttonType) => {
  emit('button-click', {
    type: buttonType,
    actividadId: props.actividadId,
    tareaId: props.tareaId,
  })

  switch (buttonType) {
    case 'solicitud_fondos':
      await cargarSolicitudesFondos()
      dialogs.value.solicitudFondos = true
      break

    case 'solicitud_viaje':
      await cargarSolicitudDeViaje()
      dialogs.value.solicitudViaje = true
      break

    case 'solicitud_pago_directo':
      await cargarSolicitudDePagoDirecto()
      dialogs.value.solicitudPagoDirecto = true
      break

    case 'solicitud_reposicion':
      await cargarSolicitudDeReposicion()
      dialogs.value.solicitudReposicion = true
      break

    case 'rendicion_cuentas':
      await cargarRendicionesDeCuenta()
      dialogs.value.rendicionCuentas = true
      break
  }
}

// Funciones de carga de datos
const cargarSolicitudesFondos = async () => {
  loadingStates.value.solicitudesFondos = true
  emit('loading-start', 'solicitudesFondos')

  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudFondos/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

    const data = await response.json()

    // Filtrar por actividad y tarea - MISMO FILTRADO QUE LA VISTA ORIGINAL
    solicitudesFondos.value = data.solicitudes.filter((solicitud) => {
      const coincideActividad = solicitud.actividad_id === props.actividadId
      const coincideTarea = props.tareaId ? solicitud.tarea_id === props.tareaId : true
      return coincideActividad && coincideTarea
    })

    // Ordenar por fecha más reciente primero
    solicitudesFondos.value.sort((a, b) => new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud))
  } catch (error) {
    console.error('Error cargando solicitudes de fondos:', error)
    emit('error', { type: 'solicitudesFondos', error })
  } finally {
    loadingStates.value.solicitudesFondos = false
    emit('loading-end', 'solicitudesFondos')
  }
}

const cargarSolicitudDeViaje = async () => {
  loadingStates.value.solicitudesViaje = true
  emit('loading-start', 'solicitudesViaje')

  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudesViaje/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_actividad: props.actividadId,
        id_tarea: props.tareaId,
      }),
    })

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

    const data = await response.json()
    solicitudesViaje.value = data.solicitudes || []

    // Ordenar por fecha más reciente primero
    solicitudesViaje.value.sort((a, b) => new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud))
  } catch (error) {
    console.error('Error cargando solicitudes de viaje:', error)
    emit('error', { type: 'solicitudesViaje', error })
  } finally {
    loadingStates.value.solicitudesViaje = false
    emit('loading-end', 'solicitudesViaje')
  }
}

const cargarSolicitudDePagoDirecto = async () => {
  loadingStates.value.solicitudesPagoDirecto = true
  emit('loading-start', 'solicitudesPagoDirecto')

  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudesPagoDirecto/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_actividad: props.actividadId,
        id_tarea: props.tareaId,
      }),
    })

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

    const data = await response.json()
    solicitudesPagoDirecto.value = data.solicitudes || []

    // Ordenar por fecha más reciente primero
    solicitudesPagoDirecto.value.sort(
      (a, b) => new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud),
    )
  } catch (error) {
    console.error('Error cargando solicitudes de pago directo:', error)
    emit('error', { type: 'solicitudesPagoDirecto', error })
  } finally {
    loadingStates.value.solicitudesPagoDirecto = false
    emit('loading-end', 'solicitudesPagoDirecto')
  }
}

const cargarSolicitudDeReposicion = async () => {
  loadingStates.value.solicitudesReposicion = true
  emit('loading-start', 'solicitudesReposicion')

  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudReembolso/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_actividad: props.actividadId,
        id_tarea: props.tareaId,
      }),
    })

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

    const data = await response.json()
    solicitudesReposicion.value = data.solicitudes || []

    // Ordenar por fecha más reciente primero
    solicitudesReposicion.value.sort(
      (a, b) => new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud),
    )
  } catch (error) {
    console.error('Error cargando solicitudes de reposición:', error)
    emit('error', { type: 'solicitudesReposicion', error })
  } finally {
    loadingStates.value.solicitudesReposicion = false
    emit('loading-end', 'solicitudesReposicion')
  }
}

const cargarRendicionesDeCuenta = async () => {
  loadingStates.value.rendicionesCuentas = true
  emit('loading-start', 'rendicionesCuentas')

  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerRendicionDeCuentas/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_actividad: props.actividadId,
        id_tarea: props.tareaId,
      }),
    })

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

    const data = await response.json()
    rendicionesCuentas.value = data.rendiciones || []

    // Ordenar por fecha más reciente primero
    rendicionesCuentas.value.sort(
      (a, b) => new Date(b.fechaDesembolso) - new Date(a.fechaDesembolso),
    )
  } catch (error) {
    console.error('Error cargando rendiciones:', error)
    emit('error', { type: 'rendicionesCuentas', error })
  } finally {
    loadingStates.value.rendicionesCuentas = false
    emit('loading-end', 'rendicionesCuentas')
  }
}

// Funciones de navegación - IGUALES A LA VISTA ORIGINAL
const abrirFormulario011 = (solicitudId) => {
  const routeConfig = {
    path: `/monitoreo/formulario011/${props.actividadId}`,
    query: { solicitud_id: solicitudId },
  }

  if (props.tareaId) {
    routeConfig.query.tarea_id = props.tareaId
  }

  router.push(routeConfig)
  emit('item-selected', { type: 'solicitud_fondos', id: solicitudId })
}

const abrirFormularioSolicitudDeViajeParaValidar = (solicitudId) => {
  router.push({
    path: `/monitoreo/formulario055/${props.actividadId}`,
    query: { solicitud_id: solicitudId },
  })
  emit('item-selected', { type: 'solicitud_viaje', id: solicitudId })
}

const abrirFormularioSolicitudDePagoDirectoParaValidar = (solicitudId) => {
  router.push({
    path: `/monitoreo/formulario088/${props.actividadId}`,
    query: { solicitud_id: solicitudId },
  })
  emit('item-selected', { type: 'solicitud_pago_directo', id: solicitudId })
}

const abrirFormularioReposicion = (solicitudId) => {
  router.push({
    path: `/monitoreo/formulario033/${props.actividadId}`,
    query: { solicitud_id: solicitudId },
  })
  emit('item-selected', { type: 'solicitud_reposicion', id: solicitudId })
}

const abrirFormularioRendicionCuentasValidar = (rendicionId) => {
  router.push({
    path: `/monitoreo/formulario022/${props.actividadId}`,
    query: { solicitud_id: rendicionId },
  })
  emit('item-selected', { type: 'rendicion_cuentas', id: rendicionId })
}

// Funciones de utilidad
const isButtonDisabled = (buttonType) => {
  if (!props.actividadData) return false

  // MISMA LÓGICA DE DESHABILITACIÓN QUE LA VISTA ORIGINAL
  switch (buttonType) {
    case 'solicitud_fondos':
    case 'solicitud_viaje':
    case 'solicitud_pago_directo':
    case 'solicitud_reposicion':
    case 'rendicion_cuentas':
      // En la vista original, los botones de validación tenían esta condición:
      // :disabled="getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos && false"
      // Como estamos haciendo solo validaciones, normalmente no deberían estar deshabilitados
      return false
    default:
      return false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  } catch {
    return 'Fecha inválida'
  }
}

const formatCurrency = (amount) => {
  const num = Number(amount)
  return !isNaN(num) ? `Bs. ${num.toFixed(2)}` : 'Bs. 0.00'
}

// Watch para cambios en props
watch(
  () => props.actividadId,
  () => {
    // Resetear datos cuando cambia la actividad
    solicitudesFondos.value = []
    solicitudesViaje.value = []
    solicitudesPagoDirecto.value = []
    solicitudesReposicion.value = []
    rendicionesCuentas.value = []
  },
)

// Actualizar showLabels en botones cuando cambia la prop
watch(
  () => props.showLabels,
  (newValue) => {
    botonesValidacion.value.forEach((btn) => {
      btn.showLabel = newValue
    })
  },
)

// Carga inicial si autoLoad está activado
import { onMounted } from 'vue'

onMounted(() => {
  if (props.autoLoad) {
    // Cargar datos iniciales si es necesario
  }
})
</script>

<style scoped>
.validation-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

/* ESTILOS IDÉNTICOS A LA VISTA ORIGINAL */
.validation-bar .v-btn {
  min-width: 32px;
  height: 32px;
  border-radius: 4px;
}

/* Para mostrar etiquetas */
.boton-con-etiqueta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.boton-con-etiqueta .v-btn {
  margin-bottom: 2px;
}

.boton-con-etiqueta .etiqueta {
  font-size: 10px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  line-height: 1;
}

/* Estilo para el botón activo/hover */
.validation-bar .v-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

.validation-bar .v-btn:active {
  transform: translateY(0);
}
</style>
