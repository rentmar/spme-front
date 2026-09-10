<!-- components/validation/RedactorInfo.vue -->
<template>
  <div>
    <!-- Estado vacío: Sin redactor -->
    <div v-if="!redactor" class="empty-state">
      <v-icon size="32" color="grey-lighten-1">mdi-account-off</v-icon>
      <p class="text-caption text-grey mt-2 mb-0">No hay redactor asignado</p>
    </div>

    <!-- Información del redactor -->
    <div v-else class="redactor-card">
      <!-- Cabecera con avatar y nombre -->
      <div class="d-flex align-center mb-3">
        <v-avatar size="40" color="primary" class="mr-3">
          <span class="text-body-2 font-weight-bold text-white">
            {{ getIniciales(redactor.nombre_completo) }}
          </span>
        </v-avatar>
        <div>
          <div class="text-body-2 font-weight-medium">{{ redactor.nombre_completo }}</div>
          <div class="text-caption text-grey-darken-1">{{ redactor.email }}</div>
        </div>
      </div>

      <!-- Información detallada -->
      <div class="redactor-details">
        <!-- Username -->
        <div class="detail-item mb-1">
          <v-icon size="14" color="grey-darken-1" class="mr-1">mdi-account-key</v-icon>
          <span class="text-caption text-grey-darken-1">Usuario:</span>
          <span class="text-caption font-weight-medium ml-1">{{
            redactor.username || 'No especificado'
          }}</span>
        </div>

        <!-- ID -->
        <!-- <div class="detail-item mb-1">
          <v-icon size="14" color="grey-darken-1" class="mr-1">mdi-identifier</v-icon>
          <span class="text-caption text-grey-darken-1">ID:</span>
          <span class="text-caption font-weight-medium ml-1">{{ redactor.id }}</span>
        </div> -->

        <!-- Rol -->
        <div class="detail-item mb-2">
          <v-icon size="14" color="grey-darken-1" class="mr-1">mdi-shield-account</v-icon>
          <span class="text-caption text-grey-darken-1">Rol:</span>
          <v-chip size="x-small" :color="getColorRol(redactor.rol)" variant="tonal" class="ml-1">
            <v-icon start size="12">{{ getIconoRol(redactor.rol) }}</v-icon>
            {{ redactor.cargo || 'Sin rol' }}
          </v-chip>
        </div>

        <!-- Acciones (opcional) -->
        <div v-if="showActions" class="redactor-actions mt-3 pt-3 border-top">
          <div class="d-flex gap-2">
            <v-btn
              size="x-small"
              variant="tonal"
              color="primary"
              :href="`mailto:${redactor.email}`"
              prepend-icon="mdi-email"
            >
              Enviar correo
            </v-btn>
            <v-btn
              v-if="redactor.username"
              size="x-small"
              variant="tonal"
              color="info"
              prepend-icon="mdi-message-text"
            >
              Mensaje
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  redactor: {
    type: Object,
    default: null,
  },
  showActions: {
    type: Boolean,
    default: false,
  },
})

const getIniciales = (nombre) => {
  if (!nombre) return 'NA'
  return nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getColorRol = (rol) => {
  const colores = {
    administrador: 'error',
    tecnico: 'primary',
    supervisor: 'warning',
    usuario: 'success',
    coordinador: 'info',
    default: 'grey',
  }
  return colores[rol?.toLowerCase()] || colores.default
}

const getIconoRol = (rol) => {
  const iconos = {
    administrador: 'mdi-shield-account',
    tecnico: 'mdi-wrench',
    supervisor: 'mdi-account-supervisor',
    usuario: 'mdi-account',
    coordinador: 'mdi-account-tie',
    default: 'mdi-account',
  }
  return iconos[rol?.toLowerCase()] || iconos.default
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
}

.redactor-card {
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(var(--v-theme-primary), 0.03);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.redactor-details {
  padding-left: 4px;
}

.detail-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.gap-2 {
  gap: 8px;
}

.text-white {
  color: white !important;
}
</style>
