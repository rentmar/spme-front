<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600px"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <!-- Encabezado del diálogo -->
      <v-card-item>
        <template #prepend>
          <v-icon color="primary" size="24">mdi-account-edit</v-icon>
        </template>
        <v-card-title class="text-h6">{{ titulo }}</v-card-title>
        <template #append>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="$emit('cerrar')"
            :disabled="loading"
          />
        </template>
      </v-card-item>
      <v-divider />

      <v-card-text class="pa-4">
        <!-- Aviso de solo lectura -->
        <v-alert v-if="soloLectura" type="warning" variant="tonal" density="compact" class="mb-4">
          <template #prepend>
            <v-icon size="20">mdi-lock</v-icon>
          </template>
          Solo el redactor del documento puede editar los validadores.
        </v-alert>

        <!-- Slot para contenido específico -->
        <slot />

        <!-- Motivo de reasignación -->
        <div v-if="!soloLectura" class="mb-4 mt-4">
          <v-textarea
            v-model="motivoLocal"
            label="Motivo de reasignación *"
            placeholder="Describa el motivo del cambio de validadores (mínimo 10 caracteres)..."
            rows="2"
            auto-grow
            density="comfortable"
            variant="outlined"
            :disabled="loading || soloLectura"
            :error-messages="erroresMotivoLocal"
            :counter="minimoCaracteres"
            hint="Este motivo se registrará en el historial"
            persistent-hint
          />
        </div>
      </v-card-text>

      <v-divider />

      <!-- Acciones del diálogo -->
      <v-card-actions class="pa-4">
        <slot name="acciones">
          <v-btn
            color="grey-darken-1"
            variant="tonal"
            size="small"
            @click="$emit('cerrar')"
            :disabled="loading"
          >
            {{ soloLectura ? 'Cerrar' : 'Cancelar' }}
          </v-btn>

          <v-spacer />

          <v-btn
            v-if="!soloLectura"
            color="primary"
            variant="tonal"
            size="small"
            :loading="loading"
            :disabled="!puedeGuardar"
            @click="manejarGuardar"
          >
            <v-icon start size="16">mdi-content-save</v-icon>
            Guardar Cambios
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  titulo: {
    type: String,
    default: 'Reasignar Validadores',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hayCambios: {
    type: Boolean,
    default: false,
  },
  minimoCaracteres: {
    type: Number,
    default: 10,
  },
  soloLectura: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'cerrar', 'guardar'])

const motivoLocal = ref('')
const erroresMotivoLocal = ref([])

const puedeGuardar = computed(() => {
  return (
    !props.soloLectura &&
    props.hayCambios &&
    motivoLocal.value.trim().length >= props.minimoCaracteres
  )
})

watch(motivoLocal, (nuevoValor) => {
  if (nuevoValor.trim().length > 0 && nuevoValor.trim().length < props.minimoCaracteres) {
    erroresMotivoLocal.value = [
      `El motivo debe tener al menos ${props.minimoCaracteres} caracteres (actual: ${nuevoValor.trim().length})`,
    ]
  } else {
    erroresMotivoLocal.value = []
  }
})

watch(
  () => props.modelValue,
  (nuevoValor) => {
    if (!nuevoValor) {
      motivoLocal.value = ''
      erroresMotivoLocal.value = []
    }
  },
)

const manejarGuardar = () => {
  if (props.soloLectura) return

  const motivoTrim = motivoLocal.value.trim()

  if (motivoTrim.length < props.minimoCaracteres) {
    erroresMotivoLocal.value = [
      `El motivo debe tener al menos ${props.minimoCaracteres} caracteres (actual: ${motivoTrim.length})`,
    ]
    return
  }

  erroresMotivoLocal.value = []

  emit('guardar', {
    motivo: motivoTrim,
  })
}
</script>
