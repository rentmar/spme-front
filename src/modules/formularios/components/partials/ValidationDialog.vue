<template>
  <v-dialog v-model="dialogVisible" max-width="800">
    <v-card>
      <v-toolbar color="primary" :title="title">
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-4">
        <!-- Indicador de carga -->
        <div v-if="isLoading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-2">Cargando datos...</p>
        </div>

        <!-- Lista de items -->
        <v-list v-else-if="items.length > 0" class="py-0">
          <v-list-item
            v-for="(item, index) in items"
            :key="`${item.id}-${index}`"
            @click="handleItemClick(item)"
            class="mb-2 cursor-pointer"
            :class="{ 'selected-item': selectedItemId === item.id }"
          >
            <v-list-item-title class="font-weight-bold">
              <v-icon left :color="getItemIconColor(item)">{{ getItemIcon(item) }}</v-icon>
              Formulario: {{ item.numeroFormulario || item.id }}
            </v-list-item-title>

            <v-list-item-subtitle class="mt-1">
              <slot name="item-content" :item="item">
                <!-- Contenido por defecto -->
                <div class="text-caption">ID: {{ item.id }}</div>
              </slot>
            </v-list-item-subtitle>

            <!-- Indicador de estado -->
            <template v-slot:append>
              <v-icon v-if="isItemValidated(item)" color="success">mdi-check-circle</v-icon>
              <v-icon v-else color="warning">mdi-clock-outline</v-icon>
            </template>
          </v-list-item>
        </v-list>

        <!-- Mensaje vacío -->
        <div v-else class="text-center py-8">
          <v-icon size="64" color="grey lighten-1">mdi-information-outline</v-icon>
          <h3 class="text-h6 mt-4">Sin elementos</h3>
          <p class="text-grey">{{ emptyMessage }}</p>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="outlined" @click="closeDialog"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  loadingKey: {
    type: String,
    default: 'loading',
  },
  emptyMessage: {
    type: String,
    default: 'No hay elementos para mostrar',
  },
})

const emit = defineEmits(['update:modelValue', 'item-click', 'close'])

// Estado interno
const selectedItemId = ref(null)
const isLoading = ref(false)

// Computed para el diálogo
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Métodos
const handleItemClick = (item) => {
  selectedItemId.value = item.id
  emit('item-click', item)
  // No cerramos automáticamente para permitir múltiples selecciones
}

const closeDialog = () => {
  dialogVisible.value = false
  selectedItemId.value = null
  emit('close')
}

const getItemIcon = (item) => {
  // Iconos basados en el tipo de validación
  if (item.validacionCoordinador && item.validacionResponsable) {
    return 'mdi-check-all'
  } else if (item.validacionCoordinador || item.validacionResponsable) {
    return 'mdi-check'
  } else {
    return 'mdi-clock-outline'
  }
}

const getItemIconColor = (item) => {
  if (item.validacionCoordinador && item.validacionResponsable) {
    return 'success'
  } else if (item.validacionCoordinador || item.validacionResponsable) {
    return 'warning'
  } else {
    return 'grey'
  }
}

const isItemValidated = (item) => {
  return item.validacionCoordinador && item.validacionResponsable
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.selected-item {
  background-color: rgba(33, 150, 243, 0.08);
  border-left: 4px solid #2196f3;
}
</style>
