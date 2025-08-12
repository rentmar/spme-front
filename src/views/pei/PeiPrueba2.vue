<template>
  <v-card class="ma-4 pa-4" max-width="600">
    <v-card-title class="headline">Solicitud de Fondos</v-card-title>

    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="enviarSolicitud">
        <!-- Campo para Concepto -->
        <v-text-field
          v-model="formulario.fecha_solicitud"
          label="Fecha Solicitus"
          type="date"
          required
          variant="outlined"
        ></v-text-field>

        <!-- Campo para Monto -->
        <v-text-field
          v-model.number="formulario.monto_solicitado"
          label="Monto"
          :rules="[required, isNumber, positiveNumber]"
          type="number"
          prefix="$"
          outlined
        ></v-text-field>

        <!-- Selector de Moneda -->
        <v-select
          v-model="formulario.lugar_solicitud"
          :items="localidad"
          label="Ciudad"
          :rules="[required]"
          outlined
        ></v-select>

        <!-- Botones de acción -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit" :disabled="!valid || enviando" :loading="enviando">
            Enviar Solicitud
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>

    <!-- Snackbar para mostrar resultados -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.mensaje }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-card>
  {{ formulario }}
</template>

<script setup>
import { ref, computed } from 'vue'
import { formulariosServicios } from '@/modules/formularios/services/formulariosServices'

// Estado reactivo
const form = ref(null)
const valid = ref(true)
const enviando = ref(false)

//Valor del formulario
const formulario = ref({
  detalle_destino_fondos: {},
  forma_pago: 2,
  lugar_solicitud: 'La Paz',
  fecha_solicitud: '2025-07-16',
  monto_solicitado: 100.5,
  validacion_responsable: false,
  id_responsable: 1,
  validacion_coordinador: false,
  id_coordinador: 1,
  id_usuario: 2,
  id_actividad: 1,
})
const snackbar = ref({
  show: false,
  mensaje: '',
  color: 'success',
})

// Constantes
const localidad = ['La Paz', 'Santa Cruz', 'Cochabamba']

// Reglas de validación
const required = (v) => !!v || 'Campo requerido'
const isNumber = (v) => !isNaN(v) || 'Debe ser un número'
const positiveNumber = (v) => v > 0 || 'Debe ser mayor a cero'

const enviarSolicitud = async () => {
  enviando.value = true
  try {
    const respuesta = await formulariosServicios.crearSolitudFondos(formulario.value)
    console.log('Respuesta:', respuesta)
    //form.value.reset()
  } catch (error) {
    console.error('Error completo:', error)
  } finally {
    enviando.value = false
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
.v-text-field,
.v-select,
.v-textarea {
  margin-bottom: 16px;
}
</style>
