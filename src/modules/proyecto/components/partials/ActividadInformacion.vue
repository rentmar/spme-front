<template>
  <div>
    <v-card variant="outlined" elevation="1" class="activity-card">
      <v-card-title class="activity-header pa-4">
        <div class="d-flex align-center w-100">
          <v-icon
            icon="mdi-clipboard-text-outline"
            size="large"
            class="mr-3"
            color="deep-purple"
          ></v-icon>
          <div class="activity-title-container flex-grow-1">
            <div class="d-flex align-center mb-1">
              <h3 class="text-h5 font-weight-bold activity-title mr-3">ACT-2023-005</h3>
              <v-chip
                prepend-icon="mdi-progress-check"
                color="green"
                size="small"
                class="status-chip"
              >
                En Ejecución
              </v-chip>
            </div>
            <p class="text-subtitle-1 text-medium-emphasis activity-subtitle">
              Capacitación en gestión de proyectos para equipos técnicos
            </p>
          </div>

          <!-- Chips compactos de tipos -->
          <div class="d-flex flex-column align-end">
            <v-chip class="mb-1" color="indigo-lighten-4" density="comfortable" size="small">
              <v-icon start icon="mdi-school" size="small"></v-icon>
              Capacitación
            </v-chip>
            <v-chip color="indigo-lighten-4" density="comfortable" size="small">
              <v-icon start icon="mdi-link" size="small"></v-icon>
              Articulación
            </v-chip>
          </div>
        </div>
      </v-card-title>

      <v-divider class="mx-4"></v-divider>

      <v-card-text class="activity-content pa-4">
        <v-row dense>
          <v-col cols="12" sm="6" class="pb-1">
            <div class="d-flex align-center mb-3">
              <v-icon icon="mdi-calendar" class="mr-2" color="primary" size="small"></v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Fecha Programada</div>
                <div class="text-body-2 font-weight-medium">15/05/2023</div>
              </div>
            </div>
            <div class="d-flex align-center mb-3">
              <v-icon icon="mdi-account" class="mr-2" color="primary" size="small"></v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Responsable</div>
                <div class="text-body-2 font-weight-medium">María González</div>
              </div>
            </div>
          </v-col>

          <v-col cols="12" sm="6" class="pb-1">
            <div class="d-flex align-center mb-3">
              <v-icon icon="mdi-finance" class="mr-2" color="primary" size="small"></v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Presupuesto</div>
                <div class="text-body-2 font-weight-medium">$2,500.00</div>
              </div>
            </div>
            <div class="d-flex align-center mb-3">
              <v-icon icon="mdi-calendar-end" class="mr-2" color="primary" size="small"></v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Fecha de Cierre</div>
                <div class="text-body-2 font-weight-medium">30/06/2023</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
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
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.activity-header {
  padding-bottom: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px 12px 0 0;
}

.activity-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  line-height: 1.2;
  color: var(--v-primary-darken1);
  margin-bottom: 0;
}

.activity-subtitle {
  font-size: 1rem;
  font-weight: 400;
  color: var(--v-secondary-darken1);
  line-height: 1.4;
  margin-bottom: 0;
}

.activity-title-container {
  min-width: 0; /* Permite que el texto se ajuste correctamente */
}

.activity-content {
  padding-top: 16px;
}

.status-chip {
  height: 24px;
  font-weight: 500;
}

/* Mejora la apariencia de los chips */
.v-chip {
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* Ajustes responsivos */
@media (max-width: 960px) {
  .activity-title {
    font-size: 1.3rem;
  }

  .activity-subtitle {
    font-size: 0.9rem;
  }

  .activity-header .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .activity-header .d-flex.align-end {
    flex-direction: row;
    margin-top: 8px;
    width: 100%;
    justify-content: flex-start;
  }

  .activity-header .d-flex.align-end .v-chip {
    margin-right: 8px;
    margin-bottom: 4px;
  }
}

@media (max-width: 600px) {
  .activity-card {
    margin: 8px 0;
  }

  .activity-header,
  .activity-content {
    padding: 16px;
  }

  .activity-title {
    font-size: 1.2rem;
  }

  .activity-header .d-flex {
    flex-wrap: wrap;
  }
}

/* Animaciones suaves */
.activity-card,
.v-icon,
.v-chip {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mejora el aspecto del divider */
.v-divider {
  border-color: rgba(0, 0, 0, 0.12);
  margin: 0 16px;
}

/* Estilos para las tarjetas de información */
.text-caption.text-medium-emphasis {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
}

.text-body-2.font-weight-medium {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
}

/* Espaciado consistente */
.mb-3 {
  margin-bottom: 12px;
}

.pa-4 {
  padding: 16px;
}
</style>
