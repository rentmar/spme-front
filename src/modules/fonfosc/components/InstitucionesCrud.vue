<template>
  <!-- Diálogo principal -->
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition" scrollable>
    <v-card>
      <!-- Toolbar del diálogo -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon icon="mdi-close" />
        </v-btn>
        <v-toolbar-title>Gestión de Instituciones</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn dark text @click="openCreateDialog">
            <v-icon icon="mdi-plus" start />
            Nueva Institución
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <!-- Contenido principal -->
      <v-card-text>
        <!-- Barra de búsqueda y filtros -->
        <v-row class="mt-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar instituciones..."
              single-line
              hide-details
              clearable
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="6" class="text-right">
            <v-chip color="primary" class="ma-2">
              Total: {{ institucionesFiltradas.length }}
            </v-chip>
          </v-col>
        </v-row>

        <!-- Tabla de instituciones -->
        <v-data-table
          :headers="headers"
          :items="institucionesFiltradas"
          :search="search"
          :loading="cargando"
          class="elevation-1 mt-4"
        >
          <template #item.departamentos="{ item }">
            <div class="d-flex flex-wrap gap-1">
              <v-chip
                v-for="deptoNombre in getDepartamentosNombres(item.departamento)"
                :key="deptoNombre"
                size="small"
                color="primary"
                variant="outlined"
                class="ma-1"
              >
                {{ deptoNombre }}
              </v-chip>
              <span v-if="!item.departamento?.length" class="text-disabled text-caption">
                Sin departamentos
              </span>
            </div>
          </template>

          <template #item.actions="{ item }">
            <v-icon size="small" class="me-2" @click="editItem(item)" color="primary">
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="deleteItem(item)" color="error"> mdi-delete </v-icon>
          </template>

          <template #item.webSite="{ item }">
            <a
              v-if="item.webSite"
              :href="item.webSite"
              target="_blank"
              class="text-decoration-none"
            >
              {{ item.webSite }}
            </a>
            <span v-else class="text-disabled">No especificado</span>
          </template>

          <template #no-data>
            <v-alert type="info" class="ma-4">
              No hay instituciones registradas. Crea una nueva institución.
            </v-alert>
          </template>

          <template #loading>
            <v-row justify="center" align="center">
              <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate color="primary" />
                <div class="mt-2">Cargando instituciones...</div>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Diálogo para crear/editar -->
  <v-dialog v-model="formDialog" max-width="800px" persistent>
    <v-card>
      <v-toolbar dark :color="editMode ? 'warning' : 'primary'">
        <v-toolbar-title>
          {{ editMode ? 'Editar Institución' : 'Nueva Institución' }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon dark @click="closeFormDialog">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-toolbar>

      <v-card-text class="pt-4">
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editedItem.sigla"
                label="Sigla *"
                :rules="siglaRules"
                variant="outlined"
                clearable
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="editedItem.nombre"
                label="Nombre de la Institución *"
                :rules="nombreRules"
                variant="outlined"
                clearable
              />
            </v-col>

            <v-col cols="12">
              <!-- Campo de departamentos (multiselect) -->
              <v-autocomplete
                v-model="editedItem.departamento"
                :items="departamentosLista"
                label="Departamentos de intervención"
                item-title="nombre"
                item-value="id"
                multiple
                chips
                closable-chips
                clearable
                variant="outlined"
                :loading="cargandoDepartamentos"
                :menu-props="{ maxHeight: '200px' }"
              >
                <template #selection="{ item, index }">
                  <v-chip
                    v-if="index < 3"
                    size="small"
                    closable
                    @click:close="removeDepartamento(item.value)"
                  >
                    {{ item.title }}
                  </v-chip>
                  <span v-if="index === 3" class="text-grey text-caption align-self-center">
                    (+{{ editedItem.departamentos.length - 3 }} más)
                  </span>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="editedItem.emailInstitucion"
                label="Email Institucional"
                :rules="emailRules"
                type="email"
                variant="outlined"
                clearable
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="editedItem.telefono"
                label="Teléfono"
                variant="outlined"
                clearable
                :rules="telefonoRules"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="editedItem.direccion"
                label="Dirección"
                variant="outlined"
                rows="3"
                clearable
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="editedItem.casillaPostal"
                label="Casilla Postal"
                variant="outlined"
                clearable
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="editedItem.webSite"
                label="Sitio Web"
                :rules="websiteRules"
                type="url"
                variant="outlined"
                clearable
                prepend-icon="mdi-web"
              />
            </v-col>
          </v-row>
        </v-form>

        <small class="text-disabled">* Campos obligatorios</small>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="grey-darken-1" variant="text" @click="closeFormDialog"> Cancelar </v-btn>
        <v-btn color="primary" @click="save" :loading="saving" :disabled="!valid">
          {{ editMode ? 'Actualizar' : 'Guardar' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Diálogo de confirmación para eliminar -->
  <v-dialog v-model="deleteDialog" max-width="500px">
    <v-card>
      <v-toolbar dark color="error">
        <v-toolbar-title>Confirmar Eliminación</v-toolbar-title>
        <v-spacer />
        <v-btn icon dark @click="deleteDialog = false">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-4">
        <v-alert type="warning" class="mb-4">
          <strong>¡Atención!</strong> Esta acción no se puede deshacer.
        </v-alert>
        <p class="text-h6">¿Estás seguro de eliminar la institución:</p>
        <p class="text-h5 text-primary text-center my-4">
          {{ itemToDelete ? itemToDelete.sigla || itemToDelete.nombre : '' }}
        </p>
        <p class="text-error">
          <v-icon color="error" size="small">mdi-alert</v-icon>
          Esta acción eliminará permanentemente la institución.
        </p>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="grey-darken-1" variant="text" @click="deleteDialog = false"> Cancelar </v-btn>
        <v-btn color="error" @click="confirmDelete" :loading="deleting"> Eliminar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted } from 'vue'
import { useInstituciones } from '../composables/useInstituciones'
import { useDepBolivia } from '../composables/useDepBolivia'

// Props para controlar la visibilidad
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

// Emits para comunicación con el padre
const emit = defineEmits(['update:modelValue', 'success', 'error', 'close'])

// Iniciar el composable
const {
  institucionesLista, //Lista de las instituciones
  cargarInstituciones, //Funcion de cargalistado de instituciones
  crearInstitucion, //Funcion para crear institucion
  actualizarInstitucion, //Funcion para actualizar la institucion
  eliminarInstitucion, //funcion para eliminar
} = useInstituciones()

const { departamentosLista, cargarDepartamentosBolivia } = useDepBolivia()

// Computed para el diálogo sincronizado con props
const dialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
    if (!value) {
      emit('close')
    }
  },
})

// Refs reactivos internos
const formDialog = ref(false)
const deleteDialog = ref(false)
const saving = ref(false)
const deleting = ref(false)
const valid = ref(true)
const search = ref('')
const editMode = ref(false)
const formRef = ref(null)
const editedIndex = ref(-1)
const cargandoDepartamentos = ref(false)

// Datos reactivos
const editedItem = ref(getDefaultItem())
const itemToDelete = ref(null)
const defaultItem = getDefaultItem()

// Headers de la tabla (agregar columna de departamentos)
const headers = [
  { title: 'Sigla', key: 'sigla', width: '120px' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Departamentos', key: 'departamentos', sortable: false },
  { title: 'Email', key: 'emailInstitucion' },
  { title: 'Teléfono', key: 'telefono', width: '150px' },
  { title: 'Sitio Web', key: 'webSite', width: '200px' },
  { title: 'Acciones', key: 'actions', sortable: false, width: '100px' },
]

// Computed para filtrar instituciones y agregar nombres de departamentos
const institucionesFiltradas = computed(() => {
  const instituciones = search.value
    ? institucionesLista.value.filter((institucion) => {
        const searchTerm = search.value.toLowerCase()
        return (
          (institucion.sigla && institucion.sigla.toLowerCase().includes(searchTerm)) ||
          (institucion.nombre && institucion.nombre.toLowerCase().includes(searchTerm)) ||
          (institucion.emailInstitucion &&
            institucion.emailInstitucion.toLowerCase().includes(searchTerm))
        )
      })
    : institucionesLista.value

  // Agregar nombres de departamentos para mostrar en la tabla
  return instituciones.map((institucion) => ({
    ...institucion,
    departamentos_nombres:
      institucion.departamentos?.map((deptoId) => {
        return (
          departamentosLista.value.find((d) => d.id === deptoId) || {
            id: deptoId,
            nombre: 'Desconocido',
          }
        )
      }) || [],
  }))
})

// Reglas de validación (sin cambios)
const siglaRules = [
  (v) => !!v || 'La sigla es requerida',
  (v) => (v && v.length <= 50) || 'La sigla no debe exceder los 50 caracteres',
]

const nombreRules = [
  (v) => !!v || 'El nombre es requerido',
  (v) => (v && v.length <= 500) || 'El nombre no debe exceder los 500 caracteres',
]

const emailRules = [
  (v) => !v || /.+@.+\..+/.test(v) || 'El email debe ser válido',
  (v) => !v || (v && v.length <= 150) || 'El email no debe exceder los 150 caracteres',
]

const telefonoRules = [
  (v) => !v || (v && v.length <= 50) || 'El teléfono no debe exceder los 50 caracteres',
]

const websiteRules = [
  (v) =>
    !v ||
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v) ||
    'La URL debe ser válida',
]

// Funciones
function getDefaultItem() {
  return {
    sigla: '',
    nombre: '',
    departamentos: [], // Array de IDs de departamentos
    emailInstitucion: '',
    telefono: '',
    direccion: '',
    casillaPostal: '',
    webSite: '',
  }
}

function openCreateDialog() {
  editMode.value = false
  editedItem.value = getDefaultItem()
  formDialog.value = true
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

function closeFormDialog() {
  formDialog.value = false
  nextTick(() => {
    editedItem.value = { ...defaultItem }
    editedIndex.value = -1
  })
}

function closeDialog() {
  dialog.value = false
}

function editItem(item) {
  console.log('Editando institución:', item)
  editedIndex.value = institucionesLista.value.findIndex((i) => i.id === item.id)

  // Convertir departamentos a array de IDs
  const departamentosIds =
    item.departamentos?.map((depto) => {
      if (typeof depto === 'object') return depto.id
      return depto
    }) || []

  editedItem.value = {
    ...item,
    departamentos: departamentosIds,
  }

  editMode.value = true
  formDialog.value = true
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

function deleteItem(item) {
  console.log('Solicitando eliminar institución:', item)
  itemToDelete.value = item
  deleteDialog.value = true
}

function removeDepartamento(deptoId) {
  const index = editedItem.value.departamentos.indexOf(deptoId)
  if (index > -1) {
    editedItem.value.departamentos.splice(index, 1)
  }
}

async function confirmDelete() {
  if (!itemToDelete.value) return

  deleting.value = true
  console.log('Confirmando eliminación de institución:', itemToDelete.value)

  try {
    await eliminarInstitucion(itemToDelete.value.id)
    const index = institucionesLista.value.findIndex((i) => i.id === itemToDelete.value.id)
    if (index !== -1) {
      institucionesLista.value.splice(index, 1)
    } else {
      await cargarInstituciones()
    }

    console.log('Institución eliminada exitosamente:', itemToDelete.value)
    emit('success', 'Institución eliminada correctamente')
    deleteDialog.value = false
  } catch (error) {
    console.error('Error eliminando institución:', error)

    let errorMessage = 'Error al eliminar la institución'
    if (error.response && error.response.status === 409) {
      errorMessage = 'No se puede eliminar porque tiene proyectos asociados'
    }

    emit('error', errorMessage)
  } finally {
    deleting.value = false
    itemToDelete.value = null
  }
}

async function save() {
  if (!formRef.value) return

  const { valid: formValid } = await formRef.value.validate()

  if (!formValid) {
    console.log('Formulario inválido, no se guardará')
    return
  }

  saving.value = true
  console.log('Guardando institución:', editedItem.value)
  console.log('Departamentos seleccionados:', editedItem.value.departamentos)

  try {
    // Preparar datos para enviar (convertir departamentos a array de IDs)
    const datosParaEnviar = {
      ...editedItem.value,
      departamentos: editedItem.value.departamentos || [],
    }

    if (editMode.value) {
      const institucionActualizada = await actualizarInstitucion(
        editedItem.value.id,
        datosParaEnviar,
      )

      // Actualizar en la lista local
      const index = institucionesLista.value.findIndex((i) => i.id === editedItem.value.id)
      if (index !== -1) {
        institucionesLista.value[index] = institucionActualizada
      }

      emit('success', 'Institución actualizada correctamente')
    } else {
      const nuevaInstitucion = await crearInstitucion(datosParaEnviar)
      institucionesLista.value.push(nuevaInstitucion)
      emit('success', 'Institución creada correctamente')
    }

    closeFormDialog()
  } catch (error) {
    console.error('Error guardando institución:', error)

    let errorMessage = 'Error al guardar la institución'
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'object') {
        const errors = Object.values(error.response.data).flat().join(', ')
        if (errors) errorMessage = errors
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data
      }
    }

    emit('error', errorMessage)
  } finally {
    saving.value = false
  }
}

function getDepartamentosNombres(departamentoIds) {
  if (!Array.isArray(departamentoIds) || departamentoIds.length === 0) {
    return []
  }

  return departamentoIds.map((id) => {
    const depto = departamentosLista.value?.find((d) => d.id === id)
    return depto ? depto.nombre : `ID: ${id}`
  })
}

/**************** CARGAR INFORMACION *******************/
const cargando = ref(false)
const error = ref(null)

const cargarDatos = async () => {
  cargando.value = true
  console.log('Cargando instituciones y departamentos...')

  try {
    await Promise.all([cargarInstituciones(), cargarDepartamentosBolivia()])
    console.log('Departamentos cargados:', departamentosLista.value)
    console.log('Instituciones cargadas exitosamente:', institucionesLista.value)
  } catch (err) {
    console.error('Error al cargar información:', err)
    error.value = err
    emit('error', 'Error al cargar los datos')
  } finally {
    cargando.value = false
    console.log('Carga completada')
  }
}

// Cargar datos cuando se abre el diálogo
watch(dialog, (newVal) => {
  if (newVal) {
    console.log('Diálogo abierto, cargando datos...')
    cargarDatos()
  } else {
    console.log('Diálogo cerrado')
  }
})

//Hook
onMounted(() => {
  console.log('Componente InstitucionesCrud montado')
  if (props.modelValue) {
    cargarDatos()
  }
})
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}

.text-decoration-none:hover {
  text-decoration: underline;
}
</style>
