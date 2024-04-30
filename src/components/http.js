import axios from 'axios';
import userState from "@/userState.js";
import router from "@/main.js";

const http = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
http.interceptors.request.use(function (config) {
    const token = localStorage.getItem('jwt')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, function (error) {
    return Promise.reject(error);
})

// 响应拦截器
http.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401 || error.response.status === 403) {
        console.error('401 or 403 status')
        router.push('/login')
        userState.value.ifLogin = false
    }
    return Promise.reject(error)
})

export default http
