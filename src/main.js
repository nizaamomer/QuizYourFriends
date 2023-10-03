import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Visitors from '@/components/Visitors.vue';
const app = createApp(App)
app.component('Visitors', Visitors);
app.use(router)
app.mount('#app')
