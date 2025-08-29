<template>
  <v-container class="dashboard-container">
    <!-- Overlay de carga -->
    <v-overlay :model-value="loading" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando datos...</p>
      </div>
    </v-overlay>

    <!-- CONTENIDO PRINCIPAL -->
    <template v-if="!loading">
      <v-row>
        <v-col cols="12">
          <PaginaTituloIcono
            :titulo="'DASHBOARD DE PLANIFICACIÓN ESTRATÉGICA'"
            :icon="'mdi-chart-box'"
          />

          <!-- Tarjetas resumen -->
          <v-row class="mb-6">
            <v-col cols="12" md="4">
              <v-card class="summary-card" color="primary" variant="tonal">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-h6">PEIs Vigentes</div>
                      <div class="text-h4 mt-2">{{ summary.activePeis }}</div>
                    </div>
                    <v-icon size="48">mdi-file-document-multiple</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="summary-card" color="secondary" variant="tonal">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-h6">Proyectos Activos</div>
                      <div class="text-h4 mt-2">{{ summary.activeProjects }}</div>
                    </div>
                    <v-icon size="48">mdi-briefcase-check</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="summary-card" color="success" variant="tonal">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-h6">Actividades Completadas</div>
                      <div class="text-h4 mt-2">{{ summary.completedActivities }}</div>
                    </div>
                    <v-icon size="48">mdi-check-all</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Pestañas principales -->
          <v-tabs v-model="tab" color="primary" grow>
            <v-tab value="peis">PEIs</v-tab>
            <v-tab value="proyectos">Proyectos</v-tab>
            <v-tab value="actividades">Actividades</v-tab>
            <v-tab value="indicadores">Indicadores</v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <!-- Pestaña PEIs -->
            <v-window-item value="peis">
              <v-card variant="outlined" class="mt-4">
                <div class="d-flex justify-space-between align-center pa-4">
                  <v-text-field
                    v-model="searchPei"
                    label="Buscar PEIs"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    style="max-width: 300px"
                  ></v-text-field>
                  <v-btn color="primary" prepend-icon="mdi-plus" @click="openPeiDialog">
                    Nuevo PEI
                  </v-btn>
                </div>

                <v-data-table
                  :headers="peiHeaders"
                  :items="filteredPeis"
                  :search="searchPei"
                  :loading="tableLoading"
                  loading-text="Cargando PEIs..."
                  no-data-text="No hay PEIs registrados"
                  :items-per-page="10"
                >
                  <!-- Estado vigente -->
                  <template v-slot:item.esta_vigente="{ item }">
                    <v-chip :color="item.esta_vigente ? 'success' : 'error'" size="small">
                      {{ item.esta_vigente ? 'Vigente' : 'No vigente' }}
                    </v-chip>
                  </template>

                  <!-- Fechas -->
                  <template v-slot:item.fecha_inicio="{ item }">
                    {{ formatDate(item.fecha_inicio) }}
                  </template>
                  <template v-slot:item.fecha_fin="{ item }">
                    {{ formatDate(item.fecha_fin) }}
                  </template>

                  <!-- Acciones -->
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex">
                      <v-btn
                        icon
                        size="small"
                        color="primary"
                        variant="text"
                        @click="editPei(item)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="error"
                        variant="text"
                        @click="confirmDeletePei(item)"
                        class="ml-1"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="info"
                        variant="text"
                        @click="viewPeiDetails(item)"
                        class="ml-1"
                      >
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </v-window-item>

            <!-- Pestaña Proyectos -->
            <v-window-item value="proyectos">
              <v-card variant="outlined" class="mt-4">
                <div class="d-flex justify-space-between align-center pa-4">
                  <v-text-field
                    v-model="searchProyecto"
                    label="Buscar proyectos"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    style="max-width: 300px"
                  ></v-text-field>
                  <v-btn color="primary" prepend-icon="mdi-plus" @click="openProyectoDialog">
                    Nuevo Proyecto
                  </v-btn>
                </div>

                <v-data-table
                  :headers="proyectoHeaders"
                  :items="filteredProyectos"
                  :search="searchProyecto"
                  :loading="tableLoading"
                  loading-text="Cargando proyectos..."
                  no-data-text="No hay proyectos registrados"
                  :items-per-page="10"
                >
                  <!-- Estado -->
                  <template v-slot:item.estado="{ item }">
                    <v-chip :color="getEstadoColor(item.estado)" size="small">
                      {{ getEstadoText(item.estado) }}
                    </v-chip>
                  </template>

                  <!-- Presupuesto -->
                  <template v-slot:item.presupuesto="{ item }">
                    {{ formatCurrency(item.presupuesto) }}
                  </template>

                  <!-- Fechas -->
                  <template v-slot:item.fecha_inicio="{ item }">
                    {{ formatDate(item.fecha_inicio) }}
                  </template>
                  <template v-slot:item.fecha_finalizacion="{ item }">
                    {{ formatDate(item.fecha_finalizacion) }}
                  </template>

                  <!-- Acciones -->
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex">
                      <v-btn
                        icon
                        size="small"
                        color="primary"
                        variant="text"
                        @click="editProyecto(item)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="error"
                        variant="text"
                        @click="confirmDeleteProyecto(item)"
                        class="ml-1"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="info"
                        variant="text"
                        @click="viewProyectoDetails(item)"
                        class="ml-1"
                      >
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="success"
                        variant="text"
                        @click="openEstructuraDialog(item)"
                        class="ml-1"
                      >
                        <v-icon>mdi-sitemap</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </v-window-item>

            <!-- Pestaña Actividades -->
            <v-window-item value="actividades">
              <v-card variant="outlined" class="mt-4">
                <div class="d-flex justify-space-between align-center pa-4">
                  <div class="d-flex align-center" style="width: 100%">
                    <v-select
                      v-model="actividadFilters.estado"
                      :items="estadoActividadOptions"
                      label="Filtrar por estado"
                      density="compact"
                      variant="outlined"
                      clearable
                      style="max-width: 250px; margin-right: 16px"
                    ></v-select>
                    <v-select
                      v-model="actividadFilters.tipo"
                      :items="tipoActividadOptions"
                      label="Filtrar por tipo"
                      density="compact"
                      variant="outlined"
                      clearable
                      style="max-width: 250px; margin-right: 16px"
                    ></v-select>
                    <v-text-field
                      v-model="searchActividad"
                      label="Buscar actividades"
                      prepend-inner-icon="mdi-magnify"
                      variant="outlined"
                      density="compact"
                      style="max-width: 300px"
                    ></v-text-field>
                  </div>
                  <v-btn color="primary" prepend-icon="mdi-plus" @click="openActividadDialog">
                    Nueva Actividad
                  </v-btn>
                </div>

                <v-data-table
                  :headers="actividadHeaders"
                  :items="filteredActividades"
                  :search="searchActividad"
                  :loading="tableLoading"
                  loading-text="Cargando actividades..."
                  no-data-text="No hay actividades registradas"
                  :items-per-page="10"
                >
                  <!-- Estado -->
                  <template v-slot:item.estado="{ item }">
                    <v-chip :color="getActividadEstadoColor(item.estado)" size="small">
                      {{ getActividadEstadoText(item.estado) }}
                    </v-chip>
                  </template>

                  <!-- Tipo -->
                  <template v-slot:item.tipo="{ item }">
                    {{ getActividadTipoText(item.tipo) }}
                  </template>

                  <!-- Fechas -->
                  <template v-slot:item.fecha_inicio="{ item }">
                    {{ formatDate(item.fecha_inicio) }}
                  </template>
                  <template v-slot:item.fecha_cierre="{ item }">
                    {{ formatDate(item.fecha_cierre) }}
                  </template>

                  <!-- Presupuesto -->
                  <template v-slot:item.presupuesto="{ item }">
                    {{ formatCurrency(item.presupuesto) }}
                  </template>

                  <!-- Acciones -->
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex">
                      <v-btn
                        icon
                        size="small"
                        color="primary"
                        variant="text"
                        @click="editActividad(item)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="error"
                        variant="text"
                        @click="confirmDeleteActividad(item)"
                        class="ml-1"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="info"
                        variant="text"
                        @click="viewActividadDetails(item)"
                        class="ml-1"
                      >
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </v-window-item>

            <!-- Pestaña Indicadores -->
            <v-window-item value="indicadores">
              <v-card variant="outlined" class="mt-4">
                <div class="d-flex justify-space-between align-center pa-4">
                  <v-select
                    v-model="indicadorFilters.tipo"
                    :items="tipoIndicadorOptions"
                    label="Filtrar por tipo"
                    density="compact"
                    variant="outlined"
                    clearable
                    style="max-width: 250px; margin-right: 16px"
                  ></v-select>
                  <v-text-field
                    v-model="searchIndicador"
                    label="Buscar indicadores"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    style="max-width: 300px"
                  ></v-text-field>
                </div>

                <v-data-table
                  :headers="indicadorHeaders"
                  :items="filteredIndicadores"
                  :search="searchIndicador"
                  :loading="tableLoading"
                  loading-text="Cargando indicadores..."
                  no-data-text="No hay indicadores registrados"
                  :items-per-page="10"
                >
                  <!-- Tipo -->
                  <template v-slot:item.tipo="{ item }">
                    <v-chip
                      :color="item.tipo === 'Proporcion' ? 'primary' : 'secondary'"
                      size="small"
                    >
                      {{ item.tipo }}
                    </v-chip>
                  </template>

                  <!-- Relación -->
                  <template v-slot:item.relacion="{ item }">
                    {{ getRelacionIndicador(item) }}
                  </template>

                  <!-- Acciones -->
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex">
                      <v-btn
                        icon
                        size="small"
                        color="info"
                        variant="text"
                        @click="viewIndicadorDetails(item)"
                      >
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="success"
                        variant="text"
                        @click="openIndicadorReportDialog(item)"
                        class="ml-1"
                      >
                        <v-icon>mdi-chart-line</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </template>

    <!-- Diálogos -->
    <!-- Diálogo PEI -->
    <v-dialog v-model="peiDialog" max-width="800" persistent>
      <v-card>
        <v-card-title>{{ isEditingPei ? 'Editar PEI' : 'Nuevo PEI' }}</v-card-title>
        <v-card-text>
          <v-form ref="peiForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentPei.titulo"
                  label="Título"
                  :rules="[required]"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox
                  v-model="currentPei.esta_vigente"
                  label="¿Está vigente?"
                  color="primary"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="currentPei.fecha_inicio"
                      label="Fecha de inicio"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="props"
                      variant="outlined"
                      :rules="[required]"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="currentPei.fecha_inicio"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="currentPei.fecha_fin"
                      label="Fecha de fin"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="props"
                      variant="outlined"
                      :rules="[required]"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="currentPei.fecha_fin"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="currentPei.descripcion"
                  label="Descripción"
                  variant="outlined"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="peiDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="savePei" :loading="savingPei">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo Proyecto -->
    <v-dialog v-model="proyectoDialog" max-width="1000" persistent>
      <v-card>
        <v-card-title>{{ isEditingProyecto ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</v-card-title>
        <v-card-text>
          <v-form ref="proyectoForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentProyecto.codigo"
                  label="Código"
                  :rules="[required]"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="currentProyecto.pei"
                  :items="peis"
                  item-title="titulo"
                  item-value="id"
                  label="PEI asociado"
                  :rules="[required]"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="currentProyecto.titulo"
                  label="Título"
                  :rules="[required]"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="currentProyecto.estado"
                  :items="estadoProyectoOptions"
                  label="Estado"
                  :rules="[required]"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentProyecto.presupuesto"
                  label="Presupuesto"
                  type="number"
                  prefix="$"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="currentProyecto.fecha_inicio"
                      label="Fecha de inicio"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="props"
                      variant="outlined"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="currentProyecto.fecha_inicio"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="currentProyecto.fecha_finalizacion"
                      label="Fecha de finalización"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="props"
                      variant="outlined"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="currentProyecto.fecha_finalizacion"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="currentProyecto.descripcion"
                  label="Descripción"
                  variant="outlined"
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="currentProyecto.instancia_gestora"
                  :items="instanciasGestoras"
                  item-title="instancia"
                  item-value="id"
                  label="Instancias gestoras"
                  multiple
                  chips
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="currentProyecto.procedencia_fondos"
                  :items="procedenciasFondos"
                  item-title="financiera"
                  item-value="id"
                  label="Procedencia de fondos"
                  multiple
                  chips
                  variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="proyectoDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveProyecto" :loading="savingProyecto">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo Actividad -->
    <v-dialog v-model="actividadDialog" max-width="800" persistent>
      <v-card>
        <v-card-title>{{
          isEditingActividad ? 'Editar Actividad' : 'Nueva Actividad'
        }}</v-card-title>
        <v-card-text>
          <v-form ref="actividadForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentActividad.codigo"
                  label="Código"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="currentActividad.tipo"
                  :items="tipoActividadOptions"
                  label="Tipo de actividad"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="currentActividad.descripcion"
                  label="Descripción"
                  variant="outlined"
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="currentActividad.estado"
                  :items="estadoActividadOptions"
                  label="Estado"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentActividad.presupuesto"
                  label="Presupuesto"
                  type="number"
                  prefix="$"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="currentActividad.fecha_inicio"
                      label="Fecha de inicio"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="props"
                      variant="outlined"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="currentActividad.fecha_inicio"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="currentActividad.fecha_cierre"
                      label="Fecha de cierre"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="props"
                      variant="outlined"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="currentActividad.fecha_cierre"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="currentActividad.objetivo_de_actividad"
                  label="Objetivo de la actividad"
                  variant="outlined"
                  rows="2"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="currentActividad.descripcion_evaluacion"
                  label="Descripción de evaluación"
                  variant="outlined"
                  rows="2"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="currentActividad.proceso"
                  :items="procesos"
                  item-title="titulo"
                  item-value="id"
                  label="Proceso asociado"
                  variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="actividadDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveActividad" :loading="savingActividad">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar PEI -->
    <v-dialog v-model="confirmDeletePeiDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="bg-error text-white">
          <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text class="pt-4">
          <p class="text-body-1">
            ¿Está seguro que desea eliminar el PEI <strong>{{ peiToDelete?.titulo }}</strong
            >?
          </p>
          <p class="text-caption text-medium-emphasis mt-2">
            Esta acción eliminará todos los objetivos e indicadores asociados.
          </p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="confirmDeletePeiDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deletePei" :loading="deletingPei">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar Proyecto -->
    <v-dialog v-model="confirmDeleteProyectoDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="bg-error text-white">
          <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text class="pt-4">
          <p class="text-body-1">
            ¿Está seguro que desea eliminar el proyecto
            <strong>{{ proyectoToDelete?.titulo }}</strong
            >?
          </p>
          <p class="text-caption text-medium-emphasis mt-2">
            Esta acción eliminará todos los objetivos, resultados y actividades asociados.
          </p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="confirmDeleteProyectoDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteProyecto" :loading="deletingProyecto">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar Actividad -->
    <v-dialog v-model="confirmDeleteActividadDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="bg-error text-white">
          <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text class="pt-4">
          <p class="text-body-1">
            ¿Está seguro que desea eliminar la actividad
            <strong>{{ actividadToDelete?.codigo }}</strong
            >?
          </p>
          <p class="text-caption text-medium-emphasis mt-2">Esta acción no se puede deshacer.</p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="confirmDeleteActividadDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteActividad" :loading="deletingActividad"
            >Eliminar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de estructura de proyecto -->
    <v-dialog v-model="estructuraDialog" max-width="1200" persistent>
      <v-card>
        <v-card-title
          >Estructura del Proyecto: {{ currentProyectoEstructura?.titulo }}</v-card-title
        >
        <v-card-text>
          <div class="d-flex justify-center">
            <v-img
              :src="require('@/assets/project-structure-example.png')"
              max-width="1000"
              contain
            ></v-img>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="estructuraDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de reporte de indicador -->
    <v-dialog v-model="indicadorReportDialog" max-width="800" persistent>
      <v-card>
        <v-card-title>Reporte del Indicador: {{ currentIndicadorReport?.codigo }}</v-card-title>
        <v-card-text>
          <v-card variant="outlined" class="mb-4">
            <v-card-text>
              <div class="text-h6 mb-2">Descripción:</div>
              <p>{{ currentIndicadorReport?.descripcion }}</p>
              <div v-if="currentIndicadorReport?.tipo === 'Proporcion'" class="mt-2">
                <div class="text-subtitle-1">Fórmula:</div>
                <p class="font-italic">
                  {{ currentIndicadorReport?.numerador }} /
                  {{ currentIndicadorReport?.denominador }}
                </p>
              </div>
            </v-card-text>
          </v-card>

          <v-card variant="outlined">
            <v-card-title class="bg-primary text-white">Evolución Trimestral</v-card-title>
            <v-card-text>
              <div style="height: 300px; width: 100%">
                <canvas ref="indicadorChart"></canvas>
              </div>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="indicadorReportDialog = false">Cerrar</v-btn>
          <v-btn color="primary" prepend-icon="mdi-download">Exportar PDF</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useSnackbar } from '@/composables/useSnackbar'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import { useProyectoCrud } from '@/modules/proyecto/composables/useProyectoCrud'

// Registrar componentes necesarios de Chart.js
Chart.register(...registerables)

const { successMsg, errorMsg } = useSnackbar()

//Iniciar composables
const { proyectos, obtenerProyectos } = useProyectoCrud()

// Datos y estado
const loading = ref(true)
const tableLoading = ref(false)
const tab = ref('peis')
const indicadorChart = ref(null)
let chartInstance = null

// Resumen
const summary = ref({
  activePeis: 3,
  activeProjects: 12,
  completedActivities: 45,
})

// PEIs
const peis = ref([])
const searchPei = ref('')
const peiDialog = ref(false)
const isEditingPei = ref(false)
const currentPei = ref({
  titulo: '',
  descripcion: '',
  fecha_inicio: null,
  fecha_fin: null,
  esta_vigente: false,
})
const peiToDelete = ref(null)
const confirmDeletePeiDialog = ref(false)
const deletingPei = ref(false)
const savingPei = ref(false)

const peiHeaders = [
  { title: 'Título', key: 'titulo' },
  { title: 'Vigente', key: 'esta_vigente' },
  { title: 'Inicio', key: 'fecha_inicio' },
  { title: 'Fin', key: 'fecha_fin' },
  { title: 'Acciones', key: 'actions', sortable: false, width: '150px' },
]

// Proyectos
//const proyectos = ref([])
const searchProyecto = ref('')
const proyectoDialog = ref(false)
const isEditingProyecto = ref(false)
const currentProyecto = ref({
  codigo: '',
  titulo: '',
  descripcion: '',
  estado: 'ES',
  fecha_inicio: null,
  fecha_finalizacion: null,
  presupuesto: null,
  pei: null,
  instancia_gestora: [],
  procedencia_fondos: [],
})
const proyectoToDelete = ref(null)
const confirmDeleteProyectoDialog = ref(false)
const deletingProyecto = ref(false)
const savingProyecto = ref(false)
const estructuraDialog = ref(false)
const currentProyectoEstructura = ref(null)

const proyectoHeaders = [
  { title: 'Código', key: 'codigo' },
  { title: 'Título', key: 'titulo' },
  { title: 'Estado', key: 'estado' },
  { title: 'Presupuesto', key: 'presupuesto' },
  { title: 'Inicio', key: 'fecha_inicio' },
  { title: 'Fin', key: 'fecha_finalizacion' },
  { title: 'Acciones', key: 'actions', sortable: false, width: '180px' },
]

// Actividades
const actividades = ref([])
const searchActividad = ref('')
const actividadDialog = ref(false)
const isEditingActividad = ref(false)
const currentActividad = ref({
  codigo: '',
  descripcion: '',
  tipo: 'NODEF',
  estado: 'SPLAN',
  fecha_inicio: null,
  fecha_cierre: null,
  presupuesto: null,
  objetivo_de_actividad: '',
  descripcion_evaluacion: '',
  proceso: null,
})
const actividadToDelete = ref(null)
const confirmDeleteActividadDialog = ref(false)
const deletingActividad = ref(false)
const savingActividad = ref(false)
const actividadFilters = ref({
  estado: null,
  tipo: null,
})

const actividadHeaders = [
  { title: 'Código', key: 'codigo' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Tipo', key: 'tipo' },
  { title: 'Estado', key: 'estado' },
  { title: 'Inicio', key: 'fecha_inicio' },
  { title: 'Cierre', key: 'fecha_cierre' },
  { title: 'Presupuesto', key: 'presupuesto' },
  { title: 'Acciones', key: 'actions', sortable: false, width: '150px' },
]

// Indicadores
const indicadores = ref([])
const searchIndicador = ref('')
const indicadorReportDialog = ref(false)
const currentIndicadorReport = ref(null)
const indicadorFilters = ref({
  tipo: null,
})

const indicadorHeaders = [
  { title: 'Código', key: 'codigo' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Tipo', key: 'tipo' },
  { title: 'Relación', key: 'relacion' },
  { title: 'Acciones', key: 'actions', sortable: false, width: '120px' },
]

// Opciones para selects
const estadoProyectoOptions = [
  { title: 'Estructuración', value: 'ES' },
  { title: 'En Planificación', value: 'EP' },
  { title: 'Planificado', value: 'PL' },
]

const estadoActividadOptions = [
  { title: 'Sin Planificar', value: 'SPLAN' },
  { title: 'Planificado', value: 'PLAN' },
  { title: 'En Ejecución', value: 'EJEC' },
  { title: 'Postergado', value: 'POST' },
  { title: 'Cancelado', value: 'CANC' },
  { title: 'Completado', value: 'COMP' },
]

const tipoActividadOptions = [
  { title: 'No definido', value: 'NODEF' },
  { title: 'Capacitación', value: 'ACAP' },
  { title: 'Investigación', value: 'PRIN' },
  { title: 'Operativa', value: 'AOP' },
  { title: 'Sensibilización', value: 'CSNS' },
  { title: 'Desarrollo', value: 'PDES' },
  { title: 'Incidencia', value: 'AINC' },
  { title: 'Articulación', value: 'AART' },
]

const tipoIndicadorOptions = [
  { title: 'Proporción', value: 'Proporcion' },
  { title: 'Avance', value: 'Avance' },
]

// Datos dummy - Variables separadas
const listaPeis = [
  {
    id: 1,
    titulo: 'PEI 2023-2026',
    descripcion: 'Plan Estratégico Institucional para el periodo 2023-2026',
    fecha_inicio: '2023-01-01',
    fecha_fin: '2026-12-31',
    esta_vigente: true,
    creado_el: '2022-11-15T10:30:00Z',
    modificado_el: '2023-05-20T08:15:00Z',
  },
  {
    id: 2,
    titulo: 'PEI 2020-2022',
    descripcion: 'Plan Estratégico Institucional para el periodo 2020-2022',
    fecha_inicio: '2020-01-01',
    fecha_fin: '2022-12-31',
    esta_vigente: false,
    creado_el: '2019-10-10T09:20:00Z',
    modificado_el: '2022-12-31T23:59:00Z',
  },
  {
    id: 3,
    titulo: 'PEI 2017-2019',
    descripcion: 'Plan Estratégico Institucional para el periodo 2017-2019',
    fecha_inicio: '2017-01-01',
    fecha_fin: '2019-12-31',
    esta_vigente: false,
    creado_el: '2016-11-30T14:45:00Z',
    modificado_el: '2019-12-31T23:59:00Z',
  },
]

const listaProyectos = [
  {
    id: 1,
    codigo: 'PROJ-2023-001',
    titulo: 'Modernización de Sistemas Informáticos',
    descripcion: 'Proyecto para actualizar los sistemas informáticos de la institución',
    estado: 'PL',
    fecha_creacion: '2023-01-15T08:00:00Z',
    fecha_inicio: '2023-03-01',
    fecha_finalizacion: '2023-12-15',
    presupuesto: 250000,
    pei: 1,
    instancia_gestora: [1, 2],
    procedencia_fondos: [1],
  },
  {
    id: 2,
    codigo: 'PROJ-2023-002',
    titulo: 'Capacitación Docente',
    descripcion: 'Programa de capacitación continua para el personal docente',
    estado: 'EP',
    fecha_creacion: '2023-02-10T10:30:00Z',
    fecha_inicio: '2023-05-01',
    fecha_finalizacion: '2023-11-30',
    presupuesto: 120000,
    pei: 1,
    instancia_gestora: [2],
    procedencia_fondos: [2, 3],
  },
  {
    id: 3,
    codigo: 'PROJ-2022-015',
    titulo: 'Infraestructura Educativa',
    descripcion: 'Construcción y remodelación de espacios educativos',
    estado: 'ES',
    fecha_creacion: '2022-09-05T14:20:00Z',
    fecha_inicio: '2023-01-15',
    fecha_finalizacion: '2023-10-31',
    presupuesto: 500000,
    pei: 2,
    instancia_gestora: [1, 3],
    procedencia_fondos: [1, 2],
  },
]

const listaActividades = [
  {
    id: 1,
    codigo: 'ACT-001',
    descripcion: 'Taller de capacitación en nuevas tecnologías',
    tipo: 'ACAP',
    estado: 'COMP',
    fecha_inicio: '2023-03-15',
    fecha_cierre: '2023-03-17',
    presupuesto: 5000,
    objetivo_de_actividad: 'Capacitar al personal en el uso de nuevas herramientas tecnológicas',
    descripcion_evaluacion: 'Evaluación mediante pruebas prácticas y cuestionarios',
    proceso: 1,
  },
  {
    id: 2,
    codigo: 'ACT-002',
    descripcion: 'Adquisición de equipos informáticos',
    tipo: 'AOP',
    estado: 'EJEC',
    fecha_inicio: '2023-04-01',
    fecha_cierre: '2023-06-30',
    presupuesto: 150000,
    objetivo_de_actividad: 'Actualizar el parque tecnológico de la institución',
    descripcion_evaluacion: 'Verificación de especificaciones técnicas y pruebas de funcionamiento',
    proceso: 2,
  },
  {
    id: 3,
    codigo: 'ACT-003',
    descripcion: 'Investigación de mercado de soluciones tecnológicas',
    tipo: 'PRIN',
    estado: 'PLAN',
    fecha_inicio: '2023-05-10',
    fecha_cierre: '2023-05-30',
    presupuesto: 8000,
    objetivo_de_actividad: 'Identificar las mejores soluciones tecnológicas disponibles',
    descripcion_evaluacion: 'Análisis comparativo de propuestas',
    proceso: 3,
  },
]

const listaIndicadores = [
  {
    id: 1,
    codigo: 'IND-001',
    descripcion: 'Porcentaje de docentes capacitados en nuevas tecnologías',
    tipo: 'Proporcion',
    numerador: 'Número de docentes capacitados',
    denominador: 'Total de docentes',
    objetivo_general: 1,
  },
  {
    id: 2,
    codigo: 'IND-002',
    descripcion: 'Avance en la implementación del nuevo sistema informático',
    tipo: 'Avance',
    resultado_og: 1,
  },
  {
    id: 3,
    codigo: 'IND-003',
    descripcion: 'Porcentaje de equipos actualizados',
    tipo: 'Proporcion',
    numerador: 'Equipos actualizados',
    denominador: 'Total de equipos',
    objetivo_especifico: 2,
  },
]

// Datos dummy para selects
const instanciasGestoras = ref([
  { id: 1, codigo: 'IG-001', instancia: 'Dirección General' },
  { id: 2, codigo: 'IG-002', instancia: 'Gerencia de Proyectos' },
  { id: 3, codigo: 'IG-003', instancia: 'Departamento Financiero' },
])

const procedenciasFondos = ref([
  { id: 1, sigla: 'BM', financiera: 'Banco Mundial' },
  { id: 2, sigla: 'BID', financiera: 'Banco Interamericano de Desarrollo' },
  { id: 3, sigla: 'UE', financiera: 'Unión Europea' },
])

const procesos = ref([
  { id: 1, codigo: 'PROC-001', titulo: 'Planificación estratégica' },
  { id: 2, codigo: 'PROC-002', tititle: 'Ejecución de actividades' },
  { id: 3, codigo: 'PROC-003', titulo: 'Monitoreo y evaluación' },
])

// Computed
const filteredPeis = computed(() => {
  return peis.value.filter(
    (pei) =>
      pei.titulo.toLowerCase().includes(searchPei.value.toLowerCase()) ||
      pei.descripcion.toLowerCase().includes(searchPei.value.toLowerCase()),
  )
})

const filteredProyectos = computed(() => {
  return proyectos.value.filter(
    (proyecto) =>
      proyecto.codigo.toLowerCase().includes(searchProyecto.value.toLowerCase()) ||
      proyecto.titulo.toLowerCase().includes(searchProyecto.value.toLowerCase()) ||
      proyecto.descripcion.toLowerCase().includes(searchProyecto.value.toLowerCase()),
  )
})

const filteredActividades = computed(() => {
  return actividades.value.filter((actividad) => {
    // Filtro por estado
    if (actividadFilters.value.estado && actividad.estado !== actividadFilters.value.estado)
      return false

    // Filtro por tipo
    if (actividadFilters.value.tipo && actividad.tipo !== actividadFilters.value.tipo) return false

    // Filtro por búsqueda
    if (
      searchActividad.value &&
      !actividad.codigo.toLowerCase().includes(searchActividad.value.toLowerCase()) &&
      !actividad.descripcion.toLowerCase().includes(searchActividad.value.toLowerCase())
    ) {
      return false
    }

    return true
  })
})

const filteredIndicadores = computed(() => {
  return indicadores.value.filter((indicador) => {
    // Filtro por tipo
    if (indicadorFilters.value.tipo && indicador.tipo !== indicadorFilters.value.tipo) return false

    // Filtro por búsqueda
    if (
      searchIndicador.value &&
      !indicador.codigo.toLowerCase().includes(searchIndicador.value.toLowerCase()) &&
      !indicador.descripcion.toLowerCase().includes(searchIndicador.value.toLowerCase())
    ) {
      return false
    }

    return true
  })
})

// Métodos
const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const getEstadoColor = (estado) => {
  const colors = {
    ES: 'warning',
    EP: 'info',
    PL: 'success',
  }
  return colors[estado] || 'primary'
}

const getEstadoText = (estado) => {
  const texts = {
    ES: 'Estructuración',
    EP: 'En Planificación',
    PL: 'Planificado',
  }
  return texts[estado] || estado
}

const getActividadEstadoColor = (estado) => {
  const colors = {
    SPLAN: 'grey',
    PLAN: 'info',
    EJEC: 'primary',
    POST: 'warning',
    CANC: 'error',
    COMP: 'success',
  }
  return colors[estado] || 'primary'
}

const getActividadEstadoText = (estado) => {
  const texts = {
    SPLAN: 'Sin Planificar',
    PLAN: 'Planificado',
    EJEC: 'En Ejecución',
    POST: 'Postergado',
    CANC: 'Cancelado',
    COMP: 'Completado',
  }
  return texts[estado] || estado
}

const getActividadTipoText = (tipo) => {
  const texts = {
    NODEF: 'No definido',
    ACAP: 'Capacitación',
    PRIN: 'Investigación',
    AOP: 'Operativa',
    CSNS: 'Sensibilización',
    PDES: 'Desarrollo',
    AINC: 'Incidencia',
    AART: 'Articulación',
  }
  return texts[tipo] || tipo
}

const getRelacionIndicador = (indicador) => {
  if (indicador.objetivo_general) return 'Objetivo General'
  if (indicador.resultado_og) return 'Resultado OG'
  if (indicador.objetivo_especifico) return 'Objetivo Específico'
  if (indicador.resultado_obj_especifico) return 'Resultado OE'
  return 'Sin relación'
}

const initChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = indicadorChart.value.getContext('2d')
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Valor',
          data: [65, 72, 80, 85],
          borderColor: '#1976D2',
          backgroundColor: 'transparent',
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#1976D2',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Meta',
          data: [70, 75, 80, 90],
          borderColor: '#4CAF50',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#4CAF50',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          position: 'top',
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function (value) {
              return value + '%'
            },
          },
        },
      },
    },
  })
}

// PEI methods
const openPeiDialog = () => {
  currentPei.value = {
    titulo: '',
    descripcion: '',
    fecha_inicio: null,
    fecha_fin: null,
    esta_vigente: false,
  }
  isEditingPei.value = false
  peiDialog.value = true
}

const editPei = (pei) => {
  currentPei.value = { ...pei }
  isEditingPei.value = true
  peiDialog.value = true
}

const savePei = async () => {
  try {
    savingPei.value = true

    // Simulación de guardado
    if (isEditingPei.value) {
      const index = peis.value.findIndex((p) => p.id === currentPei.value.id)
      if (index !== -1) {
        peis.value[index] = { ...currentPei.value }
      }
      successMsg('PEI actualizado correctamente')
    } else {
      const newPei = {
        ...currentPei.value,
        id: peis.value.length + 1,
        creado_el: new Date().toISOString(),
        modificado_el: new Date().toISOString(),
      }
      peis.value.unshift(newPei)
      successMsg('PEI creado correctamente')
    }

    peiDialog.value = false
  } catch (error) {
    errorMsg('Error al guardar PEI')
    console.error('Error saving PEI:', error)
  } finally {
    savingPei.value = false
  }
}

const confirmDeletePei = (pei) => {
  peiToDelete.value = pei
  confirmDeletePeiDialog.value = true
}

const deletePei = async () => {
  try {
    deletingPei.value = true

    // Simulación de eliminación
    peis.value = peis.value.filter((p) => p.id !== peiToDelete.value.id)
    successMsg('PEI eliminado correctamente')
    confirmDeletePeiDialog.value = false
  } catch (error) {
    errorMsg('Error al eliminar PEI')
    console.error('Error deleting PEI:', error)
  } finally {
    deletingPei.value = false
  }
}

const viewPeiDetails = (pei) => {
  console.log('Viewing PEI details:', pei)
  // Navegar a vista de detalles del PEI
}

// Proyecto methods
const openProyectoDialog = () => {
  currentProyecto.value = {
    codigo: '',
    titulo: '',
    descripcion: '',
    estado: 'ES',
    fecha_inicio: null,
    fecha_finalizacion: null,
    presupuesto: null,
    pei: null,
    instancia_gestora: [],
    procedencia_fondos: [],
  }
  isEditingProyecto.value = false
  proyectoDialog.value = true
}

const editProyecto = (proyecto) => {
  currentProyecto.value = { ...proyecto }
  isEditingProyecto.value = true
  proyectoDialog.value = true
}

const saveProyecto = async () => {
  try {
    savingProyecto.value = true

    // Simulación de guardado
    if (isEditingProyecto.value) {
      const index = proyectos.value.findIndex((p) => p.id === currentProyecto.value.id)
      if (index !== -1) {
        proyectos.value[index] = { ...currentProyecto.value }
      }
      successMsg('Proyecto actualizado correctamente')
    } else {
      const newProyecto = {
        ...currentProyecto.value,
        id: proyectos.value.length + 1,
        fecha_creacion: new Date().toISOString(),
      }
      proyectos.value.unshift(newProyecto)
      successMsg('Proyecto creado correctamente')
    }

    proyectoDialog.value = false
  } catch (error) {
    errorMsg('Error al guardar proyecto')
    console.error('Error saving project:', error)
  } finally {
    savingProyecto.value = false
  }
}

const confirmDeleteProyecto = (proyecto) => {
  proyectoToDelete.value = proyecto
  confirmDeleteProyectoDialog.value = true
}

const deleteProyecto = async () => {
  try {
    deletingProyecto.value = true

    // Simulación de eliminación
    proyectos.value = proyectos.value.filter((p) => p.id !== proyectoToDelete.value.id)
    successMsg('Proyecto eliminado correctamente')
    confirmDeleteProyectoDialog.value = false
  } catch (error) {
    errorMsg('Error al eliminar proyecto')
    console.error('Error deleting project:', error)
  } finally {
    deletingProyecto.value = false
  }
}

const viewProyectoDetails = (proyecto) => {
  console.log('Viewing project details:', proyecto)
  // Navegar a vista de detalles del proyecto
}

const openEstructuraDialog = (proyecto) => {
  currentProyectoEstructura.value = proyecto
  estructuraDialog.value = true
}

// Actividad methods
const openActividadDialog = () => {
  currentActividad.value = {
    codigo: '',
    descripcion: '',
    tipo: 'NODEF',
    estado: 'SPLAN',
    fecha_inicio: null,
    fecha_cierre: null,
    presupuesto: null,
    objetivo_de_actividad: '',
    descripcion_evaluacion: '',
    proceso: null,
  }
  isEditingActividad.value = false
  actividadDialog.value = true
}

const editActividad = (actividad) => {
  currentActividad.value = { ...actividad }
  isEditingActividad.value = true
  actividadDialog.value = true
}

const saveActividad = async () => {
  try {
    savingActividad.value = true

    // Simulación de guardado
    if (isEditingActividad.value) {
      const index = actividades.value.findIndex((a) => a.id === currentActividad.value.id)
      if (index !== -1) {
        actividades.value[index] = { ...currentActividad.value }
      }
      successMsg('Actividad actualizada correctamente')
    } else {
      const newActividad = {
        ...currentActividad.value,
        id: actividades.value.length + 1,
      }
      actividades.value.unshift(newActividad)
      successMsg('Actividad creada correctamente')
    }

    actividadDialog.value = false
  } catch (error) {
    errorMsg('Error al guardar actividad')
    console.error('Error saving activity:', error)
  } finally {
    savingActividad.value = false
  }
}

const confirmDeleteActividad = (actividad) => {
  actividadToDelete.value = actividad
  confirmDeleteActividadDialog.value = true
}

const deleteActividad = async () => {
  try {
    deletingActividad.value = true

    // Simulación de eliminación
    actividades.value = actividades.value.filter((a) => a.id !== actividadToDelete.value.id)
    successMsg('Actividad eliminada correctamente')
    confirmDeleteActividadDialog.value = false
  } catch (error) {
    errorMsg('Error al eliminar actividad')
    console.error('Error deleting activity:', error)
  } finally {
    deletingActividad.value = false
  }
}

const viewActividadDetails = (actividad) => {
  console.log('Viewing activity details:', actividad)
  // Navegar a vista de detalles de la actividad
}

// Indicador methods
const openIndicadorReportDialog = (indicador) => {
  currentIndicadorReport.value = indicador
  indicadorReportDialog.value = true

  nextTick(() => {
    initChart()
  })
}

const viewIndicadorDetails = (indicador) => {
  console.log('Viewing indicator details:', indicador)
  // Navegar a vista de detalles del indicador
}

// Cargar datos iniciales
const loadInitialData = () => {
  // Asignar datos dummy desde las variables
  peis.value = [...listaPeis]
  proyectos.value = [...listaProyectos]
  actividades.value = [...listaActividades]
  indicadores.value = [...listaIndicadores]

  loading.value = false
}

// Limpiar el gráfico cuando se cierra el diálogo
watch(indicadorReportDialog, (newVal) => {
  if (!newVal && chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

// Ciclo de vida
onMounted(() => {
  loadInitialData()
})

// Reglas de validación
const required = (v) => !!v || 'Campo requerido'
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}

.summary-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
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

@media (max-width: 960px) {
  .dashboard-container {
    padding: 16px 12px;
  }
}
</style>
