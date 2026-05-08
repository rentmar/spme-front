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
        <v-icon size="64" color="grey-lighten-1">mdi-calendar-remove</v-icon>
        <h3 class="text-h5 mt-4">No hay actividades registradas</h3>
      </v-card-text>
    </v-card>

    <!-- ✅ NUEVO: Barra de herramientas para agrupación -->
    <v-card v-if="!emptyResponse && !loading" class="mb-4" elevation="2" rounded="lg">
      <v-card-text class="pa-3">
        <div class="d-flex align-center justify-space-between flex-wrap gap-3">
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-group</v-icon>
            <span class="text-subtitle-2 font-weight-medium">Vista de Actividades</span>
          </div>

          <v-btn-toggle
            v-model="agrupacionSeleccionada"
            mandatory
            divided
            density="comfortable"
            color="primary"
          >
            <v-btn value="ninguna" size="small">
              <v-icon left size="18">mdi-format-list-bulleted</v-icon>
              Lista
            </v-btn>
            <v-btn value="proyecto" size="small">
              <v-icon left size="18">mdi-folder-group</v-icon>
              Por Proyecto
            </v-btn>
            <v-btn value="responsable" size="small">
              <v-icon left size="18">mdi-account-group</v-icon>
              Por Responsable
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- Estadísticas cuando está agrupado -->
        <div v-if="agrupacionSeleccionada !== 'ninguna'" class="mt-3">
          <v-divider class="mb-3"></v-divider>
          <div class="d-flex flex-wrap gap-3 align-center">
            <v-chip size="x-small" color="primary" variant="tonal">
              <v-icon left size="14">mdi-folder-multiple</v-icon>
              {{ datosAgrupados.length }} grupos
            </v-chip>
            <v-chip size="x-small" color="info" variant="tonal">
              <v-icon left size="14">mdi-playlist-check</v-icon>
              {{ totalActividadesAgrupadas }} actividades
            </v-chip>
            <v-chip size="x-small" color="success" variant="tonal">
              <v-icon left size="14">mdi-cash</v-icon>
              {{ formatCurrency(presupuestoTotalAgrupado) }}
            </v-chip>

            <v-spacer></v-spacer>

            <v-btn size="x-small" variant="text" color="primary" @click="expandirTodos">
              <v-icon left size="16">mdi-arrow-expand-all</v-icon>
              Expandir todo
            </v-btn>
            <v-btn size="x-small" variant="text" color="secondary" @click="colapsarTodos">
              <v-icon left size="16">mdi-arrow-collapse-all</v-icon>
              Colapsar todo
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- ✅ VISTA AGRUPADA POR PROYECTO -->
    <div v-if="!emptyResponse && !loading && agrupacionSeleccionada === 'proyecto'">
      <GrupoProyecto
        v-for="grupo in proyectosFiltrados"
        :key="`proyecto-${grupo.proyectoId}`"
        :proyecto="grupo"
        :expandido="gruposExpandidos[`proyecto-${grupo.proyectoId}`] || false"
        @toggle="toggleGrupo(`proyecto-${grupo.proyectoId}`)"
        @ver-actividad="toggleExpanded"
        @add-tarea="openTareaDialog"
        @edit-tarea="(payload) => openTareaDialog(payload.actividadId, payload.tarea)"
        @delete-tarea="(payload) => confirmDeleteTarea(payload.actividadId, payload.tarea)"
        @ver-informe-tarea="irInformeSubactividad"
      />
    </div>

    <!-- ✅ VISTA AGRUPADA POR RESPONSABLE -->
    <div v-if="!emptyResponse && !loading && agrupacionSeleccionada === 'responsable'">
      <GrupoResponsable
        v-for="grupo in responsablesFiltrados"
        :key="`resp-${grupo.responsableId}`"
        :responsable="grupo"
        :expandido="gruposExpandidos[`resp-${grupo.responsableId}`] || false"
        @toggle="toggleGrupo(`resp-${grupo.responsableId}`)"
        @ver-actividad="toggleExpanded"
        @add-tarea="openTareaDialog"
        @edit-tarea="(payload) => openTareaDialog(payload.actividadId, payload.tarea)"
        @delete-tarea="(payload) => confirmDeleteTarea(payload.actividadId, payload.tarea)"
        @ver-informe-tarea="irInformeSubactividad"
      />
    </div>

    <!-- ✅ VISTA TRADICIONAL SIN AGRUPAR (CÓDIGO ORIGINAL) -->
    <v-row v-if="!emptyResponse && !loading && agrupacionSeleccionada === 'ninguna'">
      <!-- Columna principal -->
      <v-col cols="12" md="9" lg="9">
        <v-card class="pa-4 tarjeta-principal" elevation="2" rounded="lg">
          <v-card-title class="d-flex justify-space-between align-center px-0 pt-0">
            <div class="d-flex align-center">
              <v-icon color="primary" size="28" class="mr-2">mdi-format-list-bulleted</v-icon>
              <span class="text-h6 font-weight-medium">Lista de Actividades</span>
            </div>
            <span class="text-caption text-grey px-2 py-1 bg-grey-lighten-4 rounded">
              Total: {{ filteredActividades.length }}
            </span>
          </v-card-title>

          <!-- Buscador y filtros -->
          <v-card-text class="pt-4 pb-4 px-0">
            <v-text-field
              v-model="searchQuery"
              label="Buscar actividades (por código, nombre o descripción)"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              density="comfortable"
              bg-color="grey-lighten-4"
              hide-details
              class="mb-4"
              @update:model-value="handleSearchInput"
            ></v-text-field>

            <div class="d-flex flex-wrap gap-2">
              <v-chip-group v-model="statusFilters" multiple column>
                <v-chip
                  v-for="status in availableStatuses"
                  :key="status.value"
                  :value="status.value"
                  filter
                  :color="getStatusColor(status.value)"
                  variant="outlined"
                  size="small"
                >
                  {{ status.text }}
                </v-chip>
              </v-chip-group>
            </div>
          </v-card-text>

          <v-divider class="my-2"></v-divider>

          <v-list v-if="!loading" class="py-0" lines="two">
            <template
              v-for="(actividad, index) in actividadesPaginadasOrdenadas"
              :key="`actividad-${actividad.id}-${index}`"
            >
              <v-list-item
                :value="actividad.id"
                @click="toggleExpanded(actividad.id)"
                class="mb-2 actividad-item rounded-lg"
                :class="{ 'actividad-expandida': expandedActividadId === actividad.id }"
              >
                <template v-slot:prepend>
                  <div
                    @mouseenter="mostrarPopupActividad(actividad, $event)"
                    @mouseleave="ocultarPopupActividad"
                    style="display: inline-block"
                  >
                    <v-avatar :color="getStatusColor(actividad.estado)" size="40" class="mr-3">
                      <v-icon size="20" dark>{{ getTipoIcon(actividad.estado) }}</v-icon>
                    </v-avatar>
                  </div>
                </template>

                <v-list-item-title class="font-weight-medium d-flex align-center">
                  <v-chip
                    v-if="actividad.pei_id"
                    color="green"
                    size="x-small"
                    class="mr-2"
                    variant="flat"
                  >
                    PEI
                  </v-chip>
                  <v-chip v-else color="blue" size="x-small" class="mr-2" variant="flat">
                    PROYECTO
                  </v-chip>

                  <span class="text-truncate"
                    >{{ actividad.codigo }} - {{ actividad.nombreCorto }}</span
                  >
                </v-list-item-title>

                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap gap-2">
                    <v-chip
                      size="x-small"
                      :color="getStatusColor(actividad.estado)"
                      text-color="white"
                      class="mr-1"
                    >
                      {{ actividad.estado }}
                    </v-chip>

                    <span class="text-caption text-medium-emphasis">
                      <v-icon size="14" class="mr-1">mdi-cash</v-icon>
                      {{ formatCurrency(actividad.presupuesto) }}
                    </span>

                    <span
                      v-if="actividad.responsable_info"
                      class="text-caption text-medium-emphasis"
                    >
                      <v-icon size="14" class="mr-1">mdi-account</v-icon>
                      {{ actividad.responsable_info.nombre_completo }}
                    </span>
                  </div>

                  <div class="text-caption text-grey mt-1" v-if="actividad.descripcion">
                    {{ truncarTexto(actividad.descripcion, 100) }}
                  </div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex acciones-container">
                    <v-tooltip text="Informe de Actividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-file-document-outline"
                          variant="text"
                          color="primary"
                          size="small"
                          @click.stop="irInformeActividad(actividad.id, actividad.pei_id)"
                          class="accion-btn"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Ver Informe de Actividad/Subactividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-file-document-multiple-outline"
                          variant="text"
                          color="cyan"
                          size="small"
                          :to="
                            actividad.pei_id
                              ? `/monitoreo/informes-actividad-subactividad-pei/${actividad.id}`
                              : `/monitoreo/informes-actividad-subactividad/${actividad.id}`
                          "
                          @click.stop
                          class="accion-btn"
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <!-- Tarjeta de detalles desplegable -->
              <v-expand-transition>
                <div
                  v-if="expandedActividadId === actividad.id"
                  class="detalles-container ml-9 mt-2 mb-4"
                >
                  <v-card variant="outlined" rounded="lg" class="bg-grey-lighten-4">
                    <v-card-text class="pa-4">
                      <div class="d-flex justify-space-between align-center mb-3">
                        <span class="text-subtitle-2 font-weight-medium d-flex align-center">
                          <v-icon size="18" color="primary" class="mr-1">mdi-playlist-check</v-icon>
                          Subactividades de {{ actividad.codigo }}
                        </span>
                        <v-btn
                          color="primary"
                          variant="tonal"
                          size="small"
                          prepend-icon="mdi-plus"
                          @click.stop="openTareaDialog(actividad.id)"
                        >
                          Añadir Subactividad
                        </v-btn>
                      </div>

                      <v-list density="compact" class="py-0 bg-transparent">
                        <v-list-item
                          v-for="tarea in actividad.tareasOrdenadas"
                          :key="`tarea-${actividad.id}-${tarea.id}`"
                          class="subactividad-item mb-2 pa-3 rounded-lg"
                        >
                          <template v-slot:prepend>
                            <div class="position-relative">
                              <v-badge
                                :color="getStatusColorTarea(tarea.estado)"
                                dot
                                location="bottom end"
                                offset-x="-5"
                                offset-y="-5"
                              >
                                <v-avatar
                                  size="36"
                                  :color="getStatusColorTarea(tarea.estado) + ' lighten-4'"
                                >
                                  <v-icon size="18" :color="getStatusColorTarea(tarea.estado)">
                                    {{ getTareaIcon(tarea.estado) }}
                                  </v-icon>
                                </v-avatar>
                              </v-badge>
                            </div>
                          </template>

                          <v-list-item-title class="font-weight-medium mb-1">
                            <div class="d-flex align-center flex-wrap gap-2">
                              <span class="text-truncate" style="max-width: 250px">
                                {{ tarea.titulo || tarea.descripcion || 'Subactividad sin título' }}
                              </span>
                              <v-chip
                                v-if="tieneCodigoValido(tarea.codigo)"
                                size="x-small"
                                color="primary"
                                variant="outlined"
                                class="chip-codigo"
                              >
                                {{ formatearCodigo(tarea.codigo) }}
                              </v-chip>
                            </div>
                          </v-list-item-title>

                          <v-list-item-subtitle>
                            <div class="d-flex flex-wrap align-center gap-2 mt-1">
                              <v-chip
                                size="x-small"
                                :color="getStatusColorTarea(tarea.estado)"
                                text-color="white"
                              >
                                {{ getEstadoTareaDisplay(tarea.estado) }}
                              </v-chip>

                              <div class="d-flex align-center">
                                <span class="text-caption text-medium-emphasis d-flex align-center">
                                  <v-icon size="12" class="mr-1">mdi-cash</v-icon>
                                  {{ formatCurrency(tarea.presupuesto) }}
                                </span>

                                <div
                                  v-if="
                                    tarea.presupuestoDesglose !== null &&
                                    tarea.presupuestoDesglose !== undefined &&
                                    tarea.presupuestoDesglose.length > 0
                                  "
                                  class="d-flex align-center ml-2 desglose-badge"
                                >
                                  <v-icon
                                    size="16"
                                    color="info"
                                    class="desglose-icon"
                                    icon="mdi-cash-multiple"
                                  ></v-icon>
                                  <span class="text-caption font-weight-medium ml-1 text-info"
                                    >Con Desglose</span
                                  >

                                  <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                      <v-icon
                                        v-bind="props"
                                        size="14"
                                        color="grey"
                                        class="ml-1"
                                        icon="mdi-information-outline"
                                      ></v-icon>
                                    </template>
                                    <span>{{ getDesgloseTooltip(tarea.presupuestoDesglose) }}</span>
                                  </v-tooltip>
                                </div>
                              </div>

                              <span class="text-caption text-medium-emphasis">
                                <v-icon size="12" class="mr-1">mdi-calendar</v-icon>
                                {{ formatDate(tarea.fecha_creacion) }}
                              </span>

                              <span
                                v-if="tarea.fecha_limite"
                                class="text-caption"
                                :class="getDiasRestantesColor(tarea.fecha_limite)"
                              >
                                <v-icon size="12" class="mr-1">mdi-clock</v-icon>
                                {{ calcularDiasRestantes(tarea.fecha_limite) }}
                              </span>
                            </div>

                            <div v-if="tarea.descripcion" class="text-caption text-grey mt-1">
                              {{ truncarTexto(tarea.descripcion, 80) }}
                            </div>

                            <div
                              v-if="
                                tarea.presupuestoDesglose && tarea.presupuestoDesglose.length > 0
                              "
                              class="desglose-resumen mt-2"
                            >
                              <v-chip
                                size="x-small"
                                color="info"
                                variant="tonal"
                                prepend-icon="mdi-cash-multiple"
                                class="mt-1"
                              >
                                {{ tarea.presupuestoDesglose.length }} item(s) desglosados
                              </v-chip>
                            </div>
                          </v-list-item-subtitle>

                          <template v-slot:append>
                            <div class="d-flex acciones-container">
                              <v-tooltip text="Informe de Subactividad" location="top">
                                <template v-slot:activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    icon="mdi-file-document-outline"
                                    variant="text"
                                    color="info"
                                    size="x-small"
                                    :to="
                                      actividad.pei_id
                                        ? `/monitoreo/informe-subactividad-pei/${tarea.id}/`
                                        : `/monitoreo/informe-subactividad/${tarea.id}`
                                    "
                                    @click.stop
                                    class="accion-btn"
                                  ></v-btn>
                                </template>
                              </v-tooltip>

                              <v-tooltip text="Editar subactividad" location="top">
                                <template v-slot:activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    icon="mdi-pencil"
                                    variant="text"
                                    color="warning"
                                    size="x-small"
                                    @click.stop="openTareaDialog(actividad.id, tarea)"
                                    class="accion-btn"
                                  ></v-btn>
                                </template>
                              </v-tooltip>

                              <v-tooltip text="Eliminar Subactividad" location="top">
                                <template v-slot:activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    icon="mdi-delete"
                                    variant="text"
                                    color="error"
                                    size="x-small"
                                    @click.stop="confirmDeleteTarea(actividad.id, tarea)"
                                    class="accion-btn"
                                  ></v-btn>
                                </template>
                              </v-tooltip>
                            </div>
                          </template>
                        </v-list-item>

                        <div
                          v-if="!actividad.tareas || actividad.tareas.length === 0"
                          class="text-center py-4"
                        >
                          <v-icon size="40" color="grey-lighten-2" class="mb-2"
                            >mdi-playlist-remove</v-icon
                          >
                          <div class="text-caption text-grey">
                            No hay subactividades para esta actividad
                          </div>
                          <v-btn
                            color="primary"
                            variant="text"
                            size="small"
                            @click.stop="openTareaDialog(actividad.id)"
                            class="mt-2"
                          >
                            <v-icon left size="16">mdi-plus</v-icon>
                            Crear la primera subactividad
                          </v-btn>
                        </div>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expand-transition>
            </template>

            <div v-if="filteredActividades.length === 0 && !loading" class="text-center py-8">
              <v-icon size="48" color="grey-lighten-2" class="mb-3">mdi-file-search-outline</v-icon>
              <div class="text-body-1 text-grey">No se encontraron actividades</div>
            </div>
          </v-list>

          <!-- Paginación y controles -->
          <div v-if="filteredActividades.length > 0" class="mt-4">
            <v-pagination
              v-if="totalPages > 1"
              v-model="currentPage"
              :length="totalPages"
              :total-visible="7"
              size="small"
              class="mb-3"
            ></v-pagination>

            <div class="d-flex align-center justify-space-between">
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
                hide-details
              ></v-select>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Columna lateral -->
      <v-col cols="12" md="3" lg="3">
        <!-- Tarjeta de estadísticas -->
        <v-card elevation="2" rounded="lg" class="mb-4 tarjeta-lateral tarjeta-flotante">
          <v-card-item class="pa-4">
            <template v-slot:prepend>
              <v-icon color="primary" size="24">mdi-chart-box</v-icon>
            </template>
            <v-card-title class="text-subtitle-1 font-weight-medium pa-0"
              >Estadísticas</v-card-title
            >
          </v-card-item>

          <v-divider></v-divider>

          <v-list density="compact" class="py-1">
            <v-list-item v-for="stat in estadisticas" :key="stat.label" class="stat-item">
              <template v-slot:prepend>
                <v-icon :color="stat.color" size="18">{{ stat.icon }}</v-icon>
              </template>
              <v-list-item-title class="text-body-2">{{ stat.label }}</v-list-item-title>
              <template v-slot:append>
                <v-chip size="x-small" :color="stat.color" variant="tonal">{{ stat.value }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Tarjeta de validaciones -->
        <v-card elevation="2" rounded="lg" class="tarjeta-validaciones tarjeta-flotante">
          <v-card-item class="pa-4">
            <template v-slot:prepend>
              <v-avatar :color="totalPendientes > 0 ? 'warning' : 'success'" size="32">
                <v-icon size="18" color="white">mdi-bell-ring</v-icon>
              </v-avatar>
            </template>
            <v-card-title class="text-subtitle-1 font-weight-medium pa-0">
              Validaciones Pendientes
            </v-card-title>
            <template v-slot:append>
              <v-chip
                :color="totalPendientes > 0 ? 'warning' : 'success'"
                text-color="white"
                size="small"
              >
                {{ totalPendientes }}
              </v-chip>
            </template>
          </v-card-item>

          <v-card-text class="pa-4 pt-0">
            <div class="d-flex gap-2 mb-4">
              <v-chip size="small" color="warning" variant="tonal" class="flex-grow-1">
                <span class="font-weight-bold mr-1">{{ totalPendientes }}</span> Pendientes
              </v-chip>
              <v-chip size="small" color="success" variant="tonal" class="flex-grow-1">
                <span class="font-weight-bold mr-1">{{ totalAprobados }}</span> Aprobados
              </v-chip>
              <v-chip size="small" color="error" variant="tonal" class="flex-grow-1">
                <span class="font-weight-bold mr-1">{{ totalRechazados }}</span> Rechazados
              </v-chip>
            </div>

            <div v-if="ultimasValidaciones.length > 0">
              <div class="text-caption font-weight-medium text-grey mb-2">ÚLTIMAS ASIGNACIONES</div>
              <v-list density="compact" class="pa-0 bg-transparent">
                <v-list-item
                  v-for="val in ultimasValidaciones"
                  :key="val.id"
                  class="px-0 validacion-item"
                >
                  <template v-slot:prepend>
                    <v-avatar
                      size="28"
                      :color="getEstadoColor(val.estado) + '-lighten-4'"
                      class="mr-2"
                    >
                      <v-icon size="14" :color="getEstadoColor(val.estado)">
                        {{ getIconoEstado(val.estado) }}
                      </v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="text-caption">
                    {{ truncarTexto(val.informe_numero, 18) }}
                  </v-list-item-title>

                  <v-list-item-subtitle class="text-caption text-grey">
                    {{ formatDateCorta(val.fechaAsignacion) }}
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <v-chip :color="getEstadoColor(val.estado)" size="x-small" variant="tonal">
                      {{ val.estado_display }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </div>

            <div v-else class="text-center py-2">
              <v-icon size="32" color="grey-lighten-2" class="mb-1">mdi-bell-off</v-icon>
              <div class="text-caption text-grey">Sin validaciones pendientes</div>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-3">
            <v-btn
              block
              color="primary"
              variant="tonal"
              size="small"
              prepend-icon="mdi-eye-outline"
              @click="abrirDialogValidaciones"
              class="text-caption"
            >
              Ver todas mis validaciones
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de Tarea/Subactividad -->
    <DialogTarea
      v-model="tareaDialog"
      :actividad="actividadSeleccionada"
      :tarea="tareaSeleccionada"
      :cargando="cargandoTarea"
      @guardar="guardarTarea"
      @cancelar="cancelarTarea"
    />

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="deleteTareaDialog" max-width="400">
      <v-card rounded="lg">
        <v-card-title class="text-h6 pa-4">Confirmar eliminación</v-card-title>
        <v-card-text class="pa-4 pt-0">
          ¿Estás seguro de que deseas eliminar la subactividad?
          <div class="font-weight-medium mt-2">
            {{ tareaToDelete?.titulo || tareaToDelete?.descripcion || 'Sin título' }}
          </div>
          <v-alert v-if="tareaToDelete?.codigo" type="info" density="compact" class="mt-3">
            Código: {{ tareaToDelete.codigo }}
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteTareaDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="deleteTarea">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de validaciones -->
    <DialogValidaciones
      v-model="dialogValidaciones"
      :validaciones="storeActividad.misValidaciones?.results || []"
    />

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>

    <!-- Popup de actividad -->
    <PopupActividad
      :visible="popupVisible"
      :actividad-data="actividadPopup"
      :position-x="popupX"
      :position-y="popupY"
      @close="cerrarPopup"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useListaActividadStore } from '@/modules/proyecto/store/useListaActividadesStore'
import { useTareaSubactividad } from '@/modules/proyecto/composables/useTareaSubactividad'
import DialogTarea from '@/modules/actividades/components/DialogTarea.vue'
import { useRouter } from 'vue-router'
import DialogValidaciones from '@/modules/formularios/components/validadores/DialogValidaciones.vue'
import { useSnackbar } from '@/composables/useSnackbar'
import PopupActividad from '@/components/popups/PopupActividad.vue'
//COMPONENTES DE AGRUPACION
import GrupoProyecto from '@/modules/proyecto/components/partials/GrupoProyecto.vue'
import GrupoResponsable from '@/modules/proyecto/components/partials/GrupoResponsable.vue'

// Iniciar el store de actividades
const storeActividad = useListaActividadStore()

// Iniciar el composable de mensajes
const { successMsg, errorMsg } = useSnackbar()

// Iniciar el composable de Subactividades
const { crearUnaTarea, actualizarUnaTarea, eliminarUnaTarea } = useTareaSubactividad()

// Router
const router = useRouter()

// --- ESTADOS REACTIVOS ---
const loading = ref(true)
const emptyResponse = ref(false)
const actividades = ref([])
const searchQuery = ref('')
const statusFilters = ref([])
const expandedActividadId = ref(null)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Diálogos y formularios de tareas
const tareaDialog = ref(false)
const actividadSeleccionada = ref(null)
const tareaSeleccionada = ref(null)
const cargandoTarea = ref(false)

// Diálogos de eliminación
const deleteTareaDialog = ref(false)
const tareaToDelete = ref(null)
const actividadIdParaEliminarTarea = ref(null)

// Notificaciones
const snackbar = ref({ show: false, text: '', color: 'success' })

// Diálogo de validaciones
const dialogValidaciones = ref(false)

// ✅ NUEVOS ESTADOS PARA AGRUPACIÓN
const agrupacionSeleccionada = ref('ninguna')
const gruposExpandidos = ref({})

// Popup
const popupVisible = ref(false)
const actividadPopup = ref(null)
const popupX = ref(0)
const popupY = ref(0)
let popupTimeoutId = null

// Estados disponibles para actividades y tareas
const availableStatuses = [
  { value: 'CRD', text: 'Creada' },
  { value: 'PLAN', text: 'Planificada' },
  { value: 'RETR', text: 'Retraso' },
  { value: 'REPROG', text: 'Reprogramación' },
  { value: 'EJEC', text: 'En Ejecución' },
  { value: 'REP', text: 'En Reporte' },
  { value: 'FIN', text: 'Finalizado' },
]

// --- DEBOUNCE PARA BÚSQUEDA ---
const debouncedSearch = useDebounceFn((query) => {
  console.log('Buscando:', query)
  currentPage.value = 1
}, 300)

const handleSearchInput = (value) => {
  searchQuery.value = value || ''
  debouncedSearch(value)
}

// --- COMPUTADAS ---

// ✅ NUEVAS COMPUTADAS PARA AGRUPACIÓN
const datosAgrupados = computed(() => {
  if (agrupacionSeleccionada.value === 'proyecto') {
    return storeActividad.actividadesPorProyecto
  } else if (agrupacionSeleccionada.value === 'responsable') {
    return storeActividad.actividadesPorResponsable
  }
  return []
})

const totalActividadesAgrupadas = computed(() => {
  return datosAgrupados.value.reduce((sum, g) => sum + g.totalActividades, 0)
})

const presupuestoTotalAgrupado = computed(() => {
  return datosAgrupados.value.reduce((sum, g) => sum + g.presupuestoTotal, 0)
})

const proyectosFiltrados = computed(() => {
  return storeActividad.actividadesPorProyecto || []
})

const responsablesFiltrados = computed(() => {
  return storeActividad.actividadesPorResponsable || []
})

// Estadísticas computadas (original)
const estadisticas = computed(() => {
  return [
    {
      label: 'Total actividades',
      value: filteredActividades.value.length,
      icon: 'mdi-calendar-check',
      color: 'primary',
    },
    {
      label: 'Total subactividades',
      value: totalSubactividades.value,
      icon: 'mdi-playlist-check',
      color: 'primary',
    },
    {
      label: 'Subact. con desglose',
      value: totalSubactividadesConDesglose.value,
      icon: 'mdi-cash-multiple',
      color: 'info',
    },
    {
      label: 'Reprogramación',
      value: countByStatus('REPROG'),
      icon: 'mdi-calendar-question',
      color: 'warning',
    },
    {
      label: 'Planificación',
      value: countByStatus('PLAN'),
      icon: 'mdi-calendar-edit',
      color: 'info',
    },
    {
      label: 'En Ejecución',
      value: countByStatus('EJEC'),
      icon: 'mdi-progress-clock',
      color: 'orange',
    },
    {
      label: 'Finalizado',
      value: countByStatus('FIN'),
      icon: 'mdi-check-circle',
      color: 'success',
    },
  ]
})

// Computed para las actividades (original)
const filteredActividades = computed(() => {
  if (!Array.isArray(actividades.value)) return []

  let filtered = actividades.value.map((actividad) => ({
    ...actividad,
    tareasOrdenadas: [...(actividad.tareas || [])].sort((a, b) => {
      return b.id - a.id
    }),
  }))

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (actividad) =>
        (actividad.codigo && actividad.codigo.toLowerCase().includes(query)) ||
        (actividad.nombreCorto && actividad.nombreCorto.toLowerCase().includes(query)) ||
        (actividad.descripcion && actividad.descripcion.toLowerCase().includes(query)) ||
        (actividad.tareas &&
          actividad.tareas.some(
            (tarea) =>
              (tarea.titulo && tarea.titulo.toLowerCase().includes(query)) ||
              (tarea.descripcion && tarea.descripcion.toLowerCase().includes(query)) ||
              (tarea.codigo && tarea.codigo.toLowerCase().includes(query)),
          )),
    )
  }

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

const actividadesPaginadasOrdenadas = computed(() => {
  if (!Array.isArray(actividadesPaginadas.value)) return []
  return [...actividadesPaginadas.value].sort((a, b) => b.id - a.id)
})

const totalPages = computed(() => {
  if (!Array.isArray(filteredActividades.value)) return 0
  return Math.ceil(filteredActividades.value.length / itemsPerPage.value)
})

const totalSubactividades = computed(() => {
  return filteredActividades.value.reduce((total, actividad) => {
    return total + (actividad.tareas ? actividad.tareas.length : 0)
  }, 0)
})

const totalSubactividadesConDesglose = computed(() => {
  return filteredActividades.value.reduce((total, actividad) => {
    if (!actividad.tareas) return total
    return (
      total +
      actividad.tareas.filter(
        (t) =>
          t.presupuestoDesglose !== null &&
          t.presupuestoDesglose !== undefined &&
          t.presupuestoDesglose.length > 0,
      ).length
    )
  }, 0)
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

// Validaciones computadas
const totalPendientes = computed(() => {
  const validaciones = storeActividad.misValidaciones?.results || []
  return validaciones.filter((v) => v.estado === 'PENDIENTE').length
})

const totalAprobados = computed(() => {
  const validaciones = storeActividad.misValidaciones?.results || []
  return validaciones.filter((v) => v.estado === 'APROBADO').length
})

const totalRechazados = computed(() => {
  const validaciones = storeActividad.misValidaciones?.results || []
  return validaciones.filter((v) => v.estado === 'RECHAZADO').length
})

const ultimasValidaciones = computed(() => {
  const validaciones = storeActividad.misValidaciones?.results || []
  return validaciones
    .sort((a, b) => new Date(b.fechaAsignacion) - new Date(a.fechaAsignacion))
    .slice(0, 3)
})

// --- WATCHERS ---
watch(agrupacionSeleccionada, (nuevoValor) => {
  cambiarAgrupacion(nuevoValor)
})

// --- MÉTODOS ---

// Carga inicial de datos
onMounted(async () => {
  await cargar()
})

const cargar = async () => {
  loading.value = true
  try {
    await storeActividad.cargarActividadesTareas()
    console.log(storeActividad.actividadesSubactividadesLista)
    actividades.value = storeActividad.actividadesFiltradas
    successMsg('Numero de actividades cargadas: ' + actividades.value.length)
  } catch (error) {
    console.error('Error al cargar datos:', error)
    actividades.value = []
    emptyResponse.value = true
    errorMsg('Error al cargar datos: ' + (error.message || 'Error desconocido'), 'error')
  } finally {
    loading.value = false
  }
}

const toggleExpanded = (id) => {
  expandedActividadId.value = expandedActividadId.value === id ? null : id
}

// --- MÉTODOS AUXILIARES ---
const truncarTexto = (texto, max) => {
  if (!texto) return ''
  return texto.length > max ? texto.substring(0, max) + '...' : texto
}

const tieneCodigoValido = (codigo) => {
  return codigo && typeof codigo === 'string' && codigo.trim().length > 0
}

const formatearCodigo = (codigo) => {
  return tieneCodigoValido(codigo) ? codigo.trim().toUpperCase() : ''
}

const getDesgloseIcon = (desglose) => {
  if (!desglose || desglose.length === 0) return 'mdi-cash'
  return 'mdi-cash-multiple'
}

const getDesgloseTooltip = (desglose) => {
  if (!desglose || desglose.length === 0) return 'Sin desglose'
  if (desglose.length === 1) return '1 item desglosado'
  return `${desglose.length} items desglosados`
}

// --- CRUD TAREAS ---
const openTareaDialog = (actividadId, tarea = null) => {
  actividadSeleccionada.value = actividades.value.find((a) => a.id === actividadId)
  tareaSeleccionada.value = tarea
  tareaDialog.value = true
}

const guardarTarea = async (datosTarea) => {
  cargandoTarea.value = true
  try {
    if (tareaSeleccionada.value) {
      const response = await actualizarUnaTarea(datosTarea.id, datosTarea)
      const actividad = actividades.value.find((a) => a.id === actividadSeleccionada.value.id)
      if (actividad && actividad.tareas) {
        const tareaIndex = actividad.tareas.findIndex((t) => t.id === datosTarea.id)
        if (tareaIndex !== -1) {
          actividad.tareas[tareaIndex] = {
            ...actividad.tareas[tareaIndex],
            ...response,
          }
        }
      }
      mostrarSnackbar('Subactividad actualizada con éxito', 'success')
    } else {
      const response = await crearUnaTarea(datosTarea)
      const actividad = actividades.value.find((a) => a.id === actividadSeleccionada.value.id)
      if (actividad) {
        if (!actividad.tareas) {
          actividad.tareas = []
        }
        actividad.tareas.push(response)
      }
      mostrarSnackbar('Subactividad creada con éxito', 'success')
    }
  } catch (err) {
    console.error('Error al guardar subactividad', err)
    mostrarSnackbar('Error al guardar subactividad', 'error')
  } finally {
    cargandoTarea.value = false
    tareaDialog.value = false
    actividadSeleccionada.value = null
    tareaSeleccionada.value = null
  }
}

const cancelarTarea = () => {
  tareaDialog.value = false
  actividadSeleccionada.value = null
  tareaSeleccionada.value = null
}

const confirmDeleteTarea = (actividadId, tarea) => {
  actividadIdParaEliminarTarea.value = actividadId
  tareaToDelete.value = tarea
  deleteTareaDialog.value = true
}

const deleteTarea = async () => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    await eliminarUnaTarea(tareaToDelete.value.id)
    const actividad = actividades.value.find((a) => a.id === actividadIdParaEliminarTarea.value)
    if (actividad && actividad.tareas) {
      actividad.tareas = actividad.tareas.filter((t) => t.id !== tareaToDelete.value.id)
    }
    mostrarSnackbar('Subactividad eliminada con éxito', 'success')
  } catch (error) {
    console.error('Error al eliminar Subactividad:', error)
    mostrarSnackbar('Error al eliminar Subactividad', 'error')
  } finally {
    loading.value = false
    deleteTareaDialog.value = false
  }
}

// Funciones auxiliares
const getStatusColor = (status) => {
  const colors = {
    CRD: 'grey',
    PLAN: 'light-blue',
    RETR: 'red',
    REPROG: 'warning',
    EJEC: 'orange',
    REP: 'light-green',
    FIN: 'success',
  }
  return colors[status] || 'grey'
}

const getTipoIcon = (status) => {
  const icons = {
    CRD: 'mdi-plus-circle',
    PLAN: 'mdi-calendar-check-outline',
    RETR: 'mdi-calendar-alert',
    REPROG: 'mdi-calendar-refresh',
    EJEC: 'mdi-calendar-arrow-right',
    REP: 'mdi-calendar-edit',
    FIN: 'mdi-calendar-done',
  }
  return icons[status] || 'mdi-help-circle'
}

const getStatusColorTarea = (status) => {
  const colors = {
    PEN: 'grey',
    EPROG: 'warning',
    COMPL: 'success',
  }
  return colors[status] || 'grey'
}

const getTareaIcon = (status) => {
  const icons = {
    PEN: 'mdi-clock-outline',
    EPROG: 'mdi-progress-clock',
    COMPL: 'mdi-check-circle',
  }
  return icons[status] || 'mdi-help-circle'
}

const getEstadoTareaDisplay = (status) => {
  const estados = {
    PEN: 'Pendiente',
    EPROG: 'En Progreso',
    COMPL: 'Completada',
  }
  return estados[status] || status
}

const calcularDiasRestantes = (fechaLimite) => {
  if (!fechaLimite) return 'Sin fecha'
  const hoy = new Date()
  const limite = new Date(fechaLimite)
  const diffTime = limite - hoy
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return '1 día'
  if (diffDays > 0) return `${diffDays} días`
  return `Hace ${Math.abs(diffDays)} días`
}

const getDiasRestantesColor = (fechaLimite) => {
  if (!fechaLimite) return 'text-grey'
  const hoy = new Date()
  const limite = new Date(fechaLimite)
  const diffTime = limite - hoy
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'text-error'
  if (diffDays <= 3) return 'text-warning'
  if (diffDays <= 7) return 'text-info'
  return 'text-success'
}

const formatCurrency = (value) => {
  if (!value) return 'Bs. 0.00'
  const numValue = Number(value)
  return !isNaN(numValue) ? `Bs. ${numValue.toFixed(2)}` : 'Bs. 0.00'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

const mostrarSnackbar = (texto, color = 'success') => {
  snackbar.value = {
    show: true,
    text: texto,
    color: color,
  }
}

// Redireccionadores
const irInformeActividad = async (actividadId, esPei) => {
  router.push('/monitoreo/informe-actividad/' + actividadId)
}

// Métodos para validaciones
const getEstadoColor = (estado) => {
  const colores = {
    PENDIENTE: 'warning',
    APROBADO: 'success',
    RECHAZADO: 'error',
  }
  return colores[estado] || 'grey'
}

const getIconoEstado = (estado) => {
  const iconos = {
    PENDIENTE: 'mdi-clock-outline',
    APROBADO: 'mdi-check',
    RECHAZADO: 'mdi-close',
  }
  return iconos[estado] || 'mdi-circle'
}

const formatDateCorta = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
  })
}

const abrirDialogValidaciones = () => {
  dialogValidaciones.value = true
}

// --- POPUP ACTIVIDAD ---
const calcularPosicionPopup = (event) => {
  const mouseX = event.clientX
  const mouseY = event.clientY
  const popupWidth = 400
  const popupHeight = 350
  const ventanaWidth = window.innerWidth
  const ventanaHeight = window.innerHeight

  let x = mouseX + 15
  if (x + popupWidth > ventanaWidth) {
    x = mouseX - popupWidth - 15
  }
  if (x < 0) {
    x = 10
  }

  let y = mouseY + 15
  if (y + popupHeight > ventanaHeight) {
    y = mouseY - popupHeight - 15
  }
  if (y < 0) {
    y = 10
  }

  return { x, y }
}

const mostrarPopupActividad = (actividad, event) => {
  if (popupTimeoutId) clearTimeout(popupTimeoutId)
  const { x, y } = calcularPosicionPopup(event)
  actividadPopup.value = actividad
  popupX.value = x
  popupY.value = y
  popupVisible.value = true
}

const cerrarPopup = () => {
  popupVisible.value = false
  actividadPopup.value = null
}

const ocultarPopupActividad = () => {
  popupTimeoutId = setTimeout(() => {
    popupVisible.value = false
    actividadPopup.value = null
  }, 200)
}

// ✅ NUEVAS FUNCIONES PARA AGRUPACIÓN
const cambiarAgrupacion = (tipo) => {
  agrupacionSeleccionada.value = tipo
  storeActividad.cambiarAgrupacion(tipo)
  gruposExpandidos.value = {}
  if (tipo === 'ninguna') {
    expandedActividadId.value = null
  }
}

const toggleGrupo = (grupoId) => {
  gruposExpandidos.value = {
    ...gruposExpandidos.value,
    [grupoId]: !gruposExpandidos.value[grupoId],
  }
}

const expandirTodos = () => {
  const nuevosEstados = {}
  datosAgrupados.value.forEach((grupo) => {
    const grupoId =
      agrupacionSeleccionada.value === 'proyecto'
        ? `proyecto-${grupo.proyectoId}`
        : `resp-${grupo.responsableId}`
    nuevosEstados[grupoId] = true
  })
  gruposExpandidos.value = nuevosEstados
}

const colapsarTodos = () => {
  gruposExpandidos.value = {}
  expandedActividadId.value = null
}

const irInformeSubactividad = (tarea) => {
  const actividad = findActividadByTarea(tarea.id)
  if (actividad?.pei_id) {
    router.push(`/monitoreo/informe-subactividad-pei/${tarea.id}`)
  } else {
    router.push(`/monitoreo/informe-subactividad/${tarea.id}`)
  }
}

const findActividadByTarea = (tareaId) => {
  for (const grupo of datosAgrupados.value) {
    for (const actividad of grupo.actividades) {
      if (actividad.tareas?.some((t) => t.id === tareaId)) {
        return actividad
      }
    }
  }
  return null
}
</script>

<style scoped>
.v-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}

.tarjeta-principal {
  background: white;
  transition: all 0.2s ease;
}

.tarjeta-lateral {
  background: white;
}

.tarjeta-flotante {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  top: 0;
}

.tarjeta-flotante:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  z-index: 10;
}

.actividad-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  background: white;
  cursor: pointer;
  position: relative;
  top: 0;
}

.actividad-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12) !important;
  border-color: #1976d2;
  background: white;
  z-index: 5;
}

.actividad-expandida {
  background: #f5f5f5;
  border-color: #1976d2;
  transform: translateY(0) !important;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2) !important;
}

.acciones-container {
  display: flex;
  gap: 4px;
}

.accion-btn {
  opacity: 0.7;
  transition: all 0.2s ease;
}

.actividad-item:hover .accion-btn {
  opacity: 1;
}

.accion-btn:hover {
  transform: translateY(-1px);
  background-color: rgba(25, 118, 210, 0.1) !important;
}

.subactividad-item {
  background: white;
  border: 1px solid #eee;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  top: 0;
}

.subactividad-item:hover {
  transform: translateX(4px) translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12) !important;
  border-color: #1976d2;
  background: white;
  z-index: 5;
}

.detalles-container {
  transition: all 0.3s ease;
}

.stat-item {
  min-height: 40px;
  padding: 4px 16px;
  transition: all 0.2s ease;
}

.stat-item:hover {
  background: #f8f9fa;
  transform: translateX(2px);
}

.tarjeta-validaciones {
  background: white;
  border: 1px solid #e0e0e0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  top: 0;
}

.tarjeta-validaciones:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  border-color: #ff9800;
  z-index: 10;
}

.validacion-item {
  border-radius: 6px;
  margin-bottom: 4px;
  padding: 6px 0;
  transition: all 0.2s ease;
}

.validacion-item:hover {
  background: #f8f9fa;
  transform: translateX(2px);
}

.chip-codigo {
  font-size: 0.7rem;
  letter-spacing: 0.3px;
}

.gap-2 {
  gap: 8px;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

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

.v-list::-webkit-scrollbar {
  width: 4px;
}

.v-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.v-list::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

.position-relative {
  position: relative;
}

.desglose-icon {
  cursor: help;
  transition: all 0.2s ease;
}

.desglose-icon:hover {
  transform: scale(1.2);
}

.desglose-badge {
  background-color: rgba(33, 150, 243, 0.1);
  padding: 2px 8px;
  border-radius: 16px;
  border: 1px solid rgba(33, 150, 243, 0.3);
  cursor: default;
  transition: all 0.2s ease;
}

.desglose-badge:hover {
  background-color: rgba(33, 150, 243, 0.15);
  border-color: rgba(33, 150, 243, 0.5);
}

.desglose-resumen {
  border-top: 1px dashed #e0e0e0;
  padding-top: 4px;
}

.v-tooltip .v-overlay__content {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
}

@media (max-width: 960px) {
  .v-container {
    padding: 12px;
  }

  .actividad-item {
    padding: 8px !important;
  }

  .actividad-item:hover {
    transform: translateY(-1px);
  }

  .tarjeta-flotante:hover,
  .tarjeta-validaciones:hover {
    transform: translateY(-2px);
  }

  .subactividad-item:hover {
    transform: translateX(2px) translateY(-1px);
  }

  .gap-2 {
    gap: 4px;
  }
}

@media (max-width: 600px) {
  .text-truncate {
    max-width: 150px;
  }

  .acciones-container {
    flex-wrap: wrap;
  }

  .desglose-badge {
    margin-top: 4px;
  }
}
</style>
