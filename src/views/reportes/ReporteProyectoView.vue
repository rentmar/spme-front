<template>
  <v-container class="pa-6" fluid v-if="!cargando">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">Generador de Reportes</h1>
        <p class="text-caption text-grey">Proyecto: TESTREP - Proyecto Test de Reportes</p>
      </div>
      <v-btn color="primary" variant="flat" @click="generarReporte">
        <v-icon start>mdi-file-export</v-icon>
        Generar Reporte
      </v-btn>
    </div>
    <diagrama-reportes v-if="!cargando" :id-proyecto="idproyecto"></diagrama-reportes>

    <v-row>
      <!-- Panel de selección -->
      <v-col cols="12" md="5">
        <v-card variant="outlined" class="h-100">
          <v-card-title class="px-4 py-3">Nodos del Proyecto</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-list density="compact" class="py-0">
              <v-list-item
                v-for="nodo in nodosDisponibles"
                :key="nodo.id"
                :class="{ 'bg-grey-lighten-3': estaSeleccionado(nodo.id) }"
                @click="toggleSeleccion(nodo)"
              >
                <template v-slot:prepend>
                  <v-icon :color="colorPorTipo(nodo.type)" size="small">
                    {{ iconoPorTipo(nodo.type) }}
                  </v-icon>
                </template>

                <v-list-item-title class="text-body-2">
                  {{ nodo.label }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ obtenerCodigo(nodo) }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-icon :color="estaSeleccionado(nodo.id) ? 'primary' : 'grey'" size="small">
                    {{
                      estaSeleccionado(nodo.id)
                        ? 'mdi-checkbox-marked'
                        : 'mdi-checkbox-blank-outline'
                    }}
                  </v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Vista previa -->
      <v-col cols="12" md="7">
        <v-card variant="outlined" class="h-100">
          <v-card-title class="px-4 py-3">Vista Previa del Reporte</v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <div v-if="nodosSeleccionados.length === 0" class="text-center py-8 text-grey">
              <v-icon size="large" class="mb-2">mdi-file-document-outline</v-icon>
              <p>Selecciona nodos para incluirlos en tu reporte</p>
            </div>

            <div v-else>
              <div v-for="nodo in nodosSeleccionados" :key="nodo.id" class="mb-3">
                <div class="d-flex align-start">
                  <v-icon :color="colorPorTipo(nodo.type)" size="small" class="mt-1 mr-2">
                    {{ iconoPorTipo(nodo.type) }}
                  </v-icon>
                  <div class="flex-grow-1">
                    <div class="text-body-2 font-weight-medium">{{ nodo.label }}</div>
                    <div class="text-caption text-grey">{{ obtenerCodigo(nodo) }}</div>
                    <div v-if="obtenerDescripcion(nodo)" class="text-caption mt-1">
                      {{ obtenerDescripcion(nodo) }}
                    </div>
                  </div>
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    @click="removerNodo(nodo.id)"
                    class="ml-1"
                  >
                    <v-icon size="small">mdi-close</v-icon>
                  </v-btn>
                </div>
                <v-divider
                  class="my-2"
                  v-if="nodosSeleccionados.indexOf(nodo) < nodosSeleccionados.length - 1"
                ></v-divider>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Opciones -->
        <v-card variant="outlined" class="mt-4">
          <v-card-title class="px-4 py-3">Opciones de Reporte</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formato"
                  :items="formatos"
                  label="Formato"
                  density="compact"
                  variant="outlined"
                  hide-details
                ></v-select>
              </v-col>
              <!-- <v-col cols="12" sm="6">
                <v-select
                  v-model="nivelDetalle"
                  :items="nivelesDetalle"
                  label="Nivel de detalle"
                  density="compact"
                  variant="outlined"
                  hide-details
                ></v-select>
              </v-col> -->
            </v-row>

            <!-- <v-checkbox
              v-model="incluirConexiones"
              label="Incluir relaciones entre nodos"
              density="compact"
              hide-details
              class="mt-2"
            ></v-checkbox> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    <!-- <diagrama-reportes-grafico-main></diagrama-reportes-grafico-main> -->
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useProyectoEstructuraStore } from '@/modules/estructuraProyecto/store/useProyectoEstructuraStore'
import { useRoute } from 'vue-router'
import DiagramaReportes from '@/modules/reportes/components/DiagramaReportes.vue'
import DiagramaReportesGraficoMain from '@/modules/reportes/components/DiagramaReportesGraficoMain.vue'

// Inicializar las rutas y obtener el id de proyecto
const ruta = useRoute()
const idproyecto = ruta.params.id
console.log(idproyecto)

//Inicializar el store
const store = useProyectoEstructuraStore()

// Datos de ejemplo basados en la estructura proporcionada
const nodosDisponibles = ref([])
console.log(nodosDisponibles)

// Estado de la aplicación
const nodosSeleccionados = ref([])
const formato = ref('pdf')
const nivelDetalle = ref('medio')
const incluirConexiones = ref(true)

// Opciones disponibles
const formatos = ref([{ title: 'Word', value: 'word' }])

const nivelesDetalle = ref([
  { title: 'Básico', value: 'basico' },
  { title: 'Medio', value: 'medio' },
  { title: 'Completo', value: 'completo' },
])

// Métodos de utilidad
const iconoPorTipo = (tipo) => {
  const iconos = {
    proyecto: 'mdi-folder-information',
    objetivogeneral: 'mdi-target',
    objetivoespecificoog: 'mdi-target',
    indicadorog: 'mdi-chart-line',
    indicadoroe: 'mdi-chart-line',
    resultadooe: 'mdi-checkbox-marked-circle',
    resultadoog: 'mdi-checkbox-marked-circle',
  }
  return iconos[tipo] || 'mdi-file-document'
}

const colorPorTipo = (tipo) => {
  const colores = {
    proyecto: 'blue',
    objetivogeneral: 'red',
    objetivoespecificoog: 'orange',
    indicadorog: 'green',
    indicadoroe: 'green',
    resultadooe: 'purple',
    resultadoog: 'purple',
  }
  return colores[tipo] || 'grey'
}

// Método seguro para obtener el código
const obtenerCodigo = (nodo) => {
  if (nodo.data.nodoProyecto && nodo.data.nodoProyecto.codigo) {
    return nodo.data.nodoProyecto.codigo
  } else if (nodo.data.datosNodo && nodo.data.datosNodo.codigo) {
    return nodo.data.datosNodo.codigo
  }
  return 'Sin código'
}

// Método seguro para obtener la descripción
const obtenerDescripcion = (nodo) => {
  if (nodo.data.nodoProyecto && nodo.data.nodoProyecto.descripcion) {
    return nodo.data.nodoProyecto.descripcion
  } else if (nodo.data.datosNodo && nodo.data.datosNodo.descripcion) {
    return nodo.data.datosNodo.descripcion
  } else if (nodo.data.nodoProyecto && nodo.data.nodoProyecto.redaccion) {
    return nodo.data.nodoProyecto.redaccion
  }
  return ''
}

// Métodos de interacción
const estaSeleccionado = (id) => {
  return nodosSeleccionados.value.some((nodo) => nodo.id === id)
}

const toggleSeleccion = (nodo) => {
  if (estaSeleccionado(nodo.id)) {
    removerNodo(nodo.id)
  } else {
    nodosSeleccionados.value.push(nodo)
  }
}

const removerNodo = (id) => {
  const index = nodosSeleccionados.value.findIndex((nodo) => nodo.id === id)
  if (index !== -1) {
    nodosSeleccionados.value.splice(index, 1)
  }
}

const generarReporte = () => {
  // Simular generación de reporte
  console.log('Generando reporte con:', {
    nodos: nodosSeleccionados.value,
    formato: formato.value,
    nivelDetalle: nivelDetalle.value,
    incluirConexiones: incluirConexiones.value,
  })

  // Aquí normalmente se haría una llamada a la API
  alert(`Reporte generado con ${nodosSeleccionados.value.length} nodos seleccionados`)
}
//Hook
onMounted(async () => {
  if (idproyecto) {
    await cargarDatos()
  }
})

const cargando = ref(true)
//Cargar datos
const cargarDatos = async () => {
  cargando.value = true
  try {
    await store.obtenerDiagramaPorId(idproyecto)
    if (store.diagrama) {
      nodosDisponibles.value = store.diagrama.nodos
    }
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.h-100 {
  height: 150%;
}
</style>
