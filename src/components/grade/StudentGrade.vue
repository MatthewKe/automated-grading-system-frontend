<script setup>

import {Timer, Upload} from "@element-plus/icons-vue";
import {ref, watch} from "vue";
import http from "@/components/http.js";
import CardImage from "@/assets/card.png"

const containerHeight = window.innerHeight - document.getElementById('navigation-bar').getBoundingClientRect().height - 1
const batchGradeInfos = ref([])

const props = defineProps({
  batchInfo: String,
  studentInfo: String,
  batchNumber: String
})

const originalImages = ref([])

const processedImageInfos = ref([])

watch(processedImageInfos, processedImageInfos => {
  console.log(processedImageInfos)
})

function getStudentGradeInfo() {
  http.get(`/grade/getStudentGradeInfo?batchNumber=${props.batchNumber}&studentId=${props.studentInfo.split(' ')[0]}`)
      .then(response => {
        console.log(response)
        batchGradeInfos.value = response.data
      })
}

function getStudentOriginalImageIds() {
  http.get(`/grade/getStudentOriginalImageIds?batchNumber=${props.batchNumber}&studentId=${props.studentInfo.split(' ')[0]}`)
      .then(response => {
        for (let originalImageId of response.data) {
          http.get(`/grade/getOriginalImage?originalImageId=${originalImageId}`, {responseType: 'blob'})
              .then(response => {
                originalImages.value.push(URL.createObjectURL(response.data))
                console.log(response)
              })
        }
      })
}

function getStudentProcessedImageIds() {
  http.get(`/grade/getStudentProcessedImageIds?batchNumber=${props.batchNumber}&studentId=${props.studentInfo.split(' ')[0]}`)
      .then(response => {
        console.log(response)
        response.data.sort((a, b) => Number(a.answerNumber) - Number(b.answerNumber))
        processedImageInfos.value = response.data;
        for (let processedImageInfo of processedImageInfos.value) {
          http.get(`/grade/getProcessedImage?processedImageId=${processedImageInfo.processedImageInfoId}`, {responseType: 'blob'})
              .then(response => {
                processedImageInfo.imgURL = URL.createObjectURL(response.data)
              })
        }
      })
}


function updateScore(processedImageInfo) {
  http.post(`/grade/updateScore`, processedImageInfo)
      .then(_ => {
        getStudentGradeInfo()
      })
}


getStudentGradeInfo()
getStudentOriginalImageIds()
getStudentProcessedImageIds()

</script>

<template>
  <el-scrollbar style="background: #F4F6F8" :style="{height:containerHeight+'px'}">
    <el-breadcrumb separator="/" style="padding-top: 20px;padding-left: 20px">
      <el-breadcrumb-item :to="{ path: '/grade_overview' }">批改答题卡</el-breadcrumb-item>
      <el-breadcrumb-item
          :to="{path:'/batch_grade',query: {batchNumber: props.batchNumber, batchInfo: props.batchInfo}}">
        {{ props.batchInfo }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ props.studentInfo }}</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 style=" margin: 20px;font-size: 50px">学生答题卡详情</h1>
    <div class="container">
      <el-table
          :data="batchGradeInfos.studentGradeInfoVOs"
          style="width: 100%"
          row-key="studentId"
      >
        <el-table-column
            prop="studentName"
            label="学生姓名"
            width="120">
        </el-table-column>
        <el-table-column
            prop="studentId"
            label="学生ID"
            width="120">
        </el-table-column>
        <el-table-column
            prop="ifComplete"
            label="是否缺项"
            width="100">
          <template #default="scope">
            <div style="display: flex">
              <div v-if="scope.row.ifComplete==='完整'"
                   style="background: #90be6d;padding-left: 5px;padding-right: 5px">
                {{ scope.row.ifComplete }}
              </div>
              <div v-if="scope.row.ifComplete==='缺项'"
                   style="background: #FFD43A;padding-left: 5px;padding-right: 5px">
                {{ scope.row.ifComplete }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="scoreAddUp"
            label="总分"
            width="100">
        </el-table-column>
        <el-table-column
            v-for="n in batchGradeInfos.maxAnswerNumber"
            :key="`answer${n}`"
            :prop="`answer${n}`"
            :label="`题目${n}得分`"
            width="100">
          <template #default="scope">
            {{ batchGradeInfos.studentGradeInfoVOs[scope.$index].scores[`${n}`] }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="component-container">
      <el-carousel height="500px" style="width: 100%;">
        <el-carousel-item v-for="item in originalImages" :key="item">
          <el-image style="width: 100%; height: 100%" :src="item" fit="scale-down"/>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="component-container">
      <div v-for="processedImageInfo of processedImageInfos" :key="processedImageInfo.processedImageInfoId">
        <el-card style="">
          <template #header>
            <div class="card-header">
              <span>题目 {{ processedImageInfo.answerNumber }}</span>
            </div>
          </template>
          <el-image style="width: 100%; height: 100%" :src="processedImageInfo.imgURL" fit="scale-down"/>
          <template #footer>得分：
            <el-input-number size="small" v-model="processedImageInfo.score" :precision="1" :step="0.5"
                             @change="updateScore(processedImageInfo)"/>
          </template>
        </el-card>
      </div>
    </div>

  </el-scrollbar>
</template>
<style scoped>

.component-container {
  justify-content: space-around;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  background: white;
  margin: 20px;
  padding: 10px;
  border-radius: 0.375rem;
}

.container {
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