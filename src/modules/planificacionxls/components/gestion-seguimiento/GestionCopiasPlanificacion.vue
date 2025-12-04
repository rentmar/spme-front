<template>
  <div class="gestion-copias-container">
    <!-- Header del componente -->
    <v-card class="mb-4">
      <v-card-title class="d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-history</v-icon>
        Gestión de Historial de Planificación
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="outlined"
          @click="crearNuevaVersion"
          :loading="creandoVersion"
        >
          <v-icon left>mdi-plus</v-icon>
          Nueva Versión
        </v-btn>
      </v-card-title>
      <v-card-subtitle>
        Proyecto: {{ proyectoNombre }} | Total de versiones: {{ planificaciones.length }}
      </v-card-subtitle>
    </v-card>

    <!-- Filtros y búsqueda -->
    <v-card class="mb-4">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filtroBusqueda"
              label="Buscar en versiones..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filtroTipoCambio"
              :items="opcionesTipoCambio"
              label="Tipo de cambio"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filtroUsuario"
              :items="usuariosUnicos"
              label="Usuario"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn variant="tonal" color="secondary" @click="limpiarFiltros" block> Limpiar </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Lista de versiones -->
    <v-card>
      <v-card-title class="d-flex align-center">
        <span>Versiones de Planificación</span>
        <v-spacer></v-spacer>
        <v-chip color="primary" variant="flat">
          Mostrando {{ planificacionesFiltradas.length }} de {{ planificaciones.length }}
        </v-chip>
      </v-card-title>

      <v-card-text>
        <v-list lines="two" class="pa-0">
          <template v-for="(plan, index) in planificacionesFiltradas" :key="plan.id">
            <v-list-item
              :class="{ 'version-activa': plan.version === versionActiva }"
              @click="seleccionarVersion(plan)"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" variant="flat" size="40">
                  <span class="text-white font-weight-bold">V{{ plan.version }}</span>
                </v-avatar>
              </template>

              <v-list-item-title class="d-flex align-center">
                <span>Versión {{ plan.version }}</span>
                <v-chip
                  v-if="plan.version === versionActiva"
                  size="small"
                  color="success"
                  class="ml-2"
                >
                  Actual
                </v-chip>
                <v-chip v-if="plan.version === 1" size="small" color="info" class="ml-2">
                  Inicial
                </v-chip>
              </v-list-item-title>

              <v-list-item-subtitle>
                <div class="d-flex flex-wrap gap-2 mt-1">
                  <span><v-icon small>mdi-calendar</v-icon> {{ formatFecha(plan.creado) }}</span>
                  <span><v-icon small>mdi-account</v-icon> {{ plan.creado_por }}</span>
                  <span
                    ><v-icon small>mdi-clipboard-list</v-icon>
                    {{ plan.rows_data.length }} actividades</span
                  >
                </div>
              </v-list-item-subtitle>

              <template v-slot:append>
                <div class="d-flex gap-2">
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    @click.stop="verDetalles(plan)"
                    color="info"
                  >
                    <v-icon>mdi-eye</v-icon>
                    <v-tooltip activator="parent" location="top">Ver detalles</v-tooltip>
                  </v-btn>

                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    @click.stop="compararVersiones(plan)"
                    color="warning"
                  >
                    <v-icon>mdi-compare</v-icon>
                    <v-tooltip activator="parent" location="top">Comparar</v-tooltip>
                  </v-btn>

                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    @click.stop="restaurarVersion(plan)"
                    color="success"
                    :disabled="plan.version === versionActiva"
                  >
                    <v-icon>mdi-restore</v-icon>
                    <v-tooltip activator="parent" location="top">Restaurar</v-tooltip>
                  </v-btn>
                </div>
              </template>
            </v-list-item>

            <v-divider v-if="index < planificacionesFiltradas.length - 1"></v-divider>
          </template>

          <v-list-item v-if="planificacionesFiltradas.length === 0">
            <v-list-item-title class="text-center text-grey">
              No se encontraron versiones que coincidan con los filtros
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Modal de detalles de versión -->
    <v-dialog v-model="modalDetalles" max-width="800px">
      <v-card v-if="versionSeleccionada">
        <v-toolbar color="primary" dark>
          <v-toolbar-title> Detalles de Versión {{ versionSeleccionada.version }} </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="modalDetalles = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-3">
                <v-card-title class="text-h6">Información General</v-card-title>
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>Versión</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ versionSeleccionada.version }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Fecha de creación</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ formatFechaCompleta(versionSeleccionada.creado) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Última actualización</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ formatFechaCompleta(versionSeleccionada.actualizado) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Creado por</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ versionSeleccionada.creado_por }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-3">
                <v-card-title class="text-h6">Resumen de Actividades</v-card-title>
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>Total de actividades</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ versionSeleccionada.rows_data.length }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Presupuesto total</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ calcularPresupuestoTotal(versionSeleccionada.rows_data) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Actividades planificadas</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ contarActividadesPorEstado(versionSeleccionada.rows_data, 'PLANIFICADA') }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>En ejecución</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{
                        contarActividadesPorEstado(versionSeleccionada.rows_data, 'EN EJECUCION')
                      }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>

          <!-- Cambios en esta versión -->
          <v-card variant="outlined" class="mt-4">
            <v-card-title class="text-h6">Cambios en esta versión</v-card-title>
            <v-card-text>
              <v-timeline side="end" align="start" v-if="cambiosVersion.length > 0">
                <v-timeline-item
                  v-for="cambio in cambiosVersion"
                  :key="cambio.id"
                  :dot-color="getColorTipoCambio(cambio.tipo_cambio)"
                  size="small"
                >
                  <template v-slot:opposite>
                    <span class="text-caption">{{ formatFechaCorta(cambio.realizado_el) }}</span>
                  </template>
                  <v-card>
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center">
                        <strong class="text-capitalize">{{ cambio.tipo_cambio }}</strong>
                        <v-chip size="small" :color="getColorTipoCambio(cambio.tipo_cambio)">
                          {{ cambio.tipo_cambio }}
                        </v-chip>
                      </div>
                      <p class="mb-1 mt-2">{{ cambio.descripcion }}</p>
                      <p class="text-caption text-grey">Por: {{ cambio.realizado_por }}</p>

                      <!-- Detalles del cambio -->
                      <v-expansion-panels v-if="cambio.datos_anteriores || cambio.datos_nuevos">
                        <v-expansion-panel>
                          <v-expansion-panel-title>Detalles técnicos</v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <div v-if="cambio.datos_anteriores">
                              <strong>Datos anteriores:</strong>
                              <pre class="text-caption">{{
                                JSON.stringify(cambio.datos_anteriores, null, 2)
                              }}</pre>
                            </div>
                            <div v-if="cambio.datos_nuevos">
                              <strong>Datos nuevos:</strong>
                              <pre class="text-caption">{{
                                JSON.stringify(cambio.datos_nuevos, null, 2)
                              }}</pre>
                            </div>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>

              <v-alert v-else type="info" variant="outlined">
                No hay cambios registrados para esta versión.
              </v-alert>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal de comparación -->
    <v-dialog v-model="modalComparacion" max-width="1000px" fullscreen>
      <v-card v-if="versionComparar">
        <v-toolbar color="warning" dark>
          <v-toolbar-title>
            Comparando Versión {{ versionActiva }} vs Versión {{ versionComparar.version }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="modalComparacion = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-4">
          <ComparacionVersiones
            :version-actual="planificacionActual"
            :version-comparar="versionComparar"
            @cerrar="modalComparacion = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Snackbar para mensajes -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
  {{}}
  <br /><br /><br /><br /><br />
  {{ storeSeguimiento.versionPlanificacionVigente }}
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { useSeguimientoPlanificacionStore } from '../../store/useSeguimientoPlanificacionStore'
// import { useApi } from '@/composables/useApi'

// Componente de comparación (se puede crear por separado)
const ComparacionVersiones = defineAsyncComponent(() => import('./ComparacionVersiones.vue'))

//Inicializar el store
const storeSeguimiento = useSeguimientoPlanificacionStore()

// Props
const props = defineProps({
  proyectoId: {
    type: [String, Number],
    required: true,
  },
  proyectoNombre: {
    type: String,
    default: 'Proyecto',
  },
  tableData: {
    type: Array,
    required: true,
    default: () => [],
  },
})

// Estado reactivo
const planificaciones = ref([])
const versionActiva = ref(1)
const versionSeleccionada = ref(null)
const versionComparar = ref(null)
const modalDetalles = ref(false)
const modalComparacion = ref(false)
const creandoVersion = ref(false)
const loading = ref(false)

// Filtros
const filtroBusqueda = ref('')
const filtroTipoCambio = ref('')
const filtroUsuario = ref('')

// Snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

// Opciones para filtros
const opcionesTipoCambio = [
  { title: 'Creación', value: 'creacion' },
  { title: 'Actualización', value: 'actualizacion' },
  { title: 'Eliminación', value: 'eliminacion' },
  { title: 'Reprogramación', value: 'reprogramacion' },
]

// Computed
const planificacionesFiltradas = computed(() => {
  let filtered = planificaciones.value

  if (filtroBusqueda.value) {
    const search = filtroBusqueda.value.toLowerCase()
    filtered = filtered.filter(
      (plan) =>
        plan.creado_por?.toLowerCase().includes(search) || plan.version.toString().includes(search),
    )
  }

  if (filtroTipoCambio.value) {
    filtered = filtered.filter((plan) =>
      plan.cambios?.some((cambio) => cambio.tipo_cambio === filtroTipoCambio.value),
    )
  }

  if (filtroUsuario.value) {
    filtered = filtered.filter((plan) => plan.creado_por === filtroUsuario.value)
  }

  return filtered.sort((a, b) => b.version - a.version)
})

const usuariosUnicos = computed(() => {
  const usuarios = planificaciones.value.map((plan) => plan.creado_por).filter(Boolean)
  return [...new Set(usuarios)]
})

const planificacionActual = computed(() => {
  return planificaciones.value.find((plan) => plan.version === versionActiva.value)
})

const cambiosVersion = computed(() => {
  if (!versionSeleccionada.value) return []
  return versionSeleccionada.value.cambios || []
})

onMounted(() => {
  cargarPlanificaciones()
})

// Métodos
const cargarPlanificaciones = async () => {
  loading.value = true
  try {
    // Simular carga de datos - reemplazar con API real
    await storeSeguimiento.cargarPlanificacionesDeProyecto(1)
    planificaciones.value = storeSeguimiento.planificacionProyectoLista.data
    versionActiva.value = storeSeguimiento.versionPlanificacionVigente
    //planificaciones.value = await generarDatosDummy()
    //versionActiva.value = Math.max(...planificaciones.value.map((p) => p.version))
  } catch (error) {
    console.error('Error al cargar planificaciones:', error)
    mostrarMensaje('Error al cargar el historial', 'error')
  } finally {
    loading.value = false
  }
}

const seleccionarVersion = (plan) => {
  versionSeleccionada.value = plan
  modalDetalles.value = true
}

const verDetalles = (plan) => {
  versionSeleccionada.value = plan
  modalDetalles.value = true
}

const compararVersiones = (plan) => {
  versionComparar.value = plan
  modalComparacion.value = true
}

const restaurarVersion = async (plan) => {
  if (!confirm(`¿Estás seguro de que deseas restaurar la versión ${plan.version}?`)) {
    return
  }

  try {
    // Simular restauración
    mostrarMensaje(`Versión ${plan.version} restaurada correctamente`, 'success')
    versionActiva.value = plan.version
  } catch (error) {
    console.error('Error al restaurar versión:', error)
    mostrarMensaje('Error al restaurar la versión', 'error')
  }
}

const crearNuevaVersion = async () => {
  creandoVersion.value = true
  try {
    // Simular creación de nueva versión
    const nuevaVersion = {
      id: Date.now(),
      version: versionActiva.value + 1,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
      creado_por: 'Usuario Actual',
      rows_data: [...planificacionActual.value.rows_data],
      cambios: [
        {
          id: Date.now(),
          tipo_cambio: 'actualizacion',
          descripcion: 'Nueva versión creada a partir de la versión anterior',
          realizado_por: 'Usuario Actual',
          realizado_el: new Date().toISOString(),
        },
      ],
    }

    planificaciones.value.unshift(nuevaVersion)
    versionActiva.value = nuevaVersion.version
    mostrarMensaje(`Nueva versión ${nuevaVersion.version} creada`, 'success')
  } catch (error) {
    console.error('Error al crear nueva versión:', error)
    mostrarMensaje('Error al crear nueva versión', 'error')
  } finally {
    creandoVersion.value = false
  }
}

const limpiarFiltros = () => {
  filtroBusqueda.value = ''
  filtroTipoCambio.value = ''
  filtroUsuario.value = ''
}

// Utilidades de formato
const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES')
}

const formatFechaCompleta = (fecha) => {
  return new Date(fecha).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatFechaCorta = (fecha) => {
  return new Date(fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const calcularPresupuestoTotal = (actividades) => {
  const total = actividades.reduce((sum, act) => sum + (act.presupuesto || 0), 0)
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(total)
}

const contarActividadesPorEstado = (actividades, estado) => {
  return actividades.filter((act) => act.estado === estado).length
}

const getColorTipoCambio = (tipo) => {
  const colores = {
    creacion: 'success',
    actualizacion: 'primary',
    eliminacion: 'error',
    reprogramacion: 'warning',
  }
  return colores[tipo] || 'grey'
}

const mostrarMensaje = (mensaje, color = 'success') => {
  snackbar.value = {
    show: true,
    message: mensaje,
    color: color,
  }
}

// Generar datos dummy para demostración
const generarDatosDummy = () => {
  const versiones = []
  const usuarios = ['Ana García', 'Carlos López', 'María Rodríguez', 'Pedro Martínez']
  const tiposCambio = ['creacion', 'actualizacion', 'eliminacion', 'reprogramacion']

  for (let i = 5; i >= 1; i--) {
    const actividades = Array.from({ length: Math.floor(Math.random() * 10) + 5 }, (_, index) => ({
      id: index + 1,
      codigo: `ACT-${i}-${index + 1}`,
      nombreCorto: `Actividad ${i}.${index + 1}`,
      presupuesto: Math.random() * 100000,
      estado: ['PLANIFICADA', 'EN EJECUCION', 'FINALIZADA'][Math.floor(Math.random() * 3)],
    }))

    const cambios = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, index) => ({
      id: i * 100 + index,
      tipo_cambio: tiposCambio[Math.floor(Math.random() * tiposCambio.length)],
      descripcion: `Cambio ${index + 1} en la versión ${i}`,
      realizado_por: usuarios[Math.floor(Math.random() * usuarios.length)],
      realizado_el: new Date(Date.now() - i * 86400000).toISOString(),
      datos_anteriores: index === 0 ? { ejemplo: 'datos anteriores' } : null,
      datos_nuevos: index === 0 ? { ejemplo: 'datos nuevos' } : null,
    }))

    versiones.push({
      id: i,
      version: i,
      creado: new Date(Date.now() - i * 86400000).toISOString(),
      actualizado: new Date(Date.now() - i * 43200000).toISOString(),
      creado_por: usuarios[Math.floor(Math.random() * usuarios.length)],
      rows_data: actividades,
      cambios: cambios,
    })
  }

  return versiones
}

// Ciclo de vida
onMounted(() => {
  cargarPlanificaciones()
})
</script>

<style scoped>
.gestion-copias-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.version-activa {
  background-color: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4caf50;
}

.gap-2 {
  gap: 8px;
}

.text-caption pre {
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.75rem;
  margin-top: 8px;
}

.v-list-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

@media (max-width: 768px) {
  .gestion-copias-container {
    padding: 10px;
  }

  .d-flex.flex-wrap.gap-2 {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
