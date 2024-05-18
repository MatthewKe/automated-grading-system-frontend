<script setup>

import {computed, ref} from 'vue'
import CalculatingAnswerAreaInPreSet from "@/components/produce/preset/CalculatingAnswerAreaInPreSet.vue";
import OtherAnswerAreaInPreSet from "@/components/produce/preset/OtherAnswerAreaInPreSet.vue";
import EssayAnswerAreaInPreSet from "@/components/produce/preset/EssayAnswerAreaInPreSet.vue";
import FillBlanksAnswerAreaInPreSet from "@/components/produce/preset/FillBlanksAnswerAreaInPreSet.vue";
import MultipleChoiceAnswerAreaInPreSet from "@/components/produce/preset/MultipleChoiceAnswerAreaInPreSet.vue";
import http from "@/components/http.js";
import {useRoute} from "vue-router";
import downloadPDFState from "@/components/produce/downloadPDF.js";
import {Download, Upload} from "@element-plus/icons-vue";

const props = defineProps({
  preSetWidth: Number
})

const componentHeight = computed(() => componentWidth.value / 2)
const componentWidth = computed(() => props.preSetWidth)

const answerAreaInPreSetArr = [
  MultipleChoiceAnswerAreaInPreSet,
  FillBlanksAnswerAreaInPreSet,
  CalculatingAnswerAreaInPreSet, EssayAnswerAreaInPreSet, OtherAnswerAreaInPreSet
]


const route = useRoute()

const fullscreenLoading = ref(false)

async function downloadPDF() {
  try {
    fullscreenLoading.value = true;
    const response = await http.get(`/produce/download?projectId=${route.query.project_id}`, {
      responseType: 'arraybuffer'
    });
    console.log('downloadPDF successful:', response);
    const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'example.pdf');  // 指定下载文件名
    document.body.appendChild(link);
    link.click();  // 触发下载
    fullscreenLoading.value = false;
    window.URL.revokeObjectURL(url);  // 清理生成的URL
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error.response);
  }
}

function getCoordinate() {

}

function clickDownload() {
  //计量各个组件的坐标并commit
  downloadPDFState.value = true
  downloadPDF()
}


</script>


<template>

  <div id="pre-set-container" :style="{width:preSetWidth+'px'}">
    <h1 style="margin: 0px">题型模板</h1>
    <component v-for="(answerAreaInPreSet) in answerAreaInPreSetArr" :is="answerAreaInPreSet"
               :height="componentHeight"
               :width="componentWidth"></component>

    <el-button v-loading.fullscreen.lock="fullscreenLoading" style="font-weight: bold;padding: 10px" type="primary"
               @click="clickDownload">
      导出答题卡PDF
      <el-icon class="el-icon--right" size="20px">
        <Download/>
      </el-icon>
    </el-button>

  </div>

</template>

<style scoped>
#pre-set-container {
  padding: 20px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  flex-wrap: nowrap;
  background: #f6f7f8;
}


</style>