<!-- NavMenu.vue -->
<template>
  <v-list density="compact" nav>
    <v-list-item prepend-icon="mdi-home" title="Inicio" value="home" to="/"></v-list-item>

    <v-list-group value="Estructuracion">
      <template v-slot:activator="{ props }">
        <v-list-item
          v-bind="props"
          prepend-icon="mdi-chart-timeline-variant"
          title="Estructuracion"
        ></v-list-item>
      </template>

      <v-list-item
        prepend-icon="mdi-notebook-outline"
        title="PEI"
        value="pei"
        to="/pei"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-library-shelves"
        title="Proyectos"
        value="projects"
        to="/proyecto"
      ></v-list-item>
    </v-list-group>

    <v-list-group value="Planning">
      <template v-slot:activator="{ props }">
        <v-list-item
          v-bind="props"
          prepend-icon="mdi-calendar-multiple"
          title="Planificacion"
        ></v-list-item>
      </template>

      <v-list-item
        prepend-icon="mdi-calendar-check"
        title="Actividades"
        value="actividades"
        to="/planificacion/actividades"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-chart-gantt"
        title="Cronogramas"
        value="schedules"
        to="/planificacion/cronogramas"
      ></v-list-item>
    </v-list-group>

    <v-list-item prepend-icon="mdi-help-circle" title="Ayuda" value="help" to="/help"></v-list-item>

    <v-list-item
      prepend-icon="mdi-information"
      title="Acerca de"
      value="about"
      to="/about"
    ></v-list-item>
  </v-list>
</template>

<script setup></script>
