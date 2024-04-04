import {createApp} from 'vue'
import App from './App.vue'
import Home from '@/components/Home.vue'
import Produce from "@/components/Produce.vue";
import Grade from "@/components/Grade.vue";
import {createRouter, createWebHashHistory} from 'vue-router'
import User from "@/components/User.vue";


const routes = [
    {path: '/', component: Home},
    {path: '/produce', component: Produce},
    {path: '/grade', component: Grade},
    {path: '/user', component: User}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')

