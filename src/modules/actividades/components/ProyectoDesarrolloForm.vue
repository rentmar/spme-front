<template>
  <ActividadBaseForm
    :actividad="actividad"
    :validadores="validadores"
    @update:actividad="$emit('update:actividad', $event)"
  >
    <v-row>
      <v-col cols="12">
        <v-textarea v-model="actividad.logros" label="Logros alcanzados"></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea v-model="actividad.beneficios" label="Beneficios generados"></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="actividad.sostenibilidad"
          label="Sostenibilidad del proyecto"
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
      logros: '',
      beneficios: '',
      sostenibilidad: '',
    }),
  },
  validadores: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:actividad'])
</script>
