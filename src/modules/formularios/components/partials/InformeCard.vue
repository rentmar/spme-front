<template>
  <v-card elevation="1" rounded="lg" variant="outlined" class="tarea-informe-card">
    <v-card-item>
      <div class="d-flex justify-space-between align-start">
        <div>
          <div class="text-body-1 font-weight-bold">
            {{ informe.numeroInforme || 'Sin número' }}
          </div>
          <div class="text-caption text-medium-emphasis">
            <v-icon icon="mdi-calendar" size="x-small" class="mr-1"></v-icon>
            {{ formatDate(informe.fechaEjecucion) }}
          </div>
        </div>
        <v-chip
          v-if="informe.tipoActividad"
          size="x-small"
          :color="tipo === 'tarea' ? 'info' : 'primary'"
        >
          {{ truncarTexto(informe.tipoActividad, 20) }}
        </v-chip>
      </div>
    </v-card-item>

    <v-card-text>
      <div class="d-flex justify-space-between align-center">
        <div>
          <div class="text-caption text-medium-emphasis">Planificado</div>
          <div class="text-body-2 font-weight-bold text-primary">
            Bs{{ formatNumber(informe.presupuestoPlanificado || 0) }}
          </div>
        </div>
        <div>
          <div class="text-caption text-medium-emphasis">Ejecutado</div>
          <div class="text-body-2 font-weight-bold" :class="getEjecutadoColor(informe)">
            Bs{{ formatNumber(informe.presupuestoEjecutado || 0) }}
          </div>
        </div>
        <div>
          <div class="text-caption text-medium-emphasis">Avance</div>
          <div class="text-body-2 font-weight-bold" :class="getAvanceColor(informe)">
            {{ getAvancePorcentaje(informe) }}%
          </div>
        </div>
      </div>

      <div class="mt-2">
        <div class="text-caption text-medium-emphasis">
          <v-icon icon="mdi-bullseye-arrow" size="x-small" class="mr-1"></v-icon>
          Objetivo:
        </div>
        <div class="text-body-2">
          {{
            truncarTexto(informe.objetivoTarea || informe.objetivoActividad, 80) || 'Sin objetivo'
          }}
        </div>
      </div>

      <!-- Indicadores de estado -->
      <div class="mt-2 d-flex flex-wrap gap-1">
        <v-chip
          v-if="informe.avanceIndicadores?.metadatos?.total_general"
          size="x-small"
          color="success"
          variant="tonal"
        >
          <v-icon start icon="mdi-chart-line" size="x-small"></v-icon>
          {{ informe.avanceIndicadores.metadatos.total_general }} indicadores
        </v-chip>
        <v-chip v-if="informe.desglosePresupuesto" size="x-small" color="info" variant="tonal">
          <v-icon start icon="mdi-cash" size="x-small"></v-icon>
          Desglose
        </v-chip>
        <v-chip
          v-if="informe.informacionCuantitativa?.totalParticipantes"
          size="x-small"
          color="purple"
          variant="tonal"
        >
          <v-icon start icon="mdi-account-group" size="x-small"></v-icon>
          {{ informe.informacionCuantitativa.totalParticipantes }} part.
        </v-chip>
        <v-chip
          v-if="informe.herramientasEvaluacion?.herramientas"
          size="x-small"
          color="orange"
          variant="tonal"
        >
          <v-icon start icon="mdi-tools" size="x-small"></v-icon>
          {{ informe.herramientasEvaluacion.herramientas }} herramientas
        </v-chip>
        <v-chip v-if="tareaCodigo" size="x-small" color="grey" variant="tonal">
          <v-icon start icon="mdi-folder" size="x-small"></v-icon>
          {{ tareaCodigo }}
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions class="pa-3">
      <v-spacer></v-spacer>
      <v-btn
        size="x-small"
        variant="text"
        color="primary"
        prepend-icon="mdi-eye"
        @click="$emit('ver', informe.id)"
      >
        Ver
      </v-btn>
      <v-btn
        size="x-small"
        variant="text"
        color="secondary"
        prepend-icon="mdi-pencil"
        @click="$emit('editar', informe.id)"
      >
        Editar
      </v-btn>
      <v-btn
        size="x-small"
        variant="text"
        color="success"
        prepend-icon="mdi-file-pdf-box"
        @click="$emit('pdf', informe)"
      >
        PDF
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  informe: {
    type: Object,
    required: true,
  },
  tipo: {
    type: String,
    default: 'actividad',
  },
  tareaCodigo: {
    type: String,
    default: null,
  },
})

defineEmits(['ver', 'editar', 'pdf'])

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatNumber = (num) => {
  const number = parseFloat(num) || 0
  return number.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const truncarTexto = (texto, longitud) => {
  if (!texto) return ''
  return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto
}

const getAvancePorcentaje = (informe) => {
  const ejecutado = parseFloat(informe.presupuestoEjecutado) || 0
  const planificado = parseFloat(informe.presupuestoPlanificado) || 1
  return Math.min(100, Math.round((ejecutado / planificado) * 100))
}

const getEjecutadoColor = (informe) => {
  const porcentaje = getAvancePorcentaje(informe)
  if (porcentaje >= 100) return 'text-success'
  if (porcentaje >= 80) return 'text-info'
  if (porcentaje >= 50) return 'text-warning'
  return 'text-error'
}

const getAvanceColor = (informe) => {
  const porcentaje = getAvancePorcentaje(informe)
  if (porcentaje >= 100) return 'text-success'
  if (porcentaje >= 80) return 'text-info'
  if (porcentaje >= 50) return 'text-warning'
  return 'text-error'
}
</script>
