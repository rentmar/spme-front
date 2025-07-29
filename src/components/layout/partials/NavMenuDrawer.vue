<!-- NavMenu.vue -->
<template>
  <v-list density="compact" nav>
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
        to="/"
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

      <!--*****-->
      <v-list-item
        @click = "goToPageWithButton(1)"
        prepend-icon="mdi-account-alert"
        title="Solicitud/Reposición"
        value="monitoring-requests"
        to="/pei/listaactividades?showButton=1"
      ></v-list-item>

      <v-list-item
        @click = "goToPageWithButton(2)"
        prepend-icon="mdi-chart-box"
        title="Rendición Cuentas"
        value="monitoring-reports"
        to="/pei/listaactividades?showButton=2"
      ></v-list-item>

      <v-list-item
        @click = "goToPageWithButton(3)"
        prepend-icon="mdi-file-document-outline"
        title="Informe de Actividad"
        value="monitoring-activity"
        to="/pei/listaactividades?showButton=3"
      ></v-list-item>
    </v-list-group><!--*****-->

    <v-list-item prepend-icon="mdi-help-box" title="Ayuda" value="help" to="/help"></v-list-item>

    <v-list-item
      prepend-icon="mdi-information"
      title="Acerca de"
      value="about"
      to="/about"
    ></v-list-item>
  </v-list>
</template>

<script>
//exporta el valor booleano showButton
export default {
  methods: {
    goToPageWithButton(buttonType) {
      this.$router.push({
        path: '/pei/listaactividades',
        query: { showButton: buttonType }
      });
    }
  }
}
//********************************** */
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
</style>
