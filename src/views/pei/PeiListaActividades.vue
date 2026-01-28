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
            </div>
          </v-card-text>
          <v-divider class="my-4"></v-divider>

          <v-list v-if="!loading" class="py-0">
            <template
              v-for="(actividad, index) in actividadesPaginadasOrdenadas"
              :key="`actividad-${actividad.id}-${index}`"
            >
              <v-list-item :value="actividad.id" @click="toggleExpanded(actividad.id)" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar :color="getStatusColor(actividad.estado)" class="mr-4">
                    <v-icon dark>{{ getTipoIcon(actividad.estado) }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">
                  Código: {{ actividad.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap">
                    <v-chip
                      small
                      :color="getStatusColor(actividad.estado)"
                      text-color="white"
                      class="mr-2"
                    >
                      {{ getEstadoTexto(actividad.estado) }}
                    </v-chip>
                    <span class="mr-2"
                      >Presupuesto: {{ formatCurrency(actividad.presupuesto) }}</span
                    >
                    <span>Fondos: {{ getProcedenciaTexto(actividad.procedencia_fondos) }}</span>
                  </div>
                  <div class="text-caption mt-1">Descripción: {{ actividad.descripcion }}</div>
                  <div class="text-caption mt-1" v-if="actividad.fecha_programada">
                    <strong>Programada:</strong> {{ formatDate(actividad.fecha_programada) }}
                    <span v-if="actividad.duracion">
                      (Duración: {{ actividad.duracion }} días)</span
                    >
                  </div>
                  <div class="text-caption mt-1" v-if="actividad.fecha_inicio">
                    <strong>Ejecución:</strong> {{ formatDate(actividad.fecha_inicio) }}
                    <span v-if="actividad.fecha_cierre">
                      a {{ formatDate(actividad.fecha_cierre) }}</span
                    >
                  </div>
                </v-list-item-subtitle>

                <!-- iconos de acciones -->
                <template v-slot:append>
                  <div class="d-flex align-center">
                    <div class="d-flex flex-column align-center justify-center">
                      <!-- Solicitud de Fondos -->
                      <v-tooltip text="Solicitud de Fondos" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-if="parseInt($route.query.showButton) === 1"
                            v-bind="props"
                            icon="mdi-cash-plus"
                            variant="text"
                            color="primary"
                            size="small"
                            :disabled="
                              getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos && false
                            "
                            :to="`/monitoreo/formulario01/${actividad.id}`"
                            @click.stop
                          ></v-btn>
                        </template>
                      </v-tooltip>

                      <v-tooltip text="Validar Solicitud de Fondos" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-if="parseInt($route.query.showButton) === 1"
                            v-bind="props"
                            icon="mdi-thumb-up"
                            variant="text"
                            color="primary"
                            size="small"
                            :disabled="getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos && false"
                            @click.stop="abrirDialogValidar(actividad.id, null)"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                    </div>

                    <!-- <v-divider vertical inset class="mx-1 my-1"></v-divider> -->

                    <div class="d-flex flex-column align-center justify-center">
                      <v-tooltip text="Solicitud de Viaje" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-if="parseInt($route.query.showButton) === 1"
                            v-bind="props"
                            icon="mdi-bag-suitcase"
                            variant="text"
                            color="deep-purple"
                            size="small"
                            :to="`/monitoreo/formulario05/${actividad.id}`"
                            @click.stop
                          ></v-btn>
                        </template>
                      </v-tooltip>

                      <v-tooltip text="Validar Solicitud de Viaje" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-if="parseInt($route.query.showButton) === 1"
                            v-bind="props"
                            icon="mdi-thumb-up"
                            variant="text"
                            color="deep-purple"
                            size="small"
                            :disabled="getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos && false"
                            @click.stop="abrirDialogViajeValidar(actividad.id)"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                    </div>

                    <!-- Solicitud de Pago Directo cambiado de 1 a 5-->
                    <div class="d-flex flex-column align-center justify-center">
                      <v-tooltip text="Solicitud de Pago Directo" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-if="parseInt($route.query.showButton) === 1"
                            v-bind="props"
                            icon="mdi-credit-card-check"
                            variant="text"
                            color="teal-lighten-2"
                            size="small"
                            :to="`/monitoreo/formulario08/${actividad.id}`"
                            @click.stop
                          ></v-btn>
                        </template>
                      </v-tooltip>

                      <v-tooltip text="Validar Solicitud de Pago Directo" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-if="parseInt($route.query.showButton) === 1"
                            v-bind="props"
                            icon="mdi-thumb-up"
                            variant="text"
                            color="teal-lighten-2"
                            size="small"
                            :disabled="getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos && false"
                            @click.stop="abrirDialogPagoDirectoValidar(actividad.id)"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                    </div>

                    <!-- Solicitud de Reposición -->
                    <div class="d-flex flex-column align-center justify-center">
                      <v-tooltip text="Solicitud de Reposición" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-if="parseInt($route.query.showButton) === 1"
                            v-bind="props"
                            icon="mdi-cash-refund"
                            variant="text"
                            color="warning"
                            size="small"
                            :to="`/monitoreo/formulario03/${actividad.id}`"
                            @click.stop
                          ></v-btn>
                        </template>
                      </v-tooltip>

                      <v-tooltip text="Validar Solicitud de Reposición" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-if="parseInt($route.query.showButton) === 1"
                            v-bind="props"
                            icon="mdi-thumb-up"
                            variant="text"
                            color="warning"
                            size="small"
                            :disabled="getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos && false"
                            @click.stop="abrirDialogReposicionValidar(actividad.id)"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                    </div>

                    <!-- Rendición de cuentas para ACTIVIDADES-->
                    <div class="d-flex flex-column align-center justify-center">
                      <v-tooltip text="Rendición de Cuentas" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-if="parseInt($route.query.showButton) === 2"
                            v-bind="props"
                            icon="mdi-cash-check"
                            variant="text"
                            color="error"
                            size="small"
                            :to="`/monitoreo/formulario02/${actividad.id}`"
                            @click.stop
                          ></v-btn>
                          <!-- :disabled="!getSolicitudFondosInfo(actividad.id, 0)?.bloquearIconosSolFondos" -->
                           <!-- @click.stop="abrirDialogRendicion(actividad.id)" -->
                        </template>
                      </v-tooltip>

                      <v-tooltip text="Validar Rendición de Cuentas" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-if="parseInt($route.query.showButton) === 2"
                            v-bind="props"
                            icon="mdi-thumb-up"
                            variant="text"
                            color="error"
                            size="small"

                            @click.stop="abrirDialogRendicionValidar(actividad.id)"
                          ></v-btn>
                          <!-- :disabled="getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos && false" -->
                        </template>
                      </v-tooltip>
                    </div>

                    <!-- Informe de Actividad -->
                    <v-tooltip text="Informe de Actividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 3"
                          v-bind="props"
                          icon="mdi-file-chart"
                          variant="text"
                          color="info"
                          size="small"
                          :to="`/monitoreo/formularioinf/${actividad.id}`"
                          @click.stop
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <!-- Tarjeta de detalles desplegable -->
              <v-expand-transition>
                <div v-if="expandedActividadId === actividad.id">
                  <v-list-item :value="`detalle-${actividad.id}`" class="mb-2">
                    <v-card elevation="0" class="ml-10 mr-4 mb-4 bg-grey-lighten-4">
                      <v-card-text class="pt-4">
                        <div class="d-flex justify-space-between align-center mb-4">
                          <span class="text-subtitle-1">Sub Actividades para {{ actividad.codigo }}</span>
                          <div class="d-flex align-center">
                            <v-btn
                              color="primary"
                              variant="text"
                              @click="openTareaDialog(actividad.id)"
                            >
                              <v-icon left>mdi-plus</v-icon>
                              Añadir Sub Actividad
                            </v-btn>
                          </div>
                        </div>
                        <v-list density="compact" class="py-0">
                          <v-list-item
                            v-for="tarea in actividad.tareas"
                            :key="`tarea-${actividad.id}-${tarea.id}`"
                            class="mb-1"
                          >
                            <v-list-item-title>
                              {{ tarea.titulo || tarea.descripcion || 'Tarea sin título' }}
                            </v-list-item-title>
                            <template v-slot:prepend>
                              <v-icon :color="getStatusColorTarea(tarea.estado)">
                                mdi-checkbox-blank-circle
                              </v-icon>
                            </template>
                            <template v-slot:append>
                              <div class="d-flex">

                                <!-- Solicitud de Fondos para TAREA -->
                                <div class="d-flex flex-column align-center justify-center">
                                  <v-tooltip text="Solicitud de Fondos" location="top">
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-if="parseInt($route.query.showButton) === 1"
                                        v-bind="props"
                                        icon="mdi-cash-plus"
                                        variant="text"
                                        color="primary"
                                        size="x-small"

                                        :to="`/monitoreo/formulario01/${actividad.id}?tarea_id=${tarea.id}`"
                                        @click.stop
                                      ></v-btn>
                                        <!-- :disabled="getSolicitudFondosInfo(actividad.id, tarea.id)?.bloquearIconosSolFondos || pruebaBloqueo" -->
                                    </template>
                                  </v-tooltip>

                                  <v-tooltip text="Validar Solicitud de Fondos" location="bottom">
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-if="parseInt($route.query.showButton) === 1"
                                        v-bind="props"
                                        icon="mdi-thumb-up"
                                        variant="text"
                                        color="primary"
                                        size="x-small"

                                        @click.stop="abrirDialogValidar(actividad.id, tarea.id)"
                                      ></v-btn>
                                      <!-- :disabled="getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos && false" -->
                                    </template>
                                  </v-tooltip>
                                </div>

                                <!-- Solicitud de Viaje para TAREA se cambio de 1 a 5-->
                                <div class="d-flex flex-column align-center justify-center">
                                  <v-tooltip text="Solicitud de Viaje" location="top">
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-if="parseInt($route.query.showButton) === 1"
                                        v-bind="props"
                                        icon="mdi-bag-suitcase"
                                        variant="text"
                                        color="deep-purple"
                                        size="x-small"
                                        :to="`/monitoreo/formulario05/${actividad.id}?tarea_id=${tarea.id}`"
                                        @click.stop
                                      ></v-btn>
                                    </template>
                                  </v-tooltip>

                                  <v-tooltip text="Validar Solicitud de Viaje" location="bottom">
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-if="parseInt($route.query.showButton) === 1"
                                        v-bind="props"
                                        icon="mdi-thumb-up"
                                        variant="text"
                                        color="deep-purple"
                                        size="x-small"
                                        :disabled="getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos && false"
                                        @click.stop="abrirDialogViajeValidar(actividad.id, tarea.id)"
                                      ></v-btn>
                                    </template>
                                  </v-tooltip>
                                </div>

                                <!-- Solicitud de Pago Directo para TAREA se cambio de 1 a 5-->
                                <div class="d-flex flex-column align-center justify-center">
                                  <v-tooltip text="Solicitud de Pago Directo" location="top">
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-if="parseInt($route.query.showButton) === 1"
                                        v-bind="props"
                                        icon="mdi-credit-card-check"
                                        variant="text"
                                        color="teal-lighten-2"
                                        size="x-small"
                                        :to="`/monitoreo/formulario08/${actividad.id}?tarea_id=${tarea.id}`"
                                        @click.stop
                                      ></v-btn>
                                    </template>
                                  </v-tooltip>

                                  <v-tooltip text="Validar Solicitud de Pago Directo" location="bottom">
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-if="parseInt($route.query.showButton) === 1"
                                        v-bind="props"
                                        icon="mdi-thumb-up"
                                        variant="text"
                                        color="teal-lighten-2"
                                        size="x-small"
                                        :disabled="getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos && false"
                                        @click.stop="abrirDialogPagoDirectoValidar(actividad.id, tarea.id)"
                                      ></v-btn>
                                    </template>
                                  </v-tooltip>
                                </div>

                                <!-- Solicitud de Reposición para TAREA -->
                                <div class="d-flex flex-column align-center justify-center">
                                  <v-tooltip text="Solicitud de Reposición" location="top">
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-if="parseInt($route.query.showButton) === 1"
                                        v-bind="props"
                                        icon="mdi-cash-refund"
                                        variant="text"
                                        color="warning"
                                        size="x-small"
                                        :to="`/monitoreo/formulario03/${actividad.id}?tarea_id=${tarea.id}`"
                                        @click.stop
                                      ></v-btn>
                                    </template>
                                  </v-tooltip>

                                  <v-tooltip text="Validar Solicitud de Reposición" location="bottom">
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-if="parseInt($route.query.showButton) === 1"
                                        v-bind="props"
                                        icon="mdi-thumb-up"
                                        variant="text"
                                        color="warning"
                                        size="x-small"

                                        @click.stop="abrirDialogReposicionValidar(actividad.id, tarea.id)"
                                      ></v-btn>
                                      <!-- :disabled="getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos && false" -->
                                    </template>
                                  </v-tooltip>
                                </div>

                                <!-- Rendición de cuentas para TAREAS-->
                                <div class="d-flex flex-column align-center justify-center">
                                  <v-tooltip :text="getRendicionText(actividad.id, tarea.id)" location="top">
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-if="parseInt($route.query.showButton) === 2"
                                        v-bind="props"
                                        icon="mdi-cash-check"
                                        variant="text"
                                        color="error"
                                        size="x-small"
                                        :disabled="false"
                                        :to="`/monitoreo/formulario02/${actividad.id}?tarea_id=${tarea.id}`"
                                        @click.stop
                                      ></v-btn>
                                    </template>
                                  </v-tooltip>

                                  <v-tooltip text="Validar Rendición de Cuentas" location="bottom">
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-if="parseInt($route.query.showButton) === 2"
                                        v-bind="props"
                                        icon="mdi-thumb-up"
                                        variant="text"
                                        color="error"
                                        size="x-small"

                                        @click.stop="abrirDialogRendicionValidar(actividad.id, tarea.id)"
                                      ></v-btn>
                                      <!-- :disabled="getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos && false" -->
                                    </template>
                                  </v-tooltip>
                                </div>

                                <!-- Informe de Actividad para TAREA -->
                                <v-tooltip text="Informe de Actividad" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-if="parseInt($route.query.showButton) === 3"
                                      v-bind="props"
                                      icon="mdi-file-chart"
                                      variant="text"
                                      color="info"
                                      size="small"
                                      :to="`/monitoreo/formularioinf/${actividad.id}?tarea_id=${tarea.id}`"
                                      @click.stop
                                    ></v-btn>
                                  </template>
                                </v-tooltip>

                                <!-- Separador visual -->
                                <v-divider vertical inset class="mx-1 my-1"></v-divider>

                                <!-- Acciones de tarea -->
                                <v-tooltip text="Editar Sub Actividad" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-bind="props"
                                      icon="mdi-pencil"
                                      variant="text"
                                      color="warning"
                                      size="small"
                                      @click.stop="openTareaDialog(actividad.id, tarea)"
                                    ></v-btn>
                                  </template>
                                </v-tooltip>
                                <v-tooltip text="Eliminar Sub Actividad" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-bind="props"
                                      icon="mdi-delete"
                                      variant="text"
                                      color="error"
                                      size="small"
                                      @click.stop="confirmDeleteTarea(actividad.id, tarea)"
                                    ></v-btn>
                                  </template>
                                </v-tooltip>
                              </div>
                            </template>
                          </v-list-item>
                          <v-list-item v-if="actividad.tareas.length === 0">
                            <v-list-item-title class="text-grey text-caption">
                              No hay Sub Actividades
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
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
              <v-list-item-subtitle class="text-right">
                {{ filteredActividades.length }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="yellow">mdi-calendar-question</v-icon>
              </template>
              <v-list-item-title>Reprogramación</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('REPROG') }}
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
                {{ countByStatus('FIN') }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="tareaDialog" max-width="500">
      <v-card>
        <v-toolbar
          color="secondary"
          :title="isEditandoTarea ? 'Editar Tarea' : 'Nueva Tarea'"
        ></v-toolbar>
        <v-card-text>
          <v-form ref="tareaFormRef" @submit.prevent="saveTarea">
            <v-text-field
              v-model="tareaForm.titulo"
              label="Título de la tarea"
              :rules="[(v) => !!v || 'El título es requerido']"
              variant="outlined"
              class="mt-4"
            ></v-text-field>
            <v-textarea
              v-model="tareaForm.descripcion"
              label="Descripción"
              variant="outlined"
              rows="2"
            ></v-textarea>
            <v-select
              v-model="tareaForm.estado"
              :items="availableStatusesTarea"
              item-title="text"
              item-value="value"
              label="Estado"
              variant="outlined"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="tareaDialog = false">Cancelar</v-btn>
          <v-btn color="success" @click="saveTarea">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteTareaDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación de tarea</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la tarea "{{
            tareaToDelete?.titulo || tareaToDelete?.descripcion || 'Sin título'
          }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteTareaDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteTarea">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false"> Cerrar </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="dialogValidarSolicitud" max-width="800">
      <v-card>
        <v-toolbar color="primary" title="Validar Solicitud de Fondos"></v-toolbar>
        <v-card-text>
            <template
              v-for="(solicitudF, index) in datosFormulario1.solicitudes"
              :key="`solicitudF-${solicitudF.id}-${index}`"
            >
              <v-list-item :value="solicitudF.id" @click="() => abrirFormulario011(solicitudF.id)" class="mb-2">
                <v-list-item-title class="font-weight-bold">
                  Formulario: {{ solicitudF.numeroFormulario }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap">
                    <span class="mr-2"
                      >Fecha de Solicitud: {{ solicitudF.fechaSolicitud }}</span
                    >
                  </div>
                  <div class="text-caption mt-1">Lugar de Solicitud: {{ solicitudF.lugarSolicitud }}</div>
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-list-item-title
                    v-if="solicitudF.validacionCoordinador === true && solicitudF.validacionResponsable === true"
                    class="font-weight-bold text-success text-right"
                  >
                    <v-icon color="success" end>mdi-check</v-icon>
                  </v-list-item-title>
                </template>
              </v-list-item>
            </template>
            <v-list-item v-if="datosFormulario1.solicitudes.length === 0 && !loading">
              <v-list-item-title class="text-grey">No tienes validacion de solicitudes pendientes</v-list-item-title>
            </v-list-item>
            <!-- <pre>{{ datosFormulario1.solicitudes }}</pre> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="dialogValidarSolicitud = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRendicionCuentas" max-width="800">
      <v-card>
        <v-toolbar color="primary" title="Rendicion de Cuentas a Solicitud de Fondos"></v-toolbar>
          <v-card-text>
            <template
              v-for="(solicitudF, index) in datosFormularioRC.solicitudes"
              :key="`solicitudF-${solicitudF.id}-${index}`"
            >
              <v-list-item :value="solicitudF.id" @click="() => abrirFormularioRendicionC(solicitudF.id)" class="mb-2">
                <v-list-item-title class="font-weight-bold">
                  Formulario: {{ solicitudF.numeroFormulario }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap">
                    <span class="mr-2"
                      >Fecha de Solicitud: {{ solicitudF.fechaSolicitud }}</span
                    >
                  </div>
                  <div class="text-caption mt-1">Lugar de Solicitud: {{ solicitudF.lugarSolicitud }}</div>
                </v-list-item-subtitle>
              </v-list-item>
            </template>
            <v-list-item v-if="datosFormularioRC.solicitudes.length === 0 && !loading">
              <v-list-item-title class="text-grey">No tienes validacion de solicitudes pendientes</v-list-item-title>
            </v-list-item>
            <!-- <pre>{{ datosFormularioParaDialogRC }}</pre> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="dialogRendicionCuentas = false">Cerrar</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRendicionCuentasValidar" max-width="800">
      <v-card>
        <v-toolbar color="primary" title="Validar Rendicion de Cuentas"></v-toolbar>
        <v-card-text>

            <template
              v-for="(solicitudF, index) in datosFormularioValidarRC?.rendiciones || []"
              :key="`solicitudF-${solicitudF.id}-${index}`"
            >
              <v-list-item :value="solicitudF.id" @click="() => abrirFormularioRendicionCuentasValidar(solicitudF.id)" class="mb-2">
                <v-list-item-title class="font-weight-bold">
                  Formulario: {{ solicitudF.numeroFormulario }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap">
                    <span class="mr-2"
                      >Fecha de Solicitud: {{ solicitudF.fechaDesembolso }}</span
                    >
                  </div>
                  <div class="text-caption mt-1">Lugar de Solicitud: {{ solicitudF.montoDescargado }}</div>
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-list-item-title
                    v-if="solicitudF.validacionCoordinador === true && solicitudF.validacionContador === true && solicitudF.validacionAdministrador === true"
                    class="font-weight-bold text-success text-right"
                  >
                    <v-icon color="success" end>mdi-check</v-icon>
                  </v-list-item-title>
                </template>
              </v-list-item>
            </template>

            <v-list-item v-if="datosFormularioValidarRC.rendiciones.length === 0 && !loading">
              <v-list-item-title class="text-grey">No tienes validacion de solicitudes pendientes</v-list-item-title>
            </v-list-item>
            <!-- {{ '****************************************' }}
            <pre>{{ datosFormularioValidarRC.rendiciones }}</pre> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="dialogRendicionCuentasValidar = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogReposicion" max-width="800">
      <v-card>
        <v-toolbar color="primary" title="Reposicion a Solicitud de Fondos"></v-toolbar>
        <v-card-text>

            <template
              v-for="(solicitudF, index) in datosFormulario1.solicitudes"
              :key="`solicitudF-${solicitudF.id}-${index}`"
            >
              <v-list-item :value="solicitudF.id" @click="() => abrirFormulario03(solicitudF.id)" class="mb-2">
                <v-list-item-title class="font-weight-bold">
                  Formulario: {{ solicitudF.numeroFormulario }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap">
                    <span class="mr-2"
                      >Fecha de Solicitud: {{ solicitudF.fechaSolicitud }}</span
                    >
                  </div>
                  <div class="text-caption mt-1">Lugar de Solicitud: {{ solicitudF.lugarSolicitud }}</div>
                </v-list-item-subtitle>
              </v-list-item>
            </template>

            <v-list-item v-if="datosFormulario1.solicitudes.length === 0 && !loading">
              <v-list-item-title class="text-grey">No tienes validacion de solicitudes pendientes</v-list-item-title>
            </v-list-item>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="dialogReposicion = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <v-dialog v-model="dialogReposicionValidar" max-width="800">
      <v-card>
        <v-toolbar color="primary" title="Validar Solicitud de Reposicion"></v-toolbar>
        <v-card-text>

            <template
              v-for="(solicitudF, index) in datosFormularioValidarSR.solicitudes"
              :key="`solicitudF-${solicitudF.id}-${index}`"
            >
              <v-list-item :value="solicitudF.id" @click="() => abrirFormularioReposicion(solicitudF.id)" class="mb-2">
                <v-list-item-title class="font-weight-bold">
                  Formulario: {{ solicitudF.numeroFormulario }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap">
                    <span class="mr-2"
                      >Fecha de Solicitud: {{ solicitudF.fechaSolicitud }}</span
                    >
                  </div>
                  <div class="text-caption mt-1">Lugar de Solicitud: {{ solicitudF.lugarSolicitud }}</div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-list-item-title
                    v-if="solicitudF.validacionCoordinador === true && solicitudF.validacionResponsable === true"
                    class="font-weight-bold text-success text-right"
                  >
                    <v-icon color="success" end>mdi-check</v-icon>
                  </v-list-item-title>
                </template>

              </v-list-item>
            </template>

            <v-list-item v-if="datosFormularioValidarSR.solicitudes.length === 0 && !loading">
              <v-list-item-title class="text-grey">No tienes validacion de solicitudes pendientes</v-list-item-title>
            </v-list-item>
<!-- <pre>{{ datosFormularioValidarSR }}</pre> -->
<!-- <pre>{{ datosFormularioValidarSR.solicitudes }}</pre> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="dialogReposicionValidar = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <v-dialog v-model="dialogViajeValidar" max-width="800">
      <v-card>
        <v-toolbar color="primary" title="Validar Solicitud de Viaje"></v-toolbar>
        <v-card-text>

            <template
              v-for="(solicitudF, index) in listaSolicitudesDeViaje"
              :key="`solicitudF-${solicitudF.id}-${index}`"
            >
              <v-list-item :value="solicitudF.id" @click="() => abrirFormularioSolicitudDeViajeParaValidar(solicitudF.id)" class="mb-2">
                <v-list-item-title class="font-weight-bold">
                  Formulario: {{ solicitudF.numeroFormulario }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap">
                    <span class="mr-2"
                      >Fecha de Solicitud: {{ solicitudF.fechaSolicitud }}</span
                    >
                  </div>
                  <div class="text-caption mt-1">Lugar de Solicitud: {{ solicitudF.lugarSolicitud }}</div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-list-item-title
                    v-if="solicitudF.validacionCoordinador === true && solicitudF.validacionResponsable === true"
                    class="font-weight-bold text-success text-right"
                  >
                    <v-icon color="success" end>mdi-check</v-icon>
                  </v-list-item-title>
                </template>

              </v-list-item>
            </template>

            <v-list-item v-if="listaSolicitudesDeViaje.length === 0 && !loading">
              <v-list-item-title class="text-grey">No tienes validacion de solicitudes pendientes</v-list-item-title>
            </v-list-item>
<!-- <pre>{{ listaSolicitudesDeViaje }}</pre> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="dialogViajeValidar = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <v-dialog v-model="dialogPagoDirectoValidar" max-width="800">
      <v-card>
        <v-toolbar color="primary" title="Validar Solicitud de Pago Directo"></v-toolbar>
        <v-card-text>

            <template
              v-for="(solicitudF, index) in listaSolicitudesDePagoDirecto"
              :key="`solicitudF-${solicitudF.id}-${index}`"
            >
              <v-list-item :value="solicitudF.id" @click="() => abrirFormularioSolicitudDePagoDirectoParaValidar(solicitudF.id)" class="mb-2">
                <v-list-item-title class="font-weight-bold">
                  Formulario: {{ solicitudF.numeroFormulario }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap">
                    <span class="mr-2"
                      >Fecha de Solicitud: {{ solicitudF.fechaSolicitud }}</span
                    >
                  </div>
                  <div class="text-caption mt-1">Lugar de Solicitud: {{ solicitudF.lugarSolicitud }}</div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-list-item-title
                    v-if="solicitudF.validacionCoordinador === true && solicitudF.validacionResponsable === true"
                    class="font-weight-bold text-success text-right"
                  >
                    <v-icon color="success" end>mdi-check</v-icon>
                  </v-list-item-title>
                </template>

              </v-list-item>
            </template>

            <v-list-item v-if="listaSolicitudesDePagoDirecto.length === 0 && !loading">
              <v-list-item-title class="text-grey">No tienes validacion de solicitudes pendientes</v-list-item-title>
            </v-list-item>
<!-- <pre>{{ listaSolicitudesDeViaje }}</pre> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="dialogPagoDirectoValidar = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
      <!-- {{ '********************************' }}
     <pre>{{ datosFormulario1 }}</pre> -->
      <!-- <pre>{{ actividadesPaginadasOrdenadas }}</pre> -->
      <!--<pre>{{ actividades }}</pre> -->
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { tareasServicios } from '@/modules/proyecto/services/tareasService'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const baseurl = import.meta.env.VITE_API_BASE

const router = useRouter()
//const route = useRoute()
// const idActividad = route.params.id || null
// const idTarea = route.query.tarea_id || null
// console.log('ID de Actividad:', idActividad)
// console.log('ID de Tarea:', idTarea)

const userStore = useUserStore()
const usuario = computed(() => {
  return {
    nombre: userStore.usuario,
    role: userStore.rol,
  }
})
//variables para carga de datos
const datosFormulario = ref(null)
const datosFormulario1 = ref(null)
const datosFormularioRC = ref(null)
const datosFormularioValidarRC = ref(null)      //viene de funcion cargarRendicionesDeCuenta
const datosFormularioValidarSR = ref(null)      //viene de funcion cargarSolicitudDeReposicion
const listaSolicitudesDeViaje = ref(null)       //viene de funcion cargarSolicitudDeViaje
const listaSolicitudesDePagoDirecto = ref(null) //viene defuncion cargarSolicitudDePagoDirecto
const error = ref(null)
const isLoading = ref(false)

const {
  actividadesTareas,
  actividadTarea: actividadesFromApi,
  actividades,
} = useActividad()

// --- NUEVAS VARIABLES PARA SOLICITUDES DE FONDOS ---
const solicitudesFondos = ref([])
const loadingSolicitudes = ref(false)

// --- ESTADOS REACTIVOS ---
const cargandoGeneral = ref(true)
const loading = ref(true)
const emptyResponse = ref(false)
const searchQuery = ref('')
const statusFilters = ref([])
const expandedActividadId = ref(null)

const dialogValidarSolicitud = ref(false)
const solicitudSeleccionada = ref(null)

const dialogRendicionCuentas = ref(false)
const dialogRendicionCuentasValidar = ref(false)
const dialogReposicion = ref(false)
const dialogReposicionValidar = ref(false)
const dialogViajeValidar = ref(false)
const dialogPagoDirectoValidar = ref(false)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Diálogos y formularios de tareas
const tareaDialog = ref(false)
const tareaForm = ref({ id: null, titulo: '', descripcion: '', estado: 'PEN' })
const actividadIdParaTarea = ref(null)
const isEditandoTarea = ref(false)
const tareaFormRef = ref(null)

// Diálogos de eliminación
const deleteTareaDialog = ref(false)
const tareaToDelete = ref(null)
const actividadIdParaEliminarTarea = ref(null)
const procedenciaFilter = ref(null)

// Variables para almacenar los IDs temporalmente
const actividadIdParaValidar = ref(null)
const tareaIdParaValidar = ref(null)

// Notificaciones
const snackbar = ref({ show: false, text: '', color: 'success' })

// Procedencia de fondos
const procedenciaFondos = [
  { value: 'PROY', text: 'Proyecto' },
  { value: 'PRESP', text: 'Presupuesto' },
  { value: 'NODEF', text: 'No Definido' },
]

// Estados disponibles para actividades y tareas
const availableStatuses = [
  { value: 'PLAN', text: 'Planificación' },
  { value: 'RETR', text: 'Retraso' },
  { value: 'REPROG', text: 'Reprogramación' },
  { value: 'EJEC', text: 'En Ejecución' },
  { value: 'REP', text: 'En Reporte' },
  { value: 'FIN', text: 'Finalizado' },
]

const availableStatusesTarea = [
  { text: 'Pendiente', value: 'PEN' },
  { text: 'En Progreso', value: 'EPROG' },
  { text: 'Completada', value: 'COMPL' },
]

// --- MÉTODOS Y COMPUTADAS ---

// Mapeo de estados del backend al frontend
const mapEstadoBackendToFrontend = (estadoBackend) => {
  const estadoMap = {
    CRD: 'PE',
    PLAN: 'PE',
    RETR: 'PR',
    REPROG: 'PR',
    EJEC: 'PR',
    REP: 'PR',
    FIN: 'CO',
  }

  // Si es un estado de tarea, devolverlo sin cambios
  if (['PEN', 'EPROG', 'COMPL'].includes(estadoBackend)) {
    return estadoBackend
  }

  return estadoMap[estadoBackend] || 'PE'
}

const getStatusColor = (status) => {
  switch (status) {
    case 'PLAN':
      return 'light-blue'
    case 'RETR':
      return 'red'
    case 'REPROG':
      return 'yellow'
    case 'EJEC':
      return 'orange'
    case 'REP':
      return 'light-green'
    case 'FIN':
      return 'green'
    default:
      return 'grey'
  }
}

const abrirFormulario011 = (idSolicitudF) => {
  const routeConfig = {
    path: `/monitoreo/formulario011/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudF
    }
  };

  // Add tarea_id to query if it exists
  if (tareaIdParaValidar.value !== null && tareaIdParaValidar.value !== undefined) {
    routeConfig.query.tarea_id = tareaIdParaValidar.value;
  }

  router.push(routeConfig);
}

const abrirFormularioRendicionC = (idSolicitudF) => {
  router.push({
    path: `/monitoreo/formulario02/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudF
    }
  });
}

const abrirFormularioRendicionCuentasValidar = (idSolicitudF) => {
  router.push({
    path: `/monitoreo/formulario022/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudF
    }
  });
}

const abrirFormulario03 = (idSolicitudF) => {
  router.push({
    path: `/monitoreo/formulario03/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudF
    }
  });
}

const abrirFormularioReposicion = (idSolicitudR) => {
  router.push({
    path: `/monitoreo/formulario033/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudR
    }
  });
}

const abrirFormularioSolicitudDeViajeParaValidar = (idSolicitudDeViaje) => {
  router.push({
    path: `/monitoreo/formulario055/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudDeViaje
    }
  });
}

const abrirFormularioSolicitudDePagoDirectoParaValidar = (idSolicitudDePagoDirecto) => {
  router.push({
    path: `/monitoreo/formulario088/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudDePagoDirecto
    }
  });
}

const abrirDialogValidar = async (actividadId, tareaId) => {     //tareaId = null
  // Guardar los IDs para usarlos en las funciones
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  solicitudSeleccionada.value = getSolicitudFondosInfo(actividadId, tareaId)  //es usado para habilitar iconos
  // console.log('55555555555555555', JSON.stringify(actividadIdParaValidar,null,2))

  // Cargar datos iniciales al abrir el diálogo usando los IDs capturados
  try {
    await cargarDatos();
    if (datosFormulario.value) {
      await cargarSolicitudFondos();
    }
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
    mostrarSnackbar('Error al cargar datos iniciales', 'error');
  }

  dialogValidarSolicitud.value = true;
}

const abrirDialogRendicionValidar = async (actividadId, tareaId = null) => {
  // Guardar los IDs para usarlos en las funciones
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  solicitudSeleccionada.value = getSolicitudFondosInfo(actividadId, tareaId)  //habilita iconos

  // Cargar datos iniciales al abrir el diálogo usando los IDs capturados
  try {
    await cargarDatos();
    if (datosFormulario.value) {
      //await cargarSolicitudFondos();
      await cargarRendicionesDeCuenta();
    }
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
    mostrarSnackbar('Error al cargar datos iniciales', 'error');
  }

  dialogRendicionCuentasValidar.value = true;
}

const abrirDialogReposicionValidar = async (actividadId, tareaId = null) => {
  // Guardar los IDs para usarlos en las funciones
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  solicitudSeleccionada.value = getSolicitudFondosInfo(actividadId, tareaId)

  // Cargar datos iniciales al abrir el diálogo usando los IDs capturados
  try {
    await cargarDatos();
    if (datosFormulario.value) {
      await cargarSolicitudFondos();
      await cargarSolicitudDeReposicion();
    }
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
    mostrarSnackbar('Error al cargar datos iniciales', 'error');
  }

  dialogReposicionValidar.value = true;
}

const abrirDialogViajeValidar = async (actividadId, tareaId = null) => {
  // Guardar los IDs para usarlos en las funciones
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  solicitudSeleccionada.value = getSolicitudFondosInfo(actividadId, tareaId)

  // Cargar datos iniciales al abrir el diálogo usando los IDs capturados
  await cargarSolicitudDeViaje()

  dialogViajeValidar.value = true;
}

const abrirDialogPagoDirectoValidar = async (actividadId, tareaId = null) => {
  // Guardar los IDs para usarlos en las funciones
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  solicitudSeleccionada.value = getSolicitudFondosInfo(actividadId, tareaId)

  // Cargar datos iniciales al abrir el diálogo usando los IDs capturados
  await cargarSolicitudDePagoDirecto()

  dialogPagoDirectoValidar.value = true;
}

const getEstadoTexto = (status) => {
  const estado = availableStatuses.find((s) => s.value === status)
  return estado ? estado.text : 'Desconocido'
}

// Carga inicial de datos
onMounted(async () => {
  await cargar()
})

// Modificar la función cargar para que también cargue las solicitudes de fondos
const cargar = async () => {
  loading.value = true
  try {
    await Promise.all([
      actividadesTareas(),
      cargarSolicitudesFondos(), // Cargar solicitudes de fondos en paralelo
    ])

    // [Procesamiento existente de actividades]
    if (Array.isArray(actividadesFromApi.value)) {
      actividades.value = actividadesFromApi.value.map((actividad) => ({
        ...actividad,
        estadoFrontend: mapEstadoBackendToFrontend(actividad.estado),
        tareas: Array.isArray(actividad.tareas)
          ? actividad.tareas.map((tarea) => ({
              ...tarea,
              estadoFrontend: mapEstadoBackendToFrontend(tarea.estado),
            }))
          : [],
      }))
    } else {
      actividades.value = []
    }

    emptyResponse.value = actividades.value.length === 0
  } catch (error) {
    console.error('Error al cargar datos:', error)
    actividades.value = []
    emptyResponse.value = true
    mostrarSnackbar('Error al cargar datos: ' + (error.message || 'Error desconocido'), 'error')
  } finally {
    loading.value = false
  }
}

// Alternativa usando fetch en lugar de axios
const cargarSolicitudesFondos = async () => {
  loadingSolicitudes.value = true
  try {
    //console.log('Cargando solicitudes de fondos con fetch...')
    const response = await fetch(baseurl + 'api/solicitud-fondos/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    const data = await response.json()
    //console.log('Datos recibidos con fetch:', data)
    solicitudesFondos.value = data
  } catch (error) {
    console.error('Error con fetch:', error)
    mostrarSnackbar(`Error al cargar solicitudes: ${error.message}`, 'error')
  } finally {
    loadingSolicitudes.value = false
  }
}

// Obtener información de solicitud de fondos para una actividad (y opcionalmente una tarea)
const getSolicitudFondosInfo = (actividadId, tareaId = null) => {
  if (!solicitudesFondos.value.length) return null

  // Buscar solicitud que coincida con actividad y tarea (si se proporciona)
  const solicitud = solicitudesFondos.value.find((sf) => {
    const matchActividad = sf.actividad === actividadId
    const matchTarea = tareaId ? sf.tarea === tareaId : true
    return matchActividad && matchTarea
  })

  return solicitud || null
}

// Obtener texto para el tooltip de rendición de cuentas
const getRendicionText = (actividadId, tareaId = null) => {
  const solicitud = getSolicitudFondosInfo(actividadId, tareaId)
  if (solicitud && solicitud.numeroFormulario) {
    return `Rendición de Cuentas (${solicitud.numeroFormulario})`
  }
  return 'Rendición de Cuentas - Pendiente solicitud'
}

async function cargarDatos() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + 'api/monitoreo/obtener-datos-formulario/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {// JSON.stringify({
        id_actividad: actividadIdParaValidar.value,
        usuario: usuario.value.nombre,
      },
    })
    //console.log('00000000000000000000000000000', actividadIdParaValidar.value, usuario.value.nombre)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    datosFormulario.value = strictSanitizeData(rawData)
    //console.log('Datos cargados exitosamente:', datosFormulario.value)
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

async function cargarSolicitudFondos() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudFondos/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`)
    }

    const data = await response.json()
    //console.log('Datos recibidoswwwwwwwwwwwwwwwww:', data)

    // Filtrar las solicitudes por actividad_id y tarea_id
    const solicitudesFiltradas = data.solicitudes.filter(solicitud => {
      const coincideActividad = solicitud.actividad_id === actividadIdParaValidar.value
      const coincideTarea = solicitud.tarea_id === tareaIdParaValidar.value
      return coincideActividad && coincideTarea//&& coincideValidacionResp && coincideValidacionCoord
    })
    datosFormulario1.value = {
      estado: "exito",
      solicitudes: solicitudesFiltradas
    }
    //console.log('idactividad:', JSON.stringify(actividadIdParaValidar.value,null,2))

    const solicitudesFiltradasParaRC = data.solicitudes.filter(solicitud => {
      const coincideActividad = solicitud.actividad_id === actividadIdParaValidar.value
      const coincideTarea = solicitud.tarea_id === tareaIdParaValidar.value
      const coincideValidacionResp = solicitud.validacionResponsable === true
      const coincideValidacionCoord = solicitud.validacionCoordinador === true
      return coincideActividad && coincideTarea && coincideValidacionResp && coincideValidacionCoord
    })
    datosFormularioRC.value = {
      estado: "exito",
      solicitudes: solicitudesFiltradasParaRC
    }

    //console.log('Solicitudes filtradas:', JSON.stringify(datosFormulario1.value,null,2), actividadIdParaValidar.value, tareaIdParaValidar.value)
  } catch (err) {
    error.value = err.message
    console.error('Error al cargar solicitudes:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

function sanitizeData(data) {
  if (data === null || data === undefined) {
    return '';
  }

  if (typeof data === 'string') {
    // Limpiar strings: trim y convertir empty strings a ''
    const trimmed = data.trim();
    return trimmed === '' ? '' : trimmed;
  }

  if (typeof data === 'number') {
    // Validar que sea un número finito
    return isFinite(data) ? data : 0;
  }

  if (typeof data === 'boolean') {
    return data;
  }

  if (Array.isArray(data)) {
    // Sanitizar cada elemento del array
    return data.map(item => sanitizeData(item)).filter(item =>
      item !== null && item !== undefined && item !== ''
    );
  }

  if (typeof data === 'object') {
    const sanitized = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {//if (data.hasOwnProperty(key)) {
        const value = data[key];
        // Solo incluir propiedades con valores válidos
        if (value !== null && value !== undefined && value !== '') {
          sanitized[key] = sanitizeData(value);
        }
      }
    }
    return sanitized;
  }

  // Para cualquier otro tipo de dato, retornar string vacío
  return '';
}

function strictSanitizeData(data) {
  const sanitized = sanitizeData(data);

  // Si el resultado es un objeto vacío, retornar string vacío
  if (typeof sanitized === 'object' && !Array.isArray(sanitized)) {
    if (Object.keys(sanitized).length === 0) {
      return '';
    }
  }

  return sanitized;
}

async function cargarRendicionesDeCuenta() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerRendicionDeCuentas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {     //JSON.stringify({
        id_actividad: actividadIdParaValidar.value,
        id_tarea: tareaIdParaValidar.value,
        //usuario: usuario.value.nombre,
      },
    })
    //console.log('00000000000000000000000000000', JSON.stringify(response,null,2) )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    //console.log('Datos recibidos para RC:', JSON.stringify(rawData,null,2))

    datosFormularioValidarRC.value = strictSanitizeData(rawData)
    //console.log('Datos cargados exitosamente:', JSON.stringify(datosFormularioValidarRC.value,null,2),actividadIdParaValidar.value, tareaIdParaValidar.value)
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

async function cargarSolicitudDeReposicion() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudReembolso/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {//JSON.stringify({
        id_actividad: actividadIdParaValidar.value,
        id_tarea: tareaIdParaValidar.value,
        //usuario: usuario.value.nombre,
      },
    })
    //console.log('00000000000000000000000000000', JSON.stringify(response,null,2) )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    //console.log('SoicitudDeReposicion Recibido:', JSON.stringify(rawData,null,2))

    datosFormularioValidarSR.value = strictSanitizeData(rawData)
    //console.log('Datos cargados exitosamente:', JSON.stringify(datosFormularioValidarSR.value,null,2),actividadIdParaValidar.value, tareaIdParaValidar.value)
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

async function cargarSolicitudDeViaje() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudesViaje/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {//JSON.stringify({
        id_actividad: actividadIdParaValidar.value,
        id_tarea: tareaIdParaValidar.value,
        //usuario: usuario.value.nombre,
      },
    })
    //console.log('00000000000000000000000000000', JSON.stringify(response,null,2) )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    //console.log('SoicitudDeViaje Recibido:', JSON.stringify(rawData,null,2))

    listaSolicitudesDeViaje.value = strictSanitizeData(rawData.solicitudes)
    //console.log('Datos cargados exitosamente:', JSON.stringify(listaSolicitudesDeViaje.value,null,2),actividadIdParaValidar.value, tareaIdParaValidar.value)
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

async function cargarSolicitudDePagoDirecto() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudesPagoDirecto/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {   //JSON.stringify({
        id_actividad: actividadIdParaValidar.value,
        id_tarea: tareaIdParaValidar.value,
        //usuario: usuario.value.nombre,
      },
    })
    //console.log('00000000000000000000000000000', JSON.stringify(response,null,2) )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    console.log('SoicitudDePagoDirecto Recibido:', JSON.stringify(rawData,null,2))

    listaSolicitudesDePagoDirecto.value = strictSanitizeData(rawData.solicitudes)
    console.log('Datos cargados exitosamente:', JSON.stringify(listaSolicitudesDePagoDirecto.value,null,2),actividadIdParaValidar.value, tareaIdParaValidar.value)
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

// Función helper para mostrar notificaciones
const mostrarSnackbar = (texto, color = 'success') => {
  snackbar.value = {
    show: true,
    text: texto,
    color: color,
  }
}

// Lógica de filtros y paginación
const filteredActividades = computed(() => {
  if (!Array.isArray(actividades.value)) return []

  let filtered = [...actividades.value]

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (actividad) =>
        (actividad.codigo && actividad.codigo.toLowerCase().includes(query)) ||
        (actividad.descripcion && actividad.descripcion.toLowerCase().includes(query)),
    )
  }
  // Filtrar por estado
  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((actividad) => statusFilters.value.includes(actividad.estado))
  }
  // Filtrar por procedencia de fondos
  if (procedenciaFilter.value) {
    filtered = filtered.filter(
      (actividad) => actividad.procedencia_fondos === procedenciaFilter.value,
    )
  }
  return filtered
})

const actividadesPaginadas = computed(() => {
  if (!Array.isArray(filteredActividades.value)) return []
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredActividades.value.slice(start, end)
})

const totalPages = computed(() => {
  if (!Array.isArray(filteredActividades.value)) return 0
  return Math.ceil(filteredActividades.value.length / itemsPerPage.value)
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => {
  if (!Array.isArray(filteredActividades.value)) return 0
  const end = currentPage.value * itemsPerPage.value
  return end > filteredActividades.value.length ? filteredActividades.value.length : end
})

const countByStatus = (status) => {
  if (!Array.isArray(filteredActividades.value)) return 0
  return filteredActividades.value.filter((a) => a.estado === status).length
}

const toggleExpanded = (id) => {
  expandedActividadId.value = expandedActividadId.value === id ? null : id
}

// --- CRUD TAREAS ---
const openTareaDialog = (actividadId, tarea = null) => {
  isEditandoTarea.value = !!tarea
  actividadIdParaTarea.value = actividadId
  if (isEditandoTarea.value) {
    Object.assign(tareaForm.value, {
      id: tarea.id,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: mapEstadoBackendToFrontend(tarea.estado),
    })
  } else {
    Object.assign(tareaForm.value, { id: null, titulo: '', descripcion: '', estado: 'PEN' })
  }
  tareaDialog.value = true
}

const saveTarea = async () => {

  const { valid } = await tareaFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
     const tareaData = {
       titulo: tareaForm.value.titulo,
       descripcion: tareaForm.value.descripcion,
       estado: tareaForm.value.estado,
       actividad: actividadIdParaTarea.value
     }
     console.log('Datos de tarea a guardar:', tareaData)

     let resultado

     if (isEditandoTarea.value) {

      resultado = await tareasServicios.update(tareaForm.value.id, tareaData)


       const actividad = actividades.value.find((a) => a.id === actividadIdParaTarea.value)
       if (actividad && actividad.tareas) {
         const tareaIndex = actividad.tareas.findIndex((t) => t.id === tareaForm.value.id)
         if (tareaIndex !== -1) {
           const tareaActualizada = {
             ...resultado,
             estadoFrontend: mapEstadoBackendToFrontend(resultado.estado),
           }
           actividad.tareas[tareaIndex] = tareaActualizada
         }
       }

       mostrarSnackbar('Tarea actualizada con éxito', 'success')
     } else {
       console.log('Tarea creada:', actividadIdParaTarea)
       //resultado = await crearTareaEnActividad(tareaData)
        resultado = await tareasServicios.crear(tareaData)
       const actividad = actividades.value.find((a) => a.id === actividadIdParaTarea.value)
       if (actividad) {
         if (!actividad.tareas) {
           actividad.tareas = []
         }
         const nuevaTarea = {
           ...resultado,
           estadoFrontend: mapEstadoBackendToFrontend(resultado.estado),
         }
         actividad.tareas.push(nuevaTarea)
       }

       mostrarSnackbar('Tarea creada con éxito', 'success')
     }
   } catch (error) {
     console.error('Error al guardar tarea:', error)
     mostrarSnackbar(
       'Error al guardar tarea: ' +
         (error.response?.data?.message || error.message || 'Error desconocido'),
       'error',
     )
   } finally {
     loading.value = false
     tareaDialog.value = false
     await nextTick()
     if (tareaFormRef.value) {
       tareaFormRef.value.reset()
     }
   }
}

const confirmDeleteTarea = (actividadId, tarea) => {
  actividadIdParaEliminarTarea.value = actividadId
  tareaToDelete.value = tarea
  deleteTareaDialog.value = true
}

const deleteTarea = async () => {
  loading.value = true
  try {
    //await eliminarTareaDeActividad(actividadIdParaEliminarTarea.value, tareaToDelete.value.id)

    await tareasServicios.del( tareaToDelete.value.id)
    const actividad = actividades.value.find((a) => a.id === actividadIdParaEliminarTarea.value)
    if (actividad && actividad.tareas) {
      actividad.tareas = actividad.tareas.filter((t) => t.id !== tareaToDelete.value.id)
    }

    mostrarSnackbar('Tarea eliminada con éxito', 'success')
  } catch (error) {
    console.error('Error al eliminar tarea:', error)
    mostrarSnackbar(
      'Error al eliminar tarea: ' +
        (error.response?.data?.message || error.message || 'Error desconocido'),
      'error',
    )
  } finally {
    loading.value = false
    deleteTareaDialog.value = false
  }
}

// Funciones auxiliares
const getTipoIcon = (status) => {
  switch (status) {
    case 'PLAN':
      return 'mdi-calendar-check-outline'
    case 'RETR':
      return 'mdi-calendar-alert'
    case 'REPROG':
      return 'mdi-calendar-refresh'
    case 'EJEC':
      return 'mdi-calendar-arrow-right'
    case 'REP':
      return 'mdi-calendar-edit'
    case 'FIN':
      return 'mdi-calendar-done'
    default:
      return 'mdi-help-circle'
  }
}

const formatCurrency = (value) => {
  const numValue = Number(value)
  return !isNaN(numValue) ? `Bs. ${numValue.toFixed(2)}` : 'N/A'
}

const getProcedenciaTexto = (procedencia) => {
  const p = procedenciaFondos.find((p) => p.value === procedencia)
  return p ? p.text : 'Desconocido'
}

const getStatusColorTarea = (status) => {
  switch (status) {
    case 'PEN':
      return 'grey'
    case 'EPROG':
      return 'warning'
    case 'COMPL':
      return 'success'
    default:
      return 'grey'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

const actividadesPaginadasOrdenadas = computed(() => {
  if (!Array.isArray(actividadesPaginadas.value)) return []

  // Ordenar por ID (o fecha de creación si está disponible) de forma descendente
  return [...actividadesPaginadas.value].sort((a, b) => {
    // Si tienes un campo de fecha de creación, úsalo:
    // return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);

    // Si no, ordenar por ID (asumiendo que IDs más altos son más recientes)
    return b.id - a.id
  })
})
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>
