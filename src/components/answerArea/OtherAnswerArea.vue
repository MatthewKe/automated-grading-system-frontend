<script setup>
import {computed, onMounted, ref} from "vue";
import {getAnswerAreaAccordingId, getAnswerAreaIndex} from "@/components/projectConfig.js";
import AnswerAreaTitle from "@/components/answerArea/AnswerAreaTitle.vue";


const props = defineProps({
  width: Number,
  height: Number,
  areaId: Number
})

const dpi = 96
const mmToInch = 25.4
const pixelPerMm = dpi / mmToInch

const answerArea = computed(() => getAnswerAreaAccordingId(props.areaId))
const answerAreaIndex = computed(() => getAnswerAreaIndex(props.areaId))
const answerAreaTitleHeight = ref(0)
const answerContainerHeight = computed(() => props.height - answerAreaTitleHeight.value)
const answerAreaTitle = ref(null)

onMounted(() => {
  answerAreaTitleHeight.value = answerAreaTitle.value.$el.clientHeight
})

let startY

function startResize(event) {
  startY = event.clientY;
}

const doResize = (event) => {
  const heightDiff = event.clientY - startY;
  let scale = 0.3
  let transform = document.getElementById('container').getElementsByClassName('content')[0].style.transform
  const regex = /scale\(([^)]+)\)/;
  const match = transform.match(regex);
  if (match && match[1]) {
    scale = parseFloat(match[1]);
  } else {
    console.log("No scale value found");
  }
  answerArea.value.height += heightDiff / pixelPerMm / scale
}
</script>

<template>
  <AnswerAreaTitle ref="answerAreaTitle" :title-ctx="answerArea.title"
                   :answer-area-index="answerAreaIndex"></AnswerAreaTitle>
  <div class="flexibleContainer">
    <div class="answerContainer" :style="{width: width+'px',height:answerContainerHeight+'px'}">
      <div class="questionNumber" style="font-size: 30px">{{ answerArea.answers[0].questionNumber }}</div>
    </div>
    <div class="drag-handle" draggable="true" @dragstart.stop="startResize" @drag.stop @dragend.stop="doResize"></div>
  </div>
</template>

<style scoped>
.flexibleContainer {
  position: relative;

}

.drag-handle {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  height: 20px;
  background: rgba(0, 51, 255, 0);
  cursor: ns-resize;
}

.answerContainer {
  position: relative;
  box-sizing: border-box;
  margin: 0;
  padding: 10px;
  display: flex;
  border: 2px solid #000000;
}

</style>