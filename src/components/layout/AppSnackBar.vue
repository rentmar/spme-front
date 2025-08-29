<template>
  <v-snackbar v-model="visible" :timeout="timeout" :color="color" location="bottom right">
    <div class="d-flex align-center">
      <v-icon :icon="icon" class="mr-3"></v-icon>
      <span>{{ message }}</span>
    </div>
    <template v-slot:actions>
      <v-btn variant="text" @click="visible = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { registerSnackbar } from '@/composables/useSnackbar'

const visible = ref(false)
const message = ref('')
const color = ref('info')
const icon = ref('mdi-information')
const timeout = ref(4000)

const showMessage = (msg, type, duration, msgLocation = 'center') => {
  const types = {
    success: { color: 'success', icon: 'mdi-check-circle' },
    error: { color: 'error', icon: 'mdi-alert-circle' },
    warning: { color: 'warning', icon: 'mdi-alert' },
    info: { color: 'info', icon: 'mdi-information' },
  }

  message.value = msg
  color.value = types[type].color
  icon.value = types[type].icon
  timeout.value = duration
  location.value = msgLocation
  visible.value = true
}

// Registra el snackbar al montar el componente
onMounted(() => {
  registerSnackbar({ showMessage })
})

// Opcional: Limpia la referencia al desmontar
onUnmounted(() => {
  registerSnackbar(null)
})

defineExpose({ showMessage })
</script>
