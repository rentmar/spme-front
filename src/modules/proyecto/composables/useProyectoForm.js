//COmposer useProyectoForm.js

import { ref } from 'vue'

export function useProyectoForm(initial = null) {
  // Valores iniciales para creación
  const form = ref({
    codigo: '',
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_finalizacion: '',
    presupuesto: null,
    estado: 'ES',
    instancia_gestora: [],
    creado_por: '',
    pei: null,
  })

  const setInitialValues = (data) => {
    form.value = {
      codigo: data.codigo || '',
      titulo: data.titulo || '',
      descripcion: data.descripcion || '',
      fecha_inicio: data.fecha_inicio || '',
      fecha_finalizacion: data.fecha_finalizacion || '',
      presupuesto: data.presupuesto || null,
      estado: data.estado || 'ES',
      instancia_gestora: Array.isArray(data.instancia_gestora)
        ? data.instancia_gestora.map((ig) => ig.id)
        : data.instancia_gestora
          ? [data.instancia_gestora.id]
          : [],
      creado_por: data.creado_por || '',
      pei: data.pei?.id || null,
    }
  }

  const resetForm = () => {
    form.value = {
      codigo: '',
      titulo: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_finalizacion: '',
      presupuesto: null,
      estado: 'ES',
      instancia_gestora: [],
      creado_por: '',
      pei: null,
    }
  }

  if (initial) {
    setInitialValues(initial)
  }

  return {
    form,
    setInitialValues,
    resetForm,
  }
}
