<template>
  <v-container>
    <!-- Indicador de carga lineal -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      height="4"
      class="mb-4"
    ></v-progress-linear>

    <!-- Mensaje cuando no hay actividades -->
    <v-card v-if="emptyResponse && !loading" class="mb-4">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey lighten-1">mdi-calendar-remove</v-icon>
        <h3 class="text-h5 mt-4">No hay actividades registradas</h3>
        <p class="text-grey mt-2">Parece que aún no has creado ninguna actividad</p>
        <v-btn color="primary" @click="dialogNuevaActividad = true" class="mt-4">
          <v-icon left>mdi-plus</v-icon>
          Crear primera actividad
        </v-btn>
      </v-card-text>
    </v-card>

    <v-row v-else>
      <!-- Columna principal -->
      <v-col cols="12" md="9" lg="9">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Lista de Actividades</span>
            <span class="text-caption text-grey">Total: {{ filteredActividades.length }}</span>
          </v-card-title>

          <!-- Buscador y filtros -->
          <v-card-text class="pt-0 pb-4">
            <v-text-field
              v-model="searchQuery"
              label="Buscar actividades (por código o descripción)"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              density="comfortable"
              @input="currentPage = 1"
            ></v-text-field>

            <div class="d-flex flex-wrap gap-2 mt-2">
              <!-- Filtros por estado -->
              <v-chip-group v-model="statusFilters" multiple column>
                <v-chip
                  v-for="status in availableStatuses"
                  :key="status.value"
                  :value="status.value"
                  filter
                  :color="getStatusColor(status.value)"
                  variant="outlined"
                >
                  {{ status.text }}
                </v-chip>
              </v-chip-group>

              <!-- Filtro por tipo de actividad -->
              <v-select
                v-model="tipoFilter"
                :items="tiposActividad"
                item-value="value"
                item-title="text"
                label="Tipo de actividad"
                clearable
                variant="outlined"
                density="compact"
                style="min-width: 200px"
              ></v-select>

              <!-- Filtro por procedencia de fondos -->
              <v-select
                v-model="procedenciaFilter"
                :items="procedenciaFondos"
                item-value="value"
                item-title="text"
                label="Procedencia fondos"
                clearable
                variant="outlined"
                density="compact"
                style="min-width: 200px"
              ></v-select>
            </div>
          </v-card-text>

          <v-list v-if="!loading" class="py-0">
            <template v-for="item in actividadesPaginadas" :key="item.id">
              <v-list-item :value="item" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar :color="getStatusColor(item.estado)" class="mr-4">
                    <v-icon dark>{{ getTipoIcon(item.tipo) }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">
                  {{ getTipoTexto(item.tipo) }}: {{ item.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap">
                    <v-chip
                      small
                      :color="getStatusColor(item.estado)"
                      text-color="white"
                      class="mr-2"
                    >
                      {{ getEstadoTexto(item.estado) }}
                    </v-chip>
                    <span class="mr-2">Presupuesto: {{ formatCurrency(item.presupuesto) }}</span>
                    <span>Fondos: {{ getProcedenciaTexto(item.procedencia_fondos) }}</span>
                  </div>
                  <div class="text-caption mt-1">{{ item.descripcion }}</div>
                  <div class="text-caption mt-1" v-if="item.fecha_programada">
                    <strong>Programada:</strong> {{ formatDate(item.fecha_programada) }}
                    <span v-if="item.duracion"> (Duración: {{ item.duracion }} días)</span>
                  </div>
                  <div class="text-caption mt-1" v-if="item.fecha_inicio">
                    <strong>Ejecución:</strong> {{ formatDate(item.fecha_inicio) }}
                    <span v-if="item.fecha_cierre">a {{ formatDate(item.fecha_cierre) }}</span>
                  </div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex">
                    <v-tooltip text="Solicitud de Fondos" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="primary"
                          :to="`/pei/formulario01`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Solicitud de Reposicion" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="warning"
                          :to="`/pei/formulario03`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Rendicion de Cuentas" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 2"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="error"
                          :to="`/pei/formulario02`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Informe de Actividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 3"
                          v-bind="props"
                          icon="mdi-chevron-down"
                          variant="text"
                          color="info"
                          @click="toggleExpanded(item.id)"
                          :class="{ 'rotate-180': expandedActividadId === item.id }"
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <!-- Tarjeta de detalles desplegable -->
              <v-expand-transition>
                <div v-if="expandedActividadId === item.id">
                  <v-card elevation="0" class="ml-10 mr-4 mb-4 bg-grey-lighten-4">
                    <v-tabs v-model="activeTab" color="primary" grow>
                      <v-tab value="datos">
                        <v-icon left>mdi-information</v-icon>
                        Datos
                      </v-tab>
                      <v-tab value="objetivo">
                        <v-icon left>mdi-target</v-icon>
                        Objetivo
                      </v-tab>
                      <v-tab value="evaluacion">
                        <v-icon left>mdi-clipboard-text</v-icon>
                        Evaluación
                      </v-tab>
                      <v-tab value="tareas">
                        <v-icon left>mdi-checkbox-marked-circle-outline</v-icon>
                        Tareas
                        <v-chip color="primary" small class="ml-2">
                          {{ getTareasCount(item.id) }}
                        </v-chip>
                      </v-tab>
                    </v-tabs>

                    <v-card-text class="pt-4">
                      <v-window v-model="activeTab">
                        <!-- Tab Datos de la Actividad -->
                        <v-window-item value="datos">
                          <v-row>
                            <v-col cols="12" md="6">
                              <p><strong>Tipo:</strong> {{ getTipoTexto(item.tipo) }}</p>
                              <p><strong>Estado:</strong> {{ getEstadoTexto(item.estado) }}</p>
                              <p><strong>Código:</strong> {{ item.codigo }}</p>
                              <p>
                                <strong>Presupuesto:</strong> {{ formatCurrency(item.presupuesto) }}
                              </p>
                              <p>
                                <strong>Presupuesto PEI:</strong>
                                {{ formatCurrency(item.presupuesto_pei) }}
                              </p>
                            </v-col>
                            <v-col cols="12" md="6">
                              <p>
                                <strong>Fondos:</strong>
                                {{ getProcedenciaTexto(item.procedencia_fondos) }}
                              </p>
                              <p v-if="item.fecha_programada">
                                <strong>Fecha programada:</strong>
                                {{ formatDate(item.fecha_programada) }}
                              </p>
                              <p v-if="item.duracion">
                                <strong>Duración:</strong> {{ item.duracion }} días
                              </p>
                              <p v-if="item.fecha_inicio">
                                <strong>Fecha inicio:</strong> {{ formatDate(item.fecha_inicio) }}
                              </p>
                              <p v-if="item.fecha_cierre">
                                <strong>Fecha cierre:</strong> {{ formatDate(item.fecha_cierre) }}
                              </p>
                            </v-col>
                          </v-row>
                        </v-window-item>

                        <!-- Tab Objetivo -->
                        <v-window-item value="objetivo">
                          <p><strong>Objetivo:</strong></p>
                          <p>{{ item.objetivo_de_actividad || 'No se ha definido un objetivo' }}</p>
                        </v-window-item>

                        <!-- Tab Evaluación -->
                        <v-window-item value="evaluacion">
                          <p><strong>Descripción de evaluación:</strong></p>
                          <p>
                            {{ item.descripcion_evaluacion || 'No se ha definido una evaluación' }}
                          </p>
                          <p v-if="item.justificacion_modificacion" class="mt-2">
                            <strong>Justificación de modificación:</strong><br />
                            {{ item.justificacion_modificacion }}
                          </p>
                        </v-window-item>

                        <!-- Tab Tareas -->
                        <v-window-item value="tareas">
                          <div class="d-flex justify-space-between align-center mb-4">
                            <div>
                              <v-chip
                                v-for="(count, status) in getTareasStatusCount(item.id)"
                                :key="status"
                                :color="getTareaStatusColor(status)"
                                class="mr-2 mb-2"
                              >
                                {{ status }}: {{ count }}
                              </v-chip>
                            </div>
                            <v-btn color="primary" @click="openTareasModal(item.id)">
                              <v-icon left>mdi-cog</v-icon>
                              Administrar Tareas
                            </v-btn>
                          </div>

                          <v-list v-if="getTareasByActividad(item.id).length > 0">
                            <v-list-item
                              v-for="tarea in getTareasByActividad(item.id)"
                              :key="tarea.id"
                              :class="{
                                'bg-green-lighten-5': tarea.estado === 'realizada',
                                'bg-orange-lighten-5': tarea.estado === 'Retraso',
                                'bg-blue-lighten-5': tarea.estado === 'Postergada',
                              }"
                            >
                              <template v-slot:prepend>
                                <v-checkbox
                                  v-model="tarea.completada"
                                  :color="getTareaStatusColor(tarea.estado)"
                                  @change="updateTareaEstado(tarea)"
                                ></v-checkbox>
                              </template>

                              <v-list-item-title>
                                <strong>{{ tarea.titulo }}</strong>
                                <v-chip
                                  small
                                  :color="getTareaStatusColor(tarea.estado)"
                                  class="ml-2"
                                >
                                  {{ tarea.estado }}
                                </v-chip>
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                {{ tarea.descripcion }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle class="mt-1">
                                <v-icon small>mdi-calendar</v-icon>
                                {{ formatDate(tarea.fecha) }}
                                <span v-if="isTareaAtrasada(tarea)" class="red--text ml-2">
                                  (Atrasada)
                                </span>
                              </v-list-item-subtitle>
                            </v-list-item>
                          </v-list>
                          <v-alert v-else type="info">
                            No hay tareas registradas para esta actividad
                          </v-alert>
                        </v-window-item>
                      </v-window>

                      <div class="d-flex justify-end mt-4">
                        <v-btn
                          color="primary"
                          variant="text"
                          size="small"
                          :to="`/actividad/${item.id}/detalle`"
                        >
                          Ver detalles completos
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expand-transition>
            </template>

            <v-list-item v-if="filteredActividades.length === 0 && !loading">
              <v-list-item-title class="text-grey">No se encontraron actividades</v-list-item-title>
            </v-list-item>
          </v-list>

          <!-- Paginación -->
          <v-pagination
            v-if="totalPages > 1"
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            class="mt-4"
          ></v-pagination>

          <div
            v-if="filteredActividades.length > 0"
            class="d-flex align-center justify-space-between mt-2"
          >
            <span class="text-caption text-grey">
              Mostrando {{ startItem }}-{{ endItem }} de {{ filteredActividades.length }}
            </span>
            <v-select
              v-model="itemsPerPage"
              :items="[5, 10, 20, 50]"
              label="Items por página"
              density="compact"
              style="max-width: 150px"
              variant="outlined"
            ></v-select>
          </div>
        </v-card>
      </v-col>

      <!-- Columna lateral -->
      <v-col cols="12" md="3" lg="3">
        <!-- Tarjeta de estadísticas -->
        <v-card elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-chart-box</v-icon>
            Estadísticas
          </v-card-title>

          <v-list density="comfortable">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-calendar-check</v-icon>
              </template>
              <v-list-item-title>Total actividades</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{
                filteredActividades.length
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="yellow">mdi-calendar-question</v-icon>
              </template>
              <v-list-item-title>Reprogramación</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('SPLAN') }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="light-blue">mdi-calendar-edit</v-icon>
              </template>
              <v-list-item-title>Planificación</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('PLAN') }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="orange">mdi-progress-clock</v-icon>
              </template>
              <v-list-item-title>En Ejecución</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('EJEC') }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="green">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>Finalizado</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('COMP') }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la ACTIVIDAD: "{{ actividadToDelete?.codigo }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteActividad">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para nueva actividad -->
    <v-dialog v-model="dialogNuevaActividad" max-width="800" persistent>
      <v-card>
        <v-toolbar color="primary" title="Nueva Actividad"></v-toolbar>

        <v-card-text>
          <v-form ref="form" v-model="formValid" @submit.prevent="openConfirmation">
            <v-container>
              <!-- Primera fila: Código y Tipo -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="actividad.codigo"
                    label="Código *"
                    :rules="codigoRules"
                    counter="60"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="actividad.tipo"
                    :items="tiposActividad"
                    label="Tipo de actividad *"
                    item-title="text"
                    item-value="value"
                    required
                    variant="outlined"
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Descripción -->
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="actividad.descripcion"
                    label="Descripción *"
                    rows="3"
                    variant="outlined"
                    :rules="[(v) => !!v || 'La descripción es requerida']"
                  ></v-textarea>
                </v-col>
              </v-row>

              <!-- Segunda fila: Estado y Procedencia de fondos -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="actividad.estado"
                    :items="availableStatuses"
                    label="Estado *"
                    item-title="text"
                    item-value="value"
                    required
                    variant="outlined"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="actividad.procedencia_fondos"
                    :items="procedenciaFondos"
                    label="Procedencia de fondos *"
                    item-title="text"
                    item-value="value"
                    required
                    variant="outlined"
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Tercera fila: Presupuestos -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="actividad.presupuesto"
                    label="Presupuesto"
                    type="number"
                    step="0.01"
                    min="0"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="actividad.presupuesto_pei"
                    label="Presupuesto PEI"
                    type="number"
                    step="0.01"
                    min="0"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Cuarta fila: Fechas -->
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Fecha programada"
                    v-model="actividad.fecha_programada"
                    type="date"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="Fecha de inicio"
                    v-model="actividad.fecha_inicio"
                    type="date"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="Fecha de cierre"
                    v-model="actividad.fecha_cierre"
                    type="date"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Quinta fila: Duración -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="actividad.duracion"
                    label="Duración (días)"
                    type="number"
                    min="0"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <!-- Sexta fila: Objetivo y evaluación -->
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="actividad.objetivo_de_actividad"
                    label="Objetivo de la actividad"
                    rows="2"
                    variant="outlined"
                  ></v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="actividad.descripcion_evaluacion"
                    label="Descripción de evaluación"
                    rows="2"
                    variant="outlined"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closeDialog"> Cancelar </v-btn>
          <v-btn
            color="success"
            variant="elevated"
            :disabled="!formValid"
            @click="openConfirmation"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación de creación -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar creación</v-card-title>
        <v-card-text> ¿Está seguro que desea crear esta actividad? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="text" @click="confirmDialog = false"> No </v-btn>
          <v-btn color="primary" variant="elevated" @click="submitActividad"> Sí, crear </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para administrar tareas -->
    <v-dialog v-model="tareasModal" max-width="800" persistent>
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>
            Administrar Tareas - {{ actividadSeleccionada?.codigo || '' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="tareasModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-form @submit.prevent="agregarTarea">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="nuevaTarea.titulo"
                  label="Título de la tarea"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="nuevaTarea.fecha"
                  label="Fecha"
                  type="date"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="nuevaTarea.descripcion"
                  label="Descripción"
                  rows="2"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="nuevaTarea.estado"
                  :items="estadosTarea"
                  label="Estado"
                  item-title="text"
                  item-value="value"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" class="d-flex align-center">
                <v-checkbox v-model="nuevaTarea.completada" label="Completada"></v-checkbox>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  type="submit"
                  :disabled="!nuevaTarea.titulo || !nuevaTarea.fecha"
                >
                  {{ editandoTarea ? 'Actualizar' : 'Agregar' }} Tarea
                </v-btn>
              </v-col>
            </v-row>
          </v-form>

          <v-divider class="my-4"></v-divider>

          <v-data-table
            :headers="headersTareas"
            :items="tareasFiltradas"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:item.estado="{ item }">
              <v-chip :color="getTareaStatusColor(item.estado)">
                {{ item.estado }}
              </v-chip>
            </template>

            <template v-slot:item.fecha="{ item }">
              {{ formatDate(item.fecha) }}
              <span v-if="isTareaAtrasada(item)" class="red--text ml-2"> (Atrasada) </span>
            </template>

            <template v-slot:item.completada="{ item }">
              <v-checkbox v-model="item.completada" @change="updateTareaEstado(item)"></v-checkbox>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn icon color="primary" @click="editarTarea(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="error" @click="confirmarEliminarTarea(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar tarea -->
    <v-dialog v-model="confirmarEliminarDialog" max-width="400">
      <v-card>
        <v-card-title>Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la tarea "{{ tareaAEliminar?.titulo }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="confirmarEliminarDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="eliminarTarea">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Mensaje de confirmación -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false"> Cerrar </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Enrutador
const router = useRouter()

// Estado del snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success', // 'success' o 'error'
})

// Estados para los modales CREACION DE ACTIVIDAD
const dialogNuevaActividad = ref(false)
const confirmDialog = ref(false)
const form = ref(null)
const formValid = ref(false)

// Datos de actividades dummy
const actividades = ref([])
const loading = ref(true)
const error = ref(null)
const emptyResponse = ref(false)

// Función para cargar datos dummy
const loadDummyData = () => {
  loading.value = true

  // Datos de prueba
  const dummyData = [
    {
      id: 1,
      codigo: 'ACAP-2023-001',
      descripcion: 'Taller de capacitación en desarrollo web',
      tipo: 'ACAP',
      fecha_programada: '2023-05-15',
      duracion: 2,
      fecha_inicio: '2023-05-15',
      fecha_cierre: '2023-05-16',
      presupuesto: 1500.5,
      presupuesto_pei: 1200.0,
      estado: 'COMP',
      procedencia_fondos: 'PROY',
      objetivo_de_actividad: 'Capacitar al personal en tecnologías web modernas',
      descripcion_evaluacion: 'Evaluación mediante examen práctico y cuestionario',
      justificacion_modificacion: '',
    },
    {
      id: 2,
      codigo: 'PRIN-2023-002',
      descripcion: 'Investigación sobre inteligencia artificial',
      tipo: 'PRIN',
      fecha_programada: '2023-06-01',
      duracion: 90,
      fecha_inicio: '2023-06-01',
      fecha_cierre: null,
      presupuesto: 5000.0,
      presupuesto_pei: 4500.0,
      estado: 'EJEC',
      procedencia_fondos: 'UG',
      objetivo_de_actividad: 'Investigar aplicaciones prácticas de IA en nuestro sector',
      descripcion_evaluacion: 'Informe final y presentación de resultados',
      justificacion_modificacion: '',
    },
    {
      id: 3,
      codigo: 'AOP-2023-003',
      descripcion: 'Mantenimiento de servidores',
      tipo: 'AOP',
      fecha_programada: '2023-04-10',
      duracion: 1,
      fecha_inicio: null,
      fecha_cierre: null,
      presupuesto: 800.0,
      presupuesto_pei: 800.0,
      estado: 'PLAN',
      procedencia_fondos: 'UG',
      objetivo_de_actividad: 'Mantener los servidores en óptimas condiciones',
      descripcion_evaluacion: 'Verificación de funcionamiento post-mantenimiento',
      justificacion_modificacion: 'Se pospuso por falta de personal técnico',
    },
    {
      id: 4,
      codigo: 'CSNS-2023-004',
      descripcion: 'Campaña de sensibilización ambiental',
      tipo: 'CSNS',
      fecha_programada: '2023-07-20',
      duracion: 5,
      fecha_inicio: null,
      fecha_cierre: null,
      presupuesto: 2000.0,
      presupuesto_pei: 1500.0,
      estado: 'SPLAN',
      procedencia_fondos: 'PROY',
      objetivo_de_actividad: 'Concientizar sobre prácticas ambientales sostenibles',
      descripcion_evaluacion: 'Encuestas pre y post campaña',
      justificacion_modificacion: '',
    },
    {
      id: 5,
      codigo: 'PDES-2023-005',
      descripcion: 'Desarrollo de nuevo módulo de software',
      tipo: 'PDES',
      fecha_programada: '2023-03-01',
      duracion: 120,
      fecha_inicio: '2023-03-01',
      fecha_cierre: '2023-06-29',
      presupuesto: 7500.0,
      presupuesto_pei: 7000.0,
      estado: 'COMP',
      procedencia_fondos: 'PROY',
      objetivo_de_actividad: 'Desarrollar módulo de gestión de proyectos',
      descripcion_evaluacion: 'Pruebas de usabilidad y rendimiento',
      justificacion_modificacion: '',
    },
    {
      id: 6,
      codigo: 'AINC-2023-006',
      descripcion: 'Reunión con socios estratégicos',
      tipo: 'AINC',
      fecha_programada: '2023-08-15',
      duracion: 1,
      fecha_inicio: null,
      fecha_cierre: null,
      presupuesto: 500.0,
      presupuesto_pei: 500.0,
      estado: 'PLAN',
      procedencia_fondos: 'UG',
      objetivo_de_actividad: 'Fortalecer alianzas con socios clave',
      descripcion_evaluacion: 'Seguimiento a acuerdos establecidos',
      justificacion_modificacion: '',
    },
    {
      id: 7,
      codigo: 'AART-2023-007',
      descripcion: 'Taller interdepartamental',
      tipo: 'AART',
      fecha_programada: '2023-09-10',
      duracion: 3,
      fecha_inicio: null,
      fecha_cierre: null,
      presupuesto: 1200.0,
      presupuesto_pei: 1000.0,
      estado: 'SPLAN',
      procedencia_fondos: 'PROY',
      objetivo_de_actividad: 'Mejorar la comunicación entre departamentos',
      descripcion_evaluacion: 'Encuesta de satisfacción',
      justificacion_modificacion: 'Cambio de fecha por disponibilidad de facilitador',
    },
  ]

  actividades.value = dummyData
  emptyResponse.value = actividades.value.length === 0
  loading.value = false
}

// Resto del código permanece igual...
const deleteDialog = ref(false)
const actividadToDelete = ref(null)
const expandedActividadId = ref(null)
const searchQuery = ref('')
const activeTab = ref('datos')

// Filtros
const statusFilters = ref([])
const tipoFilter = ref(null)
const procedenciaFilter = ref(null)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Opciones para selects
const availableStatuses = [
  { text: 'Reprogramación', value: 'SPLAN' },
  { text: 'Planificación', value: 'PLAN' },
  { text: 'En Ejecución', value: 'EJEC' },
  { text: 'En Reporte', value: 'POST' },
  { text: 'Retraso', value: 'CANC' },
  { text: 'Finalizado', value: 'COMP' },
]

const tiposActividad = [
  { text: 'No definido', value: 'NODEF' },
  { text: 'Capacitación', value: 'ACAP' },
  { text: 'Investigación', value: 'PRIN' },
  { text: 'Operativa', value: 'AOP' },
  { text: 'Sensibilización', value: 'CSNS' },
  { text: 'Desarrollo', value: 'PDES' },
  { text: 'Incidencia', value: 'AINC' },
  { text: 'Articulación', value: 'AART' },
]

const procedenciaFondos = [
  { text: 'Fondos de la Institución', value: 'UG' },
  { text: 'Fondos del proyecto', value: 'PROY' },
]

// Modelo para nueva actividad
const actividad = ref({
  codigo: '',
  descripcion: '',
  tipo: 'NODEF',
  fecha_programada: null,
  duracion: null,
  fecha_inicio: null,
  fecha_cierre: null,
  presupuesto: null,
  presupuesto_pei: null,
  estado: 'SPLAN',
  procedencia_fondos: 'PROY',
  objetivo_de_actividad: '',
  descripcion_evaluacion: '',
  justificacion_modificacion: '',
  datos_actividad: null,
})

// Nuevas propiedades para gestión de tareas
const tareasModal = ref(false)
const actividadSeleccionada = ref(null)
const tareas = ref([])
const nuevaTarea = ref({
  id: null,
  titulo: '',
  descripcion: '',
  fecha: null,
  estado: 'pendiente',
  completada: false,
  actividadId: null,
})
const tareaAEliminar = ref(null)
const confirmarEliminarDialog = ref(false)
const editandoTarea = ref(false)

const estadosTarea = [
  { text: 'Realizada', value: 'realizada' },
  { text: 'Pendiente', value: 'pendiente' },
  { text: 'Retraso', value: 'Retraso' },
  { text: 'Postergada', value: 'Postergada' },
]

const headersTareas = [
  { title: 'Título', key: 'titulo' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Fecha', key: 'fecha' },
  { title: 'Estado', key: 'estado' },
  { title: 'Completada', key: 'completada' },
  { title: 'Acciones', key: 'actions' },
]

// Computed
const filteredActividades = computed(() => {
  let filtered = actividades.value

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (actividad) =>
        (actividad.codigo && actividad.codigo.toLowerCase().includes(query)) ||
        (actividad.descripcion && actividad.descripcion.toLowerCase().includes(query)),
    )
  }

  // Filtro por estado
  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((actividad) => statusFilters.value.includes(actividad.estado))
  }

  // Filtro por tipo
  if (tipoFilter.value) {
    filtered = filtered.filter((actividad) => actividad.tipo === tipoFilter.value)
  }

  // Filtro por procedencia de fondos
  if (procedenciaFilter.value) {
    filtered = filtered.filter(
      (actividad) => actividad.procedencia_fondos === procedenciaFilter.value,
    )
  }

  return filtered
})

const tareasFiltradas = computed(() => {
  if (!actividadSeleccionada.value) return []
  return tareas.value
    .filter((t) => t.actividadId === actividadSeleccionada.value.id)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
})

// Paginación
const actividadesPaginadas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredActividades.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredActividades.value.length / itemsPerPage.value))
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > filteredActividades.value.length ? filteredActividades.value.length : end
})

// Cargar datos dummy al montar el componente
onMounted(() => {
  // Simular carga de datos
  setTimeout(() => {
    loadDummyData()
    // Cargar algunas tareas de ejemplo
    tareas.value = [
      {
        id: 1,
        titulo: 'Preparar material didáctico',
        descripcion: 'Elaborar presentaciones y ejercicios prácticos',
        fecha: '2023-05-10',
        estado: 'realizada',
        completada: true,
        actividadId: 1,
      },
      {
        id: 2,
        titulo: 'Confirmar asistencia de participantes',
        descripcion: 'Enviar recordatorios y confirmar asistencia',
        fecha: '2023-05-12',
        estado: 'realizada',
        completada: true,
        actividadId: 1,
      },
      {
        id: 3,
        titulo: 'Recopilar bibliografía',
        descripcion: 'Buscar y organizar material de referencia',
        fecha: '2023-06-15',
        estado: 'pendiente',
        completada: false,
        actividadId: 2,
      },
      {
        id: 4,
        titulo: 'Realizar mantenimiento preventivo',
        descripcion: 'Limpiar y verificar componentes',
        fecha: '2023-04-05',
        estado: 'Retraso',
        completada: false,
        actividadId: 3,
      },
      {
        id: 5,
        titulo: 'Diseñar folletos informativos',
        descripcion: 'Crear material gráfico para la campaña',
        fecha: '2023-07-25',
        estado: 'Postergada',
        completada: false,
        actividadId: 4,
      },
    ]
  }, 800)
})

// Funciones de ayuda
const formatDate = (dateString) => {
  if (!dateString) return 'No definida'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'SPLAN':
      return 'yellow'
    case 'PLAN':
      return 'light-blue'
    case 'EJEC':
      return 'orange'
    case 'POST':
      return 'light-green'
    case 'CANC':
      return 'red'
    case 'COMP':
      return 'green'
    default:
      return 'grey'
  }
}

const getEstadoTexto = (estado) => {
  const status = availableStatuses.find((s) => s.value === estado)
  return status ? status.text : estado
}

const getTipoTexto = (tipo) => {
  const tipoObj = tiposActividad.find((t) => t.value === tipo)
  return tipoObj ? tipoObj.text : tipo
}

const getProcedenciaTexto = (procedencia) => {
  const proc = procedenciaFondos.find((p) => p.value === procedencia)
  return proc ? proc.text : procedencia
}

const getTipoIcon = (tipo) => {
  switch (tipo) {
    case 'ACAP':
      return 'mdi-school'
    case 'PRIN':
      return 'mdi-microscope'
    case 'AOP':
      return 'mdi-cog'
    case 'CSNS':
      return 'mdi-bullhorn'
    case 'PDES':
      return 'mdi-home-city'
    case 'AINC':
      return 'mdi-handshake'
    case 'AART':
      return 'mdi-account-group'
    default:
      return 'mdi-calendar'
  }
}

const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('es-US', { style: 'currency', currency: 'USD' }).format(value)
}

// Contador por estado
const countByStatus = (status) => {
  return filteredActividades.value.filter((a) => a.estado === status).length
}

// Métodos para tareas
const openTareasModal = (actividadId) => {
  actividadSeleccionada.value = actividades.value.find((a) => a.id === actividadId)
  tareasModal.value = true
}

const getTareasByActividad = (actividadId) => {
  return tareas.value
    .filter((t) => t.actividadId === actividadId)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
}

const getTareasCount = (actividadId) => {
  return getTareasByActividad(actividadId).length
}

const getTareasStatusCount = (actividadId) => {
  const tareasActividad = getTareasByActividad(actividadId)
  return {
    realizada: tareasActividad.filter((t) => t.estado === 'realizada').length,
    pendiente: tareasActividad.filter((t) => t.estado === 'pendiente').length,
    Retraso: tareasActividad.filter((t) => t.estado === 'Retraso').length,
    Postergada: tareasActividad.filter((t) => t.estado === 'Postergada').length,
  }
}

const getTareaStatusColor = (status) => {
  switch (status) {
    case 'realizada':
      return 'green'
    case 'pendiente':
      return 'blue'
    case 'Retraso':
      return 'orange'
    case 'Postergada':
      return 'purple'
    default:
      return 'grey'
  }
}

const isTareaAtrasada = (tarea) => {
  if (tarea.estado === 'realizada' || tarea.estado === 'Postergada') return false
  const hoy = new Date()
  const fechaTarea = new Date(tarea.fecha)
  return fechaTarea < hoy
}

const agregarTarea = () => {
  if (editandoTarea.value) {
    // Actualizar tarea existente
    const index = tareas.value.findIndex((t) => t.id === nuevaTarea.value.id)
    if (index !== -1) {
      tareas.value[index] = { ...nuevaTarea.value }
    }
  } else {
    // Crear nueva tarea
    const newId = tareas.value.length > 0 ? Math.max(...tareas.value.map((t) => t.id)) + 1 : 1
    tareas.value.push({
      ...nuevaTarea.value,
      id: newId,
      actividadId: actividadSeleccionada.value.id,
    })
  }

  resetNuevaTarea()
}

const editarTarea = (tarea) => {
  nuevaTarea.value = { ...tarea }
  editandoTarea.value = true
}

const confirmarEliminarTarea = (tarea) => {
  tareaAEliminar.value = tarea
  confirmarEliminarDialog.value = true
}

const eliminarTarea = () => {
  tareas.value = tareas.value.filter((t) => t.id !== tareaAEliminar.value.id)
  confirmarEliminarDialog.value = false
  tareaAEliminar.value = null
}

const updateTareaEstado = (tarea) => {
  const index = tareas.value.findIndex((t) => t.id === tarea.id)
  if (index !== -1) {
    // Actualizar estado basado en completada y fecha
    let nuevoEstado = tarea.completada ? 'realizada' : 'pendiente'

    if (!tarea.completada && isTareaAtrasada(tarea)) {
      nuevoEstado = 'Retraso'
    }

    tareas.value[index] = {
      ...tarea,
      estado: nuevoEstado,
    }
  }
}

const resetNuevaTarea = () => {
  nuevaTarea.value = {
    id: null,
    titulo: '',
    descripcion: '',
    fecha: null,
    estado: 'pendiente',
    completada: false,
    actividadId: actividadSeleccionada.value?.id || null,
  }
  editandoTarea.value = false
}

// Acciones
const confirmDelete = (actividad) => {
  actividadToDelete.value = actividad
  deleteDialog.value = true
}

const deleteActividad = async () => {
  try {
    loading.value = true

    // Simulamos la eliminación de la actividad
    actividades.value = actividades.value.filter((a) => a.id !== actividadToDelete.value.id)

    snackbar.value = {
      show: true,
      text: 'Actividad eliminada exitosamente',
      color: 'success',
    }
  } catch (err) {
    error.value = 'Error al eliminar la actividad: Intente nuevamente más tarde'
    console.error('Error al eliminar actividad', err)
    snackbar.value = {
      show: true,
      text: error.value,
      color: 'error',
    }
  } finally {
    loading.value = false
    deleteDialog.value = false
  }
}

const exportToExcel = () => {
  alert('Función de exportar a Excel simulada')
}

const toggleExpanded = (id) => {
  expandedActividadId.value = expandedActividadId.value === id ? null : id
}

// Métodos para el formulario
const openConfirmation = async () => {
  const { valid } = await form.value.validate()
  if (valid) {
    confirmDialog.value = true
  }
}

const submitActividad = async () => {
  try {
    loading.value = true

    // Simulamos la creación de una nueva actividad
    const newId = Math.max(...actividades.value.map((a) => a.id)) + 1
    const newActividad = {
      id: newId,
      ...actividad.value,
      datos_actividad: {
        // Datos adicionales según el tipo de actividad
      },
    }

    actividades.value.unshift(newActividad)

    // Mostrar mensaje de éxito
    snackbar.value = {
      show: true,
      text: 'Actividad creada exitosamente',
      color: 'success',
    }

    confirmDialog.value = false
    dialogNuevaActividad.value = false
    resetForm()
  } catch (error) {
    console.error('Error al crear actividad:', error)
    // Mostrar mensaje de error
    snackbar.value = {
      show: true,
      text: 'Error al crear la actividad',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  actividad.value = {
    codigo: '',
    descripcion: '',
    tipo: 'NODEF',
    fecha_programada: null,
    duracion: null,
    fecha_inicio: null,
    fecha_cierre: null,
    presupuesto: null,
    presupuesto_pei: null,
    estado: 'SPLAN',
    procedencia_fondos: 'PROY',
    objetivo_de_actividad: '',
    descripcion_evaluacion: '',
    justificacion_modificacion: '',
    datos_actividad: null,
  }
}

const closeDialog = () => {
  resetForm()
  dialogNuevaActividad.value = false
}

// Reglas de validación
const codigoRules = [
  (v) => !!v || 'El código es requerido',
  (v) => (v && v.length <= 60) || 'Máximo 60 caracteres',
]
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.v-list-item:last-child {
  border-bottom: none;
}

.v-card-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.text-right {
  text-align: right;
}

.v-pagination {
  justify-content: center;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}

.gap-2 {
  gap: 8px;
}

/* Estilos adicionales para las tareas */
.tarea-realizada {
  background-color: rgba(76, 175, 80, 0.1);
}

.tarea-pendiente {
  background-color: rgba(33, 150, 243, 0.1);
}

.tarea-retraso {
  background-color: rgba(255, 152, 0, 0.1);
}

.tarea-postergada {
  background-color: rgba(156, 39, 176, 0.1);
}
</style>
