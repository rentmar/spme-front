<template>
  <v-form ref="form" v-model="formValid" @submit.prevent="emitirGuardado">
    <v-container>
      <!-- Título -->
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="proyectoEditado.codigo"
            label="Código *"
            :rules="codigoRules"
            variant="outlined"
            clearable
            counter="20"
            required
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="proyectoEditado.titulo"
            label="Título *"
            :rules="tituloRules"
            variant="outlined"
            clearable
            counter="200"
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
            rows="3"
            variant="outlined"
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
            :rules="[(v) => !!v || 'Campo requerido']"
            variant="outlined"
            clearable
            multiple
            chips
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="proyectoEditado.presupuesto"
            label="Presupuesto"
            type="number"
            step="0.01"
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
            variant="outlined"
            :rules="[(v) => !!v || 'Requerido']"
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
          <v-btn color="error" variant="text" @click="$emit('cancelar')">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" :disabled="!formValid" type="submit">
            Guardar Cambios
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
  {{ proyecto }}
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

// 📌 Props y emits
const props = defineProps({
  proyecto: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['guardar', 'cancelar'])

// 📌 Referencias y estado
const form = ref(null)
const formValid = ref(false)

// 🔁 Dummy instancias (REEMPLAZAR con API)
const instancias = ref([
  { id: 1, instancia: 'Ministerio de Educación' },
  { id: 2, instancia: 'Ministerio de Salud' },
  { id: 3, instancia: 'Ministerio de Cultura' },
])

// 📌 Reglas de validación
const tituloRules = [(v) => !!v || 'Título requerido']
const codigoRules = [
  (v) => !!v || 'Código requerido',
  (v) => v.length <= 20 || 'Máx. 20 caracteres',
]

// 📌 Proyecto reactivo local
const proyectoEditado = reactive({ ...props.proyecto })

// 📌 Si cambia la prop externa, se actualiza el estado interno
watch(
  () => props.proyecto,
  (nuevoProyecto) => {
    Object.assign(proyectoEditado, nuevoProyecto)
  },
  { immediate: true, deep: true },
)

// 📌 Emitir cambios
function emitirGuardado() {
  if (form.value.validate()) {
    emit('guardar', { ...proyectoEditado })
  }
}
</script>
