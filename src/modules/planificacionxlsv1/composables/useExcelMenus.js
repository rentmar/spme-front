// composables/useExcelMenus.js
import { computed, inject, ref } from 'vue'

export function useExcelMenus({
  data,
  selectedRowData,
  showAside,
  asideMode,
  addRow,
  addTarea,
  verTareasDeActividad,
  deleteTarea,
  disableTarea,
} = {}) {
  // Inyectar tablaDataTareas
  const tablaDataTareas = inject('tablaDataTareas', ref([]))
  console.log('tablaDataTareas inyectado:', tablaDataTareas.value)

  const menuArchivo = [
    {
      type: 'item',
      title: 'Guardar Planificación',
      icon: 'mdi-content-save',
      action: 'guardar',
      shortcut: 'Ctrl+G',
    },
    { type: 'item', title: 'Importar Actividades', icon: 'mdi-file-import', action: 'importar' },
    { type: 'item', title: 'Exportar Excel', icon: 'mdi-microsoft-excel', action: 'exportarExcel' },
    { type: 'item', title: 'Exportar PDF', icon: 'mdi-file-pdf-box', action: 'exportarPDF' },
    { type: 'divider' },
    { type: 'item', title: 'Cerrar', icon: 'mdi-close', action: 'cerrar' },
  ]

  const menuEditar = [
    {
      type: 'item',
      title: 'Agregar Actividad',
      icon: 'mdi-plus-box',
      action: 'addRow',
      shortcut: 'Ctrl+N',
    },
    {
      type: 'item',
      title: 'Agregar Subactividad',
      icon: 'mdi-plus-circle',
      action: 'agregarTarea',
    },
    { type: 'item', title: 'Duplicar Fila', icon: 'mdi-content-duplicate', action: 'duplicarFila' },
    { type: 'divider' },
    {
      type: 'item',
      title: 'Eliminar Actividad',
      icon: 'mdi-delete',
      action: 'eliminarActividad',
      shortcut: 'Supr',
    },
    {
      type: 'item',
      title: 'Deshabilitar/Habilitar',
      icon: 'mdi-eye-off',
      action: 'toggleActividad',
    },
    { type: 'divider' },
    {
      type: 'item',
      title: 'Ajustar Presupuesto',
      icon: 'mdi-cash-edit',
      action: 'ajustarPresupuesto',
    },
    { type: 'item', title: 'Buscar', icon: 'mdi-magnify', action: 'buscar', shortcut: 'Ctrl+B' },
  ]

  const menuVer = [
    {
      type: 'item',
      title: 'Panel de Tareas',
      icon: 'mdi-view-agenda',
      action: 'toggleAside',
      arg: 'tareas',
    },
    {
      type: 'item',
      title: 'Explorador',
      icon: 'mdi-file-tree',
      action: 'toggleAside',
      arg: 'explorador',
    },
    {
      type: 'item',
      title: 'Presupuesto',
      icon: 'mdi-cash-multiple',
      action: 'toggleAside',
      arg: 'presupuesto',
    },
    { type: 'item', title: 'Resumen', icon: 'mdi-finance', action: 'toggleAside', arg: 'resumen' },
    { type: 'divider' },
    {
      type: 'item',
      title: 'Estructura PEI',
      icon: 'mdi-chart-tree',
      action: 'toggleAside',
      arg: 'estructura',
    },
  ]

  const ejecutarAccion = (action, arg) => {
    const acciones = {
      guardar: () => {},
      addRow: () => addRow?.(),
      agregarTarea: () => addTarea?.(),
      toggleAside: (mode) => {
        if (showAside?.value && asideMode?.value === mode) {
          showAside.value = false
        } else {
          if (asideMode) asideMode.value = mode
          if (showAside) showAside.value = true
        }
      },
      eliminarActividad: () => {
        if (!selectedRowData?.value) return
        const idx = data?.value.findIndex((r) => r.id === selectedRowData.value.id)
        if (idx > -1) {
          data.value.splice(idx, 1)
          selectedRowData.value = null
        }
      },
      toggleActividad: () => {
        if (!selectedRowData?.value) return
        const idx = data?.value.findIndex((r) => r.id === selectedRowData.value.id)
        if (idx > -1) {
          data.value[idx].estado = data.value[idx].estado === 'DES' ? 'PLAN' : 'DES'
        }
      },
      duplicarFila: () => {
        if (!selectedRowData?.value) return
        const newId = Math.max(...data.value.map((r) => r.id)) + 1
        data.value.push({ ...selectedRowData.value, id: newId, codigo: '', esNueva: true })
      },
    }
    if (acciones[action]) acciones[action](arg)
  }

  const contextMenuConfig = computed(() => [
    {
      key: 'verTareas',
      name: '📋 Ver Subactividades',
      callback: () => verTareasDeActividad?.(),
      disabled: () => !selectedRowData?.value,
    },
    '---------',
    {
      key: 'agregar',
      name: '➕ Agregar Actividad',
      callback: () => addRow?.(),
    },
    {
      key: 'eliminar',
      name: '🗑️ Eliminar',
      callback: () => ejecutarAccion('eliminarActividad'),
      disabled: () => !selectedRowData?.value,
    },
  ])

  // MENÚ CONTEXTUAL TAREAS
  const contextMenuConfigTareas = {
    items: {
      add_tarea: {
        name: '➕ Agregar Subactividad',
        callback: () => addTarea?.(),
      },
      remove_tarea: {
        name: '🗑️ Eliminar',
        callback: () => {
          const row = selectedRowData?.value
          if (!row) return

          console.log('Buscando row:', row)

          // Buscar por id o por coincidencia de múltiples campos
          const index = tablaDataTareas.value.findIndex((r) => {
            if (row.id && r.id === row.id) return true
            if (row.codigo && r.codigo === row.codigo) return true
            if (row.titulo && r.titulo === row.titulo && r.actividad === row.actividad) return true
            return false
          })

          console.log('index:', index)
          if (index === -1) return
          deleteTarea(index)
        },
        disabled: () => !selectedRowData?.value,
      },
      '---------': { name: '---------' },
      copy: {},
    },
  }
  return {
    menuArchivo,
    menuEditar,
    menuVer,
    contextMenuConfig,
    contextMenuConfigTareas,
    ejecutarAccion,
  }
}
