<template>
  <v-card elevation="3" rounded="lg" class="base-card">
    <v-card-item>
      <!-- Icono -->
      <template #prepend>
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

      <!-- Slot para el subtítulo -->
      <v-card-subtitle>
        <slot name="subtitulo">Subtítulo por defecto</slot>
      </v-card-subtitle>
    </v-card-item>

    <!-- Contenido principal -->
    <v-card-text>
      <!-- Sección Información Documento / Estado -->
      <div v-if="mostrarEstadoDocumento" class="section-documento">
        <div class="section-header">
          <v-icon size="16" color="primary" class="mr-1">mdi-file-document</v-icon>
          <span class="section-title">Estado del Documento</span>
        </div>

        <div class="section-content">
          <slot name="estado-documento">
            <div class="empty-state">
              <v-icon size="24" color="grey-lighten-1">mdi-file-document-outline</v-icon>
              <p class="text-caption text-grey">No hay información del documento</p>
            </div>
          </slot>
        </div>
      </div>

      <!-- Divisor (solo se muestra si ambas secciones son visibles) -->
      <v-divider v-if="mostrarEstadoDocumento && mostrarRevisores" class="my-4" />

      <!-- Sección de Revisores -->
      <div v-if="mostrarRevisores" class="section-revisores">
        <div class="section-header">
          <v-icon size="16" color="primary" class="mr-1">mdi-account-group</v-icon>
          <span class="section-title">Revisores</span>
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

      <!-- Divisor (se muestra si al menos una sección anterior es visible) -->
      <v-divider
        v-if="(mostrarEstadoDocumento || mostrarRevisores) && mostrarRedactor"
        class="my-4"
      />

      <!-- Sección de Redactor Actual -->
      <div v-if="mostrarRedactor" class="section-redactor-actual">
        <div class="section-header">
          <v-icon size="16" color="primary" class="mr-1">mdi-account-edit</v-icon>
          <span class="section-title">Redactor</span>
        </div>

        <!-- Información del redactor -->
        <div class="section-content mb-3">
          <slot name="info-redactor">
            <div class="empty-state">
              <v-icon size="24" color="grey-lighten-1">mdi-account-question</v-icon>
              <p class="text-caption text-grey">No hay redactor asignado</p>
            </div>
          </slot>
        </div>

        <!-- Acciones para el redactor -->
        <div class="section-content">
          <slot name="acciones-redactor">
            <div class="empty-state">
              <v-icon size="24" color="grey-lighten-1">mdi-gesture-tap-button</v-icon>
              <p class="text-caption text-grey">No hay acciones disponibles</p>
            </div>
          </slot>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  mostrarEstadoDocumento: {
    type: Boolean,
    default: true,
  },
  mostrarRevisores: {
    type: Boolean,
    default: true,
  },
  mostrarRedactor: {
    type: Boolean,
    default: true,
  },
})
</script>

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

/* Espaciado entre elementos */
.mb-3 {
  margin-bottom: 12px;
}

/* Secciones con espaciado */
.section-documento,
.section-revisores {
  margin-bottom: 16px;
}

.section-redactor-actual {
  margin-bottom: 0;
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
.section-documento,
.section-revisores,
.section-redactor-actual {
  transition: all 0.3s ease;
}

/* Estilo para el divisor */
:deep(.v-divider) {
  border-color: rgba(0, 0, 0, 0.08);
}
</style>
