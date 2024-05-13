import {createApp} from 'vue'
import App from './App.vue'
import Home from '@/components/Home.vue'
import ProduceOverview from "@/components/produce/ProduceOverview.vue";
import GradeOverview from "@/components/grade/GradeOverview.vue";
import {createRouter, createWebHashHistory} from 'vue-router'
import Login from "@/components/Login.vue";
import Produce from "@/components/produce/Produce.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import V3DragZoom from "@/components/v3-drag-zoom/dist/v3-drag-zoom.js";
import "@/components/v3-drag-zoom/dist/style.css";
import Register from "@/components/Register.vue";
import Grade from "@/components/grade/BatchGrade.vue";
import StudentGrade from "@/components/grade/StudentGrade.vue";


const routes = [
    {path: '/', component: Home},
    {path: '/produce_overview', component: ProduceOverview},
    {path: '/grade_overview', component: GradeOverview},
    {path: '/login', component: Login},
    {
        path: '/batch_grade', component: Grade,
        props: route => ({batchInfo: route.query.batchInfo, batchNumber: route.query.batchNumber})
    },
    {path: '/produce', component: Produce},
    {path: '/register', component: Register},
    {
        path: '/student_grade',
        component: StudentGrade,
        props: route => ({batchInfo: route.query.batchInfo, studentInfo: route.query.studentInfo})
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})


const routerHistory = [];
router.beforeEach((to, from, next) => {
    try {
        routerHistory.push(to.path);
        next()
        return true
    } catch (e) {
        console.error(e)
    }

});

window.routerHistory = routerHistory;


const app = createApp(App)
app.use(ElementPlus)
app.use(V3DragZoom)
app.use(router)
app.mount('#app')

export default router;

