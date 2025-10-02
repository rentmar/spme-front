<template>
  <div>
    <v-list lines="three" v-if="historial.length > 0">
      <v-list-item
        v-for="(registro, index) in historial"
        :key="index"
        :class="{ 'bg-blue-lighten-5': index % 2 === 0 }"
      >
        <template v-slot:prepend>
          <v-avatar :color="getColorAvance(registro)" size="40">
            <span class="white--text">
              {{ formatearValor(registro) }}
            </span>
          </v-avatar>
        </template>

        <v-list-item-title class="font-weight-medium">
          {{ formatFecha(registro.fechaBitacora || registro.fecha) }}
        </v-list-item-title>

        <v-list-item-subtitle>
          {{ registro.reporteEscrito || registro.observaciones }}
        </v-list-item-subtitle>

        <v-list-item-subtitle class="text-caption text-medium-emphasis">
          Registrado por: {{ registro.usuario || 'Sistema' }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <div v-else class="text-center py-8 text-medium-emphasis">
      <v-icon size="64" class="mb-2">mdi-history</v-icon>
      <p>No hay registros previos para este indicador.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  indicadorId: {
    type: [Number, String],
    required: true,
  },
  tipoIndicador: {
    type: String,
    default: 'Numérico',
  },
  tipo: {
    type: String,
    default: 'indicadorog',
  },
})

const historial = ref([])

// Datos dummy
const cargarHistorial = async () => {
  // Simular carga de API
  await new Promise((resolve) => setTimeout(resolve, 500))

  historial.value = [
    {
      fechaBitacora: '2024-01-15',
      cantidadAvance:
        props.tipoIndicador === '%' ? '25' : props.tipoIndicador === 'A-Z' ? 'B' : '100',
      reporteEscrito: 'Avance inicial del primer trimestre',
      usuario: 'Usuario Sistema',
    },
    {
      fechaBitacora: '2024-02-20',
      cantidadAvance:
        props.tipoIndicador === '%' ? '45' : props.tipoIndicador === 'A-Z' ? 'C' : '200',
      reporteEscrito: 'Avance significativo después de capacitación',
      usuario: 'Usuario Sistema',
    },
  ]
}

// Helper functions (las mismas del anterior)
const formatearValor = (registro) => {
  const valor = registro.cantidadAvance || registro.valor
  if (props.tipoIndicador === '%') {
    return `${valor}%`
  }
  return valor
}

const getColorAvance = (registro) => {
  const valor = registro.cantidadAvance || registro.valor
  if (props.tipoIndicador === '%') {
    const numValor = parseFloat(valor)
    if (numValor >= 80) return 'green'
    if (numValor >= 60) return 'light-green'
    if (numValor >= 40) return 'yellow'
    if (numValor >= 20) return 'orange'
    return 'red'
  } else if (props.tipoIndicador === 'A-Z') {
    if (valor === 'A') return 'green'
    if (valor === 'B') return 'light-green'
    if (valor === 'C') return 'yellow'
    if (valor === 'D') return 'orange'
    return 'red'
  }
  return 'primary'
}

const formatFecha = (fecha) => {
  if (!fecha) return 'No definida'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

onMounted(() => {
  cargarHistorial()
})

watch(() => props.indicadorId, cargarHistorial)
</script>
