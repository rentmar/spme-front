<template>
  <v-container class="estadisticas-container">
    <!--Titulo de la pagina-->
    <PaginaTituloIcono
      :titulo="'Estadísticas de Informes'"
      :icon="'mdi-chart-box'"
    ></PaginaTituloIcono>

    <!-- Encabezado con info básica -->
    <v-card class="mb-6" elevation="2" rounded="lg">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="8">
            <h3 class="text-h5 font-weight-bold primary--text">
              {{ actividad.nombreCorto }}
            </h3>
            <div class="d-flex align-center flex-wrap gap-3 mt-2">
              <v-chip :color="getEstadoColor(actividad.estado)" size="small">
                {{ getEstadoText(actividad.estado) }}
              </v-chip>
              <span class="text-body-2">
                <v-icon size="small" class="mr-1">mdi-identifier</v-icon>
                {{ actividad.codigo }}
              </span>
              <span class="text-body-2">
                <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                {{ formatDate(actividad.fecha_inicio) }} - {{ formatDate(actividad.fecha_cierre) }}
              </span>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="text-md-right">
            <div class="text-h4 font-weight-bold primary--text">
              {{ actividad.estadisticas_informes.total_general }}
            </div>
            <div class="text-body-2 text-grey">Total de Informes</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tarjetas de resumen -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="h-100">
          <v-card-text class="text-center">
            <v-icon size="48" color="primary" class="mb-3">mdi-file-document</v-icon>
            <div class="text-h3 font-weight-bold">
              {{ actividad.estadisticas_informes.total_informes_actividad }}
            </div>
            <div class="text-body-2 text-grey">Informes de Actividad</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="h-100">
          <v-card-text class="text-center">
            <v-icon size="48" color="secondary" class="mb-3">mdi-file-tree</v-icon>
            <div class="text-h3 font-weight-bold">
              {{ actividad.estadisticas_informes.total_informes_tareas }}
            </div>
            <div class="text-body-2 text-grey">Informes de Tareas</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="h-100">
          <v-card-text class="text-center">
            <v-icon size="48" color="success" class="mb-3">mdi-format-list-checkbox</v-icon>
            <div class="text-h3 font-weight-bold">
              {{ actividad.estadisticas_informes.cantidad_tareas }}
            </div>
            <div class="text-body-2 text-grey">Tareas Relacionadas</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="h-100">
          <v-card-text class="text-center">
            <v-icon size="48" color="warning" class="mb-3">mdi-chart-pie</v-icon>
            <div class="text-h3 font-weight-bold">{{ calcularPromedioCompletitud() }}%</div>
            <div class="text-body-2 text-grey">Promedio Completitud</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Distribución de informes -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title class="text-white">
              <v-icon class="mr-2">mdi-chart-donut</v-icon>
              Distribución de Informes
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-4">
            <div class="form-section">
              <v-row align="center">
                <v-col cols="12" md="8">
                  <div style="height: 250px">
                    <canvas ref="distribucionChart"></canvas>
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="distribucion-leyenda">
                    <div class="leyenda-item mb-4">
                      <div class="leyenda-color" style="background-color: #4caf50"></div>
                      <div class="leyenda-texto">
                        <div class="leyenda-titulo">Informes de Actividad</div>
                        <div class="leyenda-valor">
                          {{ actividad.estadisticas_informes.total_informes_actividad }}
                        </div>
                        <div class="leyenda-porcentaje">
                          {{
                            calcularPorcentaje(
                              actividad.estadisticas_informes.total_informes_actividad,
                              actividad.estadisticas_informes.total_general,
                            )
                          }}%
                        </div>
                      </div>
                    </div>
                    <div class="leyenda-item">
                      <div class="leyenda-color" style="background-color: #2196f3"></div>
                      <div class="leyenda-texto">
                        <div class="leyenda-titulo">Informes de Tareas</div>
                        <div class="leyenda-valor">
                          {{ actividad.estadisticas_informes.total_informes_tareas }}
                        </div>
                        <div class="leyenda-porcentaje">
                          {{
                            calcularPorcentaje(
                              actividad.estadisticas_informes.total_informes_tareas,
                              actividad.estadisticas_informes.total_general,
                            )
                          }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estado de los informes -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title class="text-white">
              <v-icon class="mr-2">mdi-check-circle</v-icon>
              Estado de los Informes
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-4">
            <div class="form-section">
              <v-row>
                <v-col cols="12" md="4">
                  <v-card variant="outlined" class="text-center py-6 border-success">
                    <v-icon size="48" color="success" class="mb-3">mdi-check-circle</v-icon>
                    <div class="text-h2 font-weight-bold text-success">
                      {{ contarInformesCompletos() }}
                    </div>
                    <div class="text-body-1 font-weight-medium">Completos</div>
                    <div class="text-caption text-grey mt-2">
                      {{
                        calcularPorcentaje(
                          contarInformesCompletos(),
                          actividad.estadisticas_informes.total_general,
                        )
                      }}% del total
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card variant="outlined" class="text-center py-6 border-warning">
                    <v-icon size="48" color="warning" class="mb-3">mdi-alert-circle</v-icon>
                    <div class="text-h2 font-weight-bold text-warning">
                      {{ contarInformesIncompletos() }}
                    </div>
                    <div class="text-body-1 font-weight-medium">Incompletos</div>
                    <div class="text-caption text-grey mt-2">
                      {{
                        calcularPorcentaje(
                          contarInformesIncompletos(),
                          actividad.estadisticas_informes.total_general,
                        )
                      }}% del total
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card variant="outlined" class="text-center py-6 border-error">
                    <v-icon size="48" color="error" class="mb-3">mdi-close-circle</v-icon>
                    <div class="text-h2 font-weight-bold text-error">
                      {{ contarInformesSinDatos() }}
                    </div>
                    <div class="text-body-1 font-weight-medium">Sin Datos</div>
                    <div class="text-caption text-grey mt-2">
                      {{
                        calcularPorcentaje(
                          contarInformesSinDatos(),
                          actividad.estadisticas_informes.total_general,
                        )
                      }}% del total
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Ejecución Presupuestaria -->
    <v-row v-if="tieneDatosPresupuesto()" class="mb-6">
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title class="text-white">
              <v-icon class="mr-2">mdi-cash-multiple</v-icon>
              Ejecución Presupuestaria
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-4">
            <div class="form-section">
              <v-row>
                <v-col cols="12" md="4">
                  <div class="presupuesto-resumen">
                    <div class="presupuesto-item mb-4">
                      <div class="text-h6 font-weight-bold">Presupuesto Total:</div>
                      <div class="text-h5 font-weight-bold primary--text">
                        {{ formatCurrency(actividad.presupuesto) }}
                      </div>
                    </div>
                    <div class="presupuesto-item mb-4">
                      <div class="text-h6 font-weight-bold">Total Ejecutado:</div>
                      <div
                        class="text-h5 font-weight-bold"
                        :class="getEjecucionClass(actividad.totalEjecutado, actividad.presupuesto)"
                      >
                        {{ formatCurrency(actividad.totalEjecutado) }}
                      </div>
                      <div class="text-body-2">
                        {{
                          calcularPorcentajeEjecucion(
                            actividad.totalEjecutado,
                            actividad.presupuesto,
                          )
                        }}% de ejecución
                      </div>
                    </div>
                    <div class="presupuesto-item">
                      <div class="text-h6 font-weight-bold">Saldo Disponible:</div>
                      <div class="text-h5 font-weight-bold">
                        {{ formatCurrency(calcularSaldo()) }}
                      </div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="8">
                  <div style="height: 200px">
                    <canvas ref="presupuestoChart"></canvas>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tareas sin informes -->
    <v-row v-if="getTareasSinInformes().length > 0" class="mb-6">
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-toolbar color="warning" density="compact">
            <v-toolbar-title class="text-white">
              <v-icon class="mr-2">mdi-alert</v-icon>
              Tareas Pendientes de Informe
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-4">
            <div class="form-section">
              <v-table density="compact">
                <thead>
                  <tr class="bg-grey-lighten-4">
                    <th class="text-left">Tarea</th>
                    <th class="text-left">Código</th>
                    <th class="text-left">Estado</th>
                    <th class="text-left">Fecha Límite</th>
                    <th class="text-center">Informes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tarea in getTareasSinInformes()" :key="tarea.id">
                    <td>{{ tarea.titulo }}</td>
                    <td>
                      <v-chip size="small" color="grey-lighten-2">
                        {{ tarea.codigo }}
                      </v-chip>
                    </td>
                    <td>
                      <v-chip :color="getEstadoTareaColor(tarea.estado)" size="small">
                        {{ getEstadoTareaText(tarea.estado) }}
                      </v-chip>
                    </td>
                    <td>{{ formatDate(tarea.fecha_limite) }}</td>
                    <td class="text-center">
                      <v-chip :color="tarea.total_informes > 0 ? 'success' : 'error'" size="small">
                        {{ tarea.total_informes }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Resumen final -->
    <v-row>
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" class="text-center">
                <div class="text-h6 font-weight-bold">Último informe</div>
                <div class="text-h4 font-weight-bold primary--text mt-2">
                  {{ obtenerUltimoInforme() }}
                </div>
              </v-col>
              <v-col cols="12" md="4" class="text-center">
                <div class="text-h6 font-weight-bold">Informes este mes</div>
                <div class="text-h4 font-weight-bold primary--text mt-2">
                  {{ contarInformesEsteMes() }}
                </div>
              </v-col>
              <v-col cols="12" md="4" class="text-center">
                <div class="text-h6 font-weight-bold">Tasa de completitud</div>
                <div class="text-h4 font-weight-bold primary--text mt-2">
                  {{ calcularPromedioCompletitud() }}%
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { defineProps, ref, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'

const props = defineProps({
  actividad: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const distribucionChart = ref(null)
const presupuestoChart = ref(null)

let chartInstances = []

// Métodos de formato
const formatDate = (dateString) => {
  if (!dateString) return 'No definida'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  } catch {
    return 'Fecha inválida'
  }
}

const formatCurrency = (amount) => {
  if (!amount) return '$0.00'
  const numAmount = parseFloat(amount)
  if (isNaN(numAmount)) return '$0.00'
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(numAmount)
}

const getEstadoColor = (estado) => {
  const colores = {
    CRD: 'grey',
    PLAN: 'blue',
    EJEC: 'orange',
    REP: 'purple',
    FIN: 'green',
    RETR: 'red',
    REPROG: 'amber',
  }
  return colores[estado] || 'grey'
}

const getEstadoText = (estado) => {
  const textos = {
    CRD: 'Creada',
    PLAN: 'Planificada',
    EJEC: 'En Ejecución',
    REP: 'En Reporte',
    FIN: 'Finalizado',
    RETR: 'Retraso',
    REPROG: 'Reprogramación',
  }
  return textos[estado] || estado
}

// Métodos de cálculo
const calcularPorcentaje = (valor, total) => {
  if (!total || total === 0) return 0
  return ((valor / total) * 100).toFixed(1)
}

const calcularPorcentajeEjecucion = (ejecutado, planificado) => {
  const ejec = parseFloat(ejecutado) || 0
  const plan = parseFloat(planificado) || 0
  if (plan === 0) return 0
  return ((ejec / plan) * 100).toFixed(1)
}

const calcularSaldo = () => {
  const presupuesto = parseFloat(props.actividad.presupuesto) || 0
  const ejecutado = parseFloat(props.actividad.totalEjecutado) || 0
  return presupuesto - ejecutado
}

const getEjecucionClass = (ejecutado, planificado) => {
  const porcentaje = calcularPorcentajeEjecucion(ejecutado, planificado)
  if (porcentaje >= 100) return 'text-success'
  if (porcentaje >= 80) return 'text-warning'
  if (porcentaje >= 50) return 'text-info'
  return 'text-error'
}

const getEstadoTareaColor = (estado) => {
  const colores = {
    PEN: 'grey',
    EPROG: 'blue',
    COMPL: 'green',
  }
  return colores[estado] || 'grey'
}

const getEstadoTareaText = (estado) => {
  const textos = {
    PEN: 'Pendiente',
    EPROG: 'En Progreso',
    COMPL: 'Completada',
  }
  return textos[estado] || estado
}

// Métodos de análisis de datos
const contarInformesCompletos = () => {
  if (!props.actividad.informes_actividad) return 0
  return props.actividad.informes_actividad.filter((informe) => {
    return informe.fechaEjecucion && informe.objetivoActividad && informe.tipoActividad
  }).length
}

const contarInformesIncompletos = () => {
  if (!props.actividad.informes_actividad) return 0
  return props.actividad.informes_actividad.filter((informe) => {
    return !informe.fechaEjecucion || !informe.objetivoActividad || !informe.tipoActividad
  }).length
}

const contarInformesSinDatos = () => {
  if (!props.actividad.informes_actividad) return 0
  return props.actividad.informes_actividad.filter((informe) => {
    return !informe.fechaEjecucion && !informe.objetivoActividad && !informe.tipoActividad
  }).length
}

const tieneDatosPresupuesto = () => {
  return props.actividad.presupuesto && parseFloat(props.actividad.presupuesto) > 0
}

const getTareasSinInformes = () => {
  if (!props.actividad.tareas_con_informes) return []
  return props.actividad.tareas_con_informes.filter((tarea) => tarea.total_informes === 0)
}

const calcularPromedioCompletitud = () => {
  if (!props.actividad.informes_actividad?.length) return 0

  const totalCompletitud = props.actividad.informes_actividad.reduce((sum, informe) => {
    let completitud = 0
    if (informe.fechaEjecucion) completitud += 20
    if (informe.objetivoActividad) completitud += 20
    if (informe.tipoActividad) completitud += 20
    if (informe.procedenciaFondos) completitud += 20
    if (informe.contribucionProyecto) completitud += 20
    return sum + completitud
  }, 0)

  return (totalCompletitud / props.actividad.informes_actividad.length).toFixed(1)
}

const obtenerUltimoInforme = () => {
  if (!props.actividad.informes_actividad?.length) return 'Ninguno'

  const informesConFecha = props.actividad.informes_actividad
    .filter((informe) => informe.fechaEjecucion)
    .sort((a, b) => new Date(b.fechaEjecucion) - new Date(a.fechaEjecucion))

  if (informesConFecha.length === 0) return 'Sin fecha'

  const ultimo = informesConFecha[0]
  return formatDate(ultimo.fechaEjecucion)
}

const contarInformesEsteMes = () => {
  if (!props.actividad.informes_actividad) return 0

  const hoy = new Date()
  const mesActual = hoy.getMonth()
  const añoActual = hoy.getFullYear()

  return props.actividad.informes_actividad.filter((informe) => {
    if (!informe.fechaEjecucion) return false
    const fechaInforme = new Date(informe.fechaEjecucion)
    return fechaInforme.getMonth() === mesActual && fechaInforme.getFullYear() === añoActual
  }).length
}

// Gráficos
onMounted(() => {
  crearGraficoDistribucion()
  if (tieneDatosPresupuesto()) {
    crearGraficoPresupuesto()
  }
})

onUnmounted(() => {
  // Destruir todas las instancias de gráficos
  chartInstances.forEach((chart) => chart.destroy())
  chartInstances = []
})

const crearGraficoDistribucion = () => {
  const ctx = distribucionChart.value?.getContext('2d')
  if (!ctx) return

  const data = {
    labels: ['Informes de Actividad', 'Informes de Tareas'],
    datasets: [
      {
        data: [
          props.actividad.estadisticas_informes.total_informes_actividad,
          props.actividad.estadisticas_informes.total_informes_tareas,
        ],
        backgroundColor: ['#4CAF50', '#2196F3'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  }

  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || ''
              const value = context.raw || 0
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = Math.round((value / total) * 100)
              return `${label}: ${value} (${percentage}%)`
            },
          },
        },
      },
    },
  })

  chartInstances.push(chart)
}

const crearGraficoPresupuesto = () => {
  const ctx = presupuestoChart.value?.getContext('2d')
  if (!ctx) return

  const presupuesto = parseFloat(props.actividad.presupuesto) || 0
  const ejecutado = parseFloat(props.actividad.totalEjecutado) || 0
  const saldo = presupuesto - ejecutado

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Planificado', 'Ejecutado', 'Saldo'],
      datasets: [
        {
          data: [presupuesto, ejecutado, saldo],
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `$${value.toLocaleString()}`,
          },
        },
      },
    },
  })

  chartInstances.push(chart)
}
</script>

<style scoped>
.estadisticas-container {
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
  border: 1px solid #e0e0e0;
}

.h-100 {
  height: 100%;
}

.distribucion-leyenda {
  padding: 16px;
}

.leyenda-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.leyenda-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.leyenda-texto {
  flex: 1;
}

.leyenda-titulo {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.leyenda-valor {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin: 4px 0;
}

.leyenda-porcentaje {
  font-size: 0.8rem;
  color: #666;
}

.presupuesto-resumen {
  padding: 16px;
}

.presupuesto-item {
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-bottom: 12px;
}

.border-success {
  border-color: #4caf50 !important;
}

.border-warning {
  border-color: #ff9800 !important;
}

.border-error {
  border-color: #f44336 !important;
}

.text-success {
  color: #4caf50 !important;
}

.text-warning {
  color: #ff9800 !important;
}

.text-error {
  color: #f44336 !important;
}

.text-info {
  color: #2196f3 !important;
}

.gap-3 {
  gap: 12px;
}

@media (max-width: 960px) {
  .estadisticas-container {
    padding: 16px 12px;
  }

  .form-section {
    padding: 20px;
  }

  .distribucion-leyenda {
    margin-top: 20px;
  }
}

@media (max-width: 600px) {
  .leyenda-item {
    flex-direction: column;
    text-align: center;
  }

  .leyenda-color {
    width: 40px;
    height: 40px;
  }
}
</style>
