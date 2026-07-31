<template>
  <v-container fluid>
    <v-card>
      <v-card-title> Proyecto - Cronograma </v-card-title>

      <v-card-text>
        <GanttProyecto :data="ganttData" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import GanttProyecto from '@/modules/gantt/components/GanttProyecto.vue'
import { ganttData } from '@/modules/gantt/utils/ganttDemo.js'
</script>
