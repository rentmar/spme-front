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
              ACTIVIDAD PEI: {{ actividadPei?.codigo || 'Sin codigo' }}
            </h3>
            <v-chip :color="estadoColor(actividadPei?.estado)" size="x-small" class="status-chip">
              {{ actividadPei?.estado || 'Sin estado' }}
            </v-chip>
          </div>
          <div class="text-caption text-medium-emphasis activity-subtitle">
            {{ actividadPei?.nombreCorto || 'Sin nombre' }}
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
              {{ formatDate(actividadPei?.fecha_inicio) || 'Sin fecha' }}</span
            >
          </div>
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-account" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Responsable:</strong> {{ responsableNombre || 'Sin responsable' }}</span
            >
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-finance" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Presupuesto:</strong> Bs. {{ actividadPei?.presupuesto || '0.00' }}</span
            >
          </div>
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-calendar-end" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Cierre:</strong>
              {{ formatDate(actividadPei?.fecha_cierre) || 'Sin fecha' }}</span
            >
          </div>
        </v-col>
      </v-row>
      <v-row v-if="actividadPei?.descripcion" dense>
        <v-col cols="12">
          <div class="d-flex align-start mb-1">
            <v-icon icon="mdi-text" class="mr-1 mt-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Descripción:</strong> {{ actividadPei?.descripcion }}</span
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
              {{ actividadPei?.gradoEjecucion || 'No especificado' }}</span
            >
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-cash" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Saldo:</strong> Bs. {{ actividadPei?.saldo || '0.00' }}</span
            >
          </div>
        </v-col>
      </v-row>
      <!-- Mostrar más detalles del responsable si está disponible -->
      <v-row v-if="responsableDetalles" dense>
        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-account-details" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Usuario:</strong> {{ responsableDetalles.username }}</span
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
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
  actividadId: {
    type: [Number, String],
    required: true,
  },
})

// Iniciar el composable
const { cargarActividadPeiPorId, actividadPei } = useActividad()
const { listaDeUsuarioCompleta, obtenerListaUsuariosCompleta } = useUsuario()

/************************* Carga de datos *******************************/
const loading = ref(false)
const error = ref(null)

const cargarDatos = async () => {
  loading.value = true
  try {
    // Usar el ID de las props en lugar de un valor fijo
    await Promise.all([cargarActividadPeiPorId(props.actividadId), obtenerListaUsuariosCompleta()])
  } catch (err) {
    console.error('Error al cargar', err)
    error.value = err
    throw err
  } finally {
    loading.value = false
  }
}

// Computed para obtener el nombre del responsable
const responsableNombre = computed(() => {
  if (!actividadPei.value?.responsable || !listaDeUsuarioCompleta.value) return 'Sin responsable'

  const responsableId = actividadPei.value.responsable
  const usuario = listaDeUsuarioCompleta.value.find((user) => user.id === responsableId)

  if (usuario) {
    return `${usuario.nombre} ${usuario.paterno} ${usuario.materno}`.trim()
  }

  return `ID: ${responsableId}`
})

// Computed para obtener todos los detalles del responsable
const responsableDetalles = computed(() => {
  if (!actividadPei.value?.responsable || !listaDeUsuarioCompleta.value) return null

  const responsableId = actividadPei.value.responsable
  const usuario = listaDeUsuarioCompleta.value.find((user) => user.id === responsableId)

  return usuario || null
})

// Helper function para formatear fechas
const formatDate = (date) => {
  if (!date) return 'Sin fecha'
  try {
    return new Date(date).toLocaleDateString('es-ES')
  } catch {
    return 'Fecha inválida'
  }
}

// Helper function para colores de estado
function estadoColor(estado) {
  switch (estado) {
    case 'PLAN':
      return 'blue-lighten-1'
    case 'EN_EJECUCION':
      return 'green-darken-1'
    case 'CERRADA':
      return 'grey'
    case 'SUSPENDIDA':
      return 'orange'
    default:
      return 'orange'
  }
}

// hook
onMounted(async () => {
  await cargarDatos()
})
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
