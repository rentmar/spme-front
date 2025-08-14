<template>
  <v-container class="pa-4 bg-grey-lighten-4 min-h-screen">
    <v-card class="pa-6 rounded-xl mx-auto" max-width="800">
      <v-card-title class="text-h5 font-weight-bold mb-4">
        Filtrar Actividad por ID
      </v-card-title>

      <v-text-field
        v-model.number="idToFilter"
        label="ID a buscar"
        type="number"
        variant="solo-filled"
        bg-color="blue-lighten-5"
        hide-details
        rounded="lg"
        class="mb-4"
      ></v-text-field>

      <v-divider class="my-4"></v-divider>

      <v-card-subtitle class="text-subtitle-1 font-weight-bold">
        Resultado del filtro
      </v-card-subtitle>

      <!-- Se muestra el resultado si se encuentra una actividad -->
      <div v-if="filteredActivity" class="mt-4">
        <pre class="bg-grey-lighten-3 pa-4 rounded-lg overflow-x-auto text-body-2">
          {{ JSON.stringify(filteredActivity, null, 2) }}
        </pre>
      </div>

      <!-- Mensaje si no se encuentra ninguna actividad -->
      <v-alert
        v-else
        type="info"
        variant="tonal"
        color="blue-darken-2"
        class="mt-4 rounded-lg"
      >
        No se encontró ninguna actividad con el ID: {{ idToFilter }}
      </v-alert>

      <v-divider class="my-4"></v-divider>

      <v-card-subtitle class="text-subtitle-1 font-weight-bold">
        Datos Originales (Actividades)
      </v-card-subtitle>

      <!-- Muestra el JSON completo para referencia -->
      <pre class="bg-grey-lighten-3 pa-4 rounded-lg mt-4 overflow-x-auto text-body-2">
        {{ JSON.stringify(activities, null, 2) }}
      </pre>

    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';

// Array JSON de ejemplo que quieres filtrar
const activities = ref([
  {
    "id": 5,
    "codigo": "ACT02",
    "descripcion": "Curso",
    "supuestos": "",
    "riesgos": "",
    "objetivo_de_actividad": "",
    "descripcion_evaluacion": "",
    "fecha_programada": null,
    "fecha_inicio": null,
    "fecha_cierre": null,
    "presupuesto": null,
    "presupuestoGlobal": null,
    "procedencia_fondos": null,
    "estado": "PLAN",
    "responsable": null,
    "proceso": 1,
    "resultado_og": null,
    "resultado_oe": null,
    "producto_oe": null,
    "objetivo_pei": null,
    "indicador_pei": null,
    "tipo": []
  },
  {
    "id": 6,
    "codigo": "ACT01",
    "descripcion": "Curso",
    "supuestos": "",
    "riesgos": "",
    "objetivo_de_actividad": "",
    "descripcion_evaluacion": "",
    "fecha_programada": null,
    "fecha_inicio": null,
    "fecha_cierre": null,
    "presupuesto": null,
    "presupuestoGlobal": null,
    "procedencia_fondos": null,
    "estado": "PLAN",
    "responsable": null,
    "proceso": null,
    "resultado_og": null,
    "resultado_oe": 1,
    "producto_oe": null,
    "objetivo_pei": null,
    "indicador_pei": null,
    "tipo": []
  },
  {
    "id": 7,
    "codigo": "ACT",
    "descripcion": "",
    "supuestos": "",
    "riesgos": "",
    "objetivo_de_actividad": "",
    "descripcion_evaluacion": "",
    "fecha_programada": null,
    "fecha_inicio": null,
    "fecha_cierre": null,
    "presupuesto": null,
    "presupuestoGlobal": null,
    "procedencia_fondos": null,
    "estado": "PLAN",
    "responsable": null,
    "proceso": null,
    "resultado_og": 2,
    "resultado_oe": null,
    "producto_oe": null,
    "objetivo_pei": null,
    "indicador_pei": null,
    "tipo": []
  }
]);

// Variable reactiva que contiene el ID que el usuario quiere filtrar
const idToFilter = ref(6);

/** *********composable para viaje***************************************
 * Propiedad computada que realiza el filtro.
 * Utiliza el método 'find' de JavaScript para buscar el primer objeto
 * en el array 'activities' cuyo 'id' coincida con 'idToFilter'.
 * El resultado es reactivo y se actualiza automáticamente.
 */
const filteredActivity = computed(() => {
  return activities.value.find(activity => activity.id === idToFilter.value);
});
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.min-h-screen {
  min-height: 100vh;
}
</style>
