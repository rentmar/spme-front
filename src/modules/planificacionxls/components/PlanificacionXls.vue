<template>
  <div class="hotWraper">
    <LoadingOverlay
      :isLoading="isLoading"
      :loadingMessage="loadingMessage"
      :loadingProgress="loadingProgress"
      :loadingError="loadingError"
      progressType="linear"
    ></LoadingOverlay>

    <div class="hot-container">
      <v-toolbar flat density="comfortable" class="excel-toolbar">
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
        ref="hotTable"
        :data="datosPlanificacion"
        :columns="columnas"
        :height="400"
        :dropdownMenu="true"
        :autoColumnSize="true"
        :manualColumnResize="true"
        :colHeaders="true"
        :rowHeaders="true"
        :contextMenu="true"
        :nestedHeaders="nestedHeaders"
        :autoWrapRow="true"
        :autoWrapCol="true"
        :autoRowSize="true"
        :language="'es-Mx'"
        :collapsibleColumns="true"
        :afterChange="handleChange"
        :licenseKey="'non-commercial-and-evaluation'"
      ></HotTable>
    </div>
  </div>
  <div>{{ datosPlanificacion }}</div>
  <div>{{ peiVigenteEstructura }}</div>
  <div>{{ proyecto }}</div>
</template>

<script setup>
import HotTable from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary } from 'handsontable/i18n'
import { esMX } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
import LoadingOverlay from '@/components/layout/partials/LoadingOverlay.vue'
//imports
import { ref, onMounted, computed, watch } from 'vue'
import { usePeiVigenteStore } from '@/modules/pei/store/usePeiVigenteStore'
import { storeToRefs } from 'pinia'
import useLoading from '@/composables/useLoading'

//Props del componente

const props = defineProps({
  proyecto: {
    type: Object,
    required: true,
  },
})

// Registros
registerAllModules()
registerLanguageDictionary(esMX)

// Referencia a la instancia
const hotTable = ref(null)

//Composable
const { isLoading, loadingMessage, loadingProgress, loadingError, withLoading } = useLoading()

//Iniciar el Store del pei vigente
const peiVigenteStore = usePeiVigenteStore()

/****************** DES Estructurar los Stores ***********************/
//Referencias
const { peiVigenteEstructura, cargando: cargandoPei } = storeToRefs(peiVigenteStore)
//Funciones
const { obtenerPeiVigenteEstructura } = peiVigenteStore

onMounted(async () => {
  cargarDatos()
})

const cargarDatos = async () => {
  try {
    await withLoading(obtenerPeiVigenteEstructura(), 'Cargado Informacion')
  } catch (err) {
    console.error('Erro al cargar la informacion', err)
  }
}

// Estado de carga
const cargandoGeneral = computed(() => {
  return cargandoPei.value
})

// Datos iniciales
const datosPlanificacion = ref([
  {
    idObjPei: '',
    objetivoPei: '',
    idIndPei: '',
    indicadorPei: '',
  },
])

//Rotulos de lo Headers
const nestedHeaders = ref([
  //Cuarto Nivel
  [{ label: 'PROYECTO - PLANIFICACION', colspan: 14 }],
  //Tercer Nivel
  [
    { label: 'PEI', colspan: 4 },
    { label: 'PROYECTO', colspan: 10 },
  ],
  //Segundo Nivel
  [
    { label: 'Objetivo', colspan: 2 },
    { label: 'Indicador', colspan: 2 },
  ],
  //Primer nivel
  ['id', 'Objetivo', 'id', 'Indicador'],
])

//Opciones para los dropdowns
// Computed
const objetivosOptions = computed(() => {
  if (!peiVigenteEstructura.value?.objetivos) return []
  return peiVigenteEstructura.value.objetivos.map((obj) => `${obj.codigo} - ${obj.descripcion}`)
})

//Definicion de columnas
const columnas = ref([
  {
    data: 'idObjPei',
    type: 'numeric',
    width: 50,
    readOnly: true,
  },
  {
    data: 'objetivoPei',
    type: 'dropdown',
    source(query, process) {
      process(objetivosOptions.value)
    },
    allowInvalid: false,
    strict: true,
    width: 150,
  },
  {
    data: 'idIndPei',
    type: 'numeric',
    readOnly: true,
  },
  {
    data: 'indicadorPei',
    type: 'dropdown',
    source: function (query, process) {
      // `this.row` hace referencia a la fila actual
      const rowIndex = this.row
      const fila = datosPlanificacion.value?.[rowIndex]
      if (!fila) return process([])

      const codigoObj = fila.objetivoPei?.split(' - ')[0]
      const objetivo = peiVigenteEstructura.value?.objetivos?.find((o) => o.codigo === codigoObj)
      const opciones = objetivo?.indicadores?.map((i) => `${i.codigo} - ${i.descripcion}`) || []

      process(opciones)
    },
    strict: true,
    width: 150,
  },
  { data: 'e', type: 'text' },
  { data: 'f', type: 'text' },
  { data: 'g', type: 'text' },
  { data: 'h', type: 'text' },
  { data: 'i', type: 'text' },
  { data: 'j', type: 'text' },
])

/********* Funciones *********/
const agregarFila = () => {
  console.log('Agregar fila')
}
const eliminarFila = () => {
  console.log('Eliminar fila')
}
const exportarExcel = () => {
  console.log('Exportar a excel')
}

//Manejo de los cambios
const handleChange = (changes, source) => {
  if (!changes || source !== 'edit') return

  for (const [row, prop, oldValue, newValue] of changes) {
    const fila = datosPlanificacion.value[row]

    if (prop === 'objetivoPei') {
      const codigo = newValue?.split(' - ')[0]
      const objetivo = peiVigenteEstructura.value?.objetivos?.find((o) => o.codigo === codigo)

      // Asignar ID del objetivo
      fila.idObjPei = objetivo?.id || ''

      // Validar si tiene indicadores
      if (!objetivo?.indicadores?.length) {
        // Limpia campos
        fila.idIndPei = ''
        fila.indicadorPei = ''

        // Mostrar advertencia
        alert(`El objetivo "${newValue}" no tiene indicadores disponibles.`)
        continue
      }

      // Asignar primer indicador si existe
      const primerIndicador = objetivo.indicadores[0]
      fila.idIndPei = primerIndicador.id
      fila.indicadorPei = `${primerIndicador.codigo} - ${primerIndicador.descripcion}`
    }

    if (prop === 'indicadorPei') {
      const codigoInd = newValue?.split(' - ')[0]
      const codigoObj = fila.objetivoPei?.split(' - ')[0]

      const objetivo = peiVigenteEstructura.value?.objetivos?.find((o) => o.codigo === codigoObj)
      const indicador = objetivo?.indicadores?.find((i) => i.codigo === codigoInd)

      fila.idIndPei = indicador?.id || ''
    }
  }
}
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
</style>
