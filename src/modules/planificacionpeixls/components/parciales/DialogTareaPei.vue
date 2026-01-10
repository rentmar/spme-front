<template>
  <dialog></dialog>
</template>

<script setup>
import { ref } from 'vue'

//Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

//Emits
const emit = defineEmits(['update:modelValue', 'guardar', 'cancelar'])

//referencias
const formRef = ref(null)
const dialog = ref(false)
const mostrarDesglose = ref(false)
</script>

<style scoped></style>
