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
            <v-row v-if="objetivoSeleccionado || indicadorSeleccionado">
              <v-col cols="12" md="6" v-if="objetivoSeleccionado">
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1 bg-blue-lighten-5">
                    Objetivo PEI Seleccionado
                  </v-card-title>
                  <v-card-text>
                    <p><strong>Código:</strong> {{ objetivoSeleccionado.codigo }}</p>
                    <p><strong>Nombre:</strong> {{ objetivoSeleccionado.nombre }}</p>
                    <p><strong>Descripción:</strong> {{ objetivoSeleccionado.descripcion }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6" v-if="indicadorSeleccionado">
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1 bg-green-lighten-5">
                    Indicador PEI Seleccionado
                  </v-card-title>
                  <v-card-text>
                    <p><strong>Código:</strong> {{ indicadorSeleccionado.codigo }}</p>
                    <p><strong>Nombre:</strong> {{ indicadorSeleccionado.nombre }}</p>
                    <p><strong>Descripción:</strong> {{ indicadorSeleccionado.descripcion }}</p>
                    <p><strong>Meta:</strong> {{ indicadorSeleccionado.meta }}</p>
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
              :disabled="!indicadorSeleccionado"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

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

// Indicadores filtrados por objetivo seleccionado
const indicadoresPeiFiltrados = computed(() => {
  if (!objetivoSeleccionado.value) return []
  return indicadoresPei.value.filter((ind) => ind.objetivo_id === objetivoSeleccionado.value.id)
})

// Cargar indicadores cuando se selecciona un objetivo
const cargarIndicadores = () => {
  indicadorSeleccionado.value = null
}

// Guardar la selección y actualizar la tabla
const guardarSeleccion = () => {
  if (objetivoSeleccionado.value && indicadorSeleccionado.value) {
    emit('guardar', {
      objetivo_pei: objetivoSeleccionado.value.id,
      indicador_pei: indicadorSeleccionado.value.id,
    })
  }
}

// Cerrar el modal
const cerrarModal = () => {
  emit('cerrar')
}

// Opcional: cargar datos iniciales si es necesario
onMounted(() => {
  // Aquí podrías cargar datos reales desde una API
})
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
