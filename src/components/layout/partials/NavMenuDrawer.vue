<!-- NavMenu.vue -->
<template>
  <v-list density="compact" nav>
    <!-- Dashboard Principal -->
    <!-- <v-list-item
      prepend-icon="mdi-view-dashboard"
      title="Dashboard"
      value="dashboard"
      to="/dashboard"
    ></v-list-item> -->

    <v-list-item prepend-icon="mdi-home" title="Inicio" value="home" to="/"></v-list-item>

    <v-list-group value="estructuracion">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" prepend-icon="mdi-sitemap" title="Estructuración"></v-list-item>
      </template>

      <v-list-item
        prepend-icon="mdi-file-document-outline"
        title="PEI"
        value="pei-list"
        to="/pei"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-folder-multiple-outline"
        title="Proyectos"
        value="projects-list"
        to="/proyecto"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-chart-gantt"
        title="Programas/Areas"
        value="programas-list"
        to="/programas"
      ></v-list-item>

      <v-list-item prepend-icon="mdi-finance" title="FPP" value="fpd-list" to="/"></v-list-item>

      <v-list-item
        prepend-icon="mdi-cash-multiple"
        title="FONFOSC"
        value="fonfosc-list"
        to="/"
      ></v-list-item>
    </v-list-group>

    <v-list-group value="planning">
      <template v-slot:activator="{ props }">
        <v-list-item
          v-bind="props"
          prepend-icon="mdi-calendar-month"
          title="Planificación"
        ></v-list-item>
      </template>

      <v-list-item
        prepend-icon="mdi-format-list-checkbox"
        title="Tareas"
        value="planning-tareas"
        to="/proyecto/actividades/tareas/"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-playlist-check"
        title="Proyectos/Actividades"
        value="planning-activities"
        to="/planificacion/actividades"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-chart-timeline-variant"
        title="Cronogramas"
        value="planning-schedules"
        to="/planificacion/cronogramas"
      ></v-list-item>
    </v-list-group>

    <v-list-group value="monitoreo">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" prepend-icon="mdi-chart-line" title="Monitoreo"></v-list-item>
      </template>

      <v-list-item
        prepend-icon="mdi-account-alert"
        title="Solicitud/Reposición"
        value="monitoring-requests"
        to="/"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-chart-box"
        title="Rendición Cuentas"
        value="monitoring-reports"
        to="/"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-file-chart"
        title="Informe de Actividad"
        value="monitoring-activity"
        to=""
      ></v-list-item>
    </v-list-group>
    <!-- Reportes -->
    <v-list-group value="reporte">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" prepend-icon="mdi-chart-bar" title="Reportes"></v-list-item>
      </template>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Por Proyecto"
        value="reporte-proyecto"
        to="/reporte/proyectos"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-chart-line"
        title="Por Actividad"
        value="reporte-actividades"
        to="/reporte/actividades"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-chart-line"
        title="Reporte Estructura Pruebas"
        value="actividades-reports"
        to="/reportes/estructura"
      ></v-list-item>
    </v-list-group>

    <!-- Administración de Usuarios -->
    <v-list-group value="admin">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" prepend-icon="mdi-account-cog" title="Usuarios"></v-list-item>
      </template>

      <v-list-item
        prepend-icon="mdi-table-account"
        title="Dashboard Usuarios"
        value="users"
        to="/admin/usuariosDashboard"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-account-group"
        title="Usuarios"
        value="usuarios"
        to="/admin/usuarios"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-shield-account"
        title="Roles"
        value="roles"
        to="/admin/roles"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-key-chain"
        title="Permisos"
        value="permissions"
        to="/admin/permisos"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-cog"
        title="Configuración del Sistema"
        value="settings"
        to="/admin/configuracion"
      ></v-list-item>
    </v-list-group>

    <v-list-group value="notifications">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" prepend-icon="mdi-bell" title="Notificaciones"></v-list-item>
      </template>

      <v-list-item
        prepend-icon="mdi-bell-outline"
        title="Mis Notificaciones"
        value="user-notifications"
        to="/notificaciones"
      >
        <template v-slot:append>
          <v-badge
            v-if="unreadNotificationsCount > 0"
            color="error"
            :content="unreadNotificationsCount"
            inline
          ></v-badge>
        </template>
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-cog-outline"
        title="Configuración"
        value="notification-settings"
        to="/notificaciones/configuracion"
      ></v-list-item>
      <!-- Sección de administración (solo visible para admin) -->
      <template v-if="userIsAdmin">
        <v-divider class="my-1"></v-divider>

        <v-list-item
          prepend-icon="mdi-bell-cog"
          title="Administrar Notificaciones"
          value="admin-notifications"
          to="/admin/notificaciones"
          class="admin-item"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-format-list-checks"
          title="Plantillas"
          value="notification-templates"
          to="/admin/notificaciones/plantillas"
          class="admin-item"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-server-security"
          title="Configuración del Sistema"
          value="system-notification-settings"
          to="/admin/notificaciones/configuracion"
          class="admin-item"
        ></v-list-item>
      </template>
    </v-list-group>

    <v-list-item prepend-icon="mdi-help-box" title="Ayuda" value="help" to="/help"></v-list-item>

    <v-list-item
      prepend-icon="mdi-information"
      title="Acerca de"
      value="about"
      to="/about"
    ></v-list-item>
  </v-list>
</template>

<script setup>
// Puedes agregar lógica aquí para controlar qué elementos del menú se muestran
// basado en los permisos del usuario
import { ref } from 'vue'
const userIsAdmin = ref(true)
const unreadNotificationsCount = ref(0)
</script>

<style scoped>
.v-list-item {
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Estilo para el ítem activo */
.v-list-item--active {
  background-color: rgba(25, 118, 210, 0.1);
  border-left: 3px solid #1976d2;
}

/* Destacar la sección de administración */
.v-list-group[value='admin'] .v-list-item {
  color: #6a1b9a; /* Color púrpura para destacar */
}

.v-list-group[value='admin'] .v-list-item--active {
  background-color: rgba(106, 27, 154, 0.1);
  border-left: 3px solid #6a1b9a;
}
</style>
