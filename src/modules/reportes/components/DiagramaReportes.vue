<template>
  <v-container>
    <v-card v-if="proyectoData && !isLoading">
      <v-card-title>
        <v-icon icon="mdi-file-tree" class="mr-2"></v-icon>
        Estructura del Proyecto: {{ proyectoData.titulo }}

        <v-spacer></v-spacer>

        <v-btn size="small" variant="text" @click="seleccionarTodo" class="mr-2">
          <v-icon icon="mdi-check-all" class="mr-1"></v-icon>
          Seleccionar todo
        </v-btn>

        <v-btn size="small" variant="text" @click="deseleccionarTodo">
          <v-icon icon="mdi-close-box-multiple" class="mr-1"></v-icon>
          Deseleccionar todo
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Proyecto -->
        <v-list lines="two">
          <v-list-item>
            <v-list-item-title>
              <strong>{{ proyectoData.codigo }}:</strong> {{ proyectoData.titulo }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ proyectoData.descripcion }}</v-list-item-subtitle>
          </v-list-item>

          <!-- Objetivo General -->
          <v-list-group value="objetivo-general">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-checkbox
                    v-model="seleccionados.objetivoGeneral"
                    color="red-darken-2"
                    @click.stop
                  ></v-checkbox>
                  <v-icon icon="mdi-target" color="red-darken-2" class="ml-2"></v-icon>
                </template>
                <v-list-item-title>
                  <strong>{{ proyectoData.objetivo_general.codigo }}:</strong>
                  {{ proyectoData.objetivo_general.descripcion }}
                </v-list-item-title>
              </v-list-item>
            </template>

            <!-- Indicadores OG -->
            <v-list-item
              v-for="ind in proyectoData.objetivo_general.indicadores_og"
              :key="`ind-og-${ind.id}`"
            >
              <template v-slot:prepend>
                <v-checkbox
                  v-model="seleccionados.indicadoresOG[ind.id]"
                  color="blue-darken-2"
                  @click.stop
                ></v-checkbox>
                <v-icon icon="mdi-chart-bar" color="blue-darken-2" class="ml-2"></v-icon>
              </template>
              <v-list-item-title>
                <strong>{{ ind.codigo }}:</strong> {{ ind.descripcion }}
              </v-list-item-title>
              <v-list-item-subtitle>Tipo: {{ ind.redaccion }}</v-list-item-subtitle>
            </v-list-item>

            <!-- Resultados OG -->
            <v-list-group
              v-for="res in proyectoData.objetivo_general.resultados_og"
              :key="`res-og-${res.id}`"
              value="resultados-og"
            >
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-checkbox
                      v-model="seleccionados.resultadosOG[res.id]"
                      color="green-darken-2"
                      @click.stop
                    ></v-checkbox>
                    <v-icon
                      icon="mdi-checkbox-marked-circle"
                      color="green-darken-2"
                      class="ml-2"
                    ></v-icon>
                  </template>
                  <v-list-item-title>
                    <strong>{{ res.codigo }}:</strong> {{ res.descripcion }}
                  </v-list-item-title>
                </v-list-item>
              </template>

              <!-- Indicadores Resultado OG -->
              <v-list-item v-for="ind in res.indicadores_rog" :key="`ind-rog-${ind.id}`">
                <template v-slot:prepend>
                  <v-checkbox
                    v-model="seleccionados.indicadoresROG[ind.id]"
                    color="blue-darken-2"
                    @click.stop
                  ></v-checkbox>
                  <v-icon icon="mdi-chart-bar" color="blue-darken-2" class="ml-2"></v-icon>
                </template>
                <v-list-item-title>
                  <strong>{{ ind.codigo }}:</strong> {{ ind.descripcion }}
                </v-list-item-title>
                <v-list-item-subtitle>Tipo: {{ ind.redaccion }}</v-list-item-subtitle>
              </v-list-item>
            </v-list-group>
          </v-list-group>

          <!-- Objetivos Específicos -->
          <v-list-group
            v-for="oe in proyectoData.objetivos_especificos"
            :key="`oe-${oe.id}`"
            value="objetivos-especificos"
          >
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-checkbox
                    v-model="seleccionados.objetivosEspecificos[oe.id]"
                    color="orange-darken-2"
                    @click.stop
                  ></v-checkbox>
                  <v-icon icon="mdi-target-account" color="orange-darken-2" class="ml-2"></v-icon>
                </template>
                <v-list-item-title>
                  <strong>{{ oe.codigo }}:</strong> {{ oe.descripcion }}
                </v-list-item-title>
              </v-list-item>
            </template>

            <!-- Indicadores OE -->
            <v-list-item v-for="ind in oe.indicadores_oe" :key="`ind-oe-${ind.id}`">
              <template v-slot:prepend>
                <v-checkbox
                  v-model="seleccionados.indicadoresOE[ind.id]"
                  color="blue-darken-2"
                  @click.stop
                ></v-checkbox>
                <v-icon icon="mdi-chart-bar" color="blue-darken-2" class="ml-2"></v-icon>
              </template>
              <v-list-item-title>
                <strong>{{ ind.codigo }}:</strong> {{ ind.descripcion }}
              </v-list-item-title>
              <v-list-item-subtitle>Tipo: {{ ind.redaccion }}</v-list-item-subtitle>
            </v-list-item>

            <!-- Resultados OE -->
            <v-list-group
              v-for="res in oe.resultados_oe"
              :key="`res-oe-${res.id}`"
              value="resultados-oe"
            >
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-checkbox
                      v-model="seleccionados.resultadosOE[res.id]"
                      color="green-darken-2"
                      @click.stop
                    ></v-checkbox>
                    <v-icon
                      icon="mdi-checkbox-marked-circle"
                      color="green-darken-2"
                      class="ml-2"
                    ></v-icon>
                  </template>
                  <v-list-item-title>
                    <strong>{{ res.codigo }}:</strong> {{ res.descripcion }}
                  </v-list-item-title>
                </v-list-item>
              </template>

              <!-- Indicadores Resultado OE -->
              <v-list-item v-for="ind in res.indicadores_roe" :key="`ind-roe-${ind.id}`">
                <template v-slot:prepend>
                  <v-checkbox
                    v-model="seleccionados.indicadoresROE[ind.id]"
                    color="blue-darken-2"
                    @click.stop
                  ></v-checkbox>
                  <v-icon icon="mdi-chart-bar" color="blue-darken-2" class="ml-2"></v-icon>
                </template>
                <v-list-item-title>
                  <strong>{{ ind.codigo }}:</strong> {{ ind.descripcion }}
                </v-list-item-title>
                <v-list-item-subtitle>Tipo: {{ ind.redaccion }}</v-list-item-subtitle>
              </v-list-item>

              <!-- Productos Resultado OE -->
              <v-list-item v-for="prod in res.productos_roe" :key="`prod-${prod.id}`">
                <template v-slot:prepend>
                  <v-checkbox
                    v-model="seleccionados.productosROE[prod.id]"
                    color="purple-darken-2"
                    @click.stop
                  ></v-checkbox>
                  <v-icon icon="mdi-package-variant" color="purple-darken-2" class="ml-2"></v-icon>
                </template>
                <v-list-item-title>
                  <strong>{{ prod.codigo }}:</strong> {{ prod.descripcion || 'Producto' }}
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
          </v-list-group>
        </v-list>

        <!-- Resumen de selección -->
        <v-alert v-if="totalSeleccionados > 0" type="info" class="mt-4">
          <strong>{{ totalSeleccionados }}</strong> elementos seleccionados
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useReportes } from '../composables/useReportes'

//Props del componente
const props = defineProps({
  idProyecto: {
    type: [Number, String],
    required: false,
  },
})

//Iniciar el composable
const { estructuraJerarquicaProyecto, cargarEstructuraJerarquicaProyecto } = useReportes()

//Datos del proyecto
const proyectoData = ref()
proyectoData.value = estructuraJerarquicaProyecto.value.proyecto

// Estado de selección
const seleccionados = ref({
  proyecto: false,
  objetivoGeneral: false,
  objetivosEspecificos: {},
  indicadoresOG: {},
  resultadosOG: {},
  indicadoresROG: {},
  indicadoresOE: {},
  resultadosOE: {},
  indicadoresROE: {},
  productosROE: {},
})

// Contador de elementos seleccionados
const totalSeleccionados = computed(() => {
  let count = 0

  if (seleccionados.value.proyecto) count++
  if (seleccionados.value.objetivoGeneral) count++

  // Contar elementos en objetos
  const countObject = (obj) => Object.values(obj).filter(Boolean).length

  count += countObject(seleccionados.value.objetivosEspecificos)
  count += countObject(seleccionados.value.indicadoresOG)
  count += countObject(seleccionados.value.resultadosOG)
  count += countObject(seleccionados.value.indicadoresROG)
  count += countObject(seleccionados.value.indicadoresOE)
  count += countObject(seleccionados.value.resultadosOE)
  count += countObject(seleccionados.value.indicadoresROE)
  count += countObject(seleccionados.value.productosROE)

  return count
})

// Funciones para seleccionar/deseleccionar todo
const seleccionarTodo = () => {
  seleccionados.value.proyecto = true
  seleccionados.value.objetivoGeneral = true

  // Inicializar todos los objetos como true
  const initTrue = (items, key) => {
    items.forEach((item) => {
      seleccionados.value[key][item.id] = true
    })
  }

  initTrue(proyectoData.value.objetivos_especificos, 'objetivosEspecificos')
  initTrue(proyectoData.value.objetivo_general.indicadores_og, 'indicadoresOG')
  initTrue(proyectoData.value.objetivo_general.resultados_og, 'resultadosOG')

  proyectoData.value.objetivo_general.resultados_og.forEach((res) => {
    initTrue(res.indicadores_rog, 'indicadoresROG')
  })

  proyectoData.value.objetivos_especificos.forEach((oe) => {
    initTrue(oe.indicadores_oe, 'indicadoresOE')
    initTrue(oe.resultados_oe, 'resultadosOE')

    oe.resultados_oe.forEach((res) => {
      initTrue(res.indicadores_roe, 'indicadoresROE')
      initTrue(res.productos_roe, 'productosROE')
    })
  })
}

const deseleccionarTodo = () => {
  seleccionados.value.proyecto = false
  seleccionados.value.objetivoGeneral = false

  // Reiniciar todos los objetos
  seleccionados.value.objetivosEspecificos = {}
  seleccionados.value.indicadoresOG = {}
  seleccionados.value.resultadosOG = {}
  seleccionados.value.indicadoresROG = {}
  seleccionados.value.indicadoresOE = {}
  seleccionados.value.resultadosOE = {}
  seleccionados.value.indicadoresROE = {}
  seleccionados.value.productosROE = {}
}

// Watch para debug
watch(
  seleccionados,
  (newVal) => {
    console.log('Selección actualizada:', newVal)
  },
  { deep: true },
)

onMounted(() => {
  if (props.idProyecto) {
    cargarDatos()
  }
})

const isLoading = ref(false)
const cargarDatos = async () => {
  isLoading.value = true
  try {
    await cargarEstructuraJerarquicaProyecto(props.idProyecto)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.idProyecto,
  (newId) => {
    if (newId) {
      console.log('ID del proyecto cambiado:', newId)
      cargarDatos() // Ahora cargarDatos está definida
    }
  },
)
</script>

<style scoped>
.v-list-group__items {
  margin-left: 20px;
  border-left: 2px solid #e0e0e0;
}

.v-list-item {
  border-radius: 4px;
  margin: 2px 0;
}

.v-list-item:hover {
  background-color: #f5f5f5;
}

/* Espaciado para checkboxes */
.v-checkbox {
  margin-right: 8px;
}
</style>
