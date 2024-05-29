<script setup>

import {computed, ref, watch} from "vue";
import {getAnswerArea4AnswerAreaDetails} from "@/components/detailsOfProduce.js";
import {Upload} from "@element-plus/icons-vue";
import http from "@/components/http.js";

const ifAutomated = ref(true)
const answerArea = computed(() => getAnswerArea4AnswerAreaDetails())


const tableRef = ref(null)


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

  files.value = [];
}, {immediate: false, deep: true})

</script>

<template>
  <div v-if="answerArea">
    <h2>题目设置</h2>
    <div style="display: flex;align-items: center;width: 90%;gap:20px">
      <h3>分值</h3>
      <el-input v-model="answerArea.answers[0].score" size="small" style="width: 40px"></el-input>
    </div>
    <div style="display: flex;align-items: center;width: 90%;gap:20px">
      <h3>行数</h3>
      <el-input-number v-model="answerArea.answers[0].numOfLines" size="small" style="width: 100px"></el-input-number>
    </div>


    <div style="display: flex;justify-content: center;width: 100%">

      <input type="file" ref="fileInputButton" @input="fileInput" multiple style="display: none;">

      <el-button style="width: 90%" @click="handleFileUpload">
        上传范文
      </el-button>
    </div>

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