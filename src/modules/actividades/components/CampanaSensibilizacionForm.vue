<template>
  <ActividadBaseForm
    :actividad="actividad"
    :validadores="validadores"
    @update:actividad="$emit('update:actividad', $event)"
  >
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.alcance_impacto"
          label="Alcance e impacto de la campaña"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.cam_per_publica"
          label="Campaña en medios públicos"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="actividad.num_eventos_realizados"
          label="Número de eventos realizados"
          type="number"
          :rules="validadores ? [rules.numeroPositivo] : []"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.part_comunitaria"
          label="Participación comunitaria"
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
      alcance_impacto: '',
      cam_per_publica: '',
      num_eventos_realizados: null,
      part_comunitaria: '',
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
