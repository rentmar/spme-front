<template>
  <v-container>
    <v-card>
      <v-card-title>Formulario de Perfil de Usuario</v-card-title>
      <v-card-text>
        <v-form v-if="user">
          <v-text-field
            v-model="user.name"
            label="Nombre"
            prepend-icon="mdi-account"
            readonly
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            label="Correo Electrónico"
            prepend-icon="mdi-email"
            readonly
          ></v-text-field>
          </v-form>
        <v-progress-circular
          v-else
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// Define el estado reactivo para el usuario
const user = ref(null);
const route = useRoute();

// Función para simular la obtención de datos del usuario desde una API
const fetchUser = async () => {
  // Aquí es donde realizarías la llamada a tu API, por ejemplo:
  // const response = await fetch('/api/user/me');
  // const data = await response.json();
  // user.value = data;

  // Para este ejemplo, simulamos los datos
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simula un retraso de 1 segundo
  user.value = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    id: route.params.id // Esto es un ejemplo si la URL tiene un parámetro
  };
};

// Se ejecuta cuando el componente se monta
onMounted(() => {
  console.log('Componente montado. Cargando datos del usuario...');
  fetchUser();
});
</script>
