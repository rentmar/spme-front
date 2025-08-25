<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-chart-tree</v-icon>
            Estructura PEI
          </v-card-title>
          <v-card-text>
            <!-- Dropdowns para Objetivos e Indicadores PEI -->
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="objetivoSeleccionado"
                  :items="objetivosPei"
                  item-title="nombre"
                  item-value="id"
                  label="Objetivo PEI"
                  @update:modelValue="cargarIndicadores"
                  return-object
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="indicadorSeleccionado"
                  :items="indicadoresPeiFiltrados"
                  item-title="nombre"
                  item-value="id"
                  label="Indicador PEI"
                  :disabled="!objetivoSeleccionado"
                  return-object
                  clearable
                ></v-select>
              </v-col>
            </v-row>

            <!-- Tarjetas informativas -->
            <v-row v-if="objetivoSeleccionado || objetivoActual">
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1 bg-blue-lighten-5">
                    Objetivo PEI {{ objetivoSeleccionado ? 'Seleccionado' : 'Actual' }}
                  </v-card-title>
                  <v-card-text v-if="objetivoSeleccionado">
                    <p><strong>Código:</strong> {{ objetivoSeleccionado.codigo }}</p>
                    <p><strong>Nombre:</strong> {{ objetivoSeleccionado.nombre }}</p>
                    <p><strong>Descripción:</strong> {{ objetivoSeleccionado.descripcion }}</p>
                  </v-card-text>
                  <v-card-text v-else-if="objetivoActual">
                    <p><strong>Código:</strong> {{ objetivoActual.codigo }}</p>
                    <p><strong>Nombre:</strong> {{ objetivoActual.nombre }}</p>
                    <p><strong>Descripción:</strong> {{ objetivoActual.descripcion }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row v-if="indicadorSeleccionado || indicadorActual">
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1 bg-green-lighten-5">
                    Indicador PEI {{ indicadorSeleccionado ? 'Seleccionado' : 'Actual' }}
                  </v-card-title>
                  <v-card-text v-if="indicadorSeleccionado">
                    <p><strong>Código:</strong> {{ indicadorSeleccionado.codigo }}</p>
                    <p><strong>Nombre:</strong> {{ indicadorSeleccionado.nombre }}</p>
                    <p><strong>Descripción:</strong> {{ indicadorSeleccionado.descripcion }}</p>
                    <p><strong>Meta:</strong> {{ indicadorSeleccionado.meta }}</p>
                  </v-card-text>
                  <v-card-text v-else-if="indicadorActual">
                    <p><strong>Código:</strong> {{ indicadorActual.codigo }}</p>
                    <p><strong>Nombre:</strong> {{ indicadorActual.nombre }}</p>
                    <p><strong>Descripción:</strong> {{ indicadorActual.descripcion }}</p>
                    <p><strong>Meta:</strong> {{ indicadorActual.meta }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="cerrarModal">Cancelar</v-btn>
            <v-btn
              color="primary"
              variant="flat"
              @click="guardarSeleccion"
              :disabled="!indicadorSeleccionado && !props.indicadorInicial"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  {{ peiVigente }}
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'

// Props para recibir IDs iniciales (números)
const props = defineProps({
  objetivoInicial: {
    type: Number,
    default: null,
  },
  indicadorInicial: {
    type: Number,
    default: null,
  },
})

//El PEI vigente
const peiVigente = inject('peiVigente')

// Emits para comunicación con el componente padre
const emit = defineEmits(['guardar', 'cerrar'])

// Datos de ejemplo - en una aplicación real estos vendrían de una API
const objetivosPei = ref([
  {
    id: 1,
    codigo: 'OBJ-PEI-001',
    nombre: 'Mejorar la calidad educativa',
    descripcion: 'Incrementar los indicadores de calidad en el sistema educativo',
  },
  {
    id: 2,
    codigo: 'OBJ-PEI-002',
    nombre: 'Fortalecer la investigación',
    descripcion: 'Promover proyectos de investigación científica y tecnológica',
  },
  {
    id: 3,
    codigo: 'OBJ-PEI-003',
    nombre: 'Optimizar la gestión administrativa',
    descripcion: 'Modernizar los procesos administrativos de la institución',
  },
])

const indicadoresPei = ref([
  {
    id: 1,
    objetivo_id: 1,
    codigo: 'IND-PEI-001',
    nombre: 'Tasa de retención estudiantil',
    descripcion: 'Porcentaje de estudiantes que permanecen en el sistema',
    meta: '95%',
  },
  {
    id: 2,
    objetivo_id: 1,
    codigo: 'IND-PEI-002',
    nombre: 'Resultados pruebas estandarizadas',
    descripcion: 'Puntajes en pruebas nacionales e internacionales',
    meta: 'Mejora del 10%',
  },
  {
    id: 3,
    objetivo_id: 2,
    codigo: 'IND-PEI-003',
    nombre: 'Proyectos de investigación',
    descripcion: 'Número de proyectos de investigación registrados',
    meta: '50 proyectos',
  },
  {
    id: 4,
    objetivo_id: 2,
    codigo: 'IND-PEI-004',
    nombre: 'Publicaciones indexadas',
    descripcion: 'Cantidad de publicaciones en revistas indexadas',
    meta: '100 publicaciones',
  },
  {
    id: 5,
    objetivo_id: 3,
    codigo: 'IND-PEI-005',
    nombre: 'Tiempo de respuesta',
    descripcion: 'Tiempo promedio de respuesta a solicitudes',
    meta: 'Reducir en 30%',
  },
  {
    id: 6,
    objetivo_id: 3,
    codigo: 'IND-PEI-006',
    nombre: 'Satisfacción usuaria',
    descripcion: 'Nivel de satisfacción de usuarios con servicios',
    meta: '90% de satisfacción',
  },
])

// Variables reactivas
const objetivoSeleccionado = ref(null)
const indicadorSeleccionado = ref(null)

// Objetivo e indicador actual basados en los IDs proporcionados
const objetivoActual = computed(() => {
  if (!props.objetivoInicial) return null
  return objetivosPei.value.find((obj) => obj.id === props.objetivoInicial)
})

const indicadorActual = computed(() => {
  if (!props.indicadorInicial) return null
  return indicadoresPei.value.find((ind) => ind.id === props.indicadorInicial)
})

// Indicadores filtrados por objetivo seleccionado
const indicadoresPeiFiltrados = computed(() => {
  if (!objetivoSeleccionado.value) return []
  return indicadoresPei.value.filter((ind) => ind.objetivo_id === objetivoSeleccionado.value.id)
})

// Cargar datos iniciales cuando el componente se monta
onMounted(() => {
  // Si hay un objetivo inicial, seleccionarlo
  if (props.objetivoInicial) {
    objetivoSeleccionado.value = objetivosPei.value.find((obj) => obj.id === props.objetivoInicial)

    // Si hay un indicador inicial, seleccionarlo (solo si pertenece al objetivo seleccionado)
    if (props.indicadorInicial && objetivoSeleccionado.value) {
      const indicador = indicadoresPei.value.find(
        (ind) =>
          ind.id === props.indicadorInicial && ind.objetivo_id === objetivoSeleccionado.value.id,
      )

      if (indicador) {
        indicadorSeleccionado.value = indicador
      }
    }
  }
})

// Cargar indicadores cuando se selecciona un objetivo
const cargarIndicadores = () => {
  indicadorSeleccionado.value = null
}

// Guardar la selección y actualizar la tabla
const guardarSeleccion = () => {
  // Determinar qué valores guardar (nueva selección o valores existentes)
  const objetivoId = objetivoSeleccionado.value
    ? objetivoSeleccionado.value.id
    : props.objetivoInicial
  const indicadorId = indicadorSeleccionado.value
    ? indicadorSeleccionado.value.id
    : props.indicadorInicial

  // Solo emitir si tenemos ambos valores
  if (objetivoId && indicadorId) {
    emit('guardar', {
      objetivo_pei: objetivoId,
      indicador_pei: indicadorId,
    })
  } else if (!objetivoId && !indicadorId) {
    // Si ambos son nulos, emitir valores nulos
    emit('guardar', {
      objetivo_pei: null,
      indicador_pei: null,
    })
  }
}

// Cerrar el modal
const cerrarModal = () => {
  emit('cerrar')
}
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}

.v-card-title {
  padding: 16px;
}

.v-card-text {
  padding: 16px;
}
</style>
