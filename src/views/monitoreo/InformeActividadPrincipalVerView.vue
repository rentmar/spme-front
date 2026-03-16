<template>
  <v-container fluid class="validador-informe-container pa-4">
    <!-- Overlay de carga -->
    <v-overlay :model-value="loading" class="align-center justify-center" persistent>
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
      <p class="mt-4 text-h6">Cargando informe...</p>
    </v-overlay>

    <div v-if="!loading && informeActividadPrincipal">
      <!-- Header con acciones principales -->
      <v-sheet class="header-sheet pa-4 rounded-lg mb-4" elevation="2">
        <v-row>
          <v-col cols="12" md="8">
            <div class="d-flex align-center flex-wrap">
              <v-icon color="primary" size="32" class="mr-3">mdi-file-document</v-icon>
              <div>
                <h1 class="text-h5 font-weight-bold mb-1">
                  {{ informeActividadPrincipal.numeroInforme }}
                </h1>
                <div class="d-flex align-center text-body-2 text-medium-emphasis">
                  <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                  {{ formatDate(informeActividadPrincipal.fechaEjecucion) }}
                  <v-chip size="x-small" class="ml-3" :color="getTipoActividadColor">
                    {{ informeActividadPrincipal.tipoActividad }}
                  </v-chip>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="d-flex justify-end align-center">
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-file-pdf-box"
              @click="generarPDF"
              class="mr-2"
            >
              Descargar PDF
            </v-btn>
            <v-btn
              color="success"
              variant="flat"
              prepend-icon="mdi-check"
              :disabled="yaValido"
              @click="abrirDialogoValidacion"
            >
              Validar
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>

      <!-- Panel de estado de validación (flotante a la derecha) -->
      <v-row>
        <v-col cols="12" lg="9">
          <!-- Pestañas de navegación del informe -->
          <v-tabs v-model="activeTab" bg-color="white" class="rounded-t-lg mb-4" grow>
            <v-tab value="general">
              <v-icon start>mdi-information</v-icon>
              General
            </v-tab>
            <v-tab value="contribucion">
              <v-icon start>mdi-link-variant</v-icon>
              Contribución
            </v-tab>
            <v-tab value="indicadores">
              <v-icon start>mdi-chart-line</v-icon>
              Indicadores
              <v-chip size="x-small" class="ml-2" color="primary">
                {{ totalIndicadores }}
              </v-chip>
            </v-tab>
            <v-tab value="presupuesto">
              <v-icon start>mdi-cash-multiple</v-icon>
              Presupuesto
            </v-tab>
            <v-tab value="evaluacion">
              <v-icon start>mdi-hammer-wrench</v-icon>
              Evaluación
            </v-tab>
          </v-tabs>

          <!-- Contenido de las pestañas (solo lectura) -->
          <v-window v-model="activeTab" class="tab-content">
            <!-- GENERAL -->
            <v-window-item value="general">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card elevation="2" class="h-100">
                    <v-card-title class="bg-primary text-white py-2 text-subtitle-1">
                      <v-icon start dark>mdi-bullseye-arrow</v-icon>
                      Objetivo de la Actividad
                    </v-card-title>
                    <v-card-text class="pa-3">
                      <p class="text-body-2">
                        {{ informeActividadPrincipal.objetivoActividad || 'No especificado' }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="2" class="h-100">
                    <v-card-title class="bg-primary text-white py-2 text-subtitle-1">
                      <v-icon start dark>mdi-file-document-outline</v-icon>
                      Informe de Actividad
                    </v-card-title>
                    <v-card-text class="pa-3">
                      <p class="text-body-2">
                        {{
                          informeActividadPrincipal.informeObjetivoActividad || 'No especificado'
                        }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card elevation="2">
                    <v-card-title class="bg-primary text-white py-2 text-subtitle-1">
                      <v-icon start dark>mdi-clipboard-text</v-icon>
                      Comentarios y Recomendaciones
                    </v-card-title>
                    <v-card-text class="pa-3">
                      <p class="text-body-2">
                        {{
                          informeActividadPrincipal.comentariosRecomendaciones || 'No especificado'
                        }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card elevation="2">
                    <v-card-title class="bg-primary text-white py-2 text-subtitle-1">
                      <v-icon start dark>mdi-check-decagram</v-icon>
                      Medios de Verificación
                    </v-card-title>
                    <v-card-text class="pa-3">
                      <p class="text-body-2">
                        {{ informeActividadPrincipal.mediosVerificacion || 'No especificado' }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- CONTRIBUCIÓN -->
            <v-window-item value="contribucion">
              <v-card elevation="2">
                <v-card-title class="bg-primary text-white py-2 text-subtitle-1">
                  <v-icon start dark>mdi-sitemap</v-icon>
                  Cadena de Contribución al Proyecto
                </v-card-title>
                <v-card-text class="pa-3">
                  <v-timeline density="compact" align="start" class="contribucion-timeline">
                    <!-- Objetivo General -->
                    <v-timeline-item
                      v-if="contribucion?.objetivogeneral"
                      dot-color="primary"
                      size="small"
                    >
                      <div class="mb-3">
                        <div class="d-flex align-center">
                          <strong class="text-primary"
                            >{{ contribucion.objetivogeneral.data.codigo }}:</strong
                          >
                          <v-chip size="x-small" color="primary" class="ml-2"
                            >Objetivo General</v-chip
                          >
                        </div>
                        <p class="text-caption mt-1">
                          {{ contribucion.objetivogeneral.data.descripcion }}
                        </p>
                        <div
                          v-if="contribucion.objetivogeneral.data.contribucion"
                          class="text-caption text-medium-emphasis mt-1"
                        >
                          <v-icon size="x-small" color="primary">mdi-hand-peace</v-icon>
                          {{ contribucion.objetivogeneral.data.contribucion }}
                        </div>
                      </div>
                    </v-timeline-item>

                    <!-- Objetivo Específico -->
                    <v-timeline-item
                      v-if="contribucion?.objetivoespecificoog"
                      dot-color="info"
                      size="small"
                    >
                      <div class="mb-3">
                        <div class="d-flex align-center">
                          <strong class="text-info"
                            >{{ contribucion.objetivoespecificoog.data.codigo }}:</strong
                          >
                          <v-chip size="x-small" color="info" class="ml-2"
                            >Objetivo Específico</v-chip
                          >
                        </div>
                        <p class="text-caption mt-1">
                          {{ contribucion.objetivoespecificoog.data.descripcion }}
                        </p>
                      </div>
                    </v-timeline-item>

                    <!-- Resultado OG -->
                    <v-timeline-item
                      v-if="contribucion?.resultadoog"
                      dot-color="success"
                      size="small"
                    >
                      <div class="mb-3">
                        <div class="d-flex align-center">
                          <strong class="text-success"
                            >{{ contribucion.resultadoog.data.codigo }}:</strong
                          >
                          <v-chip size="x-small" color="success" class="ml-2">Resultado OG</v-chip>
                        </div>
                        <p class="text-caption mt-1">
                          {{ contribucion.resultadoog.data.descripcion }}
                        </p>
                      </div>
                    </v-timeline-item>

                    <!-- Resultado OE -->
                    <v-timeline-item
                      v-if="contribucion?.resultadooe"
                      dot-color="warning"
                      size="small"
                    >
                      <div class="mb-3">
                        <div class="d-flex align-center">
                          <strong class="text-warning"
                            >{{ contribucion.resultadooe.data.codigo }}:</strong
                          >
                          <v-chip size="x-small" color="warning" class="ml-2">Resultado OE</v-chip>
                        </div>
                        <p class="text-caption mt-1">
                          {{ contribucion.resultadooe.data.descripcion }}
                        </p>
                      </div>
                    </v-timeline-item>

                    <!-- Producto OE -->
                    <v-timeline-item
                      v-if="contribucion?.productooe"
                      dot-color="orange"
                      size="small"
                    >
                      <div class="mb-3">
                        <div class="d-flex align-center">
                          <strong class="text-orange"
                            >{{ contribucion.productooe.data.codigo }}:</strong
                          >
                          <v-chip size="x-small" color="orange" class="ml-2">Producto OE</v-chip>
                        </div>
                        <p class="text-caption mt-1">
                          {{ contribucion.productooe.data.descripcion }}
                        </p>
                        <v-chip
                          size="x-small"
                          :color="contribucion.productooe.data.entregado ? 'success' : 'warning'"
                          class="mt-1"
                        >
                          {{
                            contribucion.productooe.data.entregado ? 'Entregado' : 'No entregado'
                          }}
                        </v-chip>
                      </div>
                    </v-timeline-item>

                    <!-- Producto ROE -->
                    <v-timeline-item
                      v-if="contribucion?.productoroe"
                      dot-color="purple"
                      size="small"
                    >
                      <div class="mb-3">
                        <div class="d-flex align-center">
                          <strong class="text-purple"
                            >{{ contribucion.productoroe.data.codigo }}:</strong
                          >
                          <v-chip size="x-small" color="purple" class="ml-2">Producto ROE</v-chip>
                        </div>
                        <p class="text-caption mt-1">
                          {{ contribucion.productoroe.data.descripcion }}
                        </p>
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- INDICADORES -->
            <v-window-item value="indicadores">
              <v-card elevation="2">
                <v-card-title class="bg-primary text-white py-2 text-subtitle-1">
                  <v-icon start dark>mdi-chart-line</v-icon>
                  Indicadores de Avance
                </v-card-title>
                <v-card-text class="pa-3">
                  <v-expansion-panels variant="accordion">
                    <!-- Indicadores OG -->
                    <v-expansion-panel v-if="indicadores.indicadorog?.length">
                      <v-expansion-panel-title class="text-subtitle-2">
                        Objetivo General ({{ indicadores.indicadorog.length }})
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <div
                          v-for="ind in indicadores.indicadorog"
                          :key="ind.id"
                          class="indicador-item mb-2"
                        >
                          <div class="d-flex justify-space-between">
                            <span class="text-caption font-weight-bold"
                              >ID: {{ ind.id_indicador }}</span
                            >
                            <v-chip size="x-small" :color="getTipoDatoColor(ind.tipo_dato)">
                              {{ ind.tipo_dato }}
                            </v-chip>
                          </div>
                          <div class="font-weight-bold text-h6">{{ getValorIndicador(ind) }}</div>
                          <div class="text-caption">{{ ind.observaciones }}</div>
                          <div class="text-caption text-medium-emphasis">
                            Registrado por: {{ ind.registrado_por }}
                          </div>
                          <div class="text-caption text-medium-emphasis">
                            Fecha: {{ formatDate(ind.fecha_registro) }}
                          </div>
                        </div>
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <!-- Indicadores OE -->
                    <v-expansion-panel v-if="indicadores.indicadoroe?.length">
                      <v-expansion-panel-title class="text-subtitle-2">
                        Objetivo Específico ({{ indicadores.indicadoroe.length }})
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <div
                          v-for="ind in indicadores.indicadoroe"
                          :key="ind.id"
                          class="indicador-item mb-2"
                        >
                          <div class="d-flex justify-space-between">
                            <span class="text-caption font-weight-bold"
                              >ID: {{ ind.id_indicador }}</span
                            >
                            <v-chip size="x-small" :color="getTipoDatoColor(ind.tipo_dato)">
                              {{ ind.tipo_dato }}
                            </v-chip>
                          </div>
                          <div class="font-weight-bold text-h6">{{ getValorIndicador(ind) }}</div>
                          <div class="text-caption">{{ ind.observaciones }}</div>
                          <div class="text-caption text-medium-emphasis">
                            Registrado por: {{ ind.registrado_por }}
                          </div>
                        </div>
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <!-- Indicadores ROG -->
                    <v-expansion-panel v-if="indicadores.indicadorrog?.length">
                      <v-expansion-panel-title class="text-subtitle-2">
                        Resultado OG ({{ indicadores.indicadorrog.length }})
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <div
                          v-for="ind in indicadores.indicadorrog"
                          :key="ind.id"
                          class="indicador-item mb-2"
                        >
                          <div class="d-flex justify-space-between">
                            <span class="text-caption font-weight-bold"
                              >ID: {{ ind.id_indicador }}</span
                            >
                            <v-chip size="x-small" color="success">{{ ind.tipo_dato }}</v-chip>
                          </div>
                          <div class="font-weight-bold text-h6">{{ ind.valor_porcentual }}%</div>
                          <div class="text-caption">{{ ind.observaciones }}</div>
                          <div class="text-caption text-medium-emphasis">
                            Registrado por: {{ ind.registrado_por }}
                          </div>
                        </div>
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <!-- Indicadores ROE -->
                    <v-expansion-panel v-if="indicadores.indicadorroe?.length">
                      <v-expansion-panel-title class="text-subtitle-2">
                        Resultado OE ({{ indicadores.indicadorroe.length }})
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <div
                          v-for="ind in indicadores.indicadorroe"
                          :key="ind.id"
                          class="indicador-item mb-2"
                        >
                          <div class="d-flex justify-space-between">
                            <span class="text-caption font-weight-bold"
                              >ID: {{ ind.id_indicador }}</span
                            >
                            <v-chip size="x-small" color="success">{{ ind.tipo_dato }}</v-chip>
                          </div>
                          <div class="font-weight-bold text-h6">{{ ind.valor_porcentual }}%</div>
                          <div class="text-caption">{{ ind.observaciones }}</div>
                          <div class="text-caption text-medium-emphasis">
                            Registrado por: {{ ind.registrado_por }}
                          </div>
                        </div>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- PRESUPUESTO -->
            <v-window-item value="presupuesto">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card elevation="2" class="h-100">
                    <v-card-title class="bg-primary text-white py-2 text-subtitle-1">
                      <v-icon start dark>mdi-cash-multiple</v-icon>
                      Resumen de Presupuesto
                    </v-card-title>
                    <v-card-text class="pa-3">
                      <div class="text-center mb-4">
                        <div class="text-h4 font-weight-bold text-primary">
                          Bs{{ formatNumber(informeActividadPrincipal.presupuestoEjecutado) }}
                        </div>
                        <div class="text-subtitle-1">
                          de Bs{{ formatNumber(informeActividadPrincipal.presupuestoPlanificado) }}
                        </div>
                        <v-progress-linear
                          :model-value="porcentajeEjecucion"
                          color="success"
                          height="10"
                          rounded
                          class="mt-3"
                        ></v-progress-linear>
                        <div class="text-caption mt-1">
                          {{ porcentajeEjecucion.toFixed(2) }}% ejecutado
                        </div>
                      </div>

                      <v-divider class="my-3"></v-divider>

                      <div class="text-subtitle-2 mb-2">Observaciones:</div>
                      <p class="text-body-2">
                        {{
                          informeActividadPrincipal.observacionesPresupuesto || 'Sin observaciones'
                        }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card elevation="2" class="h-100">
                    <v-card-title class="bg-primary text-white py-2 text-subtitle-1">
                      <v-icon start dark>mdi-bank</v-icon>
                      Distribución por Fondos
                    </v-card-title>
                    <v-card-text class="pa-3">
                      <div v-if="fondos?.fondosCompletos?.length">
                        <div
                          v-for="fondo in fondos.fondosCompletos"
                          :key="fondo.id"
                          class="fondo-item mb-3"
                        >
                          <div class="d-flex justify-space-between align-center">
                            <div>
                              <span class="font-weight-medium">{{ fondo.nombre }}</span>
                              <v-chip
                                v-if="fondo.verificado"
                                size="x-small"
                                color="success"
                                class="ml-2"
                              >
                                Verificado
                              </v-chip>
                            </div>
                            <span class="font-weight-bold"
                              >Bs{{ formatNumber(fondo.montoEjecutado) }}</span
                            >
                          </div>
                          <div
                            class="d-flex justify-space-between text-caption text-medium-emphasis"
                          >
                            <span>Planificado: Bs{{ formatNumber(fondo.monto) }}</span>
                            <span
                              >{{ ((fondo.montoEjecutado / fondo.monto) * 100).toFixed(1) }}%</span
                            >
                          </div>
                          <v-progress-linear
                            :model-value="(fondo.montoEjecutado / fondo.monto) * 100"
                            color="info"
                            height="4"
                            rounded
                            class="mt-1"
                          ></v-progress-linear>
                        </div>

                        <v-divider class="my-3"></v-divider>

                        <div class="d-flex justify-space-between font-weight-bold">
                          <span>Total Ejecutado:</span>
                          <span>Bs{{ formatNumber(fondos.totalEjecutado) }}</span>
                        </div>
                        <div class="d-flex justify-space-between text-caption text-medium-emphasis">
                          <span>Total Planificado:</span>
                          <span>Bs{{ formatNumber(fondos.totalPlanificado) }}</span>
                        </div>

                        <div v-if="fondos.observaciones" class="mt-3 text-caption">
                          <v-icon size="x-small" color="info">mdi-information</v-icon>
                          {{ fondos.observaciones }}
                        </div>
                      </div>
                      <div v-else class="text-center text-medium-emphasis py-4">
                        No hay información de fondos
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- EVALUACIÓN -->
            <v-window-item value="evaluacion">
              <v-card elevation="2">
                <v-card-title class="bg-primary text-white py-2 text-subtitle-1">
                  <v-icon start dark>mdi-hammer-wrench</v-icon>
                  Herramientas de Evaluación
                </v-card-title>
                <v-card-text class="pa-3">
                  <div v-if="herramientas?.datosCompletos?.herramientas?.length">
                    <v-row>
                      <v-col
                        v-for="(herramienta, idx) in herramientas.datosCompletos.herramientas"
                        :key="herramienta.id"
                        cols="12"
                        md="6"
                      >
                        <v-card variant="outlined" class="pa-3">
                          <div class="d-flex align-center mb-2">
                            <v-icon color="info" class="mr-2">mdi-tools</v-icon>
                            <span class="font-weight-bold">{{ herramienta.descripcion }}</span>
                          </div>
                          <div class="text-caption ml-1 mb-1">
                            <span class="text-medium-emphasis">Resultado:</span>
                            {{ herramienta.resultado }}
                          </div>
                          <div class="text-caption ml-1">
                            <span class="text-medium-emphasis">Evidencias:</span>
                            {{ herramienta.archivos?.length || 0 }}
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                    <div class="mt-3 text-caption text-medium-emphasis">
                      Total herramientas:
                      {{ herramientas.datosCompletos.resumen.totalHerramientas }}
                    </div>
                  </div>
                  <div v-else class="text-center text-medium-emphasis py-4">
                    No hay herramientas de evaluación registradas
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>

        <!-- Panel lateral de validación (flotante) -->
        <v-col cols="12" lg="3">
          <v-card elevation="4" class="validation-sidebar sticky-top">
            <v-card-title class="bg-primary text-white py-3">
              <v-icon start dark>mdi-account-check</v-icon>
              Estado de Validación
              <v-spacer></v-spacer>
              <v-chip color="white" text-color="primary" size="small">
                v{{ estadoValidacion?.version_actual || '1' }}
              </v-chip>
            </v-card-title>

            <v-card-text class="pa-4">
              <!-- Resumen de validaciones -->
              <div class="text-center mb-4">
                <v-chip
                  :color="getEstadoConsolidadoColor"
                  size="large"
                  class="font-weight-bold mb-3"
                  label
                >
                  <v-icon start :icon="getEstadoConsolidadoIcon"></v-icon>
                  {{ estadoValidacion?.estado_consolidado || 'SIN ESTADO' }}
                </v-chip>

                <v-row class="mt-2">
                  <v-col cols="3" class="pa-1">
                    <div class="text-center">
                      <div class="text-h6">
                        {{ estadoValidacion?.resumen?.total_validadores || 0 }}
                      </div>
                      <div class="text-caption">Total</div>
                    </div>
                  </v-col>
                  <v-col cols="3" class="pa-1">
                    <div class="text-center">
                      <div class="text-h6 text-warning">
                        {{ estadoValidacion?.resumen?.pendientes || 0 }}
                      </div>
                      <div class="text-caption">Pend.</div>
                    </div>
                  </v-col>
                  <v-col cols="3" class="pa-1">
                    <div class="text-center">
                      <div class="text-h6 text-success">
                        {{ estadoValidacion?.resumen?.aprobados || 0 }}
                      </div>
                      <div class="text-caption">Aprob.</div>
                    </div>
                  </v-col>
                  <v-col cols="3" class="pa-1">
                    <div class="text-center">
                      <div class="text-h6 text-error">
                        {{ estadoValidacion?.resumen?.rechazados || 0 }}
                      </div>
                      <div class="text-caption">Rech.</div>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <v-divider class="my-3"></v-divider>

              <!-- Lista de validadores -->
              <div class="text-subtitle-2 mb-2">Validadores asignados:</div>
              <div class="validadores-list" style="max-height: 300px; overflow-y: auto">
                <div
                  v-for="val in estadoValidacion?.validaciones"
                  :key="val.id"
                  class="validador-item mb-2 pa-2 rounded"
                  :class="`val-${val.estado.toLowerCase()}`"
                >
                  <div class="d-flex align-center">
                    <v-avatar size="32" color="grey-lighten-2" class="mr-2">
                      <span class="text-caption">{{ getIniciales(val.validador_nombre) }}</span>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium">{{ val.validador_nombre }}</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ val.codigoSeguimiento }}
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between align-center mt-1">
                    <v-chip size="x-small" :color="getEstadoValColor(val.estado)">
                      {{ val.estado_display }}
                    </v-chip>
                    <span class="text-caption text-medium-emphasis">
                      {{ val.fechaResolucion ? formatDate(val.fechaResolucion) : 'Pendiente' }}
                    </span>
                  </div>
                  <div
                    v-if="val.comentarios && val.comentarios !== 'Nueva Entrada'"
                    class="text-caption mt-1 pa-2 bg-grey-lighten-4 rounded"
                  >
                    <v-icon size="x-small" class="mr-1">mdi-comment</v-icon>
                    {{ val.comentarios }}
                  </div>
                </div>
              </div>

              <v-divider class="my-3"></v-divider>

              <!-- Tu validación actual -->
              <div class="text-subtitle-2 mb-2">Tu validación:</div>
              <div
                v-if="miValidacion"
                class="pa-3 rounded"
                :class="`val-${miValidacion.estado.toLowerCase()}`"
              >
                <div class="d-flex align-center mb-2">
                  <v-avatar size="28" color="primary" class="mr-2">
                    <span class="text-white text-caption">{{
                      getIniciales(miValidacion.validador_nombre)
                    }}</span>
                  </v-avatar>
                  <span class="font-weight-medium">{{ miValidacion.validador_nombre }}</span>
                </div>
                <v-chip size="small" :color="getEstadoValColor(miValidacion.estado)" class="mb-2">
                  {{ miValidacion.estado_display }}
                </v-chip>
                <div
                  v-if="miValidacion.comentarios && miValidacion.comentarios !== 'Nueva Entrada'"
                  class="text-caption mt-1"
                >
                  {{ miValidacion.comentarios }}
                </div>
                <div v-else class="text-caption text-medium-emphasis">Sin comentarios</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Diálogo de validación -->
      <v-dialog v-model="dialogValidacion" max-width="500px" persistent>
        <v-card>
          <v-card-title class="bg-primary text-white">
            <v-icon start dark>mdi-check-circle</v-icon>
            Validar Documento
          </v-card-title>

          <v-card-text class="pa-4">
            <p class="text-body-2 mb-4">Por favor, selecciona el resultado de tu validación:</p>

            <v-radio-group v-model="accionValidacion" class="mb-4">
              <v-radio label="Aprobar documento" value="aprobar" color="success"></v-radio>
              <v-radio
                label="Rechazar documento (solicitar correcciones)"
                value="rechazar"
                color="error"
              ></v-radio>
            </v-radio-group>

            <v-textarea
              v-model="comentarioValidacion"
              :label="
                accionValidacion === 'rechazar' ? 'Motivo del rechazo *' : 'Comentarios (opcional)'
              "
              :placeholder="
                accionValidacion === 'rechazar'
                  ? 'Indica las correcciones necesarias...'
                  : 'Agrega algún comentario...'
              "
              :rules="
                accionValidacion === 'rechazar' ? [(v) => !!v || 'El motivo es requerido'] : []
              "
              variant="outlined"
              rows="4"
              auto-grow
              counter
              maxlength="500"
              class="mt-2"
            ></v-textarea>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="cerrarDialogoValidacion"> Cancelar </v-btn>
            <v-btn
              :color="accionValidacion === 'aprobar' ? 'success' : 'error'"
              variant="flat"
              :loading="enviandoValidacion"
              :disabled="!puedeEnviarValidacion"
              @click="enviarValidacion"
            >
              {{ accionValidacion === 'aprobar' ? 'Aprobar' : 'Rechazar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- Error -->
    <v-alert v-if="error" type="error" variant="tonal" class="mt-4">
      {{ error }}
      <v-btn color="error" variant="text" @click="cargarDatos" class="ml-2"> Reintentar </v-btn>
    </v-alert>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useInformeActividadPrincipal } from '@/modules/formularios/composables/useInformeActividadPrincipal'
import { useValidadores } from '@/modules/formularios/composables/useValidadores'
import { useRouter, useRoute } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'

// Router
const router = useRouter()
const route = useRoute()
const idInfActividad = route.params.id
const { successMsg, errorMsg } = useSnackbar()

// Composables
const { informeActividadPrincipal, obtenerInformeActividadPrincipalPorId } =
  useInformeActividadPrincipal()

const { estadoValidacionInformeActividadPrincipal } = useValidadores()

// Estado
const estadoValidacion = ref(null)
const loading = ref(false)
const error = ref(null)
const activeTab = ref('general')

// Estado del diálogo de validación
const dialogValidacion = ref(false)
const accionValidacion = ref('aprobar')
const comentarioValidacion = ref('')
const enviandoValidacion = ref(false)

// Computed properties para datos anidados
const contribucion = computed(
  () => informeActividadPrincipal.value?.contribucionProyecto?.caberaContribucion,
)
const indicadores = computed(() => informeActividadPrincipal.value?.avanceIndicadores || {})
const herramientas = computed(() => informeActividadPrincipal.value?.herramientasEvaluacion)
const fondos = computed(() => informeActividadPrincipal.value?.procedenciaFondos)

const totalIndicadores = computed(() => indicadores.value?.metadatos?.total_general || 0)

const porcentajeEjecucion = computed(() => {
  const planificado = parseFloat(informeActividadPrincipal.value?.presupuestoPlanificado) || 0
  const ejecutado = parseFloat(informeActividadPrincipal.value?.presupuestoEjecutado) || 0
  return planificado > 0 ? (ejecutado / planificado) * 100 : 0
})

// Validación del usuario actual (simulado - en producción vendría del auth)
const usuarioActualId = 51 // Ejemplo: Mery Margarita Vaca Villa

const miValidacion = computed(() => {
  return estadoValidacion.value?.validaciones?.find((v) => v.usuarioValidador === usuarioActualId)
})

const yaValido = computed(() => {
  return miValidacion.value?.estado !== 'PENDIENTE'
})

const puedeEnviarValidacion = computed(() => {
  if (accionValidacion.value === 'rechazar') {
    return comentarioValidacion.value?.trim().length > 0
  }
  return true // Para aprobar no es obligatorio comentario
})

const getEstadoConsolidadoColor = computed(() => {
  const estado = estadoValidacion.value?.estado_consolidado
  const colores = {
    APROBADO: 'success',
    RECHAZADO: 'error',
    EN_VALIDACION: 'warning',
    PENDIENTE: 'grey',
    EN_CORRECCION: 'info',
  }
  return colores[estado] || 'grey'
})

const getEstadoConsolidadoIcon = computed(() => {
  const estado = estadoValidacion.value?.estado_consolidado
  const iconos = {
    APROBADO: 'mdi-check-circle',
    RECHAZADO: 'mdi-close-circle',
    EN_VALIDACION: 'mdi-clock-outline',
    PENDIENTE: 'mdi-clock',
    EN_CORRECCION: 'mdi-pencil',
  }
  return iconos[estado] || 'mdi-help-circle'
})

// Métodos
const cargarDatos = async () => {
  loading.value = true
  error.value = null
  try {
    const [, validacion] = await Promise.all([
      obtenerInformeActividadPrincipalPorId(idInfActividad),
      estadoValidacionInformeActividadPrincipal(idInfActividad),
    ])
    estadoValidacion.value = validacion
  } catch (err) {
    error.value = 'No se pudo cargar la información'
    console.error('Error cargando datos:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const formatNumber = (num) => {
  const number = parseFloat(num) || 0
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const getIniciales = (nombre) => {
  if (!nombre) return '??'
  return nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const getValorIndicador = (indicador) => {
  if (indicador.valor_numerico !== null && indicador.valor_numerico !== undefined) {
    return indicador.valor_numerico
  }
  if (indicador.valor_literal) {
    return indicador.valor_literal
  }
  if (indicador.valor_porcentual) {
    return `${indicador.valor_porcentual}%`
  }
  return 'Sin valor'
}

const getTipoActividadColor = computed(() => {
  const tipo = informeActividadPrincipal.value?.tipoActividad || ''
  if (tipo.includes('CAP')) return 'info'
  if (tipo.includes('INV')) return 'success'
  if (tipo.includes('ADM')) return 'warning'
  return 'primary'
})

const getTipoDatoColor = (tipo) => {
  const colores = {
    '1-9': 'info',
    'A-Z': 'purple',
    '%': 'success',
  }
  return colores[tipo] || 'grey'
}

const getEstadoValColor = (estado) => {
  const colores = {
    APROBADO: 'success',
    RECHAZADO: 'error',
    PENDIENTE: 'warning',
    EN_CORRECCION: 'info',
  }
  return colores[estado] || 'grey'
}

// Acciones de validación
const abrirDialogoValidacion = () => {
  if (yaValido.value) {
    errorMsg('Ya has realizado tu validación para este documento')
    return
  }
  accionValidacion.value = 'aprobar'
  comentarioValidacion.value = ''
  dialogValidacion.value = true
}

const cerrarDialogoValidacion = () => {
  dialogValidacion.value = false
  accionValidacion.value = 'aprobar'
  comentarioValidacion.value = ''
}

const enviarValidacion = async () => {
  if (!puedeEnviarValidacion.value) return

  enviandoValidacion.value = true
  try {
    // Aquí iría la llamada a la API para guardar la validación
    // const resultado = await enviarValidacionInforme({
    //   documento_id: idInfActividad,
    //   accion: accionValidacion.value,
    //   comentarios: comentarioValidacion.value
    // })

    // Simulamos éxito
    await new Promise((resolve) => setTimeout(resolve, 1500))

    successMsg(
      `Documento ${accionValidacion.value === 'aprobar' ? 'aprobado' : 'rechazado'} correctamente`,
    )
    cerrarDialogoValidacion()

    // Recargar datos para actualizar estado
    await cargarDatos()
  } catch (err) {
    errorMsg('Error al enviar la validación')
    console.error('Error:', err)
  } finally {
    enviandoValidacion.value = false
  }
}

const generarPDF = () => {
  successMsg('Generando PDF...')
  // Aquí iría la lógica de generación de PDF
}

// Inicialización
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.validador-informe-container {
  background: #f5f5f5;
  min-height: 100vh;
}

.header-sheet {
  background: white;
  border-left: 4px solid #1976d2;
}

.sticky-top {
  position: sticky;
  top: 20px;
}

.indicador-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #1976d2;
}

.validador-item {
  background: #f8f9fa;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.val-pendiente {
  border-left-color: #ff9800;
  background: #fff3e0;
}

.val-aprobado {
  border-left-color: #4caf50;
  background: #e8f5e9;
}

.val-rechazado {
  border-left-color: #f44336;
  background: #ffebee;
}

.val-en_correccion {
  border-left-color: #2196f3;
  background: #e3f2fd;
}

.fondo-item {
  padding: 8px;
  background: #f8f9fa;
  border-radius: 8px;
}

.contribucion-timeline :deep(.v-timeline-item__body) {
  padding-bottom: 16px;
}

/* Scroll personalizado */
.validadores-list::-webkit-scrollbar {
  width: 4px;
}

.validadores-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.validadores-list::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

.validadores-list::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}
</style>
