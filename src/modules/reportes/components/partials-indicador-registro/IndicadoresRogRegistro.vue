<template>
  <div class="indicadores-rog-container">
    <!-- Cabecera retráctil -->
    <v-card class="mb-4" elevation="2">
      <v-card-text class="pa-0">
        <!-- Barra de título clickeable -->
        <div
          class="d-flex align-center pa-3 cursor-pointer"
          @click="toggleExpand"
          :class="{ 'bg-grey-lighten-3': expandido }"
        >
          <v-icon :color="expandido ? 'primary' : 'grey'" class="mr-2">
            {{ expandido ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
          </v-icon>

          <v-icon color="orange" class="mr-2">mdi-chart-areaspline</v-icon>
          <span class="text-subtitle-1 font-weight-bold mr-2">
            Indicadores de Resultado de Objetivo General
          </span>

          <v-chip color="orange" size="small" class="mr-2"> Total: {{ totalSolicitados }} </v-chip>

          <v-chip
            :color="totalEncontrados === totalSolicitados ? 'success' : 'warning'"
            size="small"
          >
            {{
              totalEncontrados === totalSolicitados
                ? 'Completos'
                : `Encontrados: ${totalEncontrados}`
            }}
          </v-chip>

          <v-spacer></v-spacer>

          <!-- Badge de registros totales -->
          <v-chip
            v-if="totalRegistrosBitacora > 0"
            color="info"
            size="small"
            prepend-icon="mdi-book-open-variant"
            class="mr-2"
          >
            {{ totalRegistrosBitacora }} registros
          </v-chip>

          <!-- Botón para expandir/colapsar -->
          <v-btn
            size="small"
            :icon="expandido ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            variant="text"
            @click.stop="toggleExpand"
          ></v-btn>
        </div>

        <!-- Resumen de IDs no encontrados (siempre visible si hay) -->
        <v-slide-y-transition>
          <div v-if="idsNoEncontrados.length > 0" class="px-3 pb-2">
            <v-chip color="error" size="small" prepend-icon="mdi-alert" class="mt-1">
              IDs no encontrados: {{ idsNoEncontrados.join(', ') }}
            </v-chip>
          </div>
        </v-slide-y-transition>
      </v-card-text>
    </v-card>

    <!-- Contenido expandible -->
    <v-expand-transition>
      <div v-if="expandido">
        <!-- Lista de indicadores -->
        <div v-for="indicador in resultados" :key="indicador.id" class="mb-6">
          <v-row>
            <!-- Columna 1: Información del Indicador (COMPLETA) -->
            <v-col cols="12" md="4">
              <v-card elevation="2" class="h-100">
                <v-card-title class="bg-orange text-white py-2">
                  <v-icon class="mr-2">mdi-information</v-icon>
                  Ind. ROG: {{ indicador.codigo }}
                  <v-spacer></v-spacer>
                  <v-chip color="white" text-color="orange" size="x-small">
                    ID: {{ indicador.id }}
                  </v-chip>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="pa-2">
                  <!-- Layout de 2 columnas para la información -->
                  <v-row dense>
                    <!-- Columna izquierda -->
                    <v-col cols="6">
                      <!-- Información Básica -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Descripción</div>
                        <div class="text-body-2 text-truncate" :title="indicador.descripcion">
                          {{ indicador.descripcion || 'No especificada' }}
                        </div>
                      </div>

                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Redacción</div>
                        <div class="text-body-2">
                          {{ indicador.redaccion || 'No especificada' }}
                        </div>
                      </div>

                      <!-- Configuración -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Tipo</div>
                        <v-chip
                          :color="getTipoDatoColor(indicador.tipo)"
                          size="x-small"
                          :prepend-icon="getTipoDatoIcon(indicador.tipo)"
                        >
                          {{ indicador.tipo }}
                        </v-chip>
                      </div>

                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Frecuencia</div>
                        <div class="text-body-2">
                          {{ indicador.frecuencia || 'No especificada' }}
                        </div>
                      </div>

                      <!-- Resultado OG ID -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Resultado de OG</div>
                        <div class="text-body-2">
                          ID: {{ indicador.resultado_og_id || 'No asignado' }}
                        </div>
                      </div>

                      <!-- Fuente de verificación -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">
                          Fuente de verificación
                        </div>
                        <div
                          class="text-body-2 text-truncate"
                          :title="indicador.fuente_verificacion"
                        >
                          {{ indicador.fuente_verificacion || 'No especificada' }}
                        </div>
                      </div>
                    </v-col>

                    <!-- Columna derecha -->
                    <v-col cols="6">
                      <!-- Línea Base -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Baseline</div>
                        <div class="text-body-2">{{ indicador.baseline || 'No definida' }}</div>
                      </div>

                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Fecha Línea Base</div>
                        <div class="text-body-2">{{ formatDate(indicador.fechaLineaBase) }}</div>
                      </div>

                      <!-- Meta Poblacional -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Target Población</div>
                        <div class="text-body-2">
                          {{ indicador.target_poblacion || 'No definida' }}
                        </div>
                      </div>

                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Fecha Target</div>
                        <div class="text-body-2">
                          {{ formatDate(indicador.fechaTargetPoblacion) }}
                        </div>
                      </div>

                      <!-- Responsable -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Responsable</div>
                        <div class="text-body-2">
                          {{ indicador.responsable || 'No asignado' }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Metas Trimestrales en grid compacto -->
                  <div class="mt-2">
                    <div class="text-caption font-weight-bold text-grey mb-1">
                      Metas Trimestrales
                    </div>
                    <v-row dense>
                      <v-col cols="6" v-for="q in trimestres" :key="q.key">
                        <div class="text-caption">
                          <span class="font-weight-bold">{{ q.label }}:</span>
                          {{ indicador[q.field] || '-' }}
                          <span v-if="indicador.tipo === '%' && indicador[q.field]">%</span>
                          <br />
                          <span class="text-caption text-grey">{{
                            formatDate(indicador[q.fechaField])
                          }}</span>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Columna 2: Formulario de Registro -->
            <v-col cols="12" md="4">
              <v-card elevation="2" class="h-100">
                <v-card-title class="bg-success text-white py-2">
                  <v-icon class="mr-2">mdi-pencil-plus</v-icon>
                  Registrar Avance ROG
                  <v-spacer></v-spacer>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="pa-2">
                  <!-- Mostrar mensaje si ya existe un registro (usando registrosLocales) -->
                  <div v-if="tieneRegistro(indicador.id)" class="text-center py-4">
                    <v-icon size="48" color="success" class="mb-2">mdi-check-circle</v-icon>
                    <p class="text-body-2 font-weight-bold">
                      Ya existe un registro para este indicador
                    </p>
                    <p class="text-caption text-grey mb-3">
                      Para modificarlo, edite el registro existente en la bitácora
                    </p>
                    <v-btn
                      color="warning"
                      size="small"
                      variant="outlined"
                      @click="editarRegistro(obtenerRegistro(indicador.id), indicador)"
                    >
                      <v-icon start size="small">mdi-pencil</v-icon>
                      Editar registro existente
                    </v-btn>
                  </div>

                  <!-- Formulario solo si no hay registro -->
                  <v-form v-else @submit.prevent="submitRegistro(indicador)">
                    <!-- Fecha de registro -->
                    <v-text-field
                      v-model="formularios[indicador.id].fecha_registro"
                      label="Fecha de registro *"
                      type="date"
                      prepend-inner-icon="mdi-calendar"
                      variant="outlined"
                      density="compact"
                      :rules="[rules.required]"
                      class="mb-2"
                    ></v-text-field>

                    <!-- Campo según tipo de dato -->
                    <template v-if="indicador.tipo === 'A-Z'">
                      <v-text-field
                        v-model="formularios[indicador.id].valor_literal"
                        label="Valor literal *"
                        prepend-inner-icon="mdi-text"
                        variant="outlined"
                        density="compact"
                        :rules="[rules.required]"
                        placeholder="Ej: Bueno, Regular, Excelente, etc."
                        class="mb-2"
                      ></v-text-field>
                    </template>

                    <template v-else-if="indicador.tipo === '%'">
                      <v-text-field
                        v-model="formularios[indicador.id].valor_porcentual"
                        label="Valor porcentual *"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        prepend-inner-icon="mdi-percent"
                        variant="outlined"
                        density="compact"
                        suffix="%"
                        :rules="[rules.required, rules.porcentaje]"
                        placeholder="Ej: 75.5"
                        class="mb-2"
                      ></v-text-field>
                    </template>

                    <template v-else>
                      <!-- 1-9: Numérico -->
                      <v-text-field
                        v-model.number="formularios[indicador.id].valor_numerico"
                        label="Valor numérico *"
                        type="number"
                        step="any"
                        prepend-inner-icon="mdi-numeric"
                        variant="outlined"
                        density="compact"
                        :rules="[rules.required]"
                        placeholder="Ej: 150, 75.5, 2000"
                        class="mb-2"
                      ></v-text-field>
                    </template>

                    <!-- Observaciones -->
                    <v-textarea
                      v-model="formularios[indicador.id].observaciones"
                      label="Observaciones"
                      prepend-inner-icon="mdi-note-text"
                      variant="outlined"
                      density="compact"
                      rows="2"
                      class="mb-2"
                      placeholder="Describa el contexto del registro..."
                    ></v-textarea>

                    <!-- Botón guardar -->
                    <v-btn
                      color="success"
                      block
                      type="submit"
                      :loading="cargando[indicador.id]"
                      :disabled="!formularioValido(indicador)"
                      size="small"
                    >
                      <v-icon start size="small">mdi-content-save</v-icon>
                      Guardar registro
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Columna 3: Bitácora existente -->
            <v-col cols="12" md="4">
              <timeline-bitacora></timeline-bitacora>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import TimelineBitacora from '../TimelineBitacora.vue'
import {
  formatDateIndicador,
  getTipoDatoColor,
  getTipoDatoIcon,
  getTipoDatoLabel,
} from '../../utils/uiUtilsRegistroIndicadores'

// Props
const props = defineProps({
  datos: {
    type: Object,
    required: true,
  },
  expanded: {
    type: Boolean,
    default: true,
  },
})

// Emits
const emit = defineEmits(['registro-guardado', 'registro-eliminado', 'update:expanded'])

// Estado local para expandido
const expandido = ref(props.expanded)

// Estado local para registros (simula la bitácora)
const registrosLocales = ref({})

// Constantes
const trimestres = [
  { key: 'q1', label: 'Q1', field: 'target_q1', fechaField: 'fechaTargetQ1' },
  { key: 'q2', label: 'Q2', field: 'target_q2', fechaField: 'fechaTargetQ2' },
  { key: 'q3', label: 'Q3', field: 'target_q3', fechaField: 'fechaTargetQ3' },
  { key: 'q4', label: 'Q4', field: 'target_q4', fechaField: 'fechaTargetQ4' },
]

// Datos del props
const resultados = computed(() => props.datos?.resultados || [])
const totalSolicitados = computed(() => props.datos?.total_solicitados || 0)
const totalEncontrados = computed(() => props.datos?.total_encontrados || 0)
const idsNoEncontrados = computed(() => props.datos?.ids_no_encontrados || [])

// ✅ CAMBIO 1: Total de registros en bitácora (ahora cuenta objetos directamente)
const totalRegistrosBitacora = computed(() => {
  return Object.keys(registrosLocales.value).length
})

// Estados locales
const formularios = ref({})
const cargando = ref({})

// Reglas de validación
const rules = {
  required: (value) => !!value || 'Campo requerido',
  porcentaje: (value) => {
    if (!value) return true
    return (value >= 0 && value <= 100) || 'El valor debe estar entre 0 y 100'
  },
}

// ✅ CAMBIO 2: Función para verificar si un indicador tiene registro (versión objeto)
const tieneRegistro = (indicadorId) => {
  return !!registrosLocales.value[indicadorId]
}

// ✅ CAMBIO 3: Función para obtener el registro de un indicador (versión objeto)
const obtenerRegistro = (indicadorId) => {
  return registrosLocales.value[indicadorId] || null
}

// ✅ CAMBIO 4: Función para obtener registros por indicador (devuelve array para la bitácora)
const obtenerRegistrosPorIndicador = (indicadorId) => {
  return registrosLocales.value[indicadorId] ? [registrosLocales.value[indicadorId]] : []
}

// Función para toggle expandido
const toggleExpand = () => {
  expandido.value = !expandido.value
  emit('update:expanded', expandido.value)
}

// Inicializar formularios
const inicializarFormularios = () => {
  resultados.value.forEach((indicador) => {
    if (!formularios.value[indicador.id]) {
      formularios.value[indicador.id] = {
        fecha_registro: new Date().toISOString().split('T')[0],
        valor_literal: null,
        valor_numerico: null,
        valor_porcentual: null,
        observaciones: '',
      }
    }
  })
}

// Validar formulario
const formularioValido = (indicador) => {
  const form = formularios.value[indicador.id]
  if (!form || !form.fecha_registro) return false

  if (indicador.tipo === 'A-Z') {
    return !!form.valor_literal && form.valor_literal.trim() !== ''
  } else if (indicador.tipo === '%') {
    return form.valor_porcentual !== null && form.valor_porcentual !== undefined
  } else {
    return form.valor_numerico !== null && form.valor_numerico !== undefined
  }
}

// ✅ CAMBIO 5: Submit registro (guardar como OBJETO, no array)
const submitRegistro = async (indicador) => {
  // Verificar si ya existe un registro
  if (tieneRegistro(indicador.id)) {
    alert('Ya existe un registro para este indicador. Solo se permite un registro por indicador.')
    return
  }

  const form = formularios.value[indicador.id]

  // Preparar datos según tipo
  const registroData = {
    id: Date.now(), // ID único temporal
    tipo_indicador: 'indicadorrog', // ✅ ESTÁ BIEN
    tipo_dato: indicador.tipo,
    id_indicador: indicador.id,
    fecha_registro: form.fecha_registro,
    observaciones: form.observaciones || '',
    timestamp_registro: new Date().toISOString(),
    registrado_por: 'Usuario Actual',
  }

  // Asignar valor según tipo
  if (indicador.tipo === 'A-Z') {
    registroData.valor_literal = form.valor_literal
    registroData.valor_numerico = null
    registroData.valor_porcentual = null
  } else if (indicador.tipo === '%') {
    registroData.valor_porcentual = form.valor_porcentual
    registroData.valor_literal = null
    registroData.valor_numerico = null
  } else {
    registroData.valor_numerico = form.valor_numerico
    registroData.valor_literal = null
    registroData.valor_porcentual = null
  }

  cargando.value[indicador.id] = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log('Registro ROG guardado:', registroData)

    // ✅ Guardar como OBJETO directamente, no como array
    registrosLocales.value[indicador.id] = registroData

    // Emitir evento
    emit('registro-guardado', {
      tipo: 'rog',
      indicadorId: indicador.id,
      registro: registroData,
    })

    // Limpiar formulario
    formularios.value[indicador.id] = {
      fecha_registro: new Date().toISOString().split('T')[0],
      valor_literal: null,
      valor_numerico: null,
      valor_porcentual: null,
      observaciones: '',
    }
  } catch (error) {
    console.error('Error guardando registro ROG:', error)
  } finally {
    cargando.value[indicador.id] = false
  }
}

// ✅ CAMBIO 6: Eliminar registro (ahora elimina objeto, igual que antes)
const eliminarRegistro = async (registroId, indicadorId) => {
  if (!confirm('¿Está seguro de eliminar este registro?')) return

  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Registro ROG eliminado:', registroId)

    // Eliminar de registros locales
    if (registrosLocales.value[indicadorId]) {
      delete registrosLocales.value[indicadorId]
    }

    emit('registro-eliminado', {
      tipo: 'rog',
      indicadorId: indicadorId,
      registroId: registroId,
    })
  } catch (error) {
    console.error('Error eliminando registro ROG:', error)
  }
}

// ✅ CAMBIO 7: Editar registro (ahora recibe objeto directamente)
const editarRegistro = (registro, indicador) => {
  if (!registro) return

  // Cargar datos en el formulario
  formularios.value[indicador.id] = {
    fecha_registro: registro.fecha_registro.split('T')[0] || registro.fecha_registro,
    valor_literal: registro.valor_literal,
    valor_numerico: registro.valor_numerico,
    valor_porcentual: registro.valor_porcentual,
    observaciones: registro.observaciones,
  }

  // Expandir si está colapsado
  if (!expandido.value) {
    toggleExpand()
  }
}

const getRegistroColor = (registro, indicador) => {
  if (indicador.tipo === '%') {
    const valor = registro.valor_porcentual || 0
    if (valor >= 75) return 'success'
    if (valor >= 50) return 'warning'
    return 'error'
  }
  if (indicador.tipo === '1-9') {
    const target = parseFloat(indicador.target_poblacion) || 100
    const valor = registro.valor_numerico || 0
    const porcentaje = (valor / target) * 100
    if (porcentaje >= 75) return 'success'
    if (porcentaje >= 50) return 'warning'
    return 'error'
  }
  return 'info'
}

const getValorFormateado = (registro) => {
  if (registro.valor_literal) return registro.valor_literal
  if (registro.valor_numerico) return registro.valor_numerico
  if (registro.valor_porcentual) return `${registro.valor_porcentual}%`
  return 'N/A'
}

const formatDate = (fecha) => {
  if (!fecha) return '-'
  const date = new Date(fecha)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Watchers
watch(
  resultados,
  () => {
    inicializarFormularios()
  },
  { immediate: true, deep: true },
)

watch(
  () => props.expanded,
  (val) => {
    expandido.value = val
  },
)
</script>

<style scoped>
.indicadores-rog-container {
  min-height: 200px;
}

.cursor-pointer {
  cursor: pointer;
}

.bg-grey-lighten-3 {
  background-color: #f5f5f5 !important;
}

.bg-orange {
  background-color: #ff9800;
}

.h-100 {
  height: 100%;
}

.timeline-container {
  height: 400px !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.timeline-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 2px;
}

.timeline-scroll::-webkit-scrollbar {
  width: 3px;
}

.timeline-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.timeline-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.bg-success {
  background-color: #4caf50;
}

.bg-warning {
  background-color: #ff9800;
}

.text-grey {
  color: #9e9e9e;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
