<!-- ComponenteBaseIndicador.vue -->
<template>
  <div class="indicador-container">
    <!-- Fila 1: Información del Indicador (ancho completo) -->
    <v-card class="mb-4">
      <v-card-title class="bg-blue-lighten-5">
        <v-icon class="mr-2">{{ icono }}</v-icon>
        Información del Indicador - {{ tipoTexto }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-list lines="two" density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary" size="small">mdi-identifier</v-icon>
                </template>
                <v-list-item-title class="text-body-2">{{ datos.codigo }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">Código</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary" size="small">mdi-text</v-icon>
                </template>
                <v-list-item-title class="text-body-2">{{ datos.descripcion }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">Descripción</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary" size="small">mdi-format-quote-open</v-icon>
                </template>
                <v-list-item-title class="text-body-2">{{ datos.redaccion }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">Redacción</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary" size="small">mdi-target</v-icon>
                </template>
                <v-list-item-title class="text-body-2">{{
                  datos.target_poblacion || 'No definido'
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">Target Población</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="12" md="6">
            <v-list lines="two" density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary" size="small">mdi-calendar</v-icon>
                </template>
                <v-list-item-title class="text-body-2">{{
                  datos.frecuencia || 'No definida'
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">Frecuencia</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary" size="small">mdi-source-repository</v-icon>
                </template>
                <v-list-item-title class="text-body-2">{{
                  datos.fuente_verificacion || 'No definida'
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption"
                  >Fuente de Verificación</v-list-item-subtitle
                >
              </v-list-item>

              <v-list-item v-if="datos.baseline">
                <template v-slot:prepend>
                  <v-icon color="primary" size="small">mdi-chart-line</v-icon>
                </template>
                <v-list-item-title class="text-body-2">{{ datos.baseline }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">Línea Base</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary" size="small">mdi-form-select</v-icon>
                </template>
                <v-list-item-title class="text-body-2">{{ tipoDatosTexto }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">Tipo de Datos</v-list-item-subtitle>
              </v-list-item>

              <!-- Estadísticas rápidas -->
              <v-list-item v-if="mostrarEstadisticas">
                <template v-slot:prepend>
                  <v-icon color="primary" size="small">mdi-chart-box</v-icon>
                </template>
                <v-list-item-title class="text-body-2">
                  <span class="text-primary">{{ ultimoValor }}</span> -
                  <span class="text-green">{{ progreso }}</span>
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">Último / Progreso</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Fila 2: Formulario + Historial (mitad y mitad) -->
    <v-row class="mb-4">
      <!-- Columna Izquierda: Formulario -->
      <v-col cols="12" md="6">
        <v-card class="h-100">
          <v-card-title class="bg-green-lighten-5">
            <v-icon class="mr-2">mdi-plus-circle</v-icon>
            Formulario de Registro
          </v-card-title>
          <v-card-text>
            <slot name="formulario">
              <!-- Aquí se inyectará el formulario específico -->
            </slot>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Columna Derecha: Historial -->
      <v-col cols="12" md="6">
        <v-card class="h-100">
          <v-card-title class="bg-orange-lighten-5">
            <v-icon class="mr-2">mdi-history</v-icon>
            Historial de Avances
            <v-chip size="small" class="ml-2" color="orange">
              {{ historialCount }}
            </v-chip>
          </v-card-title>
          <v-card-text style="height: 400px; overflow-y: auto">
            <slot name="historial">
              <!-- Aquí se inyectará el historial -->
            </slot>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Fila 3: Gráfica (ancho completo, solo para numérico y porcentual) -->
    <v-card v-if="mostrarGrafica" class="mb-4">
      <v-card-title class="bg-purple-lighten-5">
        <v-icon class="mr-2">mdi-chart-line</v-icon>
        Evolución del Avance
        <v-spacer></v-spacer>
        <v-chip v-if="mostrarEstadisticas" size="small" color="purple" variant="outlined">
          Progreso: {{ progreso }}
        </v-chip>
      </v-card-title>
      <v-card-text>
        <slot name="grafica">
          <!-- Aquí se inyectará la gráfica -->
        </slot>
      </v-card-text>
    </v-card>

    <!-- Mensaje cuando no hay gráfica -->
    <v-card v-else class="mb-4">
      <v-card-text class="text-center py-8 text-grey">
        <v-icon size="48" class="mb-2">mdi-chart-line</v-icon>
        <div class="text-body-1">Gráfica no disponible para indicadores literales</div>
        <div class="text-caption">
          La visualización gráfica solo está disponible para indicadores numéricos y porcentuales
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  datos: {
    type: Object,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  icono: {
    type: String,
    default: 'mdi-chart-line',
  },
  tipoTexto: {
    type: String,
    required: true,
  },
  historialCount: {
    type: Number,
    default: 0,
  },
  ultimoValor: {
    type: String,
    default: 'N/A',
  },
  progreso: {
    type: String,
    default: '0%',
  },
})

const mostrarGrafica = computed(() => {
  return props.datos.tipo === '1-9' || props.datos.tipo === '%'
})

const mostrarEstadisticas = computed(() => {
  return props.datos.tipo === '1-9' || props.datos.tipo === '%'
})

const tipoDatosTexto = computed(() => {
  const tipos = {
    'A-Z': 'Literal (A, B, C, D, E, F)',
    '1-9': 'Numérico (0-9)',
    '%': 'Porcentual (0-100%)',
  }
  return tipos[props.datos.tipo] || props.datos.tipo
})
</script>

<style scoped>
.indicador-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.h-100 {
  height: 100%;
}

/* Asegurar que las cards tengan la misma altura en la fila 2 */
.v-row .v-col {
  display: flex;
}

.v-row .v-col .v-card {
  flex: 1;
}
</style>
