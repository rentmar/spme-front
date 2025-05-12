<template>
  <v-container>
    <!-- Overlay de carga -->
    <v-overlay :model-value="cargandoGeneral" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Cargando proyecto...</p>
    </v-overlay>

    <!-- CONTENIDO -->
    <v-row v-if="!cargandoGeneral">
      <!-- Columna principal (80% ancho) -->
      <v-col cols="12" md="9">
        <PaginaTituloIcono :titulo="'Estructura'" :icon="'mdi-file-cog'" />
        <ProyectoHeader v-if="proyecto" :proyecto="proyecto" />

        <!-- Tarjeta principal con tabla - Aumentada en altura -->
        <v-card class="mb-4" min-height="600">
          <v-toolbar color="info" density="compact">
            <v-toolbar-title>Objetivos</v-toolbar-title>
            <v-spacer></v-spacer>

            <!-- Botones de acción -->
            <v-tooltip
              v-for="(action, i) in toolbarActions"
              :key="i"
              :text="action.tooltip"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  :color="action.color"
                  size="large"
                  class="mx-1"
                  @click="action.method"
                >
                  <v-icon>{{ action.icon }}</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </v-toolbar>

          <!-- Tabla de objetivos -->
          <v-card-text>
            <div class="table-responsive">
              <v-table>
                <thead>
                  <tr>
                    <th v-for="(header, i) in tableHeaders" :key="i">{{ header }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(objetivo, index) in objetivosGenerales" :key="`og-${index}`">
                    <!-- Objetivo General -->
                    <td>
                      <strong>{{ objetivo.nombre }}</strong>
                      <p class="text-caption">{{ objetivo.descripcion }}</p>
                      <v-chip v-if="objetivo.relacionPei" color="primary" small>
                        {{ objetivo.peiRelacionado }}
                      </v-chip>
                    </td>

                    <!-- Objetivos Específicos -->
                    <td>
                      <div v-if="objetivo.objetivosEspecificos?.length">
                        <div
                          v-for="(oe, oeIndex) in objetivo.objetivosEspecificos"
                          :key="`oe-${oeIndex}`"
                          class="mb-2"
                        >
                          <strong>{{ oe.nombre }}</strong>
                          <p class="text-caption">{{ oe.descripcion }}</p>
                          <v-btn
                            icon
                            size="x-small"
                            color="error"
                            @click.stop="eliminarObjetivoEspecifico(index, oeIndex)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </div>
                      <v-btn
                        size="x-small"
                        color="teal"
                        variant="text"
                        @click.stop="abrirModalObjetivoEspecifico(index)"
                      >
                        <v-icon left>mdi-plus</v-icon>Agregar
                      </v-btn>
                    </td>

                    <!-- Resultados -->
                    <td>
                      <div v-if="objetivo.resultados?.length">
                        <div
                          v-for="(resultado, resIndex) in objetivo.resultados"
                          :key="`res-${resIndex}`"
                          class="mb-2"
                        >
                          <strong>{{ resultado.nombre }}</strong>
                          <p class="text-caption">{{ resultado.descripcion }}</p>
                          <v-btn
                            icon
                            size="x-small"
                            color="error"
                            @click.stop="eliminarResultado(index, resIndex)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </div>
                      <v-btn
                        size="x-small"
                        color="success"
                        variant="text"
                        @click.stop="abrirModalResultado(index)"
                      >
                        <v-icon left>mdi-plus</v-icon>Agregar
                      </v-btn>
                    </td>

                    <!-- Indicadores -->
                    <td>
                      <v-chip
                        v-for="(indicador, indIndex) in objetivo.indicadores"
                        :key="`ind-${indIndex}`"
                        color="info"
                        small
                        class="ma-1"
                        @click.stop="editarIndicador(index, indIndex)"
                      >
                        {{ indicador.nombre }}
                        <v-icon right size="x-small">mdi-pencil</v-icon>
                      </v-chip>
                      <v-btn
                        size="x-small"
                        color="secondary"
                        variant="text"
                        @click.stop="abrirModalIndicador(index)"
                      >
                        <v-icon left>mdi-plus</v-icon>Agregar
                      </v-btn>
                    </td>

                    <!-- KPIs -->
                    <td>
                      <v-chip
                        v-for="(kpi, kpiIndex) in objetivo.kpis"
                        :key="`kpi-${kpiIndex}`"
                        color="warning"
                        small
                        class="ma-1"
                        @click.stop="editarKPI(index, kpiIndex)"
                      >
                        {{ kpi.nombre }}: {{ kpi.actual }}/{{ kpi.meta }}
                        <v-icon right size="x-small">mdi-pencil</v-icon>
                      </v-chip>
                      <v-btn
                        size="x-small"
                        color="orange"
                        variant="text"
                        @click.stop="abrirModalKPI(index)"
                      >
                        <v-icon left>mdi-plus</v-icon>Agregar
                      </v-btn>
                    </td>

                    <!-- Acciones -->
                    <td>
                      <v-btn icon size="small" color="primary" @click.stop="editarObjetivo(index)">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="error"
                        @click.stop="eliminarObjetivo(index)"
                        class="ml-1"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Columna lateral (20% ancho) -->
      <v-col cols="12" md="3">
        <v-card class="sticky-card">
          <v-card-title class="bg-primary text-white">
            <h3 class="text-h5">ACCIONES RÁPIDAS</h3>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-list density="comfortable">
              <v-list-item
                v-for="(action, i) in quickActions"
                :key="i"
                @click="action.method"
                class="py-2"
              >
                <template #prepend>
                  <v-icon :icon="action.icon" :color="action.color" class="mr-3"></v-icon>
                </template>
                <v-list-item-title class="text-wrap">
                  {{ action.title }}
                </v-list-item-title>
                <template #append>
                  <v-icon icon="mdi-chevron-right"></v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- MODALES -->
    <!-- Modal Objetivo General -->
    <v-dialog v-model="dialogNuevoObjetivo" max-width="800">
      <v-card>
        <v-stepper v-model="pasoActual">
          <v-stepper-header>
            <v-stepper-item value="1" title="Datos básicos"></v-stepper-item>
            <v-stepper-item value="2" title="Relación con PEI"></v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <v-stepper-window-item value="1">
              <v-card-text>
                <v-text-field v-model="nuevoObjetivo.nombre" label="Nombre" required></v-text-field>
                <v-textarea
                  v-model="nuevoObjetivo.descripcion"
                  label="Descripción"
                  rows="3"
                ></v-textarea>
              </v-card-text>
            </v-stepper-window-item>

            <v-stepper-window-item value="2">
              <v-card-text>
                <v-switch
                  v-model="nuevoObjetivo.relacionPei"
                  label="¿Relación con PEI?"
                  color="primary"
                ></v-switch>
                <v-select
                  v-if="nuevoObjetivo.relacionPei"
                  v-model="nuevoObjetivo.peiRelacionado"
                  :items="itemsPei"
                  label="PEI relacionado"
                ></v-select>
              </v-card-text>
            </v-stepper-window-item>
          </v-stepper-window>

          <v-card-actions class="justify-end">
            <v-btn v-if="pasoActual > 1" variant="text" @click="pasoActual--">Atrás</v-btn>
            <v-btn v-if="pasoActual < 2" color="primary" @click="pasoActual++">Siguiente</v-btn>
            <v-btn v-if="pasoActual === 2" color="primary" @click="agregarObjetivo">Guardar</v-btn>
          </v-card-actions>
        </v-stepper>
      </v-card>
    </v-dialog>

    <!-- Modal Objetivo Específico -->
    <v-dialog v-model="dialogNuevoObjetivoEspecifico" max-width="800">
      <v-card>
        <v-card-title>Agregar Objetivo Específico</v-card-title>
        <v-card-text>
          <v-select
            v-model="nuevoObjetivoEspecifico.objetivoGeneralRelacionado"
            :items="objetivosGenerales"
            item-title="nombre"
            return-object
            label="Objetivo General"
          ></v-select>
          <v-text-field
            v-model="nuevoObjetivoEspecifico.nombre"
            label="Nombre"
            required
          ></v-text-field>
          <v-textarea
            v-model="nuevoObjetivoEspecifico.descripcion"
            label="Descripción"
            rows="3"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="agregarObjetivoEspecifico">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Indicador -->
    <v-dialog v-model="dialogNuevoIndicador" max-width="600">
      <v-card>
        <v-card-title>Agregar Indicador</v-card-title>
        <v-card-text>
          <v-text-field v-model="nuevoIndicador.nombre" label="Nombre"></v-text-field>
          <v-textarea v-model="nuevoIndicador.descripcion" label="Descripción"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="agregarIndicador">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal KPI -->
    <v-dialog v-model="dialogNuevoKPI" max-width="600">
      <v-card>
        <v-card-title>Agregar KPI</v-card-title>
        <v-card-text>
          <v-text-field v-model="nuevoKPI.nombre" label="Nombre"></v-text-field>
          <v-text-field v-model="nuevoKPI.meta" label="Meta" type="number"></v-text-field>
          <v-text-field v-model="nuevoKPI.actual" label="Valor actual" type="number"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="agregarKPI">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Resultado -->
    <v-dialog v-model="dialogNuevoResultado" max-width="600">
      <v-card>
        <v-card-title>Agregar Resultado</v-card-title>
        <v-card-text>
          <v-select
            v-model="nuevoResultado.objetivoRelacionado"
            :items="objetivosGenerales"
            item-title="nombre"
            return-object
            label="Objetivo relacionado"
          ></v-select>
          <v-text-field v-model="nuevoResultado.nombre" label="Nombre"></v-text-field>
          <v-textarea v-model="nuevoResultado.descripcion" label="Descripción"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="agregarResultado">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoHeader from '@/modules/proyecto/components/partials/ProyectoHeader.vue'

// Store y rutas
const proyectoStore = useProyectoStore()
const route = useRoute()
const { proyectoActual: proyecto, cargando: cargandoProyecto } = storeToRefs(proyectoStore)
const { obtenerProyectoPorId } = proyectoStore

// Estado
const cargandoGeneral = computed(() => cargandoProyecto.value)
const pasoActual = ref(1)
const itemsPei = ['PEI 2023-2025', 'PEI 2025-2027', 'PEI Estratégico']

// Datos del marco lógico
const objetivosGenerales = ref([
  {
    id: 1,
    nombre: 'Mejorar la eficiencia operativa',
    descripcion:
      'Incrementar la productividad en al menos un 20% mediante la optimización de procesos',
    relacionPei: true,
    peiRelacionado: 'PEI 2023-2025',
    objetivosEspecificos: [
      {
        id: 1,
        nombre: 'Optimizar procesos productivos',
        descripcion: 'Reducir tiempos muertos en la cadena de producción',
      },
    ],
    resultados: [
      {
        id: 1,
        nombre: 'Procesos estandarizados',
        descripcion: 'Manuales de procedimiento actualizados',
      },
    ],
    indicadores: [
      {
        id: 1,
        nombre: 'Tiempo de ciclo',
        descripcion: 'Reducción del tiempo de ciclo de producción',
      },
    ],
    kpis: [
      {
        id: 1,
        nombre: 'KPI Eficiencia',
        meta: 120,
        actual: 95,
      },
    ],
  },
])

// Modales
const dialogNuevoObjetivo = ref(false)
const dialogNuevoObjetivoEspecifico = ref(false)
const dialogNuevoIndicador = ref(false)
const dialogNuevoKPI = ref(false)
const dialogNuevoResultado = ref(false)

// Formularios
const nuevoObjetivo = ref({
  nombre: '',
  descripcion: '',
  relacionPei: false,
  peiRelacionado: null,
  objetivosEspecificos: [],
  resultados: [],
  indicadores: [],
  kpis: [],
})

const nuevoObjetivoEspecifico = ref({
  nombre: '',
  descripcion: '',
  objetivoGeneralRelacionado: null,
})

const nuevoIndicador = ref({
  nombre: '',
  descripcion: '',
  objetivoIndex: null,
})

const nuevoKPI = ref({
  nombre: '',
  meta: 0,
  actual: 0,
  objetivoIndex: null,
})

const nuevoResultado = ref({
  nombre: '',
  descripcion: '',
  objetivoRelacionado: null,
})

// Configuración de UI
const tableHeaders = [
  'OBJETIVO GENERAL',
  'OBJETIVOS ESPECÍFICOS',
  'RESULTADOS',
  'INDICADORES',
  'KPIs',
  'ACCIONES',
]

const toolbarActions = [
  {
    tooltip: 'Agregar objetivo nuevo',
    color: 'primary',
    icon: 'mdi-bullseye-arrow',
    method: () => (dialogNuevoObjetivo.value = true),
  },
  {
    tooltip: 'Agregar objetivo específico',
    color: 'teal',
    icon: 'mdi-target',
    method: () => (dialogNuevoObjetivoEspecifico.value = true),
  },
  {
    tooltip: 'Agregar indicador',
    color: 'secondary',
    icon: 'mdi-chart-bar',
    method: () => abrirModalIndicador(null),
  },
  {
    tooltip: 'Agregar resultado',
    color: 'success',
    icon: 'mdi-checkbox-marked-circle-outline',
    method: () => abrirModalResultado(null),
  },
]

const quickActions = [
  {
    title: 'Agregar objetivo general',
    icon: 'mdi-bullseye-arrow',
    color: 'primary',
    method: () => (dialogNuevoObjetivo.value = true),
  },
  {
    title: 'Agregar objetivo específico',
    icon: 'mdi-target',
    color: 'teal',
    method: () => (dialogNuevoObjetivoEspecifico.value = true),
  },
  {
    title: 'Agregar indicador',
    icon: 'mdi-chart-bar',
    color: 'secondary',
    method: () => abrirModalIndicador(null),
  },
  {
    title: 'Agregar resultado',
    icon: 'mdi-checkbox-marked-circle-outline',
    color: 'success',
    method: () => abrirModalResultado(null),
  },
]

// Métodos
const agregarObjetivo = () => {
  const nuevo = {
    id: Date.now(),
    ...nuevoObjetivo.value,
    objetivosEspecificos: [],
    resultados: [],
    indicadores: [],
    kpis: [],
  }
  objetivosGenerales.value.push(nuevo)
  dialogNuevoObjetivo.value = false
  resetearFormularioObjetivo()
}

const agregarObjetivoEspecifico = () => {
  if (nuevoObjetivoEspecifico.value.objetivoGeneralRelacionado) {
    const objetivo = nuevoObjetivoEspecifico.value.objetivoGeneralRelacionado
    const index = objetivosGenerales.value.findIndex((og) => og.id === objetivo.id)

    if (index !== -1) {
      const nuevo = {
        id: Date.now(),
        nombre: nuevoObjetivoEspecifico.value.nombre,
        descripcion: nuevoObjetivoEspecifico.value.descripcion,
      }

      if (!objetivosGenerales.value[index].objetivosEspecificos) {
        objetivosGenerales.value[index].objetivosEspecificos = []
      }

      objetivosGenerales.value[index].objetivosEspecificos.push(nuevo)
      dialogNuevoObjetivoEspecifico.value = false
      nuevoObjetivoEspecifico.value = {
        nombre: '',
        descripcion: '',
        objetivoGeneralRelacionado: null,
      }
    }
  }
}

const abrirModalObjetivoEspecifico = (index) => {
  nuevoObjetivoEspecifico.value = {
    nombre: '',
    descripcion: '',
    objetivoGeneralRelacionado: objetivosGenerales.value[index],
  }
  dialogNuevoObjetivoEspecifico.value = true
}

const abrirModalIndicador = (index) => {
  nuevoIndicador.value = {
    nombre: '',
    descripcion: '',
    objetivoIndex: index,
  }
  dialogNuevoIndicador.value = true
}

const agregarIndicador = () => {
  if (nuevoIndicador.value.objetivoIndex !== null) {
    const indicador = {
      id: Date.now(),
      nombre: nuevoIndicador.value.nombre,
      descripcion: nuevoIndicador.value.descripcion,
    }
    objetivosGenerales.value[nuevoIndicador.value.objetivoIndex].indicadores.push(indicador)
    dialogNuevoIndicador.value = false
  }
}

const abrirModalResultado = (index) => {
  nuevoResultado.value = {
    nombre: '',
    descripcion: '',
    objetivoRelacionado: index !== null ? objetivosGenerales.value[index] : null,
  }
  dialogNuevoResultado.value = true
}

const agregarResultado = () => {
  if (nuevoResultado.value.objetivoRelacionado) {
    const resultado = {
      id: Date.now(),
      nombre: nuevoResultado.value.nombre,
      descripcion: nuevoResultado.value.descripcion,
    }

    const index = objetivosGenerales.value.findIndex(
      (og) => og.id === nuevoResultado.value.objetivoRelacionado.id,
    )
    if (index !== -1) {
      if (!objetivosGenerales.value[index].resultados) {
        objetivosGenerales.value[index].resultados = []
      }
      objetivosGenerales.value[index].resultados.push(resultado)
      dialogNuevoResultado.value = false
    }
  }
}

const eliminarObjetivo = (index) => {
  if (confirm('¿Está seguro de eliminar este objetivo y todos sus elementos relacionados?')) {
    objetivosGenerales.value.splice(index, 1)
  }
}

const eliminarObjetivoEspecifico = (ogIndex, oeIndex) => {
  if (confirm('¿Está seguro de eliminar este objetivo específico?')) {
    objetivosGenerales.value[ogIndex].objetivosEspecificos.splice(oeIndex, 1)
  }
}

const eliminarResultado = (ogIndex, resIndex) => {
  if (confirm('¿Está seguro de eliminar este resultado?')) {
    objetivosGenerales.value[ogIndex].resultados.splice(resIndex, 1)
  }
}

const resetearFormularioObjetivo = () => {
  nuevoObjetivo.value = {
    nombre: '',
    descripcion: '',
    relacionPei: false,
    peiRelacionado: null,
  }
  pasoActual.value = 1
}

// Inicialización
onMounted(async () => {
  try {
    await obtenerProyectoPorId(route.params.id)
  } catch (error) {
    console.log('Error en carga del proyecto', error)
  }
})
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
  width: 100%;
}

.sticky-card {
  position: sticky;
  top: 20px;
  border-radius: 12px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.v-list-item {
  min-height: 48px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.text-wrap {
  white-space: normal;
  line-height: 1.4;
}

.v-chip {
  cursor: pointer;
  transition: transform 0.2s;
}

.v-chip:hover {
  transform: scale(1.05);
}

.v-btn--icon {
  transition: transform 0.2s;
}

.v-btn--icon:hover {
  transform: scale(1.2);
}

.text-caption {
  color: rgba(0, 0, 0, 0.6);
}

.v-table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

@media (max-width: 960px) {
  .sticky-card {
    position: static;
    margin-bottom: 20px;
  }
}
</style>
