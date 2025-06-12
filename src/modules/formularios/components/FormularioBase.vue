<template>
  <v-card class="pa-6" max-width="600" elevation="4" rounded="xl">
    <v-card-title class="text-h6 font-weight-bold">
      <v-icon start class="me-2">mdi-pencil</v-icon>
      Editar Información
    </v-card-title>

    <v-card-text>
      <v-form ref="form" v-model="esValido">
        <v-text-field
          v-model="modeloLocal.nombre"
          label="Nombre"
          prepend-icon="mdi-account"
          :rules="[(v) => !!v || 'El nombre es requerido']"
          required
        />

        <v-text-field
          v-model="modeloLocal.descripcion"
          label="Descripción"
          prepend-icon="mdi-text"
          :rules="[(v) => !!v || 'La descripción es requerida']"
          required
          counter="150"
        />

        <v-select
          v-model="modeloLocal.estado"
          :items="['Activo', 'Inactivo']"
          label="Estado"
          prepend-icon="mdi-toggle-switch"
          :rules="[(v) => !!v || 'Selecciona un estado']"
        />
      </v-form>
    </v-card-text>

    <v-card-actions class="justify-end">
      <v-btn color="secondary" variant="outlined" @click="cancelar">
        <v-icon start>mdi-close</v-icon> Cancelar
      </v-btn>

      <v-btn color="primary" variant="flat" :disabled="!esValido" @click="guardarFormulario">
        <v-icon start>mdi-content-save</v-icon> Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  modelo: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['guardar', 'cancelar'])

const esValido = ref(false)
const form = ref(null)

// Creamos una copia local del modelo para no mutar directamente
const modeloLocal = reactive({ ...props.modelo })

// Watch para actualizar si cambia desde el padre
watch(
  () => props.modelo,
  (nuevo) => {
    Object.assign(modeloLocal, nuevo)
  },
  { deep: true },
)

const guardarFormulario = async () => {
  const valid = await form.value.validate()
  if (valid) {
    emits('guardar', { ...modeloLocal })
  }
}

const cancelar = () => {
  emits('cancelar')
}
</script>
