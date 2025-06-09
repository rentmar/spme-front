// composables/useNodeEvents.js

import { ref } from 'vue'
import { useVueFlow } from '@vue-flow/core'

export default function useNodeEvents() {
  //Iniciar el composable
  const { addNodes, addEdges } = useVueFlow()
  const mensaje = ref('No se ha recibido señal')
  let idContador = ref(2)

  //Manejador generico para creacion de nodos
  const handleNodeCreation = (type, label, sourceId, customData = {}) => {
    const nuevoNodoId = idContador.value.toString()

    const nuevoNodo = {
      id: nuevoNodoId,
      data: { label, type, ...customData },
      position: { x: 0, y: 0 },
      type,
    }
    const nuevaEdge = {
      id: 'edge-' + sourceId + '-' + nuevoNodoId,
      source: sourceId.toString(),
      target: nuevoNodoId,
      animated: true,
      label: 'Conexion',
    }

    idContador.value++

    addNodes([nuevoNodo])
    addEdges([nuevaEdge])

    return nuevoNodo, nuevaEdge
  }

  //Manejadores para cada tipo de nodo
  const nodeEventoHandlers = {
    /* Agregar Objetivo General */
    addObjetivoGeneral: (payload) => {
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
    /* Agregar Indicador Objetivo General*/
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
    /* */
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
    /* */
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
    /* */
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
