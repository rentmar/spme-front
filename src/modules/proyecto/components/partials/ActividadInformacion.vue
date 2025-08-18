<template>
  <v-card variant="outlined" elevation="1" class="activity-card">
    <v-card-title class="activity-header pa-3">
      <div class="d-flex align-center w-100">
        <v-icon
          icon="mdi-clipboard-text-outline"
          size="large"
          class="mr-2"
          color="deep-purple"
        ></v-icon>
        <div class="activity-title-container">
          <div class="d-flex align-center">
            <h3 class="text-h6 font-weight-bold activity-title mr-2">ACT-2023-005</h3>
            <v-chip
              prepend-icon="mdi-progress-check"
              color="green"
              size="x-small"
              class="status-chip"
            >
              En Ejecución
            </v-chip>
          </div>
          <div class="text-caption text-medium-emphasis activity-subtitle">
            Capacitación en gestión de proyectos para equipos técnicos
          </div>
        </div>
        <v-spacer></v-spacer>

        <!-- Chips compactos de tipos -->
        <div class="d-flex">
          <v-chip class="ml-1" color="indigo-lighten-4" density="compact" size="x-small">
            <v-icon start icon="mdi-school" size="x-small"></v-icon>
            Capacitación
          </v-chip>
          <v-chip class="ml-1" color="indigo-lighten-4" density="compact" size="x-small">
            <v-icon start icon="mdi-link" size="x-small"></v-icon>
            Articulación
          </v-chip>
        </div>
      </div>
    </v-card-title>

    <v-card-text class="activity-content pa-3">
      <v-row dense>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-calendar" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"><strong>Programada:</strong> 15/05/2023</span>
          </div>
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-account" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"><strong>Responsable:</strong> María González</span>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-finance" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"><strong>Presupuesto:</strong> $2,500.00</span>
          </div>
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-calendar-end" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"><strong>Cierre:</strong> 30/06/2023</span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Datos dummy
const dummyData = {
  codigo: 'ACT-2023-005',
  descripcion: 'Capacitación en gestión de proyectos para equipos técnicos de las áreas regionales',
  estado: 'EJEC',
  tipo: [{ nombre: 'Actividad de Capacitación' }, { nombre: 'Actividad de Articulación' }],
  fecha_programada: '2023-05-15',
  fecha_cierre: '2023-06-30',
  responsable: { nombre: 'María González' },
  presupuesto: 2500,
}
</script>

<style scoped>
.activity-card {
  margin-bottom: 12px;
}

.activity-header {
  padding-bottom: 0;
  min-height: 56px;
}

.activity-title {
  line-height: 1.2;
  margin-bottom: 0;
}

.activity-subtitle {
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-chip {
  height: 20px;
}

.activity-content {
  padding-top: 0;
}

/* Estilos más compactos para Vuetify 3 */
:deep(.v-chip--size-x-small) {
  --v-chip-height: 20px;
  font-size: 0.625rem;
}

:deep(.v-icon--size-x-small) {
  font-size: 14px;
}
</style>
