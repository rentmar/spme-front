```vue
<!-- components/Dialogs/DialogoConfirmacionEnvio.vue -->
<template>
  <v-dialog v-model="dialogoActivo" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5 bg-primary text-white">
        <v-icon icon="mdi-content-save-all" class="mr-2" />
        Confirmar envío de planificación
      </v-card-title>

      <v-card-text class="pt-4">
        <!-- Resumen de cambios -->
        <div class="resumen-container mb-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-2">Resumen de cambios:</h3>

          <v-list density="compact" class="bg-grey-lighten-4 rounded">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-pencil" color="warning" />
              </template>
              <v-list-item-title>
                Actividades a actualizar:
                <strong>{{ resumenActividades?.actualizar || 0 }}</strong>
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-plus-circle" color="success" />
              </template>
              <v-list-item-title>
                Actividades nuevas:
                <strong>{{ resumenActividades?.nuevas || 0 }}</strong>
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-history" color="info" />
              </template>
              <v-list-item-title>
                Cambios registrados:
                <strong>{{ resumenHistorial || 0 }}</strong>
              </v-list-item-title>
            </v-list-item>

            <v-divider class="my-1" />

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-folder" color="secondary" />
              </template>
              <v-list-item-title>
                Proyecto:
                <strong>{{ metadatos?.proyecto_nombre || 'N/A' }}</strong>
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-account" color="secondary" />
              </template>
              <v-list-item-title>
                Usuario:
                <strong>{{ metadatos?.usuario_nombre || 'N/A' }}</strong>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

        <!-- Campo de motivo -->
        <div class="motivo-container">
          <h3 class="text-subtitle-1 font-weight-bold mb-2">
            Motivo de la modificación
            <span class="text-error">*</span>
          </h3>

          <v-textarea
            v-model="motivo"
            variant="outlined"
            placeholder="Describa el motivo de los cambios realizados (mínimo 10 caracteres)..."
            :rules="[validarMotivo]"
            counter
            rows="4"
            auto-grow
            :error-messages="errorMotivo"
            @update:model-value="validarEnTiempoReal"
          />

          <div class="d-flex align-center mt-1">
            <v-icon
              :icon="caracteresSuficientes ? 'mdi-check-circle' : 'mdi-alert-circle'"
              :color="caracteresSuficientes ? 'success' : 'warning'"
              size="small"
              class="mr-1"
            />
            <span
              class="text-caption"
              :class="caracteresSuficientes ? 'text-success' : 'text-warning'"
            >
              {{ contarCaracteres }} de 10 caracteres mínimos
            </span>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="outlined" color="grey" @click="cancelar">
          <v-icon icon="mdi-close" class="mr-1" />
          Cancelar
        </v-btn>
        <v-btn
          variant="flat"
          color="primary"
          :disabled="!formularioValido"
          :loading="loadingSave"
          @click="confirmarEnvio"
        >
          <v-icon icon="mdi-content-save" class="mr-1" />
          Guardar cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  resumenActividades: {
    type: Object,
    default: () => ({ actualizar: 0, nuevas: 0 }),
  },
  resumenHistorial: {
    type: Number,
    default: 0,
  },

  metadatos: {
    type: Object,
    default: () => ({}),
  },
  loadingSave: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['update:modelValue', 'guardar'])

// Estado
const motivo = ref('')
const enviando = ref(false)
const errorMotivo = ref('')

// Computed
const dialogoActivo = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const formularioValido = computed(() => {
  return caracteresSuficientes.value && !props.loadingSave
})

const contarCaracteres = computed(() => {
  if (!motivo.value.trim()) return 0
  return motivo.value.trim().length
})

const caracteresSuficientes = computed(() => contarCaracteres.value >= 10)

// Validaciones
const validarMotivo = (v) => {
  if (!v || !v.trim()) {
    return 'El motivo es obligatorio'
  }
  if (contarCaracteres.value < 10) {
    return `Mínimo 10 caracteres (actual: ${contarCaracteres.value})`
  }
  return true
}

const validarEnTiempoReal = () => {
  if (motivo.value.trim() && contarCaracteres.value < 10) {
    errorMotivo.value = `Mínimo 10 caracteres (actual: ${contarCaracteres.value})`
  } else {
    errorMotivo.value = ''
  }
}

// Acciones
const confirmarEnvio = () => {
  if (!formularioValido.value) return

  enviando.value = true
  emit('guardar', motivo.value)
}

const cancelar = () => {
  motivo.value = ''
  errorMotivo.value = ''
  dialogoActivo.value = false
}

// Resetear al abrir/cerrar
watch(
  () => props.modelValue,
  (nuevo) => {
    if (nuevo) {
      motivo.value = ''
      errorMotivo.value = ''
      enviando.value = false
    }
  },
)
</script>

<style scoped>
.resumen-container,
.motivo-container {
  margin-bottom: 16px;
}

.text-error {
  color: rgb(var(--v-theme-error));
}

.v-list-item {
  min-height: 40px;
}
</style>
```
