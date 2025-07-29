<template>
  <div>
    <!-- Título y botón de agregar -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="6">
        <h3 class="text-h5">Procedencia de Fondos</h3>
        <p class="text-caption text-grey">Administración de fuentes de financiamiento</p>
      </v-col>
      <v-col cols="12" sm="6" class="text-sm-right">
        <v-btn icon @click="abrirDialogo()" color="primary" size="small">
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="top">Nueva Procedencia</v-tooltip>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Barra de búsqueda -->
    <v-text-field
      v-model="busqueda"
      label="Buscar procedencia de fondos"
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

    <!-- Listado de procedencias -->
    <v-card class="mb-6">
      <v-list lines="two">
        <template v-if="procedenciasFiltradas.length > 0">
          <v-list-item
            v-for="procedencia in procedenciasPaginadas"
            :key="procedencia.id"
            :title="procedencia.sigla + ' - ' + procedencia.financiera"
          >
            <template v-slot:append>
              <v-btn icon variant="text" color="blue" @click="abrirDialogo(procedencia)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="red" @click="eliminarProcedencia(procedencia.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </template>
        <v-list-item v-else title="No hay procedencias registradas" class="text-grey">
        </v-list-item>
      </v-list>

      <!-- Controles de paginación inferior -->
      <v-row class="mt-4" align="center" justify="space-between">
        <v-col cols="12" sm="6">
          <div class="text-caption text-grey">
            Mostrando {{ inicioItem }}-{{ finItem }} de {{ procedenciasFiltradas.length }} items
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
          {{ esEdicion ? 'Editar' : 'Nueva' }} Procedencia de Fondos
        </v-card-title>

        <v-card-text>
          <v-form ref="form" @submit.prevent="guardarProcedencia">
            <v-text-field
              v-model="formulario.sigla"
              label="Sigla*"
              hint="Ejemplo: FPD, FONFOSC, etc."
              :rules="[
                (v) => !!v || 'La sigla es requerida',
                (v) => (v && v.length <= 10) || 'La sigla no debe exceder 10 caracteres',
                (v) => /^[A-Z0-9]+$/.test(v) || 'Solo mayúsculas y números permitidos',
              ]"
              class="mb-3"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="formulario.financiera"
              label="Fuente Financiera*"
              :rules="[(v) => !!v || 'La fuente financiera es requerida']"
              required
              class="mb-3"
              variant="outlined"
            ></v-text-field>
          </v-form>
          <small class="text-caption text-grey">* Campos obligatorios</small>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="cerrarDialogo"> Cancelar </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="guardarProcedencia"
            :loading="guardando"
          >
            {{ esEdicion ? 'Actualizar' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useProcedenciaFondos } from '@/modules/proyecto/composables/useProcedenciaFondos'
import ConfirmDialog from '@/components/layout/partials/ConfirmDialog.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { useSnackbar } from '@/composables/useSnackbar'

// Estado del componente (igual que antes)
const dialog = ref(false)
const dialogoConfirmacion = ref(false)
const esEdicion = ref(false)
const guardando = ref(false)
const form = ref(null)
const procedenciaAEliminar = ref(null)
const busqueda = ref('')
const paginaActual = ref(1)
const itemsPorPagina = ref(5)
const opcionesItemsPorPagina = [5, 10, 20, 50, 100]

//Iniciar el composable
const {
  entidadesFinancieras,
  cargarProcedencias,
  crearProcedencia,
  updateProcedencia,
  delProcedencia,
} = useProcedenciaFondos()
const { openConfirmDialog } = useConfirmDialog()
const { successMsg, errorMsg } = useSnackbar()

// Computed properties (ajustadas para usar datos dummy)
const procedenciasFiltradas = computed(() => {
  if (!busqueda.value) return entidadesFinancieras.value

  const termino = busqueda.value.toLowerCase()
  return entidadesFinancieras.value.filter(
    (procedencia) =>
      (procedencia.sigla && procedencia.sigla.toLowerCase().includes(termino)) ||
      (procedencia.financiera && procedencia.financiera.toLowerCase().includes(termino)),
  )
})

const procedenciasPaginadas = computed(() => {
  const start = (paginaActual.value - 1) * itemsPorPagina.value
  const end = start + itemsPorPagina.value
  return procedenciasFiltradas.value.slice(start, end)
})

const totalPaginas = computed(() => {
  return Math.ceil(procedenciasFiltradas.value.length / itemsPorPagina.value)
})

const inicioItem = computed(() => {
  return (paginaActual.value - 1) * itemsPorPagina.value + 1
})

const finItem = computed(() => {
  const end = paginaActual.value * itemsPorPagina.value
  return end > procedenciasFiltradas.value.length ? procedenciasFiltradas.value.length : end
})

// Watchers (igual que antes)
watch([busqueda, itemsPorPagina], () => {
  paginaActual.value = 1
})

// Hook (simplificado para datos dummy)
onMounted(async () => {
  // No necesitamos cargar datos ya que usamos los datos dummy
  cargarProcedencias()
})

// Funciones (ajustadas para trabajar con datos dummy)
const formulario = reactive({
  id: null,
  sigla: '',
  financiera: '',
})

const abrirDialogo = async (procedencia = null) => {
  if (procedencia) {
    console.log('Es edicion')
    esEdicion.value = true
    Object.assign(formulario, {
      id: procedencia.id,
      sigla: procedencia.sigla,
      financiera: procedencia.financiera,
    })
  } else {
    console.log('Nuevo dato')
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
    sigla: '',
    financiera: '',
  })
  form.value?.resetValidation()
}

const guardarProcedencia = async () => {
  const { valid } = await form.value.validate()

  if (valid) {
    guardando.value = true

    if (esEdicion.value) {
      const confirmarEdicion = await openConfirmDialog({
        title: 'Crear nuevo registro',
        message: 'Desea Actualizar el registro de Procedencia de Fondos?',
        type: 'update',
        confirmLabel: 'Actualizar',
        cancelLabel: 'Volver',
      })
      if (confirmarEdicion) {
        try {
          await updateProcedencia(formulario.id, formulario)
          successMsg('Registro Actualizado Correctamente')
          await cargarProcedencias()
        } catch (error) {
          console.error('No se puado actualizar el registro', error)
          errorMsg('No se actualizo el registro')
        } finally {
          guardando.value = false
          dialog.value = false
        }
      }
    } else {
      const confirmarNuevo = await openConfirmDialog({
        title: 'Crear nuevo registro',
        message: 'Desea crear un nuevo registro de Procedencia de Fondos?',
        type: 'create',
        confirmLabel: 'Crear',
        cancelLabel: 'Volver',
      })
      if (confirmarNuevo) {
        try {
          await crearProcedencia(formulario)
          successMsg('Registro creado')
          await cargarProcedencias()
        } catch (error) {
          console.error('No se pudo crear el registro', error)
          errorMsg('No se creo el registro')
        } finally {
          guardando.value = false
          dialog.value = false
        }
      }
    }
  }
}

const eliminarProcedencia = async (id) => {
  procedenciaAEliminar.value = id
  dialogoConfirmacion.value = true
  console.log(procedenciaAEliminar.value)
  const confirmarEliminacion = await openConfirmDialog({
    title: 'Eliminar el registro',
    message: 'Desea eliminar el registro?',
    type: 'delete',
    confirmLabel: 'Eliminar',
    cancelLabel: 'Volver',
  })
  if (confirmarEliminacion) {
    try {
      await delProcedencia(procedenciaAEliminar.value)
      successMsg('El Registro ha sido eliminado')
      await cargarProcedencias()
    } catch (error) {
      console.error('No se elimino el registro con id: ' + procedenciaAEliminar.value, error)
      errorMsg('No se elimino el registro')
    } finally {
      guardando.value = false
      dialog.value = false
    }
  }
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
