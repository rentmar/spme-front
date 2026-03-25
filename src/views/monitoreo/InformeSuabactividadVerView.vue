<template>
  <v-container fluid class="informe-subactividad-container pa-6">
    <!-- Overlay de carga -->
    <v-overlay :model-value="loading" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando informe de subactividad...</p>
      </div>
    </v-overlay>

    <div v-if="!loading && informeTareaPrincipal" class="documento-administracion">
      <!-- Titulo de la pagina -->
      <PaginaTituloIcono
        :titulo="'Informe de Subactividad/Tarea'"
        :icon="'mdi-file-document-multiple'"
      ></PaginaTituloIcono>

      <!-- Header con acciones -->
      <v-sheet class="acciones-sheet mb-6" elevation="1" rounded="lg">
        <v-row class="pa-4">
          <v-col cols="12" md="8" class="d-flex align-center">
            <v-chip :color="getTipoActividadColor" size="small" class="mr-3">
              {{ informeTareaPrincipal.tipoActividad || 'No especificado' }}
            </v-chip>
            <span class="text-body-2 text-medium-emphasis">
              <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
              Fecha de ejecución: {{ formatDate(informeTareaPrincipal.fechaEjecucion) }}
            </span>
          </v-col>
          <v-col cols="12" md="4" class="d-flex justify-end gap-2">
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-file-pdf-box"
              :loading="generarPdf"
              :disabled="generarPdf"
              @click="generarPDF"
              size="small"
            >
              Exportar PDF
            </v-btn>
            <v-btn
              color="success"
              variant="flat"
              prepend-icon="mdi-check"
              @click="abrirDialogoValidacion"
              size="small"
            >
              Validar Informe
            </v-btn>
            <v-btn
              color="error"
              variant="flat"
              prepend-icon="mdi-cancel"
              size="small"
              @click="salirFormulario"
            >
              Salir
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>

      <!-- Contenido del formulario -->
      <v-row>
        <v-col cols="12" lg="9">
          <!-- Tarjeta principal del informe -->
          <v-card class="tarjeta-informe" elevation="2" rounded="lg">
            <!-- Cabecera del informe -->
            <div class="pa-4 border-bottom">
              <div class="d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                  <v-icon color="primary" size="28" class="mr-2">mdi-file-document</v-icon>
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">
                      INFORME DE SUBACTIVIDAD/TAREA
                    </div>
                    <div class="text-caption text-grey">
                      {{ informeTareaPrincipal.numeroInforme }}
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-caption text-grey">Fecha de ejecución</div>
                  <div class="font-weight-medium">
                    {{ formatDate(informeTareaPrincipal.fechaEjecucion) }}
                  </div>
                </div>
              </div>
            </div>

            <v-card-text class="pa-4">
              <!-- SECCIÓN 1: INFORMACIÓN GENERAL DE LA SUBACTIVIDAD -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                  1. INFORMACIÓN GENERAL DE LA SUBACTIVIDAD
                </h3>

                <v-row class="mt-2">
                  <v-col cols="12" class="campo-formulario">
                    <div class="campo-etiqueta">Objetivo de la Subactividad/Tarea</div>
                    <div class="campo-valor campo-texto-largo">
                      {{ informeTareaPrincipal.objetivoTarea || 'No especificado' }}
                    </div>
                  </v-col>
                  <v-col cols="12" class="campo-formulario">
                    <div class="campo-etiqueta">Informe de Cumplimiento del Objetivo</div>
                    <div class="campo-valor campo-texto-largo">
                      {{ informeTareaPrincipal.informeObjetivoTarea || 'No especificado' }}
                    </div>
                  </v-col>
                </v-row>
              </div>

              <!-- SECCIÓN 2: CONTRIBUCIÓN AL PROYECTO -->
              <div v-if="contribucion" class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-link-variant</v-icon>
                  2. CADENA DE CONTRIBUCIÓN AL PROYECTO
                </h3>

                <div class="contribucion-grid mt-3">
                  <!-- Objetivo General -->
                  <div v-if="contribucion?.objetivogeneral" class="contribucion-item nivel-1">
                    <div class="contribucion-header">
                      <span class="contribucion-codigo">{{
                        contribucion.objetivogeneral.data.codigo
                      }}</span>
                      <v-chip size="x-small" color="primary" class="contribucion-chip">OG</v-chip>
                    </div>
                    <div class="contribucion-descripcion">
                      {{ contribucion.objetivogeneral.data.descripcion }}
                    </div>
                    <div
                      v-if="contribucion.objetivogeneral.data.contribucion"
                      class="contribucion-aporte"
                    >
                      <v-icon size="x-small" color="primary">mdi-hand-peace</v-icon>
                      {{ contribucion.objetivogeneral.data.contribucion }}
                    </div>
                  </div>

                  <!-- Objetivo Específico -->
                  <div v-if="contribucion?.objetivoespecificoog" class="contribucion-item nivel-2">
                    <div class="contribucion-header">
                      <span class="contribucion-codigo">{{
                        contribucion.objetivoespecificoog.data.codigo
                      }}</span>
                      <v-chip size="x-small" color="info" class="contribucion-chip">OE</v-chip>
                    </div>
                    <div class="contribucion-descripcion">
                      {{ contribucion.objetivoespecificoog.data.descripcion }}
                    </div>
                    <div
                      v-if="contribucion.objetivoespecificoog.data.contribucion"
                      class="contribucion-aporte"
                    >
                      <v-icon size="x-small" color="info">mdi-hand-peace</v-icon>
                      {{ contribucion.objetivoespecificoog.data.contribucion }}
                    </div>
                  </div>

                  <!-- Resultado Objetivo General -->
                  <div v-if="contribucion?.resultadoog" class="contribucion-item nivel-3">
                    <div class="contribucion-header">
                      <span class="contribucion-codigo">{{
                        contribucion.resultadoog.data.codigo
                      }}</span>
                      <v-chip size="x-small" color="success" class="contribucion-chip">R·OG</v-chip>
                    </div>
                    <div class="contribucion-descripcion">
                      {{ contribucion.resultadoog.data.descripcion }}
                    </div>
                    <div
                      v-if="contribucion.resultadoog.data.contribucion"
                      class="contribucion-aporte"
                    >
                      <v-icon size="x-small" color="success">mdi-hand-peace</v-icon>
                      {{ contribucion.resultadoog.data.contribucion }}
                    </div>
                  </div>

                  <!-- Resultado Objetivo Específico -->
                  <div v-if="contribucion?.resultadooe" class="contribucion-item nivel-3">
                    <div class="contribucion-header">
                      <span class="contribucion-codigo">{{
                        contribucion.resultadooe.data.codigo
                      }}</span>
                      <v-chip size="x-small" color="warning" class="contribucion-chip">R·OE</v-chip>
                    </div>
                    <div class="contribucion-descripcion">
                      {{ contribucion.resultadooe.data.descripcion }}
                    </div>
                    <div
                      v-if="contribucion.resultadooe.data.contribucion"
                      class="contribucion-aporte"
                    >
                      <v-icon size="x-small" color="warning">mdi-hand-peace</v-icon>
                      {{ contribucion.resultadooe.data.contribucion }}
                    </div>
                  </div>

                  <!-- Producto Objetivo Específico -->
                  <div v-if="contribucion?.productooe" class="contribucion-item nivel-4">
                    <div class="contribucion-header">
                      <span class="contribucion-codigo">{{
                        contribucion.productooe.data.codigo
                      }}</span>
                      <v-chip size="x-small" color="orange" class="contribucion-chip">P·OE</v-chip>
                    </div>
                    <div class="contribucion-descripcion">
                      {{ contribucion.productooe.data.descripcion }}
                    </div>
                    <div
                      v-if="contribucion.productooe.data.contribucion"
                      class="contribucion-aporte"
                    >
                      <v-icon size="x-small" color="orange">mdi-hand-peace</v-icon>
                      {{ contribucion.productooe.data.contribucion }}
                    </div>
                    <div v-if="contribucion.productooe.data.entregado" class="contribucion-estado">
                      <v-icon size="x-small" color="success">mdi-check-circle</v-icon> Entregado
                    </div>
                    <div v-else class="contribucion-estado">
                      <v-icon size="x-small" color="warning">mdi-clock-outline</v-icon> No entregado
                    </div>
                  </div>

                  <!-- Producto Resultado Objetivo Específico -->
                  <div v-if="contribucion?.productoroe" class="contribucion-item nivel-4">
                    <div class="contribucion-header">
                      <span class="contribucion-codigo">{{
                        contribucion.productoroe.data.codigo
                      }}</span>
                      <v-chip size="x-small" color="purple" class="contribucion-chip">P·ROE</v-chip>
                    </div>
                    <div class="contribucion-descripcion">
                      {{ contribucion.productoroe.data.descripcion }}
                    </div>
                    <div
                      v-if="contribucion.productoroe.data.contribucion"
                      class="contribucion-aporte"
                    >
                      <v-icon size="x-small" color="purple">mdi-hand-peace</v-icon>
                      {{ contribucion.productoroe.data.contribucion }}
                    </div>
                    <div v-if="contribucion.productoroe.data.entregado" class="contribucion-estado">
                      <v-icon size="x-small" color="success">mdi-check-circle</v-icon> Entregado
                    </div>
                    <div v-else class="contribucion-estado">
                      <v-icon size="x-small" color="warning">mdi-clock-outline</v-icon> No entregado
                    </div>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN 3: INDICADORES DE AVANCE -->
              <div v-if="indicadores && totalIndicadores > 0" class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
                  3. INDICADORES DE AVANCE ({{ totalIndicadores }})
                </h3>

                <div class="indicadores-container mt-3">
                  <!-- Indicadores de Objetivo General -->
                  <div v-if="indicadores.indicadorog?.length" class="indicador-grupo mb-4">
                    <div class="indicador-grupo-titulo">Indicadores - Objetivo General</div>
                    <v-row>
                      <v-col v-for="ind in indicadores.indicadorog" :key="ind.id" cols="12" md="6">
                        <div class="indicador-card">
                          <div class="d-flex justify-space-between align-start">
                            <span class="indicador-id">ID: {{ ind.id_indicador }}</span>
                            <v-chip size="x-small" :color="getTipoDatoColor(ind.tipo_dato)">
                              {{ ind.tipo_dato }}
                            </v-chip>
                          </div>
                          <div class="indicador-valor">{{ getValorIndicador(ind) }}</div>
                          <div class="indicador-obs">{{ ind.observaciones }}</div>
                          <div class="indicador-meta">
                            Reg: {{ ind.registrado_por }} | {{ formatDate(ind.fecha_registro) }}
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Indicadores de Objetivo Específico -->
                  <div v-if="indicadores.indicadoroe?.length" class="indicador-grupo mb-4">
                    <div class="indicador-grupo-titulo">Indicadores - Objetivo Específico</div>
                    <v-row>
                      <v-col v-for="ind in indicadores.indicadoroe" :key="ind.id" cols="12" md="6">
                        <div class="indicador-card">
                          <div class="d-flex justify-space-between align-start">
                            <span class="indicador-id">ID: {{ ind.id_indicador }}</span>
                            <v-chip size="x-small" :color="getTipoDatoColor(ind.tipo_dato)">
                              {{ ind.tipo_dato }}
                            </v-chip>
                          </div>
                          <div class="indicador-valor">{{ getValorIndicador(ind) }}</div>
                          <div class="indicador-obs">{{ ind.observaciones }}</div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Indicadores de Resultados (compactos) -->
                  <v-row>
                    <v-col cols="12" md="6" v-if="indicadores.indicadorrog?.length">
                      <div class="indicador-grupo-titulo small">Indicadores - Resultados OG</div>
                      <div
                        v-for="ind in indicadores.indicadorrog"
                        :key="ind.id"
                        class="indicador-compacto"
                      >
                        <div class="d-flex justify-space-between">
                          <span>ID: {{ ind.id_indicador }}</span>
                          <span class="font-weight-bold">{{ ind.valor_porcentual }}%</span>
                        </div>
                        <div class="text-caption text-medium-emphasis">{{ ind.observaciones }}</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6" v-if="indicadores.indicadorroe?.length">
                      <div class="indicador-grupo-titulo small">Indicadores - Resultados OE</div>
                      <div
                        v-for="ind in indicadores.indicadorroe"
                        :key="ind.id"
                        class="indicador-compacto"
                      >
                        <div class="d-flex justify-space-between">
                          <span>ID: {{ ind.id_indicador }}</span>
                          <span class="font-weight-bold">{{ ind.valor_porcentual }}%</span>
                        </div>
                        <div class="text-caption text-medium-emphasis">{{ ind.observaciones }}</div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <!-- SECCIÓN 4: INFORMACIÓN CUANTITATIVA -->
              <div v-if="informacionCuantitativa?.totalParticipantes" class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
                  4. INFORMACIÓN CUANTITATIVA
                </h3>

                <v-row class="mt-3">
                  <v-col cols="12" class="mb-2">
                    <div class="campo-etiqueta">Total Participantes</div>
                    <div class="campo-valor text-h5 font-weight-bold">
                      {{ informacionCuantitativa.totalParticipantes }}
                    </div>
                  </v-col>
                </v-row>

                <v-row>
                  <!-- Género -->
                  <v-col cols="12" md="6">
                    <div class="subseccion-cuantitativa">
                      <div class="subseccion-titulo">Género</div>
                      <v-table density="compact" class="tabla-custom">
                        <tbody>
                          <tr>
                            <td class="font-weight-medium">Varones:</td>
                            <td>{{ informacionCuantitativa.genero?.varones || 0 }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">Mujeres:</td>
                            <td>{{ informacionCuantitativa.genero?.mujeres || 0 }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">Otro:</td>
                            <td>{{ informacionCuantitativa.genero?.otro || 0 }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">PND:</td>
                            <td>{{ informacionCuantitativa.genero?.pnd || 0 }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                  </v-col>

                  <!-- Edades -->
                  <v-col cols="12" md="6">
                    <div class="subseccion-cuantitativa">
                      <div class="subseccion-titulo">Edades</div>
                      <v-table density="compact" class="tabla-custom">
                        <tbody>
                          <tr>
                            <td class="font-weight-medium">0-11 años:</td>
                            <td>{{ informacionCuantitativa.edades?.edad_0_11 || 0 }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">12-17 años:</td>
                            <td>{{ informacionCuantitativa.edades?.edad_12_17 || 0 }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">18-29 años:</td>
                            <td>{{ informacionCuantitativa.edades?.edad_18_29 || 0 }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">30-59 años:</td>
                            <td>{{ informacionCuantitativa.edades?.edad_30_59 || 0 }}</td>
                          </tr>
                          <tr>
                            <td class="font-weight-medium">60+ años:</td>
                            <td>{{ informacionCuantitativa.edades?.edad_60_adelante || 0 }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                  </v-col>

                  <!-- Discapacidad -->
                  <v-col
                    cols="12"
                    md="6"
                    v-if="informacionCuantitativa.discapacidad?.tipos?.length"
                  >
                    <div class="subseccion-cuantitativa">
                      <div class="subseccion-titulo">
                        Discapacidad (Total: {{ informacionCuantitativa.discapacidad.total || 0 }})
                      </div>
                      <v-table density="compact" class="tabla-custom">
                        <tbody>
                          <tr
                            v-for="tipo in informacionCuantitativa.discapacidad.tipos"
                            :key="tipo.tipo"
                          >
                            <td class="font-weight-medium">{{ tipo.tipo }}:</td>
                            <td>{{ tipo.cantidad }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                  </v-col>

                  <!-- Ocupaciones -->
                  <v-col cols="12" md="6" v-if="informacionCuantitativa.ocupaciones?.datos?.length">
                    <div class="subseccion-cuantitativa">
                      <div class="subseccion-titulo">Ocupaciones</div>
                      <v-table density="compact" class="tabla-custom">
                        <tbody>
                          <tr
                            v-for="ocupacion in informacionCuantitativa.ocupaciones.datos"
                            :key="ocupacion.nombre"
                          >
                            <td class="font-weight-medium">{{ ocupacion.nombre }}:</td>
                            <td>{{ ocupacion.cantidad }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                  </v-col>

                  <!-- Localidades -->
                  <v-col cols="12" md="6" v-if="informacionCuantitativa.localidades?.datos?.length">
                    <div class="subseccion-cuantitativa">
                      <div class="subseccion-titulo">Localidades</div>
                      <v-table density="compact" class="tabla-custom">
                        <tbody>
                          <tr
                            v-for="localidad in informacionCuantitativa.localidades.datos"
                            :key="localidad.localidad"
                          >
                            <td class="font-weight-medium">
                              {{ localidad.departamento }} - {{ localidad.municipio }} -
                              {{ localidad.localidad }}:
                            </td>
                            <td>{{ localidad.cantidad }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                  </v-col>

                  <!-- Organizaciones -->
                  <v-col
                    cols="12"
                    md="6"
                    v-if="informacionCuantitativa.organizaciones?.datos?.length"
                  >
                    <div class="subseccion-cuantitativa">
                      <div class="subseccion-titulo">Organizaciones</div>
                      <v-table density="compact" class="tabla-custom">
                        <tbody>
                          <tr
                            v-for="org in informacionCuantitativa.organizaciones.datos"
                            :key="org.nombre"
                          >
                            <td class="font-weight-medium">{{ org.nombre }}:</td>
                            <td>{{ org.cantidad }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                  </v-col>
                </v-row>

                <v-alert
                  v-if="informacionCuantitativa.validaciones?.tieneErrores"
                  type="error"
                  class="mt-4"
                  density="compact"
                >
                  Existen errores en la validación de los datos cuantitativos
                </v-alert>
              </div>

              <!-- SECCIÓN 5: MEDIOS DE VERIFICACIÓN -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-check-decagram</v-icon>
                  5. MEDIOS DE VERIFICACIÓN
                </h3>
                <div class="campo-formulario mt-2">
                  <div class="campo-valor campo-texto-largo">
                    {{ informeTareaPrincipal.mediosVerificacion || 'No especificado' }}
                  </div>
                </div>
              </div>

              <!-- SECCIÓN 6: PRESUPUESTO -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-cash-multiple</v-icon>
                  6. EJECUCIÓN PRESUPUESTARIA
                </h3>

                <v-row class="mt-3">
                  <v-col cols="12" md="6">
                    <div class="resumen-presupuesto">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="campo-etiqueta">Planificado:</span>
                        <span class="text-h6"
                          >Bs {{ formatNumber(informeTareaPrincipal.presupuestoPlanificado) }}</span
                        >
                      </div>
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="campo-etiqueta">Ejecutado:</span>
                        <span class="text-h6 text-success"
                          >Bs {{ formatNumber(informeTareaPrincipal.presupuestoEjecutado) }}</span
                        >
                      </div>
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="campo-etiqueta">Ejecución:</span>
                        <span class="font-weight-bold">{{ porcentajeEjecucion.toFixed(2) }}%</span>
                      </div>
                      <v-progress-linear
                        :model-value="porcentajeEjecucion"
                        color="success"
                        height="8"
                        rounded
                        class="mt-2"
                      ></v-progress-linear>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6" v-if="desglosePresupuesto?.itemsDesglose?.length">
                    <div class="desglose-presupuesto">
                      <div class="campo-etiqueta mb-2">Desglose por concepto</div>
                      <div
                        v-for="item in desglosePresupuesto.itemsDesglose"
                        :key="item.id"
                        class="desglose-item mb-2"
                      >
                        <div class="d-flex justify-space-between">
                          <span>{{ item.descripcion }}</span>
                          <span class="font-weight-bold"
                            >Bs {{ formatNumber(item.montoEjecutado) }}</span
                          >
                        </div>
                        <div class="d-flex justify-space-between text-caption">
                          <span class="text-medium-emphasis"
                            >Planif: Bs {{ formatNumber(item.monto) }}</span
                          >
                          <span>{{ ((item.montoEjecutado / item.monto) * 100).toFixed(1) }}%</span>
                        </div>
                      </div>
                      <div v-if="desglosePresupuesto.observaciones" class="mt-2">
                        <div class="campo-etiqueta">Observaciones:</div>
                        <div class="text-caption">{{ desglosePresupuesto.observaciones }}</div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <!-- SECCIÓN 7: HERRAMIENTAS DE EVALUACIÓN -->
              <div
                v-if="herramientas?.datosCompletos?.herramientas?.length"
                class="form-section mb-6"
              >
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-hammer-wrench</v-icon>
                  7. HERRAMIENTAS DE EVALUACIÓN
                </h3>

                <v-row class="mt-3">
                  <v-col
                    v-for="herramienta in herramientas.datosCompletos.herramientas"
                    :key="herramienta.id"
                    cols="12"
                    md="6"
                  >
                    <div class="herramienta-card">
                      <div class="font-weight-medium">{{ herramienta.descripcion }}</div>
                      <div class="text-caption mt-1">{{ herramienta.resultado }}</div>
                      <div class="text-caption text-medium-emphasis mt-1">
                        Evidencias: {{ herramienta.archivos?.length || 0 }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <!-- SECCIÓN 8: COMENTARIOS Y RECOMENDACIONES -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-comment-text-multiple</v-icon>
                  8. COMENTARIOS Y RECOMENDACIONES
                </h3>
                <div class="campo-formulario mt-2">
                  <div class="campo-valor campo-texto-largo">
                    {{ informeTareaPrincipal.comentariosRecomendaciones || 'No especificado' }}
                  </div>
                </div>
              </div>

              <!-- SECCIÓN 9: INFORMACIÓN DE REGISTRO -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-clock-outline</v-icon>
                  9. INFORMACIÓN DE REGISTRO
                </h3>
                <v-row>
                  <v-col cols="12" md="4">
                    <div class="campo-etiqueta">Registrado por:</div>
                    <div class="campo-valor">
                      {{ informeTareaPrincipal.usuario || 'No registrado' }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="campo-etiqueta">Fecha registro:</div>
                    <div class="campo-valor">
                      {{ formatDateTime(informeTareaPrincipal.timestamp_registro) }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="campo-etiqueta">Última modificación:</div>
                    <div class="campo-valor">
                      {{ formatDateTime(informeTareaPrincipal.timestamp_ultima_modificacion) }}
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Panel lateral de validación -->
        <v-col cols="12" lg="3">
          <EstadoValidacionDocumento
            :documento-id="idtarea"
            tipo-documento="tarea"
            @validar="abrirDialogoValidacion"
            ref="validacionComponente"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Error -->
    <v-alert v-if="error" type="error" variant="tonal" class="mt-4">
      {{ error }}
      <v-btn color="error" variant="text" @click="cargarDatos" class="ml-2">Reintentar</v-btn>
    </v-alert>

    <!-- Diálogo de validación -->
    <v-dialog v-model="dialogValidacion" max-width="500px" persistent>
      <v-card rounded="lg">
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon start dark>mdi-check-circle</v-icon>
            Validar Documento
          </v-toolbar-title>
        </v-toolbar>

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
            :rules="accionValidacion === 'rechazar' ? [(v) => !!v || 'El motivo es requerido'] : []"
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
          <v-btn color="grey" variant="text" @click="cerrarDialogoValidacion">Cancelar</v-btn>
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
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInformeActividadPrincipal } from '@/modules/formularios/composables/useInformeActividadPrincipal'
import { useSnackbar } from '@/composables/useSnackbar'
import { useImpresionFormularios } from '@/modules/impresiones/composables/useImpresionFormularios'

// Componentes
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import EstadoValidacionDocumento from '@/modules/formularios/components/validadores/EstadoValidacionDocumento.vue'

// Router
const route = useRoute()
const router = useRouter()
const idtarea = ref(route.params.id)
const { successMsg, errorMsg } = useSnackbar()

// Composables
const { informeTareaPrincipal, obtenerInformeSubActividadPrincipalPorId } =
  useInformeActividadPrincipal()
const { generarPdfInformeSubActividadPrincipal } = useImpresionFormularios()

// Estado
const loading = ref(false)
const error = ref(null)
const generarPdf = ref(false)

// Estado del diálogo de validación
const dialogValidacion = ref(false)
const accionValidacion = ref('aprobar')
const comentarioValidacion = ref('')
const enviandoValidacion = ref(false)

// Referencia al componente de validación
const validacionComponente = ref(null)

// Computed properties
const contribucion = computed(
  () => informeTareaPrincipal.value?.contribucionProyecto?.caberaContribucion,
)
const indicadores = computed(() => informeTareaPrincipal.value?.avanceIndicadores || {})
const herramientas = computed(() => informeTareaPrincipal.value?.herramientasEvaluacion)
const desglosePresupuesto = computed(() => informeTareaPrincipal.value?.desglosePresupuesto)
const informacionCuantitativa = computed(() => informeTareaPrincipal.value?.informacionCuantitativa)

const totalIndicadores = computed(() => indicadores.value?.metadatos?.total_general || 0)

const porcentajeEjecucion = computed(() => {
  const planificado = parseFloat(informeTareaPrincipal.value?.presupuestoPlanificado) || 0
  const ejecutado = parseFloat(informeTareaPrincipal.value?.presupuestoEjecutado) || 0
  return planificado > 0 ? (ejecutado / planificado) * 100 : 0
})

const getTipoActividadColor = computed(() => {
  const tipo = informeTareaPrincipal.value?.tipoActividad || ''
  if (tipo.includes('CAP')) return 'info'
  if (tipo.includes('INV')) return 'success'
  if (tipo.includes('ADM')) return 'warning'
  return 'primary'
})

const puedeEnviarValidacion = computed(() => {
  if (accionValidacion.value === 'rechazar') {
    return comentarioValidacion.value?.trim().length > 0
  }
  return true
})

// Métodos
const cargarDatos = async () => {
  loading.value = true
  error.value = null
  try {
    await obtenerInformeSubActividadPrincipalPorId(idtarea.value)
  } catch (err) {
    console.error('Error al cargar la información', err)
    error.value = err.message || 'No se pudo cargar la información del informe'
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

const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  return new Date(dateTime).toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatNumber = (num) => {
  const number = parseFloat(num) || 0
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
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

const getTipoDatoColor = (tipo) => {
  const colores = {
    '1-9': 'info',
    'A-Z': 'purple',
    '%': 'success',
  }
  return colores[tipo] || 'grey'
}

const salirFormulario = () => {
  router.push('/monitoreo/informes')
}

// Acciones de validación
const abrirDialogoValidacion = () => {
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
    // Aquí se implementaría la llamada a la API para guardar la validación
    await new Promise((resolve) => setTimeout(resolve, 1500))
    successMsg(
      `Documento ${accionValidacion.value === 'aprobar' ? 'aprobado' : 'rechazado'} correctamente`,
    )
    cerrarDialogoValidacion()

    // Recargar el componente de validaciones
    if (validacionComponente.value) {
      await validacionComponente.value.recargar()
    }

    // Recargar datos del informe
    await cargarDatos()
  } catch (err) {
    errorMsg('Error al enviar la validación')
    console.error('Error:', err)
  } finally {
    enviandoValidacion.value = false
  }
}

// Generar PDF
const generarPDF = async () => {
  generarPdf.value = true
  try {
    await generarPdfInformeSubActividadPrincipal(idtarea.value)
    successMsg('Informe de Subactividad - PDF Generado')
  } catch (err) {
    errorMsg('No se generó el PDF')
    console.error('Error:', err)
  } finally {
    generarPdf.value = false
  }
}

// Inicialización
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
/* Estilos base */
.informe-subactividad-container {
  background: #f5f5f5;
  min-height: 100vh;
}

.documento-administracion {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* Acciones sheet */
.acciones-sheet {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
}

/* Tarjeta principal del informe */
.tarjeta-informe {
  background: white;
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

/* Form sections */
.form-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
}

.form-section h3 {
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
  padding-bottom: 8px;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

/* Campos de formulario */
.campo-formulario {
  margin-bottom: 16px;
}

.campo-etiqueta {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 4px;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 2px;
}

.campo-valor {
  font-size: 0.95rem;
  padding: 8px 12px;
  background: #f9f9f9;
  border-left: 3px solid #1976d2;
  min-height: 40px;
  border-radius: 0 4px 4px 0;
}

.campo-texto-largo {
  white-space: pre-wrap;
  line-height: 1.5;
}

/* Tablas personalizadas */
.tabla-custom {
  background: transparent;
}

.tabla-custom tbody tr td {
  padding: 4px 8px;
  border-bottom: none;
}

/* Contribución */
.contribucion-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contribucion-item {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid;
  transition: all 0.2s;
}

.contribucion-item.nivel-1 {
  border-left-color: #1976d2;
  background: #e3f2fd;
}
.contribucion-item.nivel-2 {
  border-left-color: #2196f3;
  margin-left: 20px;
}
.contribucion-item.nivel-3 {
  border-left-color: #4caf50;
  margin-left: 40px;
}
.contribucion-item.nivel-4 {
  border-left-color: #ff9800;
  margin-left: 60px;
}

.contribucion-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.contribucion-codigo {
  font-weight: bold;
  font-family: monospace;
  font-size: 0.85rem;
}

.contribucion-chip {
  font-size: 0.65rem;
}

.contribucion-descripcion {
  font-size: 0.85rem;
  line-height: 1.4;
}

.contribucion-aporte {
  font-size: 0.75rem;
  color: #666;
  margin-top: 4px;
  font-style: italic;
}

.contribucion-estado {
  font-size: 0.7rem;
  margin-top: 4px;
}

/* Indicadores */
.indicador-grupo-titulo {
  font-weight: 600;
  font-size: 0.85rem;
  color: #1976d2;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.indicador-grupo-titulo.small {
  font-size: 0.75rem;
  margin-top: 8px;
}

.indicador-card {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #eee;
  height: 100%;
}

.indicador-id {
  font-size: 0.7rem;
  color: #666;
  font-family: monospace;
}

.indicador-valor {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 6px 0;
}

.indicador-obs {
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 4px;
}

.indicador-meta {
  font-size: 0.65rem;
  color: #888;
}

.indicador-compacto {
  padding: 6px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 0.8rem;
}

/* Información cuantitativa */
.subseccion-cuantitativa {
  background: #f5f5f5;
  border-radius: 6px;
  padding: 12px;
  height: 100%;
}

.subseccion-titulo {
  font-weight: 600;
  font-size: 0.85rem;
  color: #1976d2;
  margin-bottom: 8px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
}

/* Presupuesto */
.resumen-presupuesto {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;
}

.desglose-presupuesto {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;
}

.desglose-item {
  padding: 6px 8px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 4px;
}

/* Herramientas */
.herramienta-card {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #eee;
}

/* Utilidades */
.gap-2 {
  gap: 8px;
}

/* Responsive */
@media (max-width: 960px) {
  .documento-administracion {
    padding: 16px;
  }

  .form-section {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .gap-2 {
    gap: 4px;
  }

  .contribucion-item.nivel-2,
  .contribucion-item.nivel-3,
  .contribucion-item.nivel-4 {
    margin-left: 10px;
  }
}
</style>
