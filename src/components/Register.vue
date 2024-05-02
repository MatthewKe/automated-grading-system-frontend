<template>
  <div class="login-container" :style="{height: containerHeight +'px'}">
    <el-row type="flex" justify="center" align="middle" class="row-bg">
      <el-col :span="8">
        <el-card class="box-card">
          <h1>用户注册</h1>
          <el-form :model="registerForm" @submit.native.prevent="handleRegister" size="large">
            <h3 style="margin-bottom: 0">用户名 </h3>
            <el-form-item prop="username">
              <el-input v-model="registerForm.username" autocomplete="username"></el-input>
            </el-form-item>
            <h3 style="margin-bottom: 0">密码</h3>
            <el-form-item prop="password">
              <el-input type="password" v-model="registerForm.password" autocomplete="current-password"></el-input>
            </el-form-item>
            <h3 style="margin-bottom: 0">再次输入密码</h3>
            <el-form-item>
              <el-input type="password" v-model="registerForm.password" autocomplete="current-password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit" color="#ffd859" style="font-weight: bold">注册</el-button>
              <el-button @click="$router.push('/login')" style="font-weight: bold">登录</el-button>
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
import router from "@/main.js";

let containerHeight = window.innerHeight - document.getElementById('navigation-bar').getBoundingClientRect().height - 1

const registerForm = reactive({
  username: '',
  password: ''
})


async function handleRegister() {
  try {
    const response = await http.post('/user/register', registerForm);
    console.log('register successful:', response);
    router.push('/login')
  } catch (error) {
    if (error.response.status === 409) {
      console.log('409 error')
      ElMessage.error({
        message: '抱歉，该用户名已经被注册.',
        offset: 100
      })
    } else {
      return Promise.reject(error)
    }
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
