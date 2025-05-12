<template>
  <v-expansion-panels multiple class="marco-logico-panels">
    <v-expansion-panel elevation="1" class="marco-logico-panel">
      <v-expansion-panel-title expand-icon="mdi-chevron-down" collapse-icon="mdi-chevron-up">
        <v-icon icon="mdi-flag-checkered" color="teal-darken-2" class="mr-3" />
        <span class="panel-title">Resultados</span>
        <v-chip color="primary" variant="outlined" size="small" class="ml-2">
          {{ cantidadResultados }} item
        </v-chip>
      </v-expansion-panel-title>

      <v-expansion-panel-text class="panel-content">
        <template v-if="hayResultados">
          <v-row dense>
            <!-- Resultados -->
            <v-col cols="12" md="6">
              <v-card class="marco-logico-card">
                <v-card-title class="d-flex align-center">
                  <v-icon icon="mdi-flag-checkered" class="mr-2" />
                  <span class="card-title">Resultados</span>
                </v-card-title>

                <v-card-text>
                  <v-expansion-panels v-model="panelResultadoAbierto" multiple>
                    <v-expansion-panel
                      v-for="(resultado, index) in props.resultados"
                      :key="resultado.codigo"
                      :value="resultado.codigo"
                    >
                      <v-expansion-panel-title
                        expand-icon="mdi-chevron-down"
                        collapse-icon="mdi-chevron-up"
                      >
                        <v-icon icon="mdi-circle-small" class="mr-2" />
                        {{ resultado.codigo }} - {{ index }}
                        {{ resultado.descripcion.substring(0, 50) }}...
                      </v-expansion-panel-title>

                      <v-expansion-panel-text>
                        <p>{{ resultado.descripcion }}</p>
                        <v-btn
                          size="small"
                          color="primary"
                          @click="seleccionarResultado(resultado)"
                        >
                          Ver Indicadores/Acciones
                        </v-btn>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Indicadores -->
            <v-col cols="12" md="6">
              <v-card class="marco-logico-card">
                <v-card-title class="d-flex align-center">
                  <v-icon icon="mdi-clipboard-list" class="mr-2" />
                  <span class="card-title">Indicadores</span>
                </v-card-title>

                <v-card-text>
                  <div v-if="resultadoSeleccionado">
                    <v-expansion-panels multiple>
                      <template v-if="resultadoSeleccionado.indicadores?.length > 0">
                        <v-expansion-panel
                          v-for="(indicador, idx) in resultadoSeleccionado.indicadores"
                          :key="idx"
                        >
                          <v-expansion-panel-title
                            expand-icon="mdi-chevron-down"
                            collapse-icon="mdi-chevron-up"
                          >
                            <v-icon icon="mdi-chart-line" class="mr-2" />
                            {{ indicador.codigo }} - {{ indicador.redaccion.substring(0, 50) }}...
                          </v-expansion-panel-title>

                          <v-expansion-panel-text>
                            <p><strong>Redacción:</strong> {{ indicador.redaccion }}</p>
                            <p><strong>Fuente:</strong> {{ indicador.fuente_verificacion }}</p>
                            <p><strong>Meta Población:</strong> {{ indicador.target_poblacion }}</p>
                            <p><strong>Línea Base:</strong> {{ indicador.baseline }}</p>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </template>

                      <template v-else>
                        <div class="text-center text-grey">
                          No hay indicadores asociados a este resultado.
                        </div>
                      </template>
                    </v-expansion-panels>
                  </div>

                  <div v-else class="text-center text-grey">
                    Selecciona un resultado para ver sus indicadores.
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Actividades -->
            <v-col cols="12">
              <v-card class="marco-logico-card">
                <v-card-title class="d-flex align-center">
                  <v-icon icon="mdi-playlist-check" class="mr-2" />
                  <span class="card-title">Actividades</span>
                </v-card-title>

                <v-card-text>
                  <div v-if="resultadoSeleccionado">
                    <v-expansion-panels multiple>
                      <template
                        v-if="actividadesDeResultado(resultadoSeleccionado.codigo).length > 0"
                      >
                        <v-expansion-panel
                          v-for="(actividad, idx) in actividadesDeResultado(
                            resultadoSeleccionado.codigo,
                          )"
                          :key="idx"
                        >
                          <v-expansion-panel-title
                            expand-icon="mdi-chevron-down"
                            collapse-icon="mdi-chevron-up"
                          >
                            <v-icon icon="mdi-circle-small" class="mr-2" />
                            {{ actividad.codigo }} - {{ actividad.descripcion.substring(0, 40) }}...
                          </v-expansion-panel-title>

                          <v-expansion-panel-text>
                            <p><strong>Descripción:</strong> {{ actividad.descripcion }}</p>
                            <p>
                              <strong>Tipo:</strong>
                              <v-chip
                                :color="colorActividad(actividad.tipo)"
                                text-color="white"
                                small
                                class="ml-1"
                                variant="flat"
                              >
                                {{ actividad.tipo }}
                              </v-chip>
                            </p>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </template>

                      <template v-else>
                        <div class="text-center text-grey">
                          No hay actividades asociadas a este resultado.
                        </div>
                      </template>
                    </v-expansion-panels>
                  </div>

                  <div v-else class="text-center text-grey">
                    Selecciona un resultado para ver sus actividades.
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>

        <template v-else>
          <div class="text-center text-grey py-10">
            <v-icon size="48" icon="mdi-database-remove" color="grey" class="mb-3" />
            <div>No hay resultados disponibles para mostrar.</div>
          </div>
        </template>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  resultados: { type: Array, required: true },
  actividadesResultados: { type: Array, required: true },
})

const cantidadResultados = computed(() => props.resultados?.length ?? 0)
const hayResultados = computed(() => Array.isArray(props.resultados) && props.resultados.length > 0)

const resultadoSeleccionado = ref(null)
const panelResultadoAbierto = ref([])

const seleccionarResultado = (resultado) => {
  resultadoSeleccionado.value = resultado
}

const actividadesDeResultado = (codigoResultado) => {
  const resultado = props.actividadesResultados.find((r) => r.codigo === codigoResultado)
  return resultado ? resultado.actividades : []
}

const colorActividad = (tipo) => {
  switch (tipo.toLowerCase()) {
    case 'capacitación':
      return 'indigo'
    case 'articulación':
      return 'deep-purple'
    case 'operativa':
      return 'green'
    case 'sensibilización':
      return 'orange'
    default:
      return 'grey'
  }
}
</script>

<style scoped>
.marco-logico-panels {
  border-radius: 8px;
}

.marco-logico-panel {
  margin-bottom: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.marco-logico-panel:hover {
  border-color: rgba(0, 0, 0, 0.12);
}

.marco-logico-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.panel-title,
.card-title {
  font-weight: 600;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.87);
}

.panel-content {
  padding: 16px;
  background-color: #fafafa;
}

.v-btn {
  margin-top: 8px;
}

.v-icon {
  transition: none;
}

.v-chip {
  font-weight: 500;
  letter-spacing: 0.3px;
}

.text-grey {
  color: rgba(0, 0, 0, 0.5);
}

.py-10 {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}

/* Nueva separación entre actividades */
.v-expansion-panel {
  margin-bottom: 8px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}
</style>
