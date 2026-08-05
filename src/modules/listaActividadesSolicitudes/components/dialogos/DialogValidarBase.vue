## `DialogValidarBase.vue` - Completo ```vue
<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="700"
  >
    <v-card>
      <v-toolbar :color="color" density="compact">
        <v-icon left size="20" class="mr-2">{{ icono }}</v-icon>
        <v-toolbar-title class="text-body-1">{{ titulo }}</v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pt-3" style="max-height: 500px; overflow-y: auto">
        <div v-if="loading" class="d-flex justify-center py-8">
          <v-progress-circular indeterminate :color="color" size="32" />
        </div>

        <template v-else>
          <div class="text-caption text-grey-darken-1 mb-2">
            {{ subtitulo }}
            <span class="ml-1">(Total: {{ totalItems }})</span>
          </div>

          <!-- Buscador -->
          <v-text-field
            v-if="items.length > 0 || searchQuery"
            v-model="searchQuery"
            label="Buscar por número de formulario"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
            hide-details
            class="mb-2"
            @input="currentPage = 1"
          />

          <!-- Filtro por estado -->
          <v-chip-group
            v-model="estadoFilter"
            multiple
            column
            class="mb-2"
            @update:model-value="currentPage = 1"
          >
            <v-chip
              v-for="e in estadosDisponibles"
              :key="e.value"
              :value="e.value"
              filter
              :color="e.color"
              variant="outlined"
              size="x-small"
            >
              {{ e.text }}
            </v-chip>
          </v-chip-group>

          <!-- Lista de items -->
          <v-list v-if="itemsPaginados.length > 0" class="py-0" density="compact">
            <v-list-item
              v-for="item in itemsPaginados"
              :key="item.id"
              :value="item.id"
              class="mb-1 border rounded"
              density="compact"
              @click="seleccionar(item)"
            >
              <slot name="item" :item="item" />
            </v-list-item>
          </v-list>

          <!-- Sin resultados -->
          <v-card
            v-if="!loading && items.length === 0"
            class="pa-6 text-center bg-grey-lighten-4"
            elevation="0"
          >
            <v-icon size="40" color="grey-lighten-1" class="mb-2">mdi-file-document-remove</v-icon>
            <div class="text-body-2 text-grey-darken-1">No hay solicitudes disponibles</div>
            <div class="text-caption text-grey mt-1">{{ mensajeVacio }}</div>
          </v-card>

          <!-- Sin resultados de búsqueda -->
          <v-card
            v-if="!loading && items.length > 0 && itemsPaginados.length === 0"
            class="pa-6 text-center bg-grey-lighten-4"
            elevation="0"
          >
            <v-icon size="40" color="grey-lighten-1" class="mb-2">mdi-magnify-close</v-icon>
            <div class="text-body-2 text-grey-darken-1">Sin resultados</div>
            <div class="text-caption text-grey mt-1">
              No se encontraron solicitudes para "{{ searchQuery }}"
            </div>
          </v-card>
        </template>
      </v-card-text>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="d-flex justify-center pa-1">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          density="compact"
          size="small"
        />
      </div>

      <v-card-actions class="pa-2">
        <v-spacer />
        <v-btn variant="text" size="small" @click="cerrar">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  titulo: { type: String, default: 'Validar Solicitud' },
  subtitulo: { type: String, default: 'Seleccione una solicitud para validar' },
  icono: { type: String, default: 'mdi-file-document-check' },
  color: { type: String, default: 'primary' },
  mensajeVacio: { type: String, default: 'No tienes solicitudes pendientes de validación' },
  actividadId: { type: Number, default: null },
  tareaId: { type: Number, default: null },
  rutaFormulario: { type: String, required: true },
  cargarDatos: { type: Function, required: true },
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const loading = ref(false)
const items = ref([])
const searchQuery = ref('')
const estadoFilter = ref([])
const currentPage = ref(1)
const pageSize = 10

const estadosDisponibles = [
  { value: 'Aprobado', text: 'Aprobado', color: 'success' },
  { value: 'Pendiente', text: 'Pendiente', color: 'warning' },
  { value: 'SinRevisores', text: 'Sin Revisores', color: 'orange' },
  { value: 'Rechazado', text: 'Rechazado', color: 'error' },
]

watch(
  () => props.modelValue,
  async (abierto) => {
    if (abierto) {
      searchQuery.value = ''
      estadoFilter.value = []
      currentPage.value = 1
      await cargar()
    }
  },
)

async function cargar() {
  loading.value = true
  try {
    const resultado = await props.cargarDatos(props.actividadId, props.tareaId)
    items.value = resultado.items || []
  } catch (error) {
    console.error('Error al cargar datos:', error)
    items.value = []
  } finally {
    loading.value = false
  }
}

const itemsFiltrados = computed(() => {
  if (!Array.isArray(items.value)) return []

  let resultado = [...items.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    resultado = resultado.filter((item) => item.numeroFormulario?.toLowerCase().includes(q))
  }

  if (estadoFilter.value.length > 0) {
    resultado = resultado.filter((item) => estadoFilter.value.includes(item.estado_validacion))
  }

  return resultado
})

const totalItems = computed(() => itemsFiltrados.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize))

const itemsPaginados = computed(() => {
  if (!Array.isArray(itemsFiltrados.value)) return []
  const inicio = (currentPage.value - 1) * pageSize
  return itemsFiltrados.value.slice(inicio, inicio + pageSize)
})

function seleccionar(item) {
  const query = { solicitud_id: item.id }
  if (props.tareaId) query.tarea_id = props.tareaId

  router.push({
    path: `${props.rutaFormulario}/${props.actividadId}`,
    query,
  })
}

function cerrar() {
  emit('update:modelValue', false)
}
</script>
```
