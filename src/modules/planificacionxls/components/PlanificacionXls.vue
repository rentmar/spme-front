<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
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
  <br /><br />
  <div>{{ proyecto }}</div>
  <br /><br />
  <div>{{ proyectoEstructura }}</div>
</template>

<script setup>
import HotTable from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary } from 'handsontable/i18n'
import { esMX } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
import LoadingOverlay from '@/components/layout/partials/LoadingOverlay.vue'
//imports
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
//Stores
import { usePeiVigenteStore } from '@/modules/pei/store/usePeiVigenteStore'
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
//Composables
import useLoading from '@/composables/useLoading'

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

// Referencia a la instancia
const hotTable = ref(null)

//Composable
const { isLoading, loadingMessage, loadingProgress, loadingError, withLoading } = useLoading()

//Iniciar Stores
const peiVigenteStore = usePeiVigenteStore() //Pei Vigente

/****************** DES Estructurar los Stores ***********************/
//Referencias
const { peiVigenteEstructura } = storeToRefs(peiVigenteStore) //Referencias al Store del PEi Vigente
//Funciones
const { obtenerPeiVigenteEstructura } = peiVigenteStore //Funciones
//Referencias

// Datos iniciales
// const datosPlanificacion = ref([
//   {
//     idObjPei: '',
//     objetivoPei: '',
//     idIndPei: '',
//     indicadorPei: '',
//     idObjGral: '',
//     objetivoGral: '',
//     idKpi: '',
//     kpi: '',
//     idIndOg: '',
//     indicadorOg: '',
//   },
// ])
//Datos de la planilla
const datosPlanificacion = ref([{}])

//Objetivo General del proyecto
const objetivosGenerales = ref([props.proyectoEstructura.value?.objetivo_general])
console.log(objetivosGenerales)

//Indicadores del Objetivo General
const indicadoresOgOptions = ref([])
console.log('indicadores og')
console.log(indicadoresOgOptions)

onMounted(async () => {
  await cargarDatos()
})

const cargarDatos = async () => {
  try {
    await withLoading(obtenerPeiVigenteEstructura(), 'Cargando informacion del PEI')
    inicializarIndicadoresog()
  } catch (err) {
    console.error('Erro al cargar la informacion', err)
  }
}

const inicializarIndicadoresog = () => {
  const indicadores = props.proyectoEstructura?.objetivo_general?.indicadores_objgral || []
  indicadoresOgOptions.value = indicadores.map((i) => `${i.codigo} - ${i.redaccion}`)
}

//Rotulos de lo Headers
const nestedHeaders = ref([
  //Cuarto Nivel
  [{ label: 'PROYECTO - PLANIFICACION', colspan: 14 }],
  //Cuarto  Nivel
  [
    { label: 'PEI', colspan: 4 },
    { label: 'PROYECTO', colspan: 10 },
  ],
  //Tercer Nivel
  [
    { label: 'PEI', colspan: 4 },
    { label: 'OBJETIVO GENERAL', colspan: 10 },
  ],

  //Segundo Nivel
  [
    { label: 'Objetivo', colspan: 2 },
    { label: 'Indicador', colspan: 2 },
    { label: 'Objetivo General', colspan: 2 },
    { label: 'Indicador', colspan: 2 },
  ],
  //Primer nivel
  [
    //Objetivo del PEI
    'id',
    'Objetivo',
    //Indicador del PEI
    'id',
    'Indicador',
    //Objetivo General
    'id',
    'Objetivo',
    //Indicador
    'id',
    'Indicador',
  ],
])

//Opciones para los dropdowns
// Computed
const objetivosOptions = computed(() => {
  if (!peiVigenteEstructura.value?.objetivos) return []
  return peiVigenteEstructura.value.objetivos.map((obj) => `${obj.codigo} - ${obj.descripcion}`)
})

//Definicion de columnas
const columnas = ref([
  //Id del Pbj PEI
  {
    data: 'idObjPei',
    type: 'numeric',
    width: 50,
    readOnly: true,
  },
  //Obj PEI
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
  //Id del Ind del PEI
  {
    data: 'idIndPei',
    type: 'numeric',
    readOnly: true,
  },
  //Indicador del PEI
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
  //Id del Obj Gral
  {
    data: 'idObjGral',
    type: 'text',
    readOnly: true,
    width: 50,
  },
  //Obj General
  {
    data: 'objetivoGral',
    type: 'text',
    readOnly: true,
    width: 200,
  },
  //Id del indicador del Obj General
  {
    data: 'idIndOg',
    type: 'text',
    readOnly: true,
    width: 50,
  },
  //Indicador dle Obj General
  {
    data: 'indicadorOg',
    type: 'dropdown',
    source(query, process) {
      process(indicadoresOgOptions.value)
    },
    allowInvalid: false,
    strict: true,
    width: 200,
  },
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

      fila.idObjPei = objetivo?.id || ''

      if (!objetivo?.indicadores?.length) {
        fila.idIndPei = ''
        fila.indicadorPei = ''
        alert(`El objetivo "${newValue}" no tiene indicadores disponibles.`)
        continue
      }

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
    if (prop === 'indicadorOg') {
      const codigoInd = newValue?.split(' - ')[0]
      const indicador = props.proyectoEstructura?.objetivo_general?.indicadores_objgral?.find(
        (i) => i.codigo === codigoInd,
      )
      fila.idIndOg = indicador?.id || ''
      fila.objetivoGral = props.proyectoEstructura?.objetivo_general?.descripcion || ''
      fila.idObjGral = props.proyectoEstructura?.objetivo_general?.id || ''
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
