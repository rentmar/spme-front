import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// Asegúrate de que esta ruta sea correcta en tu proyecto
import { useTareaSubactividad } from '@/modules/proyecto/composables/useTareaSubactividad'
import { useInformeSubActividad } from '../composables/useInformeSubActividad'
import { useIndicadores } from '@/modules/proyecto/composables/useIndicadores'

export const useInformeTareaStore = defineStore('informe-tarea', () => {
  // === ESTADOS ===
  const loading = ref(false)
  const error = ref(null)

  // Variables de estado para la información separada
  const tarea = ref(null) // Contendrá la información principal de la tarea
  const actividad = ref(null) // Contendrá la información de la actividad
  const proyecto = ref(null) // Contendrá la información del proyecto
  const usuario = ref(null) // Contendrá la información del responsable de la actividad

  // Variable para almacenar la respuesta completa (incluyendo metadatos y nodos)
  const tareaDetallesInfo = ref(null)
  //Variable informe de Tarea por idtarea
  const tareaListaInfo = ref(null)

  //Estructura de procedencia
  const estructuraProcedencia = ref(null)
  const indicadores = ref(null)
  const indicadoresIds = ref(null)
  //Indicadores del Informe de Actividad
  const indicadorog = ref(null) //Indicador del Objetivo General
  const indicadoroe = ref(null) //Indicadores del objetivo Especifico
  const indicadorrog = ref(null) //Indicadores Resultado Objetivo General
  const indicadorroe = ref(null) //Indicdores Resultado Objetivo Especifico

  //Estado para registros de indicadores
  const registrosIndicadores = ref({
    indicadorog: {}, // key: id_indicador, value: registro
    indicadoroe: {},
    indicadorrog: {},
    indicadorroe: {},
  })

  //Getters computados para totales
  const totalesPorTipo = computed(() => ({
    indicadorog: Object.keys(registrosIndicadores.value.indicadorog).length,
    indicadoroe: Object.keys(registrosIndicadores.value.indicadoroe).length,
    indicadorrog: Object.keys(registrosIndicadores.value.indicadorrog).length,
    indicadorroe: Object.keys(registrosIndicadores.value.indicadorroe).length,
  }))

  const totalGeneral = computed(() => {
    const totals = totalesPorTipo.value
    return totals.indicadorog + totals.indicadoroe + totals.indicadorrog + totals.indicadorroe
  })

  //Computed para generar el json exacto para la API
  const indicadoresParaAPI = computed(() => {
    // Función auxiliar para convertir objeto a array
    const objetoToArray = (objeto) => {
      return Object.values(objeto).map((registro) => ({
        ...registro,
        // Asegurar que los valores nulos estén presentes
        valor_literal: registro.valor_literal || null,
        valor_numerico: registro.valor_numerico || null,
        valor_porcentual: registro.valor_porcentual || null,
      }))
    }

    // Construir el objeto exactamente como lo necesita la API
    return {
      metadatos: {
        total_indicadorog: totalesPorTipo.value.indicadorog,
        total_indicadoroe: totalesPorTipo.value.indicadoroe,
        total_indicadorrog: totalesPorTipo.value.indicadorrog,
        total_indicadorroe: totalesPorTipo.value.indicadorroe,
        total_general: totalGeneral.value,
      },
      indicadorog: objetoToArray(registrosIndicadores.value.indicadorog),
      indicadoroe: objetoToArray(registrosIndicadores.value.indicadoroe),
      indicadorrog: objetoToArray(registrosIndicadores.value.indicadorrog),
      indicadorroe: objetoToArray(registrosIndicadores.value.indicadorroe),
    }
  })

  // === COMPOSABLE ===
  const { tareaDetalles, cargarTareaPorIdDetallesInformacion } = useTareaSubactividad()
  const { informeSubactividadMinPorTarea, listaInformesSubactividadMinPorTarea } =
    useInformeSubActividad()

  const {
    cargarIndicadoresOgporIds, //indicadorog
    cargarIndicadoresOePorIds, //indicadoroe
    cargarIndicadoresResultadoOgPorIds, //indicadorrog
    cargarIndicadoresResultadoOePorIds, //indicadorroe
  } = useIndicadores()

  // === ACCIONES ===
  // Cargar la tarea y desestructurar sus datos en los estados
  async function obtenerTareasPorIdMasDetalles(idtarea) {
    loading.value = true
    error.value = null // Limpiar errores previos

    try {
      //Cargar la información detallada usando el composable
      await cargarTareaPorIdDetallesInformacion(idtarea)

      // La respuesta completa (incluyendo nodos, selecciones, etc.)
      tareaDetallesInfo.value = tareaDetalles.value

      if (tareaDetallesInfo.value && tareaDetallesInfo.value.tarea) {
        // Obtenemos el objeto principal de la tarea
        const dataTarea = tareaDetallesInfo.value.tarea

        //Asignar la información de la Tarea y la Actividad
        tarea.value = dataTarea
        actividad.value = dataTarea.actividad

        //Asignar
        estructuraProcedencia.value = dataTarea.actividad.estructuraProcedencia
        indicadores.value = dataTarea.actividad.estructuraProcedencia.indicadores_recolectados
        indicadoresIds.value = extraerIdsIndicadores(indicadores.value)
        indicadorog.value = await cargarIndicadoresOgporIds(indicadoresIds.value.indicadorog)
        indicadoroe.value = await cargarIndicadoresOePorIds(indicadoresIds.value.indicadoroe)
        indicadorrog.value = await cargarIndicadoresResultadoOgPorIds(
          indicadoresIds.value.indicadorrog,
        )
        indicadorroe.value = await cargarIndicadoresResultadoOePorIds(
          indicadoresIds.value.indicadorroe,
        )
        //Asignar la información anidada de Proyecto y Usuario
        proyecto.value = dataTarea.actividad?.proyecto_info || null
        usuario.value = dataTarea.actividad?.responsable_info || null
      } else {
        throw new Error('La respuesta del servidor no contiene la estructura esperada de la tarea.')
      }
    } catch (err) {
      console.error('Error al cargar la tarea:', err)
      error.value = 'No se pudo cargar la información detallada de la tarea.'
    } finally {
      loading.value = false
    }
  }

  //Cargar informes de una tarea/subactividad
  async function obtenerInformesSubactividadPorSubactividad(idtarea) {
    loading.value = true
    try {
      await listaInformesSubactividadMinPorTarea(idtarea)
      tareaListaInfo.value = informeSubactividadMinPorTarea.value
    } catch (err) {
      error.value = err
      console.error(
        'Error al cargar informes de subactividad de la subactividad con id: ' + idtarea,
        err,
      )
    } finally {
      loading.value = false
    }
  }

  /***********************Funciones indicadores*********************************************/
  // Función para extraer IDs de indicadores agrupados por tipo
  // Opción 3: Si solo te interesan los tipos que ya existen en resultado
  const extraerIdsIndicadores = (indicadoresData) => {
    const resultado = {
      indicadorog: [],
      indicadoroe: [],
      indicadorrog: [],
      indicadorroe: [],
    }

    if (!indicadoresData || typeof indicadoresData !== 'object') {
      return resultado
    }

    // Solo procesar los tipos que nos interesan
    Object.keys(resultado).forEach((tipo) => {
      if (Array.isArray(indicadoresData[tipo])) {
        resultado[tipo] = indicadoresData[tipo].map((item) => item.id)
      }
    })

    return resultado
  }

  //Manejo de registros
  const guardarRegistroIndicador = (tipo, indicadorId, registro) => {
    console.log(`💾 Store guardando registro ${tipo} para indicador ${indicadorId}:`, registro)

    // Validar que el tipo existe
    if (!registrosIndicadores.value[tipo]) {
      console.error(`Tipo de indicador inválido: ${tipo}`)
      return
    }

    // Guardar el registro usando el ID del indicador como key
    registrosIndicadores.value[tipo][indicadorId] = {
      id: Date.now(), // ID único del registro
      tipo_indicador: tipo,
      id_indicador: indicadorId,
      fecha_registro: registro.fecha_registro,
      tipo_dato: registro.tipo_dato,
      // Solo el valor correspondiente al tipo tendrá datos
      valor_literal: registro.tipo_dato === 'A-Z' ? registro.valor_literal : null,
      valor_numerico: registro.tipo_dato === '1-9' ? registro.valor_numerico : null,
      valor_porcentual: registro.tipo_dato === '%' ? registro.valor_porcentual : null,
      observaciones: registro.observaciones || '',
      timestamp_registro: registro.timestamp_registro || new Date().toISOString(),
      registrado_por: registro.registrado_por || 'Usuario Actual',
      registrado_por_id: registro.registrado_por_id || 0,
      fecha_actualizacion: new Date().toISOString(),
    }

    console.log('✅ Store actualizado:', registrosIndicadores.value)
    console.log('📊 JSON generado para API:', indicadoresParaAPI.value)
  }

  /**
   * Elimina un registro de indicador del store
   */
  const eliminarRegistroIndicador = (tipo, indicadorId) => {
    console.log(`🗑️ Store eliminando registro ${tipo} para indicador ${indicadorId}`)

    if (registrosIndicadores.value[tipo]?.[indicadorId]) {
      delete registrosIndicadores.value[tipo][indicadorId]
      console.log('✅ Store actualizado después de eliminar')
    }
  }

  /**
   * Resetea todos los registros de indicadores
   */
  const resetearRegistrosIndicadores = () => {
    registrosIndicadores.value = {
      indicadorog: {},
      indicadoroe: {},
      indicadorrog: {},
      indicadorroe: {},
    }
  }

  /**
   * Carga registros existentes desde el backend (para edición)
   */
  const cargarRegistrosIndicadores = (data) => {
    // Si vienen datos del backend, procesarlos
    if (data?.indicadorog) {
      data.indicadorog.forEach((registro) => {
        registrosIndicadores.value.indicadorog[registro.id_indicador] = registro
      })
    }
    if (data?.indicadoroe) {
      data.indicadoroe.forEach((registro) => {
        registrosIndicadores.value.indicadoroe[registro.id_indicador] = registro
      })
    }
    if (data?.indicadorrog) {
      data.indicadorrog.forEach((registro) => {
        registrosIndicadores.value.indicadorrog[registro.id_indicador] = registro
      })
    }
    if (data?.indicadorroe) {
      data.indicadorroe.forEach((registro) => {
        registrosIndicadores.value.indicadorroe[registro.id_indicador] = registro
      })
    }
  }

  /***********************Funciones indicadores FIN*********************************************/

  return {
    // Estados
    loading,
    error,
    tarea,
    actividad,
    proyecto,
    usuario,
    tareaDetallesInfo,
    tareaListaInfo,
    //Indicadores
    estructuraProcedencia,
    indicadores,
    indicadoresIds,
    indicadorog,
    indicadoroe,
    indicadorrog,
    indicadorroe,

    //Estados y getters para registros
    registrosIndicadores,
    totalesPorTipo,
    totalGeneral,
    indicadoresParaAPI,

    // Función para cargar los datos
    obtenerTareasPorIdMasDetalles,
    obtenerInformesSubactividadPorSubactividad,
    //Funciones para los registros
    guardarRegistroIndicador,
    eliminarRegistroIndicador,
    resetearRegistrosIndicadores,
    cargarRegistrosIndicadores,
  }
})
