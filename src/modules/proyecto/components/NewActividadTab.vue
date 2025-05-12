<template>
  <v-tabs v-model="tab" background-color="primary" dark grow>
    <v-tab v-for="(nombre, index) in nombresTabs" :key="index">
      {{ nombre }}
    </v-tab>
  </v-tabs>

  <v-tabs-items v-model="tab">
    <!-- Objetivo General -->
    <v-tab-item>
      <v-container v-if="tab === 0">
        <v-btn color="primary" class="mb-4" @click="agregarActividad('objetivoGeneral')">
          Agregar Actividad del Objetivo General
        </v-btn>
        <ActividadForm
          v-for="(actividad, index) in actividadesPorTipo.objetivoGeneral"
          :key="'objetivoGeneral-' + index"
          :actividad="actividad"
          :elementos-vinculacion="objetivoGeneral"
          @eliminar="() => eliminarActividad('objetivoGeneral', index)"
        />
      </v-container>
    </v-tab-item>

    <!-- Objetivos Específicos -->
    <v-tab-item>
      <v-container v-if="tab === 1">
        <v-btn color="primary" class="mb-4" @click="agregarActividad('objetivosEspecificos')">
          Agregar Actividad de Objetivo Específico
        </v-btn>
        <ActividadForm
          v-for="(actividad, index) in actividadesPorTipo.objetivosEspecificos"
          :key="'objetivosEspecificos-' + index"
          :actividad="actividad"
          :elementos-vinculacion="objetivosEspecificos"
          @eliminar="() => eliminarActividad('objetivosEspecificos', index)"
        />
      </v-container>
    </v-tab-item>

    <!-- Resultados -->
    <v-tab-item>
      <v-container v-if="tab === 2">
        <v-btn color="primary" class="mb-4" @click="agregarActividad('resultados')">
          Agregar Actividad de Resultado
        </v-btn>
        <ActividadForm
          v-for="(actividad, index) in actividadesPorTipo.resultados"
          :key="'resultados-' + index"
          :actividad="actividad"
          :elementos-vinculacion="resultados"
          @eliminar="() => eliminarActividad('resultados', index)"
        />
      </v-container>
    </v-tab-item>

    <!-- Productos -->
    <v-tab-item>
      <v-container v-if="tab === 3">
        <v-btn color="primary" class="mb-4" @click="agregarActividad('productos')">
          Agregar Actividad de Producto
        </v-btn>
        <ActividadForm
          v-for="(actividad, index) in actividadesPorTipo.productos"
          :key="'productos-' + index"
          :actividad="actividad"
          :elementos-vinculacion="productos"
          @eliminar="() => eliminarActividad('productos', index)"
        />
      </v-container>
    </v-tab-item>
  </v-tabs-items>
</template>

<script setup>
import { ref, inject, reactive } from 'vue'
import ActividadForm from './partials/ActividadForm.vue'

const tab = ref(0)
const nombresTabs = ['Objetivo General', 'Objetivos Específicos', 'Resultados', 'Productos']

// Inyectar datos
const objetivoGeneral = inject('nuevoProyecto').objetivoGeneral
const objetivosEspecificos = inject('objetivosEspecificos')
const resultados = inject('resultados')
const productos = inject('productos')

const actividadesPorTipo = reactive({
  objetivoGeneral: [],
  objetivosEspecificos: [],
  resultados: [],
  productos: [],
})

function agregarActividad(tipo) {
  actividadesPorTipo[tipo].push({
    codigo: '',
    descripcion: '',
    tipo: '',
    estado: 'EST',
    vinculacion: '',
    relacionConPEI: {
      objetivo: false,
      indicador: false,
      objetivoSeleccionado: '',
      indicadorSeleccionado: '',
    },
  })
}

function eliminarActividad(tipo, index) {
  actividadesPorTipo[tipo].splice(index, 1)
}
</script>
