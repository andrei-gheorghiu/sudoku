import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap-scss/bootstrap.scss'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { store } from './store'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App).use(store)
app.use(VueAxios, axios)
app.mount('#app')
