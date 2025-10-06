<template>
  <v-container v-if="!isLoading && indicadoresActividad" class="indicadores-container" fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="headline font-weight-bold text-primary">
            Registro de Indicadores
          </v-card-title>

          <v-card-text>
            <v-row align="center" class="controls">
              <v-col cols="12" sm="auto">
                <v-btn
                  @click="toggleTodos"
                  :color="todosAbiertos ? 'error' : 'primary'"
                  class="toggle-all-btn"
                >
                  <v-icon start>
                    {{ todosAbiertos ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                  </v-icon>
                  {{ todosAbiertos ? 'Contraer Todos' : 'Expandir Todos' }}
                </v-btn>
              </v-col>

              <v-col cols="12" sm="auto">
                <v-chip color="warning" class="text-white">
                  <v-icon start>mdi-information</v-icon>
                  Solo se permite un registro por indicador
                </v-chip>
              </v-col>

              <!-- NUEVO BOTÓN PARA ENVIAR TODOS LOS REGISTROS -->
              <v-col cols="12" sm="auto" class="ml-auto">
                <v-btn
                  @click="enviarTodosLosRegistros"
                  :disabled="totalRegistrados === 0"
                  color="success"
                  class="enviar-todos-btn"
                  size="large"
                >
                  <v-icon start>mdi-send</v-icon>
                  Enviar Todos los Registros
                  <v-chip size="small" class="ml-2" color="white" text-color="success">
                    {{ totalRegistrados }}/{{ indicadoresActividad.length }}
                  </v-chip>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- El resto del componente permanece igual -->
    <v-row>
      <v-col cols="12">
        <v-expansion-panels v-model="expandedIndices" multiple>
          <v-expansion-panel
            v-for="(indicador, index) in indicadoresActividad"
            :key="indicador.id"
            :class="{ 'con-registro': formData[index].historial.length > 0 }"
          >
            <v-expansion-panel-title>
              <v-row align="center" class="header-content">
                <v-col cols="12" md="auto">
                  <span class="codigo font-weight-bold">{{ indicador.nodoproyecto.codigo }}</span>
                </v-col>
                <v-col cols="12" md="auto">
                  <div class="d-flex flex-wrap gap-2">
                    <v-chip size="small" :color="getTipoColor(indicador.type)" class="text-white">
                      {{ getTipoLabel(indicador.type) }}
                    </v-chip>
                    <v-chip
                      size="small"
                      :color="getTipoDatoColor(indicador.tipo_dato)"
                      class="text-white"
                    >
                      {{ getTipoDatoLabel(indicador.tipo_dato) }}
                    </v-chip>
                    <v-chip
                      size="small"
                      :color="formData[index].historial.length > 0 ? 'success' : 'warning'"
                      class="text-white"
                    >
                      <v-icon start size="small">
                        {{ formData[index].historial.length > 0 ? 'mdi-check' : 'mdi-clock' }}
                      </v-icon>
                      {{ formData[index].historial.length > 0 ? 'Registrado' : 'Pendiente' }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12" md="6" class="info-col">
                  <v-card variant="outlined">
                    <v-card-title class="info-title">
                      <v-icon start color="primary">mdi-information</v-icon>
                      Información del Indicador
                    </v-card-title>

                    <v-card-text>
                      <v-list density="compact">
                        <v-list-item>
                          <v-list-item-title class="font-weight-bold"
                            >Descripción</v-list-item-title
                          >
                          <v-list-item-subtitle>
                            {{ indicador.nodoproyecto.descripcion || 'Sin descripción' }}
                          </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="indicador.nodoproyecto.definicion">
                          <v-list-item-title class="font-weight-bold">Definición</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ indicador.nodoproyecto.definicion }}
                          </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-title class="font-weight-bold">Redacción</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ indicador.nodoproyecto.redaccion }}
                          </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="indicador.nodoproyecto.fuente_verificacion">
                          <v-list-item-title class="font-weight-bold"
                            >Fuente de Verificación</v-list-item-title
                          >
                          <v-list-item-subtitle>
                            {{ indicador.nodoproyecto.fuente_verificacion }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>

                      <v-divider class="my-4"></v-divider>

                      <v-row class="info-grid">
                        <v-col cols="6" sm="4">
                          <div class="info-item">
                            <span class="font-weight-bold info-label">Frecuencia:</span>
                            <span class="info-value">{{ indicador.nodoproyecto.frecuencia }}</span>
                          </div>
                        </v-col>

                        <v-col cols="6" sm="4" v-if="indicador.nodoproyecto.responsable">
                          <div class="info-item">
                            <span class="font-weight-bold info-label">Responsable:</span>
                            <span class="info-value">{{ indicador.nodoproyecto.responsable }}</span>
                          </div>
                        </v-col>

                        <v-col cols="6" sm="4" v-if="indicador.nodoproyecto.baseline">
                          <div class="info-item">
                            <span class="font-weight-bold info-label">Línea Base:</span>
                            <span class="info-value">{{ indicador.nodoproyecto.baseline }}</span>
                          </div>
                        </v-col>

                        <v-col cols="6" sm="4" v-if="indicador.nodoproyecto.target_poblacion">
                          <div class="info-item">
                            <span class="font-weight-bold info-label">Target Población:</span>
                            <span class="info-value">{{
                              indicador.nodoproyecto.target_poblacion
                            }}</span>
                          </div>
                        </v-col>

                        <v-col cols="6" sm="4" v-if="indicador.nodoproyecto.fechaLineaBase">
                          <div class="info-item">
                            <span class="font-weight-bold info-label">Fecha Línea Base:</span>
                            <span class="info-value">{{
                              formatDate(indicador.nodoproyecto.fechaLineaBase)
                            }}</span>
                          </div>
                        </v-col>

                        <v-col cols="6" sm="4" v-if="indicador.nodoproyecto.target_q1">
                          <div class="info-item">
                            <span class="font-weight-bold info-label">Target Q1:</span>
                            <span class="info-value">{{ indicador.nodoproyecto.target_q1 }}</span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6" class="form-col">
                  <v-card>
                    <v-card-title class="form-title">
                      <v-icon start color="primary">mdi-pencil</v-icon>
                      Registro de Avance
                    </v-card-title>

                    <v-card-text>
                      <v-form
                        v-if="formData[index].historial.length === 0"
                        @submit.prevent="registrarAvance(indicador, index)"
                        class="avance-form"
                      >
                        <v-text-field
                          v-if="indicador.tipo_dato === '1-9'"
                          v-model="formData[index].valor"
                          :label="`Valor del Indicador (${getTipoDatoLabel(indicador.tipo_dato)})`"
                          type="number"
                          step="any"
                          :placeholder="getPlaceholder(indicador.tipo_dato)"
                          required
                          variant="outlined"
                        ></v-text-field>

                        <v-textarea
                          v-else-if="indicador.tipo_dato === 'A-Z'"
                          v-model="formData[index].valor"
                          :label="`Valor del Indicador (${getTipoDatoLabel(indicador.tipo_dato)})`"
                          :placeholder="getPlaceholder(indicador.tipo_dato)"
                          rows="4"
                          required
                          variant="outlined"
                        ></v-textarea>

                        <v-text-field
                          v-else-if="indicador.tipo_dato === '%'"
                          v-model="formData[index].valor"
                          :label="`Valor del Indicador (${getTipoDatoLabel(indicador.tipo_dato)})`"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          :placeholder="getPlaceholder(indicador.tipo_dato)"
                          required
                          variant="outlined"
                          suffix="%"
                        ></v-text-field>

                        <v-text-field
                          v-model="formData[index].fecha_registro"
                          label="Fecha de Registro"
                          type="date"
                          required
                          variant="outlined"
                          class="mt-4"
                        ></v-text-field>

                        <v-textarea
                          v-model="formData[index].observaciones"
                          label="Observaciones"
                          placeholder="Observaciones adicionales..."
                          rows="3"
                          variant="outlined"
                          class="mt-4"
                        ></v-textarea>

                        <v-file-input
                          v-model="formData[index].archivos"
                          label="Archivos de Evidencia"
                          multiple
                          prepend-icon="mdi-paperclip"
                          variant="outlined"
                          class="mt-4"
                          show-size
                        ></v-file-input>

                        <v-card-actions class="form-actions">
                          <v-btn type="submit" color="success" class="submit-btn">
                            <v-icon start>mdi-check</v-icon>
                            Registrar Avance
                          </v-btn>
                          <v-btn
                            @click="limpiarFormulario(index)"
                            color="secondary"
                            variant="outlined"
                          >
                            <v-icon start>mdi-refresh</v-icon>
                            Limpiar
                          </v-btn>
                        </v-card-actions>
                      </v-form>

                      <div v-else class="registro-existente">
                        <v-alert type="success" border="start" elevation="2">
                          <v-row align="center">
                            <v-col cols="auto">
                              <v-icon size="large">mdi-check-circle</v-icon>
                            </v-col>
                            <v-col>
                              <h3 class="text-h6">Avance Registrado</h3>
                            </v-col>
                          </v-row>
                        </v-alert>

                        <v-list class="registro-info">
                          <v-list-item>
                            <template #prepend>
                              <v-icon color="primary">mdi-numeric</v-icon>
                            </template>
                            <v-list-item-title>Valor registrado</v-list-item-title>
                            <v-list-item-subtitle class="valor-destacado">
                              {{ formData[index].historial[0].valor
                              }}{{ indicador.tipo_dato === '%' ? '%' : '' }}
                            </v-list-item-subtitle>
                          </v-list-item>

                          <v-list-item>
                            <template #prepend>
                              <v-icon color="primary">mdi-calendar</v-icon>
                            </template>
                            <v-list-item-title>Fecha de registro</v-list-item-title>
                            <v-list-item-subtitle>
                              {{ formatDate(formData[index].historial[0].fecha_registro) }}
                            </v-list-item-subtitle>
                          </v-list-item>

                          <v-list-item v-if="formData[index].historial[0].observaciones">
                            <template #prepend>
                              <v-icon color="primary">mdi-text</v-icon>
                            </template>
                            <v-list-item-title>Observaciones</v-list-item-title>
                            <v-list-item-subtitle class="observaciones-text">
                              {{ formData[index].historial[0].observaciones }}
                            </v-list-item-subtitle>
                          </v-list-item>

                          <v-list-item v-if="formData[index].historial[0].archivos.length">
                            <template #prepend>
                              <v-icon color="primary">mdi-paperclip</v-icon>
                            </template>
                            <v-list-item-title>Archivos adjuntos</v-list-item-title>
                            <v-list-item-subtitle>
                              <v-chip
                                v-for="(file, fileIndex) in formData[index].historial[0].archivos"
                                :key="fileIndex"
                                size="small"
                                class="ma-1"
                              >
                                <v-icon start size="small">mdi-file</v-icon>
                                {{ file.name }}
                              </v-chip>
                            </v-list-item-subtitle>
                          </v-list-item>
                        </v-list>

                        <v-card-actions class="acciones-registro">
                          <v-btn
                            @click="editarRegistro(index)"
                            :disabled="editandoIndex === index"
                            color="warning"
                          >
                            <v-icon start>mdi-pencil</v-icon>
                            {{ editandoIndex === index ? 'Editando...' : 'Editar Registro' }}
                          </v-btn>

                          <v-btn
                            @click="eliminarRegistro(indicador, index)"
                            color="error"
                            variant="outlined"
                          >
                            <v-icon start>mdi-delete</v-icon>
                            Eliminar Registro
                          </v-btn>
                        </v-card-actions>
                      </div>

                      <v-form
                        v-if="editandoIndex === index"
                        @submit.prevent="guardarEdicion(indicador, index)"
                        class="edicion-form"
                      >
                        <v-alert type="warning" border="start" elevation="2">
                          <v-row align="center">
                            <v-col cols="auto">
                              <v-icon>mdi-pencil</v-icon>
                            </v-col>
                            <v-col>
                              <h3 class="text-h6">Editando Registro</h3>
                            </v-col>
                          </v-row>
                        </v-alert>

                        <v-text-field
                          v-if="indicador.tipo_dato === '1-9'"
                          v-model="formData[index].valor"
                          :label="`Valor del Indicador (${getTipoDatoLabel(indicador.tipo_dato)})`"
                          type="number"
                          step="any"
                          :placeholder="getPlaceholder(indicador.tipo_dato)"
                          required
                          variant="outlined"
                          class="mt-4"
                        ></v-text-field>

                        <v-textarea
                          v-else-if="indicador.tipo_dato === 'A-Z'"
                          v-model="formData[index].valor"
                          :label="`Valor del Indicador (${getTipoDatoLabel(indicador.tipo_dato)})`"
                          :placeholder="getPlaceholder(indicador.tipo_dato)"
                          rows="4"
                          required
                          variant="outlined"
                          class="mt-4"
                        ></v-textarea>

                        <v-text-field
                          v-else-if="indicador.tipo_dato === '%'"
                          v-model="formData[index].valor"
                          :label="`Valor del Indicador (${getTipoDatoLabel(indicador.tipo_dato)})`"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          :placeholder="getPlaceholder(indicador.tipo_dato)"
                          required
                          variant="outlined"
                          suffix="%"
                          class="mt-4"
                        ></v-text-field>

                        <v-text-field
                          v-model="formData[index].fecha_registro"
                          label="Fecha de Registro"
                          type="date"
                          required
                          variant="outlined"
                          class="mt-4"
                        ></v-text-field>

                        <v-textarea
                          v-model="formData[index].observaciones"
                          label="Observaciones"
                          placeholder="Observaciones adicionales..."
                          rows="3"
                          variant="outlined"
                          class="mt-4"
                        ></v-textarea>

                        <v-file-input
                          v-model="formData[index].archivos"
                          label="Archivos de Evidencia"
                          multiple
                          prepend-icon="mdi-paperclip"
                          variant="outlined"
                          class="mt-4"
                          show-size
                        ></v-file-input>

                        <v-card-actions class="form-actions">
                          <v-btn type="submit" color="success">
                            <v-icon start>mdi-content-save</v-icon>
                            Guardar Cambios
                          </v-btn>
                          <v-btn
                            @click="cancelarEdicion(index)"
                            color="secondary"
                            variant="outlined"
                          >
                            <v-icon start>mdi-close</v-icon>
                            Cancelar
                          </v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="resumen-card">
          <v-card-title>
            <v-icon start color="primary">mdi-chart-box</v-icon>
            Resumen de Registros
          </v-card-title>

          <v-card-text>
            <v-row class="resumen-stats">
              <v-col cols="6" sm="3">
                <v-card color="success" theme="dark">
                  <v-card-text class="text-center">
                    <div class="stat-number">{{ totalRegistrados }}</div>
                    <div class="stat-label">Registrados</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6" sm="3">
                <v-card color="warning" theme="dark">
                  <v-card-text class="text-center">
                    <div class="stat-number">{{ totalPendientes }}</div>
                    <div class="stat-label">Pendientes</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6" sm="3">
                <v-card color="primary" theme="dark">
                  <v-card-text class="text-center">
                    <div class="stat-number">{{ indicadoresActividad.length }}</div>
                    <div class="stat-label">Total</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6" sm="3">
                <v-card color="info" theme="dark">
                  <v-card-text class="text-center">
                    <div class="stat-number">{{ porcentajeCompletado }}%</div>
                    <div class="stat-label">Completado</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-progress-linear
              :model-value="porcentajeCompletado"
              height="20"
              color="success"
              class="mt-4"
            >
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else-if="isLoading" class="loading">
    <v-row justify="center" align="center" style="height: 50vh">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <div class="mt-4 text-h6">Cargando indicadores...</div>
      </v-col>
    </v-row>
  </v-container>

  <v-container
    v-else-if="!isLoading && (!indicadoresActividad || indicadoresActividad.length === 0)"
    class="no-data"
  >
    <v-row justify="center" align="center" style="height: 50vh">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey">mdi-information-outline</v-icon>
        <div class="mt-4 text-h6">No se encontraron indicadores para esta actividad.</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useIndicadoresStore } from '../stores/useIndicadoresStore'
import { onMounted, ref, computed, watch } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  idactividad: {
    type: [Number, String],
    required: true,
  },
})

const { infoMsg } = useSnackbar()

// DEFINIR LOS EVENTOS QUE EMITE EL COMPONENTE
const emit = defineEmits([
  'avance-registrado',
  'edicion-completada',
  'registro-eliminado',
  'estado-registros',
  'registro-completado',
  'error-registro',
  'carga-completada',
  'indicador-editando',
  'indicador-cancelar-edicion',
  'todos-los-registros-enviados', // NUEVO EVENTO
])

// Inicializar el store
const storeIndicadores = useIndicadoresStore()

// Indicadores
const indicadoresActividad = computed(() => {
  return storeIndicadores.organizarIndicadores()
})

const isLoading = ref(false)
const expandedIndices = ref([])
const editandoIndex = ref(null)
const todosAbiertos = ref(false)

// Estructura para el formulario de cada indicador
const formData = ref([])

// Computed para el estado general de registros
const totalRegistrados = computed(() => {
  return formData.value.filter((item) => item.historial.length > 0).length
})

const totalPendientes = computed(() => {
  return formData.value.filter((item) => item.historial.length === 0).length
})

const porcentajeCompletado = computed(() => {
  const total = indicadoresActividad.value.length
  return total > 0 ? Math.round((totalRegistrados.value / total) * 100) : 0
})

const estadoRegistros = computed(() => {
  return {
    registrados: totalRegistrados.value,
    pendientes: totalPendientes.value,
    total: indicadoresActividad.value.length,
    completado: totalRegistrados.value === indicadoresActividad.value.length,
    porcentaje: porcentajeCompletado.value,
    timestamp: new Date().toISOString(),
  }
})

// NUEVA FUNCIÓN: Generar datos en el formato solicitado
const generarDatosParaEnvio = () => {
  const datosEnvio = indicadoresActividad.value.map((indicador, index) => {
    const datosRegistro =
      formData.value[index].historial.length > 0 ? formData.value[index].historial[0] : {}

    return {
      id: indicador.id,
      type: indicador.type,
      tipo_dato: indicador.tipo_dato, // Asumiendo que esto es equivalente a indicador.data.nodoProyecto.tipo
      nodoproyecto: indicador.nodoproyecto, // Asumiendo que esto es equivalente a indicador.data.nodoProyecto
      datosRegistrados: datosRegistro,
    }
  })

  return datosEnvio
}

// NUEVA FUNCIÓN: Enviar todos los registros
const enviarTodosLosRegistros = () => {
  if (totalRegistrados.value === 0) {
    emit('error-registro', {
      tipo: 'envio',
      mensaje: 'No hay registros para enviar',
      timestamp: new Date().toISOString(),
    })
    return
  }

  try {
    const datosParaEnvio = generarDatosParaEnvio()

    console.log('Datos enviados en el formato solicitado:', datosParaEnvio)

    // EMITIR EVENTO CON TODOS LOS REGISTROS
    emit('todos-los-registros-enviados', {
      idActividad: props.idactividad,
      totalRegistros: totalRegistrados.value,
      totalIndicadores: indicadoresActividad.value.length,
      datos: datosParaEnvio,
      timestamp: new Date().toISOString(),
    })

    // Mostrar mensaje de éxito
    infoMsg('Se han enviado ${totalRegistrados.value} registros exitosamente ')
    //alert(`✅ Se han enviado ${totalRegistrados.value} registros exitosamente`)
  } catch (error) {
    emit('error-registro', {
      tipo: 'envio',
      mensaje: 'Error al enviar los registros',
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

// Inicializar formData cuando se cargan los indicadores
watch(
  indicadoresActividad,
  (newIndicadores) => {
    if (newIndicadores) {
      formData.value = newIndicadores.map(() => ({
        valor: '',
        fecha_registro: new Date().toISOString().split('T')[0],
        observaciones: '',
        archivos: [],
        historial: [],
      }))

      // Emitir evento de carga completada
      emit('carga-completada', {
        totalIndicadores: newIndicadores.length,
        idActividad: props.idactividad,
        timestamp: new Date().toISOString(),
      })

      // Emitir estado inicial
      emit('estado-registros', estadoRegistros.value)
    }
  },
  { immediate: true },
)

// Emitir cambios en el estado de registros
watch(
  estadoRegistros,
  (newEstado) => {
    emit('estado-registros', newEstado)
  },
  { deep: true },
)

const cargarInformacion = async () => {
  isLoading.value = true
  try {
    await storeIndicadores.cargarActividad(props.idactividad)
  } catch (err) {
    console.error('Error de carga', err)
    emit('error-registro', {
      tipo: 'carga',
      mensaje: 'Error al cargar los indicadores',
      error: err.message,
      idActividad: props.idactividad,
      timestamp: new Date().toISOString(),
    })
  } finally {
    isLoading.value = false
  }
}

const toggleTodos = () => {
  if (todosAbiertos.value) {
    expandedIndices.value = []
  } else {
    expandedIndices.value = indicadoresActividad.value.map((_, index) => index)
  }
  todosAbiertos.value = !todosAbiertos.value
}

const registrarAvance = (indicador, index) => {
  const data = formData.value[index]

  // Validar que no haya registro previo
  if (data.historial.length > 0) {
    emit('error-registro', {
      tipo: 'duplicado',
      mensaje: 'Ya existe un registro para este indicador',
      indicador: {
        id: indicador.id,
        codigo: indicador.nodoproyecto.codigo,
        type: indicador.type,
      },
      timestamp: new Date().toISOString(),
    })
    return
  }

  try {
    // Validar datos requeridos
    if (!data.valor || !data.fecha_registro) {
      throw new Error('Valor y fecha de registro son requeridos')
    }

    // Crear el único registro
    const nuevoRegistro = {
      valor: data.valor,
      fecha_registro: data.fecha_registro,
      observaciones: data.observaciones,
      archivos: [...data.archivos],
      timestamp: new Date().toISOString(),
    }

    data.historial = [nuevoRegistro]

    // Datos para emitir al padre
    const registroData = {
      indicador: {
        id: indicador.id,
        type: indicador.type,
        tipo_dato: indicador.tipo_dato,
        codigo: indicador.nodoproyecto.codigo,
        descripcion: indicador.nodoproyecto.descripcion,
      },
      registro: nuevoRegistro,
      index: index,
      estadoActual: estadoRegistros.value,
      timestamp: new Date().toISOString(),
    }

    // EMITIR EVENTO AL PADRE
    emit('avance-registrado', registroData)

    // Verificar si todos están completos
    if (estadoRegistros.value.completado) {
      emit('registro-completado', {
        mensaje: 'Todos los indicadores han sido registrados',
        totalRegistros: estadoRegistros.value.total,
        timestamp: new Date().toISOString(),
      })
    }

    console.log('Avance registrado:', registroData)
  } catch (error) {
    emit('error-registro', {
      tipo: 'validacion',
      mensaje: error.message,
      indicador: {
        id: indicador.id,
        codigo: indicador.nodoproyecto.codigo,
      },
      timestamp: new Date().toISOString(),
    })
  } finally {
    limpiarFormulario(index)
  }
}

// Funciones para edición
const editarRegistro = (index) => {
  if (formData.value[index].historial.length > 0) {
    const registro = formData.value[index].historial[0]
    // Cargar datos del registro en el formulario
    formData.value[index].valor = registro.valor
    formData.value[index].fecha_registro = registro.fecha_registro
    formData.value[index].observaciones = registro.observaciones
    formData.value[index].archivos = [...registro.archivos]
    editandoIndex.value = index

    // Emitir evento de inicio de edición
    emit('indicador-editando', {
      indicador: indicadoresActividad.value[index],
      index: index,
      timestamp: new Date().toISOString(),
    })
  }
}

const guardarEdicion = (indicador, index) => {
  const data = formData.value[index]

  try {
    // Validar datos requeridos
    if (!data.valor || !data.fecha_registro) {
      throw new Error('Valor y fecha de registro son requeridos')
    }

    // Actualizar el registro existente
    const registroActualizado = {
      valor: data.valor,
      fecha_registro: data.fecha_registro,
      observaciones: data.observaciones,
      archivos: [...data.archivos],
      timestamp: new Date().toISOString(),
    }

    data.historial[0] = registroActualizado

    // Datos para emitir al padre
    const edicionData = {
      indicador: {
        id: indicador.id,
        codigo: indicador.nodoproyecto.codigo,
        type: indicador.type,
      },
      registro: registroActualizado,
      index: index,
      estadoActual: estadoRegistros.value,
      timestamp: new Date().toISOString(),
    }

    // EMITIR EVENTO DE EDICIÓN
    emit('edicion-completada', edicionData)

    console.log('Registro actualizado:', edicionData)
  } catch (error) {
    emit('error-registro', {
      tipo: 'edicion',
      mensaje: error.message,
      indicador: {
        id: indicador.id,
        codigo: indicador.nodoproyecto.codigo,
      },
      timestamp: new Date().toISOString(),
    })
  } finally {
    editandoIndex.value = null
    limpiarFormulario(index)
  }
}

const eliminarRegistro = (indicador, index) => {
  if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
    const registroEliminado = formData.value[index].historial[0]
    formData.value[index].historial = []

    // Emitir evento de eliminación
    emit('registro-eliminado', {
      indicador: {
        id: indicador.id,
        codigo: indicador.nodoproyecto.codigo,
      },
      registro: registroEliminado,
      index: index,
      estadoActual: estadoRegistros.value,
      timestamp: new Date().toISOString(),
    })

    limpiarFormulario(index)
  }
}

const cancelarEdicion = (index) => {
  emit('indicador-cancelar-edicion', {
    indicador: indicadoresActividad.value[index],
    index: index,
    timestamp: new Date().toISOString(),
  })
  editandoIndex.value = null
  limpiarFormulario(index)
}

const limpiarFormulario = (index) => {
  // No limpiar el historial, solo los campos del formulario
  formData.value[index].valor = ''
  formData.value[index].fecha_registro = new Date().toISOString().split('T')[0]
  formData.value[index].observaciones = ''
  formData.value[index].archivos = []
}

// Función para obtener todos los datos (útil para el padre)
const obtenerDatosCompletos = () => {
  return {
    idActividad: props.idactividad,
    registros: formData.value.map((data, index) => ({
      indicador: indicadoresActividad.value[index],
      registro: data.historial.length > 0 ? data.historial[0] : null,
      tieneRegistro: data.historial.length > 0,
    })),
    estado: estadoRegistros.value,
    timestamp: new Date().toISOString(),
  }
}

// Exponer función al padre
defineExpose({
  obtenerDatosCompletos,
  estadoRegistros,
  recargarDatos: cargarInformacion,
  forzarCierreEdicion: () => {
    editandoIndex.value = null
  },
  generarDatosParaEnvio, // Exponer la nueva función
  enviarTodosLosRegistros, // Exponer la nueva función
})

// Métodos auxiliares
const getTipoLabel = (type) => {
  const tipos = {
    indicadorog: 'Indicador Objetivo General',
    indicadoroe: 'Indicador Objetivo Específico',
    indicadorrog: 'Indicador Resultado OG',
    indicadorroe: 'Indicador Resultado OE',
  }
  return tipos[type] || type
}

const getTipoColor = (type) => {
  const colores = {
    indicadorog: 'primary',
    indicadoroe: 'secondary',
    indicadorrog: 'success',
    indicadorroe: 'info',
  }
  return colores[type] || 'grey'
}

const getTipoDatoLabel = (tipoDato) => {
  const tipos = {
    '1-9': 'Numérico',
    'A-Z': 'Texto',
    '%': 'Porcentaje',
  }
  return tipos[tipoDato] || tipoDato
}

const getTipoDatoColor = (tipoDato) => {
  const colores = {
    '1-9': 'deep-purple',
    'A-Z': 'orange',
    '%': 'teal',
  }
  return colores[tipoDato] || 'grey'
}

const getPlaceholder = (tipoDato) => {
  const placeholders = {
    '1-9': 'Ingrese un valor numérico',
    'A-Z': 'Describa el avance del indicador...',
    '%': 'Ingrese el porcentaje',
  }
  return placeholders[tipoDato] || 'Ingrese el valor'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES')
}

onMounted(() => {
  if (props.idactividad) {
    cargarInformacion()
  }
})
</script>

<style scoped>
.con-registro {
  border-left: 4px solid #4caf50 !important;
}

.codigo {
  font-size: 1.1rem;
  color: #1976d2;
}

.info-title,
.form-title {
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.registro-existente {
  border-left: 4px solid #4caf50;
  background: #f8fff9;
}

.valor-destacado {
  font-size: 1.2rem;
  font-weight: bold;
  color: #4caf50;
}

.observaciones-text {
  background: white;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.gap-2 {
  gap: 8px;
}

/* Estilos para el nuevo botón */
.enviar-todos-btn {
  transition: all 0.3s ease;
}

.enviar-todos-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
