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

                <!-- ✅ Seccion 8: Vinculacion de sol de viajes (COMPLETA) -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-link-variant</v-icon>
                    Vincular Solicitud de Viaje
                  </h3>

                  <!-- Switch para activar/desactivar la sección -->
                  <div class="mb-4">
                    <v-switch
                      v-model="seccionVincularSolicitud"
                      :label="seccionVincularSolicitud ? 'Sección activada' : 'Sección desactivada'"
                      color="primary"
                      hide-details
                      inset
                    ></v-switch>
                  </div>

                  <!-- ✅ Resumen de vinculación en tiempo real -->
                  <v-alert
                    v-if="seccionVincularSolicitud && vinculacionSolicitudes"
                    type="info"
                    variant="tonal"
                    density="compact"
                    class="mb-3"
                  >
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-link-variant" size="20" class="mr-2"></v-icon>
                      <div>
                        <strong>{{ vinculacionSolicitudes.total_solicitudes }}</strong>
                        solicitud(es) vinculada(s) | Monto total:
                        <strong>{{
                          formatMontoLocal(vinculacionSolicitudes.monto_total_actual)
                        }}</strong>
                        <span
                          v-if="vinculacionSolicitudes.tiene_modificaciones_global"
                          class="text-warning ml-2"
                        >
                          ⚠️ Con modificaciones
                        </span>
                      </div>
                    </div>
                  </v-alert>

                  <!-- Contenido condicional -->
                  <div v-if="seccionVincularSolicitud">
                    <!-- ✅ Componente con ref y evento de sincronización -->
                    <VinculacionInformeTarea
                      ref="vinculacionTareaComponent"
                      v-if="storeInfTarea.actividad"
                      :idActividad="storeInfTarea.actividad?.id"
                      :idTarea="idtarea"
                      @update:vinculacion="manejarActualizacionVinculacion"
                    ></VinculacionInformeTarea>
                  </div>

                  <div v-else class="text-caption text-grey mt-2">
                    La sección de vinculación de solicitud de viaje está desactivada. No se
                    vinculará ninguna solicitud de viaje al informe.
                  </div>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 9: Medios de verificacion -->
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

                <!-- Seccio 10: Validadores del informe-->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-account-check</v-icon>
                    Asignar Validadores
                  </h3>
                  <v-row>
                    <v-col cols="12">
                      <ValidadorInformeActividad
                        v-model="nuevosValidadores"
                        :tipoDocumento="'tarea'"
                        :usuarioRol="usuarioRol"
                      ></ValidadorInformeActividad>
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
import ValidadorInformeActividad from '@/modules/formularios/components/validadores/ValidadorInformeActividad.vue'
import VinculacionInformeTarea from '@/modules/formularios/components/vinculacion/VinculacionInformeTarea.vue'
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
const usuarioRol = computed(() => usuarioStore.rol)

// Datos del formulario
const formData = ref({
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
})

//Datos de los validadores
const nuevosValidadores = ref([])

/****************************** Funciones Encabezado Contribucion ************************/
const recibirDatosContribucion = (payload) => {
  console.log('Datos contribucion recibidos', payload)
  formData.value.contribucionProyecto = payload
}

/******************************* Registro de Indicadores *********************************/
const habilitarIndicadores = ref(false)

const manejarIndicadoresCargados = (payload) => {
  console.log('📊 Indicadores cargados inicialmente:', payload)
}
const manejarIndicadoresActualizados = (payload) => {
  console.log('🔄 Indicadores actualizados:', payload)
}

/******************************** Informacion Cuantitativa *********************************/
const infoCuantitativaEstado = ref({
  seccionHabilitada: false,
  totalParticipantes: 0,
})

const manejarEstadoHabilitacion = (estado) => {
  console.log('📊 Estado info cuantitativa:', estado)
  infoCuantitativaEstado.value = {
    seccionHabilitada: estado.seccionHabilitada,
    totalParticipantes: estado.totalParticipantes,
  }
}

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

/*********************************** ✅ VINCULACION DE SOLICITUDES DE VIAJE ***************************************/
const seccionVincularSolicitud = ref(false)
const vinculacionTareaComponent = ref(null)
const vinculacionSolicitudes = ref(null)

/**
 * ✅ Maneja las actualizaciones en tiempo real del componente de vinculación
 * Se ejecuta cada vez que el usuario modifica cualquier campo en la tabla de gastos
 */
const manejarActualizacionVinculacion = (datosVinculacion) => {
  console.log('🔄 Vinculación actualizada en tiempo real:', {
    total_solicitudes: datosVinculacion?.total_solicitudes,
    monto_original: datosVinculacion?.monto_total_original,
    monto_actual: datosVinculacion?.monto_total_actual,
    tiene_modificaciones: datosVinculacion?.tiene_modificaciones_global,
    timestamp: new Date().toISOString(),
  })

  vinculacionSolicitudes.value = datosVinculacion

  if (datosVinculacion) {
    console.log(`✅ ${datosVinculacion.total_solicitudes} solicitud(es) vinculada(s)`)
    console.log(`💰 Monto total: ${datosVinculacion.monto_total_actual} Bs.`)
    if (datosVinculacion.tiene_modificaciones_global) {
      console.log('⚠️ Se detectaron modificaciones en los gastos')
    }
  } else {
    console.log('❌ No hay solicitudes seleccionadas')
  }
}

/**
 * ✅ Formatear monto para mostrar en el resumen
 */
const formatMontoLocal = (monto) => {
  if (!monto && monto !== 0) return 'Bs. 0.00'
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(Number(monto))
}

/****************************** AUXILIARES ************************************************/
const estadoFormateado = computed(() => {
  if (!storeInfTarea.tarea?.estado) return 'SIN_ESTADO - No especificado'
  return formatearEstadoTarea(storeInfTarea.tarea.estado)
})

/****************************** Metodo del Formulario *******************************************/
const indicadoresComponent = ref(null)

const resetearIndicadores = () => {
  if (indicadoresComponent.value) {
    indicadoresComponent.value.resetearRegistros()
    formData.value.avanceIndicadores = null
  }
}

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

  // ✅ Resetear vinculación
  vinculacionSolicitudes.value = null
}

const submitForm = async () => {
  console.log('Iniciar Envio de los datos')
  loading.value = true
  const errores = []

  try {
    //Validar el registro de indicadores
    if (habilitarIndicadores.value) {
      const jsonIndicadores = indicadoresComponent.value?.obtenerJSONIndicadores()
      const tieneRegistros = jsonIndicadores?.metadatos?.total_general > 0
      if (!tieneRegistros) {
        errores.push('Debe registrar al menos un avance de indicadores')
      }
    }

    //VALIDAR: Informacion cuantitativa
    const { seccionHabilitada, totalParticipantes } = infoCuantitativaEstado.value
    if (seccionHabilitada) {
      if (!totalParticipantes || totalParticipantes <= 0) {
        errores.push('Debe registrar el total de participantes en información cuantitativa')
      }
    }

    // ✅ Validar vinculación de solicitudes
    if (seccionVincularSolicitud.value) {
      const tieneVinculacion =
        vinculacionSolicitudes.value !== null &&
        vinculacionSolicitudes.value.solicitudes_vinculadas?.length > 0

      if (!tieneVinculacion) {
        errores.push('Debe seleccionar al menos una solicitud de viaje para vincular')
      }
    }

    //Debe seleccionar un validador
    if (!nuevosValidadores.value || nuevosValidadores.value.length === 0) {
      errores.push('Debe asignar al menos un validador para el informe')
    }

    //Mostrar errores si existen
    if (errores.length > 0) {
      const mensajeError = 'Por favor complete los siguientes campos:\n• ' + errores.join('\n• ')
      errorMsg(mensajeError)
      loading.value = false
      return
    }

    /******************************* Envio de datos ****************************************/
    const informeData = {
      fechaEjecucion: formData.value.fechaEjecucion,
      contribucionProyecto: formData.value.contribucionProyecto,
      avanceIndicadores: formData.value.avanceIndicadores,
      informacionCuantitativa: formData.value.informacionCuantitativa,
      herramientasEvaluacion: formData.value.herramientasEvaluacion,
      mediosVerificacion: formData.value.mediosVerificacion,
      comentariosRecomendaciones: formData.value.comentariosRecomendaciones,
      presupuestoPlanificado: formData.value.presupuestoPlanificado,
      presupuestoEjecutado: formData.value.presupuestoEjecutado,
      objetivoTarea: formData.value.objetivoTarea,
      informeObjetivoTarea: formData.value.informeObjetivoTarea,
      tipoActividad: formData.value.tipoActividad,
      desglosePresupuesto: formData.value.desglosePresupuesto,
      tarea: formData.value.tarea,
      usuario: formData.value.usuario,
    }

    // Obtener indicadores del componente si la sección está habilitada
    if (habilitarIndicadores.value && indicadoresComponent.value) {
      const jsonIndicadores = indicadoresComponent.value.obtenerJSONIndicadores()
      if (jsonIndicadores && jsonIndicadores.metadatos?.total_general > 0) {
        informeData.avanceIndicadores = jsonIndicadores
      } else {
        informeData.avanceIndicadores = null
      }
    } else {
      informeData.avanceIndicadores = null
    }

    // ✅ Incluir vinculación de solicitudes en el payload
    let vinculacionSolViajes = null
    if (seccionVincularSolicitud.value && vinculacionSolicitudes.value) {
      vinculacionSolViajes = vinculacionSolicitudes.value
      console.log('✅ Vinculación incluida en el payload:', {
        total_solicitudes: vinculacionSolicitudes.value.total_solicitudes,
        monto_total: vinculacionSolicitudes.value.monto_total_actual,
      })
    }

    //Preparar el payload
    const payload = {
      informeData: informeData,
      validadores: nuevosValidadores.value,
      vinculacionSolViajes: vinculacionSolViajes,
    }

    console.log('📦 Enviando payload al RestAPI:', payload)

    // Enviar al backend
    //await crearInformeTareaPrincipal(payload)
    //resetForm()
    //successMsg('Informe enviado exitosamente')
    //router.push('/actividades/informe/')
  } catch (err) {
    console.error('Error al enviar el informe:', err)
    errorMsg(`Error: ${err.message}`)
  } finally {
    loading.value = false
  }
}

/****************************** Carga de Informacion **********************************************/
const cargarInformacion = async () => {
  cargandoGeneral.value = true
  try {
    if (idtarea.value) {
      await storeInfTarea.obtenerTareasPorIdMasDetalles(idtarea.value)
      if (storeInfTarea.tarea) {
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

.text-warning {
  color: #f57c00;
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
