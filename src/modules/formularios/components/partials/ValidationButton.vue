<template>
  <div class="validation-button" :class="{ 'boton-con-etiqueta': config.showLabel }">
    <v-tooltip :text="config.tooltip" location="top">
      <template v-slot:activator="{ props }">
        <!-- Botón principal - IDÉNTICO A LA VISTA ORIGINAL -->
        <v-btn
          v-bind="props"
          :icon="config.icon"
          :color="config.color"
          :disabled="disabled"
          @click="$emit('click')"
          size="small"
          variant="text"
          class="boton-icono"
          :class="{
            'primary--text': config.color === 'primary',
            'deep-purple--text': config.color === 'deep-purple',
            'teal-lighten-2--text': config.color === 'teal-lighten-2',
            'warning--text': config.color === 'warning',
            'error--text': config.color === 'error',
          }"
        >
          <v-icon>{{ config.icon }}</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <!-- Etiqueta debajo del botón (opcional) -->
    <div v-if="config.showLabel" class="etiqueta">
      {{ config.label }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  config: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>

<style scoped>
.validation-button {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

/* ESTILOS IDÉNTICOS A LA VISTA ORIGINAL */
.boton-icono {
  min-width: 32px;
  height: 32px;
  border-radius: 4px;
}

/* Efectos hover idénticos a la vista original */
.boton-icono:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.boton-con-etiqueta .boton-icono {
  margin-bottom: 4px;
}

.etiqueta {
  font-size: 10px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  line-height: 1.2;
  max-width: 50px;
  word-wrap: break-word;
}
</style>
