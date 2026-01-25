<template>
  <v-container>
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
      <div class="text-h6 mt-4">Cargando información del PEI...</div>
    </div>

    <!-- Error state -->
    <div v-if="error && !loading" class="text-center py-12">
      <v-alert type="error" variant="tonal" class="mb-4">
        <v-alert-title>Error al cargar los datos</v-alert-title>
        {{ error.message }}
      </v-alert>
      <v-btn color="primary" @click="cargarDatos" :loading="loading">
        <v-icon icon="mdi-reload" class="mr-2"></v-icon>
        Reintentar
      </v-btn>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <v-row v-if="!loading && !error && peiDetalle">
      <!-- Columna principal -->
      <v-col cols="12" md="8" lg="9">
        <div class="d-flex justify-space-between align-center mb-4">
          <PaginaTituloIcono
            :titulo="'Dashboard del PEI'"
            :icon="'mdi-chart-box-outline'"
          ></PaginaTituloIcono>
          <!-- <v-btn color="success" @click="exportarAExcel" :loading="exportando">
            <v-icon icon="mdi-microsoft-excel" class="mr-2"></v-icon>
            Exportar a Excel
          </v-btn> -->
        </div>

        <!-- Información básica del PEI -->
        <v-card variant="outlined" elevation="1" class="mb-4">
          <v-card-title class="d-flex align-center">
            <h3 class="text-h4">{{ peiDetalle.pei.titulo }}</h3>
            <v-spacer></v-spacer>
            <v-chip :color="getVigenciaColor(peiDetalle.pei.vigencia)" class="ml-2">
              {{ peiDetalle.pei.vigencia }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  variant="outlined"
                  label="Título"
                  :model-value="peiDetalle.pei.titulo"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  variant="outlined"
                  label="Descripción"
                  rows="3"
                  :model-value="peiDetalle.pei.descripcion"
                  readonly
                ></v-textarea>
              </v-col>
            </v-row>

            <div class="d-flex flex-wrap gap-2 mt-2">
              <v-chip variant="outlined" class="mr-2 mb-2">
                <v-icon icon="mdi-calendar-start" left></v-icon>
                {{ formatDate(peiDetalle.pei.fecha_inicio) }}
              </v-chip>

              <v-chip variant="outlined" class="mb-2">
                <v-icon icon="mdi-calendar-end" left></v-icon>
                {{ formatDate(peiDetalle.pei.fecha_fin) }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- Resumen de métricas -->
        <v-row class="mb-4">
          <v-col cols="12" sm="6" md="3">
            <v-card variant="outlined" class="h-100">
              <v-card-text class="text-center">
                <div class="d-flex align-center justify-center mb-2">
                  <v-avatar color="blue" size="48">
                    <v-icon icon="mdi-bullseye" color="white"></v-icon>
                  </v-avatar>
                </div>
                <div class="text-h4 font-weight-bold">{{ peiDetalle.resumen.objetivos }}</div>
                <div class="text-subtitle-1 text-grey">Objetivos</div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card variant="outlined" class="h-100">
              <v-card-text class="text-center">
                <div class="d-flex align-center justify-center mb-2">
                  <v-avatar color="orange" size="48">
                    <v-icon icon="mdi-alert-circle-outline" color="white"></v-icon>
                  </v-avatar>
                </div>
                <div class="text-h4 font-weight-bold">
                  {{ peiDetalle.resumen.factores_criticos }}
                </div>
                <div class="text-subtitle-1 text-grey">Factores Críticos</div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card variant="outlined" class="h-100">
              <v-card-text class="text-center">
                <div class="d-flex align-center justify-center mb-2">
                  <v-avatar color="green" size="48">
                    <v-icon icon="mdi-chart-line" color="white"></v-icon>
                  </v-avatar>
                </div>
                <div class="text-h4 font-weight-bold">{{ peiDetalle.resumen.indicadores }}</div>
                <div class="text-subtitle-1 text-grey">Indicadores</div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card variant="outlined" class="h-100">
              <v-card-text class="text-center">
                <div class="d-flex align-center justify-center mb-2">
                  <v-avatar color="purple" size="48">
                    <v-icon icon="mdi-tasks" color="white"></v-icon>
                  </v-avatar>
                </div>
                <div class="text-h4 font-weight-bold">{{ peiDetalle.resumen.actividades }}</div>
                <div class="text-subtitle-1 text-grey">Actividades</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Estado financiero -->
        <v-card variant="outlined" elevation="1" class="mb-4">
          <v-card-title class="d-flex align-center bg-green-lighten-5">
            <v-icon icon="mdi-finance" class="mr-2" color="green"></v-icon>
            <h3 class="text-h5">Estado Financiero</h3>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-card variant="flat" class="text-center">
                  <v-card-text>
                    <div class="text-subtitle-2 text-grey">Presupuesto</div>
                    <div class="text-h5 font-weight-bold">
                      {{ formatCurrency(peiDetalle.financiero.presupuesto) }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card variant="flat" class="text-center">
                  <v-card-text>
                    <div class="text-subtitle-2 text-grey">Ejecutado</div>
                    <div class="text-h5 font-weight-bold">
                      {{ formatCurrency(peiDetalle.financiero.ejecutado) }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card variant="flat" class="text-center">
                  <v-card-text>
                    <div class="text-subtitle-2 text-grey">Saldo</div>
                    <div class="text-h5 font-weight-bold">
                      {{ formatCurrency(peiDetalle.financiero.saldo) }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card variant="flat" class="text-center">
                  <v-card-text>
                    <div class="text-subtitle-2 text-grey">% Ejecución</div>
                    <div class="text-h5 font-weight-bold">
                      {{ peiDetalle.financiero.porcentaje }}%
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <div class="mt-4">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">Progreso de ejecución</span>
                <span class="text-caption font-weight-bold"
                  >{{ peiDetalle.financiero.porcentaje }}%</span
                >
              </div>
              <v-progress-linear
                :model-value="peiDetalle.financiero.porcentaje"
                height="15"
                color="deep-purple-accent-4"
                rounded
              >
                <template v-slot:default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
            </div>
          </v-card-text>
        </v-card>

        <!-- Estructura del PEI -->
        <v-card
          variant="outlined"
          elevation="1"
          class="mb-4"
          v-if="peiDetalle.estructura.length > 0"
        >
          <v-card-title class="d-flex align-center bg-blue-lighten-5">
            <v-icon icon="mdi-sitemap" class="mr-2" color="primary"></v-icon>
            <h3 class="text-h5">Estructura del PEI</h3>
            <v-chip size="small" color="primary" class="ml-2">
              {{ peiDetalle.estructura.length }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <v-expansion-panels variant="accordion">
              <v-expansion-panel
                v-for="(objetivo, index) in peiDetalle.estructura"
                :key="`obj-${index}`"
                class="mb-4"
              >
                <v-expansion-panel-title>
                  <div class="d-flex align-center">
                    <v-chip size="small" color="primary" class="mr-2">
                      {{ objetivo.objetivo_codigo }}
                    </v-chip>
                    <span class="text-body-1">
                      {{ objetivo.descripcion.substring(0, 120) }}
                      {{ objetivo.descripcion.length > 120 ? '...' : '' }}
                    </span>
                  </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <!-- Descripción del Objetivo -->
                  <div class="mb-4">
                    <p class="text-body-1">{{ objetivo.descripcion }}</p>
                  </div>

                  <!-- Estadísticas del objetivo -->
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-card variant="flat" class="text-center">
                        <v-card-text>
                          <div class="text-h6 font-weight-bold">
                            {{ objetivo.factores_criticos }}
                          </div>
                          <div class="text-caption text-grey">Factores Críticos</div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-card variant="flat" class="text-center">
                        <v-card-text>
                          <div class="text-h6 font-weight-bold">{{ objetivo.indicadores }}</div>
                          <div class="text-caption text-grey">Indicadores</div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-card variant="flat" class="text-center">
                        <v-card-text>
                          <div class="text-h6 font-weight-bold">
                            {{ objetivo.actividades_relacionadas }}
                          </div>
                          <div class="text-caption text-grey">Actividades</div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>

        <!-- Estado de actividades -->
        <v-card variant="outlined" elevation="1" class="mb-4">
          <v-card-title class="d-flex align-center bg-orange-lighten-5">
            <v-icon icon="mdi-progress-clock" class="mr-2" color="orange"></v-icon>
            <h3 class="text-h5">Estado de Actividades</h3>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-list lines="two">
                  <v-list-item
                    v-for="(cantidad, estado) in peiDetalle.estado_actividades"
                    :key="estado"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="getEstadoActividadColor(estado)" size="40">
                        <v-icon color="white" :icon="getEstadoActividadIcon(estado)"></v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-medium">
                      {{ formatEstado(estado) }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <span class="text-h6 font-weight-bold">{{ cantidad }}</span> actividades
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col cols="12" md="6">
                <div class="d-flex justify-center align-end h-100">
                  <div class="chart-bars">
                    <div
                      v-for="(cantidad, estado) in peiDetalle.estado_actividades"
                      :key="estado"
                      class="chart-bar-container"
                    >
                      <div class="chart-bar-label">{{ formatEstado(estado)[0] }}</div>
                      <div class="chart-bar">
                        <div
                          class="chart-bar-fill"
                          :class="getActivityClass(estado)"
                          :style="{ height: calcularPorcentajeActividad(cantidad) + '%' }"
                        ></div>
                      </div>
                      <div class="chart-bar-value">{{ cantidad }}</div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>

            <!-- Total de actividades -->
            <v-divider class="my-4"></v-divider>
            <div class="d-flex justify-space-between align-center">
              <div class="text-subtitle-1">Total de actividades</div>
              <div class="text-h5 font-weight-bold">
                {{ totalActividades }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Columna lateral -->
      <v-col cols="12" md="4" lg="3">
        <!-- Resumen del PEI -->
        <v-card class="sticky-card" elevation="6">
          <v-card-title class="bg-primary text-white">
            <h3 class="text-h5">Resumen del PEI</h3>
          </v-card-title>
          <v-card-text>
            <!-- Información básica -->
            <div class="mb-4">
              <div class="text-subtitle-2 text-grey">Título</div>
              <div class="text-h6">{{ peiDetalle.pei.titulo }}</div>
            </div>

            <!-- Vigencia -->
            <div class="mb-4">
              <div class="text-subtitle-2 text-grey">Estado de Vigencia</div>
              <v-chip :color="getVigenciaColor(peiDetalle.pei.vigencia)" size="small">
                {{ peiDetalle.pei.vigencia }}
              </v-chip>
            </div>

            <!-- Progreso general -->
            <div class="d-flex align-center mb-4">
              <v-progress-circular
                :rotate="360"
                :size="80"
                :width="10"
                :model-value="peiDetalle.financiero.porcentaje"
                color="primary"
              >
                <strong>{{ peiDetalle.financiero.porcentaje }}%</strong>
              </v-progress-circular>

              <div class="ml-4">
                <div class="text-subtitle-1">Ejecución financiera</div>
                <div class="text-caption text-grey">
                  Inicio: {{ formatDate(peiDetalle.pei.fecha_inicio) }}
                </div>
                <div class="text-caption text-grey">
                  Fin: {{ formatDate(peiDetalle.pei.fecha_fin) }}
                </div>
              </div>
            </div>

            <!-- Estadísticas -->
            <v-divider class="my-3"></v-divider>
            <h3 class="mb-2">Estadísticas</h3>

            <div class="mb-3">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption">Objetivos</span>
                <v-chip size="small" color="blue">
                  {{ peiDetalle.resumen.objetivos }}
                </v-chip>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption">Factores Críticos</span>
                <v-chip size="small" color="orange">
                  {{ peiDetalle.resumen.factores_criticos }}
                </v-chip>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption">Indicadores</span>
                <v-chip size="small" color="green">
                  {{ peiDetalle.resumen.indicadores }}
                </v-chip>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption">Actividades</span>
                <v-chip size="small" color="purple">
                  {{ peiDetalle.resumen.actividades }}
                </v-chip>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-caption">Tareas</span>
                <v-chip size="small" color="teal">
                  {{ peiDetalle.resumen.tareas }}
                </v-chip>
              </div>
            </div>

            <!-- Presupuesto -->
            <v-divider class="my-3"></v-divider>
            <h3 class="mb-2">Presupuesto</h3>

            <div class="d-flex justify-space-between mb-1">
              <span class="text-caption">Asignado</span>
              <span class="text-caption font-weight-bold">
                {{ formatCurrency(peiDetalle.financiero.presupuesto) }}
              </span>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span class="text-caption">Utilizado</span>
              <span class="text-caption">{{
                formatCurrency(peiDetalle.financiero.ejecutado)
              }}</span>
            </div>

            <v-progress-linear
              :model-value="peiDetalle.financiero.porcentaje"
              height="15"
              color="deep-purple-accent-4"
              rounded
              class="mt-1"
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePeiCrud } from '@/modules/pei/composables/usePeiCrud'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'

const route = useRoute()
const { peiDetalle, obtenerDetallePei } = usePeiCrud()

// Obtener ID del PEI de la ruta
const peiID = route.params.id

// Estados
const loading = ref(false)
const error = ref(null)
const exportando = ref(false)

// Computed properties
const totalActividades = computed(() => {
  if (!peiDetalle.value || !peiDetalle.value.estado_actividades) return 0
  return Object.values(peiDetalle.value.estado_actividades).reduce((a, b) => a + b, 0)
})

// Métodos
const getVigenciaColor = (vigencia) => {
  switch (vigencia) {
    case 'VIGENTE':
      return 'success'
    case 'PENDIENTE':
      return 'warning'
    case 'VENCIDO':
      return 'error'
    default:
      return 'default'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'No definida'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const formatCurrency = (amount) => {
  const value = amount || 0
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(value)
}

const formatEstado = (estado) => {
  const estados = {
    creadas: 'Creadas',
    planificadas: 'Planificadas',
    ejecucion: 'En Ejecución',
    finalizadas: 'Finalizadas',
    retrasadas: 'Retrasadas',
  }
  return estados[estado] || estado
}

const getEstadoActividadColor = (estado) => {
  const colores = {
    creadas: 'blue',
    planificadas: 'orange',
    ejecucion: 'green',
    finalizadas: 'teal',
    retrasadas: 'red',
  }
  return colores[estado] || 'grey'
}

const getEstadoActividadIcon = (estado) => {
  const iconos = {
    creadas: 'mdi-file-document-outline',
    planificadas: 'mdi-calendar-clock',
    ejecucion: 'mdi-progress-clock',
    finalizadas: 'mdi-check-circle-outline',
    retrasadas: 'mdi-alert-circle-outline',
  }
  return iconos[estado] || 'mdi-help-circle-outline'
}

const getActivityClass = (estado) => {
  const clases = {
    creadas: 'state-created',
    planificadas: 'state-planned',
    ejecucion: 'state-in-progress',
    finalizadas: 'state-completed',
    retrasadas: 'state-delayed',
  }
  return clases[estado] || ''
}

const calcularPorcentajeActividad = (cantidad) => {
  if (totalActividades.value === 0) return 0
  return (cantidad / totalActividades.value) * 100
}

// Función para exportar a Excel
const exportarAExcel = async () => {
  exportando.value = true
  try {
    // Simulamos la exportación
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Exportando PEI a Excel:', peiDetalle.value)
    alert('PEI exportado exitosamente a Excel')
  } catch (error) {
    console.error('Error al exportar a Excel:', error)
    alert('Error al exportar a Excel')
  } finally {
    exportando.value = false
  }
}

// Cargar datos
const cargarDatos = async () => {
  loading.value = true
  error.value = null
  try {
    await obtenerDetallePei(peiID)
  } catch (err) {
    error.value = err
    console.error('Error cargando detalles del PEI:', err)
  } finally {
    loading.value = false
  }
}

// Hook para cargar datos al montar
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.v-card {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.v-card:last-child {
  margin-bottom: 0;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

.sticky-card {
  position: sticky;
  top: 20px;
}

.v-expansion-panel {
  border-radius: 6px !important;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.text-caption {
  font-size: 0.75rem;
}

.gap-2 {
  gap: 8px;
}

.h-100 {
  height: 100%;
}

/* Chart styles */
.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 180px;
  width: 100%;
  padding: 0 10px;
}

.chart-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin: 0 5px;
}

.chart-bar-label {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 8px;
  font-weight: 500;
  text-transform: uppercase;
}

.chart-bar {
  width: 40px;
  height: 150px;
  background: #f5f5f5;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.chart-bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 8px;
  transition: height 0.8s ease-out;
}

.chart-bar-value {
  margin-top: 8px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.875rem;
}

/* Colores para barras del chart */
.chart-bar-fill.state-created {
  background: linear-gradient(to top, #2196f3, #0d47a1);
}
.chart-bar-fill.state-planned {
  background: linear-gradient(to top, #ff9800, #e65100);
}
.chart-bar-fill.state-in-progress {
  background: linear-gradient(to top, #4caf50, #1b5e20);
}
.chart-bar-fill.state-completed {
  background: linear-gradient(to top, #009688, #004d40);
}
.chart-bar-fill.state-delayed {
  background: linear-gradient(to top, #f44336, #b71c1c);
}
</style>
