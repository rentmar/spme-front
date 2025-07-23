<template>
  <div class="hotWraper">
    <LoadingOverlay
      :isLoading="isLoading || loading"
      :loadingMessage="loadingMessage"
      :loadingProgress="loadingProgress"
      :loadingError="loadingError"
      progressType="linear"
    ></LoadingOverlay>

    <div class="content-wrapper">
      <!-- Panel Izquierdo - Tabla Excel -->
      <div class="excel-panel">
        <v-toolbar flat density="comfortable" class="excel-toolbar">
          <!-- Panel de informacion -->
          <v-tooltip text="Mostrar/Esconder Panel de informacion" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="excel-btn" @click="toogleSidePanel">
                <v-icon size="18">mdi-view-agenda</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <!--Guardar-->
          <v-tooltip text="Guardar Planificacion" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="excel-btn" @click="guardarPlanificacion">
                <v-icon size="18">mdi-content-save</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <!--Reprogramar-->
          <v-tooltip text="Reprogramar" location="bottom">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="excel-btn"
                @click="reprogramarPlanificacion"
              >
                <v-icon size="18">mdi-wrench-clock</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <!--Agregar Fila-->
          <v-tooltip text="Agregar fila" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="excel-btn" @click="agregarFila">
                <v-icon size="18">mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <!--Eliminar fila-->
          <v-tooltip text="Eliminar fila seleccionada" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="excel-btn" @click="eliminarFila">
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <v-spacer></v-spacer>
          <!--Exportar a Excel-->
          <v-tooltip text="Exportar a Excel" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="excel-btn" @click="exportarExcel">
                <v-icon size="18">mdi-microsoft-excel</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-toolbar>
        <HotTable
          v-if="inicializado"
          ref="hotTable"
          :data="tableData"
          :columns="columns"
          :colHeaders="headers"
          :rowHeaders="true"
          :height="400"
          :hiddenColumns="hiddenColumnsConfig"
          :contextMenu="contextMenuOptions"
          :language="'es-Mx'"
          :afterChange="handleChange"
          :licenseKey="'non-commercial-and-evaluation'"
        >
        </HotTable>
      </div>
      <!-- Panel Derecho - Contenido Adicional -->
      <div class="side-panel" v-if="sidePanelVisible">
        <v-card>
          <v-tabs v-model="tab" bg-color="primary">
            <v-tab value="info">
              <v-icon left>mdi-information</v-icon>
              Información
            </v-tab>
            <v-tab value="presupuesto">
              <v-icon left>mdi-cash</v-icon>
              Presupuesto
            </v-tab>
            <v-tab value="actividades">
              <v-icon left>mdi-checkbox-marked-circle</v-icon>
              Actividades
            </v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <!-- Pestaña de Información -->
              <v-window-item value="info">
                <div class="panel-section">
                  <h4>Resumen del Proyecto</h4>
                  <p><strong>Nombre:</strong> {{ proyecto.nombre }}</p>
                  <p><strong>Objetivo General:</strong> {{ objetivoGeneralProyecto }}</p>
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="panel-section">
                  <h4>Estadísticas</h4>
                  <v-progress-linear
                    v-model="progressValue"
                    height="20"
                    color="primary"
                    class="mb-2"
                  >
                    <template v-slot:default="{ value }">
                      <strong>{{ Math.ceil(value) }}% completado</strong>
                    </template>
                  </v-progress-linear>

                  <div class="stats-grid">
                    <div class="stat-item">
                      <div class="stat-value">{{ totalActividades }}</div>
                      <div class="stat-label">Total</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-value">{{ actividadesEnProgreso }}</div>
                      <div class="stat-label">En progreso</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-value">{{ actividadesCompletadas }}</div>
                      <div class="stat-label">Completadas</div>
                    </div>
                  </div>
                </div>
              </v-window-item>

              <!-- Pestaña de Presupuesto -->
              <v-window-item value="presupuesto">
                <div class="panel-section">
                  <h4>Resumen Presupuestario</h4>

                  <v-table density="compact" class="budget-table">
                    <thead>
                      <tr>
                        <th>Concepto</th>
                        <th class="text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Presupuesto asignado</td>
                        <td class="text-right">{{ formatCurrency(presupuestoAsignado) }}</td>
                      </tr>
                      <tr>
                        <td>Ejecutado</td>
                        <td class="text-right">{{ formatCurrency(presupuestoEjecutado) }}</td>
                      </tr>
                      <tr>
                        <td><strong>Saldo disponible</strong></td>
                        <td class="text-right" :class="{ 'text-error': saldoDisponible < 0 }">
                          <strong>{{ formatCurrency(saldoDisponible) }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="panel-section">
                  <h4>Distribución</h4>
                  <div class="chart-container">
                    <v-progress-circular
                      :rotate="90"
                      :size="150"
                      :width="15"
                      :value="porcentajeEjecutado"
                      color="primary"
                    >
                      {{ Math.round(porcentajeEjecutado) }}%
                    </v-progress-circular>
                    <div class="chart-legend">
                      <div><v-icon color="primary">mdi-circle</v-icon> Ejecutado</div>
                      <div><v-icon color="grey">mdi-circle</v-icon> Pendiente</div>
                    </div>
                  </div>
                </div>
              </v-window-item>

              <!-- Pestaña de Actividades -->
              <v-window-item value="actividades">
                <div class="panel-section">
                  <h4>Estado de Actividades</h4>

                  <v-list lines="two" density="compact">
                    <v-list-item
                      v-for="(item, index) in estadoActividades"
                      :key="index"
                      :title="item.estado"
                      :prepend-icon="item.icon"
                      :subtitle="`${item.cantidad} actividades`"
                    >
                      <template v-slot:append>
                        <v-chip small :color="item.color">{{ item.porcentaje }}%</v-chip>
                      </template>
                    </v-list-item>
                  </v-list>
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="panel-section">
                  <h4>Acciones</h4>
                  <v-btn
                    block
                    color="primary"
                    class="mb-2"
                    @click="guardarPlanificacion"
                    prepend-icon="mdi-content-save"
                  >
                    Guardar cambios
                  </v-btn>
                  <v-btn
                    block
                    color="secondary"
                    @click="exportarExcel"
                    prepend-icon="mdi-microsoft-excel"
                  >
                    Exportar a Excel
                  </v-btn>
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
  <!-- Modal para el desglose de presupuesto -->
  <v-dialog v-model="showBudgetModal" max-width="800" persistent>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Desglose de Presupuesto</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeBudgetModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-4">
        <v-alert v-if="totalDesglose > currentRowTotal" type="error" class="mb-4">
          La suma del desglose ({{ formatCurrency(totalDesglose) }}) excede el presupuesto
          programado ({{ formatCurrency(currentRowTotal) }})
        </v-alert>

        <v-row>
          <v-col cols="12" md="6">
            <h4 class="mb-3">Presupuesto Total: {{ formatCurrency(currentRowTotal) }}</h4>
            <h4 class="mb-3">Total Desglosado: {{ formatCurrency(totalDesglose) }}</h4>
            <h4 class="mb-3">
              Saldo Disponible:
              <span :class="{ 'text-error': saldoDisponible < 0 }">
                {{ formatCurrency(saldoDisponible) }}
              </span>
            </h4>
          </v-col>
          <v-col cols="12" md="6">
            <v-progress-linear
              :value="porcentajeDesglose"
              height="20"
              :color="porcentajeDesglose > 100 ? 'error' : 'primary'"
              striped
            >
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}% utilizado</strong>
              </template>
            </v-progress-linear>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <!-- Selector de fuentes financieras -->
        <v-row>
          <v-col cols="12" md="8">
            <v-autocomplete
              v-model="nuevaFuenteSeleccionada"
              :items="fuentesFinancierasDisponibles"
              label="Seleccionar fuente financiera"
              item-title="nombre"
              item-value="id"
              return-object
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn
              color="primary"
              block
              :disabled="!nuevaFuenteSeleccionada"
              @click="agregarFuenteExistente"
            >
              Agregar Fuente
            </v-btn>
          </v-col>
        </v-row>

        <!-- Agregar fuente manual -->
        <v-row class="mt-2">
          <v-col cols="12" md="5">
            <v-text-field
              v-model="nuevaFuenteManual.nombre"
              label="Nombre de fuente nueva"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <v-text-field
              v-model.number="nuevaFuenteManual.monto"
              type="number"
              label="Monto"
              min="0"
              :max="saldoDisponible"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              color="secondary"
              block
              :disabled="!nuevaFuenteManual.nombre || !nuevaFuenteManual.monto"
              @click="agregarFuenteManual"
            >
              Agregar
            </v-btn>
          </v-col>
        </v-row>

        <!-- Tabla de desglose -->
        <v-table density="compact" class="mt-4">
          <thead>
            <tr>
              <th>Fuente</th>
              <th class="text-right">Monto</th>
              <th class="text-right">%</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in currentBreakdown" :key="index">
              <td>{{ item.nombre }}</td>
              <td class="text-right">
                <v-text-field
                  v-model.number="item.monto"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details
                  :min="0"
                  :max="currentRowTotal"
                  @update:modelValue="actualizarMonto(index)"
                />
              </td>
              <td class="text-right">{{ calcularPorcentaje(item.monto) }}%</td>
              <td class="text-center">
                <v-btn icon size="small" color="error" @click="eliminarFuente(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
            <tr class="font-weight-bold">
              <td>Total</td>
              <td class="text-right">{{ formatCurrency(totalDesglose) }}</td>
              <td class="text-right">{{ porcentajeDesglose.toFixed(2) }}%</td>
              <td></td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn @click="closeBudgetModal">Cancelar</v-btn>
        <v-btn color="primary" @click="saveBreakdown" :disabled="totalDesglose > currentRowTotal">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import HotTable from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary } from 'handsontable/i18n'
import { esMX } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
import LoadingOverlay from '@/components/layout/partials/LoadingOverlay.vue'
import { ref, computed, onMounted, inject, watch } from 'vue'
import { usePlanificacionStore } from '../store/usePlanificacionStore'
import { useRoute } from 'vue-router'
import useLoading from '@/composables/useLoading'
import { SELECT_OPTIONS } from '@/utility/selectOptions'
import { unirValoresConComas, formatearObjetivoGeneral } from '@/utility/strings'
import { storeToRefs } from 'pinia'
import { planificacionServicios } from '../services/planificacionService'
import { useProcedenciaFondos } from '@/modules/proyecto/composables/useProcedenciaFondos'

//Props del componente
const props = defineProps({
  proyecto: {
    type: Object,
    required: true,
  },
  proyectoEstructura: {
    type: Object,
    required: true,
  },
  cargando: {
    type: Boolean,
    default: true,
  },
})

// Registros
registerAllModules()
registerLanguageDictionary(esMX)

//Pei Vigente
const peiVigente = inject('peiVigente')
// console.log(peiVigente.value.id)

//Obtener el id del proyecto de la ruta
const route = useRoute()
const idproyecto = route.params.id

//Obtener el id del pei
const idpei = peiVigente.value.id

//Obtener el objetivo general del proyecto
const objetivoGeneralProyecto = formatearObjetivoGeneral(props.proyectoEstructura.objetivo_general)

//Tipos de actividad
const tipoActividad = SELECT_OPTIONS.tipo_actividad

//Programa/Area
const programaArea = unirValoresConComas(props.proyectoEstructura.instancia_gestora)

//Composable
const { isLoading, loadingMessage, loadingProgress, loadingError, withLoading } = useLoading()
const { opcionesEntidadFinanciera, fetchOptions } = useProcedenciaFondos()

//Iniciar el store de planificacion
const planificacionStore = usePlanificacionStore()
const { currentPlanificacion, columnasEscondidas, loading, inicializado } =
  storeToRefs(planificacionStore)
const { fetchPlanificacion } = planificacionStore

console.log(columnasEscondidas.value.columns)

//Informacion para la tabla
const tableData = ref([])

// Rótulos para columnas
const headers = ref([
  //Objetivo PEI
  'Objetivo PEI',
  //Indicador PEI
  'Indicadores PEI',
  //Objetivo General del Proyecto
  'Objetivo General',
  //Indicador OG
  'Indicador OG',
  //Resultado OG
  'Resultado OG',
  //Indicador Resultado OG
  'Indicador Resultado OG',
  //Objetivo Especifico
  'Objetivo Especifico',
  //Indicador OE
  'Indicador OE',
  //Producto OE
  'Producto OE',
  //Indicador Producto OE
  //'Indicador Producto OE',
  //Resultado OE
  'Resultado OE',
  //Indicador Resultado OE
  'Indicador Resultado OE',
  //Area Programa
  'Programa/Area',
  //Responsable
  'Responsable',
  //Actividad nueva
  'Actividad Nueva',
  //Proceso Actividad
  'Proceso',
  //Actividad
  'Actividad Estructura',
  'Actividad - CODIGO',
  'Actividad',
  'Proceso de la Actividad',
  //Tipoo de actividad
  'Tipo actividad',
  //Fecha inicio
  'Fecha Inicio',
  //Fecha cierre
  'Fecha Cierre',
  //Supuestos Riesgos
  'Supuestos Riesgos',
  //Presupuesto Programa
  'Presupuesto Programa',
  //Presupuesto Global
  'Presupuesto Global',
  //Total Reportado
  'Total Reportado',
  'Total Ejecutado',
  'Saldo',
  'Grado de ejecucion',
  'Medios de verificacion',
])

//Ocultar columnas

// const hiddenColumns = ref([])
const hiddenColumnsConfig = computed(() => ({
  // columns: currentPlanificacion.value.table_config.hiddenColumns.columns
  columns: columnasEscondidas.value.columns,
  indicators: true, // Muestra indicadores de columnas ocultas
}))

// Configuración de columnas personalizadas
const columns = ref([
  //Objetivo PEI
  {
    data: 'objetivoPei',
    type: 'dropdown',
    width: 300,
    source: function (query, process) {
      fetch('http://127.0.0.1:8000/api/pei/' + idpei + '/listobj/')
        .then((response) => response.json())
        .then((data) => {
          process(data.data) // Usamos directamente el array de strings
        })
        .catch((error) => {
          console.error('Error:', error)
          process([])
        })
    },
    strict: true,
    validator: function (value, callback) {
      // Validación personalizada
      callback(true) // Siempre válido temporalmente
    },
  },
  //Indicador PEI
  {
    data: 'indicadorPei',
    type: 'dropdown',
    width: 200,
    source: function (query, process) {
      const rowData = this.instance.getSourceDataAtRow(this.row)
      if (!rowData?.objetivoPei) return process([])

      // Extraer el ID del objetivo (formato: "id-codigo-descripcion")
      const objetivoId = rowData.objetivoPei.split('-')[0]

      fetch(`http://127.0.0.1:8000/api/objetivos/${objetivoId}/indicadores-compactos/`)
        .then((response) => response.json())
        .then((data) => {
          // Guardar el primer ID si es necesario
          if (data.data.length > 0 && !rowData.idindpei) {
            const firstId = data.data[0].split('-')[0]
            this.instance.setDataAtRowProp(this.row, 'idindpei', firstId)
          }
          process(data.data)
        })
        .catch(() => process([]))
    },
    afterGetColHeader: function (col, TH) {
      // Forzar actualización al hacer clic en el header
      if (col === this.prop) {
        TH.addEventListener('click', () => {
          this.instance.updateSettings({})
        })
      }
    },
  },
  //Objetivo General
  {
    data: 'objetivoGeneral',
    type: 'text',
    width: 200,
    readOnly: true,
  },
  //Indicador Objetivo General
  {
    data: 'indicadorOg',
    type: 'dropdown',
    width: 200,
    source: function (query, process) {
      fetch('http://127.0.0.1:8000/api/proyectos/' + idproyecto + '/indicadores-og/')
        .then((response) => response.json())
        .then((data) => {
          process(data.data) // Usamos directamente el array de strings
        })
        .catch((error) => {
          console.error('Error:', error)
          process([])
        })
    },
    strict: true,
    validator: function (value, callback) {
      // Validación personalizada
      callback(true) // Siempre válido temporalmente
    },
  },
  //Resultado Objetivo General
  {
    data: 'resultadoOg',
    type: 'dropdown',
    width: 200,
    source: async function (query, process) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/proyectos/${idproyecto}/resultados-og/`,
        )
        const data = await response.json()

        // Guardar datos completos para referencia
        this.instance.resultadosOGData = data.data

        process(data.data.map((item) => item.display_text))
      } catch (error) {
        console.error('Error cargando resultados OG:', error)
        process([])
      }
    },
    afterGetColHeader: function (col, TH) {
      if (col === this.prop) {
        TH.addEventListener('click', () => {
          this.instance.updateSettings({})
        })
      }
    },
  },
  //Indicador Resultado OG
  {
    data: 'indicadorResultadoOg',
    type: 'dropdown',
    width: 200,
    source: async function (query, process) {
      const rowData = this.instance.getSourceDataAtRow(this.row)
      const resultadoOgId = rowData?.resultadoOgId // Este campo se setea en handleChange

      if (!resultadoOgId) {
        return process([])
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/resultados-og/${resultadoOgId}/indicadores/`,
        )
        const data = await response.json()

        // Guardar datos completos para referencia
        this.instance.indicadoresResultadoOGData = data.data

        process(data.data.map((item) => item.display_text))
      } catch (error) {
        console.error('Error cargando indicadores:', error)
        process([])
      }
    },
    afterGetColHeader: function (col, TH) {
      if (col === this.prop) {
        TH.addEventListener('click', () => {
          this.instance.updateSettings({})
        })
      }
    },
  },
  //Objetivo Especifico
  {
    data: 'objetivoEspecifico',
    type: 'dropdown',
    width: 200,
    source: function (query, process) {
      fetch('http://127.0.0.1:8000/api/proyectos/' + idproyecto + '/objetivos-especificos/')
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Combinar ambos arrays de objetivos
            const options = [...data.data.proyecto, ...data.data.objetivo_general]
            process(options)
          } else {
            process([])
          }
        })
        .catch(() => process([]))
    },
  },
  //Indicador Objetivo Especifico
  {
    data: 'indicadorOe',
    type: 'dropdown',
    width: 200,
    source: function (query, process) {
      const rowData = this.instance.getSourceDataAtRow(this.row)
      const objetivoEspecifico = rowData?.objetivoEspecifico

      if (!objetivoEspecifico) {
        return process([])
      }

      // Extraer el ID del objetivo específico (asumiendo formato "id-codigo-descripcion")
      const objetivoId = objetivoEspecifico.split('-')[0].trim()

      fetch(`http://127.0.0.1:8000/api/objetivos-especificos/${objetivoId}/indicadores/`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // El endpoint ya devuelve el formato correcto: "id-codigo-redaccion"
            process(data.data)

            // Si hay indicadores, establecer el primer ID
            if (data.data.length > 0 && !rowData.idioe) {
              const firstId = data.data[0].split('-')[0]
              this.instance.setDataAtRowProp(this.row, 'idioe', firstId)
            }
          } else {
            process([])
          }
        })
        .catch((error) => {
          console.error('Error al cargar indicadores:', error)
          process([])
        })
    },
    strict: true,
    afterGetColHeader: function (col, TH) {
      if (col === this.prop) {
        TH.addEventListener('click', () => {
          this.instance.updateSettings({})
        })
      }
    },
  },
  //Producto Objetivo Especifico
  {
    data: 'productoOe',
    type: 'dropdown',
    width: 200,
    source: function (query, process) {
      const rowData = this.instance.getSourceDataAtRow(this.row)
      const objetivoEspecifico = rowData?.objetivoEspecifico

      if (!objetivoEspecifico) {
        return process([])
      }

      // Extraer el ID del objetivo específico (asumiendo formato "id-codigo-descripcion")
      const objetivoId = objetivoEspecifico.split('-')[0].trim()

      fetch(`http://127.0.0.1:8000/api/objetivos-especificos/${objetivoId}/productos/`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            process(data.data)

            // Si hay productos, establecer el primer ID
            if (data.data.length > 0 && !rowData.idpoe) {
              const firstId = data.data[0].split('-')[0]
              this.instance.setDataAtRowProp(this.row, 'idpoe', firstId)
            }
          } else {
            process([])
          }
        })
        .catch((error) => {
          console.error('Error al cargar productos:', error)
          process([])
        })
    },
    strict: true,
    afterGetColHeader: function (col, TH) {
      if (col === this.prop) {
        TH.addEventListener('click', () => {
          this.instance.updateSettings({})
        })
      }
    },
  },
  {
    data: 'resultadoOe',
    type: 'dropdown',
    width: 200,
    source: function (query, process) {
      const rowData = this.instance.getSourceDataAtRow(this.row)
      const objetivoEspecifico = rowData?.objetivoEspecifico

      if (!objetivoEspecifico) {
        return process([])
      }

      // Extraer el ID del objetivo específico
      const objetivoId = objetivoEspecifico.split('-')[0].trim()

      fetch(`http://127.0.0.1:8000/api/objetivos-especificos/${objetivoId}/resultados/`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            process(data.data)

            // Si hay resultados, establecer el primer ID
            if (data.data.length > 0 && !rowData.idresoe) {
              const firstId = data.data[0].split('-')[0]
              this.instance.setDataAtRowProp(this.row, 'idresoe', firstId)
            }
          } else {
            process([])
          }
        })
        .catch((error) => {
          console.error('Error al cargar resultados:', error)
          process([])
        })
    },
    strict: true,
    afterGetColHeader: function (col, TH) {
      if (col === this.prop) {
        TH.addEventListener('click', () => {
          this.instance.updateSettings({})
        })
      }
    },
  },
  //Indicador resultado OE
  {
    data: 'indicadorResultadoOe',
    type: 'dropdown',
    width: 200,
    source: function (query, process) {
      const rowData = this.instance.getSourceDataAtRow(this.row)
      const resultadoOe = rowData?.resultadoOe

      if (!resultadoOe) {
        return process([])
      }

      // Extraer el ID del resultado OE
      const resultadoId = resultadoOe.split('-')[0].trim()

      fetch(`http://127.0.0.1:8000/api/resultados-oe/${resultadoId}/indicadores/`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            process(data.data)

            // Si hay indicadores, establecer el primer ID
            if (data.data.length > 0 && !rowData.idiroe) {
              const firstId = data.data[0].split('-')[0]
              this.instance.setDataAtRowProp(this.row, 'idiroe', firstId)
            }
          } else {
            process([])
          }
        })
        .catch((error) => {
          console.error('Error al cargar indicadores:', error)
          process([])
        })
    },
    strict: true,
    afterGetColHeader: function (col, TH) {
      if (col === this.prop) {
        TH.addEventListener('click', () => {
          this.instance.updateSettings({})
        })
      }
    },
  },
  //Programa Area
  {
    data: 'programa_area',
    type: 'text',
    width: 200,
  },
  //Responsable
  {
    data: 'responsable',
    type: 'text',
    width: 200,
  },
  //Actividad no definida en la estructura
  {
    data: 'actividad_nueva',
    type: 'checkbox',
    width: 150,
    className: 'htCenter',
  },

  //Proceso
  {
    data: 'proceso',
    type: 'autocomplete',
    width: 200,
    async source(query, process) {
      fetch('http://127.0.0.1:8000/api/proyectos/' + idproyecto + '/procesos/') // tu endpoint real
        .then((res) => res.json())
        .then((data) => {
          // Mostrar display_name como opciones
          const opciones = data.map((item) => item.display_name)
          process(opciones)
        })
        .catch((error) => {
          console.error('Error cargando procesos:', error)
          process([]) // evitar que se rompa
        })
    },
    strict: false,
    readOnly: true,
  },
  //Actividad
  {
    data: 'actividad',
    type: 'dropdown',
    width: 200,
    source: function (query, process) {
      fetch(`http://127.0.0.1:8000/api/proyectos/${idproyecto}/actividades/`)
        .then((response) => response.json())
        .then((data) => {
          // Procesar los datos para el dropdown
          const options = data.map((item) => item.display_text)
          process(options)

          // Si hay datos, podemos guardar la información completa para usarla después
          if (data.length > 0) {
            // Guardamos los datos en una propiedad temporal del HotTable
            this.instance.actividadesData = data
          }
        })
        .catch((error) => {
          console.error('Error cargando actividades:', error)
          process([])
        })
    },
    readOnly: true,
    strict: true,
    afterGetColHeader: function (col, TH) {
      if (col === this.prop) {
        TH.addEventListener('click', () => {
          this.instance.updateSettings({})
        })
      }
    },
  },
  //Codigo de la actividad nueva
  {
    data: 'actividad_cod',
    type: 'text',
    width: 150,
    readOnly: false,
  },
  {
    data: 'actividad_titulo',
    type: 'text',
    width: 200,
    readOnly: false,
  },
  {
    data: 'procesoActividad',
    type: 'autocomplete',
    width: 200,
    async source(query, process) {
      fetch('http://127.0.0.1:8000/api/proyectos/' + idproyecto + '/procesos/') // tu endpoint real
        .then((res) => res.json())
        .then((data) => {
          // Mostrar display_name como opciones
          const opciones = data.map((item) => item.display_name)
          process(opciones)
        })
        .catch((error) => {
          console.error('Error cargando procesos:', error)
          process([]) // evitar que se rompa
        })
    },
    strict: false,
    readOnly: false,
  },
  //Tipo de actividad
  {
    data: 'tipo_actividad',
    type: 'dropdown',
    width: 200,
    source: tipoActividad,
  },
  //Fecha inicio
  {
    data: 'fecha_inicio',
    type: 'date',
    width: 150,
  },
  //Fecha cierre
  {
    data: 'fecha_cierre',
    type: 'date',
    width: 150,
    source: [],
  },
  //Supuestos y Riesgos
  {
    data: 'supuestosRiesgos',
    type: 'text',
    width: 200,
  },
  //Supuestos y Riesgos
  {
    data: 'presupuestoPrograma',
    type: 'numeric',
    width: 200,
    renderer: function (instance, td, row, col, prop, value) {
      // Limpiar la celda
      td.innerHTML = ''

      // Crear elemento clickable
      const container = document.createElement('div')
      container.className = 'budget-cell'
      container.innerHTML = formatCurrency(value || 0)

      // Manejar clic
      container.onclick = (e) => {
        e.stopPropagation()
        //openBudgetModal(row)
      }

      td.appendChild(container)
      return td
    },
  },
  //Presupuesto global
  {
    data: 'presupuestoGlobal',
    type: 'numeric',
    width: 200,
  },
  //Total Reportado
  {
    data: 'totalReportado',
    type: 'numeric',
    width: 200,
  },
  //Total Ejecutado
  {
    data: 'totalEjecutado',
    type: 'numeric',
    width: 200,
  },
  //Saldo
  {
    data: 'saldo',
    type: 'numeric',
    width: 200,
  },
  //Grado de Ejecucion
  {
    data: 'gradoEjecucion',
    type: 'dropdown',
    width: 200,
    source: [
      'PLANIFICADA',
      'RETRASO',
      'REPROGRAMACION',
      'EN EJECUCION',
      'EN REPORTE',
      'FINALIZADO',
    ],
  },
  //Medios de verificacion
  {
    data: 'medioVerificacion',
    type: 'text',
    width: 200,
    renderer: function (instance, td, row, col, prop, value, cellProperties) {
      // Limpiar el contenido de la celda
      td.innerHTML = ''

      // Crear botón
      const button = document.createElement('button')
      button.className = 'btn-celda'
      button.textContent = 'Acción'

      // Agregar evento click
      button.addEventListener('click', (e) => {
        e.stopPropagation()
        console.log('Botón clickeado en fila:', row)
        // Aquí puedes llamar a métodos de tu componente
        accionBoton(row)
      })

      td.appendChild(button)
      return td
    },
    // Deshabilitar el editor para esta columna
    editor: false,
  },
])

const updateRowState = (row) => {
  const hotInstance = hotTable.value?.hotInstance
  if (!hotInstance) return

  const rowData = hotInstance.getSourceDataAtRow(row)
  const isNewActivity = rowData.actividad_nueva

  // Actualizar estado de las celdas
  hotInstance.setCellMeta(row, hotInstance.propToCol('proceso'), 'readOnly', isNewActivity)
  hotInstance.setCellMeta(row, hotInstance.propToCol('actividad'), 'readOnly', isNewActivity)
  hotInstance.setCellMeta(row, hotInstance.propToCol('actividad_cod'), 'readOnly', !isNewActivity)
  hotInstance.setCellMeta(
    row,
    hotInstance.propToCol('actividad_titulo'),
    'readOnly',
    !isNewActivity,
  )

  // Limpiar celdas según el estado
  if (isNewActivity) {
    hotInstance.setDataAtRowProp(row, 'proceso', '')
    hotInstance.setDataAtRowProp(row, 'actividad', '')
  } else {
    hotInstance.setDataAtRowProp(row, 'actividad_cod', '')
    hotInstance.setDataAtRowProp(row, 'actividad_titulo', '')
  }

  // Forzar actualización visual
  hotInstance.render()
}

const accionBoton = (row) => {
  alert('Medios de verificacion')
  console.log('Acción ejecutada para fila:', row)
  // Aquí puedes acceder a tableData.value[row] para trabajar con los datos
}

onMounted(async () => {
  await cargarDatos()
})

const cargarDatos = async () => {
  try {
    await fetchPlanificacion(idproyecto)
    await fetchOptions()
  } catch (err) {
    console.error('Error al cargar datos', err)
  }
}

watch(
  () => currentPlanificacion.value?.rows_data,
  (newRows) => {
    if (newRows && JSON.stringify(newRows) !== JSON.stringify(tableData.value)) {
      tableData.value = [...newRows]
    }
  },
  { deep: true },
)

const hotTable = ref(null)
const hot = computed(() => hotTable.value?.hotInstance)

//FUNCIONES
const handleChange = (changes, source) => {
  if (source === 'edit') {
    changes.forEach(([row, prop, oldValue, newValue]) => {
      const hotInstance = hotTable.value?.hotInstance
      if (!hotInstance) return

      //Manejar cambios en actividad-nueva
      if (prop === 'actividad_nueva') {
        updateRowState(row)
      }

      // 1. Manejar cambios en objetivo PEI
      if (prop === 'objetivoPei') {
        hotInstance.setDataAtRowProp(row, 'indicadorPei', '')
        hotInstance.setDataAtRowProp(row, 'idindpei', '')

        if (newValue) {
          const objetivoId = newValue.split('-')[0]
          fetch(`http://127.0.0.1:8000/api/objetivos/${objetivoId}/indicadores-compactos/`)
            .then((response) => response.json())
            .then((data) => {
              if (data.data?.length > 0) {
                const firstId = data.data[0].split('-')[0]
                hotInstance.setDataAtRowProp(row, 'idindpei', firstId)
              }
            })
        }
        hotInstance.updateSettings({})
      }

      // 2. Manejar cambios en indicador PEI
      if (prop === 'indicadorPei' && newValue) {
        const indicadorId = newValue.split('-')[0]
        hotInstance.setDataAtRowProp(row, 'idindpei', indicadorId)
      }

      // 3. Manejar cambios en objetivo específico
      if (prop === 'objetivoEspecifico') {
        // Resetear todos los valores dependientes
        hotInstance.setDataAtRowProp(row, 'indicadorOe', '')
        hotInstance.setDataAtRowProp(row, 'idioe', '')
        hotInstance.setDataAtRowProp(row, 'productoOe', '')
        hotInstance.setDataAtRowProp(row, 'idpoe', '')
        hotInstance.setDataAtRowProp(row, 'resultadoOe', '')
        hotInstance.setDataAtRowProp(row, 'idresoe', '')
        hotInstance.setDataAtRowProp(row, 'indicadorResultadoOe', '')
        hotInstance.setDataAtRowProp(row, 'idiroe', '')

        if (newValue) {
          const objetivoId = newValue.split('-')[0].trim()
          // La carga de dropdowns dependientes se manejará al abrirlos
        }
        hotInstance.updateSettings({})
      }

      // 4. Manejar cambios en indicador OE
      if (prop === 'indicadorOe' && newValue) {
        const indicadorId = newValue.split('-')[0].trim()
        hotInstance.setDataAtRowProp(row, 'idioe', indicadorId)
      }

      // 5. Manejar cambios en producto OE
      if (prop === 'productoOe' && newValue) {
        const productoId = newValue.split('-')[0].trim()
        hotInstance.setDataAtRowProp(row, 'idpoe', productoId)
      }

      // 6. Manejar cambios en resultado OE
      if (prop === 'resultadoOe') {
        hotInstance.setDataAtRowProp(row, 'indicadorResultadoOe', '')
        hotInstance.setDataAtRowProp(row, 'idiroe', '')

        if (newValue) {
          const resultadoId = newValue.split('-')[0].trim()
          hotInstance.setDataAtRowProp(row, 'idresoe', resultadoId)
        }
        hotInstance.updateSettings({})
      }

      // 7. Manejar cambios en indicador de resultado OE
      if (prop === 'indicadorResultadoOe' && newValue) {
        const indicadorId = newValue.split('-')[0].trim()
        hotInstance.setDataAtRowProp(row, 'idiroe', indicadorId)
      }

      // 8. Manejar cambios en Resultado OG (NUEVO)
      if (prop === 'resultadoOg') {
        // Limpiar el dropdown dependiente
        hotInstance.setDataAtRowProp(row, 'indicadorResultadoOg', '')
        hotInstance.setDataAtRowProp(row, 'indicadorResultadoOgId', '')

        if (newValue && hotInstance.resultadosOGData) {
          // Buscar el resultado seleccionado en los datos cacheados
          const resultadoSeleccionado = hotInstance.resultadosOGData.find(
            (item) => item.display_text === newValue,
          )

          if (resultadoSeleccionado) {
            // Guardar el ID para referencia
            hotInstance.setDataAtRowProp(row, 'resultadoOgId', resultadoSeleccionado.id)

            // Forzar actualización del dropdown de indicadores
            hotInstance.updateSettings({})
          }
        }
      }

      // 9. Manejar cambios en Indicador Resultado OG (NUEVO)
      if (prop === 'indicadorResultadoOg' && newValue && hotInstance.indicadoresResultadoOGData) {
        const indicadorSeleccionado = hotInstance.indicadoresResultadoOGData.find(
          (item) => item.display_text === newValue,
        )

        if (indicadorSeleccionado) {
          hotInstance.setDataAtRowProp(row, 'indicadorResultadoOgId', indicadorSeleccionado.id)
        }
      }

      // 10. Manejar cambios en actividad (autocompletar proceso)
      if (prop === 'actividad' && newValue) {
        const actividadSeleccionada = hotInstance.actividadesData?.find(
          (item) => item.display_text === newValue,
        )

        if (actividadSeleccionada?.proceso) {
          hotInstance.setDataAtRowProp(
            row,
            'proceso',
            `${actividadSeleccionada.proceso.codigo} - ${actividadSeleccionada.proceso.titulo}`,
          )
        } else {
          hotInstance.setDataAtRowProp(row, 'proceso', '')
        }
      }

      // 11. Validación de fechas
      if (prop === 'fecha_inicio' && newValue) {
        const fechaCierre = hotInstance.getDataAtRowProp(row, 'fecha_cierre')
        if (fechaCierre && new Date(newValue) > new Date(fechaCierre)) {
          hotInstance.setDataAtRowProp(row, 'fecha_cierre', newValue)
        }
      }

      if (prop === 'fecha_cierre' && newValue) {
        const fechaInicio = hotInstance.getDataAtRowProp(row, 'fecha_inicio')
        if (fechaInicio && new Date(newValue) < new Date(fechaInicio)) {
          hotInstance.setDataAtRowProp(row, 'fecha_inicio', newValue)
        }
      }

      // 12. Manejar cambios en tipo de actividad
      if (prop === 'tipo_actividad' && newValue) {
        // Lógica adicional si es necesaria
        console.log(`Tipo de actividad cambiado a: ${newValue}`)
      }
    })
  }
}
const nuevaFila = {
  objetivoPei: '',
  indicadorPei: '',
  objetivoGeneral: objetivoGeneralProyecto,
  programa_area: programaArea,
  actividad_nueva: true,
  actividad_cod: '',
  actividad_titulo: '',
  proceso: '',
  actividad: '',
  // ... otras propiedades
}

const agregarFila = async () => {
  tableData.value.push({ ...nuevaFila }) // Crea una copia nueva cada vez
}

const reprogramarPlanificacion = async () => {
  alert('Reprogramar planificacion')
}

const eliminarFila = async () => {}

const exportarExcel = async () => {}

const guardarPlanificacion = async () => {
  alert('Guardar planificacion')
  try {
    loading.value = true
    await planificacionServicios.update(currentPlanificacion.value.id, {
      rows_data: tableData.value,
      proyecto: currentPlanificacion.value.proyecto,
    })
  } catch (error) {
    console.error('Error al guardar', error)
  } finally {
    loading.value = false
  }
}

const sidePanelVisible = ref(false)

const toogleSidePanel = async () => {
  sidePanelVisible.value = !sidePanelVisible.value
}

// Nueva ref para controlar la pestaña activa
const tab = ref('info')

// Datos de ejemplo para el presupuesto
const presupuestoAsignado = ref(150000)
const presupuestoEjecutado = ref(87500)
const saldoDisponibleAside = computed(() => presupuestoAsignado.value - presupuestoEjecutado.value)
const porcentajeEjecutado = computed(
  () => (presupuestoEjecutado.value / presupuestoAsignado.value) * 100,
)

// Datos de actividades
const totalActividades = ref(24)
const actividadesEnProgreso = ref(8)
const actividadesCompletadas = ref(5)
const actividadesPendientes = computed(
  () => totalActividades.value - actividadesEnProgreso.value - actividadesCompletadas.value,
)
const progressValue = computed(() => (actividadesCompletadas.value / totalActividades.value) * 100)

const estadoActividades = computed(() => [
  {
    estado: 'Completadas',
    cantidad: actividadesCompletadas.value,
    porcentaje: Math.round((actividadesCompletadas.value / totalActividades.value) * 100),
    icon: 'mdi-check-circle',
    color: 'success',
  },
  {
    estado: 'En progreso',
    cantidad: actividadesEnProgreso.value,
    porcentaje: Math.round((actividadesEnProgreso.value / totalActividades.value) * 100),
    icon: 'mdi-progress-clock',
    color: 'warning',
  },
  {
    estado: 'Pendientes',
    cantidad: actividadesPendientes.value,
    porcentaje: Math.round((actividadesPendientes.value / totalActividades.value) * 100),
    icon: 'mdi-alert-circle',
    color: 'error',
  },
])

// Función para formatear moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value)
}

const contextMenuOptions = computed(() => {
  return {
    items: {
      // Opción para agregar fila
      row_above: {
        name: 'Insertar fila arriba',
        callback: function () {
          const selected = this.getSelectedLast()
          tableData.value.splice(selected[0], 0, { ...nuevaFila })
          this.render()
        },
      },
      row_below: {
        name: 'Insertar fila abajo',
        callback: function () {
          const selected = this.getSelectedLast()
          tableData.value.splice(selected[0] + 1, 0, { ...nuevaFila })
          this.render()
        },
      },
      // Separador
      hsep1: '---------',
      // Opción para eliminar fila
      remove_row: {
        name: 'Eliminar fila',
        disabled: function () {
          return this.getSelectedLast()[0] === undefined
        },
        callback: function () {
          const selected = this.getSelectedLast()
          tableData.value.splice(selected[0], 1)
          this.render()
        },
      },
      // Separador
      hsep2: '---------',
      // Opción para copiar
      copy: {
        name: 'Copiar',
        callback: function () {
          this.copy()
        },
      },
      // Opción para pegar
      paste: {
        name: 'Pegar',
        callback: function () {
          this.paste()
        },
      },
      // Opción para limpiar
      clear_custom: {
        name: 'Limpiar contenido',
        callback: function () {
          const selected = this.getSelected()
          this.setDataAtCell(selected, '')
        },
      },
      // Separador
      hsep3: '---------',
      // Opción para desglose de presupuesto
      budget_breakdown: {
        name: 'Desglose de presupuesto',
        callback: function () {
          const selected = this.getSelectedLast()
          if (selected[0] !== undefined) {
            openBudgetModal(selected[0])
          }
        },
      },
      // Opción para medios de verificación
      verification_media: {
        name: 'Medios de verificación',
        callback: function () {
          const selected = this.getSelectedLast()
          if (selected[0] !== undefined) {
            accionBoton(selected[0])
          }
        },
      },
    },
  }
})

/*********************************** modal ***********************************/

// Variables reactivas para el modal
const showBudgetModal = ref(false)
const currentBreakdown = ref([])
const currentRowTotal = ref(0)
const currentRowIndex = ref(null)
const nuevaFuenteSeleccionada = ref(null)
const nuevaFuenteManual = ref({
  nombre: '',
  monto: 0,
})
const fuentesFinancierasDisponibles = ref([])

// Computed properties
const totalDesglose = computed(() => {
  return currentBreakdown.value.reduce((sum, item) => sum + (Number(item.monto) || 0), 0)
})

const saldoDisponible = computed(() => {
  return currentRowTotal.value - totalDesglose.value
})

const porcentajeDesglose = computed(() => {
  return currentRowTotal.value > 0 ? (totalDesglose.value / currentRowTotal.value) * 100 : 0
})

// Métodos
const openBudgetModal = (rowIndex) => {
  const hotInstance = hotTable.value?.hotInstance
  if (!hotInstance) return

  currentRowIndex.value = rowIndex
  const rowData = hotInstance.getSourceDataAtRow(rowIndex)

  // Obtener el presupuesto programado (asegurando que sea número)
  currentRowTotal.value = Number(rowData.presupuestoPrograma) || 0

  // Cargar desglose existente o inicializar array vacío
  currentBreakdown.value = rowData.desglosePresupuesto
    ? JSON.parse(JSON.stringify(rowData.desglosePresupuesto))
    : []

  // Cargar fuentes financieras disponibles
  cargarFuentesFinancieras()

  showBudgetModal.value = true
}

const closeBudgetModal = () => {
  showBudgetModal.value = false
  currentBreakdown.value = []
  currentRowTotal.value = 0
  currentRowIndex.value = null
  nuevaFuenteSeleccionada.value = null
  nuevaFuenteManual.value = { nombre: '', monto: 0 }
}

const cargarFuentesFinancieras = async () => {
  try {
    await fetchOptions()
    fuentesFinancierasDisponibles.value = opcionesEntidadFinanciera.value.map((item) => ({
      id: item.id,
      nombre: item.financiera,
    }))
  } catch (error) {
    console.error('Error al cargar fuentes financieras:', error)
    fuentesFinancierasDisponibles.value = []
  }

  // try {
  //   const response = await fetch(API_ENDPOINTS.FUENTES_FINANCIERAS())
  //   const data = await response.json()
  //   fuentesFinancierasDisponibles.value = data.data || []
  // } catch (error) {
  //   console.error('Error al cargar fuentes financieras:', error)
  //   fuentesFinancierasDisponibles.value = []
  // }
}

const agregarFuenteExistente = () => {
  if (!nuevaFuenteSeleccionada.value) return

  // Verificar si la fuente ya existe en el desglose
  const existe = currentBreakdown.value.some((item) => item.id === nuevaFuenteSeleccionada.value.id)

  if (existe) {
    alert('Esta fuente ya ha sido agregada al desglose')
    return
  }

  const nuevaFuente = {
    ...nuevaFuenteSeleccionada.value,
    monto: 0, // Inicializar en 0 para que el usuario lo establezca
  }

  currentBreakdown.value.push(nuevaFuente)
  nuevaFuenteSeleccionada.value = null
}

const agregarFuenteManual = () => {
  if (!nuevaFuenteManual.value.nombre || !nuevaFuenteManual.value.monto) return

  // Validar que el monto no exceda el saldo disponible
  if (Number(nuevaFuenteManual.value.monto) > saldoDisponible.value) {
    alert('El monto excede el saldo disponible')
    return
  }

  currentBreakdown.value.push({
    nombre: nuevaFuenteManual.value.nombre,
    monto: Number(nuevaFuenteManual.value.monto),
    manual: true, // Marcar como fuente manual
  })

  // Resetear el formulario manual
  nuevaFuenteManual.value = { nombre: '', monto: 0 }
}

const eliminarFuente = (index) => {
  currentBreakdown.value.splice(index, 1)
}

const actualizarMonto = (index) => {
  // Validar que el monto no sea negativo
  if (currentBreakdown.value[index].monto < 0) {
    currentBreakdown.value[index].monto = 0
  }

  // Validar que no exceda el presupuesto total
  if (totalDesglose.value > currentRowTotal.value) {
    // Ajustar automáticamente si excede
    currentBreakdown.value[index].monto = Math.max(
      0,
      currentBreakdown.value[index].monto - (totalDesglose.value - currentRowTotal.value),
    )
  }

  // Forzar actualización reactiva
  currentBreakdown.value = [...currentBreakdown.value]
}

const calcularPorcentaje = (monto) => {
  return currentRowTotal.value > 0 ? ((Number(monto) / currentRowTotal.value) * 100).toFixed(2) : 0
}

const saveBreakdown = () => {
  if (totalDesglose.value > currentRowTotal.value) {
    alert('El total desglosado no puede exceder el presupuesto programado')
    return
  }

  const hotInstance = hotTable.value?.hotInstance
  if (!hotInstance || currentRowIndex.value === null) return

  // Actualizar los datos en la fila
  hotInstance.setDataAtRowProp(currentRowIndex.value, 'desglosePresupuesto', [
    ...currentBreakdown.value,
  ])

  // Calcular y actualizar campos derivados
  const presupuestoEjecutado = currentBreakdown.value.reduce(
    (sum, item) => sum + (item.ejecutado || 0),
    0,
  )

  hotInstance.setDataAtRowProp(currentRowIndex.value, 'totalEjecutado', presupuestoEjecutado)

  hotInstance.setDataAtRowProp(
    currentRowIndex.value,
    'saldo',
    currentRowTotal.value - presupuestoEjecutado,
  )

  // Cerrar el modal
  closeBudgetModal()
}

/***************************************************************************************** */
</script>

<style scoped>
.hot-wrapper {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hot-container {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.excel-toolbar {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  padding: 4px 8px;
}

.excel-btn {
  min-width: 36px !important;
  height: 36px !important;
  margin: 0 2px !important;
  background-color: #ffffff !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 4px !important;
  box-shadow: none !important;
  transition: all 0.2s ease;
}

.excel-btn:hover {
  background-color: #f0f0f0 !important;
}

.excel-btn:active {
  background-color: #e0e0e0 !important;
}

/* Estilos para el panel de informacion */
.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background-color: #f5f5f5;
}

.content-wrapper {
  display: flex;
  gap: 16px;
  height: calc(100vh - 150px); /* Ajusta según necesidades */
}

.excel-panel {
  flex: 3; /* Ocupa 3 partes del espacio disponible */
  min-width: 0; /* Necesario para que flex-shrink funcione correctamente */
  display: flex;
  flex-direction: column;
}

.side-panel {
  flex: 1; /* Ocupa 1 parte del espacio disponible */
  min-width: 300px; /* Ancho mínimo */
  max-width: 400px; /* Ancho máximo */
}

.panel-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-title {
  background-color: #1976d2;
  color: white;
  padding: 12px 16px;
}

.panel-section {
  margin-bottom: 16px;
}

.panel-section h4 {
  margin-bottom: 12px;
  color: #1976d2;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.stat-item {
  text-align: center;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}
/* Estilos tabs */
/* Estilos para las pestañas */
.v-tabs {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Estilos para la tabla de presupuesto */
.budget-table {
  width: 100%;
  margin-top: 12px;
}

.budget-table th,
.budget-table td {
  padding: 8px 12px;
}

.budget-table thead {
  background-color: #f5f5f5;
}

.text-right {
  text-align: right;
}

.text-error {
  color: #ff5252;
}

/* Estilos para el gráfico circular */
.chart-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px 0;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Estilos para la lista de actividades */
.v-list {
  background: transparent;
}

/* Ajustes generales para el contenido de las pestañas */
.v-window-item {
  padding: 8px 0;
  height: 100%;
  overflow-y: auto;
}

.panel-section {
  margin-bottom: 16px;
}

.panel-section h4 {
  margin-bottom: 12px;
  color: #1976d2;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.stat-item {
  text-align: center;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}

.handsontable .htDimmed {
  background-color: #f5f5f5;
  color: #999;
}
</style>
