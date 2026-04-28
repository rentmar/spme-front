<template>
  <v-container class="v-container v-locale--is-ltr">
    <v-card id="formulario-pdf" class="pa-6">
      <PaginaTituloIcono
        :titulo="'Solicitud de Viaje'"
        :icon="'mdi-file-document-multiple'"
      ></PaginaTituloIcono>
      <br />
      <ProyectoIdHeader
        v-if="datosFormulario"
        :proyecto-id="datosFormulario.actividad?.proyecto"
      ></ProyectoIdHeader>

      <br />
      <ActividadInformacion v-if="idActividad" :actividad-id="idActividad"></ActividadInformacion>
      <br />

      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <div class="form-section">
            <v-text-field
              v-model="formData.evento"
              label="Nombre del Seminario, curso, taller o reunión"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.fecha_evento"
                  label="Fecha de Evento"
                  bg-color="blue-lighten-5"
                  type="date"
                  required
                  :max="formData.fecha_fin"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6"> </v-col>
            </v-row>

            <v-text-field
              v-model="formData.lugar_evento"
              label="Lugar de realización"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.instituciones_participantes"
              label="Organizaciones Participantes"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.institucion_queinvita"
              label="Institución que invita"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.quien_cubregastos"
              label="Quien cubre los gastos de estadía, transporte y viáticos"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.fondos_unitas"
              label="Fondos UNITAS"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>

            <v-text-field
              v-model="solicitante"
              label="Persona que presenta la solicitud"
              readonly
            ></v-text-field>

            <v-textarea
              v-model="formData.justificacion_asistencia"
              label="Justificación de la importancia de asistir al evento y su relación con el trabajo que desarrolla"
              bg-color="blue-lighten-5"
              rows="3"
              required
            ></v-textarea>

            <v-textarea
              v-model="formData.tareas_previas"
              label="Tareas previas que debe cumplir para asistir al evento"
              bg-color="blue-lighten-5"
              rows="3"
              required
            ></v-textarea>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="form-section">
            <h3 class="mb-4">Detalle del Destino de Fondos</h3>
            <div class="d-flex justify-space-between align-center mb-4">
              <v-btn
                variant="flat"
                class="text-grey-darken-3 bg-white"
                rounded="lg"
                :elevation="3"
                @click="addGasto"
              >
                Agregar Gasto
              </v-btn>
              <v-chip class="text-subtitle-1" color="grey-darken-2" variant="outlined">
                Monto Total Solicitado (Bs.): {{ totalMontoSolicitado }}
              </v-chip>
            </div>
            <v-table>
              <thead>
                <tr>
                  <th>Partida</th>
                  <th>Fuente</th>
                  <th>Descripción del Gasto</th>
                  <th>Monto (Bs.)</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(gasto, index) in formData.detalle_destino_fondos" :key="index">
                  <td>
                    <v-text-field
                      v-model="gasto.partida"
                      variant="outlined"
                      density="compact"
                      hide-details
                      bg-color="blue-lighten-5"
                      placeholder="Partida"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.fuente"
                      variant="outlined"
                      density="compact"
                      hide-details
                      bg-color="blue-lighten-5"
                      placeholder="Financiador"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.descripcion_gasto"
                      variant="outlined"
                      bg-color="blue-lighten-5"
                      hide-details
                      density="compact"
                      placeholder="Descripcion de gasto"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.monto"
                      variant="outlined"
                      bg-color="blue-lighten-5"
                      type="number"
                      hide-details
                      density="compact"
                      min="0"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-btn variant="text" icon color="error" @click="removeGasto(index)">
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
            <!-- <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                    Información Adicional
                  </h3> -->

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.lugar_solicitud"
                  label="Lugar de la Solicitud"
                  variant="outlined"
                  bg-color="blue-lighten-5"
                  required
                ></v-text-field>
                <!-- <v-select
                        v-model="formData.forma_pago"
                        :items="formasPagoOptions"
                        item-title="formaPago"
                        item-value="id"
                        label="Forma de Pago"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        required
                      ></v-select> -->
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
            <!-- <div v-if="MostrarCamposCheque">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.datos_forma_pago.cheque.nombre_cheque"
                          label="Nombre a quien se realiza el cheque"
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :required="MostrarCamposCheque"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.datos_forma_pago.cheque.ci_cheque"
                          label="Documento de Identidad C.I."
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :required="MostrarCamposCheque"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div> -->
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

          <!-- <v-select
            v-model="formData.forma_pago"
            :items="formasPago"
            item-title="formaPago"
            item-value="id"
            label="Forma de Pago"
            variant="outlined"
            bg-color="blue-lighten-5"
            required
          ></v-select> -->

          <!-- <div class="form-section">
            <v-text-field
              v-model="formData.lugar_solicitud"
              bg-color="blue-lighten-5"
              label="Lugar de la Solicitud"
              required
            ></v-text-field>
            <v-text-field
              v-model="formData.fecha_solicitud"
              label="Fecha de la Solicitud"
              type="date"
              required
              readonly
            ></v-text-field>
          </div> -->

          <v-divider class="my-4"></v-divider>

          <div class="form-section">
            <div class="text-subtitle-1 font-weight-bold mb-2">Firmas</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.id_responsable"
                  :items="responsablesList"
                  :item-title="getNombreCompleto"
                  item-value="id"
                  label="Responsable Coordinación"
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
                  bg-color="blue-lighten-5"
                  :items="coordinadoresList"
                  :item-title="getNombreCompleto"
                  item-value="id"
                  label="Responsable Dirección Administrativa"
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
          </div>

          <div class="d-flex justify-end mt-4">
            <v-btn
              color="error"
              class="mr-2"
              prepend-icon="mdi-backspace-outline"
              @click="resetForm"
            >
              Limpiar
            </v-btn>
            <v-btn
              color="primary"
              prepend-icon="mdi-file-document-arrow-right"
              type="submit"
              :loading="loading"
            >
              Enviar Solicitud
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
  <!-- <pre>{{ formData.correo_contador }}</pre>
  {{ '*******************' }}
  <pre>{{ formData.correo_coordinador }}</pre>
  {{ '*******************' }}
  <pre>{{ coordinadoresList }}</pre>
  {{ '*******************' }}
  <pre>{{ responsablesList }}</pre> -->
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'

import axios from 'axios'
import { useUserStore } from '@/stores/user'
import * as XLSX from 'xlsx'
import { useRoute, useRouter } from 'vue-router'
import { useNotificaciones } from '@/modules/notificacion/composables/useNotificaciones'

//Inicar Composable
const { enviarMensajeAutomatico } = useNotificaciones()

//Routes
const router = useRouter()
const route = useRoute()
const idActividad = route.params.id || null
const idTarea = route.query.tarea_id || null
console.log('ID Actividad:', idActividad)
console.log('ID Tarea:', idTarea)

// const userStore = useUserStore()
// const usuario = computed(() => {
//   return {
//     nombre: userStore.usuario,
//     role: userStore.rol,
//     id: userStore.userId,
//   }
// })
// console.log('ID Usuario:', usuario.value.id)

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
  //validacion_contador: false,
  //id_contador: null,
  validacion_coordinador: false,
  id_coordinador: null,
  correo_coordinador: '',
  correo_contador: '',
  //codigo_actividad: '',
  //medios_archivos: [],
})

const numeroFormularioSF = ref(null)
// // // Logica para formas de pago (solo debe haber tres formas de Pago: otros, Cheque, Transferencia)
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
  //  return formaPagoElegido.value !== 'Transferaencia Bancaria'
  return formaPagoTexto === 'Efectivo' || formaPagoTexto === 'Cheque'
})
const MostrarCamposTransferencia = computed(() => {
  const formaPagoTexto = formaPagoElegido.value
  //return formaPagoElegido.value === 'Transferencia Bancaria'
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
  return `${formData.value.nombre} ${formData.value.paterno} ${formData.value.materno}`.trim()
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
        //correo_coordinador.value = coordinadorSeleccionado.correo
      } else {
        formData.value.correo_coordinador = ''
        //correo_coordinador.value = ''
      }
    } else {
      formData.value.correo_coordinador = ''
      //correo_coordinador.value = ''
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
  //se carga unicamente para la etiqueta proyectos
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
    //console.log('Respuesta de la solicitud:', idActividad, usuario)
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }
    const data = await response.json()
    datosFormulario.value = data
    //console.log('Datos cargados exitosamente:', datosFormulario.value)
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
    formasPago.value = data.formasPago // Asignar directamente el array
    //console.log('Formas de pago cargadas:', formasPago.value)
  } catch (err) {
    console.error('Error:', err)
  }
}

watch(
  datosFormulario,
  (newVal) => {
    if (newVal && newVal.usuario) {
      datosSolicitante.value = newVal.usuario
      //console.log('hhhhhhhhhhhh:', JSON.stringify(datosSolicitante.value, null, 2))
      if (datosSolicitante.value) {
        solicitante.value = getNombreCompleto(datosSolicitante.value)
      }
    } else {
      datosSolicitante.value = []
    }
  },
  { deep: true }, // Si necesitas observar cambios profundos
)

async function cargarUsuarios() {
  try {
    const response = await axios.get(baseurl + 'autenticacion_api/listaUsuarios/')
    const allUsers = response.data.usuarios
    console.log('Usuarios obtenidos:', allUsers)
    responsablesList.value = allUsers.filter((user) => user.cargo === 'coordinador' && user.es_activo === true) //'contador')
    coordinadoresList.value = allUsers.filter((user) => user.cargo === 'dir-administrativo')  //'coordinador')
    if (datosSolicitante.value) {
      solicitante.value = getNombreCompleto(datosSolicitante.value)
    }
    //console.log('responsables', responsablesList.value)
    //console.log('coordinadores', coordinadoresList.value)
  } catch (error) {
    console.error('Error al cargar la lista de usuarios:', error)
    alert('No se pudieron cargar los usuarios para las firmas. Por favor recargue la página.')
  }
}

function addGasto() {
  formData.value.detalle_destino_fondos.push({ partida: '', fuente: '', descripcion_gasto: '', monto: 0 })
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
      //'id_responsable',
      //'id_coordinador',
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
      ...formData.value, //esta linea incluye todas las propiedades de formData
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

    // const response = await axios.post(baseurl + '/monitoreo_api/crearSolicitudViaje/', payload, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    // numeroFormulario.value = response.numero_formulario;
    // alert('Solicitud enviada con éxito');
    // exportToExcel();
    // resetForm();

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
    //idSolicitudFondos.value = data.id
    numeroFormularioSF.value = data.numero_formulario

    const urlForm = `${window.location.origin}/monitoreo/formulario055/${idActividad}?solicitud_id=${data.id}${idTarea ? `&tarea_id=${idTarea}` : ''}`;
    const cuerpoMensaje = {
      destinatario_id: payload.id_coordinador,
      asunto: 'Solicitud de Viaje',
      contenido: 'Solicitud de Viaje pediente del formulario ' + numeroFormularioSF.value + '. URL: ' + urlForm,
      tipo: 'sistema',
      prioridad: 3,
      // accion_url: '',
      // accion_texto: '',
    }
    await enviarMensajeAutomatico(cuerpoMensaje)

    const cuerpoMensaje2 = {
      destinatario_id: payload.id_responsable,
      asunto: 'Solicitud de Viaje',
      contenido: 'Solicitud de Viaje pediente del formulario ' + numeroFormularioSF.value + '. URL: ' + urlForm,
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
      // No detenemos el flujo si falla el envío del correo
    }

    ///////////////////////////////////////////////////////////////////////////////

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
  // 1. Crear datos principales con formato de formulario
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
    //  ['Forma de Pago:', formaPagoElegido.value, '', ''],
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

onMounted(async () => {
  await Promise.all([cargarUsuarios(), cargarDatos(), cargarFormasDePago()])
})
</script>

<style scoped>
.v-card {
  max-width: 900px;
  margin: 0 auto;
}
</style>
