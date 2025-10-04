<template>
  <div v-if="data" class="v-container v-locale--is-ltr">
    <div class="v-card v-theme--light v-card--density-default v-card--variant-elevated pa-6">
      <!-- Encabezado diferenciado -->
      <div class="header-gradient">
        <PaginaTituloIcono
          :titulo="'Informe de Actividades'"
          :icon="'mdi-file-document-multiple'"
        ></PaginaTituloIcono>
        <br />
        <ProyectoIdHeader v-if="data" :proyecto-id="data.proyecto"></ProyectoIdHeader>
        <br />
        <ActividadInformacion v-if="idActividad" :actividad-id="idActividad"></ActividadInformacion>

        <!-- <div class="d-flex align-center">
          <v-avatar class="mr-4" size="60" color="white">
            <v-icon size="x-large" color="primary">mdi-file-document-multiple</v-icon>
          </v-avatar>
          <div>
            <div class="text-h4 font-weight-bold white--text">Informe de Actividades</div>
            <div class="text-subtitle-1 white--text mt-1">Sistema de Gestión de Proyectos</div>
          </div>
        </div> -->
        <div class="header-decoration">
          <div class="decoration-circle decoration-circle-1"></div>
          <div class="decoration-circle decoration-circle-2"></div>
          <div class="decoration-circle decoration-circle-3"></div>
        </div>
      </div>

      <EncabezadoContribucion
        :datos-estructura="data.estructuraProcedencia"
        @payload-actualizado="recibirdatos"
      >
      </EncabezadoContribucion>

      <div class="v-card-text">
        <form class="v-form" novalidate @submit.prevent="submitForm">
          <!-- Sección 1: Datos Generales del Informe -->
          <!-- <div class="form-section">
            <v-divider class="my-4"></v-divider>
            <v-card-subtitle class="text-h6">Datos Generales del Informe</v-card-subtitle>
            <br>
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="formData.nombre_actividad"
                  label="Nombre de Actividad"
                  bg-color="blue-lighten-5"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.fecha_realizacion"
                  label="Fecha de Realización"
                  type="date"
                  bg-color="blue-lighten-5"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="formData.responsable_actividad1"
                  label="Responsable de Actividad"
                  bg-color="blue-lighten-5"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </div> -->

          <!-- <v-divider class="my-4"></v-divider> -->

          <!-- <v-col cols="12">
            <v-text-field
              v-model="formData.contribucion_proyecto"
              label="Contribuciones del Proyecto"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="formData.contribucion_actividad"
              label="Contribución de la Actividad"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>
          </v-col>-->

          <v-col cols="12">
            <v-text-field
              v-model="formData.objetivo_de_actividad"
              label="Objetivo de la Actividad"
              required
              readonly
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="formData.informe_de_objetivo_de_actividad"
              label="Informe de objetivo de la actividad"
              bg-color="blue-lighten-5"
              required
              rows="3"
            ></v-textarea>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="formData.tipo_de_actividad"
              label="Tipo de actividad"
              required
              readonly
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="formData.reporte_tipo"
              label="Reporte por Tipo"
              bg-color="blue-lighten-5"
              required
              rows="3"
            ></v-textarea>
          </v-col>

          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-chart-bar"
            @click="modalAbierto = true"
            block
            size="large"
          >
            Seleccionar Indicador de Proyecto
          </v-btn>
          <Indicador-registro-bitacora
            v-model="modalAbierto"
            :idactividad="idActividad"
            @guardarAvances="actualizarIndicadores"
          >
          </Indicador-registro-bitacora>
          <br />

          <!-- <v-col cols="12" class="mt-4">
            <v-text-field
              v-model="formData.indicador_seleccionado"
              label="Indicador seleccionado"
              bg-color="blue-lighten-5"
              readonly
            ></v-text-field>
          </v-col> -->

          <!-- <v-col cols="12">
            <v-text-field
              v-model="formData.avance_indicador"
              label="Avance en el indicador"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>
          </v-col> -->

          <v-divider class="my-4"></v-divider>

          <div class="form-section">
            <v-card-subtitle class="text-h6">Informacion Cuantitativa</v-card-subtitle>
            <br />
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.informacion_cuantitativa"
                  label="Número de participantes, organizaciones, segmentación y grupos edad/sexo, autoridades"
                  bg-color="blue-lighten-5"
                  rows="3"
                ></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="formData.archivos_cuantitativos"
                  label="Adjuntar archivos"
                  multiple
                  chips
                  show-size
                  :accept="acceptedFormats.herramientas"
                  prepend-icon="mdi-paperclip"
                ></v-file-input>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Sección 2: Herramientas Aplicadas y Resultados -->
          <div class="form-section">
            <v-card-subtitle class="text-h6">Herramientas Aplicadas y Resultados</v-card-subtitle>
            <br />
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.descripcion_herramientas"
                  label="Herramientas de Evaluacion y resultados"
                  bg-color="blue-lighten-5"
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="formData.herramientas_archivos"
                  label="Adjuntar archivos"
                  multiple
                  chips
                  show-size
                  :accept="acceptedFormats.herramientas"
                  prepend-icon="mdi-paperclip"
                ></v-file-input>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Sección 3: Medios de Verificación -->
          <div class="form-section">
            <v-card-subtitle class="text-h6">Medios de Verificación</v-card-subtitle>
            <br />
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.medios_verificacion"
                  label="Descripción de medios de verificación"
                  bg-color="blue-lighten-5"
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="formData.medios_archivos"
                  label="Adjuntar archivos"
                  multiple
                  chips
                  show-size
                  :accept="acceptedFormats.medios"
                  prepend-icon="mdi-paperclip"
                ></v-file-input>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Sección 4: Comentarios y Recomendaciones -->
          <div class="form-section">
            <v-card-subtitle class="text-h6">Comentarios y Recomendaciones</v-card-subtitle>
            <br />
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.comentarios_recomendaciones"
                  label="Comentarios y recomendaciones adicionales"
                  bg-color="blue-lighten-5"
                  rows="3"
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </div>

          <div class="d-flex justify-end mt-4">
            <v-btn color="error" prepend-icon="mdi-backspace-outline" @click="resetForm">
              Limpiar
            </v-btn>
            <v-btn color="primary" prepend-icon="mdi-send" @click="submitForm" :loading="loading">
              Enviar Informe
            </v-btn>
          </div>
        </form>
      </div>
    </div>

    <!-- Diálogo para selección de indicadores -->
    <v-dialog v-model="indicatorDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">Seleccionar Indicador de Proyecto</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="(indicador, index) in indicadores"
              :key="index"
              @click="seleccionarIndicador(indicador)"
            >
              <v-list-item-title>{{ indicador.nombre }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="indicatorDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <!-- <pre>{{ formData }}</pre> -->

  <!-- <pre>{{ formData }}</pre>-->
  <br />
  <br />
  <!-- <pre> {{ payload1 }}</pre> -->
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
import IndicadorRegistroBitacora from '@/modules/reportes/components/IndicadorRegistroBitacora.vue'
import EncabezadoContribucion from '@/modules/formularios/components/EncabezadoContribucion.vue'

import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'

const modalAbierto = ref(false)

// Composables
const { usuario, informacionUsuarioPorNick } = useUsuario()

// Router
const route = useRoute()
const idActividad = route.params.id || null
const idTarea = route.query.tarea_id || null

const payload1 = ref(null)
const recibirdatos = (payload) => {
  console.log('Datos recibidos del componente hijo:', payload)
  payload1.value = payload
  //formData.contribucion_actividad = payload;
  console.log('formData actualizado:', formData)
}
// Estado reactivo
const loading = ref(false)
const indicatorDialog = ref(false)
const data = ref(null)

// Datos para cargar el formulario
//const tipoActividadExtraida = ref('')
//const objetivoActividadExtraida = ref('')

// const tiposActividad = [
//   'Capacitación',
//   'Reunión',
//   'Taller',
//   'Sesión de trabajo',
//   'Evento',
//   'Otro'
// ]

const indicadores = [
  { id: 1, nombre: 'Número de participantes capacitados' },
  { id: 2, nombre: 'Porcentaje de avance en metas' },
  { id: 3, nombre: 'Nivel de satisfacción de beneficiarios' },
  { id: 4, nombre: 'Cumplimiento de cronograma' },
]

const formData = reactive({
  //contribucion_proyecto: '',
  contribucion_actividad: '',
  objetivo_de_actividad: '',
  informe_de_objetivo_de_actividad: '',
  tipo_de_actividad: '',
  reporte_tipo: '',
  avance_en_indicador: '',
  informacion_cuantitativa: '',
  descripcion_herramientas: '',
  medios_verificacion: '',
  comentarios_recomendaciones: '',
  // archivos_cuantitativos: [],
  // herramientas_archivos: [],
  // medios_archivos: [],
})

const acceptedFormats = {
  herramientas: 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
  medios: 'image/*,video/*,.mp3,.pdf,.doc,.docx',
}

const actualizarIndicadores = (payload) => {
  formData.avance_en_indicador = payload
}

// Métodos
async function obtenerDatosProyecto(id) {
  try {
    const url = `http://127.0.0.1:8000/api/actividad-indicadores-proyecto/${id}/`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Error al obtener los datos')
    }

    const result = await response.json()
    console.log('Datos obtenidos:', result)
    data.value = result

    formData.objetivo_de_actividad =
      data.value?.objetivo_de_actividad || 'objetivo de actividad datosF'
    formData.tipo_de_actividad = data.value?.tipo_info?.tipo_actividad || 'tipo de actividad datosF'

    return result
  } catch (error) {
    console.error('Error:', error)
  }
}

function getCurrentUserNick() {
  // Esta función debería obtener el nick del usuario actualmente autenticado
  return 'ACarvajal'
}

async function prefillFormData() {
  try {
    const currentNick = getCurrentUserNick()
    await informacionUsuarioPorNick({ usuario: currentNick })

    if (usuario.value) {
      formData.responsable_actividad =
        `${usuario.value.nombre} ${usuario.value.paterno} ${usuario.value.materno}`.trim()
    }
  } catch (err) {
    console.error('Error al pre-llenar los datos del usuario:', err)
  }
}

// function openIndicatorDialog() {
//   indicatorDialog.value = true;
// }

function seleccionarIndicador(indicador) {
  formData.indicador_seleccionado = indicador.nombre
  indicatorDialog.value = false
}

async function submitForm() {
  loading.value = true
  try {
    // Validación de campos requeridos
    if (
      !formData.objetivo_de_actividad ||
      !formData.informe_de_objetivo_de_actividad ||
      !formData.tipo_de_actividad ||
      !formData.reporte_tipo ||
      !formData.informacion_cuantitativa ||
      !formData.descripcion_herramientas ||
      !formData.medios_verificacion ||
      !formData.comentarios_recomendaciones
    ) {
      throw new Error('Por favor complete todos los campos requeridos del Informe de Actividades.')
    }

    const payload = {
      numeroInforme: 1,
      contribucionesProyecto: formData.informe_de_objetivo_de_actividad,
      contribucionesActividad: formData.contribucion_actividad,
      informaObjetivoActividad: formData.objetivo_de_actividad,
      reporteTipo: formData.reporte_tipo,
      indicador: formData.informacion_cuantitativa,
      herramientaEvaluacion: formData.descripcion_herramientas,
      descripcionMediosVerificacion: formData.medios_verificacion,
      comentariosRecomendacion: formData.comentarios_recomendaciones,
      actividad: idActividad,

      // archivos_cuantitativos: [],
      // herramientas_archivos: [],
      // medios_archivos: [],
    }

    const response = await axios.post('http://127.0.0.1:8000/api/informe-actividad/', payload)

    alert('Informe de Actividades y archivos enviados con éxito')
    resetForm()
  } catch (error) {
    console.error('Error completo al enviar el informe:', error.response?.data || error.message)
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Ocurrió un error inesperado al enviar el informe.'
    alert(`Error: ${errorMessage}`)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(formData, {
    contribucion_proyecto: '',
    contribucion_actividad: '',
    informe_objetivo: '',
    //informe_de_objetivo_de_actividad:'',
    reporte_tipo: '',
    avance_en_indicador: '',
    informacion_cuantitativa: '',
    herramientas_de_evaluacion_y_resultados: '',
    descripcion_de_medios_de_verificacion: '',
    comentarios_recomendaciones: '',
  })
  //prefillFormData();
}

// Ciclo de vida
onMounted(async () => {
  console.log('ID de Actividad:', idActividad)
  console.log('ID de Tarea:', idTarea)

  //await prefillFormData();

  if (idActividad) {
    await obtenerDatosProyecto(idActividad)
  }
})

// WATCH PARA AUTO-LLENAR FORMULARIO CUANDO LLEGUEN LOS DATOS
// watch(
//   data,
//   (newVal) => {
//     if (newVal) {
//       formData.contribucion_proyecto = newVal.contribucion_proyecto || '';
//       formData.contribucion_actividad = newVal.contribucion_actividad || '';
//       formData.nombre_actividad = newVal.nombre_actividad || '';
//       formData.fecha_realizacion = newVal.fecha_realizacion || '';
//       formData.objetivo_actividad = newVal.objetivo_actividad || '';
//       formData.informe_objetivo = newVal.informe_objetivo || '';
//       formData.tipo_actividad = newVal.tipo_actividad || '';
//       formData.reporte_tipo = newVal.reporte_tipo || '';
//       formData.indicador_seleccionado = newVal.indicador_seleccionado || '';
//       formData.informacion_cuantitativa = newVal.informacion_cuantitativa || '';
//       formData.descripcion_herramientas = newVal.descripcion_herramientas || '';
//       formData.medios_verificacion = newVal.medios_verificacion || '';
//       formData.comentarios_recomendaciones = newVal.comentarios_recomendaciones || '';
//     }
//   },
//   { deep: true },
// )

// Watchers
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      obtenerDatosProyecto(newId)
    }
  },
)
</script>

<style scoped>
.solicitud-fondos-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}

.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.form-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
}

.form-section h3 {
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
  padding-bottom: 12px;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.info-item {
  padding: 8px 0;
}

.gap-3 {
  gap: 12px;
}

.users-table {
  width: 100%;
}

.users-table th {
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 2;
}

/* Ajustes responsivos */
@media (max-width: 960px) {
  .solicitud-fondos-container {
    padding: 16px 12px;
  }

  .form-section {
    padding: 20px;
    margin-bottom: 20px;
  }

  .d-flex.justify-end {
    flex-direction: column;
    gap: 8px;
  }

  .d-flex.justify-end .v-btn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .v-card {
    margin: 8px 0;
  }

  .form-section {
    padding: 16px;
  }
}

/* Mejora el aspecto de la tabla */
:deep(.v-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-table th) {
  background-color: #1976d2 !important;
  color: white !important;
  font-weight: 600;
  font-size: 14px;
  padding: 16px 12px;
}

:deep(.v-table td) {
  padding: 12px;
  background-color: #fafafa;
}

.narrow-column {
  width: 15%;
}

.wide-column {
  width: 50%;
}

.action-column {
  width: 15%;
}

.compact-field {
  font-size: 14px;
  max-width: 100px;
}
</style>
