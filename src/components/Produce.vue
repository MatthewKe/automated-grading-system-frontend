<script setup>

import localImg from '@/assets/sample.png'
import addImg from '@/assets/add.png'
import {ref} from 'vue'

const papers = ref([localImg, localImg, localImg, localImg, localImg, localImg])

</script>

<template>
  <h4>我制作的答题卡</h4>
  <div id="paper-gallery">
    <div class="paper-container">
      <img class="paper" alt="" v-bind:src="addImg" id="add"/>
    </div>
    <div class="paper-container" v-for="(item,index) in papers">
      <img class="paper" v-bind:src="item" alt=""></img>
      <p class="paper-name">{{ index }}</p>
    </div>
  </div>
</template>

<style scoped>
#paper-gallery {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 50px;
}


.paper {
  width: 300px;
  height: 212.13px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.paper:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
  transform: scale(1.05);
  transition: transform 0.1s ease;
}

.paper-name {
  margin: 0;
  color: gray;
  text-align: center;
}

</style>