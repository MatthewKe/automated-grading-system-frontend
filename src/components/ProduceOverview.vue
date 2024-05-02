<script setup>

import LocalImg from '@/assets/sample.png'
import AddImg from '@/assets/add.png'
import {ref} from 'vue'
import http from "@/components/http.js";
import projectConfig from "@/components/projectConfig.js";
import router from "@/main.js";


const papers = ref([])


try {
  const response = await http.get('/produce/overview');
  console.log('produce overview successful:', response);
  Object.entries(response.data.projectConfigs).forEach(([key, value]) => {
    console.log()
    papers.value.push({
      img: LocalImg,
      title: JSON.parse(value).title,
      projectId: key
    })
  })
  console.log(papers)
} catch (error) {
  console.error('produce overview failed:', error);
}

async function goToProduce(projectId) {
  try {
    const response = await http.get(`/produce/getProjectConfig?projectId=${projectId}`)
    console.log('goToProduce successful:', response);
    projectConfig.value = JSON.parse(response.data.projectConfig)
    router.push({path: '/produce', query: {project_id: projectId}})
  } catch (error) {
    console.error('goToProduce failed:', error);
  }
}

async function createProject() {
  try {
    const response = await http.get('/produce/createProject')
    console.log('createProject successful:', response);
    goToProduce(response.data.id)
  } catch (error) {
    console.error('createProject failed:', error);
  }
}


</script>

<template>

  <h4>我制作的答题卡</h4>
  <!--  todo 搜索功能-->
  <!--  <SearchBox></SearchBox>-->

  <div id="paper-gallery">
    <div class="paper-container">
      <img class="paper" alt="" v-bind:src="AddImg" id="add" @click="createProject()"/>
    </div>
    <div class="paper-container" v-for="(item,index) in papers">
      <img class="paper" v-bind:src="item.img" alt="" @click="goToProduce(item.projectId)"></img>
      <p class="paper-name">{{ item.title }}</p>
    </div>
  </div>
</template>

<style scoped>
#paper-gallery {
  display: flex;
  justify-content: space-between;
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