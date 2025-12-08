<script setup>
import { ref, onMounted } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
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

// Stores y router
const router = useRouter()
const userStore = useUserStore()

// Verificar si ya está autenticado al cargar el componente
onMounted(async () => {
  console.log('🔍 Verificando sesión existente...')

  // Inicializar la sesión si hay token en localStorage
  if (!userStore.initialized) {
    await userStore.initialize()
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

  try {
    console.log('🔄 Iniciando login para usuario:', usuario.value)

    // const response = await axios.post(
    //   'http://127.0.0.1:8000/autenticacion_api/autenticarUsuario/',
    //   {
    //     usuario: usuario.value,
    //     password: password.value,
    //   },
    // )

    const response = await userStore.login({
      username: usuario.value,
      password: password.value,
    })

    if (userStore.isAuthenticated) {
      setTimeout(() => {
        router.push('/home')
      }, 1000)
    }

    // if (response.data.validacion === true) {
    //   console.log('✅ Login exitoso, guardando datos en store...')

    //   // Usar el store para guardar los datos del usuario
    //   userStore.setUserData({
    //     usuario: response.data.usuario,
    //     rol: response.data.rol,
    //     permisos: response.data.permisos,
    //   })

    //   // Mostrar datos en consola para debug
    //   console.log('📊 Datos guardados en store:')
    //   console.log('- Usuario:', userStore.usuario)
    //   console.log('- Rol:', userStore.rol)
    //   console.log('- Permisos:', userStore.permisos)
    //   console.log('- Autenticado:', userStore.isAuthenticated)
    //   console.log('- Datos completos:', userStore.userData)

    //   displayAlert('¡Inicio de sesión exitoso!', 'success')

    //   // Redirigir después de un breve delay
    //   setTimeout(() => {
    //     router.push('/home')
    //   }, 1000)
    // } else {
    //   displayAlert(response.data.mensaje, 'danger')
    // }
  } catch (error) {
    console.error('❌ Login failed:', error)
    displayAlert('Error de servicio. Por favor, inténtelo mas tarde.', 'danger')
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
                    <img
                      src="../assets/img/person-circle.svg"
                      alt="Usuario"
                      class="icono"
                      style="height: 1.25rem"
                    />
                  </span>
                  <div class="invalid-feedback" v-if="usuarioError">
                    {{ usuarioError }}
                  </div>
                </div>
                <br />

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
                    <img
                      src="../assets/img/lock-fill.svg"
                      alt="Password"
                      class="icono"
                      style="height: 1.25rem"
                    />
                  </span>
                  <div class="invalid-feedback" v-if="passwordError">
                    {{ passwordError }}
                  </div>
                </div>
                <br /><br />

                <div class="d-grid gap-2">
                  <button type="submit" class="btn custom-btn" id="btnlogin">Ingresar</button>
                </div>
              </form>

              <!-- Información de debug (solo desarrollo) -->
              <div v-if="false" class="mt-3 p-2 border rounded">
                <!-- Cambiar a true para ver debug -->
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
body {
  background-color: #efe0bc;
}

.card {
  background-color: #ddd3d3;
}

.custom-btn {
  background-color: #db7810;
  border-color: #db7810;
  color: white;
}

.custom-btn:hover {
  background-color: #c1670f;
  border-color: #c1670f;
}
</style>
