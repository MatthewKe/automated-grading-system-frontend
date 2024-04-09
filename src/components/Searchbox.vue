<script setup>
import {ref} from 'vue'

const searchContext = ref('')

function submitSearch() {
  console.log(searchContext.value)
}
</script>

<template>
  <div class="search-box">
    <input
        v-model="searchContext"
        @keyup.enter="submitSearch"
        placeholder="搜索答题卡..."
    >
  </div>
</template>

<style scoped>

</style>