<template>
  <v-container fluid class="pa-0">
    <!-- Overlay de carga -->
    <v-overlay :model-value="isAppLoading" class="align-center justify-center" persistent>
      <div class="text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-h6">Cargando proyecto...</p>
      </div>
    </v-overlay>

    <div v-if="!isAppLoading">
      <!-- Encabezados a todo lo ancho -->
      <div class="full-width-header">
        <PaginaTituloIcono
          :titulo="'Editor de Estructura del Proyecto'"
          :icon="'mdi-pencil'"
        ></PaginaTituloIcono>
      </div>

      <div class="full-width-header">
        <ProyectoHeader v-if="proyecto" :proyecto="proyecto"></ProyectoHeader>
      </div>

      <!-- Contenido principal en dos columnas -->
      <v-row class="mt-4">
        <!-- Columna izquierda: Nodos del proyecto -->
        <v-col cols="12" md="8" lg="8">
          <v-card elevation="2" class="h-100">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon class="mr-2">mdi-sitemap</v-icon>
                Estructura del Proyecto
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon size="small" @click="cargarDatos">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="pa-4">
              <div v-if="!store.diagrama" class="text-center py-8">
                <v-icon size="64" color="grey-lighten-1">mdi-sitemap</v-icon>
                <p class="text-h6 text-grey mt-4">Visualización de Nodos del Proyecto</p>
                <p class="text-body-2 text-grey">
                  Aquí se mostrará la estructura jerárquica del proyecto
                </p>
              </div>
              <div v-else class="diagrama-container">
                <!-- Header con información del proyecto -->
                <div class="d-flex justify-space-between align-center mb-4">
                  <div>
                    <h2 class="text-h5">Proyecto: {{ store.diagrama?.codigoProyecto }}</h2>
                    <p class="text-caption text-medium-emphasis">
                      {{ store.nodes.length }} nodos | {{ store.edges.length }} conexiones
                    </p>
                  </div>

                  <!-- Filtros -->
                  <div class="d-flex align-center">
                    <v-label class="mr-2">Filtrar por tipo:</v-label>
                    <v-select
                      v-model="store.filtroTipo"
                      :items="store.tiposDisponibles"
                      density="compact"
                      variant="outlined"
                      hide-details
                      @update:model-value="store.colocarFiltro(store.filtroTipo)"
                      style="max-width: 200px"
                    ></v-select>
                    <v-chip class="ml-2" size="small" color="primary">
                      Mostrando: {{ store.filtrarNodos.length }} nodos
                    </v-chip>
                  </div>
                </div>

                <!-- Lista de nodos -->
                <v-card variant="outlined" class="mb-4">
                  <v-card-title class="bg-blue-lighten-5">
                    <v-icon class="mr-2">mdi-code-braces</v-icon>
                    Nodos del Diagrama
                  </v-card-title>
                  <v-card-text class="pa-0">
                    <v-list lines="two" class="py-0">
                      <v-list-item
                        v-for="nodo in store.filtrarNodos"
                        :key="nodo.id"
                        :class="{
                          'nodo-seleccionado bg-blue-lighten-5': nodoSeleccionado?.id === nodo.id,
                        }"
                        @click="seleccionarNodo(nodo)"
                        class="v-card--hover"
                      >
                        <template v-slot:prepend>
                          <v-icon :color="nodoSeleccionado?.id === nodo.id ? 'primary' : 'grey'">
                            mdi-circle
                          </v-icon>
                        </template>

                        <v-list-item-title class="font-weight-medium">
                          {{ nodo.data?.label }}
                        </v-list-item-title>

                        <v-list-item-subtitle>
                          ID: {{ nodo.id }} | Posición: ({{ nodo.position.x }},
                          {{ nodo.position.y }})
                        </v-list-item-subtitle>

                        <template v-slot:append>
                          <v-chip
                            size="small"
                            :color="getColorForType(nodo.type)"
                            class="text-white"
                          >
                            {{ nodo.type }}
                          </v-chip>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Columna derecha: Cards de información y formulario -->
        <v-col cols="12" md="4" lg="4">
          <!-- Card 1: Formulario para modificar nodos (ARRIBA) -->
          <v-card elevation="2" class="mb-4">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon class="mr-2">mdi-form-textbox</v-icon>
                Editar Nodo
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-4">
              <!-- Panel de edición del nodo seleccionado -->
              <div v-if="nodoSeleccionado" class="edicion-panel">
                <h3 class="text-h6 mb-4">
                  <v-icon color="primary" class="mr-2">mdi-pencil</v-icon>
                  Editando: {{ nodoSeleccionado.data?.label }}
                </h3>

                <v-form @submit.prevent="guardarCambios">
                  <v-text-field
                    v-model="nodoEditado.data.label"
                    label="Label"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  ></v-text-field>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model.number="nodoEditado.position.x"
                        label="Posición X"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model.number="nodoEditado.position.y"
                        label="Posición Y"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <!-- Campos específicos según el tipo de nodo -->
                  <v-text-field
                    v-if="nodoEditado.data.datosNodo"
                    v-model="nodoEditado.data.datosNodo.titulo"
                    label="Título"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  ></v-text-field>

                  <v-textarea
                    v-if="nodoEditado.data.nodoProyecto"
                    v-model="nodoEditado.data.nodoProyecto.descripcion"
                    label="Descripción"
                    variant="outlined"
                    density="comfortable"
                    rows="3"
                    class="mb-3"
                  ></v-textarea>

                  <div class="d-flex gap-2">
                    <v-btn
                      type="submit"
                      color="primary"
                      :loading="guardando"
                      prepend-icon="mdi-content-save"
                    >
                      Guardar Cambios
                    </v-btn>
                    <v-btn color="secondary" @click="deseleccionarNodo" prepend-icon="mdi-close">
                      Cancelar
                    </v-btn>
                  </div>
                </v-form>
              </div>
              <div v-else class="text-center text-medium-emphasis py-8">
                <v-icon size="48" color="grey-lighten-1">mdi-select-search</v-icon>
                <p class="mt-2">Seleccione un nodo para editarlo</p>
              </div>
            </v-card-text>
          </v-card>

          <!-- Card 2: Información de conexión del nodo (ABAJO) -->
          <v-card elevation="2">
            <v-toolbar color="secondary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon class="mr-2">mdi-connection</v-icon>
                Conexión del Nodo
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-4">
              <!-- Información de relaciones -->
              <div v-if="nodoSeleccionado" class="relaciones-panel">
                <h4 class="text-h6 mb-3">
                  <v-icon color="secondary" class="mr-2">mdi-link</v-icon>
                  Relaciones de este nodo
                </h4>

                <div v-if="relacionesNodo && relacionesNodo.length > 0">
                  <v-chip
                    v-for="relacion in relacionesNodo"
                    :key="relacion.id"
                    class="ma-1 conexion-chip"
                    :color="getColorForRelation(relacion.tipo)"
                  >
                    <v-icon start :icon="getIconForRelation(relacion.tipo)" size="small"></v-icon>
                    {{ relacion.descripcion }} ({{ relacion.tipo }})
                  </v-chip>
                </div>
                <div v-else class="text-center text-medium-emphasis py-4">
                  <v-icon size="40" color="grey-lighten-1">mdi-link-off</v-icon>
                  <p class="mt-2">Este nodo no tiene conexiones</p>
                </div>
              </div>
              <div v-else class="text-center text-medium-emphasis py-8">
                <v-icon size="48" color="grey-lighten-1">mdi-select-search</v-icon>
                <p class="mt-2">Seleccione un nodo para ver sus conexiones</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoHeader from '@/modules/proyecto/components/partials/ProyectoHeader.vue'
// Composer Proyecto
import { useProyectoCrud } from '@/modules/proyecto/composables/useProyectoCrud'
//Store del Proyecto
import { useProyectoEstructuraStore } from '@/modules/estructuraProyecto/store/useProyectoEstructuraStore'
//Snackbars
import { useSnackbar } from '@/composables/useSnackbar'

// Inicializar las rutas y obtener el id de proyecto
const ruta = useRoute()
const idproyecto = ruta.params.id

//Iniciar el store
const store = useProyectoEstructuraStore()

//Estados del nodo
const nodoSeleccionado = ref(null)
const nodoEditado = ref(null)
const guardando = ref(false)

// Computed para obtener relaciones reactivas
const relacionesNodo = computed(() => {
  if (!nodoSeleccionado.value) return []
  try {
    // Asegurarse de que el método existe en el store
    if (store.obtenerRelacionesDeNodo && typeof store.obtenerRelacionesDeNodo === 'function') {
      return store.obtenerRelacionesDeNodo(nodoSeleccionado.value.id)
    } else {
      console.error('El método obtenerRelacionesDeNodo no existe en el store')
      return []
    }
  } catch (error) {
    console.error('Error al obtener relaciones:', error)
    return []
  }
})

// Inicializar el composable proyecto
const { proyecto, obtenerProyecto, loading: cargandoProyecto } = useProyectoCrud()
//Iniciar el composable de los mensajes
const { successMsg, errorMsg } = useSnackbar()

// Watch para detectar cambios en el nodo seleccionado
watch(nodoSeleccionado, (newVal) => {
  if (newVal) {
    // Crear una copia profunda para editar cuando se selecciona un nodo
    nodoEditado.value = JSON.parse(JSON.stringify(newVal))
    console.log('Nodo seleccionado:', newVal)
    console.log('Relaciones:', relacionesNodo.value)
  } else {
    nodoEditado.value = null
  }
})

// Seleccionar un nodo para editar
function seleccionarNodo(nodo) {
  // Forzar la reactividad asignando un nuevo objeto
  nodoSeleccionado.value = { ...nodo }
  console.log('Nodo seleccionado:', nodoSeleccionado.value)
}

// Deseleccionar el nodo
function deseleccionarNodo() {
  nodoSeleccionado.value = null
  nodoEditado.value = null
}
// Guardar los cambios del nodo
async function guardarCambios() {
  if (!nodoSeleccionado.value || !nodoEditado.value) return

  guardando.value = true

  try {
    // Preparar las modificaciones
    const modificaciones = {
      data: {
        label: nodoEditado.value.data.label,
        // Incluir otros campos específicos si existen
        ...(nodoEditado.value.data.datosNodo && {
          datosNodo: {
            titulo: nodoEditado.value.data.datosNodo.titulo,
          },
        }),
        ...(nodoEditado.value.data.nodoProyecto && {
          nodoProyecto: {
            descripcion: nodoEditado.value.data.nodoProyecto.descripcion,
          },
        }),
      },
      position: {
        x: nodoEditado.value.position.x,
        y: nodoEditado.value.position.y,
      },
    }

    // Llamar a la función del store para modificar el nodo
    await store.modificarNodo(nodoSeleccionado.value.id, modificaciones)

    console.log('Nodo modificado exitosamente')
    deseleccionarNodo()
  } catch (error) {
    console.error('Error al guardar cambios:', error)
  } finally {
    guardando.value = false
  }
}

// Helper para obtener color según tipo de nodo
function getColorForType(type) {
  const colors = {
    default: 'grey',
    input: 'blue',
    output: 'green',
    process: 'orange',
    decision: 'purple',
    start: 'teal',
    end: 'red',
  }
  return colors[type] || 'grey'
}

// Helper para obtener color según tipo de relación
function getColorForRelation(tipo) {
  const colors = {
    default: 'grey',
    parent: 'blue-darken-2',
    child: 'green-darken-2',
    reference: 'orange-darken-2',
    dependency: 'purple-darken-2',
  }
  return colors[tipo] || 'grey'
}

// Helper para obtener icono según tipo de relación
function getIconForRelation(tipo) {
  const icons = {
    default: 'mdi-link',
    parent: 'mdi-arrow-up-bold',
    child: 'mdi-arrow-down-bold',
    reference: 'mdi-bookmark',
    dependency: 'mdi-connection',
  }
  return icons[tipo] || 'mdi-link'
}

// Hook
onMounted(async () => {
  await cargarDatos()
})

//Bandera de carga global
const isAppLoading = ref(true)
//Funcion de carga
const cargarDatos = async () => {
  isAppLoading.value = true
  try {
    await Promise.all([store.obtenerDiagramaPorId(idproyecto), obtenerProyecto(idproyecto)])
    successMsg('Carga exitosa', 4000, 'center')

    // Verificar que el store tenga los métodos necesarios
    console.log('Store methods:', {
      obtenerRelacionesDeNodo: typeof store.obtenerRelacionesDeNodo,
      nodes: store.nodes,
      edges: store.edges,
    })
  } catch (err) {
    console.error('Error al cargar los datos:', err)
    errorMsg('Error al cargar los datos', 4000, 'center')
  } finally {
    isAppLoading.value = false
  }
}
</script>

<style scoped>
.full-width-header {
  width: 100%;
  margin-bottom: 0;
}

.h-100 {
  height: 100%;
}

.v-card--hover {
  cursor: pointer;
  transition: all 0.3s ease;
}

.v-card--hover:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
}

.nodo-seleccionado {
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.conexion-chip {
  border-radius: 16px;
}

.gap-2 {
  gap: 8px;
}

/* Responsividad */
@media (max-width: 960px) {
  .v-col {
    margin-bottom: 16px;
  }
}
</style>
