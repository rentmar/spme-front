<template>
  <v-card>
    <v-card-title class="text-h5">Gestión de Indicadores</v-card-title>
    <v-card-text>
      <v-tabs v-model="tab" grow>
        <v-tab value="general">
          <v-icon left>mdi-target</v-icon>
          Objetivo General
        </v-tab>
        <v-tab value="especificos">
          <v-icon left>mdi-bullseye-arrow</v-icon>
          Objetivos Específicos
        </v-tab>
        <v-tab value="resultados">
          <v-icon left>mdi-checkbox-marked-circle-outline</v-icon>
          Resultados
        </v-tab>
        <v-tab value="productos">
          <v-icon left>mdi-package-variant</v-icon>
          Productos
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <!-- Tab Objetivo General -->
        <!-- Tab Objetivo General - Ahora con expansión como los específicos -->
        <v-window-item value="general">
          <v-card flat>
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h6">Indicadores para Objetivo General</h3>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="abrirModal('objetivoGeneral', index)"
                >
                  Agregar al Objetivo General
                </v-btn>
              </div>

              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    {{ objetivoGeneral.codigo }} - {{ objetivoGeneral.descripcion }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-list v-if="indicadoresGenerales.length > 0" class="mt-4">
                      <v-list-subheader>Indicadores registrados</v-list-subheader>
                      <v-list-item
                        v-for="(indicador, index) in indicadoresGenerales"
                        :key="'gen-' + index"
                      >
                        <template v-slot:prepend>
                          <v-icon>mdi-chart-line</v-icon>
                        </template>
                        <v-list-item-title
                          >{{ indicador.codigo }} - {{ indicador.redaccion }}</v-list-item-title
                        >
                        <v-list-item-subtitle>
                          Tipo: {{ indicador.tipo }} | Valor: {{ indicador.tipo_valor }}
                        </v-list-item-subtitle>
                        <template v-slot:append>
                          <v-btn
                            icon
                            variant="text"
                            color="primary"
                            @click="abrirModal('objetivoGeneral', index)"
                            class="mr-2"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            variant="text"
                            color="error"
                            @click="eliminarIndicador('objetivoGeneral', index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Tab Objetivos Específicos -->
        <v-window-item value="especificos">
          <v-card flat>
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h6">Indicadores para Objetivos Específicos</h3>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="abrirModal('objetivoEspecifico')"
                >
                  Agregar a Objetivo Específico
                </v-btn>
              </div>

              <v-expansion-panels>
                <v-expansion-panel
                  v-for="(objEsp, index) in objetivosEspecificos"
                  :key="'oe-' + index"
                >
                  <v-expansion-panel-title>
                    {{ objEsp.codigo }} - {{ objEsp.descripcion }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-list
                      v-if="getIndicadoresPorObjetivoEspecifico(index).length > 0"
                      class="mt-4"
                    >
                      <v-list-subheader>Indicadores registrados</v-list-subheader>
                      <v-list-item
                        v-for="(indicador, i) in getIndicadoresPorObjetivoEspecifico(index)"
                        :key="'esp-' + index + '-' + i"
                      >
                        <template v-slot:prepend>
                          <v-icon>mdi-chart-line</v-icon>
                        </template>
                        <v-list-item-title
                          >{{ indicador.codigo }} - {{ indicador.redaccion }}</v-list-item-title
                        >
                        <v-list-item-subtitle>
                          Tipo: {{ indicador.tipo }} | Valor: {{ indicador.tipo_valor }}
                        </v-list-item-subtitle>
                        <template v-slot:append>
                          <v-btn
                            icon
                            variant="text"
                            color="primary"
                            @click="abrirModal('objetivoEspecifico', i, index)"
                            class="mr-2"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            variant="text"
                            color="error"
                            @click="eliminarIndicador('objetivoEspecifico', i, index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Tab Resultados -->
        <v-window-item value="resultados">
          <v-card flat>
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h6">Indicadores para Resultados</h3>
                <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirModal('resultado')">
                  Agregar a Resultado
                </v-btn>
              </div>

              <v-expansion-panels>
                <v-expansion-panel v-for="(resultado, index) in resultados" :key="'res-' + index">
                  <v-expansion-panel-title>
                    {{ resultado.codigo }} - {{ resultado.descripcion }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-list v-if="getIndicadoresPorResultado(index).length > 0" class="mt-4">
                      <v-list-subheader>Indicadores registrados</v-list-subheader>
                      <v-list-item
                        v-for="(indicador, i) in getIndicadoresPorResultado(index)"
                        :key="'res-' + index + '-' + i"
                      >
                        <template v-slot:prepend>
                          <v-icon>mdi-chart-line</v-icon>
                        </template>
                        <v-list-item-title
                          >{{ indicador.codigo }} - {{ indicador.redaccion }}</v-list-item-title
                        >
                        <v-list-item-subtitle>
                          Tipo: {{ indicador.tipo }} | Valor: {{ indicador.tipo_valor }}
                        </v-list-item-subtitle>
                        <template v-slot:append>
                          <v-btn
                            icon
                            variant="text"
                            color="primary"
                            @click="abrirModal('resultado', i, index)"
                            class="mr-2"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            variant="text"
                            color="error"
                            @click="eliminarIndicador('resultado', i, index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Tab Productos -->
        <v-window-item value="productos">
          <v-card flat>
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h6">Indicadores para Productos</h3>
                <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirModal('producto')">
                  Agregar a Producto
                </v-btn>
              </div>

              <v-expansion-panels>
                <v-expansion-panel v-for="(producto, index) in productos" :key="'prod-' + index">
                  <v-expansion-panel-title>
                    {{ producto.codigo }} - {{ producto.descripcion }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-list v-if="getIndicadoresPorProducto(index).length > 0" class="mt-4">
                      <v-list-subheader>Indicadores registrados</v-list-subheader>
                      <v-list-item
                        v-for="(indicador, i) in getIndicadoresPorProducto(index)"
                        :key="'prod-' + index + '-' + i"
                      >
                        <template v-slot:prepend>
                          <v-icon>mdi-chart-line</v-icon>
                        </template>
                        <v-list-item-title
                          >{{ indicador.codigo }} - {{ indicador.redaccion }}</v-list-item-title
                        >
                        <v-list-item-subtitle>
                          Tipo: {{ indicador.tipo }} | Valor: {{ indicador.tipo_valor }}
                        </v-list-item-subtitle>
                        <template v-slot:append>
                          <v-btn
                            icon
                            variant="text"
                            color="primary"
                            @click="abrirModal('producto', i, index)"
                            class="mr-2"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            variant="text"
                            color="error"
                            @click="eliminarIndicador('producto', i, index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </v-card-text>

    <!-- Modal para creación/edición de indicadores -->
    <v-dialog v-model="modalVisible" max-width="800" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ indicadorEditando ? 'Editar' : 'Nuevo' }} Indicador</span>
          <v-btn icon @click="cerrarModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <IndicadorCreator
            v-if="modalVisible"
            :tipo-relacion="tipoRelacionActual"
            :indicador-editando="indicadorEditando"
            :componente-padre-index="componentePadreIndex"
            @submit="guardarIndicador"
            @cancel="cerrarModal"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNuevoProyectoStore } from '@/modules/proyecto/store/nuevoProyectoStore'
import IndicadorCreator from '../components/partials/IndicadorCreator.vue'

const store = useNuevoProyectoStore()

// Estado del modal
const modalVisible = ref(false)
const tab = ref('general')
const tipoRelacionActual = ref('')
const indicadorEditando = ref(null)
const componentePadreIndex = ref(null)

// Datos del store
const objetivoGeneral = computed(() => store.nuevoProyecto.objetivoGeneral[0])
const objetivosEspecificos = computed(() => store.nuevoProyecto.objetivoEspecifico)
const resultados = computed(() => store.nuevoProyecto.resultados)
const productos = computed(() => store.nuevoProyecto.productos)

// Indicadores del store
const indicadoresGenerales = computed(() => store.nuevoProyecto.indicadores.objetivoGeneral)
const indicadoresEspecificos = computed(() => store.nuevoProyecto.indicadores.objetivoEspecifico)
const indicadoresResultados = computed(() => store.nuevoProyecto.indicadores.resultado)
const indicadoresProductos = computed(() => store.nuevoProyecto.indicadores.producto)

// Elementos relacionados según el tipo
const elementosRelacionados = computed(() => {
  switch (tipoRelacionActual.value) {
    case 'objetivoGeneral':
      return objetivoGeneral.value
    case 'objetivoEspecifico':
      return objetivosEspecificos.value
    case 'resultado':
      return resultados.value
    case 'producto':
      return productos.value
    default:
      return []
  }
})

// Abrir modal para crear/editar indicador
const abrirModal = (tipo, indice = null, padreIndex = null) => {
  tipoRelacionActual.value = tipo
  componentePadreIndex.value = padreIndex

  if (indice !== null) {
    // Obtener el indicador a editar según el tipo
    if (tipo === 'objetivoGeneral') {
      indicadorEditando.value = store.nuevoProyecto.indicadores.objetivoGeneral[indice]
    } else {
      const indicadoresFiltrados = getIndicadoresFiltrados(tipo, padreIndex)
      indicadorEditando.value = indicadoresFiltrados[indice]
    }
  } else {
    indicadorEditando.value = null
  }

  modalVisible.value = true
}
// Obtener indicadores filtrados por componente padre
const getIndicadoresFiltrados = (tipo, padreIndex) => {
  const componentePadre = elementosRelacionados.value[padreIndex]
  return store.nuevoProyecto.indicadores[tipo].filter(
    (ind) => ind.componente_id === componentePadre.codigo,
  )
}

// Cerrar modal
const cerrarModal = () => {
  modalVisible.value = false
  tipoRelacionActual.value = ''
  indicadorEditando.value = null
  //indiceEditando.value = null
  componentePadreIndex.value = null
}

// Guardar indicador (crear o actualizar)
const guardarIndicador = (data) => {
  const tipo = data.tipoRelacion
  const componenteRelacionado = data[tipo]

  const indicadorData = {
    ...data,
    componente_id: componenteRelacionado.codigo,
  }

  if (indicadorEditando.value) {
    // Lógica para actualizar indicador existente
    store.vincularIndicador(tipo, indicadorData)
  } else {
    // Lógica para crear nuevo indicador
    switch (data.tipo_valor) {
      case store.TIPOS_VALOR.LITERAL:
        store.addIndicadorLiteral(tipo)
        break
      case store.TIPOS_VALOR.NUMERICO:
        store.addIndicadorNumerico(tipo)
        break
      case store.TIPOS_VALOR.PORCENTUAL:
        store.addIndicadorPorcentual(tipo)
        break
    }

    // Vincular con el componente padre
    const ultimoIndice = store.nuevoProyecto.indicadores[tipo].length - 1
    store.vincularIndicador(tipo, ultimoIndice, componenteRelacionado.codigo)
  }

  cerrarModal()
}

// Eliminar indicador
const eliminarIndicador = (tipo, indice, padreIndex = null) => {
  if (confirm('¿Está seguro de eliminar este indicador?')) {
    if (padreIndex !== null) {
      // Para indicadores anidados (objetivos específicos, resultados, productos)
      const indicadoresFiltrados = getIndicadoresFiltrados(tipo, padreIndex)
      const codigoIndicador = indicadoresFiltrados[indice].codigo
      const indiceReal = store.nuevoProyecto.indicadores[tipo].findIndex(
        (ind) => ind.codigo === codigoIndicador,
      )
      if (indiceReal !== -1) {
        store.nuevoProyecto.indicadores[tipo].splice(indiceReal, 1)
      }
    } else {
      // Para objetivo general
      store.nuevoProyecto.indicadores[tipo].splice(indice, 1)
    }
  }
}

// Obtener indicadores por objetivo específico
const getIndicadoresPorObjetivoEspecifico = (index) => {
  const codigoObjetivo = objetivosEspecificos.value[index].codigo
  return indicadoresEspecificos.value.filter((ind) => ind.componente_id === codigoObjetivo)
}

// Obtener indicadores por resultado
const getIndicadoresPorResultado = (index) => {
  const codigoResultado = resultados.value[index].codigo
  return indicadoresResultados.value.filter((ind) => ind.componente_id === codigoResultado)
}

// Obtener indicadores por producto
const getIndicadoresPorProducto = (index) => {
  const codigoProducto = productos.value[index].codigo
  return indicadoresProductos.value.filter((ind) => ind.componente_id === codigoProducto)
}
</script>
