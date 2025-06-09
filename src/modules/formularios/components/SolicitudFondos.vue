// File: components/FormF01.vue
<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-title class="text-h5 font-weight-bold"
        >Formulario F-01: Solicitud de Fondos en Avance con Cargo a Rendición de
        Cuenta</v-card-title
      >
      <v-card-text>
        <v-form>
          <v-text-field label="Nombre Completo del Solicitante" v-model="form.nombre" />
          <v-text-field label="Cargo" v-model="form.cargo" />
          <v-text-field
            label="Aprobado por (Coordinador o Dirección Ejecutiva)"
            v-model="form.aprobado"
          />
          <v-textarea label="Descripción de la Actividad" v-model="form.descripcionActividad" />
          <v-text-field label="Fecha de Realización" v-model="form.fecha" type="date" />
          <v-textarea label="Objetivo de la Actividad" v-model="form.objetivo" />
          <v-text-field label="Fuente de Financiamiento" v-model="form.financiamiento" />

          <v-divider class="my-4" />
          <v-card-subtitle class="text-subtitle-1">Detalle del Destino de Fondos</v-card-subtitle>
          <v-simple-table>
            <thead>
              <tr>
                <th>Partida</th>
                <th>Descripción del Gasto</th>
                <th>Monto</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form.detalleFondos" :key="index">
                <td><v-text-field v-model="item.partida" /></td>
                <td><v-text-field v-model="item.descripcion" /></td>
                <td><v-text-field v-model="item.monto" type="number" /></td>
                <td>
                  <v-btn icon @click="removeDetalle(index)"><v-icon>mdi-delete</v-icon></v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-btn class="my-2" @click="addDetalle">Agregar Gasto</v-btn>

          <v-divider class="my-4" />
          <v-card-subtitle class="text-subtitle-1"
            >Aclaraciones (Depósito a Cuenta Bancaria)</v-card-subtitle
          >
          <v-text-field label="Nombre del Beneficiario" v-model="form.beneficiario.nombre" />
          <v-text-field label="Documento de Identidad" v-model="form.beneficiario.documento" />
          <v-text-field label="Nombre del Banco" v-model="form.beneficiario.banco" />
          <v-text-field label="Número de Cuenta" v-model="form.beneficiario.cuenta" />
          <v-select
            label="Tipo de Cuenta"
            :items="['Cuenta Corriente', 'Caja de Ahorro']"
            v-model="form.beneficiario.tipoCuenta"
          />

          <v-divider class="my-4" />
          <v-text-field label="Lugar de la Solicitud" v-model="form.lugar" />
          <v-text-field label="Fecha de la Solicitud" v-model="form.fechaSolicitud" type="date" />

          <v-divider class="my-4" />
          <v-card-subtitle class="text-subtitle-1">Firmas</v-card-subtitle>
          <v-text-field
            label="Firma del Responsable del Cargo de Cuenta"
            v-model="form.firmaResponsable"
          />
          <v-text-field label="Firma del Coordinador" v-model="form.firmaCoordinador" />
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  nombre: '',
  cargo: '',
  aprobado: '',
  descripcionActividad: '',
  fecha: '',
  objetivo: '',
  financiamiento: '',
  detalleFondos: [],
  beneficiario: {
    nombre: '',
    documento: '',
    banco: '',
    cuenta: '',
    tipoCuenta: '',
  },
  firmaResponsable: '',
  firmaCoordinador: '',
  lugar: '',
  fechaSolicitud: '',
})

const addDetalle = () => {
  form.value.detalleFondos.push({ partida: '', descripcion: '', monto: 0 })
}

const removeDetalle = (index) => {
  form.value.detalleFondos.splice(index, 1)
}
</script>

<style scoped>
.v-card-title,
.v-card-subtitle {
  color: #2e3b55;
}
</style>
