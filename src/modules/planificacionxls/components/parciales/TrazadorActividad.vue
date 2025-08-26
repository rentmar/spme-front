<template>
  <div v-if="tablaDataDisponible">
    <v-card>
      <v-card-title class="bg-blue-darken-2 text-white">
        <v-icon icon="mdi-map-marker-path" class="mr-2"></v-icon>
        Ruta de Actividad al Proyecto
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="white"
          size="24"
          class="ml-4"
        ></v-progress-circular>
      </v-card-title>

      <v-card-text class="pa-4">
        <div v-if="error" class="text-error text-center py-4">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          {{ error }}
        </div>

        <div v-else-if="!loading && rutaCompleta.length === 0" class="text-center py-4">
          No se encontraron datos para la actividad #{{ actividadId }}
        </div>

        <template v-else>
          <!-- Timeline horizontal -->
          <v-timeline
            direction="horizontal"
            align="start"
            line-inset="12"
            truncate-line="start"
            class="py-4"
          >
            <v-timeline-item
              v-for="(item, index) in rutaCompleta"
              :key="`${item.tipo}-${item.id}`"
              :dot-color="obtenerColor(item.tipo)"
              :icon="obtenerIcono(item.tipo)"
              size="small"
              fill-dot
            >
              <div class="text-caption text-center">
                {{ formatearTipo(item.tipo) }}
              </div>
            </v-timeline-item>
          </v-timeline>

          <!-- Cards debajo de la timeline - Diseño horizontal -->
          <div class="cards-horizontal-container mt-4">
            <v-card
              v-for="(item, index) in rutaCompleta"
              :key="`card-${item.tipo}-${item.id}`"
              :class="{
                'actividad-actual': item.tipo === 'Actividad',
                'proyecto-final': item.tipo === 'Proyecto',
                'horizontal-card': true,
              }"
              class="pa-2 ma-1"
              elevation="2"
            >
              <v-card-title
                class="text-body-1 font-weight-bold pa-2 d-flex flex-column align-start"
              >
                <div class="d-flex align-center mb-1">
                  <span class="card-title-text">{{ item.nombre || 'Sin nombre' }}</span>
                </div>
                <v-chip
                  small
                  :color="obtenerColor(item.tipo)"
                  text-color="white"
                  class="flex-shrink-0"
                >
                  {{ formatearTipo(item.tipo) }}
                </v-chip>
              </v-card-title>

              <v-divider></v-divider>

              <v-card-text class="pa-2">
                <div v-if="item.codigo" class="text-caption mb-2 d-flex align-start">
                  <v-icon small class="mr-1 mt-1">mdi-identifier</v-icon>
                  <div>
                    <strong>Código:</strong><br />
                    <span class="ml-1">{{ item.codigo }}</span>
                  </div>
                </div>

                <div class="text-caption mb-2 d-flex align-start">
                  <v-icon small class="mr-1 mt-1">mdi-key-variant</v-icon>
                  <div>
                    <strong>ID:</strong><br />
                    <span class="ml-1">{{ item.id }}</span>
                  </div>
                </div>

                <div v-if="item.estado" class="text-caption mb-2 d-flex align-start">
                  <v-icon small class="mr-1 mt-1">mdi-state-machine</v-icon>
                  <div>
                    <strong>Estado:</strong><br />
                    <span class="ml-1">{{ item.estado }}</span>
                  </div>
                </div>

                <div v-if="item.descripcion" class="text-caption d-flex align-start">
                  <v-icon small class="mr-1 mt-1">mdi-text</v-icon>
                  <div>
                    <strong>Descripción:</strong><br />
                    <span class="ml-1">{{ item.descripcion }}</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="d-flex justify-center flex-wrap">
            <v-chip color="green" text-color="white" class="ma-1">
              <v-icon start icon="mdi-check-circle"></v-icon>
              Actividad ID: {{ actividad.id }}
            </v-chip>

            <v-chip color="blue" text-color="white" class="ma-1">
              <v-icon start icon="mdi-finish-flag"></v-icon>
              Proyecto: {{ proyectoFinal.nombre }}
            </v-chip>

            <v-chip
              :color="obtenerColorEstado(proyectoFinal.estado)"
              text-color="white"
              class="ma-1"
            >
              <v-icon start :icon="obtenerIconoEstado(proyectoFinal.estado)"></v-icon>
              Estado: {{ proyectoFinal.estado || 'N/A' }}
            </v-chip>
          </div>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps } from 'vue'

// Props - recibe el ID de la actividad y el estado de disponibilidad de la tabla
const props = defineProps({
  actividadId: {
    type: Number,
    required: true,
    default: null,
  },
  tablaDataDisponible: {
    type: Boolean,
    default: false,
  },
})

// Estado reactivo
const actividad = ref({})
const rutaCompleta = ref([])
const proyectoFinal = ref({})
const loading = ref(false)
const error = ref(null)

// Función para obtener datos (simula una API call)
const obtenerDatosActividad = async (id) => {
  // Solo obtener datos si la tabla está disponible
  if (!props.tablaDataDisponible) {
    console.log('Tabla no disponible, no se pueden obtener datos')
    return
  }

  loading.value = true
  error.value = null

  try {
    // Simular delay de net
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Buscar en datos dummy
    if (datosDummy[id]) {
      actividad.value = datosDummy[id].actividad
      rutaCompleta.value = datosDummy[id].ruta_completa
      proyectoFinal.value = datosDummy[id].proyecto_final
    } else {
      throw new Error(`No se encontraron datos para la actividad #${id}`)
    }
  } catch (err) {
    error.value = err.message
    actividad.value = {}
    rutaCompleta.value = []
    proyectoFinal.value = {}
  } finally {
    loading.value = false
  }
}

// Función para obtener el icono según el tipo
const obtenerIcono = (tipo) => {
  return iconos[tipo] || 'mdi-help-circle-outline'
}

// Función para obtener el color según el tipo
const obtenerColor = (tipo) => {
  return colores[tipo] || 'grey'
}

// Función para obtener el color según el estado del proyecto
const obtenerColorEstado = (estado) => {
  return coloresEstado[estado] || 'grey'
}

// Función para obtener el icono según el estado del proyecto
const obtenerIconoEstado = (estado) => {
  return iconosEstado[estado] || 'mdi-help-circle'
}

// Función para formatear el nombre del tipo
const formatearTipo = (tipo) => {
  return nombresTipos[tipo] || tipo
}

// Watcher para cambios en el ID de actividad
watch(
  () => props.actividadId,
  (newId) => {
    if (newId && props.tablaDataDisponible) {
      obtenerDatosActividad(newId)
    }
  },
)

// Watcher para cambios en la disponibilidad de la tabla
watch(
  () => props.tablaDataDisponible,
  (newVal) => {
    if (newVal && props.actividadId) {
      obtenerDatosActividad(props.actividadId)
    }
  },
)

// Cargar datos cuando el componente se monta
onMounted(() => {
  if (props.actividadId && props.tablaDataDisponible) {
    obtenerDatosActividad(props.actividadId)
  }
})

// ========== DATOS AL FINAL DEL ARCHIVO ==========

// Datos dummy para simular la API
const datosDummy = {
  82: {
    actividad: {
      id: 82,
      codigo: 'ACT',
      nombreCorto: 'Implementación del sistema',
      descripcion:
        'Actividad de implementación del sistema principal que incluye la configuración de servidores, instalación de software y pruebas de funcionamiento',
    },
    ruta_completa: [
      {
        tipo: 'Actividad',
        id: 82,
        codigo: 'ACT',
        nombre: 'Actividad de implementación del sistema de gestión documental',
        descripcion: 'Implementación completa del sistema con todos los módulos necesarios',
      },
      {
        tipo: 'Proceso',
        id: 12,
        codigo: 'PROC',
        nombre: 'Procesos Res OG para la digitalización de documentos',
        descripcion:
          'Proceso de transformación digital de documentos físicos a formatos electrónicos',
      },
      {
        tipo: 'ResultadoOG',
        id: 13,
        codigo: 'R0',
        nombre:
          'Descripción del resultado de objetivo general del proyecto de transformación digital',
        descripcion: 'Resultado que mide el impacto del proyecto en la eficiencia organizacional',
      },
      {
        tipo: 'ObjetivoGeneral',
        id: 7,
        codigo: 'OO',
        nombre: 'Objetivo general del proyecto de modernización tecnológica',
        descripcion:
          'Modernizar la infraestructura tecnológica para mejorar la eficiencia operativa',
      },
      {
        tipo: 'Proyecto',
        id: 7,
        codigo: 'DEDEED',
        nombre: 'Proyecto de Desarrollo Sostenible y Transformación Digital',
        estado: 'EP',
        descripcion:
          'Proyecto integral que combina desarrollo sostenible con transformación digital para mejorar los procesos organizacionales',
      },
    ],
    proyecto_final: {
      tipo: 'Proyecto',
      id: 7,
      codigo: 'DEDEED',
      nombre: 'Proyecto de Desarrollo Sostenible y Transformación Digital',
      estado: 'EP',
    },
  },
}

// Mapeo de iconos por tipo
const iconos = {
  Actividad: 'mdi-checkbox-marked-circle-outline',
  Proceso: 'mdi-cog-outline',
  ProductoOE: 'mdi-package-variant',
  ResultadoOG: 'mdi-chart-bell-curve',
  ObjetivoEspecifico: 'mdi-target',
  ObjetivoGeneral: 'mdi-bullseye-arrow',
  Proyecto: 'mdi-clipboard-text-outline',
}

// Mapeo de colores por tipo
const colores = {
  Actividad: 'blue',
  Proceso: 'purple',
  ProductoOE: 'indigo',
  ResultadoOG: 'orange',
  ObjetivoEspecifico: 'teal',
  ObjetivoGeneral: 'cyan',
  Proyecto: 'green',
}

// Mapeo de colores por estado
const coloresEstado = {
  EP: 'blue', // En progreso
  CO: 'green', // Completado
  CA: 'red', // Cancelado
  PA: 'orange', // Pausado
}

// Mapeo de iconos por estado
const iconosEstado = {
  EP: 'mdi-progress-clock', // En progreso
  CO: 'mdi-check-circle', // Completado
  CA: 'mdi-cancel', // Cancelado
  PA: 'mdi-pause-circle', // Pausado
}

// Mapeo de nombres de tipos
const nombresTipos = {
  Actividad: 'Actividad',
  Proceso: 'Proceso',
  ProductoOE: 'Producto OE',
  ResultadoOG: 'Resultado OG',
  ObjetivoEspecifico: 'Objetivo Específico',
  ObjetivoGeneral: 'Objetivo General',
  Proyecto: 'Proyecto',
}
</script>

<style scoped>
.actividad-actual {
  border-left: 4px solid rgb(25, 118, 210);
}
.proyecto-final {
  border-left: 4px solid rgb(56, 142, 60);
}
.v-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}
.text-error {
  color: #f44336;
}

/* Contenedor horizontal para las cards */
.cards-horizontal-container {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding-bottom: 8px;
}

/* Cards individuales en diseño horizontal */
.horizontal-card {
  min-width: 320px;
  max-width: 320px;
  flex-shrink: 0;
}

/* Asegura que todo el texto se muestre completamente con saltos de línea */
.horizontal-card .v-card-title,
.horizontal-card .v-card-text {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  word-break: break-word;
}

.horizontal-card .v-card-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-title-text {
  word-break: break-word;
  line-height: 1.3;
}

/* Personalización del scroll horizontal */
.cards-horizontal-container::-webkit-scrollbar {
  height: 8px;
}

.cards-horizontal-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.cards-horizontal-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.cards-horizontal-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Mejora la visualización de los elementos con iconos */
.d-flex.align-start {
  align-items: flex-start;
}

.d-flex.align-start .v-icon {
  flex-shrink: 0;
}
</style>
