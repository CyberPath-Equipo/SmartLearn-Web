import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import VueApexCharts from "vue3-apexcharts";
import SlIcon from './components/SlIcon.vue';

const app = createApp(App)

app.component('SlIcon', SlIcon)
app.use(router)
app.use(pinia)
app.use(VueApexCharts)

app.mount('#app')
