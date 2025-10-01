<template>
  <v-container>
    <!--overlay de carga-->
    <v-overlay :model-value="cargandoGeneral" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Cargando proyecto...</p>
    </v-overlay>

    <!--CONTENIDO-->
    <v-row v-if="!cargandoGeneral">
      <!-- Columna principal - Proyectos y Actividades -->
      <v-col cols="12" md="8" lg="9">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Proyectos y Actividades</span>
            <span class="text-caption text-grey">Total: {{ filteredItems.length }}</span>
          </v-card-title>

          <!-- Filtros -->
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

          <!-- Lista de proyectos y actividades -->
          <v-list class="py-0">
            <template v-for="item in filteredItems" :key="item.id">
              <!-- Item de Proyecto -->
              <v-list-item v-if="item.tipo === 'proyecto'" :value="item" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar color="primary" class="mr-4">
                    <v-icon dark>mdi-folder-text-outline</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">{{ item.titulo }}</v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center">
                    <v-chip small color="primary" text-color="white" class="mr-2">
                      En Planificación
                    </v-chip>
                    <span>Código: {{ item.codigo }}</span>
                  </div>
                  <div class="text-caption mt-1">{{ item.descripcion }}</div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex">
                    <!-- <v-tooltip text="Ver detalles" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-eye-outline"
                          variant="text"
                          color="primary"
                        ></v-btn>
                      </template>
                    </v-tooltip> -->

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

                    <div class="d-flex">
                      <!-- <v-tooltip text="Solicitud" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-file-document-edit"
                            variant="text"
                            color="info"
                            :to="`/proyecto/${item.id}/planificar`"
                          ></v-btn>
                        </template>
                      </v-tooltip> -->
                      <!-- <v-tooltip text="Rendición de cuentas" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-clipboard-check-outline"
                            variant="text"
                            color="success"
                            :to="`/proyecto/${item.id}/planificar`"
                          ></v-btn>
                        </template>
                      </v-tooltip> -->
                      <!-- <v-tooltip text="Informe de actividad" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-file-chart"
                            variant="text"
                            color="warning"
                            :to="`/proyecto/${item.id}/planificar`"
                          ></v-btn>
                        </template>
                      </v-tooltip> -->
                    </div>
                  </div>
                </template>
              </v-list-item>

              <!-- Item de Actividad -->
              <v-list-item v-else :value="item" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar color="orange" class="mr-4">
                    <v-icon dark>mdi-checkbox-marked-circle-outline</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">{{ item.titulo }}</v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center">
                    <v-chip small color="orange" text-color="white" class="mr-2">
                      {{ item.estado }}
                    </v-chip>
                    <span>Código: {{ item.codigo }}</span>
                  </div>
                  <div class="text-caption mt-1">{{ item.responsable }}</div>
                  <v-progress-linear
                    :model-value="item.avance"
                    height="8"
                    color="light-green"
                    class="mt-2"
                  ></v-progress-linear>
                  <div class="d-flex justify-space-between mt-1">
                    <span class="text-caption">Avance: {{ item.avance }}%</span>
                    <span class="text-caption">{{ item.fecha }}</span>
                  </div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex">
                    <!-- <v-tooltip text="Ver detalle" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-eye"
                          variant="text"
                          color="primary"
                          @click="verDetalleActividad(item)"
                        ></v-btn>
                      </template>
                    </v-tooltip> -->

                    <!-- <v-tooltip text="Generar solicitud" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-file-document-edit"
                          variant="text"
                          color="secondary"
                          @click="generarSolicitud(item)"
                        ></v-btn>
                      </template>
                    </v-tooltip> -->
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

      <!-- Columna lateral - Resumen -->
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
                <v-icon color="primary">mdi-folder</v-icon>
              </template>
              <v-list-item-title>Proyectos en planificación</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{ proyectos.length }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="orange">mdi-checkbox-marked-circle-outline</v-icon>
              </template>
              <v-list-item-title>Actividades PEI</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{
                actividades.length
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="green">mdi-check-all</v-icon>
              </template>
              <v-list-item-title>Actividades completadas</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ actividadesCompletadas }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="blue">mdi-progress-check</v-icon>
              </template>
              <v-list-item-title>Avance promedio</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ avancePromedio }}%
              </v-list-item-subtitle>
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
const tipoFiltro = ref('ambos')
const tiposFiltro = ref([
  { value: 'proyectos', title: 'Solo Proyectos' },
  { value: 'actividades', title: 'Solo Actividades' },
  { value: 'ambos', title: 'Proyectos y Actividades' },
  { value: 'pei', title: 'PEI 2022 - 2027' },
])

//El pei vigente
const peiVigente = inject('peiVigente')

// Inicializar el store
const proyectosStore = useProyectoStore()

/* DESESTRUCTURACION  */
// Referencias
const { proyectosPlanificacion: proyectosRaw, cargando: cargandoProyecto } =
  storeToRefs(proyectosStore)
// Funciones
const { obtenerProyectosPlanificacionFiltrados } = proyectosStore

// Procesar proyectos para agregar tipo
const proyectos = computed(() => {
  return (
    proyectosRaw.value?.map((p) => ({
      ...p,
      tipo: 'proyecto',
    })) || []
  )
})

// Hook
onMounted(async () => {
  await cargarDatos()
})

// Funcion de carga de store
const cargarDatos = async () => {
  try {
    //await obtenerProyectosPlanificacion(peiVigente.value.id)
    await obtenerProyectosPlanificacionFiltrados(peiVigente.value.id)
  } catch (err) {
    console.log('Error al cargar la informacion stores', err)
  }
}

// Datos dummy para actividades PEI
const actividades = ref([])

// Items combinados y filtrados
const filteredItems = computed(() => {
  let items = []

  // Agregar proyectos si corresponde
  if (tipoFiltro.value === 'proyectos' || tipoFiltro.value === 'ambos') {
    items = [...items, ...proyectos.value]
  }

  // Agregar actividades si corresponde
  if (tipoFiltro.value === 'actividades' || tipoFiltro.value === 'ambos') {
    items = [...items, ...actividades.value]
  }

  // Aplicar filtro de búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(
      (item) =>
        item.codigo.toLowerCase().includes(query) || item.titulo.toLowerCase().includes(query),
    )
  }

  return items
})

// Actividades completadas
const actividadesCompletadas = computed(() => {
  return actividades.value.filter((a) => a.avance === 100).length
})

// Avance promedio
const avancePromedio = computed(() => {
  if (actividades.value.length === 0) return 0
  const total = actividades.value.reduce((sum, a) => sum + a.avance, 0)
  return Math.round(total / actividades.value.length)
})

// Métodos para actividades
// const verDetalleActividad = (actividad) => {
//   console.log('Ver detalle de:', actividad)
// }

// const generarSolicitud = (actividad) => {
//   console.log('Generar solicitud para:', actividad)
// }
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

.v-progress-linear {
  border-radius: 4px;
}

.v-avatar {
  flex-shrink: 0;
}
</style>
