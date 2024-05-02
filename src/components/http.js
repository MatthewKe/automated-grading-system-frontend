import axios from 'axios';
import userState from "@/userState.js";
import router from "@/main.js";

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


http.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
        console.error('401 status')
        userState.value.ifLogin = false;
        router.push('/login')
    } else if (error.response && error.response.status === 403) {
        console.error('403 status')
        router.push('/')
    } else {
        console.log(error)
        return Promise.reject(error)
    }
})


export function validateToken() {
    console.log('validateToken')
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
