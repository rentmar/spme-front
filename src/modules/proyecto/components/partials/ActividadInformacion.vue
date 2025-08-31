<template>
  <div>
    <v-card variant="outlined" elevation="1" class="activity-card">
      <v-card-title class="activity-header pa-4">
        <div class="d-flex align-center w-100">
          <v-icon
            icon="mdi-clipboard-text-outline"
            size="large"
            class="mr-3"
            color="deep-purple"
          ></v-icon>
          <div class="activity-title-container flex-grow-1">
            <div class="d-flex align-center mb-1">
              <h3 class="text-h5 font-weight-bold activity-title mr-3">
                CODIGO: {{ actividad.codigo }}
              </h3>
              <v-chip
                prepend-icon="mdi-progress-check"
                :color="getEstadoColor(actividad.estado)"
                size="small"
                class="status-chip"
              >
                {{ getEstadoTexto(actividad.estado) }}
              </v-chip>
            </div>
            <p
              v-if="actividad.nombreCorto"
              class="text-subtitle-1 text-medium-emphasis activity-subtitle"
            >
              ACTIVIDAD: {{ actividad.nombreCorto }}
            </p>
            <p
              v-else-if="actividad.descripcion"
              class="text-subtitle-1 text-medium-emphasis activity-subtitle"
            >
              DESCRIPCION: {{ actividad.descripcion }}
            </p>
          </div>

          <!-- Chips compactos de información adicional -->
          <div class="d-flex flex-column align-end" v-if="actividad.tipo">
            <v-chip class="mb-1" color="indigo-lighten-4" density="comfortable" size="small">
              <v-icon start icon="mdi-tag" size="small"></v-icon>
              Tipo: {{ actividad.tipo }}
            </v-chip>
          </div>
        </div>
      </v-card-title>

      <v-divider class="mx-4"></v-divider>

      <v-card-text class="activity-content pa-4">
        <v-row dense>
          <v-col cols="12" sm="6" class="pb-1">
            <div class="d-flex align-center mb-3">
              <v-icon icon="mdi-calendar" class="mr-2" color="primary" size="small"></v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Fecha Inicio</div>
                <div class="text-body-2 font-weight-medium">
                  {{ formatDate(actividad.fecha_inicio) || 'No definida' }}
                </div>
              </div>
            </div>
            <div class="d-flex align-center mb-3">
              <v-icon icon="mdi-calendar" class="mr-2" color="primary" size="small"></v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Fecha Fin</div>
                <div class="text-body-2 font-weight-medium">
                  {{ formatDate(actividad.fecha_fin) || 'No definida' }}
                </div>
              </div>
            </div>
            <div class="d-flex align-center mb-3" v-if="actividad.responsable">
              <v-icon icon="mdi-account" class="mr-2" color="primary" size="small"></v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Responsable</div>
                <div class="text-body-2 font-weight-medium">{{ actividad.responsable }}</div>
              </div>
            </div>
          </v-col>

          <v-col cols="12" sm="6" class="pb-1">
            <div class="d-flex align-center mb-3" v-if="actividad.presupuesto">
              <v-icon icon="mdi-finance" class="mr-2" color="primary" size="small"></v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Presupuesto</div>
                <div class="text-body-2 font-weight-medium">
                  Bs. {{ formatCurrency(actividad.presupuesto) }}
                </div>
              </div>
            </div>
            <div class="d-flex align-center mb-3" v-if="actividad.presupuestoGlobal">
              <v-icon icon="mdi-cash-multiple" class="mr-2" color="primary" size="small"></v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Presupuesto Global</div>
                <div class="text-body-2 font-weight-medium">
                  Bs. {{ formatCurrency(actividad.presupuestoGlobal) }}
                </div>
              </div>
            </div>
            <div class="d-flex align-center mb-3" v-if="actividad.saldo !== null">
              <v-icon icon="mdi-wallet" class="mr-2" color="primary" size="small"></v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Saldo</div>
                <div class="text-body-2 font-weight-medium" :class="getSaldoColor(actividad.saldo)">
                  Bs. {{ formatCurrency(actividad.saldo) }}
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Información adicional en caso de tener datos -->
        <div
          v-if="actividad.supuestos || actividad.riesgos || actividad.objetivo_de_actividad"
          class="mt-4"
        >
          <v-expansion-panels variant="accordion">
            <v-expansion-panel v-if="actividad.objetivo_de_actividad">
              <v-expansion-panel-title>
                <v-icon icon="mdi-target" class="mr-2" size="small"></v-icon>
                Objetivo de la Actividad
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ actividad.objetivo_de_actividad }}
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel v-if="actividad.supuestos">
              <v-expansion-panel-title>
                <v-icon icon="mdi-information" class="mr-2" size="small"></v-icon>
                Supuestos
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ actividad.supuestos }}
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel v-if="actividad.riesgos">
              <v-expansion-panel-title>
                <v-icon icon="mdi-alert" class="mr-2" size="small"></v-icon>
                Riesgos
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ actividad.riesgos }}
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import {
  getStatusColor,
  getEstadoTexto,
  formatDate,
  getChipColor,
  getInstanciaIcon,
  formatCurrency,
} from '@/utility/formatters'
import { computed } from 'vue'

// Valor por defecto para la prop actividad
const props = defineProps({
  actividad: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      fecha_inicio: null,
      fecha_fin: null,
      codigo: 'N/A',
      nombreCorto: '',
      descripcion: '',
      supuestos: '',
      riesgos: '',
      objetivo_de_actividad: '',
      descripcion_evaluacion: '',
      descripcion_tipo_actividad: '',
      fecha_programada: null,
      fecha_cierre: null,
      presupuesto: 0,
      presupuestoGlobal: 0,
      totalReportado: 0,
      totalEjecutado: 0,
      saldo: 0,
      gradoEjecucion: 0,
      procedencia_fondos: '',
      estado: 'CRD',
      rutaTrazadoIndicadores: '',
      factoresCriticos: '',
      tipo: 0,
      proceso: null,
      resultado_og: null,
      resultado_oe: null,
      producto_oe: null,
      objetivo_pei: null,
      indicador_pei: null,
      proyecto: 0,
      responsable: '',
    }),
  },
})

console.log(props.actividad)

// Función para obtener color según el estado
const getEstadoColor = (estado) => {
  const colors = {
    CRD: 'grey', // Creado
    PLN: 'blue', // Planificado
    EJEC: 'green', // En Ejecución
    SUSP: 'orange', // Suspendido
    CMPL: 'teal', // Completado
    CNCL: 'red', // Cancelado
  }
  return colors[estado] || 'grey'
}

// Función para color del saldo
const getSaldoColor = (saldo) => {
  if (saldo === null || saldo === undefined) return ''
  return saldo < 0 ? 'text-error' : 'text-success'
}
</script>

<style scoped>
.activity-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.activity-header {
  padding-bottom: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px 12px 0 0;
}

.activity-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  line-height: 1.2;
  color: var(--v-primary-darken1);
  margin-bottom: 0;
}

.activity-subtitle {
  font-size: 1rem;
  font-weight: 400;
  color: var(--v-secondary-darken1);
  line-height: 1.4;
  margin-bottom: 0;
}

.activity-title-container {
  min-width: 0;
}

.activity-content {
  padding-top: 16px;
}

.status-chip {
  height: 24px;
  font-weight: 500;
}

.v-chip {
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* Ajustes responsivos */
@media (max-width: 960px) {
  .activity-title {
    font-size: 1.3rem;
  }

  .activity-subtitle {
    font-size: 0.9rem;
  }

  .activity-header .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .activity-header .d-flex.align-end {
    flex-direction: row;
    margin-top: 8px;
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 600px) {
  .activity-card {
    margin: 8px 0;
  }

  .activity-header,
  .activity-content {
    padding: 16px;
  }

  .activity-title {
    font-size: 1.2rem;
  }
}

.text-error {
  color: #f44336;
}

.text-success {
  color: #4caf50;
}
</style>
