<template>
  <v-dialog
    :model-value="props.visible"
    @update:modelValue="cerrarModal"
    max-width="1200"
    persistent
    scrollable
  >
    <v-card>
      <v-card-title class="headline bg-primary d-flex justify-space-between align-center">
        <span>Detalles del Informe de Actividad</span>
        <v-btn icon @click="cerrarModal" variant="text" class="float-right">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-0">
        <!-- Loading State -->
        <div v-if="informeStore.loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="mt-4">Cargando detalles del informe...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="informeStore.error" class="text-center py-8 error-state">
          <v-icon color="error" size="64">mdi-alert-circle-outline</v-icon>
          <h3 class="mt-4">Error al cargar el informe</h3>
          <p class="mb-4">{{ informeStore.error }}</p>
          <v-btn color="primary" @click="recargarDatos">Reintentar</v-btn>
        </div>

        <!-- Contenido del informe -->
        <div v-else-if="informeSeleccionado" class="informe-content pa-6">
          <!-- Acciones de exportación -->
          <div class="d-flex justify-end mb-6 acciones-exportacion">
            <v-btn color="blue-darken-2" @click="exportarWord" :disabled="exportando">
              <v-icon start>mdi-microsoft-word</v-icon>
              Exportar Word
            </v-btn>
            <v-btn color="red-darken-2" @click="exportarPDF" :disabled="exportando" class="ml-2">
              <v-icon start>mdi-file-pdf-box</v-icon>
              Exportar PDF
            </v-btn>
          </div>

          <!-- Información General -->
          <v-card class="mb-4">
            <v-card-title class="bg-blue-lighten-5">
              <v-icon start>mdi-information</v-icon>
              Información General
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-list-item>
                    <v-list-item-title class="font-weight-bold"
                      >Número de Informe</v-list-item-title
                    >
                    <v-list-item-subtitle class="text-primary text-h6">
                      {{ informeSeleccionado.numeroInforme }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-list-item>
                    <v-list-item-title class="font-weight-bold"
                      >Fecha de Ejecución</v-list-item-title
                    >
                    <v-list-item-subtitle>
                      {{ formatoFecha(informeSeleccionado.fecha_ejecucion) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-list-item>
                    <v-list-item-title class="font-weight-bold"
                      >Tipo de Actividad</v-list-item-title
                    >
                    <v-list-item-subtitle>
                      {{ informeSeleccionado.tipo_actividad }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-list-item>
                    <v-list-item-title class="font-weight-bold">Reporte Tipo</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ informeSeleccionado.reporte_tipo }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Contribución al Proyecto -->
          <v-card v-if="informeSeleccionado.contribucion_proyecto" class="mb-4">
            <v-card-title class="bg-green-lighten-5">
              <v-icon start>mdi-target</v-icon>
              Contribución al Proyecto
            </v-card-title>
            <v-card-text>
              <!-- Objetivo General -->
              <div
                v-if="informeSeleccionado.contribucion_proyecto.caberaContribucion?.objetivogeneral"
                class="mb-4"
              >
                <h4 class="text-h6 mb-2">Objetivo General</h4>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Descripción"
                      :model-value="
                        informeSeleccionado.contribucion_proyecto.caberaContribucion.objetivogeneral
                          .data.descripcion
                      "
                      readonly
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Contribución"
                      :model-value="
                        informeSeleccionado.contribucion_proyecto.caberaContribucion.objetivogeneral
                          .data.contribucion
                      "
                      readonly
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Supuestos"
                      :model-value="
                        informeSeleccionado.contribucion_proyecto.caberaContribucion.objetivogeneral
                          .data.supuestos
                      "
                      readonly
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      label="Riesgos"
                      :model-value="
                        informeSeleccionado.contribucion_proyecto.caberaContribucion.objetivogeneral
                          .data.riesgos
                      "
                      readonly
                      variant="outlined"
                      auto-grow
                      rows="2"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </div>

              <!-- Objetivo Específico -->
              <div
                v-if="
                  informeSeleccionado.contribucion_proyecto.caberaContribucion?.objetivoespecificoog
                "
              >
                <h4 class="text-h6 mb-2">Objetivo Específico</h4>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Contribución"
                      :model-value="
                        informeSeleccionado.contribucion_proyecto.caberaContribucion
                          .objetivoespecificoog.data.contribucion
                      "
                      readonly
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>

          <!-- Avance de Indicadores -->
          <v-card v-if="informeSeleccionado.avance_indicadores" class="mb-4">
            <v-card-title class="bg-orange-lighten-5">
              <v-icon start>mdi-chart-line</v-icon>
              Avance de Indicadores
              <v-chip class="ml-2" color="orange">
                {{ informeSeleccionado.avance_indicadores.totalRegistros }}/{{
                  informeSeleccionado.avance_indicadores.totalIndicadores
                }}
              </v-chip>
            </v-card-title>
            <v-card-text>
              <v-row
                v-for="indicador in informeSeleccionado.avance_indicadores.datos"
                :key="indicador.id"
                class="mb-4"
              >
                <v-col cols="12">
                  <v-card variant="outlined">
                    <v-card-title class="text-h6">
                      {{ indicador.nodoproyecto.codigo }} - {{ indicador.nodoproyecto.descripcion }}
                      <v-chip color="success" class="ml-2">
                        {{ indicador.datosRegistrados.valor }}{{ indicador.tipo_dato }}
                      </v-chip>
                    </v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            label="Definición"
                            :model-value="indicador.nodoproyecto.definicion"
                            readonly
                            variant="outlined"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            label="Frecuencia"
                            :model-value="indicador.nodoproyecto.frecuencia"
                            readonly
                            variant="outlined"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            label="Línea Base"
                            :model-value="indicador.nodoproyecto.baseline + indicador.tipo_dato"
                            readonly
                            variant="outlined"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            label="Target Q1"
                            :model-value="indicador.nodoproyecto.target_q1 + indicador.tipo_dato"
                            readonly
                            variant="outlined"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            label="Fecha Registro"
                            :model-value="formatoFecha(indicador.datosRegistrados.fecha_registro)"
                            readonly
                            variant="outlined"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            label="Valor Registrado"
                            :model-value="indicador.datosRegistrados.valor + indicador.tipo_dato"
                            readonly
                            variant="outlined"
                            color="success"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" v-if="indicador.datosRegistrados.observaciones">
                          <v-textarea
                            label="Observaciones"
                            :model-value="indicador.datosRegistrados.observaciones"
                            readonly
                            variant="outlined"
                            auto-grow
                            rows="2"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Información Adicional -->
          <v-card class="mb-4">
            <v-card-title class="bg-purple-lighten-5">
              <v-icon start>mdi-text-box</v-icon>
              Información Adicional
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-textarea
                    label="Información Cuantitativa"
                    :model-value="informeSeleccionado.informacion_cuantitativa || 'No especificado'"
                    readonly
                    variant="outlined"
                    auto-grow
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea
                    label="Herramientas de Evaluación"
                    :model-value="informeSeleccionado.herramientas_evaluacion || 'No especificado'"
                    readonly
                    variant="outlined"
                    auto-grow
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea
                    label="Medios de Verificación"
                    :model-value="informeSeleccionado.medios_verificacion || 'No especificado'"
                    readonly
                    variant="outlined"
                    auto-grow
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea
                    label="Comentarios y Recomendaciones"
                    :model-value="
                      informeSeleccionado.comentarios_recomendaciones || 'No especificado'
                    "
                    readonly
                    variant="outlined"
                    auto-grow
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Presupuesto -->
          <v-card class="mb-4">
            <v-card-title class="bg-amber-lighten-5">
              <v-icon start>mdi-cash</v-icon>
              Información Presupuestaria
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Presupuesto Planificado"
                    :model-value="
                      'Bs. ' + formatoMonto(informeSeleccionado.presupuesto_planificado)
                    "
                    readonly
                    variant="outlined"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Presupuesto Ejecutado"
                    :model-value="'Bs. ' + formatoMonto(informeSeleccionado.presupuesto_ejecutado)"
                    readonly
                    variant="outlined"
                    color="green"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Diferencia"
                    :model-value="'Bs. ' + formatoMonto(diferenciaPresupuesto)"
                    readonly
                    variant="outlined"
                    :color="diferenciaPresupuesto >= 0 ? 'red' : 'green'"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Procedencia de Fondos -->
              <div v-if="informeSeleccionado.procedencia_fondos?.length" class="mt-4">
                <h4 class="text-h6 mb-3">Procedencia de Fondos</h4>
                <v-table>
                  <thead>
                    <tr>
                      <th>Fuente</th>
                      <th>Monto Planificado</th>
                      <th>Monto Ejecutado</th>
                      <th>Diferencia</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="fondo in informeSeleccionado.procedencia_fondos" :key="fondo.id">
                      <td>{{ fondo.nombre }}</td>
                      <td>Bs. {{ formatoMonto(fondo.monto) }}</td>
                      <td>Bs. {{ formatoMonto(fondo.montoEjecutado) }}</td>
                      <td :class="getClaseDiferenciaFondo(fondo)">
                        Bs. {{ formatoMonto(fondo.monto - fondo.montoEjecutado) }}
                      </td>
                      <td>
                        <v-chip :color="fondo.verificado ? 'success' : 'warning'" size="small">
                          {{ fondo.verificado ? 'Verificado' : 'Pendiente' }}
                        </v-chip>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>

              <v-textarea
                v-if="informeSeleccionado.observaciones_presupuesto"
                label="Observaciones del Presupuesto"
                :model-value="informeSeleccionado.observaciones_presupuesto"
                readonly
                variant="outlined"
                class="mt-4"
                auto-grow
                rows="2"
              ></v-textarea>
            </v-card-text>
          </v-card>

          <!-- Objetivo de la Actividad -->
          <v-card>
            <v-card-title class="bg-indigo-lighten-5">
              <v-icon start>mdi-bullseye</v-icon>
              Objetivo de la Actividad
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-textarea
                    label="Objetivo"
                    :model-value="informeSeleccionado.objetivo_actividad || 'No especificado'"
                    readonly
                    variant="outlined"
                    auto-grow
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea
                    label="Informe del Objetivo"
                    :model-value="
                      informeSeleccionado.informe_objetivo_actividad || 'No especificado'
                    "
                    readonly
                    variant="outlined"
                    auto-grow
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- Sin datos -->
        <div v-else class="text-center py-8">
          <v-icon size="64" color="grey">mdi-file-document-outline</v-icon>
          <h3 class="mt-4">No se encontró el informe</h3>
          <p>El informe con ID {{ props.informeId }} no está disponible</p>
          <v-btn color="primary" @click="recargarDatos" class="mt-2">Recargar Datos</v-btn>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red-darken-1" variant="text" @click="cerrarModal"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue'
import { useInformeActividadStore } from '../../store/useInformeActividadStore'
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableCell,
  TableRow,
  WidthType,
  BorderStyle,
  Packer,
} from 'docx'
import { saveAs } from 'file-saver'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  informeId: {
    type: Number,
    default: null,
  },
})

// Emits
const emit = defineEmits(['update:visible', 'cerrar', 'recargarDatos'])

// Store
const informeStore = useInformeActividadStore()
const exportando = ref(false)

// Computed
const informeSeleccionado = computed(() => {
  if (!props.informeId) return null
  return informeStore.buscarInformeActividadPorId(props.informeId)
})

const diferenciaPresupuesto = computed(() => {
  if (!informeSeleccionado.value) return 0
  const planificado = parseFloat(informeSeleccionado.value.presupuesto_planificado) || 0
  const ejecutado = parseFloat(informeSeleccionado.value.presupuesto_ejecutado) || 0
  return planificado - ejecutado
})

// Métodos
const formatoFecha = (fecha) => {
  if (!fecha) return 'N/A'
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatoMonto = (monto) => {
  if (!monto) return '0.00'
  return parseFloat(monto).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const getClaseDiferenciaFondo = (fondo) => {
  const diferencia = fondo.monto - fondo.montoEjecutado
  return diferencia > 0 ? 'text-red' : diferencia < 0 ? 'text-green' : ''
}

const cerrarModal = () => {
  emit('update:visible', false)
  emit('cerrar')
}

const recargarDatos = () => {
  emit('recargarDatos')
}

// Exportación a Word
const exportarWord = async () => {
  if (!informeSeleccionado.value) return

  try {
    exportando.value = true

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `INFORME: ${informeSeleccionado.value.numeroInforme}`,
                  bold: true,
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            // ... más contenido para el documento Word
          ],
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `informe-${informeSeleccionado.value.numeroInforme}.docx`)
  } catch (err) {
    console.error('Error exportando Word:', err)
    // Puedes usar un snackbar de Vuetify aquí
  } finally {
    exportando.value = false
  }
}

const exportarPDF = async () => {
  if (!informeSeleccionado.value) return
  exportando.value = true
  // Implementación de PDF...
  setTimeout(() => {
    exportando.value = false
    alert('Funcionalidad PDF en desarrollo')
  }, 1000)
}

// Watch para cambios en el ID
watch(
  () => props.informeId,
  (newId) => {
    if (props.visible && newId !== null) {
      console.log(`Cargando detalles del informe ID: ${newId}`)
      console.log('Informe encontrado:', informeSeleccionado.value)
    }
  },
  { immediate: true },
)

// Watch para debug
watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible) {
      console.log('Modal abierto - Estado:')
      console.log('- ID:', props.informeId)
      console.log('- Informe encontrado:', !!informeSeleccionado.value)
      console.log('- Estadísticas store:', informeStore.obtenerEstadisticasInformes())
    }
  },
)
</script>

<style scoped>
.acciones-exportacion {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}

.error-state {
  background-color: #ffebee;
  border-radius: 8px;
}

.text-red {
  color: #f44336;
  font-weight: bold;
}

.text-green {
  color: #4caf50;
  font-weight: bold;
}

.informe-content {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
