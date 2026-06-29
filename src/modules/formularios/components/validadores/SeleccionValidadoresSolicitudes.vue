<template>
  <div>
    <v-alert
      variant="tonal"
      color="info"
      icon="mdi-information-outline"
      density="compact"
      class="mb-4"
      border="start"
    >
      Seleccione los validadores para cada aprobación
    </v-alert>

    <v-card variant="outlined" class="mb-4">
      <v-card-text class="pa-4">
        <!-- Responsable de Coordinación -->
        <div class="mb-4">
          <div class="d-flex align-center mb-2">
            <v-icon color="primary" class="mr-2">mdi-account-tie</v-icon>
            <span class="text-subtitle-1 font-weight-medium">Responsable de Coordinación</span>
          </div>
          <v-autocomplete
            v-model="coordinacionSelected"
            :items="storeValidadores.coordinadores"
            :item-title="(item) => `${item.nombre} ${item.paterno} ${item.materno}`"
            item-value="id"
            label="Seleccionar responsable"
            variant="outlined"
            density="compact"
            bg-color="blue-lighten-5"
            prepend-icon="mdi-account-question"
            clearable
            return-object
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="`${item.raw.nombre} ${item.raw.paterno} ${item.raw.materno}`"
                :subtitle="item.raw.cargo"
              >
                <template v-slot:append>
                  <span class="text-caption text-medium-emphasis">
                    {{ item.raw.correo || 'Sin correo' }}
                  </span>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </div>

        <v-divider class="my-3"></v-divider>

        <!-- Responsable de Dirección Administrativa -->
        <div class="mt-4">
          <div class="d-flex align-center mb-2">
            <v-icon color="primary" class="mr-2">mdi-account-supervisor</v-icon>
            <span class="text-subtitle-1 font-weight-medium"
              >Responsable de Dirección Administrativa</span
            >
          </div>
          <v-autocomplete
            v-model="administrativoSelected"
            :items="storeValidadores.directoresAdministrativos"
            :item-title="(item) => `${item.nombre} ${item.paterno} ${item.materno}`"
            item-value="id"
            label="Seleccionar responsable"
            variant="outlined"
            density="compact"
            bg-color="blue-lighten-5"
            prepend-icon="mdi-account-question"
            clearable
            return-object
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="`${item.raw.nombre} ${item.raw.paterno} ${item.raw.materno}`"
                :subtitle="item.raw.cargo"
              >
                <template v-slot:append>
                  <span class="text-caption text-medium-emphasis">
                    {{ item.raw.correo || 'Sin correo' }}
                  </span>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </div>
      </v-card-text>
    </v-card>

    <!-- Resumen de selección -->
    <v-card
      v-if="coordinacionSelected || administrativoSelected"
      variant="tonal"
      color="primary-lighten-5"
      class="mt-3"
    >
      <v-card-text class="pa-3">
        <div class="text-caption text-medium-emphasis mb-2">VALIDACIONES SELECCIONADAS</div>
        <v-row dense>
          <v-col cols="12" md="6" v-if="coordinacionSelected">
            <div class="mb-2">
              <div class="d-flex align-center mb-1">
                <v-icon size="small" color="primary" class="mr-1">mdi-check-circle</v-icon>
                <span class="text-body-2 font-weight-medium">
                  {{ coordinacionSelected?.nombre || '' }}
                  {{ coordinacionSelected?.paterno || '' }}
                  {{ coordinacionSelected?.materno || '' }}
                </span>
              </div>
              <div class="ml-6">
                <div class="text-caption">
                  <v-icon size="x-small" class="mr-1">mdi-briefcase</v-icon>
                  {{ coordinacionSelected?.cargo || 'Sin cargo' }}
                </div>
                <div class="text-caption">
                  <v-icon size="x-small" class="mr-1">mdi-email</v-icon>
                  {{ coordinacionSelected?.correo || 'Sin correo registrado' }}
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6" v-if="administrativoSelected">
            <div class="mb-2">
              <div class="d-flex align-center mb-1">
                <v-icon size="small" color="primary" class="mr-1">mdi-check-circle</v-icon>
                <span class="text-body-2 font-weight-medium">
                  {{ administrativoSelected?.nombre || '' }}
                  {{ administrativoSelected?.paterno || '' }}
                  {{ administrativoSelected?.materno || '' }}
                </span>
              </div>
              <div class="ml-6">
                <div class="text-caption">
                  <v-icon size="x-small" class="mr-1">mdi-briefcase</v-icon>
                  {{ administrativoSelected?.cargo || 'Sin cargo' }}
                </div>
                <div class="text-caption">
                  <v-icon size="x-small" class="mr-1">mdi-email</v-icon>
                  {{ administrativoSelected?.correo || 'Sin correo registrado' }}
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useValidadoresSolicitudesStore } from '../../store/useValidadoresSolicitudesStore'

const storeValidadores = useValidadoresSolicitudesStore()

const emit = defineEmits(['update:modelValue'])

const coordinacionSelected = ref(null)
const administrativoSelected = ref(null)

const validacionCompleta = computed(() => {
  return !!(coordinacionSelected.value && administrativoSelected.value)
})

const datosValidadores = computed(() => ({
  validadoresIds: [coordinacionSelected.value?.id, administrativoSelected.value?.id].filter(
    (id) => id != null,
  ),
  validacionCompleta: validacionCompleta.value,
}))

watch(
  datosValidadores,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { immediate: true, deep: true },
)

defineExpose({
  validacionCompleta,
  datosValidadores,
  coordinacionSelected,
  administrativoSelected,
})
</script>
