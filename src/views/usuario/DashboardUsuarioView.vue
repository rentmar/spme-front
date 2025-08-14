<template>
  <v-container class="users-admin-container">
    <!-- Overlay de carga -->
    <v-overlay :model-value="loading" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando dashboard...</p>
      </div>
    </v-overlay>

    <v-row v-if="!loading">
      <v-col cols="12">
        <PaginaTituloIcono :titulo="'Dashboard Usuarios'" :icon="'mdi-table-account'" />
        <v-breadcrumbs :items="['Dashboard', 'Administración']" class="px-0"></v-breadcrumbs>
      </v-col>

      <!-- Acciones rápidas -->
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title class="text-white">Acciones Rápidas</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-4">
            <v-slide-group show-arrows>
              <v-slide-group-item v-for="(action, i) in quickActions" :key="i">
                <v-card
                  :color="action.color"
                  class="ma-2"
                  height="120"
                  width="160"
                  @click="action.click"
                >
                  <div
                    class="d-flex flex-column fill-height justify-center align-center text-center pa-4"
                  >
                    <v-icon size="32" dark>{{ action.icon }}</v-icon>
                    <span class="text-white mt-2">{{ action.title }}</span>
                  </div>
                </v-card>
              </v-slide-group-item>
            </v-slide-group>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Cards de métricas -->
      <v-col cols="12" md="3" v-for="(metric, index) in metrics" :key="index">
        <v-card elevation="2" rounded="lg">
          <v-card-text class="pa-4">
            <div class="d-flex align-center">
              <v-avatar :color="metric.color" size="48" class="mr-4">
                <v-icon dark>{{ metric.icon }}</v-icon>
              </v-avatar>
              <div>
                <div class="text-subtitle-2 text-medium-emphasis">{{ metric.title }}</div>
                <div class="text-h5 font-weight-bold">{{ metric.value }}</div>
                <v-chip
                  v-if="metric.trend"
                  small
                  :color="metric.trend > 0 ? 'success' : 'error'"
                  class="mt-1"
                >
                  <v-icon small>{{ metric.trend > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
                  {{ Math.abs(metric.trend) }}%
                </v-chip>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gráfico de actividad -->
      <v-col cols="12" md="8">
        <v-card elevation="2" rounded="lg">
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title class="text-white">Actividad de Usuarios (7 días)</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn variant="text" color="white" size="small">Ver todo</v-btn>
          </v-toolbar>
          <v-card-text class="pa-4">
            <ActivityChart :data="activityData" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Distribución de roles -->
      <v-col cols="12" md="4">
        <v-card elevation="2" rounded="lg">
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title class="text-white">Distribución de Roles</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-4">
            <RolesChart :data="rolesData" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Últimos usuarios registrados -->
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg">
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title class="text-white">Últimos Usuarios</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              color="white"
              size="small"
              to="/admin/usuarios"
              prepend-icon="mdi-arrow-right"
            >
              Ver todos
            </v-btn>
          </v-toolbar>
          <v-card-text class="pa-4">
            <v-table density="compact" class="users-table">
              <thead>
                <tr>
                  <th class="text-subtitle-2 font-weight-bold">Usuario</th>
                  <th class="text-subtitle-2 font-weight-bold">Rol</th>
                  <th class="text-subtitle-2 font-weight-bold">Registro</th>
                  <th class="text-subtitle-2 font-weight-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in recentUsers" :key="user.id">
                  <td>
                    <div class="d-flex align-center">
                      <v-avatar size="36" color="grey-lighten-2" class="mr-3">
                        <v-img v-if="user.avatar" :src="user.avatar"></v-img>
                        <span v-else class="text-caption">{{ getInitials(user.name) }}</span>
                      </v-avatar>
                      <div>
                        <div class="font-weight-medium">{{ user.name }}</div>
                        <div class="text-caption text-medium-emphasis">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <v-chip :color="getRoleColor(user.role)" size="small">{{ user.role }}</v-chip>
                  </td>
                  <td class="text-caption">
                    {{ formatDate(user.createdAt) }}
                  </td>
                  <td>
                    <div class="d-flex">
                      <v-btn icon variant="text" size="small" color="primary">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                      <v-btn icon variant="text" size="small" color="secondary" class="ml-1">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Registro de actividad reciente -->
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg">
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title class="text-white">Actividad Reciente</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              color="white"
              size="small"
              to="/admin/auditoria"
              prepend-icon="mdi-arrow-right"
            >
              Ver todo
            </v-btn>
          </v-toolbar>
          <v-card-text class="pa-4">
            <v-timeline density="compact" align="start" side="end">
              <v-timeline-item
                v-for="(activity, index) in recentActivities"
                :key="index"
                dot-color="primary"
                size="small"
              >
                <div class="d-flex">
                  <v-avatar size="32" class="mr-2">
                    <v-img :src="activity.user.avatar"></v-img>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis mb-1">
                      {{ activity.user.name }} • {{ formatTimeAgo(activity.timestamp) }}
                    </div>
                    <div class="text-body-2">
                      {{ activity.action }}
                      <v-chip v-if="activity.type" size="x-small" class="ml-1">{{
                        activity.type
                      }}</v-chip>
                    </div>
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ActivityChart from '@/modules/usuarios/components/ActivityChart.vue'
import RolesChart from '@/modules/usuarios/components/RolesChart.vue'

const loading = ref(false)

// Datos de ejemplo
const metrics = ref([
  {
    title: 'Usuarios Totales',
    value: '1,248',
    icon: 'mdi-account-group',
    color: 'primary',
    trend: 12,
  },
  { title: 'Nuevos Hoy', value: '24', icon: 'mdi-account-plus', color: 'success', trend: 5 },
  { title: 'Administradores', value: '18', icon: 'mdi-shield-account', color: 'warning', trend: 0 },
  { title: 'Usuarios Inactivos', value: '32', icon: 'mdi-account-off', color: 'error', trend: -3 },
])

const recentUsers = ref([
  {
    id: 1,
    name: 'Ana Pérez',
    email: 'ana@example.com',
    role: 'Administrador',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    createdAt: '2023-05-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Carlos Gómez',
    email: 'carlos@example.com',
    role: 'Editor',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdAt: '2023-05-14T15:45:00Z',
  },
  {
    id: 3,
    name: 'María López',
    email: 'maria@example.com',
    role: 'Usuario',
    createdAt: '2023-05-14T09:20:00Z',
  },
  {
    id: 4,
    name: 'Juan Martínez',
    email: 'juan@example.com',
    role: 'Usuario',
    createdAt: '2023-05-13T16:10:00Z',
  },
  {
    id: 5,
    name: 'Laura Díaz',
    email: 'laura@example.com',
    role: 'Editor',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    createdAt: '2023-05-12T11:25:00Z',
  },
])

const recentActivities = ref([
  {
    user: { name: 'Ana Pérez', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    action: 'Creó un nuevo usuario "Carlos Gómez"',
    type: 'Usuario',
    timestamp: '2023-05-15T10:35:00Z',
  },
  {
    user: { name: 'Admin Sistema', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    action: 'Actualizó los permisos del rol "Editor"',
    type: 'Rol',
    timestamp: '2023-05-15T09:20:00Z',
  },
  {
    user: { name: 'María López', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    action: 'Inició sesión desde una nueva ubicación',
    type: 'Seguridad',
    timestamp: '2023-05-15T08:45:00Z',
  },
  {
    user: { name: 'Carlos Gómez', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    action: 'Actualizó su información de perfil',
    type: 'Perfil',
    timestamp: '2023-05-14T17:30:00Z',
  },
])

const activityData = ref({
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    { label: 'Registros', data: [12, 19, 8, 15, 24, 10, 17], color: '#4CAF50' },
    { label: 'Activos', data: [8, 12, 5, 9, 18, 7, 14], color: '#2196F3' },
  ],
})

const rolesData = ref({
  labels: ['Administrador', 'Editor', 'Usuario', 'Invitado'],
  datasets: [
    { data: [18, 45, 1150, 35], backgroundColor: ['#FF5252', '#FFC107', '#4CAF50', '#9E9E9E'] },
  ],
})

const quickActions = ref([
  {
    title: 'Nuevo Usuario',
    icon: 'mdi-account-plus',
    color: 'primary',
    click: () => navigateTo('/admin/usuarios/nuevo'),
  },
  {
    title: 'Asignar Roles',
    icon: 'mdi-account-switch',
    color: 'secondary',
    click: () => navigateTo('/admin/roles'),
  },
  {
    title: 'Resetear Clave',
    icon: 'mdi-key-variant',
    color: 'warning',
    click: () => openPasswordResetDialog(),
  },
  {
    title: 'Bloquear Usuario',
    icon: 'mdi-account-lock',
    color: 'error',
    click: () => openBlockUserDialog(),
  },
  {
    title: 'Exportar Datos',
    icon: 'mdi-database-export',
    color: 'success',
    click: () => exportUserData(),
  },
  {
    title: 'Configuración',
    icon: 'mdi-cog',
    color: 'info',
    click: () => navigateTo('/admin/configuracion'),
  },
])

// Funciones de utilidad
const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

const getRoleColor = (role) => {
  const colors = {
    Administrador: 'error',
    Editor: 'warning',
    Usuario: 'success',
    Invitado: 'grey',
  }
  return colors[role] || 'primary'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const formatTimeAgo = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diff = now - date

  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h ago`

  const days = Math.floor(hours / 24)
  return `${days} d ago`
}

// Funciones para acciones
const navigateTo = (path) => {
  console.log(`Navegando a: ${path}`)
}

const openPasswordResetDialog = () => {
  console.log('Abrir diálogo para resetear contraseña')
}

const openBlockUserDialog = () => {
  console.log('Abrir diálogo para bloquear usuario')
}

const exportUserData = () => {
  console.log('Exportar datos de usuarios')
}
</script>

<style scoped>
.users-admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}

.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.users-table {
  width: 100%;
}

.users-table th {
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 2;
}

.v-timeline-item::before {
  opacity: 0.5;
}

@media (max-width: 960px) {
  .users-admin-container {
    padding: 16px 12px;
  }
}
</style>
