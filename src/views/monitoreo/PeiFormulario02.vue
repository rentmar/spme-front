<template>
  <div class="v-container v-locale--is-ltr">
    <div class="v-card v-theme--light v-card--density-default v-card--variant-elevated pa-6">
      <div class="v-card-title text-h5 font-weight-bold">
        Formulario F-02:<br> Rendición de Cuentas
      </div>

      <div class="v-card-text">
        <form class="v-form" novalidate @submit.prevent="submitForm">
          <div class="form-section">
            <v-divider class="my-4"></v-divider>

            <v-card-subtitle class="text-h6">Responsable del Cargo de Cuenta</v-card-subtitle>
            <br>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.nombre" label="Nombre" required readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.paterno" label="Apellido paterno" required readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.materno" label="Apellido materno" required readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.cargo" label="Cargo" required readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.documento_identidad"
                  label="Documento de Identidad"
                  required
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <v-card-subtitle class="text-h6">Cargo de Cuenta</v-card-subtitle>

            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="formData.formulario_numero" label="Formulario Número" readonly></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="formData.cpte_diario" label="Cpte. Diario" bg-color="blue-lighten-5" required></v-text-field>
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
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formData.monto_solicitado"
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
              <v-col cols="12">
                <v-text-field
                  v-model="formData.fuente_financiamiento"
                  label="Fuente de Financiamiento"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.descripcion_actividad"
                  label="Descripción de la Actividad"
                  bg-color="blue-lighten-5"
                  rows="3"
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formData.lugar_actividad"
                  label="Lugar de Actividad"
                  bg-color="blue-lighten-5"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formData.fecha_actividad"
                  label="Fecha de Actividad"
                  bg-color="blue-lighten-5"
                  type="date"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="form-section">
            <h3>Detalle del Gasto</h3>
            <br>
            <v-card-title class="d-flex justify-space-between align-center">
              <v-btn variant="flat" class="text-grey-darken-3 bg-white" rounded="lg" :elevation="3" @click="agregarGasto">
                Agregar Gasto
              </v-btn>
              <span class="text-caption text-grey">Monto Total de Gasto (Bs.): {{ totalMontoGastado }}</span>
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
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.partida"
                      bg-color="blue-lighten-5"
                      hide-details
                      density="compact"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.factura_recibo"
                      bg-color="blue-lighten-5"
                      hide-details
                      density="compact"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.descripcion_gasto"
                      bg-color="blue-lighten-5"
                      hide-details
                      density="compact"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.monto"
                      bg-color="blue-lighten-5"
                      type="number"
                      hide-details
                      density="compact"
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

          <div class="form-section">
            <div class="v-card-subtitle text-subtitle-1">Firmas</div>
            <br>
            <v-row>
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
            </v-row>

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
            <v-btn color="error" prepend-icon="mdi-backspace-outline" @click="resetForm">
              Limpiar
            </v-btn>
            <v-btn color="primary" prepend-icon="mdi-file-document-arrow-right" @click="submitForm" :loading="loading">
              Enviar Rendicion
            </v-btn>
          </div>
        </form>
      </div>
    </div>
  </div>
   <pre>{{ datosFormulario }}</pre>
</template>

<script setup>

import { ref, onMounted, computed, watch } from 'vue';
import { useUsuario } from '@/modules/usuarios/composables/useUsuario';
import * as XLSX from 'xlsx'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const idActividad = route.params.id || null
const idTarea = route.query.tarea_id || null
const idSolicitud = route.query.solicitud_id || null
console.log('ID Actividad:', idActividad)
console.log('ID Tarea:', idTarea)
console.log('ID SolFondos:', idSolicitud)

const { usuario } = useUsuario();

const idRendicionCreada = ref(null)

// --- NUEVAS VARIABLES PARA SOLICITUDES DE FONDOS ---
const solicitudesFondos = ref([])
const loadingSolicitudes = ref(false)
const solicitud = ref(null)

// Notificaciones
const snackbar = ref({ show: false, text: '', color: 'success' })

// Variables de estado
const loading = ref(false);
const isAdmin = ref(false); // Definir el estado isAdmin
const lista_responsables = ref([]);
const lista_coordinadores = ref([]);
const lista_contadores = ref([]);
const lista_administradores = ref([]);

//variables para carga de datos
const datosFormulario = ref(null)
const error = ref(null)
const isLoading = ref(false)

// Estado reactivo
const cargandoGeneral = ref(true)
//const loading = ref(false)
const responsablesList = ref([])
const coordinadoresList = ref([])
const contadoresList = ref([])
const administradoresList = ref([])

const formData = ref({
  // Campos del usuario (se llenarán automáticamente)
  nombre: '',
  paterno: '',
  materno: '',
  cargo: '',
  documento_identidad: '',
  // Campos de la actividad
  descripcion_actividad: '',
  lugar_actividad:'',
  fecha_actividad:'',
  objetivo_actividad: '',
  fecha_irealizacion: '',
  fecha_frealizacion: '',
  fuente_financiamiento: '',
  id_actividad: 0,
  id_usuario: 0,
  // Resto de campos del formulario
  detalle_destino_fondos: [{ factura_recibo: '', descripcion: '', monto: 0 }],
  forma_pago: null,
  lugar_solicitud: '',
  fecha_solicitud: getCurrentDate(),
  monto_solicitado: 0,
  validacion_responsable: false,
  idresponsable: null,
  validacion_coordinador: false,
  idcoordinador: null,
  monto_asignado: 0,
  formulario_numero:'',
  validacion_contador: false,
  validacion_administrador: false,
  idcontador: null,
  idadministrador: null
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

// Propiedades computadas
const saldoPorReembolsar = computed(() => {
  const montoAsignado = Number(formData.value.monto_solicitado) || 0;
  const montoGastado = Number(totalMontoGastado.value) || 0;
  return (montoAsignado - montoGastado).toFixed(2);
});

const totalMontoGastado = computed(() => {
  return formData.value.detalle_destino_fondos.reduce(
    (total, gasto) => total + Number(gasto.monto || 0),
    0
  ).toFixed(2);
});

 //Watcher para actualizar monto_gastado en formData
 watch(totalMontoGastado, (newValue) => {
   formData.value.monto_gastado = Number(newValue);
 });

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
        formData.value.fuente_financiamiento = newVal.actividad.procedencia_fondos || ''

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
        contadoresList.value = newVal.validadores.filter((user) => user.cargo === 'contador')
        administradoresList.value = newVal.validadores.filter((user) => user.cargo === 'administrador')
      }
    }
  },
  { deep: true },
)

// Métodos
function getNombreCompleto(user) {
  return `${user.nombre || ''} ${user.paterno || ''} ${user.materno || ''}`.trim();
}

const nombreCompletoSolicitante = computed(() => {
  const nombre = usuario.value?.nombre || '';
  const paterno = usuario.value?.paterno || '';
  const materno = usuario.value?.materno || '';
  return `${nombre} ${paterno} ${materno}`.trim();
});

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
    const response = await fetch('http://127.0.0.1:8000/api/monitoreo/obtener-datos-formulario/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_actividad: idActividad,
        usuario: 'chave',
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
    console.log('Datos cargados exitosamente:', datosFormulario.value)
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

// Alternativa usando fetch en lugar de axios
const cargarSolicitudesFondos = async () => {
  loadingSolicitudes.value = true
  try {
    //console.log('Cargando solicitudes de fondos con fetch...')

    const response = await fetch('http://127.0.0.1:8000/api/solicitud-fondos/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    const data = await response.json()
    console.log('Datos recibidos con fetch:', data)
    solicitudesFondos.value = data

  } catch (error) {
    console.error('Error con fetch:', error)
    mostrarSnackbar(`Error al cargar solicitudes: ${error.message}`, 'error')
  } finally {
    loadingSolicitudes.value = false
  }
}

// Obtener información de solicitud de fondos para una actividad (y opcionalmente una tarea)
const getSolicitudFondosInfo = (actividadId, tareaId = null) => {
  if (!solicitudesFondos.value.length) return null

  console.log('Buscando solicitud para actividad:', actividadId, 'tarea:', tareaId)

  // Buscar solicitud que coincida con actividad y tarea (si se proporciona)
  const solicitudEncontrada = solicitudesFondos.value.find(sf => {
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

  console.log('Solicitud encontrada:', solicitudEncontrada)
  return solicitudEncontrada || null
}

watch(solicitudesFondos, (newSolicitudes) => {
  if (newSolicitudes.length > 0) {
    console.log('Solicitudes cargadas, buscando coincidencia...')

    // Buscar la solicitud que coincida con los parámetros de la ruta
    const solicitudEncontrada = getSolicitudFondosInfo(idActividad, idTarea)
    solicitud.value = solicitudEncontrada

    if (solicitudEncontrada) {
      console.log('Solicitud encontrada, pre-llenando datos:', solicitudEncontrada)

      // Pre-llenar campos con los datos de la solicitud
      formData.value.monto_solicitado = solicitudEncontrada.montoSolicitado || 0
      formData.value.monto_asignado = solicitudEncontrada.montoSolicitado || 0 // Asumiendo que monto asignado = monto solicitado

      // También puedes pre-llenar otros campos si es necesario
      if (solicitudEncontrada.numeroFormulario) {
        formData.value.formulario_numero = solicitudEncontrada.numeroFormulario
      }

      console.log('Monto solicitado asignado:', formData.value.monto_solicitado)
    } else {
      console.log('No se encontró solicitud para actividad:', idActividad, 'tarea:', idTarea)
    }
  }
}, { deep: true, immediate: true })

// Función para convertir IDs a números de forma segura
const safeParseInt = (value) => {
  if (value === null || value === undefined || value === '') return null
  const parsed = parseInt(value)
  return isNaN(parsed) ? null : parsed
}

// Y actualiza el onMounted para usar esta función
onMounted(() => {
  cargarDatos()
  cargarSolicitudesFondos()

  // Convertir IDs a números para búsqueda consistente
  const actividadId = safeParseInt(idActividad)
  const tareaId = safeParseInt(idTarea)

  console.log('IDs convertidos - Actividad:', actividadId, 'Tarea:', tareaId)
})

watch(solicitudesFondos, (newSolicitudes) => {
  if (newSolicitudes.length > 0) {
    const solicitudEncontrada = getSolicitudFondosInfo(idActividad, idTarea || 0)
    solicitud.value = solicitudEncontrada

    if (solicitudEncontrada) {
      formData.value.monto_solicitado = solicitudEncontrada.montoSolicitado || 0
      formData.value.monto_asignado = solicitudEncontrada.formaPago || 0
    }
  }
}, { deep: true })

// Función helper para mostrar notificaciones
const mostrarSnackbar = (texto, color = 'success') => {
  snackbar.value = {
    show: true,
    text: texto,
    color: color
  }
}

function agregarGasto() {
  formData.value.detalle_destino_fondos.push({ fecha: '', partida: '', factura_recibo: '', descripcion_gasto: '', monto: 0 });
}

function eliminarGasto(index) {
  if (formData.value.detalle_destino_fondos.length > 1) {
    formData.value.detalle_destino_fondos.splice(index, 1);
  }
}

async function submitForm() {
  loading.value = true;
  try {
    // Validar campos requeridos
    const requiredFields = [
      'cpte_diario',
      'fecha_desembolso',
      'descripcion_actividad',
      'lugar_actividad',
      'fecha_actividad',
      'idresponsable',
      'idcoordinador',
      'idcontador',
      'idadministrador'
    ];

    for (const field of requiredFields) {
      if (!formData.value[field]) {
        throw new Error(`El campo '${field}' es requerido.`);
      }
    }

    if (!formData.value.detalle_destino_fondos || formData.value.detalle_destino_fondos.length === 0) {
      throw new Error('Debe agregar al menos un gasto.');
    }

    if (formData.value.detalle_destino_fondos.some(gasto => !gasto.partida || !gasto.descripcion_gasto || gasto.monto <= 0)) {
      throw new Error('Todos los gastos deben tener partida, descripción y un monto mayor a cero.');
    }

    // Obtener información de la solicitud de fondos
    const solicitudInfo = getSolicitudFondosInfo(idActividad, idTarea);

    // Preparar payload para la rendición de cuentas
    const payload = {
      numeroFormulario: formData.value.formulario_numero || "",
      montoDescargado: Number(totalMontoGastado.value),
      cpteDiario: formData.value.cpte_diario,
      fechaDesembolso: formData.value.fecha_desembolso,
      saldo: Number(saldoPorReembolsar.value),
      detalleDestinoFondos: formData.value.detalle_destino_fondos.map(gasto => ({
        factura_recibo: gasto.factura_recibo || "",
        descripcion: gasto.descripcion_gasto || "",
        monto: Number(gasto.monto) || 0,
      })),
      validacionResponsable: Boolean(formData.value.validacion_responsable),
      validacionCoordinador: Boolean(formData.value.validacion_coordinador),
      validacionContador: Boolean(formData.value.validacion_contador),
      validacionAdministrador: Boolean(formData.value.validacion_administrador),
      idadministrador: Number(formData.value.idadministrador),
      idcontador: Number(formData.value.idcontador),
      idcoordinador: Number(formData.value.idcoordinador),
      idresponsable: Number(formData.value.idresponsable),
      idusuarioLogeado: formData.value.id_usuario || (usuario.value ? usuario.value.id : null),
      idActividad: idActividad ? parseInt(idActividad) : null,
      idTarea: idTarea ? parseInt(idTarea) : null,
      descripcionActividad: formData.value.descripcion_actividad,
      lugarActividad: formData.value.lugar_actividad,
      fechaActividad: formData.value.fecha_actividad,
      bloquearIconoRC: true,
      idSolicitudReembolso: null,
      idSolicitudViaje: null,
      idSolicitudPagoDirecto: null,
      idSolicitudFondos: solicitudInfo ? solicitudInfo.id : null,
    };

    console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

    // Enviar la solicitud
    const response = await fetch('http://127.0.0.1:8000/api/monitoreo/crear-rendicion-cuentas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error HTTP: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Rendición enviada con éxito:', responseData);

    // GUARDAR EL ID DE LA RENDICIÓN CREADA
    idRendicionCreada.value = responseData.id || responseData.rendicion_id;

    alert('Rendición enviada con éxito');
    exportToExcel();
    resetForm();

    setTimeout(() => {
      router.push('/pei/listaactividades')
    }, 1000)

  } catch (error) {
    console.error('Error completo:', error);
    alert(`Error: ${error.message}`);
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  Object.assign(formData.value, {
    cpte_diario: '',
    fecha_desembolso: '',
    descripcion_actividad: '',
    lugar_actividad: '',
    fecha_actividad: '',
    detalle_destino_fondos: [{ fecha: '', partida: '', factura_recibo: '', descripcion_gasto: '', monto: 0 }],
    idresponsable: null,
    idcoordinador: null,
    idcontador: null,
    idadministrador: null,
  });
}

function exportToExcel() {
  // 1. Crear datos principales con formato de formulario
  const mainData = [
    ['FORMULARIO F-02: RENDICION DE CUENTAS', '', '', ''],
    [''],
      ['Nombre del Solicitante:', formData.value.nombre, formData.value.paterno, formData.value.materno],
      ['Documento de Identidad:', formData.value.documento_identidad, '', ''],
      ['Cargo:', formData.value.cargo, '', ''],
      ['Formulario Número:', formData.value.formulario_numero || '', '', ''],
      ['Cpte. Diario:', formData.value.cpte_diario, '', ''],
      ['Fecha de Desembolso:', formData.value.fecha_desembolso, '', ''],
      ['Monto Asignado (Bs.):', formData.value.monto_solicitado, '', ''],
      ['Monto Gastado (Bs.):', Number(totalMontoGastado.value), '', ''],
      ['Saldo por Reembolsar (Bs.):', Number(saldoPorReembolsar.value), '', ''],
      ['Fuente de Financiamiento:', formData.value.fuente_financiamiento, '', ''],
      ['Descripcion de Actividad:',formData.value.descripcion_actividad, '', ''],
      ['Lugar de Actividad:', formData.value.lugar_actividad, '', ''],
      ['Fecha de Actividad:', formData.value.fecha_actividad, '', ''],
    ['Responsable:', formData.value.idresponsable, '', ''],
    ['Coordinador:', formData.value.idcoordinador, '', ''],
    ['Contador:', formData.value.idcontador, '', ''],
    ['Administrador', formData.value.idadministrador, '', ''],
    [''],
    ['DETALLE DEL DESTINO DE FONDOS', '', '', ''],
  ]

  // 2. Encabezados de la tabla de gastos
  const expensesHeaders = ['Fecha', 'PARTIDA', 'Factura/Recibo', 'DESCRIPCIÓN DEL GASTO', 'MONTO (BS.)']

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
  getSolicitudFondosInfo(idActividad,idTarea)

});

</script>

<style scoped>
.form-section {
  margin-bottom: 24px;
}
.v-card {
  max-width: 900px;
  margin: 0 auto;
}
.v-table {
  margin: 16px 0;
}
</style>
