import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useObjetivoGeneralProyecto } from '../../proyecto/composables/useObjetivoGeneralProyecto.js'
//import { Position } from '@vue-flow/core'

export const useNodosStore = defineStore('diagrama-proyecto', () => {
  //Estados del diagram
  const proyecto = ref(null)
  const nodos = ref([]) //nodos
  const edges = ref([]) //edges
  const cargando = ref(false) //Indicador de carga
  const error = ref(null) //Mensaje de error

  //Iniciar el composable
  const {
    objetivoGeneral,
    loading: loadingObjetivo,
    error: errorObjetivo,
    cargarObjetivoPorIdProyecto,
    addObjetivoGeneral,
  } = useObjetivoGeneralProyecto()

  //Nodos de los logs
  const log = () => {
    console.log('nodes', nodos.value, 'edges', edges.value)
  }

  //Actualizar la posicion del nodo
  const actualizarPosicionNodo = (id, nuevaPosicion) => {
    const nodo = nodos.value.find((n) => n.id === id)
    if (nodo) {
      nodo.position = { ...nuevaPosicion }
    }
  }

  //Actualizar el proyecto y crear el nodo
  const actualizarProyecto = (proyectoData) => {
    proyecto.value = proyectoData
    crearNodoProyecto(proyectoData)
  }

  //Crear el nodo del proyecto
  const crearNodoProyecto = (proyectoData) => {
    const nodoProyecto = {
      id: 'nodo-proyecto-principal',
      type: 'input', // Nodo estándar input
      label: `Proyecto: ${proyectoData.titulo} (${proyectoData.codigo})`, // Info en el label
      position: { x: 400, y: 50 },
      deletable: false,
      data: {
        tipo: 'proyecto',
        idProyecto: proyectoData.id,
        codigo: proyectoData.codigo,
        titulo: proyectoData.titulo,
        tieneObjGral: [],
        tieneObjEspecificos: [],
      },
    }
    // Eliminar nodo existente si hay uno
    nodos.value = nodos.value.filter((n) => n.id !== 'nodo-proyecto-principal')
    nodos.value.push(nodoProyecto)
  }

  //Verificar si existe un nodo Objetivo General
  // Función para verificar si ya existe un objetivo general
  const existeObjetivoGeneral = () => {
    return nodos.value.some((nodo) => nodo.data?.tipo === 'objetivoGeneral')
  }
  //Crear el nodo objetivo General
  const crearObjetivoGeneral = async (objetivoData) => {
    try {
      if (existeObjetivoGeneral()) {
        throw new Error('Ya existe un objetivo General')
      }
      //Peticion al rest api
      cargando.value = true
      error.value = null

      //Datos del objetivo
      const data = {
        ...objetivoData,
        proyecto: proyecto.value.id,
      }

      await addObjetivoGeneral(data)

      //Comprobacion que se creo el objetivo
      if (errorObjetivo.value) {
        throw errorObjetivo.value
      }

      //Crear el nodo
      // 4. Crear el nodo tipo default si la creación fue exitosa
      const nodoObjetivoGeneral = {
        id: `objetivo-general-${objetivoGeneral.value.id}`,
        type: 'default',
        label: `Objetivo General: ${objetivoGeneral.value.codigo}`,
        position: { x: 400, y: 150 },
        data: {
          tipo: 'objetivoGeneral',
          idObjetivo: objetivoGeneral.value.id,
          codigo: objetivoGeneral.value.codigo,
          descripcion: objetivoGeneral.value.descripcion,
        },
      }

      //Actualizar el store
      nodos.value.push(nodoObjetivoGeneral)

      //Conexion con el nodo proyecto
      const nuevaEdge = {
        id: `edge-proyecto-objgeneral-${objetivoGeneral.value.id}`,
        source: 'nodo-proyecto-principal',
        target: `objetivo-general-${objetivoGeneral.value.id}`,
      }

      edges.value.push(nuevaEdge)

      //Sentencia para debugg
      console.log('Store: Crear objetivo general')
      console.log('PROYECTO: ')
      console.log(proyecto.value.id)
      console.log('Objetivo General: ')
      console.log(data)
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }

  // Función para cargar objetivo existente
  const cargarObjetivoGeneralExistente = async () => {
    try {
      if (!proyecto.value?.id) return

      cargando.value = true
      await cargarObjetivoPorIdProyecto(proyecto.value.id)

      if (objetivoGeneral.value && !existeObjetivoGeneral()) {
        const nodoObjetivoGeneral = {
          id: `objetivo-general-${objetivoGeneral.value.id}`,
          type: 'default',
          label: `Objetivo General: ${objetivoGeneral.value.codigo}`,
          position: { x: 400, y: 150 },
          data: {
            tipo: 'objetivoGeneral',
            idObjetivo: objetivoGeneral.value.id,
            codigo: objetivoGeneral.value.codigo,
            descripcion: objetivoGeneral.value.descripcion,
          },
        }

        nodos.value.push(nodoObjetivoGeneral)

        const nuevaEdge = {
          id: `edge-proyecto-objgeneral-${objetivoGeneral.value.id}`,
          source: 'nodo-proyecto-principal',
          target: `objetivo-general-${objetivoGeneral.value.id}`,
        }
        edges.value.push(nuevaEdge)

        const nodoProyecto = nodos.value.find((n) => n.id === 'nodo-proyecto-principal')
        if (nodoProyecto) {
          nodoProyecto.data.tieneObjGral.push(objetivoGeneral.value.id)
        }
      }
    } catch (err) {
      error.value = err.message
    } finally {
      cargando.value = false
    }
  }

  return {
    nodos, //nodos
    edges, //edges
    cargando, //bandera de carga
    error, //error
    log, //Funcion
    actualizarPosicionNodo, //Funcion
    actualizarProyecto, //Funcion
    crearObjetivoGeneral, //Funcion
    cargarObjetivoGeneralExistente, //funcion
  }
})
