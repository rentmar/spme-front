// composables/useNodeEvents.js

import { ref } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { useDiagramaCrud } from './useDiagramaCrud'
import { useIdGenerator } from './useIdGenerator'

export default function useNodeEvents() {
  //Iniciar el composable
  const { addNodes, addEdges, getNodes, getEdges } = useVueFlow()
  const { getNextNodeId, getNextEdgeId } = useIdGenerator()
  const { actualizarNodosEdges } = useDiagramaCrud()
  const mensaje = ref('No se ha recibido señal')

  //Manejador generico para creacion de nodos
  const handleNodeCreation = async (type, label, sourceId, customData = {}) => {
    const nuevoNodoId = getNextNodeId()
    const nuevaEdgeId = getNextEdgeId()
    const nuevoNodo = {
      id: nuevoNodoId,
      data: { label, type, ...customData },
      position: { x: 0, y: 0 },
      type,
    }
    const nuevaEdge = {
      id: nuevaEdgeId,
      source: sourceId.toString(),
      target: nuevoNodoId,
      animated: true,
      label: 'Conexion',
    }
    addNodes([nuevoNodo])
    addEdges([nuevaEdge])

    //Actualizar diagramas y nodos en la rest api
    try {
      await actualizarNodosEdges(customData.mapaNodoId, getNodes.value, getEdges.value)
    } catch (err) {
      console.log(
        'NODE EVENTS: No se pudo actualizaar el diagrama id: ' + customData.mapaNodoId,
        err,
      )
    }

    return nuevoNodo, nuevaEdge
  }

  //Manejadores para cada tipo de nodo
  const nodeEventoHandlers = {
    /* Agregar Objetivo General */
    addObjetivoGeneral: (payload) => {
      //Verificar si ya existe un objetivo general
      const nodosActuales = getNodes.value
      const existeObjetivoGeneral = nodosActuales.some((nodo) => nodo.type === 'objetivogeneral')
      if (existeObjetivoGeneral) {
        mensaje.value = 'Ya existe un objetivo General'
        return null
      }
      const result = handleNodeCreation(
        'objetivogeneral',
        'Objetivo General',
        payload.sourceId,
        payload.meta,
      )
      mensaje.value = 'Objetivo General Creado'
      return result
    },
    /* Agregar Objetivo Especifico */
    addObjetivoEspecifico: (payload) => {
      const result = handleNodeCreation(
        'objetivoespecifico',
        'Objetivo Especifico',
        payload.sourceId,
        payload.meta,
      )
      mensaje.value = 'Objetivo Especifico Creado'
      return result
    },
    /*Agregar KPI*/
    addKpi: (payload) => {
      const result = handleNodeCreation('kpi', 'KPI', payload.sourceId, payload.meta)
      mensaje.value = 'KPI Creado'
      return result
    },
    /* Agregar Indicador Objetivo General*/
    addIndicadorObjGeneral: (payload) => {
      const result = handleNodeCreation(
        'indicadorog',
        'Indicador Objetivo General',
        payload.sourceId,
        payload.meta,
      )
      mensaje.value = 'Indicador Obj Gral creado'
      return result
    },
    /* Agregar Resultado Objetivo General*/
    addResultadoObjGeneral: (payload) => {
      const result = handleNodeCreation(
        'resultadoog',
        'Resultado Objetivo General',
        payload.sourceId,
        payload.meta,
      )
      mensaje.value = 'Resultado Obj Gral creado'
      return result
    },
    /* Agregar Indicador Resultado OG  */
    addIndicadorResultadoOg: (payload) => {
      console.log('Agregar Indicador Resultado OG ')
      console.log(payload)
      const result = handleNodeCreation(
        'indicadorrog',
        'Indicador Res OG',
        payload.sourceId,
        payload.meta,
      )
      mensaje.value = 'Indicador Resultado OG'
      return result
    },
    /* Agregar Indicador Objetivo Especifico */
    addIndicadorOE: (payload) => {
      const result = handleNodeCreation(
        'indicadoroe',
        'Indicador OE',
        payload.sourceId,
        payload.meta,
      )
      mensaje.value = 'Indicador OE creado'
      return result
    },
    /* Agregar Resultado OE */
    addResultadoOE: (payload) => {
      const result = handleNodeCreation(
        'resultadooe',
        'Resultado OE',
        payload.sourceId,
        payload.meta,
      )
      mensaje.value = 'Resultado OE creado'
      return result
    },
    /* Agregar Producto OE */
    addProductoOE: (payload) => {
      const result = handleNodeCreation('productooe', 'Producto OE', payload.sourceId, payload.meta)
      mensaje.value = 'Producto OE creado'
      return result
    },
    /* Agregar Resultado OE */
    addIndicadorResultadoOE: (payload) => {
      const result = handleNodeCreation(
        'indicadorroe',
        'Indicador Res. OE',
        payload.sourceId,
        payload.meta,
      )
      mensaje.value = 'Indicador de Resultado OE creado'
      return result
    },
    /* Agregar Producto Resultado OE */
    addProductoResultadoOE: (payload) => {
      const result = handleNodeCreation(
        'productoroe',
        'Producto Res. OE',
        payload.sourceId,
        payload.meta,
      )
      mensaje.value = 'Indicador de Resultado OE creado'
      return result
    },
    /* Agregar Procesos Resultado OE */
    addProcesosResultadoOE: (payload) => {
      const result = handleNodeCreation(
        'procesoroe',
        'Procesos Res. OE',
        payload.sourceId,
        payload.meta,
      )
      mensaje.value = 'Indicador de Resultado OE creado'
      return result
    },
  }

  //Funcion principal para ejecutar acciones
  const executeAccion = (eventName, payload = {}) => {
    if (nodeEventoHandlers[eventName]) {
      return nodeEventoHandlers[eventName](payload)
    }
    console.warn(`Manejador para el evento ${eventName} no encontrado`)
    return null
  }

  return { mensaje, executeAccion }
}
