<template>
  <div class="hotWraper">
    <LoadingOverlay
      :isLoading="isLoading"
      :loadingMessage="loadingMessage"
      :loadingProgress="loadingProgress"
      :loadingError="loadingError"
      progressType="linear"
    ></LoadingOverlay>

    <div class="hotWraper">
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
        :data="tableData"
        :columns="columns"
        :colHeaders="headers"
        :rowHeaders="true"
        :height="400"
        :contextMenu="true"
        :language="'es-Mx'"
        :afterChange="handleChange"
        :licenseKey="'non-commercial-and-evaluation'"
      >
      </HotTable>
    </div>
  </div>
  {{ tableData }}
  <br /><br />
  {{ proyectoEstructura }}
</template>

<script setup>
import HotTable from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary } from 'handsontable/i18n'
import { esMX } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
import LoadingOverlay from '@/components/layout/partials/LoadingOverlay.vue'
import { ref, computed, onMounted, inject } from 'vue'
import { usePlanificacionStore } from '../store/usePlanificacionStore'
import { useRoute } from 'vue-router'
import useLoading from '@/composables/useLoading'
import { SELECT_OPTIONS } from '@/utility/selectOptions'
import { unirValoresConComas, formatearObjetivoGeneral } from '@/utility/strings'

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

//Iniciar el store de planificacion
const planificacionStore = usePlanificacionStore()

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
  //Producto OG
  'id',
  'Producto OG',
  //Indicador Producto OG
  'id',
  'Indicador Producto OG',
  //Objetivo Especifico
  'Objetivo Especifico',
  //Indicador OE
  'id',
  'Indicador OE',
  //Producto OE
  'id',
  'Producto OE',
  //Indicador Producto OE
  'id',
  'Indicador Producto OE',
  //Resultado OE
  'id',
  'Resultado OE',
  //Indicador Resultado OE
  'id',
  'Indicador Resultado OE',
  //Area Programa
  'Programa/Area',
  //Proceso Actividad
  'Proceso',
  //Actividad
  'Actividad',
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
  //Nombre cuenta
  'Nombre Cuenta',
  //Presupuesto Global
  'Presupuesto Global',
  //Total Reportado
  'Total Reportado',
  'Total Ejecutado',
  'Saldo',
  'Grado de ejecucion',
  'Medios de verificacion',
])

const hiddenColumns = ref([])
const hiddenColumnsConfig = computed(() => ({
  columns: hiddenColumns.value,
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
  //Producto Objetivo General
  {
    data: 'idpog',
    type: 'numeric',
    width: 70,
    readOnly: true,
  },
  {
    data: 'productoOg',
    type: 'dropdown',
    width: 200,
    source: [],
  },
  //Indicador Producto OG
  {
    data: 'idipog',
    type: 'numeric',
    width: 70,
    readOnly: true,
  },
  {
    data: 'indicadorProductoOg',
    type: 'dropdown',
    width: 200,
    source: [],
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
    data: 'idioe',
    type: 'numeric',
    width: 70,
    readOnly: true,
  },
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
    data: 'idpoe',
    type: 'numeric',
    width: 70,
    readOnly: true,
  },
  {
    data: 'productoOe',
    type: 'dropdown',
    width: 200,
    source: [],
  },
  //Indicador Producto Objetivo Especifico
  {
    data: 'idipoe',
    type: 'numeric',
    width: 70,
    readOnly: true,
  },
  {
    data: 'indicadorProductoOe',
    type: 'dropdown',
    width: 200,
    source: [],
  },
  //Resultado OE
  {
    data: 'idresoe',
    type: 'numeric',
    width: 70,
    readOnly: true,
  },
  {
    data: 'resultadoOe',
    type: 'dropdown',
    width: 200,
    source: [],
  },
  //Indicador resultado OE
  {
    data: 'idiroe',
    type: 'numeric',
    width: 70,
    readOnly: true,
  },
  {
    data: 'indicadorResultadoOe',
    type: 'dropdown',
    width: 200,
    source: [],
  },
  //Programa Area
  {
    data: 'programa-area',
    type: 'text',
    width: 200,
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
  },
  //Actividad
  {
    data: 'actividad',
    type: 'text',
    width: 200,
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
])

onMounted(async () => {
  await cargarDatos()
})

const cargarDatos = async () => {
  try {
    //await obtenerEstructuraPeiPorID(peiVigente.value.id)
    //await obtenerConteosProyecto(idproyecto)
  } catch (err) {
    console.error('Error al cargar datos', err)
  }
}

const hotTable = ref(null)
const hot = computed(() => hotTable.value?.hotInstance)

//FUNCIONES
const handleChange = (changes, source) => {
  if (source === 'edit') {
    changes.forEach(([row, prop, oldValue, newValue]) => {
      const hotInstance = hotTable.value?.hotInstance
      if (!hotInstance) return

      if (prop === 'objetivoPei') {
        // Manejar cambios en objetivo PEI (tu código existente)
        hotInstance.setDataAtRowProp(row, 'indicadorPei', '')

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

      if (prop === 'indicadorPei' && newValue) {
        const indicadorId = newValue.split('-')[0]
        hotInstance.setDataAtRowProp(row, 'idindpei', indicadorId)
      }

      // Manejar cambios en objetivo específico
      if (prop === 'objetivoEspecifico') {
        // Resetear valores dependientes
        hotInstance.setDataAtRowProp(row, 'indicadorOe', '')
        hotInstance.setDataAtRowProp(row, 'idioe', '')

        if (newValue) {
          const objetivoId = newValue.split('-')[0].trim()
          // No necesitamos cargar aquí, se hará automáticamente al abrir el dropdown
        }
        hotInstance.updateSettings({})
      }

      // Actualizar ID cuando cambia el indicador OE
      if (prop === 'indicadorOe' && newValue) {
        const indicadorId = newValue.split('-')[0].trim()
        hotInstance.setDataAtRowProp(row, 'idioe', indicadorId)
      }
    })
  }
}
const nuevaFila = {
  objetivoPei: '',
  indicadorPei: '',
  objetivoGeneral: objetivoGeneralProyecto,
  'programa-area': programaArea,
  // ... otras propiedades
}

const agregarFila = async () => {
  tableData.value.push({ ...nuevaFila }) // Crea una copia nueva cada vez
}

const eliminarFila = async () => {}

const exportarExcel = async () => {}
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
