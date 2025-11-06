<template>
  <v-container class="v-container v-locale--is-ltr">
    <v-card class="pa-6">

      <PaginaTituloIcono
        :titulo="'Validar Solicitud de Pago Directo'"
        :icon="'mdi-file-document-multiple'"
      ></PaginaTituloIcono>
      <br />
      <ProyectoIdHeader
        v-if="datosFormulario"
        :proyecto-id="datosFormulario.actividad?.proyecto"
      ></ProyectoIdHeader>

       <br />
      <ActividadInformacion
        v-if="idActividad"
        :actividad-id="idActividad"
      ></ActividadInformacion>
      <br />

      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <div class="form-section">

                <div class="form-section mb-6">
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="datosSolicitante.nombre"
                        label="Nombre del Solicitante"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="datosSolicitante.paterno"
                        label="Apellido paterno del Solicitante"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="datosSolicitante.materno"
                        label="Apellido materno del Solicitante"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="datosSolicitante.ci"
                        label="Carnet de Identidad"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="datosSolicitante.cargo"
                        label="Cargo"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

            <v-textarea
              v-model="formData.descripcion_actividad"
              label="Descripción de la Actividad"
              bg-color="blue-lighten-5"
              rows="3"
              required
              readonly
            ></v-textarea>
            <v-text-field
              v-model="formData.fecha_realizacion"
              label="Fecha de Realización"
              bg-color="blue-lighten-5"
              type="date"
              required
              readonly
            ></v-text-field>
            <v-textarea
              v-model="formData.objetivo_actividad"
              label="Objetivo de la Actividad"
              bg-color="blue-lighten-5"
              rows="3"
              required
              readonly
            ></v-textarea>
            <v-text-field
              v-model="formData.fuente_financiamiento"
              label="Fuente de Financiamiento"
              bg-color="blue-lighten-5"
              required
              readonly
            ></v-text-field>
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
                      bg-color="blue-lighten-5"
                      hide-details
                      density="compact"
                      readonly
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.descripcion_gasto"
                      bg-color="blue-lighten-5"
                      hide-details
                      density="compact"
                      readonly
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.monto"
                      bg-color="blue-lighten-5"
                      type="number"
                      hide-details
                      density="compact"
                      min="0"
                      readonly
                    ></v-text-field>
                  </td>
                  <td>
                    <v-btn
                      variant="text"
                      icon
                      color="error"
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
          <v-select
            v-model="formData.forma_pago"
            :items="formasPagoList"
            item-title="formaPago"
            item-value="id"
            label="Forma de Pago"
            variant="outlined"
            bg-color="blue-lighten-5"
            required
            readonly
          ></v-select>
          <div class="form-section">
            <v-text-field
              v-model="formData.lugar_solicitud"
              bg-color="blue-lighten-5"
              label="Lugar de la Solicitud"
              required
              readonly
            ></v-text-field>
            <v-text-field
              v-model="formData.fecha_solicitud"
              label="Fecha de la Solicitud"
              type="date"
              required
              readonly
            ></v-text-field>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="form-section">
            <div class="text-subtitle-1 font-weight-bold mb-2">Firmas</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.id_responsable"
                  bg-color="blue-lighten-5"
                  :items="responsablesList"
                  :item-title="getNombreCompleto"
                  item-value="id"
                  label="Responsable del Cargo de Cuenta"
                  required
                  readonly
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" class="d-flex align-center">
                      <v-checkbox
                        v-model="solicitudDePagoDirecto.validacionResponsable"
                        :label="`Aprobado por Responsable ${puedeValidarResponsable ? '(Usted)' : ''}`"
                        :disabled="!puedeValidarResponsable || solicitudDePagoDirecto.validacionResponsable"
                        :readonly="!puedeValidarResponsable || solicitudDePagoDirecto.validacionResponsable"
                        :color="puedeValidarResponsable ? 'primary' : 'grey'"
                        @update:modelValue="(newValue) => {
                          if (newValue) {
                            nextTick(() => {
                              validarPagoDirecto('responsable');
                            });
                          }
                        }"
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
                  label="Coordinador"
                  required
                  readonly
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" class="d-flex align-center">
                <v-checkbox
                  v-model="solicitudDePagoDirecto.validacionCoordinador"
                  :label="`Aprobado por Coordinador ${puedeValidarCoordinador ? '(Usted)' : ''}`"
                  :disabled="!puedeValidarCoordinador || solicitudDePagoDirecto.validacionCoordinador"
                  :readonly="!puedeValidarCoordinador || solicitudDePagoDirecto.validacionCoordinador"
                  :color="puedeValidarCoordinador ? 'primary' : 'grey'"
                  @update:modelValue="(newValue) => {
                    if (newValue) {
                      nextTick(() => {
                        validarPagoDirecto('coordinador');
                      });
                    }
                  }"
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
  <!-- {{ '**************' }}
  <pre>{{ formaPago }}</pre> -->
</template>

<script setup>
//import * as XLSX from 'xlsx';
import { ref, onMounted, computed, nextTick } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const idActividad = route.params.id || null
const idTarea = route.query.tarea_id || null
const idSolicitud = route.query.solicitud_id || null
console.log('ID Actividad:', idActividad)
console.log('ID Tarea:', idTarea)
console.log('ID Solicitud', idSolicitud)

const userStore = useUserStore()
const usuario = computed(() => {
  return {
    nombre: userStore.usuario,
    role: userStore.rol,
    id: userStore.userId,
  }
})
console.log('ID de Usuario:', usuario.value.id)

const baseurl = import.meta.env.VITE_API_BASE

const datosSolicitante = ref([])
const solicitante = ref(null)
const solicitudDePagoDirecto = ref({})
const solicitudDeViaje = ref({})  //viene de la funccion cargarSolicitudesDeViaje

const cargandoGeneral = ref(true)

//variables para carga de datos
const datosFormulario = ref(null)
const formasPagoList = ref([])
const formaPago = ref()

// Estado reactivo
const error = ref(null)
const isLoading = ref(false)
const loading = ref(false);
//const paymentMethods = ['Cuenta de Banco', 'Cheque'];
const responsablesList = ref([]);
const coordinadoresList = ref([]);

const formData = ref({
  descripcion_actividad: '',
  fecha_realizacion: '',
  objetivo_actividad: '',
  fuente_financiamiento: '',

  detalle_destino_fondos: [{ partida: '', descripcion_gasto: '', monto: 0 }],
  forma_pago: '',
  lugar_solicitud: '',
  fecha_solicitud: '',
  monto_solicitado: 0,

  id_responsable: null,
  validacion_responsable: false,
  id_coordinador: null,
  validacion_coordinador: false,
  id_usuario: '',
  id_actividad: '',
  id_tarea: null,
});

// Propiedades computadas
const totalMontoSolicitado = computed(() => {
  return formData.value.detalle_destino_fondos.reduce(
    (total, gasto) => total + Number(gasto.monto || 0),
    0
  );
});

// Métodos
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getNombreCompleto(user) {
  return `${user.nombre} ${user.paterno} ${user.materno}`.trim();
}

async function cargarDatos() {      //se carga unicamente para la etiqueta proyectos
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + '/api/monitoreo/obtener-datos-formulario/', {
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
    const response = await fetch(baseurl+'/monitoreo_api/obtenerFormasPago/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!response.ok) throw new Error('Error al cargar formas de pago')

    const data = await response.json()
    formasPagoList.value = data.formasPago // Asignar directamente el array
    formaPago.value = formasPagoList.value.find((user) => user.id === solicitudDeViaje.value.formaPago_id)
    //console.log('Formas de pago cargadas:', formasPagoList.value)
  } catch (err) {
    console.error('Error:', err)
  }
}

async function cargarUsuarios() {
  try {
    const response = await axios.get(baseurl + '/autenticacion_api/listaUsuarios/');
    const allUsers = response.data.usuarios;
    responsablesList.value = allUsers.filter((user) => user.cargo === 'responsable');
    coordinadoresList.value = allUsers.filter((user) => user.cargo === 'coordinador');
    datosSolicitante.value = allUsers.find((user) => user.id === usuario.value.id)
    if(datosSolicitante.value){
      solicitante.value = getNombreCompleto(datosSolicitante.value)
    }
  } catch (error) {
    console.error('Error al cargar la lista de usuarios:', error);
    alert('No se pudieron cargar los usuarios para las firmas. Por favor recargue la página.');
  }
}

async function cargarSolicitudesDePagoDirecto() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch('http://127.0.0.1:8000/monitoreo_api/obtenerSolicitudesPagoDirecto/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // id_actividad: actividadIdParaValidar.value,
        // id_tarea: tareaIdParaValidar.value,
        //usuario: usuario.value.nombre,
        id_solicitudPagoDirecto: idSolicitud
      }),
    })
    //console.log('00000000000000000000000000000', JSON.stringify(response,null,2) )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    //console.log('SoicitudDePagoDirecto Recibido:', JSON.stringify(rawData,null,2))

    solicitudDePagoDirecto.value = rawData.solicitudes[0]   //se selecciona solicitudes y se elimina corchetes

    formData.value.descripcion_actividad = solicitudDePagoDirecto.value.descripcion_actividad
    formData.value.fecha_realizacion = solicitudDePagoDirecto.value.fecha_realizacion
    formData.value.objetivo_actividad = solicitudDePagoDirecto.value.objetivo_actividad
    formData.value.fuente_financiamiento = solicitudDePagoDirecto.value.fuente_financiamiento
    formData.value.detalle_destino_fondos = solicitudDePagoDirecto.value.detalleDestinoFondos.items.map(item =>({
      partida: item.partida || '',
      descripcion_gasto: item.concepto || '',
      monto: item.monto || 0
    }))
    formData.value.forma_pago = solicitudDePagoDirecto.value.formaPago_id
    formData.value.lugar_solicitud = solicitudDePagoDirecto.value.lugarSolicitud
    formData.value.fecha_solicitud = solicitudDePagoDirecto.value.fechaSolicitud
    formData.value.id_responsable = solicitudDePagoDirecto.value.responsable_id
    formData.value.id_coordinador = solicitudDePagoDirecto.value.coordinador_id

    //listaSolicitudesDePagoDirecto.value = strictSanitizeData(rawData.solicitudes)
    //console.log('Datos cargados exitosamente:', JSON.stringify(listaSolicitudesDePagoDirecto.value,null,2),actividadIdParaValidar.value, tareaIdParaValidar.value)
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

const puedeValidarResponsable = computed(() => {
  const idUsuarioLogueado = usuario.value?.id
  const idResponsableAsignado = solicitudDePagoDirecto.value?.responsable_id
  return idUsuarioLogueado === idResponsableAsignado
})

const puedeValidarCoordinador = computed(() => {
  const idUsuarioLogueado = usuario.value?.id
  const idCoordinadorAsignado = solicitudDePagoDirecto.value?.coordinador_id
  return idUsuarioLogueado === idCoordinadorAsignado
})

async function validarPagoDirecto(tipoValidador) {
  // Verificar permisos según el tipo de validador
  let tienePermiso = false;
  let claveValidacion = '';

  switch (tipoValidador) {
    case 'responsable':
      tienePermiso = puedeValidarResponsable.value;
      claveValidacion = 'validacion_responsable';
      break;
    case 'coordinador':
      tienePermiso = puedeValidarCoordinador.value;
      claveValidacion = 'validacion_coordinador';
      break;
    default:
      alert('Tipo de validador no reconocido.');
      return;
  }

  if (!tienePermiso) {
    alert('Usted no está autorizado para validar esta rendición como ' + tipoValidador + '.');
    solicitudDePagoDirecto.value[claveValidacion] = false;
    return;
  }

   // Crear el payload específico para la validación
  const payload = {
    id_solicitud: solicitudDePagoDirecto.value?.id || idSolicitud,
    [claveValidacion]: true     //validacion_responsable: true o validacion_coordinador: true
  };
  console.log('888888888888888888888', JSON.stringify(payload,null,2))

  if (!payload.id_solicitud) {
    alert('Error: No se encontró el ID de la reposicion para validar.');
    formData.value[claveValidacion] = false; // Revertir
    return;
  }

  // Ejecutar la llamada PATCH
  loading.value = true;
  try {
    const response = await fetch(
      baseurl+'/monitoreo_api/actualizar-validacion-solicitud-pago-directo/',
      //baseurl+'/monitoreo_api/actualizar-validacion-solicitud-reembolso/',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error al actualizar: ${response.status} - ${errorData.detail || errorData.mensaje || 'Error desconocido'}`
      );
    }

    //const result = await response.json();
    alert('Pago Directo validado exitosamente.');

    // Recargar los datos para reflejar los cambios
    await cargarSolicitudesDePagoDirecto();

  } catch (err) {
    console.error('Error al validar la solicitud:', err);
    alert(`Error al validar la solicitud: ${err.message}`);

    // Revertir el cambio en caso de error
    formData.value[claveValidacion] = false;
  } finally {
    loading.value = false;
  }
}

function addGasto() {
  formData.value.detalle_destino_fondos.push({ partida: '', descripcion_gasto: '', monto: 0 });
}

function removeGasto(index) {
  if (formData.value.detalle_destino_fondos.length > 1) {
    formData.value.detalle_destino_fondos.splice(index, 1);
  }
}

async function submitForm() {
  loading.value = true;
  try {
    // Validaciones básicas antes de enviar
    const requiredFields = [
      'descripcion_actividad',
      'fecha_realizacion',
      'objetivo_actividad',
      'fuente_financiamiento',
      'detalle_destino_fondos',
      'forma_pago',
      'lugar_solicitud',
      'id_responsable',
      'id_coordinador',
    ];
    for (const field of requiredFields) {
      if (!formData.value[field]) {
        throw new Error(`El campo '${field}' es requerido.`);
      }
    }
    if (formData.value.detalle_destino_fondos.some(gasto => !gasto.partida || !gasto.descripcion_gasto || gasto.monto <= 0)) {
        throw new Error('Todos los gastos deben tener partida, descripción y un monto mayor a cero.');
    }
    const payload = {
      ...formData.value,
      monto_solicitado: totalMontoSolicitado.value || '',
      id_usuario: usuario.value.id || '',
      id_actividad: idActividad || '',
      id_tarea: idTarea || null,
      detalle_destino_fondos: {
        items: formData.value.detalle_destino_fondos.map((gasto) => ({
          partida: gasto.partida,
          concepto: gasto.descripcion_gasto,
          monto: Number(gasto.monto),
        })),
      },
    };

    console.log('Payload a enviar (JSON):', JSON.stringify(payload,null,2));

    await axios.post(baseurl +'/monitoreo_api/crearSolicitudPagoDirecto/', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    alert('Solicitud enviada con éxito');
    resetForm();
  } catch (error) {
    console.error('Error completo:', error.response?.data || error.message);
    alert(`Error: ${error.response?.data?.message || error.message}`);
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  Object.assign(formData.value, {
  descripcion_actividad: '',
  detalle_destino_fondos: [{ partida: '', descripcion_gasto: '', monto: 0 }],
  forma_pago: '',
  lugar_solicitud: '',
  fecha_solicitud: getCurrentDate(),
  monto_solicitado: 0,
  responsable_elegido: null,
  idresponsable_aprobacion: null,
  responsable_ok: false,
  coordinador_elegido: null,
  idcoordinador_aprobacion: null,
  coordinador_ok: false,
  });
}

// Ciclo de vida
onMounted(async () => {
  await cargarUsuarios();
  cargarDatos()
  cargarSolicitudesDePagoDirecto()
  cargarFormasDePago()
});
</script>

<style scoped>
.v-card {
  max-width: 900px;
  margin: 0 auto;
}
</style>
