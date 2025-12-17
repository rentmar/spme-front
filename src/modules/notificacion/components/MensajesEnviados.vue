<template>
  <v-container class="mensajes-enviados-container pa-0">
    <!-- Overlay de carga -->
    <v-overlay :model-value="loading" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando mensajes enviados...</p>
      </div>
    </v-overlay>

    <template v-if="!loading && datosExisten">
      <!-- Encabezado -->
      <v-row class="ma-0 pa-4 header-bg">
        <v-col cols="12" class="pa-0">
          <pagina-titulo-icono
            :titulo="'Mensajes Enviados'"
            :subtitulo="'Historial de todos los mensajes que has enviado'"
            :icon="'mdi-send'"
          ></pagina-titulo-icono>
        </v-col>
      </v-row>

      <!-- Barra de herramientas -->
      <v-row class="ma-0 px-4 pt-0 pb-2">
        <v-col cols="12" class="pa-0">
          <v-card class="toolbar-card" elevation="1" flat rounded="lg">
            <div class="d-flex align-center justify-space-between pa-4">
              <!-- Filtros y búsqueda -->
              <div class="d-flex align-center gap-3 flex-grow-1">
                <div class="d-flex align-center gap-2">
                  <v-icon size="18" color="grey">mdi-filter</v-icon>
                  <span class="text-caption text-grey font-weight-medium">Filtrar:</span>
                </div>

                <!-- Filtro por destinatario -->
                <v-select
                  v-model="filtroDestinatario"
                  :items="destinatariosFiltro"
                  item-title="nombre"
                  item-value="id"
                  label="Destinatario"
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                  style="width: 200px"
                  class="compact-select"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-avatar size="32" :color="getAvatarColor(item.raw.nombre)" class="mr-2">
                          <span class="text-white text-caption">
                            {{ getIniciales(item.raw.nombre) }}
                          </span>
                        </v-avatar>
                      </template>
                      <v-list-item-title>
                        {{ item.raw.nombre }}
                        <span class="text-caption text-grey ml-2">
                          ({{ item.raw.count }} mensajes)
                        </span>
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-select>

                <!-- Filtro por tipo -->
                <v-select
                  v-model="filtroTipo"
                  :items="tiposFiltro"
                  item-title="nombre"
                  item-value="tipo"
                  label="Tipo"
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                  style="width: 160px"
                  class="compact-select"
                ></v-select>

                <!-- Búsqueda -->
                <v-text-field
                  v-model="search"
                  placeholder="Buscar en mensajes enviados..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  style="width: 240px"
                  clearable
                  class="search-field"
                >
                  <template v-slot:append-inner v-if="search">
                    <v-chip size="x-small" color="info" class="ml-1">
                      {{ mensajesFiltrados.length }}
                    </v-chip>
                  </template>
                </v-text-field>

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
              </div>

              <!-- Exportar y estadísticas -->
              <div class="d-flex align-center gap-3">
                <!-- Estadísticas rápidas -->
                <div class="d-flex align-center gap-4 stats-summary mr-4">
                  <div class="text-center">
                    <div class="text-body-1 font-weight-bold text-primary">
                      {{ estadisticas.total || 0 }}
                    </div>
                    <div class="text-caption text-grey">Total</div>
                  </div>
                  <v-divider vertical></v-divider>
                  <div class="text-center">
                    <div class="text-body-1 font-weight-bold text-success">
                      {{ Object.values(estadisticas.por_tipo || {}).reduce((a, b) => a + b, 0) }}
                    </div>
                    <div class="text-caption text-grey">Enviados</div>
                  </div>
                </div>

                <!-- Botón de exportar -->
                <v-btn
                  color="success"
                  size="small"
                  variant="tonal"
                  prepend-icon="mdi-microsoft-excel"
                  @click="exportarExcel"
                  :loading="exportando"
                  :disabled="mensajesFiltrados.length === 0"
                  class="export-btn"
                >
                  Exportar Excel
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Contenido principal -->
      <v-row class="ma-0 content-row">
        <v-col cols="12" class="pa-4">
          <v-card class="messages-card" elevation="2" rounded="lg">
            <!-- Lista de mensajes -->
            <div class="messages-list">
              <!-- Indicador de filtros -->
              <div v-if="filtrosActivos" class="px-4 pt-3">
                <v-alert type="info" density="comfortable" variant="tonal" class="mb-3">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon size="18" color="primary" class="mr-2">mdi-filter</v-icon>
                      <span class="text-body-2 font-weight-medium">
                        Mostrando {{ mensajesFiltrados.length }} de
                        {{ estadisticas.total || 0 }} mensajes enviados
                        <span v-if="filtrosActivosLista.length > 0">
                          (filtrado por: {{ filtrosActivosLista.map((f) => f.value).join(', ') }})
                        </span>
                      </span>
                    </div>
                    <v-btn
                      size="x-small"
                      variant="text"
                      color="error"
                      @click="limpiarFiltros"
                      class="text-caption"
                    >
                      <v-icon size="14" class="mr-1">mdi-filter-off</v-icon>
                      Limpiar filtros
                    </v-btn>
                  </div>
                </v-alert>
              </div>

              <template v-if="mensajesFiltrados.length > 0">
                <!-- Tabla de mensajes -->
                <v-table density="comfortable" class="messages-table">
                  <thead>
                    <tr>
                      <th class="text-left">ID</th>
                      <th class="text-left">Destinatario</th>
                      <th class="text-left">Asunto</th>
                      <th class="text-left">Tipo</th>
                      <th class="text-left">Fecha Envío</th>
                      <th class="text-left">Estado</th>
                      <th class="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="mensaje in mensajesFiltrados"
                      :key="mensaje.id"
                      :class="{
                        'unread-row': !mensaje.es_leido,
                        'urgent-row': mensaje.es_urgente,
                      }"
                      @click="verDetalle(mensaje)"
                      class="message-row"
                    >
                      <td>
                        <div class="message-id">
                          <v-icon size="16" class="mr-1" color="grey"> mdi-identifier </v-icon>
                          {{ mensaje.message_id }}
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-center">
                          <v-avatar
                            size="32"
                            :color="getAvatarColor(mensaje.destinatario?.nombre_completo)"
                            class="mr-2"
                          >
                            <span class="text-white text-caption">
                              {{ getIniciales(mensaje.destinatario?.nombre_completo) }}
                            </span>
                          </v-avatar>
                          <div>
                            <div class="text-body-2 font-weight-medium">
                              {{
                                mensaje.destinatario?.nombre_completo || 'Destinatario desconocido'
                              }}
                            </div>
                            <div class="text-caption text-grey">
                              @{{ mensaje.destinatario?.username }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="message-subject">
                          <div class="text-body-2 font-weight-medium truncate">
                            {{ mensaje.asunto || 'Sin asunto' }}
                          </div>
                          <div class="text-caption text-grey truncate">
                            {{ truncateText(mensaje.contenido, 60) }}
                          </div>
                        </div>
                      </td>
                      <td>
                        <v-chip
                          :color="getTipoColor(mensaje.tipo)"
                          size="x-small"
                          density="compact"
                          class="type-chip"
                        >
                          <v-icon size="12" class="mr-1">
                            {{ getTipoIcon(mensaje.tipo) }}
                          </v-icon>
                          {{ mensaje.tipo_display || getTipoTexto(mensaje.tipo) }}
                        </v-chip>
                      </td>
                      <td>
                        <div class="message-date">
                          <div class="text-body-2">
                            {{ formatDate(mensaje.fecha_envio) }}
                          </div>
                          <div class="text-caption text-grey">
                            {{ formatTime(mensaje.fecha_envio) }}
                          </div>
                        </div>
                      </td>
                      <td>
                        <v-chip
                          :color="getEstadoColor(mensaje.estado)"
                          size="x-small"
                          density="compact"
                          class="status-chip"
                        >
                          <v-icon size="12" class="mr-1">
                            {{ getEstadoIcon(mensaje.estado) }}
                          </v-icon>
                          {{ mensaje.estado_display || getEstadoTexto(mensaje.estado) }}
                        </v-chip>
                        <div v-if="mensaje.fecha_leido" class="text-caption text-grey mt-1">
                          Leído: {{ formatDate(mensaje.fecha_leido) }}
                        </div>
                      </td>
                      <td class="text-center">
                        <div class="d-flex justify-center gap-1">
                          <!-- Ver detalles -->
                          <v-btn
                            icon
                            size="x-small"
                            variant="text"
                            color="primary"
                            @click.stop="verDetalle(mensaje)"
                            title="Ver detalles"
                          >
                            <v-icon size="18">mdi-eye</v-icon>
                          </v-btn>

                          <!-- Descargar individual -->
                          <v-btn
                            icon
                            size="x-small"
                            variant="text"
                            color="success"
                            @click.stop="descargarIndividual(mensaje)"
                            title="Descargar mensaje"
                          >
                            <v-icon size="18">mdi-download</v-icon>
                          </v-btn>

                          <!-- Copiar ID -->
                          <v-btn
                            icon
                            size="x-small"
                            variant="text"
                            color="grey"
                            @click.stop="copiarId(mensaje)"
                            title="Copiar ID del mensaje"
                          >
                            <v-icon size="18">mdi-content-copy</v-icon>
                          </v-btn>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </v-table>

                <!-- Paginación -->
                <div
                  v-if="paginacion.total > itemsPorPagina"
                  class="d-flex align-center justify-space-between pa-4 border-top"
                >
                  <div class="text-caption text-grey">
                    Mostrando {{ inicioPagina }}-{{ finPagina }} de {{ paginacion.total }} mensajes
                  </div>
                  <div class="d-flex align-center gap-2">
                    <v-btn
                      icon="mdi-chevron-left"
                      size="small"
                      variant="text"
                      :disabled="paginaActual === 1"
                      @click="irAPagina(paginaActual - 1)"
                    ></v-btn>

                    <div class="d-flex gap-1">
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

                    <v-btn
                      icon="mdi-chevron-right"
                      size="small"
                      variant="text"
                      :disabled="paginaActual === totalPaginas"
                      @click="irAPagina(paginaActual + 1)"
                    ></v-btn>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="text-center py-12 empty-state">
                  <v-icon size="96" color="grey-lighten-3" class="empty-icon">
                    mdi-email-outline
                  </v-icon>
                  <p class="text-h6 text-grey mt-4">
                    {{ getMensajeVacio() }}
                  </p>
                  <p class="text-body-1 text-grey mt-2">
                    {{ getDescripcionVacia() }}
                  </p>
                  <v-btn
                    v-if="filtrosActivos"
                    color="primary"
                    variant="outlined"
                    class="mt-4"
                    prepend-icon="mdi-filter-off"
                    @click="limpiarFiltros"
                  >
                    Limpiar filtros
                  </v-btn>
                </div>
              </template>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Modal de detalles -->
      <v-dialog v-model="detalleVisible" max-width="800" scrollable>
        <v-card v-if="mensajeSeleccionado">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>
              <v-icon class="mr-2">mdi-email</v-icon>
              Detalles del Mensaje
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon @click="detalleVisible = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text class="pa-6">
            <!-- Información del mensaje -->
            <div class="mb-6">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="info-item mb-3">
                    <div class="text-caption text-grey mb-1">ID del Mensaje</div>
                    <div class="text-body-1 font-weight-medium">
                      <v-chip size="small" color="grey-lighten-4" class="mr-2">
                        {{ mensajeSeleccionado.message_id }}
                      </v-chip>
                    </div>
                  </div>

                  <div class="info-item mb-3">
                    <div class="text-caption text-grey mb-1">Asunto</div>
                    <div class="text-body-1 font-weight-bold">
                      {{ mensajeSeleccionado.asunto || 'Sin asunto' }}
                    </div>
                  </div>

                  <div class="info-item mb-3">
                    <div class="text-caption text-grey mb-1">Tipo</div>
                    <v-chip
                      :color="getTipoColor(mensajeSeleccionado.tipo)"
                      size="small"
                      class="mr-2"
                    >
                      <v-icon size="14" class="mr-1">
                        {{ getTipoIcon(mensajeSeleccionado.tipo) }}
                      </v-icon>
                      {{
                        mensajeSeleccionado.tipo_display || getTipoTexto(mensajeSeleccionado.tipo)
                      }}
                    </v-chip>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-item mb-3">
                    <div class="text-caption text-grey mb-1">Prioridad</div>
                    <v-chip
                      :color="mensajeSeleccionado.prioridad >= 4 ? 'error' : 'info'"
                      size="small"
                    >
                      <v-icon size="14" class="mr-1">
                        {{ mensajeSeleccionado.prioridad >= 4 ? 'mdi-alert' : 'mdi-information' }}
                      </v-icon>
                      Nivel {{ mensajeSeleccionado.prioridad }}
                      <span v-if="mensajeSeleccionado.es_urgente"> (Urgente)</span>
                    </v-chip>
                  </div>

                  <div class="info-item mb-3">
                    <div class="text-caption text-grey mb-1">Fecha de Envío</div>
                    <div class="text-body-1">
                      {{ formatDateTime(mensajeSeleccionado.fecha_envio) }}
                    </div>
                  </div>

                  <div class="info-item mb-3">
                    <div class="text-caption text-grey mb-1">Estado</div>
                    <v-chip :color="getEstadoColor(mensajeSeleccionado.estado)" size="small">
                      <v-icon size="14" class="mr-1">
                        {{ getEstadoIcon(mensajeSeleccionado.estado) }}
                      </v-icon>
                      {{
                        mensajeSeleccionado.estado_display ||
                        getEstadoTexto(mensajeSeleccionado.estado)
                      }}
                    </v-chip>
                    <div v-if="mensajeSeleccionado.fecha_leido" class="text-caption text-grey mt-1">
                      Leído el: {{ formatDateTime(mensajeSeleccionado.fecha_leido) }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- Remitente y Destinatario -->
            <v-row class="mb-6">
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-3">
                  <div class="text-caption text-grey mb-2">Remitente (Tú)</div>
                  <div class="d-flex align-center">
                    <v-avatar
                      size="48"
                      :color="getAvatarColor(usuarioActual?.nombre_completo)"
                      class="mr-3"
                    >
                      <span class="text-white">
                        {{ getIniciales(usuarioActual?.nombre_completo) }}
                      </span>
                    </v-avatar>
                    <div>
                      <div class="text-body-1 font-weight-bold">
                        {{ usuarioActual?.nombre_completo }}
                      </div>
                      <div class="text-caption text-grey">@{{ usuarioActual?.username }}</div>
                      <div class="text-caption text-grey">
                        {{ usuarioActual?.email }}
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-3">
                  <div class="text-caption text-grey mb-2">Destinatario</div>
                  <div class="d-flex align-center">
                    <v-avatar
                      size="48"
                      :color="getAvatarColor(mensajeSeleccionado.destinatario?.nombre_completo)"
                      class="mr-3"
                    >
                      <span class="text-white">
                        {{ getIniciales(mensajeSeleccionado.destinatario?.nombre_completo) }}
                      </span>
                    </v-avatar>
                    <div>
                      <div class="text-body-1 font-weight-bold">
                        {{ mensajeSeleccionado.destinatario?.nombre_completo }}
                      </div>
                      <div class="text-caption text-grey">
                        @{{ mensajeSeleccionado.destinatario?.username }}
                      </div>
                      <div class="text-caption text-grey">
                        ID: {{ mensajeSeleccionado.destinatario?.id }}
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Contenido del mensaje -->
            <v-card variant="outlined" class="mb-6">
              <v-card-title class="text-body-1 font-weight-bold pa-4">
                <v-icon class="mr-2">mdi-text</v-icon>
                Contenido del Mensaje
              </v-card-title>
              <v-card-text class="pa-4 message-content">
                <div class="text-body-1 white-space-pre-line">
                  {{ mensajeSeleccionado.contenido }}
                </div>
              </v-card-text>
            </v-card>

            <!-- Metadatos adicionales -->
            <!-- <v-expansion-panels variant="accordion" class="mb-4">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="mr-2">mdi-information</v-icon>
                  Información Adicional
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="info-item mb-2">
                        <div class="text-caption text-grey">Actividad</div>
                        <div class="text-body-2">
                          {{
                            mensajeSeleccionado.actividad_id
                              ? `ID: ${mensajeSeleccionado.actividad_id}`
                              : 'No asociada'
                          }}
                        </div>
                      </div>

                      <div class="info-item mb-2">
                        <div class="text-caption text-grey">Proyecto</div>
                        <div class="text-body-2">
                          {{
                            mensajeSeleccionado.proyecto_id
                              ? `ID: ${mensajeSeleccionado.proyecto_id}`
                              : 'No asociado'
                          }}
                        </div>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="info-item mb-2">
                        <div class="text-caption text-grey">Acción requerida</div>
                        <div class="text-body-2">
                          {{ mensajeSeleccionado.tiene_accion ? 'Sí' : 'No' }}
                        </div>
                        <div v-if="mensajeSeleccionado.accion_url" class="text-caption">
                          URL: {{ mensajeSeleccionado.accion_url }}
                        </div>
                      </div>

                      <div class="info-item mb-2">
                        <div class="text-caption text-grey">Fecha de expiración</div>
                        <div class="text-body-2">
                          {{
                            mensajeSeleccionado.fecha_expiracion
                              ? formatDateTime(mensajeSeleccionado.fecha_expiracion)
                              : 'Sin expiración'
                          }}
                        </div>
                        <div v-if="mensajeSeleccionado.es_expirado" class="text-caption text-error">
                          (Expirado)
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <div
                    v-if="Object.keys(mensajeSeleccionado.metadata || {}).length > 0"
                    class="mt-4"
                  >
                    <div class="text-caption text-grey mb-2">Metadatos</div>
                    <v-card variant="outlined">
                      <v-card-text>
                        <pre class="metadata-json">{{
                          JSON.stringify(mensajeSeleccionado.metadata, null, 2)
                        }}</pre>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels> -->
          </v-card-text>

          <v-card-actions class="pa-4 border-top">
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              variant="tonal"
              prepend-icon="mdi-download"
              @click="descargarIndividual(mensajeSeleccionado)"
            >
              Descargar
            </v-btn>
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-content-copy"
              @click="copiarId(mensajeSeleccionado)"
            >
              Copiar ID
            </v-btn>
            <v-btn variant="outlined" @click="detalleVisible = false"> Cerrar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <!-- Estado sin datos -->
    <template v-if="!loading && !datosExisten">
      <div class="text-center py-16">
        <v-icon size="96" color="grey-lighten-3" class="mb-4"> mdi-email-off-outline </v-icon>
        <p class="text-h6 text-grey mb-2">No hay datos disponibles</p>
        <p class="text-body-1 text-grey mb-6">
          No se pudieron cargar los mensajes enviados. Por favor, intente nuevamente.
        </p>
        <v-btn color="primary" @click="cargarDatos" prepend-icon="mdi-refresh"> Reintentar </v-btn>
      </div>
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from '@/composables/useSnackbar'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// Props modificados para recibir datos
const props = defineProps({
  datosMensajes: {
    type: Object,
    default: () => ({
      success: false,
      data: {
        mensajes: [],
        paginacion: {},
        estadisticas: {},
      },
    }),
  },
})

// Estado
const loading = ref(true)
const exportando = ref(false)
const mensajes = ref([])
const filtroDestinatario = ref(null)
const filtroTipo = ref(null)
const search = ref('')
const mensajeSeleccionado = ref(null)
const detalleVisible = ref(false)

// Paginación
const paginaActual = ref(1)
const itemsPorPagina = ref(20)

// Stores y composables
const usuarioStore = useUserStore()
const { successMsg, errorMsg } = useSnackbar()

// Datos de la API
const estadisticas = ref({})
const paginacion = ref({})

// Computed
const usuarioActual = computed(() => usuarioStore.currentUser)

// Verificar si los datos existen
const datosExisten = computed(() => {
  return (
    props.datosMensajes?.success === true &&
    Array.isArray(props.datosMensajes.data?.mensajes) &&
    props.datosMensajes.data.mensajes.length > 0
  )
})

const destinatariosFiltro = computed(() => {
  if (!estadisticas.value.por_destinatario) return []

  const destinatariosMap = new Map()

  estadisticas.value.por_destinatario.forEach((d) => {
    destinatariosMap.set(d.destinatario_id, {
      id: d.destinatario_id,
      nombre: d.nombre_completo || d.username,
      username: d.username,
      count: d.count,
    })
  })

  return Array.from(destinatariosMap.values()).sort((a, b) => a.nombre.localeCompare(b.nombre))
})

const tiposFiltro = computed(() => {
  const tipos = []
  if (estadisticas.value.por_tipo) {
    Object.entries(estadisticas.value.por_tipo).forEach(([tipo, count]) => {
      tipos.push({
        tipo,
        nombre: getTipoTexto(tipo),
        count,
      })
    })
  }
  return tipos.sort((a, b) => a.nombre.localeCompare(b.nombre))
})

const filtrosActivos = computed(() => {
  return filtroDestinatario.value !== null || filtroTipo.value !== null || search.value !== ''
})

const filtrosActivosLista = computed(() => {
  const filtros = []

  if (filtroDestinatario.value) {
    const destinatario = destinatariosFiltro.value.find((d) => d.id === filtroDestinatario.value)
    if (destinatario) {
      filtros.push({
        key: 'destinatario',
        label: 'Destinatario',
        value: destinatario.nombre,
      })
    }
  }

  if (filtroTipo.value) {
    const tipo = tiposFiltro.value.find((t) => t.tipo === filtroTipo.value)
    if (tipo) {
      filtros.push({
        key: 'tipo',
        label: 'Tipo',
        value: tipo.nombre,
      })
    }
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

const mensajesFiltrados = computed(() => {
  let filtered = mensajes.value

  // Filtrar por destinatario
  if (filtroDestinatario.value) {
    filtered = filtered.filter((m) => m.destinatario?.id === filtroDestinatario.value)
  }

  // Filtrar por tipo
  if (filtroTipo.value) {
    filtered = filtered.filter((m) => m.tipo === filtroTipo.value)
  }

  // Filtrar por búsqueda
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(
      (m) =>
        m.asunto?.toLowerCase().includes(searchLower) ||
        m.contenido?.toLowerCase().includes(searchLower) ||
        m.destinatario?.nombre_completo?.toLowerCase().includes(searchLower) ||
        m.message_id?.toLowerCase().includes(searchLower),
    )
  }

  return filtered
})

// Paginación computada
const totalPaginas = computed(() => {
  return Math.max(1, Math.ceil(mensajesFiltrados.value.length / itemsPorPagina.value))
})

const inicioPagina = computed(() => {
  return (paginaActual.value - 1) * itemsPorPagina.value + 1
})

const finPagina = computed(() => {
  const fin = paginaActual.value * itemsPorPagina.value
  return Math.min(fin, mensajesFiltrados.value.length)
})

const paginasNumeros = computed(() => {
  const paginas = []
  const total = totalPaginas.value
  const actual = paginaActual.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      paginas.push(i)
    }
  } else {
    if (actual <= 4) {
      for (let i = 1; i <= 5; i++) {
        paginas.push(i)
      }
      paginas.push('...')
      paginas.push(total)
    } else if (actual >= total - 3) {
      paginas.push(1)
      paginas.push('...')
      for (let i = total - 4; i <= total; i++) {
        paginas.push(i)
      }
    } else {
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

// Funciones de utilidad
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
  const map = {
    privado: 'Privado',
    sistema: 'Sistema',
    alerta: 'Alerta',
    recordatorio: 'Recordatorio',
    reprogramacion: 'Reprogramación',
    retraso: 'Retraso',
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

const getTipoIcon = (tipo) => {
  const map = {
    privado: 'mdi-email',
    sistema: 'mdi-cog',
    alerta: 'mdi-alert',
    recordatorio: 'mdi-bell',
    reprogramacion: 'mdi-calendar-sync',
    retraso: 'mdi-clock-alert',
    reunion: 'mdi-account-group',
    social: 'mdi-account',
    administrativo: 'mdi-file-document',
    feedback: 'mdi-comment',
    comentario: 'mdi-message-text',
    capacitacion: 'mdi-school',
  }
  return map[tipo] || 'mdi-email'
}

const getEstadoTexto = (estado) => {
  const map = {
    no_leido: 'No Leído',
    leido: 'Leído',
    archivado: 'Archivado',
    eliminado: 'Eliminado',
  }
  return map[estado] || estado.charAt(0).toUpperCase() + estado.slice(1)
}

const getEstadoColor = (estado) => {
  const map = {
    no_leido: 'primary',
    leido: 'success',
    archivado: 'warning',
    eliminado: 'error',
  }
  return map[estado] || 'grey'
}

const getEstadoIcon = (estado) => {
  const map = {
    no_leido: 'mdi-email',
    leido: 'mdi-email-open',
    archivado: 'mdi-archive',
    eliminado: 'mdi-delete',
  }
  return map[estado] || 'mdi-email'
}

const getMensajeVacio = () => {
  if (filtrosActivos.value) {
    return 'No hay mensajes con los filtros aplicados'
  }
  return 'No has enviado mensajes aún'
}

const getDescripcionVacia = () => {
  if (filtrosActivos.value) {
    return 'Intenta ajustar los filtros de búsqueda o limpiarlos para ver todos los mensajes'
  }
  return 'Los mensajes que envíes aparecerán aquí'
}

// Funciones de filtros
const limpiarFiltros = () => {
  filtroDestinatario.value = null
  filtroTipo.value = null
  search.value = ''
  paginaActual.value = 1
}

const removerFiltro = (key) => {
  if (key === 'destinatario') {
    filtroDestinatario.value = null
  } else if (key === 'tipo') {
    filtroTipo.value = null
  } else if (key === 'busqueda') {
    search.value = ''
  }
  paginaActual.value = 1
}

// Funciones de paginación
const irAPagina = (nuevaPagina) => {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
    scrollToTop()
  }
}

const scrollToTop = () => {
  const messagesList = document.querySelector('.messages-list')
  if (messagesList) {
    messagesList.scrollTop = 0
  }
}

// Funciones de mensajes
const verDetalle = (mensaje) => {
  mensajeSeleccionado.value = mensaje
  detalleVisible.value = true
}

const copiarId = async (mensaje) => {
  try {
    await navigator.clipboard.writeText(mensaje.message_id)
    successMsg('ID copiado al portapapeles')
  } catch (error) {
    console.error('Error al copiar ID:', error)
    errorMsg('No se pudo copiar el ID')
  }
}

const descargarIndividual = (mensaje) => {
  const workbook = XLSX.utils.book_new()

  // Crear datos del mensaje
  const data = [
    ['ID del Mensaje', mensaje.message_id],
    ['Asunto', mensaje.asunto || 'Sin asunto'],
    ['Contenido', mensaje.contenido],
    ['Tipo', mensaje.tipo_display || getTipoTexto(mensaje.tipo)],
    ['Estado', mensaje.estado_display || getEstadoTexto(mensaje.estado)],
    ['Prioridad', mensaje.prioridad],
    ['Urgente', mensaje.es_urgente ? 'Sí' : 'No'],
    ['Fecha de Envío', formatDateTime(mensaje.fecha_envio)],
    ['Fecha de Lectura', mensaje.fecha_leido ? formatDateTime(mensaje.fecha_leido) : 'No leído'],
    [
      'Fecha de Expiración',
      mensaje.fecha_expiracion ? formatDateTime(mensaje.fecha_expiracion) : 'Sin expiración',
    ],
    ['Expiración', mensaje.es_expirado ? 'Expirado' : 'Vigente'],
    ['Acción requerida', mensaje.tiene_accion ? 'Sí' : 'No'],
    ['URL de Acción', mensaje.accion_url || ''],
    ['Remitente (ID)', usuarioActual.value?.id],
    ['Remitente', usuarioActual.value?.nombre_completo],
    ['Destinatario (ID)', mensaje.destinatario?.id],
    ['Destinatario', mensaje.destinatario?.nombre_completo],
    ['Username Destinatario', mensaje.destinatario?.username],
    ['Actividad ID', mensaje.actividad_id || ''],
    ['Proyecto ID', mensaje.proyecto_id || ''],
    ['Referencia ID', mensaje.referencia_id || ''],
    ['Ícono', mensaje.icono || ''],
    ['Metadatos', JSON.stringify(mensaje.metadata || {}, null, 2)],
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(data)
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mensaje')

  // Generar Excel
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const filename = `mensaje_${mensaje.message_id}_${formatDate(mensaje.fecha_envio)}.xlsx`
  saveAs(blob, filename)
  successMsg('Mensaje descargado exitosamente')
}

const exportarExcel = async () => {
  exportando.value = true

  try {
    const workbook = XLSX.utils.book_new()

    // Preparar datos para Excel
    const datosExcel = mensajesFiltrados.value.map((mensaje) => ({
      'ID Mensaje': mensaje.message_id,
      Asunto: mensaje.asunto || 'Sin asunto',
      Contenido: mensaje.contenido,
      Tipo: mensaje.tipo_display || getTipoTexto(mensaje.tipo),
      Estado: mensaje.estado_display || getEstadoTexto(mensaje.estado),
      Prioridad: mensaje.prioridad,
      Urgente: mensaje.es_urgente ? 'Sí' : 'No',
      'Fecha Envío': formatDateTime(mensaje.fecha_envio),
      'Fecha Lectura': mensaje.fecha_leido ? formatDateTime(mensaje.fecha_leido) : 'No leído',
      'Fecha Expiración': mensaje.fecha_expiracion
        ? formatDateTime(mensaje.fecha_expiracion)
        : 'Sin expiración',
      Expiración: mensaje.es_expirado ? 'Expirado' : 'Vigente',
      'Acción requerida': mensaje.tiene_accion ? 'Sí' : 'No',
      'URL Acción': mensaje.accion_url || '',
      'Remitente ID': usuarioActual.value?.id,
      Remitente: usuarioActual.value?.nombre_completo,
      'Destinatario ID': mensaje.destinatario?.id,
      Destinatario: mensaje.destinatario?.nombre_completo,
      'Username Destinatario': mensaje.destinatario?.username,
      'Actividad ID': mensaje.actividad_id || '',
      'Proyecto ID': mensaje.proyecto_id || '',
      'Referencia ID': mensaje.referencia_id || '',
      Ícono: mensaje.icono || '',
    }))

    const worksheet = XLSX.utils.json_to_sheet(datosExcel)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mensajes Enviados')

    // Ajustar anchos de columna
    const wscols = [
      { wch: 20 }, // ID Mensaje
      { wch: 30 }, // Asunto
      { wch: 50 }, // Contenido
      { wch: 15 }, // Tipo
      { wch: 15 }, // Estado
      { wch: 10 }, // Prioridad
      { wch: 10 }, // Urgente
      { wch: 20 }, // Fecha Envío
      { wch: 20 }, // Fecha Lectura
      { wch: 20 }, // Fecha Expiración
      { wch: 10 }, // Expiración
      { wch: 15 }, // Acción requerida
      { wch: 30 }, // URL Acción
      { wch: 12 }, // Remitente ID
      { wch: 25 }, // Remitente
      { wch: 12 }, // Destinatario ID
      { wch: 25 }, // Destinatario
      { wch: 15 }, // Username Destinatario
      { wch: 12 }, // Actividad ID
      { wch: 12 }, // Proyecto ID
      { wch: 15 }, // Referencia ID
      { wch: 10 }, // Ícono
    ]
    worksheet['!cols'] = wscols

    // Generar Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const fecha = new Date().toISOString().split('T')[0]
    const filename = `mensajes_enviados_${fecha}.xlsx`

    saveAs(blob, filename)
    successMsg(`Se exportaron ${mensajesFiltrados.value.length} mensajes a Excel`)
  } catch (error) {
    console.error('Error al exportar Excel:', error)
    errorMsg('Error al exportar a Excel')
  } finally {
    exportando.value = false
  }
}

// Cargar datos desde props
const cargarDatosDesdeProps = () => {
  if (props.datosMensajes?.success === true) {
    mensajes.value = props.datosMensajes.data.mensajes || []
    estadisticas.value = props.datosMensajes.data.estadisticas || {}
    paginacion.value = props.datosMensajes.data.paginacion || {}
  } else {
    mensajes.value = []
    estadisticas.value = {}
    paginacion.value = {}
  }
}

// Watch para reaccionar a cambios en los props
watch(
  () => props.datosMensajes,
  (newVal) => {
    if (newVal?.success === true) {
      cargarDatosDesdeProps()
      loading.value = false
    } else {
      loading.value = false
    }
  },
  { immediate: true, deep: true },
)

// Cargar datos
const cargarDatos = () => {
  loading.value = true
  setTimeout(() => {
    cargarDatosDesdeProps()
    loading.value = false
  }, 500)
}

// Inicialización
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.mensajes-enviados-container {
  background: #f5f5f5;
  min-height: 100vh;
  max-width: 100% !important;
  margin: 0 !important;
}

/* Encabezado */
.header-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Tarjeta de herramientas */
.toolbar-card {
  background: white !important;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.compact-select :deep(.v-field) {
  font-size: 13px;
  min-height: 36px !important;
  background: white;
}

.search-field :deep(.v-field) {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.search-field :deep(.v-field--focused) {
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}

.stats-summary {
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.export-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
}

/* Tabla de mensajes */
.messages-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.messages-table {
  width: 100%;
}

.messages-table th {
  font-weight: 600;
  color: #666;
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 1;
}

.messages-table tr:hover {
  background: rgba(33, 150, 243, 0.04);
}

.message-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.message-row:hover {
  background-color: rgba(33, 150, 243, 0.05) !important;
}

.unread-row {
  background: rgba(33, 150, 243, 0.08);
}

.urgent-row {
  background: rgba(255, 193, 7, 0.08);
}

.message-id {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #666;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}

.type-chip,
.status-chip {
  border-radius: 6px;
  font-weight: 500;
}

.message-date {
  min-width: 120px;
}

/* Paginación */
.border-top {
  border-top: 1px solid #e0e0e0 !important;
}

.active-page {
  background: #2196f3 !important;
  color: white !important;
  border-color: #2196f3 !important;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
}

.ellipsis-btn {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  cursor: default;
}

/* Estado vacío */
.empty-state {
  padding: 80px 20px;
}

.empty-icon {
  opacity: 0.3;
}

/* Modal de detalles */
.white-space-pre-line {
  white-space: pre-line;
}

.message-content {
  background: #f9f9f9;
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
}

.info-item {
  margin-bottom: 16px;
}

.metadata-json {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Responsive */
@media (max-width: 960px) {
  .toolbar-card .d-flex {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .compact-select,
  .search-field {
    width: 100% !important;
  }

  .stats-summary {
    margin-right: 0 !important;
    justify-content: center;
  }

  .messages-table {
    display: block;
    overflow-x: auto;
  }

  .truncate {
    max-width: 150px;
  }
}

@media (max-width: 600px) {
  .mensajes-enviados-container {
    padding: 0 !important;
  }

  .messages-card {
    border-radius: 0;
    border: none;
  }

  .message-date {
    min-width: 100px;
  }

  .truncate {
    max-width: 100px;
  }
}
</style>
