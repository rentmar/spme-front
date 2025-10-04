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
              {{ actividad.codigo }}
            </h3>
            <v-chip :color="estadoColor(actividad.estado)" size="x-small" class="status-chip">
              {{ actividad.estado }}
            </v-chip>
          </div>
          <div class="text-caption text-medium-emphasis activity-subtitle">
            {{ actividad.descripcion }}
          </div>
        </div>
        <v-spacer></v-spacer>
        <div class="d-flex">
          <v-chip class="ml-1" color="indigo-lighten-4" density="compact" size="x-small">
            <v-icon start icon="mdi-school" size="x-small"></v-icon>
            {{ actividad.tipo }}
          </v-chip>
        </div>
      </div>
    </v-card-title>

    <v-card-text class="activity-content pa-3">
      <v-row dense>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-calendar" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Programada:</strong> {{ actividad.fecha_programada }}</span
            >
          </div>
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-account" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Responsable:</strong> {{ actividad.responsable }}</span
            >
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-finance" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Presupuesto:</strong> ${{ actividad.presupuesto }}</span
            >
          </div>
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-calendar-end" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"><strong>Cierre:</strong> {{ actividad.fecha_cierre }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

//BaseURL
const baseurl = import.meta.env.VITE_API_BASE
//console.log('baseurl:', baseurl)

const props = defineProps({
  actividadId: {
    type: [Number, String],
    required: true,
  },
})

//console.log('Actividad ID desde props:', props.actividadId)

// 1. Define una variable reactiva para guardar los datos de la actividad
const actividad = ref({})

// 2. Función para determinar el color del chip según el estado
function estadoColor(estado) {
  switch (estado) {
    case 'Planificada':
      return 'blue-lighten-1'
    case 'En Ejecución':
      return 'green-darken-1'
    case 'Cerrada':
      return 'grey'
    default:
      return 'orange'
  }
}

// 3. Función asíncrona para hacer la llamada a la API
async function obtenerDatosActividad() {
  const url = baseurl + '/actividades_api/obtenerEncabezadoActividadId/'
  const data = {
    actividad_id: props.actividadId,
  }
  try {
    const response = await axios.post(url, data)
    //console.log('response', response.data)
    // 4. Actualiza la variable reactiva con los datos de la respuesta
    actividad.value = response.data
  } catch (error) {
    console.error('Error al obtener los datos de la actividad:', error)
  }
}

// 5. Usa onMounted para llamar a la función cuando el componente se renderiza
onMounted(() => {
  if (props.actividadId) {
    obtenerDatosActividad()
  }
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
