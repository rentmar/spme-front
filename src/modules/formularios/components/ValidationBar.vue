<template>
  <div class="validation-bar">
    <!-- Validar Solicitud de Fondos -->
    <v-tooltip text="Validar Solicitud de Fondos" location="top">
      <template v-slot:activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          icon="mdi-thumb-up"
          variant="text"
          color="primary"
          size="small"
          class="validation-btn"
          @click="dialogs.solicitudFondos = true"
        />
      </template>
    </v-tooltip>

    <!-- Validar Solicitud de Viaje -->
    <v-tooltip text="Validar Solicitud de Viaje" location="top">
      <template v-slot:activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          icon="mdi-thumb-up"
          variant="text"
          color="deep-purple"
          size="small"
          class="validation-btn"
          @click="dialogs.solicitudViaje = true"
        />
      </template>
    </v-tooltip>

    <!-- Validar Solicitud de Pago Directo -->
    <v-tooltip text="Validar Solicitud de Pago Directo" location="top">
      <template v-slot:activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          icon="mdi-thumb-up"
          variant="text"
          color="teal-lighten-2"
          size="small"
          class="validation-btn"
          @click="dialogs.solicitudPagoDirecto = true"
        />
      </template>
    </v-tooltip>

    <!-- Validar Solicitud de Reposición -->
    <v-tooltip text="Validar Solicitud de Reposición" location="top">
      <template v-slot:activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          icon="mdi-thumb-up"
          variant="text"
          color="warning"
          size="small"
          class="validation-btn"
          @click="dialogs.solicitudReposicion = true"
        />
      </template>
    </v-tooltip>

    <!-- Validar Rendición de Cuentas -->
    <v-tooltip text="Validar Rendición de Cuentas" location="top">
      <template v-slot:activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          icon="mdi-thumb-up"
          variant="text"
          color="error"
          size="small"
          class="validation-btn"
          @click="dialogs.rendicionCuentas = true"
        />
      </template>
    </v-tooltip>

    <!-- Modales -->
    <DialogSolicitudFondos v-model="dialogs.solicitudFondos" :actividad-id="props.actividadId" />
    <DialogSolicitudViaje v-model="dialogs.solicitudViaje" :actividad-id="props.actividadId" />
    <DialogSolicitudPagoDirecto
      v-model="dialogs.solicitudPagoDirecto"
      :actividad-id="props.actividadId"
    />
    <DialogSolicitudReposicion
      v-model="dialogs.solicitudReposicion"
      :actividad-id="props.actividadId"
    />
    <DialogRendicionCuentas v-model="dialogs.rendicionCuentas" :actividad-id="props.actividadId" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DialogSolicitudFondos from './partials/DialogSolicitudFondos.vue'
import DialogSolicitudViaje from './partials/DialogSolicitudViaje.vue'
import DialogSolicitudPagoDirecto from './partials/DialogSolicitudPagoDirecto.vue'
import DialogSolicitudReposicion from './partials/DialogSolicitudReposicion.vue'
import DialogRendicionCuentas from './partials/DialogRendicionCuentas.vue'

// Props
const props = defineProps({
  actividadId: {
    type: Number,
    required: true,
  },
})

// Estados de los diálogos
const dialogs = ref({
  solicitudFondos: false,
  solicitudViaje: false,
  solicitudPagoDirecto: false,
  solicitudReposicion: false,
  rendicionCuentas: false,
})
</script>

<style scoped>
.validation-bar {
  display: flex;
  gap: 4px;
  align-items: center;
}

.validation-btn {
  min-width: 36px;
  min-height: 36px;
}
</style>
