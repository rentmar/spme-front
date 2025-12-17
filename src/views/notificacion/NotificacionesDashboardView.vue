<template>
  <v-container class="notificaciones-container pa-0">
    <!-- Overlay de carga -->
    <v-overlay
      :model-value="loading || storeLoading"
      class="align-center justify-center"
      persistent
      opacity="0.8"
    >
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando mensajes...</p>
      </div>
    </v-overlay>

    <template v-if="!loading && !storeLoading">
      <!-- ENCABEZADO CON SELECTOR DE VISTA -->
      <v-row class="ma-0 pa-4 header-bg">
        <v-col cols="12" class="pa-0">
          <div class="d-flex align-center justify-space-between">
            <!-- Título según vista -->
            <pagina-titulo-icono
              :titulo="
                vistaSeleccionada === 'bandeja' ? 'Bandeja de Mensajes' : 'Mensajes Enviados'
              "
              :subtitulo="
                vistaSeleccionada === 'bandeja'
                  ? 'Gestiona tus notificaciones y comunicaciones'
                  : 'Historial de todos los mensajes que has enviado'
              "
              :icon="vistaSeleccionada === 'bandeja' ? 'mdi-email' : 'mdi-send'"
            ></pagina-titulo-icono>

            <!-- Selector de vista Bandeja/Enviados -->
            <v-btn-toggle
              v-model="vistaSeleccionada"
              mandatory
              density="comfortable"
              variant="outlined"
              rounded
              class="ml-4"
              color="primary"
            >
              <v-btn value="bandeja">
                <v-icon start>mdi-email</v-icon>
                Bandeja
                <v-badge
                  v-if="summary.totalNoLeidas > 0"
                  :content="summary.totalNoLeidas"
                  color="primary"
                  inline
                  class="ml-2"
                ></v-badge>
              </v-btn>
              <v-btn value="enviados">
                <v-icon start>mdi-send</v-icon>
                Enviados
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-col>
      </v-row>

      <!-- COMPONENTE SEGÚN VISTA SELECCIONADA -->
      <template v-if="vistaSeleccionada === 'bandeja'">
        <!-- Tu vista actual de bandeja (todo el contenido original) -->
        <!-- ENCABEZADO HORIZONTAL (antes sidebar) -->
        <v-row class="ma-0 px-4 pt-0 pb-2 header-toolbar">
          <v-col cols="12" class="pa-0">
            <v-card class="header-card" elevation="1" flat>
              <!-- Navegación de carpetas horizontal -->
              <div class="d-flex align-center pa-3 border-bottom">
                <div
                  class="d-flex align-center gap-1 flex-grow-1 overflow-x-auto folders-container"
                >
                  <v-btn
                    v-for="carpeta in carpetas"
                    :key="carpeta.value"
                    :color="carpetaSeleccionada === carpeta.value ? 'primary' : undefined"
                    :variant="carpetaSeleccionada === carpeta.value ? 'tonal' : 'text'"
                    size="small"
                    @click="carpetaSeleccionada = carpeta.value"
                    class="folder-btn text-capitalize"
                    rounded="lg"
                  >
                    <v-icon start size="18">
                      {{ carpeta.icon }}
                    </v-icon>
                    {{ carpeta.title }}
                    <v-badge
                      v-if="carpeta.count > 0"
                      :color="carpeta.badgeColor"
                      :content="carpeta.count"
                      inline
                      size="small"
                      class="ml-1"
                    ></v-badge>
                  </v-btn>
                </div>

                <!-- Estadísticas rápidas -->
                <div class="d-flex align-center gap-3 ml-4 stats-summary">
                  <div class="text-center px-2">
                    <div class="text-body-1 font-weight-bold text-primary">
                      {{ summary.totalNotificaciones }}
                    </div>
                    <div class="text-caption text-grey">Total</div>
                  </div>
                  <v-divider vertical></v-divider>
                  <div class="text-center px-2">
                    <div class="text-body-1 font-weight-bold text-primary">
                      {{ summary.totalNoLeidas }}
                    </div>
                    <div class="text-caption text-grey">No leídos</div>
                  </div>
                  <v-divider vertical></v-divider>
                  <div class="text-center px-2">
                    <div class="text-body-1 font-weight-bold text-error">
                      {{ summary.totalUrgentes }}
                    </div>
                    <div class="text-caption text-grey">Urgentes</div>
                  </div>
                  <v-divider vertical></v-divider>
                  <div class="text-center px-2">
                    <div class="text-body-1 font-weight-bold text-warning">
                      {{ summary.totalArchivadas }}
                    </div>
                    <div class="text-caption text-grey">Archivados</div>
                  </div>
                </div>
              </div>

              <!-- Filtros horizontales -->
              <div class="d-flex align-center pa-3 gap-3 filters-toolbar">
                <div class="d-flex align-center gap-2">
                  <v-icon size="18" color="grey">mdi-filter</v-icon>
                  <span class="text-caption text-grey font-weight-medium">Filtros:</span>
                </div>

                <!-- Filtro por tipo -->
                <v-select
                  v-model="filtroTipo"
                  :items="SELECT_OPTIONS_MENSAJES.tipo"
                  item-title="title"
                  item-value="value"
                  label="Tipo"
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                  style="width: 160px"
                  class="compact-select"
                ></v-select>

                <!-- Filtro por prioridad -->
                <v-select
                  v-model="filtroPrioridad"
                  :items="SELECT_OPTIONS_MENSAJES.prioridad"
                  item-title="title"
                  item-value="value"
                  label="Prioridad"
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                  style="width: 140px"
                  class="compact-select"
                ></v-select>

                <!-- Indicador de filtros activos -->
                <div v-if="filtrosActivos" class="d-flex align-center gap-1 ml-2">
                  <v-chip
                    v-for="filtro in filtrosActivosLista"
                    :key="filtro.key"
                    size="x-small"
                    color="primary"
                    variant="outlined"
                    density="compact"
                    closable
                    @click:close="removerFiltro(filtro.key)"
                    class="mr-1"
                  >
                    {{ filtro.label }}: {{ filtro.value }}
                  </v-chip>
                  <v-btn
                    size="x-small"
                    variant="text"
                    color="error"
                    @click="limpiarFiltros"
                    class="text-caption"
                  >
                    <v-icon size="14">mdi-close</v-icon>
                    Limpiar
                  </v-btn>
                </div>

                <!-- Espaciador -->
                <v-spacer></v-spacer>

                <!-- PAGINADOR EN EL ENCABEZADO -->
                <div
                  v-if="notificacionesFiltradas.length > 0"
                  class="d-flex align-center gap-3 header-paginator"
                >
                  <!-- Control de items por página -->
                  <div class="d-flex align-center gap-1 items-per-page-control">
                    <span class="text-caption text-grey">Mostrar:</span>
                    <v-select
                      v-model="itemsPorPagina"
                      :items="opcionesItemsPorPagina"
                      density="compact"
                      variant="outlined"
                      hide-details
                      style="width: 80px"
                      class="items-select elevation-1"
                      @update:model-value="handleItemsPorPaginaChange"
                    ></v-select>
                    <span class="text-caption text-grey">mensajes</span>
                  </div>

                  <!-- Información de paginación -->
                  <div class="d-flex flex-column align-center pagination-info">
                    <div class="text-caption text-grey">
                      <span class="font-weight-bold text-primary"
                        >{{ inicioPagina }}-{{ finPagina }}</span
                      >
                      de
                      <span class="font-weight-bold">{{ notificacionesFiltradas.length }}</span>
                    </div>

                    <!-- Navegación por números de página -->
                    <div class="d-flex gap-1 page-numbers">
                      <v-btn
                        v-for="pagina in paginasNumeros"
                        :key="pagina"
                        :color="paginaActual === pagina ? 'primary' : undefined"
                        variant="tonal"
                        size="x-small"
                        :class="{
                          'active-page': paginaActual === pagina,
                          'ellipsis-btn': pagina === '...',
                        }"
                        :disabled="pagina === '...'"
                        @click="pagina !== '...' && irAPagina(pagina)"
                        min-width="32"
                        height="32"
                      >
                        <template v-if="pagina === '...'">
                          <v-icon size="14">mdi-dots-horizontal</v-icon>
                        </template>
                        <template v-else>
                          {{ pagina }}
                        </template>
                      </v-btn>
                    </div>
                  </div>

                  <!-- Selector de página -->
                  <div class="d-flex align-center gap-1 page-selector">
                    <span class="text-caption text-grey">Ir a:</span>
                    <v-select
                      v-model="paginaActual"
                      :items="paginasDisponibles"
                      density="compact"
                      variant="outlined"
                      hide-details
                      style="width: 70px"
                      class="page-select elevation-1"
                    ></v-select>
                    <span class="text-caption text-grey">de {{ totalPaginas }}</span>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- CONTENIDO PRINCIPAL - SOLO MENSAJES -->
        <v-row class="ma-0 content-row">
          <!-- Lista de mensajes - Ocupa todo el ancho -->
          <v-col cols="12" class="pa-4 messages-col-full">
            <v-card class="messages-card" elevation="2" rounded="lg">
              <!-- Barra superior de acciones -->
              <div class="d-flex align-center justify-space-between pa-4 border-bottom action-bar">
                <div class="d-flex align-center gap-2">
                  <v-checkbox
                    v-model="todosSeleccionados"
                    hide-details
                    density="compact"
                    class="mt-0"
                    @change="toggleSeleccionTodos"
                  ></v-checkbox>

                  <v-btn
                    v-if="notificacionesSeleccionadas.length > 0"
                    icon
                    size="small"
                    variant="text"
                    @click="limpiarSeleccion"
                    title="Limpiar selección"
                    class="btn-clear"
                  >
                    <v-icon size="20">mdi-close</v-icon>
                  </v-btn>
                  <v-divider vertical class="mx-2"></v-divider>
                  <!-- Acciones para selección múltiple -->
                  <template v-if="notificacionesSeleccionadas.length > 0">
                    <v-btn
                      color="primary"
                      size="small"
                      variant="tonal"
                      prepend-icon="mdi-check"
                      @click="marcarSeleccionadasComoLeidas"
                      class="text-capitalize action-btn"
                    >
                      Leer
                    </v-btn>
                    <v-btn
                      color="warning"
                      size="small"
                      variant="tonal"
                      prepend-icon="mdi-archive"
                      @click="archivarSeleccionadas"
                      class="text-capitalize action-btn"
                    >
                      Archivar
                    </v-btn>
                    <v-btn
                      color="error"
                      size="small"
                      variant="tonal"
                      prepend-icon="mdi-delete"
                      @click="eliminarSeleccionadas"
                      class="text-capitalize action-btn"
                    >
                      {{ carpetaSeleccionada === 'papelera' ? 'Eliminar' : 'Papelera' }}
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn
                      variant="tonal"
                      size="small"
                      prepend-icon="mdi-refresh"
                      @click="recargar"
                      :loading="recargando"
                      class="text-capitalize action-btn"
                    >
                      Actualizar
                    </v-btn>
                    <v-btn
                      variant="tonal"
                      size="small"
                      prepend-icon="mdi-check-all"
                      @click="marcarTodasComoLeidas"
                      :disabled="summary.totalNoLeidas === 0"
                      class="text-capitalize action-btn"
                    >
                      Marcar todas
                    </v-btn>
                    <v-btn
                      variant="tonal"
                      size="small"
                      prepend-icon="mdi-email"
                      @click="abrirEditor('nuevo')"
                      class="text-capitalize action-btn"
                    >
                      Nuevo Mensaje
                    </v-btn>
                  </template>
                </div>
                <!-- Búsqueda y vista -->
                <div class="d-flex align-center gap-2">
                  <v-text-field
                    v-model="search"
                    placeholder="Buscar en mensajes..."
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="width: 240px"
                    clearable
                    class="search-field"
                    @update:model-value="handleSearch"
                  >
                    <template v-slot:append-inner v-if="search">
                      <v-chip size="x-small" color="info" class="ml-1">
                        {{ resultadoBusquedaTexto }}
                      </v-chip>
                    </template>
                  </v-text-field>

                  <v-btn-toggle
                    v-model="vista"
                    mandatory
                    density="compact"
                    variant="outlined"
                    divided
                    class="ml-2 view-toggle"
                  >
                    <v-btn value="lista" size="small" title="Vista lista">
                      <v-icon size="18">mdi-format-list-bulleted</v-icon>
                    </v-btn>
                    <v-btn value="detalle" size="small" title="Vista detalle">
                      <v-icon size="18">mdi-card-text</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </div>
              </div>

              <!-- Lista de mensajes - SIN ALTURA FIJA -->
              <div class="messages-list">
                <!-- Indicador de filtros aplicados -->
                <div v-if="filtrosActivos || search" class="px-4 pt-3">
                  <v-alert type="info" density="comfortable" variant="tonal" class="mb-3">
                    <div class="d-flex align-center justify-space-between">
                      <div class="d-flex align-center">
                        <v-icon size="18" color="primary" class="mr-2">mdi-filter</v-icon>
                        <span class="text-body-2 font-weight-medium">
                          {{ resultadoFiltroCompletoTexto }}
                        </span>
                      </div>
                      <v-btn
                        size="x-small"
                        variant="text"
                        color="error"
                        @click="limpiarTodosLosFiltros"
                        class="text-caption"
                      >
                        <v-icon size="14" class="mr-1">mdi-filter-off</v-icon>
                        Limpiar filtros
                      </v-btn>
                    </div>
                  </v-alert>
                </div>

                <template v-if="notificacionesPaginadas.length > 0">
                  <!-- Vista lista (compacta) -->
                  <template v-if="vista === 'lista'">
                    <div
                      v-for="notificacion in notificacionesPaginadas"
                      :key="notificacion.id"
                      :class="[
                        'message-item',
                        'px-4',
                        'py-3',
                        {
                          unread: notificacion.estado === 'no_leido' || !notificacion.es_leido,
                          selected: notificacionSeleccionada?.id === notificacion.id,
                          important: notificacion.prioridad >= 4 || notificacion.es_urgente,
                          archived: notificacion.estado === 'archivado',
                        },
                      ]"
                      @click="seleccionarNotificacion(notificacion)"
                    >
                      <div class="d-flex align-center gap-3">
                        <!-- Checkbox -->
                        <v-checkbox
                          :model-value="notificacionesSeleccionadas.includes(notificacion.id)"
                          @click.stop="toggleSeleccion(notificacion.id)"
                          density="compact"
                          hide-details
                          class="mt-0 message-checkbox"
                        ></v-checkbox>
                        <!-- Estado -->
                        <div class="message-status">
                          <div class="status-indicator" :class="notificacion.estado"></div>
                          <v-icon
                            v-if="notificacion.estado === 'no_leido' || !notificacion.es_leido"
                            color="primary"
                            size="16"
                            class="message-icon"
                          >
                            mdi-email
                          </v-icon>
                          <v-icon v-else color="grey" size="16" class="message-icon">
                            mdi-email-open
                          </v-icon>

                          <v-icon
                            v-if="notificacion.prioridad >= 4 || notificacion.es_urgente"
                            color="error"
                            size="14"
                            class="message-important"
                          >
                            mdi-alert-circle
                          </v-icon>
                        </div>
                        <!-- Remitente -->
                        <div class="message-sender">
                          <v-avatar
                            size="32"
                            :color="getAvatarColor(notificacion.remitente?.nombre_completo)"
                            class="mr-2"
                          >
                            <span class="text-white text-caption">
                              {{ getIniciales(notificacion.remitente?.nombre_completo) }}
                            </span>
                          </v-avatar>
                          <div>
                            <div class="text-body-2 font-weight-medium text-truncate">
                              {{ notificacion.remitente?.nombre_completo || 'Sistema' }}
                            </div>
                            <div class="text-caption text-grey">
                              {{ getTipoTexto(notificacion.tipo) }}
                            </div>
                          </div>
                        </div>
                        <!-- Asunto y vista previa -->
                        <div class="flex-grow-1 min-width-0">
                          <div class="d-flex align-center gap-2 mb-1">
                            <span class="text-body-1 font-weight-medium text-truncate">
                              {{ notificacion.asunto || 'Sin asunto' }}
                            </span>
                            <v-chip
                              v-if="notificacion.prioridad >= 4 || notificacion.es_urgente"
                              color="error"
                              size="x-small"
                              density="compact"
                              class="ml-1 priority-chip"
                            >
                              Urgente
                            </v-chip>
                          </div>
                          <div class="text-body-2 text-grey text-truncate">
                            {{ truncateText(notificacion.contenido, 100) }}
                          </div>
                        </div>
                        <!-- Fecha y acciones rápidas -->
                        <div class="d-flex align-center gap-3">
                          <div class="text-caption text-grey text-nowrap message-time">
                            {{ formatTime(notificacion.fecha_envio) }}
                          </div>
                          <div class="d-flex align-center gap-1 quick-actions">
                            <v-btn
                              v-if="notificacion.estado === 'no_leido' || !notificacion.es_leido"
                              icon
                              size="x-small"
                              variant="text"
                              @click.stop="marcarComoLeida(notificacion)"
                              title="Marcar como leída"
                              class="quick-action"
                            >
                              <v-icon size="16">mdi-check</v-icon>
                            </v-btn>
                            <v-btn
                              icon
                              size="x-small"
                              variant="text"
                              @click.stop="toggleArchivar(notificacion)"
                              :title="
                                notificacion.estado === 'archivado' ? 'Desarchivar' : 'Archivar'
                              "
                              class="quick-action"
                            >
                              <v-icon size="16">
                                {{
                                  notificacion.estado === 'archivado'
                                    ? 'mdi-archive-arrow-up'
                                    : 'mdi-archive'
                                }}
                              </v-icon>
                            </v-btn>
                            <!-- BOTÓN DE ELIMINAR -->
                            <v-btn
                              icon
                              size="x-small"
                              variant="text"
                              @click.stop="toggleEliminar(notificacion)"
                              :title="
                                notificacion.estado === 'eliminado' ? 'Recuperar' : 'Eliminar'
                              "
                              color="error"
                              class="quick-action"
                            >
                              <v-icon size="16">
                                {{
                                  notificacion.estado === 'eliminado'
                                    ? 'mdi-delete-restore'
                                    : 'mdi-delete'
                                }}
                              </v-icon>
                            </v-btn>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- Vista detalle -->
                  <template v-else>
                    <v-card
                      v-for="notificacion in notificacionesPaginadas"
                      :key="notificacion.id"
                      :class="[
                        'message-detail-card',
                        'ma-3',
                        {
                          unread: notificacion.estado === 'no_leido' || !notificacion.es_leido,
                          selected: notificacionSeleccionada?.id === notificacion.id,
                          archived: notificacion.estado === 'archivado',
                        },
                      ]"
                      variant="outlined"
                      @click="seleccionarNotificacion(notificacion)"
                    >
                      <v-card-text class="pa-3">
                        <div class="d-flex align-start gap-3">
                          <!-- Checkbox -->
                          <v-checkbox
                            :model-value="notificacionesSeleccionadas.includes(notificacion.id)"
                            @click.stop="toggleSeleccion(notificacion.id)"
                            density="compact"
                            hide-details
                            class="mt-0"
                          ></v-checkbox>

                          <!-- Avatar del remitente -->
                          <div class="avatar-container">
                            <v-avatar
                              :color="getAvatarColor(notificacion.remitente?.nombre_completo)"
                              size="48"
                              class="message-avatar"
                            >
                              <span class="text-white">
                                {{ getIniciales(notificacion.remitente?.nombre_completo) }}
                              </span>
                            </v-avatar>
                            <div
                              class="status-dot"
                              :class="
                                notificacion.estado ||
                                (notificacion.es_leido ? 'leido' : 'no_leido')
                              "
                            ></div>
                          </div>

                          <!-- Contenido -->
                          <div class="flex-grow-1 min-width-0">
                            <div class="d-flex justify-space-between align-start mb-2">
                              <div>
                                <div class="d-flex align-center gap-2 mb-1">
                                  <span class="text-body-1 font-weight-bold">
                                    {{ notificacion.remitente?.nombre_completo || 'Sistema' }}
                                  </span>
                                  <v-chip
                                    :color="getTipoColor(notificacion.tipo)"
                                    size="x-small"
                                    density="compact"
                                    class="type-chip"
                                  >
                                    {{ getTipoTexto(notificacion.tipo) }}
                                  </v-chip>
                                  <v-chip
                                    v-if="notificacion.prioridad >= 4 || notificacion.es_urgente"
                                    color="error"
                                    size="x-small"
                                    density="compact"
                                    class="priority-chip"
                                  >
                                    Urgente
                                  </v-chip>
                                </div>
                                <div
                                  class="text-body-1 font-weight-medium text-primary message-subject"
                                >
                                  {{ notificacion.asunto || 'Sin asunto' }}
                                </div>
                              </div>
                              <div class="text-caption text-grey text-nowrap message-time">
                                {{ formatTime(notificacion.fecha_envio) }}
                              </div>
                            </div>
                            <div class="text-body-2 text-grey mb-2 message-preview">
                              {{ truncateText(notificacion.contenido, 150) }}
                            </div>

                            <!-- Etiquetas -->
                            <div class="d-flex gap-1 message-tags">
                              <v-chip
                                v-if="notificacion.actividad_id"
                                size="x-small"
                                color="blue-lighten-4"
                                variant="outlined"
                                density="compact"
                              >
                                <v-icon size="12" class="mr-1">mdi-tasks</v-icon>
                                Actividad
                              </v-chip>
                              <v-chip
                                v-if="notificacion.proyecto_id"
                                size="x-small"
                                color="green-lighten-4"
                                variant="outlined"
                                density="compact"
                              >
                                <v-icon size="12" class="mr-1">mdi-briefcase</v-icon>
                                Proyecto
                              </v-chip>
                              <v-chip
                                v-if="notificacion.tiene_accion && notificacion.accion_url"
                                size="x-small"
                                color="orange-lighten-4"
                                variant="outlined"
                                density="compact"
                              >
                                <v-icon size="12" class="mr-1">mdi-link</v-icon>
                                Acción
                              </v-chip>
                              <v-chip
                                v-if="notificacion.estado === 'no_leido' || !notificacion.es_leido"
                                color="primary"
                                size="x-small"
                                density="compact"
                              >
                                No leído
                              </v-chip>
                            </div>
                          </div>

                          <!-- Acciones rápidas -->
                          <div class="d-flex flex-column gap-1 message-actions">
                            <v-btn
                              v-if="notificacion.estado === 'no_leido' || !notificacion.es_leido"
                              icon
                              size="x-small"
                              variant="text"
                              @click.stop="marcarComoLeida(notificacion)"
                              title="Marcar como leída"
                            >
                              <v-icon size="16">mdi-check</v-icon>
                            </v-btn>
                            <v-btn
                              icon
                              size="x-small"
                              variant="text"
                              @click.stop="toggleArchivar(notificacion)"
                              :title="
                                notificacion.estado === 'archivado' ? 'Desarchivar' : 'Archivar'
                              "
                            >
                              <v-icon size="16">
                                {{
                                  notificacion.estado === 'archivado'
                                    ? 'mdi-archive-arrow-up'
                                    : 'mdi-archive'
                                }}
                              </v-icon>
                            </v-btn>
                            <v-btn
                              icon
                              size="x-small"
                              variant="text"
                              @click.stop="toggleEliminar(notificacion)"
                              :title="
                                notificacion.estado === 'eliminado' ? 'Recuperar' : 'Eliminar'
                              "
                              color="error"
                            >
                              <v-icon size="16">
                                {{
                                  notificacion.estado === 'eliminado'
                                    ? 'mdi-delete-restore'
                                    : 'mdi-delete'
                                }}
                              </v-icon>
                            </v-btn>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </template>
                </template>

                <template v-else>
                  <div class="text-center py-12 empty-state">
                    <v-icon size="96" color="grey-lighten-3" class="empty-icon">
                      {{ getIconoCarpetaVacia(carpetaSeleccionada) }}
                    </v-icon>
                    <p class="text-h6 text-grey mt-4">
                      {{ getMensajeCarpetaVacia(carpetaSeleccionada, filtrosActivos) }}
                    </p>
                    <p class="text-body-1 text-grey mt-2">
                      {{ getDescripcionCarpetaVacia(carpetaSeleccionada, filtrosActivos) }}
                    </p>
                    <v-btn
                      v-if="carpetaSeleccionada === 'entrada' && !filtrosActivos"
                      color="primary"
                      class="mt-4"
                      prepend-icon="mdi-pencil"
                      @click="abrirEditor('nuevo')"
                    >
                      Escribir tu primer mensaje
                    </v-btn>
                    <v-btn
                      v-else-if="filtrosActivos"
                      color="primary"
                      variant="outlined"
                      class="mt-4"
                      prepend-icon="mdi-filter-off"
                      @click="limpiarTodosLosFiltros"
                    >
                      Limpiar filtros
                    </v-btn>
                  </div>
                </template>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-else>
        <!-- Componente de mensajes enviados -->
        <MensajesEnviados :datos-mensajes="mensajesStore.notificacionesEnviadas" />
      </template>
    </template>

    <!-- Componente para leer mensajes -->
    <LectorMensajes
      v-if="notificacionSeleccionada"
      :message="notificacionSeleccionada"
      :messages="notificacionesFiltradas"
      :visible="lectorVisible"
      @update:visible="lectorVisible = $event"
      @close="cerrarLector"
      @mark-read="handleMarkRead"
      @archive="handleArchive"
      @delete="handleDelete"
      @reply="handleReply"
      @reply-all="handleReplyAll"
      @forward="handleForward"
      @previous="handlePrevious"
      @next="handleNext"
      @star="handleStar"
      @action-completed="handleActionCompleted"
    />

    <!-- Componente Editor de Mensajes -->
    <!-- <EditorMensajes
      ref="editorMensajeRef"
      v-model="editorVisible"
      :modo="editorModo"
      :mensaje-original="editorMensajeOriginal"
      @enviado="handleMensajeEnviado"
      @guardado="handleMensajeGuardado"
      @cancelado="handleEditorCancelado"
    /> -->
    <EnviarMensajes
      v-model="editorVisible"
      @enviado="handleMensajeEnviado"
      @cancelado="handleEditorCancelado"
    ></EnviarMensajes>
  </v-container>
</template>

<script setup>
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import { SELECT_OPTIONS_MENSAJES } from '@/modules/notificacion/utils/selectOptionsMensajes'
import { onMounted, ref, computed, watch } from 'vue'
import { useNotificacionesStore } from '@/modules/notificacion/store/useNotificacionesStore'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from '@/composables/useSnackbar'
import LectorMensajes from '@/modules/notificacion/components/LectorMensajes.vue'
//import EditorMensajes from '@/modules/notificacion/components/EditorMensajes.vue'
import EnviarMensajes from '@/modules/notificacion/components/EnviarMensajes.vue'
// Importar el nuevo componente
import MensajesEnviados from '@/modules/notificacion/components/MensajesEnviados.vue'

// AGREGAR: Variable para controlar la vista
const vistaSeleccionada = ref('bandeja') // 'bandeja' o 'enviados'

// Estado (mantener todo tu estado actual)
const loading = ref(true)
const recargando = ref(false)
const carpetaSeleccionada = ref('entrada')
const filtroTipo = ref(null)
const filtroPrioridad = ref(null)
const todosSeleccionados = ref(false)
const notificacionSeleccionada = ref(null)
const notificacionesSeleccionadas = ref([])
const vista = ref('lista')
const search = ref('')
//Componente lectura de mensajes
const lectorVisible = ref(false)

// Variables de paginación
const paginaActual = ref(1)
const itemsPorPagina = ref(20)
const opcionesItemsPorPagina = ref([
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '30', value: 30 },
  { title: '50', value: 50 },
  { title: '100', value: 100 },
])

// Variables para el Editor de Mensajes
const editorMensajeRef = ref(null)
const editorVisible = ref(false)
const editorModo = ref('nuevo')
const editorMensajeOriginal = ref(null)

// Inicializar stores
const mensajesStore = useNotificacionesStore()
const usuarioStore = useUserStore()

//Inciar composables
const { successMsg, errorMsg } = useSnackbar()

// Computed para obtener datos del store
const notificaciones = computed(() => mensajesStore.notificaciones)
const storeLoading = computed(() => mensajesStore.loading)

// Usuario actual desde el store
const usuarioActual = computed(
  () =>
    usuarioStore.currentUser || {
      id: 1,
      nombre_completo: 'Usuario',
      email: 'usuario@empresa.com',
    },
)

/******************** MEJORAS EN FILTROS ******************************/
// Computed para detectar filtros activos
const filtrosActivos = computed(() => {
  return filtroTipo.value !== null || filtroPrioridad.value !== null || search.value !== ''
})

// Lista de filtros activos para mostrar
const filtrosActivosLista = computed(() => {
  const filtros = []

  if (filtroTipo.value) {
    const tipoTexto =
      SELECT_OPTIONS_MENSAJES.tipo.find((t) => t.value === filtroTipo.value)?.title ||
      filtroTipo.value
    filtros.push({
      key: 'tipo',
      label: 'Tipo',
      value: tipoTexto,
    })
  }

  if (filtroPrioridad.value) {
    const prioridadTexto =
      SELECT_OPTIONS_MENSAJES.prioridad.find((p) => p.value === filtroPrioridad.value)?.title ||
      filtroPrioridad.value
    filtros.push({
      key: 'prioridad',
      label: 'Prioridad',
      value: prioridadTexto,
    })
  }

  if (search.value) {
    filtros.push({
      key: 'busqueda',
      label: 'Búsqueda',
      value: `"${search.value}"`,
    })
  }

  return filtros
})

// Textos informativos de filtros
const resultadoFiltroTexto = computed(() => {
  const total = notificacionesFiltradas.value.length
  const original = notificaciones.value.length

  if (total === original) {
    return 'Mostrando todos los mensajes'
  } else {
    return `Mostrando ${total} de ${original} mensajes`
  }
})

const resultadoFiltroCompletoTexto = computed(() => {
  const total = notificacionesFiltradas.value.length
  const original = notificaciones.value.length

  let texto = 'Filtros aplicados: '
  const filtrosTexto = filtrosActivosLista.value.map((f) => `${f.label}: ${f.value}`).join(', ')
  texto += filtrosTexto

  if (total !== original) {
    texto += ` | Mostrando ${total} de ${original} mensajes`
  }

  return texto
})

const resultadoBusquedaTexto = computed(() => {
  const resultados = notificacionesFiltradas.value.length
  return `${resultados} encontrado${resultados !== 1 ? 's' : ''}`
})

// Funciones para manejar filtros
const limpiarFiltros = () => {
  filtroTipo.value = null
  filtroPrioridad.value = null
  paginaActual.value = 1
}

const limpiarTodosLosFiltros = () => {
  limpiarFiltros()
  search.value = ''
  paginaActual.value = 1
}

const removerFiltro = (key) => {
  if (key === 'tipo') {
    filtroTipo.value = null
  } else if (key === 'prioridad') {
    filtroPrioridad.value = null
  } else if (key === 'busqueda') {
    search.value = ''
  }
  paginaActual.value = 1
}

const handleSearch = () => {
  paginaActual.value = 1
}

/******************** NAVEGACION ******************************/
// Carpetas para los mensajes
const carpetas = computed(() => [
  {
    title: 'Entrada',
    value: 'entrada',
    icon: 'mdi-inbox',
    count: summary.value.totalNoLeidas,
    badgeColor: 'primary',
  },
  {
    title: 'Archivados',
    value: 'archivados',
    icon: 'mdi-archive',
    count: summary.value.totalArchivadas,
    badgeColor: 'warning',
  },
  {
    title: 'Papelera',
    value: 'papelera',
    icon: 'mdi-delete',
    count: notificaciones.value.filter((n) => n.estado === 'eliminado').length,
    badgeColor: 'error',
  },
])

// Resumen usando datos del store
const summary = computed(() => {
  const total = notificaciones.value.length
  const totalNoLeidas = mensajesStore.noLeidosCuenta || 0
  const totalUrgentes = mensajesStore.totalUrgentes || 0
  const totalArchivadas = mensajesStore.totalArchivadas || 0

  return {
    totalNotificaciones: total,
    totalNoLeidas,
    totalUrgentes,
    totalArchivadas,
  }
})

/******************** PAGINACIÓN AVANZADA ******************************/
// Computed properties para paginación
const totalPaginas = computed(() => {
  return Math.max(1, Math.ceil(notificacionesFiltradas.value.length / itemsPorPagina.value))
})

const inicioPagina = computed(() => {
  return (paginaActual.value - 1) * itemsPorPagina.value + 1
})

const finPagina = computed(() => {
  const fin = paginaActual.value * itemsPorPagina.value
  return Math.min(fin, notificacionesFiltradas.value.length)
})

// Lista de páginas disponibles para el selector
const paginasDisponibles = computed(() => {
  const paginas = []
  for (let i = 1; i <= totalPaginas.value; i++) {
    paginas.push({ title: i.toString(), value: i })
  }
  return paginas
})

// Números de página para mostrar (con ellipsis para muchas páginas)
const paginasNumeros = computed(() => {
  const paginas = []
  const total = totalPaginas.value
  const actual = paginaActual.value

  if (total <= 7) {
    // Mostrar todas las páginas
    for (let i = 1; i <= total; i++) {
      paginas.push(i)
    }
  } else {
    // Lógica para mostrar páginas con ellipsis
    if (actual <= 4) {
      // Páginas 1-5, luego ellipsis y última
      for (let i = 1; i <= 5; i++) {
        paginas.push(i)
      }
      paginas.push('...')
      paginas.push(total)
    } else if (actual >= total - 3) {
      // Primera página, ellipsis, últimas 5 páginas
      paginas.push(1)
      paginas.push('...')
      for (let i = total - 4; i <= total; i++) {
        paginas.push(i)
      }
    } else {
      // Primera, ellipsis, actual-1, actual, actual+1, ellipsis, última
      paginas.push(1)
      paginas.push('...')
      paginas.push(actual - 1)
      paginas.push(actual)
      paginas.push(actual + 1)
      paginas.push('...')
      paginas.push(total)
    }
  }

  return paginas
})

// Notificaciones paginadas (solo las de la página actual)
const notificacionesPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value
  const fin = inicio + itemsPorPagina.value
  return notificacionesFiltradas.value.slice(inicio, fin)
})

/******************** FUNCIONES DE PAGINACIÓN ******************************/
const irAPagina = (nuevaPagina) => {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
    scrollToTop()
  }
}

const handleItemsPorPaginaChange = (nuevoValor) => {
  // Guardar la posición relativa del item actual
  const itemIndexActual = (paginaActual.value - 1) * itemsPorPagina.value
  const nuevaPagina = Math.floor(itemIndexActual / nuevoValor) + 1

  itemsPorPagina.value = nuevoValor
  paginaActual.value = Math.min(nuevaPagina, totalPaginas.value)
  scrollToTop()
}

const scrollToTop = () => {
  const messagesList = document.querySelector('.messages-list')
  if (messagesList) {
    messagesList.scrollTop = 0
  }
}

/******************** Caja de mensajes ***************************/
const toggleSeleccionTodos = () => {
  if (todosSeleccionados.value) {
    notificacionesSeleccionadas.value = notificacionesPaginadas.value.map((n) => n.id)
  } else {
    notificacionesSeleccionadas.value = []
  }
}

const recargar = async () => {
  recargando.value = true
  try {
    await mensajesStore.cargarNotificaciones()
    // Resetear a página 1 después de recargar
    paginaActual.value = 1
    // Limpiar selección
    notificacionesSeleccionadas.value = []
    todosSeleccionados.value = false
    successMsg('Mensajes actualizados')
  } catch (error) {
    console.error('Error al recargar:', error)
    errorMsg('Error al actualizar mensajes')
  } finally {
    recargando.value = false
  }
}

const marcarTodasComoLeidas = async () => {
  try {
    const ids = notificacionesPaginadas.value
      .filter((n) => n.estado === 'no_leido' || !n.es_leido)
      .map((n) => n.id)

    if (ids.length === 0) return

    await mensajesStore.marcarComoLeidos(ids)
    successMsg(`${ids.length} mensajes marcados como leídos`)
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error)
    errorMsg('No se pudieron marcar todos los mensajes')
  }
}

const notificacionesFiltradas = computed(() => {
  let filtered = notificaciones.value.filter((notificacion) => {
    // Filtrar por carpeta
    if (carpetaSeleccionada.value === 'entrada') {
      if (['archivado', 'eliminado'].includes(notificacion.estado)) return false
    } else if (carpetaSeleccionada.value === 'archivados') {
      if (notificacion.estado !== 'archivado') return false
    } else if (carpetaSeleccionada.value === 'papelera') {
      if (notificacion.estado !== 'eliminado') return false
    } else if (carpetaSeleccionada.value === 'destacados') {
      if (notificacion.prioridad < 4) return false
    } else if (carpetaSeleccionada.value === 'enviados') {
      // Mostrar mensajes donde el usuario es el remitente
      if (notificacion.remitente?.id !== usuarioActual.value.id) return false
    }

    // Filtrar por tipo
    if (filtroTipo.value && notificacion.tipo !== filtroTipo.value) return false

    // Filtrar por prioridad
    if (filtroPrioridad.value && notificacion.prioridad !== parseInt(filtroPrioridad.value))
      return false

    // Filtrar por búsqueda
    if (search.value) {
      const searchLower = search.value.toLowerCase()
      return (
        notificacion.asunto?.toLowerCase().includes(searchLower) ||
        notificacion.contenido?.toLowerCase().includes(searchLower) ||
        notificacion.remitente?.nombre_completo?.toLowerCase().includes(searchLower) ||
        notificacion.tipo_display?.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  // Ordenar por fecha (más recientes primero)
  return filtered.sort((a, b) => new Date(b.fecha_envio) - new Date(a.fecha_envio))
})

// Funciones de utilidad
const formatTime = (dateString) => {
  if (!dateString) return 'Reciente'

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Ayer'
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' })
  } else {
    return date.toLocaleDateString()
  }
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const getAvatarColor = (name) => {
  if (!name) return 'grey'
  const colors = ['primary', 'secondary', 'error', 'warning', 'info', 'success']
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[index % colors.length]
}

const getIniciales = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getTipoTexto = (tipo) => {
  if (!tipo) return 'General'

  const tipoOption = SELECT_OPTIONS_MENSAJES.tipo.find((t) => t.value === tipo)
  if (tipoOption) return tipoOption.title

  const map = {
    privado: 'PRIVADO',
    sistema: 'SISTEMA',
    alerta: 'ALERTA',
    recordatorio: 'RECORDATORIO',
    reprogramacion: 'REPROGRAMACIÓN',
    retraso: 'RETRASO',
    reunion: 'Reunión',
    social: 'Social',
    administrativo: 'Administrativo',
    feedback: 'Feedback',
    comentario: 'Comentario',
    capacitacion: 'Capacitación',
  }
  return map[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1)
}

const getTipoColor = (tipo) => {
  const map = {
    privado: 'indigo',
    sistema: 'red',
    alerta: 'orange',
    recordatorio: 'green',
    reprogramacion: 'blue',
    retraso: 'error',
    reunion: 'blue',
    social: 'pink',
    administrativo: 'grey',
    feedback: 'green',
    comentario: 'teal',
    capacitacion: 'purple',
  }
  return map[tipo] || 'grey'
}

const getIconoCarpetaVacia = (carpeta) => {
  const map = {
    entrada: 'mdi-inbox-outline',
    enviados: 'mdi-send-outline',
    destacados: 'mdi-star-outline',
    archivados: 'mdi-archive-outline',
    papelera: 'mdi-delete-outline',
  }
  return map[carpeta] || 'mdi-inbox-outline'
}

const getMensajeCarpetaVacia = (carpeta, tieneFiltros = false) => {
  if (tieneFiltros) {
    return 'No hay mensajes con los filtros aplicados'
  }

  const map = {
    entrada: 'No hay mensajes nuevos',
    enviados: 'No has enviado mensajes',
    destacados: 'No hay mensajes destacados',
    archivados: 'No hay mensajes archivados',
    papelera: 'La papelera está vacía',
  }
  return map[carpeta] || 'No hay mensajes'
}

const getDescripcionCarpetaVacia = (carpeta, tieneFiltros = false) => {
  if (tieneFiltros) {
    return 'Intenta ajustar los filtros de búsqueda o limpiarlos para ver todos los mensajes'
  }

  const map = {
    entrada: 'Los nuevos mensajes aparecerán aquí',
    enviados: 'Los mensajes que envíes aparecerán aquí',
    destacados: 'Marca mensajes como importantes para verlos aquí',
    archivados: 'Los mensajes archivados aparecerán aquí',
    papelera: 'Los mensajes eliminados aparecerán aquí',
  }
  return map[carpeta] || 'Los nuevos mensajes aparecerán aquí'
}

// Funciones de selección
const seleccionarNotificacion = async (notificacion) => {
  notificacionSeleccionada.value = notificacion
  lectorVisible.value = true

  // Marcar como leída si no lo está
  if (notificacion.estado === 'no_leido' || !notificacion.es_leido) {
    await marcarComoLeida(notificacion)
  }
}

const toggleSeleccion = (id) => {
  const index = notificacionesSeleccionadas.value.indexOf(id)
  if (index > -1) {
    notificacionesSeleccionadas.value.splice(index, 1)
  } else {
    notificacionesSeleccionadas.value.push(id)
  }
  todosSeleccionados.value =
    notificacionesSeleccionadas.value.length === notificacionesPaginadas.value.length
}

const limpiarSeleccion = () => {
  notificacionesSeleccionadas.value = []
  todosSeleccionados.value = false
}

// Funciones de estado
const marcarComoLeida = async (notificacion) => {
  try {
    await mensajesStore.marcarComoLeida(notificacion.id)
    successMsg('Marcado como leído')
  } catch (error) {
    errorMsg('No se pudo marcar como leído')
    console.error('Error al marcar como leída:', error)
  }
}

const marcarSeleccionadasComoLeidas = async () => {
  try {
    await mensajesStore.marcarComoLeidos(notificacionesSeleccionadas.value)
    successMsg(`${notificacionesSeleccionadas.value.length} mensajes marcados como leídos`)
    notificacionesSeleccionadas.value = []
  } catch (error) {
    errorMsg('No se pudieron marcar como leídos')
    console.error('Error al marcar seleccionadas como leídas:', error)
  }
}

const toggleArchivar = async (notificacion) => {
  try {
    if (notificacion.estado === 'archivado') {
      await mensajesStore.restaurarArchivado(notificacion.id)
      successMsg('Mensaje restaurado')
    } else {
      await mensajesStore.archivarMensajes(notificacion.id)
      successMsg('Mensaje archivado')
    }
  } catch (error) {
    errorMsg('No se pudo realizar la acción')
    console.error('Error al archivar/desarchivar:', error)
  }
}

const archivarSeleccionadas = async () => {
  try {
    await mensajesStore.archivarMensajes(notificacionesSeleccionadas.value)
    successMsg(`${notificacionesSeleccionadas.value.length} mensajes archivados`)
    notificacionesSeleccionadas.value = []
  } catch (error) {
    errorMsg('No se pudieron archivar los mensajes')
    console.error('Error al archivar seleccionadas:', error)
  }
}

const toggleEliminar = async (notificacion) => {
  try {
    if (notificacion.estado === 'eliminado') {
      await mensajesStore.restaurarMensaje(notificacion.id)
      successMsg('Mensaje restaurado')
    } else {
      await mensajesStore.eliminarMensaje(notificacion.id)
      successMsg('Mensaje movido a papelera')
    }
  } catch (error) {
    errorMsg('No se pudo realizar la acción')
    console.error('Error al eliminar/restaurar:', error)
  }
}

const eliminarSeleccionadas = async () => {
  try {
    if (carpetaSeleccionada.value === 'papelera') {
      // Eliminar permanentemente
      for (const id of notificacionesSeleccionadas.value) {
        await mensajesStore.eliminarPermanentemente(id)
      }
      successMsg(`${notificacionesSeleccionadas.value.length} mensajes eliminados permanentemente`)
    } else {
      // Mover a papelera
      await Promise.all(
        notificacionesSeleccionadas.value.map((id) => mensajesStore.eliminarMensaje(id)),
      )
      successMsg(`${notificacionesSeleccionadas.value.length} mensajes movidos a papelera`)
    }
    notificacionesSeleccionadas.value = []
  } catch (error) {
    errorMsg('No se pudieron eliminar los mensajes')
    console.error('Error al eliminar seleccionadas:', error)
  }
}

// Watch para actualizar selección completa
watch(
  notificacionesSeleccionadas,
  (val) => {
    todosSeleccionados.value = val.length > 0 && val.length === notificacionesPaginadas.value.length
  },
  { deep: true },
)

watch(notificacionesPaginadas, () => {
  todosSeleccionados.value =
    notificacionesSeleccionadas.value.length > 0 &&
    notificacionesSeleccionadas.value.length === notificacionesPaginadas.value.length
})

// Watch para resetear paginación cuando cambian los filtros o búsqueda
watch([search, filtroTipo, filtroPrioridad, carpetaSeleccionada], () => {
  paginaActual.value = 1
})

/******************** Lector de mensajes ***********************/

const abrirEditor = (modo = 'nuevo', mensajeOriginal = null) => {
  editorModo.value = modo
  editorMensajeOriginal.value = mensajeOriginal
  editorVisible.value = true
}

const cerrarLector = () => {
  lectorVisible.value = false
  notificacionSeleccionada.value = null
}

const handleMarkRead = (messageId) => {
  // Ya se maneja automáticamente desde seleccionarNotificacion
  console.log('Mensaje marcado como leído:', messageId)
}

const handleArchive = ({ id, archived }) => {
  if (archived) {
    mensajesStore.archivarMensajes([id])
  } else {
    mensajesStore.restaurarArchivado(id)
  }
}

const handleDelete = ({ id, deleted }) => {
  if (deleted) {
    mensajesStore.eliminarMensaje(id)
    cerrarLector()
  }
}

const handleReply = (message) => {
  console.log('Responder a:', message)
  abrirEditor('responder', message)
}

const handleReplyAll = (message) => {
  console.log('Responder a todos:', message)
  abrirEditor('responder', message)
}

const handleForward = (message) => {
  console.log('Reenviar:', message)
  abrirEditor('reenviar', message)
}

const handlePrevious = (previousMessage) => {
  notificacionSeleccionada.value = previousMessage
}

const handleNext = (nextMessage) => {
  notificacionSeleccionada.value = nextMessage
}

const handleStar = ({ id, starred }) => {
  const index = notificaciones.value.findIndex((n) => n.id === id)
  if (index > -1) {
    notificaciones.value[index].destacado = starred
  }
}

const handleActionCompleted = (messageId) => {
  console.log('Acción completada para mensaje:', messageId)
}

/******************** Editor de Mensajes ***********************/
const handleMensajeEnviado = ({ tipo, datos }) => {
  console.log('Mensaje enviado:', datos)
  recargar()
  if (tipo === 'mensaje') {
    recargar()
  }
}

const handleMensajeGuardado = ({ tipo, datos }) => {
  console.log('Mensaje guardado como borrador:', datos)
}

const handleEditorCancelado = () => {
  console.log('Editor cancelado')
}

/******************** Reinicializar vista ***********************/
const reinicializarVista = () => {
  filtroTipo.value = null
  filtroPrioridad.value = null
  search.value = ''
  paginaActual.value = 1
  notificacionesSeleccionadas.value = []
  todosSeleccionados.value = false
  notificacionSeleccionada.value = null
  lectorVisible.value = false
  carpetaSeleccionada.value = 'entrada'
}

/******************** Carga de la informacion ***********************/
onMounted(() => {
  cargar()
})

// Cargar información
const cargar = async () => {
  loading.value = true
  try {
    await mensajesStore.cargarNotificaciones()
    await usuarioStore.cargarListaUsuarios()
    await mensajesStore.cargarNotificacionesEnviadas()
    console.log('Carga completada:', mensajesStore.notificaciones.length, 'mensajes')
  } catch (error) {
    console.error('Error al cargar los mensajes', error)
    errorMsg('Error al cargar los mensajes')
  } finally {
    loading.value = false
  }
}

// Watch para sincronizar loading states
watch(
  () => mensajesStore.loading,
  (newVal) => {
    if (!newVal) {
      loading.value = false
    }
  },
)

// Watch para detectar cambios en el usuario
watch(
  () => usuarioStore.currentUser?.id,
  () => {
    reinicializarVista()
    cargar()
  },
)

// Watch para depurar cambios en las notificaciones
watch(
  () => mensajesStore.notificaciones,
  (newVal) => {
    console.log('Notificaciones actualizadas en store:', newVal.length)
  },
  { deep: true },
)
</script>

<style scoped>
/* Mantener todos tus estilos actuales */
.notificaciones-container {
  background: #f5f5f5;
  min-height: 100vh;
  max-width: 100% !important;
  margin: 0 !important;
}

/* ENCABEZADO HORIZONTAL */
.header-toolbar {
  background: transparent;
}

.header-card {
  background: white !important;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.folders-container {
  min-height: 48px;
  padding: 2px;
  gap: 4px;
}

.folder-btn {
  min-width: 100px;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.folder-btn:hover {
  transform: translateY(-1px);
}

.stats-summary {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.filters-toolbar {
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  min-height: 72px;
}

.compact-select :deep(.v-field) {
  font-size: 13px;
  min-height: 36px !important;
  background: white;
}

/* PAGINADOR EN EL ENCABEZADO */
.header-paginator {
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.items-per-page-control {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.items-select :deep(.v-field) {
  font-size: 13px;
  min-height: 32px !important;
  background: white;
}

.pagination-info {
  min-width: 200px;
  padding: 0 12px;
}

.page-numbers .v-btn {
  min-width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-weight: 500;
  font-size: 12px;
}

.page-numbers .v-btn.active-page {
  background: #2196f3 !important;
  color: white !important;
  border-color: #2196f3 !important;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
}

.page-numbers .v-btn:hover:not(.v-btn--disabled):not(.active-page) {
  background: #f0f0f0;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-numbers .v-btn.ellipsis-btn {
  background: transparent;
  border: none;
  box-shadow: none;
  cursor: default;
}

.page-numbers .v-btn.ellipsis-btn:hover {
  background: transparent;
  transform: none;
  box-shadow: none;
}

.page-selector {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.page-select :deep(.v-field) {
  font-size: 13px;
  min-height: 32px !important;
  background: white;
}

/* CONTENIDO PRINCIPAL - MODIFICADO PARA AJUSTARSE AL CONTENIDO */
.content-row {
  margin: 0 !important;
  background: #f5f5f5;
}

.messages-col-full {
  background: #ffffff;
  padding: 0 16px 16px 16px !important;
}

.messages-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  /* REMOVIMOS TODAS LAS PROPIEDADES DE ALTURA FIJA */
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0 !important;
}

.border-top {
  border-top: 1px solid #e0e0e0 !important;
}

.btn-clear {
  border-radius: 6px;
}

.action-btn {
  border-radius: 6px;
  text-transform: none;
  font-weight: 500;
  padding: 0 12px;
}

.search-field :deep(.v-field) {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.search-field :deep(.v-field--focused) {
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}

.view-toggle {
  border-radius: 8px;
}

/* LISTA DE MENSAJES - SE AJUSTA AL CONTENIDO */
.messages-list {
  background: transparent;
  /* REMOVEMOS TODAS LAS PROPIEDADES DE ALTURA FIJA */
  /* El contenedor se expandirá automáticamente según su contenido */
}

/* Estilos de mensajes (mantenidos de la versión anterior) */
.message-item {
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 0;
  margin: 0;
  min-height: 72px; /* Altura mínima para cada mensaje */
}

.message-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.message-item.unread {
  background: rgba(33, 150, 243, 0.05);
}

.message-item.selected {
  background: rgba(33, 150, 243, 0.1);
}

.message-item.important {
  background: rgba(255, 193, 7, 0.08);
}

.message-item.archived {
  background: rgba(255, 152, 0, 0.05);
}

.status-indicator {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.no_leido {
  background: #2196f3;
  box-shadow: 0 0 0 2px white;
}

.status-indicator.leido {
  background: #9e9e9e;
  box-shadow: 0 0 0 2px white;
}

.status-indicator.archivado {
  background: #ff9800;
  box-shadow: 0 0 0 2px white;
}

.message-icon {
  position: relative;
  z-index: 1;
}

.message-important {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: white;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.message-sender {
  display: flex;
  align-items: center;
  min-width: 220px;
  max-width: 220px;
}

.priority-chip {
  border-radius: 4px;
  font-weight: 600;
  font-size: 11px;
}

.message-time {
  font-size: 12px;
  opacity: 0.8;
}

.quick-actions {
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.message-item:hover .quick-actions {
  opacity: 1;
}

.quick-action {
  transition: all 0.2s ease;
}

.quick-action:hover {
  transform: scale(1.1);
}

.message-detail-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin: 12px !important;
}

.message-detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #2196f3;
}

.message-detail-card.unread {
  border-left: 4px solid #2196f3;
}

.message-detail-card.selected {
  border: 2px solid #2196f3;
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.15);
}

.message-detail-card.archived {
  border-color: #ff9800;
}

.avatar-container {
  position: relative;
}

.status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-dot.no_leido {
  background: #4caf50;
}

.status-dot.leido {
  background: #9e9e9e;
}

.status-dot.archivado {
  background: #ff9800;
}

.type-chip {
  border-radius: 6px;
  font-weight: 500;
}

.message-subject {
  font-size: 15px;
}

.message-preview {
  line-height: 1.5;
  opacity: 0.8;
}

.message-tags {
  flex-wrap: wrap;
}

.message-actions {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.message-detail-card:hover .message-actions {
  opacity: 1;
}

.empty-state {
  padding: 80px 20px;
}

.empty-icon {
  opacity: 0.3;
}

/* Responsive */
@media (max-width: 960px) {
  .header-toolbar {
    padding: 8px !important;
  }

  .folders-container {
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .stats-summary {
    display: none !important;
  }

  .messages-col-full {
    padding: 0 8px 8px 8px !important;
  }

  .message-sender {
    min-width: 180px !important;
    max-width: 180px !important;
  }

  .header-paginator {
    flex-direction: column;
    gap: 8px;
    padding: 12px;
  }

  .pagination-info {
    min-width: 100%;
    padding: 8px 0;
  }

  .page-numbers {
    justify-content: center;
  }

  .quick-actions {
    opacity: 1; /* Mostrar siempre en móvil */
  }
}

@media (max-width: 600px) {
  .notificaciones-container {
    padding: 0 !important;
  }

  .header-toolbar {
    padding: 4px !important;
  }

  .folder-btn {
    min-width: 80px;
    font-size: 12px;
    padding: 0 8px;
  }

  .message-item {
    padding: 12px !important;
    min-height: 64px;
  }

  .message-sender {
    min-width: 140px !important;
    max-width: 140px !important;
  }

  .header-paginator {
    padding: 8px;
  }

  .items-per-page-control,
  .page-selector {
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
  }

  .page-numbers .v-btn {
    min-width: 28px;
    height: 28px;
    font-size: 11px;
  }

  .action-bar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    padding: 16px !important;
  }

  .action-bar > div {
    width: 100%;
    justify-content: center;
  }

  .search-field {
    width: 100% !important;
  }

  .view-toggle {
    margin-left: 0 !important;
    margin-top: 8px;
  }

  .message-detail-card {
    margin: 8px !important;
  }

  .quick-actions {
    gap: 2px;
  }

  .quick-action {
    padding: 4px;
  }
}

.min-width-0 {
  min-width: 0;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Mejoras visuales para la barra de acciones */
.action-bar {
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0 !important;
}

/* Mejoras para el estado vacío con filtros */
.empty-state .v-btn {
  margin: 8px;
}

/* Scroll horizontal para carpetas en móvil */
.folders-container::-webkit-scrollbar {
  height: 4px;
}

.folders-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.folders-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.folders-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
