<template>
  <v-container class="py-6">
    <v-card elevation="3" class="pa-6">
      <!-- Título del formulario -->
      <v-card-title class="text-h5 font-weight-bold mb-4">
        Form. F-03:<br> Solicitud de Reposición
      </v-card-title>
      <v-divider class="my-4"></v-divider>

      <!-- Sección 1: Datos del Solicitante -->
      <v-subheader class="text-h6">Datos del Solicitante</v-subheader>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.solicitante.nombre"
            label="Nombre Completo del Solicitante"
            variant="filled"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.solicitante.cargo"
            label="Cargo"
            variant="filled"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="form.solicitante.aprobadoPor"
            label="Aprobado por Coordinador o Dirección Ejecutiva"
            variant="filled"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="form.descripcionActividad"
            label="Descripción de la Actividad"
            variant="filled"
            rows="3"
            density="compact"
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.fechaRealizacion"
            label="Fecha de Realización"
            type="date"
            variant="filled"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="form.objetivoActividad"
            label="Objetivo de la Actividad"
            variant="filled"
            rows="3"
            density="compact"
          ></v-textarea>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="form.fuenteFinanciamiento"
            label="Fuente de Financiamiento"
            variant="filled"
            density="compact"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <!-- Sección 2: Detalle del Destino de Fondos -->
          <div class="form-section">
            <div class="v-card-subtitle text-subtitle-1">Detalle del Destino de Fondos</div>

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
                <tr v-for="(gasto, index) in form.gastos" :key="index">
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

      <!-- Sección 3: Aclaraciones - Reembolso a Cuenta Bancaria -->
      <v-subheader class="text-h6">
        Aclaraciones - Reembolso a Cuenta Bancaria
      </v-subheader>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.beneficiario.nombre"
            label="Nombre del Beneficiario"
            variant="filled"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.beneficiario.documento"
            label="Documento de Identidad"
            variant="filled"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.beneficiario.banco"
            label="Nombre del Banco"
            variant="filled"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.beneficiario.cuenta"
            label="Número de Cuenta"
            variant="filled"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="form.beneficiario.tipoCuenta"
            label="Tipo de Cuenta"
            :items="tiposCuenta"
            variant="filled"
            density="compact"
          ></v-select>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <!-- Sección 4: Firmas y Fecha -->
      <v-subheader class="text-h6">Firmas y Fecha</v-subheader>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.firmas.beneficiario"
            label="Firma del Beneficiario"
            variant="filled"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.firmas.coordinador"
            label="Firma del Coordinador"
            variant="filled"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.firmas.lugar"
            label="Lugar de la Solicitud"
            variant="filled"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.firmas.fecha"
            label="Fecha de la Solicitud"
            type="date"
            variant="filled"
            density="compact"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <!-- Botón de envío -->
      <v-btn color="success" @click="enviarSolicitud">
        Enviar Solicitud
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      tiposCuenta: ['Ahorros', 'Corriente'],
      form: {
        solicitante: {
          nombre: '',
          cargo: '',
          aprobadoPor: ''
        },
        descripcionActividad: '',
        fechaRealizacion: '',
        objetivoActividad: '',
        fuenteFinanciamiento: '',
        gastos: [
          {
            partida: '',
            descripcion: '',
            monto: 0
          }
        ],
        beneficiario: {
          nombre: '',
          documento: '',
          banco: '',
          cuenta: '',
          tipoCuenta: ''
        },
        firmas: {
          beneficiario: '',
          coordinador: '',
          lugar: '',
          fecha: ''
        }
      }
    }
  },
  methods: {
    agregarGasto() {
      this.form.gastos.push({
        partida: '',
        descripcion: '',
        monto: 0
      });
    },
    eliminarGasto(index) {
      this.form.gastos.splice(index, 1)
    },
    enviarSolicitud() {
      // Lógica para enviar el formulario
      console.log('Formulario enviado:', this.form)
      // Aquí podrías agregar una llamada API o validación adicional
    }
  }
}
</script>

<style scoped>
/* Estilos personalizados si son necesarios */
</style>
