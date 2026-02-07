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
    <DialogSolicitudFondosTareaPei
      v-model="dialogs.solicitudFondos"
      :actividad-id="props.actividadId"
      :tarea-id="props.tareaId"
    />
    <DialogSolicitudViajeTareaPei
      v-model="dialogs.solicitudViaje"
      :actividad-id="props.actividadId"
      :tarea-id="props.tareaId"
    />
    <DialogSolicitudPagoDirectoTareaPei
      v-model="dialogs.solicitudPagoDirecto"
      :actividad-id="props.actividadId"
      :tarea-id="props.tareaId"
    />
    <DialogSolicitudReposicionTareaPei
      v-model="dialogs.solicitudReposicion"
      :actividad-id="props.actividadId"
      :tarea-id="props.tareaId"
    />
    <DialogRendicionCuentasTareaPei
      v-model="dialogs.rendicionCuentas"
      :actividad-id="props.actividadId"
      :tarea-id="props.tareaId"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DialogSolicitudFondosTareaPei from './partials/DialogSolicitudFondosTareaPei.vue'
import DialogSolicitudViajeTareaPei from './partials/DialogSolicitudViajeTareaPei.vue'
import DialogSolicitudPagoDirectoTareaPei from './partials/DialogSolicitudPagoDirectoTareaPei.vue'
import DialogSolicitudReposicionTareaPei from './partials/DialogSolicitudReposicionTareaPei.vue'
import DialogRendicionCuentasTareaPei from './partials/DialogRendicionCuentasTareaPei.vue'
// import DialogSolicitudFondosTarea from './partials/DialogSolicitudFondosTarea.vue'
// import DialogSolicitudViajeTarea from './partials/DialogSolicitudViajeTarea.vue'
// import DialogSolicitudPagoDirectoTarea from './partials/DialogSolicitudPagoDirectoTarea.vue'
// import DialogSolicitudReposicionTarea from './partials/DialogSolicitudReposicionTarea.vue'
// import DialogRendicionCuentasTarea from './partials/DialogRendicionCuentasTarea.vue'

// Props
const props = defineProps({
  actividadId: {
    type: Number,
    required: true,
  },
  tareaId: {
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
