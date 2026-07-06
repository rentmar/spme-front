<template>
  <v-card elevation="2" rounded="lg" class="mb-4 redactor-card">
    <!-- Encabezado estilo toolbar -->
    <v-toolbar color="secondary" density="compact">
      <v-toolbar-title class="text-white">
        <v-icon class="mr-2">
          <slot name="icono-encabezado">mdi-pencil-outline</slot>
        </v-icon>
        <slot name="titulo-encabezado">Redactor</slot>
      </v-toolbar-title>
    </v-toolbar>

    <!-- Contenido principal -->
    <v-card-text class="pa-4">
      <!-- Sección de Información del Documento -->
      <div class="section-container">
        <div class="section-header">
          <v-icon size="16" color="info" class="mr-1">
            <slot name="icono-documento">mdi-file-document-outline</slot>
          </v-icon>
          <span class="section-title">
            <slot name="titulo-documento">Documento</slot>
          </span>
          <v-tooltip location="top" :open-delay="300">
            <template v-slot:activator="{ props: tooltipProps }">
              <v-icon v-bind="tooltipProps" size="14" color="grey-lighten-1" class="ml-auto">
                mdi-information-outline
              </v-icon>
            </template>
            <span>Informacion del documento en proceso de redaccion</span>
          </v-tooltip>
        </div>

        <div class="section-content">
          <slot name="documento-content">
            <div class="empty-state">
              <v-icon size="24" color="grey-lighten-1">mdi-file-document-off</v-icon>
              <p class="text-caption text-grey">No hay Informacion del Documento</p>
            </div>
          </slot>
        </div>
      </div>

      <!-- Divisor -->
      <v-divider class="my-4"></v-divider>

      <!-- Sección de Redactores -->
      <div class="section-container">
        <div class="section-header">
          <v-icon size="16" color="info" class="mr-1">
            <slot name="icono-redactores">mdi-account-edit</slot>
          </v-icon>
          <span class="section-title">
            <slot name="titulo-redactores">Redactores</slot>
          </span>
          <v-tooltip location="top" :open-delay="300">
            <template v-slot:activator="{ props: tooltipProps }">
              <v-icon v-bind="tooltipProps" size="14" color="grey-lighten-1" class="ml-auto">
                mdi-information-outline
              </v-icon>
            </template>
            <span>Persona(s) encargada de redactar el documento</span>
          </v-tooltip>
        </div>

        <div class="section-content">
          <slot name="redactores-content">
            <div class="empty-state">
              <v-icon size="24" color="grey-lighten-1">mdi-account-off</v-icon>
              <p class="text-caption text-grey">Redactor(es) no asignado(s)</p>
            </div>
          </slot>
        </div>
      </div>

      <!-- Divisor -->
      <v-divider class="my-4"></v-divider>

      <!-- Sección de Mi Redacción -->
      <div class="section-container">
        <div class="section-header">
          <v-icon size="16" color="info" class="mr-1">
            <slot name="icono-redaccion">mdi-pencil-box-outline</slot>
          </v-icon>
          <span class="section-title">
            <slot name="titulo-redaccion">Mi Redaccion</slot>
          </span>
          <v-tooltip location="top" :open-delay="300">
            <template v-slot:activator="{ props: tooltipProps }">
              <v-icon v-bind="tooltipProps" size="14" color="grey-lighten-1" class="ml-auto">
                mdi-information-outline
              </v-icon>
            </template>
            <span>Redactar/Editar el documento</span>
          </v-tooltip>
        </div>

        <div class="section-content">
          <slot name="redaccion-content">
            <div class="empty-state">
              <v-icon size="24" color="grey-lighten-1">mdi-account-off</v-icon>
              <p class="text-caption text-grey">Redactor no asignado</p>
            </div>
          </slot>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Componente base - Solo presentación
</script>

<style scoped>
.redactor-card {
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.redactor-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-1px);
}

.section-container {
  margin-bottom: 0;
}

.section-container:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 2px solid rgba(var(--v-theme-info), 0.1);
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

.section-container {
  transition: all 0.3s ease;
}

:deep(.v-divider) {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 16px 0;
}

.ml-auto {
  margin-left: auto;
  cursor: help;
}

:deep(.v-toolbar) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

:deep(.v-toolbar-title) {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}
</style>
