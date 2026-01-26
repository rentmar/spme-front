import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { peiServicios } from '@/modules/pei/services/peiService'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
//import { useTareaSubactividad } from '@/modules/proyecto/composables/useTareaSubactividad'
import { useTipoActividad } from '@/modules/proyecto/composables/useTipoActividad'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { useSeguimientoPlanificacionPei } from '../composables/useSeguimientoPlanificacionPei'

export const usePlanificacionPeiStore = defineStore('planificacion-pei', () => {
  //Estados del Store
  const loading = ref(true)
  const error = ref(false)
  const listaActividades = ref([])
  const listaUsuariosCompleta = ref([])
  const listaTiposAct = ref([])
  //Estado del Grill
  const tableData = ref([])
  const datosOriginales = ref([])
  const tieneCambiosSinGuardar = ref(false)

  const peiSeleccionado = ref(null)
  const actividadesPeiSeleccionado = ref([])
  const estructuraPeiSeleccionado = ref()

  //Estado planificacion/seguimiento del Pei
  const ultimaPlanificacionPei = ref(null)
  const registrosPlanificacionesPei = ref([])

  //Iniciar composables
  const { usuarios, obtenerUsuarios } = useUsuario()
  const { cargarActividadesPorIdPei, actividadesPei: actividades } = useActividad()
  const { tipoDeActividades, cargarListaTiposActividades } = useTipoActividad()
  const { listaSeguimientoPlanificacionPei, obtenerListaSeguimientoPlanificacionPei } =
    useSeguimientoPlanificacionPei()

  //Accion: Inicializar los datos Orginales
  function inicializarDatosOriginales(tableData) {
    datosOriginales.value = tableData
    tieneCambiosSinGuardar.value = false
  }

  //Cambiar el estado de la bandera de cambios
  function setTieneCambiosSinGuardar(valor) {
    tieneCambiosSinGuardar.value = valor
  }

  //Actualizar los datos originales
  function actualizarDatosOriginales(datos) {
    datosOriginales.value = datos
    tieneCambiosSinGuardar.value = false
  }

  //Verificar los cambios entre el original y el actual
  function verificarCambios(datosActuales) {
    if (!datosOriginales.value.length || !datosActuales.length) {
      tieneCambiosSinGuardar.value = false
      return false
    }

    const actualStr = JSON.stringify(datosActuales)
    const originalStr = JSON.stringify(datosOriginales.value)

    const hayCambios = actualStr !== originalStr
    tieneCambiosSinGuardar.value = hayCambios
    return hayCambios
  }

  //Reset bandera de  cambios
  function resetearCambios() {
    tieneCambiosSinGuardar.value = false
  }

  //Filtrar actividades activas
  function filtrarActividadesActivas(listaActividades) {
    if (!listaActividades || !Array.isArray(listaActividades)) {
      return []
    }

    return listaActividades
      .map((item) => item.value || item)
      .filter((actividad) => actividad && !actividad.estaInactiva)
  }

  //Getter
  //Verificacion de los cambios
  const hayCambiosPendientes = computed(() => tieneCambiosSinGuardar.value)

  //Cargar la informacion del Pei por Id
  const obtenerPeiPorId = async (id) => {
    loading.value = true
    try {
      peiSeleccionado.value = await peiServicios.obtenerPorId(id)
      const respuesta = await peiServicios.obtenerEstructuraPeiPorId(id)
      estructuraPeiSeleccionado.value = respuesta || ''
      const respuestaActividad = await peiServicios.obtenerActividadesPeiPorId(id)
      actividadesPeiSeleccionado.value = respuestaActividad?.actividades || ''
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Computed para obtener usernames para el dropdown
  const usernamesParaDropdown = computed(() => {
    if (!listaUsuariosCompleta.value.length) {
      return ['Cargando usuarios...'] // Valor temporal mientras se cargan
    }

    return listaUsuariosCompleta.value
      .filter((user) => user.is_active !== false) // Solo usuarios activos
      .map((user) => user.username) // Extraer usernames
      .filter((username) => username) // Filtrar valores nulos o vacíos
      .sort() // Ordenar alfabéticamente
  })

  /************************* FUNCIONES ****************************************/
  //Obtener la lista completa de usuarios
  async function obtenerListaUsuarios() {
    try {
      loading.value = true
      await obtenerUsuarios()
      listaUsuariosCompleta.value = usuarios.value || []
      return usuarios.value
    } catch (error) {
      console.error('Error al obtener usuarios', error)
      error.value = true
      return []
    } finally {
      loading.value = false
    }
  }

  //Obtener la lista de actividades de un pei
  async function listaActividadesPei(idpei) {
    try {
      loading.value = true
      await cargarActividadesPorIdPei(idpei)
      listaActividades.value = actividades.value
      //Solo cargar actividades activas a la grilla
      tableData.value = filtrarActividadesActivas(actividades.value)
    } catch (error) {
      console.error('Error al cargar actividades', error)
      error.value = true
      return []
    } finally {
      loading.value = false
    }
  }

  //Obtener la lista de Tipos de Actividad
  async function listaTiposDeActividad() {
    try {
      loading.value = true
      await cargarListaTiposActividades()
      listaTiposAct.value = tipoDeActividades.value
    } catch (error) {
      console.error(error)
      error.value = true
    } finally {
      loading.value = false
    }
  }

  // Función mejorada que verifica múltiples campos de fecha
  function extraerUltimaPlanificacionCompleta() {
    try {
      // Verificar si hay registros
      if (
        !registrosPlanificacionesPei.value ||
        !registrosPlanificacionesPei.value.registros ||
        !Array.isArray(registrosPlanificacionesPei.value.registros) ||
        registrosPlanificacionesPei.value.registros.length === 0
      ) {
        console.warn('No hay registros de planificación disponibles')
        ultimaPlanificacionPei.value = null
        return null
      }

      const registros = registrosPlanificacionesPei.value.registros

      // Función para convertir fecha a timestamp
      const obtenerTimestamp = (registro) => {
        // Prioridad 1: actualizado_el (si está disponible)
        if (registro.actualizado_el) {
          return new Date(registro.actualizado_el).getTime()
        }
        // Prioridad 2: creado_el
        if (registro.creado_el) {
          return new Date(registro.creado_el).getTime()
        }
        // Prioridad 3: versión (numérica)
        return registro.version * 10000000000 // Multiplicar para asegurar orden temporal
      }

      // Encontrar el registro con la fecha más reciente
      let registroMasReciente = registros[0]
      let maxTimestamp = obtenerTimestamp(registroMasReciente)

      for (let i = 1; i < registros.length; i++) {
        const registro = registros[i]
        const timestamp = obtenerTimestamp(registro)

        if (timestamp > maxTimestamp) {
          maxTimestamp = timestamp
          registroMasReciente = registro
        }
      }

      // Asignar al estado
      ultimaPlanificacionPei.value = registroMasReciente

      console.log('Última planificación encontrada:', {
        id: registroMasReciente.id,
        version: registroMasReciente.version,
        fecha_creacion: registroMasReciente.creado_el,
        fecha_actualizacion: registroMasReciente.actualizado_el,
        timestamp: maxTimestamp,
      })

      return registroMasReciente
    } catch (error) {
      console.error('Error al extraer la última planificación:', error)
      ultimaPlanificacionPei.value = null
      return null
    }
  }

  //Obtener la lista de planificacion seguimiento
  async function listaPlanificacionSeguimietoPei(idpei) {
    loading.value = true
    try {
      await obtenerListaSeguimientoPlanificacionPei(idpei)
      registrosPlanificacionesPei.value = listaSeguimientoPlanificacionPei.value
      // Extraer automáticamente la última planificación
      extraerUltimaPlanificacionCompleta()
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados
    loading,
    error,
    peiSeleccionado,
    actividadesPeiSeleccionado,
    estructuraPeiSeleccionado,
    listaActividades,
    listaTiposAct,
    listaUsuariosCompleta,
    datosOriginales,
    tableData,
    tieneCambiosSinGuardar,
    registrosPlanificacionesPei,
    ultimaPlanificacionPei,
    //Getter
    usernamesParaDropdown,
    //Func
    obtenerPeiPorId,
    obtenerListaUsuarios,
    listaActividadesPei,
    //Acciones
    inicializarDatosOriginales,
    setTieneCambiosSinGuardar,
    actualizarDatosOriginales,
    verificarCambios,
    resetearCambios,
    listaTiposDeActividad,
    listaPlanificacionSeguimietoPei,
    //Getter
    hayCambiosPendientes,
  }
})
