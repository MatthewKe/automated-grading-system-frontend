<template>
  <div id="app">
    <el-menu
        id="navigation-bar"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
    >
      <el-menu-item index="0" @click="()=>{router.push('/')}">
        <span class="material-symbols-outlined">home</span>
      </el-menu-item>
      <el-menu-item index="1">
        <router-link to="/produce_overview" style="font-weight: bold">制作答题卡</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link to="/grade_overview" style="font-weight: bold">批改答题卡</router-link>
      </el-menu-item>
      <div class="flex-grow"/>
      <div v-if="userState.ifLogin">
        <el-sub-menu index="3">
          <template #title>
            <div style="font-weight: bold">
              欢迎您，{{ userState.username }}
            </div>
          </template>
          <el-menu-item index="3-1" @click="handleLogOut" style="font-weight: bold">注销</el-menu-item>
          <el-menu-item index="3-2" style="font-weight: bold">设置</el-menu-item>
        </el-sub-menu>
      </div>

      <div v-if="!userState.ifLogin">
        <el-menu-item>
          <router-link to="/login" style="font-weight: bold">登录/注册</router-link>
        </el-menu-item>
      </div>


    </el-menu>

    <Suspense>
      <template #default>

        <router-view/>

      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import userState from "@/userState.js";
import router from "@/main.js";
import {validateToken} from "@/components/http.js";


validateToken()

function handleLogOut() {
  userState.value.ifLogin = false
  localStorage.removeItem('jwt')
  router.push('/login')
}


</script>

<style>

.flex-grow {
  flex-grow: 1;
}

a {
  text-decoration: none;
  color: black;
}

#app {
  display: flex;
  flex-direction: column;
}

nav {
  border-bottom: 1px solid lightgrey;
}

nav ul {
  display: flex;
  list-style-type: none;
  padding: 0;
}

nav li {
  margin-right: 20px;
}

.right-align {
  margin-left: auto;
}


html, body {
  margin: 0;

  padding: 0;

  height: 100%;
}

</style>
