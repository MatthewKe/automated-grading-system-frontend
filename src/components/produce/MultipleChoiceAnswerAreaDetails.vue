<script setup>

import {computed, nextTick, ref} from "vue";
import {addAnswer, deleteAnswer} from "@/components/projectConfig.js";
import {getAnswerArea4AnswerAreaDetails} from "@/components/detailsOfProduce.js";

const ifAutomated = ref(true)
const answerArea = computed(() => getAnswerArea4AnswerAreaDetails())
const deleteRow = (index) => {
  deleteAnswer(answerArea.value.id, answerArea.value.answers[index].questionNumber)
}

const onAddItem = () => {
  let score
  if (answerArea.value.answers.length === 0) {
    score = 4
  } else {
    score = answerArea.value.answers[answerArea.value.answers.length - 1].score
  }
  addAnswer(answerArea.value.id, [], score)
  nextTick(() => {
    scrollToBottom();
  })
}
const tableRef = ref(null)

function scrollToBottom() {
  const table = tableRef.value.$el.querySelector('.el-scrollbar__wrap');
  if (table) {
    table.scrollTop = table.scrollHeight;
  }
}
</script>

<template>
  <div v-if="answerArea">
    <div style="display: flex;align-items: center;width: 90%;gap:40px">
      <h2>自动批卷</h2>
      <el-switch v-model="ifAutomated"/>
    </div>
    <h2>题目设置</h2>
    <el-table ref="tableRef" :data="answerArea.answers" style="width: 90%" max-height="230">
      <el-table-column fixed prop="questionNumber" label="题号" width="60"/>
      <el-table-column prop="correctAnswer" label="答案" width="80">
        <template #default="scope">
          <el-input v-model="answerArea.answers[scope.$index].correctAnswer" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="分值" width="60">
        <template #default="scope">
          <el-input v-model="answerArea.answers[scope.$index].score" size="small"></el-input>
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
    <el-button style="width: 90%" @click="onAddItem">
      添加题目
    </el-button>
    <el-divider/>
    <h2>答题区域尺寸</h2>
    <div>
      <div>
        <h4>长度(mm)</h4>
        <el-input-number v-model="answerArea.height" :min="0" :precision="2" :disabled="true"/>
      </div>
      <div>
        <h4>宽度(mm)</h4>
        <el-input-number v-model="answerArea.width" :min="0" :precision="2" :disabled="true"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>