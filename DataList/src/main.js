import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import router from './router'
import { createPinia } from 'pinia' 
import { AgGridVue } from 'ag-grid-vue3'

const app = createApp(App)
const pinia = createPinia()

app.component('ag-grid-vue', AgGridVue)
app.use(router)
app.use(pinia)

app.mount('#app')
