import { ref } from 'vue'

// Almacena la referencia al snackbar
const snackbarRef = ref(null)

/**
 * Registra la instancia del snackbar
 * @param {Object} ref - Referencia al componente snackbar
 */
export const registerSnackbar = (ref) => {
  snackbarRef.value = ref
}

/**
 * Muestra un mensaje en el snackbar
 * @param {string} message - Mensaje a mostrar
 * @param {'success'|'error'|'warning'|'info'} type - Tipo de mensaje
 * @param {number} [timeout=4000] - Duración en milisegundos
 */
const showMessage = (message, type = 'info', timeout = 4000) => {
  if (!snackbarRef.value) {
    console.error('Snackbar no registrado. Asegúrate de:')
    console.error('1. Tener el componente AppSnackbar en tu template')
    console.error('2. Llamar a registerSnackbar en el onMounted del componente')
    return
  }
  snackbarRef.value.showMessage(message, type, timeout)
}

// Exporta las funciones para usar en componentes
export const useSnackbar = () => ({
  showMessage,
  successMsg: (msg, timeout) => showMessage(msg, 'success', timeout),
  errorMsg: (msg, timeout) => showMessage(msg, 'error', timeout),
  warningMsg: (msg, timeout) => showMessage(msg, 'warning', timeout),
  infoMsg: (msg, timeout) => showMessage(msg, 'info', timeout),
})
