<template>
  <v-card class="review-card" flat>
    <!-- Encabezado -->
    <v-card-title class="text-h5 bg-blue-grey-darken-1 white--text pa-4">
      <v-icon left>mdi-eye-check</v-icon>
    </v-card-title>

    <!-- Contenido principal -->
    <v-card-text class="pa-4">
      <!-- Sección Objetivo General -->
      <div class="mb-6">
        <div class="text-subtitle-1 font-weight-bold mb-2 blue-grey--text text--darken-2">
          OBJETIVO GENERAL
        </div>
        <v-card outlined class="pa-3 bg-blue-grey-lighten-5">
          <p class="text-body-1 mb-0">{{ generalObjective || 'No especificado' }}</p>
        </v-card>
      </div>

      <!-- Sección Objetivos Específicos -->
      <div>
        <div class="text-subtitle-1 font-weight-bold mb-2 blue-grey--text text--darken-2">
          OBJETIVOS ESPECÍFICOS ({{ specificObjectives.length }})
        </div>
        <v-card outlined class="mb-3" v-for="(obj, index) in specificObjectives" :key="index">
          <v-card-text class="d-flex align-start">
            <v-chip small color="indigo" class="mr-3">{{ index + 1 }}</v-chip>
            <p class="text-body-1 mb-0">{{ obj }}</p>
          </v-card-text>
        </v-card>

        <v-alert v-if="specificObjectives.length === 0" type="info" variant="tonal">
          No se han registrado objetivos específicos
        </v-alert>
      </div>
    </v-card-text>

    <!-- Acciones -->
    <v-card-actions class="pa-4 bg-grey-lighten-3">
      <v-btn color="grey-darken-1" variant="outlined" @click="$emit('cancel')">
        <v-icon left>mdi-arrow-left</v-icon>
        Volver
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="green-darken-2" @click="$emit('confirm')">
        <v-icon left>mdi-check</v-icon>
        Confirmar y Enviar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { inject } from 'vue'

defineProps({
  generalObjective: {
    type: String,
    default: '',
  },
  specificObjectives: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['cancel', 'confirm'])
</script>

<style scoped></style>
