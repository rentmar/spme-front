<template>
  <v-card variant="outlined">
    <v-card-title class="bg-blue-lighten-5">Historial de Avances</v-card-title>
    <v-card-text class="pa-0">
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
            <span v-if="registro.tipoIndicador" class="ml-2">
              ({{ formatoTipoIndicador(registro.tipoIndicador) }})
            </span>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <div v-else class="text-center py-8 text-medium-emphasis">
        <v-icon size="64" class="mb-2">mdi-history</v-icon>
        <p>No hay registros previos para este indicador.</p>
      </div>
    </v-card-text>
  </v-card>
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
})

const emit = defineEmits(['datos-cargados'])

const historial = ref([])
const isLoading = ref(false)

// Datos dummy para el historial
const datosDummy = {
  1: [
    // Porcentual
    {
      fechaBitacora: '2024-01-15',
      cantidadAvance: '25',
      reporteEscrito: 'Avance inicial del primer trimestre',
      usuario: 'Ana García',
    },
    {
      fechaBitacora: '2024-02-20',
      cantidadAvance: '45',
      reporteEscrito: 'Avance significativo después de capacitación',
      usuario: 'Ana García',
    },
    {
      fechaBitacora: '2024-03-25',
      cantidadAvance: '65',
      reporteEscrito: 'Tercer trimestre con buen progreso',
      usuario: 'Ana García',
    },
  ],
  2: [
    // Numérico
    {
      fechaBitacora: '2024-01-10',
      cantidadAvance: '100',
      reporteEscrito: 'Primera producción del mes',
      usuario: 'Carlos López',
    },
    {
      fechaBitacora: '2024-01-28',
      cantidadAvance: '220',
      reporteEscrito: 'Aumento de producción después de optimización',
      usuario: 'Carlos López',
    },
    {
      fechaBitacora: '2024-02-18',
      cantidadAvance: '320',
      reporteEscrito: 'Meta parcial alcanzada antes de lo previsto',
      usuario: 'Carlos López',
    },
  ],
  3: [
    // Literal
    {
      fechaBitacora: '2024-01-05',
      cantidadAvance: 'C',
      reporteEscrito: 'Estado regular al inicio del proyecto',
      usuario: 'María Rodríguez',
    },
    {
      fechaBitacora: '2024-02-15',
      cantidadAvance: 'B',
      reporteEscrito: 'Mejora después de implementar nuevas estrategias',
      usuario: 'María Rodríguez',
    },
    {
      fechaBitacora: '2024-03-20',
      cantidadAvance: 'A',
      reporteEscrito: 'Excelente progreso en el último mes',
      usuario: 'María Rodríguez',
    },
  ],
}

/**
 * Carga el historial del indicador
 */
const cargarHistorial = async () => {
  isLoading.value = true
  try {
    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Usar datos dummy según el ID del indicador
    historial.value = datosDummy[props.indicadorId] || []

    // Emitir datos cargados
    emit('datos-cargados', historial.value)
  } catch (error) {
    console.error('Error cargando historial:', error)
    historial.value = []
  } finally {
    isLoading.value = false
  }
}

/**
 * Formatea el valor para mostrar según el tipo de indicador
 */
const formatearValor = (registro) => {
  const valor = registro.cantidadAvance || registro.valor
  if (props.tipoIndicador === 'Porcentual') {
    return `${valor}%`
  }
  return valor
}

/**
 * Obtiene el color del avatar según el valor del avance
 */
const getColorAvance = (registro) => {
  const valor = registro.cantidadAvance || registro.valor

  if (props.tipoIndicador === 'Porcentual') {
    const numValor = parseFloat(valor)
    if (numValor >= 80) return 'green'
    if (numValor >= 60) return 'light-green'
    if (numValor >= 40) return 'yellow'
    if (numValor >= 20) return 'orange'
    return 'red'
  } else if (props.tipoIndicador === 'Literal') {
    if (valor === 'A') return 'green'
    if (valor === 'B') return 'light-green'
    if (valor === 'C') return 'yellow'
    if (valor === 'D') return 'orange'
    return 'red'
  }

  return 'primary'
}

/**
 * Formatea una fecha para mostrar
 */
const formatFecha = (fecha) => {
  if (!fecha) return 'No definida'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Formatea el tipo de indicador para mostrar
 */
const formatoTipoIndicador = (tipo) => {
  const tipos = {
    indicadorog: 'Indicador OG',
    indicadoroe: 'Indicador OE',
    indicadorrog: 'Indicador R OG',
    indicadorroe: 'Indicador R OE',
  }
  return tipos[tipo] || tipo
}

// Cargar historial cuando cambie el indicador
watch(() => props.indicadorId, cargarHistorial, { immediate: true })

onMounted(() => {
  cargarHistorial()
})
</script>
