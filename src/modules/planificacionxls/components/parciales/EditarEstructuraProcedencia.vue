<template>
  <v-dialog v-model="dialogVisible" max-width="1200" persistent>
    <v-card min-height="800">
      <v-toolbar color="orange-darken-3" dark>
        <v-toolbar-title>
          <v-icon class="mr-2">mdi-pencil</v-icon>
          Editar Estructura de Procedencia
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="cerrarDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="py-5">
        <div class="mb-6">
          <v-select
            v-model="estructura.nivel1.objetivoGeneral"
            :items="objetivosGenerales"
            item-title="codigo"
            item-value="id"
            label="Objetivo General"
            variant="outlined"
            prepend-icon="mdi-target"
            return-object
            clearable
            @update:model-value="onObjetivoGeneralSelected"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
            </template>
          </v-select>
        </div>

        <div v-if="estructura.nivel1.objetivoGeneral">
          <!-- Visualización de estructura seleccionada -->
          <v-card v-if="showStructureTree" class="mb-6" variant="outlined">
            <v-card-title class="bg-grey-lighten-4 py-3">
              <v-icon class="mr-2">mdi-sitemap</v-icon>
              Vista Jerárquica de la Estructura Seleccionada
            </v-card-title>
            <v-card-text class="pt-3">
              <!-- Mantener el mismo contenido del árbol -->
              <div class="tree-view">
                <div class="tree-node">▶ <strong>PROYECTO:</strong> {{ proyecto.codigo }}</div>

                <!-- ... resto del árbol igual que antes ... -->

                <div class="tree-node level-indicator">
                  ├─▶ <span class="level-label">NIVEL 1</span> <strong>OBJETIVO GENERAL:</strong>
                  {{ estructura.nivel1.objetivoGeneral.codigo }}
                </div>

                <!-- ... resto del árbol ... -->
              </div>
            </v-card-text>
          </v-card>

          <v-row>
            <v-col cols="12" md="6">
              <!-- Columna Izquierda -->
              <div class="mb-4">
                <div class="text-h6 mb-2 d-flex align-center">
                  <v-icon color="blue" class="mr-2">mdi-arrow-left-bold</v-icon>
                  Procedencia desde Objetivo General
                </div>

                <!-- NIVEL 2 -->
                <div class="mb-3">
                  <div class="text-subtitle-2 mb-1 level-header">NIVEL 2</div>

                  <v-select
                    v-model="estructura.nivel2.ramaIzquierda.indicadorOG"
                    :items="estructura.nivel1.objetivoGeneral?.indicador_og || []"
                    item-title="codigo"
                    item-value="id"
                    label="Indicador de Objetivo General"
                    variant="outlined"
                    prepend-icon="mdi-chart-line"
                    return-object
                    clearable
                    class="mb-4"
                    multiple
                    chips
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-model="estructura.nivel2.ramaIzquierda.resultadoOG"
                    :items="estructura.nivel1.objetivoGeneral?.resultados_og || []"
                    item-title="codigo"
                    item-value="id"
                    label="Resultado de Objetivo General"
                    variant="outlined"
                    prepend-icon="mdi-chart-tree"
                    return-object
                    clearable
                    class="mb-4"
                    @update:model-value="onResultadoOGSelected"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>
                </div>

                <!-- ... resto del contenido igual que antes ... -->
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <!-- Columna Derecha -->
              <div class="mb-4">
                <div class="text-h6 mb-2 d-flex align-center">
                  <v-icon color="green" class="mr-2">mdi-arrow-right-bold</v-icon>
                  Procedencia desde Objetivo Específico
                </div>

                <!-- ... resto del contenido igual que antes ... -->
              </div>
            </v-col>
          </v-row>

          <!-- Botones de acción -->
          <div class="d-flex justify-end mt-6">
            <v-btn color="grey" variant="text" @click="cerrarDialog" class="mr-4">
              <v-icon class="mr-2">mdi-close</v-icon>
              Cancelar
            </v-btn>
            <v-btn color="orange" variant="flat" @click="guardarCambios">
              <v-icon class="mr-2">mdi-content-save</v-icon>
              Guardar Cambios
            </v-btn>
          </div>
        </div>

        <div v-else class="text-center mt-8">
          <v-alert type="info" variant="outlined">
            <v-icon class="mr-2">mdi-information</v-icon>
            Seleccione un Objetivo General para editar la estructura
          </v-alert>
        </div>
      </v-card-text>
    </v-card>

    <!-- Diálogo de confirmación (interno) -->
    <v-dialog v-model="confirmDialogVisible" max-width="600">
      <v-card>
        <v-card-title class="bg-orange-darken-3 text-white">
          <v-icon class="mr-2">mdi-check-circle-outline</v-icon>
          Confirmar Cambios en Estructura
        </v-card-title>

        <v-card-text class="py-4">
          <h4 class="text-subtitle-1 mb-2">Resumen de cambios:</h4>
          <v-alert type="info" variant="outlined" class="mb-4">
            Se han modificado {{ contarElementosSeleccionados() }} elementos de la estructura
          </v-alert>

          <h4 class="text-subtitle-1 mb-2">Nueva estructura:</h4>
          <v-card variant="outlined" class="pa-3">
            <div class="tree-view compact">
              <div class="tree-node">▶ <strong>PROYECTO:</strong> {{ proyecto.codigo }}</div>

              <div v-if="estructura.nivel1.objetivoGeneral" class="tree-node">
                ├─▶ <strong>OBJETIVO GENERAL:</strong>
                {{ estructura.nivel1.objetivoGeneral.codigo }}
              </div>

              <template v-if="estructura.nivel2.ramaIzquierda.indicadorOG.length > 0">
                <div class="tree-node">
                  │ ├─ <strong>INDICADORES OG:</strong>
                  {{ estructura.nivel2.ramaIzquierda.indicadorOG.length }} seleccionados
                </div>
              </template>

              <template v-if="estructura.nivel2.ramaIzquierda.resultadoOG">
                <div class="tree-node">
                  │ ├─ <strong>RESULTADO OG:</strong>
                  {{ estructura.nivel2.ramaIzquierda.resultadoOG.codigo }}
                </div>
              </template>

              <!-- Similar para el resto de elementos -->
            </div>
          </v-card>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="confirmDialogVisible = false"> Volver </v-btn>
          <v-btn color="orange" variant="flat" @click="confirmarGuardado">
            Confirmar Cambios
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Props simplificados para el diálogo
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  proyectoData: {
    type: Object,
    required: true,
  },
  estructuraInicial: {
    type: Object,
    default: null,
  },
})

// Emits para comunicación con el padre
const emit = defineEmits(['update:visible', 'estructura-guardada', 'cerrar'])

// Variables reactivas
const proyecto = ref({})
const objetivosGenerales = ref([])
const confirmDialogVisible = ref(false)
const showStructureTree = ref(true)

// Control de visibilidad del diálogo principal
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

// Estructura para edición (igual que antes)
const estructura = ref({
  nivel1: {
    objetivoGeneral: null,
  },
  nivel2: {
    ramaIzquierda: {
      indicadorOG: [],
      resultadoOG: null,
    },
    ramaDerecha: {
      objetivoEspecifico: null,
    },
  },
  nivel3: {
    ramaIzquierda: {
      indicadorResultadoOG: [],
      procesoOG: null,
    },
    ramaDerecha: {
      resultadoOE: null,
      indicadorOE: [],
      productoOE: null,
      procesoEspecificoOE: null,
    },
  },
  nivel4: {
    resultadoOE: {
      indicadores: [],
      productos: [],
      proceso: null,
    },
    productoOE: {
      proceso: null,
    },
  },
})

// Inicializar cuando se abre el diálogo
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      preprocesarDatos()
      if (props.estructuraInicial) {
        inicializarEstructura(props.estructuraInicial)
      } else {
        resetEstructura()
      }
    }
  },
)

// Función para resetear la estructura
const resetEstructura = () => {
  estructura.value = {
    nivel1: { objetivoGeneral: null },
    nivel2: {
      ramaIzquierda: { indicadorOG: [], resultadoOG: null },
      ramaDerecha: { objetivoEspecifico: null },
    },
    nivel3: {
      ramaIzquierda: { indicadorResultadoOG: [], procesoOG: null },
      ramaDerecha: {
        resultadoOE: null,
        indicadorOE: [],
        productoOE: null,
        procesoEspecificoOE: null,
      },
    },
    nivel4: {
      resultadoOE: { indicadores: [], productos: [], proceso: null },
      productoOE: { proceso: null },
    },
  }
}

// Inicializar estructura con datos existentes
const inicializarEstructura = (estructuraInicial) => {
  // Implementar la lógica para cargar la estructura existente
  console.log('Inicializando estructura con:', estructuraInicial)

  // Ejemplo simplificado:
  if (estructuraInicial.objetivogeneral) {
    estructura.value.nivel1.objetivoGeneral = estructuraInicial.objetivogeneral.data
  }
  // ... cargar el resto de la estructura
}

// Preprocesar datos (igual que antes)
const preprocesarDatos = () => {
  proyecto.value = { ...props.proyectoData }

  if (proyecto.value.objetivo_general) {
    const objetivoGeneral = proyecto.value.objetivo_general
    objetivoGeneral.indicador_og = objetivoGeneral.indicador_og || []
    objetivoGeneral.resultados_og = objetivoGeneral.resultados_og || []
    objetivoGeneral.objetivos_especificos_og = objetivoGeneral.objetivos_especificos_og || []

    objetivosGenerales.value = [objetivoGeneral]
  } else {
    objetivosGenerales.value = []
  }
}

// Métodos para manejar selecciones (igual que antes)
const onObjetivoGeneralSelected = () => {
  estructura.value.nivel2.ramaIzquierda.indicadorOG = []
  estructura.value.nivel2.ramaIzquierda.resultadoOG = null
  estructura.value.nivel2.ramaDerecha.objetivoEspecifico = null
  estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG = []
  estructura.value.nivel3.ramaIzquierda.procesoOG = null
  estructura.value.nivel3.ramaDerecha = {
    resultadoOE: null,
    indicadorOE: [],
    productoOE: null,
    procesoEspecificoOE: null,
  }
  estructura.value.nivel4 = {
    resultadoOE: { indicadores: [], productos: [], proceso: null },
    productoOE: { proceso: null },
  }
}

const onResultadoOGSelected = () => {
  estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG = []
  estructura.value.nivel3.ramaIzquierda.procesoOG = null
}

const onObjetivoEspecificoSelected = () => {
  estructura.value.nivel3.ramaDerecha.indicadorOE = []
  estructura.value.nivel3.ramaDerecha.resultadoOE = null
  estructura.value.nivel3.ramaDerecha.productoOE = null
  estructura.value.nivel3.ramaDerecha.procesoEspecificoOE = null
  estructura.value.nivel4 = {
    resultadoOE: { indicadores: [], productos: [], proceso: null },
    productoOE: { proceso: null },
  }
}

const onResultadoOESelected = () => {
  estructura.value.nivel4.resultadoOE = {
    indicadores: [],
    productos: [],
    proceso: null,
  }
}

const onProductoOESelected = () => {
  estructura.value.nivel4.productoOE = {
    proceso: null,
  }
}

// Contar elementos seleccionados
const contarElementosSeleccionados = () => {
  let contador = 0

  if (estructura.value.nivel1.objetivoGeneral) contador++
  contador += estructura.value.nivel2.ramaIzquierda.indicadorOG.length
  if (estructura.value.nivel2.ramaIzquierda.resultadoOG) contador++
  contador += estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG.length
  if (estructura.value.nivel3.ramaIzquierda.procesoOG) contador++
  if (estructura.value.nivel2.ramaDerecha.objetivoEspecifico) contador++
  contador += estructura.value.nivel3.ramaDerecha.indicadorOE.length
  if (estructura.value.nivel3.ramaDerecha.resultadoOE) contador++
  if (estructura.value.nivel3.ramaDerecha.productoOE) contador++
  if (estructura.value.nivel3.ramaDerecha.procesoEspecificoOE) contador++
  contador += estructura.value.nivel4.resultadoOE.indicadores.length
  contador += estructura.value.nivel4.resultadoOE.productos.length
  if (estructura.value.nivel4.resultadoOE.proceso) contador++
  if (estructura.value.nivel4.productoOE.proceso) contador++

  return contador
}

// Guardar estructura procesada
const obtenerEstructuraProcesada = () => {
  const estructuraPlana = {}

  const agregarElemento = (clave, valor) => {
    if (valor) {
      if (Array.isArray(valor)) {
        if (valor.length > 0) {
          estructuraPlana[clave] = valor.map((data) => ({
            tipo: clave,
            data: data,
          }))
        }
      } else {
        estructuraPlana[clave] = {
          tipo: clave,
          data: valor,
        }
      }
    }
  }

  agregarElemento('objetivogeneral', estructura.value.nivel1.objetivoGeneral)
  agregarElemento('indicadorog', estructura.value.nivel2.ramaIzquierda.indicadorOG)
  agregarElemento('resultadoog', estructura.value.nivel2.ramaIzquierda.resultadoOG)
  agregarElemento('indicadorrog', estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG)
  agregarElemento('procesoog', estructura.value.nivel3.ramaIzquierda.procesoOG)
  agregarElemento('objetivoespecifico', estructura.value.nivel2.ramaDerecha.objetivoEspecifico)
  agregarElemento('indicadoroe', estructura.value.nivel3.ramaDerecha.indicadorOE)
  agregarElemento('resultadooe', estructura.value.nivel3.ramaDerecha.resultadoOE)
  agregarElemento('productooe', estructura.value.nivel3.ramaDerecha.productoOE)
  agregarElemento('procesoespecificoe', estructura.value.nivel3.ramaDerecha.procesoEspecificoOE)
  agregarElemento('indicadorroe', estructura.value.nivel4.resultadoOE.indicadores)
  agregarElemento('productoresultadooe', estructura.value.nivel4.resultadoOE.productos)
  agregarElemento('procesoresultadooe', estructura.value.nivel4.resultadoOE.proceso)
  agregarElemento('procesoproductooe', estructura.value.nivel4.productoOE.proceso)

  return estructuraPlana
}

// Acciones del componente
const guardarCambios = () => {
  confirmDialogVisible.value = true
}

const confirmarGuardado = () => {
  const estructuraProcesada = obtenerEstructuraProcesada()
  emit('estructura-guardada', estructuraProcesada)
  confirmDialogVisible.value = false
  cerrarDialog()
}

const cerrarDialog = () => {
  dialogVisible.value = false
  resetEstructura()
  emit('cerrar')
}
</script>

<style scoped>
/* Estilos igual que antes */
.tree-view {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  background-color: #fafafa;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}
.tree-view.compact {
  font-size: 0.85rem;
  padding: 12px;
}
.tree-node {
  padding: 2px 0;
  white-space: pre;
}
.level-indicator {
  background-color: rgba(0, 0, 0, 0.02);
  border-left: 3px solid #ff9800;
  padding-left: 8px;
  margin: 4px 0;
}
.level-label {
  background-color: #ff9800;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: bold;
  margin-right: 8px;
}
.level-header {
  background-color: #fff3e0;
  padding: 6px 12px;
  border-radius: 4px;
  border-left: 4px solid #ff9800;
  font-weight: 600;
  color: #ef6c00;
  margin-bottom: 12px;
}
</style>
