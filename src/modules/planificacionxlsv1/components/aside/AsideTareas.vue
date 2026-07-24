<!-- ========== aside/AsideTareas.vue ========== -->
<template>
  <div class="aside-content" v-if="selectedRowData">
    <v-card flat class="mb-3 pa-2" color="secondary" variant="tonal">
      <div class="text-body-2 font-weight-bold">{{ selectedRowData.nombre }}</div>
      <div class="d-flex gap-2 mt-1">
        <v-chip size="x-small" color="primary" label>{{ selectedRowData.estado }}</v-chip>
        <v-chip size="x-small" label>Bs. {{ fmt(selectedRowData.presupuesto) }}</v-chip>
      </div>
    </v-card>
    <v-list density="compact" lines="two">
      <v-list-item v-for="(tarea, i) in tareasDummy" :key="i" rounded="lg" class="mb-1" border>
        <template v-slot:prepend>
          <v-avatar size="28" color="secondary" variant="tonal">
            <v-icon size="16">mdi-file-document-outline</v-icon>
          </v-avatar>
        </template>
        <v-list-item-title class="text-body-2">{{ tarea.nombre }}</v-list-item-title>
        <v-list-item-subtitle>Bs. {{ fmt(tarea.presupuesto) }}</v-list-item-subtitle>
        <template v-slot:append>
          <v-chip
            size="x-small"
            :color="
              tarea.estado === 'Completado'
                ? 'success'
                : tarea.estado === 'En progreso'
                  ? 'info'
                  : 'warning'
            "
            label
            variant="tonal"
            >{{ tarea.estado }}</v-chip
          >
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
defineProps({ selectedRowData: Object, tareasDummy: Array, fmt: Function })
</script>

<style scoped>
.aside-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}
</style>
