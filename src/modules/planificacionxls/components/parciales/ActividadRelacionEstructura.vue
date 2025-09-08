<template>
  <div class="procedencia-actividad">
    <!-- Header -->
    <v-card class="header-card mb-4">
      <v-card-title class="bg-primary text-white">
        <v-icon class="mr-2">mdi-source-branch</v-icon>
        Procedencia de la Actividad
      </v-card-title>
      <v-card-text>
        <div class="summary-info">
          <v-chip color="primary" class="mr-2">
            <v-icon small class="mr-1">mdi-target</v-icon>
            1 Objetivo General
          </v-chip>
          <v-chip color="secondary" class="mr-2">
            <v-icon small class="mr-1">mdi-chart-line</v-icon>
            {{ totalIndicadores }} Indicadores
          </v-chip>
          <v-chip color="green" class="mr-2">
            <v-icon small class="mr-1">mdi-check</v-icon>
            {{ indicadoresSeleccionados }} Seleccionados
          </v-chip>
        </div>
      </v-card-text>
    </v-card>

    <!-- Estructura de Procedencia -->
    <div class="estructura-procedencia">
      <!-- Objetivo General -->
      <div class="nodo-objetivo-general">
        <v-card class="nodo-card objetivo-general-card">
          <v-card-title class="bg-primary text-white">
            <v-icon class="mr-2">mdi-target</v-icon>
            Objetivo General
          </v-card-title>
          <v-card-text>
            <div class="nodo-content">
              <div class="nodo-codigo">{{ objetivoGeneral?.codigo }}</div>
              <div class="nodo-descripcion">{{ objetivoGeneral?.descripcion }}</div>
              <div class="nodo-meta">
                <span class="meta-item">
                  <v-icon small>mdi-account</v-icon>
                  {{ objetivoGeneral?.supuestos ? 'Con supuestos' : 'Sin supuestos' }}
                </span>
                <span class="meta-item">
                  <v-icon small>mdi-alert</v-icon>
                  {{ objetivoGeneral?.riesgos ? 'Con riesgos' : 'Sin riesgos' }}
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Flecha de conexión -->
        <div class="conexion">
          <v-icon color="grey">mdi-arrow-down</v-icon>
          <div class="conexion-text">Procede de</div>
        </div>
      </div>

      <!-- Indicadores -->
      <div class="indicadores-container">
        <div class="indicadores-title">
          <h3><v-icon color="secondary">mdi-chart-line</v-icon> Indicadores Relacionados</h3>
          <p class="indicadores-subtitle">Selecciona los indicadores para esta actividad</p>
        </div>

        <div class="indicadores-grid">
          <v-card
            v-for="(indicador, index) in indicadores"
            :key="indicador.id"
            class="nodo-card indicador-card"
            :class="{ 'selected-indicador': esIndicadorSeleccionado(indicador.id) }"
            @click="toggleIndicadorSeleccion(indicador.id)"
          >
            <v-card-title class="bg-secondary text-white">
              <v-icon class="mr-2">mdi-chart-line</v-icon>
              Indicador {{ index + 1 }}
              <v-spacer />
              <v-icon v-if="esIndicadorSeleccionado(indicador.id)" color="white">
                mdi-check-circle
              </v-icon>
            </v-card-title>
            <v-card-text>
              <div class="nodo-content">
                <div class="nodo-codigo">{{ indicador.codigo }}</div>
                <div class="nodo-descripcion">{{ indicador.descripcion }}</div>

                <div class="indicador-details">
                  <div class="detail-item">
                    <strong>Redacción:</strong> {{ indicador.redaccion || 'No definida' }}
                  </div>
                  <div class="detail-item">
                    <strong>Fuente:</strong> {{ indicador.fuente_verificacion || 'No definida' }}
                  </div>
                  <div class="detail-item">
                    <strong>Frecuencia:</strong> {{ getFrecuenciaText(indicador.frecuencia) }}
                  </div>
                  <div class="detail-item"><strong>Tipo:</strong> {{ indicador.tipo }}</div>
                </div>

                <!-- Targets -->
                <div class="targets-section" v-if="hasTargets(indicador)">
                  <h4><v-icon small>mdi-target</v-icon> Metas:</h4>
                  <div class="targets-grid">
                    <div class="target-item" v-if="indicador.baseline">
                      <span class="target-label">Baseline:</span>
                      <span class="target-value">{{ indicador.baseline }}</span>
                    </div>
                    <div class="target-item" v-if="indicador.target_q1">
                      <span class="target-label">Q1:</span>
                      <span class="target-value">{{ indicador.target_q1 }}</span>
                    </div>
                    <div class="target-item" v-if="indicador.target_q2">
                      <span class="target-label">Q2:</span>
                      <span class="target-value">{{ indicador.target_q2 }}</span>
                    </div>
                    <div class="target-item" v-if="indicador.target_q3">
                      <span class="target-label">Q3:</span>
                      <span class="target-value">{{ indicador.target_q3 }}</span>
                    </div>
                    <div class="target-item" v-if="indicador.target_q4">
                      <span class="target-label">Q4:</span>
                      <span class="target-value">{{ indicador.target_q4 }}</span>
                    </div>
                  </div>
                </div>

                <div v-else class="no-targets">
                  <v-icon small color="grey">mdi-information</v-icon>
                  <span>Sin metas definidas</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>

    <!-- Resumen de Selecciones -->
    <v-card class="resumen-card mt-4">
      <v-card-title>
        <v-icon class="mr-2">mdi-checkbox-multiple-marked</v-icon>
        Resumen de Selecciones
      </v-card-title>
      <v-card-text>
        <div class="selecciones-info">
          <div class="seleccion-item">
            <v-icon color="primary">mdi-target</v-icon>
            <span><strong>Objetivo General:</strong> {{ objetivoGeneral?.codigo }}</span>
          </div>
          <div class="seleccion-item">
            <v-icon color="secondary">mdi-chart-line</v-icon>
            <span
              ><strong>Indicadores seleccionados:</strong>
              {{ seleccionesSimples.indicadorOGIds.length }}</span
            >
          </div>
          <div class="indicadores-lista" v-if="seleccionesSimples.indicadorOGIds.length > 0">
            <v-chip
              v-for="indicadorId in seleccionesSimples.indicadorOGIds"
              :key="indicadorId"
              small
              color="secondary"
              class="mr-1 mb-1"
              close
              @click:close="removeIndicador(indicadorId)"
            >
              {{ getIndicadorCodigo(indicadorId) }}
            </v-chip>
          </div>
          <div v-else class="no-selection">
            <v-icon color="grey">mdi-information</v-icon>
            <span>No hay indicadores seleccionados</span>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="guardarSelecciones">
          <v-icon class="mr-2">mdi-content-save</v-icon>
          Guardar Selección
        </v-btn>
        <v-btn color="secondary" variant="outlined" @click="limpiarSelecciones">
          <v-icon class="mr-2">mdi-close</v-icon>
          Limpiar
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// Datos Dummy para pruebas
const datosDummy = {
  nodosRelacionados: [
    {
      id: '2',
      type: 'objetivogeneral',
      data: {
        nodoProyecto: {
          id: 3,
          codigo: 'OG-2024-001',
          descripcion:
            'Mejorar la eficiencia operativa del departamento de TI mediante la implementación de nuevas tecnologías y capacitación del personal',
          supuestos: 'Disponibilidad de presupuesto y recursos humanos',
          riesgos: 'Resistencia al cambio del personal',
          proyecto: 3,
        },
      },
    },
    {
      id: '3',
      type: 'indicadorog',
      data: {
        nodoProyecto: {
          id: 2,
          codigo: 'IND-TI-001',
          descripcion: 'Porcentaje de reducción en tiempo de respuesta de incidentes',
          redaccion: 'Reducir en un 30% el tiempo promedio de respuesta a incidentes críticos',
          fuente_verificacion: 'Sistema de tickets y reportes de incidentes',
          target_poblacion: 'Departamento de TI',
          tipo: 'Porcentaje',
          frecuencia: 'MEN',
          responsable: 'jefe.ti',
          baseline: '4 horas',
          target_q1: '3.5 horas',
          target_q2: '3 horas',
          target_q3: '2.8 horas',
          target_q4: '2.5 horas',
          objetivo_general: 3,
        },
      },
    },
    {
      id: '4',
      type: 'indicadorog',
      data: {
        nodoProyecto: {
          id: 3,
          codigo: 'IND-TI-002',
          descripcion: 'Nivel de satisfacción del usuario interno con los servicios de TI',
          redaccion: 'Incrementar la satisfacción del usuario interno en un 25%',
          fuente_verificacion: 'Encuestas de satisfacción trimestrales',
          target_poblacion: 'Usuarios internos',
          tipo: 'Escala',
          frecuencia: 'TRI',
          responsable: 'soporte.ti',
          baseline: '65%',
          target_q1: '70%',
          target_q2: '75%',
          target_q3: '80%',
          target_q4: '85%',
          objetivo_general: 3,
        },
      },
    },
    {
      id: '5',
      type: 'indicadorog',
      data: {
        nodoProyecto: {
          id: 4,
          codigo: 'IND-TI-003',
          descripcion: 'Tasa de finalización de proyectos de TI dentro del plazo estimado',
          redaccion: 'Aumentar la tasa de finalización a tiempo al 90%',
          fuente_verificacion: 'Reportes de estado de proyectos',
          target_poblacion: 'Equipos de proyecto',
          tipo: 'Porcentaje',
          frecuencia: 'TRI',
          responsable: 'pm.ti',
          baseline: '70%',
          target_q1: '75%',
          target_q2: '80%',
          target_q3: '85%',
          target_q4: '90%',
          objetivo_general: 3,
        },
      },
    },
  ],
  seleccionesSimples: {
    objetivoGeneralId: 3,
    indicadorOGIds: [2, 3], // Algunos seleccionados por defecto
  },
}

// Usar datos dummy
const datosProcedencia = ref(datosDummy)

// Estado reactivo para selecciones
const seleccionesSimples = ref({
  objetivoGeneralId: datosDummy.seleccionesSimples.objetivoGeneralId,
  indicadorOGIds: [...datosDummy.seleccionesSimples.indicadorOGIds],
})

// Computed properties
const objetivoGeneral = computed(() => {
  return (
    datosProcedencia.value.nodosRelacionados?.find((nodo) => nodo.type === 'objetivogeneral')?.data
      ?.nodoProyecto || null
  )
})

const indicadores = computed(() => {
  const indicadoresNodos =
    datosProcedencia.value.nodosRelacionados?.filter((nodo) => nodo.type === 'indicadorog') || []

  return indicadoresNodos.map((nodo) => nodo.data.nodoProyecto)
})

const totalIndicadores = computed(() => indicadores.value.length)
const indicadoresSeleccionados = computed(() => seleccionesSimples.value.indicadorOGIds.length)

// Métodos
const getFrecuenciaText = (frecuencia) => {
  const frecuencias = {
    MEN: 'Mensual',
    TRI: 'Trimestral',
    SEM: 'Semestral',
    ANU: 'Anual',
    BIM: 'Bimestral',
  }
  return frecuencias[frecuencia] || frecuencia
}

const esIndicadorSeleccionado = (indicadorId) => {
  return seleccionesSimples.value.indicadorOGIds.includes(indicadorId)
}

const getIndicadorCodigo = (indicadorId) => {
  const indicador = indicadores.value.find((ind) => ind.id === indicadorId)
  return indicador?.codigo || `ID: ${indicadorId}`
}

const toggleIndicadorSeleccion = (indicadorId) => {
  const index = seleccionesSimples.value.indicadorOGIds.indexOf(indicadorId)
  if (index > -1) {
    seleccionesSimples.value.indicadorOGIds.splice(index, 1)
  } else {
    seleccionesSimples.value.indicadorOGIds.push(indicadorId)
  }
}

const removeIndicador = (indicadorId) => {
  const index = seleccionesSimples.value.indicadorOGIds.indexOf(indicadorId)
  if (index > -1) {
    seleccionesSimples.value.indicadorOGIds.splice(index, 1)
  }
}

const limpiarSelecciones = () => {
  seleccionesSimples.value.indicadorOGIds = []
}

const guardarSelecciones = () => {
  console.log('Selecciones guardadas:', seleccionesSimples.value)
  // Aquí iría la lógica para guardar en el backend
  alert(`Se guardaron ${seleccionesSimples.value.indicadorOGIds.length} indicadores seleccionados`)
}

const hasTargets = (indicador) => {
  return (
    indicador.baseline ||
    indicador.target_q1 ||
    indicador.target_q2 ||
    indicador.target_q3 ||
    indicador.target_q4
  )
}
</script>

<style scoped>
.procedencia-actividad {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header-card {
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
}

.summary-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

/* Estructura de procedencia */
.estructura-procedencia {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.nodo-objetivo-general {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.objetivo-general-card {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.conexion {
  padding: 16px;
  text-align: center;
}

.conexion .v-icon {
  font-size: 32px;
}

.conexion-text {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

/* Indicadores */
.indicadores-container {
  width: 100%;
}

.indicadores-title {
  text-align: center;
  margin-bottom: 24px;
}

.indicadores-title h3 {
  color: #1976d2;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.indicadores-subtitle {
  color: #666;
  margin-top: 4px;
}

.indicadores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.indicador-card {
  height: 100%;
  transition: all 0.3s ease;
  cursor: pointer;
}

.indicador-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.selected-indicador {
  border: 2px solid #4caf50;
  background-color: #f8f9fa;
}

/* Contenido de nodos */
.nodo-content {
  padding: 8px;
}

.nodo-codigo {
  font-size: 18px;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 8px;
}

.nodo-descripcion {
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
}

.nodo-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

/* Detalles de indicadores */
.indicador-details {
  margin: 12px 0;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.detail-item {
  margin-bottom: 6px;
  font-size: 14px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.targets-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.targets-section h4 {
  color: #1976d2;
  margin-bottom: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.targets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
}

.target-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background-color: #e3f2fd;
  border-radius: 6px;
}

.target-label {
  font-size: 11px;
  font-weight: bold;
  color: #1976d2;
  text-transform: uppercase;
}

.target-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.no-targets {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
  margin-top: 12px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

/* Resumen de selecciones */
.resumen-card {
  background-color: #fafafa;
}

.selecciones-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.seleccion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.indicadores-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.no-selection {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .procedencia-actividad {
    padding: 10px;
  }

  .indicadores-grid {
    grid-template-columns: 1fr;
  }

  .nodo-meta {
    flex-direction: column;
    gap: 8px;
  }

  .targets-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.bg-primary {
  background-color: #1976d2 !important;
}

.bg-secondary {
  background-color: #26a69a !important;
}

.text-white {
  color: white !important;
}
</style>
