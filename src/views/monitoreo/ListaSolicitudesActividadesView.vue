<template>
  <v-container>
    <v-progress-linear v-if="loading" indeterminate color="primary" height="4" class="mb-4" />

    <v-card v-if="emptyResponse && !loading" class="mb-4">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey lighten-1">mdi-calendar-remove</v-icon>
        <h3 class="text-h5 mt-4">No hay actividades registradas</h3>
      </v-card-text>
    </v-card>

    <v-row v-else>
      <v-col cols="12" md="9">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Solicitudes de Actividades</span>
            <span class="text-caption text-grey">Total: {{ totalItems }}</span>
          </v-card-title>

          <v-card-text class="pt-0 pb-4">
            <v-text-field
              v-model="searchQuery"
              label="Buscar por código o nombre corto"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              density="comfortable"
              @update:model-value="buscar"
            />

            <div class="d-flex flex-wrap gap-2 mt-2 align-center">
              <v-btn-group density="comfortable" class="mr-4">
                <v-btn
                  v-for="v in vistas"
                  :key="v.valor"
                  :variant="vistaActual === v.valor ? 'tonal' : 'outlined'"
                  size="small"
                  @click="vistaActual = v.valor"
                >
                  <v-icon left size="small">{{ v.icono }}</v-icon> {{ v.texto }}
                </v-btn>
              </v-btn-group>

              <v-chip-group
                v-model="statusFilters"
                multiple
                column
                @update:model-value="filtrarPorEstado"
              >
                <v-chip
                  v-for="s in statuses"
                  :key="s.value"
                  :value="s.value"
                  filter
                  :color="getColorEstadoActividad(s.value)"
                  variant="outlined"
                  >{{ s.text }}</v-chip
                >
              </v-chip-group>

              <v-spacer />

              <v-select
                v-model="pageSize"
                :items="[5, 10, 20, 50]"
                label="Items por página"
                density="compact"
                style="max-width: 150px"
                variant="outlined"
                hide-details
              />
            </div>
          </v-card-text>

          <v-divider class="my-4" />

          <VistaLista
            v-if="vistaActual === 'lista'"
            :actividades="actividades"
            @accion="handleAccion"
          />
          <VistaProyecto
            v-if="vistaActual === 'proyecto'"
            :proyectos="proyectosFiltrados"
            @accion="handleAccion"
          />
          <VistaResponsable
            v-if="vistaActual === 'responsable'"
            :responsables="responsablesFiltrados"
            @accion="handleAccion"
          />

          <div
            v-if="vistaActual === 'lista' && totalPaginas > 1"
            class="d-flex align-center justify-space-between mt-4"
          >
            <span class="text-caption text-grey">
              Mostrando {{ startItem }}-{{ endItem }} de {{ totalItems }}
            </span>
            <v-pagination
              v-model="paginaActual"
              :length="totalPaginas"
              :total-visible="7"
              size="small"
              @update:model-value="cambiarPagina"
            />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <PanelEstadisticas
          :total="totalItems"
          :estados="conteoEstados"
          :presupuesto="presupuestoTotal"
          :solicitudes-pendientes="solicitudesPendientes"
        />
      </v-col>
    </v-row>

    <DialogValidarFondos
      v-model="dialogValidarFondos"
      :actividad-id="dialogActividadId"
      :tarea-id="dialogTareaId"
    />
    <DialogValidarViaje
      v-model="dialogValidarViaje"
      :actividad-id="dialogActividadId"
      :tarea-id="dialogTareaId"
    />
    <DialogValidarPagoDirecto
      v-model="dialogValidarPagoDirecto"
      :actividad-id="dialogActividadId"
      :tarea-id="dialogTareaId"
    />
    <DialogValidarReposicion
      v-model="dialogValidarReposicion"
      :actividad-id="dialogActividadId"
      :tarea-id="dialogTareaId"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions
        ><v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn></template
      >
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import VistaLista from '@/modules/listaActividadesSolicitudes/components/VistaLista.vue'
import VistaProyecto from '@/modules/listaActividadesSolicitudes/components/VistaProyecto.vue'
import VistaResponsable from '@/modules/listaActividadesSolicitudes/components/VistaResponsable.vue'
import PanelEstadisticas from '@/modules/listaActividadesSolicitudes/components/PanelEstadisticas.vue'
import DialogValidarFondos from '@/modules/listaActividadesSolicitudes/components/dialogos/DialogValidarFondos.vue'
import DialogValidarViaje from '@/modules/listaActividadesSolicitudes/components/dialogos/DialogValidarViaje.vue'
import DialogValidarPagoDirecto from '@/modules/listaActividadesSolicitudes/components/dialogos/DialogValidarPagoDirecto.vue'
import DialogValidarReposicion from '@/modules/listaActividadesSolicitudes/components/dialogos/DialogValidarReposicion.vue'
import { useSolicitudes } from '@/modules/listaActividadesSolicitudes/composables/useSolicitudes'
import { getColorEstadoActividad } from '@/modules/formularios/utils/actividadHelpers'

const router = useRouter()

const {
  loading,
  emptyResponse,
  actividades,
  todasLasActividades,
  paginaActual,
  pageSize,
  totalPaginas,
  searchQuery,
  statusFilters,
  totalItems,
  conteoEstados,
  presupuestoTotal,
  solicitudesPendientes,
  cargarTodas,
  buscar,
  filtrarPorEstado,
  cambiarPagina,
} = useSolicitudes()

const vistas = [
  { valor: 'lista', texto: 'Lista', icono: 'mdi-format-list-bulleted' },
  { valor: 'proyecto', texto: 'Proyecto', icono: 'mdi-folder-outline' },
  { valor: 'responsable', texto: 'Responsable', icono: 'mdi-account-outline' },
]

const statuses = [
  { value: 'PLAN', text: 'Planificación' },
  { value: 'EJEC', text: 'En Ejecución' },
  { value: 'REPROG', text: 'Reprogramación' },
  { value: 'REP', text: 'En Reporte' },
  { value: 'FIN', text: 'Finalizado' },
]

const vistaActual = ref('lista')
const snackbar = ref({ show: false, text: '', color: 'success' })
const dialogValidarFondos = ref(false)
const dialogValidarViaje = ref(false)
const dialogValidarPagoDirecto = ref(false)
const dialogValidarReposicion = ref(false)
const dialogActividadId = ref(null)
const dialogTareaId = ref(null)

const startItem = computed(() => (paginaActual.value - 1) * pageSize.value + 1)
const endItem = computed(() => {
  const e = paginaActual.value * pageSize.value
  return e > totalItems.value ? totalItems.value : e
})

// ─── FILTROS PARA AGRUPACIONES ───
const actividadesFiltradasParaAgrupar = computed(() => {
  let resultado = [...todasLasActividades.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    resultado = resultado.filter(
      (a) => a.codigo?.toLowerCase().includes(q) || a.nombre_corto?.toLowerCase().includes(q),
    )
  }

  if (statusFilters.value.length > 0) {
    resultado = resultado.filter((a) => statusFilters.value.includes(a.estado))
  }

  return resultado
})

// ─── AGRUPACIONES ───
const proyectosFiltrados = computed(() => agruparPorProyecto(actividadesFiltradasParaAgrupar.value))
const responsablesFiltrados = computed(() =>
  agruparPorResponsable(actividadesFiltradasParaAgrupar.value),
)

function agruparPorProyecto(lista) {
  const grupos = {}
  lista.forEach((a) => {
    const pid = a.proyecto?.id || 'sin-proyecto'
    const pnombre = a.proyecto?.nombre || 'Sin proyecto'
    if (!grupos[pid]) {
      grupos[pid] = {
        proyecto_id: pid,
        proyecto_nombre: pnombre,
        total_actividades: 0,
        presupuesto_total: 0,
        actividades: [],
        actividades_restantes: 0,
      }
    }
    grupos[pid].actividades.push(a)
    grupos[pid].total_actividades++
    grupos[pid].presupuesto_total += Number(a.presupuesto || 0)
  })
  return Object.values(grupos)
}

function agruparPorResponsable(lista) {
  const grupos = {}
  lista.forEach((a) => {
    const rid = a.responsable?.id || 'sin-responsable'
    const rnombre = a.responsable?.nombre || 'Sin responsable'
    if (!grupos[rid]) {
      grupos[rid] = {
        responsable_id: rid,
        responsable_nombre: rnombre,
        total_actividades: 0,
        presupuesto_total: 0,
        actividades: [],
        actividades_restantes: 0,
      }
    }
    grupos[rid].actividades.push(a)
    grupos[rid].total_actividades++
    grupos[rid].presupuesto_total += Number(a.presupuesto || 0)
  })
  return Object.values(grupos)
}

function handleAccion({ tipo, actividadId, tareaId, formulario }) {
  if (tipo === 'crear') {
    let path = `/monitoreo/${formulario}/${actividadId}`
    if (tareaId) path += `?tarea_id=${tareaId}`
    router.push(path)
  } else if (tipo === 'validar') {
    dialogActividadId.value = actividadId
    dialogTareaId.value = tareaId
    switch (formulario) {
      case 'fondos':
        dialogValidarFondos.value = true
        break
      case 'viaje':
        dialogValidarViaje.value = true
        break
      case 'pagoDirecto':
        dialogValidarPagoDirecto.value = true
        break
      case 'reposicion':
        dialogValidarReposicion.value = true
        break
    }
  }
}

onMounted(() => cargarTodas())
</script>
