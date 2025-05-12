<template>
  <v-container>
    <!-- Encabezado del proyecto -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card color="primary" dark>
          <v-card-title class="text-h4">
            <v-icon large class="mr-3">mdi-notebook</v-icon>
            {{ proyecto.nombre }}
          </v-card-title>
          <v-card-subtitle class="text-h6"> Actividades por componente </v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="3" class="text-center">
                <div class="text-h5">{{ contadores.objetivoGeneral }}</div>
                <div>Actividades de Objetivo General</div>
              </v-col>
              <v-col cols="3" class="text-center">
                <div class="text-h5">{{ contadores.objetivoEspecifico }}</div>
                <div>Actividades de Objetivo Específico</div>
              </v-col>
              <v-col cols="3" class="text-center">
                <div class="text-h5">{{ contadores.resultado }}</div>
                <div>Actividades de Resultado</div>
              </v-col>
              <v-col cols="3" class="text-center">
                <div class="text-h5">{{ contadores.producto }}</div>
                <div>Actividades de Producto</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Card para Objetivo General -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card>
          <v-card-title class="primary white--text">
            <v-icon left>mdi-target</v-icon>
            Actividades de Objetivo General
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="actividades.objetivoGeneral"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="abrirModal('objetivoGeneral')">
                    <v-icon left>mdi-plus</v-icon>
                    Agregar Actividad
                  </v-btn>
                </v-toolbar>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Card para Objetivo Específico -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card>
          <v-card-title class="secondary white--text">
            <v-icon left>mdi-bullseye-arrow</v-icon>
            Actividades de Objetivo Específico
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="actividades.objetivoEspecifico"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" @click="abrirModal('objetivoEspecifico')">
                    <v-icon left>mdi-plus</v-icon>
                    Agregar Actividad
                  </v-btn>
                </v-toolbar>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Card para Resultados -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card>
          <v-card-title class="success white--text">
            <v-icon left>mdi-check-all</v-icon>
            Actividades de Resultado
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="actividades.resultado"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-spacer></v-spacer>
                  <v-btn color="success" @click="abrirModal('resultado')">
                    <v-icon left>mdi-plus</v-icon>
                    Agregar Actividad
                  </v-btn>
                </v-toolbar>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Card para Productos -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card>
          <v-card-title class="info white--text">
            <v-icon left>mdi-package-variant</v-icon>
            Actividades de Producto
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="actividades.producto"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-spacer></v-spacer>
                  <v-btn color="info" @click="abrirModal('producto')">
                    <v-icon left>mdi-plus</v-icon>
                    Agregar Actividad
                  </v-btn>
                </v-toolbar>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal con Stepper Vertical Funcional -->
    <v-dialog v-model="modalActivo" max-width="800" persistent>
      <v-card>
        <v-card-title class="primary white--text">
          <v-icon left>mdi-plus-circle</v-icon>
          {{ tituloModal }}
        </v-card-title>

        <v-card-text>
          <v-stepper v-model="pasoActual" vertical>
            <template v-slot:default>
              <!-- Paso 1 -->
              <v-stepper-header>
                <v-stepper-step :complete="pasoActual > 1" step="1">
                  Seleccione {{ componenteActual }}
                </v-stepper-step>

                <v-stepper-step :complete="pasoActual > 2" step="2">
                  Tipo de Actividad
                </v-stepper-step>

                <v-stepper-step :complete="pasoActual > 3" step="3">
                  Datos de la Actividad
                </v-stepper-step>

                <v-stepper-step step="4"> Resumen y Confirmación </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-radio-group v-model="componenteSeleccionado">
                    <v-radio
                      v-for="item in opcionesComponente"
                      :key="item.id"
                      :label="item.nombre"
                      :value="item.id"
                    ></v-radio>
                  </v-radio-group>
                  <v-btn color="primary" @click="pasoActual = 2">Continuar</v-btn>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-select
                    v-model="tipoActividad"
                    :items="tiposActividad"
                    label="Seleccione el tipo de actividad"
                    item-title="text"
                    item-value="value"
                    outlined
                  ></v-select>
                  <v-btn color="primary" @click="pasoActual = 3">Continuar</v-btn>
                  <v-btn text @click="pasoActual = 1">Atrás</v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-text-field
                    v-model="nuevaActividad.nombre"
                    label="Nombre de la actividad"
                    outlined
                  ></v-text-field>
                  <v-textarea
                    v-model="nuevaActividad.descripcion"
                    label="Descripción"
                    outlined
                  ></v-textarea>

                  <v-row>
                    <v-col cols="6">
                      <v-menu
                        v-model="menuFechaInicio"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-model="nuevaActividad.fechaInicio"
                            label="Fecha de inicio"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="props"
                            outlined
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="nuevaActividad.fechaInicio"
                          @update:modelValue="menuFechaInicio = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="6">
                      <v-menu
                        v-model="menuFechaFin"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-model="nuevaActividad.fechaFin"
                            label="Fecha de fin"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="props"
                            outlined
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="nuevaActividad.fechaFin"
                          @update:modelValue="menuFechaFin = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>

                  <div v-if="tipoActividad === 'ACAP'">
                    <v-text-field
                      v-model="nuevaActividad.especificos.capacitador"
                      label="Nombre del capacitador"
                      outlined
                    ></v-text-field>
                    <v-text-field
                      v-model="nuevaActividad.especificos.participantes"
                      label="Número de participantes"
                      type="number"
                      outlined
                    ></v-text-field>
                  </div>

                  <div v-if="tipoActividad === 'PINV'">
                    <v-text-field
                      v-model="nuevaActividad.especificos.investigador"
                      label="Investigador principal"
                      outlined
                    ></v-text-field>
                    <v-text-field
                      v-model="nuevaActividad.especificos.institucion"
                      label="Institución colaboradora"
                      outlined
                    ></v-text-field>
                  </div>

                  <v-btn color="primary" @click="pasoActual = 4">Continuar</v-btn>
                  <v-btn text @click="pasoActual = 2">Atrás</v-btn>
                </v-stepper-content>

                <v-stepper-content step="4">
                  <v-card flat>
                    <v-card-title>Resumen de la Actividad</v-card-title>
                    <v-card-text>
                      <v-simple-table>
                        <tbody>
                          <tr>
                            <td><strong>Tipo:</strong></td>
                            <td>{{ tipoActividadTexto }}</td>
                          </tr>
                          <tr>
                            <td><strong>Componente:</strong></td>
                            <td>{{ componenteActual }}</td>
                          </tr>
                          <tr>
                            <td><strong>Nombre:</strong></td>
                            <td>{{ nuevaActividad.nombre }}</td>
                          </tr>
                          <tr>
                            <td><strong>Descripción:</strong></td>
                            <td>{{ nuevaActividad.descripcion }}</td>
                          </tr>
                          <tr>
                            <td><strong>Fechas:</strong></td>
                            <td>
                              {{ nuevaActividad.fechaInicio }} a {{ nuevaActividad.fechaFin }}
                            </td>
                          </tr>
                          <tr v-if="tipoActividad === 'ACAP'">
                            <td><strong>Capacitador:</strong></td>
                            <td>{{ nuevaActividad.especificos.capacitador }}</td>
                          </tr>
                          <tr v-if="tipoActividad === 'PINV'">
                            <td><strong>Investigador:</strong></td>
                            <td>{{ nuevaActividad.especificos.investigador }}</td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-card-text>
                  </v-card>
                  <v-btn color="success" @click="guardarActividad">Guardar Actividad</v-btn>
                  <v-btn text @click="pasoActual = 3">Atrás</v-btn>
                  <v-btn text @click="cerrarModal">Cancelar</v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </template>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

// Datos del proyecto
const proyecto = ref({
  id: 1,
  nombre: 'Implementación del Sistema de Gestión Ambiental',
  codigo: 'PROY-2023-001',
})

// Actividades por componente
const actividades = ref({
  objetivoGeneral: [
    {
      id: 1,
      nombre: 'Taller de concientización ambiental',
      tipo: 'ACAP',
      descripcion: 'Taller para todos los empleados sobre prácticas ambientales',
      fechaInicio: '2023-03-01',
      fechaFin: '2023-03-02',
      estado: 'Planificado',
    },
  ],
  objetivoEspecifico: [
    {
      id: 2,
      nombre: 'Diagnóstico inicial de huella de carbono',
      tipo: 'PINV',
      descripcion: 'Estudio para determinar la huella de carbono actual',
      fechaInicio: '2023-02-15',
      fechaFin: '2023-03-15',
      estado: 'En progreso',
    },
  ],
  resultado: [
    {
      id: 3,
      nombre: 'Implementación sistema de reciclaje',
      tipo: 'AOP',
      descripcion: 'Instalación de estaciones de reciclaje en todas las áreas',
      fechaInicio: '2023-04-01',
      fechaFin: '2023-04-30',
      estado: 'Pendiente',
    },
  ],
  producto: [
    {
      id: 4,
      nombre: 'Manual de buenas prácticas ambientales',
      tipo: 'DES',
      descripcion: 'Documento guía para empleados',
      fechaInicio: '2023-05-01',
      fechaFin: '2023-05-15',
      estado: 'Pendiente',
    },
  ],
})

// Headers para las tablas
const headers = ref([
  { text: 'ID', value: 'id' },
  { text: 'Nombre', value: 'nombre' },
  { text: 'Tipo', value: 'tipo' },
  { text: 'Descripción', value: 'descripcion' },
  { text: 'Fechas', value: 'fechas' },
  { text: 'Estado', value: 'estado' },
])

// Estado del modal y stepper
const modalActivo = ref(false)
const pasoActual = ref(1)
const componenteActual = ref('')
const componenteSeleccionado = ref(null)
const opcionesComponente = ref([])
const tipoActividad = ref('')
const tiposActividad = ref([
  { text: 'Actividad de capacitación (ACAP)', value: 'ACAP' },
  { text: 'Proyecto de investigación (PINV)', value: 'PINV' },
  { text: 'Actividades Operativas (AOP)', value: 'AOP' },
  { text: 'Campañas de sensibilización (CSEN)', value: 'CSEN' },
  { text: 'Proyectos de desarrollo (DES)', value: 'DES' },
  { text: 'Actividades de incidencia (INC)', value: 'INC' },
  { text: 'Actividades de articulación (ACART)', value: 'ACART' },
])

// Formulario de nueva actividad
const nuevaActividad = ref({
  nombre: '',
  descripcion: '',
  fechaInicio: null,
  fechaFin: null,
  especificos: {
    capacitador: '',
    participantes: 0,
    investigador: '',
    institucion: '',
  },
})

// Menús de fecha
const menuFechaInicio = ref(false)
const menuFechaFin = ref(false)

// Computed properties
const contadores = computed(() => ({
  objetivoGeneral: actividades.value.objetivoGeneral.length,
  objetivoEspecifico: actividades.value.objetivoEspecifico.length,
  resultado: actividades.value.resultado.length,
  producto: actividades.value.producto.length,
}))

const tituloModal = computed(() => {
  switch (componenteActual.value) {
    case 'objetivoGeneral':
      return 'Agregar Actividad para Objetivo General'
    case 'objetivoEspecifico':
      return 'Agregar Actividad para Objetivo Específico'
    case 'resultado':
      return 'Agregar Actividad para Resultado'
    case 'producto':
      return 'Agregar Actividad para Producto'
    default:
      return 'Agregar Nueva Actividad'
  }
})

const tipoActividadTexto = computed(() => {
  const tipo = tiposActividad.value.find((t) => t.value === tipoActividad.value)
  return tipo ? tipo.text : ''
})

// Métodos
const abrirModal = (tipo) => {
  componenteActual.value = tipo
  resetearFormulario()

  // Configurar opciones según el tipo de componente
  if (tipo === 'objetivoGeneral') {
    opcionesComponente.value = [
      { id: 1, nombre: 'OG1: Reducir la huella de carbono en un 20%' },
      { id: 2, nombre: 'OG2: Implementar sistema de gestión ambiental' },
    ]
  } else if (tipo === 'objetivoEspecifico') {
    opcionesComponente.value = [
      { id: 3, nombre: 'OE1.1: Realizar diagnóstico inicial' },
      { id: 4, nombre: 'OE1.2: Capacitar al personal' },
    ]
  } else if (tipo === 'resultado') {
    opcionesComponente.value = [
      { id: 5, nombre: 'R1: Sistema de reciclaje implementado' },
      { id: 6, nombre: 'R2: Personal capacitado' },
    ]
  } else if (tipo === 'producto') {
    opcionesComponente.value = [
      { id: 7, nombre: 'P1: Manual de buenas prácticas' },
      { id: 8, nombre: 'P2: Informe de diagnóstico' },
    ]
  }

  modalActivo.value = true
  pasoActual.value = 1
}

const cerrarModal = () => {
  modalActivo.value = false
  pasoActual.value = 1
}

const resetearFormulario = () => {
  nuevaActividad.value = {
    nombre: '',
    descripcion: '',
    fechaInicio: null,
    fechaFin: null,
    especificos: {
      capacitador: '',
      participantes: 0,
      investigador: '',
      institucion: '',
    },
  }
  componenteSeleccionado.value = null
  tipoActividad.value = ''
}

const guardarActividad = () => {
  // Simular envío a API
  const actividad = {
    id: Math.max(...actividades.value[componenteActual.value].map((a) => a.id)) + 1,
    nombre: nuevaActividad.value.nombre,
    tipo: tipoActividad.value,
    descripcion: nuevaActividad.value.descripcion,
    fechaInicio: nuevaActividad.value.fechaInicio,
    fechaFin: nuevaActividad.value.fechaFin,
    estado: 'Planificado',
  }

  // Agregar a la lista correspondiente
  actividades.value[componenteActual.value].push(actividad)

  // Cerrar modal
  cerrarModal()
}
</script>

<style scoped>
.v-stepper {
  box-shadow: none;
}
.v-stepper__content {
  padding: 16px 24px;
}
</style>
