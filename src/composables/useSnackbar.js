import { ref } from 'vue'

// Almacena la referencia al snackbar
const snackbarRef = ref(null)
//Posicion por defecto
const defaultLocation = ref('bottom right')

//Localizaciones
// Ubicaciones válidas en Vuetify 3
const VALID_LOCATIONS = [
  'top',
  'bottom',
  'left',
  'right',
  'top left',
  'top right',
  'bottom left',
  'bottom right',
  'center',
]

/**
 * Registra la instancia del snackbar
 * @param {Object} ref - Referencia al componente snackbar
 */
export const registerSnackbar = (ref) => {
  snackbarRef.value = ref
}

/**
 * Valida y normaliza la ubicación
 * @param {string} location - Ubicación a validar
 * @returns {string} Ubicación validada
 */
const validateLocation = (location) => {
  if (VALID_LOCATIONS.includes(location)) {
    return location
  }
  console.warn(`Ubicación "${location}" no válida. Usando "bottom" por defecto.`)
  return 'bottom'
}

/**
 * Muestra un mensaje en el snackbar
 * @param {string} message - Mensaje a mostrar
 * @param {'success'|'error'|'warning'|'info'} type - Tipo de mensaje
 * @param {number} [timeout=4000] - Duración en milisegundos
 * @param {string} [location] - Ubicación del snackbar
 */
const showMessage = (message, type = 'info', timeout = 4000, location) => {
  if (!snackbarRef.value) {
    console.error('Snackbar no registrado. Asegúrate de:')
    console.error('1. Tener el componente AppSnackbar en tu template')
    console.error('2. Llamar a registerSnackbar en el onMounted del componente')
    return
  }

  const finalLocation = location ? validateLocation(location) : defaultLocation.value
  snackbarRef.value.showMessage(message, type, timeout, finalLocation)
}
const successMsg = (msg, timeout, location) => showMessage(msg, 'success', timeout, location)
const errorMsg = (msg, timeout, location) => showMessage(msg, 'error', timeout, location)
const warningMsg = (msg, timeout, location) => showMessage(msg, 'warning', timeout, location)
const infoMsg = (msg, timeout, location) => showMessage(msg, 'info', timeout, location)

// Exporta las funciones para usar en componentes
export const useSnackbar = () => ({
  showMessage,
  successMsg,
  errorMsg,
  warningMsg,
  infoMsg,

  // Función para cambiar la ubicación por defecto globalmente
  setDefaultLocation: (newLocation) => {
    defaultLocation.value = validateLocation(newLocation)
  },

  // Función para obtener la ubicación por defecto actual
  getDefaultLocation: () => defaultLocation.value,

  // Obtener ubicaciones válidas
  getValidLocations: () => [...VALID_LOCATIONS],
})
