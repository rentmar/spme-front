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
                    <v-list-item-title>{{ indicadorSeleccionado.definicion }}</v-list-item-title>
                    <v-list-item-subtitle>Definicion del Indicador</v-list-item-subtitle>
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
                    <v-list-item-title>{{ indicadorSeleccionado.tipo }}</v-list-item-title>
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
              <!-- Formulario de registro -->
              <v-col cols="12" md="6">
                <v-card v-if="!indicadorYaRegistrado" variant="outlined">
                  <v-card-title class="bg-blue-lighten-5">Nuevo Registro</v-card-title>
                  <v-card-text class="pa-4">
                    <v-form ref="formAvance" v-model="formValido">
                      <v-text-field
                        v-if="indicadorSeleccionado.tipo !== 'A-Z'"
                        v-model="nuevoAvance.valor"
                        :label="`Valor de avance (${unidadMedida})`"
                        variant="outlined"
                        type="number"
                        :rules="[reglaRequerido, reglaValorPositivo]"
                        class="mb-3"
                      ></v-text-field>

                      <v-textarea
                        v-model="nuevoAvance.observaciones"
                        label="Observaciones"
                        variant="outlined"
                        rows="3"
                        :rules="[reglaRequerido]"
                        class="mb-3"
                      ></v-textarea>

                      <v-menu
                        v-model="menuFecha"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-model="nuevoAvance.fecha"
                            label="Fecha de registro"
                            prepend-inner-icon="mdi-calendar"
                            readonly
                            variant="outlined"
                            v-bind="props"
                            :rules="[reglaRequerido]"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="nuevoAvance.fecha"
                          no-title
                          scrollable
                          @update:model-value="menuFecha = false"
                        ></v-date-picker>
                      </v-menu>

                      <v-btn
                        color="primary"
                        variant="flat"
                        class="mt-4"
                        @click="agregarAvance"
                        :disabled="!formValido"
                        block
                      >
                        Agregar Avance
                      </v-btn>
                    </v-form>
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

              <!-- Bitácora del indicador -->
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title class="bg-blue-lighten-5">Historial de Avances</v-card-title>
                  <v-card-text class="pa-0">
                    <v-list lines="three" v-if="bitacoraIndicador.length > 0">
                      <v-list-item
                        v-for="(registro, index) in bitacoraIndicador"
                        :key="index"
                        :class="{ 'bg-blue-lighten-5': index % 2 === 0 }"
                      >
                        <template v-slot:prepend>
                          <v-avatar color="primary" size="40">
                            <span class="white--text"
                              >{{ registro.valor
                              }}{{ unidadMedida === 'Porcentaje' ? '%' : '' }}</span
                            >
                          </v-avatar>
                        </template>

                        <v-list-item-title class="font-weight-medium">
                          {{ formatFecha(registro.fecha) }}
                        </v-list-item-title>

                        <v-list-item-subtitle>
                          {{ registro.observaciones }}
                        </v-list-item-subtitle>

                        <v-list-item-subtitle class="text-caption text-medium-emphasis">
                          Registrado por: {{ registro.usuario }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>

                    <div v-else class="text-center py-8 text-medium-emphasis">
                      <v-icon size="64" class="mb-2">mdi-history</v-icon>
                      <p>No hay registros previos para este indicador.</p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Gráfica de avance -->
        <div v-if="indicadorSeleccionado.tipo !== 'A-Z'">
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
              <div class="text-caption text-medium-emphasis mt-2"></div>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>

      <!-- Footer con acciones -->
      <v-divider></v-divider>
      <v-card-actions class="bg-grey-lighten-4 pa-3">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
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
              <td>{{ obtenerNombreIndicador(avance.indicadorId) }}</td>
              <td>{{ avance.valor }}{{ avance.unidadMedida === 'Porcentaje' ? '%' : '' }}</td>
              <td>{{ formatFecha(avance.fecha) }}</td>
              <td>{{ avance.observaciones }}</td>
            </tr>
          </tbody>
        </v-table>

        <v-alert type="info" variant="tonal" class="mt-4">
          Los datos se enviarán al sistema y no podrán modificarse posteriormente.
        </v-alert>

        <div class="mt-4">
          <h4 class="text-h6 mb-2">Estructura del payload que se enviará:</h4>
          <pre class="pa-3 bg-grey-lighten-4 rounded">{{
            JSON.stringify(prepararPayload(), null, 2)
          }}</pre>
        </div>
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

// Formulario de nuevo avance
const formAvance = ref(null)
const formValido = ref(false)
const menuFecha = ref(false)
const nuevoAvance = ref({
  valor: '',
  observaciones: '',
  fecha: new Date().toISOString().substr(0, 10),
})

// Avances registrados durante la sesión
const avancesRegistrados = ref([])

// Computed properties
const indicadoresParaSelect = computed(() => {
  return storeIndicadores.getIndicadoresForSelect()
})

const unidadMedida = computed(() => {
  if (!indicadorSeleccionado.value) return ''
  return indicadorSeleccionado.value.tipo === 'Porcentual' ? 'Porcentaje' : 'Unidades'
})

// Datos de ejemplo para las bitácoras
const datosBitacora = {
  1: [
    {
      valor: 25,
      observaciones: 'Avance inicial del primer trimestre',
      fecha: '2023-01-15',
      usuario: 'Ana García',
    },
    {
      valor: 50,
      observaciones: 'Avance del segundo trimestre según lo planificado',
      fecha: '2023-03-20',
      usuario: 'Ana García',
    },
    {
      valor: 75,
      observaciones: 'Tercer trimestre con buen progreso',
      fecha: '2023-05-20',
      usuario: 'Ana García',
    },
  ],
  2: [
    {
      valor: 100,
      observaciones: 'Primera producción del mes',
      fecha: '2023-04-05',
      usuario: 'Carlos López',
    },
    {
      valor: 220,
      observaciones: 'Aumento de producción después de optimización',
      fecha: '2023-04-28',
      usuario: 'Carlos López',
    },
    {
      valor: 320,
      observaciones: 'Meta parcial alcanzada antes de lo previsto',
      fecha: '2023-05-18',
      usuario: 'Carlos López',
    },
  ],
  3: [
    {
      valor: 25,
      observaciones: 'Tiempo inicial de atención',
      fecha: '2023-03-10',
      usuario: 'María Rodríguez',
    },
    {
      valor: 20,
      observaciones: 'Mejora después de capacitación',
      fecha: '2023-04-15',
      usuario: 'María Rodríguez',
    },
    {
      valor: 18,
      observaciones: 'Reducción adicional con nuevo proceso',
      fecha: '2023-05-19',
      usuario: 'María Rodríguez',
    },
  ],
}

// Reglas de validación
const reglaRequerido = (value) => !!value || 'Campo requerido'
const reglaValorPositivo = (value) => value > 0 || 'El valor debe ser positivo'

// Observador para sincronizar el estado interno con la prop
watch(
  () => props.modelValue,
  (newVal) => {
    internalDialog.value = newVal
    if (newVal) {
      // Reiniciar estado al abrir el diálogo
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
    valor: '',
    observaciones: '',
    fecha: new Date().toISOString().substr(0, 10),
  }
}

/**
 * Carga los datos del indicador seleccionado
 */
const cargarDatosIndicador = (indicadorId) => {
  // Cargar bitácora del indicador
  cargarBitacoraIndicador(indicadorId)

  // Verificar si ya se registró un avance para este indicador
  indicadorYaRegistrado.value = avancesRegistrados.value.some((a) => a.indicadorId === indicadorId)
}

/**
 * Carga la bitácora del indicador
 */
const cargarBitacoraIndicador = async (indicadorId) => {
  // Simular una llamada a API con timeout
  setTimeout(() => {
    bitacoraIndicador.value = datosBitacora[indicadorId] || []

    // Preparar datos para la gráfica incluyendo el baseline
    prepararDatosGrafica()

    // Si hay datos, crear la gráfica
    if (datosGrafica.labels.length > 0) {
      nextTick(() => {
        crearGraficaAvance()
      })
    }
  }, 300)
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
    datosGrafica.valores.push(indicadorSeleccionado.value.baseline)
  }

  // Agregar datos de la bitácora
  bitacoraIndicador.value.forEach((registro) => {
    datosGrafica.labels.push(formatFechaCorta(registro.fecha))
    datosGrafica.valores.push(registro.valor)
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
            text: `Valor (${unidadMedida.value})`,
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
            label: function (context) {
              return `Valor: ${context.raw}${unidadMedida.value === 'Porcentaje' ? '%' : ''}`
            },
          },
        },
      },
    },
  })
}

/**
 * Agrega un nuevo avance al indicador
 */
const agregarAvance = async () => {
  if (!formValido.value) return

  const avance = {
    indicadorId: indicadorSeleccionado.value.id,
    valor: parseFloat(nuevoAvance.value.valor),
    observaciones: nuevoAvance.value.observaciones,
    fecha: nuevoAvance.value.fecha,
    unidadMedida: unidadMedida.value,
    usuario: 'Usuario Actual',
  }

  // Agregar a la lista de avances registrados
  avancesRegistrados.value.push(avance)

  // Actualizar la bitácora localmente
  bitacoraIndicador.value.push({
    valor: avance.valor,
    observaciones: avance.observaciones,
    fecha: avance.fecha,
    usuario: avance.usuario,
  })

  // Marcar como ya registrado
  indicadorYaRegistrado.value = true

  // Reiniciar formulario
  nuevoAvance.value = {
    valor: '',
    observaciones: '',
    fecha: new Date().toISOString().substr(0, 10),
  }

  // Actualizar datos de la gráfica
  prepararDatosGrafica()

  // Actualizar gráfica
  if (chartInstance) {
    chartInstance.destroy()
  }
  nextTick(() => {
    crearGraficaAvance()
  })
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
      indicador_id: avance.indicadorId,
      valor: avance.valor,
      observaciones: avance.observaciones,
      fecha: avance.fecha,
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
