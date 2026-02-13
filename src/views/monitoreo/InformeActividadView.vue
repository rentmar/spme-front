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
        <p class="mt-4 text-h6">Cargando formulario de informe...</p>
      </div>
    </v-overlay>

    <div v-if="!cargandoGeneral && storeInfActividad.actividad">
      <!--Titulo de la pagina-->
      <PaginaTituloIcono
        :titulo="'Informe de Actividad'"
        :icon="'mdi-file-document-multiple'"
      ></PaginaTituloIcono>

      <!--Encabezado del Proyecto-->
      <ProyectoIdHeader
        v-if="storeInfActividad.actividad"
        :proyecto-id="storeInfActividad.actividad?.proyecto"
      ></ProyectoIdHeader>

      <!--Encabezado de la Actividad-->
      <ActividadInformacion v-if="storeInfActividad.actividad" :actividad-id="idactividad" />

      <v-row>
        <!-- Formulario principal -->
        <v-col cols="12">
          <v-card elevation="2" rounded="lg">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon class="mr-2">mdi-clipboard-text-outline</v-icon>
                Formulario de Informe de Actividad
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pa-4">
              <v-form ref="form" @submit.prevent="submitForm">
                <!-- Sección 1: Fecha de Ejecucion -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-calendar-check</v-icon>
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
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 2: Contribución al Proyecto -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-chart-timeline-variant</v-icon>
                    Contribución al Proyecto
                  </h3>
                  <v-row>
                    <v-col cols="12">
                      <EncabezadoContribucion
                        v-if="storeInfActividad.actividad?.estructuraProcedencia"
                        :datos-estructura="storeInfActividad.actividad?.estructuraProcedencia"
                        @payload-actualizado="recibirDatosContribucion"
                      ></EncabezadoContribucion>
                      <v-alert v-else type="warning" variant="tonal">
                        No hay estructura de procedencia disponible para esta actividad.
                      </v-alert>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 3: Objetivo de la Actividad -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-bullseye-arrow</v-icon>
                    Objetivo de la Actividad
                  </h3>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-textarea
                        v-model="formData.objetivoActividad"
                        label="Objetivo de la Actividad"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        required
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-textarea
                        v-model="formData.informeObjetivoActividad"
                        label="Informe Objetivo de Actividad"
                        variant="outlined"
                        density="compact"
                        bg-color="blue-lighten-5"
                        required
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 4: Reporte de la Actividad -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-clipboard-text</v-icon>
                    Reporte de Actividad
                  </h3>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field
                        v-model="formData.tipoActividad"
                        label="Tipo de Actividad"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                      <v-textarea
                        v-model="formData.reporteTipo"
                        label="Reporte"
                        variant="outlined"
                        density="compact"
                        bg-color="blue-lighten-5"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>
                <!--Seccion: Procedencia de Fondos y validacion-->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-cash-multiple</v-icon>
                    Procedencia de Fondos
                  </h3>
                  <v-row>
                    <v-col cols="12">
                      <ProcedenciaFondosPresupuesto
                        v-if="storeInfActividad.actividad"
                        :fondos="storeInfActividad.actividad?.procedencia_fondos"
                        :presupuesto-total="storeInfActividad.actividad?.presupuesto"
                        @registrar-informacion="registrarProcedenciaFondos"
                      ></ProcedenciaFondosPresupuesto>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 5: Registro de Indicadores -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
                    Registro de Indicadores
                  </h3>

                  <!-- Switch para activar/desactivar la sección -->
                  <div class="mb-4">
                    <v-switch
                      v-model="habilitarIndicadores"
                      :label="`${habilitarIndicadores ? 'Sección activada' : 'Sección desactivada'} - Registro de indicadores`"
                      color="primary"
                      hide-details
                      inset
                    ></v-switch>
                    <div v-if="!habilitarIndicadores" class="text-caption text-grey mt-2">
                      La sección de registro de indicadores está desactivada. No se guardará
                      información de indicadores.
                    </div>
                  </div>

                  <!-- Contenido condicional -->
                  <v-expand-transition>
                    <div v-if="habilitarIndicadores">
                      <v-row>
                        <v-col cols="12">
                          <v-alert
                            v-if="
                              formData.avanceIndicadores &&
                              Object.keys(formData.avanceIndicadores).length > 0
                            "
                            type="info"
                            variant="tonal"
                            class="mb-4"
                          >
                            <div class="d-flex align-center">
                              <v-icon class="mr-2">mdi-information</v-icon>
                              <div>
                                Ya existen datos de indicadores cargados. Puede modificar los
                                registros existentes.
                                <div class="text-caption mt-1">
                                  Total de registros:
                                  {{ Object.keys(formData.avanceIndicadores).length }}
                                </div>
                              </div>
                            </div>
                          </v-alert>

                          <!-- <RegistroAvanceIndicadores
                            v-if="storeInfActividad.actividad"
                            :idactividad="storeInfActividad.actividad?.id"
                            :datos-existente="formData.avanceIndicadores"
                            @todos-los-registros-enviados="manejarRegistrosIndicadores"
                          ></RegistroAvanceIndicadores> -->
                          <RegistroAvanceIndicadoresV2></RegistroAvanceIndicadoresV2>
                        </v-col>
                      </v-row>
                    </div>
                    <div
                      v-else-if="
                        habilitarIndicadores === false &&
                        formData.avanceIndicadores &&
                        Object.keys(formData.avanceIndicadores).length > 0
                      "
                      class="mt-4"
                    >
                      <v-alert type="warning" variant="tonal">
                        <div class="d-flex align-center">
                          <v-icon class="mr-2">mdi-alert</v-icon>
                          <div>
                            <strong>Advertencia:</strong> Existen datos de indicadores previamente
                            cargados ({{ Object.keys(formData.avanceIndicadores).length }}
                            registros).
                            <div class="text-caption mt-1">
                              Si desactiva esta sección, los datos de indicadores no se enviarán con
                              el informe.
                            </div>
                          </div>
                        </div>
                      </v-alert>
                    </div>
                  </v-expand-transition>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 6: Información Cuantitativa -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-chart-bar</v-icon>
                    Información Cuantitativa
                  </h3>
                  <v-row>
                    <v-col cols="12">
                      <InformacionCuantitativaV2
                        @registrar-informacion="manejarRegistro"
                      ></InformacionCuantitativaV2>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 7: Herramientas aplicadas y resultados -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-toolbox</v-icon>
                    Herramientas Aplicadas y Resultados (Opcional)
                  </h3>
                  <v-row>
                    <v-col cols="12" md="12">
                      <HerramientasAplicadasResultados
                        @informacion-registrada="registrarHerramientas"
                      ></HerramientasAplicadasResultados>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 8: Medios de Verificación -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-file-document-check</v-icon>
                    Medios de Verificación
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
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12">
                          <v-file-input
                            v-model="formData.mediosArchivos"
                            label="Adjuntar archivos"
                            multiple
                            chips
                            show-size
                            variant="outlined"
                            prepend-icon="mdi-paperclip"
                          ></v-file-input>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Seccio 9: Comentarios y recomendaciones-->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-comment-text-multiple</v-icon>
                    Comentarios y recomendaciones
                  </h3>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.comentariosRecomendaciones"
                        label="Comentarios y recomendaciones"
                        bg-color="blue-lighten-5"
                        variant="outlined"
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
  </v-container>
  {{ formData }}
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInformeActividadStore } from '@/modules/formularios/store/useInformeActividadStore'
//Cabecera - Componentes
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import EncabezadoContribucion from '@/modules/formularios/components/EncabezadoContribucion.vue'
import RegistroAvanceIndicadoresV2 from '@/modules/reportes/components/RegistroAvanceIndicadoresV2.vue'
import InformacionCuantitativaV2 from '@/modules/formularios/components/InformacionCuantitativaV2.vue'
import HerramientasAplicadasResultados from '@/modules/formularios/components/HerramientasAplicadasResultados.vue'
import ProcedenciaFondosPresupuesto from '@/modules/procedenciaFondos/components/ProcedenciaFondosPresupuesto.vue'
//Auxiliares
import { useSnackbar } from '@/composables/useSnackbar'
import { formulariosServico } from '@/modules/formularios/services/formularioService'

// Router
const router = useRouter()
const route = useRoute()
const idactividad = route.params.id

// Store
const storeInfActividad = useInformeActividadStore()

// Composables
const { successMsg } = useSnackbar()

// Estados reactivos
const cargandoGeneral = ref(false)
const loading = ref(false)
const form = ref(null)
const habilitarIndicadores = ref(false)

// Datos del formulario
const formData = ref({
  fechaEjecucion: null,
  contribucionProyecto: null,
  avanceIndicadores: null,
  informacionCuantitativa: null,
  mediosVerificacion: '',
  mediosArchivos: null,
  objetivoActividad: '',
  informeObjetivoActividad: '',
  tipoActividad: '',
  reporteTipo: '',
  comentariosRecomendaciones: '',
  herramientasEvaluacion: '',
  procedenciaFondos: '',
  observacionesPresupuesto: '',
  actividad: idactividad,
})

/***************** WATCHERS *******************************/
// Watcher para activar automáticamente la sección si hay datos de indicadores
watch(
  () => formData.value.avanceIndicadores,
  (nuevoValor, viejoValor) => {
    // Activar automáticamente la sección si hay datos de indicadores
    if (nuevoValor && Object.keys(nuevoValor).length > 0) {
      habilitarIndicadores.value = true
    }
  },
  { immediate: true },
)

/***************** METODOS *******************************/
//Contribucion al proyecto
const recibirDatosContribucion = (payload) => {
  console.log('Datos contribucion recibidos: ', payload)
  formData.value.contribucionProyecto = payload
}

//Registro de indicadores
const manejarRegistrosIndicadores = (payload) => {
  console.log('Avance de indicadores recibido: ', payload)

  // Solo guardar si la sección está habilitada
  if (habilitarIndicadores.value) {
    formData.value.avanceIndicadores = payload
    successMsg('Avance Indicadores registrados')
  } else {
    // Si la sección está deshabilitada, limpiar los datos
    formData.value.avanceIndicadores = null
    console.log('Sección de indicadores deshabilitada, datos no guardados')
  }
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
  successMsg('Herramientas registradas')
}

//Registrar procedencia de fondos
const registrarProcedenciaFondos = async (datos) => {
  console.log('Procedencia Fondos: ', datos)
  formData.value.procedenciaFondos = datos
  formData.value.observacionesPresupuesto = datos?.observaciones
}

//Reset FORM
const resetForm = () => {
  formData.value = {
    fechaEjecucion: null,
    contribucionProyecto: null,
    avanceIndicadores: null,
    informacionCuantitativa: null,
    mediosVerificacion: '',
    mediosArchivos: null,
    objetivoActividad: '',
    informeObjetivoActividad: '',
    tipoActividad: '',
    reporteTipo: '',
    comentariosRecomendaciones: '',
    herramientasEvaluacion: '',
    procedenciaFondos: '',
    observacionesPresupuesto: '',
    actividad: idactividad,
  }
  habilitarIndicadores.value = false
}

//Cancelar
const cancelar = () => {
  router.push('/actividades/informe/')
}

//Enviar Formulario
const submitForm = async () => {
  loading.value = true
  try {
    // Preparar datos finales
    const datosParaEnviar = { ...formData.value }

    // Si la sección de indicadores está deshabilitada, no enviar datos de indicadores
    if (!habilitarIndicadores.value) {
      datosParaEnviar.avanceIndicadores = null
    }

    // Si no hay datos de indicadores o está deshabilitado, eliminar la propiedad
    if (
      !datosParaEnviar.avanceIndicadores ||
      (datosParaEnviar.avanceIndicadores &&
        Object.keys(datosParaEnviar.avanceIndicadores).length === 0)
    ) {
      delete datosParaEnviar.avanceIndicadores
    }

    console.log('Enviando informe:', datosParaEnviar)

    // Nota al usuario
    if (!habilitarIndicadores.value) {
      console.log('Sección de indicadores deshabilitada - No se enviarán datos de indicadores')
    }

    // Validaciones básicas
    // if (!formData.value.objetivoActividad || !formData.value.informeObjetivoActividad) {
    //   throw new Error('Por favor, complete los campos obligatorios del formulario.')
    // }

    // Aquí iría la lógica para enviar al backend
    await formulariosServico.creaInformeActividadPrincipal(datosParaEnviar)

    alert('Informe enviado exitosamente')
    router.push('/actividades/informe/')
  } catch (error) {
    console.error('Error al enviar el informe:', error)
    alert(`Error: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// Carga de datos
const cargarDatos = async () => {
  cargandoGeneral.value = true
  try {
    await storeInfActividad.cargarActividadPorId(idactividad)

    if (storeInfActividad.actividad) {
      // Rellenar datos con la información de la actividad
      formData.value.objetivoActividad = storeInfActividad.actividad.objetivo || ''
      formData.value.tipoActividad = storeInfActividad.actividad.tipo_actividad || ''

      // Si la actividad tiene fecha de ejecución, usarla como valor por defecto
      if (storeInfActividad.actividad.tipo_info) {
        //Cargar la informacion en el formulario
        const tipoActividadInf =
          storeInfActividad.actividad.tipo_info.sigla +
          ' - ' +
          storeInfActividad.actividad.tipo_info.tipo_actividad

        formData.value.tipoActividad = tipoActividadInf
      }
      //Cargar los valores de los indicadores
    }
  } catch (err) {
    console.error('Error al cargar la información de la Actividad:', err)
    alert('Error al cargar los datos de la actividad')
  } finally {
    cargandoGeneral.value = false
  }
}

// Hook de ciclo de vida
onMounted(() => {
  cargarDatos()
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
