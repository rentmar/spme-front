<template>
  <v-container class="v-container v-locale--is-ltr">
    <v-card class="pa-6">
      <v-card-title class="text-h5 font-weight-bold">
        Formulario F-08:<br> Solicitud de Pago Directo
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <div class="form-section">
            <v-text-field
              v-model="formData.nombre"
              label="Nombre del Solicitante"
              required
            ></v-text-field>
            <v-text-field
              v-model="formData.paterno"
              label="Apellido paterno del Solicitante"
              required
            ></v-text-field>
            <v-text-field
              v-model="formData.materno"
              label="Apellido materno del Solicitante"
              required
            ></v-text-field>
            <v-text-field
              v-model="formData.documento_identidad"
              label="Carnet de Identidad"
              required
            ></v-text-field>
            <v-text-field
              v-model="formData.cargo"
              label="Cargo"
              required
            ></v-text-field>
            <v-textarea
              v-model="formData.descripcion_actividad1"
              label="Descripción de la Actividad"
              bg-color="blue-lighten-5"
              rows="3"
              required
            ></v-textarea>
            <v-text-field
              v-model="formData.fecha_realizacion1"
              label="Fecha de Realización"
              bg-color="blue-lighten-5"
              type="date"
              required
            ></v-text-field>
            <v-textarea
              v-model="formData.objetivo_actividad1"
              label="Objetivo de la Actividad"
              bg-color="blue-lighten-5"
              rows="3"
              required
            ></v-textarea>
            <v-text-field
              v-model="formData.fuente_financiamiento1"
              label="Fuente de Financiamiento"
              bg-color="blue-lighten-5"
              required
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
                  v-model="formData.responsable_elegido"
                  bg-color="blue-lighten-5"
                  :items="responsablesList"
                  item-title="usuario"
                  item-value="id"
                  label="Responsable del Cargo de Cuenta"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" class="d-flex align-center">
                <v-checkbox
                  v-model="formData.responsable_ok"
                  label="Aprobado por Responsable del Cargo de Cuenta"
                  :disabled="isFrozen"
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.coordinador_elegido"
                  bg-color="blue-lighten-5"
                  :items="coordinadoresList"
                  item-title="usuario"
                  item-value="id"
                  label="Coordinador"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" class="d-flex align-center">
                <v-checkbox
                  v-model="formData.coordinador_ok"
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
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useUsuario } from '@/modules/usuarios/composables/useUsuario';

// Utilizando Composition API para una mejor organización
const { usuario, informacionUsuarioPorNick } = useUsuario();

// Estado reactivo
const loading = ref(false);
const paymentMethods = ['Cuenta de Banco', 'Cheque'];
const responsablesList = ref([]);
const coordinadoresList = ref([]);
const formData = ref({
  // nombre: '',
  // paterno: '',
  // materno: '',
  // documento_identidad: '',
  // cargo: '',
  // descripcion: '',
  // fecha_realizacion: '',
  // objetivo_actividad: '',
  // fuente_financiamiento: '',
  // detalle_destino_fondos: [{ partida: '', descripcion: '', monto: 0 }],
  // forma_pago: '',
  // lugar_solicitud: '',
  // fecha_solicitud: getCurrentDate(),
  // responsable_elegido: null,
  // responsable: false,
  // coordinador_elegido: null,
  // coordinador: false,
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
  id_solicitante: 0,
  id_actividad: 0
});

watch(() => formData.value.responsable_elegido, (newId) => {
  formData.value.idresponsable_aprobacion = newId;
});
watch(() => formData.value.coordinador_elegido, (newId) => {
  formData.value.idcoordinador_aprobacion = newId;
});

// Propiedades computadas
const totalMontoSolicitado = computed(() => {
  return formData.value.detalle_destino_fondos.reduce(
    (total, gasto) => total + Number(gasto.monto || 0),
    0
  );
});

const isFrozen = computed(() => {
  if (!usuario.value || !formData.value.coordinador_elegido) {
    return true;
  }
  //return usuario.value.id !== formData.value.coordinador_elegido;
  return true;
});

// Métodos
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
      formData.value.objetivo_actividad = activity.objetivo_actividad;
      formData.value.fecha_realizacion = activity.fecha_actividad;
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
    // Validaciones básicas antes de enviar
    //const requiredFields = ['nombre', 'paterno', 'materno', 'documento_identidad', 'cargo', 'descripcion', 'fecha_realizacion', 'objetivo_actividad', 'fuente_financiamiento', 'lugar_solicitud', 'forma_pago', 'responsable_elegido', 'coordinador_elegido'];
    formData.value.monto_solicitado = totalMontoSolicitado.value;
    formData.value.id_solicitante = usuario.value.id;
    //formData.value.id_actividad = formData.value.id_actividad;
    const requiredFields = ['descripcion_actividad', 'detalle_destino_fondos', 'forma_pago', 'lugar_solicitud', 'fecha_solicitud', 'monto_solicitado', 'idresponsable_aprobacion', 'idcoordinador_aprobacion', 'id_solicitante', 'id_actividad'];
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
      descripcion_actividad: formData.value.descripcion_actividad,
      detalle_destino_fondos: JSON.stringify(formData.value.detalle_destino_fondos),
      forma_pago: formData.value.forma_pago,
      lugar_solicitud: formData.value.lugar_solicitud,
      fecha_solicitud: formData.value.fecha_solicitud,
      monto_solicitado: totalMontoSolicitado.value,
      idresponsable_aprobacion: formData.value.idresponsable_aprobacion,
      idcoordinador_aprobacion: formData.value.idcoordinador_aprobacion,
      responsable_ok: formData.value.responsable_ok,
      coordinador_ok: formData.value.coordinador_ok,
      id_solicitante: usuario.value.id || '',
      id_actividad: formData.value.id_actividad || ''
    };

    delete payload.responsable_elegido;
    delete payload.coordinador_elegido;

    console.log('Payload a enviar (JSON):', payload);

    await axios.post('http://127.0.0.1:8000/monitoreo_api/crearUsuario/', payload, {
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
  await fetchUsers();
  await fetchActivityData();
  await prefillFormData('ACarvajal'); // Reemplaza con tu lógica de autenticación
});
</script>

<style scoped>
.v-card {
  max-width: 900px;
  margin: 0 auto;
}
</style>
