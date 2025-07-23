<template>
  <div class="form-container">
    <v-card class="form-card" elevation="2">
      <!-- Form Title -->
      <v-card-title class="text-h5 font-weight-bold">
        Form. F-02:<br> Rendición de Cuentas
      </v-card-title>
      <v-divider></v-divider>

      <!-- Responsable Section -->
      <v-card-subtitle class="text-h6">Responsable del Cargo de Cuenta</v-card-subtitle>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            label="Nombre Completo"
            outlined
            dense
            v-model="responsable.nombre"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Cargo"
            outlined
            dense
            v-model="responsable.cargo"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Documento de Identidad"
            outlined
            dense
            v-model="responsable.documento"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <!-- Cargo de Cuenta Section -->
      <v-card-subtitle class="text-h6">Cargo de Cuenta</v-card-subtitle>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            label="Formulario Número"
            outlined
            dense
            v-model="cargo.formularioNumero"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            label="Cpte. Diario"
            outlined
            dense
            v-model="cargo.comprobanteDiario"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            label="Fecha de Desembolso"
            type="date"
            outlined
            dense
            v-model="cargo.fechaDesembolso"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            label="Monto Asignado"
            type="number"
            outlined
            dense
            v-model="cargo.montoAsignado"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            label="Monto Descargado"
            type="number"
            outlined
            dense
            v-model="cargo.montoDescargado"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            label="Saldo por Reembolsar"
            type="number"
            outlined
            dense
            v-model="cargo.saldoPorReembolsar"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            label="Fuente de Financiamiento"
            outlined
            dense
            v-model="cargo.fuenteFinanciamiento"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            label="Descripción de la Actividad"
            outlined
            dense
            rows="2"
            v-model="cargo.descripcionActividad"
          ></v-textarea>
        </v-col>
        <v-col cols="12">
          <v-text-field
            label="Lugar y Fecha de la Actividad"
            outlined
            dense
            v-model="cargo.lugarFechaActividad"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <!-- Detalle del Gasto Section -->
      <v-card-subtitle class="text-h6">Detalle del Gasto</v-card-subtitle>
          <div class="form-section">
            <v-table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Partida</th>
                  <th>Factura/Recibo</th>
                  <th>Descripcion de Gasto</th>
                  <th>Monto (Bs.)</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(gasto, index) in gastos" :key="index">
                  <td>
                    <v-text-field
                      v-model="gasto.fecha"
                      type="date"
                      hide-details
                      density="compact"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.partida"
                      hide-details
                      density="compact"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="gasto.numero"
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

            <v-btn
              variant="flat"
              class="text-grey-darken-3 bg-white"
              prepend-icon="mdi-plus"
              rounded="lg"
              :elevation="3"
              @click="agregarGasto"
            >
              Agregar Gasto
            </v-btn>
          </div>

      <v-divider class="my-4"></v-divider>

      <!-- Firmas Section -->
      <v-card-subtitle class="text-h6">Firmas</v-card-subtitle>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            label="Responsable"
            outlined
            dense
            v-model="firmas.responsable"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            label="Coordinador"
            outlined
            dense
            v-model="firmas.coordinador"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            label="Contador"
            outlined
            dense
            v-model="firmas.contador"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            label="Administrador"
            outlined
            dense
            v-model="firmas.administrador"
          ></v-text-field>
        </v-col>
      </v-row>

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
          >
          Enviar Solicitud
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'RendicionCuentasForm',
  data() {
    return {
      responsable: {
        nombre: '',
        cargo: '',
        documento: ''
      },
      cargo: {
        formularioNumero: '',
        comprobanteDiario: '',
        fechaDesembolso: '',
        montoAsignado: 0,
        montoDescargado: 0,
        saldoPorReembolsar: 0,
        fuenteFinanciamiento: '',
        descripcionActividad: '',
        lugarFechaActividad: ''
      },
      gastos: [
        { fecha: '', partida: '', numero: '', descripcion: '', monto: 0 }
      ],
      firmas: {
        responsable: '',
        coordinador: '',
        contador: '',
        administrador: ''
      }
    }
  },
  methods: {
    agregarGasto() {
      this.gastos.push({ fecha: '', numero: '', descripcion: '', monto: 0 });
    },
    eliminarGasto(index) {
      if (this.gastos.length > 1) {
        this.gastos.splice(index, 1);
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  width: 100%;
  margin: 0;
  padding: 0;
}

.form-card {
  width: 80%;
  min-width: 80%;
  margin: 0 auto;
  padding: 16px;
}
</style>
