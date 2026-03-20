<template>
  <!-- Overlay de carga - MOVER FUERA DEL CONTENEDOR -->
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
    persistent
    opacity="0.9"
    scrim="#000000"
    contained
  >
    <div class="text-center">
      <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
      <p class="mt-4 text-h6 text-white">Cargando informes de actividad...</p>
    </div>
  </v-overlay>

  <v-container v-if="!loading" class="informes-container">
    <div v-if="actividad">
      <!-- ENCABEZADO ORIGINAL RESTAURADO (simplificado) -->
      <PaginaTituloIcono
        :titulo="'Informes Actividad/Subactividad'"
        :icon="'mdi-clipboard-text-multiple'"
        class="mb-4"
      />
      <actividad-informacion :actividad-id="route.params.id"></actividad-informacion>

      <!-- Buscador General (estilo consistente con la muestra) -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="tarjeta-busqueda" elevation="2" rounded="lg">
            <v-card-text class="pa-5">
              <v-row>
                <v-col cols="12" md="7">
                  <v-text-field
                    v-model="searchQuery"
                    label="Buscar informes"
                    placeholder="Ej: INF-001, Reunión, Capacitación..."
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    bg-color="grey-lighten-4"
                    @keyup.enter="realizarBusqueda"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="searchType"
                    label="Tipo"
                    :items="tiposBusqueda"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    bg-color="grey-lighten-4"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="2" class="d-flex align-center">
                  <v-btn
                    color="primary"
                    variant="flat"
                    block
                    @click="realizarBusqueda"
                    :loading="searching"
                    class="btn-buscar"
                  >
                    <v-icon start icon="mdi-magnify"></v-icon>
                    Buscar
                  </v-btn>
                </v-col>
              </v-row>

              <!-- Resultados de búsqueda activa -->
              <transition name="slide-fade">
                <div v-if="searchActive" class="search-active-container mt-4">
                  <v-divider class="mb-4"></v-divider>
                  <div class="d-flex justify-space-between align-center">
                    <div class="d-flex align-center">
                      <v-chip color="primary" variant="flat" size="small" class="mr-2">
                        {{ resultadosBusqueda.length }}
                      </v-chip>
                      <span class="text-body-2 text-medium-emphasis">
                        resultado(s) encontrado(s) para
                        <span class="font-weight-bold">"{{ searchQuery }}"</span>
                      </span>
                    </div>
                    <v-btn color="secondary" variant="text" size="small" @click="limpiarBusqueda">
                      <v-icon start icon="mdi-close" size="small"></v-icon>
                      Limpiar
                    </v-btn>
                  </div>
                </div>
              </transition>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Resultados de búsqueda -->
      <transition name="slide-fade">
        <v-row v-if="searchActive && resultadosBusqueda.length > 0" class="mb-6">
          <v-col cols="12">
            <h4 class="text-h6 font-weight-medium mb-4 d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-file-find</v-icon>
              Resultados de búsqueda
            </h4>
            <v-row>
              <v-col
                v-for="informe in resultadosBusqueda"
                :key="informe.id"
                cols="12"
                md="6"
                lg="4"
              >
                <v-card
                  elevation="2"
                  rounded="lg"
                  class="informe-card"
                  :class="{
                    'informe-card-actividad': !informe.tarea,
                    'informe-card-tarea': informe.tarea,
                  }"
                >
                  <v-card-item>
                    <div class="d-flex justify-space-between align-start mb-3">
                      <div>
                        <div class="d-flex align-center">
                          <v-chip size="x-small" color="grey" variant="tonal" class="mr-2">
                            ID: {{ informe.id }}
                          </v-chip>
                          <v-card-title class="text-h6 pa-0 mb-1 font-weight-medium">
                            {{ informe.numeroInforme || 'Sin número' }}
                          </v-card-title>
                        </div>
                        <v-card-subtitle class="pa-0 d-flex align-center text-caption">
                          <v-icon icon="mdi-calendar" size="small" class="mr-1"></v-icon>
                          {{ formatDate(informe.fechaEjecucion) }}
                          <template v-if="informe.tarea">
                            <v-icon icon="mdi-chevron-right" size="small" class="mx-1"></v-icon>
                            <v-icon icon="mdi-folder" size="small" class="mr-1"></v-icon>
                            {{ informe.tarea.codigo }}
                          </template>
                        </v-card-subtitle>
                      </div>
                      <v-chip
                        size="x-small"
                        :color="informe.tarea ? 'info' : 'primary'"
                        variant="flat"
                      >
                        {{ informe.tarea ? 'Tarea' : 'Actividad' }}
                      </v-chip>
                    </div>
                  </v-card-item>

                  <v-card-text>
                    <div class="mb-3">
                      <div class="text-caption text-medium-emphasis mb-1">Objetivo</div>
                      <div class="text-body-2">
                        {{
                          truncarTexto(informe.objetivoActividad || informe.objetivoTarea, 80) ||
                          'Sin objetivo'
                        }}
                      </div>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <div class="d-flex justify-space-between">
                      <div class="text-center">
                        <div class="text-caption text-medium-emphasis mb-1">Planif.</div>
                        <div class="text-body-2 font-weight-medium text-primary">
                          Bs{{ formatNumber(informe.presupuestoPlanificado || 0) }}
                        </div>
                      </div>
                      <div class="text-center">
                        <div class="text-caption text-medium-emphasis mb-1">Ejec.</div>
                        <div
                          class="text-body-2 font-weight-medium"
                          :class="getEjecutadoColor(informe)"
                        >
                          Bs{{ formatNumber(informe.presupuestoEjecutado || 0) }}
                        </div>
                      </div>
                      <div class="text-center">
                        <div class="text-caption text-medium-emphasis mb-1">Avance</div>
                        <div
                          class="text-body-2 font-weight-medium"
                          :class="getAvanceColor(informe)"
                        >
                          {{ getAvancePorcentaje(informe) }}%
                        </div>
                      </div>
                    </div>

                    <div class="mt-3 d-flex flex-wrap gap-1">
                      <v-chip
                        v-if="informe.totalIndicadores > 0"
                        size="x-small"
                        color="success"
                        variant="tonal"
                      >
                        {{ informe.totalIndicadores }} indicadores
                      </v-chip>
                    </div>
                  </v-card-text>

                  <v-card-actions class="pa-4 pt-0">
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      variant="text"
                      size="x-small"
                      prepend-icon="mdi-eye"
                      @click="verDetalleInforme(informe.id)"
                      class="action-btn"
                    >
                      Ver
                    </v-btn>
                    <v-btn
                      color="secondary"
                      variant="text"
                      size="x-small"
                      prepend-icon="mdi-pencil"
                      @click="
                        informe.tarea ? editarInformeTarea(informe.id) : editarInforme(informe.id)
                      "
                      class="action-btn"
                    >
                      Editar
                    </v-btn>
                    <v-btn
                      color="success"
                      variant="text"
                      size="x-small"
                      prepend-icon="mdi-file-pdf-box"
                      @click="generarPDF(informe)"
                      class="action-btn"
                    >
                      PDF
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </transition>

      <!-- CONTENIDO PRINCIPAL -->
      <transition name="slide-fade">
        <v-row v-if="!searchActive">
          <!-- INFORMES DE ACTIVIDAD PRINCIPAL -->
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-4">
              <v-avatar color="primary" size="36" class="mr-3">
                <v-icon dark size="18">mdi-file-document-multiple</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-medium">Informes de Actividad Principal</h3>
              <v-chip class="ml-3" color="primary" variant="tonal" size="x-small">
                {{ informesActividad.length }}
              </v-chip>
            </div>

            <v-alert
              v-if="informesActividad.length === 0"
              type="info"
              variant="tonal"
              class="mb-4"
              density="compact"
            >
              No hay informes registrados para esta actividad.
            </v-alert>

            <div v-else class="informe-list">
              <v-row>
                <v-col v-for="informe in informesActividad" :key="informe.id" cols="12">
                  <v-card elevation="1" rounded="lg" class="informe-item" variant="outlined">
                    <v-card-item>
                      <div class="d-flex justify-space-between align-start mb-2">
                        <div>
                          <div class="d-flex align-center mb-1">
                            <v-chip size="x-small" color="primary" variant="tonal" class="mr-2">
                              ID: {{ informe.id }}
                            </v-chip>
                            <div class="text-subtitle-2 font-weight-medium">
                              {{ informe.numeroInforme || 'Sin número' }}
                            </div>
                          </div>
                          <div class="text-caption text-medium-emphasis">
                            <v-icon icon="mdi-calendar" size="x-small" class="mr-1"></v-icon>
                            {{ formatDate(informe.fechaEjecucion) }}
                          </div>
                        </div>
                        <v-chip
                          v-if="informe.tipoActividad"
                          size="x-small"
                          color="primary"
                          variant="tonal"
                        >
                          {{ truncarTexto(informe.tipoActividad, 15) }}
                        </v-chip>
                      </div>
                    </v-card-item>

                    <v-card-text class="pt-0">
                      <div class="text-caption text-medium-emphasis mb-1">Objetivo</div>
                      <div class="text-body-2 mb-3">
                        {{ informe.objetivoActividad || 'Sin objetivo' }}
                      </div>

                      <div class="d-flex justify-space-between">
                        <div>
                          <div class="text-caption text-medium-emphasis">Planif.</div>
                          <div class="text-body-2 font-weight-medium text-primary">
                            Bs{{ formatNumber(informe.presupuestoPlanificado) }}
                          </div>
                        </div>
                        <div>
                          <div class="text-caption text-medium-emphasis">Ejec.</div>
                          <div
                            class="text-body-2 font-weight-medium"
                            :class="getEjecutadoColor(informe)"
                          >
                            Bs{{ formatNumber(informe.presupuestoEjecutado) }}
                          </div>
                        </div>
                        <div>
                          <div class="text-caption text-medium-emphasis">Avance</div>
                          <div
                            class="text-body-2 font-weight-medium"
                            :class="getAvanceColor(informe)"
                          >
                            {{ getAvancePorcentaje(informe) }}%
                          </div>
                        </div>
                      </div>
                    </v-card-text>

                    <v-card-actions class="pa-3 pt-0">
                      <v-spacer></v-spacer>
                      <v-btn
                        size="x-small"
                        variant="text"
                        color="primary"
                        prepend-icon="mdi-eye"
                        @click="verDetalleInforme(informe.id)"
                        class="action-btn"
                      >
                        Ver
                      </v-btn>
                      <v-btn
                        size="x-small"
                        variant="text"
                        color="secondary"
                        prepend-icon="mdi-pencil"
                        @click="editarInforme(informe.id)"
                        class="action-btn"
                      >
                        Editar
                      </v-btn>
                      <v-btn
                        size="x-small"
                        variant="text"
                        color="success"
                        prepend-icon="mdi-file-pdf-box"
                        :loading="pdfGenerandoActividad"
                        :disabled="pdfGenerandoActividad"
                        @click="generarPDFActividad(informe)"
                        class="action-btn"
                      >
                        PDF
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <!-- INFORMES DE TAREAS/SUBACTIVIDADES -->
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-4">
              <v-avatar color="info" size="36" class="mr-3">
                <v-icon dark size="18">mdi-file-tree</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-medium">Informes de Subactividad</h3>
              <v-chip class="ml-3" color="info" variant="tonal" size="x-small">
                {{ totalInformesTareas }}
              </v-chip>
            </div>

            <v-alert
              v-if="actividad.tareas?.length === 0"
              type="info"
              variant="tonal"
              class="mb-4"
              density="compact"
            >
              No hay informes de subactividad registrados.
            </v-alert>

            <div v-else class="tareas-container">
              <v-expansion-panels v-model="expandedPanels" multiple variant="accordion">
                <v-expansion-panel
                  v-for="tarea in actividad.tareas"
                  :key="tarea.id"
                  elevation="1"
                  rounded="lg"
                  class="mb-3 tarea-panel"
                >
                  <v-expansion-panel-title class="py-3">
                    <template v-slot:default>
                      <v-row no-gutters>
                        <v-col cols="12" md="8" class="d-flex align-center">
                          <v-avatar :color="getEstadoColor(tarea.estado)" size="32" class="mr-3">
                            <v-icon dark size="14">mdi-folder</v-icon>
                          </v-avatar>
                          <div>
                            <div class="text-subtitle-2 font-weight-medium">{{ tarea.titulo }}</div>
                            <div class="text-caption text-medium-emphasis">
                              <v-icon icon="mdi-tag" size="x-small" class="mr-1"></v-icon>
                              {{ tarea.codigo }}
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex align-center justify-end">
                          <div class="text-end">
                            <div class="text-caption text-medium-emphasis">Informes</div>
                            <div class="text-subtitle-2 font-weight-bold">
                              {{ tarea.informes_tarea?.length || 0 }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <v-alert
                      v-if="tarea.informes_tarea?.length === 0"
                      type="info"
                      variant="tonal"
                      density="compact"
                      class="mb-3"
                    >
                      No hay informes para esta tarea.
                    </v-alert>

                    <div v-else>
                      <v-row>
                        <v-col v-for="informe in tarea.informes_tarea" :key="informe.id" cols="12">
                          <v-card
                            elevation="0"
                            rounded="lg"
                            variant="outlined"
                            class="tarea-informe-item"
                          >
                            <v-card-item class="pa-3">
                              <div class="d-flex justify-space-between align-start">
                                <div>
                                  <div class="d-flex align-center mb-1">
                                    <v-chip
                                      size="x-small"
                                      color="info"
                                      variant="tonal"
                                      class="mr-2"
                                    >
                                      ID: {{ informe.id }}
                                    </v-chip>
                                    <div class="text-subtitle-2 font-weight-medium">
                                      {{ informe.numeroInforme || 'Sin número' }}
                                    </div>
                                  </div>
                                  <div class="text-caption text-medium-emphasis">
                                    <v-icon
                                      icon="mdi-calendar"
                                      size="x-small"
                                      class="mr-1"
                                    ></v-icon>
                                    {{ formatDate(informe.fechaEjecucion) }}
                                  </div>
                                </div>
                              </div>
                            </v-card-item>

                            <v-card-text class="pa-3 pt-0">
                              <div class="d-flex justify-space-between align-center">
                                <div>
                                  <div class="text-caption text-medium-emphasis">Planif.</div>
                                  <div class="text-caption font-weight-medium text-primary">
                                    Bs{{ formatNumber(informe.presupuestoPlanificado) }}
                                  </div>
                                </div>
                                <div>
                                  <div class="text-caption text-medium-emphasis">Ejec.</div>
                                  <div
                                    class="text-caption font-weight-medium"
                                    :class="getEjecutadoColor(informe)"
                                  >
                                    Bs{{ formatNumber(informe.presupuestoEjecutado) }}
                                  </div>
                                </div>
                                <div>
                                  <div class="text-caption text-medium-emphasis">Avance</div>
                                  <div
                                    class="text-caption font-weight-medium"
                                    :class="getAvanceColor(informe)"
                                  >
                                    {{ getAvancePorcentaje(informe) }}%
                                  </div>
                                </div>
                              </div>
                            </v-card-text>

                            <v-card-actions class="pa-3 pt-0">
                              <v-spacer></v-spacer>
                              <v-btn
                                size="x-small"
                                variant="text"
                                color="primary"
                                prepend-icon="mdi-eye"
                                @click="verDetalleInformeTarea(informe.id)"
                                class="action-btn"
                              >
                                Ver
                              </v-btn>
                              <v-btn
                                size="x-small"
                                variant="text"
                                color="secondary"
                                prepend-icon="mdi-pencil"
                                @click="editarInformeTarea(informe.id)"
                                class="action-btn"
                              >
                                Editar
                              </v-btn>
                              <v-btn
                                size="x-small"
                                variant="text"
                                color="success"
                                prepend-icon="mdi-file-pdf-box"
                                :loading="pdfGenerandoTarea"
                                :disabled="pdfGenerandoTarea"
                                @click="generarPDFTarea(informe)"
                                class="action-btn"
                              >
                                PDF
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-col>
                      </v-row>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-col>
        </v-row>
      </transition>
    </div>

    <!-- Error mejorado -->
    <transition name="slide-fade">
      <v-alert v-if="error && !loading" type="error" variant="tonal" class="mb-4" density="compact">
        <div class="d-flex align-center">
          <div class="flex-grow-1">{{ error }}</div>
          <v-btn color="error" variant="text" @click="cargarDatos" size="small">
            <v-icon start icon="mdi-refresh" size="small"></v-icon>
            Reintentar
          </v-btn>
        </div>
      </v-alert>
    </transition>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInfPrinActTareaListaStore } from '@/modules/formularios/store/useInfPrinActTareaListaStore'
import { useRoute } from 'vue-router'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { useImpresionFormularios } from '@/modules/impresiones/composables/useImpresionFormularios'

// Store y router
const storeListasInformes = useInfPrinActTareaListaStore()
const router = useRouter()
const route = useRoute()
const { successMsg, errorMsg } = useSnackbar()

// Estado
const loading = ref(false)
const error = ref(null)
const expandedPanels = ref([])

// Estado para búsqueda
const searchQuery = ref('')
const searchType = ref('todos')
const searching = ref(false)
const searchActive = ref(false)

const tiposBusqueda = ref([
  { title: 'Todos los informes', value: 'todos' },
  { title: 'Solo actividad principal', value: 'principal' },
  { title: 'Solo informes de tareas', value: 'tareas' },
])

// ============================================================
// Computed properties
// ============================================================
const actividad = computed(() => storeListasInformes.actividadDetalles?.data || null)

const informesActividad = computed(() => {
  return actividad.value?.informes_actividad || []
})

const totalInformesTareas = computed(() => {
  if (!actividad.value?.tareas) return 0
  return actividad.value.tareas.reduce((total, tarea) => {
    return total + (tarea.informes_tarea?.length || 0)
  }, 0)
})

const resultadosBusqueda = computed(() => {
  if (!searchActive.value || !searchQuery.value) return []

  let todosInformes = []

  // Agregar informes de actividad principal
  if (actividad.value?.informes_actividad) {
    todosInformes = todosInformes.concat(
      actividad.value.informes_actividad.map((informe) => ({
        ...informe,
        tarea: null,
        origen: 'actividad',
        totalIndicadores: informe.avanceIndicadores?.metadatos?.total_general || 0,
      })),
    )
  }

  // Agregar informes de tareas
  if (actividad.value?.tareas) {
    actividad.value.tareas.forEach((tarea) => {
      if (tarea.informes_tarea) {
        todosInformes = todosInformes.concat(
          tarea.informes_tarea.map((informe) => ({
            ...informe,
            tarea: {
              id: tarea.id,
              codigo: tarea.codigo,
              titulo: tarea.titulo,
            },
            origen: 'tarea',
            totalIndicadores: informe.avanceIndicadores?.metadatos?.total_general || 0,
          })),
        )
      }
    })
  }

  // Aplicar filtros
  let resultados = todosInformes

  // Filtro por tipo de búsqueda
  if (searchType.value === 'principal') {
    resultados = resultados.filter((informe) => informe.origen === 'actividad')
  } else if (searchType.value === 'tareas') {
    resultados = resultados.filter((informe) => informe.origen === 'tarea')
  }

  // Filtro por texto de búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    resultados = resultados.filter((informe) => {
      return (
        (informe.numeroInforme && informe.numeroInforme.toLowerCase().includes(query)) ||
        (informe.objetivoActividad && informe.objetivoActividad.toLowerCase().includes(query)) ||
        (informe.objetivoTarea && informe.objetivoTarea.toLowerCase().includes(query)) ||
        (informe.tipoActividad && informe.tipoActividad.toLowerCase().includes(query)) ||
        (informe.tarea &&
          informe.tarea.titulo &&
          informe.tarea.titulo.toLowerCase().includes(query)) ||
        (informe.tarea &&
          informe.tarea.codigo &&
          informe.tarea.codigo.toLowerCase().includes(query))
      )
    })
  }

  return resultados
})

// Métodos
const cargarDatos = async () => {
  loading.value = true
  error.value = null
  try {
    await storeListasInformes.cargarActividadDetallesPorId(route.params.id)
  } catch (err) {
    error.value = err.message || 'Error al cargar los datos'
    console.error('Error cargando datos:', err)
  } finally {
    loading.value = false
  }
}

const realizarBusqueda = () => {
  if (!searchQuery.value) {
    searchActive.value = false
    return
  }
  searching.value = true
  searchActive.value = true
  setTimeout(() => {
    searching.value = false
  }, 300)
}

const limpiarBusqueda = () => {
  searchQuery.value = ''
  searchActive.value = false
  searchType.value = 'todos'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatNumber = (num) => {
  const number = parseFloat(num) || 0
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const truncarTexto = (texto, longitud) => {
  if (!texto) return ''
  return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto
}

const getEstadoColor = (estado) => {
  const colores = {
    PLAN: 'info',
    PLANIFICADA: 'info',
    EJEC: 'warning',
    COMPL: 'success',
    CANC: 'error',
    PEN: 'grey',
    TER: 'success',
  }
  return colores[estado] || 'grey'
}

const getEjecutadoColor = (informe) => {
  const porcentaje = getAvancePorcentaje(informe)
  if (porcentaje >= 100) return 'text-success'
  if (porcentaje >= 80) return 'text-info'
  if (porcentaje >= 50) return 'text-warning'
  return 'text-error'
}

const getAvanceColor = (informe) => {
  return getEjecutadoColor(informe)
}

const getAvancePorcentaje = (informe) => {
  const ejecutado = parseFloat(informe.presupuestoEjecutado) || 0
  const planificado = parseFloat(informe.presupuestoPlanificado) || 1
  return Math.min(100, Math.round((ejecutado / planificado) * 100))
}

// ============================================================
// Métodos de navegación
// ============================================================
const verDetalleInforme = (informeId) => {
  router.push('/monitoreo/informe-actividad-ver/' + informeId)
}

const verDetalleInformeTarea = (informeId) => {
  successMsg(`Ver detalle de la tarea ${informeId} - Funcionalidad en desarrollo`)
}

const editarInforme = (informeId) => {
  successMsg(`Funcionalidad de edición en desarrollo para el informe ${informeId}`)
}

const editarInformeTarea = (informeId) => {
  successMsg(`Funcionalidad de edición en desarrollo para la tarea ${informeId}`)
}

const generarPDF = (informe) => {
  successMsg(`Generando PDF del informe ${informe.numeroInforme}`)
}
/*********************** Descarga de reportes ******************************************/
const pdfGenerandoActividad = ref(false)
const pdfGenerandoTarea = ref(false)
//Composable
const { generarPdfInformeActividadPrincipal, generarPdfInformeTareaPrincipal } =
  useImpresionFormularios()

const generarPDFActividad = async (informe) => {
  pdfGenerandoActividad.value = true
  try {
    await generarPdfInformeActividadPrincipal(informe.id)
    successMsg('Informe de Actividad - PDF Generado')
  } catch (err) {
    console.error('Error generando PDF de actividad:', err)
    errorMsg(`Error al generar PDF de actividad: ${err.message}`)
  } finally {
    pdfGenerandoActividad.value = false
  }
}

const generarPDFTarea = async (informe) => {
  pdfGenerandoTarea.value = true
  try {
    await generarPdfInformeTareaPrincipal(informe.id)
    successMsg('Informe de Subactividad - PDF Generado')
  } catch (err) {
    console.error('Error generando PDF de subactividad:', err)
    errorMsg(`Error al generar PDF de subactividad: ${err.message}`)
  } finally {
    pdfGenerandoTarea.value = false
  }
}

// Hook de ciclo de vida
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
/* Estilos base - consistentes con la muestra */
.informes-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 16px;
  position: relative;
}

/* Tarjeta de búsqueda */
.tarjeta-busqueda {
  background: white;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.btn-buscar {
  height: 40px !important;
  text-transform: none !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
}

.btn-buscar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(25, 118, 210, 0.25) !important;
}

.search-active-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
}

/* Tarjetas de informe - con efecto flotante */
.informe-card {
  background: white;
  border: 1px solid #e0e0e0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  position: relative;
  top: 0;
}

.informe-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  border-color: #1976d2;
  z-index: 10;
}

.informe-card-actividad {
  border-left: 3px solid #1976d2;
}

.informe-card-tarea {
  border-left: 3px solid #f57c00;
}

.informe-card-tarea:hover {
  border-color: #f57c00;
}

.informe-item {
  background: white;
  border: 1px solid #e0e0e0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  top: 0;
}

.informe-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12) !important;
  border-color: #1976d2;
  background: white;
}

/* Tareas */
.tareas-container {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.tareas-container::-webkit-scrollbar {
  width: 4px;
}

.tareas-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.tareas-container::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

.tarea-panel {
  background: white;
  border: 1px solid #e0e0e0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  top: 0;
}

.tarea-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(245, 124, 0, 0.15) !important;
  border-color: #f57c00;
  z-index: 5;
}

.tarea-informe-item {
  background: white;
  border: 1px solid #e0e0e0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 8px;
  position: relative;
  top: 0;
}

.tarea-informe-item:hover {
  transform: translateX(4px) translateY(-2px);
  box-shadow: 0 6px 12px rgba(245, 124, 0, 0.15) !important;
  border-color: #f57c00;
  background: white;
  z-index: 5;
}

/* Botones de acción */
.action-btn {
  transition: all 0.2s ease !important;
}

.action-btn:hover {
  background-color: rgba(25, 118, 210, 0.1) !important;
  transform: translateY(-1px);
}

/* Utilidades */
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Estados de texto */
.text-error {
  color: #f44336;
}
.text-warning {
  color: #ff9800;
}
.text-info {
  color: #2196f3;
}
.text-success {
  color: #4caf50;
}

/* Transiciones */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 960px) {
  .informes-container {
    padding: 16px 12px;
  }

  .tareas-container {
    max-height: none;
    overflow-y: visible;
    padding-right: 0;
  }

  .informe-card:hover,
  .informe-item:hover,
  .tarea-panel:hover,
  .tarea-informe-item:hover {
    transform: translateY(-2px);
  }
}

@media (max-width: 600px) {
  .btn-buscar {
    height: 44px !important;
  }
}
</style>
