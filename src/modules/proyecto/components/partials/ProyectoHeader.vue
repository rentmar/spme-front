<template>
  <v-card variant="outlined" elevation="1" class="project-card" @click="emit('click')">
    <v-card-title class="project-header">
      <div class="d-flex align-center w-100">
        <v-icon :icon="'mdi-notebook'" size="x-large" class="mr-3" :color="'primary'"></v-icon>
        <div class="project-title-container">
          <h2 class="text-h5 font-weight-bold project-title text-wrap">
            {{ proyecto.titulo }}
          </h2>
          <div class="text-subtitle-1 text-medium-emphasis project-subtitle">
            CODIGO: {{ proyecto.codigo }}
          </div>
          <div
            v-if="pei && pei.titulo"
            class="text-caption text-medium-emphasis mt-1 font-italic"
            style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
          >
            PEI: {{ pei.titulo }}
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-chip
          :prepend-icon="'mdi-progress-check'"
          :color="getStatusColor(proyecto.estado)"
          size="small"
          class="status-chip"
        >
          {{ getEstadoTexto(proyecto.estado) }}
        </v-chip>
      </div>

      <!-- Chips de instancias gestoras -->
      <div v-if="instanciasProyecto.length" class="mt-2 d-flex flex-wrap">
        <v-chip
          v-for="instancia in instanciasProyecto"
          :key="instancia.id"
          class="ma-1"
          :color="getChipColor(instancia.codigo)"
          label
          size="small"
        >
          <v-icon start :icon="getInstanciaIcon(instancia.codigo)" size="small"></v-icon>
          {{ instancia.text }}
          <v-tooltip activator="parent" location="top">
            Código: {{ instancia.codigo }} | Clasificador: {{ instancia.clasificador || 'N/A' }}
          </v-tooltip>
        </v-chip>
      </div>
    </v-card-title>

    <v-card-text class="project-content">
      <v-row>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-calendar" class="mr-2" size="small"></v-icon>
            <span><strong>Fecha inicio:</strong> {{ formatDate(proyecto.fecha_inicio) }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-calendar-end" class="mr-2" size="small"></v-icon>
            <span><strong>Fecha fin:</strong> {{ formatDate(proyecto.fecha_finalizacion) }}</span>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-account" class="mr-2" size="small"></v-icon>
            <span><strong>Responsable:</strong> {{ proyecto.creado_por }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-finance" class="mr-2" size="small"></v-icon>
            <span><strong>Presupuesto:</strong> {{ proyecto.presupuesto }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="project-actions">
      <v-btn
        v-if="activarDetalles"
        variant="text"
        color="primary"
        prepend-icon="mdi-eye"
        @click.stop="emit('view')"
      >
        Ver detalles
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        v-if="activarEditar"
        variant="tonal"
        color="secondary"
        prepend-icon="mdi-pencil"
        @click.stop="emit('edit')"
      >
        Editar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import {
  getStatusColor,
  getEstadoTexto,
  formatDate,
  getChipColor,
  getInstanciaIcon,
} from '@/utility/formatters'
import { useInstanciaGestora } from '@/modules/instanciaGestora/composables/useInstanciaGestora'
import { usePeiCrud } from '@/modules/pei/composables/usePeiCrud'
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  proyecto: { type: Object, required: true },
  activarDetalles: { type: Boolean, default: false },
  activarEditar: { type: Boolean, default: false },
})

const emit = defineEmits(['click', 'view', 'edit'])

const { instanciasParaChips, getInstanciasByIds, cargarInstancias } = useInstanciaGestora()
const { obtenerPeiPorId } = usePeiCrud()

const pei = ref(null)

onMounted(async () => {
  if (props.proyecto?.pei) {
    try {
      pei.value = await obtenerPeiPorId(props.proyecto.pei)
    } catch (e) {
      console.warn('No se pudo cargar el PEI:', e)
    }
  }

  if (instanciasParaChips.value.length === 0) {
    await cargarInstancias()
  }
})

const instanciasProyecto = computed(() => {
  return getInstanciasByIds(props.proyecto.instancia_gestora)
})
</script>
