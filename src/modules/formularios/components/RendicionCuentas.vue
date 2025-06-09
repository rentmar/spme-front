<template>
  <v-container>
    <v-card class="pa-4" elevation="4">
      <v-card-title class="text-h5 font-weight-bold"
        >Form. F-02 - Rendición de Cuentas</v-card-title
      >

      <!-- Responsable del Cargo de Cuenta -->
      <v-divider class="my-4" />
      <v-card-subtitle class="text-h6">Responsable del Cargo de Cuenta</v-card-subtitle>
      <v-row>
        <v-col cols="12" md="4"
          ><v-text-field label="Nombre Completo" v-model="form.responsable.nombre"
        /></v-col>
        <v-col cols="12" md="4"
          ><v-text-field label="Cargo" v-model="form.responsable.cargo"
        /></v-col>
        <v-col cols="12" md="4"
          ><v-text-field label="Documento de Identidad" v-model="form.responsable.dni"
        /></v-col>
      </v-row>

      <!-- Cargo de Cuenta -->
      <v-divider class="my-4" />
      <v-card-subtitle class="text-h6">Cargo de Cuenta</v-card-subtitle>
      <v-row>
        <v-col cols="12" md="3"
          ><v-text-field label="Formulario Número" v-model="form.cuenta.formulario"
        /></v-col>
        <v-col cols="12" md="3"
          ><v-text-field label="Cpte. Diario" v-model="form.cuenta.comprobante"
        /></v-col>
        <v-col cols="12" md="3"
          ><v-text-field
            label="Fecha de Desembolso"
            type="date"
            v-model="form.cuenta.fechaDesembolso"
        /></v-col>
        <v-col cols="12" md="3"
          ><v-text-field label="Monto Asignado" type="number" v-model="form.cuenta.montoAsignado"
        /></v-col>
        <v-col cols="12" md="4"
          ><v-text-field
            label="Monto Descargado"
            type="number"
            v-model="form.cuenta.montoDescargado"
        /></v-col>
        <v-col cols="12" md="4"
          ><v-text-field label="Saldo por Reembolsar" type="number" v-model="form.cuenta.saldo"
        /></v-col>
        <v-col cols="12" md="4"
          ><v-text-field label="Fuente de Financiamiento" v-model="form.cuenta.fuente"
        /></v-col>
        <v-col cols="12"
          ><v-textarea label="Descripción de la Actividad" v-model="form.cuenta.descripcion"
        /></v-col>
        <v-col cols="12"
          ><v-text-field label="Lugar y Fecha de la Actividad" v-model="form.cuenta.lugarFecha"
        /></v-col>
      </v-row>

      <!-- Detalle del Gasto -->
      <v-divider class="my-4" />
      <v-card-subtitle class="text-h6">Detalle del Gasto</v-card-subtitle>
      <v-simple-table dense>
        <thead>
          <tr>
            <th>#</th>
            <th>Partida</th>
            <th>Factura</th>
            <th>Descripción</th>
            <th>Importe</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(gasto, i) in form.gastos" :key="i">
            <td>{{ i + 1 }}</td>
            <td><v-text-field dense v-model="gasto.partida" /></td>
            <td><v-text-field dense v-model="gasto.factura" /></td>
            <td><v-text-field dense v-model="gasto.descripcion" /></td>
            <td><v-text-field dense type="number" v-model="gasto.importe" /></td>
            <td>
              <v-btn icon @click="removeGasto(i)"><v-icon>mdi-delete</v-icon></v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-btn color="primary" class="mt-2" @click="addGasto">Agregar Gasto</v-btn>

      <!-- Firmas -->
      <v-divider class="my-4" />
      <v-card-subtitle class="text-h6">Firmas</v-card-subtitle>
      <v-row>
        <v-col cols="12" md="3"><v-text-field label="Responsable" /></v-col>
        <v-col cols="12" md="3"><v-text-field label="Coordinador" /></v-col>
        <v-col cols="12" md="3"><v-text-field label="Contador" /></v-col>
        <v-col cols="12" md="3"><v-text-field label="Administrador" /></v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  responsable: {
    nombre: '',
    cargo: '',
    dni: '',
  },
  cuenta: {
    formulario: '',
    comprobante: '',
    fechaDesembolso: '',
    montoAsignado: '',
    montoDescargado: '',
    saldo: '',
    descripcion: '',
    lugarFecha: '',
    fuente: '',
  },
  gastos: [],
})

function addGasto() {
  form.value.gastos.push({ partida: '', factura: '', descripcion: '', importe: 0 })
}

function removeGasto(index) {
  form.value.gastos.splice(index, 1)
}
</script>

<style scoped>
.v-card-subtitle {
  font-weight: 600;
}
</style>
