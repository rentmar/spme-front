<template>
  <ActividadBaseForm
    :actividad="actividad"
    :validadores="validadores"
    @update:actividad="$emit('update:actividad', $event)"
  >
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="actividad.numero_participantes"
          label="Número de participantes"
          type="number"
          :rules="validadores ? [rules.numeroPositivo] : []"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.evaluacion_habilidades_pre"
          label="Evaluación de habilidades previas"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.evaluacion_habilidades_post"
          label="Evaluación de habilidades posteriores"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.feedback_participantes"
          label="Feedback de participantes"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.impacto_mediano_plazo"
          label="Impacto a mediano plazo"
        ></v-textarea>
      </v-col>
    </v-row>
  </ActividadBaseForm>
</template>

<script setup>
import ActividadBaseForm from './ActividadBaseForm.vue'

const props = defineProps({
  actividad: {
    type: Object,
    required: true,
    default: () => ({
      codigo: '',
      descripcion: '',
      fecha_programada: '',
      duracion: null,
      fecha_inicio: '',
      fecha_cierre: '',
      estado: 'EST',
      numero_participantes: null,
      evaluacion_habilidades_pre: '',
      evaluacion_habilidades_post: '',
      feedback_participantes: '',
      impacto_mediano_plazo: '',
      otro: '',
    }),
  },
  validadores: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:actividad'])

const rules = {
  numeroPositivo: (value) => !value || value >= 0 || 'Debe ser número positivo',
}
</script>
