import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import RippleDirective from './directives/ripple'

import axios from 'axios'

import App from './App.vue'
import router from './router'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
// import.meta.env.VITE_BACKEND_URL
//'https://charapi.fxck.ru'
const app = createApp(App)

RippleDirective.install(app)
app.use(createPinia())
app.use(router)

app.mount('#app')
