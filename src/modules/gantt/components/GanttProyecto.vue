<template>
  <ejs-gantt :dataSource="data" :taskFields="taskFields" :treeColumnIndex="1" :height="'650px'">
  </ejs-gantt>
</template>

<script setup>
import { GanttComponent as EjsGantt } from '@syncfusion/ej2-vue-gantt'

defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const taskFields = {
  id: 'id',
  name: 'nombre',
  startDate: 'inicio',
  endDate: 'fin',
  progress: 'progreso',
  child: 'children',
}
</script>
