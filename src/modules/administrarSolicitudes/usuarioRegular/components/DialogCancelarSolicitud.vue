<!-- components/usuario/DialogCancelarSolicitud.vue -->
<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="text-h5">¿Cancelar solicitud?</v-card-title>
      <v-card-text>
        <p>
          ¿Estás seguro de que deseas cancelar la solicitud <strong>{{ solicitud?.codigo }}</strong
          >?
        </p>
        <p class="text-caption text-grey mt-2">
          Esta acción no se puede deshacer. La solicitud será archivada.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">No, mantener</v-btn>
        <v-btn color="error" variant="tonal" :loading="loading" @click="$emit('confirmar')"
          >Sí, cancelar solicitud</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  solicitud: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

defineEmits(['update:modelValue', 'confirmar'])
</script>
