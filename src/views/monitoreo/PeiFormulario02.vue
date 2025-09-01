<template>
   <ProyectoHeader :proyecto="proyectoData" :activar-detalles="false" :activar-editar="false"/>
  <ActividadInformacion :actividad="actividadData" class="mx-auto" style="max-width: 900px;"/>
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
                <v-text-field v-model="formData.formulario_numero" label="Formulario Número" bg-color="blue-lighten-5" required></v-text-field>
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
                  v-model="formData.total_reportado"
                  label="Monto Asignado (Bs.)"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="totalMontoGastado"
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
                <v-select v-model="formData.idresponsable" bg-color="blue-lighten-5" :items="responsablesList" :item-title="getNombreCompleto" item-value="id" label="Responsable del Cargo de Cuenta" required></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox v-model="formData.validacion_responsable" label="Aprobado por Responsable del Cargo de Cuenta" :disabled="isFrozen"></v-checkbox>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="formData.idcoordinador" bg-color="blue-lighten-5" :items="coordinadoresList" :item-title="getNombreCompleto" item-value="id" label="Coordinador" required></v-select>
              </v-col>
              <v-col cols="12" md="6">
                 <v-checkbox v-model="formData.validacion_coordinador" label="Aprobado por Coordinador" :disabled="isFrozen"></v-checkbox>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="formData.idcontador" bg-color="blue-lighten-5" :items="contadoresList" :item-title="getNombreCompleto" item-value="id" label="Contador" required></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox v-model="formData.validacion_contador" label="Aprobado por Contador" :disabled="isFrozen"></v-checkbox>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="formData.idadministrador" bg-color="blue-lighten-5" :items="administradoresList" :item-title="getNombreCompleto" item-value="id" label="Administrador" required></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox v-model="formData.validacion_administrador" label="Aprobado por Administrador" :disabled="isFrozen"></v-checkbox>
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
   <!-- {{ "******************" }}
  {{ datosFormulario }} -->
</template>

<script setup>

import { ref, onMounted, computed, watch } from 'vue';
import ProyectoHeader from '@/modules/proyecto/components/partials/ProyectoHeader.vue';
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'


import * as XLSX from 'xlsx';
import { useRoute } from 'vue-router';
const route = useRoute();
const idActividad = route.params.id || null;
const idTarea = route.query.tarea_id || null;
console.log('ID de Actividad desde la ruta:', idActividad);
console.log('ID de Tarea:', idTarea);
import { formulariosServicios } from '@/modules/formularios/services/formulariosServices';

const datosFormulario = ref(null);
const error = ref([null]);
const isLoading =ref([false]);
const responsablesList = ref([]);
const coordinadoresList = ref([]);
const contadoresList = ref([]);
const administradoresList = ref([]);

// Variables de estado
const loading = ref(false);
//const isAdmin = ref(false); // Definir el estado isAdmin
const lista_responsables = ref([]);
const lista_coordinadores = ref([]);
const lista_contadores = ref([]);
const lista_administradores = ref([]);

const formData = ref({
// Campos del usuario (se llenarán automáticamente)
  nombre: '',
  paterno: '',
  materno: '',
  cargo: '',
  documento_identidad: '',
// Campos de la actividad
  formulario_numero: '',
  descripcion_actividad: '',
  objetivo_actividad: '',
  fecha_irealizacion: '',
  fecha_frealizacion: '',
  total_reportado:'',
  fuente_financiamiento: '',
  id_actividad: 0,
  id_usuario: 0,
// Resto de campos del formulario
  detalle_destino_fondos: [{ fecha: '', partida: '', factura_recibo: '', descripcion_gasto: '', monto: 0 }],
  forma_pago: null,
  lugar_solicitud: '',
  fecha_solicitud: getCurrentDate(),
  monto_solicitado: 0,
  validacion_responsable: false,
  idresponsable: null,
  validacion_coordinador: false,
  idcoordinador: null,
});

const proyectoData = ref({
  titulo: 'Formulario F-02: Rendicion de Cuentas',
  codigo: 'F-02',
  estado: 'en_proceso', // o el estado que corresponda
  fecha_inicio: new Date().toISOString().split('T')[0],
  fecha_finalizacion: new Date().toISOString().split('T')[0],
  creado_por: 'Usuario Actual', // o el nombre correspondiente
  presupuesto: '0.00', // o el presupuesto correspondiente
  instancia_gestora: [], // array de IDs de instancias gestoras si las tienes
  pei: null // ID del PEI si corresponde
});
const actividadData = ref({
  codigo: 'ACT-2023-005',
  descripcion: 'Capacitación en gestión de proyectos para equipos técnicos',
  estado: 'EJEC',
  tipo: [{ nombre: 'Actividad de Capacitación' }, { nombre: 'Actividad de Articulación' }],
  fecha_programada: '2023-05-15',
  fecha_cierre: '2023-06-30',
  responsable: { nombre: 'María González' },
  presupuesto: 2500,
});

// Propiedades computadas
const saldoPorReembolsar = computed(() => {
  const montoAsignado = Number(formData.value.total_reportado) || 0;
  const montoGastado = Number(totalMontoGastado.value) || 0;
  return (montoAsignado - montoGastado).toFixed(2);
});

const totalMontoGastado = computed(() => {
  return formData.value.detalle_destino_fondos.reduce(
    (total, gasto) => total + Number(gasto.monto || 0),
    0
  ).toFixed(2);
});

const isFrozen = computed(() => {
  // Esta lógica puede ser ajustada según tus necesidades.
  // Podrías basarla en el rol del usuario, si la solicitud ya fue enviada, etc.
  return true;
});

// ✅ WATCH PARA AUTO-LLENAR FORMULARIO CUANDO LLEGUEN LOS DATOS
watch(datosFormulario, (newVal) => {
  if (newVal && newVal.usuario) {
    console.log('Auto-llenando formulario con datos del usuario:', newVal.usuario);

    const usuario = newVal.usuario;

    // Llenar campos del usuario
    formData.value.nombre = usuario.nombre || '';
    formData.value.paterno = usuario.paterno || '';
    formData.value.materno = usuario.materno || '';
    formData.value.cargo = usuario.cargo || '';
    formData.value.documento_identidad = usuario.ci || '';
    formData.value.id_usuario = usuario.id || 0;

    // Llenar campos de la actividad si existen
    if (newVal.actividad) {
      console.log('Auto-llenando datos de actividad:', newVal.actividad);

      formData.value.descripcion_actividad = newVal.actividad.descripcion || '';
      formData.value.objetivo_actividad = newVal.actividad.objetivo_de_actividad || '';
      formData.value.fecha_irealizacion = newVal.actividad.fecha_inicio || '';
      formData.value.fecha_frealizacion = newVal.actividad.fecha_cierre || '';
      formData.value.id_actividad = newVal.actividad.id || 0;
      formData.value.total_reportado = newVal.actividad.totalReportado || '';
      formData.value.fuente_financiamiento = newVal.actividad.procedencia_fondos || '';
      //formData.value.forma_pago = newVal.formaPago || '';
    if (newVal.formaPago && Array.isArray(newVal.formaPago)) {
      console.log('Formas de pago disponibles:', newVal.formaPago);
      // Si quieres preseleccionar la primera opción por defecto:
      // formData.value.forma_pago1 = newVal.formaPago[0]?.id || null;
    };
      // También actualizar actividadData para el componente ActividadInformacion
      actividadData.value = {
        ...actividadData.value,
        descripcion: newVal.actividad.descripcion || actividadData.value.descripcion,
        fecha_programada: newVal.actividad.fecha_inicio || actividadData.value.fecha_programada,
        fecha_cierre: newVal.actividad.fecha_cierre || actividadData.value.fecha_cierre
      };
    }

    // Llenar lista de validadores si existen
    if (newVal.validadores && Array.isArray(newVal.validadores)) {
      console.log('Cargando validadores:', newVal.validadores);
      // responsablesList.value = newVal.validadores;
      // coordinadoresList.value = newVal.validadores;
      responsablesList.value = newVal.validadores.filter(user => user.cargo === 'responsable');
      coordinadoresList.value = newVal.validadores.filter(user => user.cargo === 'coordinador');
      contadoresList.value = newVal.validadores.filter(user => user.cargo === 'contador');
      administradoresList.value = newVal.validadores.filter(user => user.cargo === 'administrador');
    }

    // Llenar formas de pago si existen
    if (newVal.formaPago && Array.isArray(newVal.formaPago)) {
      console.log('Formas de pago disponibles:', newVal.formaPago);
      // Si necesitas actualizar paymentMethods
    }
  }
}, { deep: true });


// Métodos
function getNombreCompleto(user) {
  return `${user.nombre || ''} ${user.paterno || ''} ${user.materno || ''}`.trim();
}

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function cargarDatos() {
  isLoading.value = true;
  error.value = null;
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
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`);
    }

    const data = await response.json();
    datosFormulario.value = data;
    console.log('Datos cargados exitosamente:', datosFormulario.value);

  } catch (err) {
    error.value = err.message;
    console.error('Ha ocurrido un error:', err);
  } finally {
    isLoading.value = false;
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

    // Preparar payload para la rendición de cuentas con todos los campos necesarios
    const payload = {
      // Campos de la rendición de cuentas
      //id_usuario:
      num_formulario: formData.value.formulario_numero,
      cpte_diario: formData.value.cpte_diario,
      fecha_desembolso: formData.value.fecha_desembolso,
      descripcion: formData.value.descripcion,
      lugar_actividad: formData.value.lugar_actividad,
      fecha_actividad: formData.value.fecha_actividad,
      monto_asignado: Number(formData.value.monto_asignado),
      monto_gastado: Number(totalMontoGastado.value),
      monto_descargado: Number(formData.value.monto_descargado), // Asegúrate de que esto se llene correctamente
      saldo: Number(saldoPorReembolsar.value), // O el saldo que el backend necesite
      id_actividad: formData.value.id_actividad,
      fuente_financiamiento: formData.value.fuente_financiamiento,

      // Detalle de los gastos
      detalle_destino_fondos: JSON.stringify(formData.value.detalle_destino_fondos),

      // Validaciones y responsables
      validacion_responsable: formData.value.validacion_responsable,
      id_responsable: formData.value.idresponsable,
      validacion_coordinador: formData.value.validacion_coordinador,
      id_coordinador: formData.value.idcoordinador,
      validacion_contador: formData.value.validacion_contador,
      id_contador: formData.value.idcontador,
      validacion_administrador: formData.value.validacion_administrador,
      id_administrador: formData.value.idadministrador,

      // ID del usuario
      //id_usuario: formData.value.id_usuario || (usuario.value ? usuario.value.id : null),
    };

    console.log('Payload a enviar:', payload);

    // Usar la función del servicio importado para la rendición de cuentas
    const respuesta = await formulariosServicios.crearRendicionCuentas(payload);
    console.log('Rendición enviada con éxito:', respuesta.data);

    alert('Rendición enviada con éxito');
    exportToExcel();
    resetForm();
  } catch (error) {
    console.error('Error completo:', error.response?.data || error.message);
    alert(`Error: ${error.response?.data?.mensaje || error.message}`);
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  Object.assign(formData.value, {
    cpte_diario: '',
    fecha_desembolso: '',
    descripcion: '',
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
  const responsable = lista_responsables.value.find(user => user.id === formData.value.idresponsable);
  const coordinador = lista_coordinadores.value.find(user => user.id === formData.value.idcoordinador);
  const contador = lista_contadores.value.find(user => user.id === formData.value.idcontador);
  const administrador = lista_administradores.value.find(user => user.id === formData.value.idadministrador);
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

onMounted(async () => {
  await cargarDatos();
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
