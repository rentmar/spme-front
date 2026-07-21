<template>
  <v-container class="solicitud-viaje-container">
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
        <p class="mt-4 text-h6">Cargando formulario de solicitud...</p>
      </div>
    </v-overlay>

    <div v-if="!cargandoGeneral">
      <!--Titulo de la pagina-->
      <PaginaTituloIcono
        :titulo="'Solicitud de Viaje'"
        :icon="'mdi-file-document-multiple'"
      ></PaginaTituloIcono>
      <!--Encabezado del Proyecto-->
      <ProyectoIdHeader
        v-if="datosFormulario"
        :proyecto-id="datosFormulario.actividad?.proyecto ?? '99999'"
      ></ProyectoIdHeader>
      <br />
      <!--Encabezado de la Actividad-->
      <ActividadInformacion v-if="idActividad" :actividad-id="idActividad" />

      <!-- Formulario principal -->
      <v-card elevation="2" rounded="lg">
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon class="mr-2">mdi-form-textbox</v-icon>
            Formulario de Solicitud
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text class="pa-4">
          <v-form @submit.prevent="submitForm">
            <!-- Sección 1: Información del Evento -->
            <div class="form-section mb-6">
              <h3 class="text-h6 mb-4 primary--text">
                <v-icon color="primary" class="mr-2">mdi-calendar-text</v-icon>
                Información del Evento
              </h3>

              <v-text-field
                v-model="formData.evento"
                label="Nombre del Seminario, curso, taller o reunión"
                variant="outlined"
                density="compact"
                bg-color="blue-lighten-5"
                required
              ></v-text-field>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.fecha_evento"
                    label="Fecha de Evento"
                    variant="outlined"
                    density="compact"
                    bg-color="blue-lighten-5"
                    type="date"
                    required
                    :max="formData.fecha_fin"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.lugar_evento"
                    label="Lugar de realización"
                    variant="outlined"
                    density="compact"
                    bg-color="blue-lighten-5"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                v-model="formData.instituciones_participantes"
                label="Organizaciones Participantes"
                variant="outlined"
                density="compact"
                bg-color="blue-lighten-5"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.institucion_queinvita"
                label="Institución que invita"
                variant="outlined"
                density="compact"
                bg-color="blue-lighten-5"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.quien_cubregastos"
                label="Quien cubre los gastos de estadía, transporte y viáticos"
                variant="outlined"
                density="compact"
                bg-color="blue-lighten-5"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.fondos_unitas"
                label="Fondos UNITAS"
                variant="outlined"
                density="compact"
                bg-color="blue-lighten-5"
                required
              ></v-text-field>

              <v-text-field
                v-model="solicitante"
                label="Persona que presenta la solicitud"
                variant="outlined"
                density="compact"
                bg-color="grey-lighten-4"
                readonly
              ></v-text-field>

              <v-textarea
                v-model="formData.justificacion_asistencia"
                label="Justificación de la importancia de asistir al evento y su relación con el trabajo que desarrolla"
                variant="outlined"
                bg-color="blue-lighten-5"
                rows="3"
                required
              ></v-textarea>

              <v-textarea
                v-model="formData.tareas_previas"
                label="Tareas previas que debe cumplir para asistir al evento"
                variant="outlined"
                bg-color="blue-lighten-5"
                rows="3"
                required
              ></v-textarea>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- Sección 2: Detalle de Gastos -->
            <div class="form-section mb-6">
              <h3 class="text-h6 mb-4 primary--text">
                <v-icon color="primary" class="mr-2">mdi-cash</v-icon>
                Detalle del Destino de Fondos
              </h3>

              <div class="d-flex justify-space-between align-center mb-4">
                <v-btn color="primary" variant="outlined" prepend-icon="mdi-plus" @click="addGasto">
                  Agregar Item
                </v-btn>
                <v-chip class="text-subtitle-1" color="primary" variant="outlined">
                  Monto Total Solicitado (Bs.): {{ totalMontoSolicitado.toLocaleString() }}
                </v-chip>
              </div>

              <v-table class="elevation-1 rounded-lg mb-4 users-table">
                <thead>
                  <tr>
                    <th class="text-subtitle-2 font-weight-bold">Partida</th>
                    <th class="text-subtitle-2 font-weight-bold">Fuente</th>
                    <th class="text-subtitle-2 font-weight-bold">Descripción</th>
                    <th class="text-subtitle-2 font-weight-bold">Monto (Bs.)</th>
                    <th class="text-subtitle-2 font-weight-bold text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(gasto, index) in formData.detalle_destino_fondos" :key="index">
                    <td class="narrow-column">
                      <v-text-field
                        v-model="gasto.partida"
                        variant="outlined"
                        density="compact"
                        hide-details
                        bg-color="blue-lighten-5"
                        placeholder="1.1.1"
                        class="compact-field"
                      ></v-text-field>
                    </td>
                    <td class="narrow-column">
                      <v-text-field
                        v-model="gasto.fuente"
                        variant="outlined"
                        density="compact"
                        hide-details
                        bg-color="blue-lighten-5"
                        placeholder="Financiador"
                      ></v-text-field>
                    </td>
                    <td class="wide-column">
                      <v-text-field
                        v-model="gasto.descripcion_gasto"
                        variant="outlined"
                        density="compact"
                        hide-details
                        bg-color="blue-lighten-5"
                        placeholder="Descripción del gasto"
                      ></v-text-field>
                    </td>
                    <td class="narrow-column">
                      <v-text-field
                        v-model.number="gasto.monto"
                        type="number"
                        variant="outlined"
                        density="compact"
                        hide-details
                        bg-color="blue-lighten-5"
                        placeholder="0.00"
                        min="0"
                        class="compact-field"
                      ></v-text-field>
                    </td>
                    <td class="text-center action-column">
                      <v-btn
                        icon
                        color="error"
                        size="small"
                        variant="text"
                        @click="removeGasto(index)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- Sección 3: Información Adicional -->
            <div class="form-section mb-6">
              <h3 class="text-h6 mb-4 primary--text">
                <v-icon color="primary" class="mr-2">mdi-signature</v-icon>
                Informacion Adicional
              </h3>
              <v-row>
                <v-col cols="12">
                  <InformacionAdicional ref="infoRef"></InformacionAdicional>
                </v-col>
              </v-row>
            </div>
            <!-- <div class="form-section mb-6">
              <h3 class="text-h6 mb-4 primary--text">
                <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                Información Adicional
              </h3>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.lugar_solicitud"
                    label="Lugar de la Solicitud"
                    variant="outlined"
                    bg-color="blue-lighten-5"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.fecha_solicitud"
                    label="Fecha de la Solicitud"
                    type="date"
                    variant="outlined"
                    density="compact"
                    bg-color="grey-lighten-4"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.forma_pago"
                    :items="formasPagoOptions"
                    item-title="formaPago"
                    item-value="id"
                    label="Forma de Pago"
                    variant="outlined"
                    bg-color="blue-lighten-5"
                    required
                  ></v-select>
                </v-col>
              </v-row>

              <div v-if="MostrarCamposOtros">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.datos_forma_pago.otros.nombre_otros"
                      label="Nombre a quien se realiza el pago"
                      variant="outlined"
                      bg-color="blue-lighten-5"
                      :required="MostrarCamposOtros"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.datos_forma_pago.otros.ci_otros"
                      label="Documento de Identidad C.I."
                      variant="outlined"
                      bg-color="blue-lighten-5"
                      :required="MostrarCamposOtros"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>

              <div v-if="MostrarCamposTransferencia">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.datos_forma_pago.transferencia.nombre_transferencia"
                      label="Nombre completo a quien se realiza la transferencia"
                      variant="outlined"
                      bg-color="blue-lighten-5"
                      :required="MostrarCamposTransferencia"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.datos_forma_pago.transferencia.ci_transferencia"
                      label="Documento de Identidad C.I."
                      variant="outlined"
                      bg-color="blue-lighten-5"
                      :required="MostrarCamposTransferencia"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.datos_forma_pago.transferencia.entidad_bancaria"
                      label="Nombre de Entidad Bancaria"
                      variant="outlined"
                      bg-color="blue-lighten-5"
                      :required="MostrarCamposTransferencia"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.datos_forma_pago.transferencia.tipo_cuenta"
                      :items="['Ahorro', 'Corriente']"
                      label="Tipo de Cuenta (Ahorro/ Corriente)"
                      variant="outlined"
                      bg-color="blue-lighten-5"
                      :required="MostrarCamposTransferencia"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.datos_forma_pago.transferencia.numero_cuenta"
                      label="Número de Cuenta Bancaria"
                      variant="outlined"
                      bg-color="blue-lighten-5"
                      :required="MostrarCamposTransferencia"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </div> -->

            <!-- <v-divider class="my-4"></v-divider> -->

            <!-- Sección 4: Firmas -->
            <!-- <div class="form-section mb-6">
              <h3 class="text-h6 mb-4 primary--text">
                <v-icon color="primary" class="mr-2">mdi-signature</v-icon>
                Firmas y Validaciones
              </h3>

              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.id_responsable"
                    :items="responsablesList"
                    :item-title="getNombreCompleto"
                    item-value="id"
                    label="Responsable Coordinación"
                    variant="outlined"
                    bg-color="blue-lighten-5"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" class="d-flex align-center">
                  <v-checkbox
                    v-model="formData.validacion_responsable"
                    label="Aprobado por Coordinación"
                    :disabled="isFrozen"
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.id_coordinador"
                    :items="coordinadoresList"
                    :item-title="getNombreCompleto"
                    item-value="id"
                    label="Responsable Dirección Administrativa"
                    variant="outlined"
                    bg-color="blue-lighten-5"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" class="d-flex align-center">
                  <v-checkbox
                    v-model="formData.validacion_coordinador"
                    label="Aprobado por Dirección Administrativa"
                    :disabled="isFrozen"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </div> -->

            <!-- Firmad y validaciones -->
            <!-- <div class="form-section mb-6">
              <h3 class="text-h6 mb-4 primary--text">
                <v-icon color="primary" class="mr-2">mdi-signature</v-icon>
                Firmas y Validaciones
              </h3>

              <v-row>
                <v-col cols="12">
                  <SeleccionValidadoresSolicitudes></SeleccionValidadoresSolicitudes>
                </v-col>
              </v-row>
            </div> -->

            <!-- Botones de acción -->
            <!-- <div class="d-flex justify-end gap-3 mt-8">
              <v-btn
                color="error"
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
                Enviar Solicitud
              </v-btn>
            </div> -->
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
  <!---------------------------------COMPONENTES DE NAVEGACION Y ENVIO --------------------------------->
  <!--Barra de herramientas, guardar, enviar, etc-->
  <BarraHerramientasFormulario
    @save-draft="guardarFormulario"
    @submit-review="enviarFormulario"
    @cancel="cancelarSalir"
  ></BarraHerramientasFormulario>
  <!--Dialogo para guardar el formulario-->
  <DialogoGuardarFormulario
    ref="dialogoGuardarRef"
    :titulo="'Solicitud de Fondos'"
    :datos="datosResumen"
    @confirm="confirmarGuardarDatosForm"
    @close="cerrarDialogoGuardarForm"
  ></DialogoGuardarFormulario>
  <!--Dialogo para guardar el formulario y enviar a revision -->
  <DialogoGuardarFormularioValidador
    ref="dialogoRevisionRef"
    titulo="Solicitud de Viajes"
    :datos="datosResumen"
    @confirm="confirmarEnvioRevision"
    @close="cerrarDialogoRevision"
  ></DialogoGuardarFormularioValidador>
  <!--Dialogo de confirmacion para salir -->
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import SeleccionValidadoresSolicitudes from '@/modules/formularios/components/validadores/SeleccionValidadoresSolicitudes.vue'

import axios from 'axios'
import { useUserStore } from '@/stores/user'
import * as XLSX from 'xlsx'
import { useRoute, useRouter } from 'vue-router'
import { useNotificaciones } from '@/modules/notificacion/composables/useNotificaciones'
//Componetes Navegacion
import InformacionAdicional from '@/modules/formularios/components/InformacionAdicional.vue'
import BarraHerramientasFormulario from '@/modules/formularios/barraHerramientas/BarraHerramientasFormulario.vue'
import DialogoGuardarFormulario from '@/modules/formularios/barraHerramientas/DialogoGuardarFormulario.vue'
import DialogoGuardarFormularioValidador from '@/modules/formularios/barraHerramientas/DialogoGuardarFormularioValidador.vue'
import ConfirmDialog from '@/components/layout/partials/ConfirmDialog.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { useSnackbar } from '@/composables/useSnackbar'
import { useValidadoresSolViajes } from '@/modules/formularios/composables/useValidadoresSolViajes'

/******* Computed para ligar la informacion al componente InformacionAdicional ***********************************************************************/

//Referencia al componente Informacion adicional
const infoRef = ref(null)

//Bandera para comprobar que la Informacion Adicional esta completa
const estaCompletaInformacionAdicional = computed(() => {
  return infoRef.value?.validacionCompleta
})

//Lugar
const lugar = computed(() => {
  return infoRef.value?.informacionAdicionalDatos.lugar
})

//Forma de pago
const idFormaPago = computed(() => {
  return infoRef.value?.informacionAdicionalDatos.formaPago
})

const datosDeLaFormaPago = computed(() => {
  return infoRef.value?.informacionAdicionalDatos.datosFormaPago
})

//Inicar Composable
const { enviarMensajeAutomatico } = useNotificaciones()
const { successMsg, errorMsg, warningMsg } = useSnackbar()
const { openConfirmDialog } = useConfirmDialog()
const { asignarValidadores } = useValidadoresSolViajes()

//Routes
const router = useRouter()
const route = useRoute()
const idActividad = route.params.id || null
const idTarea = route.query.tarea_id || null
console.log('ID Actividad:', idActividad)
console.log('ID Tarea:', idTarea)

const userStore = useUserStore()
const usuario = computed(() => {
  return {
    nombre: userStore.usuario,
    role: userStore.rol,
    id: userStore.id,
  }
})
console.log('ID Usuario:', JSON.stringify(usuario.value.id, null, 2))

const baseurl = import.meta.env.VITE_API_BASE

const loading = ref(false)
const responsablesList = ref([])
const coordinadoresList = ref([])
const datosSolicitante = ref([])
const solicitante = ref(null)
const numeroFormulario = ref('')

const cargandoGeneral = ref(true)

//variables para carga de datos
const datosFormulario = ref(null) //necesario para tarjetas de encabezado
const error = ref(null)
const isLoading = ref(false)
const formasPago = ref([])

const contadoresList = ref([])
const correo_coordinador = ref('')
const correo_contador = ref('')

const formData = ref({
  evento: '',
  fecha_evento: '',
  lugar_evento: '',
  instituciones_participantes: '',
  institucion_queinvita: '', //organizador
  quien_cubregastos: '',
  fondos_unitas: '',
  justificacion_asistencia: '',
  tareas_previas: '',
  id_actividad: '',
  id_tarea: null,
  id_usuario: '',
  detalle_destino_fondos: [{ partida: '', fuente: '', descripcion_gasto: '', monto: 0 }],
  monto_solicitado: 0,
  lugar_solicitud: '',
  fecha_solicitud: getCurrentDate(),

  forma_pago: null,
  datos_forma_pago: {
    otros: { nombre_otros: '', ci_otros: '' },
    transferencia: {
      nombre_transferencia: '',
      ci_transferencia: '',
      entidad_bancaria: '',
      tipo_cuenta: '',
      numero_cuenta: '',
    },
  },
  validacion_responsable: false,
  id_responsable: null,
  validacion_coordinador: false,
  id_coordinador: null,
  correo_coordinador: '',
  correo_contador: '',
})

const numeroFormularioSF = ref(null)

// Logica para formas de pago
const formasPagoOptions = computed(() => {
  if (datosFormulario.value && datosFormulario.value.formaPago) {
    return datosFormulario.value.formaPago
  }
  return []
})

const formaPagoElegido = computed(() => {
  if (formData.value.forma_pago && formasPagoOptions.value.length > 0) {
    const formaPago = formasPagoOptions.value.find((fp) => fp.id === formData.value.forma_pago)
    const resultado = formaPago ? formaPago.formaPago : ''
    console.log('Forma de pago seleccionada:', resultado)
    return resultado
  }
  return ''
})

const MostrarCamposOtros = computed(() => {
  const formaPagoTexto = formaPagoElegido.value
  return formaPagoTexto === 'Efectivo' || formaPagoTexto === 'Cheque'
})

const MostrarCamposTransferencia = computed(() => {
  const formaPagoTexto = formaPagoElegido.value
  return formaPagoTexto === 'Transferencia Bancaria'
})

const nombreCoordinadorElegido = computed(() => {
  const coordinador = coordinadoresList.value.find(
    (user) => user.id === formData.value.id_coordinador,
  )
  return coordinador ? getNombreCompleto(coordinador) : ''
})

const nombreResponsableElegido = computed(() => {
  const responsable = responsablesList.value.find(
    (user) => user.id === formData.value.id_responsable,
  )
  return responsable ? getNombreCompleto(responsable) : ''
})

const totalMontoSolicitado = computed(() => {
  return formData.value.detalle_destino_fondos.reduce(
    (total, gasto) => total + Number(gasto.monto || 0),
    0,
  )
})

const nombreCompletoSolicitante = computed(() => {
  return userStore.userData.value?.nombre
  // return `${formData.value.nombre} ${formData.value.paterno} ${formData.value.materno}`.trim()
})

const isFrozen = computed(() => {
  if (!usuario.value || !formData.value.id_coordinador) {
    return true
  }
  return true
})

// WATCH PARA GUARDAR EL CORREO DEL COORDINADOR Y DEL CONTADOR CUANDO SE SELECCIONA
watch(
  () => formData.value.id_coordinador,
  (newIdCoordinador) => {
    if (newIdCoordinador && coordinadoresList.value.length > 0) {
      const coordinadorSeleccionado = coordinadoresList.value.find(
        (coordinador) => coordinador.id === newIdCoordinador,
      )

      if (coordinadorSeleccionado && coordinadorSeleccionado.correo) {
        formData.value.correo_coordinador = coordinadorSeleccionado.correo
      } else {
        formData.value.correo_coordinador = ''
      }
    } else {
      formData.value.correo_coordinador = ''
    }
  },
  { immediate: true },
)

watch(
  () => formData.value.id_responsable,
  (newIdResponsable) => {
    if (newIdResponsable && responsablesList.value.length > 0) {
      const responsableSeleccionado = responsablesList.value.find(
        (responsable) => responsable.id === newIdResponsable,
      )

      if (responsableSeleccionado && responsableSeleccionado.correo) {
        formData.value.correo_contador = responsableSeleccionado.correo
      } else {
        formData.value.correo_contador = ''
      }
    } else {
      formData.value.correo_contador = ''
    }
  },
  { immediate: true },
)

function getNombreCompleto(user) {
  return `${user.nombre} ${user.paterno} ${user.materno}`.trim()
}

function getCurrentDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function cargarDatos() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + 'api/monitoreo/obtener-datos-formulario/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_actividad: idActividad,
        usuario: usuario.value.nombre,
      }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }
    const data = await response.json()
    datosFormulario.value = data
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

async function cargarFormasDePago() {
  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerFormasPago/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!response.ok) throw new Error('Error al cargar formas de pago')

    const data = await response.json()
    formasPago.value = data.formasPago
  } catch (err) {
    console.error('Error:', err)
  }
}

watch(
  datosFormulario,
  (newVal) => {
    if (newVal && newVal.usuario) {
      datosSolicitante.value = newVal.usuario
      if (datosSolicitante.value) {
        solicitante.value = getNombreCompleto(datosSolicitante.value)
      }
    } else {
      datosSolicitante.value = []
    }
  },
  { deep: true },
)

async function cargarUsuarios() {
  try {
    const response = await axios.get(baseurl + 'autenticacion_api/listaUsuarios/')
    const allUsers = response.data.usuarios
    console.log('Usuarios obtenidos:', allUsers)
    responsablesList.value = allUsers.filter(
      (user) => user.cargo === 'coordinador' && user.es_activo === true,
    )
    coordinadoresList.value = allUsers.filter((user) => user.cargo === 'dir-administrativo')
    if (datosSolicitante.value) {
      solicitante.value = getNombreCompleto(datosSolicitante.value)
    }
  } catch (error) {
    console.error('Error al cargar la lista de usuarios:', error)
    alert('No se pudieron cargar los usuarios para las firmas. Por favor recargue la página.')
  }
}

function addGasto() {
  formData.value.detalle_destino_fondos.push({
    partida: '',
    fuente: '',
    descripcion_gasto: '',
    monto: 0,
  })
}

function removeGasto(index) {
  if (formData.value.detalle_destino_fondos.length > 1) {
    formData.value.detalle_destino_fondos.splice(index, 1)
  }
}

async function submitForm() {
  loading.value = true
  try {
    const requiredFields = [
      'evento',
      'fecha_evento',
      'lugar_evento',
      'instituciones_participantes',
      'institucion_queinvita',
      'quien_cubregastos',
      'fondos_unitas',
      'justificacion_asistencia',
      'tareas_previas',
      'detalle_destino_fondos',
      'forma_pago',
      'lugar_solicitud',
      'fecha_solicitud',
    ]

    for (const field of requiredFields) {
      if (!formData.value[field]) {
        throw new Error(`El campo '${field}' es requerido.`)
      }
    }

    if (
      formData.value.detalle_destino_fondos.some(
        (gasto) => !gasto.partida || !gasto.fuente || !gasto.descripcion_gasto || gasto.monto <= 0,
      )
    ) {
      throw new Error('Todos los gastos deben tener partida, descripción y un monto mayor a cero.')
    }

    // OBTENER LOS CORREOS ACTUALES ANTES DE ENVIAR
    const coordinadorSeleccionado = coordinadoresList.value.find(
      (coordinador) => coordinador.id === formData.value.id_coordinador,
    )
    const contadorSeleccionado = responsablesList.value.find(
      (contador) => contador.id === formData.value.id_responsable,
    )

    const correoCoordinadorActual = coordinadorSeleccionado?.correo || ''
    const correoContadorActual = contadorSeleccionado?.correo || ''

    // Actualizar los valores en formData
    formData.value.correo_coordinador = correoCoordinadorActual
    formData.value.correo_contador = correoContadorActual

    const payload = {
      ...formData.value,
      id_usuario: usuario.value.id || 0,
      id_actividad: idActividad || 0,
      id_tarea: idTarea || null,
      monto_solicitado: totalMontoSolicitado.value,
      detalle_destino_fondos: {
        items: formData.value.detalle_destino_fondos.map((gasto) => ({
          partida: gasto.partida,
          fuente: gasto.fuente,
          concepto: gasto.descripcion_gasto,
          monto: Number(gasto.monto),
        })),
      },
    }
    console.log('Payload completo que se enviará:', JSON.stringify(payload, null, 2))

    const response = await fetch(baseurl + 'monitoreo_api/crearSolicitudViaje/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    const data = await response.json()
    numeroFormularioSF.value = data.numero_formulario

    const urlForm = `${window.location.origin}/monitoreo/formulario055/${idActividad}?solicitud_id=${data.id}${idTarea ? `&tarea_id=${idTarea}` : ''}`
    const cuerpoMensaje = {
      destinatario_id: payload.id_coordinador,
      asunto: 'Solicitud de Viaje',
      contenido:
        'Solicitud de Viaje pediente del formulario ' +
        numeroFormularioSF.value +
        '. URL: ' +
        urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }
    await enviarMensajeAutomatico(cuerpoMensaje)

    const cuerpoMensaje2 = {
      destinatario_id: payload.id_responsable,
      asunto: 'Solicitud de Viaje',
      contenido:
        'Solicitud de Viaje pediente del formulario ' +
        numeroFormularioSF.value +
        '. URL: ' +
        urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }

    exportToExcel()
    resetForm()

    await enviarMensajeAutomatico(cuerpoMensaje2)

    ///////// Enviar notificación por correo al coordinador y al contador//////////
    try {
      const emailPayload = {
        emails: [correoCoordinadorActual, correoContadorActual].filter((email) => email),
        datos_solicitud: {
          codigo: numeroFormularioSF.value || 'SOL-PROV',
          titulo: 'Formulario Sol. Viaje',
          solicitante: nombreCompletoSolicitante.value,
          tipo: 'Solicitud de Actividad',
          prioridad: 'alta',
          descripcion: formData.value.descripcion_actividad || 'Solicitud de fondos para actividad',
          url_revision: `${window.location.origin}/monitoreo/formulario055/${idActividad}?solicitud_id=${data.id}${idTarea ? `&tarea_id=${idTarea}` : ''}`,
        },
      }

      console.log('emailPayload enviado al servidor:', JSON.stringify(emailPayload, null, 2))
      const emailResponse = await fetch(baseurl + 'api-msg/correos/solicitud-pendiente/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload),
      })

      if (emailResponse.ok) {
        console.log('Correo de notificación enviado exitosamente')
      } else {
        console.warn('No se pudo enviar el correo de notificación')
      }
    } catch (emailError) {
      console.error('Error al enviar correo de notificación:', emailError)
    }

    console.log('Respuesta del servidor:', JSON.stringify(data, null, 2))

    setTimeout(() => {
      router.push('/pei/listaactividades?showButton=1')
    }, 1000)

    return data
  } catch (error) {
    console.error('Error completo:', error.response?.data || error.message)
    alert(`Error: ${error.response?.data?.message || error.message}`)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(formData.value, {
    evento: '',
    fecha_evento: '',
    lugar_evento: '',
    instituciones_participantes: '',
    institucion_queinvita: '',
    quien_cubregastos: '',
    fondos_unitas: '',
    justificacion_asistencia: '',
    tareas_previas: '',
    detalle_destino_fondos: [{ partida: '', descripcion_gasto: '', monto: 0 }],
    forma_pago: '',
    lugar_solicitud: '',
    fecha_solicitud: getCurrentDate(),
    id_responsable: null,
    validacion_responsable: false,
    id_coordinador: null,
    validacion_coordinador: false,
  })
}

function exportToExcel() {
  const mainData = [
    ['FORMULARIO F-05: SOLICITUD DE FONDOS PARA VIAJE', '', '', ''],
    [''],
    ['FORMULARIO Nro:', numeroFormulario.value, '', ''],
    ['INFORMACIÓN DEL SOLICITANTE', '', '', ''],
    ['Nombre Completo:', solicitante.value, '', ''],
    ['Documento de Identidad:', datosSolicitante.value.ci, '', ''],
    ['Cargo:', datosSolicitante.value.cargo, '', ''],
    [''],
    ['INFORMACIÓN DEL SEMINARIO', '', '', ''],
    ['Seminario:', formData.value.evento, '', ''],
    ['Fecha Evento:', formData.value.fecha_evento, '', ''],
    ['Lugar de Evento:', formData.value.lugar_evento, '', ''],
    ['Instituciones Participantes:', formData.value.instituciones_participantes, '', ''],
    ['Institución que Invita:', formData.value.institucion_queinvita, '', ''],
    ['Quien Cubre los Gastos:', formData.value.quien_cubregastos, '', ''],
    ['Fondos UNITAS:', formData.value.fondos_unitas, '', ''],
    ['Justificación de Asistencia:', formData.value.justificacion_asistencia, '', ''],
    ['Tareas Previas:', formData.value.tareas_previas, '', ''],
    [''],
    ['INFORMACIÓN DE LA SOLICITUD', '', '', ''],
    ['Lugar de Solicitud:', formData.value.lugar_solicitud, '', ''],
    ['Fecha de Solicitud:', getCurrentDate(), '', ''],
    [''],
    ['FORMA DE PAGO', '', '', ''],
    ['Forma de Pago:', formaPagoElegido.value, '', ''],
    [''],
    ['DATOS PARA TRANSFERENCIA BANCARIA', '', '', ''],
    [
      'Pago a nombre de:',
      formData.value.datos_forma_pago.transferencia.nombre_transferencia,
      '',
      '',
    ],
    ['C.I.:', formData.value.datos_forma_pago.transferencia.ci_transferencia, '', ''],
    ['Banco:', formData.value.datos_forma_pago.transferencia.entidad_bancaria, '', ''],
    ['Nro. Cuenta:', formData.value.datos_forma_pago.transferencia.numero_cuenta, '', ''],
    ['Tipo Cuenta:', formData.value.datos_forma_pago.transferencia.tipo_cuenta, '', ''],
    [''],
    ['DATOS PARA OTROS PAGOS', '', '', ''],
    ['Pago a nombre de:', formData.value.datos_forma_pago.otros.nombre_otros, '', ''],
    ['C.I.:', formData.value.datos_forma_pago.otros.ci_otros, '', ''],
    [''],
    ['FIRMAS Y VALIDACIONES', '', '', ''],
    [
      'Responsable:',
      nombreResponsableElegido.value,
      'Aprobado:',
      formData.value.validacion_responsable ? '✓' : '✗',
    ],
    [
      'Coordinador:',
      nombreCoordinadorElegido.value,
      'Aprobado:',
      formData.value.validacion_coordinador ? '✓' : '✗',
    ],
    [''],
    ['DETALLE DEL DESTINO DE FONDOS', '', '', ''],
  ]

  const expensesHeaders = ['PARTIDA', 'DESCRIPCIÓN DEL GASTO', 'MONTO (BS.)', 'OBSERVACIONES']

  const expensesData = formData.value.detalle_destino_fondos.map((gasto) => [
    gasto.partida,
    gasto.descripcion_gasto,
    gasto.monto,
    '',
  ])

  const totalRow = ['TOTAL', '', totalMontoSolicitado.value, '']

  const wb = XLSX.utils.book_new()

  const wsMain = XLSX.utils.aoa_to_sheet([...mainData, expensesHeaders, ...expensesData, totalRow])

  applyExcelStyles(
    wsMain,
    mainData.length,
    expensesData.length,
    formData.value.descripcion_actividad,
    formData.value.objetivo_actividad,
  )

  XLSX.utils.book_append_sheet(wb, wsMain, 'Solicitud de Viaje')
  XLSX.writeFile(wb, `Solicitud_Viaje_F-05_${getCurrentDate()}.xlsx`)
}

function applyExcelStyles(
  worksheet,
  mainDataRows,
  expensesRows,
  descripcionActividad,
  objetivoActividad,
) {
  if (!worksheet['!merges']) worksheet['!merges'] = []

  worksheet['!merges'].push(
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
    { s: { r: 7, c: 0 }, e: { r: 7, c: 3 } },
    { s: { r: 12, c: 0 }, e: { r: 12, c: 3 } },
    { s: { r: 18, c: 0 }, e: { r: 18, c: 3 } },
    { s: { r: 21 + mainDataRows, c: 0 }, e: { r: 21 + mainDataRows, c: 3 } },
  )

  worksheet['!cols'] = [{ wch: 30 }, { wch: 40 }, { wch: 20 }, { wch: 25 }]

  Object.keys(worksheet).forEach((cellAddress) => {
    if (cellAddress !== '!ref' && cellAddress !== '!merges' && cellAddress !== '!cols') {
      const cell = worksheet[cellAddress]
      const cellRef = XLSX.utils.decode_cell(cellAddress)

      if (
        cellRef.r === 0 ||
        cellRef.r === 2 ||
        cellRef.r === 7 ||
        cellRef.r === 12 ||
        cellRef.r === 18 ||
        cellRef.r === 21 + mainDataRows
      ) {
        cell.s = {
          font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
          fill: { fgColor: { rgb: '4472C4' } },
          alignment: { horizontal: 'center', vertical: 'center' },
        }
      } else if (cellRef.c === 0 && cellRef.r > 0 && cellRef.r < 21 + mainDataRows) {
        cell.s = {
          font: { bold: true, color: { rgb: '000000' } },
          fill: { fgColor: { rgb: 'D9E1F2' } },
        }
      } else if (cellRef.r === 22 + mainDataRows) {
        cell.s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '5B9BD5' } },
          alignment: { horizontal: 'center' },
        }
      } else if (cellRef.r === 23 + mainDataRows + expensesRows) {
        cell.s = {
          font: { bold: true },
          fill: { fgColor: { rgb: 'F2F2F2' } },
        }
      } else if (
        cellRef.c === 2 &&
        cellRef.r >= 23 + mainDataRows &&
        cellRef.r <= 22 + mainDataRows + expensesRows
      ) {
        cell.z = '"Bs." #,##0.00'
      } else if (
        (cell.v && typeof cell.v === 'string' && cell.v.match(/\d{4}-\d{2}-\d{2}/)) ||
        (cellRef.c === 2 && cellRef.r === 9)
      ) {
        cell.z = 'dd/mm/yyyy'
      }

      if (cellRef.r === 8 && cellRef.c === 1) {
        if (!cell.s) cell.s = {}
        cell.s.alignment = cell.s.alignment || {}
        cell.s.alignment.wrapText = true
        cell.s.alignment.vertical = 'top'
      }

      if (cellRef.r === 10 && cellRef.c === 1) {
        if (!cell.s) cell.s = {}
        cell.s.alignment = cell.s.alignment || {}
        cell.s.alignment.wrapText = true
        cell.s.alignment.vertical = 'top'
      }
    }
  })

  const tableStartRow = 22 + mainDataRows
  const tableEndRow = 23 + mainDataRows + expensesRows

  for (let r = tableStartRow; r <= tableEndRow; r++) {
    for (let c = 0; c < 4; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c })
      if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: '' }
      if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {}
      worksheet[cellAddress].s.border = {
        top: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
      }
    }
  }

  if (!worksheet['!rows']) worksheet['!rows'] = []

  if (descripcionActividad && descripcionActividad.length > 100) {
    worksheet['!rows'][8] = { hpt: 60 }
  }

  if (objetivoActividad && objetivoActividad.length > 100) {
    worksheet['!rows'][10] = { hpt: 60 }
  }
}

onMounted(async () => {
  await Promise.all([cargarUsuarios(), cargarDatos(), cargarFormasDePago()])
})

/******************************* EVENTOS DE LA BARRA ****************************************/
//Funcion para validacion
// Función de validación reutilizable
/**
 * Valida el formulario antes de enviar
 * @returns {string|null} Mensaje de error o null si es válido
 */
const validarFormulario = () => {
  const requiredFields = [
    'evento',
    'fecha_evento',
    'lugar_evento',
    'instituciones_participantes',
    'institucion_queinvita',
    'quien_cubregastos',
    'fondos_unitas',
    'justificacion_asistencia',
    'tareas_previas',
    // 'detalle_destino_fondos',
    // 'forma_pago',
    // 'lugar_solicitud',
    // 'fecha_solicitud',
  ]

  // Validar campos requeridos
  for (const field of requiredFields) {
    if (!formData.value[field]) {
      return `El campo '${field}' es requerido.`
    }
  }

  // Validar detalle de gastos
  if (formData.value.detalle_destino_fondos.length === 0) {
    return 'Debe agregar al menos un gasto.'
  }

  if (
    formData.value.detalle_destino_fondos.some(
      (gasto) => !gasto.partida || !gasto.fuente || !gasto.descripcion_gasto || gasto.monto <= 0,
    )
  ) {
    return 'Todos los gastos deben tener partida, fuente, descripción y un monto mayor a cero.'
  }

  if (!estaCompletaInformacionAdicional.value) {
    return 'Complete la información adicional.'
  }

  return null
}

//Guardar los formularios sin validadores
const guardarFormulario = async () => {
  const error = validarFormulario()
  if (error) {
    warningMsg('Por Favor: ' + error)
    return
  }
  dialogoGuardarRef.value?.abrir() //Abre el cuadro de Dialogo <DialogoGuardarFormulario>
}
//Enviar los formularios con validadores
const enviarFormulario = async () => {
  // Validar antes de abrir el diálogo
  const error = validarFormulario()
  if (error) {
    warningMsg('Por Favor: ' + error)
    return
  }
  dialogoRevisionRef.value?.abrir()
}

//Salir del nuevo formulario
const cancelarSalir = async () => {
  const confirmado = await openConfirmDialog({
    title: 'Confirmar salida',
    message:
      'Los cambios no guardados se perderán permanentemente. ¿Estás seguro de que deseas cancelar y salir del formulario?',
    confirmLabel: 'Salir',
    cancelLabel: 'Permanecer',
    type: 'delete', // Esto pone el ícono y color rojo
  })

  if (confirmado) {
    router.push('/pei/listaactividades?showButton=1')
  }
}
/*******************************Funciones para el cuadro de dialogo: Guardar Formulario ********************************************************/
const dialogoGuardarRef = ref(null) //Referencia al dialogo guardar formulario

//Datos para el dialogo de confirmacion
const datosResumen = computed(() => ({
  solicitante: solicitante,
  fechaSolicitud: formData.value.fecha_solicitud,
  lugar: lugar.value || '—',
  formaPago: formaPagoElegido.value || '—',
  archivos: formData.value.medios_archivos?.length || 0,
  montoTotal: totalMontoSolicitado.value,
  detalleFormaPago: datosDeLaFormaPago.value || {},
  detalleGastos: formData.value.detalle_destino_fondos.map((g) => ({
    partida: g.partida,
    fuente: g.fuente,
    descripcion: g.descripcion_gasto,
    monto: g.monto,
  })),
}))

//Funcion para Enviar la informacion al rest api
const confirmarGuardarDatosForm = async () => {
  try {
    dialogoGuardarRef.value?.setGuardando(true)

    const payload = {
      evento: formData.value.evento,
      fecha_evento: formData.value.fecha_evento,
      lugar_evento: formData.value.lugar_evento,
      instituciones_participantes: formData.value.instituciones_participantes,
      institucion_queinvita: formData.value.institucion_queinvita,
      quien_cubregastos: formData.value.quien_cubregastos,
      fondos_unitas: formData.value.fondos_unitas,
      justificacion_asistencia: formData.value.justificacion_asistencia,
      tareas_previas: formData.value.tareas_previas,
      id_actividad: idActividad || 0,
      id_tarea: idTarea || null,
      id_usuario: usuario.value.id || 0,
      monto_solicitado: totalMontoSolicitado.value,
      detalle_destino_fondos: {
        items: formData.value.detalle_destino_fondos.map((gasto) => ({
          partida: gasto.partida,
          concepto: gasto.descripcion_gasto,
          monto: Number(gasto.monto),
        })),
      },
      forma_pago: idFormaPago.value,
      lugar_solicitud: lugar.value,
      fecha_solicitud: formData.value.fecha_solicitud,
      datos_forma_pago: datosDeLaFormaPago.value,
      validacion_responsable: false,
      id_responsable: usuario.value.id,
      validacion_coordinador: false,
      id_coordinador: usuario.value.id,
    }

    console.log('PAYLOAD:', payload)

    const response = await fetch(baseurl + 'monitoreo_api/crearSolicitudViaje/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.mensaje || errorData.error || JSON.stringify(errorData))
    }

    const data = await response.json()
    numeroFormularioSF.value = data.numero_formulario

    exportToExcel()
    resetForm()

    dialogoGuardarRef.value?.cerrar()
    successMsg('Formulario guardado exitosamente.')
    router.push('/pei/listaactividades?showButton=1')
  } catch (error) {
    console.error('Error al guardar:', error)
    errorMsg(`Error al guardar: ${error.message}`)
    dialogoGuardarRef.value?.setGuardando(false)
  }
}
//Cierra el dialogo para guardar
const cerrarDialogoGuardarForm = async () => {
  //Cerrar el diagolo
  dialogoGuardarRef.value.cerrar()
}

/************************** GUardar Sol de fondos con Validadores *****************************************************/
const dialogoRevisionRef = ref(null)
//FUncion para enviar al rest api, guardar form mas validadores - endpoint pendiente
const confirmarEnvioRevision = async (datosValidadores) => {
  // alert('Enviar al rest api')
  // console.log('VALIDADORES: ', datosValidadores)
  try {
    dialogoGuardarRef.value?.setGuardando(true)

    const payload = {
      evento: formData.value.evento,
      fecha_evento: formData.value.fecha_evento,
      lugar_evento: formData.value.lugar_evento,
      instituciones_participantes: formData.value.instituciones_participantes,
      institucion_queinvita: formData.value.institucion_queinvita,
      quien_cubregastos: formData.value.quien_cubregastos,
      fondos_unitas: formData.value.fondos_unitas,
      justificacion_asistencia: formData.value.justificacion_asistencia,
      tareas_previas: formData.value.tareas_previas,
      id_actividad: idActividad || 0,
      id_tarea: idTarea || null,
      id_usuario: usuario.value.id || 0,
      monto_solicitado: totalMontoSolicitado.value,
      detalle_destino_fondos: {
        items: formData.value.detalle_destino_fondos.map((gasto) => ({
          partida: gasto.partida,
          concepto: gasto.descripcion_gasto,
          monto: Number(gasto.monto),
        })),
      },
      forma_pago: idFormaPago.value,
      lugar_solicitud: lugar.value,
      fecha_solicitud: formData.value.fecha_solicitud,
      datos_forma_pago: datosDeLaFormaPago.value,
      validacion_responsable: false,
      id_responsable: usuario.value.id,
      validacion_coordinador: false,
      id_coordinador: usuario.value.id,
    }

    console.log('PAYLOAD:', payload)

    const response = await fetch(baseurl + 'monitoreo_api/crearSolicitudViaje/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.mensaje || errorData.error || JSON.stringify(errorData))
    }

    //Enviar notificaciones email
    const data = await response.json()
    numeroFormularioSF.value = data.numero_formulario
    const solicitud_id = data.id
    const revisores = datosValidadores.validadoresIds
    //Asignar validadores
    await asignarValidadores(solicitud_id, revisores)

    exportToExcel()
    resetForm()

    dialogoGuardarRef.value?.cerrar()
    successMsg('Formulario guardado exitosamente.')
    router.push('/pei/listaactividades?showButton=1')
  } catch (error) {
    console.error('Error al guardar:', error)
    errorMsg(`Error al guardar: ${error.message}`)
    dialogoGuardarRef.value?.setGuardando(false)
  }
}
const cerrarDialogoRevision = async () => {
  dialogoRevisionRef.value?.cerrar()
}
</script>

<style scoped>
.solicitud-viaje-container {
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

.users-table {
  width: 100%;
}

.users-table th {
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 2;
}

.narrow-column {
  width: 15%;
}

.wide-column {
  width: 50%;
}

.action-column {
  width: 15%;
}

.compact-field {
  font-size: 14px;
  max-width: 100px;
}

/* Ajustes responsivos */
@media (max-width: 960px) {
  .solicitud-viaje-container {
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

/* Mejora el aspecto de la tabla */
:deep(.v-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-table th) {
  background-color: #1976d2 !important;
  color: white !important;
  font-weight: 600;
  font-size: 14px;
  padding: 16px 12px;
}

:deep(.v-table td) {
  padding: 12px;
  background-color: #fafafa;
}
</style>
