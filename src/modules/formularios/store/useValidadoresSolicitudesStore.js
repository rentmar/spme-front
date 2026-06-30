// Store useValidadoresSolicitudesStore.js
// Responsables seleccionables
// Listas completas
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

export const useValidadoresSolicitudesStore = defineStore('validadores-solicitudes', () => {
  // Estados de carga
  const loading = ref(false)
  const error = ref(null)

  // Acceder al store de usuarios
  const userStore = useUserStore()

  // Lista completa de usuarios
  const listaUsuarios = computed(() => {
    return userStore.listaDeUsuarioCompleta || []
  })

  // ===== COMPUTED POR CARGO =====

  // Administradores
  const administradores = computed(() => {
    return listaUsuarios.value.filter((u) => u.cargo === 'admin') || []
  })

  // Técnicos
  const tecnicos = computed(() => {
    return listaUsuarios.value.filter((u) => u.cargo === 'tecnico') || []
  })

  // Coordinadores
  const coordinadores = computed(() => {
    return listaUsuarios.value.filter((u) => u.cargo === 'coordinador') || []
  })

  // Directores Administrativos
  const directoresAdministrativos = computed(() => {
    return listaUsuarios.value.filter((u) => u.cargo === 'dir-administrativo') || []
  })

  // Directores Ejecutivos
  const directoresEjecutivos = computed(() => {
    return (
      listaUsuarios.value.filter(
        (u) => u.cargo === 'Directora Ejecutiva' || u.cargo === 'Director Ejecutivo',
      ) || []
    )
  })

  // Contables
  const contables = computed(() => {
    return listaUsuarios.value.filter((u) => u.cargo === 'contable') || []
  })

  // Administradores de Sistema
  const administradoresSistema = computed(() => {
    return listaUsuarios.value.filter((u) => u.cargo === 'adminsis') || []
  })

  // ===== COMPUTED AGRUPADOS PARA VALIDADORES =====

  // Responsables de Coordinación (coordinadores)
  const responsablesCoordinacion = computed(() => {
    return coordinadores.value
  })

  // Responsables de Dirección Administrativa
  const responsablesDireccionAdministrativa = computed(() => {
    return [
      ...directoresAdministrativos.value,
      ...directoresEjecutivos.value,
      ...administradores.value,
    ]
  })

  // Todos los validadores posibles
  const todosLosValidadores = computed(() => {
    return [
      ...coordinadores.value,
      ...directoresAdministrativos.value,
      ...directoresEjecutivos.value,
      ...administradores.value,
      ...contables.value,
    ]
  })

  // ===== COMPUTED DE CONTEO =====

  const totalUsuarios = computed(() => listaUsuarios.value.length)
  const totalAdministradores = computed(() => administradores.value.length)
  const totalTecnicos = computed(() => tecnicos.value.length)
  const totalCoordinadores = computed(() => coordinadores.value.length)
  const totalDirectoresAdministrativos = computed(() => directoresAdministrativos.value.length)
  const totalDirectoresEjecutivos = computed(() => directoresEjecutivos.value.length)
  const totalContables = computed(() => contables.value.length)

  return {
    // Estados de carga
    loading,
    error,

    // Lista completa
    listaUsuarios,

    // Computed por cargo
    administradores,
    tecnicos,
    coordinadores,
    directoresAdministrativos,
    directoresEjecutivos,
    contables,
    administradoresSistema,

    // Computed agrupados para validadores
    responsablesCoordinacion,
    responsablesDireccionAdministrativa,
    todosLosValidadores,

    // Conteos
    totalUsuarios,
    totalAdministradores,
    totalTecnicos,
    totalCoordinadores,
    totalDirectoresAdministrativos,
    totalDirectoresEjecutivos,
    totalContables,
  }
})
