<template>
  <div class="validation-bar activity-bar">
    <!-- Barra principal con 5 botones -->
    <div class="d-flex flex-wrap gap-1">
      <!-- Botón: Solicitud de Fondos -->
      <v-btn
        :color="getButtonColor('solicitud_fondos')"
        :disabled="loadingStates.solicitudFondos || isButtonDisabled('solicitud_fondos')"
        :loading="loadingStates.solicitudFondos"
        size="small"
        class="validation-btn"
        @click="handleClick('solicitud_fondos')"
      >
        <v-icon>mdi-thumb-up</v-icon>
        <span v-if="showLabels" class="ml-1">Fondos</span>
        <v-badge
          v-if="showBadges && pendientes.fondos > 0"
          :content="pendientes.fondos"
          color="error"
          inline
          class="ml-1"
        />
      </v-btn>

      <!-- Botón: Solicitud de Viaje -->
      <v-btn
        :color="getButtonColor('solicitud_viaje')"
        :disabled="loadingStates.solicitudViaje || isButtonDisabled('solicitud_viaje')"
        :loading="loadingStates.solicitudViaje"
        size="small"
        class="validation-btn"
        @click="handleClick('solicitud_viaje')"
      >
        <v-icon>mdi-thumb-up</v-icon>
        <span v-if="showLabels" class="ml-1">Viaje</span>
        <v-badge
          v-if="showBadges && pendientes.viaje > 0"
          :content="pendientes.viaje"
          color="error"
          inline
          class="ml-1"
        />
      </v-btn>

      <!-- Botón: Solicitud de Pago Directo -->
      <v-btn
        :color="getButtonColor('solicitud_pago_directo')"
        :disabled="loadingStates.solicitudPagoDirecto || isButtonDisabled('solicitud_pago_directo')"
        :loading="loadingStates.solicitudPagoDirecto"
        size="small"
        class="validation-btn"
        @click="handleClick('solicitud_pago_directo')"
      >
        <v-icon>mdi-thumb-up</v-icon>
        <span v-if="showLabels" class="ml-1">Pago Directo</span>
        <v-badge
          v-if="showBadges && pendientes.pagoDirecto > 0"
          :content="pendientes.pagoDirecto"
          color="error"
          inline
          class="ml-1"
        />
      </v-btn>

      <!-- Botón: Solicitud de Reposición -->
      <v-btn
        :color="getButtonColor('solicitud_reposicion')"
        :disabled="loadingStates.solicitudReposicion || isButtonDisabled('solicitud_reposicion')"
        :loading="loadingStates.solicitudReposicion"
        size="small"
        class="validation-btn"
        @click="handleClick('solicitud_reposicion')"
      >
        <v-icon>mdi-thumb-up</v-icon>
        <span v-if="showLabels" class="ml-1">Reposición</span>
        <v-badge
          v-if="showBadges && pendientes.reposicion > 0"
          :content="pendientes.reposicion"
          color="error"
          inline
          class="ml-1"
        />
      </v-btn>

      <!-- Botón: Rendición de Cuentas -->
      <v-btn
        :color="getButtonColor('rendicion_cuentas')"
        :disabled="loadingStates.rendicionCuentas || isButtonDisabled('rendicion_cuentas')"
        :loading="loadingStates.rendicionCuentas"
        size="small"
        class="validation-btn"
        @click="handleClick('rendicion_cuentas')"
      >
        <v-icon>mdi-thumb-up</v-icon>
        <span v-if="showLabels" class="ml-1">Rendición</span>
        <v-badge
          v-if="showBadges && pendientes.rendicion > 0"
          :content="pendientes.rendicion"
          color="error"
          inline
          class="ml-1"
        />
      </v-btn>
    </div>

    <!-- Diálogo de Solicitud de Fondos -->
    <v-dialog v-model="dialogs.solicitudFondos" max-width="600">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Validar Solicitud de Fondos</span>
          <v-btn icon @click="dialogs.solicitudFondos = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-list v-if="solicitudesFondos.length > 0">
            <v-list-item
              v-for="item in solicitudesFondos"
              :key="item.id"
              @click="abrirFormulario011(item.id)"
              class="mb-2"
              :class="{ 'bg-grey-lighten-3': isPendiente(item) }"
            >
              <template #prepend>
                <v-icon :color="getValidationColor(item)">mdi-file-document</v-icon>
              </template>

              <v-list-item-title class="font-weight-bold">
                {{ item.numeroFormulario || `SF-${item.id}` }}
              </v-list-item-title>

              <v-list-item-subtitle>
                <div class="d-flex flex-wrap align-center gap-2 mt-1">
                  <span>Fecha: {{ formatDate(item.fechaSolicitud) }}</span>
                  <v-chip size="x-small" v-if="item.tarea_nombre">
                    {{ item.tarea_nombre }}
                  </v-chip>
                </div>
                <div class="mt-1">
                  <strong>Monto:</strong> {{ formatCurrency(item.montoSolicitado) }}
                </div>
                <div class="mt-1">
                  <v-chip size="x-small" :color="getValidationColor(item)">
                    {{ getValidationText(item) }}
                  </v-chip>
                </div>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <div v-else class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-check-circle-outline</v-icon>
            <div class="text-h6 mt-4 text-grey">No hay solicitudes pendientes</div>
            <div class="text-caption text-grey">
              Todas las solicitudes de fondos han sido validadas
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Solicitud de Viaje -->
    <v-dialog v-model="dialogs.solicitudViaje" max-width="600">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Validar Solicitud de Viaje</span>
          <v-btn icon @click="dialogs.solicitudViaje = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-list v-if="solicitudesViaje.length > 0">
            <v-list-item
              v-for="item in solicitudesViaje"
              :key="item.id"
              @click="abrirFormulario055(item.id)"
              class="mb-2"
            >
              <template #prepend>
                <v-icon :color="getValidationColor(item)">mdi-airplane-takeoff</v-icon>
              </template>

              <v-list-item-title class="font-weight-bold">
                {{ item.numeroFormulario || `SV-${item.id}` }}
              </v-list-item-title>

              <v-list-item-subtitle>
                <div class="d-flex flex-wrap align-center gap-2 mt-1">
                  <span>{{ formatDate(item.fechaSolicitud) }}</span>
                  <v-chip size="x-small" color="info">
                    {{ item.destino || 'Sin destino' }}
                  </v-chip>
                </div>
                <div class="mt-1"><strong>Duración:</strong> {{ item.duracionDias }} días</div>
                <div class="mt-1">
                  <v-chip size="x-small" :color="getValidationColor(item)">
                    {{ getValidationText(item) }}
                  </v-chip>
                </div>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <div v-else class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-airplane-check</v-icon>
            <div class="text-h6 mt-4 text-grey">No hay solicitudes de viaje</div>
            <div class="text-caption text-grey">Todas las solicitudes han sido validadas</div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Solicitud de Pago Directo -->
    <v-dialog v-model="dialogs.solicitudPagoDirecto" max-width="600">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Validar Solicitud de Pago Directo</span>
          <v-btn icon @click="dialogs.solicitudPagoDirecto = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-list v-if="solicitudesPagoDirecto.length > 0">
            <v-list-item
              v-for="item in solicitudesPagoDirecto"
              :key="item.id"
              @click="abrirFormulario088(item.id)"
              class="mb-2"
            >
              <template #prepend>
                <v-icon :color="getValidationColor(item)">mdi-credit-card-clock</v-icon>
              </template>

              <v-list-item-title class="font-weight-bold">
                {{ item.numeroFormulario || `SPD-${item.id}` }}
              </v-list-item-title>

              <v-list-item-subtitle>
                <div class="d-flex flex-wrap align-center gap-2 mt-1">
                  <span>{{ formatDate(item.fechaSolicitud) }}</span>
                  <v-chip size="x-small" color="teal">
                    {{ item.nombreProveedor || 'Sin proveedor' }}
                  </v-chip>
                </div>
                <div class="mt-1">
                  <strong>Monto:</strong> {{ formatCurrency(item.montoSolicitado) }}
                </div>
                <div class="mt-1">
                  <v-chip size="x-small" :color="getValidationColor(item)">
                    {{ getValidationText(item) }}
                  </v-chip>
                </div>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <div v-else class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-credit-card-check</v-icon>
            <div class="text-h6 mt-4 text-grey">No hay pagos directos</div>
            <div class="text-caption text-grey">Todas las solicitudes han sido validadas</div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Solicitud de Reposición -->
    <v-dialog v-model="dialogs.solicitudReposicion" max-width="600">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Validar Solicitud de Reposición</span>
          <v-btn icon @click="dialogs.solicitudReposicion = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-list v-if="solicitudesReposicion.length > 0">
            <v-list-item
              v-for="item in solicitudesReposicion"
              :key="item.id"
              @click="abrirFormulario033(item.id)"
              class="mb-2"
            >
              <template #prepend>
                <v-icon :color="getValidationColor(item)">mdi-cash-sync</v-icon>
              </template>

              <v-list-item-title class="font-weight-bold">
                {{ item.numeroFormulario || `SREP-${item.id}` }}
              </v-list-item-title>

              <v-list-item-subtitle>
                <div class="d-flex flex-wrap align-center gap-2 mt-1">
                  <span>{{ formatDate(item.fechaSolicitud) }}</span>
                  <v-chip size="x-small" color="orange">
                    {{ item.motivoReposicion?.substring(0, 30) || 'Sin motivo' }}
                  </v-chip>
                </div>
                <div class="mt-1">
                  <strong>Monto:</strong> {{ formatCurrency(item.montoReposicion) }}
                </div>
                <div class="mt-1">
                  <v-chip size="x-small" :color="getValidationColor(item)">
                    {{ getValidationText(item) }}
                  </v-chip>
                </div>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <div v-else class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-cash-refund</v-icon>
            <div class="text-h6 mt-4 text-grey">No hay reposiciones</div>
            <div class="text-caption text-grey">Todas las solicitudes han sido validadas</div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Rendición de Cuentas -->
    <v-dialog v-model="dialogs.rendicionCuentas" max-width="600">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Validar Rendición de Cuentas</span>
          <v-btn icon @click="dialogs.rendicionCuentas = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-list v-if="rendicionesCuentas.length > 0">
            <v-list-item
              v-for="item in rendicionesCuentas"
              :key="item.id"
              @click="abrirFormulario022(item.id)"
              class="mb-2"
            >
              <template #prepend>
                <v-icon :color="getRendicionColor(item)">mdi-file-chart</v-icon>
              </template>

              <v-list-item-title class="font-weight-bold">
                {{ item.numeroFormulario || `RC-${item.id}` }}
              </v-list-item-title>

              <v-list-item-subtitle>
                <div class="d-flex flex-wrap align-center gap-2 mt-1">
                  <span>Desembolso: {{ formatDate(item.fechaDesembolso) }}</span>
                  <v-chip size="x-small" color="purple">
                    {{ item.responsable_nombre || 'Sin responsable' }}
                  </v-chip>
                </div>
                <div class="mt-1">
                  <strong>Monto:</strong> {{ formatCurrency(item.montoDescargado) }}
                </div>
                <div class="mt-1">
                  <v-chip size="x-small" :color="getRendicionColor(item)">
                    {{ getRendicionText(item) }}
                  </v-chip>
                </div>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <div v-else class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-file-check</v-icon>
            <div class="text-h6 mt-4 text-grey">No hay rendiciones</div>
            <div class="text-caption text-grey">Todas las rendiciones han sido validadas</div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Props
const props = defineProps({
  actividadId: {
    type: Number,
    required: true,
  },
  actividadData: {
    type: Object,
    default: () => ({}),
  },
  showLabels: {
    type: Boolean,
    default: true,
  },
  showBadges: {
    type: Boolean,
    default: true,
  },
  compactMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['loading', 'error', 'click'])

const router = useRouter()
const userStore = useUserStore()
const baseurl = import.meta.env.VITE_API_BASE

// Estados
const loadingStates = ref({
  solicitudFondos: false,
  solicitudViaje: false,
  solicitudPagoDirecto: false,
  solicitudReposicion: false,
  rendicionCuentas: false,
})

const pendientes = ref({
  fondos: 0,
  viaje: 0,
  pagoDirecto: 0,
  reposicion: 0,
  rendicion: 0,
})

const solicitudesFondos = ref([])
const solicitudesViaje = ref([])
const solicitudesPagoDirecto = ref([])
const solicitudesReposicion = ref([])
const rendicionesCuentas = ref([])

const dialogs = ref({
  solicitudFondos: false,
  solicitudViaje: false,
  solicitudPagoDirecto: false,
  solicitudReposicion: false,
  rendicionCuentas: false,
})

// Métodos principales
const handleClick = async (tipo) => {
  emit('click', { tipo, actividadId: props.actividadId })

  switch (tipo) {
    case 'solicitud_fondos':
      await cargarSolicitudesFondos()
      dialogs.value.solicitudFondos = true
      break
    case 'solicitud_viaje':
      await cargarSolicitudesViaje()
      dialogs.value.solicitudViaje = true
      break
    case 'solicitud_pago_directo':
      await cargarSolicitudesPagoDirecto()
      dialogs.value.solicitudPagoDirecto = true
      break
    case 'solicitud_reposicion':
      await cargarSolicitudesReposicion()
      dialogs.value.solicitudReposicion = true
      break
    case 'rendicion_cuentas':
      await cargarRendicionesCuentas()
      dialogs.value.rendicionCuentas = true
      break
  }
}

// Métodos de carga
const cargarSolicitudesFondos = async () => {
  loadingStates.value.solicitudFondos = true
  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudFondos/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) throw new Error('Error en la solicitud')

    const data = await response.json()

    // Filtrar por actividad
    solicitudesFondos.value =
      data.solicitudes?.filter((s) => s.actividad_id === props.actividadId) || []

    // Calcular pendientes
    pendientes.value.fondos = solicitudesFondos.value.filter(
      (s) => !s.validacionCoordinador || !s.validacionResponsable,
    ).length
  } catch (error) {
    console.error('Error cargando solicitudes de fondos:', error)
    emit('error', { tipo: 'solicitud_fondos', error })
  } finally {
    loadingStates.value.solicitudFondos = false
  }
}

const cargarSolicitudesViaje = async () => {
  loadingStates.value.solicitudViaje = true
  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudesViaje/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_actividad: props.actividadId,
      }),
    })

    if (!response.ok) throw new Error('Error en la solicitud')

    const data = await response.json()
    solicitudesViaje.value = data.solicitudes || []

    pendientes.value.viaje = solicitudesViaje.value.filter(
      (s) => !s.validacionCoordinador || !s.validacionResponsable,
    ).length
  } catch (error) {
    console.error('Error cargando solicitudes de viaje:', error)
    emit('error', { tipo: 'solicitud_viaje', error })
  } finally {
    loadingStates.value.solicitudViaje = false
  }
}

const cargarSolicitudesPagoDirecto = async () => {
  loadingStates.value.solicitudPagoDirecto = true
  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudesPagoDirecto/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_actividad: props.actividadId,
      }),
    })

    if (!response.ok) throw new Error('Error en la solicitud')

    const data = await response.json()
    solicitudesPagoDirecto.value = data.solicitudes || []

    pendientes.value.pagoDirecto = solicitudesPagoDirecto.value.filter(
      (s) => !s.validacionCoordinador || !s.validacionResponsable,
    ).length
  } catch (error) {
    console.error('Error cargando solicitudes de pago directo:', error)
    emit('error', { tipo: 'solicitud_pago_directo', error })
  } finally {
    loadingStates.value.solicitudPagoDirecto = false
  }
}

const cargarSolicitudesReposicion = async () => {
  loadingStates.value.solicitudReposicion = true
  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudReembolso/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_actividad: props.actividadId,
      }),
    })

    if (!response.ok) throw new Error('Error en la solicitud')

    const data = await response.json()
    solicitudesReposicion.value = data.solicitudes || []

    pendientes.value.reposicion = solicitudesReposicion.value.filter(
      (s) => !s.validacionCoordinador || !s.validacionResponsable,
    ).length
  } catch (error) {
    console.error('Error cargando solicitudes de reposición:', error)
    emit('error', { tipo: 'solicitud_reposicion', error })
  } finally {
    loadingStates.value.solicitudReposicion = false
  }
}

const cargarRendicionesCuentas = async () => {
  loadingStates.value.rendicionCuentas = true
  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerRendicionDeCuentas/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_actividad: props.actividadId,
      }),
    })

    if (!response.ok) throw new Error('Error en la solicitud')

    const data = await response.json()
    rendicionesCuentas.value = data.rendiciones || []

    pendientes.value.rendicion = rendicionesCuentas.value.filter(
      (r) => !r.validacionCoordinador || !r.validacionContador || !r.validacionAdministrador,
    ).length
  } catch (error) {
    console.error('Error cargando rendiciones:', error)
    emit('error', { tipo: 'rendicion_cuentas', error })
  } finally {
    loadingStates.value.rendicionCuentas = false
  }
}

// Navegación
const abrirFormulario011 = (id) => {
  router.push({
    path: `/monitoreo/formulario011/${props.actividadId}`,
    query: { solicitud_id: id },
  })
}

const abrirFormulario055 = (id) => {
  router.push({
    path: `/monitoreo/formulario055/${props.actividadId}`,
    query: { solicitud_id: id },
  })
}

const abrirFormulario088 = (id) => {
  router.push({
    path: `/monitoreo/formulario088/${props.actividadId}`,
    query: { solicitud_id: id },
  })
}

const abrirFormulario033 = (id) => {
  router.push({
    path: `/monitoreo/formulario033/${props.actividadId}`,
    query: { solicitud_id: id },
  })
}

const abrirFormulario022 = (id) => {
  router.push({
    path: `/monitoreo/formulario022/${props.actividadId}`,
    query: { solicitud_id: id },
  })
}

// Helpers
const getButtonColor = (tipo) => {
  const colors = {
    solicitud_fondos: 'primary',
    solicitud_viaje: 'deep-purple',
    solicitud_pago_directo: 'teal-lighten-2',
    solicitud_reposicion: 'warning',
    rendicion_cuentas: 'error',
  }
  return colors[tipo] || 'grey'
}

const isButtonDisabled = (tipo) => {
  if (!props.actividadData) return false
  return false
}

const isPendiente = (item) => {
  return !item.validacionCoordinador || !item.validacionResponsable
}

const getValidationColor = (item) => {
  if (item.validacionCoordinador && item.validacionResponsable) return 'success'
  if (item.validacionCoordinador || item.validacionResponsable) return 'warning'
  return 'error'
}

const getValidationText = (item) => {
  if (item.validacionCoordinador && item.validacionResponsable) return 'Completado'
  if (item.validacionCoordinador || item.validacionResponsable) return 'Parcial'
  return 'Pendiente'
}

const getRendicionColor = (item) => {
  if (item.validacionCoordinador && item.validacionContador && item.validacionAdministrador)
    return 'success'
  if (item.validacionCoordinador || item.validacionContador || item.validacionAdministrador)
    return 'warning'
  return 'error'
}

const getRendicionText = (item) => {
  if (item.validacionCoordinador && item.validacionContador && item.validacionAdministrador)
    return 'Completado'
  if (item.validacionCoordinador || item.validacionContador || item.validacionAdministrador)
    return 'Parcial'
  return 'Pendiente'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES')
}

const formatCurrency = (amount) => {
  const num = Number(amount) || 0
  return `Bs. ${num.toFixed(2)}`
}

// Carga inicial
onMounted(() => {
  // Cargar contadores iniciales
  cargarSolicitudesFondos()
  cargarSolicitudesViaje()
  cargarSolicitudesPagoDirecto()
  cargarSolicitudesReposicion()
  cargarRendicionesCuentas()
})
</script>

<style scoped>
.validation-bar.activity-bar {
  padding: 8px;
  background: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.validation-btn {
  min-width: 100px;
  height: 36px;
  border-radius: 6px;
}

.compact-mode .validation-btn {
  min-width: 40px;
  height: 32px;
}
</style>
