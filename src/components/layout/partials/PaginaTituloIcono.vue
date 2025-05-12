<template>
  <div>
    <h1 class="title-container">
      <v-icon :icon="icon" size="default" class="mr-2" :color="iconColor"></v-icon>
      {{ titulo }}
    </h1>
    <p v-if="subtitulo" class="text-subtitle-1 text-medium-emphasis">{{ subtitulo }}</p>
    <v-divider v-if="subtitulo"></v-divider>
  </div>
</template>

<script setup>
// Definición de props
defineProps({
  titulo: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'mdi-information', // Icono por defecto
  },
  iconColor: {
    type: String,
    default: 'primary', // Color por defecto
  },
  subtitulo: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
/* Estilos para el título principal */
.title-container {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.title-container h1 {
  font-size: 2.2rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  line-height: 1.2;
  color: var(--v-primary-darken1);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.title-container .v-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
  color: inherit;
}

.title-container p.subtitle {
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--v-secondary-darken1);
  margin-left: 3.5rem; /* Alineado con el texto del título */
  line-height: 1.4;
}

/* Ajustes responsivos */
@media (max-width: 960px) {
  .title-container h1 {
    font-size: 1.8rem;
  }

  .title-container .v-icon {
    font-size: 2rem;
  }

  .title-container p.subtitle {
    font-size: 1rem;
    margin-left: 3rem;
  }
}
</style>
