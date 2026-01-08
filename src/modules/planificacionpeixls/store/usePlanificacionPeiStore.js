import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { peiServicios } from '@/modules/pei/services/peiService'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { useTipoActividad } from '@/modules/proyecto/composables/useTipoActividad'

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

  //Iniciar composables
  const { usuarios, obtenerUsuarios } = useUsuario()
  const { cargarActividadesPorIdPei, actividadesPei: actividades } = useActividad()
  const { tipoDeActividades, cargarListaTiposActividades } = useTipoActividad()

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

  return {
    //Estados
    loading,
    error,
    peiSeleccionado,
    actividadesPeiSeleccionado,
    estructuraPeiSeleccionado,
    listaActividades,
    listaTiposAct,
    tableData,
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
    //Getter
    hayCambiosPendientes,
  }
})
