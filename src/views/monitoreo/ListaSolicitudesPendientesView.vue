<template>
  <v-container class="solicitudes-container pa-0">
    <!-- Overlay de carga -->
    <v-overlay
      :model-value="loading || storeValidacionesForm.loading"
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
        <p class="mt-4 text-h6">Cargando solicitudes...</p>
      </div>
    </v-overlay>

    <template v-if="!loading && !storeValidacionesForm.loading">
      <!-- ENCABEZADO -->
      <v-row class="ma-0 pa-4 header-bg">
        <v-col cols="12" class="pa-0">
          <div class="d-flex align-center justify-space-between flex-wrap gap-4">
            <pagina-titulo-icono
              titulo="Solicitudes Pendientes"
              subtitulo="Gestion de solicitudes pendientes"
              icon="mdi-file-document-check-outline"
            ></pagina-titulo-icono>

            <!-- Resumen rápido -->
            <div class="d-flex align-center gap-2 stats-summary">
              <div class="text-center px-3">
                <div class="text-body-1 font-weight-bold text-primary">
                  {{ totalSolicitudes }}
                </div>
                <div class="text-caption text-grey">Total</div>
              </div>
              <v-divider vertical></v-divider>
              <div class="text-center px-3">
                <div class="text-body-1 font-weight-bold text-warning">
                  {{ solicitudesPendientes }}
                </div>
                <div class="text-caption text-grey">Pendientes</div>
              </div>
              <v-divider vertical></v-divider>
              <div class="text-center px-3">
                <div class="text-body-1 font-weight-bold text-success">
                  {{ solicitudesAprobadas }}
                </div>
                <div class="text-caption text-grey">Aprobadas</div>
              </div>
              <v-divider vertical></v-divider>
              <div class="text-center px-3">
                <div class="text-body-1 font-weight-bold text-error">
                  {{ solicitudesRechazadas }}
                </div>
                <div class="text-caption text-grey">Rechazadas</div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- TABS PRINCIPALES -->
      <v-row class="ma-0 px-4 pt-0 pb-2">
        <v-col cols="12" class="pa-0">
          <v-sheet color="transparent" elevation="0">
            <v-tabs
              v-model="tabActivo"
              color="primary"
              slider-color="#f78166"
              height="56"
              class="mb-2"
            >
              <v-tab
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :prepend-icon="tab.icon"
                class="text-none"
              >
                {{ tab.text }}
                <v-badge
                  v-if="tab.count > 0"
                  :content="tab.count"
                  :color="tab.badgeColor"
                  inline
                  class="ml-2"
                ></v-badge>
              </v-tab>
            </v-tabs>

            <!-- CONTENIDO DE CADA TAB -->
            <v-tabs-window v-model="tabActivo">
              <!-- TAB: TODOS -->
              <v-tabs-window-item value="todos">
                <v-card class="tab-content-card" elevation="1" rounded="lg">
                  <div class="d-flex align-center pa-3 gap-3 filters-toolbar flex-wrap">
                    <div class="d-flex align-center gap-2">
                      <v-icon size="18" color="grey">mdi-filter</v-icon>
                      <span class="text-caption text-grey font-weight-medium">Filtros:</span>
                    </div>

                    <v-select
                      v-model="filtrosTodos.estado"
                      :items="opcionesEstado"
                      item-title="title"
                      item-value="value"
                      label="Estado"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 150px"
                      class="compact-select"
                    ></v-select>

                    <v-text-field
                      v-model="filtrosTodos.busqueda"
                      placeholder="Buscar por código o solicitante..."
                      prepend-inner-icon="mdi-magnify"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      style="min-width: 280px"
                      class="compact-select"
                    ></v-text-field>

                    <v-spacer></v-spacer>

                    <v-btn
                      v-if="tieneFiltrosActivos('todos')"
                      size="small"
                      variant="text"
                      color="error"
                      @click="limpiarFiltros('todos')"
                    >
                      <v-icon size="16">mdi-filter-off</v-icon>
                      Limpiar
                    </v-btn>
                  </div>

                  <ListaSolicitudesPendientesTodos
                    :solicitudes="solicitudesFiltradasTodos"
                    @ver-detalle="verDetalle"
                    @accion="manejarAccion"
                  />
                </v-card>
              </v-tabs-window-item>

              <!-- TAB: SOLICITUD DE FONDOS -->
              <v-tabs-window-item value="fondos">
                <v-card class="tab-content-card" elevation="1" rounded="lg">
                  <div class="d-flex align-center pa-3 gap-3 filters-toolbar flex-wrap">
                    <div class="d-flex align-center gap-2">
                      <v-icon size="18" color="grey">mdi-filter</v-icon>
                      <span class="text-caption text-grey font-weight-medium">Filtros:</span>
                    </div>

                    <v-select
                      v-model="filtrosFondos.estado"
                      :items="opcionesEstado"
                      item-title="title"
                      item-value="value"
                      label="Estado"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 150px"
                      class="compact-select"
                    ></v-select>

                    <v-text-field
                      v-model="filtrosFondos.actividad"
                      placeholder="Código de actividad"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 200px"
                      class="compact-select"
                    ></v-text-field>

                    <v-text-field
                      v-model="filtrosFondos.montoMinimo"
                      label="Monto mínimo"
                      type="number"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 160px"
                      class="compact-select"
                      prefix="Bs."
                    ></v-text-field>

                    <v-spacer></v-spacer>

                    <v-btn
                      v-if="tieneFiltrosActivos('fondos')"
                      size="small"
                      variant="text"
                      color="error"
                      @click="limpiarFiltros('fondos')"
                    >
                      <v-icon size="16">mdi-filter-off</v-icon>
                      Limpiar
                    </v-btn>
                  </div>

                  <ListaSolicitudFondosPendientes
                    :solicitudes="solicitudesFiltradasFondos"
                    @ver-detalle="verDetalle"
                    @accion="manejarAccion"
                  />
                </v-card>
              </v-tabs-window-item>

              <!-- TAB: SOLICITUD DE VIAJES -->
              <v-tabs-window-item value="viajes">
                <v-card class="tab-content-card" elevation="1" rounded="lg">
                  <div class="d-flex align-center pa-3 gap-3 filters-toolbar flex-wrap">
                    <div class="d-flex align-center gap-2">
                      <v-icon size="18" color="grey">mdi-filter</v-icon>
                      <span class="text-caption text-grey font-weight-medium">Filtros:</span>
                    </div>

                    <v-select
                      v-model="filtrosViajes.estado"
                      :items="opcionesEstado"
                      item-title="title"
                      item-value="value"
                      label="Estado"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 150px"
                      class="compact-select"
                    ></v-select>

                    <v-text-field
                      v-model="filtrosViajes.destino"
                      placeholder="Destino"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 180px"
                      class="compact-select"
                    ></v-text-field>

                    <v-text-field
                      v-model="filtrosViajes.busqueda"
                      placeholder="Buscar..."
                      prepend-inner-icon="mdi-magnify"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      style="min-width: 220px"
                      class="compact-select"
                    ></v-text-field>

                    <v-spacer></v-spacer>

                    <v-btn
                      v-if="tieneFiltrosActivos('viajes')"
                      size="small"
                      variant="text"
                      color="error"
                      @click="limpiarFiltros('viajes')"
                    >
                      <v-icon size="16">mdi-filter-off</v-icon>
                      Limpiar
                    </v-btn>
                  </div>

                  <ListaSolicitudViajesPendientes
                    :solicitudes="solicitudesFiltradasViajes"
                    @ver-detalle="verDetalle"
                    @accion="manejarAccion"
                  />
                </v-card>
              </v-tabs-window-item>

              <!-- TAB: SOLICITUD DE PAGO DIRECTO -->
              <v-tabs-window-item value="pago_directo">
                <v-card class="tab-content-card" elevation="1" rounded="lg">
                  <div class="d-flex align-center pa-3 gap-3 filters-toolbar flex-wrap">
                    <div class="d-flex align-center gap-2">
                      <v-icon size="18" color="grey">mdi-filter</v-icon>
                      <span class="text-caption text-grey font-weight-medium">Filtros:</span>
                    </div>

                    <v-select
                      v-model="filtrosPagoDirecto.estado"
                      :items="opcionesEstado"
                      item-title="title"
                      item-value="value"
                      label="Estado"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 150px"
                      class="compact-select"
                    ></v-select>

                    <v-text-field
                      v-model="filtrosPagoDirecto.proveedor"
                      placeholder="Proveedor"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 200px"
                      class="compact-select"
                    ></v-text-field>

                    <v-text-field
                      v-model="filtrosPagoDirecto.factura"
                      placeholder="N° Factura"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 180px"
                      class="compact-select"
                    ></v-text-field>

                    <v-spacer></v-spacer>

                    <v-btn
                      v-if="tieneFiltrosActivos('pago_directo')"
                      size="small"
                      variant="text"
                      color="error"
                      @click="limpiarFiltros('pago_directo')"
                    >
                      <v-icon size="16">mdi-filter-off</v-icon>
                      Limpiar
                    </v-btn>
                  </div>

                  <ListaSolicitudPagoDirectoPendientes
                    :solicitudes="solicitudesFiltradasPagoDirecto"
                    @ver-detalle="verDetalle"
                    @accion="manejarAccion"
                  />
                </v-card>
              </v-tabs-window-item>

              <!-- TAB: SOLICITUD DE REPOSICIÓN -->
              <v-tabs-window-item value="reposicion">
                <v-card class="tab-content-card" elevation="1" rounded="lg">
                  <div class="d-flex align-center pa-3 gap-3 filters-toolbar flex-wrap">
                    <div class="d-flex align-center gap-2">
                      <v-icon size="18" color="grey">mdi-filter</v-icon>
                      <span class="text-caption text-grey font-weight-medium">Filtros:</span>
                    </div>

                    <v-select
                      v-model="filtrosReposicion.estado"
                      :items="opcionesEstado"
                      item-title="title"
                      item-value="value"
                      label="Estado"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 150px"
                      class="compact-select"
                    ></v-select>

                    <v-text-field
                      v-model="filtrosReposicion.tipoGasto"
                      placeholder="Tipo de gasto"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 180px"
                      class="compact-select"
                    ></v-text-field>

                    <v-text-field
                      v-model="filtrosReposicion.montoMinimo"
                      label="Monto mínimo"
                      type="number"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 160px"
                      class="compact-select"
                      prefix="Bs."
                    ></v-text-field>

                    <v-spacer></v-spacer>

                    <v-btn
                      v-if="tieneFiltrosActivos('reposicion')"
                      size="small"
                      variant="text"
                      color="error"
                      @click="limpiarFiltros('reposicion')"
                    >
                      <v-icon size="16">mdi-filter-off</v-icon>
                      Limpiar
                    </v-btn>
                  </div>

                  <ListaSolicitudReposicionPendientes
                    :solicitudes="solicitudesFiltradasReposicion"
                    @ver-detalle="verDetalle"
                    @accion="manejarAccion"
                  />
                </v-card>
              </v-tabs-window-item>

              <!-- TAB: RENDICIÓN DE CUENTAS -->
              <v-tabs-window-item value="rendicion">
                <v-card class="tab-content-card" elevation="1" rounded="lg">
                  <div class="d-flex align-center pa-3 gap-3 filters-toolbar flex-wrap">
                    <div class="d-flex align-center gap-2">
                      <v-icon size="18" color="grey">mdi-filter</v-icon>
                      <span class="text-caption text-grey font-weight-medium">Filtros:</span>
                    </div>

                    <v-select
                      v-model="filtrosRendicion.estado"
                      :items="opcionesEstadoRendicion"
                      item-title="title"
                      item-value="value"
                      label="Estado"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 150px"
                      class="compact-select"
                    ></v-select>

                    <v-text-field
                      v-model="filtrosRendicion.solicitudAsociada"
                      placeholder="Solicitud asociada"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 220px"
                      class="compact-select"
                    ></v-text-field>

                    <v-select
                      v-model="filtrosRendicion.cumplimiento"
                      :items="opcionesCumplimiento"
                      item-title="title"
                      item-value="value"
                      label="Cumplimiento"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                      style="min-width: 180px"
                      class="compact-select"
                    ></v-select>

                    <v-spacer></v-spacer>

                    <v-btn
                      v-if="tieneFiltrosActivos('rendicion')"
                      size="small"
                      variant="text"
                      color="error"
                      @click="limpiarFiltros('rendicion')"
                    >
                      <v-icon size="16">mdi-filter-off</v-icon>
                      Limpiar
                    </v-btn>
                  </div>

                  <ListaSolicitudRendicionPendientes
                    :solicitudes="solicitudesFiltradasRendicion"
                    @ver-detalle="verDetalle"
                    @accion="manejarAccion"
                  />
                </v-card>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-sheet>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ListaSolicitudesPendientesTodos from '@/modules/formularios/components/validadores/ListaSolicitudesPendientesTodos.vue'
import ListaSolicitudFondosPendientes from '@/modules/formularios/components/validadores/ListaSolicitudFondosPendientes.vue'
import ListaSolicitudPagoDirectoPendientes from '@/modules/formularios/components/validadores/ListaSolicitudPagoDirectoPendientes.vue'
import ListaSolicitudRendicionPendientes from '@/modules/formularios/components/validadores/ListaSolicitudRendicionPendientes.vue'
import ListaSolicitudReposicionPendientes from '@/modules/formularios/components/validadores/ListaSolicitudReposicionPendientes.vue'
import ListaSolicitudViajesPendientes from '@/modules/formularios/components/validadores/ListaSolicitudViajesPendientes.vue'
// Store
import { useValidacionesSolicitudesStore } from '@/modules/formularios/store/useValidacionesSolicitudesStore'

// Estado local
const loading = ref(false)
const tabActivo = ref('todos')

// Inicializar el store
const storeValidacionesForm = useValidacionesSolicitudesStore()

// DATOS DESDE EL STORE
const todasLasSolicitudes = computed(() => {
  const solicitudes = storeValidacionesForm.todasSolicitudesPendientes || []

  if (!Array.isArray(solicitudes)) return []

  return solicitudes.map((s) => ({
    validacion_id: s.validacion_id,
    codigo_seguimiento: s.codigo_seguimiento,
    estado: s.estado,
    fecha_asignacion: s.fecha_asignacion,
    solicitud_id: s.solicitud_id,
    solicitud_codigo: s.solicitud_codigo,
    solicitud_monto: s.solicitud_monto,
    solicitante_nombre: s.solicitante_nombre,
    tipo_solicitud: s.tipo_solicitud || 'TAREA',
    tipo_display: getTipoDisplay(s.tipo_solicitud),
    actividad: s.solicitud_codigo?.split(' - ')[0] || null,
    destino: null,
    proveedor: null,
    factura: null,
    tipo_gasto: null,
    cumplimiento: null,
    solicitud_asociada: null,
  }))
})

const getTipoDisplay = (tipo) => {
  const mapa = {
    TAREA: 'Solicitud de Fondos',
    ACTIVIDAD: 'Solicitud de Actividad',
    PROYECTO: 'Solicitud de Proyecto',
    VIAJE: 'Solicitud de Viajes',
  }
  return mapa[tipo] || tipo
}

// FILTROS INDEPENDIENTES POR TAB
const filtrosTodos = ref({
  estado: null,
  busqueda: '',
})

const filtrosFondos = ref({
  estado: null,
  actividad: '',
  montoMinimo: null,
})

const filtrosViajes = ref({
  estado: null,
  destino: '',
  busqueda: '',
})

const filtrosPagoDirecto = ref({
  estado: null,
  proveedor: '',
  factura: '',
})

const filtrosReposicion = ref({
  estado: null,
  tipoGasto: '',
  montoMinimo: null,
})

const filtrosRendicion = ref({
  estado: null,
  solicitudAsociada: '',
  cumplimiento: null,
})

// Opciones para selects
const opcionesEstado = [
  { title: 'Pendiente', value: 'PENDIENTE' },
  { title: 'Aprobado', value: 'APROBADO' },
  { title: 'Rechazado', value: 'RECHAZADO' },
]

const opcionesEstadoRendicion = [
  { title: 'Pendiente', value: 'PENDIENTE' },
  { title: 'En Revisión', value: 'EN_REVISION' },
  { title: 'Aprobado', value: 'APROBADO' },
  { title: 'Observado', value: 'OBSERVADO' },
  { title: 'Rechazado', value: 'RECHAZADO' },
]

const opcionesCumplimiento = [
  { title: 'Completo', value: 'completo' },
  { title: 'Parcial', value: 'parcial' },
  { title: 'Pendiente', value: 'pendiente' },
]

// TABS FIJOS (no dinámicos)
const tabs = [
  {
    text: 'Todos',
    value: 'todos',
    icon: 'mdi-view-list',
    count: computed(() => todasLasSolicitudes.value.length),
    badgeColor: 'primary',
  },
  {
    text: 'Solicitud de Fondos',
    value: 'fondos',
    icon: 'mdi-cash-multiple',
    count: computed(
      () => todasLasSolicitudes.value.filter((s) => s.tipo_solicitud === 'TAREA').length,
    ),
    badgeColor: 'success',
  },
  {
    text: 'Solicitud de Viajes',
    value: 'viajes',
    icon: 'mdi-airplane',
    count: computed(
      () => todasLasSolicitudes.value.filter((s) => s.tipo_solicitud === 'VIAJE').length,
    ),
    badgeColor: 'info',
  },
  {
    text: 'Pago Directo',
    value: 'pago_directo',
    icon: 'mdi-credit-card',
    count: computed(
      () => todasLasSolicitudes.value.filter((s) => s.tipo_solicitud === 'ACTIVIDAD').length,
    ),
    badgeColor: 'warning',
  },
  {
    text: 'Reposición',
    value: 'reposicion',
    icon: 'mdi-cash-refund',
    count: computed(
      () => todasLasSolicitudes.value.filter((s) => s.tipo_solicitud === 'PROYECTO').length,
    ),
    badgeColor: 'secondary',
  },
  {
    text: 'Rendición de Cuentas',
    value: 'rendicion',
    icon: 'mdi-file-document-check',
    count: computed(() => 0), // Se llenará cuando haya endpoint de rendiciones
    badgeColor: 'error',
  },
]

// Computed para estadísticas
const totalSolicitudes = computed(() => todasLasSolicitudes.value.length)

const solicitudesPendientes = computed(
  () => todasLasSolicitudes.value.filter((s) => s.estado === 'PENDIENTE').length,
)

const solicitudesAprobadas = computed(
  () => todasLasSolicitudes.value.filter((s) => s.estado === 'APROBADO').length,
)

const solicitudesRechazadas = computed(
  () => todasLasSolicitudes.value.filter((s) => s.estado === 'RECHAZADO').length,
)

// Funciones de filtrado
const solicitudesFiltradasTodos = computed(() => {
  return todasLasSolicitudes.value.filter((s) => {
    if (filtrosTodos.value.estado && s.estado !== filtrosTodos.value.estado) return false
    if (filtrosTodos.value.busqueda) {
      const search = filtrosTodos.value.busqueda.toLowerCase()
      return (
        s.codigo_seguimiento?.toLowerCase().includes(search) ||
        s.solicitud_codigo?.toLowerCase().includes(search) ||
        s.solicitante_nombre?.toLowerCase().includes(search)
      )
    }
    return true
  })
})

const solicitudesFiltradasFondos = computed(() => {
  return todasLasSolicitudes.value
    .filter((s) => s.tipo_solicitud === 'TAREA')
    .filter((s) => {
      if (filtrosFondos.value.estado && s.estado !== filtrosFondos.value.estado) return false
      if (
        filtrosFondos.value.actividad &&
        !s.actividad?.toLowerCase().includes(filtrosFondos.value.actividad.toLowerCase())
      )
        return false
      if (
        filtrosFondos.value.montoMinimo &&
        parseFloat(s.solicitud_monto) < parseFloat(filtrosFondos.value.montoMinimo)
      )
        return false
      return true
    })
})

const solicitudesFiltradasViajes = computed(() => {
  return todasLasSolicitudes.value
    .filter((s) => s.tipo_solicitud === 'VIAJE')
    .filter((s) => {
      if (filtrosViajes.value.estado && s.estado !== filtrosViajes.value.estado) return false
      if (
        filtrosViajes.value.destino &&
        !s.destino?.toLowerCase().includes(filtrosViajes.value.destino.toLowerCase())
      )
        return false
      if (filtrosViajes.value.busqueda) {
        const search = filtrosViajes.value.busqueda.toLowerCase()
        return (
          s.codigo_seguimiento?.toLowerCase().includes(search) ||
          s.solicitante_nombre?.toLowerCase().includes(search) ||
          s.destino?.toLowerCase().includes(search)
        )
      }
      return true
    })
})

const solicitudesFiltradasPagoDirecto = computed(() => {
  return todasLasSolicitudes.value
    .filter((s) => s.tipo_solicitud === 'ACTIVIDAD')
    .filter((s) => {
      if (filtrosPagoDirecto.value.estado && s.estado !== filtrosPagoDirecto.value.estado)
        return false
      if (
        filtrosPagoDirecto.value.proveedor &&
        !s.proveedor?.toLowerCase().includes(filtrosPagoDirecto.value.proveedor.toLowerCase())
      )
        return false
      if (
        filtrosPagoDirecto.value.factura &&
        !s.factura?.toLowerCase().includes(filtrosPagoDirecto.value.factura.toLowerCase())
      )
        return false
      return true
    })
})

const solicitudesFiltradasReposicion = computed(() => {
  return todasLasSolicitudes.value
    .filter((s) => s.tipo_solicitud === 'PROYECTO')
    .filter((s) => {
      if (filtrosReposicion.value.estado && s.estado !== filtrosReposicion.value.estado)
        return false
      if (
        filtrosReposicion.value.tipoGasto &&
        !s.tipo_gasto?.toLowerCase().includes(filtrosReposicion.value.tipoGasto.toLowerCase())
      )
        return false
      if (
        filtrosReposicion.value.montoMinimo &&
        parseFloat(s.solicitud_monto) < parseFloat(filtrosReposicion.value.montoMinimo)
      )
        return false
      return true
    })
})

const solicitudesFiltradasRendicion = computed(() => {
  // Por ahora retorna vacío, se implementará cuando haya endpoint de rendiciones
  return []
})

// Utilidades
const tieneFiltrosActivos = (tab) => {
  const filtros = {
    todos: filtrosTodos.value,
    fondos: filtrosFondos.value,
    viajes: filtrosViajes.value,
    pago_directo: filtrosPagoDirecto.value,
    reposicion: filtrosReposicion.value,
    rendicion: filtrosRendicion.value,
  }

  const filtroActual = filtros[tab]
  if (!filtroActual) return false

  return Object.values(filtroActual).some((v) => v !== null && v !== '' && v !== undefined)
}

const limpiarFiltros = (tab) => {
  switch (tab) {
    case 'todos':
      filtrosTodos.value = { estado: null, busqueda: '' }
      break
    case 'fondos':
      filtrosFondos.value = { estado: null, actividad: '', montoMinimo: null }
      break
    case 'viajes':
      filtrosViajes.value = { estado: null, destino: '', busqueda: '' }
      break
    case 'pago_directo':
      filtrosPagoDirecto.value = { estado: null, proveedor: '', factura: '' }
      break
    case 'reposicion':
      filtrosReposicion.value = { estado: null, tipoGasto: '', montoMinimo: null }
      break
    case 'rendicion':
      filtrosRendicion.value = { estado: null, solicitudAsociada: '', cumplimiento: null }
      break
  }
}

// Acciones
const verDetalle = (solicitud) => {
  console.log('Ver detalle:', solicitud)
}

const manejarAccion = async ({ solicitud, accion }) => {
  console.log('Acción:', accion, 'Solicitud:', solicitud)
}

// Función de carga
const cargarDatos = async () => {
  loading.value = true
  try {
    await storeValidacionesForm.cargarSolicitudesFondosPendientes()
  } catch (error) {
    console.error('Error al cargar los datos de solicitud', error)
  } finally {
    loading.value = false
  }
}

// Inicialización
onMounted(async () => {
  await cargarDatos()
})
</script>

<style scoped>
.solicitudes-container {
  background: #f5f5f5;
  min-height: 100vh;
  max-width: 100% !important;
  margin: 0 !important;
}

.header-bg {
  background: transparent;
}

.stats-summary {
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-content-card {
  background: white !important;
  border: 1px solid #e0e0e0;
  border-top: none;
}

.filters-toolbar {
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
  min-height: 72px;
}

.compact-select :deep(.v-field) {
  font-size: 13px;
  min-height: 36px !important;
  background: white;
  border-radius: 8px;
}

:deep(.v-tabs) {
  background: white;
  border-radius: 12px 12px 0 0;
  border: 1px solid #e0e0e0;
  border-bottom: none;
}

:deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
  min-width: 100px;
  font-size: 13px;
}

:deep(.v-tab--selected) {
  font-weight: 700;
}

:deep(.v-tabs-window) {
  background: transparent;
}

.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}

@media (max-width: 960px) {
  .filters-toolbar {
    flex-direction: column;
    align-items: stretch !important;
  }

  .compact-select {
    width: 100% !important;
    min-width: 100% !important;
  }

  :deep(.v-tab) {
    min-width: 70px;
    font-size: 11px;
    padding: 0 6px;
  }

  .stats-summary {
    width: 100%;
    justify-content: center;
    margin-top: 12px;
  }
}
</style>
