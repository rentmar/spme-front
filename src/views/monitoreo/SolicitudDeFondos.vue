<template>
  <v-container class="solicitud-fondos-container">
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
        :titulo="'Solicitud de Fondos'"
        :icon="'mdi-cash-check'"
      ></PaginaTituloIcono>
      <!--Encabezado del Proyecto-->
      <ProyectoIdHeader
        v-if="datosFormulario"
        :proyecto-id="datosFormulario.actividad?.proyecto"
      ></ProyectoIdHeader>
      <br />
      <!--Encabezado de la Actividad-->

      <ActividadInformacion v-if="datosFormulario.actividad" :actividad-id="idActividad" />

      <v-row>
        <!-- Panel lateral de información -->
        <v-col cols="12" md="4" lg="3">
          <v-card elevation="2" rounded="lg" class="mb-4">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">Información General</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-4">
              <div class="info-item mb-3">
                <div class="text-subtitle-2 text-medium-emphasis">Actividad:</div>
                <div class="text-body-1 font-weight-medium">
                  {{ datosFormulario.actividad.nombreCorto }}
                </div>
              </div>
              <div class="info-item mb-3">
                <div class="text-subtitle-2 text-medium-emphasis">Estado:</div>
                <v-chip color="warning" size="small" class="mt-1">
                  <v-icon small class="mr-1">mdi-progress-clock</v-icon>
                  {{ datosFormulario.actividad.estado }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <!-- Tarjeta de resumen rápido -->
          <!-- <v-card elevation="2" rounded="lg" class="mb-4">
            <v-toolbar color="secondary" density="compact">
              <v-toolbar-title class="text-white">Resumen Rápido</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-2 text-medium-emphasis">Monto solicitado:</span>
                <span class="text-body-1 font-weight-bold text-primary"
                  >Bs. {{ totalMontoSolicitado.toLocaleString() }}</span
                >
              </div>
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-2 text-medium-emphasis">Items de gasto:</span>
                <span class="text-body-1 font-weight-medium">{{
                  formData.detalle_destino_fondos.length
                }}</span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-space-between align-center">
                <span class="text-subtitle-2 text-medium-emphasis">Presupuesto disponible:</span>
                <span class="text-body-1 font-weight-medium text-success"
                  >Bs. {{ actividadData.presupuesto.toLocaleString() }}</span
                >
              </div>
            </v-card-text>
          </v-card> -->
        </v-col>

        <!-- Formulario principal -->
        <v-col cols="12" md="8" lg="9">
          <v-card elevation="2" rounded="lg">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon class="mr-2">mdi-form-textbox</v-icon>
                Formulario de Solicitud
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pa-4">
              <v-form ref="form" @submit.prevent="submitForm">
                <!-- Sección 1: Información del Solicitante -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                    Información del Solicitante
                  </h3>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.nombre"
                        label="Nombre del Solicitante"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.paterno"
                        label="Apellido paterno del Solicitante"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.materno"
                        label="Apellido materno del Solicitante"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.documento_identidad"
                        label="Carnet de Identidad"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.cargo"
                        label="Cargo"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 2: Información de la Actividad -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-calendar-text</v-icon>
                    Información de la Actividad
                  </h3>
                  <v-textarea
                    v-model="formData.descripcion_actividad"
                    label="Descripción de la Actividad"
                    variant="outlined"
                    rows="3"
                    bg-color="blue-lighten-5"
                    required
                  ></v-textarea>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.fecha_irealizacion"
                        label="Inicio de Fecha de Realización"
                        type="date"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.fecha_frealizacion"
                        label="Fin de Fecha de Realización"
                        type="date"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-textarea
                    v-model="formData.objetivo_actividad"
                    label="Objetivo de la Actividad"
                    variant="outlined"
                    rows="3"
                    bg-color="blue-lighten-5"
                    required
                  ></v-textarea>
                  <v-text-field
                    v-model="textoProcedencia"
                    label="Fuente de Financiamiento"
                    variant="outlined"
                    density="compact"
                    bg-color="grey-lighten-4"
                    readonly
                  ></v-text-field>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.fecha_ejecucion"
                      label="Fecha de ejecucion de actividad"
                      type="date"
                      variant="outlined"
                      density="compact"
                      bg-color="blue-lighten-5"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-file-input
                      v-model="formData.medios_archivos"
                      label="Adjuntar Medios de verificacion"
                      multiple
                      chips
                      show-size
                      :accept="acceptedFormats.medios"
                      prepend-icon="mdi-paperclip"
                    ></v-file-input>
                  </v-col>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 3: Detalle de Gastos -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-cash</v-icon>
                    Detalle de Gastos Solicitados
                  </h3>

                  <v-alert type="info" variant="tonal" class="mb-4">
                    <template v-slot:prepend>
                      <v-icon color="info">mdi-information</v-icon>
                    </template>
                    Agregue todos los gastos asociados a la actividad. Especifique partida,
                    descripción y monto.
                  </v-alert>

                  <div class="d-flex justify-space-between align-center mb-4">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-plus"
                      @click="addGasto"
                    >
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

                <!-- Sección 4: Información Adicional -->
                <div class="form-section mb-6">
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
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 5: Firmas -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-signature</v-icon>
                    Firmas y Validaciones
                  </h3>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formData.idcontador"
                        :items="contadoresList"
                        :item-title="getNombreCompleto"
                        item-value="id"
                        label="Contador"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                      <v-checkbox
                        v-model="formData.validacion_responsable"
                        label="Aprobado por Contador"
                        :disabled="isFrozen"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formData.idcoordinador"
                        :items="coordinadoresList"
                        :item-title="getNombreCompleto"
                        item-value="id"
                        label="Coordinador"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                      <v-checkbox
                        v-model="formData.validacion_coordinador"
                        label="Aprobado por Coordinador o Dirección"
                        :disabled="isFrozen"
                      ></v-checkbox>
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
                    :to="`/pei/listaactividades?showButton=1`"
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
                    Enviar Solicitud
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
  <!-- <pre>{{ formData.correo_coordinador }}</pre>
  {{ '*******************' }} -->
  <!-- <pre>{{ datosFormulario }}</pre> -->
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import { useUserStore } from '@/stores/user'
import * as XLSX from 'xlsx'
import { useRoute, useRouter } from 'vue-router'
import { useNotificaciones } from '@/modules/notificacion/composables/useNotificaciones'

//Inicar Composable
const { enviarMensajeAutomatico } = useNotificaciones()

//Routes
const router = useRouter()
const route = useRoute()
// Convertir a número y validar
const idActividad = route.params.id ? parseInt(route.params.id) : null
const idTarea = route.query.tarea_id ? parseInt(route.query.tarea_id) : null
console.log('ID Actividad:', idActividad)
console.log('ID Tarea:', idTarea)
//console.log('ID aaaaaaa', JSON.stringify(route,null,2))

const baseurl = import.meta.env.VITE_API_BASE

//variables para carga de datos
const datosFormulario = ref(null)
const error = ref(null)
const isLoading = ref(false)

// Estado reactivo
const cargandoGeneral = ref(true)
const loading = ref(false)
const form = ref(null)
const responsablesList = ref([])
const contadoresList = ref([])
const coordinadoresList = ref([])
const acceptedFormats = ref({
  medios: '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx',
})

const formData = ref({
  // Campos del usuario (se llenarán automáticamente)
  nombre: '',
  paterno: '',
  materno: '',
  cargo: '',
  documento_identidad: '',
  // Campos de la actividad
  descripcion_actividad: '',
  objetivo_actividad: '',
  fecha_irealizacion: '',
  fecha_frealizacion: '',
  fecha_ejecucion: '',
  fuente_financiamiento: '',
  id_actividad: 0,
  id_tarea: 0,
  id_usuario: 0,
  // Resto de campos del formulario
  detalle_destino_fondos: [{ partida: '', descripcion_gasto: '', monto: 0 }],
  monto_solicitado: 0,
  lugar_solicitud: '',
  fecha_solicitud: getCurrentDate(),
  // Campos de forma de pago
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

  validacion_contador: false,
  idcontador: null,
  validacion_coordinador: false,
  idcoordinador: null,
  correo_coordinador: '',
  correo_contador: '',
  codigo_actividad: '',
  medios_archivos: [],
})

//datos para abrir Solicitud de Fondos
const idSolicitudFondos = ref(null)
const numeroFormularioSF = ref(null)
// Nuevo estado para controlar el bloqueo

const userStore = useUserStore()
const usuario = computed(() => {
  return {
    nombre: userStore.usuario,
    role: userStore.rol,
    id: userStore.id,
  }
})
console.log('ID Usuario:', JSON.stringify(usuario.value.id, null, 2)) //.value.id)

const textoProcedencia = computed(() => {
  const fuentes = Array.isArray(formData.value?.fuente_financiamiento)
    ? formData.value.fuente_financiamiento
    : []

  return fuentes.map(({ nombre = '', monto = 0 } = {}) => `${nombre} : Bs. ${monto}`).join(', ')
})

const actividadData = ref({
  codigo: 'ACT-2023-005',
  descripcion: 'Capacitación en gestión de proyectos para equipos técnicos',
  estado: 'EJEC',
  tipo: [{ nombre: 'Actividad de Capacitación' }, { nombre: 'Actividad de Articulación' }],
  fecha_programada: '2023-05-15',
  fecha_cierre: '2023-06-30',
  responsable: { nombre: 'María González' },
  presupuesto: 2500,
})

// // Logica para formas de pago (solo debe haber tres formas de Pago: otros, Cheque, Transferencia)
const formasPagoOptions = computed(() => {
  if (datosFormulario.value && datosFormulario.value.formaPago) {
    return datosFormulario.value.formaPago
  }
  return []
})
const formaPagoElegido = computed(() => {
  if (formData.value.forma_pago && formasPagoOptions.value.length > 0) {
    const formaPago = formasPagoOptions.value.find((fp) => fp.id === formData.value.forma_pago)
    // return formaPago ? formaPago.formaPago.toLowerCase() : ''
    return formaPago ? formaPago.formaPago : ''
  }
  return ''
})
const MostrarCamposOtros = computed(() => {
  const formaPagoTexto = formaPagoElegido.value
  //  return formaPagoElegido.value !== 'Transferaencia Bancaria'
  return formaPagoTexto === 'Efectivo' || formaPagoTexto === 'Cheque'
})
const MostrarCamposTransferencia = computed(() => {
  const formaPagoTexto = formaPagoElegido.value
  //return formaPagoElegido.value === 'Transferencia Bancaria'
  return formaPagoTexto === 'Transferencia Bancaria'
})

// Propiedades computadas
const nombreCoordinadorElegido = computed(() => {
  const coordinador = coordinadoresList.value.find(
    (user) => user.id === formData.value.idcoordinador,
  )
  return coordinador ? getNombreCompleto(coordinador) : ''
})

const nombreContadorElegido = computed(() => {
  const contador = contadoresList.value.find((user) => user.id === formData.value.idcontador)
  return contador ? getNombreCompleto(contador) : ''
})

const totalMontoSolicitado = computed(() => {
  return formData.value.detalle_destino_fondos.reduce(
    (total, gasto) => total + Number(gasto.monto || 0),
    0,
  )
})

const nombreCompletoSolicitante = computed(() => {
  return `${formData.value.nombre} ${formData.value.paterno} ${formData.value.materno}`.trim()
})

const isFrozen = computed(() => {
  return true
})

// WATCH PARA AUTO-LLENAR FORMULARIO CUANDO LLEGUEN LOS DATOS
watch(
  datosFormulario,
  (newVal) => {
    if (newVal && newVal.usuario) {
      //console.log('Auto-llenando formulario con datos del usuario:', newVal.usuario)
      // const solicitanteSeleccionado = coordinadoresList.value.find(
      //   (solicitante) => coordinador.id === newIdCoordinador,
      // )

      const usuario = newVal.usuario


      // Función helper para manejar valores null/undefined
      const getSafeValue = (value, defaultValue = '') => {
        return value !== null && value !== undefined ? value : defaultValue
      }

      // Llenar campos del usuario
      formData.value.nombre = getSafeValue(usuario.nombre)
      formData.value.paterno = getSafeValue(usuario.paterno)
      formData.value.materno = getSafeValue(usuario.materno)
      formData.value.cargo = getSafeValue(usuario.cargo)
      formData.value.documento_identidad = getSafeValue(usuario.ci)
      formData.value.id_usuario = getSafeValue(usuario.id, 0)

      // Llenar campos de la actividad si existen
      if (newVal.actividad) {
        //console.log('Auto-llenando datos de actividad:', newVal.actividad)

        formData.value.descripcion_actividad = getSafeValue(newVal.actividad.descripcion)
        formData.value.objetivo_actividad = getSafeValue(newVal.actividad.objetivo_de_actividad)
        formData.value.fecha_irealizacion = getSafeValue(newVal.actividad.fecha_inicio)
        formData.value.fecha_frealizacion = getSafeValue(newVal.actividad.fecha_cierre)
        formData.value.id_actividad = getSafeValue(newVal.actividad.id, 0)
        formData.value.codigo_actividad = getSafeValue(newVal.actividad.codigo)
        // Asignar id_tarea desde los parámetros de la ruta si existe
        formData.value.id_tarea = idTarea || 0
        formData.value.fuente_financiamiento = getSafeValue(newVal.actividad.procedencia_fondos)

        if (newVal.formaPago && Array.isArray(newVal.formaPago)) {
          //console.log('Formas de pago disponibles:', newVal.formaPago)
        }

        // También actualizar actividadData para el componente ActividadInformacion
        actividadData.value = {
          ...actividadData.value,
          descripcion: getSafeValue(newVal.actividad.descripcion, actividadData.value.descripcion),
          fecha_programada: getSafeValue(
            newVal.actividad.fecha_inicio,
            actividadData.value.fecha_programada,
          ),
          fecha_cierre: getSafeValue(
            newVal.actividad.fecha_cierre,
            actividadData.value.fecha_cierre,
          ),
        }
      }

      // Llenar lista de validadores si existen
      if (newVal.validadores && Array.isArray(newVal.validadores)) {
        //console.log('Cargando validadores:', newVal.validadores)
        responsablesList.value =
          newVal.validadores.filter((user) => user && user.cargo === 'responsable') || []
        contadoresList.value =
          newVal.validadores.filter((user) => user && user.cargo === 'contable') || []
        coordinadoresList.value =
          newVal.validadores.filter((user) => user && user.cargo === 'coordinador') || []
      } else {
        responsablesList.value = []
        contadoresList.value = []
        coordinadoresList.value = []
      }
    }
  },
  { deep: true },
)

// WATCH PARA GUARDAR EL CORREO DEL COORDINADOR Y DEL CONTADOR CUANDO SE SELECCIONA
watch(
  () => formData.value.idcoordinador,
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
)

// borra los campos no seleccionados en "forma de pago"
// ejemplo, si seleccionas "otros", se borran los campos "transferencia_bancaria"
watch(
  () => formData.value.forma_pago,
  (newVal, oldVal) => {
    if (newVal === oldVal) return; // No hacer nada si no cambió

    // Obtener el nombre de la forma de pago seleccionada
    const formaPagoSeleccionada = formasPagoOptions.value.find(fp => fp.id === newVal);
    const nombreFormaPago = formaPagoSeleccionada ? formaPagoSeleccionada.formaPago : '';

    // Resetear campos según la opción seleccionada
    if (nombreFormaPago === 'Transferencia Bancaria') {
      // Si seleccionó Transferencia, resetear campos de Otros
      formData.value.datos_forma_pago.otros = {
        nombre_otros: '',
        ci_otros: ''
      };
    } else {
      // Si seleccionó cualquier otra opción, resetear campos de Transferencia
      formData.value.datos_forma_pago.transferencia = {
        nombre_transferencia: '',
        ci_transferencia: '',
        entidad_bancaria: '',
        tipo_cuenta: '',
        numero_cuenta: ''
      };
    }
  }
);

watch(
  () => formData.value.idcontador,
  (newIdContador) => {
    if (newIdContador && contadoresList.value.length > 0) {
      const contadorSeleccionado = contadoresList.value.find(
        (contador) => contador.id === newIdContador,
      )

      if (contadorSeleccionado && contadorSeleccionado.correo) {
        formData.value.correo_contador = contadorSeleccionado.correo
      } else {
        formData.value.correo_contador = ''
      }
    } else {
      formData.value.correo_contador = ''
    }
  },
)

// Métodos
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
// ********************************* */
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
    //console.log('Respuesta de la API recibida:', idActividad, usuario.value.nombre)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    datosFormulario.value = strictSanitizeData(rawData)
    //console.log('Datos cargados exitosamente:', rawData)
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}


function sanitizeData(data) {
  if (data === null || data === undefined) {
    return ''
  }

  if (typeof data === 'string') {
    // Limpiar strings: trim y convertir empty strings a ''
    const trimmed = data.trim()
    return trimmed === '' ? '' : trimmed
  }

  if (typeof data === 'number') {
    // Validar que sea un número finito
    return isFinite(data) ? data : 0
  }

  if (typeof data === 'boolean') {
    return data
  }

  if (Array.isArray(data)) {
    // Sanitizar cada elemento del array
    return data
      .map((item) => sanitizeData(item))
      .filter((item) => item !== null && item !== undefined && item !== '')
  }

  if (typeof data === 'object') {
    const sanitized = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key]
        // Solo incluir propiedades con valores válidos
        if (value !== null && value !== undefined && value !== '') {
          sanitized[key] = sanitizeData(value)
        }
      }
    }
    return sanitized
  }

  // Para cualquier otro tipo de dato, retornar string vacío
  return ''
}

function strictSanitizeData(data) {
  const sanitized = sanitizeData(data)

  // Si el resultado es un objeto vacío, retornar string vacío
  if (typeof sanitized === 'object' && !Array.isArray(sanitized)) {
    if (Object.keys(sanitized).length === 0) {
      return ''
    }
  }

  return sanitized
}

function addGasto() {
  //esta funcion adiciona una fila de detalle de gasto al vista
  formData.value.detalle_destino_fondos.push({ partida: '', descripcion_gasto: '', monto: 0 })
}

function removeGasto(index) {
  if (formData.value.detalle_destino_fondos.length > 1) {
    formData.value.detalle_destino_fondos.splice(index, 1)
  }
}

async function submitForm() {
  loading.value = true
  try {
    // Validar que id_actividad siempre sea válido
    if (!formData.value.id_actividad || formData.value.id_actividad <= 0) {
      throw new Error('Error: No se puede crear el formulario sin una actividad válida.')
    }

    // Validar que id_tarea sea válido cuando se está creando una solicitud para una tarea
    if (idTarea && (!formData.value.id_tarea || formData.value.id_tarea <= 0)) {
      throw new Error('Error: No se puede crear el formulario sin una tarea válida.')
    }

    //Validar si el formulario está completo
    if (
      !formData.value.lugar_solicitud ||
      !formData.value.forma_pago ||
      !formData.value.idcoordinador
    ) {
      throw new Error('Por favor, completa todos los campos obligatorios del formulario.')
    }
    if (totalMontoSolicitado.value <= 0) {
      throw new Error('El monto total solicitado debe ser mayor a cero.')
    }

    // OBTENER LOS CORREOS ACTUALES ANTES DE ENVIAR
    const coordinadorSeleccionado = coordinadoresList.value.find(
     (coordinador) => coordinador.id === formData.value.idcoordinador
    )
    const contadorSeleccionado = contadoresList.value.find(
     (contador) => contador.id === formData.value.idcontador
    )

    const correoCoordinadorActual = coordinadorSeleccionado?.correo || ''
    const correoContadorActual = contadorSeleccionado?.correo || ''

    // Actualizar los valores en formData
    formData.value.correo_coordinador = correoCoordinadorActual
    formData.value.correo_contador = correoContadorActual

    const payload = {
      // detalle_destino_fondos should be an object, not a stringified JSON
      detalle_destino_fondos: {
        items: formData.value.detalle_destino_fondos.map((gasto) => ({
          partida_sf: gasto.partida, // Changed from 'partida' to 'partida_sf'
          concepto: gasto.descripcion_gasto,
          monto: Number(gasto.monto),
        })),
      },
      forma_pago: formData.value.forma_pago,
      lugar_solicitud: formData.value.lugar_solicitud,
      fecha_solicitud: formData.value.fecha_solicitud,
      fecha_realizacion_actividad: formData.value.fecha_ejecucion,
      monto_solicitado: totalMontoSolicitado.value,
      validacion_responsable: formData.value.validacion_contador,
      contador_id: formData.value.idcontador,
      validacion_coordinador: formData.value.validacion_coordinador,
      id_coordinador: formData.value.idcoordinador,
      id_usuario: formData.value.id_usuario,
      id_actividad: formData.value.id_actividad,
      descripcion_actividad: formData.value.descripcion_actividad,
      objetivo_actividad: formData.value.objetivo_actividad,
      // Solo incluir id_tarea si tiene un valor válido (cuando es una solicitud para tarea)
      ...(formData.value.id_tarea && formData.value.id_tarea > 0 && { id_tarea: formData.value.id_tarea }),
      datos_forma_pago: formData.value.datos_forma_pago,
      bloquear_icono_sf: true,
      //codigo_actividad: formData.value.codigo_actividad,
    }

    console.log('Payload enviado al servidor:', JSON.stringify(payload, null, 2))
    const response = await fetch(baseurl + 'api/monitoreo/crear-solicitud-fondos/', {
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
    idSolicitudFondos.value = data.id
    numeroFormularioSF.value = data.numero_formulario

    //const urlForm = `${baseurl}/api/monitoreo/formulario011/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`
    const urlForm = `${window.location.origin}/monitoreo/formulario011/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`;
    const cuerpoMensaje = {
      destinatario_id: payload.id_coordinador,
      asunto: 'Solicitud de Fondos - Coordinado',
      contenido: 'Solicitud de Fondos pediente del formulario ' + numeroFormularioSF.value + '. URL: ' + urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }
    await enviarMensajeAutomatico(cuerpoMensaje)

    const cuerpoMensaje2 = {
      destinatario_id: payload.contador_id,
      asunto: 'Solicitud de Fondos - Contador',
      contenido: 'Solicitud de Fondos pediente del formulario ' + numeroFormularioSF.value + '. URL: ' + urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }

    exportToExcel()
    resetForm()

    await enviarMensajeAutomatico(cuerpoMensaje2)

    ///////// Enviar notificación por correo al coordinador y al contador//////////
    try {
      const emailPayload = {
        emails: [correoCoordinadorActual, correoContadorActual].filter(email => email),
        datos_solicitud: {
          codigo: numeroFormularioSF.value || 'SOL-PROV',
          titulo: 'Formulario Sol. Fondos',
          solicitante: nombreCompletoSolicitante.value,
          tipo: 'Solicitud de Actividad',
          prioridad: 'alta',
          descripcion: formData.value.descripcion_actividad || 'Solicitud de fondos para actividad',
          url_revision: `${window.location.origin}/monitoreo/formulario011/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`,
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
    ///////////////////////////////////////////////////////////////////////////////

    console.log('Respuesta del servidor:',  JSON.stringify(data, null, 2))
    // console.log('Respuesta del servidor:',  JSON.stringify(formData.value.correo_coordinador, null, 2))
    // console.log('Respuesta del servidor:',  JSON.stringify(formData.value.correo_contador, null, 2))
    setTimeout(() => {
      router.push('/pei/listaactividades?showButton=1')
    }, 1000)

    return data
  } catch (error) {
    console.error('Error completo:', error.response?.data || error.message)
    alert(`Error: ${error.response?.data?.mensaje || error.message}`)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(formData.value, {
    descripcion_actividad: '',
    objetivo_actividad: '',
    detalle_destino_fondos: [{ partida: '', descripcion_gasto: '', monto: 0 }],
    forma_pago: '',
    lugar_solicitud: '',
    fecha_solicitud: getCurrentDate(),
    monto_solicitado: 0,
    validacion_responsable: false,
    idcontador: null,
    validacion_coordinador: false,
    idcoordinador: null,
  })
}

function exportToExcel() {
  // 1. Crear datos principales con formato de formulario
  const mainData = [
    ['FORMULARIO F-01: SOLICITUD DE FONDOS EN AVANCE CON CARGO A RENDICIÓN DE CUENTA', '', '', ''],
    [''],
    ['FORMULARIO Nro:', numeroFormularioSF.value, '', ''],
    ['INFORMACIÓN DEL RESPONSABLE', '', '', ''],
    ['Nombre Completo:', nombreCompletoSolicitante.value, '', ''],
    ['Documento de Identidad:', formData.value.documento_identidad, '', ''],
    ['Cargo:', formData.value.cargo, '', ''],
    [''],
    ['INFORMACIÓN DE LA ACTIVIDAD', '', '', ''],
    ['Descripción:', formData.value.descripcion_actividad, '', ''],
    [
      'Fecha Inicio:',
      formData.value.fecha_irealizacion,
      'Fecha Fin:',
      formData.value.fecha_frealizacion,
    ],
    ['Objetivo:', formData.value.objetivo_actividad, '', ''],
    ['Fuente de Financiamiento:', formData.value.fuente_financiamiento, '', ''],
    [''],
    ['INFORMACIÓN DE LA SOLICITUD', '', '', ''],
    ['Forma de Pago:', formaPagoElegido.value, '', ''],
    ['Lugar de Solicitud:', formData.value.lugar_solicitud, '', ''],
    ['Fecha de Solicitud:', getCurrentDate1(), '', ''],
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
      'Contador:',
      nombreContadorElegido.value,
      'Aprobado:',
      formData.value.validacion_contador ? '✓' : '✗',
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

  // 2. Encabezados de la tabla de gastos
  const expensesHeaders = ['PARTIDA', 'DESCRIPCIÓN DEL GASTO', 'MONTO (BS.)', 'OBSERVACIONES']

  // 3. Datos de gastos
  const expensesData = formData.value.detalle_destino_fondos.map((gasto) => [
    gasto.partida,
    gasto.descripcion_gasto,
    gasto.monto,
    '',
  ])

  // 4. Total al final de la tabla
  const totalRow = ['TOTAL', '', totalMontoSolicitado.value, '']

  // 5. Crear workbook
  const wb = XLSX.utils.book_new()

  // 6. Hoja principal con formato de formulario
  const wsMain = XLSX.utils.aoa_to_sheet([...mainData, expensesHeaders, ...expensesData, totalRow])

  // 7. Aplicar estilos y formatos
  applyExcelStyles(
    wsMain,
    mainData.length,
    expensesData.length,
    formData.value.descripcion_actividad,
    formData.value.objetivo_actividad,
  )

  // 8. Agregar hoja al workbook y guardar
  XLSX.utils.book_append_sheet(wb, wsMain, 'Solicitud de Fondos')
  //XLSX.writeFile(wb, `Solicitud_Fondos_F-01_${getCurrentDate1()}.xlsx`)
  try {
    // Crear el blob
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

    // Crear URL del blob
    const url = window.URL.createObjectURL(blob)

    // Crear enlace de descarga
    const a = document.createElement('a')
    a.href = url
    a.download = `Solicitud_Fondos_F-01_${getCurrentDate1()}.xlsx`
    document.body.appendChild(a)
    a.click()

    // Limpiar después de la descarga
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }, 100)
  } catch (error) {
    console.error('Error al generar Excel:', error)
    // Fallback: usar el método antiguo
    XLSX.writeFile(wb, `Solicitud_Fondos_F-01_${getCurrentDate1()}.xlsx`)
  }
}

function applyExcelStyles(
  worksheet,
  mainDataRows,
  expensesRows,
  descripcionActividad,
  objetivoActividad,
) {
  if (!worksheet['!merges']) worksheet['!merges'] = []

  // Fusionar celdas para títulos y secciones
  worksheet['!merges'].push(
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
    { s: { r: 7, c: 0 }, e: { r: 7, c: 3 } },
    { s: { r: 12, c: 0 }, e: { r: 12, c: 3 } },
    { s: { r: 18, c: 0 }, e: { r: 18, c: 3 } },
    { s: { r: 21 + mainDataRows, c: 0 }, e: { r: 21 + mainDataRows, c: 3 } },
  )

  // Configurar anchos de columnas
  worksheet['!cols'] = [{ wch: 30 }, { wch: 40 }, { wch: 20 }, { wch: 25 }]

  // Aplicar formatos a celdas específicas
  Object.keys(worksheet).forEach((cellAddress) => {
    if (cellAddress !== '!ref' && cellAddress !== '!merges' && cellAddress !== '!cols') {
      const cell = worksheet[cellAddress]
      const cellRef = XLSX.utils.decode_cell(cellAddress)

      // Estilo para títulos y encabezados de sección
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
      }

      // Estilo para etiquetas
      else if (cellRef.c === 0 && cellRef.r > 0 && cellRef.r < 21 + mainDataRows) {
        cell.s = {
          font: { bold: true, color: { rgb: '000000' } },
          fill: { fgColor: { rgb: 'D9E1F2' } },
        }
      }

      // Estilo para encabezados de tabla
      else if (cellRef.r === 22 + mainDataRows) {
        cell.s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '5B9BD5' } },
          alignment: { horizontal: 'center' },
        }
      }

      // Estilo para la fila total
      else if (cellRef.r === 23 + mainDataRows + expensesRows) {
        cell.s = {
          font: { bold: true },
          fill: { fgColor: { rgb: 'F2F2F2' } },
        }
      }

      // Formato de moneda para columna de montos (columna C)
      else if (
        cellRef.c === 2 &&
        cellRef.r >= 23 + mainDataRows &&
        cellRef.r <= 22 + mainDataRows + expensesRows
      ) {
        cell.z = '"Bs." #,##0.00'
      }

      // Formato de fecha para celdas de fecha
      else if (
        (cell.v && typeof cell.v === 'string' && cell.v.match(/\d{4}-\d{2}-\d{2}/)) ||
        (cellRef.c === 2 && cellRef.r === 9)
      ) {
        cell.z = 'dd/mm/yyyy'
      }

      // Estilo específico para la celda de descripción de actividad (B9)
      if (cellRef.r === 8 && cellRef.c === 1) {
        if (!cell.s) cell.s = {}
        cell.s.alignment = cell.s.alignment || {}
        cell.s.alignment.wrapText = true
        cell.s.alignment.vertical = 'top'
      }

      // Estilo específico para la celda de objetivo de actividad (B11)
      if (cellRef.r === 10 && cellRef.c === 1) {
        if (!cell.s) cell.s = {}
        cell.s.alignment = cell.s.alignment || {}
        cell.s.alignment.wrapText = true
        cell.s.alignment.vertical = 'top'
      }
    }
  })

  // Agregar bordes a la tabla de gastos
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

  // Ajustar altura de filas para las celdas con texto largo
  if (!worksheet['!rows']) worksheet['!rows'] = []

  // Ajustar altura de la fila de descripción (fila 9)
  if (descripcionActividad && descripcionActividad.length > 100) {
    worksheet['!rows'][8] = { hpt: 60 }
  }

  // Ajustar altura de la fila de objetivo (fila 11)
  if (objetivoActividad && objetivoActividad.length > 100) {
    worksheet['!rows'][10] = { hpt: 60 }
  }
}

function getCurrentDate1() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${day}/${month}/${year}`
}

// Ciclo de vida
onMounted(async () => {
  await cargarDatos()
  await textoProcedencia.value
  resetForm()
})
</script>

<style scoped>
.solicitud-fondos-container {
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

.info-item {
  padding: 8px 0;
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

/* Ajustes responsivos */
@media (max-width: 960px) {
  .solicitud-fondos-container {
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
</style>
