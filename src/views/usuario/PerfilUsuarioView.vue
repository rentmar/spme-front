<template>
  <v-container class="profile-container">
    <LoadingOverlay
      :isLoading="loading"
      :loadingMessage="loadingMessage"
      :loadingProgress="loadingProgress"
      :loadingError="error"
      progressType="circular"
    />

    <!-- CONTENIDO PRINCIPAL -->
    <template v-if="usuario">
      <v-row>
        <v-col cols="12">
          <!--Encabezado-->
          <PaginaTituloIcono :titulo="'MI PERFIL'" :icon="'mdi-account-circle'" />

          <v-card variant="outlined" class="mb-4">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title>INFORMACIÓN PERSONAL</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text>
              <div class="profile-content">
                <div class="avatar-section">
                  <v-avatar size="150" class="profile-avatar">
                    <v-icon size="100" color="primary">mdi-account-circle</v-icon>
                  </v-avatar>
                </div>

                <div class="profile-info">
                  <v-table density="comfortable" class="profile-table">
                    <tbody>
                      <tr>
                        <td class="info-label">ID:</td>
                        <td>{{ usuario.id }}</td>
                      </tr>
                      <tr>
                        <td class="info-label">Usuario:</td>
                        <td>{{ usuario.usuario }}</td>
                      </tr>
                      <tr>
                        <td class="info-label">Nombre:</td>
                        <td>{{ usuario.nombre }}</td>
                      </tr>
                      <tr>
                        <td class="info-label">Apellido Paterno:</td>
                        <td>{{ usuario.paterno }}</td>
                      </tr>
                      <tr>
                        <td class="info-label">Apellido Materno:</td>
                        <td>{{ usuario.materno }}</td>
                      </tr>
                      <tr>
                        <td class="info-label">Documento de Identidad:</td>
                        <td>{{ usuario.ci }}</td>
                      </tr>
                      <tr>
                        <td class="info-label">Cargo:</td>
                        <td>{{ usuario.cargo }}</td>
                      </tr>
                      <tr>
                        <td class="info-label">Banco:</td>
                        <td>{{ usuario.banco }}</td>
                      </tr>
                      <tr>
                        <td class="info-label">Numero de Cuenta:</td>
                        <td>{{ usuario.numeroCuenta }}</td>
                      </tr>
                      <tr>
                        <td class="info-label">Tipo de Cuenta:</td>
                        <td>{{ usuario.tipoCuenta }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
//Overlay de carga
import LoadingOverlay from '@/components/layout/partials/LoadingOverlay.vue'

//Iniciar el composable de usuarios
const { loading, error, usuario, informacionUsuarioPorNick } = useUsuario()

//Mensaje de carga
const loadingMessage = ref('')

// Hook - Al iniciar el componente ejecuta la funcion cargar()
onMounted(() => {
  cargar()
})

//La funcion cargar llama a la funcion del composable que se conecta al restAPI
const cargar = async () => {
  loadingMessage.value = 'Buscando informacion del Usuario ....'
  try {
    await informacionUsuarioPorNick({
      usuario: 'ACarvajal',
    })
  } catch (err) {
    console.error('Error al cargar al usuario', err)
  } finally {
    loadingMessage.value = ''
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (min-width: 960px) {
  .profile-content {
    flex-direction: row;
  }
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 250px;
}

.profile-avatar {
  border: 4px solid #f5f5f5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-info {
  flex-grow: 1;
}

.profile-table {
  background-color: transparent;
}

.profile-table td {
  border-bottom: none !important;
  padding: 8px 0;
}

.info-label {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);
  width: 180px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
}

.avatar-actions {
  display: flex;
  justify-content: center;
}
</style>
