import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import router from "@/router/index.js";
import 'qweather-icons/font/qweather-icons.css'
const pinia = createPinia()
const app=createApp(App)
app.use(ElementPlus)
app.use(pinia)
app.use(router)
app.mount('#app')
