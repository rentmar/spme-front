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
            <v-toolbar-title>MARCO LOGICO</v-toolbar-title>
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
                      <v-chip v-if="objetivo.relacionPei" color="primary" small>
                        {{ objetivo.indicador_pei }} </v-chip
                      ><v-chip v-if="objetivo.relacionPei" color="primary" small>
                        {{ objetivo.objetivo_pei }}
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
      <v-card style="max-height: 90vh; display: flex; flex-direction: column">
        <v-card-title>Agregar Objetivo General</v-card-title>
        <v-stepper :items="['Datos', 'Relacion Pei']" editable style="flex: 1; overflow-y: auto">
          <template v-slot:item.1>
            <v-card-text>
              <v-text-field
                variant="outlined"
                v-model="nuevoObjetivo.codigo"
                label="Codigo"
                required
              ></v-text-field>
              <v-textarea
                variant="outlined"
                v-model="nuevoObjetivo.descripcion"
                label="Descripción"
                rows="2"
              ></v-textarea>
              <v-textarea
                variant="outlined"
                v-model="nuevoObjetivo.supuestos"
                label="Supuestos"
                rows="2"
              >
              </v-textarea>
              <v-textarea
                variant="outlined"
                v-model="nuevoObjetivo.riesgos"
                label="Riesgos"
                rows="2"
              ></v-textarea>
            </v-card-text>
          </template>

          <template v-slot:item.2>
            <v-card-text>
              <v-switch
                v-model="nuevoObjetivo.relacionPei"
                label="¿Relación con PEI?"
                color="primary"
                variant="outlined"
              ></v-switch>
              <v-select
                v-if="nuevoObjetivo.relacionPei"
                v-model="nuevoObjetivo.peiRelacionado"
                :items="itemsPei"
                label="PEI relacionado"
                variant="outlined"
              ></v-select>
              <v-select
                v-if="nuevoObjetivo.relacionPei"
                v-model="nuevoObjetivo.indicador_pei"
                :items="itemsIndicadoresPei"
                label="Indicador Pei"
                variant="outlined"
              >
              </v-select>
              <v-select
                v-if="nuevoObjetivo.relacionPei"
                v-model="nuevoObjetivo.objetivo_pei"
                :items="itemsobjEspPei"
                label="Objetivo Especifico Pei"
                variant="outlined"
              ></v-select>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="primary" @click="agregarObjetivo">Guardar</v-btn>
            </v-card-actions>
          </template>
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
    {{ nuevoObjetivo }}
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
const idproyecto = route.params.id

const { proyectoActual: proyecto, cargando: cargandoProyecto } = storeToRefs(proyectoStore)
const { obtenerProyectoPorId } = proyectoStore

onMounted(async () => {
  await cargarDatos()
})

//Funcion de carga de stores
const cargarDatos = async () => {
  try {
    await obtenerProyectoPorId(idproyecto)
  } catch (err) {
    console.log('Error al cargar la informacion stores', err)
  }
}

// Estado
const cargandoGeneral = computed(() => cargandoProyecto.value)
const pasoActual = ref(1)
const itemsPei = ['PEI 2023-2025', 'PEI 2025-2027', 'PEI Estratégico']
const itemsIndicadoresPei = [
  'Indicador Pei 1',
  'Indicador Pei 2',
  'Indicador Pei 3',
  'Indicador Pei 4',
]
const itemsobjEspPei = ['Obj pei 1', 'Obj pei 2', 'Obj pei 3']

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
    kpis: [{ id: 1, nombre: 'KPI Eficiencia', meta: 120, actual: 95 }],
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
  codigo: '',
  descripcion: '',
  supuestos: '',
  riesgos: '',
  relacionPei: false,
  peiRelacionado: null,
  indicador_pei: null,
  objetivo_pei: null,
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

// Configuración
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
  objetivosGenerales.value.push({
    id: Date.now(),
    ...nuevoObjetivo.value,
    objetivosEspecificos: [],
    resultados: [],
    indicadores: [],
    kpis: [],
  })
  dialogNuevoObjetivo.value = false
  resetearFormularioObjetivo()
}

const resetearFormularioObjetivo = () => {
  nuevoObjetivo.value = {
    codigo: '',
    descripcion: '',
    supuestos: '',
    riesgos: '',
    relacionPei: false,
    peiRelacionado: null,
    indicador_pei: null,
    objetivo_pei: null,
  }
  pasoActual.value = 1
}

const agregarObjetivoEspecifico = () => {
  const objetivo = nuevoObjetivoEspecifico.value.objetivoGeneralRelacionado
  const index = objetivosGenerales.value.findIndex((og) => og.id === objetivo.id)
  if (index !== -1) {
    objetivosGenerales.value[index].objetivosEspecificos.push({
      id: Date.now(),
      nombre: nuevoObjetivoEspecifico.value.nombre,
      descripcion: nuevoObjetivoEspecifico.value.descripcion,
    })
    dialogNuevoObjetivoEspecifico.value = false
    nuevoObjetivoEspecifico.value = {
      nombre: '',
      descripcion: '',
      objetivoGeneralRelacionado: null,
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
    objetivosGenerales.value[nuevoIndicador.value.objetivoIndex].indicadores.push({
      id: Date.now(),
      nombre: nuevoIndicador.value.nombre,
      descripcion: nuevoIndicador.value.descripcion,
    })
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
  const objetivo = nuevoResultado.value.objetivoRelacionado
  const index = objetivosGenerales.value.findIndex((og) => og.id === objetivo.id)
  if (index !== -1) {
    objetivosGenerales.value[index].resultados.push({
      id: Date.now(),
      nombre: nuevoResultado.value.nombre,
      descripcion: nuevoResultado.value.descripcion,
    })
    dialogNuevoResultado.value = false
  }
}

const abrirModalKPI = (index) => {
  nuevoKPI.value = {
    nombre: '',
    meta: 0,
    actual: 0,
    objetivoIndex: index,
  }
  dialogNuevoKPI.value = true
}

const agregarKPI = () => {
  if (nuevoKPI.value.objetivoIndex !== null) {
    objetivosGenerales.value[nuevoKPI.value.objetivoIndex].kpis.push({
      id: Date.now(),
      nombre: nuevoKPI.value.nombre,
      meta: nuevoKPI.value.meta,
      actual: nuevoKPI.value.actual,
    })
    dialogNuevoKPI.value = false
  }
}

const eliminarObjetivo = (index) => {
  objetivosGenerales.value.splice(index, 1)
}

const editarObjetivo = (index) => {
  // Aquí podrías implementar una lógica de edición si es necesario
  console.log('Editar objetivo', index)
}

const eliminarObjetivoEspecifico = (objIndex, espIndex) => {
  objetivosGenerales.value[objIndex].objetivosEspecificos.splice(espIndex, 1)
}

const eliminarResultado = (objIndex, resIndex) => {
  objetivosGenerales.value[objIndex].resultados.splice(resIndex, 1)
}

const editarIndicador = (objIndex, indIndex) => {
  abrirModalIndicador(objIndex)
  const indicador = objetivosGenerales.value[objIndex].indicadores[indIndex]
  nuevoIndicador.value.nombre = indicador.nombre
  nuevoIndicador.value.descripcion = indicador.descripcion
}

const editarKPI = (objIndex, kpiIndex) => {
  abrirModalKPI(objIndex)
  const kpi = objetivosGenerales.value[objIndex].kpis[kpiIndex]
  nuevoKPI.value.nombre = kpi.nombre
  nuevoKPI.value.meta = kpi.meta
  nuevoKPI.value.actual = kpi.actual
}
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}
.sticky-card {
  position: sticky;
  top: 20px;
}
</style>
