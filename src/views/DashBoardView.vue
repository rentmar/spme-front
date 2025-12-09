<template>
  <v-container class="dashboard-container">
    <v-overlay :model-value="loading" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando datos...</p>
      </div>
    </v-overlay>

    <template v-if="!loading">
      <v-row>
        <v-col cols="12">
          <PaginaTituloIcono
            :titulo="'DASHBOARD DE PLANIFICACIÓN ESTRATÉGICA'"
            :icon="'mdi-chart-box'"
          />

          <v-row class="mb-6">
            <v-col cols="12" md="4">
              <v-card class="summary-card" color="primary" variant="tonal">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-h6">PEIs Vigentes / Total</div>
                      <div class="text-h4 mt-2">
                        {{ summary.pei_vigentes }} / {{ summary.total_pei }}
                      </div>
                    </div>
                    <v-icon size="48">mdi-file-document-multiple</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="summary-card" color="secondary" variant="tonal">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-h6">Total Proyectos</div>
                      <div class="text-h4 mt-2">{{ summary.total_proyectos }}</div>
                    </div>
                    <v-icon size="48">mdi-briefcase</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="summary-card" color="info" variant="tonal">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-h6">Actividades Planificadas / Total</div>
                      <div class="text-h4 mt-2">
                        {{ summary.actividades_planificadas }} / {{ summary.total_actividades }}
                      </div>
                    </div>
                    <v-icon size="48">mdi-calendar-check</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="mb-6">
            <v-col cols="12" md="4">
              <v-card class="summary-card" color="success" variant="tonal">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-h6">Presupuesto Asignado / Global</div>
                      <div class="text-h5 mt-2">
                        ${{ summary.total_presupuesto }} / ${{ summary.total_presupuesto_global }}
                      </div>
                    </div>
                    <v-icon size="48">mdi-cash-multiple</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="summary-card" color="warning" variant="tonal">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-h6">Actividades en Ejecución</div>
                      <div class="text-h4 mt-2">{{ summary.actividades_ejecucion }}</div>
                    </div>
                    <v-icon size="48">mdi-progress-helper</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="summary-card" color="red-lighten-1" variant="tonal">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-h6">Actividades Finalizadas</div>
                      <div class="text-h4 mt-2">{{ summary.actividades_finalizadas }}</div>
                    </div>
                    <v-icon size="48">mdi-check-all</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import axios from 'axios'
const baseUrl = import.meta.env.VITE_API_BASE
export default {
  data() {
    return {
      loading: true,
      summary: {
        actividades_planificadas: 0,
        total_actividades: 0,
        actividades_ejecucion: 0,
        actividades_finalizadas: 0,
        total_presupuesto: '0.00',
        total_presupuesto_global: '0.00',
        pei_vigentes: 0,
        total_pei: 0,
        total_proyectos: 0,
      },
    }
  },

  methods: {
    async fetchDashboardData() {
      const API_URL = baseUrl + '/actividades_api/obtenerDashboardActividad/'

      this.loading = true

      try {
        const response = await axios.get(API_URL)

        this.summary = response.data
      } catch (error) {
        console.error('Error al obtener datos del dashboard:', error)
      } finally {
        this.loading = false
      }
    },
  },

  mounted() {
    this.fetchDashboardData()
  },
  components: {
    PaginaTituloIcono,
  },
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}

.summary-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 960px) {
  .dashboard-container {
    padding: 16px 12px;
  }
}
</style>
