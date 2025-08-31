<template>
  <v-container>
    <!-- Overlay de carga -->
    <v-overlay :model-value="cargandoGeneral" class="align-center justify-center" persistent>
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando formulario de solicitud...</p>
      </div>
    </v-overlay>

    <div v-if="!cargandoGeneral">
      <v-row>
        <v-col cols="12" md="12" lg="12">
          <PaginaTituloIcono
            titulo="SOLICITUD DE FONDOS EN AVANCE"
            subtitulo="Formulario F-01 - Con cargo a rendición de cuenta"
            icon="mdi-cash-plus"
            icon-color="primary"
          ></PaginaTituloIcono>
        </v-col>
      </v-row>

      <v-row>
        <!-- Panel lateral de información -->
        <v-col cols="12" md="4" lg="3">
          <v-card elevation="2" rounded="lg" class="mb-4">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white text-caption">
                <v-icon small class="mr-2">mdi-information</v-icon>
                Información General
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-3">
              <div class="info-item mb-3">
                <div class="text-caption text-medium-emphasis">Proyecto:</div>
                <div class="text-body-2 font-weight-medium">PROY-2023-015</div>
              </div>
              <div class="info-item mb-3">
                <div class="text-caption text-medium-emphasis">Actividad:</div>
                <div class="text-body-2 font-weight-medium">Capacitación técnica</div>
              </div>
              <div class="info-item mb-3">
                <div class="text-caption text-medium-emphasis">Estado:</div>
                <v-chip color="warning" size="small" class="mt-1">
                  <v-icon small class="mr-1">mdi-progress-clock</v-icon>
                  Pendiente
                </v-chip>
              </div>
              <div class="info-item">
                <div class="text-caption text-medium-emphasis">Fecha solicitud:</div>
                <div class="text-body-2 font-weight-medium">
                  {{ new Date().toLocaleDateString() }}
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Tarjeta de resumen rápido -->
          <v-card elevation="2" rounded="lg" class="mb-4">
            <v-toolbar color="secondary" density="compact">
              <v-toolbar-title class="text-white text-caption">
                <v-icon small class="mr-2">mdi-chart-box</v-icon>
                Resumen Rápido
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-3">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-caption">Monto solicitado:</span>
                <span class="text-body-2 font-weight-bold text-primary">Bs. 0.00</span>
              </div>
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-caption">Items de gasto:</span>
                <span class="text-body-2 font-weight-medium">0</span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-space-between align-center">
                <span class="text-caption">Presupuesto disponible:</span>
                <span class="text-body-2 font-weight-medium text-success">Bs. 2,500.00</span>
              </div>
            </v-card-text>
          </v-card>

          <!-- Acciones rápidas -->
          <v-card elevation="2" rounded="lg">
            <v-toolbar color="info" density="compact">
              <v-toolbar-title class="text-white text-caption">
                <v-icon small class="mr-2">mdi-lightning-bolt</v-icon>
                Acciones Rápidas
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-3">
              <v-btn
                block
                color="primary"
                variant="flat"
                size="small"
                class="mb-2"
                prepend-icon="mdi-plus"
              >
                Nuevo Gasto
              </v-btn>
              <v-btn
                block
                color="secondary"
                variant="outlined"
                size="small"
                class="mb-2"
                prepend-icon="mdi-content-save"
              >
                Guardar Borrador
              </v-btn>
              <v-btn block color="error" variant="outlined" size="small" prepend-icon="mdi-delete">
                Cancelar
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Formulario principal -->
        <v-col cols="12" md="8" lg="9">
          <v-card elevation="2" rounded="lg">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon class="mr-2">mdi-form-textbox</v-icon>
                Formulario de Solicitud
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pa-4">
              <!-- Sección 1: Información del Solicitante -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                  Información del Solicitante
                </h3>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Nombre completo"
                      variant="outlined"
                      density="compact"
                      bg-color="grey-lighten-4"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Cargo"
                      variant="outlined"
                      density="compact"
                      bg-color="grey-lighten-4"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="CI"
                      variant="outlined"
                      density="compact"
                      bg-color="grey-lighten-4"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Unidad/Departamento"
                      variant="outlined"
                      density="compact"
                      bg-color="grey-lighten-4"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>

              <v-divider class="my-6"></v-divider>

              <!-- Sección 2: Detalle de Gastos -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-cash</v-icon>
                  Detalle de Gastos Solicitados
                </h3>

                <v-alert type="info" variant="tonal" class="mb-4">
                  <template v-slot:prepend>
                    <v-icon color="info">mdi-information</v-icon>
                  </template>
                  Agregue todos los gastos asociados a la actividad. Especifique partida,
                  descripción y monto.
                </v-alert>

                <v-table class="elevation-1 rounded-lg mb-4">
                  <thead>
                    <tr>
                      <th class="text-left font-weight-bold">Partida</th>
                      <th class="text-left font-weight-bold">Descripción</th>
                      <th class="text-left font-weight-bold">Monto (Bs.)</th>
                      <th class="text-center font-weight-bold">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in itemsGasto" :key="index">
                      <td>
                        <v-text-field
                          v-model="item.partida"
                          variant="outlined"
                          density="compact"
                          hide-details
                          placeholder="1.1.1"
                        ></v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          v-model="item.descripcion"
                          variant="outlined"
                          density="compact"
                          hide-details
                          placeholder="Descripción del gasto"
                        ></v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          v-model="item.monto"
                          type="number"
                          variant="outlined"
                          density="compact"
                          hide-details
                          placeholder="0.00"
                        ></v-text-field>
                      </td>
                      <td class="text-center">
                        <v-btn icon color="error" size="small" variant="text">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>

                <v-btn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-plus"
                  @click="agregarItemGasto"
                >
                  Agregar Item
                </v-btn>
              </div>

              <v-divider class="my-6"></v-divider>

              <!-- Sección 3: Información Adicional -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-calendar-text</v-icon>
                  Información Adicional
                </h3>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-textarea
                      label="Justificación de la solicitud"
                      variant="outlined"
                      rows="3"
                      placeholder="Describa brevemente la necesidad de los fondos solicitados..."
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Lugar de ejecución"
                      variant="outlined"
                      placeholder="Ciudad, Departamento"
                    ></v-text-field>
                    <v-select
                      label="Forma de pago preferida"
                      :items="['Transferencia bancaria', 'Cheque', 'Efectivo']"
                      variant="outlined"
                    ></v-select>
                  </v-col>
                </v-row>
              </div>

              <!-- Botones de acción -->
              <div class="d-flex justify-end gap-3 mt-8">
                <v-btn color="error" variant="outlined" size="large" prepend-icon="mdi-cancel">
                  Cancelar
                </v-btn>
                <v-btn
                  color="secondary"
                  variant="outlined"
                  size="large"
                  prepend-icon="mdi-content-save"
                >
                  Guardar Borrador
                </v-btn>
                <v-btn color="primary" variant="flat" size="large" prepend-icon="mdi-send">
                  Enviar Solicitud
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'

const cargandoGeneral = ref(true)
const itemsGasto = ref([{ partida: '', descripcion: '', monto: '' }])

const agregarItemGasto = () => {
  itemsGasto.value.push({ partida: '', descripcion: '', monto: '' })
}

onMounted(() => {
  // Simular carga de datos
  setTimeout(() => {
    cargandoGeneral.value = false
  }, 1500)
})
</script>

<style scoped>
.v-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}

.form-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
}

.form-section h3 {
  color: #1976d2;
  border-bottom: 3px solid #1976d2;
  padding-bottom: 12px;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.info-item {
  padding: 4px 0;
}

.gap-3 {
  gap: 12px;
}

/* Mejora la apariencia de las tarjetas */
.v-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Ajustes responsivos */
@media (max-width: 960px) {
  .v-container {
    padding: 16px 12px;
  }

  .form-section {
    padding: 20px;
    margin-bottom: 20px;
  }

  .d-flex.justify-end {
    flex-direction: column;
    gap: 8px;
  }

  .d-flex.justify-end .v-btn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .v-card {
    margin: 8px 0;
  }

  .form-section {
    padding: 16px;
  }
}

/* Animaciones suaves */
.v-card,
.v-btn,
.v-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mejora el aspecto de la tabla */
:deep(.v-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-table th) {
  background-color: #1976d2 !important;
  color: white !important;
  font-weight: 600;
  font-size: 14px;
  padding: 16px 12px;
}

:deep(.v-table td) {
  padding: 12px;
  background-color: #fafafa;
}
</style>
