<template>
  <BaseEditorValidadores
    v-model="dialogoVisible"
    titulo="Reasignar Validadores - Solicitud de Fondos"
    :loading="loading"
    :hay-cambios="hayCambios"
    :minimo-caracteres="10"
    :solo-lectura="soloLectura"
    @update:model-value="actualizarModelo"
    @cerrar="cerrar"
    @guardar="manejarGuardar"
  >
    <!-- Contenido principal -->
    <div>
      <!-- Información del documento -->
      <div class="info-documento mb-4">
        <div class="d-flex align-center mb-2">
          <v-icon size="16" color="primary" class="mr-2">mdi-cash-multiple</v-icon>
          <span class="text-caption font-weight-medium">Solicitud de Fondos</span>
        </div>
        <div class="d-flex flex-wrap gap-3">
          <div class="info-item">
            <span class="text-caption text-grey-darken-1">N° Formulario:</span>
            <span class="text-caption font-weight-medium">{{ solicitudCodigo }}</span>
          </div>
          <div class="info-item">
            <span class="text-caption text-grey-darken-1">Monto:</span>
            <span class="text-caption font-weight-medium">{{ montoSolicitud }}</span>
          </div>
          <div class="info-item">
            <span class="text-caption text-grey-darken-1">Tipo:</span>
            <v-chip size="x-small" color="info" variant="tonal">{{ tipoSolicitud }}</v-chip>
          </div>
        </div>
      </div>

      <!-- Resumen de validación -->
      <div v-if="resumenValidacion" class="resumen-validacion mb-4">
        <div class="d-flex align-center mb-2">
          <v-icon size="16" color="info" class="mr-2">mdi-chart-pie</v-icon>
          <span class="text-caption font-weight-medium">Estado de Validación</span>
        </div>
        <div class="d-flex gap-2 flex-wrap">
          <v-chip size="x-small" color="info" variant="tonal">
            <v-icon start size="12">mdi-account-group</v-icon>
            Total: {{ resumenValidacion.total }}
          </v-chip>
          <v-chip size="x-small" color="warning" variant="tonal">
            <v-icon start size="12">mdi-clock-outline</v-icon>
            Pendientes: {{ resumenValidacion.pendientes }}
          </v-chip>
          <v-chip size="x-small" color="success" variant="tonal">
            <v-icon start size="12">mdi-check-circle</v-icon>
            Aprobados: {{ resumenValidacion.aprobados }}
          </v-chip>
          <v-chip size="x-small" color="error" variant="tonal">
            <v-icon start size="12">mdi-close-circle</v-icon>
            Rechazados: {{ resumenValidacion.rechazados }}
          </v-chip>
        </div>
      </div>

      <!-- Lista de validadores asignados -->
      <div>
        <div class="d-flex align-center justify-space-between mb-2">
          <div class="text-caption font-weight-medium">
            <v-icon size="14" class="mr-1" color="primary">mdi-account-group</v-icon>
            Validadores Asignados ({{ validadores.length }})
          </div>
          <v-chip v-if="hayCambios && !soloLectura" size="x-small" color="warning" variant="tonal">
            <v-icon start size="12">mdi-alert</v-icon>
            {{ totalReemplazos }} cambio(s)
          </v-chip>
        </div>

        <div class="asignados-list">
          <div
            v-for="(validador, index) in validadores"
            :key="validador.validacion_id || `temp-${index}`"
            class="asignado-item"
            :class="{
              'asignado-reemplazado': validador.esReemplazado,
              'asignado-seleccionado': validadorSeleccionadoParaReemplazo === index,
            }"
          >
            <div class="d-flex align-center">
              <v-avatar size="36" :color="getAvatarColor(validador)" variant="tonal" class="mr-2">
                <v-icon size="18" :color="getAvatarColor(validador)">
                  {{ getAvatarIcon(validador) }}
                </v-icon>
              </v-avatar>

              <div class="flex-grow-1 min-width-0">
                <div class="d-flex align-center flex-wrap gap-1">
                  <span class="text-body-2 font-weight-medium text-truncate">
                    {{ validador.nombre_completo }}
                  </span>

                  <v-chip
                    v-if="!validador.esReemplazado"
                    size="x-small"
                    :color="getColorEstado(validador.estado)"
                    variant="tonal"
                  >
                    {{ validador.estado_display || validador.estado }}
                  </v-chip>

                  <v-chip
                    v-if="validador.esReemplazado"
                    size="x-small"
                    color="warning"
                    variant="tonal"
                  >
                    <v-icon start size="10">mdi-account-swap</v-icon>
                    Reemplazado
                  </v-chip>
                </div>

                <div class="d-flex flex-wrap gap-2 mt-1">
                  <div class="text-caption text-grey-darken-1">
                    <v-icon size="12" class="mr-1">mdi-briefcase</v-icon>
                    {{ validador.cargo }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    <v-icon size="12" class="mr-1">mdi-email</v-icon>
                    {{ validador.correo }}
                  </div>
                </div>
              </div>

              <div v-if="!soloLectura" class="d-flex gap-1">
                <v-btn
                  v-if="!validador.esReemplazado"
                  size="x-small"
                  variant="text"
                  color="warning"
                  @click="seleccionarParaReemplazo(index)"
                  :disabled="loading"
                >
                  <v-icon start size="14">mdi-account-swap</v-icon>
                  Reemplazar
                </v-btn>

                <v-btn
                  v-if="validador.esReemplazado"
                  icon="mdi-undo"
                  size="x-small"
                  color="success"
                  variant="text"
                  @click="deshacerReemplazo(index)"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Detalles de la validación -->
            <div class="mt-2 pl-10">
              <div class="d-flex flex-wrap gap-2">
                <div class="codigo-seguimiento pa-1 rounded">
                  <v-icon size="10" color="info" class="mr-1">mdi-identifier</v-icon>
                  <span class="text-caption">Código:</span>
                  <code class="text-caption ml-1">{{ validador.codigo_seguimiento }}</code>
                </div>

                <v-chip size="x-small" color="grey" variant="tonal">
                  <v-icon start size="10">mdi-file-document</v-icon>
                  Versión: {{ validador.version_documento || '1' }}
                </v-chip>

                <v-chip size="x-small" color="grey" variant="tonal">
                  <v-icon start size="10">mdi-calendar-plus</v-icon>
                  Asignado: {{ formatDate(validador.fecha_asignacion) }}
                </v-chip>

                <v-chip
                  v-if="validador.fecha_resolucion"
                  size="x-small"
                  color="grey"
                  variant="tonal"
                >
                  <v-icon start size="10">mdi-calendar-check</v-icon>
                  Resuelto: {{ formatDate(validador.fecha_resolucion) }}
                </v-chip>
              </div>

              <div v-if="validador.comentarios" class="mt-1">
                <div class="text-caption text-grey-darken-1">
                  <v-icon size="12" class="mr-1">mdi-comment-text-outline</v-icon>
                  <strong>Comentario:</strong> {{ validador.comentarios }}
                </div>
              </div>
            </div>

            <!-- Si está reemplazado -->
            <div v-if="validador.esReemplazado && validador.reemplazo_nombre" class="mt-2 pl-10">
              <div class="reemplazo-info pa-2 rounded">
                <div class="d-flex align-center">
                  <v-icon size="14" color="warning" class="mr-1">mdi-arrow-right</v-icon>
                  <span class="text-caption font-weight-medium">
                    Nuevo validador: {{ validador.reemplazo_nombre }}
                  </span>
                </div>
                <div class="text-caption text-grey-darken-1 pl-5">
                  {{ validador.reemplazo_cargo }}
                </div>
              </div>
            </div>

            <!-- Si está seleccionado para reemplazo -->
            <div
              v-if="!soloLectura && validadorSeleccionadoParaReemplazo === index"
              class="mt-2 pl-10"
            >
              <v-autocomplete
                v-model="reemplazoTemporal"
                :items="getValidadoresDisponiblesParaReemplazo(index)"
                item-title="nombre_completo"
                item-value="id"
                label="Seleccionar reemplazo"
                placeholder="Buscar validador..."
                clearable
                density="compact"
                variant="outlined"
                :disabled="loading"
                @update:model-value="confirmarReemplazo(index, $event)"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="item.raw.nombre_completo"
                    :subtitle="`${item.raw.cargo} - ${item.raw.correo}`"
                  >
                    <template v-slot:prepend>
                      <v-avatar size="28" color="success" variant="tonal">
                        <v-icon size="14">mdi-account</v-icon>
                      </v-avatar>
                    </template>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <div class="d-flex gap-2 mt-1">
                <v-btn
                  size="x-small"
                  variant="text"
                  color="grey"
                  @click="cancelarReemplazo"
                  :disabled="loading"
                >
                  Cancelar
                </v-btn>
              </div>
            </div>
          </div>

          <div v-if="validadores.length === 0 && !loading" class="empty-state pa-3 mt-2">
            <v-icon size="24" color="grey">mdi-account-group-outline</v-icon>
            <div class="text-caption text-grey-darken-1 mt-1">No hay validadores asignados</div>
          </div>
        </div>
      </div>

      <!-- Resumen detallado de cambios -->
      <div v-if="!soloLectura && hayCambios" class="resumen-cambios mt-4 pa-3 rounded">
        <div class="d-flex align-center mb-2">
          <v-icon size="16" color="warning" class="mr-1">mdi-information</v-icon>
          <span class="text-body-2 font-weight-medium">Resumen de cambios</span>
        </div>

        <v-divider class="mb-2" />

        <div class="d-flex gap-2 flex-wrap mb-3">
          <v-chip size="x-small" color="warning" variant="tonal">
            <v-icon start size="12">mdi-account-swap</v-icon>
            {{ totalReemplazos }} reemplazo(s)
          </v-chip>
          <v-chip size="x-small" color="success" variant="tonal">
            <v-icon start size="12">mdi-account-check</v-icon>
            {{ totalSinCambios }} sin cambios
          </v-chip>
        </div>

        <div v-for="(cambio, i) in detalleCambios" :key="i" class="cambio-item mb-1">
          <div class="d-flex align-center flex-wrap gap-1">
            <v-icon size="14" color="warning" class="mr-1">mdi-account-swap</v-icon>
            <span class="text-caption">
              <strong>{{ cambio.original }}</strong>
              <v-icon size="12" class="mx-1">mdi-arrow-right</v-icon>
              <strong>{{ cambio.nuevo }}</strong>
            </span>
          </div>
          <div class="text-caption text-grey-darken-1 pl-5">
            {{ cambio.cargo_original }} → {{ cambio.cargo_nuevo }}
          </div>
          <div v-if="cambio.codigo_seguimiento" class="text-caption text-grey-darken-1 pl-5">
            <v-icon size="10" class="mr-1">mdi-identifier</v-icon>
            Código: <code>{{ cambio.codigo_seguimiento }}</code>
          </div>
        </div>
      </div>
    </div>
  </BaseEditorValidadores>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseEditorValidadores from './BaseEditorValidadores.vue'
import { getColorEstado, formatDate } from '@/modules/formularios/utils/validadoresHelpers'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  idSolicitud: {
    type: [String, Number],
    required: true,
  },
  soloLectura: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'guardar', 'error', 'validadores-cargados'])

// ==================== ESTADO LOCAL ====================
const loadingLocal = ref(false)
const validadores = ref([])
const validadoresDisponibles = ref([])
const validadorSeleccionadoParaReemplazo = ref(null)
const reemplazoTemporal = ref(null)
const solicitudCodigo = ref('')
const montoSolicitud = ref('')
const tipoSolicitud = ref('')
const resumenValidacion = ref(null)

const dialogoVisible = computed({
  get: () => props.modelValue,
  set: (valor) => emit('update:modelValue', valor),
})

const loading = computed(() => loadingLocal.value)

// ==================== COMPUTED ====================

const totalReemplazos = computed(() => validadores.value.filter((v) => v.esReemplazado).length)

const totalSinCambios = computed(() => validadores.value.filter((v) => !v.esReemplazado).length)

const hayCambios = computed(() => totalReemplazos.value > 0)

const detalleCambios = computed(() => {
  const cambios = []

  validadores.value.forEach((v) => {
    if (v.esReemplazado && v.reemplazo_nombre) {
      cambios.push({
        original: v.nombre_completo,
        nuevo: v.reemplazo_nombre,
        cargo_original: v.cargo,
        cargo_nuevo: v.reemplazo_cargo,
        codigo_seguimiento: v.codigo_seguimiento,
      })
    }
  })

  return cambios
})

// ==================== DATOS DE PRUEBA ====================

const validadoresDisponiblesPrueba = [
  {
    id: 46,
    nombre_completo: 'Hernando Rafael Espada Vedia',
    correo: 'rtechelectronica@gmail.com',
    cargo: 'dir-administrativo',
  },
  {
    id: 68,
    nombre_completo: 'Mark Rolqueza Bernal',
    correo: 'rolquezamarcelo@gmail.com',
    cargo: 'coordinador',
  },
  {
    id: 72,
    nombre_completo: 'Alvaro Recoba Martines',
    correo: 'arecoba@email.com',
    cargo: 'tecnico',
  },
  {
    id: 75,
    nombre_completo: 'Laura Jimenez Flores',
    correo: 'laura.jimenez@email.com',
    cargo: 'contador',
  },
  {
    id: 80,
    nombre_completo: 'Pedro Mamani Quispe',
    correo: 'pedro.mamani@email.com',
    cargo: 'revisor',
  },
  {
    id: 81,
    nombre_completo: 'Carla Rojas Vargas',
    correo: 'carla.rojas@email.com',
    cargo: 'finanzas',
  },
  {
    id: 82,
    nombre_completo: 'Jorge Quispe Condori',
    correo: 'jorge.quispe@email.com',
    cargo: 'auditor',
  },
  {
    id: 83,
    nombre_completo: 'Silvia Nina Huanca',
    correo: 'silvia.nina@email.com',
    cargo: 'tesorera',
  },
]

const respuestaBackendPrueba = {
  73: {
    solicitud_id: 73,
    solicitud_codigo: 'ACT0004 - SF 00073',
    monto_solicitud: '500.00',
    tipo_solicitud: 'ACTIVIDAD',
    total_revisores: 2,
    resumen: {
      total: 2,
      pendientes: 2,
      aprobados: 0,
      rechazados: 0,
      completado: false,
      aprobado_totalmente: false,
      rechazado: false,
    },
    revisores: [
      {
        validacion_id: 349,
        codigo_seguimiento: 'SF-20260802-DFEE90F5',
        estado: 'PENDIENTE',
        estado_display: 'Pendiente',
        fecha_asignacion: '2026-08-02T13:32:20.713434Z',
        fecha_resolucion: null,
        version_documento: '1',
        comentarios: '',
        validador: {
          id: 46,
          username: 'HEV40',
          nombre_completo: 'Hernando Rafael Espada Vedia',
          correo: 'rtechelectronica@gmail.com',
          cargo: 'dir-administrativo',
        },
      },
      {
        validacion_id: 350,
        codigo_seguimiento: 'SF-20260802-17ED24AB',
        estado: 'PENDIENTE',
        estado_display: 'Pendiente',
        fecha_asignacion: '2026-08-02T13:32:22.817405Z',
        fecha_resolucion: null,
        version_documento: '1',
        comentarios: '',
        validador: {
          id: 68,
          username: 'mkrolqueza',
          nombre_completo: 'Mark Rolqueza Bernal',
          correo: 'rolquezamarcelo@gmail.com',
          cargo: 'coordinador',
        },
      },
    ],
  },
}

// ==================== MÉTODOS ====================

const getAvatarColor = (validador) => {
  if (validador.esReemplazado) return 'warning'
  return 'primary'
}

const getAvatarIcon = (validador) => {
  if (validador.esReemplazado) return 'mdi-account-swap'
  return 'mdi-account'
}

const transformarRevisores = (revisores) => {
  return revisores.map((revisor) => ({
    validacion_id: revisor.validacion_id,
    codigo_seguimiento: revisor.codigo_seguimiento,
    estado: revisor.estado,
    estado_display: revisor.estado_display,
    fecha_asignacion: revisor.fecha_asignacion,
    fecha_resolucion: revisor.fecha_resolucion,
    version_documento: revisor.version_documento,
    comentarios: revisor.comentarios,
    validador_id: revisor.validador.id,
    nombre_completo: revisor.validador.nombre_completo,
    correo: revisor.validador.correo,
    cargo: revisor.validador.cargo,
    username: revisor.validador.username,
    esReemplazado: false,
    nuevo_validador_id: null,
    reemplazo_nombre: null,
    reemplazo_cargo: null,
  }))
}

const getValidadoresDisponiblesParaReemplazo = (index) => {
  const validadorActual = validadores.value[index]

  const idsExcluidos = validadores.value
    .filter((v, i) => i !== index)
    .map((v) => v.validador_id || v.id)
    .filter(Boolean)

  idsExcluidos.push(validadorActual.validador_id)

  return validadoresDisponibles.value.filter((v) => !idsExcluidos.includes(v.id))
}

const seleccionarParaReemplazo = (index) => {
  if (props.soloLectura) return
  validadorSeleccionadoParaReemplazo.value = index
  reemplazoTemporal.value = null
}

const confirmarReemplazo = (index, nuevoValidadorId) => {
  if (props.soloLectura) return
  if (!nuevoValidadorId) return

  const nuevoValidador = validadoresDisponibles.value.find((v) => v.id === nuevoValidadorId)
  if (!nuevoValidador) return

  const validadorActual = validadores.value[index]

  validadorActual.esReemplazado = true
  validadorActual.nuevo_validador_id = nuevoValidador.id
  validadorActual.reemplazo_nombre = nuevoValidador.nombre_completo
  validadorActual.reemplazo_cargo = nuevoValidador.cargo

  validadorSeleccionadoParaReemplazo.value = null
  reemplazoTemporal.value = null
}

const deshacerReemplazo = (index) => {
  if (props.soloLectura) return
  const validador = validadores.value[index]
  validador.esReemplazado = false
  validador.nuevo_validador_id = null
  validador.reemplazo_nombre = null
  validador.reemplazo_cargo = null
}

const cancelarReemplazo = () => {
  validadorSeleccionadoParaReemplazo.value = null
  reemplazoTemporal.value = null
}

const cargarValidadores = async () => {
  loadingLocal.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 300))
    validadoresDisponibles.value = validadoresDisponiblesPrueba

    await new Promise((resolve) => setTimeout(resolve, 500))

    const respuesta = respuestaBackendPrueba[props.idSolicitud]

    if (respuesta) {
      solicitudCodigo.value = respuesta.solicitud_codigo
      montoSolicitud.value = respuesta.monto_solicitud
      tipoSolicitud.value = respuesta.tipo_solicitud
      resumenValidacion.value = respuesta.resumen
      validadores.value = transformarRevisores(respuesta.revisores)
    } else {
      validadores.value = []
    }

    emit('validadores-cargados', validadores.value)
  } catch (error) {
    emit('error', { mensaje: 'Error al cargar los validadores', error })
  } finally {
    loadingLocal.value = false
  }
}

watch(
  () => props.modelValue,
  async (nuevoValor) => {
    if (nuevoValor) {
      await cargarValidadores()
    }
  },
)

const actualizarModelo = (valor) => {
  emit('update:modelValue', valor)
}

const cerrar = () => {
  validadores.value = []
  validadorSeleccionadoParaReemplazo.value = null
  reemplazoTemporal.value = null
  emit('update:modelValue', false)
}

const manejarGuardar = async (datos) => {
  if (props.soloLectura) return

  loadingLocal.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const cambios = []

    validadores.value.forEach((v) => {
      if (v.esReemplazado && v.validacion_id && v.nuevo_validador_id) {
        cambios.push({ validacion_id: v.validacion_id, nuevo_validador_id: v.nuevo_validador_id })
      }
    })

    const payload = {
      cambios,
      motivo: datos.motivo,
    }

    console.log('=== GUARDANDO VALIDADORES ===')
    console.log('Payload:', JSON.stringify(payload, null, 2))

    emit('guardar', {
      idSolicitud: props.idSolicitud,
      payload,
    })

    actualizarModelo(false)
  } catch (error) {
    emit('error', { mensaje: 'Error al guardar los validadores', error })
  } finally {
    loadingLocal.value = false
  }
}
</script>

<style scoped>
.info-documento {
  padding: 12px;
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.resumen-validacion {
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.asignados-list {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;
}

.asignado-item {
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  margin-bottom: 4px;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid transparent;
}

.asignado-reemplazado {
  background-color: rgba(var(--v-theme-warning), 0.08);
  border: 1px solid rgba(var(--v-theme-warning), 0.3);
}

.asignado-seleccionado {
  background-color: rgba(var(--v-theme-warning), 0.12);
  border: 1px solid rgba(var(--v-theme-warning), 0.4);
}

.codigo-seguimiento {
  display: inline-flex;
  align-items: center;
  background-color: rgba(var(--v-theme-info), 0.08);
  border: 1px solid rgba(var(--v-theme-info), 0.2);
}

.codigo-seguimiento code {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgb(var(--v-theme-info));
}

.reemplazo-info {
  background-color: rgba(var(--v-theme-warning), 0.08);
  border: 1px dashed rgba(var(--v-theme-warning), 0.3);
}

.resumen-cambios {
  background-color: rgba(var(--v-theme-warning), 0.05);
  border: 1px solid rgba(var(--v-theme-warning), 0.2);
}

.cambio-item {
  padding: 4px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
}

.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
.mt-1 {
  margin-top: 4px;
}
.mt-2 {
  margin-top: 8px;
}
.mt-4 {
  margin-top: 16px;
}
.mb-1 {
  margin-bottom: 4px;
}
.mb-2 {
  margin-bottom: 8px;
}
.mb-3 {
  margin-bottom: 12px;
}
.mb-4 {
  margin-bottom: 16px;
}
.my-2 {
  margin-top: 8px;
  margin-bottom: 8px;
}
.ml-1 {
  margin-left: 4px;
}
.pl-5 {
  padding-left: 20px;
}
.pl-10 {
  padding-left: 40px;
}
.pa-1 {
  padding: 4px;
}
.pa-2 {
  padding: 8px;
}
.pa-3 {
  padding: 12px;
}
.rounded {
  border-radius: 8px;
}
.mx-1 {
  margin-left: 4px;
  margin-right: 4px;
}
.text-caption {
  font-size: 0.75rem;
  line-height: 1.4;
}
.text-body-2 {
  font-size: 0.875rem;
  line-height: 1.5;
}
.font-weight-medium {
  font-weight: 500;
}
.font-weight-600 {
  font-weight: 600;
}
.min-width-0 {
  min-width: 0;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
