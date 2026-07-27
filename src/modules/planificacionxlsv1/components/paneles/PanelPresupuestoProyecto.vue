<!-- PanelPresupuestoProyecto.vue -->
<template>
  <div class="panel-presupuesto">
    <!-- Botón flotante -->
    <v-btn
      v-if="!visible"
      icon="mdi-chart-tree"
      color="primary"
      size="small"
      class="panel-toggle"
      @click="visible = true"
      title="Panel Presupuesto Proyecto"
    />

    <!-- Panel colapsable -->
    <v-card v-if="visible" class="panel-card" elevation="8">
      <v-card-title class="d-flex align-center pa-3 bg-primary text-white">
        <v-icon class="mr-2">mdi-chart-tree</v-icon>
        Presupuesto del Proyecto
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" size="small" @click="visible = false" />
      </v-card-title>

      <v-card-text class="pa-3 panel-content">
        <!-- Resumen del Proyecto -->
        <div class="proyecto-resumen mb-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2 font-weight-bold">Proyecto</span>
            <v-chip size="x-small" color="success" variant="flat">Dentro del presupuesto</v-chip>
          </div>

          <div class="d-flex justify-space-between text-caption">
            <span>Presupuesto: Bs 500,000.00</span>
            <span>Planificado: Bs 350,000.00</span>
          </div>

          <v-progress-linear model-value="70" color="primary" height="8" rounded class="my-2" />

          <div class="d-flex justify-space-between text-caption">
            <span>Saldo: Bs 150,000.00</span>
            <span class="text-primary">70.0%</span>
          </div>
        </div>

        <v-divider></v-divider>

        <!-- Resumen por Financiador -->
        <div class="mt-3 mb-3">
          <div class="text-caption font-weight-bold mb-2">Por Financiador</div>
          <div class="d-flex justify-space-between text-caption mb-1">
            <span>TGN</span>
            <span class="font-weight-medium">Bs 100,000.00</span>
          </div>
          <div class="d-flex justify-space-between text-caption mb-1">
            <span>IDH</span>
            <span class="font-weight-medium">Bs 50,000.00</span>
          </div>
        </div>

        <v-divider></v-divider>

        <!-- Actividades -->
        <div class="mt-3">
          <div class="text-caption font-weight-bold mb-2">Actividades (2 válidas de 3)</div>

          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title class="py-1">
                <div class="d-flex align-center gap-2 flex-1">
                  <v-chip size="x-small" color="warning" variant="flat">PLAN</v-chip>
                  <span class="text-caption text-truncate">Reunión de aliados</span>
                  <v-spacer></v-spacer>
                  <span class="text-caption font-weight-medium">Bs 150,000.00</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="ml-4">
                  <div class="text-caption font-weight-bold mb-1">Tareas (2)</div>
                  <div class="d-flex justify-space-between text-caption mb-1 ml-2">
                    <span>Traslado de mobiliario</span>
                    <span>Bs 60,000.00</span>
                  </div>
                  <div class="d-flex justify-space-between text-caption mb-1 ml-2">
                    <span>Preparación de materiales</span>
                    <span>Bs 40,000.00</span>
                  </div>
                </div>
                <div class="ml-4 mt-2">
                  <div class="text-caption font-weight-bold mb-1">Desglose por Financiador</div>
                  <div class="mb-2 ml-2">
                    <div class="d-flex justify-space-between text-caption">
                      <span class="font-weight-medium">TGN</span>
                      <span>Bs 100,000.00</span>
                    </div>
                    <div class="ml-4">
                      <div class="d-flex justify-space-between text-caption">
                        <span>Traslado de mobiliario</span>
                        <span>Bs 60,000.00</span>
                      </div>
                    </div>
                    <div class="d-flex justify-space-between text-caption mt-1">
                      <span class="text-medium-emphasis">Usado: Bs 60,000.00</span>
                      <span class="text-medium-emphasis">Saldo: Bs 40,000.00</span>
                    </div>
                  </div>
                  <div class="mb-2 ml-2">
                    <div class="d-flex justify-space-between text-caption">
                      <span class="font-weight-medium">IDH</span>
                      <span>Bs 50,000.00</span>
                    </div>
                    <div class="ml-4">
                      <div class="d-flex justify-space-between text-caption">
                        <span>Preparación de materiales</span>
                        <span>Bs 40,000.00</span>
                      </div>
                    </div>
                    <div class="d-flex justify-space-between text-caption mt-1">
                      <span class="text-medium-emphasis">Usado: Bs 40,000.00</span>
                      <span class="text-medium-emphasis">Saldo: Bs 10,000.00</span>
                    </div>
                  </div>
                </div>
                <div
                  class="d-flex justify-space-between text-caption font-weight-bold mt-2 pt-1 border-t ml-4"
                >
                  <span>Total tareas: Bs 100,000.00</span>
                  <span class="text-success">Saldo: Bs 50,000.00</span>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title class="py-1">
                <div class="d-flex align-center gap-2 flex-1">
                  <v-chip size="x-small" color="info" variant="flat">EJEC</v-chip>
                  <span class="text-caption text-truncate">Seminario de actualización</span>
                  <v-spacer></v-spacer>
                  <span class="text-caption font-weight-medium">Bs 200,000.00</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="ml-4">
                  <div class="text-caption font-weight-bold mb-1">Tareas (1)</div>
                  <div class="d-flex justify-space-between text-caption ml-2">
                    <span>Contratación de facilitadores</span>
                    <span>Bs 80,000.00</span>
                  </div>
                </div>
                <div
                  class="d-flex justify-space-between text-caption font-weight-bold mt-2 pt-1 border-t ml-4"
                >
                  <span>Total tareas: Bs 80,000.00</span>
                  <span class="text-success">Saldo: Bs 120,000.00</span>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel class="actividad-excluida">
              <v-expansion-panel-title class="py-1">
                <div class="d-flex align-center gap-2 flex-1">
                  <v-chip size="x-small" color="grey" variant="flat">CRD</v-chip>
                  <span class="text-caption text-truncate">Actividad de prueba</span>
                  <v-spacer></v-spacer>
                  <span class="text-caption font-weight-medium">Bs 100,000.00</span>
                  <v-chip size="x-small" color="grey" class="ml-1">Excluida</v-chip>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="text-caption text-medium-emphasis ml-4">
                  Estado CRD (Creada): no cuenta para el presupuesto del proyecto.
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
</script>

<style scoped>
.panel-presupuesto {
  position: relative;
}

.panel-toggle {
  position: fixed;
  bottom: 56px;
  left: 16px;
  z-index: 9999;
}

.panel-card {
  position: fixed;
  top: 80px;
  left: 16px;
  width: 380px;
  max-height: calc(100vh - 120px);
  z-index: 9998;
}

.panel-content {
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}
.actividad-excluida {
  opacity: 0.6;
}
.gap-2 {
  gap: 8px;
}
.flex-1 {
  flex: 1;
}
.border-t {
  border-top: 1px solid #e0e0e0;
  padding-top: 4px;
}
</style>
