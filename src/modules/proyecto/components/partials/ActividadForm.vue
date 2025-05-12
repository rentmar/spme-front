<template>
  <v-card class="pa-4 mb-4" elevation="2">
    <v-row dense>
      <!-- Código -->
      <v-col cols="12" sm="4">
        <v-text-field v-model="actividad.codigo" label="Código" dense outlined></v-text-field>
      </v-col>

      <!-- Descripción -->
      <v-col cols="12" sm="8">
        <v-text-field
          v-model="actividad.descripcion"
          label="Descripción"
          dense
          outlined
        ></v-text-field>
      </v-col>

      <!-- Separador -->
      <v-col cols="12">
        <v-divider class="my-4"></v-divider>
      </v-col>

      <!-- Tipo de actividad -->
      <v-col cols="12" sm="6">
        <v-select
          v-model="actividad.tipo"
          :items="tiposActividad"
          label="Tipo de Actividad"
          dense
          outlined
        ></v-select>
      </v-col>

      <!-- Estado (chip) -->
      <v-col cols="12" sm="6" class="d-flex align-center">
        <span class="mr-2">Estado:</span>
        <v-chip color="info" text-color="white" label small> Estructuración </v-chip>
      </v-col>

      <!-- Elemento vinculado -->
      <v-col cols="12" sm="6">
        <v-select
          v-model="actividad.vinculacion"
          :items="elementosVinculacion"
          label="Elemento Vinculado"
          item-text="descripcion"
          item-value="codigo"
          dense
          outlined
        ></v-select>
      </v-col>

      <!-- Relación con PEI -->
      <v-col cols="12">
        <v-row>
          <!-- Checkboxes -->
          <v-col cols="12" sm="6">
            <v-checkbox
              v-model="actividad.relacionConPEI.objetivo"
              label="Relacionada con un objetivo PEI"
              dense
            ></v-checkbox>
            <v-checkbox
              v-model="actividad.relacionConPEI.indicador"
              label="Relacionada con un indicador PEI"
              dense
            ></v-checkbox>
          </v-col>

          <!-- Selects relacionados -->
          <v-col cols="12" sm="6">
            <v-expand-transition>
              <div v-if="actividad.relacionConPEI.objetivo" class="mb-2">
                <v-select
                  v-model="actividad.relacionConPEI.objetivoSeleccionado"
                  :items="objetivosPEI"
                  label="Objetivo PEI"
                  item-text="descripcion"
                  item-value="codigo"
                  dense
                  outlined
                ></v-select>
              </div>
            </v-expand-transition>

            <v-expand-transition>
              <div v-if="actividad.relacionConPEI.indicador">
                <v-select
                  v-model="actividad.relacionConPEI.indicadorSeleccionado"
                  :items="indicadoresPEI"
                  label="Indicador PEI"
                  item-text="descripcion"
                  item-value="codigo"
                  dense
                  outlined
                ></v-select>
              </div>
            </v-expand-transition>
          </v-col>
        </v-row>
      </v-col>

      <!-- Eliminar -->
      <v-col cols="12" class="text-right">
        <v-btn icon color="error" @click="$emit('eliminar')">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  actividad: Object,
  elementosVinculacion: Array, // Pasado desde el tab activo
})

const emit = defineEmits(['eliminar'])

const tiposActividad = [
  'Actividades de Capacitación (ACAP)',
  'Proyectos de Investigación (PINV)',
  'Actividades Operativas (AOP)',
  'Campañas de Sensibilización (CSEN)',
  'Proyectos de Desarrollo (DES)',
  'Actividades de Incidencia (INC)',
  'Actividades de Articulación (ACART)',
]

// Simulados: podrían venir de API o estar globales
const objetivosPEI = [
  { codigo: 'PEI1', descripcion: 'Reducir pobreza urbana' },
  { codigo: 'PEI2', descripcion: 'Incrementar cobertura educativa' },
]
const indicadoresPEI = [
  { codigo: 'IND1', descripcion: 'Porcentaje de cobertura escolar' },
  { codigo: 'IND2', descripcion: 'Número de familias asistidas' },
]
</script>
