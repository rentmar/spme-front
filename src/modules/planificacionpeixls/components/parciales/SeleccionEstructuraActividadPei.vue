<template>
  <v-container fluid class="pa-4">
    <v-card>
      <v-card-title class="bg-blue-darken-3 text-white py-4">
        <v-icon class="mr-2">mdi-folder-information</v-icon>
        Datos del PEI
      </v-card-title>

      <v-card-text class="bg-blue-lighten-5 py-5">
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="pei.codigo"
              label="Código del PEI"
              variant="outlined"
              density="comfortable"
              readonly
              bg-color="white"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="pei.titulo"
              label="Nombre del PEI"
              variant="outlined"
              density="comfortable"
              readonly
              bg-color="white"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Resumen del PEI -->
        <v-row v-if="pei.resumen" class="mt-2">
          <v-col cols="12" md="3" class="text-center">
            <v-chip color="primary" variant="flat" class="ma-1">
              {{ pei.resumen.total_objetivos }} Objetivos
            </v-chip>
          </v-col>
          <v-col cols="12" md="3" class="text-center">
            <v-chip color="secondary" variant="flat" class="ma-1">
              {{ pei.resumen.total_factores_criticos }} Factores
            </v-chip>
          </v-col>
          <v-col cols="12" md="3" class="text-center">
            <v-chip color="success" variant="flat" class="ma-1">
              {{ pei.resumen.total_indicadores_cuantitativos }} Ind. Cuant.
            </v-chip>
          </v-col>
          <v-col cols="12" md="3" class="text-center">
            <v-chip color="warning" variant="flat" class="ma-1">
              {{ pei.resumen.total_indicadores_cualitativos }} Ind. Cual.
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-title class="section-title py-4">
        <v-icon class="mr-2">mdi-chart-tree</v-icon>
        Estructura de Procedencia para Actividad
      </v-card-title>

      <v-card-text class="py-5">
        <div class="mb-6">
          <v-select
            v-model="selectedObjetivo"
            :items="objetivos"
            item-title="codigo"
            item-value="id"
            label="Objetivo del PEI"
            variant="outlined"
            prepend-icon="mdi-target"
            return-object
            clearable
            @update:model-value="onObjetivoSelected"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
            </template>
          </v-select>
        </div>

        <div v-if="selectedObjetivo">
          <v-row>
            <!-- Columna Izquierda: Factores Críticos e Indicadores -->
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="h-100">
                <v-card-title class="bg-blue-lighten-4 py-3">
                  <v-icon color="blue" class="mr-2">mdi-format-list-checks</v-icon>
                  Factores Críticos
                </v-card-title>
                <v-card-text class="pt-4">
                  <v-select
                    v-model="selectedFactoresCriticos"
                    :items="selectedObjetivo?.factores_criticos || []"
                    item-title="factor_critico"
                    item-value="id"
                    label="Factores Críticos"
                    variant="outlined"
                    prepend-icon="mdi-alert-circle"
                    return-object
                    clearable
                    multiple
                    chips
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.factor_critico"></v-list-item>
                    </template>
                  </v-select>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card variant="outlined" class="h-100">
                <v-card-title class="bg-green-lighten-4 py-3">
                  <v-icon color="green" class="mr-2">mdi-chart-line</v-icon>
                  Indicadores del Objetivo
                </v-card-title>
                <v-card-text class="pt-4">
                  <!-- Indicadores Cuantitativos -->
                  <v-select
                    v-model="selectedIndicadoresCuantitativos"
                    :items="selectedObjetivo?.indicadores_cuantitativos || []"
                    item-title="codigo"
                    item-value="id"
                    label="Indicadores Cuantitativos"
                    variant="outlined"
                    prepend-icon="mdi-numeric"
                    return-object
                    clearable
                    multiple
                    chips
                    class="mb-4"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <!-- Indicadores Cualitativos -->
                  <v-select
                    v-model="selectedIndicadoresCualitativos"
                    :items="selectedObjetivo?.indicadores_cualitativos || []"
                    item-title="codigo"
                    item-value="id"
                    label="Indicadores Cualitativos"
                    variant="outlined"
                    prepend-icon="mdi-text-box"
                    return-object
                    clearable
                    multiple
                    chips
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Formulario para Nueva Actividad -->
          <div class="activity-form-container mt-6">
            <v-card-title class="px-0 pt-2 pb-4">
              <v-icon class="mr-2" color="primary">mdi-plus-circle</v-icon>
              Crear Nueva Actividad
            </v-card-title>

            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="nuevaActividad.codigo"
                  label="Código de Actividad"
                  variant="outlined"
                  clearable
                  density="comfortable"
                  :rules="[(v) => !!v || 'El código es requerido']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="nuevaActividad.titulo"
                  label="Nombre de la Actividad"
                  variant="outlined"
                  clearable
                  density="comfortable"
                  :rules="[(v) => !!v || 'El título es requerido']"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="nuevaActividad.descripcion"
                  label="Descripción de la Actividad"
                  variant="outlined"
                  clearable
                  rows="3"
                  density="comfortable"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-card-actions class="pt-4">
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="resetSeleccion"> Cancelar </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                @click="mostrarDialogoConfirmacion"
                :disabled="!esFormularioValido"
              >
                Crear Actividad
              </v-btn>
            </v-card-actions>
          </div>
        </div>

        <div v-else class="text-center mt-8">
          <v-alert type="info" variant="outlined">
            <v-icon class="mr-2">mdi-information</v-icon>
            Seleccione un Objetivo del PEI para ver las opciones de procedencia
          </v-alert>
        </div>
      </v-card-text>
    </v-card>

    <!-- Diálogo de Confirmación -->
    <v-dialog v-model="dialogVisible" max-width="600">
      <v-card>
        <v-card-title class="bg-blue-darken-3 text-white">
          <v-icon class="mr-2">mdi-check-circle-outline</v-icon>
          Confirmar Creación de Actividad
        </v-card-title>

        <v-card-text class="py-4">
          <h4 class="text-subtitle-1 mb-2">Datos de la nueva Actividad:</h4>
          <v-list density="compact" class="mb-4">
            <v-list-item>
              <v-list-item-title
                ><strong>Código:</strong> {{ nuevaActividad.codigo }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><strong>Título:</strong> {{ nuevaActividad.titulo }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item v-if="nuevaActividad.descripcion">
              <v-list-item-title
                ><strong>Descripción:</strong> {{ nuevaActividad.descripcion }}</v-list-item-title
              >
            </v-list-item>
          </v-list>

          <h4 class="text-subtitle-1 mb-2">Estructura de Procedencia:</h4>
          <v-card variant="outlined" class="pa-3">
            <v-list density="compact">
              <!-- Objetivo Seleccionado -->
              <v-list-item v-if="selectedObjetivo">
                <v-list-item-title>
                  <strong>Objetivo:</strong> {{ selectedObjetivo.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ selectedObjetivo.descripcion }}</v-list-item-subtitle>
              </v-list-item>

              <!-- Factores Críticos -->
              <v-list-item v-if="selectedFactoresCriticos?.length">
                <v-list-item-title>
                  <strong>Factores Críticos:</strong>
                </v-list-item-title>
                <v-chip-group>
                  <v-chip
                    v-for="factor in selectedFactoresCriticos"
                    :key="factor.id"
                    size="small"
                    color="secondary"
                  >
                    {{ factor.factor_critico }}
                  </v-chip>
                </v-chip-group>
              </v-list-item>

              <!-- Indicadores Cuantitativos -->
              <v-list-item v-if="selectedIndicadoresCuantitativos?.length">
                <v-list-item-title>
                  <strong>Indicadores Cuantitativos:</strong>
                </v-list-item-title>
                <v-chip-group>
                  <v-chip
                    v-for="indicador in selectedIndicadoresCuantitativos"
                    :key="indicador.id"
                    size="small"
                    color="success"
                  >
                    {{ indicador.codigo }}
                  </v-chip>
                </v-chip-group>
              </v-list-item>

              <!-- Indicadores Cualitativos -->
              <v-list-item v-if="selectedIndicadoresCualitativos?.length">
                <v-list-item-title>
                  <strong>Indicadores Cualitativos:</strong>
                </v-list-item-title>
                <v-chip-group>
                  <v-chip
                    v-for="indicador in selectedIndicadoresCualitativos"
                    :key="indicador.id"
                    size="small"
                    color="warning"
                  >
                    {{ indicador.codigo }}
                  </v-chip>
                </v-chip-group>
              </v-list-item>

              <!-- Mensaje si no hay selecciones adicionales -->
              <v-list-item
                v-if="
                  !selectedFactoresCriticos?.length &&
                  !selectedIndicadoresCuantitativos?.length &&
                  !selectedIndicadoresCualitativos?.length
                "
              >
                <v-list-item-title class="text-grey">
                  <v-icon small class="mr-1">mdi-information</v-icon>
                  Solo se ha seleccionado el objetivo
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialogVisible = false"> Cancelar </v-btn>
          <v-btn color="primary" variant="flat" @click="confirmarCreacion">
            Confirmar y Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'

// Props para recibir datos del PEI desde el componente padre
const props = defineProps({
  peiData: {
    type: Object,
    required: true,
  },
})

// Variables reactivas
const pei = ref({})
const objetivos = ref([])
const dialogVisible = ref(false)

// Variables de selección
const selectedObjetivo = ref(null)
const selectedFactoresCriticos = ref([])
const selectedIndicadoresCuantitativos = ref([])
const selectedIndicadoresCualitativos = ref([])

// Nueva actividad
const nuevaActividad = ref({
  codigo: '',
  titulo: '',
  descripcion: '',
})

// Iniciar composables
const { crearActividad: crearActividadComposable } = useActividad()
const proyectoStore = useProyectoStore()

// Inicializar datos cuando el componente se monta
onMounted(() => {
  inicializarDatos()
})

// Validación del formulario
const esFormularioValido = computed(() => {
  return nuevaActividad.value.codigo && nuevaActividad.value.titulo
})

// Función para inicializar datos del PEI
const inicializarDatos = () => {
  if (props.peiData.pei) {
    pei.value = { ...props.peiData.pei }
    objetivos.value = pei.value.objetivos || []
  } else {
    // Si viene directamente el objeto PEI
    pei.value = { ...props.peiData }
    objetivos.value = props.peiData.objetivos || []
  }
}

// Cuando se selecciona un objetivo
const onObjetivoSelected = () => {
  // Limpiar selecciones anteriores
  selectedFactoresCriticos.value = []
  selectedIndicadoresCuantitativos.value = []
  selectedIndicadoresCualitativos.value = []
}

// Obtener estructura de procedencia
const obtenerEstructuraProcedencia = () => {
  const estructura = {}

  if (selectedObjetivo.value) {
    estructura.objetivo = {
      tipo: 'objetivo_pei',
      data: selectedObjetivo.value,
    }
  }

  if (selectedFactoresCriticos.value.length > 0) {
    estructura.factores_criticos = selectedFactoresCriticos.value.map((factor) => ({
      tipo: 'factor_critico',
      data: factor,
    }))
  }

  if (selectedIndicadoresCuantitativos.value.length > 0) {
    estructura.indicadores_cuantitativos = selectedIndicadoresCuantitativos.value.map(
      (indicador) => ({
        tipo: 'indicador_cuantitativo',
        data: indicador,
      }),
    )
  }

  if (selectedIndicadoresCualitativos.value.length > 0) {
    estructura.indicadores_cualitativos = selectedIndicadoresCualitativos.value.map(
      (indicador) => ({
        tipo: 'indicador_cualitativo',
        data: indicador,
      }),
    )
  }

  return estructura
}

// Obtener selecciones simples (solo IDs)
const obtenerSeleccionesSimples = () => {
  const selecciones = {}

  if (selectedObjetivo.value) {
    selecciones.objetivoId = selectedObjetivo.value.id
  }

  if (selectedFactoresCriticos.value.length > 0) {
    selecciones.factoresCriticosIds = selectedFactoresCriticos.value.map((f) => f.id)
  }

  if (selectedIndicadoresCuantitativos.value.length > 0) {
    selecciones.indicadoresCuantitativosIds = selectedIndicadoresCuantitativos.value.map(
      (i) => i.id,
    )
  }

  if (selectedIndicadoresCualitativos.value.length > 0) {
    selecciones.indicadoresCualitativosIds = selectedIndicadoresCualitativos.value.map((i) => i.id)
  }

  return selecciones
}

// Mostrar diálogo de confirmación
const mostrarDialogoConfirmacion = () => {
  dialogVisible.value = true
}

// Confirmar creación de actividad
const confirmarCreacion = async () => {
  dialogVisible.value = false

  const estructuraProcedencia = obtenerEstructuraProcedencia()
  const seleccionesSimples = obtenerSeleccionesSimples()

  // Almacenar en el store si es necesario
  proyectoStore.almacenarNodosProcedenciaActividad(estructuraProcedencia)

  const actividadCompleta = {
    codigo: nuevaActividad.value.codigo,
    nombreCorto: nuevaActividad.value.titulo,
    descripcion: nuevaActividad.value.descripcion,
    estado: 'PLAN',
    estructuraProcedencia: {
      datosProcedencia: estructuraProcedencia,
      nodosRelacionados: proyectoStore.nodosVinculadosActividad,
      seleccionesSimples: seleccionesSimples,
    },
    pei: pei.value.id,
    objetivos_pei: seleccionesSimples.objetivoId ? [seleccionesSimples.objetivoId] : [],
    indicadores_cuantitativos: seleccionesSimples.indicadoresCuantitativosIds || [],
    indicadores_cualitativos: seleccionesSimples.indicadoresCualitativosIds || [],
  }

  try {
    await crearActividadComposable(actividadCompleta)
    emit('crear-actividad', actividadCompleta)
    resetSeleccion()
  } catch (error) {
    console.error('Error al crear actividad:', error)
  }
}

// Resetear selección
const resetSeleccion = () => {
  selectedObjetivo.value = null
  selectedFactoresCriticos.value = []
  selectedIndicadoresCuantitativos.value = []
  selectedIndicadoresCualitativos.value = []
  nuevaActividad.value = {
    codigo: '',
    titulo: '',
    descripcion: '',
  }
}

// Emit para comunicarse con el componente padre
const emit = defineEmits(['crear-actividad'])
</script>

<style scoped>
.h-100 {
  height: 100%;
}
.section-title {
  background: linear-gradient(45deg, #1976d2, #0d47a1);
  color: white;
}
.activity-form-container {
  border: 2px dashed #1976d2;
  border-radius: 8px;
  padding: 20px;
  background-color: #e3f2fd;
}
.v-card {
  border-radius: 8px;
}
.v-card-title {
  padding-top: 16px;
  padding-bottom: 16px;
}
.v-card-text {
  padding-top: 20px;
  padding-bottom: 20px;
}
.bg-blue-lighten-5 {
  padding-top: 24px;
  padding-bottom: 24px;
}
</style>
