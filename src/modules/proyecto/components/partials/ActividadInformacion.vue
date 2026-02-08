<template>
  <v-card variant="outlined" elevation="1" class="activity-card">
    <v-card-title class="activity-header pa-3">
      <div class="d-flex align-center w-100">
        <v-icon
          icon="mdi-clipboard-text-outline"
          size="large"
          class="mr-2"
          color="deep-purple"
        ></v-icon>
        <div class="activity-title-container">
          <div class="d-flex align-center">
            <h3 class="text-h6 font-weight-bold activity-title mr-2">
              ACTIVIDAD: {{ actividad?.codigo || 'Sin codigo' }}
            </h3>
            <v-chip :color="estadoColor(actividad?.estado)" size="x-small" class="status-chip">
              {{ getEstadoTexto(actividad?.estado) || 'Sin estado' }}
            </v-chip>
          </div>
          <div class="text-caption text-medium-emphasis activity-subtitle">
            {{ actividad?.nombreCorto || 'Sin nombre' }}
          </div>
        </div>
      </div>
    </v-card-title>
    <v-card-text class="activity-content pa-3">
      <v-row dense>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-calendar-start" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Inicio:</strong>
              {{ formatDate(actividad?.fecha_inicio) || 'Sin fecha' }}</span
            >
          </div>
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-account" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Responsable:</strong> {{ getResponsableNombre() }}</span
            >
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-finance" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Presupuesto:</strong> Bs.
              {{ formatNumber(actividad?.presupuesto) || '0.00' }}</span
            >
          </div>
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-calendar-end" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Cierre:</strong>
              {{ formatDate(actividad?.fecha_cierre) || 'Sin fecha' }}</span
            >
          </div>
        </v-col>
      </v-row>
      <v-row v-if="actividad?.descripcion" dense>
        <v-col cols="12">
          <div class="d-flex align-start mb-1">
            <v-icon icon="mdi-text" class="mr-1 mt-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Descripción:</strong> {{ actividad?.descripcion }}</span
            >
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-chart-line" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Grado ejecución:</strong>
              {{ getGradoEjecucionTexto(actividad?.gradoEjecucion) || 'No especificado' }}</span
            >
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-cash" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Saldo:</strong> Bs. {{ formatNumber(actividad?.saldo) || '0.00' }}</span
            >
          </div>
        </v-col>
      </v-row>

      <!-- Detalles del responsable -->
      <v-row v-if="responsableDetalles" dense>
        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-account-details" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Usuario:</strong> {{ responsableDetalles.username || 'Sin usuario' }}</span
            >
          </div>
          <div v-if="responsableDetalles.email" class="d-flex align-center mb-1">
            <v-icon icon="mdi-email" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Email:</strong> {{ responsableDetalles.email }}</span
            >
          </div>
          <div v-if="responsableDetalles.cargo" class="d-flex align-center mb-1">
            <v-icon icon="mdi-briefcase" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Cargo:</strong> {{ responsableDetalles.cargo }}</span
            >
          </div>
          <div v-if="responsableDetalles.ci" class="d-flex align-center mb-1">
            <v-icon icon="mdi-card-account-details" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"><strong>CI:</strong> {{ responsableDetalles.ci }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue'
import { useActividad } from '../../composables/useActividad'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'

const props = defineProps({
  actividadId: {
    type: [Number, String],
    required: true,
  },
})

const { actividad, cargarActividadPorId } = useActividad()
const { listaDeUsuarioCompleta, obtenerListaUsuariosCompleta } = useUsuario()

// Cargar la actividad
onMounted(async () => {
  if (props.actividadId) {
    await Promise.all([cargarActividadPorId(props.actividadId), obtenerListaUsuariosCompleta()])
  }
})

watch(
  () => props.actividadId,
  (newId) => {
    if (newId) {
      cargarActividadPorId(newId)
    }
  },
)

// Computed para obtener los detalles del responsable
const responsableDetalles = computed(() => {
  if (!actividad.value?.responsable || !listaDeUsuarioCompleta.value) return null

  const responsableId = actividad.value.responsable

  // Si el responsable ya es un objeto completo
  if (typeof responsableId === 'object' && responsableId !== null) {
    return responsableId
  }

  // Si es solo un ID, buscar en la lista de usuarios
  const usuario = listaDeUsuarioCompleta.value.find((user) => user.id === responsableId)
  return usuario || null
})

// Función para obtener el nombre del responsable
function getResponsableNombre() {
  if (!responsableDetalles.value) return 'Sin responsable'

  const responsable = responsableDetalles.value

  // Construir nombre completo
  const nombreCompleto =
    `${responsable.nombre || ''} ${responsable.paterno || ''} ${responsable.materno || ''}`.trim()

  if (nombreCompleto) return nombreCompleto
  if (responsable.username) return responsable.username
  return 'Sin nombre'
}

// Funciones de utilidad
function estadoColor(estado) {
  switch (estado) {
    case 'PLAN':
    case 'PLANIFICADA':
      return 'blue-lighten-1'
    case 'EJEC':
    case 'En Ejecución':
      return 'green-darken-1'
    case 'COMP':
    case 'COMPLETADA':
      return 'success'
    case 'CANC':
    case 'CANCELADA':
      return 'error'
    case 'Cerrada':
      return 'grey'
    default:
      return 'orange'
  }
}

function getEstadoTexto(estado) {
  const estados = {
    PLAN: 'Planificada',
    PLANIFICADA: 'Planificada',
    EJEC: 'En Ejecución',
    COMP: 'Completada',
    CANC: 'Cancelada',
    Cerrada: 'Cerrada',
  }
  return estados[estado] || estado || '-'
}

function getGradoEjecucionTexto(grado) {
  const grados = {
    PLANIFICADA: 'Planificada',
    EN_EJECUCION: 'En Ejecución',
    COMPLETADA: 'Completada',
    CANCELADA: 'Cancelada',
  }
  return grados[grado] || grado || '-'
}

function formatDate(date) {
  if (!date) return 'Sin fecha'

  try {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('es-ES')
  } catch (error) {
    console.error(error)
    return date
  }
}

function formatNumber(num) {
  if (!num) return '0.00'

  try {
    const number = parseFloat(num)
    return number.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } catch (error) {
    console.error(error)
    return num
  }
}
</script>

<style scoped>
.activity-card {
  margin-bottom: 12px;
}

.activity-header {
  padding-bottom: 0;
  min-height: 56px;
}

.activity-title {
  line-height: 1.2;
  margin-bottom: 0;
}

.activity-subtitle {
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-chip {
  height: 20px;
}

.activity-content {
  padding-top: 0;
}

/* Estilos más compactos para Vuetify 3 */
:deep(.v-chip--size-x-small) {
  --v-chip-height: 20px;
  font-size: 0.625rem;
}

:deep(.v-icon--size-x-small) {
  font-size: 14px;
}
</style>
