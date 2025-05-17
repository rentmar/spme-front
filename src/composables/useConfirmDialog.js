// src/composables/useConfirmDialog.js
import { ref } from 'vue'

const isOpen = ref(false)
const title = ref('')
const message = ref('')
const confirmLabel = ref('Confirmar')
const cancelLabel = ref('Cancelar')
const type = ref('default')
let resolvePromise = null

export function useConfirmDialog() {
  function openConfirmDialog(options) {
    title.value = options.title || '¿Estás seguro?'
    message.value = options.message
    confirmLabel.value = options.confirmLabel || 'Confirmar'
    cancelLabel.value = options.cancelLabel || 'Cancelar'
    type.value = options.type || 'default'
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  function confirm() {
    isOpen.value = false
    resolvePromise?.(true)
  }

  function cancel() {
    isOpen.value = false
    resolvePromise?.(false)
  }

  return {
    isOpen,
    title,
    message,
    confirmLabel,
    cancelLabel,
    type,
    openConfirmDialog,
    confirm,
    cancel,
  }
}
