<template>
  <v-form ref="form">
    <!-- Campos comunes a todas las actividades -->
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="actividad.codigo"
          label="Código"
          :rules="validadores ? [rules.required, rules.max20] : []"
          :disabled="!validadores"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="actividad.estado"
          :items="estadosActividad"
          label="Estado"
          :rules="validadores ? [rules.required] : []"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="actividad.fecha_programada"
          label="Fecha Programada"
          type="date"
          :rules="validadores ? [rules.fechaValida] : []"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="actividad.duracion"
          label="Duración (días)"
          type="number"
          :rules="validadores ? [rules.numeroPositivo] : []"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="actividad.fecha_inicio"
          label="Fecha Inicio"
          type="date"
          :rules="validadores ? [rules.fechaValida] : []"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="actividad.fecha_cierre"
          label="Fecha Cierre"
          type="date"
          :rules="validadores ? [rules.fechaValida] : []"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.descripcion"
          label="Objetivo de Actividad"
          :rules="validadores ? [rules.required] : []"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.descripcion"
          label="Descripción"
          :rules="validadores ? [rules.required] : []"
        ></v-textarea>
      </v-col>
    </v-row>

    <!-- Campos específicos del tipo de actividad -->
    <slot></slot>
  </v-form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  actividad: {
    type: Object,
    required: true,
  },
  validadores: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:actividad'])

const form = ref(null)

const estadosActividad = [
  { value: 'EST', text: 'Estructuración' },
  { value: 'PLAN', text: 'Planificado' },
  { value: 'EJEC', text: 'En Ejecución' },
  { value: 'POST', text: 'Postergado' },
  { value: 'CANC', text: 'Cancelado' },
  { value: 'COMP', text: 'Completado' },
]

const rules = {
  required: (value) => !!value || 'Campo requerido',
  max20: (value) => (value && value.length <= 20) || 'Máximo 20 caracteres',
  fechaValida: (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value) || 'Fecha inválida',
  numeroPositivo: (value) => !value || value >= 0 || 'Debe ser número positivo',
}

const validate = async () => {
  if (!props.validadores) return true
  const { valid } = await form.value.validate()
  return valid
}

defineExpose({ validate })
</script>
