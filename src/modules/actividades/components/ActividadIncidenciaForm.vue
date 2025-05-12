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
          v-model="actividad.resumen_desiciones_influencias"
          label="Resumen de decisiones influenciadas"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.descripcion_reuniones"
          label="Descripción de reuniones realizadas"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.estrategias_usadas_efectividad"
          label="Estrategias usadas y su efectividad"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.cambios_politicas_practicas"
          label="Cambios en políticas o prácticas"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea v-model="actividad.retos_superados" label="Retos superados"></v-textarea>
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
      resumen_desiciones_influencias: '',
      descripcion_reuniones: '',
      estrategias_usadas_efectividad: '',
      cambios_politicas_practicas: '',
      retos_superados: '',
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
