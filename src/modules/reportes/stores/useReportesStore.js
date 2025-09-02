// stores/useReportesStore.js
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useReportesStore = defineStore('reportes', () => {
  //Variables de estado
  const proyecto = ref(null)
  const detallesReporte = reactive({
    objetivosGenerales: [],
    objetivosEspecificos: [],
    resultados: [],
    productos: [],
    procesos: [],
    actividades: [],
    indicadores: [],
  })

  //Cargar datos de reporte
  const cargarDatosReporte = (flowData) => {
    //Limpiar el estado actual
    proyecto.value = null
    detallesReporte.objetivosGenerales = []
    detallesReporte.objetivosEspecificos = []
    detallesReporte.resultados = []
    detallesReporte.productos = []
    detallesReporte.procesos = []
    detallesReporte.actividades = []
    detallesReporte.indicadores = []

    if (!flowData || !flowData.nodos) {
      console.error('Datos del diagrama no válidos.')
      return
    }

    // 2. Procesar los nodos y llenar las arrays
    flowData.nodos.forEach((nodo) => {
      const datos = nodo.data.nodoProyecto

      switch (nodo.type) {
        case 'proyecto':
          proyecto.value = datos
          break
        case 'objetivogeneral':
          detallesReporte.objetivosGenerales.push(datos)
          break
        case 'objetivoespecificoog':
          detallesReporte.objetivosEspecificos.push(datos)
          break
        case 'resultadooe':
        case 'resultadoog':
          detallesReporte.resultados.push(datos)
          break
        case 'productooe':
        case 'productoroe':
          detallesReporte.productos.push(datos)
          break
        case 'procesoroe':
        case 'procesopoe':
        case 'procesorog':
          detallesReporte.procesos.push(datos)
          break
        case 'actividad':
          detallesReporte.actividades.push(datos)
          break
        case 'indicadoroe':
        case 'indicadorrog':
        case 'indicadorog':
        case 'indicadorroe':
          detallesReporte.indicadores.push(datos)
          break
      }
    })
  }

  // --- GETTERS (Propiedades computadas, si se necesitaran) ---
  // No se necesitan aquí, ya que el estado se devuelve directamente.

  // --- EXPORTAR (lo que otros componentes pueden usar) ---
  return {
    proyecto,
    detallesReporte,
    cargarDatosReporte,
  }
})
