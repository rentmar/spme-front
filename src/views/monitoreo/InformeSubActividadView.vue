<template>
  <v-container class="informe-actividad-container">
    <!-- Overlay de carga -->
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
        <p class="mt-4 text-h6">Cargando formulario para Informe SubActividad...</p>
      </div>
    </v-overlay>

    <div v-if="!cargandoGeneral && storeInfTarea.tarea">
      <v-row>
        <!-- Formulario principal -->
        <v-col cols="12" md="12" lg="12">
          <PaginaTituloIcono
            :titulo="'Informe de Sub Actividad'"
            :icon="'mdi-file-document-multiple'"
          />
          <v-card elevation="2" rounded="lg">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon class="mr-2">mdi-file-document-multiple</v-icon>
                Informe de Subactividad: {{ storeInfTarea.tarea?.codigo || 'Cargando...' }}
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pa-4">
              <!-- Encabezado diferenciado -->
              <div class="mb-6">
                <!-- Información del Proyecto -->
                <div v-if="storeInfTarea.proyecto" class="mb-4">
                  <ProyectoIdHeader :proyecto-id="storeInfTarea.proyecto.id" />
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Información de la Actividad -->
                <div v-if="storeInfTarea.actividad" class="mb-4">
                  <ActividadInformacion :actividad-id="storeInfTarea.actividad.id" />
                </div>

                <!-- Información específica de la Tarea -->
                <v-card variant="outlined" class="mb-4">
                  <v-card-title class="text-h6">
                    <v-icon color="primary" class="mr-2"
                      >mdi-checkbox-multiple-marked-circle</v-icon
                    >
                    Información de la Subactividad
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="storeInfTarea.tarea.codigo"
                          label="Codigo"
                          variant="outlined"
                          readonly
                          bg-color="grey-lighten-4"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="storeInfTarea.tarea?.titulo"
                          label="Título"
                          variant="outlined"
                          readonly
                          bg-color="grey-lighten-4"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="storeInfTarea.tarea?.estado"
                          label="Estado"
                          variant="outlined"
                          readonly
                          bg-color="grey-lighten-4"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="formatearMoneda(storeInfTarea.tarea?.presupuesto)"
                          label="Presupuesto de Tarea"
                          variant="outlined"
                          readonly
                          bg-color="grey-lighten-4"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="formatearFecha(storeInfTarea.tarea?.fecha_creacion)"
                          label="Fecha de Inicio"
                          variant="outlined"
                          readonly
                          bg-color="grey-lighten-4"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="formatearFecha(storeInfTarea.tarea?.fecha_limite)"
                          label="Fecha de Finalizacion"
                          variant="outlined"
                          readonly
                          bg-color="grey-lighten-4"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          :model-value="storeInfTarea.tarea?.descripcion"
                          label="Descripción de la Subactividad"
                          variant="outlined"
                          readonly
                          bg-color="grey-lighten-4"
                          rows="2"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          :model-value="storeInfTarea.actividad.tipo_info.tipo_actividad"
                          label="Tipo de Actividad al que pertenece"
                          variant="outlined"
                          readonly
                          bg-color="grey-lighten-4"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <div class="header-decoration">
                  <div class="decoration-circle decoration-circle-1"></div>
                  <div class="decoration-circle decoration-circle-2"></div>
                  <div class="decoration-circle decoration-circle-3"></div>
                </div>

                <v-form ref="form" @submit.prevent="mostrarResumen">
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
                          v-if="storeInfTarea.actividad?.estructuraProcedencia"
                          :datos-estructura="storeInfTarea.actividad.estructuraProcedencia"
                          @payload-actualizado="recibirDatosContribucion"
                        />
                        <v-alert v-else type="warning" variant="tonal">
                          No hay estructura de procedencia disponible para esta actividad.
                        </v-alert>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Seccion: Contribuciones a la Actividad -->
                  <div class="form-section mb-6">
                    <h3 class="text-h6 mb-4 primary--text">
                      <v-icon color="primary" class="mr-2">mdi-target</v-icon>
                      Contribuciones a la Actividad
                    </h3>
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-model="formData.contribucion_actividad"
                          label="Contribución a la Actividad"
                          variant="outlined"
                          required
                          :rules="[validators.required]"
                          placeholder="Describa el cumplimiento del objetivo de esta tarea..."
                          rows="3"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Sección de Objetivo -->
                  <div class="form-section mb-6">
                    <h3 class="text-h6 mb-4 primary--text">
                      <v-icon color="primary" class="mr-2">mdi-target</v-icon>
                      Objetivo de la Subactividad
                    </h3>
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-model="formData.objetivo_de_actividad"
                          label="Objetivo de la Subactividad"
                          variant="outlined"
                          required
                          rows="3"
                          :rules="[validators.required]"
                          placeholder="Escriba el objetivo de la Subactividad..."
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="formData.informe_de_objetivo_de_actividad"
                          label="Informe del objetivo de la Subactividad"
                          variant="outlined"
                          required
                          rows="3"
                          :rules="[validators.required]"
                          placeholder="Describa el cumplimiento del objetivo de esta Subactividad..."
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Sección de Reporte -->
                  <div class="form-section mb-6">
                    <h3 class="text-h6 mb-4 primary--text">
                      <v-icon color="primary" class="mr-2">mdi-file-document</v-icon>
                      Reporte de la Subactividad
                    </h3>
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-model="formData.reporte_subactividad"
                          label="Reporte de la Subactividad"
                          variant="outlined"
                          required
                          :rules="[validators.required]"
                          placeholder="Escriba el reporte de la SubActividad..."
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
                          :idactividad="storeInfTarea.actividad.id"
                          @todos-los-registros-enviados="actualizarIndicadores"
                          ref="registroIndicadoresRef"
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

                  <!-- Sección de Presupuesto -->
                  <div class="form-section mb-6">
                    <h3 class="text-h6 mb-4 primary--text">
                      <v-icon color="primary" class="mr-2">mdi-cash-multiple</v-icon>
                      Presupuesto
                    </h3>

                    <!-- Con Desglose de Presupuesto -->
                    <div v-if="desglosePresupuesto.length > 0" class="mb-6">
                      <h4 class="text-h6 mb-3 primary--text">
                        Desglose de Presupuesto Planificado
                      </h4>

                      <!-- Tabla para mostrar el desglose existente -->
                      <v-table class="elevation-1 rounded-lg mb-4">
                        <thead>
                          <tr>
                            <th class="text-subtitle-2 font-weight-bold">Descripción</th>
                            <th class="text-subtitle-2 font-weight-bold">
                              Monto Planificado (Bs.)
                            </th>
                            <th class="text-subtitle-2 font-weight-bold">Monto Ejecutado (Bs.)</th>
                            <th class="text-subtitle-2 font-weight-bold">Diferencia</th>
                            <th class="text-subtitle-2 font-weight-bold">Validado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in desglosePresupuesto" :key="index">
                            <td class="font-weight-medium">{{ item.descripcion }}</td>
                            <td class="text-right">{{ formatearMoneda(item.monto) }}</td>
                            <td>
                              <v-text-field
                                v-model.number="item.montoEjecutado"
                                type="number"
                                variant="outlined"
                                density="compact"
                                hide-details
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                :readonly="item.validado"
                                :bg-color="item.validado ? 'green-lighten-5' : ''"
                                @update:model-value="calcularTotales"
                              ></v-text-field>
                            </td>
                            <td
                              class="text-right"
                              :class="getColorDiferencia(item.monto - (item.montoEjecutado || 0))"
                            >
                              {{ formatearMoneda(item.monto - (item.montoEjecutado || 0)) }}
                            </td>
                            <td class="text-center">
                              <v-checkbox
                                :model-value="item.validado"
                                @update:model-value="toggleValidado(index, $event)"
                                hide-details
                                color="success"
                                class="justify-center"
                              ></v-checkbox>
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr class="font-weight-bold" style="background-color: #f5f5f5">
                            <td class="text-subtitle-2">TOTAL</td>
                            <td class="text-right text-subtitle-2">
                              {{ formatearMoneda(totalPlanificado) }}
                            </td>
                            <td class="text-right text-subtitle-2">
                              {{ formatearMoneda(totalEjecutado) }}
                            </td>
                            <td
                              class="text-right text-subtitle-2"
                              :class="getColorDiferencia(totalPlanificado - totalEjecutado)"
                            >
                              {{ formatearMoneda(totalPlanificado - totalEjecutado) }}
                            </td>
                            <td class="text-center">
                              <v-icon v-if="todosItemsValidados" color="success" size="small">
                                mdi-check-circle
                              </v-icon>
                              <v-icon v-else color="warning" size="small">
                                mdi-alert-circle
                              </v-icon>
                            </td>
                          </tr>
                        </tfoot>
                      </v-table>
                    </div>

                    <!-- Sin Desglose de Presupuesto -->
                    <div v-else class="mb-6">
                      <h4 class="text-h6 mb-3 primary--text">Resumen de Presupuesto</h4>
                      <v-alert type="info" variant="tonal" class="mb-4">
                        No hay desglose de presupuesto disponible para esta subactividad.
                      </v-alert>
                    </div>

                    <!-- Resumen de Presupuesto (siempre visible) -->
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-card variant="outlined" class="pa-4">
                          <v-card-title class="text-h6 pa-0 mb-2">
                            Presupuesto Planificado
                          </v-card-title>
                          <v-text-field
                            :model-value="formatearMoneda(presupuestoPlanificado)"
                            label="Monto Total Planificado"
                            variant="outlined"
                            readonly
                            bg-color="grey-lighten-4"
                            class="mb-2"
                          ></v-text-field>
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
                            Presupuesto Ejecutado
                          </v-card-title>
                          <!-- Campo de presupuesto ejecutado varía según si hay desglose -->
                          <v-text-field
                            v-if="desglosePresupuesto.length === 0"
                            v-model.number="presupuestoEjecutado"
                            type="number"
                            label="Monto Total Ejecutado (Bs.)"
                            variant="outlined"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            @update:model-value="calcularDiferenciaTotal"
                            class="mb-2"
                          ></v-text-field>
                          <v-text-field
                            v-else
                            :model-value="formatearMoneda(totalEjecutado)"
                            label="Monto Total Ejecutado (Bs.)"
                            variant="outlined"
                            readonly
                            bg-color="grey-lighten-4"
                            class="mb-2"
                          ></v-text-field>

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
                        </v-card>
                      </v-col>
                    </v-row>

                    <!-- Archivos de comprobantes -->
                    <v-row class="mt-4">
                      <v-col cols="12">
                        <v-file-input
                          v-model="formData.archivos_presupuesto"
                          label="Adjuntar comprobantes presupuestarios"
                          variant="outlined"
                          multiple
                          chips
                          show-size
                          :accept="acceptedFormats.herramientas"
                          prepend-icon="mdi-receipt"
                          :rules="[validators.archivosTamanio]"
                        ></v-file-input>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Sección de Medios de Verificación -->
                  <div class="form-section mb-6">
                    <h3 class="text-h6 mb-4 primary--text">
                      <v-icon color="primary" class="mr-2">mdi-checkbox-marked-circle</v-icon>
                      Medios de Verificación
                    </h3>
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-model="formData.medios_verificacion"
                          label="Descripción de medios de verificación"
                          variant="outlined"
                          required
                          :rules="[validators.required]"
                          placeholder="Describa los medios de verificación utilizados..."
                          rows="3"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-file-input
                          v-model="formData.medios_archivos"
                          label="Adjuntar archivos de verificación"
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
                  <div class="d-flex justify-end gap-3 mt-8">
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
                      color="secondary"
                      variant="outlined"
                      size="large"
                      prepend-icon="mdi-backspace-outline"
                      @click="resetForm"
                    >
                      Limpiar
                    </v-btn>
                    <v-btn
                      color="primary"
                      variant="flat"
                      size="large"
                      prepend-icon="mdi-eye"
                      type="submit"
                      :loading="enviando"
                      :disabled="!isFormValid"
                    >
                      Ver Resumen
                    </v-btn>
                  </div>
                </v-form>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Estado cuando no hay datos -->
    <div v-else-if="!cargandoGeneral && !storeInfTarea.tarea" class="text-center py-8">
      <v-alert type="error" variant="tonal">
        No se pudo cargar la información de la tarea. Verifique que la tarea exista.
      </v-alert>
    </div>

    <!-- Diálogo de Resumen -->
    <v-dialog v-model="modalResumen" max-width="1200" persistent scrollable>
      <v-card>
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon class="mr-2">mdi-file-document-check</v-icon>
            Resumen del Informe - {{ storeInfTarea.tarea?.codigo }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="modalResumen = false" variant="text">
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
                          <v-icon color="primary">mdi-checkbox-multiple-marked-circle</v-icon>
                        </template>
                        <v-list-item-title>Subactividad</v-list-item-title>
                        <v-list-item-subtitle>{{
                          storeInfTarea.tarea?.codigo || 'N/A'
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
                          >{{ formatearMoneda(presupuestoEjecutado) }} ({{
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
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">
                      Objetivo de la Subactividad
                    </h4>
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
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">
                      Reporte de la Subactividad
                    </h4>
                    <p class="text-body-2 resumen-texto">
                      {{ formData.reporte_subactividad || 'No especificado' }}
                    </p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Indicadores -->
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="bg-primary-lighten-5">
                <v-icon class="mr-2">mdi-chart-box</v-icon>
                Registro de Indicadores
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <div class="d-flex align-center mb-4">
                      <v-chip
                        :color="totalIndicadoresRegistrados > 0 ? 'success' : 'warning'"
                        class="mr-3"
                      >
                        {{ totalIndicadoresRegistrados }} registrados
                      </v-chip>
                      <span class="text-caption">
                        de {{ datosIndicadores.estado?.totalIndicadores || 0 }} indicadores totales
                      </span>
                    </div>

                    <v-alert
                      v-if="totalIndicadoresRegistrados === 0"
                      type="warning"
                      variant="tonal"
                      class="mb-4"
                    >
                      No se han registrado datos de indicadores para esta subactividad.
                    </v-alert>

                    <div v-else class="indicadores-resumen">
                      <v-table density="compact">
                        <thead>
                          <tr>
                            <th>Código</th>
                            <th>Tipo</th>
                            <th>Valor Registrado</th>
                            <th>Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="indicador in datosIndicadores.registros.filter(
                              (item) =>
                                item.datosRegistrados &&
                                Object.keys(item.datosRegistrados).length > 0,
                            )"
                            :key="indicador.id"
                          >
                            <td>{{ indicador.nodoproyecto?.codigo }}</td>
                            <td>
                              <v-chip size="small" :color="getTipoColor(indicador.type)">
                                {{ getTipoLabel(indicador.type) }}
                              </v-chip>
                            </td>
                            <td>
                              {{ indicador.datosRegistrados.valor }}
                              <span v-if="indicador.tipo_dato === '%'">%</span>
                            </td>
                            <td>{{ formatDate(indicador.datosRegistrados.fecha_registro) }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
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
                        {{ formatearMoneda(presupuestoPlanificado) }}
                      </div>
                      <div class="text-caption">Planificado</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card variant="flat" color="green-lighten-5" class="pa-3 text-center">
                      <div class="text-h6 font-weight-bold">
                        {{ formatearMoneda(presupuestoEjecutado) }}
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

                <!-- Desglose de Presupuesto si existe -->
                <v-row v-if="desglosePresupuesto.length > 0" class="mt-4">
                  <v-col cols="12">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Desglose de Presupuesto</h4>
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th>Descripción</th>
                          <th class="text-right">Planificado</th>
                          <th class="text-right">Ejecutado</th>
                          <th class="text-right">Diferencia</th>
                          <th class="text-center">Validado</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in desglosePresupuesto" :key="item.descripcion">
                          <td>{{ item.descripcion }}</td>
                          <td class="text-right">{{ formatearMoneda(item.monto) }}</td>
                          <td class="text-right">
                            {{ formatearMoneda(item.montoEjecutado || 0) }}
                          </td>
                          <td
                            class="text-right"
                            :class="getColorDiferencia(item.monto - (item.montoEjecutado || 0))"
                          >
                            {{ formatearMoneda(item.monto - (item.montoEjecutado || 0)) }}
                          </td>
                          <td class="text-center">
                            <v-icon :color="item.validado ? 'success' : 'error'">
                              {{ item.validado ? 'mdi-check-circle' : 'mdi-close-circle' }}
                            </v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>

                    <!-- Observaciones del presupuesto -->
                    <div v-if="formData.observaciones_presupuesto" class="mt-4">
                      <h4 class="text-subtitle-1 font-weight-bold mb-2">
                        Observaciones del Presupuesto
                      </h4>
                      <p class="text-body-2 resumen-texto">
                        {{ formData.observaciones_presupuesto }}
                      </p>
                    </div>
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

            <!-- Advertencias específicas -->
            <v-alert
              v-if="!todosItemsValidados && desglosePresupuesto.length > 0"
              type="warning"
              variant="tonal"
              class="mb-4"
            >
              <strong>Advertencia:</strong> No todos los items de presupuesto han sido validados.
            </v-alert>

            <v-alert
              v-if="totalIndicadoresRegistrados === 0"
              type="warning"
              variant="tonal"
              class="mb-4"
            >
              <strong>Advertencia:</strong> No se han registrado datos de indicadores.
            </v-alert>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="outlined"
            @click="modalResumen = false"
            prepend-icon="mdi-arrow-left"
          >
            Volver al Formulario
          </v-btn>
          <v-btn
            color="primary"
            @click="confirmarEnvio"
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
import { onMounted, ref, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInformeTareaStore } from '@/modules/formularios/store/useInformeTareaStore'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import EncabezadoContribucion from '@/modules/formularios/components/EncabezadoContribucion.vue'
import RegistroAvanceIndicadores from '@/modules/reportes/components/RegistroAvanceIndicadores.vue'
import { useInformeSubActividad } from '@/modules/formularios/composables/useInformeSubActividad'
import { useSnackbar } from '@/composables/useSnackbar'

// Router y route
const route = useRoute()
const router = useRouter()
const idtarea = ref(route.params.id)

// Estados
const cargandoGeneral = ref(true)
const enviando = ref(false)
const form = ref(null)
const modalResumen = ref(false)
const registroIndicadoresRef = ref(null)

//Iniciar el Composable
const { crearInformeSubactividadMinimo } = useInformeSubActividad()
const { successMsg, errorMsg, infoMsg } = useSnackbar()
// Store
const storeInfTarea = useInformeTareaStore()

// Form data para el formulario
const formData = reactive({
  fecha_ejecucion: '',
  contribucion_proyecto: '',
  contribucion_actividad: '',
  objetivo_de_actividad: '',
  informe_de_objetivo_de_actividad: '',
  reporte_subactividad: '',
  avance_en_indicador: '',
  informacion_cuantitativa: '',
  descripcion_herramientas: '',
  medios_verificacion: '',
  comentarios_recomendaciones: '',
  observaciones_presupuesto: '',
  archivos_cuantitativos: [],
  herramientas_archivos: [],
  medios_archivos: [],
  archivos_presupuesto: [],
})

// Datos de presupuesto
const desglosePresupuesto = ref([])
const presupuestoPlanificado = ref(0)
const presupuestoEjecutado = ref(0)
const diferenciaTotal = ref(0)

// Datos de contribución
const datosContribucion = ref({})

// Datos de indicadores
const datosIndicadores = ref({
  registros: [],
  estado: null,
})

// Formatos de archivo aceptados
const acceptedFormats = {
  herramientas: 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
}

// Computed properties para los totales
const totalPlanificado = computed(() => {
  return desglosePresupuesto.value.reduce((total, item) => total + item.monto, 0)
})

const totalEjecutado = computed(() => {
  return desglosePresupuesto.value.reduce((total, item) => total + (item.montoEjecutado || 0), 0)
})

// Computed property para verificar si todos los items están validados
const todosItemsValidados = computed(() => {
  const resultado =
    desglosePresupuesto.value.length > 0 && desglosePresupuesto.value.every((item) => item.validado)
  console.log('todosItemsValidados calculado:', resultado, desglosePresupuesto.value)
  return resultado
})

const itemsPresupuestoValidados = computed(() => {
  return desglosePresupuesto.value.filter((item) => item.validado).length
})

const totalIndicadoresRegistrados = computed(() => {
  if (!datosIndicadores.value.registros) return 0
  return datosIndicadores.value.registros.filter(
    (item) => item.datosRegistrados && Object.keys(item.datosRegistrados).length > 0,
  ).length
})

const totalArchivosAdjuntos = computed(() => {
  return (
    (formData.archivos_cuantitativos?.length || 0) +
    (formData.herramientas_archivos?.length || 0) +
    (formData.medios_archivos?.length || 0) +
    (formData.archivos_presupuesto?.length || 0)
  )
})

const porcentajeEjecucionTotal = computed(() => {
  if (presupuestoPlanificado.value === 0) return 0
  return ((presupuestoEjecutado.value / presupuestoPlanificado.value) * 100).toFixed(2)
})

const formularioCompleto = computed(() => {
  const camposRequeridos = [
    'fecha_ejecucion',
    'contribucion_actividad',
    'objetivo_de_actividad',
    'informe_de_objetivo_de_actividad',
    'reporte_subactividad',
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

// Validación del formulario
const isFormValid = computed(() => {
  const requiredFields = [
    'fecha_ejecucion',
    'contribucion_actividad',
    'objetivo_de_actividad',
    'informe_de_objetivo_de_actividad',
    'reporte_subactividad',
    'informacion_cuantitativa',
    'descripcion_herramientas',
    'medios_verificacion',
    'comentarios_recomendaciones',
  ]
  return requiredFields.every((field) => formData[field] && formData[field].trim().length > 0)
})

// Validators
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

// Métodos para recibir datos de componentes hijos
const recibirDatosContribucion = (payload) => {
  datosContribucion.value = payload
  formData.contribucion_proyecto = payload
}

const actualizarIndicadores = (payload) => {
  console.log('Información de indicadores recibida: ', payload)
  datosIndicadores.value = {
    registros: payload.datos,
    estado: {
      totalRegistros: payload.totalRegistros,
      totalIndicadores: payload.totalIndicadores,
    },
  }
  formData.avance_en_indicador = payload.datos
}

// Cálculos de presupuesto
const calcularTotales = () => {
  presupuestoEjecutado.value = totalEjecutado.value
  calcularDiferenciaTotal()
}

const calcularDiferenciaTotal = () => {
  diferenciaTotal.value = presupuestoPlanificado.value - presupuestoEjecutado.value
}

const getColorDiferencia = (diferencia) => {
  if (diferencia > 0) return 'text-green' // Sobrante
  if (diferencia < 0) return 'text-red' // Déficit
  return 'text-grey' // Exacto
}

// Método para manejar cambios en la validación - CORREGIDO
const toggleValidado = (index, value) => {
  console.log(`Toggle validado - Index: ${index}, Value: ${value}`)
  console.log('Antes del cambio:', desglosePresupuesto.value[index].validado)

  // Actualizar el valor directamente
  desglosePresupuesto.value[index].validado = value

  // Forzar la reactividad creando un nuevo array
  desglosePresupuesto.value = [...desglosePresupuesto.value]

  console.log('Después del cambio:', desglosePresupuesto.value[index].validado)
  console.log('Estado completo del desglose:', desglosePresupuesto.value)
}

// Métodos auxiliares para indicadores
const getTipoLabel = (type) => {
  const tipos = {
    indicadorog: 'Indicador OG',
    indicadoroe: 'Indicador OE',
    indicadorrog: 'Indicador ROG',
    indicadorroe: 'Indicador ROE',
  }
  return tipos[type] || type
}

const getTipoColor = (type) => {
  const colores = {
    indicadorog: 'primary',
    indicadoroe: 'secondary',
    indicadorrog: 'success',
    indicadorroe: 'info',
  }
  return colores[type] || 'grey'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES')
}

const getColorPorcentajeBar = (porcentaje) => {
  if (porcentaje >= 100) return 'success'
  if (porcentaje >= 80) return 'primary'
  if (porcentaje >= 50) return 'warning'
  return 'error'
}

// Utilidades
const formatearFecha = (fecha) => {
  if (!fecha) return 'No definida'
  return new Date(fecha).toLocaleDateString('es-ES')
}

const formatearMoneda = (monto) => {
  if (!monto && monto !== 0) return 'Bs. 0.00'
  return `Bs. ${parseFloat(monto).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// Carga de datos inicial - CORREGIDA
const cargarInformacion = async () => {
  cargandoGeneral.value = true
  try {
    if (idtarea.value) {
      await storeInfTarea.obtenerTareasPorIdMasDetalles(idtarea.value)

      // Inicializar datos de presupuesto desde la tarea - CORREGIDA
      if (storeInfTarea.tarea?.presupuestoDesglose) {
        // Asegurar que cada item tenga la propiedad validado inicializada correctamente
        desglosePresupuesto.value = storeInfTarea.tarea.presupuestoDesglose.map((item) => ({
          ...item,
          montoEjecutado: item.montoEjecutado || 0,
          validado: item.validado !== undefined ? item.validado : false,
        }))
      } else {
        // Si no hay desglose, mantener el array vacío
        desglosePresupuesto.value = []
      }

      if (storeInfTarea.tarea?.presupuesto) {
        presupuestoPlanificado.value = parseFloat(storeInfTarea.tarea.presupuesto)
      } else {
        presupuestoPlanificado.value = totalPlanificado.value
      }

      calcularDiferenciaTotal()

      // Debug: verificar el estado inicial
      console.log('Desglose inicial cargado:', desglosePresupuesto.value)
    }
  } catch (err) {
    console.error('Error al cargar la información de la tarea:', err)
  } finally {
    cargandoGeneral.value = false
  }
}

// Reset del formulario - CORREGIDA
const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    if (Array.isArray(formData[key])) {
      formData[key] = []
    } else {
      formData[key] = ''
    }
  })

  // Resetear datos de presupuesto - CORREGIDA
  desglosePresupuesto.value = desglosePresupuesto.value.map((item) => ({
    ...item,
    montoEjecutado: 0,
    validado: false,
  }))

  presupuestoEjecutado.value = 0
  diferenciaTotal.value = presupuestoPlanificado.value

  // Resetear datos de indicadores
  datosIndicadores.value = {
    registros: [],
    estado: null,
  }

  datosContribucion.value = {}
}

// Mostrar resumen antes del envío
const mostrarResumen = async () => {
  const { valid } = await form.value.validate()

  if (!valid) {
    alert('Por favor complete todos los campos requeridos correctamente')
    return
  }

  // Sincronizar datos de indicadores si es necesario
  if (registroIndicadoresRef.value) {
    try {
      const datosCompletos = registroIndicadoresRef.value.obtenerDatosCompletos()
      const datosParaEnvio = registroIndicadoresRef.value.generarDatosParaEnvio()

      datosIndicadores.value = {
        registros: datosParaEnvio,
        estado: datosCompletos.estado,
      }
      formData.avance_en_indicador = datosParaEnvio
    } catch (error) {
      console.error('Error al sincronizar datos de indicadores:', error)
    }
  }

  modalResumen.value = true
}

// Confirmar y enviar el formulario
const confirmarEnvio = async () => {
  modalResumen.value = false
  enviando.value = true

  try {
    // Preparar datos para envío
    const payload = {
      tarea: parseInt(idtarea.value),
      actividad: storeInfTarea.actividad?.id,
      proyecto: storeInfTarea.proyecto?.id,
      fecha_ejecucion: formData.fecha_ejecucion,
      contribucion_proyecto: formData.contribucion_proyecto,
      contribucion_actividad: formData.contribucion_actividad,
      tipo_actividad: storeInfTarea.actividad.tipo_info.tipo_actividad,
      objetivo_subactividad: formData.objetivo_de_actividad,
      informe_objetivo_subactividad: formData.informe_de_objetivo_de_actividad,
      reporte_subactividad: formData.reporte_subactividad,
      avance_en_indicador: formData.avance_en_indicador,
      informacion_cuantitativa: formData.informacion_cuantitativa,
      descripcion_herramientas: formData.descripcion_herramientas,
      medios_verificacion: formData.medios_verificacion,
      comentarios_recomendaciones: formData.comentarios_recomendaciones,
      observaciones_presupuesto: formData.observaciones_presupuesto,
      // Datos de presupuesto estructurados
      desglose_presupuesto: desglosePresupuesto.value,
      presupuesto_planificado: presupuestoPlanificado.value,
      presupuesto_ejecutado: presupuestoEjecutado.value,
      diferencia_total: diferenciaTotal.value,
    }

    console.log('Enviando informe a la API:', payload)

    // Simulación de envío exitoso
    //await new Promise((resolve) => setTimeout(resolve, 2000))

    //Enviar la informacion al rest api
    await crearInformeSubactividadMinimo(payload)

    // // Mostrar mensaje de éxito
    // alert(
    //   `✅ Informe de subactividad enviado con éxito\n📊 ${totalIndicadoresRegistrados.value} indicadores registrados`,
    // )
    successMsg('Informe de subactividad enviado con exito')

    // Redirigir o resetear el formulario
    resetForm()
    router.push('/actividades/informe/')
  } catch (error) {
    console.error('Error al enviar el informe:', error)
    // alert('❌ Error al enviar el informe. Por favor, intente nuevamente.')
    errorMsg('Error al enviar el informe. Por favor, intente nuevamente.')
  } finally {
    enviando.value = false
  }
}

// Watchers
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      idtarea.value = newId
      cargarInformacion()
    }
  },
)

// Lifecycle
onMounted(async () => {
  if (idtarea.value) {
    try {
      await storeInfTarea.obtenerInformesSubactividadPorSubactividad(idtarea.value)
      if (storeInfTarea.tareaListaInfo?.total_informes > 0) {
        infoMsg('Ya existe un informe para esta Subactividad')
        router.push('/actividades/informe/')
        return // Esto evita que se ejecute el resto del código
      }
    } catch (error) {
      console.error('Error verificando informes:', error)
    }
    cargarInformacion()
  } else {
    cargandoGeneral.value = false
    console.error('No se encontró ID de tarea en la ruta')
  }
})
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

.indicadores-resumen {
  max-height: 300px;
  overflow-y: auto;
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
