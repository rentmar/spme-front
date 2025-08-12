<template>
  <form @submit.prevent="enviarFormulario">
    <label for="nombre">Nombre:</label>
    <input type="text" id="nombre" v-model="formulario.nombre"><br><br>

    <label for="email">Email:</label>
    <input type="email" id="email" v-model="formulario.email"><br><br>

    <button type="submit">Enviar</button>
  </form>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      formulario: {
        nombre: '',
        email: ''
      }
    }
  },
  methods: {
    enviarFormulario() {
      axios.post('https://ejemplo.com/api/formulario', this.formulario)
        .then(response => {
          console.log(response.data);
          // Manejar la respuesta exitosa
        })
        .catch(error => {
          console.error(error);
          // Manejar errores
        });
    }
  }
}
</script>
