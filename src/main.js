import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

//import './mocks/api-mock.js' // Importa el mock. comentar cuando este listo la API real will
//import './mocks/api-mock0.js' // Importa el mock. comentar cuando este listo la API real will

//VUe Flow

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
