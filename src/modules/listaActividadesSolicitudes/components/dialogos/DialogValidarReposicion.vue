<template>
  <DialogValidarBase
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    titulo="Validar Solicitud de Reposición"
    subtitulo="Seleccione una solicitud de reposición para validar"
    icono="mdi-cash-refund"
    color="warning"
    mensaje-vacio="No tienes solicitudes de reposición pendientes de validación"
    :actividad-id="props.actividadId"
    :tarea-id="props.tareaId"
    ruta-formulario="/monitoreo/formulario033"
    :cargar-datos="cargarSolicitudesReposicion"
  >
    <template #item="{ item }">
      <div class="d-flex align-center w-100">
        <v-icon :color="estadoColor(item.estado_validacion)" size="24" class="mr-3">
          {{ estadoIcono(item.estado_validacion) }}
        </v-icon>

        <div class="flex-grow-1">
          <div class="font-weight-bold text-body-2">
            {{ item.numeroFormulario }}
          </div>
          <div class="d-flex flex-wrap gap-3 mt-1">
            <span class="text-caption">
              <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
              {{ item.fechaSolicitud }}
            </span>
            <span class="text-caption">
              <v-icon size="14" class="mr-1">mdi-cash</v-icon>
              {{ formatCurrency(item.montoSolicitado) }}
            </span>
          </div>
        </div>

        <v-chip size="small" :color="estadoColor(item.estado_validacion)" variant="tonal">
          {{ item.estado_validacion }}
        </v-chip>
      </div>
    </template>
  </DialogValidarBase>
</template>

<script setup>
import DialogValidarBase from './DialogValidarBase.vue'
import { useSolicitudReposicion } from '@/modules/formularios/composables/useSolicitudReposicion.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  actividadId: { type: Number, default: null },
  tareaId: { type: Number, default: null },
})

const emit = defineEmits(['update:modelValue'])

const {
  listaSolReposicionActividad,
  obtenerListaSolReposicionPorIdActividad,
  listaSolReposicionTarea,
  obtenerListaSolReposicionPorIdTarea,
} = useSolicitudReposicion()

async function cargarSolicitudesReposicion(actividadId, tareaId) {
  let data
  if (tareaId) {
    //Es una tareas
    await obtenerListaSolReposicionPorIdTarea(actividadId, tareaId)
    data = listaSolReposicionTarea.value?.solicitudes
  } else {
    //Es una actividad
    await obtenerListaSolReposicionPorIdActividad(actividadId)
    data = listaSolReposicionActividad.value?.solicitudes
  }

  return { items: data }
}

// async function cargarSolicitudesReposicion(actividadId, tareaId) {
//   const body = { id_actividad: actividadId }
//   if (tareaId) body.id_tarea = tareaId

//   const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudReembolso/', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   })

//   if (!response.ok) throw new Error('Error al cargar solicitudes de reposición')

//   const data = await response.json()

//   return {
//     items: data.solicitudes || [],
//   }
// }

function estadoColor(estado) {
  const map = {
    Aprobado: 'success',
    Pendiente: 'warning',
    SinRevisores: 'orange',
    Rechazado: 'error',
  }
  return map[estado] || 'grey'
}

function estadoIcono(estado) {
  const map = {
    Aprobado: 'mdi-check-circle',
    Pendiente: 'mdi-clock-outline',
    SinRevisores: 'mdi-account-alert',
    Rechazado: 'mdi-close-circle',
  }
  return map[estado] || 'mdi-help-circle'
}

function formatCurrency(value) {
  const num = Number(value)
  return !isNaN(num) ? `Bs. ${num.toFixed(2)}` : 'N/A'
}
</script>
