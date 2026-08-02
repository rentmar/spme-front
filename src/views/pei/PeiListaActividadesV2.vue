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
            <div class="d-flex align-center gap-2">
              <!-- 🆕 TOGGLE DE VISTA -->
              <v-btn-toggle
                v-model="modoVista"
                mandatory
                density="compact"
                variant="outlined"
                divided
              >
                <v-btn value="plana" size="small">
                  <v-icon left size="small">mdi-view-list</v-icon>
                  Actividades
                </v-btn>
                <v-btn value="proyectos" size="small">
                  <v-icon left size="small">mdi-folder-group</v-icon>
                  Proyectos
                </v-btn>
              </v-btn-toggle>
              <span class="text-caption text-grey">Total: {{ totalActividadesMostradas }}</span>
            </div>
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

          <!-- ============================================ -->
          <!-- VISTA PLANA (ORIGINAL MEJORADA)                -->
          <!-- ============================================ -->
          <template v-if="modoVista === 'plana'">
            <v-list v-if="!loading" class="py-0">
              <template
                v-for="(actividad, index) in actividadesPaginadasOrdenadas"
                :key="`actividad-${actividad.id}-${index}`"
              >
                <v-list-item
                  :value="actividad.id"
                  @click="toggleExpanded(actividad.id)"
                  class="mb-2"
                >
                  <template v-slot:prepend>
                    <v-avatar :color="getStatusColor(actividad.estado)" class="mr-4">
                      <v-icon dark>{{ getTipoIcon(actividad.estado) }}</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-bold">
                    Código: {{ actividad.codigo }}
                  </v-list-item-title>

                  <!-- 🆕 NOMBRE CORTO -->
                  <v-list-item-subtitle>
                    <span class="text-body-2 font-weight-medium">
                      {{ actividad.nombreCorto || actividad.nombre_corto || 'Sin nombre corto' }}
                    </span>
                  </v-list-item-subtitle>

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
                      <span v-if="actividad.duracion"
                        >(Duración: {{ actividad.duracion }} días)</span
                      >
                    </div>
                    <div class="text-caption mt-1" v-if="actividad.fecha_inicio">
                      <strong>Ejecución:</strong> {{ formatDate(actividad.fecha_inicio) }}
                      <span v-if="actividad.fecha_cierre"
                        >a {{ formatDate(actividad.fecha_cierre) }}</span
                      >
                    </div>
                  </v-list-item-subtitle>

                  <!-- Iconos de acciones con badges -->
                  <template v-slot:append>
                    <div class="d-flex align-center">
                      <!-- Solicitud de Fondos -->
                      <div class="d-flex flex-column align-center justify-center">
                        <v-tooltip text="Solicitud de Fondos" location="top">
                          <template v-slot:activator="{ props }">
                            <div class="btn-with-badge">
                              <v-btn
                                v-if="parseInt($route.query.showButton) === 1"
                                v-bind="props"
                                icon="mdi-cash-plus"
                                variant="text"
                                color="primary"
                                size="small"
                                :disabled="
                                  getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos &&
                                  false
                                "
                                :to="`/monitoreo/formulario01/${actividad.id}`"
                                @click.stop
                              ></v-btn>
                              <span
                                v-if="parseInt($route.query.showButton) === 1"
                                class="badge-indicator"
                                :class="{
                                  zero: getConteoSolicitudes(actividad.id, null).creados === 0,
                                }"
                              >
                                {{ getConteoSolicitudes(actividad.id, null).creados }}
                              </span>
                            </div>
                          </template>
                        </v-tooltip>
                        <v-tooltip text="Validar Solicitud de Fondos" location="bottom">
                          <template v-slot:activator="{ props }">
                            <div class="btn-with-badge">
                              <v-btn
                                v-if="parseInt($route.query.showButton) === 1"
                                v-bind="props"
                                icon="mdi-thumb-up"
                                variant="text"
                                color="primary"
                                size="small"
                                :disabled="
                                  getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos &&
                                  false
                                "
                                @click.stop="abrirDialogValidar(actividad.id, null)"
                              ></v-btn>
                              <span
                                v-if="parseInt($route.query.showButton) === 1"
                                class="badge-indicator bottom"
                                :class="{
                                  zero: getConteoSolicitudes(actividad.id, null).aprobados === 0,
                                }"
                              >
                                {{ getConteoSolicitudes(actividad.id, null).aprobados }}
                              </span>
                            </div>
                          </template>
                        </v-tooltip>
                      </div>

                      <!-- Solicitud de Viaje -->
                      <div class="d-flex flex-column align-center justify-center">
                        <v-tooltip text="Solicitud de Viaje" location="top">
                          <template v-slot:activator="{ props }">
                            <div class="btn-with-badge">
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
                              <span
                                v-if="parseInt($route.query.showButton) === 1"
                                class="badge-indicator"
                                :class="{
                                  zero: getConteoSolicitudes(actividad.id, null).creados === 0,
                                }"
                              >
                                {{ getConteoSolicitudes(actividad.id, null).creados }}
                              </span>
                            </div>
                          </template>
                        </v-tooltip>
                        <v-tooltip text="Validar Solicitud de Viaje" location="bottom">
                          <template v-slot:activator="{ props }">
                            <div class="btn-with-badge">
                              <v-btn
                                v-if="parseInt($route.query.showButton) === 1"
                                v-bind="props"
                                icon="mdi-thumb-up"
                                variant="text"
                                color="deep-purple"
                                size="small"
                                :disabled="
                                  getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos &&
                                  false
                                "
                                @click.stop="abrirDialogViajeValidar(actividad.id, null)"
                              ></v-btn>
                              <span
                                v-if="parseInt($route.query.showButton) === 1"
                                class="badge-indicator bottom"
                                :class="{
                                  zero: getConteoSolicitudes(actividad.id, null).aprobados === 0,
                                }"
                              >
                                {{ getConteoSolicitudes(actividad.id, null).aprobados }}
                              </span>
                            </div>
                          </template>
                        </v-tooltip>
                      </div>

                      <!-- Solicitud de Pago Directo -->
                      <div class="d-flex flex-column align-center justify-center">
                        <v-tooltip text="Solicitud de Pago Directo" location="top">
                          <template v-slot:activator="{ props }">
                            <div class="btn-with-badge">
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
                              <span
                                v-if="parseInt($route.query.showButton) === 1"
                                class="badge-indicator"
                                :class="{
                                  zero: getConteoSolicitudes(actividad.id, null).creados === 0,
                                }"
                              >
                                {{ getConteoSolicitudes(actividad.id, null).creados }}
                              </span>
                            </div>
                          </template>
                        </v-tooltip>
                        <v-tooltip text="Validar Solicitud de Pago Directo" location="bottom">
                          <template v-slot:activator="{ props }">
                            <div class="btn-with-badge">
                              <v-btn
                                v-if="parseInt($route.query.showButton) === 1"
                                v-bind="props"
                                icon="mdi-thumb-up"
                                variant="text"
                                color="teal-lighten-2"
                                size="small"
                                :disabled="
                                  getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos &&
                                  false
                                "
                                @click.stop="abrirDialogPagoDirectoValidar(actividad.id, null)"
                              ></v-btn>
                              <span
                                v-if="parseInt($route.query.showButton) === 1"
                                class="badge-indicator bottom"
                                :class="{
                                  zero: getConteoSolicitudes(actividad.id, null).aprobados === 0,
                                }"
                              >
                                {{ getConteoSolicitudes(actividad.id, null).aprobados }}
                              </span>
                            </div>
                          </template>
                        </v-tooltip>
                      </div>

                      <!-- Solicitud de Reposición -->
                      <div class="d-flex flex-column align-center justify-center">
                        <v-tooltip text="Solicitud de Reposición" location="top">
                          <template v-slot:activator="{ props }">
                            <div class="btn-with-badge">
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
                              <span
                                v-if="parseInt($route.query.showButton) === 1"
                                class="badge-indicator"
                                :class="{
                                  zero: getConteoSolicitudes(actividad.id, null).creados === 0,
                                }"
                              >
                                {{ getConteoSolicitudes(actividad.id, null).creados }}
                              </span>
                            </div>
                          </template>
                        </v-tooltip>
                        <v-tooltip text="Validar Solicitud de Reposición" location="bottom">
                          <template v-slot:activator="{ props }">
                            <div class="btn-with-badge">
                              <v-btn
                                v-if="parseInt($route.query.showButton) === 1"
                                v-bind="props"
                                icon="mdi-thumb-up"
                                variant="text"
                                color="warning"
                                size="small"
                                :disabled="
                                  getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos &&
                                  false
                                "
                                @click.stop="abrirDialogReposicionValidar(actividad.id, null)"
                              ></v-btn>
                              <span
                                v-if="parseInt($route.query.showButton) === 1"
                                class="badge-indicator bottom"
                                :class="{
                                  zero: getConteoSolicitudes(actividad.id, null).aprobados === 0,
                                }"
                              >
                                {{ getConteoSolicitudes(actividad.id, null).aprobados }}
                              </span>
                            </div>
                          </template>
                        </v-tooltip>
                      </div>

                      <!-- Rendición de cuentas -->
                      <div class="d-flex flex-column align-center justify-center">
                        <v-tooltip text="Rendición de Cuentas" location="top">
                          <template v-slot:activator="{ props }">
                            <div class="btn-with-badge">
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
                              <span
                                v-if="parseInt($route.query.showButton) === 2"
                                class="badge-indicator"
                                :class="{
                                  zero: getConteoSolicitudes(actividad.id, null).creados === 0,
                                }"
                              >
                                {{ getConteoSolicitudes(actividad.id, null).creados }}
                              </span>
                            </div>
                          </template>
                        </v-tooltip>
                        <v-tooltip text="Validar Rendición de Cuentas" location="bottom">
                          <template v-slot:activator="{ props }">
                            <div class="btn-with-badge">
                              <v-btn
                                v-if="parseInt($route.query.showButton) === 2"
                                v-bind="props"
                                icon="mdi-thumb-up"
                                variant="text"
                                color="error"
                                size="small"
                                @click.stop="abrirDialogRendicionValidar(actividad.id, null)"
                              ></v-btn>
                              <span
                                v-if="parseInt($route.query.showButton) === 2"
                                class="badge-indicator bottom"
                                :class="{
                                  zero: getConteoSolicitudes(actividad.id, null).aprobados === 0,
                                }"
                              >
                                {{ getConteoSolicitudes(actividad.id, null).aprobados }}
                              </span>
                            </div>
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

                <!-- Tarjeta de detalles desplegable (TAREAS) -->
                <v-expand-transition>
                  <div v-if="expandedActividadId === actividad.id">
                    <v-list-item :value="`detalle-${actividad.id}`" class="mb-2">
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
                                <v-icon :color="getStatusColorTarea(tarea.estado)"
                                  >mdi-checkbox-blank-circle</v-icon
                                >
                              </template>
                              <template v-slot:append>
                                <div class="d-flex">
                                  <!-- Solicitud de Fondos para TAREA -->
                                  <div class="d-flex flex-column align-center justify-center">
                                    <v-tooltip text="Solicitud de Fondos SA" location="top">
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
                                      </template>
                                    </v-tooltip>
                                    <v-tooltip
                                      text="Validar Solicitud de Fondos SA"
                                      location="bottom"
                                    >
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
                                      </template>
                                    </v-tooltip>
                                  </div>

                                  <!-- Solicitud de Viaje para TAREA -->
                                  <div class="d-flex flex-column align-center justify-center">
                                    <v-tooltip text="Solicitud de Viaje SA" location="top">
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
                                    <v-tooltip
                                      text="Validar Solicitud de Viaje SA"
                                      location="bottom"
                                    >
                                      <template v-slot:activator="{ props }">
                                        <v-btn
                                          v-if="parseInt($route.query.showButton) === 1"
                                          v-bind="props"
                                          icon="mdi-thumb-up"
                                          variant="text"
                                          color="deep-purple"
                                          size="x-small"
                                          :disabled="
                                            getSolicitudFondosInfo(actividad.id)
                                              ?.bloquearIconosSolFondos && false
                                          "
                                          @click.stop="
                                            abrirDialogViajeValidar(actividad.id, tarea.id)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-tooltip>
                                  </div>

                                  <!-- Solicitud de Pago Directo para TAREA -->
                                  <div class="d-flex flex-column align-center justify-center">
                                    <v-tooltip text="Solicitud de Pago Directo SA" location="top">
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
                                    <v-tooltip
                                      text="Validar Solicitud de Pago Directo SA"
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
                                            getSolicitudFondosInfo(actividad.id)
                                              ?.bloquearIconosSolFondos && false
                                          "
                                          @click.stop="
                                            abrirDialogPagoDirectoValidar(actividad.id, tarea.id)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-tooltip>
                                  </div>

                                  <!-- Solicitud de Reposición para TAREA -->
                                  <div class="d-flex flex-column align-center justify-center">
                                    <v-tooltip text="Solicitud de Reposición SA" location="top">
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
                                    <v-tooltip
                                      text="Validar Solicitud de Reposición SA"
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
                                            abrirDialogReposicionValidar(actividad.id, tarea.id)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-tooltip>
                                  </div>

                                  <!-- Rendición de cuentas para TAREAS -->
                                  <div class="d-flex flex-column align-center justify-center">
                                    <v-tooltip
                                      :text="getRendicionText(actividad.id, tarea.id)"
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
                                          :to="`/monitoreo/formulario02/${actividad.id}?tarea_id=${tarea.id}`"
                                          @click.stop
                                        ></v-btn>
                                      </template>
                                    </v-tooltip>
                                    <v-tooltip
                                      text="Validar Rendición de Cuentas"
                                      location="bottom"
                                    >
                                      <template v-slot:activator="{ props }">
                                        <v-btn
                                          v-if="parseInt($route.query.showButton) === 2"
                                          v-bind="props"
                                          icon="mdi-thumb-up"
                                          variant="text"
                                          color="error"
                                          size="x-small"
                                          @click.stop="
                                            abrirDialogRendicionValidar(actividad.id, tarea.id)
                                          "
                                        ></v-btn>
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

                                  <v-divider vertical inset class="mx-1 my-1"></v-divider>

                                  <!-- Acciones de tarea (ORIGINALES) -->
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
                              <v-list-item-title class="text-grey text-caption"
                                >No hay Sub Actividades</v-list-item-title
                              >
                            </v-list-item>
                          </v-list>
                        </v-card-text>
                      </v-card>
                    </v-list-item>
                  </div>
                </v-expand-transition>
              </template>

              <v-list-item v-if="filteredActividades.length === 0 && !loading">
                <v-list-item-title class="text-grey"
                  >No se encontraron actividades</v-list-item-title
                >
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
          </template>

          <!-- ============================================ -->
          <!-- VISTA POR PROYECTOS                           -->
          <!-- ============================================ -->
          <template v-else>
            <div v-if="!loading">
              <v-select
                v-model="proyectoFiltroVista"
                :items="opcionesProyectos"
                label="Filtrar por proyecto"
                clearable
                variant="outlined"
                density="comfortable"
                class="mb-4"
                prepend-inner-icon="mdi-filter"
              ></v-select>

              <template v-for="proyecto in proyectosFiltrados" :key="proyecto.proyectoId">
                <div class="proyecto-group mb-4">
                  <v-card color="grey-lighten-3" elevation="1" class="mb-2">
                    <v-card-text class="py-3">
                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <h3 class="text-h6 mb-1">
                            <v-icon color="primary" class="mr-2">mdi-folder</v-icon>
                            {{ proyecto.proyectoCodigo }} - {{ proyecto.proyectoNombre }}
                          </h3>
                          <div class="d-flex gap-2 flex-wrap mt-1">
                            <v-chip size="x-small" color="primary" variant="tonal">
                              {{ proyecto.totalActividades }} actividades
                            </v-chip>
                            <v-chip size="x-small" color="success" variant="tonal">
                              Presupuesto: {{ formatCurrency(proyecto.presupuestoTotal) }}
                            </v-chip>
                            <v-chip
                              v-for="(cantidad, estado) in proyecto.estados"
                              :key="estado"
                              size="x-small"
                              :color="getStatusColor(estado)"
                              variant="tonal"
                            >
                              {{ getEstadoTexto(estado) }}: {{ cantidad }}
                            </v-chip>
                          </div>
                        </div>
                        <v-btn
                          variant="text"
                          size="small"
                          @click="toggleProyectoExpandido(proyecto.proyectoId)"
                        >
                          <v-icon>{{
                            proyectosExpandidos[proyecto.proyectoId] !== false
                              ? 'mdi-chevron-up'
                              : 'mdi-chevron-down'
                          }}</v-icon>
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>

                  <v-expand-transition>
                    <div v-if="proyectosExpandidos[proyecto.proyectoId] !== false">
                      <v-list class="py-0 ml-4">
                        <template v-for="actividad in proyecto.actividades" :key="actividad.id">
                          <v-list-item
                            :value="actividad.id"
                            @click="toggleExpanded(actividad.id)"
                            class="mb-2"
                          >
                            <template v-slot:prepend>
                              <v-avatar :color="getStatusColor(actividad.estado)" class="mr-4">
                                <v-icon dark>{{ getTipoIcon(actividad.estado) }}</v-icon>
                              </v-avatar>
                            </template>

                            <v-list-item-title class="font-weight-bold">
                              Código: {{ actividad.codigo }}
                            </v-list-item-title>

                            <!-- 🆕 NOMBRE CORTO -->
                            <v-list-item-subtitle>
                              <span class="text-body-2 font-weight-medium">
                                {{
                                  actividad.nombreCorto ||
                                  actividad.nombre_corto ||
                                  'Sin nombre corto'
                                }}
                              </span>
                            </v-list-item-subtitle>

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
                                <span
                                  >Fondos:
                                  {{ getProcedenciaTexto(actividad.procedencia_fondos) }}</span
                                >
                              </div>
                              <div class="text-caption mt-1">
                                Descripción: {{ actividad.descripcion }}
                              </div>
                              <div class="text-caption mt-1" v-if="actividad.fecha_programada">
                                <strong>Programada:</strong>
                                {{ formatDate(actividad.fecha_programada) }}
                                <span v-if="actividad.duracion"
                                  >(Duración: {{ actividad.duracion }} días)</span
                                >
                              </div>
                              <div class="text-caption mt-1" v-if="actividad.fecha_inicio">
                                <strong>Ejecución:</strong> {{ formatDate(actividad.fecha_inicio) }}
                                <span v-if="actividad.fecha_cierre"
                                  >a {{ formatDate(actividad.fecha_cierre) }}</span
                                >
                              </div>
                            </v-list-item-subtitle>

                            <!-- Iconos de acciones con badges (Vista proyectos) -->
                            <template v-slot:append>
                              <div class="d-flex align-center">
                                <div class="d-flex flex-column align-center justify-center">
                                  <v-tooltip text="Solicitud de Fondos" location="top">
                                    <template v-slot:activator="{ props }">
                                      <div class="btn-with-badge">
                                        <v-btn
                                          v-if="parseInt($route.query.showButton) === 1"
                                          v-bind="props"
                                          icon="mdi-cash-plus"
                                          variant="text"
                                          color="primary"
                                          size="small"
                                          :disabled="
                                            getSolicitudFondosInfo(actividad.id)
                                              ?.bloquearIconosSolFondos && false
                                          "
                                          :to="`/monitoreo/formulario01/${actividad.id}`"
                                          @click.stop
                                        ></v-btn>
                                        <span
                                          v-if="parseInt($route.query.showButton) === 1"
                                          class="badge-indicator"
                                          :class="{
                                            zero:
                                              getConteoSolicitudes(actividad.id, null).creados ===
                                              0,
                                          }"
                                        >
                                          {{ getConteoSolicitudes(actividad.id, null).creados }}
                                        </span>
                                      </div>
                                    </template>
                                  </v-tooltip>
                                  <v-tooltip text="Validar Solicitud de Fondos" location="bottom">
                                    <template v-slot:activator="{ props }">
                                      <div class="btn-with-badge">
                                        <v-btn
                                          v-if="parseInt($route.query.showButton) === 1"
                                          v-bind="props"
                                          icon="mdi-thumb-up"
                                          variant="text"
                                          color="primary"
                                          size="small"
                                          :disabled="
                                            getSolicitudFondosInfo(actividad.id)
                                              ?.bloquearIconosSolFondos && false
                                          "
                                          @click.stop="abrirDialogValidar(actividad.id, null)"
                                        ></v-btn>
                                        <span
                                          v-if="parseInt($route.query.showButton) === 1"
                                          class="badge-indicator bottom"
                                          :class="{
                                            zero:
                                              getConteoSolicitudes(actividad.id, null).aprobados ===
                                              0,
                                          }"
                                        >
                                          {{ getConteoSolicitudes(actividad.id, null).aprobados }}
                                        </span>
                                      </div>
                                    </template>
                                  </v-tooltip>
                                </div>

                                <div class="d-flex flex-column align-center justify-center">
                                  <v-tooltip text="Solicitud de Viaje" location="top">
                                    <template v-slot:activator="{ props }">
                                      <div class="btn-with-badge">
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
                                        <span
                                          v-if="parseInt($route.query.showButton) === 1"
                                          class="badge-indicator"
                                          :class="{
                                            zero:
                                              getConteoSolicitudes(actividad.id, null).creados ===
                                              0,
                                          }"
                                        >
                                          {{ getConteoSolicitudes(actividad.id, null).creados }}
                                        </span>
                                      </div>
                                    </template>
                                  </v-tooltip>
                                  <v-tooltip text="Validar Solicitud de Viaje" location="bottom">
                                    <template v-slot:activator="{ props }">
                                      <div class="btn-with-badge">
                                        <v-btn
                                          v-if="parseInt($route.query.showButton) === 1"
                                          v-bind="props"
                                          icon="mdi-thumb-up"
                                          variant="text"
                                          color="deep-purple"
                                          size="small"
                                          :disabled="
                                            getSolicitudFondosInfo(actividad.id)
                                              ?.bloquearIconosSolFondos && false
                                          "
                                          @click.stop="abrirDialogViajeValidar(actividad.id, null)"
                                        ></v-btn>
                                        <span
                                          v-if="parseInt($route.query.showButton) === 1"
                                          class="badge-indicator bottom"
                                          :class="{
                                            zero:
                                              getConteoSolicitudes(actividad.id, null).aprobados ===
                                              0,
                                          }"
                                        >
                                          {{ getConteoSolicitudes(actividad.id, null).aprobados }}
                                        </span>
                                      </div>
                                    </template>
                                  </v-tooltip>
                                </div>

                                <div class="d-flex flex-column align-center justify-center">
                                  <v-tooltip text="Solicitud de Pago Directo" location="top">
                                    <template v-slot:activator="{ props }">
                                      <div class="btn-with-badge">
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
                                        <span
                                          v-if="parseInt($route.query.showButton) === 1"
                                          class="badge-indicator"
                                          :class="{
                                            zero:
                                              getConteoSolicitudes(actividad.id, null).creados ===
                                              0,
                                          }"
                                        >
                                          {{ getConteoSolicitudes(actividad.id, null).creados }}
                                        </span>
                                      </div>
                                    </template>
                                  </v-tooltip>
                                  <v-tooltip
                                    text="Validar Solicitud de Pago Directo"
                                    location="bottom"
                                  >
                                    <template v-slot:activator="{ props }">
                                      <div class="btn-with-badge">
                                        <v-btn
                                          v-if="parseInt($route.query.showButton) === 1"
                                          v-bind="props"
                                          icon="mdi-thumb-up"
                                          variant="text"
                                          color="teal-lighten-2"
                                          size="small"
                                          :disabled="
                                            getSolicitudFondosInfo(actividad.id)
                                              ?.bloquearIconosSolFondos && false
                                          "
                                          @click.stop="
                                            abrirDialogPagoDirectoValidar(actividad.id, null)
                                          "
                                        ></v-btn>
                                        <span
                                          v-if="parseInt($route.query.showButton) === 1"
                                          class="badge-indicator bottom"
                                          :class="{
                                            zero:
                                              getConteoSolicitudes(actividad.id, null).aprobados ===
                                              0,
                                          }"
                                        >
                                          {{ getConteoSolicitudes(actividad.id, null).aprobados }}
                                        </span>
                                      </div>
                                    </template>
                                  </v-tooltip>
                                </div>

                                <div class="d-flex flex-column align-center justify-center">
                                  <v-tooltip text="Solicitud de Reposición" location="top">
                                    <template v-slot:activator="{ props }">
                                      <div class="btn-with-badge">
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
                                        <span
                                          v-if="parseInt($route.query.showButton) === 1"
                                          class="badge-indicator"
                                          :class="{
                                            zero:
                                              getConteoSolicitudes(actividad.id, null).creados ===
                                              0,
                                          }"
                                        >
                                          {{ getConteoSolicitudes(actividad.id, null).creados }}
                                        </span>
                                      </div>
                                    </template>
                                  </v-tooltip>
                                  <v-tooltip
                                    text="Validar Solicitud de Reposición"
                                    location="bottom"
                                  >
                                    <template v-slot:activator="{ props }">
                                      <div class="btn-with-badge">
                                        <v-btn
                                          v-if="parseInt($route.query.showButton) === 1"
                                          v-bind="props"
                                          icon="mdi-thumb-up"
                                          variant="text"
                                          color="warning"
                                          size="small"
                                          :disabled="
                                            getSolicitudFondosInfo(actividad.id)
                                              ?.bloquearIconosSolFondos && false
                                          "
                                          @click.stop="
                                            abrirDialogReposicionValidar(actividad.id, null)
                                          "
                                        ></v-btn>
                                        <span
                                          v-if="parseInt($route.query.showButton) === 1"
                                          class="badge-indicator bottom"
                                          :class="{
                                            zero:
                                              getConteoSolicitudes(actividad.id, null).aprobados ===
                                              0,
                                          }"
                                        >
                                          {{ getConteoSolicitudes(actividad.id, null).aprobados }}
                                        </span>
                                      </div>
                                    </template>
                                  </v-tooltip>
                                </div>

                                <div class="d-flex flex-column align-center justify-center">
                                  <v-tooltip text="Rendición de Cuentas" location="top">
                                    <template v-slot:activator="{ props }">
                                      <div class="btn-with-badge">
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
                                        <span
                                          v-if="parseInt($route.query.showButton) === 2"
                                          class="badge-indicator"
                                          :class="{
                                            zero:
                                              getConteoSolicitudes(actividad.id, null).creados ===
                                              0,
                                          }"
                                        >
                                          {{ getConteoSolicitudes(actividad.id, null).creados }}
                                        </span>
                                      </div>
                                    </template>
                                  </v-tooltip>
                                  <v-tooltip text="Validar Rendición de Cuentas" location="bottom">
                                    <template v-slot:activator="{ props }">
                                      <div class="btn-with-badge">
                                        <v-btn
                                          v-if="parseInt($route.query.showButton) === 2"
                                          v-bind="props"
                                          icon="mdi-thumb-up"
                                          variant="text"
                                          color="error"
                                          size="small"
                                          @click.stop="
                                            abrirDialogRendicionValidar(actividad.id, null)
                                          "
                                        ></v-btn>
                                        <span
                                          v-if="parseInt($route.query.showButton) === 2"
                                          class="badge-indicator bottom"
                                          :class="{
                                            zero:
                                              getConteoSolicitudes(actividad.id, null).aprobados ===
                                              0,
                                          }"
                                        >
                                          {{ getConteoSolicitudes(actividad.id, null).aprobados }}
                                        </span>
                                      </div>
                                    </template>
                                  </v-tooltip>
                                </div>

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
                        </template>
                      </v-list>
                    </div>
                  </v-expand-transition>
                </div>
              </template>

              <v-card v-if="proyectosFiltrados.length === 0" class="text-center py-8">
                <v-card-text class="text-grey"
                  >No se encontraron proyectos con actividades</v-card-text
                >
              </v-card>
            </div>
          </template>
        </v-card>
      </v-col>

      <!-- Columna lateral de estadísticas -->
      <v-col cols="12" md="3" lg="3">
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
                totalActividadesMostradas
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="yellow">mdi-calendar-question</v-icon>
              </template>
              <v-list-item-title>Reprogramación</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{
                countByStatus('REPROG')
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="light-blue">mdi-calendar-edit</v-icon>
              </template>
              <v-list-item-title>Planificación</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{
                countByStatus('PLAN')
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="orange">mdi-progress-clock</v-icon>
              </template>
              <v-list-item-title>En Ejecución</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{
                countByStatus('EJEC')
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="green">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>Finalizado</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{
                countByStatus('FIN')
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card elevation="2" class="mt-4" v-if="modoVista === 'proyectos'">
          <v-card-title class="secondary white--text">
            <v-icon left>mdi-folder-multiple</v-icon>
            Proyectos
          </v-card-title>
          <v-list density="comfortable">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="secondary">mdi-folder</v-icon>
              </template>
              <v-list-item-title>Total proyectos</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{
                proyectosFiltrados.length
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- ============================================ -->
    <!-- DIÁLOGOS (ORIGINALES SIN CAMBIOS)              -->
    <!-- ============================================ -->
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
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="dialogValidarSolicitud" max-width="800">
      <v-card>
        <v-toolbar color="primary" title="Elige Solicitud de Fondos para Validar"></v-toolbar>
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
              <v-list-item-title class="font-weight-bold"
                >Formulario: {{ solicitudF.numeroFormulario }}</v-list-item-title
              >
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
              <v-list-item-title class="font-weight-bold"
                >Formulario: {{ solicitudF.numeroFormulario }}</v-list-item-title
              >
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
              <v-list-item-title class="font-weight-bold"
                >Formulario: {{ solicitudF.numeroFormulario }}</v-list-item-title
              >
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
              <v-list-item-title class="font-weight-bold"
                >Formulario: {{ solicitudF.numeroFormulario }}</v-list-item-title
              >
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
        <v-toolbar color="primary" title="Elige Solicitud de Reposicion para Validar"></v-toolbar>
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
              <v-list-item-title class="font-weight-bold"
                >Formulario: {{ solicitudF.numeroFormulario }}</v-list-item-title
              >
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
        <v-toolbar color="primary" title="Elige Solicitud de Viaje para Validar"></v-toolbar>
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
              <v-list-item-title class="font-weight-bold"
                >Formulario: {{ solicitudF.numeroFormulario }}</v-list-item-title
              >
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
        <v-toolbar color="primary" title="Elige Solicitud de Pago Directo para Validar"></v-toolbar>
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
              <v-list-item-title class="font-weight-bold"
                >Formulario: {{ solicitudF.numeroFormulario }}</v-list-item-title
              >
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
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { tareasServicios } from '@/modules/proyecto/services/tareasService'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useListaActividadStore } from '@/modules/proyecto/store/useListaActividadesStore'

const baseurl = import.meta.env.VITE_API_BASE
const router = useRouter()
const userStore = useUserStore()
const actividadesStore = useListaActividadStore()

const usuario = computed(() => ({
  nombre: userStore.usuario,
  role: userStore.rol,
}))

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

const solicitudesFondos = ref([])
const loadingSolicitudes = ref(false)

// 🆕 Cache de conteos por actividad/tarea
const conteosPorActividad = ref({})
const cargandoConteos = ref(false)

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

const currentPage = ref(1)
const itemsPerPage = ref(10)

const tareaDialog = ref(false)
const tareaForm = ref({ id: null, titulo: '', descripcion: '', estado: 'PEN' })
const actividadIdParaTarea = ref(null)
const isEditandoTarea = ref(false)
const tareaFormRef = ref(null)

const deleteTareaDialog = ref(false)
const tareaToDelete = ref(null)
const actividadIdParaEliminarTarea = ref(null)
const procedenciaFilter = ref(null)

const actividadIdParaValidar = ref(null)
const tareaIdParaValidar = ref(null)

const snackbar = ref({ show: false, text: '', color: 'success' })

// Variables para vista por proyectos
const modoVista = ref('plana')
const proyectosExpandidos = ref({})
const proyectoFiltroVista = ref(null)

const procedenciaFondos = [
  { value: 'PROY', text: 'Proyecto' },
  { value: 'PRESP', text: 'Presupuesto' },
  { value: 'NODEF', text: 'No Definido' },
]

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

// --- FUNCIONES AUXILIARES ---
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
  if (['PEN', 'EPROG', 'COMPL'].includes(estadoBackend)) return estadoBackend
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

const getEstadoTexto = (status) => {
  const estado = availableStatuses.find((s) => s.value === status)
  return estado ? estado.text : 'Desconocido'
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
  return new Date(dateString).toLocaleDateString('es-ES')
}

const mostrarSnackbar = (texto, color = 'success') => {
  snackbar.value = { show: true, text: texto, color: color }
}

// --- NAVEGACIÓN ---
const abrirFormulario011 = (idSolicitudF) => {
  const routeConfig = {
    path: `/monitoreo/formulario011/${actividadIdParaValidar.value}`,
    query: { solicitud_id: idSolicitudF },
  }
  if (tareaIdParaValidar.value !== null && tareaIdParaValidar.value !== undefined) {
    routeConfig.query.tarea_id = tareaIdParaValidar.value
  }
  router.push(routeConfig)
}

const abrirFormularioRendicionC = (idSolicitudF) => {
  router.push({
    path: `/monitoreo/formulario02/${actividadIdParaValidar.value}`,
    query: { solicitud_id: idSolicitudF },
  })
}

const abrirFormularioRendicionCuentasValidar = (idSolicitudF) => {
  const routeConfig = {
    path: `/monitoreo/formulario022/${actividadIdParaValidar.value}`,
    query: { solicitud_id: idSolicitudF },
  }
  if (tareaIdParaValidar.value !== null && tareaIdParaValidar.value !== undefined) {
    routeConfig.query.tarea_id = tareaIdParaValidar.value
  }
  router.push(routeConfig)
}

const abrirFormulario03 = (idSolicitudF) => {
  router.push({
    path: `/monitoreo/formulario03/${actividadIdParaValidar.value}`,
    query: { solicitud_id: idSolicitudF },
  })
}

const abrirFormularioReposicion = (idSolicitudF) => {
  const routeConfig = {
    path: `/monitoreo/formulario033/${actividadIdParaValidar.value}`,
    query: { solicitud_id: idSolicitudF },
  }
  if (tareaIdParaValidar.value !== null && tareaIdParaValidar.value !== undefined) {
    routeConfig.query.tarea_id = tareaIdParaValidar.value
  }
  router.push(routeConfig)
}

const abrirFormularioSolicitudDeViajeParaValidar = (idSolicitudF) => {
  const routeConfig = {
    path: `/monitoreo/formulario055/${actividadIdParaValidar.value}`,
    query: { solicitud_id: idSolicitudF },
  }
  if (tareaIdParaValidar.value !== null && tareaIdParaValidar.value !== undefined) {
    routeConfig.query.tarea_id = tareaIdParaValidar.value
  }
  router.push(routeConfig)
}

const abrirFormularioSolicitudDePagoDirectoParaValidar = (idSolicitudF) => {
  const routeConfig = {
    path: `/monitoreo/formulario088/${actividadIdParaValidar.value}`,
    query: { solicitud_id: idSolicitudF },
  }
  if (tareaIdParaValidar.value !== null && tareaIdParaValidar.value !== undefined) {
    routeConfig.query.tarea_id = tareaIdParaValidar.value
  }
  router.push(routeConfig)
}

// --- DIÁLOGOS DE VALIDACIÓN ---
const abrirDialogValidar = async (actividadId, tareaId) => {
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  solicitudSeleccionada.value = getSolicitudFondosInfo(actividadId, tareaId)
  try {
    await cargarDatos()
    if (datosFormulario.value) await cargarSolicitudFondos()
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error)
    mostrarSnackbar('Error al cargar datos iniciales', 'error')
  }
  dialogValidarSolicitud.value = true
}

const abrirDialogRendicionValidar = async (actividadId, tareaId) => {
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  solicitudSeleccionada.value = getSolicitudFondosInfo(actividadId, tareaId)
  try {
    await cargarDatos()
    if (datosFormulario.value) await cargarRendicionesDeCuenta()
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error)
    mostrarSnackbar('Error al cargar datos iniciales', 'error')
  }
  dialogRendicionCuentasValidar.value = true
}

const abrirDialogReposicionValidar = async (actividadId, tareaId) => {
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  solicitudSeleccionada.value = getSolicitudFondosInfo(actividadId, tareaId)
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

const abrirDialogViajeValidar = async (actividadId, tareaId = null) => {
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  solicitudSeleccionada.value = getSolicitudFondosInfo(actividadId, tareaId)
  await cargarSolicitudDeViaje()
  dialogViajeValidar.value = true
}

const abrirDialogPagoDirectoValidar = async (actividadId, tareaId) => {
  actividadIdParaValidar.value = actividadId
  tareaIdParaValidar.value = tareaId
  solicitudSeleccionada.value = getSolicitudFondosInfo(actividadId, tareaId)
  await cargarSolicitudDePagoDirecto()
  dialogPagoDirectoValidar.value = true
}

// --- CARGA DE DATOS ---
onMounted(async () => {
  await cargar()
})

const cargar = async () => {
  loading.value = true
  try {
    await Promise.all([
      actividadesTareas(),
      cargarSolicitudesFondos(),
      actividadesStore.cargarActividadesTareas(),
    ])
    actividades.value = actividadesStore.actividadesFiltradas
    emptyResponse.value = actividades.value.length === 0

    // Inicializar proyectos cerrados
    if (actividadesStore.actividadesPorProyecto) {
      actividadesStore.actividadesPorProyecto.forEach((p) => {
        proyectosExpandidos.value[p.proyectoId] = false
      })
    }

    // 🆕 Cargar conteos en segundo plano
    if (!emptyResponse.value) {
      cargarConteosSolicitudes()
    }
  } catch (error) {
    console.error('Error al cargar datos:', error)
    actividades.value = []
    emptyResponse.value = true
    mostrarSnackbar('Error al cargar datos: ' + (error.message || 'Error desconocido'), 'error')
  } finally {
    loading.value = false
  }
}

const cargarSolicitudesFondos = async () => {
  loadingSolicitudes.value = true
  try {
    const response = await fetch(baseurl + 'api/solicitud-fondos/', {
      method: 'GET',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
    solicitudesFondos.value = await response.json()
  } catch (error) {
    console.error('Error con fetch:', error)
  } finally {
    loadingSolicitudes.value = false
  }
}

// 🆕 CARGAR CONTEOS DE SOLICITUDES
const cargarConteosSolicitudes = async () => {
  if (!actividades.value || !actividades.value.length) return

  cargandoConteos.value = true

  try {
    // Procesar en lotes para no saturar el servidor
    for (const actividad of actividades.value) {
      try {
        // Cargar conteos para la actividad (sin tarea)
        const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudFondos/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_actividad: actividad.id,
            id_tarea: null,
            usuario: usuario.value.nombre,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const solicitudes = data.solicitudes || []

          conteosPorActividad.value[actividad.id] = {
            creados: solicitudes.length,
            aprobados: solicitudes.filter(
              (s) => s.validacionResponsable === true && s.validacionCoordinador === true,
            ).length,
          }
        }

        // Cargar conteos para cada tarea de la actividad
        if (actividad.tareas && actividad.tareas.length > 0) {
          for (const tarea of actividad.tareas) {
            try {
              const respTarea = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudFondos/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id_actividad: actividad.id,
                  id_tarea: tarea.id,
                  usuario: usuario.value.nombre,
                }),
              })

              if (respTarea.ok) {
                const dataTarea = await respTarea.json()
                const solicitudesTarea = dataTarea.solicitudes || []

                const key = `${actividad.id}_${tarea.id}`
                conteosPorActividad.value[key] = {
                  creados: solicitudesTarea.length,
                  aprobados: solicitudesTarea.filter(
                    (s) => s.validacionResponsable === true && s.validacionCoordinador === true,
                  ).length,
                }
              }
            } catch (err) {
              console.error(`Error conteo tarea ${tarea.id}:`, err)
            }
          }
        }
      } catch (err) {
        console.error(`Error conteo actividad ${actividad.id}:`, err)
      }
    }
  } finally {
    cargandoConteos.value = false
  }
}

// 🆕 OBTENER CONTEOS CACHEADOS
const getConteoSolicitudes = (actividadId, tareaId = null) => {
  const key = tareaId !== null ? `${actividadId}_${tareaId}` : actividadId
  return conteosPorActividad.value[key] || { creados: 0, aprobados: 0 }
}

const getSolicitudFondosInfo = (actividadId, tareaId = null) => {
  if (!solicitudesFondos.value.length) return null
  return (
    solicitudesFondos.value.find((sf) => {
      const matchActividad = sf.actividad === actividadId
      const matchTarea = tareaId ? sf.tarea === tareaId : true
      return matchActividad && matchTarea
    }) || null
  )
}

const getRendicionText = (actividadId, tareaId = null) => {
  const solicitud = getSolicitudFondosInfo(actividadId, tareaId)
  return solicitud?.numeroFormulario
    ? `Rendición de Cuentas (${solicitud.numeroFormulario})`
    : 'Rendición de Cuentas - Pendiente solicitud'
}

// --- FUNCIONES DE CARGA DE FORMULARIOS ---
async function cargarDatos() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + 'api/monitoreo/obtener-datos-formulario/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    datosFormulario.value = strictSanitizeData(await response.json())
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
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`)
    const data = await response.json()
    const solicitudesFiltradas = data.solicitudes.filter((solicitud) => {
      return (
        solicitud.actividad_id === actividadIdParaValidar.value &&
        solicitud.tarea_id === tareaIdParaValidar.value
      )
    })
    datosFormulario1.value = { estado: 'exito', solicitudes: solicitudesFiltradas }
    const solicitudesFiltradasParaRC = data.solicitudes.filter((solicitud) => {
      return (
        solicitud.actividad_id === actividadIdParaValidar.value &&
        solicitud.tarea_id === tareaIdParaValidar.value &&
        solicitud.validacionResponsable === true &&
        solicitud.validacionCoordinador === true
      )
    })
    datosFormularioRC.value = { estado: 'exito', solicitudes: solicitudesFiltradasParaRC }
  } catch (err) {
    error.value = err.message
    console.error('Error al cargar solicitudes:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

function sanitizeData(data) {
  if (data === null || data === undefined) return ''
  if (typeof data === 'string') return data.trim() || ''
  if (typeof data === 'number') return isFinite(data) ? data : 0
  if (typeof data === 'boolean') return data
  if (Array.isArray(data))
    return data
      .map(sanitizeData)
      .filter((item) => item !== null && item !== undefined && item !== '')
  if (typeof data === 'object') {
    const sanitized = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key]
        if (value !== null && value !== undefined && value !== '')
          sanitized[key] = sanitizeData(value)
      }
    }
    return sanitized
  }
  return ''
}

function strictSanitizeData(data) {
  const sanitized = sanitizeData(data)
  if (
    typeof sanitized === 'object' &&
    !Array.isArray(sanitized) &&
    Object.keys(sanitized).length === 0
  )
    return ''
  return sanitized
}

async function cargarRendicionesDeCuenta() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerRendicionDeCuentas/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const solicitudesFiltradas = rawData.rendiciones.filter((solicitud) => {
      return (
        solicitud.actividad_id === actividadIdParaValidar.value &&
        solicitud.tarea_id === tareaIdParaValidar.value
      )
    })
    datosFormularioValidarRC.value = { rendiciones: solicitudesFiltradas }
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
      headers: { 'Content-Type': 'application/json' },
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
    const solicitudesFiltradas = rawData.solicitudes.filter((solicitud) => {
      return (
        solicitud.actividad_id === actividadIdParaValidar.value &&
        solicitud.tarea_id === tareaIdParaValidar.value
      )
    })
    datosFormularioValidarSR.value = { estado: 'exito', solicitudes: solicitudesFiltradas }
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
      headers: { 'Content-Type': 'application/json' },
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
    listaSolicitudesDeViaje.value = strictSanitizeData(
      rawData.solicitudes.filter((solicitud) => {
        return (
          solicitud.actividad_id === actividadIdParaValidar.value &&
          solicitud.tarea_id === tareaIdParaValidar.value
        )
      }),
    )
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
      headers: { 'Content-Type': 'application/json' },
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
    listaSolicitudesDePagoDirecto.value = strictSanitizeData(
      rawData.solicitudes.filter((solicitud) => {
        return (
          solicitud.actividad_id === actividadIdParaValidar.value &&
          solicitud.tarea_id === tareaIdParaValidar.value
        )
      }),
    )
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

// --- FILTROS Y PAGINACIÓN ---
const filteredActividades = computed(() => {
  if (!Array.isArray(actividades.value)) return []
  let filtered = [...actividades.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (actividad) =>
        (actividad.codigo && actividad.codigo.toLowerCase().includes(query)) ||
        (actividad.descripcion && actividad.descripcion.toLowerCase().includes(query)),
    )
  }
  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((actividad) => statusFilters.value.includes(actividad.estado))
  }
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
  return filteredActividades.value.slice(start, start + itemsPerPage.value)
})

const actividadesPaginadasOrdenadas = computed(() => {
  if (!Array.isArray(actividadesPaginadas.value)) return []
  return [...actividadesPaginadas.value].sort((a, b) => b.id - a.id)
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

// --- CRUD TAREAS (ORIGINAL) ---
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
      actividad: actividadIdParaTarea.value,
    }
    let resultado
    if (isEditandoTarea.value) {
      resultado = await tareasServicios.update(tareaForm.value.id, tareaData)
      const actividad = actividades.value.find((a) => a.id === actividadIdParaTarea.value)
      if (actividad && actividad.tareas) {
        const tareaIndex = actividad.tareas.findIndex((t) => t.id === tareaForm.value.id)
        if (tareaIndex !== -1) {
          actividad.tareas[tareaIndex] = {
            ...resultado,
            estadoFrontend: mapEstadoBackendToFrontend(resultado.estado),
          }
        }
      }
      mostrarSnackbar('Tarea actualizada con éxito', 'success')
    } else {
      resultado = await tareasServicios.crear(tareaData)
      const actividad = actividades.value.find((a) => a.id === actividadIdParaTarea.value)
      if (actividad) {
        if (!actividad.tareas) actividad.tareas = []
        actividad.tareas.push({
          ...resultado,
          estadoFrontend: mapEstadoBackendToFrontend(resultado.estado),
        })
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
    if (tareaFormRef.value) tareaFormRef.value.reset()
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
    await tareasServicios.del(tareaToDelete.value.id)
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

// Funciones para vista por proyectos
const toggleProyectoExpandido = (proyectoId) => {
  proyectosExpandidos.value[proyectoId] =
    proyectosExpandidos.value[proyectoId] === false ? true : false
}

const opcionesProyectos = computed(() => {
  if (!actividadesStore.actividadesPorProyecto) return []
  return actividadesStore.actividadesPorProyecto.map((p) => ({
    title: `${p.proyectoCodigo} - ${p.proyectoNombre}`,
    value: p.proyectoId,
  }))
})

const proyectosFiltrados = computed(() => {
  let proyectos = actividadesStore.actividadesPorProyecto || []
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    proyectos = proyectos
      .map((p) => ({
        ...p,
        actividades: p.actividades.filter(
          (a) =>
            (a.codigo && a.codigo.toLowerCase().includes(query)) ||
            (a.descripcion && a.descripcion.toLowerCase().includes(query)),
        ),
      }))
      .filter((p) => p.actividades.length > 0)
  }
  if (statusFilters.value.length > 0) {
    proyectos = proyectos
      .map((p) => ({
        ...p,
        actividades: p.actividades.filter((a) => statusFilters.value.includes(a.estado)),
      }))
      .filter((p) => p.actividades.length > 0)
  }
  if (proyectoFiltroVista.value) {
    proyectos = proyectos.filter((p) => p.proyectoId === proyectoFiltroVista.value)
  }
  return proyectos.map((p) => ({
    ...p,
    totalActividades: p.actividades.length,
    presupuestoTotal: p.actividades.reduce((sum, a) => sum + Number(a.presupuesto || 0), 0),
    estados: p.actividades.reduce((acc, a) => {
      acc[a.estado] = (acc[a.estado] || 0) + 1
      return acc
    }, {}),
  }))
})

const totalActividadesMostradas = computed(() => {
  if (modoVista.value === 'plana') return filteredActividades.value.length
  return proyectosFiltrados.value.reduce((sum, p) => sum + p.totalActividades, 0)
})
</script>
<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.proyecto-group {
  border-left: 3px solid var(--v-primary-base);
  padding-left: 8px;
}

/* 🆕 Badges para indicadores de solicitudes */
.badge-indicator {
  position: absolute;
  top: -4px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: #1976d2;
  color: white;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
  pointer-events: none;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.badge-indicator.bottom {
  top: auto;
  bottom: -4px;
  background: #4caf50;
}

.badge-indicator.zero {
  background: #9e9e9e;
  opacity: 0.7;
}

.btn-with-badge {
  position: relative;
  display: inline-flex;
}
</style>
