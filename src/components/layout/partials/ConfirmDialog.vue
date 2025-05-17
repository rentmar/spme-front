<template>
  <v-dialog v-model="isOpen" max-width="500">
    <v-card>
      <v-card-title class="text-h6 d-flex align-center gap-2">
        <v-icon :color="iconColor" start>{{ icon }}</v-icon>
        {{ title }}
      </v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="cancel">{{ cancelLabel }}</v-btn>
        <v-btn :color="buttonColor" @click="confirm" variant="flat">{{ confirmLabel }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { computed } from 'vue'

const { isOpen, title, message, confirmLabel, cancelLabel, type, confirm, cancel } =
  useConfirmDialog()

const icon = computed(() => {
  switch (type.value) {
    case 'delete':
      return 'mdi-delete'
    case 'create':
      return 'mdi-plus-box'
    case 'update':
      return 'mdi-pencil'
    default:
      return 'mdi-alert-circle'
  }
})

const iconColor = computed(() => {
  switch (type.value) {
    case 'delete':
      return 'red'
    case 'create':
      return 'green'
    case 'update':
      return 'blue'
    default:
      return 'grey'
  }
})

const buttonColor = computed(() => iconColor.value)
</script>
