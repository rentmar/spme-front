<template>
  <div v-if="actividadId">
    <v-card>
      <v-card-title class="bg-blue-darken-2 text-white">
        <v-icon icon="mdi-connection" class="mr-2"></v-icon>
        Gestión de Indicadores por Nodo
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="white"
          size="24"
          class="ml-4"
        ></v-progress-circular>
      </v-card-title>

      <v-card-text class="pa-4">
        <div v-if="error" class="text-error text-center py-4">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          {{ error }}
        </div>

        <div v-else-if="!loading && !datosActividad" class="text-center py-4">
          No se encontraron datos para la actividad #{{ actividadId }}
        </div>

        <template v-else>
          <!-- Información de la Ruta Seleccionada -->
          <v-card v-if="rutaSeleccionada" class="mb-4" elevation="2">
            <v-card-title class="bg-grey-lighten-3">
              <v-icon icon="mdi-map-marker-path" class="mr-2"></v-icon>
              Ruta Seleccionada: {{ rutaSeleccionada.ruta_label }}
            </v-card-title>
          </v-card>

          <!-- Selector de Nodo -->
          <v-card class="mb-4" elevation="2">
            <v-card-title class="bg-grey-lighten-3">
              <v-icon icon="mdi-node" class="mr-2"></v-icon>
              Seleccionar Nodo
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="nodoSeleccionado"
                :items="nodosDisponibles"
                item-title="nombreCompleto"
                label="Seleccione un nodo"
                density="comfortable"
                variant="outlined"
                return-object
                @update:modelValue="cambiarNodo"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon :color="obtenerColorPorTipo(item.raw.tipo)">
                        {{ obtenerIconoPorTipo(item.raw.tipo) }}
                      </v-icon>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-card-text>
          </v-card>

          <!-- Información del Nodo Seleccionado -->
          <v-card v-if="nodoSeleccionado" class="mb-4" elevation="2">
            <v-card-title class="bg-grey-lighten-3">
              <v-icon :color="obtenerColorPorTipo(nodoSeleccionado.tipo)" class="mr-2">
                {{ obtenerIconoPorTipo(nodoSeleccionado.tipo) }}
              </v-icon>
              Información del Nodo
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <strong>Tipo:</strong> {{ formatearTipo(nodoSeleccionado.tipo) }}
                  </div>
                  <div class="info-item"><strong>ID:</strong> {{ nodoSeleccionado.id }}</div>
                  <div v-if="nodoSeleccionado.codigo" class="info-item">
                    <strong>Código:</strong> {{ nodoSeleccionado.codigo }}
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div v-if="nodoSeleccionado.nombre" class="info-item">
                    <strong>Nombre:</strong> {{ nodoSeleccionado.nombre }}
                  </div>
                  <div v-if="nodoSeleccionado.estado" class="info-item">
                    <strong>Estado:</strong>
                    <v-chip small :color="obtenerColorEstado(nodoSeleccionado.estado)" class="ml-1">
                      {{ nodoSeleccionado.estado }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Selector de Indicadores -->
          <v-card
            v-if="
              nodoSeleccionado &&
              nodoSeleccionado.indicadores &&
              nodoSeleccionado.indicadores.length > 0
            "
            class="mb-4"
            elevation="2"
          >
            <v-card-title class="bg-grey-lighten-3">
              <v-icon icon="mdi-chart-line" class="mr-2"></v-icon>
              Seleccionar Indicador
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="indicadorSeleccionado"
                :items="nodoSeleccionado.indicadores"
                item-title="redaccion"
                item-value="id"
                label="Seleccione un indicador"
                density="comfortable"
                variant="outlined"
                :hint="
                  indicadorSeleccionado
                    ? indicadorSeleccionado.redaccion
                    : 'Seleccione un indicador'
                "
                persistent-hint
                return-object
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon color="green">mdi-chart-bar</v-icon>
                    </template>
                    <v-list-item-subtitle>
                      {{ item.raw.codigo }} - {{ item.raw.tipo }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-select>

              <v-btn
                color="primary"
                class="mt-3"
                :disabled="!indicadorSeleccionado"
                @click="guardarSeleccion"
              >
                <v-icon left>mdi-content-save</v-icon>
                Guardar Selección
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Mensaje cuando no hay indicadores -->
          <v-card
            v-if="
              nodoSeleccionado &&
              (!nodoSeleccionado.indicadores || nodoSeleccionado.indicadores.length === 0)
            "
            class="mb-4"
            elevation="2"
          >
            <v-card-text class="text-center py-4">
              <v-icon color="grey" class="mr-2">mdi-alert</v-icon>
              Este nodo no tiene indicadores disponibles
            </v-card-text>
          </v-card>

          <!-- Información del Indicador Seleccionado -->
          <v-card v-if="indicadorSeleccionado" elevation="2">
            <v-card-title class="bg-green-lighten-3">
              <v-icon icon="mdi-information" class="mr-2"></v-icon>
              Información del Indicador Seleccionado
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="info-item"><strong>ID:</strong> {{ indicadorSeleccionado.id }}</div>
                  <div class="info-item">
                    <strong>Código:</strong> {{ indicadorSeleccionado.codigo }}
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <strong>Descripción:</strong> {{ indicadorSeleccionado.redaccion }}
                  </div>
                  <div class="info-item">
                    <strong>Tipo:</strong> {{ indicadorSeleccionado.tipo }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Resumen de Selecciones -->
          <v-card v-if="seleccionesGuardadas.length > 0" class="mt-4" elevation="2">
            <v-card-title class="bg-blue-lighten-4">
              <v-icon icon="mdi-check-all" class="mr-2"></v-icon>
              Selecciones Guardadas
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="(seleccion, index) in seleccionesGuardadas" :key="index">
                  <template v-slot:prepend>
                    <v-icon :color="obtenerColorPorTipo(seleccion.nodo.tipo)" class="mr-2">
                      {{ obtenerIconoPorTipo(seleccion.nodo.tipo) }}
                    </v-icon>
                  </template>

                  <v-list-item-title>
                    {{ formatearTipo(seleccion.nodo.tipo) }}
                    {{ seleccion.nodo.codigo || seleccion.nodo.id }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    <v-icon small color="green" class="mr-1">mdi-chart-bar</v-icon>
                    {{ seleccion.indicador.codigo }} - {{ seleccion.indicador.redaccion }}
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <v-btn icon size="small" color="error" @click="eliminarSeleccion(index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useTrazador } from '../../composables/useTrazador'

const props = defineProps({
  actividadId: {
    type: Number,
    default: null,
  },
})

// Composables
const {
  rutasDeLaActividadIndicador: datosAPI,
  rutaDeLaActividadIndicador,
  loading: loadingAPI,
  error: errorAPI,
  obtenerRutaActividadIndicador,
  obtenerAllRutaActividadIndicador,
} = useTrazador()

// Estado reactivo
const loading = ref(false)
const error = ref(null)
const rutaSeleccionada = ref(null)
const nodoSeleccionado = ref(null)
const indicadorSeleccionado = ref(null)
const seleccionesGuardadas = ref([])

// Computed properties
const datosActividad = computed(() => {
  return datosAPI.value || null
})

const nodosDisponibles = computed(() => {
  if (!rutaSeleccionada.value) return []

  // Filtrar para excluir el proyecto y la actividad actual
  return rutaSeleccionada.value.ruta
    .filter((nodo) => nodo.tipo !== 'Proyecto' && nodo.tipo !== 'Actividad')
    .map((nodo) => ({
      ...nodo,
      nombreCompleto: `${formatearTipo(nodo.tipo)}: ${nodo.codigo || nodo.id} - ${nodo.nombre || 'Sin nombre'}`,
    }))
})

// Funciones
const seleccionarRutaMasLarga = () => {
  if (!datosActividad.value || !datosActividad.value.rutas_posibles) return

  // Encontrar la ruta más larga (excluyendo proyecto)
  let rutaMasLarga = null
  let maxLongitud = -1

  datosActividad.value.rutas_posibles.forEach((ruta) => {
    // Filtrar para excluir proyecto y contar nodos válidos
    const longitudValida = ruta.ruta.filter(
      (nodo) => nodo.tipo !== 'Proyecto' && nodo.tipo !== 'Actividad',
    ).length

    if (longitudValida > maxLongitud) {
      maxLongitud = longitudValida
      rutaMasLarga = ruta
    }
  })

  rutaSeleccionada.value = rutaMasLarga
}

const cambiarNodo = () => {
  indicadorSeleccionado.value = null

  if (!nodoSeleccionado.value) return

  // Buscar si ya hay una selección guardada para este nodo
  const seleccionExistente = seleccionesGuardadas.value.find(
    (s) => s.nodo.id === nodoSeleccionado.value.id && s.nodo.tipo === nodoSeleccionado.value.tipo,
  )

  if (seleccionExistente && nodoSeleccionado.value.indicadores) {
    // Encontrar el indicador completo en la lista del nodo
    const indicadorCompleto = nodoSeleccionado.value.indicadores.find(
      (ind) => ind.id === seleccionExistente.indicador.id,
    )
    if (indicadorCompleto) {
      indicadorSeleccionado.value = indicadorCompleto
    }
  }
}

const guardarSeleccion = () => {
  if (!nodoSeleccionado.value || !indicadorSeleccionado.value) return

  // Eliminar selección existente para este nodo si la hay
  const indexExistente = seleccionesGuardadas.value.findIndex(
    (s) => s.nodo.id === nodoSeleccionado.value.id && s.nodo.tipo === nodoSeleccionado.value.tipo,
  )

  if (indexExistente !== -1) {
    seleccionesGuardadas.value.splice(indexExistente, 1)
  }

  // Agregar nueva selección
  seleccionesGuardadas.value.push({
    nodo: {
      id: nodoSeleccionado.value.id,
      tipo: nodoSeleccionado.value.tipo,
      codigo: nodoSeleccionado.value.codigo,
      nombre: nodoSeleccionado.value.nombre,
    },
    indicador: {
      id: indicadorSeleccionado.value.id,
      codigo: indicadorSeleccionado.value.codigo,
      redaccion: indicadorSeleccionado.value.redaccion,
      tipo: indicadorSeleccionado.value.tipo,
    },
  })

  // Actualizar tableData
  actualizarTableData()
}

const eliminarSeleccion = (index) => {
  seleccionesGuardadas.value.splice(index, 1)
  actualizarTableData()
}

const actualizarTableData = () => {
  // Emitir evento con las selecciones actualizadas
  emit('actualizar-ruta-trazado', seleccionesGuardadas.value)
}

// Funciones de utilidad
const obtenerColorPorTipo = (tipo) => {
  const colores = {
    Actividad: 'blue',
    Proceso: 'purple',
    ResultadoOG: 'orange',
    ResultadoOE: 'deep-orange',
    ObjetivoEspecifico: 'teal',
    ObjetivoGeneral: 'cyan',
    Proyecto: 'green',
    ProductoOE: 'amber',
  }
  return colores[tipo] || 'grey'
}

const obtenerIconoPorTipo = (tipo) => {
  const iconos = {
    Actividad: 'mdi-checkbox-marked-circle-outline',
    Proceso: 'mdi-cog-outline',
    ResultadoOG: 'mdi-chart-bell-curve',
    ResultadoOE: 'mdi-chart-bell-curve',
    ObjetivoEspecifico: 'mdi-target',
    ObjetivoGeneral: 'mdi-bullseye-arrow',
    Proyecto: 'mdi-clipboard-text-outline',
    ProductoOE: 'mdi-package-variant',
  }
  return iconos[tipo] || 'mdi-help-circle-outline'
}

const formatearTipo = (tipo) => {
  const nombres = {
    Actividad: 'Actividad',
    Proceso: 'Proceso',
    ResultadoOG: 'Resultado OG',
    ResultadoOE: 'Resultado OE',
    ObjetivoEspecifico: 'Objetivo Específico',
    ObjetivoGeneral: 'Objetivo General',
    Proyecto: 'Proyecto',
    ProductoOE: 'Producto OE',
  }
  return nombres[tipo] || tipo
}

const obtenerColorEstado = (estado) => {
  const colores = {
    EP: 'blue',
    ES: 'grey',
    PL: 'green',
  }
  return colores[estado] || 'grey'
}

// Watchers y lifecycle hooks
watch(
  () => props.actividadId,
  async (newId) => {
    if (newId) {
      await cargarDatos()
    } else {
      rutaSeleccionada.value = null
      nodoSeleccionado.value = null
      indicadorSeleccionado.value = null
      seleccionesGuardadas.value = []
    }
  },
)

watch(loadingAPI, (newVal) => {
  loading.value = newVal
})

watch(errorAPI, (newVal) => {
  error.value = newVal
})

watch(datosActividad, (newVal) => {
  if (newVal) {
    seleccionarRutaMasLarga()
  }
})

onMounted(async () => {
  if (props.actividadId) {
    await cargarDatos()
  }
})

// Carga de datos
const cargarDatos = async () => {
  if (!props.actividadId) return

  try {
    await obtenerAllRutaActividadIndicador(props.actividadId)

    // Cargar selecciones previas si existen
    // (esto dependerá de cómo estés manejando el estado persistente)
  } catch (err) {
    error.value = err.message
  }
}

// Emit para comunicar con el componente padre
const emit = defineEmits(['actualizar-ruta-trazado'])
</script>

<style scoped>
.info-item {
  margin-bottom: 8px;
  padding: 4px 0;
}

.text-error {
  color: #f44336;
}

.v-card {
  margin-bottom: 16px;
}

.v-list-item {
  border-bottom: 1px solid #eee;
}
</style>
