<template>
  <v-form ref="form" v-model="formValid" @submit.prevent="emitirEdicion">
    <v-container>
      <!-- Código y Título -->
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="proyectoEditado.codigo"
            label="Código *"
            :rules="codigoRules"
            variant="outlined"
            counter="20"
            clearable
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="proyectoEditado.titulo"
            label="Título *"
            :rules="tituloRules"
            variant="outlined"
            counter="200"
            clearable
            required
          />
        </v-col>
      </v-row>

      <!-- Descripción -->
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="proyectoEditado.descripcion"
            label="Descripción"
            variant="outlined"
            rows="3"
            clearable
          />
        </v-col>
      </v-row>

      <!-- Instancia gestora -->
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="proyectoEditado.instancia_gestora"
            :items="instancias"
            item-title="instancia"
            item-value="id"
            label="Instancia gestora *"
            :rules="[(v) => !!v?.length || 'Campo requerido']"
            variant="outlined"
            clearable
            chips
            multiple
            :loading="cargandoInstancias"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="proyectoEditado.presupuesto"
            label="Presupuesto"
            type="number"
            step="0.01"
            :rules="[(v) => v >= 0 || 'Debe ser positivo']"
            variant="outlined"
            clearable
          />
        </v-col>
      </v-row>

      <!-- Fechas -->
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="proyectoEditado.fecha_creacion"
            label="Fecha de creación"
            type="date"
            variant="outlined"
            clearable
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="proyectoEditado.fecha_inicio"
            label="Fecha de inicio *"
            type="date"
            :rules="[(v) => !!v || 'Requerido']"
            variant="outlined"
            clearable
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="proyectoEditado.fecha_finalizacion"
            label="Fecha de finalización"
            type="date"
            variant="outlined"
            clearable
          />
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <!-- Botones -->
      <v-row>
        <v-col class="text-end">
          <v-btn variant="text" color="error" @click="$emit('cancelar')">Cancelar</v-btn>
          <v-btn variant="elevated" color="primary" type="submit" :disabled="!formValid">
            Guardar Cambios
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  proyecto: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['guardar', 'cancelar'])

const form = ref(null)
const formValid = ref(false)
const cargandoInstancias = ref(false)
const instancias = ref([])

const proyectoEditado = reactive({ ...props.proyecto })

// Reglas de validación
const codigoRules = [
  (v) => !!v || 'Campo requerido',
  (v) => v.length <= 20 || 'Máximo 20 caracteres',
]
const tituloRules = [
  (v) => !!v || 'Campo requerido',
  (v) => v.length <= 200 || 'Máximo 200 caracteres',
]

// Cargar instancias gestoras desde API
async function cargarInstancias() {
  try {
    cargandoInstancias.value = true
    const res = await axios.get('/api/instancias')
    instancias.value = res.data
  } catch (e) {
    console.error('Error cargando instancias', e)
    instancias.value = []
  } finally {
    cargandoInstancias.value = false
  }
}

// Emitir evento al guardar
function emitirEdicion() {
  if (form.value.validate()) {
    emit('guardar', { ...proyectoEditado })
  }
}

// Recargar el estado cuando cambian las props
watch(
  () => props.proyecto,
  (nuevo) => {
    Object.assign(proyectoEditado, nuevo)
  },
  { immediate: true, deep: true },
)

onMounted(cargarInstancias)
</script>
