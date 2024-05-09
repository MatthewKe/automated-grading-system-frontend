<template>
  <div id="app">
    <nav id="navigation-bar">
      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/produce_overview">制作答题卡</router-link>
        </li>
        <li>
          <router-link to="/grade_overview">批改</router-link>
        </li>
        <li class="right-align">
          <div v-if="userState.ifLogin">
            <el-dropdown>
              <span class="el-dropdown-link" style="font-size: 16px;color: black">
                欢迎您，{{ userState.username }}
                <el-icon class="el-icon--right">
                  <arrow-down/>
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLogOut">注销</el-dropdown-item>
                  <el-dropdown-item>设置</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div v-if="!userState.ifLogin">
            <router-link to="/login">登录/注册</router-link>
          </div>
        </li>
      </ul>
    </nav>
    <Suspense>
      <template #default>
        <div id="router-view-container">
          <router-view/>
        </div>
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import userState from "@/userState.js";
import {ArrowDown} from "@element-plus/icons-vue";
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
