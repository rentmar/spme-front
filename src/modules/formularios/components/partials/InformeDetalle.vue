<template>
  <v-container class="informe-detalle-container">
    <!-- Header del informe -->
    <div class="informe-header-detalle">
      <div class="informe-titulo-detalle">
        <PaginaTituloIcono
          :titulo="informe.numeroInforme || `Informe #${informe.id}`"
          :icon="'mdi-file-document'"
        ></PaginaTituloIcono>
        <div class="informe-subtitulo">
          <v-chip :color="getCompletitudColor()" size="small">
            {{ getCompletitudTexto() }}
          </v-chip>
          <span class="fecha-informe">
            <v-icon small>mdi-calendar</v-icon>
            {{ formatDate(informe.fechaEjecucion) || 'Sin fecha definida' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Secciones del informe -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-tabs v-model="tab" grow color="primary">
            <v-tab value="basica">
              <v-icon start>mdi-information</v-icon>
              Información Básica
            </v-tab>
            <v-tab value="presupuesto">
              <v-icon start>mdi-cash</v-icon>
              Presupuesto
            </v-tab>
            <v-tab value="contribucion">
              <v-icon start>mdi-chart-timeline</v-icon>
              Contribución
            </v-tab>
            <v-tab value="detalles">
              <v-icon start>mdi-clipboard-text</v-icon>
              Detalles
            </v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <!-- Pestaña: Información Básica -->
            <v-window-item value="basica">
              <v-card-text class="pa-4">
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                    Información General
                  </h3>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        :model-value="informe.tipoActividad || 'No definido'"
                        label="Tipo de Actividad"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        :model-value="formatDate(informe.fechaEjecucion) || 'No definida'"
                        label="Fecha de Ejecución"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        :model-value="informe.objetivoActividad || 'No definido'"
                        label="Objetivo de la Actividad"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        readonly
                        auto-grow
                        rows="2"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" v-if="informe.informeObjetivoActividad">
                      <v-textarea
                        :model-value="informe.informeObjetivoActividad"
                        label="Informe del Objetivo"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        readonly
                        auto-grow
                        rows="3"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" v-if="informe.reporteTipo">
                      <v-textarea
                        :model-value="informe.reporteTipo"
                        label="Reporte de Tipo"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        readonly
                        auto-grow
                        rows="3"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-window-item>

            <!-- Pestaña: Presupuesto -->
            <v-window-item value="presupuesto">
              <v-card-text class="pa-4">
                <div v-if="informe.procedenciaFondos" class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-cash-multiple</v-icon>
                    Presupuesto y Fondos
                  </h3>

                  <!-- Resumen presupuestario -->
                  <div class="presupuesto-resumen mb-6">
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-card variant="outlined" class="text-center py-4">
                          <div class="text-h6 font-weight-bold">
                            {{ formatCurrency(informe.procedenciaFondos.totalPlanificado) }}
                          </div>
                          <div class="text-caption text-grey">Total Planificado</div>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-card
                          variant="outlined"
                          class="text-center py-4"
                          :class="getEjecucionClass()"
                        >
                          <div class="text-h6 font-weight-bold">
                            {{ formatCurrency(informe.procedenciaFondos.totalEjecutado) }}
                          </div>
                          <div class="text-caption text-grey">
                            Total Ejecutado ({{ informe.procedenciaFondos.porcentajeEjecucion }}%)
                          </div>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-card
                          variant="outlined"
                          class="text-center py-4"
                          :class="getDiferenciaClass()"
                        >
                          <div class="text-h6 font-weight-bold">
                            {{ formatCurrency(informe.procedenciaFondos.diferenciaTotal) }}
                          </div>
                          <div class="text-caption text-grey">Diferencia</div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Desglose de fondos -->
                  <div v-if="informe.procedenciaFondos.fondosCompletos?.length">
                    <h4 class="text-h6 mb-4">Desglose por Fuente de Financiamiento</h4>
                    <v-table density="compact" class="fondos-table mb-6">
                      <thead>
                        <tr class="bg-grey-lighten-4">
                          <th class="text-left">Fuente</th>
                          <th class="text-right">Planificado</th>
                          <th class="text-right">Ejecutado</th>
                          <th class="text-right">Diferencia</th>
                          <th class="text-center">% Ejecución</th>
                          <th class="text-center">Verificado</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="fondo in informe.procedenciaFondos.fondosCompletos"
                          :key="fondo.id"
                        >
                          <td>
                            <div class="d-flex align-center">
                              <span class="font-weight-medium">{{ fondo.nombre }}</span>
                              <v-chip
                                v-if="!fondo.esExistente"
                                size="x-small"
                                class="ml-2"
                                color="grey-lighten-2"
                              >
                                Manual
                              </v-chip>
                            </div>
                          </td>
                          <td class="text-right">{{ formatCurrency(fondo.monto) }}</td>
                          <td class="text-right">{{ formatCurrency(fondo.montoEjecutado) }}</td>
                          <td
                            class="text-right"
                            :class="getDiferenciaFondoClass(fondo.monto, fondo.montoEjecutado)"
                          >
                            {{ formatCurrency(fondo.monto - fondo.montoEjecutado) }}
                          </td>
                          <td>
                            <div class="d-flex align-center">
                              <v-progress-linear
                                :model-value="
                                  calcularPorcentajeFondo(fondo.monto, fondo.montoEjecutado)
                                "
                                height="8"
                                :color="getColorPorcentajeFondo(fondo.monto, fondo.montoEjecutado)"
                                rounded
                                class="mr-2"
                              ></v-progress-linear>
                              <span class="text-caption">
                                {{
                                  calcularPorcentajeFondo(
                                    fondo.monto,
                                    fondo.montoEjecutado,
                                  ).toFixed(0)
                                }}%
                              </span>
                            </div>
                          </td>
                          <td class="text-center">
                            <v-icon :color="fondo.verificado ? 'success' : 'error'" size="small">
                              {{ fondo.verificado ? 'mdi-check-circle' : 'mdi-close-circle' }}
                            </v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </div>

                  <!-- Observaciones -->
                  <div v-if="informe.observacionesPresupuesto" class="mt-4">
                    <v-alert type="info" variant="tonal" class="mb-0">
                      <template v-slot:prepend>
                        <v-icon>mdi-information</v-icon>
                      </template>
                      <strong>Observaciones:</strong> {{ informe.observacionesPresupuesto }}
                    </v-alert>
                  </div>
                </div>

                <v-alert v-else type="warning" variant="tonal">
                  No hay información de presupuesto disponible para este informe.
                </v-alert>
              </v-card-text>
            </v-window-item>

            <!-- Pestaña: Contribución -->
            <v-window-item value="contribucion">
              <v-card-text class="pa-4">
                <div v-if="informe.contribucionProyecto" class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-chart-timeline-variant</v-icon>
                    Contribución al Proyecto
                  </h3>

                  <v-row>
                    <v-col
                      v-if="informe.contribucionProyecto.caberaContribucion?.objetivogeneral"
                      cols="12"
                      md="6"
                    >
                      <v-card variant="outlined" class="h-100">
                        <v-card-title class="bg-blue-lighten-5">
                          <v-icon color="primary" class="mr-2">mdi-target</v-icon>
                          Objetivo General
                        </v-card-title>
                        <v-card-text>
                          <div class="mb-2">
                            <span class="font-weight-bold">Código:</span>
                            <v-chip size="small" class="ml-2">
                              {{
                                informe.contribucionProyecto.caberaContribucion.objetivogeneral.data
                                  .codigo
                              }}
                            </v-chip>
                          </div>
                          <div class="mb-2">
                            <span class="font-weight-bold">Descripción:</span>
                            <p class="mt-1 text-body-2">
                              {{
                                informe.contribucionProyecto.caberaContribucion.objetivogeneral.data
                                  .descripcion
                              }}
                            </p>
                          </div>
                          <div
                            v-if="
                              informe.contribucionProyecto.caberaContribucion.objetivogeneral.data
                                .contribucion
                            "
                          >
                            <span class="font-weight-bold">Contribución específica:</span>
                            <p class="mt-1 text-body-2">
                              {{
                                informe.contribucionProyecto.caberaContribucion.objetivogeneral.data
                                  .contribucion
                              }}
                            </p>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col
                      v-if="informe.contribucionProyecto.caberaContribucion?.resultadoog"
                      cols="12"
                      md="6"
                    >
                      <v-card variant="outlined" class="h-100">
                        <v-card-title class="bg-green-lighten-5">
                          <v-icon color="success" class="mr-2">mdi-chart-tree</v-icon>
                          Resultado OG
                        </v-card-title>
                        <v-card-text>
                          <div class="mb-2">
                            <span class="font-weight-bold">Código:</span>
                            <v-chip size="small" class="ml-2">
                              {{
                                informe.contribucionProyecto.caberaContribucion.resultadoog.data
                                  .codigo
                              }}
                            </v-chip>
                          </div>
                          <div class="mb-2">
                            <span class="font-weight-bold">Descripción:</span>
                            <p class="mt-1 text-body-2">
                              {{
                                informe.contribucionProyecto.caberaContribucion.resultadoog.data
                                  .descripcion
                              }}
                            </p>
                          </div>
                          <div
                            v-if="
                              informe.contribucionProyecto.caberaContribucion.resultadoog.data
                                .contribucion
                            "
                          >
                            <span class="font-weight-bold">Contribución específica:</span>
                            <p class="mt-1 text-body-2">
                              {{
                                informe.contribucionProyecto.caberaContribucion.resultadoog.data
                                  .contribucion
                              }}
                            </p>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <v-alert v-else type="warning" variant="tonal">
                  No hay información de contribución al proyecto disponible.
                </v-alert>
              </v-card-text>
            </v-window-item>

            <!-- Pestaña: Detalles -->
            <v-window-item value="detalles">
              <v-card-text class="pa-4">
                <!-- Información Cuantitativa -->
                <div v-if="informe.informacionCuantitativa" class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-chart-bar</v-icon>
                    Información Cuantitativa
                  </h3>
                  <v-table density="compact" class="mb-6">
                    <thead>
                      <tr class="bg-grey-lighten-4">
                        <th class="text-left">Indicador</th>
                        <th class="text-right">Meta</th>
                        <th class="text-right">Logro</th>
                        <th class="text-center">% Avance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in informe.informacionCuantitativa" :key="index">
                        <td>{{ item.indicador }}</td>
                        <td class="text-right">{{ item.meta }}</td>
                        <td class="text-right">{{ item.logro }}</td>
                        <td>
                          <div class="d-flex align-center">
                            <v-progress-linear
                              :model-value="calcularPorcentajeAvance(item.meta, item.logro)"
                              height="8"
                              color="primary"
                              rounded
                              class="mr-2"
                            ></v-progress-linear>
                            <span class="text-caption">
                              {{ calcularPorcentajeAvance(item.meta, item.logro).toFixed(0) }}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>

                <!-- Herramientas de Evaluación -->
                <div v-if="informe.herramientasEvaluacion" class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-toolbox</v-icon>
                    Herramientas Aplicadas
                  </h3>
                  <v-textarea
                    :model-value="informe.herramientasEvaluacion"
                    label="Descripción"
                    variant="outlined"
                    bg-color="blue-lighten-5"
                    readonly
                    auto-grow
                    rows="3"
                  ></v-textarea>
                </div>

                <!-- Medios de Verificación -->
                <div v-if="informe.mediosVerificacion" class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-file-document-check</v-icon>
                    Medios de Verificación
                  </h3>
                  <v-textarea
                    :model-value="informe.mediosVerificacion"
                    label="Descripción"
                    variant="outlined"
                    bg-color="blue-lighten-5"
                    readonly
                    auto-grow
                    rows="3"
                  ></v-textarea>
                </div>

                <!-- Comentarios y Recomendaciones -->
                <div v-if="informe.comentariosRecomendaciones" class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-comment-text-multiple</v-icon>
                    Comentarios y Recomendaciones
                  </h3>
                  <v-textarea
                    :model-value="informe.comentariosRecomendaciones"
                    label="Comentarios"
                    variant="outlined"
                    bg-color="blue-lighten-5"
                    readonly
                    auto-grow
                    rows="3"
                  ></v-textarea>
                </div>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <!-- Footer con metadatos -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-text class="d-flex justify-space-between align-center">
            <div class="d-flex gap-4">
              <div class="metadato-item">
                <v-icon small class="mr-2">mdi-calendar-clock</v-icon>
                <span class="text-caption">Última actualización:</span>
                <span class="text-body-2 font-weight-medium ml-1">
                  {{ formatDateTime(informe.updatedAt) }}
                </span>
              </div>
              <div class="metadato-item">
                <v-icon small class="mr-2">mdi-account</v-icon>
                <span class="text-caption">Creado por:</span>
                <span class="text-body-2 font-weight-medium ml-1">
                  {{ informe.creadoPor || 'Usuario del sistema' }}
                </span>
              </div>
            </div>
            <div>
              <v-btn color="primary" variant="outlined" prepend-icon="mdi-download">
                Exportar
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'

const props = defineProps({
  informe: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const tab = ref('basica')

// Métodos de formato
const formatDate = (dateString) => {
  if (!dateString) return 'No definida'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return 'Fecha inválida'
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'No disponible'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'Fecha inválida'
  }
}

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00'
  const numAmount = parseFloat(amount)
  if (isNaN(numAmount)) return '$0.00'
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(numAmount)
}

// Métodos de cálculo
const calcularPorcentajeFondo = (planificado, ejecutado) => {
  const plan = parseFloat(planificado) || 0
  const ejec = parseFloat(ejecutado) || 0
  if (plan === 0) return 0
  return (ejec / plan) * 100
}

const calcularPorcentajeAvance = (meta, logro) => {
  const metaNum = parseFloat(meta) || 0
  const logroNum = parseFloat(logro) || 0
  if (metaNum === 0) return 0
  return (logroNum / metaNum) * 100
}

const calcularCompletitud = computed(() => {
  const campos = [
    'fechaEjecucion',
    'objetivoActividad',
    'tipoActividad',
    'procedenciaFondos',
    'contribucionProyecto',
  ]

  const completados = campos.filter((campo) => {
    const valor = props.informe[campo]
    if (Array.isArray(valor)) return valor.length > 0
    if (typeof valor === 'object') return valor && Object.keys(valor).length > 0
    return !!valor
  }).length

  return Math.round((completados / campos.length) * 100)
})

const getCompletitudColor = () => {
  const porcentaje = calcularCompletitud.value
  if (porcentaje >= 90) return 'success'
  if (porcentaje >= 70) return 'warning'
  return 'error'
}

const getCompletitudTexto = () => {
  const porcentaje = calcularCompletitud.value
  return `Completitud: ${porcentaje}%`
}

const getEjecucionClass = () => {
  const porcentaje = parseFloat(props.informe.procedenciaFondos?.porcentajeEjecucion) || 0
  if (porcentaje >= 100) return 'ejecucion-completa'
  if (porcentaje >= 80) return 'ejecucion-alta'
  if (porcentaje >= 50) return 'ejecucion-media'
  return 'ejecucion-baja'
}

const getDiferenciaClass = () => {
  const diferencia = props.informe.procedenciaFondos?.diferenciaTotal || 0
  if (diferencia === 0) return 'diferencia-cero'
  if (diferencia > 0) return 'diferencia-positiva'
  return 'diferencia-negativa'
}

const getDiferenciaFondoClass = (planificado, ejecutado) => {
  const diferencia = planificado - ejecutado
  if (diferencia === 0) return 'diferencia-cero'
  if (diferencia > 0) return 'diferencia-positiva'
  return 'diferencia-negativa'
}

const getColorPorcentajeFondo = (planificado, ejecutado) => {
  const porcentaje = calcularPorcentajeFondo(planificado, ejecutado)
  if (porcentaje >= 100) return 'success'
  if (porcentaje >= 80) return 'warning'
  return 'error'
}
</script>

<style scoped>
.informe-detalle-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}

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

.form-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
}

.form-section h3 {
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
  padding-bottom: 12px;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.informe-header-detalle {
  margin-bottom: 30px;
}

.informe-subtitulo {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.fecha-informe {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 0.9rem;
}

.presupuesto-resumen {
  margin-bottom: 30px;
}

.fondos-table {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.metadato-item {
  display: flex;
  align-items: center;
}

.ejecucion-completa {
  color: #4caf50 !important;
  border-color: #4caf50 !important;
}
.ejecucion-alta {
  color: #8bc34a !important;
  border-color: #8bc34a !important;
}
.ejecucion-media {
  color: #ffc107 !important;
  border-color: #ffc107 !important;
}
.ejecucion-baja {
  color: #f44336 !important;
  border-color: #f44336 !important;
}

.diferencia-cero {
  color: #666 !important;
}
.diferencia-positiva {
  color: #f44336 !important;
  font-weight: 600;
}
.diferencia-negativa {
  color: #4caf50 !important;
  font-weight: 600;
}

.h-100 {
  height: 100%;
}

@media (max-width: 960px) {
  .informe-detalle-container {
    padding: 16px 12px;
  }

  .form-section {
    padding: 20px;
    margin-bottom: 20px;
  }

  .presupuesto-resumen .v-row {
    flex-direction: column;
  }

  .presupuesto-resumen .v-col {
    width: 100%;
    margin-bottom: 12px;
  }
}

@media (max-width: 600px) {
  .informe-subtitulo {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .metadato-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .fondos-table {
    font-size: 0.8rem;
  }
}
</style>
