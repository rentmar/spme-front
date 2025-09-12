<template>
  <div class="v-container v-locale--is-ltr">
    <div class="v-card v-theme--light v-card--density-default v-card--variant-elevated pa-6">
      <!-- Encabezado diferenciado -->
      <div class="header-gradient">
        <div class="d-flex align-center">
          <v-avatar class="mr-4" size="60" color="white">
            <v-icon size="x-large" color="primary">mdi-file-document-multiple</v-icon>
          </v-avatar>
          <div>
            <div class="text-h4 font-weight-bold white--text">Informe de Actividades</div>
            <div class="text-subtitle-1 white--text mt-1">Sistema de Gestión de Proyectos</div>
          </div>
        </div>
        <div class="header-decoration">
          <div class="decoration-circle decoration-circle-1"></div>
          <div class="decoration-circle decoration-circle-2"></div>
          <div class="decoration-circle decoration-circle-3"></div>
        </div>
      </div>

      <div class="v-card-text">
        <form class="v-form" novalidate @submit.prevent="submitForm">
          <!-- Sección 1: Datos Generales del Informe -->
          <div class="form-section">
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
          </div>

          <v-divider class="my-4"></v-divider>

          <v-col cols="12">
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
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="objetivoActividadExtraida"
              label="Objetivo de la Actividad"
              required
              readonly
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="formData.informe_objetivo"
              label="Informe de objetivo de la actividad"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="tipoActividadExtraida"
              label="Tipo de actividad"
              required
              readonly
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="formData.reporte_tipo"
              label="Reporte por Tipo"
              bg-color="blue-lighten-5"
              required
            ></v-text-field>
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
            v-model = "modalAbierto"
            :idactividad = "idActividad"
            @guardarAvances = "actualizarIndicadores"          >
          </Indicador-registro-bitacora>
          <br>

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
            <br>
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
            <br>
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
            <br>
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
            <br>
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
   <!-- <pre>{{ data }}</pre> -->
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario';
import IndicadorRegistroBitacora from '@/modules/reportes/components/IndicadorRegistroBitacora.vue';

const modalAbierto = ref(false);

// Composables
const { usuario, informacionUsuarioPorNick } = useUsuario();

// Router
const route = useRoute()
const idActividad = route.params.id || null
const idTarea = route.query.tarea_id || null

// Estado reactivo
const loading = ref(false)
const indicatorDialog = ref(false)
const data = ref(null)

// Datos para cargar el formulario
const tipoActividadExtraida = ref('')
const objetivoActividadExtraida = ref('')

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
  { id: 4, nombre: 'Cumplimiento de cronograma' }
]

const formData = reactive({
  contribucion_proyecto: '',
  contribucion_actividad: '',
  objetivoActividadExtraida: '',
  informe_de_objetivo_de_actividad: '',
  tipoActividadExtraida: '',
  reporte_por_tipo: '',
  avance_en_indicador: '',
  informacion_cuantitativa: '',
  archivos_cuantitativos: [],
  herramientas_de_evaluacion_y_resultados: '',
  herramientas_archivos: [],
  descripcion_de_medios_de_verificacion: '',
  medios_archivos: [],
  comentarios_recomendaciones: '',
})

const acceptedFormats = {
  herramientas: 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
  medios: 'image/*,video/*,.mp3,.pdf,.doc,.docx',
}

const actualizarIndicadores = (payload) => {
  formData.avance_en_indicador = payload;
};

// Métodos
async function obtenerDatosProyecto(id) {
  try {
    const url = `http://127.0.0.1:8000/api/actividad-indicadores-proyecto/${id}/`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }

    const result = await response.json();
    console.log('Datos obtenidos:', result);
    data.value = result;

    tipoActividadExtraida.value = data.value?.tipo_info?.tipo_actividad || '';
    objetivoActividadExtraida.value = data.value?.objetivo_de_actividad || '';

    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

function getCurrentUserNick() {
  // Esta función debería obtener el nick del usuario actualmente autenticado
  return 'ACarvajal';
}

async function prefillFormData() {
  try {
    const currentNick = getCurrentUserNick();
    await informacionUsuarioPorNick({ usuario: currentNick });

    if (usuario.value) {
      formData.responsable_actividad = `${usuario.value.nombre} ${usuario.value.paterno} ${usuario.value.materno}`.trim();
    }
  } catch (err) {
    console.error('Error al pre-llenar los datos del usuario:', err);
  }
}

// function openIndicatorDialog() {
//   indicatorDialog.value = true;
// }

function seleccionarIndicador(indicador) {
  formData.indicador_seleccionado = indicador.nombre;
  indicatorDialog.value = false;
}

async function submitForm() {
  loading.value = true;
  try {
    // Validación de campos requeridos
    if (

      !formData.contribucion_proyecto ||
      !formData.contribucion_actividad ||
      !formData.informe_de_objetivo_de_actividad ||
      !formData.reporte_por_tipo ||
      !formData.avance_en_indicador ||
      !formData.informacion_cuantitativa ||
      !formData.herramientas_de_evaluacion_y_resultados ||
      !formData.descripcion_de_medios_de_verificacion ||
      !formData.comentarios_recomendaciones
    ) {
      throw new Error('Por favor complete todos los campos requeridos del Informe de Actividades.');
    }

    const payload = new FormData();

    // Agregar todos los campos al FormData
    Object.keys(formData).forEach(key => {
      if (key.includes('archivos') || key.includes('_archivos')) {
        // Manejar arrays de archivos
        if (formData[key] && formData[key].length > 0) {
          formData[key].forEach(file => {
            payload.append(key, file);
          });
        }
      } else {
        payload.append(key, formData[key]);
      }
    });

    const response = await axios.post(
      'http://127.0.0.1:8000/tu_api_de_informes/crearInforme/',
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    alert('Informe de Actividades y archivos enviados con éxito');
    resetForm();
  } catch (error) {
    console.error('Error completo al enviar el informe:', error.response?.data || error.message);
    const errorMessage =
      error.response?.data?.message || error.message || 'Ocurrió un error inesperado al enviar el informe.';
    alert(`Error: ${errorMessage}`);
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  Object.assign(formData, {
    contribucion_proyecto: '',
    contribucion_actividad: '',
    informe_objetivo:'',
    //informe_de_objetivo_de_actividad:'',
    reporte_tipo:'',
    avance_en_indicador:'',
    informacion_cuantitativa:'',
    herramientas_de_evaluacion_y_resultados:'',
    descripcion_de_medios_de_verificacion:'',
    comentarios_recomendaciones:'',
  });
  prefillFormData();
}

// Ciclo de vida
onMounted(async () => {
  console.log('ID de Actividad:', idActividad);
  console.log('ID de Tarea:', idTarea);

  await prefillFormData();

  if (idActividad) {
    await obtenerDatosProyecto(idActividad);
  }
});

// WATCH PARA AUTO-LLENAR FORMULARIO CUANDO LLEGUEN LOS DATOS
watch(
  data,
  (newVal) => {
    if (newVal) {
      formData.contribucion_proyecto = newVal.contribucion_proyecto || '';
      formData.contribucion_actividad = newVal.contribucion_actividad || '';
      formData.nombre_actividad = newVal.nombre_actividad || '';
      formData.fecha_realizacion = newVal.fecha_realizacion || '';
      formData.objetivo_actividad = newVal.objetivo_actividad || '';
      formData.informe_objetivo = newVal.informe_objetivo || '';
      formData.tipo_actividad = newVal.tipo_actividad || '';
      formData.reporte_tipo = newVal.reporte_tipo || '';
      formData.indicador_seleccionado = newVal.indicador_seleccionado || '';
      formData.informacion_cuantitativa = newVal.informacion_cuantitativa || '';
      formData.descripcion_herramientas = newVal.descripcion_herramientas || '';
      formData.medios_verificacion = newVal.medios_verificacion || '';
      formData.comentarios_recomendaciones = newVal.comentarios_recomendaciones || '';
    }
  },
  { deep: true },
)

// Watchers
watch(() => route.params.id, (newId) => {
  if (newId) {
    obtenerDatosProyecto(newId);
  }
});
</script>

<style scoped>
/* Encabezado con gradiente y diseño mejorado */
.header-gradient {
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px 0 rgba(13, 71, 161, 0.2);
}

/* Elementos decorativos para el encabezado */
.header-decoration {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.decoration-circle-1 {
  width: 100px;
  height: 100px;
  top: -30px;
  right: -30px;
}

.decoration-circle-2 {
  width: 60px;
  height: 60px;
  bottom: -20px;
  right: 70px;
}

.decoration-circle-3 {
  width: 80px;
  height: 80px;
  bottom: 40px;
  left: -40px;
}

/* Ajustes para el formulario */
.v-card {
  max-width: 900px;
  margin: 0 auto;
  overflow: hidden;
}

.form-section {
  margin-bottom: 24px;
}

/* Mejora visual para los títulos de sección */
:deep(.v-card-subtitle.text-h6) {
  color: #1976d2;
  font-weight: 600;
  padding-left: 8px;
  border-left: 4px solid #1976d2;
}
</style>
