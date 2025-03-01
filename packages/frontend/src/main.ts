import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import axios from 'axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)

import { config } from 'dotenv'
config()
//TODO понять почему не работает в dockploy
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

app.use(createPinia())
app.use(router)

app.mount('#app')
