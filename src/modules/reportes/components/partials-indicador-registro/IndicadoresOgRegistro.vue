<template>
  <div class="indicadores-og-container">
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
          <v-icon :color="colores.header" class="mr-2">{{ colores.icon }}</v-icon>
          <span class="text-subtitle-1 font-weight-bold mr-2">
            Indicadores de Objetivo General
          </span>
          <v-chip :color="colores.chip" size="small" class="mr-2">
            Total: {{ totalSolicitados }}
          </v-chip>
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

          <!-- Botón para expandir/colapsar -->
          <v-btn
            size="small"
            :icon="expandido ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            variant="text"
            @click.stop="toggleExpand"
          ></v-btn>
        </div>

        <!-- IDs no encontrados -->
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
        <div v-for="indicador in resultados" :key="indicador.id" class="mb-6">
          <v-row>
            <!-- COLUMNA 1: Información del Indicador -->
            <v-col cols="12" md="4">
              <v-card elevation="2" class="h-100">
                <v-card-title :class="colores.bgClass + ' text-white py-2'">
                  <v-icon class="mr-2">mdi-information</v-icon>
                  Ind. OG: {{ indicador.codigo }}
                  <v-spacer></v-spacer>
                  <v-chip color="colores.chip" text-color="white" size="x-small">
                    ID: {{ indicador.id }}
                  </v-chip>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="pa-2">
                  <v-row dense>
                    <v-col cols="6">
                      <!-- Descripción -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Descripción</div>
                        <div class="text-body-2 text-truncate" :title="indicador.descripcion">
                          {{ indicador.descripcion || 'No especificada' }}
                        </div>
                      </div>
                      <!-- Redacción -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Redacción</div>
                        <div class="text-body-2">
                          {{ indicador.redaccion || 'No especificada' }}
                        </div>
                      </div>
                      <!-- Tipo con chip -->
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

                      <!-- Frecuencia -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Frecuencia</div>
                        <div class="text-body-2">
                          {{ indicador.frecuencia || 'No especificada' }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <!-- Baseline -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Baseline</div>
                        <div class="text-body-2">{{ indicador.baseline || 'No definida' }}</div>
                      </div>
                      <!-- Fecha Línea Base -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Fecha Línea Base</div>
                        <div class="text-body-2">
                          {{ formatDateIndicador(indicador.fechaLineaBase) }}
                        </div>
                      </div>
                      <!-- Meta Poblacional -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Target Población</div>
                        <div class="text-body-2">
                          {{ indicador.target_poblacion || 'No definida' }}
                        </div>
                      </div>
                      <!-- Fecha Target -->
                      <div class="mb-2">
                        <div class="text-caption font-weight-bold text-grey">Fecha Target</div>
                        <div class="text-body-2">
                          {{ formatDateIndicador(indicador.fechaTargetPoblacion) }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- MEDIAS METAS -->
                  <div class="mt-2">
                    <div class="text-caption font-weight-bold text-grey mb-1">Metas (Q)</div>
                    <v-row dense>
                      <v-col cols="6" v-for="mm in mediasMetas" :key="mm.key">
                        <div class="text-caption">
                          <span class="font-weight-bold">{{ mm.label }}:</span>
                          {{ indicador[mm.field] || '-' }}
                          <span v-if="indicador.tipo === '%' && indicador[mm.field]">%</span>
                          <br />
                          <span class="text-caption text-grey">
                            {{ formatDateIndicador(indicador[mm.fechaField]) }}
                          </span>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- COLUMNA 2: Formulario de Registro -->
            <v-col cols="12" md="4">
              <v-card elevation="2" class="h-100">
                <v-card-title class="bg-success text-white py-2">
                  <v-icon class="mr-2">mdi-pencil-plus</v-icon>
                  <span v-if="modoEdicion[indicador.id]">Editando Registro</span>
                  <span v-else>Registrar Avance</span>
                  <v-spacer></v-spacer>
                  <v-chip color="white" text-color="success" size="x-small">
                    {{ indicador.frecuencia }}
                  </v-chip>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-2">
                  <!-- Mensaje de registro existente -->
                  <div
                    v-if="tieneRegistro(indicador.id) && !modoEdicion[indicador.id]"
                    class="text-center py-4"
                  >
                    <v-icon size="48" color="success" class="mb-2">mdi-check-circle</v-icon>
                    <p class="text-body-2 font-weight-bold">
                      Ya existe un registro para este indicador
                    </p>
                    <p class="text-caption text-grey mb-3">
                      Valor actual:
                      <strong>{{ formatearValor(obtenerRegistro(indicador.id)) }}</strong>
                    </p>
                    <p class="text-caption text-grey mb-3">
                      Fecha:
                      {{ formatDateIndicador(obtenerRegistro(indicador.id)?.fecha_registro) }}
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

                  <!-- Formulario -->
                  <div v-else>
                    <v-form @submit.prevent="submitRegistro(indicador)">
                      <!-- Fecha de registro -->
                      <v-text-field
                        v-model="obtenerFormulario(indicador.id).fecha_registro"
                        label="Fecha de registro *"
                        type="date"
                        prepend-inner-icon="mdi-calendar"
                        variant="outlined"
                        density="compact"
                        :rules="[rules.required]"
                        class="mb-2"
                      ></v-text-field>

                      <!-- Campos según tipo -->
                      <template v-if="indicador.tipo === 'A-Z'">
                        <v-text-field
                          v-model="obtenerFormulario(indicador.id).valor_literal"
                          label="Valor literal *"
                          prepend-inner-icon="mdi-text"
                          variant="outlined"
                          density="compact"
                          :rules="[rules.required]"
                          class="mb-2"
                        ></v-text-field>
                      </template>

                      <template v-else-if="indicador.tipo === '%'">
                        <v-text-field
                          v-model="obtenerFormulario(indicador.id).valor_porcentual"
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
                        <v-text-field
                          v-model.number="obtenerFormulario(indicador.id).valor_numerico"
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
                        v-model="obtenerFormulario(indicador.id).observaciones"
                        label="Observaciones"
                        prepend-inner-icon="mdi-note-text"
                        variant="outlined"
                        density="compact"
                        rows="4"
                        class="mb-2"
                        placeholder="Describa el contexto del registro..."
                      ></v-textarea>

                      <!-- BOTONES CORREGIDOS - EN LA MISMA FILA -->
                      <div class="d-flex ga-2">
                        <!-- Botón Cancelar (solo en modo edición) -->
                        <v-btn
                          v-if="modoEdicion[indicador.id]"
                          color="grey"
                          size="small"
                          variant="outlined"
                          @click="cancelarEdicion(indicador.id)"
                          style="flex: 1; min-width: 0"
                        >
                          Cancelar
                        </v-btn>

                        <!-- Botón Guardar/Actualizar -->
                        <v-btn
                          color="success"
                          type="submit"
                          :loading="cargando[indicador.id]"
                          :disabled="!formularioValido(indicador)"
                          size="small"
                          :style="{ flex: modoEdicion[indicador.id] ? 1 : '100%' }"
                        >
                          <v-icon start size="small">mdi-content-save</v-icon>
                          {{ modoEdicion[indicador.id] ? 'Actualizar' : 'Guardar registro' }}
                        </v-btn>
                      </div>
                    </v-form>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- COLUMNA 3: Bitácora -->
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
import { ref, computed } from 'vue'
import TimelineBitacora from '../TimelineBitacora.vue'
import {
  formatDateIndicador,
  getTipoDatoColor,
  getTipoDatoIcon,
  getColoresIndicador,
} from '../../utils/uiUtilsRegistroIndicadores'
import { useSnackbar } from '@/composables/useSnackbar'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  datos: { type: Object, required: true },
  expanded: { type: Boolean, default: true },
  registros: { type: Array, default: () => [] },
})

//Colores
const colores = getColoresIndicador('indicadorog')

// Mapear array a objeto
const registrosMap = computed(() => {
  const map = {}
  props.registros.forEach((reg) => {
    if (reg?.id_indicador) {
      map[reg.id_indicador] = reg
    }
  })
  return map
})

//Composable de mensajes
const { infoMsg } = useSnackbar()
//Store de usuarios
const userStore = useUserStore()
const emit = defineEmits(['update:expanded', 'registro-guardado', 'registro-eliminado'])

// Estado local
const expandido = ref(props.expanded)
const formularios = ref({})
const cargando = ref({})
const modoEdicion = ref({})

// Reglas de validación
const rules = {
  required: (value) => !!value || 'Campo requerido',
  porcentaje: (value) => {
    if (!value) return true
    return (value >= 0 && value <= 100) || 'El valor debe estar entre 0 y 100'
  },
}

const toggleExpand = () => {
  expandido.value = !expandido.value
  emit('update:expanded', expandido.value)
}

/***************************** Datos iniciales ********************************/
const resultados = computed(() => props.datos?.resultados || [])
const totalSolicitados = computed(() => props.datos?.total_solicitados || 0)
const totalEncontrados = computed(() => props.datos?.total_encontrados || 0)
const idsNoEncontrados = computed(() => props.datos?.ids_no_encontrados || 0)

// Medias metas
const mediasMetas = [
  { key: 'mm1', label: 'Q1', field: 'target_q1', fechaField: 'fechaTargetQ1' },
  { key: 'mm2', label: 'Q2', field: 'target_q2', fechaField: 'fechaTargetQ2' },
  { key: 'mm3', label: 'Q3', field: 'target_q3', fechaField: 'fechaTargetQ3' },
  //{ key: 'mm4', label: 'Q4', field: 'target_q4', fechaField: 'fechaTargetQ4' },
]

/***************************** Funciones de formulario ********************************/
const crearFormularioVacio = () => ({
  fecha_registro: new Date().toISOString().split('T')[0],
  valor_literal: null,
  valor_numerico: null,
  valor_porcentual: null,
  observaciones: '',
})

const obtenerFormulario = (indicadorId) => {
  if (!formularios.value[indicadorId]) {
    formularios.value[indicadorId] = crearFormularioVacio()
  }
  return formularios.value[indicadorId]
}

/***************************** Funciones de registro ********************************/
const obtenerRegistro = (indicadorId) => registrosMap.value[indicadorId] || null
const tieneRegistro = (indicadorId) => !!registrosMap.value[indicadorId]

const formatearValor = (registro) => {
  if (!registro) return 'N/A'
  if (registro.valor_literal) return registro.valor_literal
  if (registro.valor_numerico) return registro.valor_numerico
  if (registro.valor_porcentual) return `${registro.valor_porcentual}%`
  return 'N/A'
}

/***************************** Validación ********************************/
const formularioValido = (indicador) => {
  const form = obtenerFormulario(indicador.id)
  if (!form.fecha_registro) return false

  if (indicador.tipo === 'A-Z') {
    return !!form.valor_literal && form.valor_literal.trim() !== ''
  } else if (indicador.tipo === '%') {
    return form.valor_porcentual !== null
  } else {
    return form.valor_numerico !== null
  }
}

/***************************** Acciones CRUD ********************************/
const editarRegistro = (registro, indicador) => {
  if (!registro) return

  formularios.value[indicador.id] = {
    fecha_registro: registro.fecha_registro.split('T')[0] || registro.fecha_registro,
    valor_literal: registro.valor_literal,
    valor_numerico: registro.valor_numerico,
    valor_porcentual: registro.valor_porcentual,
    observaciones: registro.observaciones,
  }

  modoEdicion.value[indicador.id] = true
  if (!expandido.value) toggleExpand()
}

const cancelarEdicion = (indicadorId) => {
  formularios.value[indicadorId] = crearFormularioVacio()
  modoEdicion.value[indicadorId] = false
}

const submitRegistro = async (indicador) => {
  const esEdicion = modoEdicion.value[indicador.id]
  const registroExistenteData = obtenerRegistro(indicador.id)

  const form = obtenerFormulario(indicador.id)

  const registroData = {
    id: registroExistenteData?.id,
    tipo_indicador: 'indicadorog',
    tipo_dato: indicador.tipo,
    id_indicador: indicador.id,
    fecha_registro: form.fecha_registro,
    observaciones: form.observaciones || '',
    timestamp_registro: new Date().toISOString(),
    registrado_por: userStore.usuario,
    registrado_por_id: userStore.id,
  }

  if (indicador.tipo === 'A-Z') {
    registroData.valor_literal = form.valor_literal
  } else if (indicador.tipo === '%') {
    registroData.valor_porcentual = form.valor_porcentual
  } else {
    registroData.valor_numerico = form.valor_numerico
  }

  cargando.value[indicador.id] = true

  try {
    emit('registro-guardado', {
      indicadorId: indicador.id,
      registro: registroData,
      esActualizacion: esEdicion,
    })

    formularios.value[indicador.id] = crearFormularioVacio()
    modoEdicion.value[indicador.id] = false
    infoMsg(esEdicion ? 'Registro actualizado' : 'Registro guardado')
  } catch (err) {
    console.error('Error: ', err)
  } finally {
    cargando.value[indicador.id] = false
  }
}
</script>

<style scoped>
.indicadores-og-container {
  min-height: 200px;
}

.cursor-pointer {
  cursor: pointer;
}

.bg-grey-lighten-3 {
  background-color: #f5f5f5 !important;
}

.h-100 {
  height: 100%;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.text-grey {
  color: #9e9e9e;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ga-2 {
  gap: 8px;
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

.bg-blue {
  background-color: #1976d2;
}

.bg-success {
  background-color: #4caf50;
}

.bg-warning {
  background-color: #ff9800;
}
</style>
