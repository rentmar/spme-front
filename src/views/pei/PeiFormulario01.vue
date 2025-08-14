<template>
  <v-container class="v-container v-locale--is-ltr">
    <v-card class="pa-6">
      <v-card-title class="text-h5 font-weight-bold">
        Formulario F-01:<br> Solicitud de Fondos en Avance con Cargo a Rendición de Cuenta
      </v-card-title>
      <v-divider class="my-4"></v-divider>
      <v-card-text>
        <v-form ref="form" @submit.prevent="submitForm">
          <div class="form-section">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.nombre" label="Nombre del Solicitante" required readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.paterno" label="Apellido paterno del Solicitante" required readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.materno" label="Apellido materno del Solicitante" required readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.documento_identidad" label="Carnet de Identidad" required readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.cargo" label="Cargo" required readonly></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="my-4"></v-divider>
            <v-textarea v-model="formData.descripcion_actividad" label="Descripción de la Actividad" rows="3" required readonly></v-textarea>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.fecha_irealizacion" label="Inicio de Fecha de Realización" type="date" required readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.fecha_frealizacion" label="fin de Fecha de Realización" type="date" required readonly></v-text-field>
              </v-col>
            </v-row>
            <v-textarea v-model="formData.objetivo_actividad" label="Objetivo de la Actividad" rows="3" required readonly></v-textarea>
            <v-text-field v-model="formData.fuente_financiamiento" label="Fuente de Financiamiento" required readonly></v-text-field>
          </div>
          <v-divider class="my-4"></v-divider>
          <div class="form-section">
            <h3 class="mb-4">Detalle del Destino de Fondos</h3>
            <div class="d-flex justify-space-between align-center mb-4">
              <v-btn variant="flat" class="text-grey-darken-3 bg-white" rounded="lg" :elevation="3" @click="addGasto">
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
                    <v-text-field v-model="gasto.partida" bg-color="blue-lighten-5" hide-details density="compact"></v-text-field>
                  </td>
                  <td>
                    <v-text-field v-model="gasto.descripcion_gasto" bg-color="blue-lighten-5" hide-details density="compact"></v-text-field>
                  </td>
                  <td>
                    <v-text-field v-model.number="gasto.monto" bg-color="blue-lighten-5" type="number" hide-details density="compact" min="0"></v-text-field>
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
          <v-select v-model="formData.forma_pago" :items="paymentMethods" label="Forma de Pago" bg-color="blue-lighten-5" required class="mb-4"></v-select>
          <div class="form-section">
            <v-text-field v-model="formData.lugar_solicitud" bg-color="blue-lighten-5" label="Lugar de la Solicitud" required></v-text-field>
            <v-text-field v-model="formData.fecha_solicitud" label="Fecha de la Solicitud" type="date" required readonly></v-text-field>
          </div>
          <v-divider class="my-4"></v-divider>
          <div class="form-section">
            <div class="text-subtitle-1 font-weight-bold mb-2">Firmas</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="formData.idresponsable" bg-color="blue-lighten-5" :items="responsablesList" :item-title="getNombreCompleto" item-value="id" label="Responsable del Cargo de Cuenta" required></v-select>
              </v-col>
              <v-col cols="12" md="6" class="d-flex align-center">
                <v-checkbox v-model="formData.validacion_responsable" label="Aprobado por Responsable del Cargo de Cuenta" :disabled="isFrozen"></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="formData.idcoordinador" bg-color="blue-lighten-5" :items="coordinadoresList" :item-title="getNombreCompleto" item-value="id" label="Coordinador" required></v-select>
              </v-col>
              <v-col cols="12" md="6" class="d-flex align-center">
                <v-checkbox v-model="formData.validacion_coordinador" label="Aprobado por Coordinador" :disabled="isFrozen"></v-checkbox>
              </v-col>
            </v-row>
          </div>
          <div class="d-flex justify-end mt-4">
            <v-btn color="error" class="mr-2" prepend-icon="mdi-backspace-outline" @click="resetForm">
              Limpiar
            </v-btn>
            <v-btn color="primary" prepend-icon="mdi-file-document-arrow-right" type="submit" :loading="loading">
              Enviar Solicitud
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { formulariosServicios } from '@/modules/formularios/services/formulariosServices';
import { useUsuario } from '@/modules/usuarios/composables/useUsuario';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useRoute } from 'vue-router';

const route = useRoute();
const idActividad = route.params.id || null;
console.log('ID de Actividad desde la ruta:', idActividad);

// Utilizando Composition API para una mejor organización
const { usuario, informacionUsuarioPorNick } = useUsuario();

// Estado reactivo
const loading = ref(false);
const form = ref(null);
const paymentMethods = ['Cuenta de Banco', 'Cheque'];
const responsablesList = ref([]);
const coordinadoresList = ref([]);
const formData = ref({
  detalle_destino_fondos: [{ partida: '', descripcion_gasto: '', monto: 0 }],
  forma_pago: '',
  lugar_solicitud: '',
  fecha_solicitud: getCurrentDate(),
  monto_solicitado: 0,
  validacion_responsable: false,
  idresponsable: null,
  validacion_coordinador: false,
  idcoordinador: null,
  id_usuario: 0,
  id_actividad: 0
});

// Propiedades computadas
const nombreCoordinadorElegido = computed(() => {
  const coordinador = coordinadoresList.value.find(
    (user) => user.id === formData.value.idcoordinador
  );
  return coordinador ? getNombreCompleto(coordinador) : '';
});

const nombreResponsableElegido = computed(() => {
  const responsable = responsablesList.value.find(
    (user) => user.id === formData.value.idresponsable
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
  const nombre = usuario.value?.nombre || '';
  const paterno = usuario.value?.paterno || '';
  const materno = usuario.value?.materno || '';
  return `${nombre} ${paterno} ${materno}`.trim();
});

const isFrozen = computed(() => {
  // Esta lógica puede ser ajustada según tus necesidades.
  // Podrías basarla en el rol del usuario, si la solicitud ya fue enviada, etc.
  return false;
});

// Métodos
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
      formData.value.nombre = usuario.value.nombre || '';
      formData.value.paterno = usuario.value.paterno || '';
      formData.value.materno = usuario.value.materno || '';
      formData.value.cargo = usuario.value.cargo || '';
      formData.value.documento_identidad = usuario.value.ci || '';
      formData.value.id_usuario = usuario.value.id || 0;
    }
  } catch (err) {
    console.error('Error al pre-llenar los datos del usuario:', err);
  }
}

async function fetchUsers() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/autenticacion_api/listaUsuarios/');
    const allUsers = response.data.usuarios;
    responsablesList.value = allUsers.filter(user => user.rol === 'responsable');
    coordinadoresList.value = allUsers.filter(user => user.rol === 'coordinador');
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
      formData.value.descripcion_actividad = activity.descripcion_actividad;
      formData.value.objetivo_actividad = activity.objetivo_actividad;
      formData.value.fecha_irealizacion = activity.fecha_iactividad;
      formData.value.fecha_frealizacion = activity.fecha_factividad;
      formData.value.fuente_financiamiento = activity.fuente_financiamiento;
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
    // Validar si el formulario está completo
    if (!formData.value.lugar_solicitud || !formData.value.forma_pago || !formData.value.idresponsable || !formData.value.idcoordinador) {
        throw new Error('Por favor, completa todos los campos obligatorios del formulario.');
    }

    if (totalMontoSolicitado.value <= 0) {
        throw new Error('El monto total solicitado debe ser mayor a cero.');
    }

    const payload = {
      detalle_destino_fondos: JSON.stringify(formData.value.detalle_destino_fondos),
      forma_pago: paymentMethods.indexOf(formData.value.forma_pago) + 1,
      lugar_solicitud: formData.value.lugar_solicitud,
      fecha_solicitud: formData.value.fecha_solicitud,
      monto_solicitado: totalMontoSolicitado.value,
      validacion_responsable: formData.value.validacion_responsable,
      id_responsable: formData.value.idresponsable,
      validacion_coordinador: formData.value.validacion_coordinador,
      id_coordinador: formData.value.idcoordinador,
      id_usuario: formData.value.id_usuario,
      id_actividad: formData.value.id_actividad,
    };

    // Aquí usamos la función del servicio importado
    const respuesta = await formulariosServicios.crearSolitudFondos(payload);
    console.log('Solicitud enviada con éxito:', respuesta.data);

    // Puedes resetear el formulario y exportar el Excel después de un éxito
    exportToExcel();
    //resetForm();

    alert('Solicitud enviada con éxito');
  } catch (error) {
    console.error('Error completo:', error.response?.data || error.message);
    alert(`Error: ${error.response?.data?.mensaje || error.message}`);
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  Object.assign(formData.value, {
    // Restablecer los datos del formulario a su estado inicial
    detalle_destino_fondos: [{ partida: '', descripcion_gasto: '', monto: 0 }],
    forma_pago: '',
    lugar_solicitud: '',
    fecha_solicitud: getCurrentDate(),
    monto_solicitado: 0,
    validacion_responsable: false,
    idresponsable: null,
    validacion_coordinador: false,
    idcoordinador: null,
    id_usuario: 0,
    id_actividad: 0,
  });
}

function exportToExcel() {
  const mainData = [
    ["Formulario F-01:", "Solicitud de Fondos en Avance con Cargo a Rendicion de Cuenta"],
    [],
    ["Nombre del Solicitante:", nombreCompletoSolicitante.value],
    ["Documento de Identidad:", formData.value.documento_identidad],
    ["Cargo:", formData.value.cargo],
    ["Descripcion de Actividad:", formData.value.descripcion_actividad],
    ["Inicio de Fecha de Actividad:", formData.value.fecha_irealizacion],
    ["Fin de Fecha de Actividad:", formData.value.fecha_frealizacion],
    ["Objetivo de la Actividad:", formData.value.objetivo_actividad],
    ["Fuente de Financiamiento:", formData.value.fuente_financiamiento],
    ["Forma de Pago", formData.value.forma_pago],
    ["Lugar de Solicitud", formData.value.lugar_solicitud],
    ["Fecha de Solicitud", getCurrentDate()],
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
  XLSX.writeFile(wb, 'Solicitud_Fondos_F-01.xlsx');
}

// Ciclo de vida
onMounted(async () => {
  await fetchUsers();
  await fetchActivityData();
  await prefillFormData('ACarvajal');
});
</script>

<style scoped>
.v-card {
  max-width: 900px;
  margin: 0 auto;
}
</style>
