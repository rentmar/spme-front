<template>
  <ActividadBaseForm
    :actividad="actividad"
    :validadores="validadores"
    @update:actividad="$emit('update:actividad', $event)"
  >
    <v-row>
      <v-col cols="12">
        <v-textarea v-model="actividad.uso_recursos" label="Uso de recursos"></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea v-model="actividad.cronogramas" label="Cronogramas"></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.prob_op_identificados"
          label="Problemas operativos identificados"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.prob_op_resueltos"
          label="Problemas operativos resueltos"
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
      uso_recursos: '',
      cronogramas: '',
      prob_op_identificados: '',
      prob_op_resueltos: '',
    }),
  },
  validadores: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:actividad'])
</script>
