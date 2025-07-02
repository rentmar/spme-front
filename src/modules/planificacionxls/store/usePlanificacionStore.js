import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { proyectoServicios } from '@/modules/proyecto/services/proyectoService'
import { peiServicios } from '@/modules/pei/services/peiService'

export const usePlanificacionStore = defineStore('planificacion', () => {
  // Estado
  const conteosProyecto = ref(null)
  const peiEstructura = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters computados
  const tableData = computed(() => {
    if (!conteosProyecto.value) return [{}]

    return [
      {
        objetivo_general: conteosProyecto.value.objetivo_general || 0,
        indicador_og: conteosProyecto.value.indicador_objetivo_general || 0,
        producto_og: conteosProyecto.value.producto_objetivo_general || 0,
        indicador_producto_og: conteosProyecto.value.indicador_producto_objetivo_general || 0,
        objetivo_especifico:
          (conteosProyecto.value.objetivo_especifico_og || 0) +
          (conteosProyecto.value.objetivo_especifico_proyecto || 0),
        indicador_oe:
          (conteosProyecto.value.indicador_objetivo_especifico_og || 0) +
          (conteosProyecto.value.indicador_objetivo_especifico_proyecto || 0),
        producto_oe:
          (conteosProyecto.value.producto_objetivo_especifico_og || 0) +
          (conteosProyecto.value.producto_objetivo_especifico_proyecto || 0),
        indicador_producto_oe:
          (conteosProyecto.value.indicador_producto_objetivo_especifico_og || 0) +
          (conteosProyecto.value.indicador_producto_objetivo_especifico_proyecto || 0),
        resultado_oe:
          (conteosProyecto.value.resultado_objetivo_especifico_og || 0) +
          (conteosProyecto.value.resultado_objetivo_especifico_proyecto || 0),
        indicador_resultado_oe:
          (conteosProyecto.value.indicador_resultado_objetivo_especifico_og || 0) +
          (conteosProyecto.value.indicador_resultado_objetivo_especifico_proyecto || 0),
      },
    ]
  })

  const dynamicColumns = computed(() => {
    if (!conteosProyecto.value) return []

    const columnsConfig = [
      {
        key: 'objetivo_general',
        header: 'OBJETIVO GENERAL',
        active: conteosProyecto.value.objetivo_general > 0,
      },
      {
        key: 'indicador_og',
        header: 'INDICADOR OG',
        active: conteosProyecto.value.indicador_objetivo_general > 0,
      },
      {
        key: 'producto_og',
        header: 'PRODUCTO OG',
        active: conteosProyecto.value.producto_objetivo_general > 0,
      },
      {
        key: 'indicador_producto_og',
        header: 'INDICADOR PRODUCTO OG',
        active: conteosProyecto.value.indicador_producto_objetivo_general > 0,
      },
      {
        key: 'objetivo_especifico',
        header: 'OBJETIVO ESPECIFICO',
        active:
          conteosProyecto.value.objetivo_especifico_og +
            conteosProyecto.value.objetivo_especifico_proyecto >
          0,
      },
      {
        key: 'indicador_oe',
        header: 'INDICADOR OE',
        active:
          conteosProyecto.value.indicador_objetivo_especifico_og +
            conteosProyecto.value.indicador_objetivo_especifico_proyecto >
          0,
      },
      {
        key: 'producto_oe',
        header: 'PRODUCTO OE',
        active:
          conteosProyecto.value.producto_objetivo_especifico_og +
            conteosProyecto.value.producto_objetivo_especifico_proyecto >
          0,
      },
      {
        key: 'indicador_producto_oe',
        header: 'INDICADOR PRODUCTO OE',
        active:
          conteosProyecto.value.indicador_producto_objetivo_especifico_og +
            conteosProyecto.value.indicador_producto_objetivo_especifico_proyecto >
          0,
      },
      {
        key: 'resultado_oe',
        header: 'RESULTADO OE',
        active:
          conteosProyecto.value.resultado_objetivo_especifico_og +
            conteosProyecto.value.resultado_objetivo_especifico_proyecto >
          0,
      },
      {
        key: 'indicador_resultado_oe',
        header: 'INDICADOR RESULTADO OE',
        active:
          conteosProyecto.value.indicador_resultado_objetivo_especifico_og +
            conteosProyecto.value.indicador_resultado_objetivo_especifico_proyecto >
          0,
      },
    ]

    return columnsConfig.filter((col) => col.active)
  })

  const hotColumns = computed(() => {
    return dynamicColumns.value.map((col) => ({
      data: col.key,
      type: 'numeric',
      readOnly: true,
    }))
  })

  const hotHeaders = computed(() => {
    return dynamicColumns.value.map((col) => col.header)
  })

  // Acciones
  const obtenerConteosProyecto = async (proyectoId) => {
    loading.value = true
    error.value = null
    try {
      const response = await proyectoServicios.getConteosPorId(proyectoId)
      conteosProyecto.value = response
    } catch (err) {
      error.value = 'Error al cargar los conteos del proyecto'
      console.error('Error en obtenerConteosProyecto:', err)
    } finally {
      loading.value = false
    }
  }

  const obtenerEstructuraPeiPorID = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await peiServicios.getEstructuraPorId(id)
      peiEstructura.value = response
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    peiEstructura,
    conteosProyecto,
    loading,
    error,

    // Getters
    tableData,
    hotColumns,
    hotHeaders,

    // Acciones
    obtenerConteosProyecto,
    obtenerEstructuraPeiPorID,
  }
})
