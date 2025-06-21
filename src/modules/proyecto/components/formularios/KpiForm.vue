<template>
  <v-card class="kpi-form-card" elevation="2">
    <!-- Header con título y acciones -->
    <v-toolbar color="primary" density="compact" class="form-header">
      <v-toolbar-title class="text-white">
        <v-icon left>mdi-chart-line</v-icon>
        {{ esNuevo ? 'Nuevo Indicador KPI' : `Editar KPI: ${formData.codigo}` }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon variant="text" @click="$emit('cancelar')" class="text-white">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- Formulario -->
    <v-form ref="form" @submit.prevent="guardar" class="form-content">
      <v-container fluid>
        <!-- Código -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.codigo"
              label="Código del KPI *"
              variant="outlined"
              density="comfortable"
              :rules="codigoRules"
              :prefix="codigoPrefix"
              :disabled="!esNuevo"
              counter
              maxlength="20"
            >
              <template v-slot:prepend-inner>
                <v-icon color="primary">mdi-identifier</v-icon>
              </template>
            </v-text-field>
          </v-col>

          <!-- Objetivo General (solo lectura) -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.objetivo_general"
              label="Objetivo General Asociado *"
              variant="outlined"
              density="comfortable"
              :rules="[required]"
              readonly
            >
              <template v-slot:prepend-inner>
                <v-icon color="primary">mdi-target</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <!-- Descripción -->
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="formData.descripcion"
              label="Descripción del KPI *"
              variant="outlined"
              density="comfortable"
              :rules="[required]"
              rows="3"
              auto-grow
              counter
              maxlength="500"
            >
              <template v-slot:prepend-inner>
                <v-icon color="primary">mdi-text</v-icon>
              </template>
            </v-textarea>
          </v-col>
        </v-row>

        <!-- Campos adicionales (ejemplo) -->
        <v-row v-if="!esNuevo">
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.periodicidad"
              label="Periodicidad de medición"
              variant="outlined"
              density="comfortable"
              :items="periodicidades"
              item-title="text"
              item-value="value"
            >
              <template v-slot:prepend-inner>
                <v-icon color="primary">mdi-calendar-sync</v-icon>
              </template>
            </v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.meta"
              label="Meta u objetivo"
              variant="outlined"
              density="comfortable"
              type="number"
            >
              <template v-slot:prepend-inner>
                <v-icon color="primary">mdi-flag-checkered</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>

      <!-- Acciones -->
      <v-card-actions class="form-actions">
        <v-spacer />
        <v-btn color="grey-darken-2" variant="text" @click="$emit('cancelar')" class="mr-2">
          Cancelar
        </v-btn>

        <v-btn
          v-if="!esNuevo"
          color="error"
          variant="tonal"
          @click="confirmarEliminar"
          class="mr-2"
        >
          <v-icon left>mdi-delete-outline</v-icon>
          Eliminar
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          type="submit"
          :loading="guardando"
          :disabled="!formValid"
        >
          <v-icon left>mdi-content-save</v-icon>
          {{ esNuevo ? 'Crear KPI' : 'Guardar Cambios' }}
        </v-btn>
      </v-card-actions>
    </v-form>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="dialogoEliminar" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon left color="error">mdi-alert-circle</v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text>
          ¿Está seguro que desea eliminar permanentemente este KPI?
          <strong class="d-block mt-2">{{ formData.codigo }}</strong>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="dialogoEliminar = false"> Cancelar </v-btn>
          <v-btn color="error" variant="flat" @click="eliminar"> Confirmar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const props = defineProps({
  node: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      data: {
        codigo: '',
        descripcion: '',
        objetivo_general: null,
        periodicidad: 'mensual',
        meta: null,
      },
    }),
  },
})

const emit = defineEmits(['guardar', 'cancelar', 'eliminar'])

// Estado del formulario
const form = ref(null)
const guardando = ref(false)
const dialogoEliminar = ref(false)
const formData = ref({ ...props.node.data })

// Opciones para select
const periodicidades = [
  { text: 'Diaria', value: 'diaria' },
  { text: 'Semanal', value: 'semanal' },
  { text: 'Mensual', value: 'mensual' },
  { text: 'Trimestral', value: 'trimestral' },
  { text: 'Anual', value: 'anual' },
]

// Computed
const esNuevo = computed(() => !props.node.id)
const codigoPrefix = computed(() => (formData.value.codigo.startsWith('KPI-') ? '' : 'KPI-'))
const formValid = computed(
  () =>
    formData.value.codigo &&
    formData.value.codigo.length >= 4 &&
    formData.value.descripcion &&
    formData.value.objetivo_general > 0,
)

// Reglas de validación
const required = (v) => !!v || 'Campo obligatorio'
const codigoRules = [
  required,
  (v) => (v && v.length >= 4) || 'Mínimo 4 caracteres',
  (v) => (v && v.length <= 20) || 'Máximo 20 caracteres',
  (v) => /^KPI-[a-zA-Z0-9]+$/.test(v) || 'Formato: KPI-XXX',
]

// Watchers
watch(
  () => props.node,
  (newNode) => {
    formData.value = { ...newNode.data }
  },
  { deep: true },
)

// Métodos
const guardar = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  guardando.value = true
  try {
    // Asegurar prefijo KPI-
    if (!formData.value.codigo.startsWith('KPI-')) {
      formData.value.codigo = `KPI-${formData.value.codigo}`
    }

    emit('guardar', {
      ...formData.value,
      // Transformaciones adicionales si son necesarias
    })
  } finally {
    guardando.value = false
  }
}

const confirmarEliminar = () => {
  dialogoEliminar.value = true
}

const eliminar = () => {
  dialogoEliminar.value = false
  emit('eliminar')
}
</script>

<style scoped>
.kpi-form-card {
  border-radius: 8px;
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.form-content {
  padding: 20px;
}

.form-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  padding: 16px;
}

@media (max-width: 600px) {
  .form-content {
    padding: 12px;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 8px;
  }

  .form-actions .v-btn {
    width: 100%;
    margin: 0 !important;
  }
}
</style>
