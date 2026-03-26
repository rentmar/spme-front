<script setup>
import { ref, onMounted } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Refs para los campos del formulario
const usuario = ref('')
const password = ref('')
const usuarioError = ref('')
const passwordError = ref('')
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref('danger')
const isLoading = ref(false) //Bandera de carga del login
const showPassword = ref(false)

// Stores y router
const router = useRouter()
const userStore = useUserStore()

// Verificar si ya está autenticado al cargar el componente
onMounted(async () => {
  console.log('🔍 Verificando sesión existente...')

  // Inicializar la sesión si hay token en localStorage
  if (!userStore.initialized) {
    await Promise.all([userStore.initialize()])
  }

  // Si ya está autenticado, redirigir al home
  if (userStore.isAuthenticated) {
    console.log('✅ Usuario ya autenticado, redirigiendo...')
    console.log('Datos del usuario:', userStore.userData)
    router.push('/home')
  } else {
    console.log('❌ Usuario no autenticado')
  }
})

const displayAlert = (message, type) => {
  alertMessage.value = message
  alertType.value = type
  showAlert.value = true
  setTimeout(() => {
    showAlert.value = false
    alertMessage.value = ''
  }, 5000)
}

const validateLoginForm = () => {
  usuarioError.value = ''
  passwordError.value = ''

  let isValid = true

  if (usuario.value.trim() === '') {
    usuarioError.value = 'Ingresa Nombre de usuario.'
    isValid = false
  }

  if (password.value.trim() === '') {
    passwordError.value = 'Ingresa Contraseña.'
    isValid = false
  }

  return isValid
}

const btnlogin = async () => {
  if (!validateLoginForm()) {
    return
  }

  isLoading.value = true

  try {
    console.log('🔄 Iniciando login para usuario:', usuario.value)

    const response = await userStore.login({
      username: usuario.value,
      password: password.value,
    })

    if (userStore.isAuthenticated) {
      setTimeout(() => {
        router.push('/home')
      }, 1000)
    } else {
      displayAlert(
        'Credenciales incorrectas. Por favor, verifique su usuario y contraseña.',
        'danger',
      )
    }
  } catch (error) {
    console.error('❌ Login failed:', error)
    displayAlert('Error de servicio. Por favor, inténtelo mas tarde.', 'danger')
  } finally {
    isLoading.value = false
  }
}

// Función para probar el store manualmente
const testStore = () => {
  console.log('🧪 Probando store:')
  console.log('- userStore:', userStore)
  console.log('- isAuthenticated:', userStore.isAuthenticated)
  console.log('- usuario:', userStore.usuario)
  console.log('- rol:', userStore.rol)
  console.log('- userData:', userStore.userData)
}

//Funcion para esconder mostrar pwd
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="row w-100 justify-content-center">
      <div class="col-sm-10 col-md-8 col-lg-6">
        <!-- Botón de prueba (solo desarrollo) -->
        <button v-if="false" @click="testStore" class="btn btn-info btn-sm mb-3">
          Probar Store
        </button>

        <!-- Alertas -->
        <div v-if="showAlert" :class="`alert alert-${alertType} mb-3`" role="alert">
          {{ alertMessage }}
        </div>

        <div class="card p-4">
          <div class="row">
            <div class="col-sm-6">
              <h2 class="text-center mb-4">Login</h2>
              <form autocomplete="off" id="formLogin" @submit.prevent="btnlogin">
                <!-- Campo de usuario -->
                <div class="mb-3">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': usuarioError }"
                      placeholder="Usuario"
                      id="txtusuario"
                      v-model="usuario"
                      :disabled="isLoading"
                      required
                      autocomplete="username"
                    />
                    <span class="input-group-text">
                      <img
                        src="../assets/img/person-circle.svg"
                        alt="Usuario"
                        class="icono"
                        style="height: 1.25rem"
                      />
                    </span>
                  </div>
                  <div class="invalid-feedback d-block" v-if="usuarioError">
                    {{ usuarioError }}
                  </div>
                </div>

                <!-- Campo de contraseña con toggle -->
                <div class="mb-3">
                  <div class="input-group has-validation">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      :class="{ 'is-invalid': passwordError }"
                      placeholder="Password"
                      id="txtpwd"
                      v-model="password"
                      :disabled="isLoading"
                      required
                      autocomplete="current-password"
                    />
                    <button
                      class="btn btn-outline-secondary toggle-password-btn"
                      type="button"
                      @click="togglePasswordVisibility"
                      :disabled="isLoading"
                      tabindex="-1"
                    >
                      <img
                        v-if="showPassword"
                        src="../assets/img/eye-slash-fill.svg"
                        alt="Ocultar contraseña"
                        style="height: 1.25rem"
                      />
                      <img
                        v-else
                        src="../assets/img/eye-fill.svg"
                        alt="Mostrar contraseña"
                        style="height: 1.25rem"
                      />
                    </button>
                  </div>
                  <div class="invalid-feedback d-block" v-if="passwordError">
                    {{ passwordError }}
                  </div>
                </div>

                <!-- Botón de submit -->
                <div class="d-grid gap-2">
                  <button type="submit" class="btn custom-btn" id="btnlogin" :disabled="isLoading">
                    <span
                      v-if="isLoading"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {{ isLoading ? 'Validando...' : 'Ingresar' }}
                  </button>
                </div>
              </form>

              <!-- Información de debug (solo desarrollo) -->
              <div v-if="false" class="mt-3 p-2 border rounded">
                <h6>Debug Store:</h6>
                <p><strong>Autenticado:</strong> {{ userStore.isAuthenticated }}</p>
                <p><strong>Usuario:</strong> {{ userStore.usuario }}</p>
                <p><strong>Rol:</strong> {{ userStore.rol }}</p>
                <p><strong>Initialized:</strong> {{ userStore.initialized }}</p>
              </div>
            </div>
            <div class="col-sm-6 d-flex align-items-center justify-content-center">
              <img src="../assets/img/logo.png" alt="Logo" class="logo img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: #ddd3d3;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Estilos para los inputs y grupos */
.input-group {
  width: 100%;
}

.input-group-text {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.form-control {
  border-color: #ced4da;
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: #db7810;
  box-shadow: 0 0 0 0.2rem rgba(219, 120, 16, 0.25);
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.form-control:disabled {
  background-color: #e9ecef;
  opacity: 0.7;
}

/* Estilos para el botón de toggle de contraseña */
.toggle-password-btn {
  background-color: #e9ecef;
  border-color: #ced4da;
  border-left: none;
  transition: all 0.2s ease;
  padding: 0.375rem 0.75rem;
}

.toggle-password-btn:hover:not(:disabled) {
  background-color: #dee2e6;
  border-color: #ced4da;
}

.toggle-password-btn:focus {
  box-shadow: none;
  outline: none;
}

.toggle-password-btn:active:not(:disabled) {
  background-color: #ced4da;
}

.toggle-password-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  background-color: #e9ecef;
}

/* Estilos para los mensajes de error */
.invalid-feedback {
  font-size: 0.875rem;
  margin-top: 0.25rem;
  color: #dc3545;
}

/* Estilos para el botón personalizado */
.custom-btn {
  background-color: #db7810;
  border-color: #db7810;
  color: white;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
  font-weight: 500;
}

.custom-btn:hover:not(:disabled) {
  background-color: #c1670f;
  border-color: #c1670f;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-btn:active:not(:disabled) {
  transform: translateY(0);
}

.custom-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #db7810;
  border-color: #db7810;
}

/* Estilos para el spinner durante carga */
.spinner-border {
  width: 1rem;
  height: 1rem;
  vertical-align: middle;
}

/* Estilos para las imágenes dentro de los inputs */
.input-group-text img {
  filter: brightness(0.5);
  transition: filter 0.2s ease;
}

.input-group-text:hover img {
  filter: brightness(0.3);
}

/* Asegurar consistencia en la altura de los elementos */
.form-control,
.input-group-text,
.toggle-password-btn {
  height: 38px;
}

/* Mejorar espaciado entre campos */
.mb-3 {
  margin-bottom: 1rem;
}

/* Estilos para el título */
h2 {
  color: #333;
  font-weight: 600;
  margin-bottom: 1.5rem !important;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .card {
    padding: 1.5rem !important;
  }

  h2 {
    font-size: 1.5rem;
  }

  .logo {
    max-width: 150px;
  }

  .form-control,
  .input-group-text,
  .toggle-password-btn {
    height: 35px;
  }
}

@media (max-width: 576px) {
  .card {
    padding: 1rem !important;
  }

  h2 {
    font-size: 1.25rem;
  }

  .logo {
    max-width: 120px;
  }
}

/* Estilo para el logo */
.logo {
  max-width: 100%;
  height: auto;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.02);
}

/* Animación para las alertas */
.alert {
  animation: slideInDown 0.3s ease;
}

@keyframes slideInDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Mejoras en la accesibilidad */
.form-control:focus,
.custom-btn:focus,
.toggle-password-btn:focus {
  outline: none;
}

/* Estilo para los placeholders */
.form-control::placeholder {
  color: #6c757d;
  opacity: 0.7;
}

/* Mejora en la separación de los elementos del input-group */
.input-group > :not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.input-group > :not(:last-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
