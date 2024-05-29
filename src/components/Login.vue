<template>
  <div class="login-container" :style="{height: containerHeight +'px'}">
    <el-row type="flex" justify="center" align="middle" class="row-bg">
      <el-col :span="8">
        <el-card class="box-card">
          <h1>用户登录</h1>
          <el-form :model="loginForm" @submit.native.prevent="handleLogin" size="large">
            <h3 style="margin-bottom: 0">用户名</h3>
            <el-form-item prop="username">
              <el-input id="username" v-model="loginForm.username" autocomplete="username"></el-input>
            </el-form-item>
            <h3 style="margin-bottom: 0">密码</h3>
            <el-form-item prop="password">
              <el-input id="password" type="password" v-model="loginForm.password"
                        autocomplete="current-password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button id="login-button" type="primary" native-type="submit" color="#ffd859"
                         style="font-weight: bold">登录
              </el-button>
              <el-button @click="$router.push('/register')" style="font-weight: bold">注册</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {reactive} from 'vue'
import {ElButton, ElCard, ElCol, ElForm, ElFormItem, ElInput, ElMessage, ElRow} from 'element-plus'
import http from "@/components/http.js";

import userState from "@/userState.js";
import router from "@/main.js";

let containerHeight = window.innerHeight - document.getElementById('navigation-bar').getBoundingClientRect().height - 1

const loginForm = reactive({
  username: '',
  password: ''
})


async function handleLogin() {
  try {
    const response = await http.post('/user/login', loginForm);
    console.log('Login successful:', response.data);
    const token = response.data.accessToken;
    localStorage.setItem('jwt', token);
    userState.value.username = loginForm.username
    userState.value.ifLogin = true
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
      router.go(-backStep + 1)
    }
  } catch (error) {
    console.error('Login failed:', error.response);
    ElMessage.error({
      message: '登陆失败，请检查用户名和密码.',
      offset: 100
    })
  }

}
</script>

<style scoped>
.login-container {
  background-color: #f2f3f5;
}

.row-bg {
  height: 100%;
}

.box-card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}


</style>
