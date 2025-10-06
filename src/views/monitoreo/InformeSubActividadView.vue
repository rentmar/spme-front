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

                <v-form ref="form" @submit.prevent="submitForm">
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

                    <!-- Desglose de Presupuesto Planificado -->
                    <div class="mb-6">
                      <h4 class="text-h6 mb-3 primary--text">
                        Desglose de Presupuesto Planificado
                      </h4>

                      <!-- Tabla para mostrar el desglose existente -->
                      <v-table
                        class="elevation-1 rounded-lg mb-4"
                        v-if="desglosePresupuesto.length > 0"
                      >
                        <thead>
                          <tr>
                            <th class="text-subtitle-2 font-weight-bold">Descripción</th>
                            <th class="text-subtitle-2 font-weight-bold">
                              Monto Planificado (Bs.)
                            </th>
                            <th class="text-subtitle-2 font-weight-bold">Monto Ejecutado (Bs.)</th>
                            <th class="text-subtitle-2 font-weight-bold">Diferencia</th>
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
                                @update:model-value="calcularTotales"
                              ></v-text-field>
                            </td>
                            <td
                              class="text-right"
                              :class="getColorDiferencia(item.monto - (item.montoEjecutado || 0))"
                            >
                              {{ formatearMoneda(item.monto - (item.montoEjecutado || 0)) }}
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
                          </tr>
                        </tfoot>
                      </v-table>

                      <v-alert v-else type="info" variant="tonal" class="mb-4">
                        No hay desglose de presupuesto disponible.
                      </v-alert>
                    </div>

                    <!-- Resumen de Presupuesto -->
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
                          <v-text-field
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
                      prepend-icon="mdi-send"
                      type="submit"
                      :loading="enviando"
                      :disabled="!isFormValid"
                    >
                      Enviar Informe
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
import IndicadorRegistroBitacora from '@/modules/reportes/components/IndicadorRegistroBitacora.vue'
import RegistroInformeIndicadoresBitacora from '@/modules/reportes/components/RegistroInformeIndicadoresBitacora.vue'
import RegistroAvanceIndicadores from '@/modules/reportes/components/RegistroAvanceIndicadores.vue'

// Router y route
const route = useRoute()
const router = useRouter()
const idtarea = ref(route.params.id)

// Estados
const cargandoGeneral = ref(true)
const enviando = ref(false)
const form = ref(null)
const modalAbierto = ref(false)

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
  //formData.contribucion_proyecto = JSON.stringify(payload)
}

const actualizarIndicadores = (payload) => {
  formData.avance_en_indicador = JSON.stringify(payload)
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

// Carga de datos inicial
const cargarInformacion = async () => {
  cargandoGeneral.value = true
  try {
    if (idtarea.value) {
      await storeInfTarea.obtenerTareasPorIdMasDetalles(idtarea.value)

      // Inicializar datos de presupuesto desde la tarea
      if (storeInfTarea.tarea?.presupuestoDesglose) {
        desglosePresupuesto.value = storeInfTarea.tarea.presupuestoDesglose.map((item) => ({
          ...item,
          montoEjecutado: 0,
        }))
      } else {
        // Datos de ejemplo si no hay desglose
        desglosePresupuesto.value = [
          { descripcion: 'Materiales', monto: 100, montoEjecutado: 0 },
          { descripcion: 'Logística', monto: 100, montoEjecutado: 0 },
          { descripcion: 'Otros', monto: 45, montoEjecutado: 0 },
        ]
      }

      if (storeInfTarea.tarea?.presupuesto) {
        presupuestoPlanificado.value = parseFloat(storeInfTarea.tarea.presupuesto)
      } else {
        presupuestoPlanificado.value = totalPlanificado.value
      }

      calcularDiferenciaTotal()
    }
  } catch (err) {
    console.error('Error al cargar la información de la tarea:', err)
  } finally {
    cargandoGeneral.value = false
  }
}

// Reset del formulario
const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    if (Array.isArray(formData[key])) {
      formData[key] = []
    } else {
      formData[key] = ''
    }
  })

  // Resetear datos de presupuesto
  desglosePresupuesto.value.forEach((item) => {
    item.montoEjecutado = 0
  })
  presupuestoEjecutado.value = 0
  diferenciaTotal.value = presupuestoPlanificado.value

  datosContribucion.value = {}
}

// Envío del formulario a la API
const submitForm = async () => {
  const { valid } = await form.value.validate()

  if (!valid) {
    alert('Por favor complete todos los campos requeridos correctamente')
    return
  }

  enviando.value = true
  try {
    // Preparar datos para envío
    const payload = {
      tarea_id: parseInt(idtarea.value),
      actividad_id: storeInfTarea.actividad?.id,
      proyecto_id: storeInfTarea.proyecto?.id,
      fecha_ejecucion: formData.fecha_ejecucion,
      contribucion_proyecto: formData.contribucion_proyecto,
      contribucion_actividad: formData.contribucion_actividad,
      objetivo_de_actividad: formData.objetivo_de_actividad,
      informe_de_objetivo_de_actividad: formData.informe_de_objetivo_de_actividad,
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
      // Archivos (necesitarás un manejo especial para subir archivos)
      //archivos_cuantitativos: formData.archivos_cuantitativos,
      //herramientas_archivos: formData.herramientas_archivos,
      //medios_archivos: formData.medios_archivos,
      //archivos_presupuesto: formData.archivos_presupuesto,
      //estado: 'PENDIENTE',
      //fecha_creacion: new Date().toISOString(),
    }

    console.log('Enviando informe a la API:', payload)

    // Aquí iría la llamada real a tu API
    // const response = await fetch('/api/informes-tarea/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${tuToken}`
    //   },
    //   body: JSON.stringify(payload)
    // })

    // if (!response.ok) {
    //   throw new Error('Error en la respuesta del servidor')
    // }

    // const data = await response.json()

    // Simulación de envío exitoso
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mostrar mensaje de éxito
    alert('Informe de subactividad enviado con éxito')

    // Redirigir o resetear el formulario
    resetForm()

    // Opcional: redirigir a la lista de actividades
    // router.push('/pei/listaactividades')
  } catch (error) {
    console.error('Error al enviar el informe:', error)
    alert('Error al enviar el informe. Por favor, intente nuevamente.')
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
onMounted(() => {
  if (idtarea.value) {
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
