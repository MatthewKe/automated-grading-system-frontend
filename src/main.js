import {createApp} from 'vue'
import App from './App.vue'
import Home from '@/components/Home.vue'
import ProduceOverview from "@/components/ProduceOverview.vue";
import Grade from "@/components/Grade.vue";
import {createRouter, createWebHashHistory} from 'vue-router'
import User from "@/components/User.vue";
import Produce from "@/components/Produce.vue";
import V3DragZoom from "v3-drag-zoom";
import "v3-drag-zoom/dist/style.css";


const routes = [
    {path: '/', component: Home},
    {path: '/produce_overview', component: ProduceOverview},
    {path: '/grade', component: Grade},
    {path: '/user', component: User},
    {path: '/produce', component: Produce}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

const app = createApp(App)
app.use(router)
app.use(V3DragZoom)
app.mount('#app')

