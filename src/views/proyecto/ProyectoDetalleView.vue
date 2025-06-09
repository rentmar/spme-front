<template>
  <v-container>
    <!-- Overlay de carga -->
    <v-overlay :model-value="cargandoGeneral" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Cargando proyecto...</p>
    </v-overlay>
    <!--CONTENIDO-->
    <v-row v-if="!cargandoGeneral">
      <!-- Columna principal -->
      <v-col cols="12" md="8" lg="9">
        <PaginaTituloIcono :titulo="'Detalles'" :icon="'mdi-eye-outline'"></PaginaTituloIcono>
        <!-- Información básica del proyecto -->
        <v-card variant="outlined" elevation="1" class="mb-4">
          <v-card-title class="d-flex align-center">
            <h3 class="text-h4">Proyecto: {{ proyecto?.codigo }}</h3>
            <v-spacer></v-spacer>
            <v-chip :color="getStatusColor(proyecto?.estado)" class="ml-2">
              {{ getEstadoTexto(proyecto?.estado) }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <v-form>
              <v-textarea
                variant="outlined"
                label="Título"
                rows="2"
                :model-value="proyecto?.titulo"
                readonly
              ></v-textarea>

              <v-textarea
                variant="outlined"
                label="Descripción"
                rows="5"
                :model-value="proyecto?.descripcion"
                readonly
              ></v-textarea>

              <div class="d-flex flex-wrap mt-2">
                <v-chip variant="outlined" class="mr-2 mb-2">
                  <v-icon icon="mdi-account" left></v-icon>
                  {{ proyecto?.creado_por }}
                </v-chip>

                <v-chip variant="outlined" class="mr-2 mb-2">
                  <v-icon icon="mdi-office-building" left></v-icon>
                  {{ proyecto?.instancia_gestora }}
                </v-chip>

                <v-chip variant="outlined" class="mb-2">
                  <v-icon icon="mdi-calendar-range" left></v-icon>
                  {{ formatDate(proyecto?.fecha_inicio) }} -
                  {{ formatDate(proyecto?.fecha_finalizacion) }}
                </v-chip>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
        <!-- Objetivos del proyecto -->
        <v-card variant="outlined" elevation="1" class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-bullseye" class="mr-2"></v-icon>
            <h3 class="text-h5">Objetivos del Proyecto</h3>
          </v-card-title>
          <v-card-text>
            <div v-if="objetivos?.objetivos_generales?.length" class="mb-6">
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-bullseye-arrow" color="primary" class="mr-2"></v-icon>
                <h4 class="text-h6">Objetivo General</h4>
                <v-chip size="small" color="primary" class="ml-2">
                  {{ objetivos.objetivos_generales.length }}
                </v-chip>
              </div>
              <v-expansion-panels variant="accordion">
                <v-expansion-panel
                  v-for="(obj, index) in objetivos.objetivos_generales"
                  :key="index"
                  class="mb-2"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex align-center">
                      <v-chip size="small" color="green" class="mr-2">
                        {{ obj.codigo }}
                      </v-chip>
                      <span
                        >{{ obj.descripcion.substring(0, 80)
                        }}{{ obj.descripcion.length > 80 ? '...' : '' }}</span
                      >
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <p class="mb-4">{{ obj.descripcion }}</p>

                    <div v-if="obj.indicadores?.length">
                      <h5 class="text-subtitle-1 mb-2">Indicadores asociados:</h5>
                      <IndicadoresLista :indicadores="obj.indicadores" />
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
            <div v-if="objetivos?.objetivos_especificos?.length" class="mb-6">
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-target" color="green" class="mr-2"></v-icon>
                <h4 class="text-h6">Objetivos Específicos</h4>
                <v-chip size="small" color="green" class="ml-2">
                  {{ objetivos.objetivos_especificos.length }}
                </v-chip>
              </div>
              <v-expansion-panels variant="accordion">
                <v-expansion-panel
                  v-for="(obj, index) in objetivos.objetivos_especificos"
                  :key="index"
                  class="mb-2"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex align-center">
                      <v-chip size="small" color="green" class="mr-2">
                        {{ obj.codigo }}
                      </v-chip>
                      <span
                        >{{ obj.descripcion.substring(0, 80)
                        }}{{ obj.descripcion.length > 80 ? '...' : '' }}</span
                      >
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <p class="mb-4">{{ obj.descripcion }}</p>

                    <div v-if="obj.indicadores?.length">
                      <h5 class="text-subtitle-1 mb-2">Indicadores asociados:</h5>
                      <IndicadoresLista :indicadores="obj.indicadores" />
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-card-text>
        </v-card>
        <!-- Sección de Resultados -->
        <v-card variant="outlined" elevation="1">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-format-list-checks" class="mr-2"></v-icon>
            <h4 class="text-h5">Resultados</h4>
            <v-chip size="small" color="primary" class="ml-2">
              {{ resultProdIndicadores?.data?.resultados?.length }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <div v-if="resultProdIndicadores?.data?.resultados?.length" class="mb-6">
              <v-expansion-panels variant="accordion">
                <v-expansion-panel
                  v-for="(obj, index) in resultProdIndicadores.data.resultados"
                  :key="index"
                  class="mb-2"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex align-center">
                      <v-chip size="small" color="green" class="mr-2">
                        {{ obj.codigo }}
                      </v-chip>
                      <span
                        >{{ obj.descripcion.substring(0, 80)
                        }}{{ obj.descripcion.length > 80 ? '...' : '' }}</span
                      >
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <p class="mb4">{{ obj.descripcion }}</p>
                    <div v-if="obj.indicadores?.length">
                      <h5 class="text-subtitle-1 mb-2">Indicadores asociados:</h5>
                      <IndicadoresLista :indicadores="obj.indicadores"></IndicadoresLista>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-card-text>
        </v-card>
        <!-- Sección de Productos -->
        <v-card variant="outlined" elevation="1">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-format-list-checks" class="mr-2"></v-icon>
            <h4 class="text-h5">Productos</h4>
            <v-chip size="small" color="primary" class="ml-2">
              {{ resultProdIndicadores?.data?.productos?.length }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <div v-if="resultProdIndicadores?.data?.productos?.length" class="mb-6">
              <v-expansion-panels variant="accordion">
                <v-expansion-panel
                  v-for="(obj, index) in resultProdIndicadores.data.productos"
                  :key="index"
                  class="mb-2"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex align-center">
                      <v-chip size="small" color="green" class="mr-2">
                        {{ obj.codigo }}
                      </v-chip>
                      <span
                        >{{ obj.descripcion.substring(0, 80)
                        }}{{ obj.descripcion.length > 80 ? '...' : '' }}</span
                      >
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <p class="mb4">{{ obj.descripcion }}</p>
                    <div v-if="obj.indicadores?.length">
                      <h5 class="text-subtitle-1 mb-2">Indicadores asociados:</h5>
                      <ProductosLista :indicadores="obj.indicadores"></ProductosLista>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Columna lateral -->
      <v-col cols="12" md="4" lg="3">
        <!-- Resumen del proyecto -->
        <v-card class="sticky-card" elevation="6">
          <v-card-title class="bg-primary text-white">
            <h3 class="text-h5">Resumen del Proyecto</h3>
          </v-card-title>
          <v-card-text>
            <!-- Progreso general -->
            <div class="d-flex align-center mb-4">
              <v-progress-circular
                :rotate="360"
                :size="80"
                :width="10"
                :model-value="porcentajeCompletado"
                color="primary"
              >
                <strong>{{ porcentajeCompletado }}%</strong>
              </v-progress-circular>

              <div class="ml-4">
                <div class="text-subtitle-1">Progreso total</div>
                <div class="text-caption text-grey">
                  Inicio: {{ formatDate(proyecto?.fecha_inicio) }}
                </div>
                <div class="text-caption text-grey">
                  Fin: {{ formatDate(proyecto?.fecha_finalizacion) }}
                </div>
              </div>
            </div>

            <!-- Presupuesto -->
            <v-divider class="my-3"></v-divider>
            <h3 class="mb-2">Presupuesto</h3>

            <div class="d-flex justify-space-between">
              <span>Utilizado</span>
              <span>${{ presupuestoUtilizado }} / ${{ proyecto?.presupuesto || 0 }}</span>
            </div>

            <v-progress-linear
              :model-value="porcentajePresupuestoUtilizado"
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
import { useProyectoStore, useResultProductStore } from '@/modules/proyecto/store/proyectoStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { getStatusColor, getEstadoTexto } from '@/utility/formatters'
import IndicadoresLista from '@/modules/proyecto/components/partials/IndicadoresLista.vue'
//import ResultadosLista from '@/modules/proyecto/components/partials/ResultadosLista.vue'
import ProductosLista from '@/modules/proyecto/components/partials/ProductosLista.vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
//Inicializar las rutas y obtener el id de proyecto
const ruta = useRoute()
const idproyecto = ruta.params.id
//Inicializar los stores
const proyectoStore = useProyectoStore()
const resultProdStore = useResultProductStore()

/*Desestructurar referencias*/
//proyectos
const {
  proyectoActual: proyecto,
  objetivosIndicadores: objetivos,
  cargando: cargandoProyecto,
  //error: errorProyecto,
} = storeToRefs(proyectoStore)
//Resultados y Productos
const {
  resulProductIndicadoresIdProyecto: resultProdIndicadores,
  cargando: cargandoResultProd,
  //error: errorResultProd,
} = storeToRefs(resultProdStore)
console.log(resultProdIndicadores)
/*Desestructurar funciones*/
//proyectos
const { obtenerProyectoPorId, objetivosIndPorIdProyecto } = proyectoStore
//Resultados y productos
const { proyResultProdIndPorIdProyecto } = resultProdStore

//Estado de carga
const cargandoGeneral = computed(() => cargandoProyecto.value || cargandoResultProd.value)

//Hook
onMounted(async () => {
  await cargarDatos()
})

//Funcion de carga de stores
const cargarDatos = async () => {
  try {
    await obtenerProyectoPorId(idproyecto)
    await objetivosIndPorIdProyecto(idproyecto)
    await proyResultProdIndPorIdProyecto(idproyecto)
  } catch (err) {
    console.log('Error al cargar la informacion stores', err)
  }
}

// Porcentaje de avance del proyecto
const porcentajeCompletado = computed(() => {
  // Lógica de ejemplo - calcularías esto basado en el progreso real
  return 0
})

/*
const indicadoresClave = computed(() => {
  return [
    { titulo: 'Total indicadores', valor: 3 },
    { titulo: 'Completados', valor: 1 },
    { titulo: 'Objetivos', valor: objetivos.objetivos_especificos.length },
    {
      titulo: 'Resultados',
      valor: resultProdIndicadores.filter((i) => i.tipo === 'resultado').length,
    },
  ]
})*/

const presupuestoUtilizado = computed(() => {
  return 0 // Ejemplo
})

const porcentajePresupuestoUtilizado = computed(() => {
  return (presupuestoUtilizado.value / proyecto.presupuesto) * 100
})

// Funciones de utilidad
const formatDate = (dateString) => {
  if (!dateString) return 'No definida'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

/*
const verDetalles = () => {
  console.log('Ver detalles del proyecto')
  alert('ver detalles del proyecto')
}*/
</script>

<style scoped>
/* Añade estos estilos para ajustar el espaciado entre tarjetas */
.v-card {
  margin-bottom: 24px; /* Aumenta el margen inferior */
}

/* Opcional: ajusta el espaciado específico para la última tarjeta si es necesario */
.v-card:last-child {
  margin-bottom: 0;
}
/* Estilos para hacer la tarjeta de resumen pegajosa */
.sticky-card {
  position: sticky;
  top: 20px;
}

/* Estilos generales para las tarjetas */
.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Efecto hover para las tarjetas */
.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Estilos para los paneles del acordeón */
.v-expansion-panel {
  border-radius: 6px !important;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
