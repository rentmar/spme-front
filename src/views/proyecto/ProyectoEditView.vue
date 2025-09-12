<template>
  <v-container class="estructura-proyecto-container">
    <!-- Overlay de carga -->
    <v-overlay
      :model-value="isAppLoading"
      class="align-center justify-center"
      persistent
      opacity="0.8"
    >
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando proyecto...</p>
      </div>
    </v-overlay>

    <div v-if="!isAppLoading">
      <!-- Encabezados -->
      <v-row>
        <v-col cols="12">
          <PaginaTituloIcono :titulo="'EDITAR PROYECTO'" :icon="'mdi-pencil'" />
          <v-breadcrumbs
            :items="['Dashboard', 'Proyectos', 'Estructura']"
            class="px-0"
          ></v-breadcrumbs>
        </v-col>
      </v-row>

      <!-- Header del proyecto -->
      <v-row>
        <v-col cols="12">
          <ProyectoHeader v-if="proyecto" :proyecto="proyecto" />
        </v-col>
      </v-row>

      <!-- Contenido principal en dos columnas -->
      <v-row class="mt-4">
        <!-- Columna izquierda: Nodos del proyecto -->
        <v-col cols="12" md="8" lg="8">
          <v-card elevation="2" rounded="lg">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon class="mr-2">mdi-sitemap</v-icon>
                Estructura del Proyecto
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon size="small" @click="cargarDatos" variant="text" color="white">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                color="success"
                prepend-icon="mdi-cloud-upload"
                :loading="iSguardandoDiagrama"
                @click="guardarDiagrama"
                variant="flat"
                class="ml-2"
              >
                Aplicar Cambios
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
                    <v-label class="mr-2 text-caption">Filtrar por tipo:</v-label>
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
                      {{ store.filtrarNodos.length }} nodos
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
                            class="text-white mr-1"
                          >
                            {{ nodo.type }}
                          </v-chip>
                          <v-chip
                            v-if="obtenerConexionesNodo(nodo.id).length > 0"
                            size="x-small"
                            color="secondary"
                          >
                            {{ obtenerConexionesNodo(nodo.id).length }}
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
          <v-card elevation="2" rounded="lg" class="mb-4">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon class="mr-2">mdi-form-textbox</v-icon>
                Editar Nodo
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pa-4">
              <!-- Panel de edición del nodo seleccionado -->
              <div v-if="nodoSeleccionado" class="edicion-panel">
                <component
                  :is="formularioActual"
                  v-if="formularioActual && nodoSeleccionado"
                  :node="nodoSeleccionado"
                  @guardar="guardarCambios"
                  @cancelar="deseleccionarNodo"
                  @eliminar="eliminarNodo"
                />
                NODO SELECCCIONADO VISTA PADRE <br />
                {{ nodoSeleccionado }}
              </div>
              <div v-else class="text-center text-medium-emphasis py-8">
                <v-icon size="48" color="grey-lighten-1">mdi-select-search</v-icon>
                <p class="mt-2 text-body-1">Seleccione un nodo para editarlo</p>
                <p class="text-caption">Haga clic en cualquier nodo de la lista</p>
              </div>
            </v-card-text>
          </v-card>

          <!-- Card 2: Información de conexión del nodo (ABAJO) -->
          <v-card elevation="2" rounded="lg">
            <v-toolbar color="secondary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon class="mr-2">mdi-connection</v-icon>
                Conexiones del Nodo
                <v-chip v-if="nodoSeleccionado" size="small" class="ml-2">
                  {{ relacionesNodo.length }}
                </v-chip>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                v-if="nodoSeleccionado"
                icon
                size="small"
                @click="actualizarConexiones"
                :loading="cargandoConexiones"
                variant="text"
                color="white"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="pa-4">
              <!-- Información de relaciones -->
              <div v-if="nodoSeleccionado" class="relaciones-panel">
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="d-flex align-center">
                    <v-icon color="secondary" class="mr-2">mdi-link</v-icon>
                    <h4 class="text-h6 ma-0">Relaciones</h4>
                  </div>

                  <!-- Filtro de tipos de relación -->
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        size="small"
                        variant="outlined"
                        prepend-icon="mdi-filter"
                      >
                        Filtrar
                      </v-btn>
                    </template>
                    <v-list density="compact">
                      <v-list-item
                        v-for="tipo in tiposRelacionUnicos"
                        :key="tipo"
                        @click="toggleFiltroRelacion(tipo)"
                      >
                        <template v-slot:prepend>
                          <v-icon :color="filtrosRelacion.includes(tipo) ? 'primary' : ''">
                            {{
                              filtrosRelacion.includes(tipo)
                                ? 'mdi-checkbox-marked'
                                : 'mdi-checkbox-blank-outline'
                            }}
                          </v-icon>
                        </template>
                        <v-list-item-title>{{ tipo }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>

                <div v-if="relacionesFiltradas && relacionesFiltradas.length > 0">
                  <!-- Estadísticas rápidas -->
                  <v-card variant="outlined" class="mb-3">
                    <v-card-text class="py-2 px-3">
                      <div class="d-flex justify-space-between align-center">
                        <span class="text-caption">Total:</span>
                        <span class="text-caption font-weight-medium"
                          >{{ relacionesNodo.length }} conexiones</span
                        >
                      </div>
                      <v-divider class="my-1"></v-divider>
                      <div class="d-flex flex-wrap gap-1">
                        <v-chip
                          v-for="tipo in tiposRelacionConteo"
                          :key="tipo.nombre"
                          size="x-small"
                          :color="getColorForRelation(tipo.nombre)"
                          class="text-white"
                        >
                          {{ tipo.nombre }}: {{ tipo.cantidad }}
                        </v-chip>
                      </div>
                    </v-card-text>
                  </v-card>

                  <!-- Lista de relaciones -->
                  <v-list lines="three" class="py-0">
                    <v-list-item
                      v-for="relacion in relacionesFiltradas"
                      :key="relacion.id"
                      class="mb-2 rounded"
                      :class="{
                        'relacion-destacada':
                          relacion.tipo === 'parent' || relacion.tipo === 'primary',
                        'bg-grey-lighten-4': relacionActiva?.id === relacion.id,
                      }"
                    >
                      <template v-slot:prepend>
                        <v-avatar
                          :color="getColorForRelation(relacion.tipo)"
                          size="40"
                          class="mr-2"
                        >
                          <v-icon :icon="getIconForRelation(relacion.tipo)" size="18" dark></v-icon>
                        </v-avatar>
                      </template>

                      <v-list-item-title class="font-weight-medium text-wrap">
                        {{ relacion.descripcion || 'Sin descripción' }}
                        <v-chip
                          v-if="relacion.tipo === 'parent' || relacion.tipo === 'primary'"
                          size="x-small"
                          color="success"
                          class="ml-2"
                          label
                        >
                          Principal
                        </v-chip>
                      </v-list-item-title>

                      <v-list-item-subtitle class="mt-1">
                        <div class="d-flex align-center flex-wrap">
                          <v-chip
                            size="x-small"
                            :color="getColorForRelation(relacion.tipo)"
                            class="text-white mr-2 mb-1"
                          >
                            {{ relacion.tipo }}
                          </v-chip>
                          <span class="text-caption text-medium-emphasis mr-2">
                            ID: {{ relacion.id }}
                          </span>
                          <v-icon v-if="relacion.activa" color="success" size="small" class="mr-1">
                            mdi-check-circle
                          </v-icon>
                          <v-icon v-else color="error" size="small" class="mr-1">
                            mdi-close-circle
                          </v-icon>
                          <span
                            class="text-caption"
                            :class="relacion.activa ? 'text-success' : 'text-error'"
                          >
                            {{ relacion.activa ? 'Activa' : 'Inactiva' }}
                          </span>
                        </div>
                      </v-list-item-subtitle>

                      <template v-slot:append>
                        <div class="d-flex flex-column align-end">
                          <v-btn
                            icon
                            size="x-small"
                            variant="text"
                            @click="verDetallesRelacion(relacion)"
                            class="mb-1"
                          >
                            <v-icon>mdi-information</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            size="x-small"
                            variant="text"
                            @click="navegarARelacion(relacion)"
                            color="primary"
                          >
                            <v-icon>mdi-arrow-right</v-icon>
                          </v-btn>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>

                  <!-- Resumen de conexiones -->
                  <div class="mt-3 text-center">
                    <span class="text-caption text-medium-emphasis">
                      Mostrando {{ relacionesFiltradas.length }} de
                      {{ relacionesNodo.length }} conexiones
                    </span>
                  </div>
                </div>
                <div v-else class="text-center text-medium-emphasis py-6">
                  <v-icon size="48" color="grey-lighten-1">mdi-link-off</v-icon>
                  <p class="mt-2 text-body-1">Este nodo no tiene conexiones</p>
                  <p class="text-caption mb-3">
                    O no hay conexiones que coincidan con los filtros aplicados
                  </p>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="small"
                    @click="explorarConexiones"
                    prepend-icon="mdi-plus"
                  >
                    Explorar conexiones
                  </v-btn>
                  <v-btn
                    v-if="filtrosRelacion.length > 0"
                    color="secondary"
                    variant="text"
                    size="small"
                    @click="limpiarFiltros"
                    class="ml-2"
                  >
                    Limpiar filtros
                  </v-btn>
                </div>
              </div>
              <div v-else class="text-center text-medium-emphasis py-8">
                <v-icon size="48" color="grey-lighten-1">mdi-select-search</v-icon>
                <p class="mt-2 text-body-1">Seleccione un nodo para ver sus conexiones</p>
                <p class="text-caption">
                  Haga clic en cualquier nodo de la lista para visualizar sus relaciones
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Diálogo de detalles de relación -->
      <v-dialog v-model="dialogoDetalles" max-width="600">
        <v-card rounded="lg">
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title class="text-white">
              <v-icon class="mr-2">mdi-information</v-icon>
              Detalles de la Conexión
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialogoDetalles = false" variant="text" color="white">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="pa-4">
            <div v-if="relacionActiva">
              <div class="d-flex align-center mb-4">
                <v-avatar :color="getColorForRelation(relacionActiva.tipo)" size="48">
                  <v-icon :icon="getIconForRelation(relacionActiva.tipo)" size="24" dark></v-icon>
                </v-avatar>
                <div class="ml-3">
                  <h3 class="text-h6 mb-1">
                    {{ relacionActiva.descripcion || 'Sin descripción' }}
                  </h3>
                  <div class="d-flex align-center">
                    <v-chip
                      size="small"
                      :color="getColorForRelation(relacionActiva.tipo)"
                      class="text-white mr-2"
                    >
                      {{ relacionActiva.tipo }}
                    </v-chip>
                    <v-chip
                      size="x-small"
                      :color="relacionActiva.activa ? 'success' : 'error'"
                      variant="outlined"
                    >
                      {{ relacionActiva.activa ? 'Activa' : 'Inactiva' }}
                    </v-chip>
                  </div>
                </div>
              </div>

              <v-divider class="my-3"></v-divider>

              <v-row>
                <v-col cols="6">
                  <div class="mb-3">
                    <strong class="text-caption d-block">ID de la Conexión:</strong>
                    <span class="text-body-2">{{ relacionActiva.id }}</span>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mb-3">
                    <strong class="text-caption d-block">Tipo:</strong>
                    <span class="text-body-2">{{ relacionActiva.tipo }}</span>
                  </div>
                </v-col>
              </v-row>

              <div
                v-if="
                  relacionActiva.propiedades && Object.keys(relacionActiva.propiedades).length > 0
                "
                class="mb-3"
              >
                <strong class="text-caption d-block mb-2">Propiedades:</strong>
                <v-table density="compact" class="elevation-1">
                  <thead>
                    <tr>
                      <th>Propiedad</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(valor, propiedad) in relacionActiva.propiedades" :key="propiedad">
                      <td class="font-weight-medium">{{ propiedad }}</td>
                      <td>{{ valor }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>

              <div v-else class="mb-3">
                <v-alert type="info" density="compact" variant="tonal">
                  No hay propiedades adicionales para esta conexión
                </v-alert>
              </div>

              <v-divider class="my-3"></v-divider>

              <div class="text-center">
                <v-btn
                  color="primary"
                  @click="navegarARelacion(relacionActiva)"
                  prepend-icon="mdi-arrow-right"
                >
                  Navegar a esta conexión
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
  {{ proyecto }}
  <br /><br /><br />
  {{ store.diagrama }}
</template>

<script setup>
import { onMounted, ref, computed, watch, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoHeader from '@/modules/proyecto/components/partials/ProyectoHeader.vue'
// Composer Proyecto
import { useProyectoCrud } from '@/modules/proyecto/composables/useProyectoCrud'
//Store del Proyecto
import { useProyectoEstructuraStore } from '@/modules/estructuraProyecto/store/useProyectoEstructuraStore'
//Snackbars
import { useSnackbar } from '@/composables/useSnackbar'
import { useDiagramaCrud } from '@/modules/editorEstructura/composables/useDiagramaCrud'

// Inicializar las rutas y obtener el id de proyecto
const ruta = useRoute()
const idproyecto = ruta.params.id

//Iniciar el store
const store = useProyectoEstructuraStore()

//Iniciaro el composable
const { actualizarEstructuraPorDiagrama } = useDiagramaCrud()

//Estados del nodo
const nodoSeleccionado = ref(null)
const nodoEditado = ref(null)
const guardando = ref(false)
const dialogoDetalles = ref(false)
const relacionActiva = ref(null)
const filtrosRelacion = ref([])
const cargandoConexiones = ref(false)

// Computed para obtener relaciones reactivas
const relacionesNodo = computed(() => {
  if (!nodoSeleccionado.value) return []
  try {
    if (store.obtenerRelacionesDeNodo && typeof store.obtenerRelacionesDeNodo === 'function') {
      const relaciones = store.obtenerRelacionesDeNodo(nodoSeleccionado.value.id)
      // Enriquecer relaciones con información adicional
      return relaciones.map((rel) => ({
        ...rel,
        esPrincipal: rel.tipo === 'parent' || rel.tipo === 'primary',
        activa: rel.activa !== false, // Por defecto activa si no se especifica lo contrario
      }))
    } else {
      console.error('El método obtenerRelacionesDeNodo no existe en el store')
      return []
    }
  } catch (error) {
    console.error('Error al obtener relaciones:', error)
    return []
  }
})

// Tipos únicos de relaciones para filtros
const tiposRelacionUnicos = computed(() => {
  const tipos = relacionesNodo.value.map((r) => r.tipo)
  return [...new Set(tipos)].sort()
})

// Conteo de relaciones por tipo
const tiposRelacionConteo = computed(() => {
  const conteo = {}
  relacionesNodo.value.forEach((rel) => {
    conteo[rel.tipo] = (conteo[rel.tipo] || 0) + 1
  })

  return Object.entries(conteo).map(([nombre, cantidad]) => ({
    nombre,
    cantidad,
  }))
})

// Relaciones filtradas por tipo seleccionado
const relacionesFiltradas = computed(() => {
  if (filtrosRelacion.value.length === 0) {
    return relacionesNodo.value
  }

  return relacionesNodo.value.filter((rel) => filtrosRelacion.value.includes(rel.tipo))
})

// Obtener conexiones de un nodo
function obtenerConexionesNodo(nodoId) {
  if (!store.edges) return []
  return store.edges.filter((edge) => edge.source === nodoId || edge.target === nodoId)
}

// Inicializar el composable proyecto
const { proyecto, obtenerProyecto } = useProyectoCrud()
//Iniciar el composable de los mensajes
const { successMsg, errorMsg } = useSnackbar()

// Watch para detectar cambios en el nodo seleccionado
watch(nodoSeleccionado, (newVal) => {
  if (newVal) {
    // Crear una copia profunda para editar cuando se selecciona un nodo
    nodoEditado.value = JSON.parse(JSON.stringify(newVal))
    // Reiniciar filtros cuando cambia el nodo
    filtrosRelacion.value = []
  } else {
    nodoEditado.value = null
  }
})

// Seleccionar un nodo para editar
function seleccionarNodo(nodo) {
  // Forzar la reactividad asignando un nuevo objeto
  nodoSeleccionado.value = { ...nodo }
  console.log('Nodo seleccionado:')
  console.log(nodoSeleccionado)
}

// Deseleccionar el nodo
function deseleccionarNodo() {
  nodoSeleccionado.value = null
  nodoEditado.value = null
}

// Ver detalles de una relación
function verDetallesRelacion(relacion) {
  relacionActiva.value = relacion
  dialogoDetalles.value = true
}

// Navegar a una relación específica
function navegarARelacion(relacion) {
  // Lógica para navegar a la relación
  console.log('Navegando a relación:', relacion)
  successMsg(`Navegando a conexión ${relacion.id}`, 2000)
}

// Actualizar conexiones
async function actualizarConexiones() {
  cargandoConexiones.value = true
  try {
    // Simular una actualización
    await new Promise((resolve) => setTimeout(resolve, 1000))
    successMsg('Conexiones actualizadas', 2000)
  } catch (error) {
    errorMsg('Error al actualizar conexiones', 2000)
    console.error(error)
  } finally {
    cargandoConexiones.value = false
  }
}

// Explorar conexiones
function explorarConexiones() {
  // Lógica para explorar conexiones
  console.log('Explorar conexiones para el nodo:', nodoSeleccionado.value)
  successMsg('Explorando conexiones disponibles', 2000)
}

// Toggle filtro de relación
function toggleFiltroRelacion(tipo) {
  const index = filtrosRelacion.value.indexOf(tipo)
  if (index === -1) {
    filtrosRelacion.value.push(tipo)
  } else {
    filtrosRelacion.value.splice(index, 1)
  }
}

// Limpiar filtros
function limpiarFiltros() {
  filtrosRelacion.value = []
}

// Guardar los cambios del nodo
async function guardarCambios(payload) {
  if (!nodoSeleccionado.value || !nodoEditado.value) return

  guardando.value = true

  try {
    console.log(payload)
    const modificaciones = { payload }
    await store.modificarNodo(nodoSeleccionado.value.id, modificaciones)
    successMsg('Operacion exitosa')
    deseleccionarNodo()
    // Preparar las modificaciones
    // const modificaciones = {
    //   data: {
    //     label: nodoEditado.value.data.label,
    //     // Incluir otros campos específicos si existen
    //     ...(nodoEditado.value.data.datosNodo && {
    //       datosNodo: {
    //         titulo: nodoEditado.value.data.datosNodo.titulo,
    //       },
    //     }),
    //     ...(nodoEditado.value.data.nodoProyecto && {
    //       nodoProyecto: {
    //         descripcion: nodoEditado.value.data.nodoProyecto.descripcion,
    //       },
    //     }),
    //   },
    //   position: {
    //     x: nodoEditado.value.position.x,
    //     y: nodoEditado.value.position.y,
    //   },
    // }

    // Llamar a la función del store para modificar el nodo
    //await store.modificarNodo(nodoSeleccionado.value.id, modificaciones)

    //successMsg('Nodo modificado exitosamente', 3000)
    //deseleccionarNodo()
  } catch (error) {
    console.error('Error al guardar cambios:', error)
    errorMsg('Error al guardar cambios', 3000)
  } finally {
    guardando.value = false
  }
}
/*****************ENVIAR DATOS AL REST API****************************/
const iSguardandoDiagrama = ref(false)
const guardarDiagrama = async () => {
  iSguardandoDiagrama.value = true
  const iddiagrama = store.diagrama.id
  const datosDiagrama = {
    codigoProyecto: store.diagrama.codigoProyecto,
    nodos: store.diagrama.nodos,
    conexiones: store.diagrama.conexiones,
  }
  console.log('datos de envio')
  console.log(datosDiagrama)
  try {
    await actualizarEstructuraPorDiagrama(iddiagrama, datosDiagrama)
    successMsg('Datos actualizados')
  } catch (error) {
    console.error(error)
  } finally {
    iSguardandoDiagrama.value = false
  }
}

/*****************FORMULARIOS*****************************************/
const eliminarNodo = () => {
  console.log('ELiminar nodo')
}
const formularioActual = computed(() => {
  if (!nodoSeleccionado.value) return null
  return formulariosPorTipo[nodoSeleccionado.value.type] || null
})

//Formularios para los nodos
const formulariosPorTipo = {
  proyecto: defineAsyncComponent(
    () =>
      import(
        '@/modules/estructuraProyecto/components/formularios/ProyectoFormularioEstructura.vue'
      ),
  ),
  objetivogeneral: defineAsyncComponent(
    () =>
      import(
        '@/modules/estructuraProyecto/components/formularios/ObjetivoGralFormularioEstructura.vue'
      ),
  ),
  objetivoespecificoog: defineAsyncComponent(
    () =>
      import(
        '@/modules/estructuraProyecto/components/formularios/ObjetivoEspecFormularioEstructura.vue'
      ),
  ),
}
/******************HELPERS****************************************/

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
    primary: 'primary',
    secondary: 'secondary',
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
    primary: 'mdi-star',
    secondary: 'mdi-star-outline',
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
    await Promise.all([store.obtenerDiagramaPorIdProy(idproyecto), obtenerProyecto(idproyecto)])
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
.estructura-proyecto-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}

.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

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

.relacion-destacada {
  border-left: 3px solid rgb(var(--v-theme-primary)) !important;
  background-color: rgba(var(--v-theme-primary), 0.03);
}

/* Estilos para las tablas */
:deep(.v-data-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-data-table-header) {
  background-color: #f5f5f5;
}

:deep(.v-data-table-header th) {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}

/* Mejora la apariencia de los chips */
.v-chip {
  font-weight: 500;
}

/* Ajustes para los diálogos */
.v-dialog .v-card {
  border-radius: 12px;
}

.v-dialog .v-card-title {
  background-color: rgb(var(--v-theme-primary));
  color: white;
  padding: 16px 24px;
}

.v-dialog .v-card-actions {
  padding: 16px 24px;
}

/* Responsividad */
@media (max-width: 960px) {
  .estructura-proyecto-container {
    padding: 16px 12px;
  }

  .v-col {
    margin-bottom: 16px;
  }

  .v-data-table {
    overflow-x: auto;
  }
}
</style>
