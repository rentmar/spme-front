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
                  v-model="formData.documento_identidad_beneficiario"
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
                <v-text-field v-model="formData.formulario_numero" label="Formulario Número" required readonly></v-text-field>
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
                  v-model="formData.descripcion"
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
                  v-model="formData.idresponsable_elegido"
                  :items="lista_responsables"
                  bg-color="blue-lighten-5"
                  item-title="getNombreCompleto"
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
                  v-model="formData.idcoordinador_elegido"
                  :items="lista_coordinadores"
                  bg-color="blue-lighten-5"
                  item-title="getNombreCompleto"
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
                  v-model="formData.idcontador_elegido"
                  :items="lista_contadores"
                  bg-color="blue-lighten-5"
                  item-title="getNombreCompleto"
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
                  v-model="formData.idadministrador_elegido"
                  :items="lista_administradores"
                  bg-color="blue-lighten-5"
                  item-title="getNombreCompleto"
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
</template>

<script setup>
import * as XLSX from 'xlsx';
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useUsuario } from '@/modules/usuarios/composables/useUsuario';

const { usuario, informacionUsuarioPorNick } = useUsuario();

// Variables de estado
const loading = ref(false);
const isAdmin = ref(false); // Definir el estado isAdmin
const lista_responsables = ref([]);
const lista_coordinadores = ref([]);
const lista_contadores = ref([]);
const lista_administradores = ref([]);
const formData = ref({
  //nombre: '',
  //paterno: '',
  //materno: '',
  //cargo: '',
  //documento_identidad_beneficiario: '',
  //formulario_numero: '',
  cpte_diario: '',
  fecha_desembolso: '',
  //monto_asignado: 0,
  //monto_gastado: 0,
  //fuente_financiamiento: '',
  descripcion: '',
  lugar_actividad: '',
  fecha_actividad: '', //se tiene en db
  detalle_destino_fondos: [{ fecha: '', partida: '', factura_recibo: '', descripcion_gasto: '', monto: 0 }],
  idresponsable_elegido: null,//para enviar datos al backend
  //validacion_responsable: false,
  idcoordinador_elegido: null,
  //validacion_coordinador: false,
  idcontador_elegido: null,
  //validacion_contador: false,
  idadministrador_elegido: null,
  //validacion_administrador: false,
  id_rinde_cuentas: null,
  id_actividad: null,
});

// Propiedades computadas
const saldoPorReembolsar = computed(() => {
  const montoAsignado = Number(formData.value.monto_asignado) || 0;
  const montoGastado = Number(totalMontoGastado.value) || 0;
  return (montoAsignado - montoGastado).toFixed(2);
});

const totalMontoGastado = computed(() => {
  return formData.value.detalle_destino_fondos.reduce(
    (total, gasto) => total + Number(gasto.monto || 0),
    0
  ).toFixed(2);
});

// Watcher para actualizar monto_gastado en formData
watch(totalMontoGastado, (newValue) => {
  formData.value.monto_gastado = Number(newValue);
});


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
// function getCurrentDate() {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, '0');
//   const day = String(today.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }

async function prefillFormData() {
  try {
    await informacionUsuarioPorNick({ usuario: 'ACarvajal' }); // Asume que 'ACarvajal' es el nick del usuario logueado
    if (usuario.value) {
      formData.value.nombre = usuario.value.nombre || '';
      formData.value.paterno = usuario.value.paterno || '';
      formData.value.materno = usuario.value.materno || '';
      formData.value.cargo = usuario.value.cargo || '';
      formData.value.documento_identidad_beneficiario = usuario.value.ci || '';
      //formData.value.id_rinde_cuentas = usuario.value.id || null;
      //isAdmin.value = usuario.value.rol === 'administrador'; // Establece isAdmin
    }
  } catch (err) {
    console.error('Error al pre-llenar los datos del usuario:', err);
  }
}

async function cargarUsuarios() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/autenticacion_api/listaUsuarios/');
    const allUsers = response.data.usuarios;
    lista_responsables.value = allUsers.filter(user => user.rol === 'responsable').map(user => ({ ...user, getNombreCompleto: getNombreCompleto(user) }));
    lista_coordinadores.value = allUsers.filter(user => user.rol === 'coordinador').map(user => ({ ...user, getNombreCompleto: getNombreCompleto(user) }));
    lista_contadores.value = allUsers.filter(user => user.rol === 'contador').map(user => ({ ...user, getNombreCompleto: getNombreCompleto(user) }));
    lista_administradores.value = allUsers.filter(user => user.rol === 'administrador').map(user => ({ ...user, getNombreCompleto: getNombreCompleto(user) }));
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    alert('No se pudieron cargar los usuarios para las firmas. Por favor recargue la página.');
  }
}

async function cargarCargoCuenta() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/autenticacion_api/cargo_cuenta/');
    if (response.data.cuenta && response.data.cuenta.length > 0) {
      const activity = response.data.cuenta[0];
      formData.value.formulario_numero = activity.formulario_numero;
      formData.value.monto_asignado = activity.monto;
      formData.value.fuente_financiamiento = activity.fuente_financiamiento;
      formData.value.id_actividad = activity.id;
    }
  } catch (error) {
    console.error('Error al cargar cargo de cuenta:', error);
    alert('No se pudieron cargar los cargos de cuenta. Por favor recargue la página.');
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
      'descripcion',
      'lugar_actividad',
      'fecha_actividad',
      'detalle_destino_fondos',
      'idresponsable_elegido',
      'idcoordinador_elegido',
      'idcontador_elegido',
      'idadministrador_elegido'
    ];
    for (const field of requiredFields) {
      if (!formData.value[field]) {
        throw new Error(`El campo '${field}' es requerido.`);
      }
    }
    if (formData.value.detalle_destino_fondos.some(gasto => !gasto.partida || !gasto.descripcion_gasto || gasto.monto <= 0)) {
      throw new Error('Todos los gastos deben tener partida, descripción y un monto mayor a cero.');
    }

    // Preparar payload
    const payload = {
      ...formData.value,
      monto_gastado: Number(totalMontoGastado.value),
      detalle_destino_fondos: JSON.stringify(formData.value.detalle_destino_fondos),
      id_rinde_cuentas: formData.value.id_rinde_cuentas || (usuario.value ? usuario.value.id : null),
    };

    console.log('Payload a enviar (JSON):', JSON.stringify(payload, null, 2));

    const response = await axios.post('http://127.0.0.1:8000/monitoreo_api/crearUsuario/', payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    alert('Rendición enviada con éxito');
    exportToExcel(); // Si esta función existe, descomentar
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
    //nombre: '',
    //paterno: '',
    //materno: '',
    //cargo: '',
    //documento_identidad_beneficiario: '',
    //formulario_numero: '',
    cpte_diario: '',
    fecha_desembolso: '',
    //monto_asignado: 0,
    //monto_gastado: 0,
    //fuente_financiamiento: '',
    descripcion: '',
    lugar_actividad: '',
    fecha_actividad: '',
    detalle_destino_fondos: [{ fecha: '', partida: '', factura_recibo: '', descripcion_gasto: '', monto: 0 }],
    idresponsable_elegido: null,
    //validacion_responsable: false,
    idcoordinador_elegido: null,
    //validacion_coordinador: false,
    idcontador_elegido: null,
    //validacion_contador: false,
    idadministrador_elegido: null,
    //validacion_administrador: false,
    //id_rinde_cuentas: null,
    //id_actividad: null,
  });
}

function exportToExcel() {
  const responsable = lista_responsables.value.find(user => user.id === formData.value.idresponsable_elegido);
  const coordinador = lista_coordinadores.value.find(user => user.id === formData.value.idcoordinador_elegido);
  const contador = lista_contadores.value.find(user => user.id === formData.value.idcontador_elegido);
  const administrador = lista_administradores.value.find(user => user.id === formData.value.idadministrador_elegido);
  const mainData = [
    ["Formulario F-02:", "Rendicion de Cuenta"],
    [],
    ["Nombre del Solicitante:", nombreCompletoSolicitante.value],
    ["Documento de Identidad:", formData.value.documento_identidad_beneficiario],
    ["Cargo:", formData.value.cargo],
    ["Formulario Número:", formData.value.formulario_numero],
    ["Cpte. Diario:", formData.value.cpte_diario],
    ["Fecha de Desembolso:", formData.value.fecha_desembolso],
    ["Monto Asignado (Bs.):", formData.value.monto_asignado],
    ["Monto Gastado (Bs.):", formData.value.monto_gastado],
    ["Saldo por Reembolsar (Bs.):", saldoPorReembolsar.value],
    ["Fuente de Financiamiento:", formData.value.fuente_financiamiento],
    ["Descripcion de Actividad:", formData.value.descripcion],
    ["Lugar de Actividad:", formData.value.lugar_actividad],
    ["Fecha de Realizacion de Actividad:", formData.value.fecha_actividad],
    //["Forma de Pago", formData.value.forma_pago],
    //["Lugar de Solicitud", formData.value.lugar_solicitud],
    //["Fecha de Solicitud", getCurrentDate()],
    //["Monto Total Solicitado (Bs.):", totalMontoSolicitado.value],
    ["Responsable:", responsable ? getNombreCompleto(responsable) : ''],
    ["Coordinador:", coordinador ? getNombreCompleto(coordinador) : ''],
    ["Contador:", contador ? getNombreCompleto(contador) : ''],
    ["Administrador:", administrador ? getNombreCompleto(administrador) : ''],
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
  XLSX.writeFile(wb, 'Rendicion_Cuentas_F-02.xlsx');
}

// Hooks de ciclo de vida
onMounted(() => {
  prefillFormData();
  cargarUsuarios();
  cargarCargoCuenta();
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
