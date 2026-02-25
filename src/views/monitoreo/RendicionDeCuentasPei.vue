<template>
  <div class="v-container v-locale--is-ltr">
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
        <p class="mt-4 text-h6">Cargando formulario de rendicion...</p>
      </div>
    </v-overlay>

    <div v-if="!cargandoGeneral">
      <PaginaTituloIcono
        :titulo="'Rendición de Cuentas PEI'"
        :icon="'mdi-file-document-check'"
      ></PaginaTituloIcono>
      <!-- <ProyectoIdHeader
        v-if="datosFormulario"
        :proyecto-id="datosFormulario.actividad?.proyecto ?? '999999'"
      ></ProyectoIdHeader>
      <br /> -->
      <!-- <ActividadInformacion v-if="datosFormulario.actividad" :actividad-id="idActividad" /> -->
      <ActividadPeiInformacion
        v-if="datosFormulario.actividad"
        :actividadPeiId="idActividad"
      ></ActividadPeiInformacion>

      <br />
      <!-- <v-form ref="form" v-model="valid" lazy-validation>
        </v-form> -->
    </div>
    <div v-else>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div class="v-card v-theme--light v-card--density-default v-card--variant-elevated pa-6">
      <div class="v-card-title text-h5 font-weight-bold">Formulario F-02:</div>

      <div class="v-card-text">
        <form class="v-form" novalidate @submit.prevent="submitForm">
          <div class="form-section">
            <v-divider class="my-4"></v-divider>

            <v-card-subtitle class="text-h6">Responsable del Cargo de Cuenta</v-card-subtitle>
            <br />
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.nombre"
                  label="Nombre"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.paterno"
                  label="Apellido paterno"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.materno"
                  label="Apellido materno"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.documento_identidad"
                  label="Documento de Identidad"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.cargo"
                  label="Cargo"
                  required
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <v-card-subtitle class="text-h6">Cargo de Cuenta</v-card-subtitle>

            <v-row>
              <!-- <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-if="datosFormulario1"
                    v-model="datosFormulario1.numeroFormulario"
                    label="Formulario Número"
                    readonly
                  ></v-text-field>
                </v-col> -->

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formData.cpte_diario"
                  label="Cpte. Diario"
                  bg-color="blue-lighten-5"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formData.fecha_desembolso"
                  label="Fecha de Desembolso"
                  bg-color="blue-lighten-5"
                  type="date"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.descripcion_actividad"
                  label="Descripción de la Actividad que se realizo"
                  bg-color="blue-lighten-5"
                  rows="3"
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.fuente_financiamiento"
                  label="Fuente de Financiamiento"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formData.lugar_actividad"
                  label="Lugar donde se realizo la Actividad"
                  bg-color="blue-lighten-5"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formData.fecha_actividad"
                  label="Fecha de la realización de Actividad"
                  bg-color="blue-lighten-5"
                  type="date"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formData.monto_asignado"
                  label="Monto Asignado (Bs.)"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formData.monto_gastado"
                  label="Monto Descargado (Bs.)"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="saldoPorReembolsar"
                  label="Saldo por Reembolsar (Bs.)"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="form-section">
            <h3>Detalle de Gastos</h3>
            <br />
            <v-card-title class="d-flex justify-space-between align-center">
              <v-btn
                variant="flat"
                class="text-grey-darken-3 bg-white"
                rounded="lg"
                :elevation="3"
                @click="agregarGasto"
              >
                Agregar Gasto
              </v-btn>
              <span class="text-caption text-grey"
                >Monto Total de Gasto (Bs.): {{ totalMontoGastado }}</span
              >
            </v-card-title>

            <v-table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Partida</th>
                  <th>Factura/Recibo</th>
                  <th>Descripción del Gasto</th>
                  <th>Monto (Bs.)</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(gasto, index) in formData.detalle_destino_fondos" :key="index">
                  <td>
                    <v-text-field
                      v-model="gasto.fecha"
                      type="date"
                      bg-color="blue-lighten-5"
                      hide-details
                      density="compact"
                      required
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.partida"
                      bg-color="blue-lighten-5"
                      hide-details
                      density="compact"
                      required
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.factura_recibo"
                      bg-color="blue-lighten-5"
                      hide-details
                      density="compact"
                      required
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.descripcion_gasto"
                      bg-color="blue-lighten-5"
                      hide-details
                      density="compact"
                      required
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.monto"
                      bg-color="blue-lighten-5"
                      type="number"
                      hide-details
                      density="compact"
                      required
                    ></v-text-field>
                  </td>
                  <td>
                    <v-btn variant="text" icon color="error" @click="eliminarGasto(index)">
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
            <v-card-subtitle class="text-h6">Información Adicional</v-card-subtitle>
            <br />

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.lugar_solicitud"
                  label="Lugar donde se realiza la Rendición de Cuentas"
                  bg-color="blue-lighten-5"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.fecha_actual"
                  label="Fecha actual Rendición de Cuentas"
                  type="date"
                  bg-color="grey-lighten-4"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="form-section">
            <v-card-subtitle class="text-h6">Firmas</v-card-subtitle>
            <br />
            <!--<v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.idresponsable"
                    :items="responsablesList"
                    :item-title="getNombreCompleto"
                    bg-color="blue-lighten-5"
                    item-value="id"
                    label="Responsable del Cargo de Cuenta"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-checkbox
                    v-model="formData.validacion_responsable"
                    label="Aprobado por Responsable del Cargo de Cuenta"
                    :disabled="!isAdmin"
                  ></v-checkbox>
                </v-col>
              </v-row>-->

            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.idcoordinador"
                  :items="coordinadoresList"
                  bg-color="blue-lighten-5"
                  :item-title="getNombreCompleto"
                  item-value="id"
                  label="Coordinador"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox
                  v-model="formData.validacion_coordinador"
                  label="Aprobado por Coordinador"
                  :disabled="!isAdmin"
                ></v-checkbox>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.idcontador"
                  :items="contadoresList"
                  bg-color="blue-lighten-5"
                  :item-title="getNombreCompleto"
                  item-value="id"
                  label="Contador"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox
                  v-model="formData.validacion_contador"
                  label="Aprobado por Contador"
                  :disabled="!isAdmin"
                ></v-checkbox>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.idadministrador"
                  :items="administradoresList"
                  bg-color="blue-lighten-5"
                  :item-title="getNombreCompleto"
                  item-value="id"
                  label="Administrador"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox
                  v-model="formData.validacion_administrador"
                  label="Aprobado por Administrador"
                  :disabled="!isAdmin"
                ></v-checkbox>
              </v-col>
            </v-row>
          </div>

          <div class="d-flex justify-end mt-4">
            <v-btn
              color="error"
              variant="outlined"
              prepend-icon="mdi-cancel"
              :to="`/pei/listaactividadespei?showButton=2`"
              class="mx-2"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="error"
              prepend-icon="mdi-backspace-outline"
              @click="resetForm"
              class="mx-2"
            >
              Limpiar
            </v-btn>
            <v-btn
              color="primary"
              prepend-icon="mdi-file-document-arrow-right"
              @click="submitForm"
              :loading="loading"
            >
              Enviar Rendicion
            </v-btn>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- {{ '*************************' }}
       <pre>{{ datosFormulario1 }}</pre> -->
  <!--<pre>{{ formData.monto_asignado }}</pre>
       <pre>{{ route }}</pre> -->
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import ActividadPeiInformacion from '@/modules/pei/components/partials/ActividadPeiInformacion.vue'

import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
import { useUserStore } from '@/stores/user'
import * as XLSX from 'xlsx'
import { useRoute, useRouter } from 'vue-router'
import { useNotificaciones } from '@/modules/notificacion/composables/useNotificaciones'

//Inicar Composable
const { enviarMensajeAutomatico } = useNotificaciones()

const router = useRouter()
const route = useRoute()
const idActividad = route.params.id || null
const idTarea = route.query.tarea_id || null
const idSolicitud = route.query.solicitud_id || null
console.log('ID Actividad:', idActividad)
console.log('ID Tarea:', idTarea)
console.log('ID SolFondos:', idSolicitud)

const baseurl = import.meta.env.VITE_API_BASE

const { usuario } = useUsuario()

const idRendicionCreada = ref(null)

// --- NUEVAS VARIABLES PARA SOLICITUDES DE FONDOS ---
const solicitudesFondos = ref([])
const loadingSolicitudes = ref(false)
const solicitud = ref(null)

// Notificaciones
const snackbar = ref({ show: false, text: '', color: 'success' })

// Variables de estado
const loading = ref(false)
const isAdmin = ref(false) // Definir el estado isAdmin

//variables para carga de datos
const datosFormulario = ref(null)
const datosFormulario1 = ref(null)
const error = ref(null)
const isLoading = ref(false)

// Estado reactivo
const cargandoGeneral = ref(true)
//const loading = ref(false)
const responsablesList = ref([])
const coordinadoresList = ref([])
const contadoresList = ref([])
const administradoresList = ref([])

const numeroFormulario = ref(null)

const formData = ref({
  // Campos del usuario (se llenarán automáticamente)
  nombre: '',
  paterno: '',
  materno: '',
  cargo: '',
  documento_identidad: '',
  // Campos de la actividad
  descripcion_actividad: '',
  lugar_actividad: '',
  fecha_actividad: '',
  objetivo_actividad: '',
  fecha_desembolso: '',
  fecha_irealizacion: '',
  fecha_frealizacion: '',
  fuente_financiamiento: '',
  id_actividad: 0,
  id_usuario: 0,
  // Resto de campos del formulario
  detalle_destino_fondos: [
    { fecha: '', partida: '', factura_recibo: '', descripcion_gasto: '', monto: 0 },
  ],
  forma_pago: null,
  lugar_solicitud: '',
  fecha_actual: getCurrentDate(),
  fecha_solicitud: '',
  //monto_solicitado: 0,
  validacion_responsable: false,
  idresponsable: null,
  validacion_coordinador: false,
  idcoordinador: null,
  monto_asignado: 0,
  monto_gastado: 0,
  formulario_numero: '',
  validacion_contador: false,
  validacion_administrador: false,
  idcontador: null,
  idadministrador: null,
})

const formDatSF = ref({
  // Propiedades existentes...
  actividad: null,
  usuario: null,
  validadores: [],
  formaPago: [],

  // Nuevas propiedades para la solicitud de fondos
  idsf: 0,
  numeroFormulariosf: '',
  detalleDestinoFondossf: '{"items":[]}',
  formaPago_idsf: null,
  lugarSolicitudsf: '',
  fechaSolicitudsf: '',
  montoSolicitadosf: 0,
  validacionResponsablesf: false,
  responsable_idsf: null,
  validacionCoordinadorsf: false,
  coordinador_idsf: null,
  usuario_idsf: null,
  actividad_idsf: null,
  fechaRealizacionActividadsf: '',
  bloquearIconosSolFondossf: true,
})

const userStore = useUserStore()
const usuario1 = computed(() => {
  return {
    nombre: userStore.usuario,
    role: userStore.rol,
    id: userStore.id,
  }
})
console.log('ID Usuario:', usuario1.value.id)

const fuente_financiamiento0 = ref()

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

// Propiedades computadas
const saldoPorReembolsar = computed(() => {
  const montoAsignado = Number(formData.value.monto_asignado) || 0
  const montoGastado = Number(totalMontoGastado.value) || 0
  return (montoAsignado - montoGastado).toFixed(2)
})

const totalMontoGastado = computed(() => {
  return formData.value.detalle_destino_fondos
    .reduce((total, gasto) => total + Number(gasto.monto || 0), 0)
    .toFixed(2)
})

//Watcher para actualizar monto_gastado en formData
watch(totalMontoGastado, (newValue) => {
  formData.value.monto_gastado = Number(newValue)
})

// Computed properties para obtener nombres completos de validadores
const nombreCoordinadorCompleto = computed(() => {
  const coordinador = coordinadoresList.value.find(
    (user) => user.id === formData.value.idcoordinador,
  )
  return coordinador ? getNombreCompleto(coordinador) : ''
})

const nombreContadorCompleto = computed(() => {
  const contador = contadoresList.value.find((user) => user.id === formData.value.idcontador)
  return contador ? getNombreCompleto(contador) : ''
})

const nombreAdministradorCompleto = computed(() => {
  const administrador = administradoresList.value.find(
    (user) => user.id === formData.value.idadministrador,
  )
  return administrador ? getNombreCompleto(administrador) : ''
})

const nombreCompletoSolicitante = computed(() => {
  return `${formData.value.nombre} ${formData.value.paterno} ${formData.value.materno}`.trim()
})

// WATCH PARA AUTO-LLENAR FORMULARIO CUANDO LLEGUEN LOS DATOS
watch(
  datosFormulario,
  (newVal) => {
    if (newVal && newVal.usuario) {
      //console.log('Auto-llenando formulario con datos del usuario:', newVal.usuario)

      const usuario = newVal.usuario

      // Llenar campos del usuario
      formData.value.nombre = usuario.nombre || ''
      formData.value.paterno = usuario.paterno || ''
      formData.value.materno = usuario.materno || ''
      formData.value.cargo = usuario.cargo || ''
      formData.value.documento_identidad = usuario.ci || ''
      formData.value.id_usuario = usuario.id || 0

      // Llenar campos de la actividad si existen
      if (newVal.actividad) {
        //console.log('Auto-llenando datos de actividad:', newVal.actividad)

        //formData.value.descripcion_actividad = newVal.actividad.descripcion || ''
        formData.value.objetivo_actividad = newVal.actividad.objetivo_de_actividad || ''
        formData.value.fecha_irealizacion = newVal.actividad.fecha_inicio || ''
        formData.value.fecha_frealizacion = newVal.actividad.fecha_cierre || ''
        formData.value.id_actividad = newVal.actividad.id || 0

        if (Array.isArray(newVal.actividad.procedencia_fondos)) {
          formData.value.fuente_financiamiento = newVal.actividad.procedencia_fondos.map(
            (item) => item.nombre,
          )
        } else {
          // Si no es un array (es null, undefined, o un objeto), lo inicializa como array vacío.
          // También puedes intentar asignar el valor directamente si es una cadena o un objeto simple:
          // formData.value.fuente_financiamiento = [newVal.actividad.procedencia_fondos];
          // PERO la opción de array vacío es la más segura si esperas una lista de fuentes.
          formData.value.fuente_financiamiento = []
        }

        if (newVal.formaPago && Array.isArray(newVal.formaPago)) {
          //console.log('Formas de pago disponibles:', newVal.formaPago)
        }

        // También actualizar actividadData para el componente ActividadInformacion
        actividadData.value = {
          ...actividadData.value,
          descripcion: newVal.actividad.descripcion || actividadData.value.descripcion,
          fecha_programada: newVal.actividad.fecha_inicio || actividadData.value.fecha_programada,
          fecha_cierre: newVal.actividad.fecha_cierre || actividadData.value.fecha_cierre,
        }
      }

      // Llenar lista de validadores si existen
      if (newVal.validadores && Array.isArray(newVal.validadores)) {
        responsablesList.value = newVal.validadores.filter((user) => user.cargo === 'responsable')
        coordinadoresList.value = newVal.validadores.filter((user) => user.cargo === 'coordinador')
        contadoresList.value = newVal.validadores.filter((user) => user.cargo === 'contable')
        administradoresList.value = newVal.validadores.filter((user) => user.cargo === 'admin')
      }
    }
  },
  { deep: true },
)

const filtrarProcedenciaFondos = () => {
  if (
    datosFormulario.value.actividad &&
    Array.isArray(datosFormulario.value.actividad.procedencia_fondos) // <= CAMBIO AQUÍ
  ) {
    fuente_financiamiento0.value = datosFormulario.value.actividad.procedencia_fondos.map(
      (item) => item.nombre,
    )
  } else {
    // Es bueno asegurarse de que siempre sea un array en caso de no encontrar datos
    fuente_financiamiento0.value = []
  }
}

watch(
  datosFormulario,
  (newVal) => {
    if (newVal) {
      filtrarProcedenciaFondos()
    }
  },
  { immediate: true },
)

// Métodos
function getNombreCompleto(user) {
  return `${user.nombre || ''} ${user.paterno || ''} ${user.materno || ''}`.trim()
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
    //const response = await fetch(baseurl+'/api/monitoreo/obtener-datos-formulario/', {
    const response = await fetch(baseurl + 'api/monitoreo/obtener-datos-formulario-pei/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_actividad: idActividad,
        usuario: usuario1.value.nombre,
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
    console.log('Datos cargados exitosamente:', JSON.stringify(datosFormulario.value, null, 2))
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    //cargandoGeneral.value = false
  }
}

// Alternativa usando fetch en lugar de axios
const cargarSolicitudesFondos = async () => {
  loadingSolicitudes.value = true
  try {
    //console.log('Cargando solicitudes de fondos con fetch...')

    const response = await fetch(baseurl + '/api/solicitud-fondos/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    const data = await response.json()
    //console.log('Datos recibidos con fetch:', data)
    solicitudesFondos.value = data
  } catch (error) {
    console.error('Error con fetch:', error)
    mostrarSnackbar(`Error al cargar solicitudes: ${error.message}`, 'error')
  } finally {
    loadingSolicitudes.value = false
  }
}

async function cargarSolicitudFondos() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + '/monitoreo_api/obtenerSolicitudFondos/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`)
    }

    const data = await response.json()
    //console.log('ttttttttttt', JSON.stringify(data,null,2))

    // Filtrar las solicitudes por actividad_id y tarea_id
    const solicitudesFiltradas = data.solicitudes.filter((solicitud) => {
      // Convertir a string para comparación segura, o comparar convirtiendo ambos al mismo tipo
      const coincideActividad = solicitud.actividad_id?.toString() === idActividad?.toString()
      const coincideTarea = solicitud.tarea_id?.toString() === idTarea?.toString()
      return coincideActividad && coincideTarea
    })

    //console.log('Solicitudes filtradas encontradas:', solicitudesFiltradas)
    datosFormulario1.value = solicitudesFiltradas[0]
    actualizarDatosFormulario(solicitudesFiltradas[0])
  } catch (err) {
    error.value = err.message
    console.error('Error al cargar solicitudes:', err)
  } finally {
    isLoading.value = false
    //cargandoGeneral.value = false
  }
}

// Agrega este watch para actualizar automáticamente cuando cambien los datosFormulario1
watch(
  datosFormulario1,
  (newVal) => {
    if (newVal && newVal.detalleDestinoFondos) {
      actualizarDetalleDestinoFondos(newVal.detalleDestinoFondos)
    }
  },
  { deep: true },
)

// Función para actualizar datosFormulario con los valores de la solicitud
function actualizarDatosFormulario(solicitud) {
  if (!solicitud) return

  // Actualizar las propiedades de datosFormulario con los valores de la solicitud
  formDatSF.value.idsf = solicitud.id || 0
  formDatSF.value.numeroFormulariosf = solicitud.numeroFormulario || ''
  formDatSF.value.detalleDestinoFondossf = solicitud.detalleDestinoFondos || '{"items":[]}'
  formDatSF.value.formaPago_idsf = solicitud.formaPago_id || null
  formDatSF.value.lugarSolicitudsf = solicitud.lugarSolicitud || ''
  formDatSF.value.fechaSolicitudsf = solicitud.fechaSolicitud || ''
  formDatSF.value.montoSolicitadosf = solicitud.montoSolicitado || 0
  formDatSF.value.validacionResponsablesf = solicitud.validacionResponsable || false
  formDatSF.value.responsable_idsf = solicitud.responsable_id || null
  formDatSF.value.validacionCoordinadorsf = solicitud.validacionCoordinador || false
  formDatSF.value.coordinador_idsf = solicitud.coordinador_id || null
  formDatSF.value.usuario_idsf = solicitud.usuario_id || null
  formDatSF.value.actividad_idsf = solicitud.actividad_id || null
  formDatSF.value.fechaRealizacionActividadsf = solicitud.fechaRealizacionActividad || ''
  formDatSF.value.bloquearIconosSolFondossf = solicitud.bloquearIconosSolFondos || true

  //console.log('datosFormulario actualizado con los valores de la solicitud:', datosFormulario.value)

  actualizarDetalleDestinoFondos(solicitud.detalleDestinoFondos)

  // Actualizar los campos de Información Adicional
  actualizarInformacionAdicional()
  actualizarValidadores()
}

// Función para parsear y actualizar el detalle de destino de fondos
function actualizarDetalleDestinoFondos(detalleDestinoFondos) {
  try {
    if (!detalleDestinoFondos) {
      formData.value.detalle_destino_fondos = []
      return
    }

    // Parsear el JSON string
    const detalleParseado = JSON.parse(detalleDestinoFondos)

    // Mapear al formato que espera la tabla
    formData.value.detalle_destino_fondos = detalleParseado.items.map((item, index) => ({
      partida: `${index + 1}.${index + 1}.${index + 1}`, // Generar partida automáticamente o usar una lógica específica
      descripcion_gasto: item.concepto || '',
      monto: item.monto || 0,
    }))

    //console.log('Detalle de destino de fondos actualizado:', formData.value.detalle_destino_fondos)
  } catch (error) {
    console.error('Error al parsear detalleDestinoFondos:', error)
    formData.value.detalle_destino_fondos = []
  }
}

// Función para actualizar los campos de Información Adicional
function actualizarInformacionAdicional() {
  // Actualizar forma_pago
  formData.value.forma_pago = formDatSF.value.formaPago_idsf

  // Actualizar lugar_solicitud
  formData.value.lugar_solicitud = formDatSF.value.lugarSolicitudsf

  // Actualizar fecha_solicitud
  formData.value.fecha_solicitud = formDatSF.value.fechaSolicitudsf
}

// Función para extraer y formatear los validadores por ID
function actualizarValidadores() {
  if (!datosFormulario.value || !datosFormulario.value.validadores) return

  // Buscar responsable por ID
  const responsable = datosFormulario.value.validadores.find(
    (validador) => validador.id === formDatSF.value.responsable_idsf,
  )

  // Buscar coordinador por ID
  const coordinador = datosFormulario.value.validadores.find(
    (validador) => validador.id === formDatSF.value.coordinador_idsf,
  )

  // Actualizar formData con los IDs encontrados
  if (responsable) {
    formData.value.idresponsable = responsable.id
    //console.log('Responsable encontrado:', getNombreCompleto(responsable))
  } else {
    console.warn('No se encontró responsable con ID:', formDatSF.value.responsable_idsf)
  }

  if (coordinador) {
    formData.value.idcoordinador = coordinador.id
    //console.log('Coordinador encontrado:', getNombreCompleto(coordinador))
  } else {
    console.warn('No se encontró coordinador con ID:', formDatSF.value.coordinador_idsf)
  }

  // También actualizar las listas de responsables y coordinadores si es necesario
  actualizarListasValidadores()
}

// Función para actualizar las listas de responsables y coordinadores
function actualizarListasValidadores() {
  if (!datosFormulario.value || !datosFormulario.value.validadores) return

  // Filtrar responsables (puedes ajustar la lógica según el cargo)
  responsablesList.value = datosFormulario.value.validadores.filter(
    (validador) => validador.cargo && validador.cargo.toLowerCase().includes('responsable'),
  )

  // Filtrar coordinadores (puedes ajustar la lógica según el cargo)
  coordinadoresList.value = datosFormulario.value.validadores.filter(
    (validador) => validador.cargo && validador.cargo.toLowerCase().includes('coordinador'),
  )
}

// Obtener información de solicitud de fondos para una actividad (y opcionalmente una tarea)
const getSolicitudFondosInfo = (actividadId, tareaId = null) => {
  if (!solicitudesFondos.value.length) return null

  // console.log('Buscando solicitud para actividad:', actividadId, 'tarea:', tareaId)

  // Buscar solicitud que coincida con actividad y tarea (si se proporciona)
  const solicitudEncontrada = solicitudesFondos.value.find((sf) => {
    // Convertir a números para comparación segura
    const sfActividadId = sf.actividad ? parseInt(sf.actividad) : null
    const sfTareaId = sf.tarea ? parseInt(sf.tarea) : null
    const buscarActividadId = actividadId ? parseInt(actividadId) : null
    const buscarTareaId = tareaId ? parseInt(tareaId) : null

    // Si se busca por tarea, debe coincidir actividad Y tarea
    if (buscarTareaId !== null) {
      return sfActividadId === buscarActividadId && sfTareaId === buscarTareaId
    }
    // Si no se busca por tarea, solo coincidir por actividad
    else {
      return sfActividadId === buscarActividadId
    }
  })

  // console.log('Solicitud encontrada:', solicitudEncontrada)
  return solicitudEncontrada || null
}

watch(
  solicitudesFondos,
  (newSolicitudes) => {
    if (newSolicitudes.length > 0) {
      //console.log('Solicitudes cargadas, buscando coincidencia...')

      // Buscar la solicitud que coincida con los parámetros de la ruta
      const solicitudEncontrada = getSolicitudFondosInfo(idActividad, idTarea)
      solicitud.value = solicitudEncontrada

      if (solicitudEncontrada) {
        //console.log('Solicitud encontrada, pre-llenando datos:', solicitudEncontrada)

        // Pre-llenar campos con los datos de la solicitud
        //formData.value.monto_solicitado = solicitudEncontrada.montoSolicitado || 0
        formData.value.monto_asignado = solicitudEncontrada.montoSolicitado || 0 // Asumiendo que monto asignado = monto solicitado

        // También puedes pre-llenar otros campos si es necesario
        if (solicitudEncontrada.numeroFormulario) {
          formData.value.formulario_numero = solicitudEncontrada.numeroFormulario
        }

        // console.log('Monto solicitado asignado:', formData.value.monto_solicitado)
      } else {
        console.log('No se encontró solicitud para actividad:', idActividad, 'tarea:', idTarea)
      }
    }
  },
  { deep: true, immediate: true },
)

onMounted(async () => {
  // Usar async/await en onMounted
  try {
    cargandoGeneral.value = true
    // Ejecutar todas las cargas de datos en paralelo
    await Promise.all([cargarDatos(), cargarSolicitudFondos(), cargarSolicitudesFondos()])
  } catch (error) {
    console.error('Error al cargar todos los datos iniciales:', error)
  } finally {
    cargandoGeneral.value = false // Solo apagar aquí
  }
  resetForm()
})

watch(
  solicitudesFondos,
  (newSolicitudes) => {
    if (newSolicitudes.length > 0) {
      const solicitudEncontrada = getSolicitudFondosInfo(idActividad, idTarea || 0)
      solicitud.value = solicitudEncontrada

      if (solicitudEncontrada) {
        //formData.value.monto_solicitado = solicitudEncontrada.montoSolicitado || 0
        formData.value.monto_asignado = solicitudEncontrada.formaPago || 0
      }
    }
  },
  { deep: true },
)

// Función helper para mostrar notificaciones
const mostrarSnackbar = (texto, color = 'success') => {
  snackbar.value = {
    show: true,
    text: texto,
    color: color,
  }
}

function agregarGasto() {
  formData.value.detalle_destino_fondos.push({
    fecha: '',
    partida: '',
    factura_recibo: '',
    descripcion_gasto: '',
    monto: 0,
  })
}

function eliminarGasto(index) {
  if (formData.value.detalle_destino_fondos.length > 1) {
    formData.value.detalle_destino_fondos.splice(index, 1)
  }
}

async function submitForm() {
  loading.value = true
  try {
    // Validar campos requeridos
    const requiredFields = [
      'cpte_diario',
      'fecha_desembolso',
      'descripcion_actividad',
      'lugar_actividad',
      'fecha_actividad',
      //'idresponsable',
      'idcoordinador',
      'idcontador',
      'idadministrador',
    ]

    for (const field of requiredFields) {
      if (!formData.value[field]) {
        throw new Error(`El campo '${field}' es requerido.`)
      }
    }

    if (
      !formData.value.detalle_destino_fondos ||
      formData.value.detalle_destino_fondos.length === 0
    ) {
      throw new Error('Debe agregar al menos un gasto.')
    }

    if (
      formData.value.detalle_destino_fondos.some(
        (gasto) => !gasto.partida || !gasto.descripcion_gasto || gasto.monto <= 0,
      )
    ) {
      throw new Error('Todos los gastos deben tener partida, descripción y un monto mayor a cero.')
    }

    const hasInvalidGasto = formData.value.detalle_destino_fondos.some(
      (gasto) =>
        !gasto.fecha || // <--- AÑADIR: Verifica que la fecha exista
        !gasto.partida ||
        !gasto.factura_recibo || // <--- AÑADIR: Verifica que el número de factura/recibo exista
        !gasto.descripcion_gasto ||
        Number(gasto.monto) <= 0, // <--- Asegúrate de convertir a número para la comparación
    )

    if (hasInvalidGasto) {
      throw new Error(
        'Todos los gastos deben tener fecha, partida, factura/recibo, descripción y un monto mayor a cero.',
      )
    }

    // Obtener información de la solicitud de fondos
    const solicitudInfo = getSolicitudFondosInfo(idActividad, idTarea)

    // OBTENER LOS CORREOS ACTUALES ANTES DE ENVIAR
    const coordinadorSeleccionado = coordinadoresList.value.find(
      (coordinador) => coordinador.id === formData.value.idcoordinador,
    )
    const contadorSeleccionado = contadoresList.value.find(
      (contador) => contador.id === formData.value.idcontador,
    )
    const administradorSeleccionado = administradoresList.value.find(
      (administrador) => administrador.id == formData.value.idadministrador,
    )

    const correoCoordinadorActual = coordinadorSeleccionado?.correo || ''
    const correoContadorActual = contadorSeleccionado?.correo || ''
    const correoAdministradorActual = administradorSeleccionado?.correo || ''

    // Actualizar los valores en formData
    formData.value.correo_coordinador = correoCoordinadorActual
    formData.value.correo_contador = correoContadorActual
    formData.value.correo_administrador = correoAdministradorActual

    // Preparar payload para la rendición de cuentas
    const payload = {
      numeroFormulario: formDatSF.value.numeroFormulariosf || '',
      //numeroFormulario: formData.value.numeroFormulario || "",
      montoAsignado: formData.value.monto_asignado,
      montoDescargado: Number(totalMontoGastado.value),
      cpteDiario: formData.value.cpte_diario,
      fechaDesembolso: formData.value.fecha_desembolso,
      saldo: Number(saldoPorReembolsar.value),
      detalleDestinoFondos: formData.value.detalle_destino_fondos.map((gasto) => ({
        fecha: gasto.fecha || '',
        partida: gasto.partida || '',
        factura_recibo: gasto.factura_recibo || '',
        descripcion: gasto.descripcion_gasto || '',
        monto: Number(gasto.monto) || 0,
      })),
      validacionResponsable: Boolean(formData.value.validacion_responsable),
      validacionCoordinador: Boolean(formData.value.validacion_coordinador),
      validacionContador: Boolean(formData.value.validacion_contador),
      validacionAdministrador: Boolean(formData.value.validacion_administrador),
      administrador: Number(formData.value.idadministrador),
      contador: Number(formData.value.idcontador),
      coordinador: Number(formData.value.idcoordinador),
      //idresponsable: Number(formData.value.idresponsable),
      usuario: formData.value.id_usuario || (usuario.value ? usuario.value.id : null),
      actividad: idActividad ? parseInt(idActividad) : null,
      tarea: idTarea ? parseInt(idTarea) : null,
      descripcionActividad: formData.value.descripcion_actividad,
      lugarActividad: formData.value.lugar_actividad,
      fechaActividad: formData.value.fecha_actividad,
      //bloquearIconoRC: true,
      //idSolicitudReembolso: null,
      //idSolicitudViaje: null,
      //idSolicitudPagoDirecto: null,
      //idSolicitudFondos: solicitudInfo ? solicitudInfo.id : null,
    }

    console.log('Payload a enviar:', JSON.stringify(payload, null, 2))

    // Enviar la solicitud
    //const response = await fetch(baseurl+'/api/monitoreo/crear-rendicion-cuentas/', {
    const response = await fetch(baseurl + 'api/rendicion-cuentas-pei/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Error HTTP: ${response.status}`)
    }

    const responseData = await response.json()
    //console.log('Rendición enviada con éxito:', responseData);
    numeroFormulario.value = responseData.numero_formulario
    const urlForm = `${window.location.origin}/monitoreo/pei/formulariopei022/${formData.value.id_actividad}?solicitud_id=${responseData.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`

    const cuerpoMensaje = {
      destinatario_id: payload.coordinador,
      asunto: 'Rendicion de Cuentas PEI',
      contenido:
        'Rendicion de Cuentas PEI pediente del formulario ' +
        numeroFormulario.value +
        '. URL: ' +
        urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }
    await enviarMensajeAutomatico(cuerpoMensaje)

    const cuerpoMensaje2 = {
      destinatario_id: payload.contador,
      asunto: 'Rendicion de Cuentas PEI',
      contenido:
        'Rendicion de Cuentas PEIpediente del formulario ' +
        numeroFormulario.value +
        '. URL: ' +
        urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }
    await enviarMensajeAutomatico(cuerpoMensaje2)

    const cuerpoMensaje3 = {
      destinatario_id: payload.administrador,
      asunto: 'Rendicion de Cuentas PEI',
      contenido:
        'Rendicion de Cuentas PEI pediente del formulario ' +
        numeroFormulario.value +
        '. URL: ' +
        urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }

    // GUARDAR EL ID DE LA RENDICIÓN CREADA
    idRendicionCreada.value = responseData.id || responseData.rendicion_id

    alert('Rendición enviada con éxito')
    exportToExcel()
    resetForm()

    await enviarMensajeAutomatico(cuerpoMensaje3)

    ///////// Enviar notificación por correo al coordinador y al contador//////////
    try {
      const emailPayload = {
        //emails: [formData.value.correo_coordinador, formData.value.correo_contador],
        emails: [correoCoordinadorActual, correoContadorActual, correoAdministradorActual].filter(
          (email) => email,
        ),
        datos_solicitud: {
          codigo: numeroFormulario.value || 'SOL-PROV',
          titulo: 'Formulario Rendicion de Cuentas PEI',
          solicitante: nombreCompletoSolicitante.value,
          tipo: 'Rendicion de Cuentas PEI',
          prioridad: 'alta',
          descripcion:
            formData.value.descripcion_actividad || 'Rendicion de Cuentas PEI para actividad',
          url_revision: `${window.location.origin}/monitoreo/pei/formulariopei022/${formData.value.id_actividad}?solicitud_id=${responseData.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`,
        },
      }

      console.log('emailPayload enviado:', JSON.stringify(emailPayload, null, 2))

      const emailResponse = await fetch(baseurl + '/api-msg/correos/solicitud-pendiente/', {
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

    console.log('Respuesta del servidor:', responseData)

    setTimeout(() => {
      router.push('/pei/listaactividadespei?showButton=2')
    }, 1000)
  } catch (error) {
    console.error('Error completo:', error)
    alert(`Error: ${error.message}`)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(formData.value, {
    cpte_diario: '',
    fecha_desembolso: '',
    descripcion_actividad: '',
    lugar_solicitud: '',
    lugar_actividad: '',
    fecha_actividad: '',
    detalle_destino_fondos: [
      { fecha: '', partida: '', factura_recibo: '', descripcion_gasto: '', monto: 0 },
    ],
    idresponsable: null,
    idcoordinador: null,
    idcontador: null,
    idadministrador: null,
  })
}

function exportToExcel() {
  // 1. Crear datos principales con formato de formulario
  const mainData = [
    ['FORMULARIO F-02: RENDICION DE CUENTAS', '', '', ''],
    [''],
    [''],
    [
      'Nombre del Solicitante:',
      formData.value.nombre,
      formData.value.paterno,
      formData.value.materno,
    ],
    ['Documento de Identidad:', formData.value.documento_identidad, '', ''],
    ['Cargo:', formData.value.cargo, '', ''],
    ['Formulario Número:', formDatSF.value.numeroFormulariosf || '', '', ''],
    [''],
    ['Cpte. Diario:', formData.value.cpte_diario, '', ''],
    ['Fecha de Desembolso:', formData.value.fecha_desembolso, '', ''],
    ['Monto Asignado (Bs.):', formData.value.monto_asignado, '', ''],
    ['Monto Gastado (Bs.):', Number(totalMontoGastado.value), '', ''],
    [''],
    ['Saldo por Reembolsar (Bs.):', Number(saldoPorReembolsar.value), '', ''],
    ['Fuente de Financiamiento:', formData.value.fuente_financiamiento, '', ''],
    ['Descripcion de Actividad:', formData.value.descripcion_actividad, '', ''],
    ['Lugar de Actividad:', formData.value.lugar_actividad, '', ''],
    ['Fecha de Actividad:', formData.value.fecha_actividad, '', ''],
    [''],
    //['Responsable:', formData.value.idresponsable, '', ''],
    ['Coordinador:', nombreCoordinadorCompleto.value, '', ''],
    ['Contador:', nombreContadorCompleto.value, '', ''],
    ['Administrador:', nombreAdministradorCompleto.value, '', ''],
    [''],
    ['DETALLE DEL DESTINO DE FONDOS', '', '', ''],
  ]

  // 2. Encabezados de la tabla de gastos
  const expensesHeaders = [
    'FECHA',
    'PARTIDA',
    'FACTURA/RECIBO',
    'DESCRIPCIÓN DEL GASTO',
    'MONTO (BS.)',
  ]

  // 3. Datos de gastos
  const expensesData = formData.value.detalle_destino_fondos.map((gasto) => [
    gasto.fecha,
    gasto.partida,
    gasto.factura_recibo,
    gasto.descripcion_gasto,
    gasto.monto,
  ])

  // 4. Total al final de la tabla
  const totalRow = ['TOTAL', '', '', '', Number(totalMontoGastado.value), '']

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
  XLSX.utils.book_append_sheet(wb, wsMain, 'Rendicion de Cuentas')
  XLSX.writeFile(wb, `Rendicion_Cuentas_F-02_${getCurrentDate1()}.xlsx`)
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

// Hooks de ciclo de vida
onMounted(() => {
  cargarDatos()
  cargarSolicitudesFondos()
  getSolicitudFondosInfo(idActividad, idTarea)
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
