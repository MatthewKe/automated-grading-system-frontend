<script setup>

import {Timer, Upload} from "@element-plus/icons-vue";
import {ref} from "vue";

const containerHeight = window.innerHeight - document.getElementById('navigation-bar').getBoundingClientRect().height - 1
const gradeInfos = ref({
  studentsGradeInfo: [
    {
      studentName: 'keke',
      studentId: '201180082',
      originalImagesInfoId: 20,
      answer1: 10,
      answer2: 20,
      scoreAddUp: 60,
      ifComplete: '缺项'
    }, {
      studentName: 'keke1',
      studentId: '201180083',
      originalImagesInfoId: 20,
      answer1: 10,
      answer3: 20,
      scoreAddUp: 60,
      ifComplete: '完整'
    }
  ],
  maxAnswerNumber: 10
})

const props = defineProps({
  batchInfo: String,
  studentInfo: String,
  batchNumber: String
})
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
          :data="gradeInfos.studentsGradeInfo"
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
            v-for="n in gradeInfos.maxAnswerNumber"
            :key="`answer${n}`"
            :prop="`answer${n}`"
            :label="`题目${n}得分`"
            width="100">
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