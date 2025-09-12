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
            multiple
            chips
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
            Seleccione un Objetivo General para ver las opciones de procedencia
          </v-alert>
        </div>
      </v-card-text>
    </v-card>

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
          </v-list>

          <h4 class="text-subtitle-1 mb-2">Estructura de Procedencia:</h4>
          <v-card variant="outlined" class="pa-3">
            <v-list density="compact">
              <v-list-item v-if="collectedData.objetivogeneral">
                <v-list-item-title>
                  <strong>Objetivo General:</strong> {{ collectedData.objetivogeneral.data.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  collectedData.objetivogeneral.data.descripcion
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="collectedData.indicadorog?.length">
                <v-list-item-title>
                  <strong>Indicador OG:</strong>
                </v-list-item-title>
                <v-chip-group>
                  <v-chip
                    v-for="item in collectedData.indicadorog"
                    :key="item.data.id"
                    size="small"
                  >
                    {{ item.data.codigo }}
                  </v-chip>
                </v-chip-group>
              </v-list-item>

              <v-list-item v-if="collectedData.resultadoog">
                <v-list-item-title>
                  <strong>Resultado OG:</strong> {{ collectedData.resultadoog.data.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  collectedData.resultadoog.data.descripcion
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="collectedData.indicadorresultadoog">
                <v-list-item-title>
                  <strong>Indicador Res. OG:</strong>
                  {{ collectedData.indicadorresultadoog.data.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  collectedData.indicadorresultadoog.data.descripcion
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="collectedData.procesoog">
                <v-list-item-title>
                  <strong>Proceso OG:</strong> {{ collectedData.procesoog.data.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  collectedData.procesoog.data.titulo
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="collectedData.objetivoespecifico">
                <v-list-item-title>
                  <strong>Objetivo Específico:</strong>
                  {{ collectedData.objetivoespecifico.data.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  collectedData.objetivoespecifico.data.descripcion
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="collectedData.indicadoroe">
                <v-list-item-title>
                  <strong>Indicador OE:</strong> {{ collectedData.indicadoroe.data.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  collectedData.indicadoroe.data.descripcion
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="collectedData.resultadooe">
                <v-list-item-title>
                  <strong>Resultado OE:</strong> {{ collectedData.resultadooe.data.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  collectedData.resultadooe.data.descripcion
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="collectedData.indicadorresultadooe">
                <v-list-item-title>
                  <strong>Indicador Res. OE:</strong>
                  {{ collectedData.indicadorresultadooe.data.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  collectedData.indicadorresultadooe.data.descripcion
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="collectedData.procesooe">
                <v-list-item-title>
                  <strong>Proceso OE:</strong> {{ collectedData.procesooe.data.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  collectedData.procesooe.data.titulo
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="collectedData.productoe">
                <v-list-item-title>
                  <strong>Producto OE:</strong> {{ collectedData.productoe.data.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  collectedData.productoe.data.descripcion
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="collectedData.procesoproductoe">
                <v-list-item-title>
                  <strong>Proceso Producto OE:</strong>
                  {{ collectedData.procesoproductoe.data.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  collectedData.procesoproductoe.data.titulo
                }}</v-list-item-subtitle>
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

// Props para recibir datos del proyecto desde el componente padre
const props = defineProps({
  proyectoData: {
    type: Object,
    required: true,
  },
})

// Variables reactivas para el estado del componente
const proyecto = ref({})
const objetivosGenerales = ref([])
const dialogVisible = ref(false)
const collectedData = ref({})

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

// Iniciar composables
const { crearActividad: crearActividadComposable } = useActividad()
const proyectoStore = useProyectoStore()

// Preprocesar datos cuando el componente se monta
onMounted(() => {
  preprocesarDatos()
})

// Validación del formulario
const esFormularioValido = computed(() => {
  return nuevaActividad.value.codigo && nuevaActividad.value.titulo
})

// Función para preprocesar los datos de la API
const preprocesarDatos = () => {
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

// 💡 Versión mejorada y segura de la función para recolectar datos
const obtenerEstructuraProcedencia = () => {
  const estructura = {}

  const selecciones = {
    objetivogeneral: selectedObjetivoGeneral,
    indicadorog: selectedIndicadorOG,
    resultadoog: selectedResultadoOG,
    indicadorresultadoog: selectedIndicadorResultadoOG,
    procesoog: selectedProcesoOG,
    objetivoespecifico: selectedObjetivoEspecifico,
    indicadoroe: selectedIndicadorOE,
    resultadooe: selectedResultadoOE,
    indicadorresultadooe: selectedIndicadorResultadoOE,
    procesooe: selectedProcesoOE,
    productoe: selectedProductoOE,
    procesoproductoe: selectedProcesoProductoOE,
  }

  for (const tipo in selecciones) {
    const valorSeleccionado = selecciones[tipo].value

    if (valorSeleccionado) {
      if (Array.isArray(valorSeleccionado)) {
        // Manejo de selecciones múltiples
        estructura[tipo] = valorSeleccionado.map((data) => ({
          tipo: tipo,
          data: data,
        }))
      } else {
        // Manejo de selecciones simples
        estructura[tipo] = {
          tipo: tipo,
          data: valorSeleccionado,
        }
      }
    }
  }

  return estructura
}

// 💡 NUEVA FUNCIÓN: Obtiene las selecciones de manera simple (solo IDs) para edición
const obtenerSeleccionesSimples = () => {
  const seleccionesSimples = {}

  if (selectedObjetivoGeneral.value) {
    seleccionesSimples.objetivoGeneralId = selectedObjetivoGeneral.value.id
  }
  if (selectedIndicadorOG.value) {
    seleccionesSimples.indicadorOGIds = selectedIndicadorOG.value.map((item) => item.id)
  }
  if (selectedResultadoOG.value) {
    seleccionesSimples.resultadoOGId = selectedResultadoOG.value.id
  }
  if (selectedIndicadorResultadoOG.value) {
    seleccionesSimples.indicadorResultadoOGId = selectedIndicadorResultadoOG.value.id
  }
  if (selectedProcesoOG.value) {
    seleccionesSimples.procesoOGId = selectedProcesoOG.value.id
  }
  if (selectedObjetivoEspecifico.value) {
    seleccionesSimples.objetivoEspecificoId = selectedObjetivoEspecifico.value.id
  }
  if (selectedIndicadorOE.value) {
    seleccionesSimples.indicadorOEId = selectedIndicadorOE.value.id
  }
  if (selectedResultadoOE.value) {
    seleccionesSimples.resultadoOEId = selectedResultadoOE.value.id
  }
  if (selectedIndicadorResultadoOE.value) {
    seleccionesSimples.indicadorResultadoOEId = selectedIndicadorResultadoOE.value.id
  }
  if (selectedProcesoOE.value) {
    seleccionesSimples.procesoOEId = selectedProcesoOE.value.id
  }
  if (selectedProductoOE.value) {
    seleccionesSimples.productoOEId = selectedProductoOE.value.id
  }
  if (selectedProcesoProductoOE.value) {
    seleccionesSimples.procesoProductoOEId = selectedProcesoProductoOE.value.id
  }

  return seleccionesSimples
}

// Mostrar el diálogo de confirmación
const mostrarDialogoConfirmacion = () => {
  collectedData.value = obtenerEstructuraProcedencia()
  dialogVisible.value = true
}

// Crear actividad después de la confirmación
const confirmarCreacion = async () => {
  dialogVisible.value = false
  proyectoStore.almacenarNodosProcedenciaActividad(collectedData.value)

  const actividadCompleta = {
    codigo: nuevaActividad.value.codigo,
    nombreCorto: nuevaActividad.value.titulo,
    estado: 'CRD',
    estructuraProcedencia: {
      datosProcedencia: collectedData.value,
      nodosRelacionados: proyectoStore.nodosVinculadosActividad,
      // 💡 Se añade la nueva propiedad con las selecciones simples
      seleccionesSimples: obtenerSeleccionesSimples(),
    },
    proyecto: proyecto.value.id,
    responsable: nuevaActividad.value.responsable,
  }

  //console.log(actividadCompleta.estructuraProcedencia)
  //console.log(proyectoStore.nodosVinculadosActividad)
  //console.log(actividadCompleta)
  try {
    await crearActividadComposable(actividadCompleta)
    emit('crear-actividad', actividadCompleta)
  } catch (e) {
    console.error(e)
  }
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
