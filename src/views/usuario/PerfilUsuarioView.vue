<template>
  <v-container fluid class="profile-container pa-0 ma-0">
    <LoadingOverlay
      :isLoading="loading"
      :loadingMessage="loadingMessage"
      :loadingError="error"
      progressType="circular"
    />

    <!-- CONTENIDO PRINCIPAL -->
    <template v-if="usuario">
      <PaginaTituloIcono :icon="'mdi-account-circle'" :titulo="'Mi Perfil'"></PaginaTituloIcono>

      <v-row class="profile-content mx-0">
        <v-col cols="12" class="pa-6">
          <!-- CARD PRINCIPAL CON AVATAR -->
          <v-card class="profile-main-card mb-6" variant="flat">
            <v-card-text class="pa-6">
              <v-row align="center">
                <!-- AVATAR -->
                <v-col cols="12" md="3" class="text-center">
                  <v-avatar size="150" class="profile-avatar elevation-4 mb-4">
                    <v-icon size="80" color="primary">mdi-account-circle</v-icon>
                  </v-avatar>
                  <div class="text-h6 font-weight-bold">{{ usuario.nombre }}</div>
                  <div class="text-subtitle-1">{{ usuario.paterno }} {{ usuario.materno }}</div>
                  <v-chip color="primary" class="mt-2" size="small">
                    <v-icon start icon="mdi-account" size="16"></v-icon>
                    {{ usuario.username }}
                  </v-chip>
                </v-col>

                <!-- CARGO DESTACADO -->
                <v-col cols="12" md="9">
                  <div class="cargo-highlight mb-6">
                    <div class="d-flex align-center mb-2">
                      <v-icon icon="mdi-briefcase" color="primary" class="mr-2"></v-icon>
                      <div class="text-subtitle-1 font-weight-bold text-primary">CARGO</div>
                    </div>
                    <div class="text-h5 font-weight-bold">{{ usuario.cargo }}</div>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-card-account-details" class="mr-3 text-grey"></v-icon>
                        <div>
                          <div class="text-caption text-grey">DOCUMENTO</div>
                          <div class="text-body-1 font-weight-medium">{{ usuario.ci }}</div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- SECCIÓN DE INFORMACIÓN PERSONAL -->
          <v-card class="info-section-card mb-6" variant="flat">
            <v-card-title class="section-title d-flex align-center">
              <v-icon icon="mdi-account-details" class="mr-2"></v-icon>
              INFORMACIÓN PERSONAL
            </v-card-title>

            <v-divider class="mb-4"></v-divider>

            <v-container fluid>
              <v-row>
                <v-col cols="12" md="6" class="pb-0">
                  <div class="info-row d-flex align-center mb-4">
                    <div class="info-label mr-4">Usuario:</div>
                    <div class="info-value">{{ usuario.username }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="pb-0">
                  <div class="info-row d-flex align-center mb-4">
                    <div class="info-label mr-4">Nombre:</div>
                    <div class="info-value">{{ usuario.nombre }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="pb-0">
                  <div class="info-row d-flex align-center mb-4">
                    <div class="info-label mr-4">Apellido Paterno:</div>
                    <div class="info-value">{{ usuario.paterno }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="pb-0">
                  <div class="info-row d-flex align-center mb-4">
                    <div class="info-label mr-4">Apellido Materno:</div>
                    <div class="info-value">{{ usuario.materno }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="pb-0">
                  <div class="info-row d-flex align-center mb-4">
                    <div class="info-label mr-4">Documento de Identidad:</div>
                    <div class="info-value">{{ usuario.ci }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="pb-0">
                  <div class="info-row d-flex align-center mb-4">
                    <div class="info-label mr-4">Cargo:</div>
                    <div class="info-value">{{ usuario.cargo }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>

          <!-- SECCIÓN DE INFORMACIÓN BANCARIA -->
          <v-card class="info-section-card" variant="flat">
            <v-card-title class="section-title d-flex align-center">
              <v-icon icon="mdi-bank" class="mr-2"></v-icon>
              INFORMACIÓN BANCARIA
            </v-card-title>

            <v-divider class="mb-4"></v-divider>

            <v-container fluid>
              <v-row>
                <v-col cols="12" md="6" class="pb-0">
                  <div class="info-row d-flex align-center mb-4">
                    <div class="info-label mr-4">Banco:</div>
                    <div class="info-value">{{ usuario.banco }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="pb-0">
                  <div class="info-row d-flex align-center mb-4">
                    <div class="info-label mr-4">Número de Cuenta:</div>
                    <div class="info-value">{{ usuario.numero_cuenta }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="pb-0">
                  <div class="info-row d-flex align-center mb-4">
                    <div class="info-label mr-4">Tipo de Cuenta:</div>
                    <div class="info-value">{{ usuario.tipo_cuenta }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import { useUserStore } from '@/stores/user'
//Overlay de carga
import LoadingOverlay from '@/components/layout/partials/LoadingOverlay.vue'

//Iniciar el composable de usuarios
//const { loading, error, usuario, informacionUsuarioPorNick } = useUsuario()
const usuario = ref(null)

//Iniciar el store
const storeUsuario = useUserStore()

//Mensaje de carga
const loadingMessage = ref('')

// Hook - Al iniciar el componente ejecuta la funcion cargar()
onMounted(() => {
  cargar()
})

//La funcion cargar llama a la funcion del composable que se conecta al restAPI
const loading = ref(false)
const error = ref(null)
const cargar = async () => {
  loading.value = true
  loadingMessage.value = 'Buscando informacion del Usuario ....'
  try {
    usuario.value = storeUsuario.userData?.user || 'invitado'
  } catch (err) {
    console.error('Error al cargar al usuario', err)
  } finally {
    loadingMessage.value = ''
    loading.value = false
  }
}
</script>

<style scoped>
.profile-container {
  height: calc(100vh - 64px);
  max-width: 100vw !important;
  background: #f8f9fa;
  overflow-y: auto;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-main-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid #e9ecef;
}

.profile-avatar {
  background: linear-gradient(135deg, var(--v-primary-lighten-3) 0%, var(--v-primary-base) 100%);
  border: 4px solid white;
}

.cargo-highlight {
  background: linear-gradient(
    135deg,
    var(--v-primary-lighten-5) 0%,
    var(--v-primary-lighten-4) 100%
  );
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid var(--v-primary-base);
}

.info-section-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid #e9ecef;
}

.section-title {
  color: var(--v-primary-base);
  font-size: 1.25rem;
  font-weight: 600;
  padding: 20px 24px 12px 24px;
}

.info-row {
  padding: 8px 0;
}

.info-label {
  min-width: 220px;
  font-weight: 500;
  color: #495057;
  font-size: 0.95rem;
}

.info-value {
  font-size: 1rem;
  font-weight: 400;
  color: #212529;
  flex: 1;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .profile-container {
    height: auto;
    padding: 16px !important;
  }

  .info-label {
    min-width: 180px;
  }

  .profile-main-card {
    margin-top: 16px;
  }
}

@media (max-width: 600px) {
  .profile-container {
    padding: 8px !important;
  }

  .info-label {
    min-width: 150px;
    font-size: 0.9rem;
  }

  .info-value {
    font-size: 0.95rem;
  }

  .section-title {
    font-size: 1.1rem;
    padding: 16px;
  }

  .cargo-highlight {
    padding: 16px;
  }

  .profile-avatar {
    width: 120px !important;
    height: 120px !important;
  }
}
</style>
