<template>
  <div id="app">
    <nav>
      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/produce">制作答题卡</router-link>
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

<script>
import {ref} from 'vue'

export default {
  setup() {
    const user_state = ref('登录/注册');
    return {
      user_state
    }
  },

  name: 'App'
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
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

#router-view-container {
  padding-left: 50px;
  padding-right: 50px;
}

</style>
