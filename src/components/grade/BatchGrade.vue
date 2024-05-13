<script setup>

import {Timer, Upload} from "@element-plus/icons-vue";
import {ref} from "vue";
import router from "@/main.js";
import http from "@/components/http.js";


const props = defineProps({
  batchInfo: String,
  batchNumber: String
})
const containerHeight = window.innerHeight - document.getElementById('navigation-bar').getBoundingClientRect().height - 1
const batchGradeInfos = ref([])

http.get(`/grade/getBatchGradeInfo?batchNumber=${props.batchNumber}`)
    .then(response => {
      console.log(response.data)
      batchGradeInfos.value = response.data
    })

async function goToStudentGrade(row) {
  try {
    const studentId = row.studentId
    const studentName = row.studentName
    await router.push({
      path: '/student_grade',
      query: {
        studentId: studentId,
        batchInfo: props.batchInfo,
        studentInfo: studentId + ' ' + studentName,
        batchNumber: props.batchNumber
      }
    })
  } catch (error) {
    console.error('goToGrade failed:', error);
  }
}
</script>

<template>
  <el-scrollbar style="background: #F4F6F8" :style="{height:containerHeight+'px'}">
    <el-breadcrumb separator="/" style="padding-top: 20px;padding-left: 20px">
      <el-breadcrumb-item :to="{ path: '/grade_overview' }">批改答题卡</el-breadcrumb-item>
      <el-breadcrumb-item>{{ props.batchInfo }}</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 style=" margin: 20px;font-size: 50px">答题卡批改结果</h1>
    <div class="container">
      <el-table
          :data="batchGradeInfos.studentGradeInfoVOs"
          style="width: 100%"
          row-key="studentId"
          @row-click="goToStudentGrade"
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

  </el-scrollbar>
</template>
<style scoped>

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