<template>
  <v-card variant="outlined" class="mb-4">
    <v-toolbar color="primary" density="compact">
      <v-toolbar-title>
        {{ editMode ? 'EDITAR PROYECTO' : 'NUEVO PROYECTO' }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-card-text>
      <v-form ref="formRef">
        <v-row>
          <!-- Código y Título -->
          <v-col cols="12">
            <v-text-field
              v-model="form.codigo"
              label="Código *"
              :rules="codigoRules"
              counter="20"
              variant="outlined"
              density="comfortable"
              clearable
              required
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="form.titulo"
              label="Título *"
              :rules="tituloRules"
              variant="outlined"
              density="comfortable"
              clearable
              required
            />
          </v-col>
        </v-row>

        <v-row>
          <!-- Descripción -->
          <v-col cols="12">
            <v-textarea
              v-model="form.descripcion"
              label="Descripción"
              variant="outlined"
              density="comfortable"
              rows="3"
              clearable
            />
          </v-col>
        </v-row>

        <!-- Solo en modo creación -->
        <v-row v-if="!editMode">
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="peiVigente?.nombre || 'PEI no asignado'"
              variant="outlined"
              label="Pertenece a"
              readonly
            />
            <input type="hidden" v-model="form.pei" />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              variant="outlined"
              v-model="form.instancia_gestora"
              label="Instancia gestora*"
              :items="instancias"
              item-title="instancia"
              item-value="id"
              multiple
              chips
              :return-object="false"
              :rules="[(v) => !!v?.length || 'La instancia gestora es requerida']"
            ></v-select>
          </v-col>
        </v-row>

        <!-- Creado por y presupuesto -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.creado_por"
              label="Creado por"
              counter="150"
              variant="outlined"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.presupuesto"
              label="Presupuesto"
              type="number"
              step="0.01"
              min="0"
              variant="outlined"
              :rules="[(v) => v >= 0 || 'El presupuesto debe ser positivo']"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <!-- Fechas -->
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              label="Fecha de creación"
              v-model="form.fecha_creacion"
              type="date"
              variant="outlined"
              readonly
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              label="Fecha de inicio *"
              v-model="form.fecha_inicio"
              type="date"
              variant="outlined"
              :rules="[(v) => !!v || 'La fecha de inicio es requerida']"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              label="Fecha de finalización"
              v-model="form.fecha_finalizacion"
              type="date"
              variant="outlined"
              :rules="[
                (v) => !v || v >= form.fecha_inicio || 'Debe ser posterior a la fecha de inicio',
              ]"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <!-- Estado -->
        <v-row>
          <v-col cols="12">
            <v-select
              variant="outlined"
              v-model="form.estado"
              label="Estado del proyecto *"
              :items="estadoOpciones"
              item-title="title"
              item-value="value"
              :return-object="false"
              :rules="[(v) => !!v || 'El estado es requerido']"
            ></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-spacer />
      <v-btn color="grey" variant="outlined" @click="cancelar" :disabled="loading">
        Cancelar
      </v-btn>
      <v-btn color="primary" @click="guardar" :loading="loading" :disabled="!formValido">
        {{ editMode ? 'Actualizar' : 'Guardar' }}
      </v-btn>
    </v-card-actions>
  </v-card>

  <v-alert v-if="error" type="error" variant="tonal" class="mt-4">
    {{ error }}
  </v-alert>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useProyectoForm } from '../composables/useProyectoForm'
import { useProyectoCrud } from '../composables/useProyectoCrud'
import { useSnackbar } from '@/composables/useSnackbar'
import { useInstanciaGestora } from '@/modules/instanciaGestora/composables/useInstanciaGestora'

// Props
const props = defineProps({
  proyecto: {
    type: Object,
    default: null,
  },
  editMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

// Dependencias
const peiVigente = inject('peiVigente')
const formRef = ref(null)

const { form, setInitialValues, resetForm } = useProyectoForm(props.proyecto)
const { loading, error, createProyecto, updateProyecto } = useProyectoCrud()
const { successMsg, errorMsg } = useSnackbar()
const { instancias, cargarInstancias } = useInstanciaGestora()

// Setup en modo creación
if (!props.editMode) {
  form.value.creado_por = 'Admin'
  form.value.fecha_creacion = new Date().toISOString().substr(0, 10)
  if (peiVigente) form.value.pei = peiVigente.id
}

// Cargar datos necesarios
onMounted(async () => {
  try {
    await cargarInstancias()
    if (props.editMode && props.proyecto) {
      setInitialValues(props.proyecto)
    }
  } catch (err) {
    console.error('Error al cargar datos:', err)
    errorMsg('No se pudo cargar la información necesaria.')
  }
})

const estadoOpciones = [
  { value: 'ES', title: 'Estructuración' },
  { value: 'EP', title: 'En Planificación' },
]

// Validaciones
const codigoRules = [
  (v) => !!v || 'El código es requerido',
  (v) => (v && v.length <= 20) || 'Máximo 20 caracteres',
  (v) => /^[A-Z0-9-]+$/.test(v) || 'Solo mayúsculas, números y guiones',
]

const tituloRules = [
  (v) => !!v || 'El título es requerido',
  (v) => (v && v.length <= 200) || 'Máximo 200 caracteres',
  (v) => /^[\w\sáéíóúÁÉÍÓÚñÑ.,;:¿?¡!()-]+$/.test(v) || 'Caracteres no válidos',
]

const formValido = computed(() => {
  const base =
    form.value.codigo && form.value.titulo && form.value.fecha_inicio && form.value.estado
  return props.editMode ? base : base && form.value.instancia_gestora?.length > 0
})

const cancelar = () => {
  resetForm()
  emit('cancel')
}

const guardar = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) {
    errorMsg('Por favor complete todos los campos requeridos')
    return
  }

  try {
    const proyectoData = {
      ...form.value,
      presupuesto: form.value.presupuesto ? Number(form.value.presupuesto) : null,
    }

    if (props.editMode) {
      const { pei, instancia_gestora, ...payload } = proyectoData
      await updateProyecto(props.proyecto.id, payload)
      successMsg('Proyecto actualizado correctamente')
    } else {
      await createProyecto(proyectoData)
      successMsg('Proyecto creado correctamente')
    }

    emit('submit')
  } catch (err) {
    console.error('Error al guardar el proyecto:', err)
    errorMsg(err.message || 'Error al guardar el proyecto')
  }
}
</script>

<style scoped>
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
</style>
