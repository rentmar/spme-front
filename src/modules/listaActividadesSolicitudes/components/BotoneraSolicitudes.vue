<template>
  <div class="d-flex align-center botonera-solicitudes">
    <!-- Solicitud de Fondos -->
    <div class="d-flex flex-column align-center mx-1">
      <v-tooltip text="Solicitud de Fondos" location="top">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-badge
            v-if="badges.fondos.creadas > 0"
            :content="badges.fondos.creadas > 99 ? '99+' : badges.fondos.creadas"
            color="primary"
            size="x-small"
            offset-x="-4"
            offset-y="-4"
            class="badge-chico"
          >
            <v-btn
              v-bind="tooltipProps"
              icon="mdi-cash-plus"
              variant="text"
              color="primary"
              :size="tipo === 'tarea' ? 'x-small' : 'small'"
              @click.stop="$emit('crear-fondos')"
            ></v-btn>
          </v-badge>
          <v-btn
            v-else
            v-bind="tooltipProps"
            icon="mdi-cash-plus"
            variant="text"
            color="primary"
            :size="tipo === 'tarea' ? 'x-small' : 'small'"
            @click.stop="$emit('crear-fondos')"
          ></v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Validar Solicitud de Fondos" location="bottom">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-badge
            v-if="badges.fondos.aprobadas > 0"
            :content="badges.fondos.aprobadas > 99 ? '99+' : badges.fondos.aprobadas"
            color="primary"
            size="x-small"
            offset-x="-4"
            offset-y="-4"
            class="badge-chico"
          >
            <v-btn
              v-bind="tooltipProps"
              icon="mdi-thumb-up"
              variant="text"
              color="primary"
              :size="tipo === 'tarea' ? 'x-small' : 'small'"
              @click.stop="$emit('validar-fondos')"
            ></v-btn>
          </v-badge>
          <v-btn
            v-else
            v-bind="tooltipProps"
            icon="mdi-thumb-up"
            variant="text"
            color="primary"
            :size="tipo === 'tarea' ? 'x-small' : 'small'"
            @click.stop="$emit('validar-fondos')"
          ></v-btn>
        </template>
      </v-tooltip>
    </div>

    <!-- Solicitud de Viaje -->
    <div class="d-flex flex-column align-center mx-1">
      <v-tooltip text="Solicitud de Viaje" location="top">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-badge
            v-if="badges.viajes.creadas > 0"
            :content="badges.viajes.creadas > 99 ? '99+' : badges.viajes.creadas"
            color="deep-purple"
            size="x-small"
            offset-x="-4"
            offset-y="-4"
            class="badge-chico"
          >
            <v-btn
              v-bind="tooltipProps"
              icon="mdi-bag-suitcase"
              variant="text"
              color="deep-purple"
              :size="tipo === 'tarea' ? 'x-small' : 'small'"
              @click.stop="$emit('crear-viaje')"
            ></v-btn>
          </v-badge>
          <v-btn
            v-else
            v-bind="tooltipProps"
            icon="mdi-bag-suitcase"
            variant="text"
            color="deep-purple"
            :size="tipo === 'tarea' ? 'x-small' : 'small'"
            @click.stop="$emit('crear-viaje')"
          ></v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Validar Solicitud de Viaje" location="bottom">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-badge
            v-if="badges.viajes.aprobadas > 0"
            :content="badges.viajes.aprobadas > 99 ? '99+' : badges.viajes.aprobadas"
            color="deep-purple"
            size="x-small"
            offset-x="-4"
            offset-y="-4"
            class="badge-chico"
          >
            <v-btn
              v-bind="tooltipProps"
              icon="mdi-thumb-up"
              variant="text"
              color="deep-purple"
              :size="tipo === 'tarea' ? 'x-small' : 'small'"
              @click.stop="$emit('validar-viaje')"
            ></v-btn>
          </v-badge>
          <v-btn
            v-else
            v-bind="tooltipProps"
            icon="mdi-thumb-up"
            variant="text"
            color="deep-purple"
            :size="tipo === 'tarea' ? 'x-small' : 'small'"
            @click.stop="$emit('validar-viaje')"
          ></v-btn>
        </template>
      </v-tooltip>
    </div>

    <!-- Solicitud de Pago Directo -->
    <div class="d-flex flex-column align-center mx-1">
      <v-tooltip text="Solicitud de Pago Directo" location="top">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-badge
            v-if="badges.pagosDirectos.creadas > 0"
            :content="badges.pagosDirectos.creadas > 99 ? '99+' : badges.pagosDirectos.creadas"
            color="teal-lighten-2"
            size="x-small"
            offset-x="-4"
            offset-y="-4"
            class="badge-chico"
          >
            <v-btn
              v-bind="tooltipProps"
              icon="mdi-credit-card-check"
              variant="text"
              color="teal-lighten-2"
              :size="tipo === 'tarea' ? 'x-small' : 'small'"
              @click.stop="$emit('crear-pago-directo')"
            ></v-btn>
          </v-badge>
          <v-btn
            v-else
            v-bind="tooltipProps"
            icon="mdi-credit-card-check"
            variant="text"
            color="teal-lighten-2"
            :size="tipo === 'tarea' ? 'x-small' : 'small'"
            @click.stop="$emit('crear-pago-directo')"
          ></v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Validar Solicitud de Pago Directo" location="bottom">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-badge
            v-if="badges.pagosDirectos.aprobadas > 0"
            :content="badges.pagosDirectos.aprobadas > 99 ? '99+' : badges.pagosDirectos.aprobadas"
            color="teal-lighten-2"
            size="x-small"
            offset-x="-4"
            offset-y="-4"
            class="badge-chico"
          >
            <v-btn
              v-bind="tooltipProps"
              icon="mdi-thumb-up"
              variant="text"
              color="teal-lighten-2"
              :size="tipo === 'tarea' ? 'x-small' : 'small'"
              @click.stop="$emit('validar-pago-directo')"
            ></v-btn>
          </v-badge>
          <v-btn
            v-else
            v-bind="tooltipProps"
            icon="mdi-thumb-up"
            variant="text"
            color="teal-lighten-2"
            :size="tipo === 'tarea' ? 'x-small' : 'small'"
            @click.stop="$emit('validar-pago-directo')"
          ></v-btn>
        </template>
      </v-tooltip>
    </div>

    <!-- Solicitud de Reposición -->
    <div class="d-flex flex-column align-center mx-1">
      <v-tooltip text="Solicitud de Reposición" location="top">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-badge
            v-if="badges.reposiciones.creadas > 0"
            :content="badges.reposiciones.creadas > 99 ? '99+' : badges.reposiciones.creadas"
            color="warning"
            size="x-small"
            offset-x="-4"
            offset-y="-4"
            class="badge-chico"
          >
            <v-btn
              v-bind="tooltipProps"
              icon="mdi-cash-refund"
              variant="text"
              color="warning"
              :size="tipo === 'tarea' ? 'x-small' : 'small'"
              @click.stop="$emit('crear-reposicion')"
            ></v-btn>
          </v-badge>
          <v-btn
            v-else
            v-bind="tooltipProps"
            icon="mdi-cash-refund"
            variant="text"
            color="warning"
            :size="tipo === 'tarea' ? 'x-small' : 'small'"
            @click.stop="$emit('crear-reposicion')"
          ></v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Validar Solicitud de Reposición" location="bottom">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-badge
            v-if="badges.reposiciones.aprobadas > 0"
            :content="badges.reposiciones.aprobadas > 99 ? '99+' : badges.reposiciones.aprobadas"
            color="warning"
            size="x-small"
            offset-x="-4"
            offset-y="-4"
            class="badge-chico"
          >
            <v-btn
              v-bind="tooltipProps"
              icon="mdi-thumb-up"
              variant="text"
              color="warning"
              :size="tipo === 'tarea' ? 'x-small' : 'small'"
              @click.stop="$emit('validar-reposicion')"
            ></v-btn>
          </v-badge>
          <v-btn
            v-else
            v-bind="tooltipProps"
            icon="mdi-thumb-up"
            variant="text"
            color="warning"
            :size="tipo === 'tarea' ? 'x-small' : 'small'"
            @click.stop="$emit('validar-reposicion')"
          ></v-btn>
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  actividadId: { type: Number, required: true },
  tareaId: { type: Number, default: null },
  tipo: {
    type: String,
    default: 'actividad',
    validator: (v) => ['actividad', 'tarea'].includes(v),
  },
  badges: {
    type: Object,
    default: () => ({
      fondos: { creadas: 0, aprobadas: 0 },
      viajes: { creadas: 0, aprobadas: 0 },
      pagosDirectos: { creadas: 0, aprobadas: 0 },
      reposiciones: { creadas: 0, aprobadas: 0 },
    }),
  },
})

defineEmits([
  'crear-fondos',
  'validar-fondos',
  'crear-viaje',
  'validar-viaje',
  'crear-pago-directo',
  'validar-pago-directo',
  'crear-reposicion',
  'validar-reposicion',
])

const defaultBadges = {
  fondos: { creadas: 0, aprobadas: 0 },
  viajes: { creadas: 0, aprobadas: 0 },
  pagosDirectos: { creadas: 0, aprobadas: 0 },
  reposiciones: { creadas: 0, aprobadas: 0 },
}

// ✅ Normalizar badges (acepta ambos formatos)
const badges = computed(() => ({
  fondos: props.badges?.fondos || defaultBadges.fondos,
  viajes: props.badges?.viajes || defaultBadges.viajes,
  pagosDirectos:
    props.badges?.pagos_directos || props.badges?.pagosDirectos || defaultBadges.pagosDirectos,
  reposiciones: props.badges?.reposiciones || defaultBadges.reposiciones,
}))
</script>
<style scoped>
.botonera-solicitudes {
  gap: 0px;
}

.badge-chico :deep(.v-badge__badge) {
  font-size: 12px;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
}
</style>
