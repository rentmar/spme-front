<template>
  <div class="indicadores-og-container">
    <!-- Cabecera retráctil (siempre visible, clickeable) -->
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
          <v-icon color="blue" class="mr-2">mdi-chart-bar</v-icon>
          <span class="text-subtitle-1 font-weight-bold mr-2">
            Indicadores de Objetivo General
          </span>
          <v-chip color="blue" size="small" class="mr-2"> Total: 5 </v-chip>
          <v-spacer></v-spacer>

          <!-- Botón para expandir/colapsar -->
          <v-btn
            size="small"
            :icon="expandido ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            variant="text"
            @click.stop="toggleExpand"
          ></v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Contenido expandible con 3 columnas -->
    <v-expand-transition>
      <div v-if="expandido">
        <!--Desplegar los indicadores, registro y bitacora-->
        <div v-for="indicador in resultados" :key="indicador.id" class="mb-6">
          <v-row>
            <!-- COLUMNA 1: Información del Indicador -->
            <v-col cols="12" md="4">
              <v-card elevation="2" class="h100">
                <v-card-title class="bg-blue text-white py-2">
                  <v-icon class="mr-2">mdi-information</v-icon>
                  Ind. OG: {{ indicador.codigo }}
                  <v-spacer></v-spacer>
                  <v-chip color="white" text-color="blue" size="x-small">
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
                            {{ formatDateIndicador(indicador[mm.fechaField]) }}</span
                          >
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
                  Registrar Avance
                  <v-spacer></v-spacer>
                  <v-chip color="white" text-color="success" size="x-small">
                    {{ indicador.frecuencia }}
                  </v-chip>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-2">
                  <!-- Mensaje si ya existe registro -->
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
                  <!-- Formulario de registro (solo si NO hay registro) -->
                  <v-form v-else @submit.prevent="submitRegistro(indicador)">
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
                    <!-- Campo según tipo de dato -->
                    <template v-if="indicador.tipo === 'A-Z'">
                      <v-text-field
                        v-model="obtenerFormulario(indicador.id).valor_literal"
                        label="Valor literal *"
                        prepend-inner-icon="mdi-text"
                        variant="outlined"
                        density="compact"
                        :rules="[rules.required]"
                        class="mb-2"
                        placeholder="Ingrese el valor"
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

            <!-- COLUMNA 3: Bitácora -->
            <v-col cols="12" md="4">
              <timeline-bitacora></timeline-bitacora>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-expand-transition>
    {{ props.registros }}
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TimelineBitacora from '../TimelineBitacora.vue'
import {
  formatDateIndicador,
  getTipoDatoColor,
  getTipoDatoIcon,
} from '../../utils/uiUtilsRegistroIndicadores'
import { useSnackbar } from '@/composables/useSnackbar'

const props = defineProps({
  datos: {
    type: Object,
    required: true,
  },
  expanded: {
    type: Boolean,
    default: true,
  },
  registros: {
    type: Array,
    default: () => ({}),
  },
})

const registrosMap = computed(() => {
  const map = {}
  props.registros.forEach((reg) => {
    if (reg?.id_indicador) {
      map[reg.id_indicador] = reg
    }
  })
  return map
})

//Iniciar el composable
const { infoMsg } = useSnackbar()

const emit = defineEmits(['update:expanded', 'registro-guardado', 'registro-eliminado'])

// Estado local para el collapsable
const expandido = ref(props.expanded)
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

// Función para toggle
const toggleExpand = () => {
  expandido.value = !expandido.value
  emit('update:expanded', expandido.value)
}

/***************************** Datos iniciales del componente ********************************/
//Indicadores e informacion adicional de los indicadores
const resultados = computed(() => props.datos?.resultados || [])
const tipo = computed(() => props.datos?.tipo || '')
const totalSolicitados = computed(() => props.datos?.totalSolicitados || 0)
const totalEncontrados = computed(() => props.datos?.totalEncontrados || 0)
const idsNoEncontrados = computed(() => props.datos?.idsNoEncontrados || 0)

//Medias metas
const mediasMetas = [
  {
    key: 'mm1', // Identificador único
    label: 'Q1', // Etiqueta genérica
    field: 'target_q1', // Campo en el backend
    fechaField: 'fechaTargetQ1', // Campo de fecha en el backend
  },
  {
    key: 'mm2',
    label: 'Q2',
    field: 'target_q2',
    fechaField: 'fechaTargetQ2',
  },
  {
    key: 'mm3',
    label: 'Q3',
    field: 'target_q3',
    fechaField: 'fechaTargetQ3',
  },
  {
    key: 'mm4',
    label: 'Q4',
    field: 'target_q4',
    fechaField: 'fechaTargetQ4',
  },
]

//Crear formulario vacio
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

const obtenerRegistro = (indicadorId) => {
  //return props.registros[indicadorId] || null
  return registrosMap.value[indicadorId] || null
}

// Funciones de registro (usando store)
const tieneRegistro = (indicadorId) => {
  //return !!props.registros[indicadorId]
  return !!registrosMap.value[indicadorId]
}

// Validación
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

//Acciones CRUD
const submitRegistro = async (indicador) => {
  const registroExistente = tieneRegistro(indicador.id)

  if (registroExistente) {
    if (!confirm('Ya existe un registro. ¿Desea actualizarlo?')) {
      return
    }
  }

  const form = obtenerFormulario(indicador.id)
  const registroExistenteData = obtenerRegistro(indicador.id)

  // Preparar datos - INCLUIR ID si existe
  const registroData = {
    id: registroExistenteData?.id, // ← Enviar ID existente si lo hay
    tipo_indicador: 'indicadorog',
    tipo_dato: indicador.tipo,
    id_indicador: indicador.id,
    fecha_registro: form.fecha_registro,
    observaciones: form.observaciones || '',
    timestamp_registro: new Date().toISOString(),
    registrado_por: 'Usuario Actual',
    registrado_por_id: 1,
  }

  // Asignar valor según tipo
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
      esActualizacion: !!registroExistente,
    })

    // Limpiar formulario SOLO si es nuevo
    if (!registroExistente) {
      formularios.value[indicador.id] = crearFormularioVacio()
    }
  } catch (err) {
    console.error('Error: ', err)
  } finally {
    cargando.value[indicador.id] = false
  }
}

//Editar el registro
const editarRegistro = (registro, indicador) => {
  if (!registro) return

  formularios.value[indicador.id] = {
    fecha_registro: registro.fecha_registro.split('T')[0] || registro.fecha_registro,
    valor_literal: registro.valor_literal,
    valor_numerico: registro.valor_numerico,
    valor_porcentual: registro.valor_porcentual,
    observaciones: registro.observaciones,
  }

  if (!expandido.value) toggleExpand()
}
</script>

<style scoped>
.indicadores-og-container {
  min-height: 200px;
}
</style>
