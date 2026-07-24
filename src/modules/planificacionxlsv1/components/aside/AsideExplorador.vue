<!-- ========== aside/AsideExplorador.vue ========== -->
<template>
  <div class="aside-content" v-if="selectedRowData">
    <v-card flat class="mb-3 pa-2" color="primary" variant="tonal">
      <div class="text-body-2 font-weight-bold">{{ selectedRowData.nombre }}</div>
      <div class="text-caption">{{ selectedRowData.codigo }}</div>
    </v-card>
    <v-treeview
      :items="arbolExplorador"
      density="compact"
      activatable
      open-on-click
      :opened="exploradorAbiertos"
      @update:opened="$emit('update:explorador-abiertos', $event)"
    >
      <template v-slot:title="{ item }">
        <div class="d-flex align-center w-100">
          <v-icon size="16" class="mr-1" :color="item.color">{{ item.icon }}</v-icon>
          <span class="text-caption">{{ item.title }}</span>
          <v-spacer></v-spacer>
          <v-chip
            v-if="item.estado"
            size="x-small"
            :color="estadoColor(item.estado)"
            label
            class="ml-1"
            >{{ item.estado }}</v-chip
          >
        </div>
      </template>
    </v-treeview>
  </div>
</template>

<script setup>
defineProps({
  selectedRowData: Object,
  arbolExplorador: Array,
  exploradorAbiertos: Array,
  estadoColor: Function,
})
defineEmits(['update:explorador-abiertos'])
</script>

<style scoped>
.aside-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}
</style>
