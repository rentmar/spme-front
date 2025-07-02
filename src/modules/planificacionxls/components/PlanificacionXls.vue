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
  //Proceso Actividad
  'Proceso',
  //Actividad
  'Actividad - COD',
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
  //Indicador Producto Objetivo Especifico
  // {
  //   data: 'indicadorProductoOe',
  //   type: 'dropdown',
  //   width: 200,
  //   source: [],
  // },
  //Resultado OE
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
    data: 'actividad-info',
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
  //Supuestos y Riesgos
  {
    data: 'supuestosRiesgos',
    type: 'text',
    width: 200,
  },
  //Supuestos y Riesgos
  {
    data: 'supuestosRiesgos',
    type: 'text',
    width: 200,
  },
  //Nombre de Cuenta
  {
    data: 'nombreCuenta',
    type: 'text',
    width: 200,
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
    data: 'totalReportado',
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
