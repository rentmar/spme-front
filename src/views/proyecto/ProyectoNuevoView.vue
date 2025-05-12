<template>
  <v-container>
    <!-- Overlay de carga -->
    <v-overlay :model-value="cargandoGeneral" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Cargando proyecto...</p>
    </v-overlay>
    <!--CONTENIDO-->
    <v-row v-if="!cargandoGeneral">
      <!-- Columna principal -->
      <v-col cols="12" md="12" lg="12">
        <PaginaTituloIcono
          :titulo="'Registro de Nuevo Proyecto'"
          :icon="'mdi-plus-circle'"
        ></PaginaTituloIcono>
        <!-- Resumen  -->
        <v-card class="mb-4 sticky-summary" elevation="2">
          <v-card-text class="py-2">
            <v-row dense align="center">
              <v-col cols="12" sm="4">
                <div class="d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-file-document</v-icon>
                  <strong>{{
                    nuevoProyectoStore.nuevoProyecto.proyecto.titulo || 'Sin titulo'
                  }}</strong>
                </div>
              </v-col>
              <v-col cols="6" sm="2">
                <div class="text-caption">Código</div>
                <div>{{ nuevoProyectoStore.nuevoProyecto.proyecto.codigo || '---' }}</div>
              </v-col>
              <v-col cols="6" sm="2">
                <div class="text-caption">Estado</div>
                <div>En Estructuracion</div>
              </v-col>
              <v-col cols="6" sm="2">
                <div class="text-caption">Objetivos</div>
                <div>{{ nuevoProyectoStore.nuevoProyecto.objetivoGeneral.length }}</div>
              </v-col>
              <v-col cols="6" sm="2">
                <div class="text-caption">Productos</div>
                <div>{{ nuevoProyectoStore.nuevoProyecto.productos.length }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <!--Stepper-->
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
            <!--Paso 3-->
            <v-stepper-window-item :value="3">
              <NewResultadosTab></NewResultadosTab>
            </v-stepper-window-item>
            <!--Paso 4-->
            <v-stepper-window-item :value="4">
              <NewProductosTab></NewProductosTab>
            </v-stepper-window-item>
            <!--Paso 5-->
            <v-stepper-window-item :value="5">
              <NewIndicadoresTab></NewIndicadoresTab>
            </v-stepper-window-item>
            <!--Paso 6-->
            <v-stepper-window-item :value="6">
              <LineaAccionListaAdd></LineaAccionListaAdd>
            </v-stepper-window-item>
            <!--Paso 7-->
            <v-stepper-window-item :value="7">
              <NewActividadTab></NewActividadTab>
            </v-stepper-window-item>
            <!--Paso 8-->
            <v-stepper-window-item :value="8">
              <v-card class="my-card">
                <!-- Header con título y subtítulo -->
                <v-card-item>
                  <v-card-title class="text-h5">
                    {{ nuevoProyecto }}
                  </v-card-title>
                  <v-card-subtitle> Codigo: {{ nuevoProyecto }} </v-card-subtitle>
                </v-card-item>

                <!-- Contenido principal -->
                <v-card-text>
                  <h4>Descripcion</h4>
                  <p>{{}}</p>
                  <h4>Fecha de creacion</h4>
                  <p>{{}}</p>
                  <h4>Fecha de inicio</h4>
                  <p>{{}}</p>
                  <h4>Fecha de finalizacion</h4>
                  <p>{{}}</p>
                  <h4>Responsable</h4>
                  <p>{{}}</p>
                  <h4>Instacia gestora</h4>
                  <p>{{}}</p>

                  <v-divider></v-divider>
                  <h4>Objetivo General</h4>
                  <p>CODIGO: {{}}</p>
                  <p>DESCRIPCION: {{}}</p>
                  <p>SUPUESTOS: {{}}</p>
                  <p>RIESGOS: {{}}</p>

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
          <v-btn v-if="paso < 8" @click="paso++" variant="outlined" color="primary"
            >Siguiente</v-btn
          >
          <v-btn v-else @click="enviarFormulario" variant="elevated" color="success">ENVIAR</v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useNuevoProyectoStore } from '@/modules/proyecto/store/nuevoProyectoStore'
//import { provide } from 'vue'
import NewProyectoTab from '@/modules/proyecto/components/NewProyectoTab.vue'
import NewObetivosTab from '@/modules/proyecto/components/NewObetivosTab.vue'
import NewResultadosTab from '@/modules/proyecto/components/NewResultadosTab.vue'
import NewProductosTab from '@/modules/proyecto/components/NewProductosTab.vue'
import NewIndicadoresTab from '@/modules/proyecto/components/NewIndicadoresTab.vue'
import NewActividadTab from '@/modules/proyecto/components/NewActividadTab.vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import LineaAccionListaAdd from '@/modules/LineaAccion/components/LineaAccionListaAdd.vue'

const nuevoProyectoStore = useNuevoProyectoStore()

//Indicador de carga general
const cargandoGeneral = ref(false)

//Pasos del stepper
const paso = ref(1)
//Titulos de los headers
const titulos = [
  'Proyecto',
  'Objetivos',
  'Resultados',
  'Productos',
  'Indicadores',
  'Linea Accion/Actividad',
  'Resumen',
]

//Datos formulario
//Estructura de datos para el proyecto
/*const nuevoProyecto = reactive({
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
  objetivoGeneral: [{ codigo: '', descripcion: '', supuestos: '', riesgos: '' }],
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
console.log('Nuevo Proyecto:')
console.log(nuevoProyecto)*/

//Funcion para agregar objetivos especificos
/* const addObjetivoEspecifico = () => {
  nuevoProyecto.objetivoEspecifico.push({
    codigo: '',
    descripcion: '',
    supuestos: '',
    riesgos: '',
  })
} */
//Funcion para agregar productos
/* const addProducto = () => {
  nuevoProyecto.productos.push({
    codigo: '',
    descripcion: '',
    supuestos: '',
    riesgos: '',
  })
} */
//Funcion para agregar resultados
/* const addResultado = () => {
  nuevoProyecto.resultados.push({
    codigo: '',
    descripcion: '',
    supuestos: '',
    riesgos: '',
  })
} */

//Proveer la estructura de datos y funciones de modificacion
/* provide('nuevoProyecto', nuevoProyecto.proyecto)
provide('addObjetivoEspecifico', addObjetivoEspecifico)
provide('addProducto', addProducto)
provide('addResultado', addResultado)
 */
// Proveemos los arrays directamente para que el nieto pueda usarlos
/* provide('objetivosEspecificos', nuevoProyecto.objetivoEspecifico)
provide('resultados', nuevoProyecto.resultados)
provide('productos', nuevoProyecto.productos)
provide('ind-objetivoGeneral', nuevoProyecto.indObjGeneral)
provide('ind-objetivoEspecifico', nuevoProyecto.indObjEspecifico)
provide('ind-resultado', nuevoProyecto.indResultado)
provide('ind-producto', nuevoProyecto.indProducto)
provide('actividades', nuevoProyecto.actividades)
 */ //Enviar formulario
const enviarFormulario = () => {
  alert('Enviar formulario')
}
</script>

<style scoped>
.sticky-summary {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
  border-left: 4px solid #1976d2;
}
</style>
