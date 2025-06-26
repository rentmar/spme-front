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
        :autoWrapRow="true"
        :autoWrapCol="true"
        :nestedHeaders="nestedHeaders"
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
console.log('Objetivos Generales(PP):')
console.log(objetivosGenerales)

//Indicadores del Objetivo General
const indicadoresOgOptions = ref([])
console.log('indicadores og(PP)')
console.log(indicadoresOgOptions)

//Resultados del Objetivo General
const resultadosOgOptions = ref([])
console.log('Resultados de OG(PP)')
console.log(resultadosOgOptions)

//Indicador de resultados de OG
const indicadorResultadoOgOptions = ref([])

onMounted(async () => {
  await cargarDatos()
})

const cargarDatos = async () => {
  try {
    await withLoading(obtenerPeiVigenteEstructura(), 'Cargando informacion del PEI')
    inicializarIndicadoresog()
    inicializarResultadosOg()
  } catch (err) {
    console.error('Erro al cargar la informacion', err)
  }
}
//Inicializar los Indicadores OG
const inicializarIndicadoresog = () => {
  const indicadores = props.proyectoEstructura?.objetivo_general?.indicadores_objgral || []
  indicadoresOgOptions.value = indicadores.map((i) => `${i.codigo} - ${i.redaccion}`)
}

//Inicializar los Resultados OG
const inicializarResultadosOg = () => {
  const resultados = props.proyectoEstructura?.objetivo_general?.resultados_objgral || []
  resultadosOgOptions.value = resultados.map((i) => `${i.codigo} - ${i.descripcion}`)
}

//Rotulos de lo Headers

const nestedHeaders = ref([
  //Quinto  Nivel
  // [{ label: 'PROYECTO - PLANIFICACION', colspan: 24 }],
  //Cuarto  Nivel
  // [
  //   { label: 'PEI', colspan: 4 },
  //   { label: 'PROYECTO', colspan: 20 },
  // ],
  //Tercer Nivel
  // [
  //   { label: 'PEI', colspan: 4 },
  //   { label: 'OBJETIVO GENERAL', colspan: 4 },
  // ],

  //Segundo Nivel
  [
    { label: 'Objetivo', colspan: 2 },
    { label: 'Indicador', colspan: 2 },
    { label: 'Objetivo General', colspan: 2 },
    { label: 'Indicador OG', colspan: 2 },
    { label: 'Producto OG', colspan: 2 },

    { label: 'Objetivo Especifico', colspan: 2 },
    { label: 'Indicador OE', colspan: 2 },
    { label: 'Producto OE', colspan: 2 },

    { label: 'Resultado OG', colspan: 2 },
    { label: 'Indicador Resultado OG', colspan: 2 },
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
    //Indicador OG
    'id',
    'Indicador',
    //Producto OG
    'id',
    'Producto OG',
    //Objetivo especifico
    'id',
    'Objetivo Especifico',
    //Indicador OE
    'id',
    'Indicador OE',
    //Producto OE
    'id',
    'Producto OE',
    //Producto
    'id',
    'Resultado',
    //INdicador
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
  //Id del resultado de Obj Gral
  {
    data: 'idResOg',
    type: 'text',
    readOnly: true,
    width: 50,
  },
  //Resultado de OG
  {
    data: 'resultadoOg',
    type: 'dropdown',
    source(query, process) {
      process(resultadosOgOptions.value)
    },
    allowInvalid: false,
    strict: true,
    width: 250,
  },
  //Id del resultado de Obj Gral
  {
    data: 'idIndResOg',
    type: 'text',
    readOnly: true,
    width: 50,
  },
  //Indicador de resultado de OG
  {
    data: 'indicadorResOg',
    type: 'dropdown',
    allowInvalid: false,
    source: indicadorResultadoOgOptions,
    strict: true,
    width: 250,
  },
  {
    data: 'indicadorResOg',
    type: 'dropdown',
    allowInvalid: false,
    source: indicadorResultadoOgOptions,
    strict: true,
    width: 50,
  },
  //Producto
  {
    data: 'indicadorResOg',
    type: 'text',
    allowInvalid: false,
    source: indicadorResultadoOgOptions,
    strict: true,
    width: 250,
  },
  {
    data: 'indicadorResOg',
    type: 'text',
    allowInvalid: false,
    source: indicadorResultadoOgOptions,
    strict: true,
    width: 50,
  },
  {
    data: 'indicadorResOg',
    type: 'text',
    allowInvalid: false,
    source: indicadorResultadoOgOptions,
    strict: true,
    width: 250,
  },
  {
    data: 'indicadorResOg',
    type: 'text',
    allowInvalid: false,
    source: indicadorResultadoOgOptions,
    strict: true,
    width: 50,
  },
  {
    data: 'indicadorResOg',
    type: 'text',
    allowInvalid: false,
    source: indicadorResultadoOgOptions,
    strict: true,
    width: 250,
  },
  {
    data: 'indicadorResOg',
    type: 'text',
    allowInvalid: false,
    source: indicadorResultadoOgOptions,
    strict: true,
    width: 50,
  },
  {
    data: 'indicadorResOg',
    type: 'text',
    allowInvalid: false,
    source: indicadorResultadoOgOptions,
    strict: true,
    width: 250,
  },
  {
    data: 'procedencia',
    type: 'dropdown',
    allowInvalid: false,
    source: ['opcion1'],
    strict: true,
    width: 250,
  },
])

/********* Funciones *********/
const agregarFila = () => {
  console.log('Agregar fila')
  datosPlanificacion.value.push({})
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
    if (prop === 'resultadoOg') {
      const codigoRes = newValue?.split(' - ')[0]
      const resultado = props.proyectoEstructura?.objetivo_general?.resultados_objgral?.find(
        (r) => r.codigo === codigoRes,
      )

      // Limpiar primero el array de opciones
      indicadorResultadoOgOptions.value = []
      // Limpiar la celda seleccionada de indicador relacionado
      fila.idIndResOg = ''
      fila.indicadorResOg = ''

      //Obtener los indicadores del resultado
      const indicadorResultado = obtenerIndicadoresPorResultadoId(
        props.proyectoEstructura?.objetivo_general?.resultados_objgral,
        resultado.id,
      )

      const indicadorResultadoOpciones = indicadorResultado.map(
        (ir) => `${ir.codigo} - ${ir.redaccion}`,
      )
      fila.idResOg = resultado?.id || ''
      indicadorResultadoOgOptions.value = indicadorResultadoOpciones
    }
    if (prop === 'indicadorResOg') {
      const codigoIndRes = newValue?.split(' - ')[0]
      // console.log('handle indicador Resultado OG')
      // console.log(codigoIndRes)
      const resultados = props.proyectoEstructura?.objetivo_general?.resultados_objgral
      const idindicador = obtenerIdIndicadorResultadoOG(resultados, codigoIndRes)
      // console.log(idindicador)
      fila.idIndResOg = idindicador || ''
    }
  }
}

//Filtrar Indicadores de Resultado OG, segun el id del resultado
function obtenerIndicadoresPorResultadoId(resultadoIn, resultadoId) {
  const resultados = resultadoIn
  const resultado = resultados.find((r) => r.id === resultadoId)
  return resultado?.indicador_res_objgral || []
}
//Id del indicador de Resultado OG
function obtenerIdIndicadorResultadoOG(resultados_objgral, codigoIndicador) {
  const resultados = resultados_objgral || []

  for (const resultado of resultados) {
    const indicador = resultado.indicador_res_objgral?.find((i) => i.codigo === codigoIndicador)
    if (indicador) {
      return indicador.id
    }
  }

  return null // No se encontro el indicador
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
