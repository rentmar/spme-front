<!-- NavMenu.vue -->
<template>
  <v-list density="compact" nav>
    <v-list-item prepend-icon="mdi-home-outline" title="Inicio" value="home" to="/"></v-list-item>

    <v-list-group value="estructuracion">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" prepend-icon="mdi-domain" title="Estructuración"></v-list-item>
      </template>

      <v-list-item
        prepend-icon="mdi-notebook-outline"
        title="PEI"
        value="pei-list"
        to="/pei"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-folder-table-outline"
        title="Proyectos"
        value="projects-list"
        to="/proyecto"
      ></v-list-item>
    </v-list-group>

    <v-list-group value="planning">
      <template v-slot:activator="{ props }">
        <v-list-item
          v-bind="props"
          prepend-icon="mdi-calendar-edit"
          title="Planificación"
        ></v-list-item>
      </template>

      <v-list-item
        prepend-icon="mdi-playlist-edit"
        title="Proyectos/Actividades"
        value="planning-activities"
        to="/planificacion/actividades"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-timeline-outline"
        title="Cronogramas"
        value="planning-schedules"
        to="/planificacion/cronogramas"
      ></v-list-item>
    </v-list-group>

    <v-list-group value="monitoreo">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" prepend-icon="mdi-eye-outline" title="Monitoreo"></v-list-item>
      </template>

      <v-list-item
        prepend-icon="mdi-account-alert-outline"
        title="Solicitud/Reposición"
        value="monitoring-requests"
        to=""
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-chart-bar"
        title="Rendición Cuentas"
        value="monitoring-reports"
        to=""
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-file-document-outline"
        title="Informe de Actividad"
        value="monitoring-activity"
        to=""
      ></v-list-item>
    </v-list-group>

    <v-list-item
      prepend-icon="mdi-help-circle-outline"
      title="Ayuda"
      value="help"
      to="/help"
    ></v-list-item>

    <v-list-item
      prepend-icon="mdi-information-outline"
      title="Acerca de"
      value="about"
      to="/about"
    ></v-list-item>
  </v-list>
</template>

<script setup></script>
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
</style>
