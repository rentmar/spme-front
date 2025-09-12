<template>
  <div class="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-4 text-center">
    <h1 class="text-2xl font-bold text-gray-800">Generador de UID</h1>
    <p class="text-gray-600">Haz clic en el botón para generar un nuevo identificador único.</p>

    <div class="flex items-center justify-center space-x-2">
      <v-text-field
        v-model="uid"
        label="ID generado"
        readonly
        outlined
        hide-details
      ></v-text-field>
      <v-btn
        @click="generateUID"
        color="primary"
        class="flex-shrink-0"
      >
        Generar UID
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const uid = ref('');

/**
 * @description Genera un nuevo UID usando la API de criptografía del navegador.
 * Este método es seguro y no requiere bibliotecas externas.
 * @returns {void}
 */
const generateUID = () => {
  // crypto.randomUUID() genera un UUID v4 (Universally Unique Identifier).
  uid.value = crypto.randomUUID();
};

// Genera un UID inicial al cargar el componente
generateUID();
</script>

<style scoped>
.v-text-field {
  flex-grow: 1;
}
</style>
