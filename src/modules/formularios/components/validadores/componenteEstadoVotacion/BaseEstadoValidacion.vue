<template>
  <v-card elevation="3" rounded="lg" class="base-card">
    <v-card-item>
      <!-- Icono-->
      <template v-slot:prepend>
        <slot name="icono">
          <v-avatar color="primary" size="40">
            <v-icon color="white">mdi-card</v-icon>
          </v-avatar>
        </slot>
      </template>

      <!-- Slot para el título -->
      <v-card-title>
        <slot name="titulo">Título por defecto</slot>
      </v-card-title>

      <!-- Slot para el subtitulo-->
      <v-card-subtitle>
        <slot name="subtitulo">Subtitulo por defecto</slot>
      </v-card-subtitle>
    </v-card-item>

    <!-- Contenido principal-->
    <v-card-text>
      <!-- Sección de Revisores -->
      <div class="section-revisores">
        <div class="section-header">
          <v-icon size="16" color="primary" class="mr-1">mdi-account-group</v-icon>
          <span class="section-title">Revisores Asignados</span>
        </div>

        <div class="section-content">
          <slot name="revisores">
            <div class="empty-state">
              <v-icon size="24" color="grey-lighten-1">mdi-account-off</v-icon>
              <p class="text-caption text-grey">No hay revisores asignados</p>
            </div>
          </slot>
        </div>
      </div>

      <!-- Divisor -->
      <v-divider class="my-4"></v-divider>

      <!-- Sección de Revisor Actual -->
      <div class="section-revisor-actual">
        <div class="section-header">
          <v-icon size="16" color="primary" class="mr-1">mdi-account-check</v-icon>
          <span class="section-title">Mi Validación</span>
        </div>

        <div class="section-content">
          <slot name="revisor-actual">
            <div class="empty-state">
              <v-icon size="24" color="grey-lighten-1">mdi-account-question</v-icon>
              <p class="text-caption text-grey">No tienes validación pendiente</p>
            </div>
          </slot>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup></script>

<style scoped>
.base-card {
  margin-bottom: 16px;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.base-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-1px);
}

/* Ajustes del card-item */
:deep(.v-card-item) {
  padding: 16px 16px 8px 16px;
}

/* Separación entre avatar y textos */
:deep(.v-card-item__prepend) {
  margin-right: 12px;
}

/* Estilo del título */
:deep(.v-card-title) {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
  padding: 0;
  margin-bottom: 2px;
  color: rgba(0, 0, 0, 0.9);
}

/* Estilo del subtítulo */
:deep(.v-card-subtitle) {
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.4;
  padding: 0;
  color: rgba(0, 0, 0, 0.6);
}

/* Contenido principal */
:deep(.v-card-text) {
  padding: 16px;
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.8);
}

/* Último elemento sin margen inferior */
:deep(.v-card-text > *:last-child) {
  margin-bottom: 0;
}

/* Estilos para las secciones */
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.1);
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(0, 0, 0, 0.7);
}

.section-content {
  min-height: 40px;
}

/* Estado vacío */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
}

.empty-state p {
  margin-top: 8px;
  margin-bottom: 0;
}

/* Animación suave para contenido dinámico */
.section-revisores,
.section-revisor-actual {
  transition: all 0.3s ease;
}

/* Estilo para el divisor */
:deep(.v-divider) {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 16px 0;
}
</style>
