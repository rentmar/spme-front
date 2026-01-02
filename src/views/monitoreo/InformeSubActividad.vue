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
        <p class="mt-4 text-h6">Cargando formulario de subactividad...</p>
      </div>
    </v-overlay>

    <div v-if="!cargandoGeneral && storeInfTarea.tarea">
      <!--Titulo de la pagina-->
      <PaginaTituloIcono
        :titulo="'Informe de Sub-Actividad'"
        :icon="'mdi-file-document-multiple'"
      ></PaginaTituloIcono>

      <!--Encabezado del Proyecto-->
      <ProyectoIdHeader
        v-if="storeInfTarea.proyecto"
        :proyecto-id="storeInfTarea.proyecto?.id"
      ></ProyectoIdHeader>

      <!--Encabezado de la Actividad-->
      <ActividadInformacion
        v-if="storeInfTarea.actividad"
        :actividad-id="storeInfTarea.actividad?.id"
      />

      <v-row>
        <!-- Formulario principal -->
        <v-col cols="12">
          <v-card elevation="2" rounded="lg">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon class="mr-2">mdi-clipboard-text-outline</v-icon>
                Formulario de Informe de SubActividad
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pa-4">
              <v-form ref="form" @submit.prevent="submitForm">
                <!-- Información de la tarea -->
                <div class="form-section mb-6" v-if="storeInfTarea.tarea">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                    Información de la SubActividad
                  </h3>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        :model-value="storeInfTarea.tarea.codigo || 'No disponible'"
                        label="Código"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        :model-value="estadoFormateado"
                        label="Estado"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        :model-value="storeInfTarea.tarea.titulo || 'No disponible'"
                        label="Titulo de la SubActividad"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                        rows="2"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        :model-value="storeInfTarea.tarea.descripcion || 'Sin Descripcion'"
                        label="Descripcion"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.tipoActividad"
                        label="Tipo de la Actividad"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        :model-value="formatearFecha(storeInfTarea.tarea?.fecha_creacion)"
                        type="date"
                        label="Fecha Inicio"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        :model-value="formatearFecha(storeInfTarea.tarea?.fecha_limite)"
                        type="date"
                        label="Fecha Limite"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        :model-value="formatearPresupuesto(storeInfTarea.tarea?.presupuesto)"
                        label="Presupuesto"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 1: Fecha de Ejecución -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
                    Fecha de Ejecución
                  </h3>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field
                        v-model="formData.fechaEjecucion"
                        label="Fecha de Ejecución"
                        type="date"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        :rules="[(v) => !!v || 'La fecha de ejecución es requerida']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>
                <!-- Seccion: Contribucion al proyecto-->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-chart-bar</v-icon>
                    Contribución al Proyecto
                  </h3>
                  <v-row>
                    <v-col cols="12">
                      <EncabezadoContribucion
                        v-if="storeInfTarea.actividad?.estructuraProcedencia"
                        :datos-estructura="storeInfTarea.actividad?.estructuraProcedencia"
                        @payload-actualizado="recibirDatosContribucion"
                      ></EncabezadoContribucion>
                      <v-alert v-else type="warning" variant="tonal">
                        No hay estructura de procedencia disponible para esta actividad.
                      </v-alert>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 3: Objetivo de la SubActividad -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-target</v-icon>
                    Objetivo SubActividad
                  </h3>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-textarea
                        v-model="formData.objetivoTarea"
                        label="Objetivo específico de la subactividad"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        :rules="[(v) => !!v || 'El objetivo es requerido']"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-textarea
                        v-model="formData.informeObjetivoTarea"
                        label="Informe del cumplimiento del objetivo"
                        variant="outlined"
                        density="compact"
                        bg-color="blue-lighten-5"
                        :rules="[(v) => !!v || 'El informe del objetivo es requerido']"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 4: Reporte de la subactividad -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-clipboard-text</v-icon>
                    Reporte de la Subactividad
                  </h3>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.reporteTipo"
                        label="Escriba el Reporte de la ejecución"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        :rules="[(v) => !!v || 'El reporte de ejecución es requerido']"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 5: Avance de Indicadores -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
                    Avance de Indicadores
                  </h3>
                  <v-row>
                    <v-col cols="12">
                      <RegistroAvanceIndicadores
                        v-if="storeInfTarea.actividad"
                        :idactividad="storeInfTarea.actividad?.id"
                        @todos-los-registros-enviados="manejarRegistrosIndicadores"
                      ></RegistroAvanceIndicadores>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 6: Información Cuantitativa -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-numeric</v-icon>
                    Información Cuantitativa
                  </h3>
                  <v-row>
                    <v-col cols="12">
                      <InformacionCuantitativa
                        @registrar-informacion="manejarRegistro"
                      ></InformacionCuantitativa>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!--Seccion 8: Presupuesto-->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-file-check</v-icon>
                    Presupuesto
                  </h3>
                  <v-row>
                    <PresupuestoSubactividad
                      v-if="storeInfTarea.tarea"
                      :presupuesto="storeInfTarea.tarea?.presupuesto"
                      :presupuesto-desglose="storeInfTarea.tarea?.presupuestoDesglose"
                      @registrar-informacion="registrarPresupuestos"
                    ></PresupuestoSubactividad>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 7: Herramientas Aplicadas -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-tools</v-icon>
                    Herramientas Aplicadas y Resultados
                  </h3>
                  <v-row>
                    <v-col cols="12">
                      <HerramientasAplicadasResultados
                        @informacion-registrada="registrarHerramientas"
                      ></HerramientasAplicadasResultados>
                    </v-col>
                  </v-row>
                </div>

                <!-- Sección 8: Medios de verificacion -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-file-check</v-icon>
                    Medios de Verificacion
                  </h3>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-row>
                        <v-col cols="12">
                          <v-textarea
                            v-model="formData.mediosVerificacion"
                            label="Descripción de medios de verificación"
                            bg-color="blue-lighten-5"
                            variant="outlined"
                            rows="3"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12">
                          <v-file-input
                            v-model="formData.mediosArchivos"
                            label="Adjuntar archivos de respaldo"
                            multiple
                            chips
                            show-size
                            variant="outlined"
                            prepend-icon="mdi-paperclip"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                          ></v-file-input>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 9: Comentarios y Recomendaciones -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-comment-text</v-icon>
                    Comentarios y Recomendaciones
                  </h3>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-textarea
                        v-model="formData.comentariosRecomendaciones"
                        label="Observaciones, dificultades y recomendaciones"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        rows="4"
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
                    @click="cancelar"
                    :disabled="loading"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="secondary"
                    variant="outlined"
                    size="large"
                    prepend-icon="mdi-backspace-outline"
                    @click="resetForm"
                    :disabled="loading"
                  >
                    Limpiar
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="flat"
                    size="large"
                    prepend-icon="mdi-send"
                    type="submit"
                    :loading="loading"
                  >
                    Enviar Informe
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Mensaje cuando no hay datos -->
    <div v-if="!cargandoGeneral && !storeInfTarea.tarea" class="text-center pa-12">
      <v-icon size="64" color="grey">mdi-file-remove</v-icon>
      <h3 class="text-h5 mt-4">No se encontró la subactividad</h3>
      <p class="text-body-1 mt-2">La subactividad solicitada no existe o no está disponible.</p>
      <v-btn color="primary" class="mt-4" @click="cancelar">Volver a la lista</v-btn>
    </div>
  </v-container>
  {{ formData }}
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInformeTareaStore } from '@/modules/formularios/store/useInformeTareaStore'
//Encabezados
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import EncabezadoContribucion from '@/modules/formularios/components/EncabezadoContribucion.vue'
import RegistroAvanceIndicadores from '@/modules/reportes/components/RegistroAvanceIndicadores.vue'
import InformacionCuantitativa from '@/modules/formularios/components/InformacionCuantitativa.vue'
import HerramientasAplicadasResultados from '@/modules/formularios/components/HerramientasAplicadasResultados.vue'
import PresupuestoSubactividad from '@/modules/formularios/components/PresupuestoSubactividad.vue'
//Utilidades
import { formatearEstadoTarea } from '@/modules/formularios/utils/estadoTareaUtils'
import { useSnackbar } from '@/composables/useSnackbar'

// Router
const router = useRouter()
const route = useRoute()
const idtarea = ref(route.params.id)

// Stores
const storeInfTarea = useInformeTareaStore()

// Composables
const { successMsg } = useSnackbar()

// Estados reactivos
const cargandoGeneral = ref(false)
const loading = ref(false)
const form = ref(null)

// Datos del formulario
const formData = ref({
  fechaEjecucion: null,
  contribucionProyecto: '',
  avanceIndicadores: '',
  informacionCuantitativa: '',
  herramientasEvaluacion: '',
  mediosVerificacion: '',
  mediosArchivos: [],
  comentariosRecomendaciones: '',
  objetivoTarea: '',
  informeObjetivoTarea: '',
  tipoActividad: '',
  reporteTipo: '',
  presupuestoPlanificado: null,
  presupuestoEjecutado: null,
  desglosePresupuesto: null,
})

/***************** Metodos de captura informacion **********************/
//Contribucion al proyecto
const recibirDatosContribucion = (payload) => {
  console.log('Datos contribucion recibidos: ', payload)
  formData.value.contribucionProyecto = payload
}

//Registrar indicadores
const manejarRegistrosIndicadores = (payload) => {
  console.log('Avance de indicadores recibido: ', payload)
  formData.value.avanceIndicadores = payload
  successMsg('Avance Indicadores registrados')
}

//Informacion cuantitativa
const manejarRegistro = async (datos) => {
  console.log('informacion registrada: ', datos)
  formData.value.informacionCuantitativa = datos
  successMsg('Informacion cuantitativa registrada')
}

//Registrar herramientas aplicadas y resultados
const registrarHerramientas = async (info) => {
  console.log('Herramientas registradas: ', info)
  formData.value.herramientasEvaluacion = info
  successMsg('Herramientas Aplicadas Registradas')
}

//Registrar presupuestos
const registrarPresupuestos = async (datos) => {
  console.log('Procedencia Fondos: ', datos)
  formData.value.presupuestoPlanificado = datos.presupuestoFinal
  formData.value.presupuestoEjecutado = datos.totalEjecutado
  formData.value.desglosePresupuesto = datos
  successMsg('Presupuesto registrado')
}

/***********************************************************************/
// Computed properties
const estadoFormateado = computed(() => {
  if (!storeInfTarea.tarea?.estado) return 'SIN_ESTADO - No especificado'
  return formatearEstadoTarea(storeInfTarea.tarea.estado)
})

// Métodos auxiliares de formato
const formatearFecha = (fechaString) => {
  if (!fechaString) return 'Sin Fecha'

  try {
    const fecha = new Date(fechaString)
    if (isNaN(fecha.getTime())) return fechaString

    // Formato YYYY-MM-DD para campos type="date"
    const año = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')

    return `${año}-${mes}-${dia}`
  } catch (error) {
    console.log('Error al formatear la fecha', error)
    return fechaString
  }
}

const formatearPresupuesto = (monto) => {
  if (!monto && monto !== 0) return 'No definido'

  const numValue = Number(monto)
  if (isNaN(numValue)) return monto

  return `Bs. ${numValue.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Métodos principales
const cancelar = () => {
  router.push('/actividades/informe/')
}

const resetForm = () => {
  if (confirm('¿Está seguro de que desea limpiar todos los campos del formulario?')) {
    formData.value = {
      fechaEjecucion: null,
      contribucionProyecto: '',
      avanceIndicadores: '',
      informacionCuantitativa: '',
      herramientasEvaluacion: '',
      mediosVerificacion: '',
      mediosArchivos: [],
      comentariosRecomendaciones: '',
      objetivoTarea: '',
      informeObjetivoTarea: '',
      tipoActividad: '',
      reporteTipo: '',
      presupuestoPlanificado: null,
      presupuestoEjecutado: null,
      desglosePresupuesto: null,
    }
  }
}

const submitForm = async () => {
  loading.value = true
  try {
    // Validar formulario
    if (form.value) {
      const { valid } = await form.value.validate()
      if (!valid) {
        throw new Error('Por favor, complete todos los campos obligatorios correctamente.')
      }
    }

    // Preparar datos para enviar
    const datosEnvio = {
      tarea_id: idtarea.value,
      ...formData.value,
      fecha_ejecucion: formData.value.fechaEjecucion,
      contribucion_proyecto: formData.value.contribucionProyecto,
      objetivo_tarea: formData.value.objetivoTarea,
      informe_objetivo: formData.value.informeObjetivoTarea,
      avance_indicadores: formData.value.avanceIndicadores,
      informacion_cuantitativa: formData.value.informacionCuantitativa,
      herramientas_aplicadas: formData.value.herramientasEvaluacion,
      medios_verificacion: formData.value.mediosVerificacion,
      comentarios: formData.value.comentariosRecomendaciones,
      archivos_adjuntos: formData.value.mediosArchivos,
    }

    // Aquí iría la llamada a la API para guardar el informe
    console.log('Enviando informe de subactividad:', datosEnvio)

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert('Informe de subactividad enviado exitosamente')
    router.push('/pei/listatareas?showButton=1&mensaje=Informe enviado correctamente')
  } catch (error) {
    console.error('Error al enviar el informe:', error)
    alert(`Error: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// Carga de información
const cargarInformacion = async () => {
  cargandoGeneral.value = true
  try {
    if (idtarea.value) {
      await storeInfTarea.obtenerTareasPorIdMasDetalles(idtarea.value)

      // Rellenar datos automáticamente si hay información de la tarea
      if (storeInfTarea.tarea) {
        const tipoActividadLiteral =
          storeInfTarea.tarea.actividad.tipo_info.sigla +
          ' - ' +
          storeInfTarea.tarea.actividad.tipo_info.tipo_actividad
        formData.value.tipoActividad = tipoActividadLiteral || ''
        formData.value.objetivoTarea = storeInfTarea.tarea.objetivo || ''

        // También podemos mostrar un mensaje de depuración
        console.log('Estado de la tarea:', storeInfTarea.tarea.estado)
        console.log('Estado formateado:', estadoFormateado.value)
      }
    }
  } catch (err) {
    console.error('Error al cargar la información de la tarea', err)
    alert('Error al cargar los datos de la subactividad')
  } finally {
    cargandoGeneral.value = false
  }
}

// Hook
onMounted(() => {
  cargarInformacion()
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
</style>
