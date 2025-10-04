<template>
  <v-container class="v-container v-locale--is-ltr">
    <v-card id="formulario-pdf" class="pa-6">
      <!-- <v-card-title class="text-h5 font-weight-bold">
        Formulario F-05:<br> Solicitud de Viaje (Participación en Eventos)
      </v-card-title> -->

      <PaginaTituloIcono
        :titulo="'Solicitud de Viaje'"
        :icon="'mdi-file-document-multiple'"
      ></PaginaTituloIcono>
      <br />
      <ProyectoIdHeader
        v-if="datosFormulario"
        :proyecto-id="datosFormulario.actividad.proyecto"
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
            <v-text-field
              v-model="formData.evento"
              label="Nombre del Seminario, curso, taller o reunión"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.fecha_inicio"
                  label="Fecha de inicio"
                  bg-color="blue-lighten-5"
                  type="date"
                  required
                  :max="formData.fecha_fin"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.fecha_fin"
                  label="Fecha de fin"
                  bg-color="blue-lighten-5"
                  type="date"
                  required
                  :min="formData.fecha_inicio"
                ></v-text-field>
              </v-col>
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
              v-model="nombreCompletoSolicitante"
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
                      min="0"
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
            :items="paymentMethods"
            label="Forma de Pago"
            bg-color="blue-lighten-5"
            required
            class="mb-4"
          ></v-select>

          <div class="form-section">
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
            ></v-text-field>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="form-section">
            <div class="text-subtitle-1 font-weight-bold mb-2">Firmas</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.idresponsable_elegido"
                  bg-color="blue-lighten-5"
                  :items="responsablesList"
                  :item-title="getNombreCompleto"
                  item-value="id"
                  label="Responsable del Cargo de Cuenta"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" class="d-flex align-center">
                <v-checkbox
                  v-model="formData.validacion_responsable"
                  label="Aprobado por Responsable del Cargo de Cuenta"
                  :disabled="isFrozen"
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.idcoordinador_elegido"
                  bg-color="blue-lighten-5"
                  :items="coordinadoresList"
                  :item-title="getNombreCompleto"
                  item-value="id"
                  label="Coordinador"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" class="d-flex align-center">
                <v-checkbox
                  v-model="formData.validacion_coordinador"
                  label="Aprobado por Coordinador"
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
  <pre>{{ datosFormulario }}</pre>
</template>

<script setup>
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useUsuario } from '@/modules/usuarios/composables/useUsuario';

import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
const idActividad = route.params.id || null
const idTarea = route.query.tarea_id || null
console.log('ID de Actividad:', idActividad)
console.log('ID de Tarea:', idTarea)


// ===================================
//  COMPOSABLES
// ===================================
const { usuario, informacionUsuarioPorNick } = useUsuario();

// ===================================
//  ESTADO REACTIVO
// ===================================
const loading = ref(false);
const paymentMethods = ['Cuenta de Banco', 'Cheque'];
const responsablesList = ref([]);
const coordinadoresList = ref([]);

const cargandoGeneral = ref(true)

//variables para carga de datos
const datosFormulario = ref(null)
const error = ref(null)
const isLoading = ref(false)

const formData = ref({
  nombre: '',
  paterno: '',
  materno: '',
  evento: '',
  fecha_inicio: '',
  fecha_fin: '',
  lugar_evento: '',
  instituciones_participantes: '',
  institucion_queinvita: '',//organizador
  quien_cubregastos: '',
  justificacion_asistencia: '',
  tareas_previas: '',
  detalle_destino_fondos: [{ partida: '', descripcion_gasto: '', monto: 0 }],//
  forma_pago: '',
  lugar_solicitud: '',
  fecha_solicitud: getCurrentDate(),
  idresponsable_elegido: null,
  validacion_responsable: false,
  idcoordinador_elegido: null,
  validacion_coordinador: false,
  id_solicitante: 0,
  id_actividad: 0,//
});

// ===================================
//  PROPIEDADES COMPUTADAS
// ===================================
const nombreCoordinadorElegido = computed(() => {
  const coordinador = coordinadoresList.value.find(
    (user) => user.id === formData.value.idcoordinador_elegido
  );
  return coordinador ? getNombreCompleto(coordinador) : '';
});

const nombreResponsableElegido = computed(() => {
  const responsable = responsablesList.value.find(
    (user) => user.id === formData.value.idresponsable_elegido
  );
  return responsable ? getNombreCompleto(responsable) : '';
});

const totalMontoSolicitado = computed(() => {
  return formData.value.detalle_destino_fondos.reduce(
    (total, gasto) => total + Number(gasto.monto || 0),
    0
  );
});

const nombreCompletoSolicitante = computed(() => {
  const nombre = datosFormulario.usuario.nombre || '';
  const paterno = datosFormulario.value?.paterno || '';
  const materno = datosFormulario.value?.materno || '';
  return `${nombre} ${paterno} ${materno}`.trim();
});

const isFrozen = computed(() => {
  if (!usuario.value || !formData.value.idcoordinador_elegido) {
    return true;
  }
  return true;
});

watch(
  datosFormulario,
  (newVal) => {
    if (newVal && newVal.usuario) {
      console.log('Auto-llenando formulario con datos del usuario:', newVal.usuario)

      const usuario = newVal.usuario

      // Llenar campos del usuario
      formData.value.nombre = usuario.nombre || ''
      formData.value.paterno = usuario.paterno || ''
      formData.value.materno = usuario.materno || ''
      // formData.value.cargo = usuario.cargo || ''
      // formData.value.documento_identidad = usuario.ci || ''
      // formData.value.id_usuario = usuario.id || 0

      // Llenar campos de la actividad si existen
      // if (newVal.actividad) {
      //   console.log('Auto-llenando datos de actividad:', newVal.actividad)

      //   formData.value.descripcion_actividad = newVal.actividad.descripcion || ''
      //   formData.value.objetivo_actividad = newVal.actividad.objetivo_de_actividad || ''
      //   formData.value.fecha_irealizacion = newVal.actividad.fecha_inicio || ''
      //   formData.value.fecha_frealizacion = newVal.actividad.fecha_cierre || ''
      //   formData.value.id_actividad = newVal.actividad.id || 0
      //   formData.value.fuente_financiamiento = newVal.actividad.procedencia_fondos || ''


      //   if (newVal.formaPago && Array.isArray(newVal.formaPago)) {
      //     console.log('Formas de pago disponibles:', newVal.formaPago)
      //   }

      //   // También actualizar actividadData para el componente ActividadInformacion
      //   actividadData.value = {
      //     ...actividadData.value,
      //     descripcion: newVal.actividad.descripcion || actividadData.value.descripcion,
      //     fecha_programada: newVal.actividad.fecha_inicio || actividadData.value.fecha_programada,
      //     fecha_cierre: newVal.actividad.fecha_cierre || actividadData.value.fecha_cierre,
      //   }
      // }

      // Llenar lista de validadores si existen
      // if (newVal.validadores && Array.isArray(newVal.validadores)) {
      //   console.log('Cargando validadores:', newVal.validadores)
      //   responsablesList.value = newVal.validadores.filter((user) => user.cargo === 'responsable')
      //   coordinadoresList.value = newVal.validadores.filter((user) => user.cargo === 'coordinador')
      // }
    }
  },
  { deep: true },
)

// ===================================
//  MÉTODOS
// ===================================
function getNombreCompleto(user) {
  return `${user.nombre} ${user.paterno} ${user.materno}`.trim();
}

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function prefillFormData(nick) {
  try {
    await informacionUsuarioPorNick({ usuario: nick });
    if (usuario.value) {
      // Se eliminan estas asignaciones ya que ya se pre-llenan con la propiedad computada
      // formData.value.nombre = usuario.value.nombre || '';
      // formData.value.paterno = usuario.value.paterno || '';
      // formData.value.materno = usuario.value.materno || '';
    }
  } catch (err) {
    console.error('Error al pre-llenar los datos del usuario:', err);
  }
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
        id_actividad: 1,//idActividad,
        usuario: 'chave',//usuario.value.nombre,
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

async function fetchUsers() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/autenticacion_api/listaUsuarios/');
    const allUsers = response.data.usuarios;
    responsablesList.value = allUsers.filter((user) => user.rol === 'responsable');
    coordinadoresList.value = allUsers.filter((user) => user.rol === 'coordinador');
  } catch (error) {
    console.error('Error al cargar la lista de usuarios:', error);
    alert('No se pudieron cargar los usuarios para las firmas. Por favor recargue la página.');
  }
}

async function fetchActivityData() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/autenticacion_api/datos_actividad/');
    if (response.data.desglosePresupuesto.length > 0) {
      const activity = response.data.desglosePresupuesto[0];
      formData.value.id_actividad = activity.id;
    }
  } catch (error) {
    console.error('Error al cargar actividades:', error);
    alert('No se pudieron cargar las actividades. Por favor recargue la página.');
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
    formData.value.id_solicitante = usuario.value.id;

    const requiredFields = [
      'evento',
      'fecha_inicio',
      'fecha_fin',
      'lugar_evento',
      'instituciones_participantes',
      'institucion_queinvita',
      'quien_cubregastos',
      'justificacion_asistencia',
      'tareas_previas',
      'detalle_destino_fondos',
      'forma_pago',
      'lugar_solicitud',
      'fecha_solicitud',
      'idresponsable_elegido',
      'idcoordinador_elegido',
      'id_solicitante',
      'id_actividad',
    ];

    for (const field of requiredFields) {
      if (!formData.value[field]) {
        throw new Error(`El campo '${field}' es requerido.`);
      }
    }

    if (
      formData.value.detalle_destino_fondos.some(
        (gasto) => !gasto.partida || !gasto.descripcion_gasto || gasto.monto <= 0
      )
    ) {
      throw new Error('Todos los gastos deben tener partida, descripción y un monto mayor a cero.');
    }

    const payload = {
      ...formData.value,
      monto_solicitado: totalMontoSolicitado.value,
      detalle_destino_fondos: JSON.stringify(formData.value.detalle_destino_fondos),
    };

    console.log('Payload a enviar (JSON):', payload);

    await axios.post('http://127.0.0.1:8000/monitoreo_api/crearUsuario/', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    alert('Solicitud enviada con éxito');
    exportToExcel();
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
    evento: '',
    fecha_inicio: '',
    fecha_fin: '',
    lugar_evento: '',
    instituciones_participantes: '',
    institucion_queinvita: '',
    quien_cubregastos: '',
    justificacion_asistencia: '',
    tareas_previas: '',
    detalle_destino_fondos: [{ partida: '', descripcion_gasto: '', monto: 0 }],
    forma_pago: '',
    lugar_solicitud: '',
    fecha_solicitud: getCurrentDate(),
    idresponsable_elegido: null,
    validacion_responsable: false,
    idcoordinador_elegido: null,
    validacion_coordinador: false,
    id_solicitante: 0,
    id_actividad: 0,
  });
}

function exportToExcel() {
  const mainData = [
    ["Formulario F-05:", "Solicitud de Viaje (Participacion en Eventos)"],
    [],
    ["Nombre del Evento:", formData.value.evento],
    ["Fecha de inicio:", formData.value.fecha_inicio],
    ["Fecha de fin:", formData.value.fecha_fin],
    ["Lugar del evento:", formData.value.lugar_evento],
    ["Instituciones Participantes:", formData.value.instituciones_participantes],
    ["Institución que invita:", formData.value.institucion_queinvita],
    ["Quien cubre los gastos:", formData.value.quien_cubregastos],
    ["Nombre del Solicitante:", nombreCompletoSolicitante.value],
    ["Justificación de asistencia:", formData.value.justificacion_asistencia],
    ["Tareas previas:", formData.value.tareas_previas],
    ["Forma de pago:", formData.value.forma_pago],
    ["Lugar de la Solicitud:", formData.value.lugar_solicitud],
    ["Fecha de la Solicitud:", getCurrentDate()],
    ["Monto Total Solicitado (Bs.):", totalMontoSolicitado.value],
    ["Responsable:", nombreResponsableElegido.value],
    ["Coordinador:", nombreCoordinadorElegido.value],
  ];

  const expensesHeaders = ["Partida", "Descripción del Gasto", "Monto (Bs.)"];
  const expensesData = formData.value.detalle_destino_fondos.map((gasto) => [
    gasto.partida,
    gasto.descripcion_gasto,
    gasto.monto,
  ]);

  const wb = XLSX.utils.book_new();
  const wsMain = XLSX.utils.aoa_to_sheet(mainData);
  const wsExpenses = XLSX.utils.aoa_to_sheet([expensesHeaders, ...expensesData]);

  XLSX.utils.book_append_sheet(wb, wsMain, 'Solicitud Principal');
  XLSX.utils.book_append_sheet(wb, wsExpenses, 'Detalle de Gastos');

  wsExpenses['!cols'] = [{ wch: 15 }, { wch: 40 }, { wch: 15 }];
  XLSX.writeFile(wb, 'Solicitud_Fondos_F-05.xlsx');
}

async function generatePDFFromHTML() {
  const element = document.getElementById('formulario-pdf');
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const availableWidth = pageWidth;
  const imgProps = pdf.getImageProperties(imgData);
  const imgHeight = (imgProps.height * availableWidth) / imgProps.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, availableWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, availableWidth, imgHeight);
    heightLeft -= pageHeight;
  }
  pdf.save('formulario-completo.pdf');
}

// ===================================
//  CICLO DE VIDA
// ===================================
onMounted(async () => {
  await fetchUsers();
  //await fetchActivityData();
  await prefillFormData('ACarvajal');
  cargarDatos()
});
</script>

<style scoped>
.v-card {
  max-width: 900px;
  margin: 0 auto;
}
</style>
