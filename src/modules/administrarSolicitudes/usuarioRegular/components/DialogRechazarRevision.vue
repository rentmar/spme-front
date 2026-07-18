<!-- components/usuario/DialogRechazarRevision.vue -->
<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="text-h5">Rechazar solicitud</v-card-title>
      <v-card-text>
        <p class="mb-3">
          Estás por rechazar la solicitud <strong>{{ solicitud?.codigo }}</strong> de
          <strong>{{ solicitud?.solicitante_nombre }}</strong>
        </p>
        <v-textarea
          v-model="motivo"
          label="Motivo del rechazo *"
          variant="outlined"
          :rules="[(v) => !!v || 'El motivo es requerido']"
          rows="3"
          counter="500"
          placeholder="Explica el motivo del rechazo..."
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">Cancelar</v-btn>
        <v-btn
          color="error"
          variant="tonal"
          :loading="loading"
          :disabled="!motivo"
          @click="$emit('confirmar', motivo)"
          >Confirmar rechazo</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  solicitud: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

defineEmits(['update:modelValue', 'confirmar'])

const motivo = ref('')

watch(
  () => props.modelValue,
  (val) => {
    if (val) motivo.value = ''
  },
)
</script>
