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
          <router-link to="/grade">批改</router-link>
        </li>
        <li class="right-align">
          <router-link to="/user">{{ user_state }}</router-link>
        </li>
      </ul>
    </nav>
    <div id="router-view-container">
      <router-view/>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'

const user_state = ref('登录/注册');

</script>

<style>
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

.router-link-active, .router-link-exact-active, a {
  color: #000;
  text-decoration: none;
}

.router-link-active:hover, .router-link-exact-active:hover, a:hover {
  color: darkslategrey;
  text-decoration: none;
}

html, body {
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
  height: 100%;
}

</style>
