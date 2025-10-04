<template>
  <v-container v-if="!isLoading && proyecto">
    <!-- Primera Tarjeta: Jerarquía de Proyecto -->
    <v-card class="mb-6">
      <v-card-title class="bg-primary">
        <v-icon color="white" class="mr-2">mdi-file-tree</v-icon>
        <span class="text-white">Reportes - Proyecto</span>
      </v-card-title>

      <v-card-text>
        <!-- Proyecto -->
        <div class="mb-4">
          <div class="d-flex align-center justify-space-between mb-4 item-container">
            <div class="d-flex align-center item-content">
              <v-icon color="primary" class="mr-2">mdi-folder</v-icon>
              <div>
                <div class="text-h6">{{ proyecto.codigo }} - {{ proyecto.titulo }}</div>
                <div v-if="proyecto.descripcion" class="text-caption text-grey mt-1">
                  {{ proyecto.descripcion }}
                </div>
              </div>
            </div>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="primary"
                  size="small"
                  @click="generarReporte('proyecto', proyecto.id)"
                  icon="mdi-file-download"
                  class="ml-2"
                />
              </template>
              <span>Generar reporte del proyecto</span>
            </v-tooltip>
          </div>

          <!-- Objetivo General -->
          <div v-if="proyecto.objetivo_general" class="ml-4 mb-3">
            <div class="d-flex align-center justify-space-between mb-2 item-container">
              <div class="d-flex align-center item-content">
                <v-icon color="green" class="mr-2">mdi-target</v-icon>
                <div>
                  <div class="text-subtitle-1">
                    Objetivo General: {{ proyecto.objetivo_general.codigo }}
                  </div>
                  <div
                    v-if="proyecto.objetivo_general.descripcion"
                    class="text-caption text-grey mt-1"
                  >
                    {{ proyecto.objetivo_general.descripcion }}
                  </div>
                </div>
              </div>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    color="green"
                    size="small"
                    @click="generarReporte('objetivo_general', proyecto.objetivo_general.id)"
                    icon="mdi-file-download"
                    class="ml-2"
                  />
                </template>
                <span>Generar reporte del objetivo general</span>
              </v-tooltip>
            </div>

            <!-- Resultados OG -->
            <div
              v-if="
                proyecto.objetivo_general.resultados_og &&
                proyecto.objetivo_general.resultados_og.length
              "
              class="ml-4 mb-2"
            >
              <div
                v-for="resultado in proyecto.objetivo_general.resultados_og"
                :key="resultado.id"
                class="mb-2"
              >
                <div class="d-flex align-center justify-space-between item-container">
                  <div class="d-flex align-center item-content">
                    <v-icon color="blue" class="mr-2">mdi-chart-tree</v-icon>
                    <div>
                      <div class="text-body-1">Resultado OG: {{ resultado.codigo }}</div>
                      <div v-if="resultado.descripcion" class="text-caption text-grey mt-1">
                        {{ resultado.descripcion }}
                      </div>
                    </div>
                  </div>
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        color="blue"
                        size="small"
                        @click="generarReporte('resultado_og', resultado.id)"
                        icon="mdi-file-download"
                        class="ml-2"
                      />
                    </template>
                    <span>Generar reporte del resultado OG</span>
                  </v-tooltip>
                </div>
              </div>
            </div>

            <!-- Objetivos Específicos -->
            <div
              v-if="
                proyecto.objetivo_general.objetivos_especificos &&
                proyecto.objetivo_general.objetivos_especificos.length
              "
              class="ml-4"
            >
              <div
                v-for="objetivo in proyecto.objetivo_general.objetivos_especificos"
                :key="objetivo.id"
                class="mb-3"
              >
                <div class="d-flex align-center justify-space-between mb-2 item-container">
                  <div class="d-flex align-center item-content">
                    <v-icon color="orange" class="mr-2">mdi-bullseye-arrow</v-icon>
                    <div>
                      <div class="text-subtitle-1">Objetivo Específico: {{ objetivo.codigo }}</div>
                      <div v-if="objetivo.descripcion" class="text-caption text-grey mt-1">
                        {{ objetivo.descripcion }}
                      </div>
                    </div>
                  </div>
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        color="orange"
                        size="small"
                        @click="generarReporte('objetivo_especifico', objetivo.id)"
                        icon="mdi-file-download"
                        class="ml-2"
                      />
                    </template>
                    <span>Generar reporte del objetivo específico</span>
                  </v-tooltip>
                </div>

                <!-- Resultados OE -->
                <div
                  v-if="objetivo.resultados_oe && objetivo.resultados_oe.length"
                  class="ml-4 mb-2"
                >
                  <div v-for="resultado in objetivo.resultados_oe" :key="resultado.id" class="mb-2">
                    <div class="d-flex align-center justify-space-between item-container">
                      <div class="d-flex align-center item-content">
                        <v-icon color="purple" class="mr-2">mdi-chart-bell-curve</v-icon>
                        <div>
                          <div class="text-body-1">Resultado OE: {{ resultado.codigo }}</div>
                          <div v-if="resultado.descripcion" class="text-caption text-grey mt-1">
                            {{ resultado.descripcion }}
                          </div>
                        </div>
                      </div>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            color="purple"
                            size="small"
                            @click="generarReporte('resultado_oe', resultado.id)"
                            icon="mdi-file-download"
                            class="ml-2"
                          />
                        </template>
                        <span>Generar reporte del resultado OE</span>
                      </v-tooltip>
                    </div>

                    <!-- Productos Resultado OE -->
                    <div
                      v-if="resultado.productos_res_oe && resultado.productos_res_oe.length"
                      class="ml-4"
                    >
                      <div
                        v-for="producto in resultado.productos_res_oe"
                        :key="producto.id"
                        class="mb-1"
                      >
                        <div class="d-flex align-center justify-space-between item-container">
                          <div class="d-flex align-center item-content">
                            <v-icon color="teal" class="mr-2">mdi-package-variant</v-icon>
                            <div>
                              <div class="text-caption">Producto ROE: {{ producto.codigo }}</div>
                              <div v-if="producto.descripcion" class="text-caption text-grey mt-1">
                                {{ producto.descripcion }}
                              </div>
                            </div>
                          </div>
                          <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                              <v-btn
                                v-bind="props"
                                color="teal"
                                size="small"
                                @click="generarReporte('producto_resultado_oe', producto.id)"
                                icon="mdi-file-download"
                                class="ml-2"
                              />
                            </template>
                            <span>Generar reporte del producto ROE</span>
                          </v-tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Productos OE -->
                <div v-if="objetivo.productos_oe && objetivo.productos_oe.length" class="ml-4">
                  <div v-for="producto in objetivo.productos_oe" :key="producto.id" class="mb-1">
                    <div class="d-flex align-center justify-space-between item-container">
                      <div class="d-flex align-center item-content">
                        <v-icon color="indigo" class="mr-2">mdi-package</v-icon>
                        <div>
                          <div class="text-body-1">Producto OE: {{ producto.codigo }}</div>
                          <div v-if="producto.descripcion" class="text-caption text-grey mt-1">
                            {{ producto.descripcion }}
                          </div>
                        </div>
                      </div>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            color="indigo"
                            size="small"
                            @click="generarReporte('producto_oe', producto.id)"
                            icon="mdi-file-download"
                            class="ml-2"
                          />
                        </template>
                        <span>Generar reporte del producto OE</span>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Segunda Tarjeta: Actividades del Proyecto -->
    <v-card>
      <v-card-title class="bg-secondary">
        <v-icon color="white" class="mr-2">mdi-calendar-check</v-icon>
        <span class="text-white">Actividades del Proyecto</span>
      </v-card-title>

      <v-card-text>
        <div v-if="proyecto.actividades && proyecto.actividades.length">
          <div v-for="actividad in proyecto.actividades" :key="actividad.id" class="mb-2">
            <div class="d-flex align-center justify-space-between item-container">
              <div class="d-flex align-center item-content">
                <v-icon color="brown" class="mr-2">mdi-checkbox-marked-circle-outline</v-icon>
                <div>
                  <div class="text-body-1">
                    {{ actividad.codigo }} - {{ actividad.nombreCorto }}
                  </div>
                  <div v-if="actividad.descripcion" class="text-caption text-grey mt-1">
                    {{ actividad.descripcion }}
                  </div>
                </div>
              </div>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    color="brown"
                    size="small"
                    @click="generarReporteActividad(actividad.id)"
                    icon="mdi-file-download"
                    class="ml-2"
                  />
                </template>
                <span>Generar reporte de la actividad</span>
              </v-tooltip>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Snackbar para notificaciones -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>

  <v-container v-else-if="isLoading">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
    <span class="ml-3">Cargando estructura del proyecto...</span>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useReportes } from '@/modules/reportes/composables/useReportes'
import { useRoute } from 'vue-router'
import { reportesServicios } from '@/modules/reportes/services/reportesService'

const ruta = useRoute()
const idproyecto = ruta.params.id

// Inicializar composable
const { estructuraProyectoReportesUIX, cargarEstructuraProyectoReportesUIXPorId } = useReportes()

// Estados reactivos
const isLoading = ref(false)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

// Computed para el proyecto (para reactividad)
const proyecto = computed(() => estructuraProyectoReportesUIX.value)

// Función para generar reportes
const generarReporte = async (tipo, id) => {
  console.log(`Generando reporte de ${tipo} con ID: ${id}`)
  try {
    await reportesServicios.reporteProyecto(id)
  } catch (error) {
    console.error(error)
  }

  snackbar.value = {
    show: true,
    message: `Reporte de ${tipo} generado exitosamente`,
    color: 'success',
  }
}

const generarReporteActividad = async (id) => {
  try {
    await reportesServicios.reporteActividad(id)
  } catch (error) {
    console.error(error)
  }
}

// Cargar datos
const cargarDatos = async () => {
  isLoading.value = true
  try {
    await cargarEstructuraProyectoReportesUIXPorId(idproyecto)
    console.log('Proyecto cargado:', estructuraProyectoReportesUIX.value)
  } catch (error) {
    console.error('Error cargando proyecto:', error)
    snackbar.value = {
      show: true,
      message: 'Error al cargar la estructura del proyecto',
      color: 'error',
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (idproyecto) {
    cargarDatos()
  }
})
</script>

<style scoped>
.ml-4 {
  margin-left: 1rem;
  border-left: 2px solid #e0e0e0;
  padding-left: 1rem;
}

.bg-primary {
  background-color: #1976d2 !important;
}

.bg-secondary {
  background-color: #26a69a !important;
}

/* Espaciado consistente */
.mb-1 {
  margin-bottom: 0.5rem;
}

.mb-2 {
  margin-bottom: 1rem;
}

.mb-3 {
  margin-bottom: 1.5rem;
}

.mb-4 {
  margin-bottom: 2rem;
}

/* Estilo para los textos grises */
.text-grey {
  color: #757575 !important;
}

/* Asegurar que el contenido y botones estén alineados */
.d-flex.align-center {
  min-height: 40px;
}

/* Espaciado para los botones */
.v-btn {
  margin-left: 8px;
  flex-shrink: 0;
}

/* Línea vertical conectando item con botón */
.item-container {
  position: relative;
  padding: 12px 16px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.item-container:hover {
  background-color: #f5f5f5;
}

.item-container::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  width: calc(100% - 80px);
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #e0e0e0 20%, #e0e0e0 80%, transparent 100%);
  pointer-events: none;
}

.item-content {
  position: relative;
  z-index: 2;
  background-color: white;
  padding-right: 8px;
}

.item-container .v-btn {
  position: relative;
  z-index: 3;
  background-color: white;
  border: 1px solid #e0e0e0;
}
</style>
