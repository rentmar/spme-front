<template>
  <div>
    <v-btn
      icon="mdi-bug"
      size="small"
      color="orange"
      style="position: fixed; bottom: 16px; right: 16px; z-index: 9999"
      @click="abierto = true"
    />

    <v-dialog v-model="abierto" max-width="900" scrollable>
      <v-card>
        <v-card-title>🐛 Debug</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <strong>Actividades ({{ actividades.length }})</strong>
              <pre class="debug-json">{{ actividades }}</pre>
            </v-col>
            <v-col cols="6">
              <strong>Tareas ({{ tareas.length }})</strong>
              <pre class="debug-json">{{ tareas }}</pre>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const abierto = ref(false)

const tablaDataActividades = inject('tablaDataActividades', ref([]))
const tablaDataTareas = inject('tablaDataTareas', ref([]))

const actividades = computed(() => tablaDataActividades.value ?? [])
const tareas = computed(() => tablaDataTareas.value ?? [])
</script>

<style scoped>
.debug-btn {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 9999;
}

.debug-json {
  background: #1e1e1e;
  color: #ce9178;
  padding: 12px;
  border-radius: 8px;
  font-size: 11px;
  max-height: 60vh;
  overflow: auto;
}
</style>
