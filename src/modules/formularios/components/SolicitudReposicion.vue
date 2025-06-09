// src/components/FormularioF03.vue
<template>
  <v-container class="py-6">
    <v-card elevation="3" class="pa-6">
      <v-card-title class="text-h5 font-weight-bold mb-4"
        >Form. F-03 - Solicitud de Reposición</v-card-title
      >

      <!-- DATOS DEL SOLICITANTE -->
      <v-divider class="my-4" />
      <v-subheader class="text-h6">Datos del Solicitante</v-subheader>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field label="Nombre Completo del Solicitante" v-model="form.nombre" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Cargo" v-model="form.cargo" />
        </v-col>
        <v-col cols="12">
          <v-text-field
            label="Aprobado por Coordinador o Dirección Ejecutiva"
            v-model="form.aprobadoPor"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea label="Descripción de la Actividad" v-model="form.descripcionActividad" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Fecha de Realización" v-model="form.fechaRealizacion" type="date" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="Objetivo de la Actividad" v-model="form.objetivo" />
        </v-col>
        <v-col cols="12">
          <v-text-field label="Fuente de Financiamiento" v-model="form.fuenteFinanciamiento" />
        </v-col>
      </v-row>

      <!-- DETALLE DEL DESTINO DE FONDOS -->
      <v-divider class="my-4" />
      <v-subheader class="text-h6">Detalle del Destino de Fondos</v-subheader>
      <v-simple-table dense>
        <thead>
          <tr>
            <th>Partida</th>
            <th>Descripción del Gasto</th>
            <th>Monto</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.detalleFondos" :key="index">
            <td><v-text-field v-model="item.partida" /></td>
            <td><v-text-field v-model="item.descripcion" /></td>
            <td><v-text-field v-model="item.monto" type="number" /></td>
            <td>
              <v-btn icon @click="removeFila(index)"><v-icon>mdi-delete</v-icon></v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-btn class="mt-2" @click="addFila" color="primary" variant="outlined">Agregar Fila</v-btn>

      <!-- ACLARACIONES -->
      <v-divider class="my-4" />
      <v-subheader class="text-h6">Aclaraciones - Reembolso a Cuenta Bancaria</v-subheader>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field label="Nombre del Beneficiario" v-model="form.beneficiario.nombre" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Documento de Identidad" v-model="form.beneficiario.documento" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Nombre del Banco" v-model="form.beneficiario.banco" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Número de Cuenta" v-model="form.beneficiario.cuenta" />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            label="Tipo de Cuenta"
            :items="['Cuenta Corriente', 'Caja de Ahorro']"
            v-model="form.beneficiario.tipoCuenta"
          />
        </v-col>
      </v-row>

      <!-- FIRMAS Y FECHA -->
      <v-divider class="my-4" />
      <v-subheader class="text-h6">Firmas y Fecha</v-subheader>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field label="Firma del Beneficiario" v-model="form.firmaBeneficiario" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Firma del Coordinador" v-model="form.firmaCoordinador" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Lugar de la Solicitud" v-model="form.lugar" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Fecha de la Solicitud" v-model="form.fecha" type="date" />
        </v-col>
      </v-row>

      <v-divider class="my-6" />
      <v-btn color="success" @click="submitForm">Enviar Solicitud</v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  nombre: '',
  cargo: '',
  aprobadoPor: '',
  descripcionActividad: '',
  fechaRealizacion: '',
  objetivo: '',
  fuenteFinanciamiento: '',
  detalleFondos: [{ partida: '', descripcion: '', monto: 0 }],
  beneficiario: {
    nombre: '',
    documento: '',
    banco: '',
    cuenta: '',
    tipoCuenta: '',
  },
  firmaBeneficiario: '',
  firmaCoordinador: '',
  lugar: '',
  fecha: '',
})

const addFila = () => {
  form.detalleFondos.push({ partida: '', descripcion: '', monto: 0 })
}

const removeFila = (index) => {
  form.detalleFondos.splice(index, 1)
}

const submitForm = () => {
  console.log('Formulario enviado:', JSON.stringify(form, null, 2))
  alert('Formulario enviado')
}
</script>

<style scoped>
.v-subheader {
  font-weight: bold;
}
</style>
