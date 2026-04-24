<template>
  <div class="vinculacion-container">
    <v-divider class="my-4"></v-divider>

    <v-card-subtitle class="text-h6 d-flex align-center">
      <v-icon icon="mdi-link-variant" class="mr-2" color="primary"></v-icon>
      Vinculación de Solicitudes de Viaje - Informe de Actividad
      <v-chip size="small" color="info" variant="tonal" class="ml-3"> Opcional </v-chip>
    </v-card-subtitle>
    <br />

    <div class="form-section-vinculacion">
      <!-- Indicador de carga -->
      <v-progress-linear
        v-if="cargando"
        indeterminate
        color="primary"
        class="mb-4"
      ></v-progress-linear>

      <v-row>
        <v-col cols="12">
          <div class="text-subtitle-2 text-grey-darken-1 mb-4">
            Seleccione las solicitudes de viaje que desea vincular a este informe de actividad.
            Puede editar el desglose de gastos de cada solicitud si es necesario.
          </div>
        </v-col>
      </v-row>

      <!-- Selector de Solicitud de Viaje (usando autocomplete con selección múltiple) -->
      <v-autocomplete
        v-model="solicitudesViajeSeleccionadas"
        :items="solicitudesViajeDisponibles"
        :loading="cargandoViajes"
        item-title="displayText"
        item-value="id"
        label="Buscar Solicitudes de Viaje"
        variant="outlined"
        density="comfortable"
        placeholder="Escriba para buscar solicitudes de viaje..."
        prepend-inner-icon="mdi-magnify"
        clearable
        multiple
        chips
        closable-chips
        class="mb-3"
        return-object
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-badge
                :color="getEstadoColor(item.raw.estado_validacion)"
                dot
                offset-x="8"
                offset-y="8"
              >
                <v-icon icon="mdi-airplane" color="info"></v-icon>
              </v-badge>
            </template>
            <v-list-item-title class="font-weight-medium">
              <strong>EVENTO:</strong> {{ item.raw.evento }} - <strong>LUGAR:</strong>
              {{ item.raw.lugarEvento }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <div class="d-flex flex-wrap gap-2 mt-1">
                <v-chip size="x-small" variant="outlined" color="grey">
                  <v-icon icon="mdi-calendar" size="12" class="mr-1"></v-icon>
                  {{ formatFecha(item.raw.fechaSolicitud) }}
                </v-chip>
                <v-chip size="x-small" variant="outlined" color="success">
                  <v-icon icon="mdi-currency-usd" size="12" class="mr-1"></v-icon>
                  {{ formatMonto(item.raw.montoSolicitado) }}
                </v-chip>
                <v-chip
                  :color="getEstadoColor(item.raw.estado_validacion)"
                  size="x-small"
                  text-color="white"
                >
                  {{ getEstadoTexto(item.raw.estado_validacion) }}
                </v-chip>
              </div>
            </v-list-item-subtitle>
          </v-list-item>
        </template>

        <template v-slot:chip="{ props, item }">
          <v-chip
            v-bind="props"
            :prepend-icon="'mdi-airplane'"
            color="info"
            variant="tonal"
            size="small"
            class="ma-1"
          >
            {{ item.raw.numeroFormulario }}
          </v-chip>
        </template>
      </v-autocomplete>

      <!-- Advertencia si hay solicitudes ya vinculadas -->
      <v-alert
        v-if="totalViajesVinculadas > 0"
        type="info"
        variant="tonal"
        density="compact"
        class="mb-3"
      >
        <div class="d-flex align-center">
          <v-icon icon="mdi-information" size="20" class="mr-2"></v-icon>
          <span>
            {{ totalViajesVinculadas }} solicitud(es) de viaje ya están vinculadas a otros informes
          </span>
        </div>
      </v-alert>

      <!-- Mensaje cuando no hay solicitudes disponibles -->
      <v-alert
        v-if="!hayViajesDisponibles && !cargandoViajes"
        type="warning"
        variant="tonal"
        class="mt-4"
        density="comfortable"
        border="start"
      >
        <div class="d-flex align-center">
          <v-icon icon="mdi-alert" size="24" class="mr-3"></v-icon>
          <div>
            <div class="font-weight-medium">No hay solicitudes disponibles</div>
            <div class="text-caption">
              No se encontraron solicitudes de viaje aprobadas para esta actividad
            </div>
          </div>
        </div>
      </v-alert>

      <!-- Sección: Solicitudes Seleccionadas -->
      <v-expand-transition>
        <div v-if="solicitudesViajeSeleccionadas && solicitudesViajeSeleccionadas.length > 0">
          <v-divider class="my-4"></v-divider>

          <div class="d-flex align-center mb-3">
            <v-icon icon="mdi-check-circle" color="success" class="mr-2"></v-icon>
            <span class="text-subtitle-1 font-weight-medium">
              Solicitudes seleccionadas para vincular ({{ solicitudesViajeSeleccionadas.length }})
            </span>
            <v-spacer></v-spacer>
            <v-chip color="success" variant="tonal" size="small">
              <v-icon icon="mdi-currency-usd" size="16" class="mr-1"></v-icon>
              Monto total: {{ formatMonto(calcularMontoTotalSolicitud()) }}
            </v-chip>
          </div>

          <!-- Lista de solicitudes seleccionadas con detalle -->
          <v-expansion-panels v-model="panelSolicitudesAbiertas" multiple>
            <v-expansion-panel
              v-for="(solicitud, index) in solicitudesViajeSeleccionadas"
              :key="solicitud.id"
              class="mb-2"
            >
              <v-expansion-panel-title>
                <div class="d-flex align-center w-100">
                  <v-icon icon="mdi-airplane" color="info" class="mr-2"></v-icon>
                  <span class="font-weight-medium">{{ solicitud.numeroFormulario }}</span>
                  <v-spacer></v-spacer>
                  <v-chip size="x-small" variant="outlined" color="grey" class="mr-2">
                    {{ formatFecha(solicitud.fechaSolicitud) }}
                  </v-chip>
                  <v-chip size="x-small" color="success" variant="tonal" class="mr-2">
                    {{ formatMonto(calcularMontoSolicitud(solicitud)) }}
                  </v-chip>
                  <v-btn
                    icon="mdi-close"
                    variant="text"
                    size="small"
                    color="error"
                    class="ml-2"
                    @click.stop="removerSolicitud(solicitud.id)"
                  ></v-btn>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-card
                  variant="tonal"
                  :color="getEstadoColor(solicitud.estado_validacion)"
                  rounded="lg"
                >
                  <v-card-text class="pa-4">
                    <div class="d-flex justify-space-between align-start mb-2">
                      <div>
                        <div class="text-h6 font-weight-medium">
                          {{ solicitud.evento || 'Evento no especificado' }}
                        </div>
                        <div class="text-caption text-grey">
                          Solicitante:
                          {{ solicitud.solicitante?.nombre_completo || 'No asignado' }}
                        </div>
                      </div>
                      <v-chip
                        :color="getEstadoColor(solicitud.estado_validacion)"
                        size="small"
                        text-color="white"
                      >
                        {{ getEstadoTexto(solicitud.estado_validacion) }}
                      </v-chip>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <v-row>
                      <v-col cols="12" sm="4">
                        <div class="text-caption text-grey">Lugar del Evento</div>
                        <div class="font-weight-medium">
                          <v-icon icon="mdi-map-marker" size="16" class="mr-1"></v-icon>
                          {{ solicitud.lugarEvento || 'No especificado' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <div class="text-caption text-grey">Fecha del Evento</div>
                        <div class="font-weight-medium">
                          {{ formatFecha(solicitud.fechaEvento) }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <div class="text-caption text-grey">Monto Solicitado Original</div>
                        <div class="font-weight-medium text-success">
                          {{ formatMonto(solicitud.montoSolicitado) }}
                        </div>
                      </v-col>
                    </v-row>

                    <v-row class="mt-2">
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-grey">Organizador</div>
                        <div class="font-weight-medium">
                          {{ solicitud.organizador || 'No especificado' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-grey">Quién cubre gastos</div>
                        <div class="font-weight-medium">
                          {{ solicitud.quienCubreGastos || 'No especificado' }}
                        </div>
                      </v-col>
                    </v-row>

                    <div v-if="solicitud.justificacionAsistencia" class="mt-2">
                      <div class="text-caption text-grey">Justificación</div>
                      <div class="text-body-2">
                        {{ solicitud.justificacionAsistencia }}
                      </div>
                    </div>

                    <div v-if="solicitud.institucionesParticipantes" class="mt-2">
                      <div class="text-caption text-grey">Instituciones Participantes</div>
                      <div class="text-body-2">
                        {{ solicitud.institucionesParticipantes }}
                      </div>
                    </div>

                    <!-- Detalle de gastos del viaje - EDITABLE -->
                    <div class="mt-4">
                      <div class="d-flex align-center mb-2">
                        <div class="text-caption text-grey font-weight-bold">
                          Detalle de Gastos (Editable):
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn
                          size="x-small"
                          color="primary"
                          variant="tonal"
                          prepend-icon="mdi-plus"
                          @click="agregarItemGasto(index)"
                        >
                          Agregar Item
                        </v-btn>
                      </div>

                      <!-- Tabla editable de gastos -->
                      <v-table density="compact" class="gastos-table">
                        <thead>
                          <tr>
                            <th class="text-caption">Partida</th>
                            <th class="text-caption">Fuente</th>
                            <th class="text-caption">Concepto</th>
                            <th class="text-caption">Monto (Bs)</th>
                            <th class="text-caption" width="50">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="!solicitud.detalleGasto?.items?.length">
                            <td colspan="5" class="text-center text-caption py-2">
                              No hay items de gasto. Haga clic en "Agregar Item"
                            </td>
                          </tr>
                          <tr
                            v-for="(item, itemIndex) in solicitud.detalleGasto?.items || []"
                            :key="itemIndex"
                          >
                            <td>
                              <v-text-field
                                v-model="item.partida"
                                density="compact"
                                variant="outlined"
                                hide-details
                                placeholder="1.1.1"
                                class="gasto-input"
                                @input="actualizarMontoSolicitud(index)"
                              ></v-text-field>
                            </td>
                            <td>
                              <v-text-field
                                v-model="item.fuente"
                                density="compact"
                                variant="outlined"
                                hide-details
                                placeholder="UN"
                                class="gasto-input"
                                @input="actualizarMontoSolicitud(index)"
                              ></v-text-field>
                            </td>
                            <td>
                              <v-text-field
                                v-model="item.concepto"
                                density="compact"
                                variant="outlined"
                                hide-details
                                placeholder="Descripción del gasto"
                                class="gasto-input"
                              ></v-text-field>
                            </td>
                            <td>
                              <v-text-field
                                v-model="item.monto"
                                density="compact"
                                variant="outlined"
                                hide-details
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                class="gasto-input"
                                @input="actualizarMontoSolicitud(index)"
                              ></v-text-field>
                            </td>
                            <td class="text-center">
                              <v-btn
                                icon="mdi-delete"
                                variant="text"
                                size="x-small"
                                color="error"
                                @click="eliminarItemGasto(index, itemIndex)"
                              ></v-btn>
                            </td>
                          </tr>
                        </tbody>
                        <tfoot v-if="solicitud.detalleGasto?.items?.length">
                          <tr>
                            <td colspan="3" class="text-right font-weight-bold text-caption">
                              Total:
                            </td>
                            <td class="font-weight-bold text-success text-caption">
                              {{ formatMonto(calcularMontoSolicitud(solicitud)) }}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </v-table>

                      <!-- Botón para restaurar gastos originales -->
                      <div class="d-flex justify-end mt-2">
                        <v-btn
                          size="x-small"
                          color="warning"
                          variant="text"
                          prepend-icon="mdi-restore"
                          @click="restaurarGastosOriginales(index)"
                        >
                          Restaurar gastos originales
                        </v-btn>
                      </div>
                    </div>

                    <!-- Datos de forma de pago -->
                    <div v-if="solicitud.datos_forma_pago" class="mt-4">
                      <div class="text-caption text-grey font-weight-bold mb-2">Forma de Pago:</div>
                      <div class="text-body-2">
                        <template v-if="solicitud.formaPago === 1">
                          <v-icon icon="mdi-account" size="16" class="mr-1"></v-icon>
                          Otros: {{ solicitud.datos_forma_pago.otros?.nombre_otros || 'N/A' }}
                        </template>
                        <template v-else-if="solicitud.formaPago === 2">
                          <v-icon icon="mdi-bank-transfer" size="16" class="mr-1"></v-icon>
                          Transferencia:
                          {{
                            solicitud.datos_forma_pago.transferencia?.nombre_transferencia || 'N/A'
                          }}
                          -
                          {{ solicitud.datos_forma_pago.transferencia?.entidad_bancaria || 'N/A' }}
                        </template>
                      </div>
                    </div>

                    <!-- Comparación de montos -->
                    <v-alert
                      v-if="hayDiferenciaMonto(solicitud)"
                      type="warning"
                      variant="tonal"
                      density="compact"
                      class="mt-4"
                    >
                      <div class="d-flex align-center">
                        <v-icon icon="mdi-alert" size="20" class="mr-2"></v-icon>
                        <div>
                          <strong>El monto ha sido modificado</strong>
                          <div class="text-caption">
                            Original: {{ formatMonto(solicitud.montoSolicitado) }} | Actual:
                            {{ formatMonto(calcularMontoSolicitud(solicitud)) }} | Diferencia:
                            {{ formatMonto(calcularDiferenciaMonto(solicitud)) }}
                          </div>
                        </div>
                      </div>
                    </v-alert>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-expand-transition>

      <!-- Collapsable: Solicitudes ya vinculadas a otros informes -->
      <v-expansion-panels v-if="solicitudesViajeVinculadas.length > 0" class="mt-4">
        <v-expansion-panel>
          <v-expansion-panel-title class="text-subtitle-1 font-weight-medium">
            <v-icon icon="mdi-history" class="mr-2" color="warning"></v-icon>
            Solicitudes de Viaje ya vinculadas ({{ solicitudesViajeVinculadas.length }})
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-alert type="warning" variant="tonal" density="compact" class="mb-3">
              Estas solicitudes ya están vinculadas a otros informes y no pueden ser seleccionadas
            </v-alert>
            <v-list>
              <v-list-item
                v-for="solicitud in solicitudesViajeVinculadas"
                :key="solicitud.id"
                class="mb-2"
                border
                rounded
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-airplane" color="grey"></v-icon>
                </template>
                <v-list-item-title class="font-weight-medium">
                  {{ solicitud.numeroFormulario }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <div class="d-flex flex-wrap gap-2 mt-1">
                    <v-chip size="x-small" variant="outlined" color="grey">
                      <v-icon icon="mdi-calendar" size="12" class="mr-1"></v-icon>
                      {{ formatFecha(solicitud.fechaSolicitud) }}
                    </v-chip>
                    <v-chip size="x-small" variant="outlined" color="info">
                      <v-icon icon="mdi-map-marker" size="12" class="mr-1"></v-icon>
                      {{ solicitud.lugarEvento }}
                    </v-chip>
                    <v-chip size="x-small" color="warning" variant="tonal">
                      <v-icon icon="mdi-link" size="12" class="mr-1"></v-icon>
                      Vinculada {{ formatFecha(solicitud.fecha_vinculacion) }}
                    </v-chip>
                  </div>
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-tooltip location="left">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi-information"
                        variant="text"
                        size="small"
                        color="info"
                        @click="verInformeVinculado(solicitud.id)"
                      ></v-btn>
                    </template>
                    <span>Ver informe vinculado</span>
                  </v-tooltip>
                </template>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Mensaje de confirmación de selección -->
      <v-expand-transition>
        <v-alert
          v-if="solicitudesViajeSeleccionadas && solicitudesViajeSeleccionadas.length > 0"
          type="success"
          variant="tonal"
          class="mt-4"
          density="comfortable"
          border="start"
        >
          <div class="d-flex align-center">
            <v-icon icon="mdi-check-circle" size="24" class="mr-3"></v-icon>
            <div>
              <div class="font-weight-medium">
                {{ solicitudesViajeSeleccionadas.length }} solicitud(es) de viaje seleccionada(s)
              </div>
              <div class="text-caption">
                Monto total a vincular: {{ formatMonto(calcularMontoTotalSolicitud()) }}
              </div>
            </div>
          </div>
        </v-alert>
      </v-expand-transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSolicitudesStore } from '../../store/useSolicitudesStore'
import { useSnackbar } from '@/composables/useSnackbar'

// Props
const props = defineProps({
  idActividad: {
    type: [Number, String],
    required: true,
    default: null,
  },
  idInforme: {
    type: [Number, String],
    default: null,
  },
})

// Emits
const emit = defineEmits(['update:vinculacion', 'confirmar', 'verInforme'])

// Store y utilidades
const solicitudesStore = useSolicitudesStore()
const { successMsg, errorMsg } = useSnackbar()

// Estado local
const solicitudesViajeSeleccionadas = ref([])
const panelSolicitudesAbiertas = ref([])
const cargando = ref(false)
const error = ref(null)

// Almacenar copias originales de los gastos para restaurar
const gastosOriginales = ref(new Map())

// Computed para obtener datos del store
const solicitudesViaje = computed(() => solicitudesStore.solicitudesViajeDisponibles || [])

const cargandoViajes = computed(() => solicitudesStore.loadingViajesDisponibles || false)

// Separar solicitudes disponibles y vinculadas
const solicitudesViajeDisponibles = computed(() => {
  if (!solicitudesViaje.value.length) return []

  return solicitudesViaje.value
    .filter(
      (solicitud) => solicitud.fecha_vinculacion === null && solicitud.puede_vincularse === true,
    )
    .map((solicitud) => {
      // Asegurar que detalleGasto tenga la estructura correcta
      if (!solicitud.detalleGasto) {
        solicitud.detalleGasto = { items: [] }
      }
      if (!solicitud.detalleGasto.items) {
        solicitud.detalleGasto.items = []
      }

      return {
        ...solicitud,
        displayText: `${solicitud.numeroFormulario} - ${solicitud.evento} (${solicitud.lugarEvento})`,
      }
    })
})

const solicitudesViajeVinculadas = computed(() => {
  if (!solicitudesViaje.value.length) return []

  return solicitudesViaje.value.filter((solicitud) => solicitud.fecha_vinculacion !== null)
})

// Totales
const hayViajesDisponibles = computed(() => solicitudesViajeDisponibles.value.length > 0)
const totalViajesVinculadas = computed(() => solicitudesViajeVinculadas.value.length)

// Métodos auxiliares
const formatMonto = (monto) => {
  if (!monto && monto !== 0) return 'Bs. 0.00'
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(Number(monto))
}

const formatFecha = (fecha) => {
  if (!fecha) return 'N/A'
  try {
    const date = new Date(fecha)
    if (isNaN(date.getTime())) return fecha
    return date.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    console.error(error)
    return fecha
  }
}

const getEstadoColor = (estado) => {
  if (!estado) return 'default'
  const estadoLower = estado.toLowerCase()
  if (estadoLower === 'aprobado' || estadoLower === 'aprobada') return 'success'
  if (estadoLower === 'rechazado' || estadoLower === 'rechazada') return 'error'
  if (estadoLower === 'pendiente') return 'warning'
  if (estadoLower === 'revisión' || estadoLower === 'revision') return 'info'
  if (estadoLower === 'enviado' || estadoLower === 'enviada') return 'primary'
  return 'default'
}

const getEstadoTexto = (estado) => {
  if (!estado) return 'Pendiente'
  const estadoLower = estado.toLowerCase()
  if (estadoLower === 'aprobado') return 'Aprobado'
  if (estadoLower === 'rechazado') return 'Rechazado'
  if (estadoLower === 'pendiente') return 'Pendiente'
  if (estadoLower === 'revisión') return 'En Revisión'
  return estado
}

// Calcular monto de una solicitud basado en sus items
const calcularMontoSolicitud = (solicitud) => {
  if (!solicitud.detalleGasto?.items?.length) return 0

  return solicitud.detalleGasto.items.reduce((total, item) => {
    return total + (parseFloat(item.monto) || 0)
  }, 0)
}

// Calcular monto total de todas las solicitudes seleccionadas
const calcularMontoTotalSolicitud = () => {
  if (!solicitudesViajeSeleccionadas.value?.length) return 0

  return solicitudesViajeSeleccionadas.value.reduce((total, solicitud) => {
    return total + calcularMontoSolicitud(solicitud)
  }, 0)
}

// Verificar si hay diferencia entre monto original y actual
const hayDiferenciaMonto = (solicitud) => {
  const montoOriginal = parseFloat(solicitud.montoSolicitado) || 0
  const montoActual = calcularMontoSolicitud(solicitud)
  return Math.abs(montoOriginal - montoActual) > 0.01
}

// Calcular diferencia de monto
const calcularDiferenciaMonto = (solicitud) => {
  const montoOriginal = parseFloat(solicitud.montoSolicitado) || 0
  const montoActual = calcularMontoSolicitud(solicitud)
  return montoActual - montoOriginal
}

// Actualizar el monto total de la solicitud cuando se modifican los items
const actualizarMontoSolicitud = (index) => {
  // Forzar actualización reactiva
  solicitudesViajeSeleccionadas.value = [...solicitudesViajeSeleccionadas.value]
}

// Agregar nuevo item de gasto
const agregarItemGasto = (index) => {
  const solicitud = solicitudesViajeSeleccionadas.value[index]

  if (!solicitud.detalleGasto) {
    solicitud.detalleGasto = { items: [] }
  }
  if (!solicitud.detalleGasto.items) {
    solicitud.detalleGasto.items = []
  }

  solicitud.detalleGasto.items.push({
    partida: '',
    fuente: '',
    concepto: '',
    monto: 0,
  })

  actualizarMontoSolicitud(index)
}

// Eliminar item de gasto
const eliminarItemGasto = (solicitudIndex, itemIndex) => {
  const solicitud = solicitudesViajeSeleccionadas.value[solicitudIndex]

  if (solicitud.detalleGasto?.items) {
    solicitud.detalleGasto.items.splice(itemIndex, 1)
    actualizarMontoSolicitud(solicitudIndex)
  }
}

// Guardar copia original de los gastos al seleccionar una solicitud
const guardarGastosOriginales = (solicitud) => {
  if (!gastosOriginales.value.has(solicitud.id)) {
    gastosOriginales.value.set(solicitud.id, {
      detalleGasto: JSON.parse(JSON.stringify(solicitud.detalleGasto || { items: [] })),
      montoSolicitado: solicitud.montoSolicitado,
    })
  }
}

// Restaurar gastos originales
const restaurarGastosOriginales = (index) => {
  const solicitud = solicitudesViajeSeleccionadas.value[index]
  const original = gastosOriginales.value.get(solicitud.id)

  if (original) {
    solicitud.detalleGasto = JSON.parse(JSON.stringify(original.detalleGasto))
    solicitud.montoSolicitado = original.montoSolicitado
    actualizarMontoSolicitud(index)
    successMsg('Gastos restaurados a los valores originales')
  }
}

// Remover solicitud de la selección
const removerSolicitud = (idSolicitud) => {
  solicitudesViajeSeleccionadas.value = solicitudesViajeSeleccionadas.value.filter(
    (s) => s.id !== idSolicitud,
  )
  gastosOriginales.value.delete(idSolicitud)
}

// Ver informe vinculado
const verInformeVinculado = (solicitudId) => {
  const solicitud = solicitudesViajeVinculadas.value.find((s) => s.id === solicitudId)
  if (solicitud) {
    emit('verInforme', {
      solicitud_id: solicitudId,
      informe_id: solicitud.informe_vinculado_id || null,
    })
  }
}

// Cargar datos del store
const cargarDatos = async () => {
  cargando.value = true
  try {
    await solicitudesStore.cargarSolViajeDisponiblePorIdActividad(props.idActividad)
  } catch (err) {
    console.error('Error al cargar datos de solicitudes de viaje', err)
    error.value = err
    errorMsg('Error al cargar las solicitudes de viaje')
  } finally {
    cargando.value = false
  }
}

// Watcher para guardar copias originales cuando se seleccionan nuevas solicitudes
watch(
  solicitudesViajeSeleccionadas,
  (nuevas, antiguas) => {
    // Guardar originales para nuevas solicitudes
    nuevas.forEach((solicitud) => {
      guardarGastosOriginales(solicitud)
    })

    // Limpiar originales de solicitudes removidas
    const idsActuales = new Set(nuevas.map((s) => s.id))
    const idsAntiguas = new Set(antiguas?.map((s) => s.id) || [])

    idsAntiguas.forEach((id) => {
      if (!idsActuales.has(id)) {
        gastosOriginales.value.delete(id)
      }
    })
  },
  { deep: true },
)

// Watcher para emitir cambios de vinculación
watch(
  [solicitudesViajeSeleccionadas],
  () => {
    const vinculacion = getVinculacion()
    emit('update:vinculacion', vinculacion)
  },
  { deep: true },
)

// Métodos públicos
const reset = () => {
  solicitudesViajeSeleccionadas.value = []
  panelSolicitudesAbiertas.value = []
  gastosOriginales.value.clear()
}

const getVinculacion = () => {
  if (!solicitudesViajeSeleccionadas.value || solicitudesViajeSeleccionadas.value.length === 0) {
    return null
  }

  // Construir JSON completo para el endpoint con los gastos editados
  const solicitudesVinculadas = solicitudesViajeSeleccionadas.value.map((solicitud) => {
    const montoActual = calcularMontoSolicitud(solicitud)
    const montoOriginal = parseFloat(solicitud.montoSolicitado) || 0
    const tieneModificaciones = Math.abs(montoOriginal - montoActual) > 0.01

    return {
      id_solicitud_viaje: solicitud.id,
      numero_formulario: solicitud.numeroFormulario,
      evento: solicitud.evento,
      lugar_evento: solicitud.lugarEvento,
      fecha_evento: solicitud.fechaEvento,
      monto_solicitado_original: solicitud.montoSolicitado,
      monto_solicitado_actual: montoActual,
      tiene_modificaciones: tieneModificaciones,
      diferencia_monto: montoActual - montoOriginal,
      detalle_gasto: solicitud.detalleGasto,
      datos_forma_pago: solicitud.datos_forma_pago,
      forma_pago: solicitud.formaPago,
      justificacion_asistencia: solicitud.justificacionAsistencia,
      organizador: solicitud.organizador,
      instituciones_participantes: solicitud.institucionesParticipantes,
    }
  })

  return {
    tipo: 'solicitud_viaje',
    actividad_id: props.idActividad,
    informe_id: props.idInforme,
    fecha_vinculacion: new Date().toISOString(),
    total_solicitudes: solicitudesVinculadas.length,
    monto_total_original: solicitudesViajeSeleccionadas.value.reduce(
      (sum, s) => sum + (parseFloat(s.montoSolicitado) || 0),
      0,
    ),
    monto_total_actual: calcularMontoTotalSolicitud(),
    tiene_modificaciones_global: solicitudesVinculadas.some((s) => s.tiene_modificaciones),
    solicitudes_vinculadas: solicitudesVinculadas,
    metadatos: {
      fecha_generacion: new Date().toISOString(),
      usuario_generacion: 'sistema',
      gastos_editables: true,
    },
  }
}

const confirmarVinculacion = () => {
  const vinculacion = getVinculacion()
  if (vinculacion) {
    emit('confirmar', vinculacion)
  }
}

// Método para obtener solo los IDs (compatibilidad)
const obtenerIdsVinculadas = () => {
  return solicitudesViajeSeleccionadas.value.map((s) => s.id)
}

// Exponer métodos para el componente padre
defineExpose({
  reset,
  getVinculacion,
  confirmarVinculacion,
  obtenerIdsVinculadas,
  cargarDatos,
})

// Hook de ciclo de vida
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.vinculacion-container {
  width: 100%;
  margin-bottom: 24px;
}

.form-section-vinculacion {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.gastos-table {
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
}

.gastos-table :deep(th) {
  background-color: #f5f5f5 !important;
  font-weight: 600;
}

.gasto-input :deep(.v-field__input) {
  min-height: 32px !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  font-size: 12px;
}

.gasto-input :deep(.v-field) {
  border-radius: 4px;
}

:deep(.v-list-item-subtitle) {
  white-space: normal;
  word-break: break-word;
}

:deep(.v-alert) {
  border-left: 4px solid;
}

:deep(.v-expansion-panel) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-expansion-panel-title) {
  background-color: #fef7e0;
  min-height: 56px;
}

.gap-2 {
  gap: 8px;
}

.text-error {
  color: #d32f2f;
}

.text-warning {
  color: #f57c00;
}

@media (max-width: 600px) {
  .form-section-vinculacion {
    padding: 16px;
  }

  .gastos-table {
    font-size: 11px;
  }
}
</style>
