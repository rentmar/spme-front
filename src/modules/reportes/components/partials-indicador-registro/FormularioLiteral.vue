<template>
  <v-form ref="formRef" v-model="valido">
    <v-textarea
      v-model="observaciones"
      label="Observaciones"
      variant="outlined"
      rows="3"
      :rules="[reglaRequerido]"
      class="mb-3"
    ></v-textarea>

    <v-menu
      v-model="menuFecha"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="auto"
    >
      <template v-slot:activator="{ props }">
        <v-text-field
          v-model="fecha"
          label="Fecha de registro"
          prepend-inner-icon="mdi-calendar"
          readonly
          variant="outlined"
          v-bind="props"
          :rules="[reglaRequerido]"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="fecha"
        no-title
        scrollable
        @update:model-value="menuFecha = false"
      ></v-date-picker>
    </v-menu>
  </v-form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'validacion'])

// Referencias del formulario
const formRef = ref(null)
const valido = ref(false)
const menuFecha = ref(false)

// Datos del formulario
const valorInterno = ref(props.modelValue.valorLiteral || '')
const observaciones = ref(props.modelValue.observaciones || '')
const fecha = ref(props.modelValue.fecha || new Date().toISOString().substr(0, 10))

// Reglas de validación
const reglaRequerido = (value) => !!value || 'Campo requerido'

// Computed para el objeto de datos completo
const datosFormulario = computed(() => ({
  valorLiteral: valorInterno.value,
  observaciones: observaciones.value,
  fecha: fecha.value,
  tipo: 'Literal',
}))

// Emitir cambios en los datos
watch(datosFormulario, (newVal) => {
  emit('update:modelValue', newVal)
})

// Emitir cambios en la validación
watch(valido, (newVal) => {
  emit('validacion', newVal)
})

// Métodos públicos
defineExpose({
  validar: async () => {
    if (formRef.value) {
      const { valid } = await formRef.value.validate()
      return valid
    }
    return false
  },
  reset: () => {
    valorInterno.value = ''
    observaciones.value = ''
    fecha.value = new Date().toISOString().substr(0, 10)
    formRef.value?.reset()
  },
})
</script>
