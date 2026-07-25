<!-- components/ConfirmDialogTareas.vue -->
<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon color="warning" class="mr-2">mdi-alert-circle-outline</v-icon>
        Cambios sin guardar en subactividades
      </v-card-title>
      <v-card-text>
        Has realizado modificaciones en las subactividades de esta actividad. Si cambias de
        actividad, <strong>perderás estos cambios</strong>. <br /><br />
        ¿Estás seguro de continuar?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="$emit('cancelar')">Cancelar</v-btn>
        <v-btn color="warning" variant="text" @click="$emit('confirmar')">
          Continuar y perder cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
})
defineEmits(['update:modelValue', 'confirmar', 'cancelar'])
</script>
