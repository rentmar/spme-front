<!-- components/validation/partials/AsignacionRevisoresForm.vue -->
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
        <!-- Redactor (preseleccionado con usuario actual) -->
        <div class="mb-4">
          <div class="d-flex align-center mb-2">
            <v-icon color="primary" class="mr-2">mdi-notebook-edit</v-icon>
            <span class="text-subtitle-1 font-weight-medium">Redactor</span>
            <v-chip size="x-small" color="primary" variant="tonal" class="ml-2"> Actual </v-chip>
          </div>
          <v-autocomplete
            v-model="redactorSelected"
            :items="storeValidadores.redactores"
            :item-title="(item) => `${item.nombre} ${item.paterno} ${item.materno}`"
            item-value="id"
            label="Redactor del documento"
            variant="outlined"
            density="compact"
            bg-color="green-lighten-5"
            prepend-icon="mdi-account-edit"
            return-object
            :disabled="true"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="`${item.raw.nombre} ${item.raw.paterno} ${item.raw.materno}`"
                :subtitle="item.raw.cargo"
              >
                <template v-slot:append>
                  <v-chip
                    v-if="item.raw.id === storeUsuario.id"
                    size="x-small"
                    color="success"
                    variant="tonal"
                  >
                    Tú
                  </v-chip>
                  <span v-else class="text-caption text-medium-emphasis">
                    {{ item.raw.correo || 'Sin correo' }}
                  </span>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </div>

        <v-divider class="my-3"></v-divider>

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

        <!-- Responsable Contable -->
        <div class="mb-4">
          <div class="d-flex align-center mb-2">
            <v-icon color="primary" class="mr-2">mdi-account-tie</v-icon>
            <span class="text-subtitle-1 font-weight-medium">Responsable Contable</span>
          </div>
          <v-autocomplete
            v-model="contableSelected"
            :items="storeValidadores.contables"
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
            <span class="text-subtitle-1 font-weight-medium">
              Responsable de Dirección Administrativa
            </span>
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
      v-if="redactorSelected || coordinacionSelected || administrativoSelected"
      variant="tonal"
      color="primary-lighten-5"
      class="mt-3"
    >
      <v-card-text class="pa-3">
        <div class="text-caption text-medium-emphasis mb-2">VALIDACIONES SELECCIONADAS</div>
        <v-row dense>
          <v-col cols="12" v-if="redactorSelected">
            <div class="mb-2">
              <div class="d-flex align-center mb-1">
                <v-icon size="small" color="success" class="mr-1">mdi-check-circle</v-icon>
                <span class="text-body-2 font-weight-medium">
                  {{ redactorSelected?.nombre || '' }}
                  {{ redactorSelected?.paterno || '' }}
                  {{ redactorSelected?.materno || '' }}
                </span>
                <v-chip size="x-small" color="success" variant="tonal" class="ml-2"
                  >Redactor</v-chip
                >
              </div>
            </div>
          </v-col>
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
            </div>
          </v-col>
          <v-col cols="12" md="6" v-if="contableSelected">
            <div class="mb-2">
              <div class="d-flex align-center mb-1">
                <v-icon size="small" color="primary" class="mr-1">mdi-check-circle</v-icon>
                <span class="text-body-2 font-weight-medium">
                  {{ contableSelected?.nombre || '' }}
                  {{ contableSelected?.paterno || '' }}
                  {{ contableSelected?.materno || '' }}
                </span>
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
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useValidadoresSolicitudesStore } from '@/modules/formularios/store/useValidadoresSolicitudesStore'
import { useUserStore } from '@/stores/user'

const storeValidadores = useValidadoresSolicitudesStore()
const storeUsuario = useUserStore()

const emit = defineEmits(['update:modelValue'])

const redactorSelected = ref(null)
const coordinacionSelected = ref(null)
const contableSelected = ref(null)
const administrativoSelected = ref(null)

onMounted(async () => {
  await nextTick()

  const usuarioActualId = storeUsuario.id
  const encontrado = storeValidadores.listaUsuarios.find(
    (u) => String(u.id) === String(usuarioActualId),
  )

  if (encontrado) {
    redactorSelected.value = encontrado
  }
})

// ⭐ Computed: ¿está completo?
const validacionCompleta = computed(() => {
  return !!(
    redactorSelected.value &&
    contableSelected.value &&
    coordinacionSelected.value &&
    administrativoSelected.value
  )
})

// ⭐ Datos que se envían al padre (hijo)
const datosValidadores = computed(() => ({
  redactorId: redactorSelected.value?.id,
  validadoresIds: [
    coordinacionSelected.value?.id,
    contableSelected.value?.id,
    administrativoSelected.value?.id,
  ].filter((id) => id != null),
  validacionCompleta: validacionCompleta.value,
}))

// ⭐ Watch: emite cada vez que cambia la selección
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
  redactorSelected,
  coordinacionSelected,
  administrativoSelected,
})
</script>
