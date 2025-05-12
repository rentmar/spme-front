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

      <v-col cols="12" md="6">
        <v-text-field
          v-model="actividad.num_part_varones"
          label="Participantes varones"
          type="number"
          :rules="validadores ? [rules.numeroPositivo] : []"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="actividad.num_part_mujeres"
          label="Participantes mujeres"
          type="number"
          :rules="validadores ? [rules.numeroPositivo] : []"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-checkbox
          v-model="actividad.pertenecen_pueblos_indig"
          label="Participantes de pueblos indígenas"
        ></v-checkbox>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea v-model="actividad.avance" label="Avance de la investigación"></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea v-model="actividad.publicaciones" label="Publicaciones generadas"></v-textarea>
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
      num_part_varones: null,
      num_part_mujeres: null,
      pertenecen_pueblos_indig: false,
      avance: '',
      publicaciones: '',
      colaboraciones: '',
      uso_fondos: null,
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
