<template>
  <v-dialog v-if="!isLoading" v-model="internalDialog" persistent fullscreen>
    <v-card class="d-flex flex-column" style="height: 100vh; overflow: hidden">
      <!-- Header -->
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title class="text-white">
          <v-icon icon="mdi-book-edit" class="mr-2"></v-icon>
          Registro de Avance de Actividades
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="mostrarConfirmacionCierre" variant="text" color="white">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Contenido principal con scroll -->
      <v-card-text class="flex-grow-1 pa-0" style="overflow-y: auto">
        <!-- Selector de indicador -->
        <v-card flat class="ma-4">
          <v-card-title class="text-h6 font-weight-medium">Seleccione el indicador</v-card-title>
          <v-card-text>
            <v-select
              v-model="indicadorSeleccionado"
              :items="indicadoresParaSelect"
              item-title="descripcion"
              item-value="id"
              label="Indicador"
              variant="outlined"
              return-object
              @update:model-value="cargarDatosIndicador"
            ></v-select>
          </v-card-text>
        </v-card>

        <!-- Informacion del Indicador Seleccionado-->
        <v-card v-if="indicadorSeleccionado" flat class="ma-4">
          <v-card-title class="text-h6 font-weight-medium">Información del Indicador</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-list lines="two">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-information</v-icon>
                    </template>
                    <v-list-item-title>{{ indicadorSeleccionado.descripcion }}</v-list-item-title>
                    <v-list-item-subtitle>Descripcion del Indicador</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-format-list-numbered</v-icon>
                    </template>
                    <v-list-item-title>{{ indicadorSeleccionado.redaccion }}</v-list-item-title>
                    <v-list-item-subtitle>Redaccion</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-format-list-numbered</v-icon>
                    </template>
                    <v-list-item-title class="text-capitalize">
                      {{ indicadorSeleccionado.tipo }}
                    </v-list-item-title>
                    <v-list-item-subtitle>TIPO</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <v-list lines="two">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-target</v-icon>
                    </template>
                    <v-list-item-title>{{
                      indicadorSeleccionado.meta || 'No definida'
                    }}</v-list-item-title>
                    <v-list-item-subtitle>Meta</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-calendar</v-icon>
                    </template>
                    <v-list-item-title>{{
                      indicadorSeleccionado.frecuencia || 'No definida'
                    }}</v-list-item-title>
                    <v-list-item-subtitle>Frecuencia</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-source-repository</v-icon>
                    </template>
                    <v-list-item-title>{{
                      indicadorSeleccionado.fuente_verificacion || 'No definida'
                    }}</v-list-item-title>
                    <v-list-item-subtitle>Fuente de Verificacion</v-list-item-subtitle>
                  </v-list-item>
                  <!-- Baseline -->
                  <v-list-item
                    v-if="
                      indicadorSeleccionado.baseline !== undefined &&
                      indicadorSeleccionado.baseline !== null
                    "
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-chart-line</v-icon>
                    </template>
                    <v-list-item-title>{{ indicadorSeleccionado.baseline }}</v-list-item-title>
                    <v-list-item-subtitle>Valor inicial (Baseline)</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Formulario y bitácora -->
        <v-card v-if="indicadorSeleccionado" flat class="ma-4">
          <v-card-title class="text-h6 font-weight-medium">Registro de Avance</v-card-title>
          <v-card-text>
            <v-row>
              <!-- Formulario de registro según tipo de indicador -->
              <v-col cols="12" md="6">
                <v-card v-if="!indicadorYaRegistrado" variant="outlined">
                  <v-card-title class="bg-blue-lighten-5">
                    Nuevo Registro - {{ tipoIndicadorTexto }}
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <!-- Formulario para indicador Porcentual -->
                    <FormularioPorcentual
                      v-if="indicadorSeleccionado.tipo === 'Porcentual'"
                      v-model="nuevoAvance"
                      @validacion="formPorcentualValido = $event"
                    />

                    <!-- Formulario para indicador Numérico -->
                    <FormularioNumerico
                      v-else-if="indicadorSeleccionado.tipo === 'Numérico'"
                      v-model="nuevoAvance"
                      @validacion="formNumericoValido = $event"
                    />

                    <!-- Formulario para indicador Literal -->
                    <FormularioLiteral
                      v-else-if="indicadorSeleccionado.tipo === 'Literal'"
                      v-model="nuevoAvance"
                      @validacion="formLiteralValido = $event"
                    />

                    <!-- Botón de agregar avance -->
                    <v-btn
                      color="primary"
                      variant="flat"
                      class="mt-4"
                      @click="agregarAvance"
                      :disabled="!formularioValido"
                      block
                    >
                      Agregar Avance
                    </v-btn>
                  </v-card-text>
                </v-card>

                <!-- Mensaje de avance registrado -->
                <v-card v-else variant="outlined" color="green-lighten-5">
                  <v-card-text class="text-center py-8">
                    <v-icon color="green" size="64" class="mb-4">mdi-check-circle</v-icon>
                    <h3 class="text-h5 font-weight-medium green--text text-darken-2 mb-2">
                      AVANCE REGISTRADO
                    </h3>
                    <p class="text-body-1">Este indicador ya cuenta con un registro de avance.</p>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Componente independiente de historial -->
              <v-col cols="12" md="6">
                <HistorialAvance
                  :indicador-id="indicadorSeleccionado.id"
                  :tipo-indicador="indicadorSeleccionado.tipo"
                  @datos-cargados="onDatosHistorialCargados"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Gráfica de avance -->
        <v-card
          v-if="indicadorSeleccionado && datosGrafica.labels.length > 0"
          flat
          class="ma-4 mb-8"
        >
          <v-card-title class="text-h6 font-weight-medium">Evolución del Avance</v-card-title>
          <v-card-text>
            <div style="height: 300px">
              <canvas ref="graficaAvance"></canvas>
            </div>
            <div class="text-caption text-medium-emphasis mt-2">
              * La gráfica incluye el valor baseline inicial y muestra la evolución del indicador a
              lo largo del tiempo.
            </div>
          </v-card-text>
        </v-card>
      </v-card-text>

      <!-- Footer con acciones -->
      <v-divider></v-divider>
      <v-card-actions class="bg-grey-lighten-4 pa-3">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          error
          variant="outlined"
          class="rounded-lg font-weight-medium mr-2"
          @click="mostrarConfirmacionCierre"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="rounded-lg font-weight-medium"
          @click="mostrarResumenGuardado"
          :disabled="avancesRegistrados.length === 0"
        >
          Guardar y Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal de resumen antes de guardar -->
  <v-dialog v-model="resumenDialog" max-width="800">
    <v-card>
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title class="text-white">
          <v-icon icon="mdi-clipboard-check" class="mr-2"></v-icon>
          Resumen de Avances
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pa-4">
        <p class="text-body-1 mb-4">Se registrarán los siguientes avances:</p>

        <v-table density="compact" class="elevation-1">
          <thead>
            <tr>
              <th>Indicador</th>
              <th>Valor</th>
              <th>Fecha</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(avance, index) in avancesRegistrados" :key="index">
              <td>{{ obtenerNombreIndicador(avance.idIndicador) }}</td>
              <td>{{ formatearValorAvance(avance) }}</td>
              <td>{{ formatFecha(avance.fechaBitacora) }}</td>
              <td>{{ avance.reporteEscrito }}</td>
            </tr>
          </tbody>
        </v-table>

        <v-alert type="info" variant="tonal" class="mt-4">
          Los datos se enviarán al sistema y no podrán modificarse posteriormente.
        </v-alert>
      </v-card-text>

      <v-card-actions class="justify-end pa-4">
        <v-btn color="grey-darken-1" variant="outlined" class="mr-2" @click="resumenDialog = false">
          Revisar
        </v-btn>
        <v-btn color="primary" variant="flat" @click="confirmarGuardado">
          Confirmar y Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal de confirmación para el cierre -->
  <v-dialog v-model="confirmarCierreDialog" max-width="420">
    <v-card>
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title class="text-white">
          <v-icon icon="mdi-alert-circle-outline" class="mr-2"></v-icon>
          Confirmar Cierre
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="py-4 text-body-1">
        ¿Estás seguro de que quieres cerrar sin guardar los cambios? Se perderán todos los avances
        registrados.
      </v-card-text>
      <v-card-actions class="justify-end pa-3">
        <v-btn
          color="grey-darken-1"
          variant="outlined"
          class="rounded-lg mr-2"
          @click="confirmarCierreDialog = false"
        >
          No, Continuar
        </v-btn>
        <v-btn color="primary" variant="flat" class="rounded-lg" @click="cerrarSinGuardar">
          Sí, Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, computed, reactive } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useIndicadoresStore } from '../stores/useIndicadoresStore'
import { useReportes } from '../composables/useReportes'
import { useSnackbar } from '@/composables/useSnackbar'
import HistorialAvance from './partials-indicador-registro/HistorialAvance.vue'
import FormularioPorcentual from './partials-indicador-registro/FormularioPorcentual.vue'
import FormularioNumerico from './partials-indicador-registro/FormularioNumerico.vue'
import FormularioLiteral from './partials-indicador-registro/FormularioLiteral.vue'

// Registrar componentes de Chart.js
Chart.register(...registerables)

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

//Definiendo los emits
const emit = defineEmits(['update:modelValue', 'guardarAvances'])

//Iniciar el store
const storeIndicadores = useIndicadoresStore()

//Iniciar  composables
const { trazabitacora, registrarIndicadorBitacora } = useReportes()
const { successMsg, errorMsg, infoMsg } = useSnackbar()

// Estado interno del modal principal
const internalDialog = ref(props.modelValue)

// Estados para los diálogos de confirmación
const confirmarCierreDialog = ref(false)
const resumenDialog = ref(false)

// Referencia para el gráfico
const graficaAvance = ref(null)
let chartInstance = null

// Datos del indicador seleccionado
const indicadorSeleccionado = ref(null)
const bitacoraIndicador = ref([])
const indicadorYaRegistrado = ref(false)

// Datos para la gráfica
const datosGrafica = reactive({
  labels: [],
  valores: [],
})

// Referencias a los formularios
const formPorcentualValido = ref(false)
const formNumericoValido = ref(false)
const formLiteralValido = ref(false)

// Datos del nuevo avance
const nuevoAvance = ref({
  valorPorcentual: 0,
  valorNumerico: '',
  valorLiteral: '',
  observaciones: '',
  fecha: new Date().toISOString().substr(0, 10),
})

// Avances registrados durante la sesión
const avancesRegistrados = ref([])

// Computed properties
const indicadoresParaSelect = computed(() => {
  return storeIndicadores.getIndicadoresForSelect()
})

const tipoIndicadorTexto = computed(() => {
  if (!indicadorSeleccionado.value) return ''
  const tipos = {
    Porcentual: 'Porcentual (%)',
    Numérico: 'Numérico (0-9)',
    Literal: 'Literal (A-Z)',
  }
  return tipos[indicadorSeleccionado.value.tipo] || indicadorSeleccionado.value.tipo
})

const formularioValido = computed(() => {
  switch (indicadorSeleccionado.value?.tipo) {
    case 'Porcentual':
      return formPorcentualValido.value
    case 'Numérico':
      return formNumericoValido.value
    case 'Literal':
      return formLiteralValido.value
    default:
      return false
  }
})

// Observador para sincronizar el estado interno con la prop
watch(
  () => props.modelValue,
  (newVal) => {
    internalDialog.value = newVal
    if (newVal) {
      reiniciarEstado()
    }
  },
)

// Observador para cambios en el indicador seleccionado
watch(indicadorSeleccionado, (newVal) => {
  if (newVal) {
    cargarDatosIndicador(newVal.id)
  } else {
    bitacoraIndicador.value = []
    datosGrafica.labels = []
    datosGrafica.valores = []
  }
})

/**
 * Reinicia el estado del componente
 */
const reiniciarEstado = () => {
  indicadorSeleccionado.value = null
  bitacoraIndicador.value = []
  avancesRegistrados.value = []
  indicadorYaRegistrado.value = false
  datosGrafica.labels = []
  datosGrafica.valores = []
  nuevoAvance.value = {
    valorPorcentual: 0,
    valorNumerico: '',
    valorLiteral: '',
    observaciones: '',
    fecha: new Date().toISOString().substr(0, 10),
  }
  formPorcentualValido.value = false
  formNumericoValido.value = false
  formLiteralValido.value = false
}

/**
 * Carga los datos del indicador seleccionado
 */
const cargarDatosIndicador = (indicadorId) => {
  // Verificar si ya se registró un avance para este indicador en esta sesión
  indicadorYaRegistrado.value = avancesRegistrados.value.some((a) => a.idIndicador === indicadorId)
}

/**
 * Cuando el componente de historial carga datos
 */
const onDatosHistorialCargados = (datos) => {
  bitacoraIndicador.value = datos
  prepararDatosGrafica()

  if (datosGrafica.labels.length > 0) {
    nextTick(() => {
      crearGraficaAvance()
    })
  }
}

/**
 * Prepara los datos para la gráfica incluyendo el baseline
 */
const prepararDatosGrafica = () => {
  datosGrafica.labels = []
  datosGrafica.valores = []

  // Agregar baseline si existe
  if (
    indicadorSeleccionado.value &&
    indicadorSeleccionado.value.baseline !== undefined &&
    indicadorSeleccionado.value.baseline !== null
  ) {
    datosGrafica.labels.push('Línea Base')
    datosGrafica.valores.push(parseFloat(indicadorSeleccionado.value.baseline))
  }

  // Agregar datos de la bitácora
  bitacoraIndicador.value.forEach((registro) => {
    const fecha = registro.fechaBitacora || registro.fecha
    datosGrafica.labels.push(formatFechaCorta(fecha))

    // Manejar diferentes formatos de valor según el tipo de indicador
    let valor = 0
    if (indicadorSeleccionado.value.tipo === 'Porcentual') {
      valor = registro.cantidadAvance ? parseFloat(registro.cantidadAvance) : registro.valor
    } else if (indicadorSeleccionado.value.tipo === 'Numérico') {
      valor = registro.cantidadAvance ? parseFloat(registro.cantidadAvance) : registro.valor
    } else if (indicadorSeleccionado.value.tipo === 'Literal') {
      // Convertir literal a numérico para la gráfica (A=1, B=2, etc.)
      const letra = (registro.cantidadAvance || registro.valor || 'A').charAt(0)
      valor = letra.charCodeAt(0) - 64 // A=1, B=2, etc.
    }

    datosGrafica.valores.push(valor)
  })
}

/**
 * Crea la gráfica de avance del indicador
 */
const crearGraficaAvance = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = graficaAvance.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: datosGrafica.labels,
      datasets: [
        {
          label: 'Evolución del Indicador',
          data: datosGrafica.valores,
          borderColor: '#1976D2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#1976D2',
          pointBorderColor: '#fff',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: getTituloEjeY(),
          },
        },
        x: {
          title: {
            display: true,
            text: 'Período',
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Evolución del Indicador desde Línea Base',
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return getTooltipLabel(context.raw)
            },
          },
        },
      },
    },
  })
}

/**
 * Obtiene el título del eje Y según el tipo de indicador
 */
const getTituloEjeY = () => {
  if (!indicadorSeleccionado.value) return 'Valor'

  switch (indicadorSeleccionado.value.tipo) {
    case 'Porcentual':
      return 'Porcentaje (%)'
    case 'Numérico':
      return 'Valor Numérico'
    case 'Literal':
      return 'Valor (A=1, B=2, ...)'
    default:
      return 'Valor'
  }
}

/**
 * Obtiene la etiqueta del tooltip según el tipo de indicador
 */
const getTooltipLabel = (valor) => {
  if (!indicadorSeleccionado.value) return `Valor: ${valor}`

  switch (indicadorSeleccionado.value.tipo) {
    case 'Porcentual':
      return `Porcentaje: ${valor}%`
    case 'Numérico':
      return `Valor: ${valor}`
    case 'Literal':
      const letra = String.fromCharCode(64 + Math.round(valor)) // 1=A, 2=B, etc.
      return `Valor: ${letra} (${valor})`
    default:
      return `Valor: ${valor}`
  }
}

/**
 * Agrega un nuevo avance al indicador
 */
const agregarAvance = async () => {
  if (!formularioValido.value) return

  let valorFinal = ''

  // Determinar el valor según el tipo de indicador
  switch (indicadorSeleccionado.value.tipo) {
    case 'Porcentual':
      valorFinal = nuevoAvance.value.valorPorcentual.toString()
      break
    case 'Numérico':
      valorFinal = nuevoAvance.value.valorNumerico.toString()
      break
    case 'Literal':
      valorFinal = nuevoAvance.value.valorLiteral.charAt(0) // Solo la letra (A, B, C, etc.)
      break
  }

  // Preparar para la inserción
  const datoBitacora = {
    fechaBitacora: nuevoAvance.value.fecha,
    cantidadAvance: valorFinal,
    reporteEscrito: nuevoAvance.value.observaciones,
    linkSubida: '',
    tipoIndicador: indicadorSeleccionado.value.type,
    idIndicador: indicadorSeleccionado.value.id,
  }

  // Insertar el registro a la bitácora (simulado con datos dummy)
  try {
    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    successMsg('Registro creado exitosamente')

    // Agregar a la lista de avances registrados
    avancesRegistrados.value.push({
      ...datoBitacora,
      id: Date.now(), // ID temporal para la sesión
    })

    // Actualizar la bitácora localmente
    bitacoraIndicador.value.push({
      cantidadAvance: valorFinal,
      reporteEscrito: nuevoAvance.value.observaciones,
      fechaBitacora: nuevoAvance.value.fecha,
      usuario: 'Usuario Actual',
      tipoIndicador: datoBitacora.tipoIndicador,
    })

    // Reiniciar formulario
    nuevoAvance.value = {
      valorPorcentual: 0,
      valorNumerico: '',
      valorLiteral: '',
      observaciones: '',
      fecha: new Date().toISOString().substr(0, 10),
    }

    // Marcar como registrado
    indicadorYaRegistrado.value = true

    // Actualizar datos de la gráfica
    prepararDatosGrafica()
    if (chartInstance) {
      chartInstance.destroy()
    }
    nextTick(() => {
      crearGraficaAvance()
    })
  } catch (err) {
    console.error('Error crear registro', err)
    errorMsg('Error al crear el registro: ' + (err.message || 'Intente nuevamente'))
  }
}

/**
 * Muestra el resumen de avances antes de guardar
 */
const mostrarResumenGuardado = () => {
  resumenDialog.value = true
}

/**
 * Prepara el payload para enviar
 */
const prepararPayload = () => {
  return {
    traza_bitacora: avancesRegistrados.value.map((avance) => ({
      indicador_id: avance.idIndicador,
      tipo_indicador: avance.tipoIndicador,
      valor: avance.cantidadAvance,
      observaciones: avance.reporteEscrito,
      fecha: avance.fechaBitacora,
    })),
  }
}

/**
 * Confirma el guardado y envía los datos
 */
const confirmarGuardado = () => {
  const payload = prepararPayload()

  // Emitir evento con los datos
  emit('guardarAvances', payload)

  // Cerrar diálogos
  resumenDialog.value = false
  internalDialog.value = false
}

/**
 * Muestra el modal de confirmación antes de cerrar
 */
const mostrarConfirmacionCierre = () => {
  if (avancesRegistrados.value.length > 0) {
    confirmarCierreDialog.value = true
  } else {
    cerrarSinGuardar()
  }
}

/**
 * Cierra el modal sin guardar los cambios
 */
const cerrarSinGuardar = () => {
  internalDialog.value = false
  confirmarCierreDialog.value = false
}

/**
 * Formatea una fecha para mostrar
 */
const formatFecha = (fecha) => {
  if (!fecha) return 'No definida'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Formatea una fecha en formato corto para la gráfica
 */
const formatFechaCorta = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  })
}

/**
 * Obtiene el nombre de un indicador por su ID
 */
const obtenerNombreIndicador = (id) => {
  const indicador = indicadoresParaSelect.value.find((i) => i.id === id)
  return indicador ? indicador.descripcion : 'Indicador desconocido'
}

/**
 * Formatea el valor del avance para mostrar en la tabla
 */
const formatearValorAvance = (avance) => {
  if (indicadorSeleccionado.value?.tipo === 'Porcentual') {
    return `${avance.cantidadAvance}%`
  }
  return avance.cantidadAvance
}

/******************** Cargar datos ***************************/

const isLoading = ref(false)

const cargarDatos = async () => {
  isLoading.value = true
  try {
    await storeIndicadores.cargarActividad(props.idactividad)
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (props.idactividad) {
    cargarDatos()
  }
})
</script>

<style scoped>
.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}
</style>
