<template>
  <div class="hot-wrapper">
    <div class="hot-container">
      <v-toolbar flat density="comfortable" class="excel-toolbar">
        <v-tooltip text="Agregar fila" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text" class="excel-btn" @click="agregarFila">
              <v-icon size="18">mdi-plus</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Eliminar fila seleccionada" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text" class="excel-btn" @click="eliminarFila">
              <v-icon size="18">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </v-toolbar>
      <HotTable
        ref="hotTableOG"
        :data="hotDataOG"
        :columns="hotColumnsOG"
        :colHeaders="true"
        :dropdownMenu="true"
        :autoColumnSize="true"
        :manualColumnResize="true"
        :nestedHeaders="nestedHeadersOG"
        :rowHeaders="true"
        :licenseKey="'non-commercial-and-evaluation'"
        :height="150"
        :afterChange="handleChangeOG"
        :contextMenu="true"
        :language="'es-Mx'"
      />
    </div>
  </div>

  <div class="hot-wrapper">
    <div class="hot-container">
      <v-toolbar flat density="comfortable" class="excel-toolbar">
        <v-tooltip text="Agregar fila" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text" class="excel-btn" @click="agregarFila">
              <v-icon size="18">mdi-plus</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Eliminar fila seleccionada" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text" class="excel-btn" @click="eliminarFila">
              <v-icon size="18">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </v-toolbar>
      <HotTable
        ref="hotTableOE"
        :data="hotDataOE"
        :columns="hotColumnsOE"
        :colHeaders="true"
        :dropdownMenu="true"
        :autoColumnSize="true"
        :manualColumnResize="true"
        :nestedHeaders="nestedHeadersOE"
        :rowHeaders="true"
        :licenseKey="'non-commercial-and-evaluation'"
        :height="150"
        :afterChange="handleChangeOE"
        :contextMenu="true"
        :language="'es-Mx'"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { HotTable } from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import 'handsontable/dist/handsontable.full.css'
import { registerLanguageDictionary } from 'handsontable/i18n'
import { esMX } from 'handsontable/i18n'

registerAllModules()
registerLanguageDictionary(esMX)
const hotTableOG = ref(null)
const hotTableOE = ref(null)

//Datos del proyecto
const proyectoEstructura = ref([
  {
    id: 1,
    codigo: 'PRJB-025028',
    titulo: 'Sistema de Gestión de Proyectos',
    descripcion: 'Proyecto para digitalizar la gestión de proyectos institucionales.',
    objetivo_general: {
      id: 10,
      codigo: 'OG1',
      descripcion: 'Mejorar la eficiencia institucional',
      kpis: [
        {
          id: 100,
          codigo: 'KPI1',
          descripcion: 'Aumento del 20% en eficiencia operativa',
        },
      ],
      indicador_og: [
        {
          id: 200,
          codigo: 'IOG1',
          tipo: 'A-Z',
          redaccion: 'SMART',
          fuente_verificacion: 'Informe de gestión',
        },
      ],
      resultado_og: {
        id: 300,
        codigo: 'ROG1',
        descripcion: 'Procesos institucionales optimizados',
        supuestos: '',
        riesgos: '',
        proceso: {
          id: 400,
          codigo: 'PROC1',
          titulo: 'Optimización de procesos',
          descripcion: 'Reingeniería de procesos clave',
        },
        indicador_res_og: [
          {
            id: 500,
            codigo: 'IROG1',
            tipo: '1-9',
            redaccion: 'GUIA',
            fuente_verificacion: 'Indicador de desempeño mensual',
          },
        ],
      },
    },
    objetivos_especificos: [
      {
        id: 20,
        codigo: 'OE1',
        descripcion: 'Reducir tiempos de respuesta',
        indicador_oe: [
          {
            id: 201,
            codigo: 'IOE1',
            tipo: '%',
            redaccion: 'SMART',
            fuente_verificacion: 'Sistema de atención al cliente',
          },
        ],
        resultado_oe: {
          id: 301,
          codigo: 'ROE1',
          descripcion: 'Atención al cliente digitalizada',
          supuestos: '',
          riesgos: '',
          proceso: {
            id: 401,
            codigo: 'PROC2',
            titulo: 'Digitalización de atención',
            descripcion: 'Automatización de canales de atención',
          },
          indicador_res_oe: [
            {
              id: 501,
              codigo: 'IROE1',
              tipo: '1-9',
              redaccion: 'SMART',
              fuente_verificacion: 'Encuestas de satisfacción',
            },
          ],
          productoresultadooe_set: [
            {
              id: 601,
              codigo: 'PRODROE1',
              descripcion: 'Sistema de tickets instalado',
              supuestos: '',
              riesgos: '',
              entregado: true,
            },
          ],
        },
        producto_oe: [
          {
            id: 701,
            codigo: 'PRODOE1',
            descripcion: 'Manual de atención digital',
            supuestos: '',
            riesgos: '',
            entregado: false,
            proceso: {
              id: 402,
              codigo: 'PROC3',
              titulo: 'Capacitación digital',
              descripcion: 'Capacitación del personal para uso del sistema',
            },
          },
        ],
      },
    ],
  },
])
// Datos del PEi
const peiRespuesta = ref({
  id: 1,
  titulo: 'PEI 2024',
  objetivos: [
    {
      id: 1,
      codigo: 'OBJ-001',
      descripcion: 'Mejorar la eficiencia operativa',
      indicadores: [
        {
          id: 1,
          codigo: 'IND-001',
          descripcion: 'Tasa de eficiencia',
          tipo: 'Proporcion',
        },
        {
          id: 2,
          codigo: 'IND-002',
          descripcion: 'Satisfacción del cliente',
          tipo: 'Avance',
        },
      ],
    },
    {
      id: 2,
      codigo: 'OBJ-002',
      descripcion: 'Reducir costos operativos',
      indicadores: [
        {
          id: 3,
          codigo: 'IND-003',
          descripcion: 'Costo por unidad producida',
          tipo: 'Proporcion',
        },
        {
          id: 4,
          codigo: 'IND-004',
          descripcion: 'Costo por unidad producida test',
          tipo: 'Avance',
        },
      ],
    },
  ],
})

// Datos iniciales - tabla planificacion og
const hotDataOG = ref([
  {
    //PEI
    idobjetivo: '',
    objetivo: null,
    idindicador: '',
    indicador: null,
    //Proyecto Objetivo General
    idobjetivogral: '2',
    objetivogral: 'OG - obj general',
    idindicador_og: '',
    indicador_og: '',
    idresultado_og: '',
    resultado_og: '',
    codProceso: '',
    area: '',
    actividad: '',
    noactividad: '',
    fecha_inicio: '',
    fecha_cierre: '',
    presupuesto: '',
    mediover: '',
  },
])

const hotDataOE = ref([
  {
    idobjetivo: '',
    objetivo: null,
    idindicador: '',
    indicador: null,
    objetivoesp: '',
    resultado: '',
    producto: '',
    area: '',
    actividad: '',
    noactividad: '',
    fecha_inicio: '',
    fecha_cierre: '',
    presupuesto: '',
    mediover: '',
  },
])

// Opciones para los dropdowns (simples strings)
const objetivosOptions = computed(() =>
  peiRespuesta.value.objetivos.map((obj) => `${obj.codigo} - ${obj.descripcion}`),
)
//Objetivo General
const proyectoObjGral = computed(() => {
  const og = proyectoEstructura.value[0].objetivo_general
  return {
    id: og.id,
    codigo: og.codigo,
    descripcion: og.descripcion,
  }
})
//console.log(proyectoObjGral.value)

const getIndicadoresForObjetivo = (objetivoIndex) => {
  if (objetivoIndex === null || objetivoIndex === undefined) return []
  return peiRespuesta.value.objetivos[objetivoIndex].indicadores.map(
    (ind) => `${ind.codigo} - ${ind.descripcion}`,
  )
}

// Columnas de la tabla
const hotColumnsOG = ref([
  {
    data: 'idobjetivo',
    type: 'text',
    width: 50,
    readOnly: true,
  },
  {
    data: 'objetivo',
    type: 'dropdown',
    source: objetivosOptions.value,
    strict: true,
    width: 250,
  },
  {
    data: 'ididentificador',
    type: 'text',
    width: 50,
    readOnly: true,
  },
  {
    data: 'indicador',
    type: 'dropdown',
    source: [],
    strict: true,
    width: 250,
  },
  {
    data: 'idobjetivogral',
    type: 'text',
    width: 50,
    readOnly: true,
  },
  {
    data: 'objetivogral',
    type: 'text',
    width: 150,
    strict: true,
    readOnly: true,
  },
  {
    data: 'idresultado',
    type: 'text',
    width: 50,
    readOnly: true,
  },
  {
    data: 'resultado',
    type: 'dropdown',
    source: ['Sí', 'No'],
    width: 80,
  },
  {
    data: 'idindicador_res',
    type: 'text',
    width: 50,
    readOnly: true,
  },
  {
    data: 'indicador_res',
    type: 'dropdown',
    source: ['Sí', 'No'],
    width: 80,
  },
  { data: 'area', type: 'text', width: 150 },
  { data: 'actividad', type: 'text', width: 150 },
  { data: 'noactividad', type: 'text', width: 120 },
  {
    data: 'fecha_inicio',
    type: 'date',
    dateFormat: 'YYYY-MM-DD',
    width: 120,
  },
  {
    data: 'fecha_cierre',
    type: 'date',
    dateFormat: 'YYYY-MM-DD',
    width: 120,
  },
  {
    data: 'presupuesto',
    type: 'numeric',
    numericFormat: {
      pattern: '$0,0.00',
    },
    width: 120,
  },
  { data: 'mediover', type: 'text', width: 200 },
])
//Columnas del Objetivo Especifico
const hotColumnsOE = ref([
  {
    data: 'idobjetivo',
    type: 'text',
    width: 50,
    readOnly: true,
  },
  {
    data: 'objetivo',
    type: 'dropdown',
    source: objetivosOptions.value,
    strict: true,
    width: 250,
  },
  {
    data: 'ididentificador',
    type: 'text',
    width: 50,
    readOnly: true,
  },
  {
    data: 'indicador',
    type: 'dropdown',
    source: [],
    strict: true,
    width: 250,
  },
  { data: 'objetivoesp', type: 'text', width: 150 },
  {
    data: 'resultado',
    type: 'dropdown',
    source: ['Sí', 'No'],
    width: 80,
  },
  { data: 'producto', type: 'text', width: 150 },
  { data: 'area', type: 'text', width: 150 },
  { data: 'actividad', type: 'text', width: 150 },
  { data: 'noactividad', type: 'text', width: 120 },
  {
    data: 'fecha_inicio',
    type: 'date',
    dateFormat: 'YYYY-MM-DD',
    width: 120,
  },
  {
    data: 'fecha_cierre',
    type: 'date',
    dateFormat: 'YYYY-MM-DD',
    width: 120,
  },
  {
    data: 'presupuesto',
    type: 'numeric',
    numericFormat: {
      pattern: '$0,0.00',
    },
    width: 120,
  },
  { data: 'mediover', type: 'text', width: 200 },
])

// Cabeceras Planificacion objetivo General
const nestedHeadersOG = ref([
  [{ label: 'Planificacion Objetivos Generales', colspan: 14 }],
  [
    { label: 'PEI', colspan: 4 },
    { label: 'PROYECTO', colspan: 10 },
  ],
  [
    { label: 'Objetivo', colspan: 2 },
    { label: 'Indicador', colspan: 2 },
    { label: 'Objetivo General + Indicador', colspan: 4 },
  ],
  [
    'Id Objetivo',
    'Objetivo PEI',
    'Id identificador',
    'Indicador PEI',
    'Id obj General',
    'Objetivo General',
    'Id indicador',
    'Indicador',
    'Id resultado',
    'Resultado',
    'Área Responsable',
    'Actividad',
    'No. Actividad',
    'Fecha Inicio',
    'Fecha Fin',
    'Presupuesto',
    'Medio Verificación',
  ],
])

// Cabeceras Planificacion objetivo General
const nestedHeadersOE = ref([
  [{ label: 'Planificacion Objetivos Especificos', colspan: 14 }],
  [
    { label: 'PEI', colspan: 4 },
    { label: 'PROYECTO', colspan: 10 },
  ],
  [
    { label: 'Objetivo', colspan: 2 },
    { label: 'Indicador', colspan: 2 },
  ],
  [
    'Id Objetivo',
    'Objetivo PEI',
    'Id identificador',
    'Indicador PEI',
    'Objetivo Específico',
    'Resultado Esperado',
    'Producto',
    'Área Responsable',
    'Actividad',
    'No. Actividad',
    'Fecha Inicio',
    'Fecha Fin',
    'Presupuesto',
    'Medio Verificación',
  ],
])

const handleChangeOG = (changes, source) => {
  handleChange(changes, source, 'OG')
}

const handleChangeOE = (changes, source) => {
  handleChange(changes, source, 'OE')
}

const handleChange = (changes, source, tableType) => {
  if (source === 'edit' && changes) {
    const hotData = tableType === 'OG' ? hotDataOG.value : hotDataOE.value
    const columns = tableType === 'OG' ? hotColumnsOG.value : hotColumnsOE.value
    const hotRef = tableType === 'OG' ? hotTableOG.value : hotTableOE.value

    changes.forEach(([row, prop, oldValue, newValue]) => {
      if (prop === 'objetivo') {
        const objetivoIndex = objetivosOptions.value.findIndex((opt) => opt === newValue)

        if (objetivoIndex !== -1) {
          const objetivo = peiRespuesta.value.objetivos[objetivoIndex]
          hotData[row].idobjetivo = objetivo.id

          // Set new source for 'indicador' column
          const columnIndex = columns.findIndex((c) => c.data === 'indicador')
          if (columnIndex !== -1) {
            const sourceIndicadores = getIndicadoresForObjetivo(objetivoIndex)
            hotRef.hotInstance.setCellMeta(row, columnIndex, 'source', sourceIndicadores)
          }

          // Reset indicador and ididentificador
          hotData[row].indicador = null
          hotData[row].ididentificador = ''
        }
      }

      if (prop === 'indicador') {
        const objetivoNombre = hotData[row].objetivo
        const objetivoIndex = objetivosOptions.value.findIndex((opt) => opt === objetivoNombre)

        if (objetivoIndex !== -1) {
          const indicador = peiRespuesta.value.objetivos[objetivoIndex].indicadores.find(
            (ind) => `${ind.codigo} - ${ind.descripcion}` === newValue,
          )
          if (indicador) {
            hotData[row].ididentificador = indicador.id
          }
        }
      }
    })
  }
}

const agregarFila = () => {}
const eliminarFila = () => {}
</script>

<style scoped>
.excel-btn {
  background-color: #f1f1f1 !important;
  border: 1px solid #ccc !important;
  box-shadow: none !important;
  margin-right: 4px;
  transition: background-color 0.2s;
}

.excel-btn:hover {
  background-color: #e1e1e1 !important;
}

.excel-btn:active {
  background-color: #d1d1d1 !important;
}

.hot-container :deep(.v-icon) {
  color: #333;
}

.hot-container {
  display: flex;
  flex-direction: column;
  min-height: 400px;
  height: auto;
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
}

.hot-container .handsontable {
  flex: 1 1 auto;
}

.hot-wrapper {
  margin-bottom: 24px;
}
</style>
