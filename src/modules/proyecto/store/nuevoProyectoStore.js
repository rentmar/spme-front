import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
//import { useApi } from '@/composables/useApi'

export const useNuevoProyectoStore = defineStore('nuevoProyecto', () => {
  //const { post } = useApi()
  const TIPOS_INDICADOR = {
    GUIA: 'GUIA',
    SMART: 'SMART',
  }

  const TIPOS_VALOR = {
    LITERAL: 'a-z',
    NUMERICO: '1-9',
    PORCENTUAL: '%',
  }

  // Estado inicial
  const cargando = ref(false)
  const pasoActual = ref(1)
  const nuevoProyecto = reactive({
    proyecto: {
      codigo: '',
      titulo: '',
      descripcion: '',
      fecha_creacion: new Date().toISOString().split('T')[0],
      fecha_inicio: '',
      fecha_finalizacion: '',
      instancia_gestora: '',
      registrado: '',
      estado: 'EST', // Estado inicial: Estructuración
    },
    objetivoGeneral: [
      {
        codigo: 'POO', // Código fijo para objetivo general
        descripcion: '',
        supuestos: '',
        riesgos: '',
      },
    ],
    objetivoEspecifico: [
      {
        codigo: 'PSO1', // Código autoincremental
        descripcion: '',
        supuestos: '',
        riesgos: '',
      },
    ],
    resultados: [
      {
        codigo: 'R01',
        descripcion: '',
        supuestos: '',
        riesgos: '',
      },
    ],
    productos: [
      {
        codigo: 'P01',
        descripcion: '',
        supuestos: '',
        riesgos: '',
      },
    ],
    indicadores: {
      objetivoGeneral: [],
      objetivoEspecifico: [],
      resultado: [],
      producto: [],
    },
    actividades: [],
    lineasAccion: [],
    modalIndicador: null,
  })

  /* ACCIONES */

  // Generación automática de códigos
  const generarCodigo = (tipo, index) => {
    const prefijos = {
      objetivoEspecifico: 'PSO',
      resultado: 'R',
      producto: 'P',
      actividad: 'ACT',
      indicador: 'IND',
    }
    //Formateando el numero a dos digitos
    const numero = (index + 1).toString().padStart(2, '0')
    return `${prefijos[tipo]}${numero}`
  }

  //Generar codigo de indicador basado en el tipo de componente
  const generarCodigoIndicador = (tipoComponente, index) => {
    const prefijos = {
      objetivoGeneral: 'IND-OG',
      objetivoEspecifico: 'IND-OE',
      resultado: 'IND-R',
      producto: 'IND-P',
    }
    const numero = (index + 1).toString().padStart(2, '0')
    return `${prefijos[tipoComponente]}${numero}`
  }
  // Plantilla base para nuevos indicadores
  const plantillaIndicador = (tipoComponente, tipoValor) => {
    const index = nuevoProyecto.indicadores[tipoComponente].length
    return {
      codigo: generarCodigoIndicador(tipoComponente, index),
      tipo: TIPOS_INDICADOR.SMART, // Por defecto SMART
      tipo_valor: tipoValor,
      redaccion: '',
      fuente_verificacion: '',
      target_poblacion: '',
      baseline: '',
      target_q1: '',
      target_q2: '',
      target_q3: '',
      target_q4: '',
      componente_id: null, // Se establecerá al vincular con el componente
    }
  }

  // Agregar indicador literal
  const addIndicadorLiteral = (tipoComponente) => {
    const nuevoIndicador = plantillaIndicador(tipoComponente, TIPOS_VALOR.LITERAL)
    nuevoProyecto.indicadores[tipoComponente].push(nuevoIndicador)
  }

  // Agregar indicador numérico
  const addIndicadorNumerico = (tipoComponente) => {
    const nuevoIndicador = plantillaIndicador(tipoComponente, TIPOS_VALOR.NUMERICO)
    nuevoProyecto.indicadores[tipoComponente].push(nuevoIndicador)
  }

  // Agregar indicador porcentual
  const addIndicadorPorcentual = (tipoComponente) => {
    const nuevoIndicador = plantillaIndicador(tipoComponente, TIPOS_VALOR.PORCENTUAL)
    nuevoProyecto.indicadores[tipoComponente].push(nuevoIndicador)
  }

  // Eliminar indicador
  const removeIndicador = (tipoComponente, index) => {
    if (index >= 0 && nuevoProyecto.indicadores[tipoComponente].length > 0) {
      nuevoProyecto.indicadores[tipoComponente].splice(index, 1)
      // Reindexar códigos
      nuevoProyecto.indicadores[tipoComponente].forEach((ind, idx) => {
        ind.codigo = generarCodigoIndicador(tipoComponente, idx)
      })
    }
  }

  // Vincular indicador a un componente (objetivo, resultado, producto)
  const vincularIndicador = (tipoComponente, indicadorIndex, componenteId) => {
    nuevoProyecto.indicadores[tipoComponente][indicadorIndex].componente_id = componenteId
  }

  // Agregar objetivo especifico
  const addObjetivoEspecifico = () => {
    const nuevoIndex = nuevoProyecto.objetivoEspecifico.length
    nuevoProyecto.objetivoEspecifico.push({
      codigo: generarCodigo('objetivoEspecifico', nuevoIndex),
      descripcion: '',
      supuestos: '',
      riesgos: '',
    })
  }

  // Eliminar objetivo especifico
  const removeObjetivoEspecifico = (index) => {
    if (index > 0 && nuevoProyecto.objetivoEspecifico.length > 1) {
      nuevoProyecto.objetivoEspecifico.splice(index, 1)
      // Reindexar códigos
      nuevoProyecto.objetivoEspecifico.forEach((obj, idx) => {
        obj.codigo = generarCodigo('objetivoEspecifico', idx)
      })
    }
  }

  // Agregar productos
  const addProducto = () => {
    const nuevoIndex = nuevoProyecto.productos.length
    nuevoProyecto.productos.push({
      codigo: generarCodigo('producto', nuevoIndex),
      descripcion: '',
      supuestos: '',
      riesgos: '',
    })
  }

  // Eliminar producto
  const removeProducto = (index) => {
    if (index >= 0 && nuevoProyecto.productos.length > 0) {
      nuevoProyecto.productos.splice(index, 1)
      // Reindexar códigos
      nuevoProyecto.productos.forEach((prod, idx) => {
        prod.codigo = generarCodigo('producto', idx)
      })
    }
  }

  // Agregar resultados
  const addResultado = () => {
    const nuevoIndex = nuevoProyecto.resultados.length
    nuevoProyecto.resultados.push({
      codigo: generarCodigo('resultado', nuevoIndex),
      descripcion: '',
      supuestos: '',
      riesgos: '',
    })
  }

  // Eliminar resultado
  const removeResultado = (index) => {
    if (index >= 0 && nuevoProyecto.resultados.length > 0) {
      nuevoProyecto.resultados.splice(index, 1)
      // Reindexar códigos
      nuevoProyecto.resultados.forEach((res, idx) => {
        res.codigo = generarCodigo('resultado', idx)
      })
    }
  }

  // Agregar actividad
  const addActividad = (tipoActividad) => {
    const nuevoIndex = nuevoProyecto.actividades.length
    nuevoProyecto.actividades.push({
      codigo: generarCodigo('actividad', nuevoIndex),
      tipo: tipoActividad,
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'PLAN', // Estado inicial: Planificado
    })
  }

  // Eliminar actividad
  const removeActividad = (index) => {
    if (index >= 0) {
      nuevoProyecto.actividades.splice(index, 1)
      // Reindexar códigos
      nuevoProyecto.actividades.forEach((act, idx) => {
        act.codigo = generarCodigo('actividad', idx)
      })
    }
  }

  // Validar proyecto antes de enviar
  const validarProyecto = () => {
    if (!nuevoProyecto.proyecto.titulo.trim()) {
      throw new Error('El título del proyecto es requerido')
    }
    if (!nuevoProyecto.proyecto.descripcion.trim()) {
      throw new Error('La descripción del proyecto es requerida')
    }
    if (!nuevoProyecto.objetivoGeneral[0].descripcion.trim()) {
      throw new Error('La descripción del objetivo general es requerida')
    }
    // Puedes agregar más validaciones según sea necesario
  }

  // Enviar Proyecto
  const enviarProyecto = async () => {
    cargando.value = true
    try {
      // Validar antes de enviar
      validarProyecto()

      // Formatear datos para API
      const proyectoParaEnviar = {
        ...nuevoProyecto.proyecto,
        objetivos: {
          general: nuevoProyecto.objetivoGeneral[0],
          especificos: nuevoProyecto.objetivoEspecifico,
        },
        resultados: nuevoProyecto.resultados,
        productos: nuevoProyecto.productos,
        indicadores: nuevoProyecto.indicadores,
        actividades: nuevoProyecto.actividades,
        lineasAccion: nuevoProyecto.lineasAccion,
      }

      console.log('Enviando proyecto:', proyectoParaEnviar)
      //const response = await post('/proyectos', proyectoParaEnviar)

      // Resetear después de enviar
      resetProyecto()

      //return response.data
    } catch (error) {
      console.error('Error al enviar el proyecto:', error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Reset proyecto
  const resetProyecto = () => {
    Object.assign(nuevoProyecto, {
      proyecto: {
        codigo: '',
        titulo: '',
        descripcion: '',
        fecha_creacion: new Date().toISOString().split('T')[0],
        fecha_inicio: '',
        fecha_finalizacion: '',
        instancia_gestora: '',
        registrado: '',
        estado: 'EST',
      },
      objetivoGeneral: [
        {
          codigo: 'POO',
          descripcion: '',
          supuestos: '',
          riesgos: '',
        },
      ],
      objetivoEspecifico: [
        {
          codigo: 'PSO1',
          descripcion: '',
          supuestos: '',
          riesgos: '',
        },
      ],
      resultados: [
        {
          codigo: 'R01',
          descripcion: '',
          supuestos: '',
          riesgos: '',
        },
      ],
      productos: [
        {
          codigo: 'P01',
          descripcion: '',
          supuestos: '',
          riesgos: '',
        },
      ],
      indicadores: {
        objetivoGeneral: [],
        objetivoEspecifico: [],
        resultado: [],
        producto: [],
      },
      actividades: [],
      lineasAccion: [],
    })
    pasoActual.value = 1
  }

  const abrirModalIndicador = (tipoComponente, indice = null, componentePadreIndex = null) => {
    nuevoProyecto.modalIndicador = {
      mode: indice !== null ? 'edit' : 'create',
      tipoComponente,
      indice,
      componentePadreIndex,
    }
  }

  const cerrarModalIndicador = () => {
    nuevoProyecto.modalIndicador = null
  }
  // Agregar nuevo indicador
  const agregarIndicador = async ({ componentePadreIndex, indicador }) => {
    try {
      const tipoComponente = indicador.tipoElementoRelacionado

      // Generar código si no viene (para nuevos indicadores)
      if (!indicador.codigo) {
        const index = nuevoProyecto.indicadores[tipoComponente].length
        indicador.codigo = generarCodigoIndicador(tipoComponente, index)
      }

      // Vincular con componente padre si se especificó
      if (componentePadreIndex !== null && tipoComponente) {
        const componente = getElementoRelacionado(tipoComponente, componentePadreIndex)
        indicador.componente_id = componente.codigo
      }

      // Estructurar el objeto indicador según el formato esperado
      const nuevoIndicador = {
        codigo: indicador.codigo,
        tipo: indicador.tipo || TIPOS_INDICADOR.SMART,
        tipo_valor: indicador.tipo_valor,
        redaccion: indicador.redaccion,
        fuente_verificacion: indicador.fuente_verificacion,
        target_poblacion: indicador.target_poblacion,
        baseline: indicador.baseline,
        target_q1: indicador.target_q1,
        target_q2: indicador.target_q2,
        target_q3: indicador.target_q3,
        target_q4: indicador.target_q4,
        componente_id: indicador.componente_id || null,
      }

      // Agregar al array correspondiente
      nuevoProyecto.indicadores[tipoComponente].push(nuevoIndicador)

      return true
    } catch (error) {
      console.error('Error agregando indicador:', error)
      throw error
    }
  }

  // Actualizar indicador existente
  const actualizarIndicador = async ({ componentePadreIndex, indicador, indiceIndicador }) => {
    try {
      const tipoComponente = indicador.tipoElementoRelacionado

      // Vincular con componente padre si se especificó
      if (componentePadreIndex !== null && tipoComponente) {
        const componente = getElementoRelacionado(tipoComponente, componentePadreIndex)
        indicador.componente_id = componente.codigo
      }

      // Estructurar el objeto indicador actualizado
      const indicadorActualizado = {
        codigo: indicador.codigo, // Mantener el código original
        tipo: indicador.tipo,
        tipo_valor: indicador.tipo_valor,
        redaccion: indicador.redaccion,
        fuente_verificacion: indicador.fuente_verificacion,
        target_poblacion: indicador.target_poblacion,
        baseline: indicador.baseline,
        target_q1: indicador.target_q1,
        target_q2: indicador.target_q2,
        target_q3: indicador.target_q3,
        target_q4: indicador.target_q4,
        componente_id: indicador.componente_id || null,
      }

      // Actualizar en el array correspondiente
      if (indiceIndicador !== null && indiceIndicador >= 0) {
        nuevoProyecto.indicadores[tipoComponente][indiceIndicador] = indicadorActualizado
        return true
      }

      return false
    } catch (error) {
      console.error('Error actualizando indicador:', error)
      throw error
    }
  }

  // Helper para obtener elemento relacionado
  const getElementoRelacionado = (tipo, index) => {
    const map = {
      objetivoGeneral: nuevoProyecto.objetivoGeneral,
      objetivoEspecifico: nuevoProyecto.objetivoEspecifico,
      resultado: nuevoProyecto.resultados,
      producto: nuevoProyecto.productos,
    }
    return map[tipo][index]
  }

  return {
    cargando,
    pasoActual,
    nuevoProyecto,
    TIPOS_INDICADOR,
    TIPOS_VALOR,
    addObjetivoEspecifico,
    removeObjetivoEspecifico,
    addProducto,
    removeProducto,
    addResultado,
    removeResultado,
    addActividad,
    removeActividad,
    enviarProyecto,
    resetProyecto,
    validarProyecto,
    //Indicadores
    addIndicadorLiteral,
    addIndicadorNumerico,
    addIndicadorPorcentual,
    removeIndicador,
    vincularIndicador,
    abrirModalIndicador,
    cerrarModalIndicador,
    agregarIndicador,
    actualizarIndicador,
  }
})
