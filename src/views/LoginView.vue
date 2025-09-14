<script setup>
import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const usuario = ref('');
const password = ref('');
const usuarioError = ref('');
const passwordError = ref('');
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('danger');
const router = useRouter();
const userStore = useUserStore();


const displayAlert = (message, type) => {
  alertMessage.value = message;
  alertType.value = type;
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
    alertMessage.value = '';
  }, 5000);
};

const validateLoginForm = () => {
  usuarioError.value = '';
  passwordError.value = '';

  let isValid = true;

  if (usuario.value.trim() === '') {
    usuarioError.value = 'Ingresa Nombre de usuario.';
    isValid = false;
  }

  if (password.value.trim() === '') {
    passwordError.value = 'Ingresa Contraseña.';
    isValid = false;
  }

  return isValid;
};

const btnlogin = async () => {
  if (!validateLoginForm()) {
    return;
  }
  try {
    const response = await axios.post('http://127.0.0.1:8000/autenticacion_api/autenticarUsuario/', {
      usuario: usuario.value,
      password: password.value
    });
    if (response.data.validacion === true) {
       userStore.setUserData({
        usuario: response.data.usuario,
        rol: response.data.rol,
      });
      router.push('/home');
    } else {
      displayAlert(response.data.mensaje, 'danger');
    }
  } catch (error) {
    console.error('Login failed:', error);
    displayAlert('Error de servicio. Por favor, inténtelo mas tarde.', 'danger');
  }
};
</script>
<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="row w-100 justify-content-center">
      <div class="col-sm-10 col-md-8 col-lg-6">

        <div v-if="showAlert" :class="`alert alert-${alertType} mb-3`" role="alert">
          {{ alertMessage }}
        </div>

        <div class="card p-4">
          <div class="row">
            <div class="col-sm-6">
              <h2 class="text-center mb-4">Login</h2>
              <form autocomplete="off" id="formLogin" @submit.prevent="btnlogin">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': usuarioError }"
                    placeholder="Usuario"
                    id="txtusuario"
                    v-model="usuario"
                    required
                  />
                  <span class="input-group-text">
                    <img src="../assets/img/person-circle.svg" alt="Usuario" class="icono" style="height: 1.25rem;">
                  </span>
                  <div class="invalid-feedback" v-if="usuarioError">
                    {{ usuarioError }}
                  </div>
                </div>
                <br>

                <div class="input-group has-validation">
                  <input
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': passwordError }"
                    placeholder="Password"
                    id="txtpwd"
                    v-model="password"
                    required
                  />
                  <span class="input-group-text">
                    <img src="../assets/img/lock-fill.svg" alt="Password" class="icono" style="height: 1.25rem;">
                  </span>
                  <div class="invalid-feedback" v-if="passwordError">
                    {{ passwordError }}
                  </div>
                </div>
                <br><br>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-success" id="btnlogin">Ingresar</button>
                </div>
              </form>
            </div>
            <div class="col-sm-6 d-flex align-items-center justify-content-center">
              <img src="../assets/img/logo.png" alt="Logo" class="logo img-fluid">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
</style>
