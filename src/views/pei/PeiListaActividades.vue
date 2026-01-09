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
              :key="getActividadKey(actividad)"
            >
              <!-- Actividad de Proyecto o PEI - Usando el mismo template con condicionales -->
              <v-list-item
                :value="getActividadKey(actividad)"
                @click="toggleExpanded(getActividadKey(actividad))"
                class="mb-2"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getStatusColor(actividad.estado)" class="mr-4">
                    <v-icon dark>{{ getTipoIcon(actividad.estado) }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">
                  Código: {{ actividad.codigo }}
                  <!-- Chip para distinguir tipo de actividad -->
                  <v-chip
                    small
                    :color="actividad.proyecto_id ? 'primary' : 'teal'"
                    text-color="white"
                    class="ml-2"
                  >
                    {{ actividad.proyecto_id ? 'PROYECTO' : 'PEI' }}
                  </v-chip>
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
                              getSolicitudFondosInfo(
                                actividad.id,
                                null,
                                getActividadTipo(actividad),
                              )?.bloquearIconosSolFondos && false
                            "
                            :to="getFormularioUrl('formulario01', actividad)"
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
                            :disabled="
                              getSolicitudFondosInfo(
                                actividad.id,
                                null,
                                getActividadTipo(actividad),
                              )?.bloquearIconosSolFondos && false
                            "
                            @click.stop="
                              abrirDialogValidar(actividad.id, null, getActividadTipo(actividad))
                            "
                          ></v-btn>
                        </template>
                      </v-tooltip>
                    </div>

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
                            :to="getFormularioUrl('formulario05', actividad)"
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
                            :disabled="
                              getSolicitudFondosInfo(
                                actividad.id,
                                null,
                                getActividadTipo(actividad),
                              )?.bloquearIconosSolFondos && false
                            "
                            @click.stop="
                              abrirDialogViajeValidar(
                                actividad.id,
                                null,
                                getActividadTipo(actividad),
                              )
                            "
                          ></v-btn>
                        </template>
                      </v-tooltip>
                    </div>

                    <!-- Solicitud de Pago Directo -->
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
                            :to="getFormularioUrl('formulario08', actividad)"
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
                            :disabled="
                              getSolicitudFondosInfo(
                                actividad.id,
                                null,
                                getActividadTipo(actividad),
                              )?.bloquearIconosSolFondos && false
                            "
                            @click.stop="
                              abrirDialogPagoDirectoValidar(
                                actividad.id,
                                null,
                                getActividadTipo(actividad),
                              )
                            "
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
                            :to="getFormularioUrl('formulario03', actividad)"
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
                            :disabled="
                              getSolicitudFondosInfo(
                                actividad.id,
                                null,
                                getActividadTipo(actividad),
                              )?.bloquearIconosSolFondos && false
                            "
                            @click.stop="
                              abrirDialogReposicionValidar(
                                actividad.id,
                                null,
                                getActividadTipo(actividad),
                              )
                            "
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
                            :to="getFormularioUrl('formulario02', actividad)"
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
                            size="small"
                            @click.stop="
                              abrirDialogRendicionValidar(
                                actividad.id,
                                null,
                                getActividadTipo(actividad),
                              )
                            "
                          ></v-btn>
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
                          :to="getFormularioUrl('formularioinf', actividad)"
                          @click.stop
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <!-- Tarjeta de detalles desplegable para SUBACTIVIDADES (tareas) -->
              <v-expand-transition>
                <div v-if="expandedActividadKey === getActividadKey(actividad)">
                  <v-list-item :value="`detalle-${getActividadKey(actividad)}`" class="mb-2">
                    <v-card elevation="0" class="ml-10 mr-4 mb-4 bg-grey-lighten-4">
                      <v-card-text class="pt-4">
                        <div class="d-flex justify-space-between align-center mb-4">
                          <span class="text-subtitle-1"
                            >Sub Actividades para {{ actividad.codigo }}</span
                          >
                          <div class="d-flex align-center">
                            <v-btn
                              color="primary"
                              variant="text"
                              @click="openTareaDialog(actividad.id, getActividadTipo(actividad))"
                            >
                              <v-icon left>mdi-plus</v-icon>
                              Añadir Sub Actividad
                            </v-btn>
                          </div>
                        </div>
                        <v-list density="compact" class="py-0">
                          <v-list-item
                            v-for="tarea in actividad.tareas"
                            :key="getTareaKey(actividad, tarea)"
                            class="mb-1"
                          >
                            <v-list-item-title>
                              {{ tarea.titulo || tarea.descripcion || 'Sub Actividad sin título' }}
                            </v-list-item-title>
                            <template v-slot:prepend>
                              <v-icon :color="getStatusColorTarea(tarea.estado)">
                                mdi-checkbox-blank-circle
                              </v-icon>
                            </template>
                            <template v-slot:append>
                              <div class="d-flex">
                                <!-- Solicitud de Fondos para SUBACTIVIDAD -->
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
                                        :to="getFormularioUrl('formulario01', actividad, tarea.id)"
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
                                        size="x-small"
                                        @click.stop="
                                          abrirDialogValidar(
                                            actividad.id,
                                            tarea.id,
                                            getActividadTipo(actividad),
                                          )
                                        "
                                      ></v-btn>
                                    </template>
                                  </v-tooltip>
                                </div>

                                <!-- Solicitud de Viaje para SUBACTIVIDAD -->
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
                                        :to="getFormularioUrl('formulario05', actividad, tarea.id)"
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
                                        :disabled="
                                          getSolicitudFondosInfo(
                                            actividad.id,
                                            tarea.id,
                                            getActividadTipo(actividad),
                                          )?.bloquearIconosSolFondos && false
                                        "
                                        @click.stop="
                                          abrirDialogViajeValidar(
                                            actividad.id,
                                            tarea.id,
                                            getActividadTipo(actividad),
                                          )
                                        "
                                      ></v-btn>
                                    </template>
                                  </v-tooltip>
                                </div>

                                <!-- Solicitud de Pago Directo para SUBACTIVIDAD -->
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
                                        :to="getFormularioUrl('formulario08', actividad, tarea.id)"
                                        @click.stop
                                      ></v-btn>
                                    </template>
                                  </v-tooltip>

                                  <v-tooltip
                                    text="Validar Solicitud de Pago Directo"
                                    location="bottom"
                                  >
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-if="parseInt($route.query.showButton) === 1"
                                        v-bind="props"
                                        icon="mdi-thumb-up"
                                        variant="text"
                                        color="teal-lighten-2"
                                        size="x-small"
                                        :disabled="
                                          getSolicitudFondosInfo(
                                            actividad.id,
                                            tarea.id,
                                            getActividadTipo(actividad),
                                          )?.bloquearIconosSolFondos && false
                                        "
                                        @click.stop="
                                          abrirDialogPagoDirectoValidar(
                                            actividad.id,
                                            tarea.id,
                                            getActividadTipo(actividad),
                                          )
                                        "
                                      ></v-btn>
                                    </template>
                                  </v-tooltip>
                                </div>

                                <!-- Solicitud de Reposición para SUBACTIVIDAD -->
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
                                        :to="getFormularioUrl('formulario03', actividad, tarea.id)"
                                        @click.stop
                                      ></v-btn>
                                    </template>
                                  </v-tooltip>

                                  <v-tooltip
                                    text="Validar Solicitud de Reposición"
                                    location="bottom"
                                  >
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-if="parseInt($route.query.showButton) === 1"
                                        v-bind="props"
                                        icon="mdi-thumb-up"
                                        variant="text"
                                        color="warning"
                                        size="x-small"
                                        @click.stop="
                                          abrirDialogReposicionValidar(
                                            actividad.id,
                                            tarea.id,
                                            getActividadTipo(actividad),
                                          )
                                        "
                                      ></v-btn>
                                    </template>
                                  </v-tooltip>
                                </div>

                                <!-- Rendición de cuentas para SUBACTIVIDADES-->
                                <div class="d-flex flex-column align-center justify-center">
                                  <v-tooltip
                                    :text="
                                      getRendicionText(
                                        actividad.id,
                                        tarea.id,
                                        getActividadTipo(actividad),
                                      )
                                    "
                                    location="top"
                                  >
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-if="parseInt($route.query.showButton) === 2"
                                        v-bind="props"
                                        icon="mdi-cash-check"
                                        variant="text"
                                        color="error"
                                        size="x-small"
                                        :disabled="false"
                                        :to="getFormularioUrl('formulario02', actividad, tarea.id)"
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
                                        @click.stop="
                                          abrirDialogRendicionValidar(
                                            actividad.id,
                                            tarea.id,
                                            getActividadTipo(actividad),
                                          )
                                        "
                                      ></v-btn>
                                    </template>
                                  </v-tooltip>
                                </div>

                                <!-- Informe de Actividad para SUBACTIVIDAD -->
                                <v-tooltip text="Informe de Actividad" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-if="parseInt($route.query.showButton) === 3"
                                      v-bind="props"
                                      icon="mdi-file-chart"
                                      variant="text"
                                      color="info"
                                      size="small"
                                      :to="getFormularioUrl('formularioinf', actividad, tarea.id)"
                                      @click.stop
                                    ></v-btn>
                                  </template>
                                </v-tooltip>

                                <!-- Separador visual -->
                                <v-divider vertical inset class="mx-1 my-1"></v-divider>

                                <!-- Acciones de SUBACTIVIDAD -->
                                <v-tooltip text="Editar Sub Actividad" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-bind="props"
                                      icon="mdi-pencil"
                                      variant="text"
                                      color="warning"
                                      size="small"
                                      @click.stop="
                                        openTareaDialog(
                                          actividad.id,
                                          getActividadTipo(actividad),
                                          tarea,
                                        )
                                      "
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
                                      @click.stop="
                                        confirmDeleteTarea(
                                          actividad.id,
                                          getActividadTipo(actividad),
                                          tarea,
                                        )
                                      "
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
          :title="isEditandoTarea ? 'Editar Sub Actividad' : 'Nueva Sub Actividad'"
        ></v-toolbar>
        <v-card-text>
          <v-form ref="tareaFormRef" @submit.prevent="saveTarea">
            <v-text-field
              v-model="tareaForm.titulo"
              label="Título de la sub actividad"
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
        <v-card-title class="text-h5">Confirmar eliminación de sub actividad</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la sub actividad "{{
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
            <v-list-item
              :value="solicitudF.id"
              @click="() => abrirFormulario011(solicitudF.id)"
              class="mb-2"
            >
              <v-list-item-title class="font-weight-bold">
                Formulario: {{ solicitudF.numeroFormulario }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1">
                <div class="d-flex align-center flex-wrap">
                  <span class="mr-2">Fecha de Solicitud: {{ solicitudF.fechaSolicitud }}</span>
                </div>
                <div class="text-caption mt-1">
                  Lugar de Solicitud: {{ solicitudF.lugarSolicitud }}
                </div>
              </v-list-item-subtitle>
              <template v-slot:append>
                <v-list-item-title
                  v-if="
                    solicitudF.validacionCoordinador === true &&
                    solicitudF.validacionResponsable === true
                  "
                  class="font-weight-bold text-success text-right"
                >
                  <v-icon color="success" end>mdi-check</v-icon>
                </v-list-item-title>
              </template>
            </v-list-item>
          </template>
          <v-list-item v-if="datosFormulario1.solicitudes.length === 0 && !loading">
            <v-list-item-title class="text-grey"
              >No tienes validacion de solicitudes pendientes</v-list-item-title
            >
          </v-list-item>
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
            <v-list-item
              :value="solicitudF.id"
              @click="() => abrirFormularioRendicionC(solicitudF.id)"
              class="mb-2"
            >
              <v-list-item-title class="font-weight-bold">
                Formulario: {{ solicitudF.numeroFormulario }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1">
                <div class="d-flex align-center flex-wrap">
                  <span class="mr-2">Fecha de Solicitud: {{ solicitudF.fechaSolicitud }}</span>
                </div>
                <div class="text-caption mt-1">
                  Lugar de Solicitud: {{ solicitudF.lugarSolicitud }}
                </div>
              </v-list-item-subtitle>
            </v-list-item>
          </template>
          <v-list-item v-if="datosFormularioRC.solicitudes.length === 0 && !loading">
            <v-list-item-title class="text-grey"
              >No tienes validacion de solicitudes pendientes</v-list-item-title
            >
          </v-list-item>
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
            <v-list-item
              :value="solicitudF.id"
              @click="() => abrirFormularioRendicionCuentasValidar(solicitudF.id)"
              class="mb-2"
            >
              <v-list-item-title class="font-weight-bold">
                Formulario: {{ solicitudF.numeroFormulario }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1">
                <div class="d-flex align-center flex-wrap">
                  <span class="mr-2">Fecha de Solicitud: {{ solicitudF.fechaDesembolso }}</span>
                </div>
                <div class="text-caption mt-1">
                  Lugar de Solicitud: {{ solicitudF.montoDescargado }}
                </div>
              </v-list-item-subtitle>
              <template v-slot:append>
                <v-list-item-title
                  v-if="
                    solicitudF.validacionCoordinador === true &&
                    solicitudF.validacionContador === true &&
                    solicitudF.validacionAdministrador === true
                  "
                  class="font-weight-bold text-success text-right"
                >
                  <v-icon color="success" end>mdi-check</v-icon>
                </v-list-item-title>
              </template>
            </v-list-item>
          </template>

          <v-list-item v-if="datosFormularioValidarRC.rendiciones.length === 0 && !loading">
            <v-list-item-title class="text-grey"
              >No tienes validacion de solicitudes pendientes</v-list-item-title
            >
          </v-list-item>
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
            <v-list-item
              :value="solicitudF.id"
              @click="() => abrirFormulario03(solicitudF.id)"
              class="mb-2"
            >
              <v-list-item-title class="font-weight-bold">
                Formulario: {{ solicitudF.numeroFormulario }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1">
                <div class="d-flex align-center flex-wrap">
                  <span class="mr-2">Fecha de Solicitud: {{ solicitudF.fechaSolicitud }}</span>
                </div>
                <div class="text-caption mt-1">
                  Lugar de Solicitud: {{ solicitudF.lugarSolicitud }}
                </div>
              </v-list-item-subtitle>
            </v-list-item>
          </template>

          <v-list-item v-if="datosFormulario1.solicitudes.length === 0 && !loading">
            <v-list-item-title class="text-grey"
              >No tienes validacion de solicitudes pendientes</v-list-item-title
            >
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
            <v-list-item
              :value="solicitudF.id"
              @click="() => abrirFormularioReposicion(solicitudF.id)"
              class="mb-2"
            >
              <v-list-item-title class="font-weight-bold">
                Formulario: {{ solicitudF.numeroFormulario }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1">
                <div class="d-flex align-center flex-wrap">
                  <span class="mr-2">Fecha de Solicitud: {{ solicitudF.fechaSolicitud }}</span>
                </div>
                <div class="text-caption mt-1">
                  Lugar de Solicitud: {{ solicitudF.lugarSolicitud }}
                </div>
              </v-list-item-subtitle>

              <template v-slot:append>
                <v-list-item-title
                  v-if="
                    solicitudF.validacionCoordinador === true &&
                    solicitudF.validacionResponsable === true
                  "
                  class="font-weight-bold text-success text-right"
                >
                  <v-icon color="success" end>mdi-check</v-icon>
                </v-list-item-title>
              </template>
            </v-list-item>
          </template>

          <v-list-item v-if="datosFormularioValidarSR.solicitudes.length === 0 && !loading">
            <v-list-item-title class="text-grey"
              >No tienes validacion de solicitudes pendientes</v-list-item-title
            >
          </v-list-item>
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
            <v-list-item
              :value="solicitudF.id"
              @click="() => abrirFormularioSolicitudDeViajeParaValidar(solicitudF.id)"
              class="mb-2"
            >
              <v-list-item-title class="font-weight-bold">
                Formulario: {{ solicitudF.numeroFormulario }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1">
                <div class="d-flex align-center flex-wrap">
                  <span class="mr-2">Fecha de Solicitud: {{ solicitudF.fechaSolicitud }}</span>
                </div>
                <div class="text-caption mt-1">
                  Lugar de Solicitud: {{ solicitudF.lugarSolicitud }}
                </div>
              </v-list-item-subtitle>

              <template v-slot:append>
                <v-list-item-title
                  v-if="
                    solicitudF.validacionCoordinador === true &&
                    solicitudF.validacionResponsable === true
                  "
                  class="font-weight-bold text-success text-right"
                >
                  <v-icon color="success" end>mdi-check</v-icon>
                </v-list-item-title>
              </template>
            </v-list-item>
          </template>

          <v-list-item v-if="listaSolicitudesDeViaje.length === 0 && !loading">
            <v-list-item-title class="text-grey"
              >No tienes validacion de solicitudes pendientes</v-list-item-title
            >
          </v-list-item>
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
            <v-list-item
              :value="solicitudF.id"
              @click="() => abrirFormularioSolicitudDePagoDirectoParaValidar(solicitudF.id)"
              class="mb-2"
            >
              <v-list-item-title class="font-weight-bold">
                Formulario: {{ solicitudF.numeroFormulario }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1">
                <div class="d-flex align-center flex-wrap">
                  <span class="mr-2">Fecha de Solicitud: {{ solicitudF.fechaSolicitud }}</span>
                </div>
                <div class="text-caption mt-1">
                  Lugar de Solicitud: {{ solicitudF.lugarSolicitud }}
                </div>
              </v-list-item-subtitle>

              <template v-slot:append>
                <v-list-item-title
                  v-if="
                    solicitudF.validacionCoordinador === true &&
                    solicitudF.validacionResponsable === true
                  "
                  class="font-weight-bold text-success text-right"
                >
                  <v-icon color="success" end>mdi-check</v-icon>
                </v-list-item-title>
              </template>
            </v-list-item>
          </template>

          <v-list-item v-if="listaSolicitudesDePagoDirecto.length === 0 && !loading">
            <v-list-item-title class="text-grey"
              >No tienes validacion de solicitudes pendientes</v-list-item-title
            >
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="dialogPagoDirectoValidar = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { tareasServicios } from '@/modules/proyecto/services/tareasService'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
//Stores
import { useListaActividadesTareasStore } from '@/modules/formularios/store/useListaActividadesTaresStore'

const router = useRouter()
const userStore = useUserStore()

const usuario = computed(() => {
  return {
    nombre: userStore.usuario,
    role: userStore.rol,
  }
})

// Inicializar el store
const storeActividades = useListaActividadesTareasStore()

// Variables para carga de datos
const datosFormulario = ref(null)
const datosFormulario1 = ref(null)
const datosFormularioRC = ref(null)
const datosFormularioValidarRC = ref(null)
const datosFormularioValidarSR = ref(null)
const listaSolicitudesDeViaje = ref(null)
const listaSolicitudesDePagoDirecto = ref(null)
const error = ref(null)
const isLoading = ref(false)

const { actividadesTareas, actividadTarea: actividadesFromApi, actividades } = useActividad()

// --- NUEVAS VARIABLES PARA SOLICITUDES DE FONDOS ---
const solicitudesFondos = ref([])
const loadingSolicitudes = ref(false)

// --- ESTADOS REACTIVOS ---
const cargandoGeneral = ref(true)
const loading = ref(true)
const emptyResponse = ref(false)
const searchQuery = ref('')
const statusFilters = ref([])
const expandedActividadKey = ref(null) // Cambiado para usar clave única

// Variables para diálogos
const dialogValidarSolicitud = ref(false)
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
const actividadTipoParaTarea = ref(null) // 'proyecto' o 'pei'
const isEditandoTarea = ref(false)
const tareaFormRef = ref(null)

// Diálogos de eliminación
const deleteTareaDialog = ref(false)
const tareaToDelete = ref(null)
const actividadIdParaEliminarTarea = ref(null)
const actividadTipoParaEliminarTarea = ref(null)

// Variables para almacenar los IDs temporalmente
const actividadIdParaValidar = ref(null)
const tareaIdParaValidar = ref(null)
const actividadTipoParaValidar = ref(null) // Nuevo: tipo de actividad

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

// --- FUNCIONES AUXILIARES PARA MANEJAR CLAVES ÚNICAS ---

// Generar clave única para actividad (evita conflictos de IDs)
const getActividadKey = (actividad) => {
  // Usar prefijo para distinguir entre proyecto y PEI
  const prefix = actividad.proyecto_id ? 'proyecto' : 'pei'
  return `${prefix}-${actividad.id}`
}

// Generar clave única para tarea
const getTareaKey = (actividad, tarea) => {
  const actividadKey = getActividadKey(actividad)
  return `${actividadKey}-tarea-${tarea.id}`
}

// Determinar tipo de actividad
const getActividadTipo = (actividad) => {
  return actividad.proyecto_id ? 'proyecto' : 'pei'
}

// --- FUNCIONES PARA GENERAR URLs DINÁMICAS ---

// Función para obtener la URL correcta según el tipo de actividad
const getFormularioUrl = (formulario, actividad, tareaId = null) => {
  const basePath = actividad.proyecto_id ? '/monitoreo' : '/monitoreo/pei'
  let url = `${basePath}/${formulario}/${actividad.id}`

  if (tareaId) {
    url += `?tarea_id=${tareaId}`
  }

  return url
}

// --- FUNCIONES PARA ABRIR DIÁLOGOS ---

const abrirDialogValidar = async (actividadId, tareaId = null, actividadTipo = null) => {
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  actividadTipoParaValidar.value = actividadTipo

  try {
    await cargarDatos()
    if (datosFormulario.value) {
      await cargarSolicitudFondos()
    }
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error)
    mostrarSnackbar('Error al cargar datos iniciales', 'error')
  }

  dialogValidarSolicitud.value = true
}

const abrirDialogRendicionValidar = async (actividadId, tareaId = null, actividadTipo = null) => {
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  actividadTipoParaValidar.value = actividadTipo

  try {
    await cargarDatos()
    if (datosFormulario.value) {
      await cargarRendicionesDeCuenta()
    }
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error)
    mostrarSnackbar('Error al cargar datos iniciales', 'error')
  }

  dialogRendicionCuentasValidar.value = true
}

const abrirDialogReposicionValidar = async (actividadId, tareaId = null, actividadTipo = null) => {
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  actividadTipoParaValidar.value = actividadTipo

  try {
    await cargarDatos()
    if (datosFormulario.value) {
      await cargarSolicitudFondos()
      await cargarSolicitudDeReposicion()
    }
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error)
    mostrarSnackbar('Error al cargar datos iniciales', 'error')
  }

  dialogReposicionValidar.value = true
}

const abrirDialogViajeValidar = async (actividadId, tareaId = null, actividadTipo = null) => {
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  actividadTipoParaValidar.value = actividadTipo

  await cargarSolicitudDeViaje()
  dialogViajeValidar.value = true
}

const abrirDialogPagoDirectoValidar = async (actividadId, tareaId = null, actividadTipo = null) => {
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  actividadTipoParaValidar.value = actividadTipo

  await cargarSolicitudDePagoDirecto()
  dialogPagoDirectoValidar.value = true
}

// --- FUNCIONES PARA ABRIR FORMULARIOS ESPECÍFICOS ---

const abrirFormulario011 = (idSolicitudF) => {
  const basePath = actividadTipoParaValidar.value === 'proyecto' ? '/monitoreo' : '/monitoreo/pei'
  const routeConfig = {
    path: `${basePath}/formulario011/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudF,
    },
  }

  if (tareaIdParaValidar.value !== null && tareaIdParaValidar.value !== undefined) {
    routeConfig.query.tarea_id = tareaIdParaValidar.value
  }

  router.push(routeConfig)
}

const abrirFormularioRendicionC = (idSolicitudF) => {
  const basePath = actividadTipoParaValidar.value === 'proyecto' ? '/monitoreo' : '/monitoreo/pei'
  router.push({
    path: `${basePath}/formulario02/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudF,
    },
  })
}

const abrirFormularioRendicionCuentasValidar = (idSolicitudF) => {
  const basePath = actividadTipoParaValidar.value === 'proyecto' ? '/monitoreo' : '/monitoreo/pei'
  router.push({
    path: `${basePath}/formulario022/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudF,
    },
  })
}

const abrirFormulario03 = (idSolicitudF) => {
  const basePath = actividadTipoParaValidar.value === 'proyecto' ? '/monitoreo' : '/monitoreo/pei'
  router.push({
    path: `${basePath}/formulario03/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudF,
    },
  })
}

const abrirFormularioReposicion = (idSolicitudR) => {
  const basePath = actividadTipoParaValidar.value === 'proyecto' ? '/monitoreo' : '/monitoreo/pei'
  router.push({
    path: `${basePath}/formulario033/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudR,
    },
  })
}

const abrirFormularioSolicitudDeViajeParaValidar = (idSolicitudDeViaje) => {
  const basePath = actividadTipoParaValidar.value === 'proyecto' ? '/monitoreo' : '/monitoreo/pei'
  router.push({
    path: `${basePath}/formulario055/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudDeViaje,
    },
  })
}

const abrirFormularioSolicitudDePagoDirectoParaValidar = (idSolicitudDePagoDirecto) => {
  const basePath = actividadTipoParaValidar.value === 'proyecto' ? '/monitoreo' : '/monitoreo/pei'
  router.push({
    path: `${basePath}/formulario088/${actividadIdParaValidar.value}`,
    query: {
      solicitud_id: idSolicitudDePagoDirecto,
    },
  })
}

// --- MÉTODOS Y COMPUTADAS EXISTENTES MODIFICADAS ---

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

const getEstadoTexto = (status) => {
  const estado = availableStatuses.find((s) => s.value === status)
  return estado ? estado.text : 'Desconocido'
}

// Carga inicial de datos
onMounted(async () => {
  await cargar()
})

// Modificar la función cargar para agregar tipo a las actividades
const cargar = async () => {
  loading.value = true
  try {
    await Promise.all([
      actividadesTareas(),
      cargarSolicitudesFondos(),
      storeActividades.cargarActividadesConTareas(),
    ])

    if (Array.isArray(storeActividades.actividadesFromApi)) {
      actividades.value = storeActividades.actividadesFromApi.map((actividad) => ({
        ...actividad,
        tipo: getActividadTipo(actividad), // Agregar tipo
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

// Modificar getSolicitudFondosInfo para incluir tipo
const getSolicitudFondosInfo = (actividadId, tareaId = null, actividadTipo = null) => {
  if (!solicitudesFondos.value.length) return null

  const solicitud = solicitudesFondos.value.find((sf) => {
    const matchActividad = sf.actividad === actividadId
    const matchTarea = tareaId ? sf.tarea === tareaId : true
    return matchActividad && matchTarea
  })

  return solicitud || null
}

// Modificar getRendicionText para incluir tipo
const getRendicionText = (actividadId, tareaId = null, actividadTipo = null) => {
  const solicitud = getSolicitudFondosInfo(actividadId, tareaId, actividadTipo)
  if (solicitud && solicitud.numeroFormulario) {
    return `Rendición de Cuentas (${solicitud.numeroFormulario})`
  }
  return 'Rendición de Cuentas - Pendiente solicitud'
}

// Modificar toggleExpanded para usar clave única
const toggleExpanded = (key) => {
  expandedActividadKey.value = expandedActividadKey.value === key ? null : key
}

// --- CRUD TAREAS MODIFICADO ---

const openTareaDialog = (actividadId, actividadTipo, tarea = null) => {
  isEditandoTarea.value = !!tarea
  actividadIdParaTarea.value = actividadId
  actividadTipoParaTarea.value = actividadTipo

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

// Modificar confirmDeleteTarea para incluir tipo
const confirmDeleteTarea = (actividadId, actividadTipo, tarea) => {
  actividadIdParaEliminarTarea.value = actividadId
  actividadTipoParaEliminarTarea.value = actividadTipo
  tareaToDelete.value = tarea
  deleteTareaDialog.value = true
}

// Funciones auxiliares (sin cambios)
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

// Modificar actividadesPaginadasOrdenadas para incluir la clave
const actividadesPaginadasOrdenadas = computed(() => {
  if (!Array.isArray(actividadesPaginadas.value)) return []

  return [...actividadesPaginadas.value].sort((a, b) => {
    // Primero ordenar por tipo (proyecto primero, luego PEI)
    if (a.proyecto_id && !b.proyecto_id) return -1
    if (!a.proyecto_id && b.proyecto_id) return 1

    // Luego por ID descendente
    return b.id - a.id
  })
})

// --- FUNCIONES DE CARGA DE DATOS ---

async function cargarDatos() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch('http://127.0.0.1:8000/api/monitoreo/obtener-datos-formulario/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_actividad: actividadIdParaValidar.value,
        usuario: usuario.value.nombre,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    datosFormulario.value = strictSanitizeData(rawData)
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
    const response = await fetch('http://127.0.0.1:8000/monitoreo_api/obtenerSolicitudFondos/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`)
    }

    const data = await response.json()

    // Filtrar las solicitudes por actividad_id y tarea_id
    const solicitudesFiltradas = data.solicitudes.filter((solicitud) => {
      const coincideActividad = solicitud.actividad_id === actividadIdParaValidar.value
      const coincideTarea = solicitud.tarea_id === tareaIdParaValidar.value
      return coincideActividad && coincideTarea
    })
    datosFormulario1.value = {
      estado: 'exito',
      solicitudes: solicitudesFiltradas,
    }

    const solicitudesFiltradasParaRC = data.solicitudes.filter((solicitud) => {
      const coincideActividad = solicitud.actividad_id === actividadIdParaValidar.value
      const coincideTarea = solicitud.tarea_id === tareaIdParaValidar.value
      const coincideValidacionResp = solicitud.validacionResponsable === true
      const coincideValidacionCoord = solicitud.validacionCoordinador === true
      return coincideActividad && coincideTarea && coincideValidacionResp && coincideValidacionCoord
    })
    datosFormularioRC.value = {
      estado: 'exito',
      solicitudes: solicitudesFiltradasParaRC,
    }
  } catch (err) {
    error.value = err.message
    console.error('Error al cargar solicitudes:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

async function cargarRendicionesDeCuenta() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch('http://127.0.0.1:8000/monitoreo_api/obtenerRendicionDeCuentas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_actividad: actividadIdParaValidar.value,
        id_tarea: tareaIdParaValidar.value,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    datosFormularioValidarRC.value = strictSanitizeData(rawData)
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
    const response = await fetch('http://127.0.0.1:8000/monitoreo_api/obtenerSolicitudReembolso/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_actividad: actividadIdParaValidar.value,
        id_tarea: tareaIdParaValidar.value,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    datosFormularioValidarSR.value = strictSanitizeData(rawData)
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
    const response = await fetch('http://127.0.0.1:8000/monitoreo_api/obtenerSolicitudesViaje/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_actividad: actividadIdParaValidar.value,
        id_tarea: tareaIdParaValidar.value,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    listaSolicitudesDeViaje.value = strictSanitizeData(rawData.solicitudes)
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
    const response = await fetch(
      'http://127.0.0.1:8000/monitoreo_api/obtenerSolicitudesPagoDirecto/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_actividad: actividadIdParaValidar.value,
          id_tarea: tareaIdParaValidar.value,
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    listaSolicitudesDePagoDirecto.value = strictSanitizeData(rawData.solicitudes)
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

// --- FUNCIONES DE SANITIZACIÓN ---

function sanitizeData(data) {
  if (data === null || data === undefined) {
    return ''
  }

  if (typeof data === 'string') {
    const trimmed = data.trim()
    return trimmed === '' ? '' : trimmed
  }

  if (typeof data === 'number') {
    return isFinite(data) ? data : 0
  }

  if (typeof data === 'boolean') {
    return data
  }

  if (Array.isArray(data)) {
    return data
      .map((item) => sanitizeData(item))
      .filter((item) => item !== null && item !== undefined && item !== '')
  }

  if (typeof data === 'object') {
    const sanitized = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key]
        if (value !== null && value !== undefined && value !== '') {
          sanitized[key] = sanitizeData(value)
        }
      }
    }
    return sanitized
  }

  return ''
}

function strictSanitizeData(data) {
  const sanitized = sanitizeData(data)

  if (typeof sanitized === 'object' && !Array.isArray(sanitized)) {
    if (Object.keys(sanitized).length === 0) {
      return ''
    }
  }

  return sanitized
}

// Alternativa usando fetch en lugar de axios
const cargarSolicitudesFondos = async () => {
  loadingSolicitudes.value = true
  try {
    const response = await fetch('http://127.0.0.1:8000/api/solicitud-fondos/', {
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
    solicitudesFondos.value = data
  } catch (error) {
    console.error('Error con fetch:', error)
    mostrarSnackbar(`Error al cargar solicitudes: ${error.message}`, 'error')
  } finally {
    loadingSolicitudes.value = false
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

// --- CRUD TAREAS ---

const saveTarea = async () => {
  const { valid } = await tareaFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const tareaData = {
      titulo: tareaForm.value.titulo,
      descripcion: tareaForm.value.descripcion,
      estado: tareaForm.value.estado,
      actividad: actividadIdParaTarea.value,
    }

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

      mostrarSnackbar('Sub Actividad actualizada con éxito', 'success')
    } else {
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

      mostrarSnackbar('Sub Actividad creada con éxito', 'success')
    }
  } catch (error) {
    console.error('Error al guardar sub actividad:', error)
    mostrarSnackbar(
      'Error al guardar sub actividad: ' +
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

const deleteTarea = async () => {
  loading.value = true
  try {
    await tareasServicios.del(tareaToDelete.value.id)
    const actividad = actividades.value.find((a) => a.id === actividadIdParaEliminarTarea.value)
    if (actividad && actividad.tareas) {
      actividad.tareas = actividad.tareas.filter((t) => t.id !== tareaToDelete.value.id)
    }

    mostrarSnackbar('Sub Actividad eliminada con éxito', 'success')
  } catch (error) {
    console.error('Error al eliminar sub actividad:', error)
    mostrarSnackbar(
      'Error al eliminar sub actividad: ' +
        (error.response?.data?.message || error.message || 'Error desconocido'),
      'error',
    )
  } finally {
    loading.value = false
    deleteTareaDialog.value = false
  }
}

// --- LÓGICA DE FILTROS Y PAGINACIÓN ---

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
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>
