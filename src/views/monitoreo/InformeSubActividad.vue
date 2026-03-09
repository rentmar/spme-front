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
      ></ProyectoIdHeader
      ><br />

      <!--Encabezado de la Actividad-->
      <ActividadInformacion
        v-if="storeInfTarea.actividad"
        :actividad-id="storeInfTarea.actividad?.id"
      />

      <!-- Formulario Principal -->
      <v-row>
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
                <!--Informacion de la Tarea-->
                <div class="form-section mb-6" v-if="storeInfTarea.tarea">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                    Información de la SubActividad
                  </h3>
                  <v-row>
                    <!--Codigo-->
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
                    <!--Estado-->
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
                    <!--Descripcion-->
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
                    <!--Tipo actividad-->
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
                    <!--Fecha de inicio-->
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
                    <!-- FEcha limite-->
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
                    <!--Presupuesto-->
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

                <!-- SECCIÓN 5: Avance de Indicadores CON SWITCH -->
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

                          <!-- COMPONENTE DE INDICADORES CON REF Y EVENTOS -->
                          <RegistroAvanceIndicadoresTareaV3
                            ref="indicadoresComponent"
                            @indicadores-cargados="manejarIndicadoresCargados"
                            @indicadores-actualizados="manejarIndicadoresActualizados"
                          />
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
                    <v-icon color="primary" class="mr-2">mdi-numeric</v-icon>
                    Información Cuantitativa
                  </h3>
                  <v-row>
                    <v-col cols="12">
                      <InformacionCuantitativaV2
                        @registrar-informacion="manejarRegistro"
                        @estado-habilitacion="manejarEstadoHabilitacion"
                      ></InformacionCuantitativaV2>
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
                <v-divider class="my-4"></v-divider>
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

                <v-divider class="my-4"></v-divider>
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
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInformeTareaStore } from '@/modules/formularios/store/useInformeTareaStore'
import { useUserStore } from '@/stores/user'
//encabezado y componentes
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import EncabezadoContribucion from '@/modules/formularios/components/EncabezadoContribucion.vue'
import RegistroAvanceIndicadoresTareaV3 from '@/modules/reportes/components/RegistroAvanceIndicadoresTareaV3.vue'
import InformacionCuantitativaV2 from '@/modules/formularios/components/InformacionCuantitativaV2.vue'
import PresupuestoSubactividad from '@/modules/formularios/components/PresupuestoSubactividad.vue'
import HerramientasAplicadasResultados from '@/modules/formularios/components/HerramientasAplicadasResultados.vue'
//Composable
import { useSnackbar } from '@/composables/useSnackbar'
//utils
import { useInformeActividadPrincipal } from '@/modules/formularios/composables/useInformeActividadPrincipal'
import {
  formatearEstadoTarea,
  formatearFecha,
  formatearPresupuesto,
} from '@/modules/formularios/utils/estadoTareaUtils'

// Router - captura id del informe
const router = useRouter()
const route = useRoute()
const idtarea = ref(route.params.id)

// Stores
const storeInfTarea = useInformeTareaStore()
const usuarioStore = useUserStore()

//Composables
const { successMsg, errorMsg } = useSnackbar()
const { crearInformeTareaPrincipal, informeTareaPrincipal } = useInformeActividadPrincipal()

// Estados
const cargandoGeneral = ref(false)
const loading = ref(false)

//Id del usuario
const usuarioId = computed(() => usuarioStore.id)

// Datos del formulario
const formData = ref({
  fechaEjecucion: null,
  contribucionProyecto: '',
  avanceIndicadores: null, // Inicializado como null, no como string vacío
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
  tarea: idtarea.value,
  usuario: usuarioId,
})

/****************************** Funciones Encabezado Contribucion ************************/
const recibirDatosContribucion = (payload) => {
  console.log('Datos contribucion recibidos', payload)
  formData.value.contribucionProyecto = payload
}

/******************************* Registro de Indicadores *********************************/
//Habilitar/Deshabilitar indicadores
const habilitarIndicadores = ref(false)

//Manejador cuando los indicadores se cargan
const manejarIndicadoresCargados = (payload) => {
  console.log('📊 Indicadores cargados inicialmente:', payload)
}
const manejarIndicadoresActualizados = (payload) => {
  console.log('🔄 Indicadores actualizados:', payload)
}
/******************************** Informacion Cuantitativa *********************************/
//Estado de la Informacion cuantitativa
const infoCuantitativaEstado = ref({
  seccionHabilitada: false,
  totalParticipantes: 0,
})
//Manejador del estado de habilitacion
const manejarEstadoHabilitacion = (estado) => {
  console.log('📊 Estado info cuantitativa:', estado)
  infoCuantitativaEstado.value = {
    seccionHabilitada: estado.seccionHabilitada,
    totalParticipantes: estado.totalParticipantes,
  }
  console.log('INFO ESTADO:', infoCuantitativaEstado.value)
}
//Informacion cuantitativa
const manejarRegistro = async (datos) => {
  console.log('informacion registrada: ', datos)
  formData.value.informacionCuantitativa = datos
  successMsg('Informacion cuantitativa registrada')
}
/******************************** Registrar Presupuesto ************************************/
const registrarPresupuestos = async (datos) => {
  console.log('Procedencia Fondos: ', datos)
  formData.value.presupuestoPlanificado = datos.presupuestoFinal
  formData.value.presupuestoEjecutado = datos.totalEjecutado
  formData.value.desglosePresupuesto = datos
  successMsg('Presupuesto registrado')
}

/********************************* Herramientas y Resultados *******************************/
const registrarHerramientas = async (info) => {
  console.log('Herramientas registradas: ', info)
  formData.value.herramientasEvaluacion = info
  successMsg('Herramientas Aplicadas Registradas')
}

/****************************** AUXILIARES ************************************************/
//Formatear el Estado
const estadoFormateado = computed(() => {
  if (!storeInfTarea.tarea?.estado) return 'SIN_ESTADO - No especificado'
  return formatearEstadoTarea(storeInfTarea.tarea.estado)
})

/****************************** Metodo del Formulario *******************************************/
//Referencia al componente de indicadores
const indicadoresComponent = ref(null)

//Resetear todos los registros de lo indicadores
const resetearIndicadores = () => {
  if (indicadoresComponent.value) {
    indicadoresComponent.value.resetearRegistros()
    formData.value.avanceIndicadores = null
  }
}

// Cancelar
const cancelar = () => {
  router.push('/actividades/informe/')
}

const resetForm = () => {
  formData.value = {
    fechaEjecucion: null,
    contribucionProyecto: '',
    avanceIndicadores: null,
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
    tarea: idtarea.value,
    usuario: usuarioId,
  }
  habilitarIndicadores.value = false
  resetearIndicadores()
}
const submitForm = async () => {
  console.log('Iniciar Envio de los datos')
  loading.value = true
  //Matriz de errores
  const errores = []
  try {
    //Validar el registro de indicadores
    if (habilitarIndicadores.value) {
      //Obtener el json de indicadores del componente
      const jsonIndicadores = indicadoresComponent.value?.obtenerJSONIndicadores()
      //Verificar si hay al menos un registro  (total_general > 0)
      const tieneRegistros = jsonIndicadores?.metadatos?.total_general > 0
      if (!tieneRegistros) {
        errores.push('Debe registrar al menos un avance de indicadores')
      }
      console.log('📊 Validación indicadores:', {
        habilitado: true,
        tieneRegistros,
        total: jsonIndicadores?.metadatos?.total_general,
      })
    } else {
      console.log('Validacion indicadores: seccion desactivida')
    }
    //VALIDAR: Informacion cuantitativa
    const { seccionHabilitada, totalParticipantes } = infoCuantitativaEstado.value
    if (seccionHabilitada) {
      if (!totalParticipantes || totalParticipantes <= 0) {
        errores.push('Debe registrar el total de participantes en información cuantitativa')
      }
    }

    //MOstrar errores si existen
    if (errores.length > 0) {
      const mensajeError = 'Por favor complete los siguientes campos:\n• ' + errores.join('<br>• ')
      errorMsg(mensajeError)
      loading.value = false
      return
    }

    /******************************* Envio de datos ****************************************/
    // Preparar datos finales
    const datosParaEnviar = { ...formData.value }
    // Obtener indicadores del componente si la sección está habilitada
    if (habilitarIndicadores.value && indicadoresComponent.value) {
      const jsonIndicadores = indicadoresComponent.value.obtenerJSONIndicadores()

      // Solo incluir si hay registros
      if (jsonIndicadores && jsonIndicadores.metadatos?.total_general > 0) {
        datosParaEnviar.avanceIndicadores = jsonIndicadores
        console.log('✅ JSON de indicadores incluido:', jsonIndicadores)
      } else {
        datosParaEnviar.avanceIndicadores = null
        console.log('ℹ️ No hay registros de indicadores')
      }
    } else {
      datosParaEnviar.avanceIndicadores = null
    }

    console.log('📦 Enviando informe:', datosParaEnviar)

    // Enviar al backend
    await crearInformeTareaPrincipal(datosParaEnviar)
    //await formulariosServico.creaInformeActividadPrincipal(datosParaEnviar)
    resetForm()
    successMsg('Informe enviado exitosamente')
    router.push('/actividades/informe/')
  } catch (err) {
    console.error('Error al enviar el informe:', err)
    errorMsg(`Error: ${err.message}`)
  } finally {
    loading.value = false
  }
}

/****************************** Carga de Informacion **********************************************/

//Carga de informacion
const cargarInformacion = async () => {
  cargandoGeneral.value = true
  try {
    if (idtarea.value) {
      await storeInfTarea.obtenerTareasPorIdMasDetalles(idtarea.value)
      // Rellenar datos automáticamente si hay información de la tarea
      if (storeInfTarea.tarea) {
        //Tipo de Actividad
        formData.value.tipoActividad =
          storeInfTarea.tarea.actividad.tipo_info.sigla +
          ' - ' +
          storeInfTarea.tarea.actividad.tipo_info.tipo_actividad
        formData.value.objetivoTarea = storeInfTarea.tarea.objetivo || ''
      }
    }
  } catch (err) {
    console.error('Error al cargar la información de la tarea', err)
  } finally {
    cargandoGeneral.value = false
  }
}

//hook
onMounted(() => {
  cargarInformacion()
})
</script>

<style scoped></style>
