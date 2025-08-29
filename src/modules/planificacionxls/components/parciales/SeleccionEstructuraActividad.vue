<template>
  <v-container fluid class="pa-4">
    <v-card>
      <v-card-title class="bg-blue-darken-3 text-white py-4">
        <v-icon class="mr-2">mdi-folder-information</v-icon>
        Datos del Proyecto
      </v-card-title>

      <v-card-text class="bg-blue-lighten-5 py-5">
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="proyecto.codigo"
              label="Código del Proyecto"
              variant="outlined"
              density="comfortable"
              readonly
              bg-color="white"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="proyecto.titulo"
              label="Nombre del Proyecto"
              variant="outlined"
              density="comfortable"
              readonly
              bg-color="white"
            ></v-text-field>
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
            v-model="selectedObjetivoGeneral"
            :items="objetivosGenerales"
            item-title="codigo"
            item-value="id"
            label="Objetivo General"
            variant="outlined"
            prepend-icon="mdi-target"
            return-object
            clearable
            @update:model-value="onObjetivoGeneralSelected"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
            </template>
          </v-select>
        </div>

        <div v-if="selectedObjetivoGeneral">
          <v-select
            v-model="selectedIndicadorOG"
            :items="selectedObjetivoGeneral?.indicador_og || []"
            item-title="codigo"
            item-value="id"
            label="Indicador de Objetivo General"
            variant="outlined"
            prepend-icon="mdi-chart-line"
            return-object
            clearable
            class="mb-4"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
            </template>
          </v-select>

          <v-row>
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="h-100">
                <v-card-title class="bg-blue-lighten-4 py-3">
                  <v-icon color="blue" class="mr-2">mdi-arrow-left-bold</v-icon>
                  Procedencia desde Objetivo General
                </v-card-title>
                <v-card-text class="pt-4">
                  <v-select
                    v-model="selectedResultadoOG"
                    :items="selectedObjetivoGeneral?.resultados_og || []"
                    item-title="codigo"
                    item-value="id"
                    label="Resultado de Objetivo General"
                    variant="outlined"
                    prepend-icon="mdi-chart-tree"
                    return-object
                    clearable
                    class="mb-4"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-if="selectedResultadoOG"
                    v-model="selectedIndicadorResultadoOG"
                    :items="selectedResultadoOG?.indicador_res_og || []"
                    item-title="codigo"
                    item-value="id"
                    label="Indicador de Resultado OG"
                    variant="outlined"
                    prepend-icon="mdi-chart-line"
                    return-object
                    clearable
                    class="mb-4"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-model="selectedProcesoOG"
                    :items="selectedResultadoOG?.proceso_resultado_og || []"
                    item-title="codigo"
                    item-value="id"
                    label="Proceso de Resultado OG"
                    variant="outlined"
                    prepend-icon="mdi-cogs"
                    return-object
                    clearable
                    :disabled="!selectedResultadoOG"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.titulo"></v-list-item>
                    </template>
                  </v-select>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card variant="outlined" class="h-100">
                <v-card-title class="bg-green-lighten-4 py-3">
                  <v-icon color="green" class="mr-2">mdi-arrow-right-bold</v-icon>
                  Procedencia desde Objetivo Específico
                </v-card-title>
                <v-card-text class="pt-4">
                  <v-select
                    v-model="selectedObjetivoEspecifico"
                    :items="selectedObjetivoGeneral?.objetivos_especificos_og || []"
                    item-title="codigo"
                    item-value="id"
                    label="Objetivo Específico"
                    variant="outlined"
                    prepend-icon="mdi-target"
                    return-object
                    clearable
                    class="mb-4"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-if="selectedObjetivoEspecifico"
                    v-model="selectedIndicadorOE"
                    :items="selectedObjetivoEspecifico?.indicador_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Indicador de Objetivo Específico"
                    variant="outlined"
                    prepend-icon="mdi-chart-line"
                    return-object
                    clearable
                    class="mb-4"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-model="selectedResultadoOE"
                    :items="selectedObjetivoEspecifico?.resultados_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Resultado de Objetivo Específico"
                    variant="outlined"
                    prepend-icon="mdi-chart-tree"
                    return-object
                    clearable
                    class="mb-4"
                    :disabled="!selectedObjetivoEspecifico"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-if="selectedResultadoOE"
                    v-model="selectedIndicadorResultadoOE"
                    :items="selectedResultadoOE?.indicador_res_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Indicador de Resultado OE"
                    variant="outlined"
                    prepend-icon="mdi-chart-line"
                    return-object
                    clearable
                    class="mb-4"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-model="selectedProcesoOE"
                    :items="selectedResultadoOE?.proceso_resultado_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Proceso de Resultado OE"
                    variant="outlined"
                    prepend-icon="mdi-cogs"
                    return-object
                    clearable
                    class="mb-4"
                    :disabled="!selectedResultadoOE"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.titulo"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-model="selectedProductoOE"
                    :items="selectedObjetivoEspecifico?.productos_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Producto de Objetivo Específico"
                    variant="outlined"
                    prepend-icon="mdi-package-variant"
                    return-object
                    clearable
                    class="mb-4"
                    :disabled="!selectedObjetivoEspecifico"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-model="selectedProcesoProductoOE"
                    :items="selectedProductoOE?.proceso_producto_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Proceso de Producto OE"
                    variant="outlined"
                    prepend-icon="mdi-cogs"
                    return-object
                    clearable
                    :disabled="!selectedProductoOE"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.titulo"></v-list-item>
                    </template>
                  </v-select>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

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
            </v-row>

            <v-card-actions class="pt-4">
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="resetSeleccion"> Cancelar </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                @click="crearActividad"
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
            Seleccione un Objetivo General para ver las opciones de procedencia
          </v-alert>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'

// Props para recibir datos del proyecto desde el componente padre
const props = defineProps({
  proyectoData: {
    type: Object,
    required: true,
  },
})

// Datos del proyecto (se inicializarán desde los props)
const proyecto = ref({})
const objetivosGenerales = ref([])

// Variables reactivas para la selección
const selectedObjetivoGeneral = ref(null)
const selectedIndicadorOG = ref(null)
const selectedResultadoOG = ref(null)
const selectedIndicadorResultadoOG = ref(null)
const selectedProcesoOG = ref(null)
const selectedObjetivoEspecifico = ref(null)
const selectedIndicadorOE = ref(null)
const selectedResultadoOE = ref(null)
const selectedIndicadorResultadoOE = ref(null)
const selectedProcesoOE = ref(null)
const selectedProductoOE = ref(null)
const selectedProcesoProductoOE = ref(null)

// Nueva actividad
const nuevaActividad = ref({
  codigo: '',
  titulo: '',
})

// Preprocesar datos cuando el componente se monta
onMounted(() => {
  preprocesarDatos()
})

// Función para preprocesar los datos de la API
const preprocesarDatos = () => {
  // Copiar los datos del proyecto
  proyecto.value = { ...props.proyectoData }

  if (proyecto.value.objetivo_general) {
    const objetivoGeneral = proyecto.value.objetivo_general
    objetivoGeneral.indicador_og = objetivoGeneral.indicador_og || []
    objetivoGeneral.resultados_og = objetivoGeneral.resultados_og || []
    objetivoGeneral.objetivos_especificos_og = objetivoGeneral.objetivos_especificos_og || []

    objetivoGeneral.resultados_og.forEach((resultado) => {
      resultado.proceso_resultado_og = resultado.proceso_resultado_og || []
      resultado.indicador_res_og = resultado.indicador_res_og || []
      resultado.productos_res_og = resultado.productos_res_og || []
    })

    objetivoGeneral.objetivos_especificos_og.forEach((objetivoEspecifico) => {
      objetivoEspecifico.indicador_oe = objetivoEspecifico.indicador_oe || []
      objetivoEspecifico.resultados_oe = objetivoEspecifico.resultados_oe || []
      objetivoEspecifico.productos_oe = objetivoEspecifico.productos_oe || []

      objetivoEspecifico.resultados_oe.forEach((resultado) => {
        resultado.proceso_resultado_oe = resultado.proceso_resultado_oe || []
        resultado.indicador_res_oe = resultado.indicador_res_oe || []
        resultado.productos_res_oe = resultado.productos_res_oe || []
      })

      objetivoEspecifico.productos_oe.forEach((producto) => {
        producto.proceso_producto_oe = producto.proceso_producto_oe || []
      })
    })

    objetivosGenerales.value = [objetivoGeneral]
  } else {
    objetivosGenerales.value = []
  }
}

// Validación del formulario
const esFormularioValido = computed(() => {
  return nuevaActividad.value.codigo && nuevaActividad.value.titulo
})

// Métodos para manejar selecciones
const onObjetivoGeneralSelected = () => {
  selectedIndicadorOG.value = null
  selectedResultadoOG.value = null
  selectedIndicadorResultadoOG.value = null
  selectedProcesoOG.value = null
  selectedObjetivoEspecifico.value = null
  selectedIndicadorOE.value = null
  selectedResultadoOE.value = null
  selectedIndicadorResultadoOE.value = null
  selectedProcesoOE.value = null
  selectedProductoOE.value = null
  selectedProcesoProductoOE.value = null
}

//Iniciar el composable de actividad
const { crearActividad: crearActividadComposable } = useActividad()

// Crear actividad
const crearActividad = async () => {
  // Construir el objeto de estructura de procedencia con todas las selecciones
  const estructuraProcedencia = {
    objetivoGeneral: selectedObjetivoGeneral.value
      ? { id: selectedObjetivoGeneral.value.id }
      : null,
    indicadorOG: selectedIndicadorOG.value ? { id: selectedIndicadorOG.value.id } : null,
    resultadoOG: selectedResultadoOG.value ? { id: selectedResultadoOG.value.id } : null,
    indicadorResultadoOG: selectedIndicadorResultadoOG.value
      ? { id: selectedIndicadorResultadoOG.value.id }
      : null,
    procesoOG: selectedProcesoOG.value ? { id: selectedProcesoOG.value.id } : null,
    objetivoEspecifico: selectedObjetivoEspecifico.value
      ? { id: selectedObjetivoEspecifico.value.id }
      : null,
    indicadorOE: selectedIndicadorOE.value ? { id: selectedIndicadorOE.value.id } : null,
    resultadoOE: selectedResultadoOE.value ? { id: selectedResultadoOE.value.id } : null,
    indicadorResultadoOE: selectedIndicadorResultadoOE.value
      ? { id: selectedIndicadorResultadoOE.value.id }
      : null,
    procesoOE: selectedProcesoOE.value ? { id: selectedProcesoOE.value.id } : null,
    productoOE: selectedProductoOE.value ? { id: selectedProductoOE.value.id } : null,
    procesoProductoOE: selectedProcesoProductoOE.value
      ? { id: selectedProcesoProductoOE.value.id }
      : null,
  }

  const actividadCompleta = {
    codigo: nuevaActividad.value.codigo,
    nombreCorto: nuevaActividad.value.titulo,
    estado: 'CRD',
    estructuraProcedencia: estructuraProcedencia,
    proyecto: proyecto.value.id,
    responsable: nuevaActividad.value.responsable,
  }

  try {
    await crearActividadComposable(actividadCompleta)
  } catch (e) {
    console.error(e)
  }

  console.log('Actividad creada:', actividadCompleta)

  // Emitir el evento con el nuevo formato
  emit('crear-actividad', actividadCompleta)

  // Resetear el formulario
  resetSeleccion()
}

// Resetear toda la selección
const resetSeleccion = () => {
  selectedObjetivoGeneral.value = null
  selectedIndicadorOG.value = null
  selectedResultadoOG.value = null
  selectedIndicadorResultadoOG.value = null
  selectedProcesoOG.value = null
  selectedObjetivoEspecifico.value = null
  selectedIndicadorOE.value = null
  selectedResultadoOE.value = null
  selectedIndicadorResultadoOE.value = null
  selectedProcesoOE.value = null
  selectedProductoOE.value = null
  selectedProcesoProductoOE.value = null

  // Resetear formulario
  nuevaActividad.value = {
    codigo: '',
    titulo: '',
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

/* Mejoras de espaciado */
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
