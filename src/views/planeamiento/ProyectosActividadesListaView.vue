<template>
  <v-container>
    <!-- Overlay de carga -->
    <v-overlay :model-value="cargandoGeneral" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Cargando proyecto...</p>
    </v-overlay>

    <!-- CONTENIDO -->
    <v-row v-if="!cargandoGeneral">
      <!-- Columna principal - Proyectos y PEI -->
      <v-col cols="12" md="8" lg="9">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Proyectos y PEI</span>
            <span class="text-caption text-grey">Total: {{ filteredItems.length }}</span>
          </v-card-title>

          <!-- Filtros simplificados -->
          <v-card-text class="pt-0 pb-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchQuery"
                  label="Buscar (por código o título)"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  clearable
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="tipoFiltro"
                  :items="tiposFiltro"
                  label="Mostrar"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Lista de PEI y proyectos -->
          <v-list class="py-0">
            <template v-for="item in filteredItems" :key="item.id">
              <!-- Item de PEI -->
              <v-list-item v-if="item.tipo === 'pei'" :value="item" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar color="deep-purple" class="mr-4">
                    <v-icon dark>mdi-chart-timeline-variant</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">
                  {{ item.titulo }}
                  <v-chip small color="deep-purple" text-color="white" class="ml-2"> PEI </v-chip>
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center">
                    <v-chip small color="success" text-color="white" class="mr-2"> Vigente </v-chip>
                    <span>Período: {{ item.periodo }}</span>
                  </div>
                  <div class="text-caption mt-1">{{ item.descripcion }}</div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex">
                    <v-tooltip text="Proceso de Planificación" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-calendar-text"
                          variant="text"
                          color="info"
                          :to="`/pei/${item.id}/planificar`"
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <!-- Item de Proyecto -->
              <v-list-item v-else-if="item.tipo === 'proyecto'" :value="item" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar color="primary" class="mr-4">
                    <v-icon dark>mdi-folder-text-outline</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">{{ item.titulo }}</v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center">
                    <v-chip small color="primary" text-color="white" class="mr-2">
                      {{ item.estado || 'En Planificación' }}
                    </v-chip>
                    <span v-if="item.codigo">Código: {{ item.codigo }}</span>
                  </div>
                  <div class="text-caption mt-1">{{ item.descripcion }}</div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex">
                    <v-tooltip text="Proceso de planificación" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-calendar-text"
                          variant="text"
                          color="secondary"
                          :to="`/proyecto/${item.id}/planificar`"
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <v-divider></v-divider>
            </template>

            <v-list-item v-if="filteredItems.length === 0">
              <v-list-item-title class="text-grey">No se encontraron elementos</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Columna lateral - Resumen simplificado -->
      <v-col cols="12" md="4" lg="3">
        <!-- Tarjeta de resumen -->
        <v-card elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-chart-box</v-icon>
            Resumen
          </v-card-title>

          <v-list density="comfortable">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="deep-purple">mdi-chart-timeline-variant</v-icon>
              </template>
              <v-list-item-title>PEI Vigente</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ peiVigente ? 'Activo' : 'No disponible' }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-folder</v-icon>
              </template>
              <v-list-item-title>Proyectos</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{ proyectos.length }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { inject } from 'vue'

// Estados
const cargandoGeneral = computed(() => cargandoProyecto.value)
const searchQuery = ref('')
const tipoFiltro = ref('todos')
const tiposFiltro = ref([
  { value: 'todos', title: 'Todos' },
  { value: 'pei', title: 'PEI Vigente' },
  { value: 'proyectos', title: 'Solo Proyectos' },
])

// El pei vigente
const peiVigente = inject('peiVigente')

// Inicializar el store
const proyectosStore = useProyectoStore()

/* DESESTRUCTURACION  */
// Referencias
const {
  proyectosPlanificacionFiltrado: proyectosRaw,
  cargando: cargandoProyecto,
  peiVigente: peiActual,
} = storeToRefs(proyectosStore)

// Funciones
const { obtenerProyectosPlanificacion, obtenerProyectosPlanificacionFiltrados } = proyectosStore

// Procesar proyectos para agregar tipo
const proyectos = computed(() => {
  return (
    proyectosRaw.value?.map((p) => ({
      ...p,
      tipo: 'proyecto',
      titulo: p.nombre || p.titulo || 'Sin título',
      codigo: p.codigo || `PROY-${p.id}`,
      descripcion: p.descripcion || 'Sin descripción',
      estado: p.estado || 'En Planificación',
    })) || []
  )
})

// Procesar PEI vigente como item de la lista
const peiItem = computed(() => {
  if (!peiVigente.value) return null

  return {
    id: peiVigente.value.id,
    tipo: 'pei',
    titulo: peiVigente.value.nombre || 'PEI Vigente',
    codigo: `PEI-${peiVigente.value.id}`,
    descripcion: peiVigente.value.descripcion || 'Plan Estratégico Institucional vigente',
    periodo: `${formatFecha(peiVigente.value.fecha_inicio)} - ${formatFecha(peiVigente.value.fecha_fin)}`,
    estado: 'Vigente',
  }
})

// Hook
onMounted(async () => {
  await cargarDatos()
})

// Funcion de carga de store
const cargarDatos = async () => {
  try {
    await Promise.all([
      obtenerProyectosPlanificacion(peiVigente.value.id),
      obtenerProyectosPlanificacionFiltrados(peiVigente.value.id),
    ])
  } catch (err) {
    console.log('Error al cargar la información stores', err)
  }
}

// Items combinados y filtrados (CORREGIDO)
const filteredItems = computed(() => {
  let items = []

  // Agregar PEI si corresponde
  if (tipoFiltro.value === 'todos' || tipoFiltro.value === 'pei') {
    if (peiItem.value) {
      items.push(peiItem.value)
    }
  }

  // Agregar proyectos si corresponde
  if (tipoFiltro.value === 'todos' || tipoFiltro.value === 'proyectos') {
    items = [...items, ...proyectos.value]
  }

  // Aplicar filtro de búsqueda (CORREGIDO - con manejo de valores nulos)
  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase().trim()
    items = items.filter((item) => {
      // Verificar que las propiedades existan antes de acceder a toLowerCase()
      const codigoMatch = item.codigo ? item.codigo.toLowerCase().includes(query) : false
      const tituloMatch = item.titulo ? item.titulo.toLowerCase().includes(query) : false
      const descripcionMatch = item.descripcion
        ? item.descripcion.toLowerCase().includes(query)
        : false

      return codigoMatch || tituloMatch || descripcionMatch
    })
  }

  return items
})

// Función para formatear fechas
const formatFecha = (fechaString) => {
  if (!fechaString) return 'Sin fecha'
  try {
    const fecha = new Date(fechaString)
    // Verificar si es una fecha válida
    if (isNaN(fecha.getTime())) return 'Fecha inválida'

    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Fecha inválida'
  }
}
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.v-card-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.text-right {
  text-align: right;
}

.v-avatar {
  flex-shrink: 0;
}

/* Estilo especial para el item del PEI */
.v-list-item:has(.v-avatar[color='deep-purple']) {
  background-color: rgba(103, 58, 183, 0.04);
  border-left: 4px solid rgb(103, 58, 183);
}
</style>
