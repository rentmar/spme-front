<template>
  <div>
    <v-list-item
      :value="actividad.id"
      class="actividad-item"
      :class="{ 'actividad-expandida': expandido }"
      @click="expandido = !expandido"
    >
      <template v-slot:prepend>
        <v-avatar
          :color="getStatusColor(actividad.estado)"
          :size="compact ? 36 : 40"
          :class="compact ? 'mr-2' : 'mr-3'"
        >
          <v-icon dark :size="compact ? 18 : 20">{{ getTipoIcon(actividad.estado) }}</v-icon>
        </v-avatar>
      </template>

      <div class="contenido-actividad">
        <div class="font-weight-bold texto-codigo" :class="compact ? 'text-body-2' : 'text-body-1'">
          {{ actividad.codigo }}
        </div>
        <div class="text-body-2 font-weight-medium texto-nombre">
          {{ actividad.nombre_corto }}
        </div>
        <div class="d-flex align-center mt-1">
          <v-chip
            size="x-small"
            :color="getStatusColor(actividad.estado)"
            text-color="white"
            class="mr-2"
          >
            {{ getEstadoTexto(actividad.estado) }}
          </v-chip>
          <span class="text-caption">{{ formatCurrency(actividad.presupuesto) }}</span>
          <v-chip size="x-small" color="green" variant="tonal" class="ml-2">
            <v-icon start size="14">mdi-checkbox-blank-circle</v-icon>
            {{ actividad.tareas?.length || 0 }}
          </v-chip>
        </div>
        <div class="text-caption mt-1" v-if="!compact && actividad.fecha_programada">
          <strong>Programada:</strong> {{ formatDate(actividad.fecha_programada) }}
          <span v-if="actividad.duracion">({{ actividad.duracion }} días)</span>
        </div>
      </div>

      <template v-slot:append>
        <BotoneraSolicitudes
          :actividad-id="actividad.id"
          tipo="actividad"
          :badges="actividad.badges || defaultBadges"
          @crear-fondos="
            $emit('accion', {
              tipo: 'crear',
              actividadId: actividad.id,
              tareaId: null,
              formulario: 'formulario01',
            })
          "
          @validar-fondos="
            $emit('accion', {
              tipo: 'validar',
              actividadId: actividad.id,
              tareaId: null,
              formulario: 'fondos',
            })
          "
          @crear-viaje="
            $emit('accion', {
              tipo: 'crear',
              actividadId: actividad.id,
              tareaId: null,
              formulario: 'formulario05',
            })
          "
          @validar-viaje="
            $emit('accion', {
              tipo: 'validar',
              actividadId: actividad.id,
              tareaId: null,
              formulario: 'viaje',
            })
          "
          @crear-pago-directo="
            $emit('accion', {
              tipo: 'crear',
              actividadId: actividad.id,
              tareaId: null,
              formulario: 'formulario08',
            })
          "
          @validar-pago-directo="
            $emit('accion', {
              tipo: 'validar',
              actividadId: actividad.id,
              tareaId: null,
              formulario: 'pagoDirecto',
            })
          "
          @crear-reposicion="
            $emit('accion', {
              tipo: 'crear',
              actividadId: actividad.id,
              tareaId: null,
              formulario: 'formulario03',
            })
          "
          @validar-reposicion="
            $emit('accion', {
              tipo: 'validar',
              actividadId: actividad.id,
              tareaId: null,
              formulario: 'reposicion',
            })
          "
        />
      </template>
    </v-list-item>

    <v-expand-transition>
      <div v-if="expandido && actividad.tareas?.length">
        <v-card
          elevation="0"
          :class="
            compact ? 'ml-8 mr-4 mb-2 bg-grey-lighten-3' : 'ml-10 mr-4 mb-4 bg-grey-lighten-4'
          "
        >
          <v-card-text :class="compact ? 'py-2' : 'pt-4'">
            <div :class="compact ? 'text-caption font-weight-bold mb-2' : 'text-subtitle-1 mb-4'">
              Sub Actividades ({{ actividad.tareas.length }})
            </div>
            <v-list density="compact" class="py-0">
              <TareaItem
                v-for="tarea in actividad.tareas"
                :key="`t-${actividad.id}-${tarea.id}`"
                :actividad-id="actividad.id"
                :tarea="tarea"
                @accion="$emit('accion', $event)"
              />
            </v-list>
          </v-card-text>
        </v-card>
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BotoneraSolicitudes from './BotoneraSolicitudes.vue'
import TareaItem from './TareaItem.vue'
import { ESTADO_LABEL } from '@/modules/gantt/utils/constants.js'
import {
  getColorEstadoActividad,
  getIconoEstadoActividad,
  formatearMonto,
} from '@/modules/formularios/utils/actividadHelpers.js'

import { formatearFecha } from '@/modules/formularios/utils/estadoTareaUtils.js'

const props = defineProps({
  actividad: { type: Object, required: true },
  compact: { type: Boolean, default: false },
})
defineEmits(['accion'])

const expandido = ref(false)

const defaultBadges = {
  fondos: { creadas: 0, aprobadas: 0 },
  viajes: { creadas: 0, aprobadas: 0 },
  pagosDirectos: { creadas: 0, aprobadas: 0 },
  reposiciones: { creadas: 0, aprobadas: 0 },
}

const getStatusColor = (s) => getColorEstadoActividad(s)
const getEstadoTexto = (s) => ESTADO_LABEL[s] || s
const getTipoIcon = (s) => getIconoEstadoActividad(s)
const formatCurrency = (v) => formatearMonto(v)
const formatDate = (d) => formatearFecha(d)
</script>

<style scoped>
.actividad-item {
  background-color: white !important;
  white-space: normal !important;
  margin-bottom: 10px !important;
  margin-top: 10px !important;
  padding: 14px 14px !important;
  border-radius: 12px !important;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.actividad-item:hover {
  background-color: #e3f2fd !important;
  border-color: #90caf9;
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.15);
  transform: translateY(-2px);
  z-index: 5;
}

.actividad-expandida {
  background-color: #e3f2fd !important;
  border-color: #90caf9;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2) !important;
  transform: translateY(0) !important;
}

.contenido-actividad {
  width: 100%;
  min-width: 0;
}

.texto-codigo {
  white-space: normal !important;
  word-break: break-word;
  line-height: 1.3;
}

.texto-nombre {
  white-space: normal !important;
  word-break: break-word;
  line-height: 1.3;
}
</style>
