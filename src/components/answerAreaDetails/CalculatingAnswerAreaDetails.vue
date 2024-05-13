<script setup>

import {computed, ref} from "vue";
import {getAnswerArea4AnswerAreaDetails} from "@/components/detailsOfProduce.js";

const ifAutomated = ref(true)
const answerArea = computed(() => getAnswerArea4AnswerAreaDetails())


const tableRef = ref(null)

</script>

<template>
  <div v-if="answerArea">
    <h2>题目设置</h2>
    <div style="display: flex;align-items: center;width: 90%;gap:20px">
      <h3>分值</h3>
      <el-input v-model="answerArea.answers[0].score" size="small" style="width: 40px"></el-input>
    </div>

    <h3>正确答案</h3>
    <el-input v-model="answerArea.answers[0].correctAnswer" size="small"></el-input>
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
  </div>
</template>

<style scoped>

</style>