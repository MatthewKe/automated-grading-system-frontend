<script setup>

import {Timer, Upload} from "@element-plus/icons-vue";
import {ref} from "vue";
import router from "@/main.js";
import http from "@/components/http.js";
import * as XLSX from "xlsx";
import {saveAs} from 'file-saver';

const activeNames = ref(['1'])
const handleChange = (val) => {
  console.log(val)
}
const props = defineProps({
  batchInfo: String,
  batchNumber: String
})
const containerHeight = window.innerHeight - document.getElementById('navigation-bar').getBoundingClientRect().height - 1
const batchGradeInfos = ref([])
const failedOriginalImageInfos = ref([])

http.get(`/grade/getBatchGradeInfo?batchNumber=${props.batchNumber}`)
    .then(response => {
      console.log(response.data)
      if (response.data.failedOriginalImageInfos)
        for (let failedOriginalImageInfo of response.data.failedOriginalImageInfos) {
          http.get(`/grade/getOriginalImage?originalImageId=${failedOriginalImageInfo.failedOriginalImageId}`, {responseType: 'blob'})
              .then(response => {
                failedOriginalImageInfos.value.push({
                  imgURL: URL.createObjectURL(response.data),
                  failedReason: failedOriginalImageInfo.failedReason
                })
                console.log(response)
              })
        }
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

function exportToExcel() {
  const data = batchGradeInfos.value.studentGradeInfoVOs.map((item) => {
    const row = {
      学生姓名: item.studentName,
      学生ID: item.studentId,
      是否缺项: item.ifComplete,
      总分: item.scoreAddUp,
    };
    for (let n = 1; n <= batchGradeInfos.value.maxAnswerNumber; n++) {
      row[`题目${n}得分`] = item.scores[`${n}`];
    }
    return row;
  });

  // 创建工作簿和工作表
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // 生成Excel文件并保存
  const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
  saveAs(new Blob([wbout], {type: 'application/octet-stream'}), 'table-data.xlsx');

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
      <el-button @click="exportToExcel">Export to Excel</el-button>
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
    <el-collapse style="background: white;margin: 20px;padding: 10px;border-radius: 0.375rem;" v-model="activeNames"
                 @change="handleChange">
      <el-collapse-item title="处理出错的答题卡图片" name="1">
        <div class="component-container">
          <div v-for="failedOriginalImageInfo of failedOriginalImageInfos" style="max-width: 30%; max-height: 30%">
            <el-card>
              <el-image style="width: 100%; height: 100%" :src="failedOriginalImageInfo.imgURL" fit="scale-down"/>
              <template #footer>
                <div class="card-header">
                  <span>出错原因： {{ failedOriginalImageInfo.failedReason }}</span>
                </div>
              </template>
            </el-card>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

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

::v-deep .el-collapse-item__header {

  color: #909399; /* 文字颜色 */
  font-size: 18px; /* 文字大小 */
  font-weight: bold; /* 字体加粗 */
  padding: 10px; /* 内边距 */
  border-radius: 4px; /* 圆角 */
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