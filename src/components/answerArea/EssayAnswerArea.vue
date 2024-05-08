<script setup>
import {computed, onMounted} from "vue";
import projectConfig, {getAnswerAreaAccordingId, getAnswerAreaIndex} from "@/components/projectConfig.js";
import AnswerAreaTitle from "@/components/answerArea/AnswerAreaTitle.vue";

const props = defineProps({
  height: Number,
  areaId: Number,
  indexOfSheets: Number,
  indexOfAnswerAreaContainers: Number,
  sheetContainer: Object
})

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


const dpi = 96
const mmToInch = 25.4
const pixelPerMm = dpi / mmToInch

const defaultFontWidth = projectConfig.value.defaultFontWidth
const defaultFontWidthPx = defaultFontWidth * pixelPerMm
const defaultClientAnswerHeightPx = 2 * defaultFontWidthPx
const clientAnswerStyle = {
  height: defaultClientAnswerHeightPx + 'px'
}

</script>

<template>
  <AnswerAreaTitle :title-ctx="answerArea.title"
                   :answer-area-index="answerAreaIndex"></AnswerAreaTitle>
  <div class="answerContainer">
    <div style="display: flex;width: 100%;align-items: flex-end">
      <div class="questionNumber" style="font-size: 30px">{{ answerArea.answers[0].questionNumber }}</div>
      <div class="clientAnswer" style="border-bottom: 1px solid black;width: 100%"
           :style="clientAnswerStyle"></div>
    </div>

    <div v-for="line in answerArea.answers[0].numOfLines" class="clientAnswer"
         style="border-bottom: 1px solid black;width: 100%"
         :style="clientAnswerStyle"></div>


  </div>
</template>

<style scoped>
.answerContainer {
  box-sizing: border-box;
  margin: 0;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  border: 2px solid #000000;
}

</style>