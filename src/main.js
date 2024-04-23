import {createApp} from 'vue'
import App from './App.vue'
import Home from '@/components/Home.vue'
import ProduceOverview from "@/components/ProduceOverview.vue";
import Grade from "@/components/Grade.vue";
import {createRouter, createWebHashHistory} from 'vue-router'
import User from "@/components/User.vue";
import Produce from "@/components/produce/Produce.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import V3DragZoom from "@/components/v3-drag-zoom/dist/v3-drag-zoom.js";
import "@/components/v3-drag-zoom/dist/style.css";

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
app.use(ElementPlus)
app.use(V3DragZoom)
app.use(router)
app.mount('#app')

