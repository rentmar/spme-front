<template>
  <v-form ref="formRef" v-model="valido">
    <v-slider
      v-model="valorInterno"
      :min="0"
      :max="100"
      :step="1"
      thumb-label="always"
      color="primary"
      class="mb-4"
    >
      <template v-slot:thumb-label="{ modelValue }"> {{ modelValue }}% </template>
    </v-slider>

    <v-text-field
      v-model="valorInterno"
      label="Porcentaje (%)"
      variant="outlined"
      type="number"
      :min="0"
      :max="100"
      :rules="[reglaRequerido, reglaRangoPorcentual]"
      class="mb-3"
      suffix="%"
      clearable
    ></v-text-field>

    <v-textarea
      v-model="observaciones"
      label="Observaciones"
      variant="outlined"
      rows="3"
      :rules="[reglaRequerido]"
      class="mb-3"
      clearable
    ></v-textarea>

    <v-text-field
      v-model="menuFecha"
      label="Fecha de registro"
      type="date"
      variant="outlined"
      clearable
    />
  </v-form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  indicador: { type: Object, required: true },
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})

console.log('Props Indicador: ', props.indicador)

const emit = defineEmits(['update:modelValue', 'validacion'])

// Referencias del formulario
const formRef = ref(null)
const valido = ref(false)

// Datos del formulario
const valorInterno = ref(props.modelValue.valorPorcentual || 0)
const observaciones = ref(props.modelValue.observaciones || '')
const fecha = ref(props.modelValue.fecha || new Date().toISOString().substr(0, 10))

// Reglas de validación
const reglaRequerido = (value) => !!value || 'Campo requerido'
const reglaRangoPorcentual = (value) =>
  (value >= 0 && value <= 100) || 'El valor debe estar entre 0 y 100%'

// Computed para el objeto de datos completo
const datosFormulario = computed(() => ({
  valorPorcentual: valorInterno.value,
  observaciones: observaciones.value,
  fecha: fecha.value,
  tipo: 'Porcentual',
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
    valorInterno.value = 0
    observaciones.value = ''
    fecha.value = new Date().toISOString().substr(0, 10)
    formRef.value?.reset()
  },
})
</script>
