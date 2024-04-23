<script setup>

import {computed, ref} from "vue";
import {addQuestion, deleteQuestion, getAnswerArea} from "@/components/projectConfig.js";
import clickEvent from "@/components/clickState.js";


const ifAutomated = ref(true)


const answerArea = computed(() => getAnswerArea(clickEvent.value.targetId))

const tableData = computed(() => {
      let tableData = []
      for (const answer of answerArea.value.answers) {
        tableData.push({
          questionNumber: answer.questionNumber,
          correctAnswer: answer.correctAnswer.join("")
        })
      }
      return tableData
    }
)

const deleteRow = (index) => {
  deleteQuestion(answerArea.value.id, tableData.value[index].questionNumber)
}

const onAddItem = () => {
  let questionNumber
  if (answerArea.value.questionNumbers.length === 0) {
    questionNumber = answerArea.value.preQuestionNumber + 1
  } else {
    questionNumber = answerArea.value.questionNumbers[answerArea.value.questionNumbers.length - 1] + 1
  }

  addQuestion(answerArea.value.id, {
    "questionNumber": questionNumber,
    "correctAnswer": []
  })
}
</script>

<template>
  <h2>自动批卷</h2>
  <el-switch v-model="ifAutomated"/>
  <el-table :data="tableData" style="width: 90%" max-height="250">
    <el-table-column fixed prop="questionNumber" label="题号" width="60"/>
    <el-table-column prop="correctAnswer" label="正确答案" width="130">
      <template #default="scope">
        <el-input v-model="scope.row.correctAnswer" size="large"></el-input>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="" width="40">
      <template #default="scope">
        <el-button
            link
            type="primary"
            size="small"
            @click.prevent="deleteRow(scope.$index)"
        >
          移除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button class="mt-4" style="width: 90%" @click="onAddItem">
    Add Item
  </el-button>
  <el-divider/>
  <h2>答题区域尺寸</h2>
  <div>
    <div>
      <h4>长度(mm)</h4>
      <el-input-number v-model="answerArea.height" :min="0" :precision="2"/>
    </div>

    <div>
      <h4>宽度(mm)</h4>
      <el-input-number v-model="answerArea.width" :min="0" :precision="2" :disabled="true"/>
    </div>

  </div>
</template>

<style scoped>

</style>