<template>
  <div class="d-flex align-center botonera-solicitudes">
    <!-- Rendición de Cuentas -->
    <div class="d-flex flex-column align-center mx-1">
      <v-tooltip text="Rendición de Cuentas" location="top">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-badge
            v-if="badges.rendiciones?.creadas > 0"
            :content="badges.rendiciones.creadas > 99 ? '99+' : badges.rendiciones.creadas"
            color="error"
            size="x-small"
            offset-x="-4"
            offset-y="-4"
            class="badge-chico"
          >
            <v-btn
              v-bind="tooltipProps"
              icon="mdi-cash-check"
              variant="text"
              color="error"
              :size="tipo === 'tarea' ? 'x-small' : 'small'"
              @click.stop="$emit('crear-rendicion')"
            />
          </v-badge>
          <v-btn
            v-else
            v-bind="tooltipProps"
            icon="mdi-cash-check"
            variant="text"
            color="error"
            :size="tipo === 'tarea' ? 'x-small' : 'small'"
            @click.stop="$emit('crear-rendicion')"
          />
        </template>
      </v-tooltip>

      <v-tooltip text="Validar Rendición de Cuentas" location="bottom">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-badge
            v-if="badges.rendiciones?.aprobadas > 0"
            :content="badges.rendiciones.aprobadas > 99 ? '99+' : badges.rendiciones.aprobadas"
            color="error"
            size="x-small"
            offset-x="-4"
            offset-y="-4"
            class="badge-chico"
          >
            <v-btn
              v-bind="tooltipProps"
              icon="mdi-thumb-up"
              variant="text"
              color="error"
              :size="tipo === 'tarea' ? 'x-small' : 'small'"
              @click.stop="$emit('validar-rendicion')"
            />
          </v-badge>
          <v-btn
            v-else
            v-bind="tooltipProps"
            icon="mdi-thumb-up"
            variant="text"
            color="error"
            :size="tipo === 'tarea' ? 'x-small' : 'small'"
            @click.stop="$emit('validar-rendicion')"
          />
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
      rendiciones: { creadas: 0, aprobadas: 0 },
    }),
  },
})

defineEmits(['crear-rendicion', 'validar-rendicion'])
</script>

<style scoped>
.botonera-solicitudes {
  gap: 0px;
}
.badge-chico :deep(.v-badge__badge) {
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
}
</style>
