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
            />
          </v-col>
          <v-col cols="12" md="6" class="text-right">
            <v-chip color="primary" class="ma-2"> Total: {{ instituciones.length }} </v-chip>
          </v-col>
        </v-row>

        <!-- Tabla de instituciones -->
        <v-data-table
          :headers="headers"
          :items="instituciones"
          :search="search"
          :loading="loading"
          class="elevation-1 mt-4"
        >
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

          <template #item.total_proyectos="{ item }">
            <v-chip size="small" :color="item.total_proyectos > 0 ? 'success' : 'default'">
              {{ item.total_proyectos }}
            </v-chip>
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
        <p v-if="itemToDelete && itemToDelete.total_proyectos > 0" class="text-error">
          <v-icon color="error" size="small">mdi-alert</v-icon>
          Esta institución tiene {{ itemToDelete.total_proyectos }} proyecto(s) asociado(s). La
          eliminación podría afectar los datos relacionados.
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
import axios from 'axios'

// Props para controlar la visibilidad
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

// Emits para comunicación con el padre
const emit = defineEmits(['update:modelValue', 'success', 'error', 'close'])

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

// Watcher para cargar datos cuando se abre el diálogo
watch(dialog, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    // Se acaba de abrir el diálogo
    fetchInstituciones()
  }
  if (!newVal && oldVal) {
    // Se acaba de cerrar el diálogo
    closeFormDialog()
  }
})

// Refs reactivos internos
const formDialog = ref(false)
const deleteDialog = ref(false)
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const valid = ref(true)
const search = ref('')
const editMode = ref(false)
const formRef = ref(null)
const editedIndex = ref(-1)

// Datos reactivos
const instituciones = ref([])
const editedItem = ref(getDefaultItem())
const itemToDelete = ref(null)
const defaultItem = getDefaultItem()

// Headers de la tabla
const headers = [
  { title: 'Sigla', key: 'sigla', width: '120px' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Email', key: 'emailInstitucion' },
  { title: 'Teléfono', key: 'telefono', width: '150px' },
  { title: 'Sitio Web', key: 'webSite', width: '200px' },
  { title: 'Proyectos', key: 'total_proyectos', align: 'center', width: '120px' },
  { title: 'Acciones', key: 'actions', sortable: false, width: '100px' },
]

// Reglas de validación
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

async function fetchInstituciones() {
  loading.value = true
  try {
    // Cambia esta URL por tu endpoint real
    const response = await axios.get('/api/instituciones/')
    instituciones.value = response.data
  } catch (error) {
    console.error('Error fetching instituciones:', error)
    emit('error', 'Error al cargar las instituciones')
  } finally {
    loading.value = false
  }
}

function editItem(item) {
  editedIndex.value = instituciones.value.indexOf(item)
  editedItem.value = { ...item }
  editMode.value = true
  formDialog.value = true
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

function deleteItem(item) {
  itemToDelete.value = item
  deleteDialog.value = true
}

async function confirmDelete() {
  if (!itemToDelete.value) return

  deleting.value = true
  try {
    await axios.delete(`/api/instituciones/${itemToDelete.value.id}/`)
    instituciones.value = instituciones.value.filter((i) => i.id !== itemToDelete.value.id)
    emit('success', 'Institución eliminada correctamente')
    deleteDialog.value = false
  } catch (error) {
    console.error('Error deleting institucion:', error)
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
    return
  }

  saving.value = true
  try {
    if (editMode.value) {
      // Actualizar institución existente
      const response = await axios.put(
        `/api/instituciones/${editedItem.value.id}/`,
        editedItem.value,
      )
      Object.assign(instituciones.value[editedIndex.value], response.data)
      emit('success', 'Institución actualizada correctamente')
    } else {
      // Crear nueva institución
      const response = await axios.post('/api/instituciones/', editedItem.value)
      instituciones.value.push(response.data)
      emit('success', 'Institución creada correctamente')
    }
    closeFormDialog()
  } catch (error) {
    console.error('Error saving institucion:', error)
    emit('error', 'Error al guardar la institución')
  } finally {
    saving.value = false
  }
}

/**************** CARGAR INFORMACION *******************/
const cargando = ref(false)
const error = ref(null)
const cargarDatos = async () => {
  cargando.value = true
  try {
    await
  } catch (err) {
    console.error('Error al cargar informacion de las instituciones', err)
  } finally {
    cargando.value = ref(true)
  }
}

//Hook
onMounted(() => {})
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}

.text-decoration-none:hover {
  text-decoration: underline;
}
</style>
