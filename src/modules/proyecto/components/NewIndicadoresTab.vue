<template>
  <v-card class="my-card">
    <v-card-item>
      <v-card-title>Indicadores del Proyecto</v-card-title>
    </v-card-item>

    <v-card-text>
      <v-tabs v-model="activeTab">
        <v-tab value="general">
          <v-icon start>mdi-target</v-icon>
          Obj. General
        </v-tab>
        <v-tab value="especificos">
          <v-icon start>mdi-target-account</v-icon>
          Obj. Específicos
        </v-tab>
        <v-tab value="resultados">
          <v-icon start>mdi-checkbox-marked-circle-outline</v-icon>
          Resultados
        </v-tab>
        <v-tab value="productos">
          <v-icon start>mdi-package-variant</v-icon>
          Productos
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <!-- TAB INDICADORES OBJETIVO GENERAL -->
        <v-window-item value="general">
          <v-card flat class="pa-4">
            <v-card-title class="d-flex justify-space-between align-center mb-4">
              <span>Indicadores del Objetivo General</span>
              <v-btn icon @click="addIndicador('indObjGeneral')" color="primary" size="small">
                <v-icon>mdi-plus</v-icon>
                <v-tooltip activator="parent" location="top">Agregar indicador</v-tooltip>
              </v-btn>
            </v-card-title>

            <v-expansion-panels>
              <v-expansion-panel
                v-for="(ind, index) in nuevoProyecto.indObjGeneral"
                :key="'ind-general-' + index"
              >
                <v-expansion-panel-title>
                  <span class="font-weight-bold">IND{{ formatNumber(index + 1) }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon="mdi-close"
                    size="x-small"
                    variant="text"
                    @click.stop="removeIndicador('indObjGeneral', index)"
                    class="ml-2"
                  ></v-btn>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <IndicadorForm
                    v-model="nuevoProyecto.indObjGeneral[index]"
                    :index="index"
                    tipo="general"
                  />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-window-item>

        <!-- TAB INDICADORES OBJETIVOS ESPECIFICOS -->
        <v-window-item value="especificos">
          <v-card flat class="pa-4">
            <v-card-title class="d-flex justify-space-between align-center mb-4">
              <span>Indicadores de Objetivos Específicos</span>
              <v-btn icon @click="addIndicador('indObjEspecifico')" color="primary" size="small">
                <v-icon>mdi-plus</v-icon>
                <v-tooltip activator="parent" location="top">Agregar indicador</v-tooltip>
              </v-btn>
            </v-card-title>

            <v-expansion-panels>
              <v-expansion-panel
                v-for="(ind, index) in nuevoProyecto.indObjEspecifico"
                :key="'ind-especifico-' + index"
              >
                <v-expansion-panel-title>
                  <span class="font-weight-bold">IND{{ formatNumber(index + 1) }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon="mdi-close"
                    size="x-small"
                    variant="text"
                    @click.stop="removeIndicador('indObjEspecifico', index)"
                    class="ml-2"
                  ></v-btn>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <IndicadorForm
                    v-model="nuevoProyecto.indObjEspecifico[index]"
                    :index="index"
                    tipo="especifico"
                  />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-window-item>

        <!-- TAB INDICADORES RESULTADOS -->
        <v-window-item value="resultados">
          <v-card flat class="pa-4">
            <v-card-title class="d-flex justify-space-between align-center mb-4">
              <span>Indicadores de Resultados</span>
              <v-btn icon @click="addIndicador('indResultado')" color="primary" size="small">
                <v-icon>mdi-plus</v-icon>
                <v-tooltip activator="parent" location="top">Agregar indicador</v-tooltip>
              </v-btn>
            </v-card-title>

            <v-expansion-panels>
              <v-expansion-panel
                v-for="(ind, index) in nuevoProyecto.indResultado"
                :key="'ind-resultado-' + index"
              >
                <v-expansion-panel-title>
                  <span class="font-weight-bold">IND{{ formatNumber(index + 1) }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon="mdi-close"
                    size="x-small"
                    variant="text"
                    @click.stop="removeIndicador('indResultado', index)"
                    class="ml-2"
                  ></v-btn>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <IndicadorForm
                    v-model="nuevoProyecto.indResultado[index]"
                    :index="index"
                    tipo="resultado"
                  />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-window-item>

        <!-- TAB INDICADORES PRODUCTOS -->
        <v-window-item value="productos">
          <v-card flat class="pa-4">
            <v-card-title class="d-flex justify-space-between align-center mb-4">
              <span>Indicadores de Productos</span>
              <v-btn icon @click="addIndicador('indProducto')" color="primary" size="small">
                <v-icon>mdi-plus</v-icon>
                <v-tooltip activator="parent" location="top">Agregar indicador</v-tooltip>
              </v-btn>
            </v-card-title>

            <v-expansion-panels>
              <v-expansion-panel
                v-for="(ind, index) in nuevoProyecto.indProducto"
                :key="'ind-producto-' + index"
              >
                <v-expansion-panel-title>
                  <span class="font-weight-bold">IND{{ formatNumber(index + 1) }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon="mdi-close"
                    size="x-small"
                    variant="text"
                    @click.stop="removeIndicador('indProducto', index)"
                    class="ml-2"
                  ></v-btn>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <IndicadorForm
                    v-model="nuevoProyecto.indProducto[index]"
                    :index="index"
                    tipo="producto"
                  />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, inject } from 'vue'
import IndicadorForm from './partials/IndicadorForm.vue'

const nuevoProyecto = inject('nuevoProyecto')
const activeTab = ref('general')

// Función para formatear el número con ceros a la izquierda
const formatNumber = (num) => {
  return num < 10 ? `0${num}` : `${num}`
}

// Estructura base de un indicador ampliada con campos de relación
const baseIndicador = {
  codigo: '',
  indicador: '',
  tipo: 'SMART',
  tipo_valor: '%',
  verificacion: '',
  target: '',
  baseline: '',
  target1: '',
  target2: '',
  target3: '',
  target4: '',
  relacionObjEspecifico: null,
  relacionResultado: null,
  relacionProducto: null,
}

const addIndicador = (tipo) => {
  const newIndicador = JSON.parse(JSON.stringify(baseIndicador))
  const index = nuevoProyecto[tipo].length + 1
  newIndicador.codigo = `IND${formatNumber(index)}`

  // Establecer relación por defecto si hay elementos disponibles
  if (tipo === 'indObjEspecifico' && nuevoProyecto.objetivoEspecifico.length > 0) {
    newIndicador.relacionObjEspecifico = nuevoProyecto.objetivoEspecifico[0].codigo
  }
  if (tipo === 'indResultado' && nuevoProyecto.resultados.length > 0) {
    newIndicador.relacionResultado = nuevoProyecto.resultados[0].codigo
  }
  if (tipo === 'indProducto' && nuevoProyecto.productos.length > 0) {
    newIndicador.relacionProducto = nuevoProyecto.productos[0].codigo
  }

  nuevoProyecto[tipo].push(newIndicador)
}

const removeIndicador = (tipo, index) => {
  nuevoProyecto[tipo].splice(index, 1)
  // Reindexar los códigos
  nuevoProyecto[tipo].forEach((ind, idx) => {
    ind.codigo = `IND${formatNumber(idx + 1)}`
  })
}
</script>

<style scoped>
.my-card {
  margin: 20px;
}
.v-tab {
  min-width: 160px;
}
</style>
