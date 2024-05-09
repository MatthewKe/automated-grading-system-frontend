<script setup>

import GradeInfo from "@/components/grade/GradeInfo.vue";
import {ref, watch} from "vue";
import AddImg from "@/assets/add.png";
import {Search, Upload} from "@element-plus/icons-vue";
import http from "@/components/http.js";

const gradeInfos = ref([
  {
    patchId: 1,
    timestamp: "2024-05-09-19:49",
    numOfUploadImages: 100,
    numOfSucceedProcessImages: 90,
    title: '第一次数学模拟考试'
  }, {
    patchId: 1,
    timestamp: "2024-05-09-19:49",
    numOfUploadImages: 100,
    numOfSucceedProcessImages: 90,
    title: '第一次数学模拟考试'
  }, {
    patchId: 1,
    timestamp: "2024-05-09-19:49",
    numOfUploadImages: 100,
    numOfSucceedProcessImages: 90,
    title: '第一次数学模拟考试'
  }, {
    patchId: 1,
    timestamp: "2024-05-09-19:49",
    numOfUploadImages: 100,
    numOfSucceedProcessImages: 100,
    title: '第一次数学模拟考试'
  }])

function getColorBarStyle(gradeInfo) {
  if (gradeInfo.numOfSucceedProcessImages === gradeInfo.numOfUploadImages) {
    return {backgroundColor: '#90be6d'}
  } else {
    return {backgroundColor: '#f94144'}
  }
}

function goToGrade() {

}

const files = ref([])
const fileInputButton = ref(null)

function fileInput(event) {
  files.value = event.target.files;
}

function handleFileUpload() {
  fileInputButton.value.click()
}

watch(files, () => {
  if (files.value.length === 0) {
    return
  }
  const formData = new FormData();
  files.value.forEach(file => {
    formData.append('files[]', file);
  });

  http.post('/grade/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
      .then(response => {
        console.log('文件上传成功:', response.data);

      })
      .catch(error => {
        console.error('上传出错:', error);

      });


}, {immediate: false})

const searchInput = ref('')
</script>

<template>
  <div class="grade-overview">
    <h1>批改</h1>
    <div class="upload-search">
      <input type="file" ref="fileInputButton" @change="fileInput" multiple style="display: none;">
      <el-button type="primary" style="background-color: #277da1;border: 0" @click="handleFileUpload">
        上传答题卡
        <el-icon class="el-icon--right">
          <Upload/>
        </el-icon>
      </el-button>

      <el-input
          v-model="searchInput"
          style="max-width: 600px"
          placeholder="输入答题卡标题或时间"
          class="input-with-select"
      >
        <template #append>
          <el-button :icon="Search"/>
        </template>
      </el-input>
    </div>
    <div class="grade-info-container" v-for="gradeInfo in gradeInfos">
      <div class="card" @click="goToGrade">
        <div class="color-bar" :style="getColorBarStyle(gradeInfo)"></div>
        <div class="card-content">
          <GradeInfo :gradeInfo="gradeInfo"></GradeInfo>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.upload-search {
  display: flex;
  width: 80%;
  justify-content: space-around
}

.grade-overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.grade-info-container {
  display: flex;
  flex-direction: column;
  width: 80%
}

.card {
  display: flex;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
  border-radius: 5px;
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
  transform: scale(1.05);
  transition: transform 0.1s ease;
}

.color-bar {
  width: 20px;
}

.card-content {
  padding: 20px;
  flex-grow: 1;
  height: 60px;
}


</style>