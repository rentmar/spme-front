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
      <!-- Encabezado -->
      <v-row>
        <v-col cols="12">
          <div class="mb-4">
            <div>
              <PaginaTituloIcono
                :titulo="'Informes Actividad/Subactividad'"
                :icon="'mdi-clipboard-text-multiple'"
              />
              <actividad-informacion :actividad-id="route.params.id"></actividad-informacion>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Cards de estadísticas -->
      <v-row class="mb-6">
        <v-col cols="12" md="3" v-for="(stat, index) in estadisticas" :key="index">
          <v-card elevation="2" rounded="lg">
            <v-card-text class="pa-4">
              <div class="d-flex align-center">
                <v-avatar :color="stat.color" size="48" class="mr-4">
                  <v-icon dark>{{ stat.icon }}</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 text-medium-emphasis">{{ stat.title }}</div>
                  <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
                  <div class="text-caption text-medium-emphasis mt-1">{{ stat.subtitle }}</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tabs principales -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="2" rounded="lg">
            <v-tabs v-model="tabActivo" color="primary" class="px-4 pt-4">
              <v-tab value="informes-actividad">
                <v-icon start icon="mdi-file-document"></v-icon>
                Informes de Actividad
                <v-chip v-if="actividad.informes_actividad?.length" size="x-small" class="ml-2">
                  {{ actividad.informes_actividad.length }}
                </v-chip>
              </v-tab>
              <v-tab value="tareas">
                <v-icon start icon="mdi-checkbox-multiple-marked"></v-icon>
                Tareas
                <v-chip v-if="actividad.tareas?.length" size="x-small" class="ml-2">
                  {{ actividad.tareas.length }}
                </v-chip>
              </v-tab>
              <v-tab value="informacion-general">
                <v-icon start icon="mdi-information"></v-icon>
                Información General
              </v-tab>
              <v-tab value="busqueda">
                <v-icon start icon="mdi-magnify"></v-icon>
                Búsqueda
              </v-tab>
            </v-tabs>

            <v-window v-model="tabActivo" class="pa-4">
              <!-- Tab: Informes de Actividad -->
              <v-window-item value="informes-actividad">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h3 class="text-h5 font-weight-bold">Informes de la Actividad Principal</h3>
                  <v-btn
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-plus"
                    @click="crearInformeActividad"
                  >
                    Nuevo Informe
                  </v-btn>
                </div>

                <v-alert
                  v-if="actividad.informes_actividad?.length === 0"
                  type="info"
                  variant="tonal"
                  class="mb-4"
                >
                  No hay informes registrados para esta actividad.
                </v-alert>

                <v-row v-else>
                  <v-col
                    v-for="informe in actividad.informes_actividad"
                    :key="informe.id"
                    cols="12"
                    md="6"
                    lg="4"
                  >
                    <v-card
                      elevation="2"
                      rounded="lg"
                      class="h-100 informe-card"
                      :color="getInformeCardColor(informe)"
                      variant="tonal"
                    >
                      <v-card-item>
                        <div class="d-flex justify-space-between align-start mb-2">
                          <div>
                            <v-card-title class="text-h6 pa-0 mb-1">
                              {{ informe.numeroInforme }}
                            </v-card-title>
                            <v-card-subtitle class="pa-0">
                              <v-icon start icon="mdi-calendar" size="small"></v-icon>
                              {{ informe.fechaEjecucion }}
                            </v-card-subtitle>
                          </div>
                          <v-chip v-if="informe.tipoActividad" size="small" variant="flat">
                            {{ informe.tipoActividad }}
                          </v-chip>
                        </div>
                      </v-card-item>

                      <v-card-text>
                        <div class="mb-3">
                          <div class="text-caption text-medium-emphasis mb-1">Objetivo</div>
                          <div class="text-body-2 truncate-text">
                            {{ informe.objetivoActividad || 'Sin objetivo especificado' }}
                          </div>
                        </div>

                        <v-divider class="my-3"></v-divider>

                        <v-row>
                          <v-col cols="6">
                            <div>
                              <div class="text-caption text-medium-emphasis mb-1">Planificado</div>
                              <div class="text-body-1 font-weight-bold">
                                Bs{{ formatNumber(informe.presupuestoPlanificado) }}
                              </div>
                            </div>
                          </v-col>
                          <v-col cols="6">
                            <div>
                              <div class="text-caption text-medium-emphasis mb-1">Ejecutado</div>
                              <div class="text-body-1 font-weight-bold">
                                Bs{{ formatNumber(informe.presupuestoEjecutado) }}
                              </div>
                            </div>
                          </v-col>
                        </v-row>

                        <div v-if="informe.comentariosRecomendaciones" class="mt-4">
                          <div class="text-caption text-medium-emphasis mb-1">Comentarios</div>
                          <div class="text-body-2">
                            {{ truncarTexto(informe.comentariosRecomendaciones, 80) }}
                          </div>
                        </div>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          variant="text"
                          size="small"
                          prepend-icon="mdi-eye"
                          @click="verDetalleInforme(informe.id)"
                        >
                          Ver
                        </v-btn>
                        <v-btn
                          color="secondary"
                          variant="text"
                          size="small"
                          prepend-icon="mdi-pencil"
                          @click="editarInforme(informe.id)"
                        >
                          Editar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>

              <!-- Tab: Tareas -->
              <v-window-item value="tareas">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h3 class="text-h5 font-weight-bold">Tareas / Subactividades</h3>
                  <v-btn
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-plus"
                    @click="crearTarea"
                  >
                    Nueva Tarea
                  </v-btn>
                </div>

                <v-alert
                  v-if="actividad.tareas?.length === 0"
                  type="info"
                  variant="tonal"
                  class="mb-4"
                >
                  No hay tareas registradas para esta actividad.
                </v-alert>

                <v-expansion-panels v-else multiple variant="accordion">
                  <v-expansion-panel
                    v-for="tarea in actividad.tareas"
                    :key="tarea.id"
                    elevation="2"
                    rounded="lg"
                    class="mb-3"
                  >
                    <v-expansion-panel-title expand-icon="mdi-chevron-down" class="py-4">
                      <template v-slot:default="{ expanded }">
                        <v-row no-gutters>
                          <v-col cols="12" md="4" class="d-flex align-center">
                            <v-avatar :color="getEstadoColor(tarea.estado)" size="36" class="mr-3">
                              <v-icon dark>{{
                                expanded ? 'mdi-folder-open' : 'mdi-folder'
                              }}</v-icon>
                            </v-avatar>
                            <div>
                              <div class="font-weight-bold text-body-1">{{ tarea.titulo }}</div>
                              <div class="text-caption text-medium-emphasis">
                                {{ tarea.codigo }}
                              </div>
                            </div>
                          </v-col>
                          <v-col cols="12" md="4" class="d-flex align-center">
                            <v-chip
                              :color="getEstadoColor(tarea.estado)"
                              size="small"
                              variant="flat"
                              class="mr-2"
                            >
                              {{ tarea.estado }}
                            </v-chip>
                            <v-chip size="small" variant="outlined">
                              <v-icon start icon="mdi-cash" size="x-small"></v-icon>
                              Bs{{ formatNumber(tarea.presupuesto) }}
                            </v-chip>
                          </v-col>
                          <v-col cols="12" md="4" class="d-flex align-center justify-end">
                            <div class="text-end">
                              <div class="text-caption text-medium-emphasis">Informes</div>
                              <div class="text-h6">
                                {{ tarea.informes_tarea?.length || 0 }}
                              </div>
                            </div>
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                      <!-- Información de la tarea -->
                      <v-row class="mb-4">
                        <v-col cols="12" md="6">
                          <v-card variant="tonal" color="grey-lighten-3" rounded="lg">
                            <v-card-text>
                              <div class="text-caption text-medium-emphasis mb-2">Descripción</div>
                              <div class="text-body-2">{{ tarea.descripcion }}</div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-card variant="tonal" color="grey-lighten-3" rounded="lg">
                            <v-card-text>
                              <div class="text-caption text-medium-emphasis mb-2">Fechas</div>
                              <div class="text-body-2">
                                <div class="mb-1">
                                  <v-icon
                                    icon="mdi-calendar-plus"
                                    size="small"
                                    class="mr-1"
                                  ></v-icon>
                                  Creación: {{ tarea.fecha_creacion }}
                                </div>
                                <div>
                                  <v-icon
                                    icon="mdi-calendar-clock"
                                    size="small"
                                    class="mr-1"
                                  ></v-icon>
                                  Límite: {{ tarea.fecha_limite }}
                                </div>
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>

                      <!-- Informes de la tarea -->
                      <div class="mb-4">
                        <div class="d-flex justify-space-between align-center mb-3">
                          <h4 class="text-h6">Informes de esta Tarea</h4>
                          <v-btn
                            color="primary"
                            size="small"
                            prepend-icon="mdi-plus"
                            @click="crearInformeTarea(tarea.id)"
                          >
                            Nuevo Informe
                          </v-btn>
                        </div>

                        <v-alert
                          v-if="tarea.informes_tarea?.length === 0"
                          type="info"
                          variant="tonal"
                          density="compact"
                          class="mb-4"
                        >
                          No hay informes para esta tarea.
                        </v-alert>

                        <v-row v-else>
                          <v-col
                            v-for="informe in tarea.informes_tarea"
                            :key="informe.id"
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-card elevation="1" rounded="lg" variant="outlined">
                              <v-card-item>
                                <div class="d-flex justify-space-between align-start">
                                  <div>
                                    <div class="text-body-1 font-weight-bold">
                                      {{ informe.numeroInforme }}
                                    </div>
                                    <div class="text-caption text-medium-emphasis">
                                      <v-icon start icon="mdi-calendar" size="x-small"></v-icon>
                                      {{ informe.fechaEjecucion }}
                                    </div>
                                  </div>
                                  <v-chip v-if="informe.tipoActividad" size="x-small" color="info">
                                    {{ informe.tipoActividad }}
                                  </v-chip>
                                </div>
                              </v-card-item>

                              <v-card-text>
                                <div class="d-flex justify-space-between align-center">
                                  <div>
                                    <div class="text-caption text-medium-emphasis">Planificado</div>
                                    <div class="text-body-2 font-weight-bold">
                                      Bs{{ formatNumber(informe.presupuestoPlanificado) }}
                                    </div>
                                  </div>
                                  <div>
                                    <div class="text-caption text-medium-emphasis">Ejecutado</div>
                                    <div class="text-body-2 font-weight-bold">
                                      Bs{{ formatNumber(informe.presupuestoEjecutado) }}
                                    </div>
                                  </div>
                                </div>

                                <div v-if="informe.objetivoTarea" class="mt-3">
                                  <div class="text-caption text-medium-emphasis">Objetivo:</div>
                                  <div class="text-body-2">
                                    {{ truncarTexto(informe.objetivoTarea, 60) }}
                                  </div>
                                </div>
                              </v-card-text>

                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                  size="small"
                                  variant="text"
                                  color="primary"
                                  @click="verDetalleInformeTarea(informe.id)"
                                >
                                  Ver Detalle
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-col>
                        </v-row>
                      </div>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          variant="text"
                          prepend-icon="mdi-eye"
                          @click="verDetalleTarea(tarea.id)"
                        >
                          Ver Tarea Completa
                        </v-btn>
                        <v-btn
                          color="secondary"
                          variant="tonal"
                          prepend-icon="mdi-file-document-plus"
                          @click="crearInformeTarea(tarea.id)"
                        >
                          Crear Informe
                        </v-btn>
                      </v-card-actions>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-window-item>

              <!-- Tab: Información General -->
              <v-window-item value="informacion-general">
                <v-row>
                  <!-- Información básica y factores críticos -->
                  <v-col cols="12" md="6">
                    <v-card class="mb-4" elevation="2" rounded="lg">
                      <v-toolbar color="primary" density="compact">
                        <v-toolbar-title class="text-white">Información Básica</v-toolbar-title>
                      </v-toolbar>
                      <v-card-text class="pa-4">
                        <v-list density="compact">
                          <v-list-item class="px-0">
                            <v-list-item-title class="text-caption text-medium-emphasis">
                              Código
                            </v-list-item-title>
                            <v-list-item-subtitle class="text-body-1 font-weight-medium">
                              {{ actividad.codigo }}
                            </v-list-item-subtitle>
                          </v-list-item>
                          <v-divider class="my-2"></v-divider>
                          <v-list-item class="px-0">
                            <v-list-item-title class="text-caption text-medium-emphasis">
                              Nombre Corto
                            </v-list-item-title>
                            <v-list-item-subtitle class="text-body-1">
                              {{ actividad.nombreCorto }}
                            </v-list-item-subtitle>
                          </v-list-item>
                          <v-divider class="my-2"></v-divider>
                          <v-list-item class="px-0">
                            <v-list-item-title class="text-caption text-medium-emphasis">
                              Grado de Ejecución
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              <v-chip
                                size="small"
                                :color="getGradoEjecucionColor(actividad.gradoEjecucion)"
                                variant="flat"
                              >
                                {{ actividad.gradoEjecucion }}
                              </v-chip>
                            </v-list-item-subtitle>
                          </v-list-item>
                          <v-divider class="my-2"></v-divider>
                          <v-list-item class="px-0">
                            <v-list-item-title class="text-caption text-medium-emphasis">
                              Presupuesto Total
                            </v-list-item-title>
                            <v-list-item-subtitle class="text-h6 text-primary">
                              Bs{{ formatNumber(actividad.presupuesto) }}
                            </v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>

                    <!-- Factores Críticos -->
                    <v-card
                      v-if="actividad.factoresCriticos?.length > 0"
                      elevation="2"
                      rounded="lg"
                    >
                      <v-toolbar color="primary" density="compact">
                        <v-toolbar-title class="text-white">
                          Factores Críticos
                          <v-chip size="small" class="ml-2">
                            {{ actividad.factoresCriticos.length }}
                          </v-chip>
                        </v-toolbar-title>
                      </v-toolbar>
                      <v-card-text class="pa-4">
                        <v-list density="compact">
                          <v-list-item
                            v-for="factor in actividad.factoresCriticos"
                            :key="factor.id"
                            class="px-0"
                          >
                            <template v-slot:prepend>
                              <v-icon color="warning" icon="mdi-alert-circle"></v-icon>
                            </template>
                            <v-list-item-title class="text-body-1">
                              {{ factor.nombre }}
                            </v-list-item-title>
                            <v-list-item-subtitle v-if="factor.nota" class="text-caption">
                              {{ factor.nota }}
                            </v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Estructura de procedencia -->
                  <v-col cols="12" md="6">
                    <!-- Objetivo General -->
                    <v-card
                      v-if="actividad.estructuraProcedencia?.datosProcedencia?.objetivogeneral"
                      class="mb-4"
                      elevation="2"
                      rounded="lg"
                    >
                      <v-toolbar color="primary" density="compact">
                        <v-toolbar-title class="text-white">
                          <v-icon start icon="mdi-target"></v-icon>
                          Objetivo General
                        </v-toolbar-title>
                      </v-toolbar>
                      <v-card-text class="pa-4">
                        <div class="mb-3">
                          <div class="text-caption text-medium-emphasis mb-1">Código:</div>
                          <div class="text-body-1 font-weight-bold">
                            {{
                              actividad.estructuraProcedencia.datosProcedencia.objetivogeneral.data
                                .codigo
                            }}
                          </div>
                        </div>
                        <div>
                          <div class="text-caption text-medium-emphasis mb-1">Descripción:</div>
                          <div class="text-body-2">
                            {{
                              actividad.estructuraProcedencia.datosProcedencia.objetivogeneral.data
                                .descripcion
                            }}
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>

                    <!-- Resultado OG -->
                    <v-card
                      v-if="actividad.estructuraProcedencia?.datosProcedencia?.resultadoog"
                      class="mb-4"
                      elevation="2"
                      rounded="lg"
                    >
                      <v-toolbar color="primary" density="compact">
                        <v-toolbar-title class="text-white">
                          <v-icon start icon="mdi-chart-line"></v-icon>
                          Resultado OG
                        </v-toolbar-title>
                      </v-toolbar>
                      <v-card-text class="pa-4">
                        <div class="mb-3">
                          <div class="text-caption text-medium-emphasis mb-1">Código:</div>
                          <div class="text-body-1 font-weight-bold">
                            {{
                              actividad.estructuraProcedencia.datosProcedencia.resultadoog.data
                                .codigo
                            }}
                          </div>
                        </div>
                        <div>
                          <div class="text-caption text-medium-emphasis mb-1">Descripción:</div>
                          <div class="text-body-2">
                            {{
                              actividad.estructuraProcedencia.datosProcedencia.resultadoog.data
                                .descripcion
                            }}
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>

                    <!-- Indicador Resultado OG -->
                    <v-card
                      v-if="actividad.estructuraProcedencia?.datosProcedencia?.indicadorresultadoog"
                      elevation="2"
                      rounded="lg"
                    >
                      <v-toolbar color="primary" density="compact">
                        <v-toolbar-title class="text-white">
                          <v-icon start icon="mdi-chart-bar"></v-icon>
                          Indicador del Resultado
                        </v-toolbar-title>
                      </v-toolbar>
                      <v-card-text class="pa-4">
                        <div class="mb-3">
                          <div class="text-caption text-medium-emphasis mb-1">Código:</div>
                          <div class="text-body-1 font-weight-bold">
                            {{
                              actividad.estructuraProcedencia.datosProcedencia.indicadorresultadoog
                                .data.codigo
                            }}
                          </div>
                        </div>
                        <div class="mb-3">
                          <div class="text-caption text-medium-emphasis mb-1">Descripción:</div>
                          <div class="text-body-2">
                            {{
                              actividad.estructuraProcedencia.datosProcedencia.indicadorresultadoog
                                .data.descripcion
                            }}
                          </div>
                        </div>
                        <div>
                          <div class="text-caption text-medium-emphasis mb-1">Redacción:</div>
                          <div class="text-body-2">
                            {{
                              actividad.estructuraProcedencia.datosProcedencia.indicadorresultadoog
                                .data.redaccion
                            }}
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>

              <!-- Tab: Búsqueda -->
              <v-window-item value="busqueda">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h3 class="text-h5 font-weight-bold">Buscar Informes</h3>
                  <v-btn
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-file-document-plus"
                    @click="crearInformeActividad"
                  >
                    Nuevo Informe
                  </v-btn>
                </div>

                <!-- Barra de búsqueda -->
                <v-card class="mb-6" elevation="2">
                  <v-card-text class="pa-4">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="searchQuery"
                          label="Buscar por código o nombre"
                          placeholder="Ej: INF-001, Reunión de planificación"
                          prepend-inner-icon="mdi-magnify"
                          clearable
                          variant="outlined"
                          @keyup.enter="realizarBusqueda"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-select
                          v-model="searchType"
                          label="Tipo de búsqueda"
                          :items="tiposBusqueda"
                          variant="outlined"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="3" class="d-flex align-end">
                        <v-btn
                          color="primary"
                          variant="flat"
                          block
                          @click="realizarBusqueda"
                          :loading="searching"
                        >
                          <v-icon start icon="mdi-magnify"></v-icon>
                          Buscar
                        </v-btn>
                      </v-col>
                    </v-row>

                    <!-- Filtros adicionales -->
                    <v-expansion-panels flat class="mt-2">
                      <v-expansion-panel>
                        <v-expansion-panel-title>
                          <v-icon icon="mdi-filter" class="mr-2"></v-icon>
                          Filtros avanzados
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <v-row>
                            <v-col cols="12" md="4">
                              <v-select
                                v-model="filtroEstado"
                                label="Estado del informe"
                                :items="estadosInforme"
                                clearable
                                variant="outlined"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-select
                                v-model="filtroTipo"
                                label="Tipo de actividad"
                                :items="tiposActividad"
                                clearable
                                variant="outlined"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-menu>
                                <template v-slot:activator="{ props }">
                                  <v-text-field
                                    v-model="filtroFecha"
                                    label="Fecha de ejecución"
                                    prepend-inner-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    v-bind="props"
                                  ></v-text-field>
                                </template>
                                <v-date-picker v-model="filtroFecha"></v-date-picker>
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card-text>
                </v-card>

                <!-- Resultados de búsqueda -->
                <div>
                  <div class="d-flex justify-space-between align-center mb-4">
                    <h4 class="text-h6">Resultados de búsqueda</h4>
                    <div class="d-flex align-center">
                      <span class="text-caption text-medium-emphasis mr-2">
                        {{ resultadosBusqueda.length }} resultado(s) encontrado(s)
                      </span>
                      <v-btn
                        v-if="resultadosBusqueda.length > 0"
                        color="secondary"
                        variant="text"
                        size="small"
                        @click="limpiarBusqueda"
                      >
                        Limpiar búsqueda
                      </v-btn>
                    </div>
                  </div>

                  <v-alert
                    v-if="resultadosBusqueda.length === 0 && !searchQuery"
                    type="info"
                    variant="tonal"
                    class="mb-4"
                  >
                    <template v-slot:prepend>
                      <v-icon>mdi-information</v-icon>
                    </template>
                    Ingresa un término de búsqueda para encontrar informes por código, nombre o
                    descripción.
                  </v-alert>

                  <v-alert
                    v-else-if="resultadosBusqueda.length === 0 && searchQuery"
                    type="warning"
                    variant="tonal"
                    class="mb-4"
                  >
                    <template v-slot:prepend>
                      <v-icon>mdi-alert</v-icon>
                    </template>
                    No se encontraron resultados para "{{ searchQuery }}". Intenta con otros
                    términos.
                  </v-alert>

                  <!-- Resultados -->
                  <v-row v-if="resultadosBusqueda.length > 0">
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
                        :color="getInformeCardColor(informe)"
                        variant="tonal"
                      >
                        <v-card-item>
                          <div class="d-flex justify-space-between align-start mb-2">
                            <div>
                              <v-card-title class="text-h6 pa-0 mb-1">
                                {{ informe.numeroInforme }}
                              </v-card-title>
                              <v-card-subtitle class="pa-0">
                                <v-icon start icon="mdi-calendar" size="small"></v-icon>
                                {{ informe.fechaEjecucion }}
                                <span v-if="informe.tarea" class="ml-2">
                                  <v-icon icon="mdi-folder" size="small"></v-icon>
                                  {{ informe.tarea.codigo }}
                                </span>
                              </v-card-subtitle>
                            </div>
                            <v-chip v-if="informe.tipoActividad" size="small" variant="flat">
                              {{ informe.tipoActividad }}
                            </v-chip>
                          </div>
                        </v-card-item>

                        <v-card-text>
                          <div class="mb-3">
                            <div class="text-caption text-medium-emphasis mb-1">Origen</div>
                            <div class="text-body-2">
                              <v-chip size="x-small" :color="informe.tarea ? 'info' : 'primary'">
                                {{
                                  informe.tarea
                                    ? 'Tarea: ' + informe.tarea.titulo
                                    : 'Actividad Principal'
                                }}
                              </v-chip>
                            </div>
                          </div>

                          <div class="mb-3">
                            <div class="text-caption text-medium-emphasis mb-1">Objetivo</div>
                            <div class="text-body-2 truncate-text">
                              {{
                                informe.objetivoActividad ||
                                informe.objetivoTarea ||
                                'Sin objetivo especificado'
                              }}
                            </div>
                          </div>

                          <v-divider class="my-3"></v-divider>

                          <v-row>
                            <v-col cols="6">
                              <div>
                                <div class="text-caption text-medium-emphasis mb-1">
                                  Planificado
                                </div>
                                <div class="text-body-1 font-weight-bold">
                                  Bs{{ formatNumber(informe.presupuestoPlanificado) }}
                                </div>
                              </div>
                            </v-col>
                            <v-col cols="6">
                              <div>
                                <div class="text-caption text-medium-emphasis mb-1">Ejecutado</div>
                                <div class="text-body-1 font-weight-bold">
                                  Bs{{ formatNumber(informe.presupuestoEjecutado) }}
                                </div>
                              </div>
                            </v-col>
                          </v-row>

                          <div v-if="informe.comentariosRecomendaciones" class="mt-4">
                            <div class="text-caption text-medium-emphasis mb-1">Comentarios</div>
                            <div class="text-body-2">
                              {{ truncarTexto(informe.comentariosRecomendaciones, 80) }}
                            </div>
                          </div>
                        </v-card-text>

                        <v-card-actions>
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
                          >
                            Ver
                          </v-btn>
                          <v-btn
                            color="secondary"
                            variant="text"
                            size="small"
                            prepend-icon="mdi-pencil"
                            @click="
                              informe.tarea
                                ? editarInformeTarea(informe.id)
                                : editarInforme(informe.id)
                            "
                          >
                            Editar
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Error -->
    <v-alert v-if="error && !loading" type="error" variant="tonal" class="mb-4">
      {{ error }}
      <template v-slot:actions>
        <v-btn color="error" variant="text" @click="cargarDatos"> Reintentar </v-btn>
      </template>
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useInfPrinActTareaListaStore } from '@/modules/formularios/store/useInfPrinActTareaListaStore'
import { useRoute } from 'vue-router'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'

// Store y router
const storeListasInformes = useInfPrinActTareaListaStore()
const router = useRouter()
const route = useRoute()

// Estado
const loading = ref(false)
const error = ref(null)
const tabActivo = ref('informes-actividad')

// Estado para búsqueda
const searchQuery = ref('')
const searchType = ref('todos')
const searching = ref(false)
const filtroEstado = ref(null)
const filtroTipo = ref(null)
const filtroFecha = ref(null)

const tiposBusqueda = ref([
  { title: 'Todos los informes', value: 'todos' },
  { title: 'Solo actividad principal', value: 'principal' },
  { title: 'Solo informes de tareas', value: 'tareas' },
])

const estadosInforme = ref([
  { title: 'Planificado', value: 'PLAN' },
  { title: 'En ejecución', value: 'EJEC' },
  { title: 'Completado', value: 'COMP' },
  { title: 'Cancelado', value: 'CANC' },
])

const tiposActividad = ref([
  { title: 'Reunión', value: 'REUNION' },
  { title: 'Taller', value: 'TALLER' },
  { title: 'Capacitación', value: 'CAPACITACION' },
  { title: 'Visita de campo', value: 'VISITA' },
  { title: 'Evaluación', value: 'EVALUACION' },
])

// Computed properties
const actividad = computed(() => storeListasInformes.actividadDetalles?.data || null)

const estadisticas = computed(() => [
  {
    title: 'Informes Actividad',
    value: actividad.value?.informes_actividad?.length || 0,
    subtitle: 'Principal',
    icon: 'mdi-file-document-multiple',
    color: 'blue',
  },
  {
    title: 'Informes Tareas',
    value: totalInformesTareas.value,
    subtitle: 'Subactividades',
    icon: 'mdi-file-document',
    color: 'green',
  },
  {
    title: 'Tareas',
    value: actividad.value?.tareas?.length || 0,
    subtitle: 'Activas',
    icon: 'mdi-checkbox-multiple-marked',
    color: 'orange',
  },
  {
    title: 'Factores Críticos',
    value: actividad.value?.factoresCriticos?.length || 0,
    subtitle: 'Identificados',
    icon: 'mdi-alert-circle',
    color: 'purple',
  },
])

const totalInformesTareas = computed(() => {
  if (!actividad.value?.tareas) return 0
  return actividad.value.tareas.reduce((total, tarea) => {
    return total + (tarea.informes_tarea?.length || 0)
  }, 0)
})

const resultadosBusqueda = computed(() => {
  if (!searchQuery.value && !filtroEstado.value && !filtroTipo.value && !filtroFecha.value) {
    return []
  }

  let todosInformes = []

  // Agregar informes de actividad principal
  if (actividad.value?.informes_actividad) {
    todosInformes = todosInformes.concat(
      actividad.value.informes_actividad.map((informe) => ({
        ...informe,
        tarea: null,
        origen: 'actividad',
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

  // Filtro por estado (simulado ya que no hay campo estado en informes)
  if (filtroEstado.value) {
    // Este filtro sería para un campo de estado si existiera
    // resultados = resultados.filter(informe => informe.estado === filtroEstado.value)
  }

  // Filtro por tipo de actividad
  if (filtroTipo.value) {
    resultados = resultados.filter((informe) => informe.tipoActividad === filtroTipo.value)
  }

  // Filtro por fecha (simplificado)
  if (filtroFecha.value) {
    resultados = resultados.filter(
      (informe) => informe.fechaEjecucion && informe.fechaEjecucion.includes(filtroFecha.value),
    )
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
  searching.value = true
  // Simular búsqueda
  setTimeout(() => {
    searching.value = false
  }, 500)
}

const limpiarBusqueda = () => {
  searchQuery.value = ''
  searchType.value = 'todos'
  filtroEstado.value = null
  filtroTipo.value = null
  filtroFecha.value = null
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

const getGradoEjecucionColor = (grado) => {
  const colores = {
    PLANIFICADA: 'blue',
    EN_EJECUCION: 'orange',
    COMPLETADA: 'green',
    CANCELADA: 'red',
  }
  return colores[grado] || 'grey'
}

const getInformeCardColor = (informe) => {
  const presupuestoEjecutado = parseFloat(informe.presupuestoEjecutado) || 0
  const presupuestoPlanificado = parseFloat(informe.presupuestoPlanificado) || 1

  const porcentaje = (presupuestoEjecutado / presupuestoPlanificado) * 100

  if (porcentaje >= 100) return 'success-lighten-5'
  if (porcentaje >= 80) return 'info-lighten-5'
  if (porcentaje >= 50) return 'warning-lighten-5'
  return 'error-lighten-5'
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

const crearInformeActividad = () => {
  router.push({
    name: 'crear-informe-actividad',
    params: { id: route.params.id },
  })
}

const crearInformeTarea = (tareaId) => {
  router.push({
    name: 'crear-informe-tarea',
    params: { id: tareaId },
    query: { actividad_id: route.params.id },
  })
}

const crearTarea = () => {
  // Implementar navegación para crear nueva tarea
  console.log('Crear nueva tarea')
}

const verDetalleInforme = (informeId) => {
  router.push({
    name: 'detalle-informe-actividad',
    params: { id: informeId },
  })
}

const verDetalleInformeTarea = (informeId) => {
  router.push({
    name: 'detalle-informe-tarea',
    params: { id: informeId },
  })
}

const editarInformeTarea = (informeId) => {
  router.push({
    name: 'editar-informe-tarea',
    params: { id: informeId },
  })
}

const verDetalleTarea = (tareaId) => {
  router.push({
    name: 'detalle-tarea',
    params: { id: tareaId },
  })
}

const editarInforme = (informeId) => {
  router.push({
    name: 'editar-informe-actividad',
    params: { id: informeId },
  })
}

// const exportarInformes = () => {
//   console.log('Exportando informes...')
//   // Implementar lógica de exportación
// }

// Watch para limpiar filtros cuando se cambia de tab
watch(tabActivo, (newTab) => {
  if (newTab !== 'busqueda') {
    limpiarBusqueda()
  }
})

// Hook de ciclo de vida
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.actividad-informes-container {
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

.gap-2 {
  gap: 8px;
}

.h-100 {
  height: 100%;
}

.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.informe-card {
  transition: all 0.3s ease;
}

.informe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.v-expansion-panel {
  border-radius: 8px;
  margin-bottom: 8px;
}

@media (max-width: 960px) {
  .actividad-informes-container {
    padding: 16px 12px;
  }
}
</style>
