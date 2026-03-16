<template>
  <v-container class="actividad-informes-container">
    <!-- Overlay de carga -->
    <v-overlay :model-value="loading" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando informes de actividad...</p>
      </div>
    </v-overlay>

    <div v-if="!loading && actividad">
      <!-- ENCABEZADO ORIGINAL RESTAURADO -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-sheet class="header-sheet pa-6 rounded-lg" elevation="1">
            <PaginaTituloIcono
              :titulo="'Informes Actividad/Subactividad'"
              :icon="'mdi-clipboard-text-multiple'"
              class="mb-4"
            />
            <actividad-informacion :actividad-id="route.params.id"></actividad-informacion>

            <!-- Información adicional de la actividad -->
            <v-row class="mt-4">
              <v-col cols="12" md="3">
                <div class="text-caption text-medium-emphasis">Código</div>
                <div class="font-weight-bold">{{ actividad.codigo }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-caption text-medium-emphasis">Estado</div>
                <v-chip :color="getEstadoColor(actividad.estado)" size="small">
                  {{ actividad.estado }}
                </v-chip>
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-caption text-medium-emphasis">Presupuesto</div>
                <div class="font-weight-bold">Bs{{ formatNumber(actividad.presupuesto) }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-caption text-medium-emphasis">Ejecutado</div>
                <div class="font-weight-bold text-success">
                  Bs{{ formatNumber(actividad.totalEjecutado) }}
                </div>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>

      <!-- CARDS DE ESTADÍSTICAS REDUCIDAS (SOLO 3) -->
      <v-row class="mb-6">
        <v-col cols="12" md="4" v-for="(stat, index) in estadisticas" :key="index">
          <v-card elevation="2" rounded="lg" class="stat-card" :class="`stat-${stat.color}`">
            <v-card-text class="pa-4">
              <div class="d-flex align-center">
                <v-avatar :color="stat.color" size="52" class="mr-4 stat-avatar">
                  <v-icon dark size="24">{{ stat.icon }}</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 text-medium-emphasis font-weight-medium">
                    {{ stat.title }}
                  </div>
                  <div class="text-h4 font-weight-bold stat-value">{{ stat.value }}</div>
                  <div class="text-caption text-medium-emphasis mt-1">{{ stat.subtitle }}</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- BUSCADOR GENERAL -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card elevation="2" rounded="lg" class="search-card">
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
                    bg-color="white"
                    class="search-input"
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
                    bg-color="white"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="2" class="d-flex align-center">
                  <v-btn
                    color="primary"
                    variant="flat"
                    block
                    @click="realizarBusqueda"
                    :loading="searching"
                    size="x-large"
                    height="56"
                    class="search-btn"
                  >
                    <v-icon start icon="mdi-magnify" size="large"></v-icon>
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
                    <v-btn
                      color="secondary"
                      variant="text"
                      size="small"
                      @click="limpiarBusqueda"
                      class="clear-search-btn"
                    >
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

      <!-- RESULTADOS DE BÚSQUEDA -->
      <transition name="slide-fade">
        <v-row v-if="searchActive && resultadosBusqueda.length > 0" class="mb-6">
          <v-col cols="12">
            <h4 class="text-h6 font-weight-bold mb-4 d-flex align-center">
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
                  class="h-100 informe-card"
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
                          <v-card-title class="text-h6 pa-0 mb-1 font-weight-bold">
                            {{ informe.numeroInforme || 'Sin número' }}
                          </v-card-title>
                        </div>
                        <v-card-subtitle class="pa-0 d-flex align-center">
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
                        size="small"
                        :color="informe.tarea ? 'info' : 'primary'"
                        variant="flat"
                        class="origin-chip"
                      >
                        <v-icon
                          start
                          :icon="informe.tarea ? 'mdi-file-tree' : 'mdi-file-document'"
                          size="x-small"
                        ></v-icon>
                        {{ informe.tarea ? 'Tarea' : 'Actividad' }}
                      </v-chip>
                    </div>
                  </v-card-item>

                  <v-card-text>
                    <div class="mb-3">
                      <div class="text-caption text-medium-emphasis mb-1">
                        <v-icon icon="mdi-bullseye-arrow" size="x-small" class="mr-1"></v-icon>
                        Objetivo
                      </div>
                      <div class="text-body-2 informe-objetivo">
                        {{
                          truncarTexto(informe.objetivoActividad || informe.objetivoTarea, 80) ||
                          'Sin objetivo'
                        }}
                      </div>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <div class="d-flex justify-space-between">
                      <div class="text-center">
                        <div class="text-caption text-medium-emphasis mb-1">Planificado</div>
                        <div class="text-body-1 font-weight-bold text-primary">
                          Bs{{ formatNumber(informe.presupuestoPlanificado || 0) }}
                        </div>
                      </div>
                      <div class="text-center">
                        <div class="text-caption text-medium-emphasis mb-1">Ejecutado</div>
                        <div
                          class="text-body-1 font-weight-bold"
                          :class="getEjecutadoColor(informe)"
                        >
                          Bs{{ formatNumber(informe.presupuestoEjecutado || 0) }}
                        </div>
                      </div>
                      <div class="text-center">
                        <div class="text-caption text-medium-emphasis mb-1">Avance</div>
                        <div class="text-body-1 font-weight-bold" :class="getAvanceColor(informe)">
                          {{ getAvancePorcentaje(informe) }}%
                        </div>
                      </div>
                    </div>

                    <!-- Indicadores de estado del informe -->
                    <div class="mt-3 d-flex flex-wrap gap-1">
                      <v-chip
                        v-if="informe.tieneDesglose"
                        size="x-small"
                        color="info"
                        variant="tonal"
                      >
                        <v-icon start icon="mdi-cash" size="x-small"></v-icon>
                        Desglose
                      </v-chip>
                      <v-chip
                        v-if="informe.totalIndicadores > 0"
                        size="x-small"
                        color="success"
                        variant="tonal"
                      >
                        <v-icon start icon="mdi-chart-line" size="x-small"></v-icon>
                        {{ informe.totalIndicadores }} indicadores
                      </v-chip>
                    </div>
                  </v-card-text>

                  <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      variant="text"
                      size="small"
                      prepend-icon="mdi-eye"
                      @click="
                        informe.tarea
                          ? verDetalleInformeTarea(informe.id)
                          : verDetalleInforme(informe.id)
                      "
                      class="action-btn"
                    >
                      Ver
                    </v-btn>
                    <v-btn
                      color="secondary"
                      variant="text"
                      size="small"
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
                      size="small"
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
              <v-avatar color="primary" size="40" class="mr-3">
                <v-icon dark>mdi-file-document-multiple</v-icon>
              </v-avatar>
              <h3 class="text-h5 font-weight-bold">Informes de Actividad Principal</h3>
              <v-chip class="ml-3" color="primary" variant="flat" size="small">
                {{ informesActividad.length }}
              </v-chip>
            </div>

            <v-alert
              v-if="informesActividad.length === 0"
              type="info"
              variant="tonal"
              class="mb-4 empty-alert"
              icon="mdi-information"
            >
              No hay informes registrados para esta actividad.
            </v-alert>

            <div v-else class="informe-list">
              <v-row>
                <v-col v-for="informe in informesActividad" :key="informe.id" cols="12">
                  <v-card elevation="2" rounded="lg" class="informe-card">
                    <v-card-item>
                      <div class="d-flex justify-space-between align-start mb-2">
                        <div>
                          <div class="d-flex align-center mb-1">
                            <v-chip size="x-small" color="primary" variant="tonal" class="mr-2">
                              ID: {{ informe.id }}
                            </v-chip>
                            <v-card-title class="text-h6 pa-0 font-weight-bold">
                              {{ informe.numeroInforme || 'Sin número' }}
                            </v-card-title>
                          </div>
                          <v-card-subtitle class="pa-0">
                            <v-icon icon="mdi-calendar" size="small" class="mr-1"></v-icon>
                            {{ formatDate(informe.fechaEjecucion) }}
                          </v-card-subtitle>
                        </div>
                        <v-chip
                          v-if="informe.tipoActividad"
                          size="small"
                          color="primary"
                          variant="flat"
                        >
                          {{ truncarTexto(informe.tipoActividad, 20) }}
                        </v-chip>
                      </div>
                    </v-card-item>

                    <v-card-text>
                      <div class="mb-3">
                        <div class="text-caption text-medium-emphasis mb-1">
                          <v-icon icon="mdi-bullseye-arrow" size="x-small" class="mr-1"></v-icon>
                          Objetivo
                        </div>
                        <div class="text-body-2">
                          {{ informe.objetivoActividad || 'Sin objetivo especificado' }}
                        </div>
                      </div>

                      <v-divider class="my-3"></v-divider>

                      <div class="d-flex justify-space-between">
                        <div class="text-center">
                          <div class="text-caption text-medium-emphasis mb-1">Planificado</div>
                          <div class="text-body-1 font-weight-bold text-primary">
                            Bs{{ formatNumber(informe.presupuestoPlanificado) }}
                          </div>
                        </div>
                        <div class="text-center">
                          <div class="text-caption text-medium-emphasis mb-1">Ejecutado</div>
                          <div
                            class="text-body-1 font-weight-bold"
                            :class="getEjecutadoColor(informe)"
                          >
                            Bs{{ formatNumber(informe.presupuestoEjecutado) }}
                          </div>
                        </div>
                        <div class="text-center">
                          <div class="text-caption text-medium-emphasis mb-1">Avance</div>
                          <div
                            class="text-body-1 font-weight-bold"
                            :class="getAvanceColor(informe)"
                          >
                            {{ getAvancePorcentaje(informe) }}%
                          </div>
                        </div>
                      </div>

                      <div class="mt-2 d-flex flex-wrap gap-1">
                        <v-chip
                          v-if="informe.avanceIndicadores?.metadatos?.total_general"
                          size="x-small"
                          color="success"
                          variant="tonal"
                        >
                          <v-icon start icon="mdi-chart-line" size="x-small"></v-icon>
                          {{ informe.avanceIndicadores.metadatos.total_general }} indicadores
                        </v-chip>
                      </div>
                    </v-card-text>

                    <v-card-actions class="pa-4">
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        variant="text"
                        size="small"
                        prepend-icon="mdi-eye"
                        @click="verDetalleInforme(informe.id)"
                        class="action-btn"
                      >
                        Ver
                      </v-btn>
                      <v-btn
                        color="secondary"
                        variant="text"
                        size="small"
                        prepend-icon="mdi-pencil"
                        @click="editarInforme(informe.id)"
                        class="action-btn"
                      >
                        Editar
                      </v-btn>
                      <v-btn
                        color="success"
                        variant="text"
                        size="small"
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
            </div>
          </v-col>

          <!-- INFORMES DE TAREAS/SUBACTIVIDADES -->
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-4">
              <v-avatar color="orange" size="40" class="mr-3">
                <v-icon dark>mdi-file-tree</v-icon>
              </v-avatar>
              <h3 class="text-h5 font-weight-bold">Informes de Subactividad</h3>
              <v-chip class="ml-3" color="orange" variant="flat" size="small">
                {{ totalInformesTareas }}
              </v-chip>
            </div>

            <v-alert
              v-if="actividad.tareas?.length === 0"
              type="info"
              variant="tonal"
              class="mb-4 empty-alert"
              icon="mdi-information"
            >
              No hay informes de subactividad registrados para esta actividad.
            </v-alert>

            <div v-else class="tareas-container">
              <v-expansion-panels
                v-model="expandedPanels"
                multiple
                variant="accordion"
                class="tareas-panels"
              >
                <v-expansion-panel
                  v-for="tarea in actividad.tareas"
                  :key="tarea.id"
                  elevation="2"
                  rounded="lg"
                  class="mb-3 tarea-panel"
                >
                  <v-expansion-panel-title expand-icon="mdi-chevron-down" class="py-4">
                    <template v-slot:default="{ expanded }">
                      <v-row no-gutters>
                        <v-col cols="12" md="8" class="d-flex align-center">
                          <v-avatar :color="getEstadoColor(tarea.estado)" size="40" class="mr-3">
                            <v-icon dark>{{ expanded ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
                          </v-avatar>
                          <div>
                            <div class="font-weight-bold text-body-1">{{ tarea.titulo }}</div>
                            <div class="text-caption text-medium-emphasis">
                              <v-icon icon="mdi-tag" size="x-small" class="mr-1"></v-icon>
                              {{ tarea.codigo }}
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex align-center justify-end">
                          <div class="text-end">
                            <div class="text-caption text-medium-emphasis">
                              <v-icon icon="mdi-file-document" size="x-small" class="mr-1"></v-icon>
                              Informes
                            </div>
                            <div class="text-h6 font-weight-bold">
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
                      class="mb-4"
                      icon="mdi-information"
                    >
                      No hay informes para esta tarea.
                    </v-alert>

                    <div v-else>
                      <v-row>
                        <v-col v-for="informe in tarea.informes_tarea" :key="informe.id" cols="12">
                          <v-card
                            elevation="1"
                            rounded="lg"
                            variant="outlined"
                            class="tarea-informe-card"
                          >
                            <v-card-item>
                              <div class="d-flex justify-space-between align-start">
                                <div>
                                  <div class="d-flex align-center mb-1">
                                    <v-chip
                                      size="x-small"
                                      color="orange"
                                      variant="tonal"
                                      class="mr-2"
                                    >
                                      ID: {{ informe.id }}
                                    </v-chip>
                                    <div class="text-body-1 font-weight-bold">
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
                                <v-chip v-if="informe.tipoActividad" size="x-small" color="info">
                                  {{ truncarTexto(informe.tipoActividad, 15) }}
                                </v-chip>
                              </div>
                            </v-card-item>

                            <v-card-text>
                              <div class="d-flex justify-space-between align-center">
                                <div>
                                  <div class="text-caption text-medium-emphasis">Planificado</div>
                                  <div class="text-body-2 font-weight-bold text-primary">
                                    Bs{{ formatNumber(informe.presupuestoPlanificado) }}
                                  </div>
                                </div>
                                <div>
                                  <div class="text-caption text-medium-emphasis">Ejecutado</div>
                                  <div
                                    class="text-body-2 font-weight-bold"
                                    :class="getEjecutadoColor(informe)"
                                  >
                                    Bs{{ formatNumber(informe.presupuestoEjecutado) }}
                                  </div>
                                </div>
                                <div>
                                  <div class="text-caption text-medium-emphasis">Avance</div>
                                  <div
                                    class="text-body-2 font-weight-bold"
                                    :class="getAvanceColor(informe)"
                                  >
                                    {{ getAvancePorcentaje(informe) }}%
                                  </div>
                                </div>
                              </div>

                              <div v-if="informe.objetivoTarea" class="mt-3">
                                <div class="text-caption text-medium-emphasis">
                                  <v-icon
                                    icon="mdi-bullseye-arrow"
                                    size="x-small"
                                    class="mr-1"
                                  ></v-icon>
                                  Objetivo:
                                </div>
                                <div class="text-body-2">
                                  {{ truncarTexto(informe.objetivoTarea, 80) }}
                                </div>
                              </div>

                              <div class="mt-2 d-flex flex-wrap gap-1">
                                <v-chip
                                  v-if="informe.avanceIndicadores?.metadatos?.total_general"
                                  size="x-small"
                                  color="success"
                                  variant="tonal"
                                >
                                  <v-icon start icon="mdi-chart-line" size="x-small"></v-icon>
                                  {{ informe.avanceIndicadores.metadatos.total_general }}
                                  indicadores
                                </v-chip>
                              </div>
                            </v-card-text>

                            <v-card-actions class="pa-3">
                              <v-spacer></v-spacer>
                              <v-btn
                                size="x-small"
                                variant="text"
                                color="primary"
                                prepend-icon="mdi-eye"
                                @click="verDetalleInformeTarea(informe.id)"
                              >
                                Ver
                              </v-btn>
                              <v-btn
                                size="x-small"
                                variant="text"
                                color="secondary"
                                prepend-icon="mdi-pencil"
                                @click="editarInformeTarea(informe.id)"
                              >
                                Editar
                              </v-btn>
                              <v-btn
                                size="x-small"
                                variant="text"
                                color="success"
                                prepend-icon="mdi-file-pdf-box"
                                @click="generarPDF(informe)"
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
      <v-alert
        v-if="error && !loading"
        type="error"
        variant="tonal"
        class="mb-4 error-alert"
        icon="mdi-alert-circle"
      >
        <div class="d-flex align-center">
          <div class="flex-grow-1">{{ error }}</div>
          <v-btn color="error" variant="text" @click="cargarDatos" size="small">
            <v-icon start icon="mdi-refresh"></v-icon>
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

// Store y router
const storeListasInformes = useInfPrinActTareaListaStore()
const router = useRouter()
const route = useRoute()
const { successMsg } = useSnackbar()

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

const totalIndicadoresGlobal = computed(() => {
  let total = 0
  informesActividad.value.forEach((informe) => {
    total += informe.avanceIndicadores?.metadatos?.total_general || 0
  })
  actividad.value?.tareas?.forEach((tarea) => {
    tarea.informes_tarea?.forEach((informe) => {
      total += informe.avanceIndicadores?.metadatos?.total_general || 0
    })
  })
  return total
})

const estadisticas = computed(() => [
  {
    title: 'Informes Actividad Principal',
    value: informesActividad.value.length,
    subtitle: 'Total de informes',
    icon: 'mdi-file-document-multiple',
    color: 'blue',
  },
  {
    title: 'Informes de Tareas',
    value: totalInformesTareas.value,
    subtitle: 'Total por tarea',
    icon: 'mdi-file-document',
    color: 'green',
  },
  {
    title: 'Indicadores Registrados',
    value: totalIndicadoresGlobal.value,
    subtitle: 'Total de indicadores',
    icon: 'mdi-chart-line',
    color: 'purple',
  },
])

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
        tieneDesglose: !!informe.desglosePresupuesto,
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
            tieneDesglose: !!informe.desglosePresupuesto,
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
    PLAN: 'blue',
    PLANIFICADA: 'blue',
    EJEC: 'orange',
    COMP: 'green',
    CANC: 'red',
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
  const porcentaje = getAvancePorcentaje(informe)
  if (porcentaje >= 100) return 'text-success'
  if (porcentaje >= 80) return 'text-info'
  if (porcentaje >= 50) return 'text-warning'
  return 'text-error'
}

const getAvancePorcentaje = (informe) => {
  const ejecutado = parseFloat(informe.presupuestoEjecutado) || 0
  const planificado = parseFloat(informe.presupuestoPlanificado) || 1
  return Math.min(100, Math.round((ejecutado / planificado) * 100))
}

// ============================================================
// Métodos de navegación - MODIFICADOS
// ============================================================
const verDetalleInforme = (informeId) => {
  console.log('Ver detalle informe:', informeId)
  router.push('/monitoreo/informe-actividad-ver/' + informeId)
  // successMsg(`Ver detalle del informe ${informeId} - Funcionalidad en desarrollo`)
}

const verDetalleInformeTarea = (informeId) => {
  console.log('Ver detalle tarea:', informeId)
  successMsg(`Ver detalle de la tarea ${informeId} - Funcionalidad en desarrollo`)
}

const editarInforme = (informeId) => {
  console.log('Editar informe:', informeId)
  successMsg(`Funcionalidad de edición en desarrollo para el informe ${informeId}`)
}

const editarInformeTarea = (informeId) => {
  console.log('Editar informe tarea:', informeId)
  successMsg(`Funcionalidad de edición en desarrollo para la tarea ${informeId}`)
}

const generarPDF = (informe) => {
  console.log('Generando PDF para:', informe.numeroInforme)
  successMsg(`Generando PDF del informe ${informe.numeroInforme}`)
}

// Hook de ciclo de vida
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.actividad-informes-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

/* Header */
.header-sheet {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.header-sheet:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

/* Estadísticas */
.stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.stat-blue .stat-avatar {
  background: linear-gradient(145deg, #1976d2, #1565c0);
}

.stat-green .stat-avatar {
  background: linear-gradient(145deg, #388e3c, #2e7d32);
}

.stat-purple .stat-avatar {
  background: linear-gradient(145deg, #9c27b0, #7b1fa2);
}

.stat-avatar {
  transition: all 0.3s ease;
}

.stat-card:hover .stat-avatar {
  transform: scale(1.1) rotate(5deg);
}

.stat-value {
  color: #1a1a1a;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-value {
  color: #1976d2;
}

/* Búsqueda */
.search-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.search-input :deep(.v-field) {
  border-radius: 12px !important;
}

.search-input :deep(.v-field--focused) {
  border-color: #1976d2 !important;
}

.search-btn {
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  background: linear-gradient(145deg, #1976d2, #1565c0) !important;
  transition: all 0.3s ease !important;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(25, 118, 210, 0.3) !important;
}

.search-active-container {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
}

.clear-search-btn {
  border-radius: 20px !important;
  transition: all 0.3s ease !important;
}

.clear-search-btn:hover {
  background-color: #e0e0e0 !important;
}

/* Informes Cards */
.informe-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: 100%;
  background: white;
}

.informe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  border-color: #1976d2;
}

.informe-card-actividad {
  border-left: 4px solid #1976d2;
}

.informe-card-tarea {
  border-left: 4px solid #f57c00;
}

.informe-objetivo {
  color: #4a4a4a;
  line-height: 1.5;
}

.origin-chip {
  font-weight: 600;
  letter-spacing: 0.3px;
}

.action-btn {
  border-radius: 20px !important;
  transition: all 0.3s ease !important;
  font-weight: 500 !important;
}

.action-btn:hover {
  transform: translateY(-2px);
  background-color: rgba(25, 118, 210, 0.1) !important;
}

/* Tareas */
.tareas-container {
  max-height: 800px;
  overflow-y: auto;
  padding-right: 8px;
}

.tareas-container::-webkit-scrollbar {
  width: 6px;
}

.tareas-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.tareas-container::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 10px;
}

.tareas-container::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

.tarea-panel {
  border-radius: 12px !important;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
}

.tarea-panel:hover {
  border-color: #f57c00;
  box-shadow: 0 8px 16px rgba(245, 124, 0, 0.15) !important;
}

.tarea-informe-card {
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  background: white;
  margin-bottom: 12px;
}

.tarea-informe-card:hover {
  transform: translateX(4px);
  border-color: #f57c00;
  background: #fff8f0;
}

/* Alertas */
.empty-alert {
  border-radius: 12px !important;
  background: linear-gradient(145deg, #e3f2fd, #bbdefb) !important;
  border: 1px solid #90caf9 !important;
}

.error-alert {
  border-radius: 12px !important;
}

/* Transiciones */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Utilidades */
.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.h-100 {
  height: 100%;
}

/* Responsive */
@media (max-width: 960px) {
  .actividad-informes-container {
    padding: 16px;
  }

  .tareas-container {
    max-height: none;
    overflow-y: visible;
  }
}
</style>
