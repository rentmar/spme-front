<template>
  <div v-if="!cargandoGeneral && storeInfActividad.actividad" class="v-container v-locale--is-ltr">
    <div class="v-card v-theme--light v-card--density-default v-card--variant-elevated pa-6">
      <!-- Encabezado diferenciado -->
      <div class="header-gradient">
        <PaginaTituloIcono
          :titulo="'Informe de Actividades'"
          :icon="'mdi-file-document-multiple'"
        ></PaginaTituloIcono>
        <br />
        <ProyectoIdHeader
          v-if="storeInfActividad.actividad"
          :proyecto-id="storeInfActividad.actividad?.proyecto"
        ></ProyectoIdHeader>
        <br />
        <ActividadInformacion
          v-if="storeInfActividad.actividad"
          :actividad-id="storeInfActividad.actividad.id"
        ></ActividadInformacion>

        <div class="header-decoration">
          <div class="decoration-circle decoration-circle-1"></div>
          <div class="decoration-circle decoration-circle-2"></div>
          <div class="decoration-circle decoration-circle-3"></div>
        </div>
      </div>

      <EncabezadoContribucion
        :datos-estructura="storeInfActividad.actividad.estructuraProcedencia"
        @payload-actualizado="recibirdatos"
      >
      </EncabezadoContribucion>

      <div class="v-card-text">
        <form class="v-form" novalidate @submit.prevent="submitForm">
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

          <RegistroAvanceIndicadores
            :idactividad="1"
            @todos-los-registros-enviados="manejarRegistrosIndicadores"
          ></RegistroAvanceIndicadores>

          <v-divider class="my-4"></v-divider>

          <div class="form-section">
            <v-card-subtitle class="text-h6">Informacion Cuantitativa</v-card-subtitle>
            <br />
            <v-row>
              <v-col cols="12">
                <InformacionCuantitativa></InformacionCuantitativa>
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
                <HerramientasAplicadasResultados></HerramientasAplicadasResultados>
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
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useInformeActividadStore } from '@/modules/formularios/store/useInformeActividadStore'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import EncabezadoContribucion from '@/modules/formularios/components/EncabezadoContribucion.vue'
import RegistroAvanceIndicadores from '@/modules/reportes/components/RegistroAvanceIndicadores.vue'
import InformacionCuantitativa from '@/modules/formularios/components/InformacionCuantitativa.vue'
import HerramientasAplicadasResultados from '@/modules/formularios/components/HerramientasAplicadasResultados.vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

//idactividad
const route = useRoute()
const idactividad = route.params.id

//Inicializar el store
const storeInfActividad = useInformeActividadStore()
const indicatorDialog = ref(false)
/************** Formulario datos *****************/
const formData = reactive({
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
})

/************** Encabezado de Contribucion *********************/
const recibirdatos = (payload) => {
  console.log('Datos recibidos del componente hijo:', payload)
  console.log('formData actualizado:', formData)
}

/*************** Indicadores *******************/
const manejarRegistrosIndicadores = async () => {
  console.log('Registro de indicadores')
}

function resetForm() {
  Object.assign(formData, {
    contribucion_proyecto: '',
    contribucion_actividad: '',
    informe_objetivo: '',
    reporte_tipo: '',
    avance_en_indicador: '',
    informacion_cuantitativa: '',
    herramientas_de_evaluacion_y_resultados: '',
    descripcion_de_medios_de_verificacion: '',
    comentarios_recomendaciones: '',
  })
}

/***************** Indicadores ******************/
const loading = ref()
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
      actividad: 1,
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

const acceptedFormats = {
  medios: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png',
  cuantitativos: '.pdf,.xls,.xlsx,.csv',
  herramientas: '.pdf,.doc,.docx,.ppt,.pptx',
}
/********* Cargar datos ***********/
onMounted(async () => {
  cargarDatos()
})

const cargandoGeneral = ref(false)
const cargarDatos = async () => {
  cargandoGeneral.value = true
  try {
    await storeInfActividad.cargarActividadPorId(idactividad)
  } catch (error) {
    console.error('Error cargando actividad:', error)
  } finally {
    cargandoGeneral.value = false
  }
}
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
