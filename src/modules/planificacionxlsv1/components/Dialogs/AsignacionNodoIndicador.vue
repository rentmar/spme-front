```vue
<template>
  <v-dialog v-model="dialogoVisible" max-width="1300px" persistent scrollable>
    <v-card height="85vh" class="dialogo-asignacion-card">
      <v-toolbar color="light-green-darken-2" density="compact" :height="36">
        <v-icon size="16" class="mr-2">mdi-connection</v-icon>
        <v-toolbar-title class="text-caption">ASIGNACIÓN - RELACIÓN ESTRUCTURA</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon size="x-small" variant="text" @click="cerrar">
          <v-icon size="16">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <div class="aside-content">
        <v-card v-if="actividadData" flat class="mb-4 pa-3 summary-card">
          <div class="text-overline mb-2">Datos de la Actividad</div>
          <v-row dense>
            <v-col cols="12" sm="3"
              ><div class="mb-1">
                <span class="text-caption text-medium-emphasis">Código</span>
                <div class="text-body-2 font-weight-bold">{{ actividadData.codigo || '—' }}</div>
              </div></v-col
            >
            <v-col cols="12" sm="5"
              ><div class="mb-1">
                <span class="text-caption text-medium-emphasis">Nombre</span>
                <div class="text-body-2 font-weight-bold">
                  {{ actividadData.nombreCorto || '—' }}
                </div>
              </div></v-col
            >
            <v-col cols="12" sm="2"
              ><div class="mb-1">
                <span class="text-caption text-medium-emphasis">ID</span>
                <div class="text-body-2 font-weight-bold">#{{ actividadData.id || '—' }}</div>
              </div></v-col
            >
            <v-col cols="12" sm="2"
              ><div class="mb-1">
                <span class="text-caption text-medium-emphasis">Estado</span
                ><v-chip size="x-small" :color="estadoColor(actividadData.estado)" variant="flat">{{
                  actividadData.estado || '—'
                }}</v-chip>
              </div></v-col
            >
          </v-row>
        </v-card>

        <v-select
          v-model="estructura.nivel1.objetivoGeneral"
          :items="objetivosGenerales"
          item-title="codigo"
          item-value="id"
          label="Objetivo General"
          variant="outlined"
          density="compact"
          prepend-inner-icon="mdi-target"
          return-object
          clearable
          class="mb-4"
          @update:model-value="onObjetivoGeneralSelected"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              density="compact"
              :subtitle="item.raw.descripcion"
            ></v-list-item>
          </template>
        </v-select>

        <template v-if="estructura.nivel1.objetivoGeneral">
          <v-card v-if="showStructureTree" class="mb-4" variant="outlined">
            <v-card-title class="bg-grey-lighten-4 py-2">
              <v-icon size="16" class="mr-1">mdi-sitemap</v-icon>
              <span class="text-caption font-weight-bold"
                >Vista Jerárquica de la Estructura Seleccionada</span
              >
            </v-card-title>
            <v-card-text class="pt-2">
              <div class="tree-view">
                <div class="tree-node">▶ <strong>PROYECTO:</strong> {{ proyectoCodigo }}</div>
                <div class="tree-node level-indicator">
                  ├─▶ <span class="level-label">N1</span> <strong>OG:</strong>
                  {{ estructura.nivel1.objetivoGeneral.codigo }}
                </div>
                <template v-if="estructura.nivel2.ramaIzquierda.indicadorOG.length">
                  <div class="tree-node level-indicator">
                    │ ├─ <span class="level-label">N2</span> <strong>INDICADORES OG:</strong>
                  </div>
                  <div
                    v-for="ind in estructura.nivel2.ramaIzquierda.indicadorOG"
                    :key="ind.id"
                    class="tree-node ml-8"
                  >
                    │ │ └─ {{ ind.codigo }}
                  </div>
                </template>
                <template v-if="estructura.nivel2.ramaIzquierda.resultadoOG">
                  <div class="tree-node level-indicator">
                    │ ├─ <span class="level-label">N2</span> <strong>RESULTADO OG:</strong>
                    {{ estructura.nivel2.ramaIzquierda.resultadoOG.codigo }}
                  </div>
                  <template v-if="estructura.nivel3.ramaIzquierda.indicadorResultadoOG.length">
                    <div class="tree-node level-indicator ml-8">
                      │ │ ├─ <span class="level-label">N3</span> <strong>IND. RES OG:</strong>
                    </div>
                    <div
                      v-for="ind in estructura.nivel3.ramaIzquierda.indicadorResultadoOG"
                      :key="ind.id"
                      class="tree-node ml-12"
                    >
                      │ │ │ └─ {{ ind.codigo }}
                    </div>
                  </template>
                  <div
                    v-if="estructura.nivel3.ramaIzquierda.procesoOG"
                    class="tree-node level-indicator ml-8"
                  >
                    │ │ └─ <span class="level-label">N3</span> <strong>PROCESO OG:</strong>
                    {{ estructura.nivel3.ramaIzquierda.procesoOG.codigo }}
                  </div>
                </template>
                <template v-if="estructura.nivel2.ramaDerecha.objetivoEspecifico">
                  <div class="tree-node level-indicator">
                    │ └─ <span class="level-label">N2</span> <strong>OBJETIVO ESPECÍFICO:</strong>
                    {{ estructura.nivel2.ramaDerecha.objetivoEspecifico.codigo }}
                  </div>
                  <template v-if="estructura.nivel3.ramaDerecha.indicadorOE.length">
                    <div class="tree-node level-indicator ml-8">
                      │ ├─ <span class="level-label">N3</span> <strong>INDICADORES OE:</strong>
                    </div>
                    <div
                      v-for="ind in estructura.nivel3.ramaDerecha.indicadorOE"
                      :key="ind.id"
                      class="tree-node ml-12"
                    >
                      │ │ └─ {{ ind.codigo }}
                    </div>
                  </template>
                  <div
                    v-if="estructura.nivel3.ramaDerecha.productoOE"
                    class="tree-node level-indicator ml-8"
                  >
                    │ ├─ <span class="level-label">N3</span> <strong>PRODUCTO OE:</strong>
                    {{ estructura.nivel3.ramaDerecha.productoOE.codigo }}
                  </div>
                  <template v-if="estructura.nivel3.ramaDerecha.resultadoOE">
                    <div class="tree-node level-indicator ml-8">
                      │ ├─ <span class="level-label">N3</span> <strong>RESULTADO OE:</strong>
                      {{ estructura.nivel3.ramaDerecha.resultadoOE.codigo }}
                    </div>
                    <template v-if="estructura.nivel4.resultadoOE.indicadores.length">
                      <div class="tree-node level-indicator ml-12">
                        │ │ ├─ <span class="level-label">N4</span> <strong>IND. RES OE:</strong>
                      </div>
                      <div
                        v-for="ind in estructura.nivel4.resultadoOE.indicadores"
                        :key="ind.id"
                        class="tree-node ml-16"
                      >
                        │ │ │ └─ {{ ind.codigo }}
                      </div>
                    </template>
                    <template v-if="estructura.nivel4.resultadoOE.productos.length">
                      <div class="tree-node level-indicator ml-12">
                        │ │ ├─ <span class="level-label">N4</span> <strong>PROD. RES OE:</strong>
                      </div>
                      <div
                        v-for="p in estructura.nivel4.resultadoOE.productos"
                        :key="p.id"
                        class="tree-node ml-16"
                      >
                        │ │ │ └─ {{ p.codigo }}
                      </div>
                    </template>
                    <div
                      v-if="estructura.nivel4.resultadoOE.proceso"
                      class="tree-node level-indicator ml-12"
                    >
                      │ │ └─ <span class="level-label">N4</span> <strong>PROC. RES OE:</strong>
                      {{ estructura.nivel4.resultadoOE.proceso.codigo }}
                    </div>
                  </template>
                  <div
                    v-if="estructura.nivel3.ramaDerecha.procesoEspecificoOE"
                    class="tree-node level-indicator ml-8"
                  >
                    │ └─ <span class="level-label">N3</span> <strong>PROCESO OE:</strong>
                    {{ estructura.nivel3.ramaDerecha.procesoEspecificoOE.codigo }}
                  </div>
                  <div
                    v-if="estructura.nivel4.productoOE.proceso"
                    class="tree-node level-indicator ml-8"
                  >
                    │ ├─ <span class="level-label">N4</span> <strong>PROC. PROD OE:</strong>
                    {{ estructura.nivel4.productoOE.proceso.codigo }}
                  </div>
                </template>
              </div>
            </v-card-text>
          </v-card>

          <v-row>
            <v-col cols="12" md="6">
              <div class="rama-header rama-izquierda">
                <v-icon size="14" class="mr-1">mdi-arrow-left-bold</v-icon>Procedencia desde
                Objetivo General
              </div>
              <div class="nivel-header">NIVEL 2</div>
              <v-select
                v-model="estructura.nivel2.ramaIzquierda.indicadorOG"
                :items="estructura.nivel1.objetivoGeneral.indicador_og || []"
                item-title="codigo"
                item-value="id"
                label="Indicador de Objetivo General"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-chart-line"
                return-object
                clearable
                multiple
                chips
                class="mb-3"
                ><template v-slot:item="{ props, item }"
                  ><v-list-item
                    v-bind="props"
                    density="compact"
                    :subtitle="item.raw.descripcion"
                  ></v-list-item></template
              ></v-select>
              <v-select
                v-model="estructura.nivel2.ramaIzquierda.resultadoOG"
                :items="estructura.nivel1.objetivoGeneral.resultados_og || []"
                item-title="codigo"
                item-value="id"
                label="Resultado de Objetivo General"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-chart-tree"
                return-object
                clearable
                class="mb-3"
                @update:model-value="onResultadoOGSelected"
                ><template v-slot:item="{ props, item }"
                  ><v-list-item
                    v-bind="props"
                    density="compact"
                    :subtitle="item.raw.descripcion"
                  ></v-list-item></template
              ></v-select>
              <template v-if="estructura.nivel2.ramaIzquierda.resultadoOG">
                <div class="nivel-header">NIVEL 3</div>
                <v-select
                  v-model="estructura.nivel3.ramaIzquierda.indicadorResultadoOG"
                  :items="estructura.nivel2.ramaIzquierda.resultadoOG.indicador_res_og || []"
                  item-title="codigo"
                  item-value="id"
                  label="Indicador de Resultado OG"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-chart-line"
                  return-object
                  clearable
                  multiple
                  chips
                  class="mb-3"
                  ><template v-slot:item="{ props, item }"
                    ><v-list-item
                      v-bind="props"
                      density="compact"
                      :subtitle="item.raw.descripcion"
                    ></v-list-item></template
                ></v-select>
                <v-select
                  v-model="estructura.nivel3.ramaIzquierda.procesoOG"
                  :items="estructura.nivel2.ramaIzquierda.resultadoOG.proceso_resultado_og || []"
                  item-title="codigo"
                  item-value="id"
                  label="Proceso de Resultado OG"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-cogs"
                  return-object
                  clearable
                  class="mb-3"
                  ><template v-slot:item="{ props, item }"
                    ><v-list-item
                      v-bind="props"
                      density="compact"
                      :subtitle="item.raw.titulo"
                    ></v-list-item></template
                ></v-select>
              </template>
            </v-col>
            <v-col cols="12" md="6">
              <div class="rama-header rama-derecha">
                <v-icon size="14" class="mr-1">mdi-arrow-right-bold</v-icon>Procedencia desde
                Objetivo Específico
              </div>
              <div class="nivel-header">NIVEL 2</div>
              <v-select
                v-model="estructura.nivel2.ramaDerecha.objetivoEspecifico"
                :items="estructura.nivel1.objetivoGeneral.objetivos_especificos_og || []"
                item-title="codigo"
                item-value="id"
                label="Objetivo Específico"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-target"
                return-object
                clearable
                class="mb-3"
                @update:model-value="onObjetivoEspecificoSelected"
                ><template v-slot:item="{ props, item }"
                  ><v-list-item
                    v-bind="props"
                    density="compact"
                    :subtitle="item.raw.descripcion"
                  ></v-list-item></template
              ></v-select>
              <template v-if="estructura.nivel2.ramaDerecha.objetivoEspecifico">
                <div class="nivel-header">NIVEL 3</div>
                <v-select
                  v-model="estructura.nivel3.ramaDerecha.indicadorOE"
                  :items="estructura.nivel2.ramaDerecha.objetivoEspecifico.indicador_oe || []"
                  item-title="codigo"
                  item-value="id"
                  label="Indicador de Objetivo Específico"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-chart-line"
                  return-object
                  clearable
                  multiple
                  chips
                  class="mb-3"
                  ><template v-slot:item="{ props, item }"
                    ><v-list-item
                      v-bind="props"
                      density="compact"
                      :subtitle="item.raw.descripcion"
                    ></v-list-item></template
                ></v-select>
                <v-select
                  v-model="estructura.nivel3.ramaDerecha.resultadoOE"
                  :items="estructura.nivel2.ramaDerecha.objetivoEspecifico.resultados_oe || []"
                  item-title="codigo"
                  item-value="id"
                  label="Resultado de Objetivo Específico"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-chart-tree"
                  return-object
                  clearable
                  class="mb-3"
                  @update:model-value="onResultadoOESelected"
                  ><template v-slot:item="{ props, item }"
                    ><v-list-item
                      v-bind="props"
                      density="compact"
                      :subtitle="item.raw.descripcion"
                    ></v-list-item></template
                ></v-select>
                <v-select
                  v-model="estructura.nivel3.ramaDerecha.productoOE"
                  :items="estructura.nivel2.ramaDerecha.objetivoEspecifico.productos_oe || []"
                  item-title="codigo"
                  item-value="id"
                  label="Producto de Objetivo Específico"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-package-variant"
                  return-object
                  clearable
                  class="mb-3"
                  @update:model-value="onProductoOESelected"
                  ><template v-slot:item="{ props, item }"
                    ><v-list-item
                      v-bind="props"
                      density="compact"
                      :subtitle="item.raw.descripcion"
                    ></v-list-item></template
                ></v-select>
                <v-select
                  v-model="estructura.nivel3.ramaDerecha.procesoEspecificoOE"
                  :items="estructura.nivel2.ramaDerecha.objetivoEspecifico.proceso_oe || []"
                  item-title="codigo"
                  item-value="id"
                  label="Proceso de Objetivo Específico"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-cogs"
                  return-object
                  clearable
                  class="mb-3"
                  ><template v-slot:item="{ props, item }"
                    ><v-list-item
                      v-bind="props"
                      density="compact"
                      :subtitle="item.raw.titulo"
                    ></v-list-item></template
                ></v-select>
                <template v-if="estructura.nivel3.ramaDerecha.resultadoOE">
                  <div class="nivel-header">NIVEL 4 (Dependiente de Resultado OE)</div>
                  <v-select
                    v-model="estructura.nivel4.resultadoOE.indicadores"
                    :items="estructura.nivel3.ramaDerecha.resultadoOE.indicador_res_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Indicador de Resultado OE"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-chart-line"
                    return-object
                    clearable
                    multiple
                    chips
                    class="mb-3"
                    ><template v-slot:item="{ props, item }"
                      ><v-list-item
                        v-bind="props"
                        density="compact"
                        :subtitle="item.raw.descripcion"
                      ></v-list-item></template
                  ></v-select>
                  <v-select
                    v-model="estructura.nivel4.resultadoOE.productos"
                    :items="estructura.nivel3.ramaDerecha.resultadoOE.productos_res_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Producto de Resultado OE"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-package-variant"
                    return-object
                    clearable
                    multiple
                    chips
                    class="mb-3"
                    ><template v-slot:item="{ props, item }"
                      ><v-list-item
                        v-bind="props"
                        density="compact"
                        :subtitle="item.raw.descripcion"
                      ></v-list-item></template
                  ></v-select>
                  <v-select
                    v-model="estructura.nivel4.resultadoOE.proceso"
                    :items="estructura.nivel3.ramaDerecha.resultadoOE.proceso_resultado_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Proceso de Resultado OE"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-cogs"
                    return-object
                    clearable
                    class="mb-3"
                    ><template v-slot:item="{ props, item }"
                      ><v-list-item
                        v-bind="props"
                        density="compact"
                        :subtitle="item.raw.titulo"
                      ></v-list-item></template
                  ></v-select>
                </template>
                <template v-if="estructura.nivel3.ramaDerecha.productoOE">
                  <div class="nivel-header">NIVEL 4 (Dependiente de Producto OE)</div>
                  <v-select
                    v-model="estructura.nivel4.productoOE.proceso"
                    :items="estructura.nivel3.ramaDerecha.productoOE.proceso_producto_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Proceso de Producto OE"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-cogs"
                    return-object
                    clearable
                    class="mb-3"
                    ><template v-slot:item="{ props, item }"
                      ><v-list-item
                        v-bind="props"
                        density="compact"
                        :subtitle="item.raw.titulo"
                      ></v-list-item></template
                  ></v-select>
                </template>
              </template>
            </v-col>
          </v-row>
        </template>

        <div v-else class="text-center py-8 text-grey">
          <v-icon icon="mdi-information" size="40" color="grey-lighten-1" class="mb-2"></v-icon>
          <p class="text-body-2 text-medium-emphasis">
            Seleccione un Objetivo General para ver las opciones de procedencia.
          </p>
        </div>
      </div>

      <v-card-actions class="pa-3">
        <v-btn
          v-if="estructura.nivel1.objetivoGeneral"
          variant="text"
          color="error"
          size="small"
          @click="desvincular"
        >
          <v-icon left size="small">mdi-link-off</v-icon> Desvincular
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey-darken-1" size="small" @click="cerrar">Cancelar</v-btn>
        <v-btn color="light-green-darken-2" variant="flat" size="small" @click="guardar">
          <v-icon left size="small">mdi-content-save</v-icon> Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  actividadData: Object,
  proyectoEstructura: Object,
})

const emit = defineEmits(['update:modelValue', 'guardar'])
const dialogoVisible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
const estadoColor = (e) =>
  ({ CRD: 'grey', PLAN: 'warning', EJEC: 'info', REP: 'success', FIN: 'primary', DES: 'default' })[
    e
  ] || 'default'
const showStructureTree = ref(true)

const estructura = ref({
  nivel1: { objetivoGeneral: null },
  nivel2: {
    ramaIzquierda: { indicadorOG: [], resultadoOG: null },
    ramaDerecha: { objetivoEspecifico: null },
  },
  nivel3: {
    ramaIzquierda: { indicadorResultadoOG: [], procesoOG: null },
    ramaDerecha: {
      indicadorOE: [],
      resultadoOE: null,
      productoOE: null,
      procesoEspecificoOE: null,
    },
  },
  nivel4: {
    resultadoOE: { indicadores: [], productos: [], proceso: null },
    productoOE: { proceso: null },
  },
})

const objetivosGenerales = computed(() => {
  const og =
    props.actividadData?.estructuraProcedencia?.datosProcedencia?.objetivogeneral?.data ||
    props.proyectoEstructura?.objetivo_general
  return og ? [og] : []
})

const proyectoCodigo = computed(
  () => props.proyectoEstructura?.codigo || props.actividadData?.codigo || '—',
)

const onObjetivoGeneralSelected = () => {
  estructura.value.nivel2 = {
    ramaIzquierda: { indicadorOG: [], resultadoOG: null },
    ramaDerecha: { objetivoEspecifico: null },
  }
  estructura.value.nivel3 = {
    ramaIzquierda: { indicadorResultadoOG: [], procesoOG: null },
    ramaDerecha: {
      indicadorOE: [],
      resultadoOE: null,
      productoOE: null,
      procesoEspecificoOE: null,
    },
  }
  estructura.value.nivel4 = {
    resultadoOE: { indicadores: [], productos: [], proceso: null },
    productoOE: { proceso: null },
  }
}
const onResultadoOGSelected = () => {
  estructura.value.nivel3.ramaIzquierda = { indicadorResultadoOG: [], procesoOG: null }
}
const onObjetivoEspecificoSelected = () => {
  estructura.value.nivel3.ramaDerecha = {
    indicadorOE: [],
    resultadoOE: null,
    productoOE: null,
    procesoEspecificoOE: null,
  }
  estructura.value.nivel4 = {
    resultadoOE: { indicadores: [], productos: [], proceso: null },
    productoOE: { proceso: null },
  }
}
const onResultadoOESelected = () => {
  estructura.value.nivel4.resultadoOE = { indicadores: [], productos: [], proceso: null }
}
const onProductoOESelected = () => {
  estructura.value.nivel4.productoOE = { proceso: null }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) inicializar()
  },
)

const inicializar = () => {
  const existentes = props.actividadData?.estructuraProcedencia?.seleccionesSimples
  const og = objetivosGenerales.value[0] || null
  estructura.value = {
    nivel1: { objetivoGeneral: existentes?.objetivoGeneralId ? og : null },
    nivel2: {
      ramaIzquierda: { indicadorOG: [], resultadoOG: null },
      ramaDerecha: { objetivoEspecifico: null },
    },
    nivel3: {
      ramaIzquierda: { indicadorResultadoOG: [], procesoOG: null },
      ramaDerecha: {
        indicadorOE: [],
        resultadoOE: null,
        productoOE: null,
        procesoEspecificoOE: null,
      },
    },
    nivel4: {
      resultadoOE: { indicadores: [], productos: [], proceso: null },
      productoOE: { proceso: null },
    },
  }
  if (!existentes || !og) return
  estructura.value.nivel1.objetivoGeneral = og
  if (existentes.indicadorOGIds?.length)
    estructura.value.nivel2.ramaIzquierda.indicadorOG =
      og.indicador_og?.filter((i) => existentes.indicadorOGIds.includes(i.id)) || []
  if (existentes.resultadoOGId) {
    estructura.value.nivel2.ramaIzquierda.resultadoOG =
      og.resultados_og?.find((r) => r.id === existentes.resultadoOGId) || null
    if (estructura.value.nivel2.ramaIzquierda.resultadoOG) {
      if (existentes.indicadorResultadoOGIds?.length)
        estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG =
          estructura.value.nivel2.ramaIzquierda.resultadoOG.indicador_res_og?.filter((i) =>
            existentes.indicadorResultadoOGIds.includes(i.id),
          ) || []
      if (existentes.procesoOGId)
        estructura.value.nivel3.ramaIzquierda.procesoOG =
          estructura.value.nivel2.ramaIzquierda.resultadoOG.proceso_resultado_og?.find(
            (p) => p.id === existentes.procesoOGId,
          ) || null
    }
  }
  if (existentes.objetivoEspecificoId) {
    estructura.value.nivel2.ramaDerecha.objetivoEspecifico =
      og.objetivos_especificos_og?.find((o) => o.id === existentes.objetivoEspecificoId) || null
    if (estructura.value.nivel2.ramaDerecha.objetivoEspecifico) {
      const oe = estructura.value.nivel2.ramaDerecha.objetivoEspecifico
      if (existentes.indicadorOEIds?.length)
        estructura.value.nivel3.ramaDerecha.indicadorOE =
          oe.indicador_oe?.filter((i) => existentes.indicadorOEIds.includes(i.id)) || []
      if (existentes.resultadoOEId)
        estructura.value.nivel3.ramaDerecha.resultadoOE =
          oe.resultados_oe?.find((r) => r.id === existentes.resultadoOEId) || null
      if (existentes.productoOEId)
        estructura.value.nivel3.ramaDerecha.productoOE =
          oe.productos_oe?.find((p) => p.id === existentes.productoOEId) || null
      if (existentes.procesoEspecificoOEId)
        estructura.value.nivel3.ramaDerecha.procesoEspecificoOE =
          oe.proceso_oe?.find((p) => p.id === existentes.procesoEspecificoOEId) || null
    }
  }
}

const construirDatosProcedencia = () => {
  const ep = {}
  const agregar = (clave, valor) => {
    if (valor) {
      if (Array.isArray(valor)) {
        if (valor.length) ep[clave] = valor.map((d) => ({ tipo: clave, data: d }))
      } else ep[clave] = { tipo: clave, data: valor }
    }
  }
  agregar('objetivogeneral', estructura.value.nivel1.objetivoGeneral)
  agregar('indicadorog', estructura.value.nivel2.ramaIzquierda.indicadorOG)
  agregar('resultadoog', estructura.value.nivel2.ramaIzquierda.resultadoOG)
  agregar('indicadorrog', estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG)
  agregar('procesoog', estructura.value.nivel3.ramaIzquierda.procesoOG)
  agregar('objetivoespecificoog', estructura.value.nivel2.ramaDerecha.objetivoEspecifico)
  agregar('indicadoroe', estructura.value.nivel3.ramaDerecha.indicadorOE)
  agregar('resultadooe', estructura.value.nivel3.ramaDerecha.resultadoOE)
  agregar('productooe', estructura.value.nivel3.ramaDerecha.productoOE)
  agregar('procesooe', estructura.value.nivel3.ramaDerecha.procesoEspecificoOE)
  agregar('indicadorroe', estructura.value.nivel4.resultadoOE.indicadores)
  agregar('productoroe', estructura.value.nivel4.resultadoOE.productos)
  agregar('procesoroe', estructura.value.nivel4.resultadoOE.proceso)
  agregar('procesopoe', estructura.value.nivel4.productoOE.proceso)
  return ep
}

const obtenerSeleccionesSimples = () => {
  const s = {}
  if (estructura.value.nivel1.objetivoGeneral)
    s.objetivoGeneralId = estructura.value.nivel1.objetivoGeneral.id
  if (estructura.value.nivel2.ramaIzquierda.indicadorOG.length)
    s.indicadorOGIds = estructura.value.nivel2.ramaIzquierda.indicadorOG.map((i) => i.id)
  if (estructura.value.nivel2.ramaIzquierda.resultadoOG)
    s.resultadoOGId = estructura.value.nivel2.ramaIzquierda.resultadoOG.id
  if (estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG.length)
    s.indicadorResultadoOGIds = estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG.map(
      (i) => i.id,
    )
  if (estructura.value.nivel3.ramaIzquierda.procesoOG)
    s.procesoOGId = estructura.value.nivel3.ramaIzquierda.procesoOG.id
  if (estructura.value.nivel2.ramaDerecha.objetivoEspecifico)
    s.objetivoEspecificoId = estructura.value.nivel2.ramaDerecha.objetivoEspecifico.id
  if (estructura.value.nivel3.ramaDerecha.indicadorOE.length)
    s.indicadorOEIds = estructura.value.nivel3.ramaDerecha.indicadorOE.map((i) => i.id)
  if (estructura.value.nivel3.ramaDerecha.resultadoOE)
    s.resultadoOEId = estructura.value.nivel3.ramaDerecha.resultadoOE.id
  if (estructura.value.nivel3.ramaDerecha.productoOE)
    s.productoOEId = estructura.value.nivel3.ramaDerecha.productoOE.id
  if (estructura.value.nivel3.ramaDerecha.procesoEspecificoOE)
    s.procesoEspecificoOEId = estructura.value.nivel3.ramaDerecha.procesoEspecificoOE.id
  if (estructura.value.nivel4.resultadoOE.indicadores.length)
    s.indicadorResultadoOEIds = estructura.value.nivel4.resultadoOE.indicadores.map((i) => i.id)
  if (estructura.value.nivel4.resultadoOE.productos.length)
    s.productoResultadoOEIds = estructura.value.nivel4.resultadoOE.productos.map((i) => i.id)
  if (estructura.value.nivel4.resultadoOE.proceso)
    s.procesoResultadoOEId = estructura.value.nivel4.resultadoOE.proceso.id
  if (estructura.value.nivel4.productoOE.proceso)
    s.procesoProductoOEId = estructura.value.nivel4.productoOE.proceso.id
  return s
}

const recolectarIndicadores = () => ({
  indicadorog: estructura.value.nivel2.ramaIzquierda.indicadorOG.map((item) => ({
    id: item.id,
    codigo: item.codigo,
    descripcion: item.descripcion || item.redaccion || '',
    tipo: 'indicadorog',
    tipoBitacora: 'indicador_og',
    nivel: 2,
    rama: 'izquierda',
  })),
  indicadoroe: estructura.value.nivel3.ramaDerecha.indicadorOE.map((item) => ({
    id: item.id,
    codigo: item.codigo,
    descripcion: item.descripcion || item.redaccion || '',
    tipo: 'indicadoroe',
    tipoBitacora: 'indicador_oe',
    nivel: 3,
    rama: 'derecha',
  })),
  indicadorrog: estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG.map((item) => ({
    id: item.id,
    codigo: item.codigo,
    descripcion: item.descripcion || item.redaccion || '',
    tipo: 'indicadorrog',
    tipoBitacora: 'indicador_rog',
    nivel: 3,
    rama: 'izquierda',
  })),
  indicadorroe: estructura.value.nivel4.resultadoOE.indicadores.map((item) => ({
    id: item.id,
    codigo: item.codigo,
    descripcion: item.descripcion || item.redaccion || '',
    tipo: 'indicadorroe',
    tipoBitacora: 'indicador_roe',
    nivel: 4,
    rama: 'derecha',
  })),
})

const construirNodosRelacionados = () => {
  const nodos = []
  let id = 1
  const og = estructura.value.nivel1.objetivoGeneral
  if (!og) return nodos

  nodos.push({
    id: String(id++),
    type: 'objetivogeneral',
    data: {
      label: 'Objetivo General',
      type: 'objetivogeneral',
      estado: 'ES',
      nodoProyecto: {
        id: og.id,
        codigo: og.codigo,
        descripcion: og.descripcion,
        proyecto: og.proyecto,
      },
    },
  })

  estructura.value.nivel2.ramaIzquierda.indicadorOG.forEach((ind) => {
    nodos.push({
      id: String(id++),
      type: 'indicadorog',
      data: {
        label: 'Indicador OG',
        type: 'indicadorog',
        estado: 'ES',
        nodoProyecto: {
          id: ind.id,
          codigo: ind.codigo,
          descripcion: ind.descripcion || ind.redaccion || '',
          objetivo_general: og.id,
        },
      },
    })
  })

  const resOG = estructura.value.nivel2.ramaIzquierda.resultadoOG
  if (resOG) {
    nodos.push({
      id: String(id++),
      type: 'resultadoog',
      data: {
        label: 'Resultado OG',
        type: 'resultadoog',
        nodoProyecto: {
          id: resOG.id,
          codigo: resOG.codigo,
          descripcion: resOG.descripcion,
          objetivo_general: og.id,
        },
      },
    })
    estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG.forEach((ind) => {
      nodos.push({
        id: String(id++),
        type: 'indicadorrog',
        data: {
          label: 'Indicador Res. OG',
          type: 'indicadorrog',
          estado: 'ES',
          nodoProyecto: {
            id: ind.id,
            codigo: ind.codigo,
            descripcion: ind.descripcion || ind.redaccion || '',
            resultado_og: resOG.id,
          },
        },
      })
    })
    const procOG = estructura.value.nivel3.ramaIzquierda.procesoOG
    if (procOG)
      nodos.push({
        id: String(id++),
        type: 'procesoog',
        data: {
          label: 'Proceso OG',
          type: 'procesoog',
          nodoProyecto: {
            id: procOG.id,
            codigo: procOG.codigo,
            titulo: procOG.titulo,
            descripcion: procOG.descripcion,
            resultado_og: resOG.id,
          },
        },
      })
  }

  const oe = estructura.value.nivel2.ramaDerecha.objetivoEspecifico
  if (oe) {
    nodos.push({
      id: String(id++),
      type: 'objetivoespecifico',
      data: {
        label: 'Objetivo Específico',
        type: 'objetivoespecifico',
        estado: 'ES',
        nodoProyecto: {
          id: oe.id,
          codigo: oe.codigo,
          descripcion: oe.descripcion,
          objetivo_general: og.id,
        },
      },
    })
    estructura.value.nivel3.ramaDerecha.indicadorOE.forEach((ind) => {
      nodos.push({
        id: String(id++),
        type: 'indicadoroe',
        data: {
          label: 'Indicador OE',
          type: 'indicadoroe',
          estado: 'ES',
          nodoProyecto: {
            id: ind.id,
            codigo: ind.codigo,
            descripcion: ind.descripcion || ind.redaccion || '',
            objetivo_especifico: oe.id,
          },
        },
      })
    })
    const prodOE = estructura.value.nivel3.ramaDerecha.productoOE
    if (prodOE) {
      nodos.push({
        id: String(id++),
        type: 'productooe',
        data: {
          label: 'Producto OE',
          type: 'productooe',
          nodoProyecto: {
            id: prodOE.id,
            codigo: prodOE.codigo,
            descripcion: prodOE.descripcion,
            objetivo_especifico: oe.id,
          },
        },
      })
      const procProd = estructura.value.nivel4.productoOE.proceso
      if (procProd)
        nodos.push({
          id: String(id++),
          type: 'procesoproductooe',
          data: {
            label: 'Proceso Producto OE',
            type: 'procesoproductooe',
            nodoProyecto: {
              id: procProd.id,
              codigo: procProd.codigo,
              titulo: procProd.titulo,
              producto_oe: prodOE.id,
            },
          },
        })
    }
    const resOE = estructura.value.nivel3.ramaDerecha.resultadoOE
    if (resOE) {
      nodos.push({
        id: String(id++),
        type: 'resultadooe',
        data: {
          label: 'Resultado OE',
          type: 'resultadooe',
          nodoProyecto: {
            id: resOE.id,
            codigo: resOE.codigo,
            descripcion: resOE.descripcion,
            objetivo_especifico: oe.id,
          },
        },
      })
      estructura.value.nivel4.resultadoOE.indicadores.forEach((ind) => {
        nodos.push({
          id: String(id++),
          type: 'indicadorroe',
          data: {
            label: 'Indicador Res. OE',
            type: 'indicadorroe',
            estado: 'ES',
            nodoProyecto: {
              id: ind.id,
              codigo: ind.codigo,
              descripcion: ind.descripcion || ind.redaccion || '',
              resultado_oe: resOE.id,
            },
          },
        })
      })
      estructura.value.nivel4.resultadoOE.productos.forEach((prod) => {
        nodos.push({
          id: String(id++),
          type: 'productoroe',
          data: {
            label: 'Producto Res. OE',
            type: 'productoroe',
            nodoProyecto: {
              id: prod.id,
              codigo: prod.codigo,
              descripcion: prod.descripcion,
              resultado_oe: resOE.id,
            },
          },
        })
      })
      const procResOE = estructura.value.nivel4.resultadoOE.proceso
      if (procResOE)
        nodos.push({
          id: String(id++),
          type: 'procesoroe',
          data: {
            label: 'Proceso Res. OE',
            type: 'procesoroe',
            nodoProyecto: {
              id: procResOE.id,
              codigo: procResOE.codigo,
              titulo: procResOE.titulo,
              resultado_oe: resOE.id,
            },
          },
        })
    }
    const procEspOE = estructura.value.nivel3.ramaDerecha.procesoEspecificoOE
    if (procEspOE)
      nodos.push({
        id: String(id++),
        type: 'procesoespecificoe',
        data: {
          label: 'Proceso OE',
          type: 'procesoespecificoe',
          nodoProyecto: {
            id: procEspOE.id,
            codigo: procEspOE.codigo,
            titulo: procEspOE.titulo,
            objetivo_especifico: oe.id,
          },
        },
      })
  }

  return nodos
}

const guardar = () => {
  if (!estructura.value.nivel1.objetivoGeneral) {
    emit('guardar', null)
    dialogoVisible.value = false
    return
  }
  const datosProcedencia =
    props.actividadData?.estructuraProcedencia?.datosProcedencia || construirDatosProcedencia()
  emit('guardar', {
    datosProcedencia,
    indicadores_recolectados: recolectarIndicadores(),
    nodosRelacionados: construirNodosRelacionados(),
    seleccionesSimples: obtenerSeleccionesSimples(),
  })
  dialogoVisible.value = false
}

const desvincular = () => {
  emit('guardar', null)
  dialogoVisible.value = false
}
const cerrar = () => {
  dialogoVisible.value = false
}
</script>

<style scoped>
.dialogo-asignacion-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 13px;
  color: #202124;
  background: #f5f7fa;
}
.aside-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}
.summary-card {
  background: #fff;
  border: 1px solid #dee2e6;
}
.rama-header {
  font-size: 13px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 4px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}
.rama-izquierda {
  background: #e3f2fd;
  color: #1565c0;
  border-left: 3px solid #1976d2;
}
.rama-derecha {
  background: #e8f5e9;
  color: #2e7d32;
  border-left: 3px solid #4caf50;
}
.nivel-header {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: #546e7a;
  margin-bottom: 4px;
  margin-top: 8px;
  letter-spacing: 0.5px;
}
.v-card-actions {
  flex-shrink: 0;
}
.tree-view {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  line-height: 1.5;
  background: #fafafa;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}
.tree-node {
  padding: 1px 0;
  white-space: pre;
}
.level-indicator {
  background: rgba(0, 0, 0, 0.02);
  border-left: 3px solid #1976d2;
  padding-left: 8px;
  margin: 2px 0;
}
.level-label {
  background: #1976d2;
  color: #fff;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.65rem;
  font-weight: 700;
  margin-right: 6px;
}
</style>
```
