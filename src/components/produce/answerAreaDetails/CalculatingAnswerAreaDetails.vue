<script setup>

import {computed, ref} from "vue";
import {getAnswerArea4AnswerAreaDetails} from "@/components/detailsOfProduce.js";
import {Delete, Plus} from "@element-plus/icons-vue";
import {deleteAnswerArea} from "@/components/projectConfig.js";

const ifAutomated = ref(true)
const answerArea = computed(() => getAnswerArea4AnswerAreaDetails())


const tableRef = ref(null)

const answers = ref([])
const answerValues = ref([])

function onAddItem() {
  answers.value.push('');
  answerValues.value.push(0)
}
</script>

<template>
  <div v-if="answerArea">
    <h2>题目设置</h2>
    <div style="display: flex;align-items: center;width: 90%;gap:20px">
      <h3>总分</h3>
      <el-input v-model="answerArea.answers[0].score" style="width: 40px"></el-input>
    </div>
    <div style="display: flex;align-items: center;width: 90%;gap:20px">
      <h3>答案</h3>
      <el-input v-model="answerArea.answers[0].correctAnswer" style="width: 200px"></el-input>
    </div>
    <div v-for="(item, index) in answers">
      <el-divider border-style="dashed" style="padding: 0;margin: 0;"/>
      <div style="display: flex;align-items: center;width: 90%;gap:20px">
        <h3>分值</h3>
        <el-input v-model="answerValues[index]" style="width: 40px"></el-input>
        <div style="flex-grow: 1;display: flex;justify-content: flex-end">
          <el-button type="danger" :icon="Delete" circle @click=""/>
        </div>
      </div>
      <div style="display: flex;align-items: center;width: 90%;gap:20px">
        <h3>答案</h3>
        <el-input style="width: 200px" v-model="answers[index]"></el-input>
      </div>
    </div>
    <el-button style="width: 90%" @click="onAddItem">
      添加步骤
    </el-button>

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