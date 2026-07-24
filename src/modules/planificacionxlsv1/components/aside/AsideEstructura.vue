<!-- ========== aside/AsideEstructura.vue ========== -->
<template>
  <div class="aside-content">
    <v-list density="compact">
      <v-list-group value="actividades">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Actividades"
            prepend-icon="mdi-clipboard-text-outline"
            :subtitle="data.length + ' actividades'"
          ></v-list-item>
        </template>
        <v-list-item
          v-for="act in data"
          :key="act.id"
          :title="act.codigo"
          :subtitle="act.nombre"
          @click="$emit('select', act)"
          rounded="lg"
          class="mb-1"
        >
          <template v-slot:prepend>
            <v-chip
              size="x-small"
              :color="
                act.estado === 'EJEC'
                  ? 'info'
                  : act.estado === 'PLAN'
                    ? 'warning'
                    : act.estado === 'FIN'
                      ? 'success'
                      : act.estado === 'DES'
                        ? 'error'
                        : 'default'
              "
              label
              >{{ act.estado }}</v-chip
            >
          </template>
          <template v-slot:append>
            <span class="text-caption">Bs. {{ fmt(act.presupuesto) }}</span>
          </template>
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>
</template>

<script setup>
defineProps({ data: Array, fmt: Function })
defineEmits(['select'])
</script>

<style scoped>
.aside-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}
</style>
