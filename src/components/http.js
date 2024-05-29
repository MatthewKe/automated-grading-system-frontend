import axios from 'axios';
import userState from "@/userState.js";
import router from "@/main.js";
import {ElMessage} from "element-plus";

const http = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
})


http.interceptors.request.use(function (config) {
    const token = localStorage.getItem('jwt')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, function (error) {
    console.error(error)
    return Promise.reject(error)
})


http.interceptors.response.use(response => response, async error => {
    if (error.response && error.response.status === 401) {
        console.error('401 status')
        userState.value.ifLogin = false;
        router.push('/login')
    } else if (error.response && error.response.status === 403) {
        console.error('403 status')
        let backStep = 0;
        let lastPath
        let goHome = false;
        do {
            backStep++
            if (routerHistory.length - backStep >= 0) {
                lastPath = routerHistory[routerHistory.length - backStep]
            } else {
                goHome = true;
                break;
            }
        } while (lastPath === '/login' || lastPath === '/register')
        if (goHome) {
            router.push('/')
        } else {
            router.go(-backStep)
        }

        ElMessage.error({
            offset: 100,
            message: '抱歉，您没有权限访问该资源.'
        })

    } else if (error.code === "ERR_NETWORK") {
        console.error('网络问题')
        ElMessage.error({
            offset: 100,
            message: '抱歉，我们无法连接到服务器，请检查您的网络连接.'
        })
    } else {
        console.log(error)
        return Promise.reject(error)
    }
})


export function validateToken() {

    const token = localStorage.getItem('jwt');
    if (token) {
        http.get('/user/validate-token')
            .then((response) => {
                userState.value.ifLogin = true
                userState.value.username = response.data.username
            })
            .catch(() => {
                localStorage.removeItem('jwt'); // 如果token无效或过期，清除它
                userState.isAuthenticated = false;
            })
    }
}

export default http
