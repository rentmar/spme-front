<template>
  <v-dialog v-model="dialogoVisible" max-width="1100px" persistent scrollable>
    <v-card height="75vh" class="dialogo-asignacion-card">
      <!-- ═══ TOOLBAR TÍTULO ═══ -->
      <v-toolbar color="light-green-darken-2" density="compact" :height="36">
        <v-icon size="16" class="mr-2">mdi-connection</v-icon>
        <v-toolbar-title class="text-caption">ASIGNACIÓN - RELACIÓN ESTRUCTURA</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon size="x-small" variant="text" @click="cerrar">
          <v-icon size="16">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- ═══ CONTENIDO CON SCROLL ═══ -->
      <div class="aside-content">
        <!-- ═══ ENCABEZADO: DATOS DE LA ACTIVIDAD ═══ -->
        <v-card v-if="actividadData" flat class="mb-4 pa-3 summary-card">
          <div class="text-overline mb-2">Datos de la Actividad</div>
          <v-row dense>
            <v-col cols="12" sm="3">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">Código:</span>
                <strong class="text-caption">{{ actividadData.codigo || '—' }}</strong>
              </div>
            </v-col>
            <v-col cols="12" sm="5">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">Nombre:</span>
                <strong class="text-caption">{{
                  actividadData.nombreCorto || actividadData.titulo || '—'
                }}</strong>
              </div>
            </v-col>
            <v-col cols="12" sm="2">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">ID:</span>
                <strong class="text-caption">#{{ actividadData.id || '—' }}</strong>
              </div>
            </v-col>
            <v-col cols="12" sm="2">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">Estado:</span>
                <v-chip
                  size="x-small"
                  :color="estadoColor(actividadData.estado)"
                  variant="flat"
                  class="ml-1"
                >
                  {{ actividadData.estado || '—' }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- ═══ SELECTOR DE ESTRUCTURA (placeholder) ═══ -->
        <div class="text-center py-12 text-grey">
          <v-icon icon="mdi-cog" size="48" color="grey-lighten-1" class="mb-3"></v-icon>
          <p class="text-body-1 text-medium-emphasis mb-1">Selector de estructura de procedencia</p>
          <p class="text-caption text-grey">Próximamente...</p>
        </div>
      </div>

      <!-- ═══ ACCIONES ═══ -->
      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey-darken-1" size="small" @click="cerrar"> Cancelar </v-btn>
        <v-btn
          color="light-green-darken-2"
          variant="flat"
          size="small"
          @click="guardar"
          :disabled="true"
        >
          <v-icon left size="small">mdi-content-save</v-icon>
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  actividadData: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'guardar'])

const dialogoVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const estadoColor = (estado) => {
  return (
    {
      CRD: 'grey',
      PLAN: 'warning',
      EJEC: 'info',
      REP: 'success',
      FIN: 'primary',
      DES: 'default',
    }[estado] || 'default'
  )
}

const guardar = () => {}

const cerrar = () => {
  dialogoVisible.value = false
}
</script>

<style scoped>
.dialogo-asignacion-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 13px;
  color: #202124;
  background: #f5f7fa;
}

.aside-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.summary-card {
  background: #fff;
  border: 1px solid #dee2e6;
}

.v-card-actions {
  flex-shrink: 0;
}
</style>
