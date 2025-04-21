<template>
  <v-container class="mt-8">
    <div class="text-center">
      <h3 text-h4 font-weight-bold mb-6>Registro de un Nuevo Proyecto</h3>
    </div>
    <v-stepper v-model="paso" non-linear>
      <!--Encabezado-->
      <v-stepper-header>
        <v-stepper-item
          editable
          :complete="paso > index + 1"
          v-for="(titulo, index) in titulos"
          v-bind:key="index"
          v-bind:value="index + 1"
        >
          {{ titulo }}
        </v-stepper-item>
      </v-stepper-header>
      <!--Contenido-->
      <v-stepper-window>
        <!--Paso 1-->
        <v-stepper-window-item :value="1">
          <NewProyectoTab></NewProyectoTab>
        </v-stepper-window-item>
        <!--Paso 2-->
        <v-stepper-window-item :value="2">
          <NewObetivosTab></NewObetivosTab>
        </v-stepper-window-item>
        <!--Paso 2-->
        <v-stepper-window-item :value="3">
          <NewResultadosTab></NewResultadosTab>
        </v-stepper-window-item>
        <!--Paso 2-->
        <v-stepper-window-item :value="4">
          <NewProductosTab></NewProductosTab>
        </v-stepper-window-item>
        <!--Paso 2-->
        <v-stepper-window-item :value="5">
          <NewIndicadoresTab></NewIndicadoresTab>
        </v-stepper-window-item>
        <!--Paso 2-->
        <v-stepper-window-item :value="6"></v-stepper-window-item>
        <!--Paso 2-->
        <v-stepper-window-item :value="7">
          <v-card class="my-card">
            <!-- Header con título y subtítulo -->
            <v-card-item>
              <v-card-title class="text-h5">
                {{ nuevoProyecto.titulo }}
              </v-card-title>
              <v-card-subtitle> Codigo: {{ nuevoProyecto.codigo }} </v-card-subtitle>
            </v-card-item>

            <!-- Contenido principal -->
            <v-card-text>
              <h4>Descripcion</h4>
              <p>{{ nuevoProyecto.descripcion }}</p>
              <h4>Fecha de creacion</h4>
              <p>{{ nuevoProyecto.fecha_creacion }}</p>
              <h4>Fecha de inicio</h4>
              <p>{{ nuevoProyecto.fecha_inicio }}</p>
              <h4>Fecha de finalizacion</h4>
              <p>{{ nuevoProyecto.fecha_finalizacion }}</p>
              <h4>Responsable</h4>
              <p>{{ nuevoProyecto.registrado }}</p>
              <h4>Instacia gestora</h4>
              <p>{{ nuevoProyecto.instancia_gestora }}</p>

              <v-divider></v-divider>
              <h4>Objetivo General</h4>
              <p>CODIGO: {{ nuevoProyecto.objetivoGeneral.codigo }}</p>
              <p>DESCRIPCION: {{ nuevoProyecto.objetivoGeneral.descripcion }}</p>
              <p>SUPUESTOS: {{ nuevoProyecto.objetivoGeneral.supuestos }}</p>
              <p>RIESGOS: {{ nuevoProyecto.objetivoGeneral.riesgos }}</p>

              <v-divider></v-divider>
              <h4>Objetivos Especificos</h4>
              <p v-for="(objes, index) in nuevoProyecto.objetivoEspecifico" :key="index">
                {{ objes }}
              </p>
            </v-card-text>

            <!-- Acciones opcionales (footer) -->
            <v-card-actions v-if="$slots.actions">
              <slot name="actions"></slot>
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
    <!-- Botones -->
    <v-card-actions class="mt-4">
      <!--Boton Retroceder-->
      <v-btn @click="paso--" :disabled="paso === 1" variant="outlined">Atras</v-btn>
      <v-spacer></v-spacer>
      <!-- Boton avanzar -->
      <v-btn v-if="paso < 7" @click="paso++" variant="outlined" color="primary">Siguiente</v-btn>
      <v-btn v-else @click="enviarFormulario" variant="elevated" color="success">ENVIAR</v-btn>
    </v-card-actions>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { provide } from 'vue'
import NewProyectoTab from '@/modules/proyecto/components/NewProyectoTab.vue'
import NewObetivosTab from '@/modules/proyecto/components/NewObetivosTab.vue'
import NewResultadosTab from '@/modules/proyecto/components/NewResultadosTab.vue'
import NewProductosTab from '@/modules/proyecto/components/NewProductosTab.vue'
import NewIndicadoresTab from '@/modules/proyecto/components/NewIndicadoresTab.vue'

//Pasos del stepper
const paso = ref(1)
//Titulos de los headers
const titulos = [
  'Proyecto',
  'Objetivos',
  'Resultados',
  'Productos',
  'Indicadores',
  'Actividades/Linea de accion',
  'Resumen',
]

//Datos formulario
//Estructura de datos para el proyecto
const nuevoProyecto = reactive({
  proyecto: {
    codigo: '',
    titulo: '',
    descripcion: '',
    fecha_creacion: '',
    fecha_inicio: '',
    fecha_finalizacion: '',
    instancia_gestora: '',
    registrado: '',
  },
  objetivoGeneral: { codigo: '', descripcion: '', supuestos: '', riesgos: '' },
  objetivoEspecifico: [{ codigo: '', descripcion: '', supuestos: '', riesgos: '' }],
  resultados: [{ codigo: '', descripcion: '', supuestos: '', riesgos: '' }],
  productos: [{ codigo: '', descripcion: '', supuestos: '', riesgos: '' }],
  indObjGeneral: [],
  indObjEspecifico: [],
  indResultado: [],
  indProducto: [],
  actividades: [],
  linea_de_accion: [],
})

//Funcion para agregar objetivos especificos
const addObjetivoEspecifico = () => {
  nuevoProyecto.objetivoEspecifico.push({
    codigo: '',
    descripcion: '',
    supuestos: '',
    riesgos: '',
  })
}
//Funcion para agregar productos
const addProducto = () => {
  nuevoProyecto.productos.push({
    codigo: '',
    descripcion: '',
    supuestos: '',
    riesgos: '',
  })
}
//Funcion para agregar resultados
const addResultado = () => {
  nuevoProyecto.resultados.push({
    codigo: '',
    descripcion: '',
    supuestos: '',
    riesgos: '',
  })
}

//Proveer la estructura de datos y funciones de modificacion
provide('nuevoProyecto', nuevoProyecto)
provide('addObjetivoEspecifico', addObjetivoEspecifico)
provide('addProducto', addProducto)
provide('addResultado', addResultado)

// Proveemos los arrays directamente para que el nieto pueda usarlos
provide('objetivosEspecificos', nuevoProyecto.objetivoEspecifico)
provide('resultados', nuevoProyecto.resultados)
provide('productos', nuevoProyecto.productos)
//Enviar formulario
const enviarFormulario = () => {
  alert('Enviar formulario')
}
</script>

<style scoped></style>
