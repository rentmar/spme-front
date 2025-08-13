<template>
  <v-container class="actividad-container">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h4 text-primary"> Gestión de Actividades </v-card-title>

          <!-- Estado de carga -->
          <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

          <!-- Mensaje de error -->
          <v-alert v-if="error" type="error" dismissible class="ma-4">
            Error: {{ error.message }}
          </v-alert>

          <v-card-text>
            <v-row>
              <!-- Lista de actividades -->
              <v-col cols="12" md="6">
                <v-card>
                  <v-card-title class="text-h5">
                    Lista de Actividades
                    <v-btn color="primary" @click="fetchActividades" class="ml-2" size="small">
                      <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-card-text>
                    <v-list v-if="actividades.length">
                      <v-list-item v-for="act in actividades" :key="act.id" class="actividad-item">
                        <template v-slot:prepend>
                          <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                        </template>

                        <v-list-item-title>{{ act.codigo }}</v-list-item-title>
                        <v-list-item-subtitle>{{ act.descripcion }}</v-list-item-subtitle>

                        <template v-slot:append>
                          <v-btn
                            icon="mdi-eye"
                            variant="text"
                            color="info"
                            @click="fetchActividad(act.id)"
                          ></v-btn>
                          <v-btn
                            icon="mdi-delete"
                            variant="text"
                            color="error"
                            @click="eliminarActividad(act.id)"
                          ></v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                    <v-alert v-else type="info"> No hay actividades disponibles </v-alert>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Detalle y formulario -->
              <v-col cols="12" md="6">
                <v-card v-if="actividad" class="mb-4">
                  <v-card-title class="text-h5"> Detalle de Actividad </v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title>CODIGO:</v-list-item-title>
                        <v-list-item-subtitle>{{ actividad.codigo }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Descripción:</v-list-item-title>
                        <v-list-item-subtitle>{{ actividad.descripcion }}</v-list-item-subtitle>
                      </v-list-item>
                      <!-- Agrega más campos según tu modelo -->
                    </v-list>
                  </v-card-text>
                </v-card>

                <!-- Formulario para crear/actualizar -->
                <v-card>
                  <v-card-title class="text-h5">
                    {{ isEditing ? 'Editar Actividad' : 'Nueva Actividad' }}
                  </v-card-title>
                  <v-card-text>
                    <v-form
                      @submit.prevent="isEditing ? actualizarActividad() : agregarActividad()"
                    >
                      <v-text-field
                        v-model="formData.codigo"
                        label="Codigo"
                        required
                      ></v-text-field>

                      <v-textarea
                        v-model="formData.descripcion"
                        label="Descripción"
                        rows="3"
                      ></v-textarea>

                      <!-- Agrega más campos según tu modelo -->

                      <div class="d-flex justify-end">
                        <v-btn
                          v-if="isEditing"
                          color="secondary"
                          @click="cancelarEdicion"
                          class="mr-2"
                        >
                          Cancelar
                        </v-btn>
                        <v-btn type="submit" color="primary">
                          {{ isEditing ? 'Actualizar' : 'Crear' }}
                        </v-btn>
                      </div>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text> ¿Estás seguro de eliminar esta actividad? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="confirmDialog = false"> Cancelar </v-btn>
          <v-btn color="error" @click="confirmDelete"> Eliminar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad.js'

// Usamos el composable
const {
  loading,
  error,
  actividades,
  actividad,
  cargarActividades,
  cargarActividadPorId,
  crearActividad,
  updateActividad,
  delActividad,
} = useActividad()

// Estado del formulario
const formData = ref({
  codigo: '',
  descripcion: '',
  supuestos: '',
  riesgos: '',
  objetivo_de_actividad: '',
  descripcion_evaluacion: '',
  fecha_programada: null,
  fecha_inicio: null,
  fecha_cierre: null,
  presupuesto: null,
  presupuestoGlobal: null,
  procedencia_fondos: null,
  estado: 'PLAN',
  responsable: null,
  proceso: null,
  resultado_og: null,
  resultado_oe: null,
  producto_oe: null,
  objetivo_pei: null,
  indicador_pei: null,
  tipo: [],
})

const isEditing = ref(false)
const currentId = ref(null)
const confirmDialog = ref(false)
const actividadToDelete = ref(null)

// Cargar actividades al montar el componente
onMounted(async () => {
  await fetchActividades()
})

// Funciones del componente
async function fetchActividades() {
  try {
    await cargarActividades()
  } catch (err) {
    console.error('Error al cargar actividades:', err)
  }
}

async function fetchActividad(id) {
  try {
    await cargarActividadPorId(id)
    // Prellenar formulario para edición
    formData.value = {
      codigo: actividad.value.codigo,
      descripcion: actividad.value.descripcion,
      // Copia otros campos
    }
    currentId.value = id
    isEditing.value = true
  } catch (err) {
    console.error('Error al cargar actividad:', err)
  }
}

async function agregarActividad() {
  try {
    await crearActividad(formData.value)
    resetForm()
    await fetchActividades()
  } catch (err) {
    console.error('Error al crear actividad:', err)
  }
}

async function actualizarActividad() {
  try {
    await updateActividad(currentId.value, formData.value)
    resetForm()
    await fetchActividades()
  } catch (err) {
    console.error('Error al actualizar actividad:', err)
  }
}

function eliminarActividad(id) {
  actividadToDelete.value = id
  confirmDialog.value = true
}

async function confirmDelete() {
  try {
    await delActividad(actividadToDelete.value)
    await fetchActividades()
    confirmDialog.value = false
  } catch (err) {
    console.error('Error al eliminar actividad:', err)
  }
}

function resetForm() {
  formData.value = {
    nombre: '',
    descripcion: '',
    // Restablece otros campos
  }
  isEditing.value = false
  currentId.value = null
}

function cancelarEdicion() {
  resetForm()
  actividad.value = null
}
</script>

<style scoped>
.actividad-container {
  max-width: 1200px;
}

.actividad-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
