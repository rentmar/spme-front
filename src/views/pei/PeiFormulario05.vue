<template>
  <div class="v-container v-locale--is-ltr">
    <div class="v-card v-theme--light v-card--density-default v-card--variant-elevated pa-6">
      <div class="v-card-title text-h5 font-weight-bold">
        Formulario F-05:<br> Solicitud de Viaje (Participacion en Eventos)
      </div>

      <div class="v-card-text">
        <form class="v-form" novalidate @submit.prevent="submitForm">
          <!-- Sección de información básica -->
          <div class="form-section">
            <v-text-field
              v-model="formData.nombre"
              label="Nombre del Seminario, curso, taller o reunión"
              required
            ></v-text-field>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData1.fecha_inicio"
                  label="Fecha de inicio"
                  type="date"
                  required
                  :max="formData1.fecha_fin"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData1.fecha_fin"
                  label="Fecha de fin"
                  type="date"
                  required
                  :min="formData1.fecha_inicio"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-text-field
              v-model="formData.lugar"
              label="Lugar de realización"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.organizaciones"
              label="Organizaciones Participantes"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.organizador"
              label="Institución que invita"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.padrinos"
              label="Quien cubre los gastos de estadía, transporte y viáticos"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.padrinos"
              label="Requiere fondos de UNITAS (Especificar para qué gastos)"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.padrinos"
              label="Persona que presenta la solicitud"
              required
            ></v-text-field>

            <v-textarea
              v-model="formData.descripcion"
              label="Justificación de la importancia de asistir al evento y su relación con el trabajo que desarrolla"
              rows="3"
              required
            ></v-textarea>

            <v-textarea
              v-model="formData.objetivo_actividad"
              label="Tareas previas que debe cumplir para asistir al evento"
              rows="3"
              required
            ></v-textarea>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Sección de detalle de fondos -->
          <div class="form-section">
            <h3>Detalle del Destino de Fondos</h3>

            <br>
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
              <span class="text-caption text-grey">Monto Total Solicitado (Bs.): {{ formData.monto_solicitado }}</span>
            </v-card-title>


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
                      hide-details
                      density="compact"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.descripcion"
                      hide-details
                      density="compact"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.monto"
                      type="number"
                      hide-details
                      density="compact"
                      @input="calcularMontoTotal"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-btn
                      variant="text"
                      icon
                      color="error"
                      @click="eliminarGasto(index)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <v-divider class="my-4"></v-divider>

          <v-row justify="center" class="my-4">
            <v-col cols="auto" class="px-2">
              <v-btn
                variant="flat"
                class="text-grey-darken-3 bg-white"
                rounded="lg"
                :elevation="3"
                @click="activeForm = 'deposito'"
                :class="{ 'active-btn': activeForm === 'deposito' }"
              >
                Deposito de Cuenta
              </v-btn>
            </v-col>

            <v-col cols="auto" class="px-2">
              <v-btn
                variant="flat"
                class="text-grey-darken-3 bg-white"
                rounded="lg"
                :elevation="3"
                @click="activeForm = 'cheque'"
                :class="{ 'active-btn': activeForm === 'cheque' }"
              >
                Cheque Bancario
              </v-btn>
            </v-col>
          </v-row>

          <!-- Formulario de Depósito -->
          <div v-if="activeForm === 'deposito'" class="form-section">
            <h3>Aclaraciones (Depósito a Cuenta Bancaria)</h3>
            <!-- Aquí va el contenido del formulario de depósito -->

            <v-text-field
              v-model="formData.beneficiario"
              label="Nombre del Beneficiario"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.documento_identidad_beneficiario"
              label="Documento de Identidad"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.banco"
              label="Nombre del Banco"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.numero_cuenta"
              label="Número de Cuenta"
              required
            ></v-text-field>

            <v-select
              v-model="formData.tipo_cuenta"
              :items="tiposCuenta"
              label="Tipo de Cuenta"
              required
            ></v-select>
          </div>

          <!-- Formulario de Cheque -->
          <div v-else-if="activeForm === 'cheque'" class="form-section">
            <h3>Formulario de Cheque Bancario</h3>
            <!-- Aquí va el contenido del formulario de cheque -->
            <v-text-field
              v-model="formData.beneficiario"
              label="Nombre del Beneficiario"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.documento_identidad_beneficiario"
              label="Documento de Identidad"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.banco"
              label="Nombre del Banco"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.numero_cuenta"
              label="Número de Cuenta"
              required
            ></v-text-field>

            <v-select
              v-model="formData.tipo_cuenta"
              :items="tiposCuenta"
              label="Tipo de Cuenta"
              required
            ></v-select>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Sección de lugar y fecha -->
          <div class="form-section">
            <v-text-field
              v-model="formData.lugar_solicitud"
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

          <!-- Sección de firmas -->
          <div class="form-section">
            <div class="v-card-subtitle text-subtitle-1">Firmas</div>
            <br>

              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                  v-model="formData.responsable_aprobacion"
                  :items="responsableCuenta"
                  item-title="usuario"
                  item-value="id"
                  label="Responsable del Cargo de Cuenta"
                  required
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-checkbox
                  v-model="formData.responsable"
                  label="Aprobado por Responsable del Cargo de Cuenta"
                  ></v-checkbox>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                  v-model="formData.coordinador_aprobacion"
                  :items="coordinador"
                  item-title="usuario"
                  item-value="id"
                  label="Coordinador"
                  required
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-checkbox
                  v-model="formData.coordinador"
                  label="Aprobado por Coordinador"
                  ></v-checkbox>
                </v-col>
              </v-row>
          </div>

          <!-- Botones de acción -->
          <div class="d-flex justify-end mt-4">
            <v-btn
              color="error"
              prepend-icon="mdi-backspace-outline"
              @click="resetForm"
            >
              Limpiar
            </v-btn>

            <v-btn
              color="primary"
              prepend-icon="mdi-file-document-arrow-right"
              @click="submitForm"
              :loading="loading"
            >
              Enviar Solicitud
            </v-btn>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FormularioF01',
  data() {
    return {
      activeForm: 'deposito', // Por defecto muestra el formulario de depósito
      tiposCuenta: ['Ahorros', 'Corriente'],
      responsableCuenta: [],
      coordinador: [],
      loading: false,
      formData1: {
        fecha_inicio: '',
        fecha_fin: ''
      },
      formData: {
        nombre: '',
        paterno:'',
        materno:'',
        cargo: '',
        aprobador: '',
        descripcion: '',
        fecha_realizacion: '',
        objetivo_actividad: '',
        fuente_financiamiento: '',
        detalle_destino_fondos: [
          { partida: '', descripcion: '', monto: 0 }
        ],
        beneficiario: '',
        documento_identidad_beneficiario: '',
        banco: '',
        numero_cuenta: '',
        tipo_cuenta: '',
        lugar_solicitud: '',
        fecha_solicitud: '',
        monto_solicitado: 0,
        responsable_aprobacion: '',
        responsable: false,
        coordinador_aprobacion: '',
        coordinador: false
      }
    }
  },
  async created() {
    await this.cargarUsuarios();
  },
  methods: {
    async cargarUsuarios() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/autenticacion_api/listaUsuarios/');
        // Asignamos los mismos usuarios a responsables y coordinadores
        // (puedes modificar esto si necesitas filtrarlos de alguna manera)
        this.responsableCuenta = response.data.usuarios;
        this.coordinador = response.data.usuarios;
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        alert('No se pudieron cargar los usuarios. Por favor recargue la página.');
      }
    },
    agregarGasto() {
      this.formData.detalle_destino_fondos.push({ partida: '', descripcion: '', monto: 0 });
      this.calcularMontoTotal();
    },
    eliminarGasto(index) {
      if (this.formData.detalle_destino_fondos.length > 1) {
        this.formData.detalle_destino_fondos.splice(index, 1);
        this.calcularMontoTotal();
      }
    },
    calcularMontoTotal() {
      this.formData.monto_solicitado = this.formData.detalle_destino_fondos.reduce(
        (total, gasto) => total + Number(gasto.monto || 0),
        0
      );
    },

    async submitForm(){
      this.loading = true;
      try{
        // Validar campos requeridos
        if (!this.formData.nombre || !this.formData.documento_identidad_beneficiario) {
          throw new Error('Por favor complete todos los campos requeridos');
        }
        // Preparar payload exactamente como lo espera el backend
        const payload = {
          nombre: this.formData.nombre,
          paterno: this.formData.paterno,
          materno: this.formData.materno,
          cargo: this.formData.cargo,
          aprobador: this.formData.aprobador,
          descripcion: this.formData.descripcion,
          fecha_realizacion: this.formData.fecha_realizacion,
          objetivo_actividad: this.formData.objetivo_actividad,
          fuente_financiamiento: this.formData.fuente_financiamiento,
          detalle_destino_fondos: "detalleDestinoFondos",
          beneficiario: this.formData.beneficiario,
          documento_identidad_beneficiario: this.formData.documento_identidad_beneficiario,
          banco: this.formData.banco,
          numero_cuenta: this.formData.numero_cuenta,
          tipo_cuenta: this.formData.tipo_cuenta === 'Ahorros' ? 'AHO' : 'COR',
          lugar_solicitud: this.formData.lugar_solicitud,
          fecha_solicitud: this.formData.fecha_solicitud,
          monto_solicitado: parseFloat(this.formData.monto_solicitado),
          responsable_aprobacion: false, //this.formData.responsable_aprobacion,
          responsable: this.formData.responsable ? 1 : 0,
          coordinador_aprobacion: false, //this.formData.coordinador_aprobacion,
          coordinador: this.formData.coordinador ? 1 : 0
        };

        console.log('Payload a enviar (JSON):', JSON.stringify(payload, null, 2));

        // Enviar la solicitud a la API
        const response = await axios.post(
          'http://127.0.0.1:8000/monitoreo_api/crearSolicitudFondos/',
          payload,
          {
            headers:{
              'Content-Type': 'application/json'
            }
          }
        );

        // Mostrar mensaje de éxito
        alert('Solicitud enviada con éxito');
        this.resetForm();
      } catch (error) {
        console.error('Error completo:', error.response?.data || error.message);
        alert(`Error: ${error.response?.data?.message || error.message}`);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      // Reiniciar el formulario
      this.formData = {
        nombre: '',
        paterno:'',
        materno:'',
        cargo: '',
        aprobador: '',
        descripcion: '',
        fecha_realizacion: '',
        objetivo_actividad: '',
        fuente_financiamiento: '',
        detalle_destino_fondos: [
          { partida: '', descripcion: '', monto: 0 }
        ],
        beneficiario: '',
        documento_identidad_beneficiario: '',
        banco: '',
        numero_cuenta: '',
        tipo_cuenta: '',
        lugar_solicitud: '',
        fecha_solicitud: '',
        monto_solicitado: 0,
        responsable_aprobacion: '',
        responsable: false,
        coordinador_aprobacion: '',
        coordinador: false
      };
    }
  }
}
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
