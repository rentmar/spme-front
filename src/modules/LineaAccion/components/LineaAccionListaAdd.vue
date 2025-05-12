<template>
  <div>
    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar.visible"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      location="top right"
    >
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.visible = false"> Cerrar </v-btn>
      </template>
    </v-snackbar>
    <!-- Título y botón de agregar -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="6">
        <h3 class="text-h5">Líneas de Acción Disponibles</h3>
        <p class="text-caption text-grey">Crear Lineas de Accion</p>
      </v-col>
      <v-col cols="12" sm="6" class="text-sm-right">
        <v-btn icon @click="abrirDialogo()" color="primary" size="small">
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="top">Nueva Linea</v-tooltip>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Barra de búsqueda -->
    <v-text-field
      v-model="busqueda"
      label="Buscar líneas de acción"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      class="mb-4"
    ></v-text-field>

    <!-- Controles de paginación superior -->
    <v-row class="mb-2" align="center">
      <v-col cols="12" sm="6">
        <v-select
          v-model="itemsPorPagina"
          :items="opcionesItemsPorPagina"
          label="Items por página"
          density="compact"
          variant="outlined"
          style="max-width: 150px"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" class="text-sm-right">
        <v-pagination
          v-if="totalPaginas > 1"
          v-model="paginaActual"
          :length="totalPaginas"
          :total-visible="7"
        ></v-pagination>
      </v-col>
    </v-row>

    <!-- Listado de líneas de acción -->
    <v-card class="mb-6">
      <v-list lines="two">
        <template v-if="lineasFiltradas.length > 0">
          <v-list-item
            v-for="linea in lineasPaginadas"
            :key="linea.id"
            :title="linea.codigo + ' - ' + linea.titulo"
            :subtitle="linea.descripcion || 'Sin descripción'"
          >
            <template v-slot:append>
              <v-btn icon variant="text" color="blue" @click="abrirDialogo(linea)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="red" @click="eliminarLinea(linea.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </template>
        <v-list-item v-else title="No hay líneas de acción registradas" class="text-grey">
        </v-list-item>
      </v-list>

      <!-- Controles de paginación inferior -->
      <v-row class="mt-4" align="center" justify="space-between">
        <v-col cols="12" sm="6">
          <div class="text-caption text-grey">
            Mostrando {{ inicioItem }}-{{ finItem }} de {{ lineasFiltradas.length }} items
          </div>
        </v-col>
        <v-col cols="12" sm="6" class="text-sm-right">
          <v-pagination
            v-if="totalPaginas > 1"
            v-model="paginaActual"
            :length="totalPaginas"
            :total-visible="7"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-card>

    <!-- Diálogo para crear/editar -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="text-h5">
          {{ esEdicion ? 'Editar' : 'Nueva' }} Línea de Acción
        </v-card-title>

        <v-card-text>
          <v-form ref="form" @submit.prevent="guardarLinea">
            <v-text-field
              v-model="formulario.codigo"
              label="Código*"
              :rules="[(v) => !!v || 'El código es requerido']"
              required
              class="mb-3"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="formulario.titulo"
              label="Título*"
              :rules="[(v) => !!v || 'El título es requerido']"
              required
              class="mb-3"
              variant="outlined"
            ></v-text-field>

            <v-textarea
              v-model="formulario.descripcion"
              label="Descripción"
              rows="3"
              class="mb-3"
              variant="outlined"
            ></v-textarea>
          </v-form>
          <small class="text-caption text-grey">* Campos obligatorios</small>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="cerrarDialogo"> Cancelar </v-btn>
          <v-btn color="primary" variant="elevated" @click="guardarLinea" :loading="guardando">
            {{ esEdicion ? 'Actualizar' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="dialogoConfirmacion" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de eliminar esta línea de acción? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialogoConfirmacion = false">Cancelar</v-btn>
          <v-btn color="red" variant="elevated" @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useLineaAccionStore } from '../store/lineaAccionStore'
import { storeToRefs } from 'pinia'
import { lineaAccionServicios } from '../services/lineaAccionService'

// Estado del componente
const dialog = ref(false)
const dialogoConfirmacion = ref(false)
const esEdicion = ref(false)
const guardando = ref(false)
const form = ref(null)
const lineaAEliminar = ref(null)
const busqueda = ref('')
const paginaActual = ref(1)
const itemsPorPagina = ref(5)
const opcionesItemsPorPagina = [5, 10, 20, 50, 100]

// Estado del snackbar
const snackbar = reactive({
  visible: false,
  text: '',
  color: 'success',
  timeout: 3000,
})

// Función para mostrar notificaciones
const mostrarNotificacion = (texto, tipo = 'success') => {
  snackbar.text = texto
  snackbar.color = tipo === 'error' ? 'error' : 'success'
  snackbar.visible = true
}

// Inicializar el Store
const lineasDeAccionStore = useLineaAccionStore()
const { lineasDeAccion: lineasAccion } = storeToRefs(lineasDeAccionStore)
const { obtenerLineasDeAccion } = lineasDeAccionStore

// Computed properties
const lineasFiltradas = computed(() => {
  if (!busqueda.value) return lineasAccion.value

  const termino = busqueda.value.toLowerCase()
  return lineasAccion.value.filter(
    (linea) =>
      linea.codigo.toLowerCase().includes(termino) ||
      linea.titulo.toLowerCase().includes(termino) ||
      (linea.descripcion && linea.descripcion.toLowerCase().includes(termino)),
  )
})

const lineasPaginadas = computed(() => {
  const start = (paginaActual.value - 1) * itemsPorPagina.value
  const end = start + itemsPorPagina.value
  return lineasFiltradas.value.slice(start, end)
})

const totalPaginas = computed(() => {
  return Math.ceil(lineasFiltradas.value.length / itemsPorPagina.value)
})

const inicioItem = computed(() => {
  return (paginaActual.value - 1) * itemsPorPagina.value + 1
})

const finItem = computed(() => {
  const end = paginaActual.value * itemsPorPagina.value
  return end > lineasFiltradas.value.length ? lineasFiltradas.value.length : end
})

// Watchers
watch([busqueda, itemsPorPagina], () => {
  paginaActual.value = 1
})

// Hook
onMounted(async () => {
  await cargarDatos()
})

// Funciones
const cargarDatos = async () => {
  try {
    await Promise.all([obtenerLineasDeAccion()])
  } catch (error) {
    console.error('Error al cargar la informacion de los stores', error)
  }
}

const formulario = reactive({
  id: null,
  codigo: '',
  titulo: '',
  descripcion: '',
})

const abrirDialogo = (linea = null) => {
  if (linea) {
    esEdicion.value = true
    Object.assign(formulario, {
      id: linea.id,
      codigo: linea.codigo,
      titulo: linea.titulo,
      descripcion: linea.descripcion,
    })
  } else {
    esEdicion.value = false
    resetearFormulario()
  }
  dialog.value = true
}

const cerrarDialogo = () => {
  dialog.value = false
  resetearFormulario()
}

const resetearFormulario = () => {
  Object.assign(formulario, {
    id: null,
    codigo: '',
    titulo: '',
    descripcion: '',
  })
  form.value?.resetValidation()
}

const guardarLinea = async () => {
  const { valid } = await form.value.validate()

  if (valid) {
    guardando.value = true
    try {
      if (esEdicion.value) {
        await lineaAccionServicios.actualizar(formulario.id, formulario)
        mostrarNotificacion('Línea actualizada correctamente')
      } else {
        await lineaAccionServicios.crear(formulario)
        mostrarNotificacion('Línea creada correctamente')
      }
      await lineasDeAccionStore.obtenerLineasDeAccion()
      cerrarDialogo()
    } catch (error) {
      console.error('Error:', error.response?.data || error.message)
      mostrarNotificacion(error.response?.data?.message || 'Error al guardar la línea', 'error')
    } finally {
      guardando.value = false
    }
  }
}

const eliminarLinea = (id) => {
  lineaAEliminar.value = id
  dialogoConfirmacion.value = true
}

const confirmarEliminacion = () => {
  lineasAccion.value = lineasAccion.value.filter((l) => l.id !== lineaAEliminar.value)
  dialogoConfirmacion.value = false
  lineaAEliminar.value = null
}
</script>

<style scoped>
.v-list-item {
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: #f5f5f5;
}

.v-btn--icon {
  margin-left: 8px;
}
</style>
