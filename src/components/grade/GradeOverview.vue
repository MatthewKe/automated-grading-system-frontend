<script setup>

import {ref, watch} from "vue";
import {Timer, Upload} from "@element-plus/icons-vue";
import http from "@/components/http.js";
import router from "@/main.js";
import {throttle} from "lodash";

const containerHeight = window.innerHeight - document.getElementById('navigation-bar').getBoundingClientRect().height - 1
const gradeOverviewInfos = ref([])


const files = ref([])
const fileInputButton = ref(null)

function fileInput(event) {
  files.value = event.target.files;
}

function handleFileUpload() {
  fileInputButton.value.value = ''
  fileInputButton.value.click()
}

watch(files, () => {
  if (files.value.length === 0) {
    return
  }
  const formData = new FormData();
  Array.from(files.value).forEach(file => {
    formData.append('files[]', file);
  });
  http.post('/grade/upload', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(_ => getOverview())
  files.value = [];
}, {immediate: false, deep: true})


watch(gradeOverviewInfos, throttle(
    () => {
      console.log("here")
      for (let gradeOverviewInfo of gradeOverviewInfos.value) {
        if (gradeOverviewInfo.state === '正在批改') {
          getOverview()
          break;
        }
      }
    },
    3000
))

function getOverview() {
  http.get('/grade/overview')
      .then(response => {
        console.log(response.data.gradeOverviewVos)
        for (let gradeOverviewVo of response.data.gradeOverviewVos) {
          const dateTimeStr = gradeOverviewVo.timestamp
          const dateObj = new Date(dateTimeStr);
          gradeOverviewVo.timestamp = dateObj.toLocaleString();
        }
        gradeOverviewInfos.value = response.data.gradeOverviewVos;
      })
}

async function goToGrade(row) {
  try {
    let batchNumber = row.batchNumber;
    let title = row.title
    let timestamp = row.timestamp
    await router.push({
      path: '/batch_grade',
      query: {batchNumber: batchNumber, batchInfo: timestamp + ' ' + title}
    })
  } catch (error) {
    console.error('goToGrade failed:', error);
  }
}

getOverview()
</script>

<template>
  <el-scrollbar style="background: #F4F6F8" :style="{height:containerHeight+'px'}">

    <h1 style=" margin: 20px;font-size: 50px">我批改的答题卡</h1>
    <div class="grade-overview">
      <div style="display: flex;justify-content: flex-end;width: 100%">
        <input type="file" ref="fileInputButton" @input="fileInput" multiple style="display: none;">
        <el-button type="primary" style="font-weight: bold;padding: 10px"
                   @click="handleFileUpload">
          上传答题卡
          <el-icon class="el-icon--right" size="20px">
            <Upload/>
          </el-icon>
        </el-button>
      </div>
      <el-table :data="gradeOverviewInfos" style="width: 100%" @row-click="goToGrade">
        <el-table-column prop="timestamp" label="上传时间" sortable>
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon>
                <timer/>
              </el-icon>
              <span style="margin-left: 10px">{{ scope.row.timestamp }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="答题卡标题"/>
        <el-table-column prop="state" label="当前状态">
          <template #default="scope">
            <div style="display: flex">
              <div v-if="scope.row.state==='批改完成'" style="background: #90be6d;padding-left: 5px;padding-right: 5px">
                {{ scope.row.state }}
              </div>
              <div v-if="scope.row.state==='正在批改'" style="background: #FFD43A;padding-left: 5px;padding-right: 5px">
                {{ scope.row.state }}
              </div>
              <div v-if="scope.row.state==='部分答题卡处理失败'"
                   style="background: #b6b6ba;padding-left: 5px;padding-right: 5px">
                {{ scope.row.state }}
              </div>

            </div>
          </template>
        </el-table-column>
        <el-table-column prop="numOfUploadImages" label="上传的答题卡图片数量"/>
        <el-table-column prop="numOfSucceedProcessImages" label="成功处理的答题卡图片数量"/>
      </el-table>
    </div>

  </el-scrollbar>
</template>

<style scoped>

.grade-overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: white;
  margin: 20px;
  padding: 10px;
  border-radius: 0.375rem;
}


</style>