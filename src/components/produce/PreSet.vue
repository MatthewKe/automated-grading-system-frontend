<script setup>

import {computed} from 'vue'
import CalculatingAnswerAreaInPreSet from "@/components/answerArea/CalculatingAnswerAreaInPreSet.vue";
import OtherAnswerAreaInPreSet from "@/components/answerArea/OtherAnswerAreaInPreSet.vue";
import EssayAnswerAreaInPreSet from "@/components/answerArea/EssayAnswerAreaInPreSet.vue";
import FillBlanksAnswerAreaInPreSet from "@/components/answerArea/FillBlanksAnswerAreaInPreSet.vue";
import MultipleChoiceAnswerAreaInPreSet from "@/components/answerArea/MultipleChoiceAnswerAreaInPreSet.vue";
import http from "@/components/http.js";
import {useRoute} from "vue-router";

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

function printDiv() {
  let content = document.getElementById('sheetContainer').innerHTML;
  let iframe = document.createElement('iframe');
  iframe.style.visibility = 'hidden';
  iframe.style.position = 'absolute';
  iframe.style.left = '-9999px';
  document.body.appendChild(iframe);

  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write('<html><head><title>打印预览</title></head><body>');
  iframe.contentWindow.document.write(content);
  iframe.contentWindow.document.write('</body></html>');
  iframe.contentWindow.document.close();

  iframe.contentWindow.focus();
  iframe.contentWindow.print();
  document.body.removeChild(iframe);
}

const route = useRoute()

async function downloadPDF() {
  try {
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
    window.URL.revokeObjectURL(url);  // 清理生成的URL
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error.response);
  }
}


</script>


<template>

  <div id="pre-set-container" :style="{width:preSetWidth+'px'}">
    <h1 style="margin: 0px">题型模板</h1>
    <component v-for="(answerAreaInPreSet) in answerAreaInPreSetArr" :is="answerAreaInPreSet"
               :height="componentHeight"
               :width="componentWidth"></component>

    <el-button type="primary" @click="downloadPDF">保存为PDF</el-button>

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