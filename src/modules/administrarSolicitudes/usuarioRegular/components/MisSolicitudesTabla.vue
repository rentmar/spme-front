<template>
  <!-- Estado vacío -->
  <div v-if="items.length === 0" class="text-center py-8">
    <v-icon size="64" color="grey-lighten-1">{{ emptyIcon }}</v-icon>
    <p class="text-h6 text-grey mt-4">{{ emptyTitle }}</p>
    <p class="text-body-2 text-grey">{{ emptySubtitle }}</p>
  </div>

  <!-- Tabla con datos -->
  <v-data-table
    v-else
    :items="items"
    :headers="headers"
    :item-value="itemKey"
    :items-per-page="itemsPerPage"
    :page="page"
    :items-per-page-options="[5, 10, 25, 50, 100]"
    hover
    :no-data-text="noDataText"
    @update:items-per-page="$emit('update:itemsPerPage', $event)"
    @update:page="$emit('update:page', $event)"
  >
    <template v-for="(_, slot) in $slots" :key="slot" #[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </v-data-table>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  headers: { type: Array, required: true },
  itemsPerPage: { type: Number, default: 10 },
  page: { type: Number, default: 1 },
  noDataText: { type: String, default: 'No se encontraron resultados' },
  emptyIcon: { type: String, default: 'mdi-file-document-outline' },
  emptyTitle: { type: String, default: 'Sin resultados' },
  emptySubtitle: { type: String, default: '' },
  itemKey: { type: String, default: 'id' },
})

defineEmits(['update:itemsPerPage', 'update:page'])
</script>
