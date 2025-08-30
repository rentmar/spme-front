<template>
  <ProyectoHeader :proyecto="proyectoData" :activar-detalles="false" :activar-editar="false"/>
  <ActividadInformacion :actividad="actividadData" class="mx-auto" style="max-width: 900px;"/>
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
            <v-textarea bg-color="blue-lighten-5" label="Descripción de la Actividad" rows="3" required></v-textarea>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.fecha_irealizacion" label="Inicio de Fecha de Realización" type="date" required readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="formData.fecha_frealizacion" label="fin de Fecha de Realización" type="date" required readonly></v-text-field>
              </v-col>
            </v-row>
            <v-textarea bg-color="blue-lighten-5" label="Objetivo de la Actividad" rows="3" required></v-textarea>
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
          <v-select v-model="formData.forma_pago" :items="formasPagoOptions" item-title="formaPago" item-value="id" label="Forma de Pago" bg-color="blue-lighten-5" required class="mb-4"></v-select>
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
   {{ "******************" }}
  {{ datosFormulario }}
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import ProyectoHeader from '@/modules/proyecto/components/partials/ProyectoHeader.vue';
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'

//import axios from 'axios';
import * as XLSX from 'xlsx';
import { useRoute } from 'vue-router';

const route = useRoute();
const idActividad = route.params.id || null;
const idTarea = route.query.tarea_id || null;
console.log('ID de Actividad desde la ruta:', idActividad);
console.log('ID de Tarea:', idTarea);

//variables para carga de datos
const datosFormulario = ref(null);
const error = ref(null);
const isLoading = ref(false);

// Estado reactivo
const loading = ref(false);
const form = ref(null);
//const paymentMethods = ['Cuenta de Banco', 'Cheque'];
const responsablesList = ref([]);
const coordinadoresList = ref([]);

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
  fuente_financiamiento: '',
  id_actividad: 0,
  id_usuario: 0,
// Resto de campos del formulario
  detalle_destino_fondos: [{ partida: '', descripcion_gasto: '', monto: 0 }],
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
  titulo: 'Formulario F-01: Solicitud de Fondos',
  codigo: 'F-01',
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
   return `${formData.value.nombre} ${formData.value.paterno} ${formData.value.materno}`.trim();
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
    }

    // Llenar formas de pago si existen
    if (newVal.formaPago && Array.isArray(newVal.formaPago)) {
      console.log('Formas de pago disponibles:', newVal.formaPago);
      // Si necesitas actualizar paymentMethods
    }
  }
}, { deep: true });

const formasPagoOptions = computed(() => {
  if (datosFormulario.value && datosFormulario.value.formaPago) {
    return datosFormulario.value.formaPago;
  }
  return [];
});

// 6. Para la función exportToExcel, necesitas obtener el texto de la forma de pago:
const formasPagoTexto = computed(() => {
  if (formData.value.forma_pago && formasPagoOptions.value.length > 0) {
    const formaPago = formasPagoOptions.value.find(fp => fp.id === formData.value.forma_pago);
    return formaPago ? formaPago.formaPago : '';
  }
  return '';
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
    // Transformar los datos al formato esperado por el endpoint
    const payload = {
      detalle_destino_fondos: JSON.stringify({
        items: formData.value.detalle_destino_fondos.map(gasto => ({
          concepto: gasto.descripcion_gasto,
          monto: Number(gasto.monto)
        }))
      }),
      forma_pago: formData.value.forma_pago, // Asegúrate de que esto sea el índice numérico
      lugar_solicitud: formData.value.lugar_solicitud,
      fecha_solicitud: formData.value.fecha_solicitud,
      monto_solicitado: totalMontoSolicitado.value,
      validacion_responsable: formData.value.validacion_responsable,
      id_responsable: formData.value.idresponsable,
      validacion_coordinador: formData.value.validacion_coordinador,
      id_coordinador: formData.value.idcoordinador,
      id_usuario: formData.value.id_usuario,
      actividad: {
        id_actividad: formData.value.id_actividad,
        descripcion_actividad: formData.value.descripcion_actividad,
        objetivo_actividad: formData.value.objetivo_actividad
      },
      id_tarea: idTarea || null // Agregar el id_tarea si está disponible
    };

    // alert('Solicitud enviada con éxito');
    const response = await fetch('http://127.0.0.1:8000/api/monitoreo/crear-solicitud-fondos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Si necesitas autenticación, agrega:
        // 'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    exportToExcel();
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    //resetForm();
    return data;
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
  // 1. Crear datos principales con formato de formulario
  const mainData = [
    ["FORMULARIO F-01: SOLICITUD DE FONDOS EN AVANCE CON CARGO A RENDICIÓN DE CUENTA", "", "", ""],
    [""],
    ["INFORMACIÓN DEL SOLICITANTE", "", "", ""],
    ["Nombre Completo:", nombreCompletoSolicitante.value, "", ""],
    ["Documento de Identidad:", formData.value.documento_identidad, "", ""],
    ["Cargo:", formData.value.cargo, "", ""],
    [""],
    ["INFORMACIÓN DE LA ACTIVIDAD", "", "", ""],
    ["Descripción:", formData.value.descripcion_actividad, "", ""],
    ["Fecha Inicio:", formData.value.fecha_irealizacion, "Fecha Fin:", formData.value.fecha_frealizacion],
    ["Objetivo:", formData.value.objetivo_actividad, "", ""],
    ["Fuente de Financiamiento:", formData.value.fuente_financiamiento, "", ""],
    [""],
    ["INFORMACIÓN DE LA SOLICITUD", "", "", ""],
    ["Forma de Pago:", formasPagoTexto.value, "", ""],
    ["Lugar de Solicitud:", formData.value.lugar_solicitud, "", ""],
    ["Fecha de Solicitud:", getCurrentDate1(), "", ""],
    ["Monto Total Solicitado:", `Bs. ${totalMontoSolicitado.value.toLocaleString()}`, "", ""],
    [""],
    ["FIRMAS Y VALIDACIONES", "", "", ""],
    ["Responsable:", nombreResponsableElegido.value, "Aprobado:", formData.value.validacion_responsable ? "✓" : "✗"],
    ["Coordinador:", nombreCoordinadorElegido.value, "Aprobado:", formData.value.validacion_coordinador ? "✓" : "✗"],
    [""],
    ["DETALLE DEL DESTINO DE FONDOS", "", "", ""]
  ];

  // 2. Encabezados de la tabla de gastos
  const expensesHeaders = ["PARTIDA", "DESCRIPCIÓN DEL GASTO", "MONTO (BS.)", "OBSERVACIONES"];

  // 3. Datos de gastos
  const expensesData = formData.value.detalle_destino_fondos.map((gasto) => [
    gasto.partida,
    gasto.descripcion_gasto,
    gasto.monto,
    "" // Columna vacía para observaciones
  ]);

  // 4. Total al final de la tabla
  const totalRow = ["TOTAL", "", totalMontoSolicitado.value, ""];

  // 5. Crear workbook
  const wb = XLSX.utils.book_new();

  // 6. Hoja principal con formato de formulario
  const wsMain = XLSX.utils.aoa_to_sheet([
    ...mainData,
    expensesHeaders,
    ...expensesData,
    totalRow
  ]);

  // 7. Aplicar estilos y formatos
  applyExcelStyles(wsMain, mainData.length, expensesData.length, formData.value.descripcion_actividad, formData.value.objetivo_actividad);

  // 8. Agregar hoja al workbook y guardar
  XLSX.utils.book_append_sheet(wb, wsMain, 'Solicitud de Fondos');
  XLSX.writeFile(wb, `Solicitud_Fondos_F-01_${getCurrentDate1()}.xlsx`);
}

function applyExcelStyles(worksheet, mainDataRows, expensesRows, descripcionActividad, objetivoActividad) {
  // Definir rangos para aplicar estilos
  // const ranges = {
  //   title: "A1:D1",
  //   sectionHeaders: ["A3:D3", "A8:D8", "A13:D13", "A19:D19", `A${22 + mainDataRows}:D${22 + mainDataRows}`],
  //   dataCells: `A4:D${20 + mainDataRows + expensesRows}`
  // };

  // Configurar anchos de columnas
  worksheet['!cols'] = [
    { wch: 30 }, // Columna A
    { wch: 40 }, // Columna B
    { wch: 20 }, // Columna C
    { wch: 25 }  // Columna D
  ];

  // Aplicar estilos a celdas específicas
  if (!worksheet['!merges']) worksheet['!merges'] = [];

  // Fusionar celdas para títulos y secciones
  worksheet['!merges'].push(
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Título principal
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, // Información del solicitante
    { s: { r: 7, c: 0 }, e: { r: 7, c: 3 } }, // Información de la actividad
    { s: { r: 12, c: 0 }, e: { r: 12, c: 3 } }, // Información de la solicitud
    { s: { r: 18, c: 0 }, e: { r: 18, c: 3 } }, // Firmas y validaciones
    { s: { r: 21 + mainDataRows, c: 0 }, e: { r: 21 + mainDataRows, c: 3 } } // Detalle de fondos
  );

  // Aplicar formatos a celdas específicas
  Object.keys(worksheet).forEach(cellAddress => {
    if (cellAddress !== '!ref' && cellAddress !== '!merges' && cellAddress !== '!cols') {
      const cell = worksheet[cellAddress];
      const cellRef = XLSX.utils.decode_cell(cellAddress);

      // Estilo para títulos y encabezados de sección
      if (cellRef.r === 0 ||
          cellRef.r === 2 ||
          cellRef.r === 7 ||
          cellRef.r === 12 ||
          cellRef.r === 18 ||
          cellRef.r === 21 + mainDataRows) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 },
          fill: { fgColor: { rgb: "4472C4" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }

      // Estilo para etiquetas
      else if (cellRef.c === 0 && cellRef.r > 0 && cellRef.r < 21 + mainDataRows) {
        cell.s = {
          font: { bold: true, color: { rgb: "000000" } },
          fill: { fgColor: { rgb: "D9E1F2" } }
        };
      }

      // Estilo para encabezados de tabla
      else if (cellRef.r === 22 + mainDataRows) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "5B9BD5" } },
          alignment: { horizontal: "center" }
        };
      }

      // Estilo para la fila total
      else if (cellRef.r === 23 + mainDataRows + expensesRows) {
        cell.s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "F2F2F2" } }
        };
      }

      // Formato de moneda para columna de montos (columna C)
      else if (cellRef.c === 2 && cellRef.r >= 23 + mainDataRows && cellRef.r <= 22 + mainDataRows + expensesRows) {
        cell.z = '"Bs." #,##0.00';
      }

      // Formato de fecha para celdas de fecha
      else if ((cell.v && typeof cell.v === 'string' && cell.v.match(/\d{4}-\d{2}-\d{2}/)) ||
               (cellRef.c === 2 && cellRef.r === 9)) {
        cell.z = 'dd/mm/yyyy';
      }
            // Estilo específico para la celda de descripción de actividad (B9)
      if (cellRef.r === 8 && cellRef.c === 1) {
        if (!cell.s) cell.s = {};
        cell.s.alignment = cell.s.alignment || {};
        cell.s.alignment.wrapText = true;
        cell.s.alignment.vertical = "top";
      }

      // Estilo específico para la celda de objetivo de actividad (B11)
      if (cellRef.r === 10 && cellRef.c === 1) {
        if (!cell.s) cell.s = {};
        cell.s.alignment = cell.s.alignment || {};
        cell.s.alignment.wrapText = true;
        cell.s.alignment.vertical = "top";
      }
    }
  });

  // Agregar bordes a la tabla de gastos
  const tableStartRow = 22 + mainDataRows;
  const tableEndRow = 23 + mainDataRows + expensesRows;

  for (let r = tableStartRow; r <= tableEndRow; r++) {
    for (let c = 0; c < 4; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: "" };
      if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
      worksheet[cellAddress].s.border = {
        top: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } }
      };
    }
  }
    // Ajustar altura de filas para las celdas con texto largo
  if (!worksheet['!rows']) worksheet['!rows'] = [];

  // Ajustar altura de la fila de descripción (fila 9)
  if (descripcionActividad && descripcionActividad.length > 100) {
    worksheet['!rows'][8] = { hpt: 60 }; // Altura aproximada para 3-4 líneas de texto
  }

  // Ajustar altura de la fila de objetivo (fila 11)
  if (objetivoActividad && objetivoActividad.length > 100) {
    worksheet['!rows'][10] = { hpt: 60 }; // Altura aproximada para 3-4 líneas de texto
  }
}

function getCurrentDate1() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

// Ciclo de vida
onMounted(async () => {
  await cargarDatos();
});
</script>

<style scoped>
.v-card {
  max-width: 900px;
  margin: 0 auto;
}
</style>
