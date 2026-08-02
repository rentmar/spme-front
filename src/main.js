import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vPermission } from './directives/permissions'

import App from './App.vue'

import router from './router'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

//VUe Flow

// import { registerLicense } from '@syncfusion/ej2-base'

// registerLicense(
//   'Ngo9BigBOggjHTQxAR8/V1JHaF1cWmhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdENjXH5XcXBRQmVZUUZwXEleYA==',
// )

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
const pinia = createPinia()

app.directive('permission', vPermission)
app.use(pinia)
app.use(router)
app.use(vuetify)
app.mount('#app')
