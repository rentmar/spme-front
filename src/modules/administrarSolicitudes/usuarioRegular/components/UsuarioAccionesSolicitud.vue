<!-- components/usuario/UsuarioAccionesSolicitud.vue -->
<template>
  <div class="d-flex gap-1 justify-center">
    <!-- Abrir en la misma página -->
    <v-tooltip :text="solicitud.urlAccion || 'Ver detalle'" location="top">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon="mdi-arrow-right-circle"
          size="x-small"
          variant="text"
          color="info"
          :href="solicitud.url"
        />
      </template>
    </v-tooltip>

    <!-- Abrir en nueva pestaña -->
    <v-tooltip text="Abrir en nueva pestaña" location="top">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon="mdi-open-in-new"
          size="x-small"
          variant="text"
          color="primary"
          :href="solicitud.url"
          target="_blank"
        />
      </template>
    </v-tooltip>
  </div>
</template>

<script setup>
defineProps({
  solicitud: { type: Object, required: true },
})
</script>
