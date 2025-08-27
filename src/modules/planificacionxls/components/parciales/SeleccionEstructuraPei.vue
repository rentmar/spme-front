<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-chart-tree</v-icon>
            Estructura PEI
          </v-card-title>
          <v-card-text>
            <!-- Dropdowns para Objetivos, Indicadores y Factores Críticos -->
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  v-model="objetivoSeleccionado"
                  :items="objetivosPei"
                  item-title="descripcion"
                  item-value="id"
                  label="Objetivo PEI"
                  @update:modelValue="cargarIndicadoresYFactores"
                  return-object
                  clearable
                  :loading="estaCargando"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="indicadorSeleccionado"
                  :items="indicadoresPeiFiltrados"
                  item-title="descripcion"
                  item-value="id"
                  label="Indicador PEI"
                  :disabled="!objetivoSeleccionado"
                  return-object
                  clearable
                  :loading="estaCargando"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="factoresCriticosSeleccionados"
                  :items="factoresCriticosFiltrados"
                  item-title="factor_critico"
                  item-value="id"
                  label="Factores Críticos"
                  :disabled="!objetivoSeleccionado"
                  multiple
                  chips
                  clearable
                  :loading="estaCargando"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index < 2" class="ma-1" color="orange-lighten-3" small>
                      <span>{{ item.title }}</span>
                    </v-chip>
                    <span v-if="index === 2" class="text-grey text-caption align-self-center ml-2">
                      (+{{ factoresCriticosSeleccionados.length - 2 }} más)
                    </span>
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <!-- TextField para mostrar factores críticos seleccionados -->
            <v-row v-if="factoresCriticosSeleccionados.length > 0">
              <v-col cols="12">
                <v-text-field
                  :model-value="textoFactoresSeleccionados"
                  label="Factores Críticos Seleccionados"
                  readonly
                  variant="outlined"
                  bg-color="orange-lighten-5"
                  append-inner-icon="mdi-checkbox-multiple-marked"
                >
                  <template v-slot:append-inner>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" color="orange-darken-2">
                          mdi-checkbox-multiple-marked
                        </v-icon>
                      </template>
                      <span>{{ factoresCriticosSeleccionados.length }} factores seleccionados</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <!-- Tarjetas informativas -->
            <v-row v-if="objetivoSeleccionado || objetivoActual">
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1 bg-blue-lighten-5">
                    Objetivo PEI {{ objetivoSeleccionado ? 'Seleccionado' : 'Actual' }}
                  </v-card-title>
                  <v-card-text v-if="objetivoSeleccionado">
                    <p><strong>Código:</strong> {{ objetivoSeleccionado.codigo }}</p>
                    <p><strong>Nombre:</strong> {{ objetivoSeleccionado.nombre }}</p>
                    <p><strong>Descripción:</strong> {{ objetivoSeleccionado.descripcion }}</p>
                  </v-card-text>
                  <v-card-text v-else-if="objetivoActual">
                    <p><strong>Código:</strong> {{ objetivoActual.codigo }}</p>
                    <p><strong>Nombre:</strong> {{ objetivoActual.nombre }}</p>
                    <p><strong>Descripción:</strong> {{ objetivoActual.descripcion }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row v-if="indicadorSeleccionado || indicadorActual">
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1 bg-green-lighten-5">
                    Indicador PEI {{ indicadorSeleccionado ? 'Seleccionado' : 'Actual' }}
                  </v-card-title>
                  <v-card-text v-if="indicadorSeleccionado">
                    <p><strong>Código:</strong> {{ indicadorSeleccionado.codigo }}</p>
                    <p><strong>Nombre:</strong> {{ indicadorSeleccionado.nombre }}</p>
                    <p><strong>Descripción:</strong> {{ indicadorSeleccionado.descripcion }}</p>
                    <p><strong>Meta:</strong> {{ indicadorSeleccionado.meta }}</p>
                  </v-card-text>
                  <v-card-text v-else-if="indicadorActual">
                    <p><strong>Código:</strong> {{ indicadorActual.codigo }}</p>
                    <p><strong>Nombre:</strong> {{ indicadorActual.nombre }}</p>
                    <p><strong>Descripción:</strong> {{ indicadorActual.descripcion }}</p>
                    <p><strong>Meta:</strong> {{ indicadorActual.meta }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Lista detallada de factores críticos seleccionados -->
            <v-row v-if="factoresCriticosSeleccionados.length > 0">
              <v-col cols="12">
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1 bg-orange-lighten-5 d-flex align-center">
                    <v-icon class="mr-2" color="orange-darken-2">mdi-format-list-bulleted</v-icon>
                    Detalle de Factores Críticos Seleccionados
                    <v-spacer></v-spacer>
                    <v-chip color="orange" variant="flat" size="small">
                      {{ factoresCriticosSeleccionados.length }} seleccionados
                    </v-chip>
                  </v-card-title>
                  <v-card-text>
                    <v-list density="comfortable">
                      <v-list-item
                        v-for="factorId in factoresCriticosSeleccionados"
                        :key="factorId"
                        class="mb-2"
                      >
                        <template v-slot:prepend>
                          <v-icon color="orange-darken-2">mdi-check-circle</v-icon>
                        </template>
                        <v-list-item-title>
                          {{ obtenerNombreFactor(factorId) }}
                        </v-list-item-title>
                        <template v-slot:append>
                          <v-btn
                            icon
                            size="small"
                            variant="text"
                            color="error"
                            @click="removerFactorCritico(factorId)"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="cerrarModal">Cancelar</v-btn>
            <v-btn
              color="primary"
              variant="flat"
              @click="guardarSeleccion"
              :disabled="!indicadorSeleccionado && !props.indicadorInicial"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { usePeiCrud } from '@/modules/pei/composables/usePeiCrud'

// Props para recibir IDs iniciales
const props = defineProps({
  objetivoInicial: {
    type: Number,
    default: null,
  },
  indicadorInicial: {
    type: Number,
    default: null,
  },
  factoresCriticosIniciales: {
    type: Array,
    default: () => [],
  },
})

// El PEI vigente
const peiVigente = inject('peiVigente')
const idpei = 1

// Emits para comunicación con el componente padre
const emit = defineEmits(['guardar', 'cerrar'])

const { objetivosPei, indicadoresPei, obtenerObjetivosPeiPorIdPei, obtenerIndicadoresPeiPorIdPei } =
  usePeiCrud()

// Variables reactivas
const objetivoSeleccionado = ref(null)
const indicadorSeleccionado = ref(null)
const factoresCriticosSeleccionados = ref([])
const estaCargando = ref(false)
const err = ref(null)

// Datos dummy de factores críticos
const todosLosFactoresCriticos = ref([
  {
    id: 1,
    factor_critico: 'Cualificación de capacidades de las organizaciones sociales',
    objetivo_especifico: 1,
  },
  {
    id: 2,
    factor_critico: 'Impulso a la participación independiente',
    objetivo_especifico: 1,
  },
  {
    id: 3,
    factor_critico: 'Capacidades institucionales',
    objetivo_especifico: 2,
  },
  {
    id: 4,
    factor_critico: 'Capacidades multiactor',
    objetivo_especifico: 2,
  },
  {
    id: 5,
    factor_critico: 'Evidencia del entorno',
    objetivo_especifico: 3,
  },
  {
    id: 6,
    factor_critico: 'Mejoramiento del entorno',
    objetivo_especifico: 3,
  },
])

// Factores críticos filtrados por objetivo seleccionado
const factoresCriticosFiltrados = computed(() => {
  if (!objetivoSeleccionado.value) return []
  return todosLosFactoresCriticos.value.filter(
    (factor) => factor.objetivo_especifico === objetivoSeleccionado.value.id,
  )
})

// Texto para el textfield de factores seleccionados
const textoFactoresSeleccionados = computed(() => {
  if (factoresCriticosSeleccionados.value.length === 0) return ''

  const factores = factoresCriticosSeleccionados.value.map((id) => {
    const factor = todosLosFactoresCriticos.value.find((f) => f.id === id)
    return factor ? factor.factor_critico : ''
  })

  return factores.join(', ')
})

// Objetivo e indicador actual basados en los IDs proporcionados
const objetivoActual = computed(() => {
  if (!props.objetivoInicial) return null
  return objetivosPei.value.find((obj) => obj.id === props.objetivoInicial)
})

const indicadorActual = computed(() => {
  if (!props.indicadorInicial) return null
  return indicadoresPei.value.find((ind) => ind.id === props.indicadorInicial)
})

// Indicadores filtrados por objetivo seleccionado
const indicadoresPeiFiltrados = computed(() => {
  if (!objetivoSeleccionado.value) return []
  return indicadoresPei.value.filter((ind) => ind.objetivo === objetivoSeleccionado.value.id)
})

// Obtener nombre del factor crítico por ID
const obtenerNombreFactor = (factorId) => {
  const factor = todosLosFactoresCriticos.value.find((f) => f.id === factorId)
  return factor ? factor.factor_critico : 'Factor desconocido'
}

// Remover factor crítico de la selección
const removerFactorCritico = (factorId) => {
  factoresCriticosSeleccionados.value = factoresCriticosSeleccionados.value.filter(
    (id) => id !== factorId,
  )
}

// Cargar datos iniciales
const cargar = async () => {
  estaCargando.value = true
  try {
    await Promise.all([obtenerObjetivosPeiPorIdPei(1), obtenerIndicadoresPeiPorIdPei(1)])
  } catch (e) {
    console.error('Error al cargar datos:', e)
    err.value = e.message
  } finally {
    estaCargando.value = false
  }
}

// Cargar indicadores y factores cuando se selecciona un objetivo
const cargarIndicadoresYFactores = () => {
  indicadorSeleccionado.value = null
  factoresCriticosSeleccionados.value = []
}

// Cargar datos iniciales cuando el componente se monta
onMounted(async () => {
  await cargar()

  // Si hay un objetivo inicial, seleccionarlo
  if (props.objetivoInicial) {
    objetivoSeleccionado.value = objetivosPei.value.find((obj) => obj.id === props.objetivoInicial)

    // Si hay un indicador inicial, seleccionarlo
    if (props.indicadorInicial && objetivoSeleccionado.value) {
      const indicador = indicadoresPei.value.find(
        (ind) =>
          ind.id === props.indicadorInicial && ind.objetivo_id === objetivoSeleccionado.value.id,
      )
      if (indicador) {
        indicadorSeleccionado.value = indicador
      }
    }

    // Si hay factores críticos iniciales, seleccionarlos
    if (props.factoresCriticosIniciales && props.factoresCriticosIniciales.length > 0) {
      factoresCriticosSeleccionados.value = [...props.factoresCriticosIniciales]
    }
  }
})

// Guardar la selección y actualizar la tabla
const guardarSeleccion = () => {
  // Determinar qué valores guardar
  const objetivoId = objetivoSeleccionado.value
    ? objetivoSeleccionado.value.id
    : props.objetivoInicial
  const indicadorId = indicadorSeleccionado.value
    ? indicadorSeleccionado.value.id
    : props.indicadorInicial

  // Solo emitir si tenemos ambos valores
  if (objetivoId && indicadorId) {
    emit('guardar', {
      objetivo_pei: objetivoId,
      indicador_pei: indicadorId,
      factoresCriticos: factoresCriticosSeleccionados.value,
    })
  } else if (!objetivoId && !indicadorId) {
    // Si ambos son nulos, emitir valores nulos
    emit('guardar', {
      objetivo_pei: null,
      indicador_pei: null,
      factoresCriticos: [],
    })
  }
}

// Cerrar el modal
const cerrarModal = () => {
  emit('cerrar')
}
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}

.v-card-title {
  padding: 16px;
}

.v-card-text {
  padding: 16px;
}

.v-chip {
  cursor: pointer;
}

.v-list-item {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style>
