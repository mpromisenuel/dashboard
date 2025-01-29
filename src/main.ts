import './assets/css/satoshi.css'
import './assets/css/style.css'
import 'jsvectormap/dist/css/jsvectormap.min.css'
import 'flatpickr/dist/flatpickr.min.css'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
// import * as FaIcons from "oh-vue-icons/icons/fa";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// addIcons(...Fa);
// const Fa = Object.values({ ...FaIcons });

app.use(createPinia())
app.use(router)
app.use(VueApexCharts)
app.use(Vue3Toastify, { autoClose: 5000 })

app.mount('#app')
