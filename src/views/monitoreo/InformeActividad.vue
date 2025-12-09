<template>
  <v-container class="informe-actividad-container">
    <!-- Overlay para verificación de informe existente -->
    <v-overlay
      :model-value="verificando"
      class="align-center justify-center"
      persistent
      opacity="0.8"
    >
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Verificando informe existente...</p>
      </div>
    </v-overlay>

    <!-- Overlay de carga original -->
    <v-overlay
      :model-value="cargandoGeneral"
      class="align-center justify-center"
      persistent
      opacity="0.8"
    >
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando formulario de informe...</p>
      </div>
    </v-overlay>

    <div v-if="!verificando">
      <div v-if="!cargandoGeneral && storeInfActividad.actividad">
        <v-row>
          <!-- Formulario principal -->
          <v-col cols="12" md="12" lg="12">
            <PaginaTituloIcono
              :titulo="'Informe de Actividad'"
              :icon="'mdi-file-document-multiple'"
            />
            <v-card elevation="2" rounded="lg">
              <v-toolbar color="primary" density="compact">
                <v-toolbar-title class="text-white">
                  <v-icon class="mr-2">mdi-file-document-multiple</v-icon>
                  Informe de Actividad: {{ storeInfActividad.actividad?.codigo || 'Cargando...' }}
                </v-toolbar-title>
              </v-toolbar>

              <v-card-text class="pa-4">
                <!-- Encabezado diferenciado -->
                <div class="mb-6">
                  <!-- Información del Proyecto -->
                  <div v-if="storeInfActividad.actividad?.proyecto" class="mb-4">
                    <proyecto-id-header
                      :proyecto-id="storeInfActividad.actividad?.proyecto"
                    ></proyecto-id-header>
                  </div>
                  <v-divider class="my-4"></v-divider>
                  <!--Informacion de la actividad-->
                  <div v-if="storeInfActividad.actividad?.id" class="mb-4">
                    <ActividadInformacion :actividad-id="storeInfActividad.actividad?.id" />
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <div class="header-decoration">
              <div class="decoration-circle decoration-circle-1"></div>
              <div class="decoration-circle decoration-circle-2"></div>
              <div class="decoration-circle decoration-circle-3"></div>
            </div>
            <v-divider></v-divider>

            <v-form ref="form" @submit.prevent="abrirResumen">
              <!-- Seccion: Fecha de ejecucion -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
                  Fecha de ejecución
                </h3>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.fecha_ejecucion"
                      label="Fecha de ejecución"
                      type="date"
                      variant="outlined"
                      clearable
                      :rules="[validators.required]"
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- Seccion: Contribuciones al Proyecto -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-target</v-icon>
                  Contribuciones al Proyecto
                </h3>
                <v-row>
                  <v-col cols="12">
                    <EncabezadoContribucion
                      v-if="storeInfActividad.actividad?.estructuraProcedencia"
                      :datos-estructura="storeInfActividad.actividad?.estructuraProcedencia"
                      @payload-actualizado="recibirDatosContribucion"
                    />
                    <v-alert v-else type="warning" variant="tonal">
                      No hay estructura de procedencia disponible para esta actividad.
                    </v-alert>
                  </v-col>
                </v-row>
              </div>

              <!-- Sección de Objetivo -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-target</v-icon>
                  Objetivo de la Actividad
                </h3>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.objetivo_de_actividad"
                      label="Objetivo de la Actividad"
                      variant="outlined"
                      required
                      rows="3"
                      :rules="[validators.required]"
                      placeholder="Escriba el objetivo de la Actividad..."
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.informe_de_objetivo_de_actividad"
                      label="Informe del objetivo de la Actividad"
                      variant="outlined"
                      required
                      rows="3"
                      :rules="[validators.required]"
                      placeholder="Describa el cumplimiento del objetivo de esta Actividad..."
                    ></v-textarea>
                  </v-col>
                </v-row>
              </div>

              <!-- Sección de Reporte -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-file-document</v-icon>
                  Reporte de la Actividad
                </h3>
                <v-row>
                  <v-col cols="12">
                    <div class="mb-2">
                      <strong>Actividad Tipo:</strong>
                      {{ storeInfActividad.actividad?.tipo_info?.tipo_actividad || 'N/A' }}
                      ({{ storeInfActividad.actividad?.tipo_info?.sigla || 'N/A' }})
                    </div>
                    <v-textarea
                      v-model="formData.reporte_tipo"
                      label="Reporte de la actividad"
                      variant="outlined"
                      hint="Escriba el reporte de la Actividad"
                      required
                      :rules="[validators.required]"
                      placeholder="Escriba el reporte de la Actividad..."
                      rows="4"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </div>

              <!-- Sección de Indicadores -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-chart-box</v-icon>
                  Registro de Indicadores
                </h3>
                <v-row>
                  <v-col cols="12">
                    <RegistroAvanceIndicadores
                      :idactividad="storeInfActividad.actividad.id"
                      @todos-los-registros-enviados="manejarRegistrosIndicadores"
                    ></RegistroAvanceIndicadores>
                  </v-col>
                </v-row>
              </div>

              <!-- Sección de Información Cuantitativa -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
                  Información Cuantitativa
                </h3>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.informacion_cuantitativa"
                      label="Número de participantes, organizaciones, segmentación y grupos edad/sexo, autoridades"
                      variant="outlined"
                      required
                      :rules="[validators.required]"
                      placeholder="Describa la informacion cuantitativa..."
                      rows="3"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-file-input
                      v-model="formData.archivos_cuantitativos"
                      label="Adjuntar archivos"
                      variant="outlined"
                      multiple
                      chips
                      show-size
                      prepend-icon="mdi-paperclip"
                      :rules="[validators.archivosTamanio]"
                    ></v-file-input>
                  </v-col>
                </v-row>
              </div>

              <!-- Sección de Herramientas Aplicadas -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-tools</v-icon>
                  Herramientas Aplicadas y Resultados
                </h3>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.descripcion_herramientas"
                      label="Herramientas de Evaluación y resultados"
                      variant="outlined"
                      required
                      :rules="[validators.required]"
                      placeholder="Describa las herramientas aplicadas y sus resultados..."
                      rows="3"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-file-input
                      v-model="formData.herramientas_archivos"
                      label="Adjuntar archivos"
                      variant="outlined"
                      multiple
                      chips
                      show-size
                      prepend-icon="mdi-paperclip"
                      :rules="[validators.archivosTamanio]"
                    ></v-file-input>
                  </v-col>
                </v-row>
              </div>

              <!-- Sección de Medios de Verificacion -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-checkbox-marked-circle</v-icon>
                  Medios de Verificación
                </h3>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.medios_verificacion"
                      label="Medios de Verificación"
                      variant="outlined"
                      required
                      :rules="[validators.required]"
                      placeholder="Medios de Verificación"
                      rows="3"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-file-input
                      v-model="formData.medios_archivos"
                      label="Adjuntar archivos"
                      variant="outlined"
                      multiple
                      chips
                      show-size
                      prepend-icon="mdi-paperclip"
                      :rules="[validators.archivosTamanio]"
                    ></v-file-input>
                  </v-col>
                </v-row>
              </div>

              <!-- Sección de Procedencia de Fondos y Presupuesto -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-cash-multiple</v-icon>
                  Procedencia de Fondos y Presupuesto
                </h3>

                <!-- Desglose de Procedencia de Fondos -->
                <div class="mb-6">
                  <h4 class="text-h6 mb-3 primary--text">Procedencia de Fondos</h4>

                  <!-- Tabla para mostrar la procedencia de fondos -->
                  <v-table class="elevation-1 rounded-lg mb-4" v-if="procedenciaFondos.length > 0">
                    <thead>
                      <tr>
                        <th class="text-subtitle-2 font-weight-bold">Fuente de Fondos</th>
                        <th class="text-subtitle-2 font-weight-bold">Tipo</th>
                        <th class="text-subtitle-2 font-weight-bold">Monto Planificado (Bs.)</th>
                        <th class="text-subtitle-2 font-weight-bold">Monto Ejecutado (Bs.)</th>
                        <th class="text-subtitle-2 font-weight-bold">Diferencia</th>
                        <th class="text-subtitle-2 font-weight-bold">Verificado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(fondo, index) in procedenciaFondos" :key="fondo.id || index">
                        <td class="font-weight-medium">{{ fondo.nombre }}</td>
                        <td>
                          <v-chip :color="fondo.esExistente ? 'blue' : 'orange'" size="small">
                            {{ fondo.esExistente ? 'Existente' : 'Nuevo' }}
                          </v-chip>
                        </td>
                        <td class="text-right">{{ formatearMoneda(fondo.monto) }}</td>
                        <td>
                          <v-text-field
                            v-model.number="fondo.montoEjecutado"
                            type="number"
                            variant="outlined"
                            density="compact"
                            hide-details
                            placeholder="0.00"
                            :min="0"
                            :max="fondo.monto"
                            step="0.01"
                            @update:model-value="calcularTotalesProcedencia"
                          ></v-text-field>
                        </td>
                        <td
                          class="text-right"
                          :class="getColorDiferencia(fondo.monto - (fondo.montoEjecutado || 0))"
                        >
                          {{ formatearMoneda(fondo.monto - (fondo.montoEjecutado || 0)) }}
                        </td>
                        <td class="text-center">
                          <v-checkbox
                            v-model="fondo.verificado"
                            hide-details
                            class="mt-0"
                            @update:model-value="actualizarVerificacion"
                          ></v-checkbox>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="font-weight-bold" style="background-color: #f5f5f5">
                        <td class="text-subtitle-2" colspan="2">TOTAL</td>
                        <td class="text-right text-subtitle-2">
                          {{ formatearMoneda(totalPlanificadoProcedencia) }}
                        </td>
                        <td class="text-right text-subtitle-2">
                          {{ formatearMoneda(totalEjecutadoProcedencia) }}
                        </td>
                        <td
                          class="text-right text-subtitle-2"
                          :class="
                            getColorDiferencia(
                              totalPlanificadoProcedencia - totalEjecutadoProcedencia,
                            )
                          "
                        >
                          {{
                            formatearMoneda(totalPlanificadoProcedencia - totalEjecutadoProcedencia)
                          }}
                        </td>
                        <td class="text-center">
                          <v-icon
                            :color="todosVerificados ? 'success' : 'grey'"
                            :title="
                              todosVerificados ? 'Todos verificados' : 'Pendientes de verificar'
                            "
                          >
                            {{ todosVerificados ? 'mdi-check-circle' : 'mdi-progress-clock' }}
                          </v-icon>
                        </td>
                      </tr>
                    </tfoot>
                  </v-table>

                  <v-alert v-else type="info" variant="tonal" class="mb-4">
                    No hay información de procedencia de fondos disponible.
                  </v-alert>
                </div>

                <!-- Resumen de Presupuesto -->
                <v-row>
                  <v-col cols="12" md="6">
                    <v-card variant="outlined" class="pa-4">
                      <v-card-title class="text-h6 pa-0 mb-2">
                        Presupuesto Total Planificado
                      </v-card-title>
                      <v-text-field
                        :model-value="formatearMoneda(presupuestoTotalPlanificado)"
                        label="Monto Total Planificado"
                        variant="outlined"
                        readonly
                        bg-color="grey-lighten-4"
                        class="mb-2"
                      ></v-text-field>

                      <!-- Información de procedencia de fondos planificados -->
                      <div class="mb-3" v-if="procedenciaFondos.length > 0">
                        <div class="text-subtitle-2 font-weight-medium mb-1">
                          Desglose Planificado:
                        </div>
                        <div
                          v-for="fondo in procedenciaFondos"
                          :key="fondo.id"
                          class="d-flex justify-space-between text-caption"
                        >
                          <span>{{ fondo.nombre }}:</span>
                          <span>{{ formatearMoneda(fondo.monto) }}</span>
                        </div>
                      </div>

                      <v-textarea
                        v-model="formData.observaciones_presupuesto"
                        label="Observaciones del Presupuesto"
                        variant="outlined"
                        rows="2"
                        placeholder="Observaciones adicionales sobre el presupuesto planificado..."
                      ></v-textarea>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-card variant="outlined" class="pa-4">
                      <v-card-title class="text-h6 pa-0 mb-2">
                        Presupuesto Total Ejecutado
                      </v-card-title>

                      <!-- Monto total ejecutado - AHORA EDITABLE CUANDO NO HAY PROCEDENCIA -->
                      <v-text-field
                        v-if="procedenciaFondos.length > 0"
                        :model-value="formatearMoneda(totalEjecutadoProcedencia)"
                        label="Monto Total Ejecutado"
                        variant="outlined"
                        readonly
                        bg-color="green-lighten-5"
                        class="mb-2"
                      ></v-text-field>

                      <v-text-field
                        v-else
                        v-model.number="presupuestoEjecutadoManual"
                        label="Monto Total Ejecutado"
                        variant="outlined"
                        type="number"
                        :min="0"
                        step="0.01"
                        bg-color="green-lighten-5"
                        class="mb-2"
                        placeholder="Ingrese el monto ejecutado"
                      ></v-text-field>

                      <!-- Información de procedencia de fondos ejecutados -->
                      <div class="mb-3" v-if="procedenciaFondos.length > 0">
                        <div class="text-subtitle-2 font-weight-medium mb-1">
                          Desglose Ejecutado:
                        </div>
                        <div
                          v-for="fondo in procedenciaFondos"
                          :key="fondo.id"
                          class="d-flex justify-space-between text-caption"
                        >
                          <span>{{ fondo.nombre }}:</span>
                          <span>{{ formatearMoneda(fondo.montoEjecutado || 0) }}</span>
                        </div>
                      </div>

                      <!-- Diferencia Total -->
                      <v-text-field
                        :model-value="formatearMoneda(diferenciaTotal)"
                        label="Diferencia Total"
                        variant="outlined"
                        readonly
                        :bg-color="
                          getColorDiferencia(diferenciaTotal) === 'text-red'
                            ? 'red-lighten-5'
                            : 'green-lighten-5'
                        "
                        :class="getColorDiferencia(diferenciaTotal)"
                      ></v-text-field>

                      <!-- Porcentaje de ejecución -->
                      <v-text-field
                        :model-value="porcentajeEjecucionTotal + '%'"
                        label="Porcentaje de Ejecución"
                        variant="outlined"
                        readonly
                        :bg-color="getColorPorcentaje(porcentajeEjecucionTotal)"
                        class="mt-2"
                      ></v-text-field>
                    </v-card>
                  </v-col>
                </v-row>
              </div>

              <!-- Sección de Comentarios y Recomendaciones -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-comment-text</v-icon>
                  Comentarios y Recomendaciones
                </h3>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.comentarios_recomendaciones"
                      label="Comentarios y recomendaciones adicionales"
                      variant="outlined"
                      required
                      :rules="[validators.required]"
                      placeholder="Escriba sus comentarios y recomendaciones..."
                      rows="3"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </div>

              <!-- Botones de acción -->
              <div class="form-section">
                <v-row>
                  <v-col cols="12" class="d-flex justify-end gap-3">
                    <v-btn
                      color="error"
                      variant="outlined"
                      size="large"
                      prepend-icon="mdi-cancel"
                      :to="`/actividades/informe/`"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      color="primary"
                      size="large"
                      type="submit"
                      :loading="enviando"
                      prepend-icon="mdi-eye"
                    >
                      Ver Resumen
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-form>
          </v-col>
        </v-row>
      </div>

      <EncabezadoContribucion
        :datos-estructura="data.estructuraProcedencia"
        @payload-actualizado="recibirdatos"
      >
      </EncabezadoContribucion>

      <div class="v-card-text">
        <form class="v-form" novalidate @submit.prevent="submitForm">
          <!-- Sección 1: Datos Generales del Informe -->
          <!-- <div class="form-section">
            <v-divider class="my-4"></v-divider>
            <v-card-subtitle class="text-h6">Datos Generales del Informe</v-card-subtitle>
            <br>
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="formData.nombre_actividad"
                  label="Nombre de Actividad"
                  bg-color="blue-lighten-5"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.fecha_realizacion"
                  label="Fecha de Realización"
                  type="date"
                  bg-color="blue-lighten-5"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="formData.responsable_actividad1"
                  label="Responsable de Actividad"
                  bg-color="blue-lighten-5"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </div> -->

          <!-- <v-divider class="my-4"></v-divider> -->

          <!-- <v-col cols="12">
            <v-text-field
              v-model="formData.contribucion_proyecto"
              label="Contribuciones del Proyecto"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="formData.contribucion_actividad"
              label="Contribución de la Actividad"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>
          </v-col>-->

          <v-col cols="12">
            <v-text-field
              v-model="formData.objetivo_de_actividad"
              label="Objetivo de la Actividad"
              required
              readonly
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="formData.informe_de_objetivo_de_actividad"
              label="Informe de objetivo de la actividad"
              bg-color="blue-lighten-5"
              required
              rows="3"
            ></v-textarea>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="formData.tipo_de_actividad"
              label="Tipo de actividad"
              required
              readonly
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="formData.reporte_tipo"
              label="Reporte por Tipo"
              bg-color="blue-lighten-5"
              required
              rows="3"
            ></v-textarea>
          </v-col>

          <!-- <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-chart-bar"
            @click="modalAbierto = true"
            block
            size="large"
          >
            Seleccionar Indicador de Proyecto
          </v-btn>
          <Indicador-registro-bitacora
            v-model="modalAbierto"
            :idactividad="idActividad"
            @guardarAvances="actualizarIndicadores"
          >
          </Indicador-registro-bitacora> -->

          <RegistroAvanceIndicadores
            :idactividad="idActividad"
            @todos-los-registros-enviados="manejarRegistrosIndicadores"
          ></RegistroAvanceIndicadores>

          <!-- <v-col cols="12" class="mt-4">
            <v-text-field
              v-model="formData.indicador_seleccionado"
              label="Indicador seleccionado"
              bg-color="blue-lighten-5"
              readonly
            ></v-text-field>
          </v-col> -->

          <!-- <v-col cols="12">
            <v-text-field
              v-model="formData.avance_indicador"
              label="Avance en el indicador"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>
          </v-col> -->

          <v-divider class="my-4"></v-divider>

          <div class="form-section">
            <v-card-subtitle class="text-h6">Informacion Cuantitativa</v-card-subtitle>
            <br />
            <v-row>
              <v-col cols="12">
                <InformacionCuantitativa></InformacionCuantitativa>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Sección 2: Herramientas Aplicadas y Resultados -->
          <div class="form-section">
            <v-card-subtitle class="text-h6">Herramientas Aplicadas y Resultados</v-card-subtitle>
            <br />
            <v-row>
              <v-col cols="12">
                <!-- <v-file-input
                  v-model="formData.herramientas_archivos"
                  label="Adjuntar archivos"
                  multiple
                  chips
                  show-size
                  :accept="acceptedFormats.herramientas"
                  prepend-icon="mdi-paperclip"
                ></v-file-input> -->
                <HerramientasAplicadasResultados></HerramientasAplicadasResultados>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Sección 3: Medios de Verificación -->
          <div class="form-section">
            <v-card-subtitle class="text-h6">Medios de Verificación</v-card-subtitle>
            <br />
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.medios_verificacion"
                  label="Descripción de medios de verificación"
                  bg-color="blue-lighten-5"
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="formData.medios_archivos"
                  label="Adjuntar archivos"
                  multiple
                  chips
                  show-size
                  :accept="acceptedFormats.medios"
                  prepend-icon="mdi-paperclip"
                ></v-file-input>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Sección 4: Comentarios y Recomendaciones -->
          <div class="form-section">
            <v-card-subtitle class="text-h6">Comentarios y Recomendaciones</v-card-subtitle>
            <br />
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.comentarios_recomendaciones"
                  label="Comentarios y recomendaciones adicionales"
                  bg-color="blue-lighten-5"
                  rows="3"
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </div>

          <div class="d-flex justify-end mt-4">
            <v-btn color="error" prepend-icon="mdi-backspace-outline" @click="resetForm">
              Limpiar
            </v-btn>
            <v-btn color="primary" prepend-icon="mdi-send" @click="submitForm" :loading="loading">
              Enviar Informe
            </v-btn>
          </div>
        </form>
      <!-- Estado cuando no hay datos -->
      <div v-else-if="!cargandoGeneral" class="text-center pa-8">
        <v-icon size="64" color="grey-lighten-1">mdi-file-remove</v-icon>
        <p class="text-h6 mt-4">No se pudo cargar la información de la actividad</p>
      </div>
    </div>

    <!-- Diálogo de Resumen -->
    <v-dialog v-model="mostrarResumen" max-width="1200" persistent scrollable>
      <v-card>
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon class="mr-2">mdi-file-document-check</v-icon>
            Resumen del Informe - {{ storeInfActividad.actividad?.codigo }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="mostrarResumen = false" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
          <!-- Resumen del Informe -->
          <div class="resumen-container">
            <!-- Información General -->
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="bg-primary-lighten-5">
                <v-icon class="mr-2">mdi-information</v-icon>
                Información General
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-list density="compact">
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-calendar</v-icon>
                        </template>
                        <v-list-item-title>Fecha de Ejecución</v-list-item-title>
                        <v-list-item-subtitle>{{
                          formData.fecha_ejecucion || 'No especificada'
                        }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-target</v-icon>
                        </template>
                        <v-list-item-title>Tipo de Actividad</v-list-item-title>
                        <v-list-item-subtitle>{{
                          storeInfActividad.actividad?.tipo_info?.tipo_actividad || 'N/A'
                        }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-list density="compact">
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-cash</v-icon>
                        </template>
                        <v-list-item-title>Presupuesto Ejecutado</v-list-item-title>
                        <v-list-item-subtitle
                          >{{ formatearMoneda(totalEjecutado) }} ({{
                            porcentajeEjecucionTotal
                          }}%)</v-list-item-subtitle
                        >
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-file-document</v-icon>
                        </template>
                        <v-list-item-title>Archivos Adjuntos</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ totalArchivosAdjuntos }} archivo(s)
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Objetivos y Reporte -->
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="bg-primary-lighten-5">
                <v-icon class="mr-2">mdi-target</v-icon>
                Objetivos y Reporte
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Objetivo de la Actividad</h4>
                    <p class="text-body-2 resumen-texto">
                      {{ formData.objetivo_de_actividad || 'No especificado' }}
                    </p>
                  </v-col>
                  <v-col cols="12" md="6">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Cumplimiento del Objetivo</h4>
                    <p class="text-body-2 resumen-texto">
                      {{ formData.informe_de_objetivo_de_actividad || 'No especificado' }}
                    </p>
                  </v-col>
                </v-row>
                <v-row class="mt-4">
                  <v-col cols="12">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Reporte de la Actividad</h4>
                    <p class="text-body-2 resumen-texto">
                      {{ formData.reporte_tipo || 'No especificado' }}
                    </p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Información Cuantitativa -->
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="bg-primary-lighten-5">
                <v-icon class="mr-2">mdi-chart-bar</v-icon>
                Información Cuantitativa
              </v-card-title>
              <v-card-text>
                <p class="text-body-2 resumen-texto">
                  {{ formData.informacion_cuantitativa || 'No especificada' }}
                </p>
                <div v-if="formData.archivos_cuantitativos?.length > 0" class="mt-2">
                  <v-chip size="small" color="primary" variant="outlined" class="mr-2">
                    {{ formData.archivos_cuantitativos.length }} archivo(s) adjunto(s)
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>

            <!-- Herramientas y Medios de Verificación -->
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="bg-primary-lighten-5">
                <v-icon class="mr-2">mdi-tools</v-icon>
                Herramientas y Medios de Verificación
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Herramientas Aplicadas</h4>
                    <p class="text-body-2 resumen-texto">
                      {{ formData.descripcion_herramientas || 'No especificadas' }}
                    </p>
                    <div v-if="formData.herramientas_archivos?.length > 0" class="mt-2">
                      <v-chip size="small" color="primary" variant="outlined">
                        {{ formData.herramientas_archivos.length }} archivo(s)
                      </v-chip>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Medios de Verificación</h4>
                    <p class="text-body-2 resumen-texto">
                      {{ formData.medios_verificacion || 'No especificados' }}
                    </p>
                    <div v-if="formData.medios_archivos?.length > 0" class="mt-2">
                      <v-chip size="small" color="primary" variant="outlined">
                        {{ formData.medios_archivos.length }} archivo(s)
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Presupuesto -->
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="bg-primary-lighten-5">
                <v-icon class="mr-2">mdi-cash-multiple</v-icon>
                Resumen Presupuestario
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-card variant="flat" color="grey-lighten-4" class="pa-3 text-center">
                      <div class="text-h6 font-weight-bold">
                        {{ formatearMoneda(presupuestoTotalPlanificado) }}
                      </div>
                      <div class="text-caption">Planificado</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card variant="flat" color="green-lighten-5" class="pa-3 text-center">
                      <div class="text-h6 font-weight-bold">
                        {{ formatearMoneda(totalEjecutado) }}
                      </div>
                      <div class="text-caption">Ejecutado</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card
                      variant="flat"
                      :color="diferenciaTotal >= 0 ? 'green-lighten-5' : 'red-lighten-5'"
                      class="pa-3 text-center"
                    >
                      <div
                        class="text-h6 font-weight-bold"
                        :class="getColorDiferencia(diferenciaTotal)"
                      >
                        {{ formatearMoneda(diferenciaTotal) }}
                      </div>
                      <div class="text-caption">Diferencia</div>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row class="mt-4">
                  <v-col cols="12">
                    <v-progress-linear
                      :model-value="parseFloat(porcentajeEjecucionTotal)"
                      height="20"
                      :color="getColorPorcentajeBar(porcentajeEjecucionTotal)"
                      rounded
                    >
                      <template v-slot:default="{ value }">
                        <strong>{{ Math.round(value) }}% Ejecutado</strong>
                      </template>
                    </v-progress-linear>
                  </v-col>
                </v-row>
                <v-row v-if="procedenciaFondos.length > 0" class="mt-4">
                  <v-col cols="12">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Desglose por Fuente</h4>
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th>Fuente</th>
                          <th class="text-right">Planificado</th>
                          <th class="text-right">Ejecutado</th>
                          <th class="text-right">Diferencia</th>
                          <th class="text-center">Verificado</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="fondo in procedenciaFondos" :key="fondo.id">
                          <td>{{ fondo.nombre }}</td>
                          <td class="text-right">{{ formatearMoneda(fondo.monto) }}</td>
                          <td class="text-right">
                            {{ formatearMoneda(fondo.montoEjecutado || 0) }}
                          </td>
                          <td
                            class="text-right"
                            :class="getColorDiferencia(fondo.monto - (fondo.montoEjecutado || 0))"
                          >
                            {{ formatearMoneda(fondo.monto - (fondo.montoEjecutado || 0)) }}
                          </td>
                          <td class="text-center">
                            <v-icon :color="fondo.verificado ? 'success' : 'error'">
                              {{ fondo.verificado ? 'mdi-check-circle' : 'mdi-close-circle' }}
                            </v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Comentarios y Recomendaciones -->
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="bg-primary-lighten-5">
                <v-icon class="mr-2">mdi-comment-text</v-icon>
                Comentarios y Recomendaciones
              </v-card-title>
              <v-card-text>
                <p class="text-body-2 resumen-texto">
                  {{ formData.comentarios_recomendaciones || 'No especificados' }}
                </p>
              </v-card-text>
            </v-card>

            <!-- Validación del Formulario -->
            <v-alert v-if="!formularioCompleto" type="warning" variant="tonal" class="mb-4">
              <template v-slot:title>
                <strong>Formulario Incompleto</strong>
              </template>
              Por favor, complete todos los campos requeridos antes de enviar el informe.
            </v-alert>

            <v-alert v-else type="success" variant="tonal" class="mb-4">
              <template v-slot:title>
                <strong>Formulario Completo</strong>
              </template>
              Todos los campos requeridos han sido completados. Puede proceder con el envío del
              informe.
            </v-alert>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="outlined"
            @click="mostrarResumen = false"
            prepend-icon="mdi-arrow-left"
          >
            Volver al Formulario
          </v-btn>
          <v-btn
            color="primary"
            @click="enviarFormulario"
            :loading="enviando"
            :disabled="!formularioCompleto"
            prepend-icon="mdi-send"
          >
            Confirmar y Enviar Informe
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInformeActividadStore } from '@/modules/formularios/store/useInformeActividadStore'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import EncabezadoContribucion from '@/modules/formularios/components/EncabezadoContribucion.vue'
import RegistroAvanceIndicadores from '@/modules/reportes/components/RegistroAvanceIndicadores.vue'
import { useInformeActividad } from '@/modules/formularios/composables/useInformeActividad'
import { useSnackbar } from '@/composables/useSnackbar'
import HerramientasAplicadasResultados from '@/modules/formularios/components/HerramientasAplicadasResultados.vue'
import InformacionCuantitativa from '@/modules/formularios/components/InformacionCuantitativa.vue'

const modalAbierto = ref(false)

// Composables
const { usuario, informacionUsuarioPorNick } = useUsuario()

// Router
const route = useRoute()
const router = useRouter()
const storeInfActividad = useInformeActividadStore()
const form = ref(null)
const enviando = ref(false)
const mostrarResumen = ref(false)

const idactividad = route.params.id

//Iniciar el composable
const { crearInformeActividadMin, informeActividadMinRespuesta } = useInformeActividad()
const { infoMsg } = useSnackbar()

const manejarRegistrosIndicadores = async () => {
  console.log('Registro de indicadores')
}

const formData = reactive({
  fecha_ejecucion: '',
  contribucion_actividad: '',
  objetivo_de_actividad: '',
  informe_de_objetivo_de_actividad: '',
  tipo_de_actividad: '',
  reporte_tipo: '',
  avance_en_indicador: '',
  informacion_cuantitativa: '',
  descripcion_herramientas: '',
  medios_verificacion: '',
  comentarios_recomendaciones: '',
  observaciones_presupuesto: '',
  archivos_cuantitativos: [],
  herramientas_archivos: [],
  medios_archivos: [],
})

// Datos de contribución recibidos
const datosContribucion = ref({})

// Variable para presupuesto ejecutado manual
const presupuestoEjecutadoManual = ref(0)

// Variable para controlar la verificación de informe existente
const verificando = ref(false)

// Computed para verificar si el formulario está completo
const formularioCompleto = computed(() => {
  const camposRequeridos = [
    'fecha_ejecucion',
    'objetivo_de_actividad',
    'informe_de_objetivo_de_actividad',
    'reporte_tipo',
    'informacion_cuantitativa',
    'descripcion_herramientas',
    'medios_verificacion',
    'comentarios_recomendaciones',
  ]

  return camposRequeridos.every((campo) => {
    const valor = formData[campo]
    return valor && valor.toString().trim().length > 0
  })
})

// Total de archivos adjuntos
const totalArchivosAdjuntos = computed(() => {
  return (
    (formData.archivos_cuantitativos?.length || 0) +
    (formData.herramientas_archivos?.length || 0) +
    (formData.medios_archivos?.length || 0)
  )
})

const recibirDatosContribucion = (payload) => {
  datosContribucion.value = payload
  formData.contribucion_actividad = payload
}

// Datos de procedencia de fondos (reactivo)
const procedenciaFondos = ref([])

// Computed para facilitar el acceso a los datos
const actividad = computed(() => storeInfActividad.actividad)

onMounted(async () => {
  if (idactividad) {
    verificando.value = true
    try {
      await storeInfActividad.cargarInformesActividadPorId(idactividad)
      if (storeInfActividad.listaInformeActividad?.length > 0) {
        infoMsg('Ya existe un informe para esta actividad')
        router.push('/actividades/informe/')
        return // Esto evita que se ejecute el resto del código
      }
    } catch (error) {
      console.error('Error verificando informes:', error)
    } finally {
      verificando.value = false
    }

    // Solo si no existe informe, cargar los datos normalmente
    await cargarDatos()
  }
})

const cargandoGeneral = ref(false)
const cargarDatos = async () => {
  cargandoGeneral.value = true
  try {
    await storeInfActividad.cargarActividadPorId(idactividad)
    // Inicializar datos del formulario con información existente
    if (storeInfActividad.actividad) {
      formData.objetivo_de_actividad = storeInfActividad.actividad.objetivo_de_actividad || ''
      formData.tipo_de_actividad = storeInfActividad.actividad.tipo_info?.tipo_actividad || ''

      // Inicializar procedencia de fondos
      inicializarProcedenciaFondos()
    }
  } catch (error) {
    console.error('Error cargando actividad:', error)
  } finally {
    cargandoGeneral.value = false
  }
}

// Inicializar datos de procedencia de fondos
const inicializarProcedenciaFondos = () => {
  const fondos = storeInfActividad.actividad?.procedencia_fondos || []
  procedenciaFondos.value = fondos.map((fondo) => ({
    ...fondo,
    montoEjecutado: fondo.montoEjecutado || 0,
    verificado: fondo.verificado || false,
  }))
}

const modalAbierto = ref(false)

const manejarRegistrosIndicadores = (payload) => {
  console.log('Registros: ', payload)
  formData.avance_en_indicador = payload
}

// Validators mejorados
const validators = {
  required: (value) => !!value || 'Este campo es requerido',
  minLength: (min) => (value) => !value || value.length >= min || `Mínimo ${min} caracteres`,
  archivosTamanio: (files) => {
    if (!files || files.length === 0) return true
    const maxSize = 10 * 1024 * 1024 // 10MB
    const archivoMuyGrande = files.find((file) => file.size > maxSize)
    return !archivoMuyGrande || 'El archivo no debe superar los 10MB'
  },
}

// Funciones de formato
const formatearMoneda = (monto) => {
  if (!monto && monto !== 0) return 'Bs. 0.00'
  return `Bs. ${parseFloat(monto).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const getColorDiferencia = (diferencia) => {
  if (diferencia > 0) return 'text-green' // Sobrante
  if (diferencia < 0) return 'text-red' // Déficit
  return 'text-grey' // Exacto
}

const getColorPorcentaje = (porcentaje) => {
  if (porcentaje >= 100) return 'green-lighten-5'
  if (porcentaje >= 80) return 'blue-lighten-5'
  if (porcentaje >= 50) return 'orange-lighten-5'
  return 'red-lighten-5'
}

const getColorPorcentajeBar = (porcentaje) => {
  if (porcentaje >= 100) return 'success'
  if (porcentaje >= 80) return 'primary'
  if (porcentaje >= 50) return 'warning'
  return 'error'
}

// Computed properties para procedencia de fondos
const presupuestoTotalPlanificado = computed(() => {
  return parseFloat(storeInfActividad.actividad?.presupuesto) || 0
})

const totalPlanificadoProcedencia = computed(() => {
  return procedenciaFondos.value.reduce((total, fondo) => total + (parseFloat(fondo.monto) || 0), 0)
})

const totalEjecutadoProcedencia = computed(() => {
  return procedenciaFondos.value.reduce(
    (total, fondo) => total + (parseFloat(fondo.montoEjecutado) || 0),
    0,
  )
})

const diferenciaTotalProcedencia = computed(() => {
  return totalPlanificadoProcedencia.value - totalEjecutadoProcedencia.value
})

const porcentajeEjecucion = computed(() => {
  if (totalPlanificadoProcedencia.value === 0) return 0
  return ((totalEjecutadoProcedencia.value / totalPlanificadoProcedencia.value) * 100).toFixed(2)
})

const todosVerificados = computed(() => {
  return (
    procedenciaFondos.value.length > 0 && procedenciaFondos.value.every((fondo) => fondo.verificado)
  )
})

// Nuevas computed properties para manejar ambos casos
const totalEjecutado = computed(() => {
  if (procedenciaFondos.value.length > 0) {
    return totalEjecutadoProcedencia.value
  } else {
    return presupuestoEjecutadoManual.value || 0
  }
})

const diferenciaTotal = computed(() => {
  return presupuestoTotalPlanificado.value - totalEjecutado.value
})

const porcentajeEjecucionTotal = computed(() => {
  if (presupuestoTotalPlanificado.value === 0) return 0
  return ((totalEjecutado.value / presupuestoTotalPlanificado.value) * 100).toFixed(2)
})

// Métodos
const calcularTotalesProcedencia = () => {}

const actualizarVerificacion = () => {}

// Método para abrir el resumen
const abrirResumen = async () => {
  const { valid } = await form.value.validate()

  if (!valid) {
    console.error('El formulario contiene errores')
    return
  }

  mostrarResumen.value = true
}

// Método para enviar el formulario
const enviarFormulario = async () => {
  enviando.value = true
  try {
    // Preparar datos para envío
    const datosEnvio = {
      ...formData,
      actividad_id: storeInfActividad.actividad.id,
      procedencia_fondos: procedenciaFondos.value,
      total_planificado: totalPlanificadoProcedencia.value,
      total_ejecutado: totalEjecutado.value,
      diferencia_total: diferenciaTotal.value,
      porcentaje_ejecucion: porcentajeEjecucionTotal.value,
      timestamp: new Date().toISOString(),
    }

    console.log('Datos a enviar:', datosEnvio)

    //Guardar la informacion
    await crearInformeActividadMin(datosEnvio)

    // Aquí iría la llamada a la API para guardar el informe
    // await apiGuardarInforme(datosEnvio)

    console.log('Informe enviado exitosamente')

    // Cerrar el diálogo de resumen
    mostrarResumen.value = false
    router.push('/actividades/informe/')

    // Mostrar mensaje de éxito
    // Puedes agregar un snackbar o alerta aquí
  } catch (error) {
    console.error('Error al enviar el informe:', error)
  } finally {
    enviando.value = false
  }
}

const limpiarFormulario = () => {
  Object.keys(formData).forEach((key) => {
    if (Array.isArray(formData[key])) {
      formData[key] = []
    } else {
      formData[key] = ''
    }
  })

  // Resetear fondos
  procedenciaFondos.value.forEach((fondo) => {
    fondo.montoEjecutado = 0
    fondo.verificado = false
  })

  // Resetear presupuesto manual
  presupuestoEjecutadoManual.value = 0

  if (form.value) {
    form.value.reset()
  }
}
</script>

<style scoped>
.informe-actividad-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
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

.header-decoration {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.decoration-circle-1 {
  width: 100px;
  height: 100px;
  top: -20px;
  right: -20px;
}

.decoration-circle-2 {
  width: 150px;
  height: 150px;
  bottom: -50px;
  left: -50px;
}

.decoration-circle-3 {
  width: 80px;
  height: 80px;
  bottom: 20px;
  right: 100px;
}

.form-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
}

.form-section h3 {
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
  padding-bottom: 12px;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.gap-3 {
  gap: 12px;
}

/* Estilos para el resumen */
.resumen-container {
  max-height: 70vh;
  overflow-y: auto;
}

.resumen-texto {
  white-space: pre-wrap;
  line-height: 1.6;
}

.bg-primary-lighten-5 {
  background-color: rgba(25, 118, 210, 0.05);
}

/* Ajustes responsivos */
@media (max-width: 960px) {
  .informe-actividad-container {
    padding: 16px 12px;
  }

  .form-section {
    padding: 20px;
    margin-bottom: 20px;
  }

  .d-flex.justify-end {
    flex-direction: column;
    gap: 8px;
  }

  .d-flex.justify-end .v-btn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .v-card {
    margin: 8px 0;
  }

  .form-section {
    padding: 16px;
  }
}

.text-green {
  color: #4caf50;
}

.text-red {
  color: #f44336;
}

.text-grey {
  color: #9e9e9e;
}
</style>
