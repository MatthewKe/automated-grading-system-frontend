<script setup>
import {computed, onMounted} from "vue";
import projectConfig, {getAnswerAreaAccordingId, getAnswerAreaIndex} from "@/components/projectConfig.js";
import AnswerAreaTitle from "@/components/produce/answerArea/AnswerAreaTitle.vue";


const props = defineProps({
  height: Number,
  areaId: Number,
  indexOfSheets: Number,
  indexOfAnswerAreaContainers: Number,
  sheetContainer: Object
})


const dpi = 96
const mmToInch = 25.4
const pixelPerMm = dpi / mmToInch

const defaultFontWidth = projectConfig.value.defaultFontWidth
const defaultFontWidthPx = defaultFontWidth * pixelPerMm
const defaultClientAnswerWidthPx = 3 * defaultFontWidthPx
const defaultClientAnswerHeightPx = 2 * defaultFontWidthPx
const clientAnswerStyle = {
  width: defaultClientAnswerWidthPx + 'px',
  height: defaultClientAnswerHeightPx + 'px'
}

const answerArea = computed(() => getAnswerAreaAccordingId(props.areaId))

const answerAreaIndex = computed(() => getAnswerAreaIndex(props.areaId))
const updateHeight = (entries) => {
  for (const entry of entries) {
    if (answerArea.value) {
      answerArea.value.height = entry.contentRect.height / pixelPerMm
    }
  }
}

onMounted(() => {
  const element = document.getElementById(props.areaId);
  if (element) {
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
  }
})


</script>

<template>
  <AnswerAreaTitle :title-ctx="answerArea.title" :answer-area-index="answerAreaIndex"></AnswerAreaTitle>
  <div class="answerContainer">
    <div v-for="answer in answerArea.answers" class="subQuestion">
      <div class="questionNumber" style="font-size: 30px">{{ answer.questionNumber }}.</div>
      <div class="clientAnswer" style="border-bottom: 1px solid black"
           :style="clientAnswerStyle" :question-number="answer.questionNumber"></div>
    </div>
  </div>
</template>

<style scoped>
.answerContainer {
  box-sizing: border-box;
  margin: 0;
  padding-bottom: 10px;
  padding-right: 10px;
  padding-left: 10px;
  display: flex;
  border: 2px solid #000000;
  flex-wrap: wrap;
  justify-content: space-between
}

.clientAnswer {
  padding: 10px;
}

.questionNumber {
  display: flex;
  align-items: flex-end;
}

.subQuestion {
  display: flex;
}

</style>