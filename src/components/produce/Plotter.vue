<script setup>
import {computed, inject, onMounted, ref, watch} from 'vue'
import OtherAnswerArea from "@/components/produce/answerArea/OtherAnswerArea.vue";
import InfoArea from "@/components/InfoArea.vue";
import projectConfig, {addAnswerArea, getAnswer, reorderAnswerArea} from "@/components/projectConfig.js";
import CalculatingAnswerArea from "@/components/produce/answerArea/CalculatingAnswerArea.vue";
import MultipleChoiceAnswerArea from "@/components/produce/answerArea/MultipleChoiceAnswerArea.vue";
import EssayAnswerArea from "@/components/produce/answerArea/EssayAnswerArea.vue";
import FillBlanksAnswerArea from "@/components/produce/answerArea/FillBlanksAnswerArea.vue";
import {setClickEvent} from "@/components/clickState.js";
import {throttle} from "lodash";
import downloadPDFState from "@/components/produce/downloadPDF.js";

const sizes = {
  A3: {width: 420, height: 297},
  A4: {width: 297, height: 210}
}
const sizeOfInfoAreaPx = computed(() => 198)

const dpi = 96
const mmToInch = 25.4
const pixelPerMm = dpi / mmToInch

const sheetsPaddingPx = computed(() => projectConfig.value.sheetsPadding * pixelPerMm)

const widthOfSheetPx = computed(() => {
  if (projectConfig.value.sizeOfSheet === 'A3') {
    return sizes.A3.width * pixelPerMm - sheetsPaddingPx.value * 2
  }
  if (projectConfig.value.sizeOfSheet === 'A4') {
    return sizes.A4.width * pixelPerMm - sheetsPaddingPx.value * 2
  }
  return sizes.A3.width * pixelPerMm - sheetsPaddingPx.value * 2
})

const heightOfSheetPx = computed(() => {
      if (projectConfig.value.sizeOfSheet === 'A3') {
        return sizes.A3.height * pixelPerMm - sheetsPaddingPx.value * 2
      }
      if (projectConfig.value.sizeOfSheet === 'A4') {
        return sizes.A4.height * pixelPerMm - sheetsPaddingPx.value * 2
      }
      return sizes.A3.height * pixelPerMm - sheetsPaddingPx.value * 2
    }
)

const answerAreaContainerPaddingPx = computed(() => projectConfig.value.answerAreaContainerPadding * pixelPerMm)

const borderOfAnswerAreaContainerPx = 2.4

const heightOfAnswerAreaContainerPx = computed(() => heightOfSheetPx.value - 2 * answerAreaContainerPaddingPx.value - 2 * borderOfAnswerAreaContainerPx)

const title = computed(() => projectConfig.value.title)

const sheets = computed(() => projectConfig.value.sheets)

const gapBetweenAnswerAreaContainerPx = computed(() => projectConfig.value.gapBetweenAnswerAreaContainer * pixelPerMm)

const gapBetweenAnswerAreaPx = computed(() => projectConfig.value.gapBetweenAnswerArea * pixelPerMm)


let answerAreaContainers = ref([])


const throttledFunc = throttle(() => {
  answerAreaContainers.value = updateAnswerAreaContainers()
}, 20);

watch(projectConfig, throttledFunc, {
  immediate: true,
  deep: true
})


function updateAnswerAreaContainers() {
  console.log('updateAnswerAreaContainers')
  //生成answerAreaContainers，并且预装info-area
  let answerAreaContainers = []
  let numOfSheets = projectConfig.value.sheets.length
  for (let i = 0; i < numOfSheets; i++) {
    let numOfAnswerAreaContainers = sheets.value[i].numOfAnswerAreaContainers
    let answerAreaContainer = []
    for (let j = 0; j < numOfAnswerAreaContainers; j++) {
      if (j === 0) {
        answerAreaContainer.push([{type: "infoArea"}])
      } else {
        answerAreaContainer.push([])
      }
    }
    answerAreaContainers.push(answerAreaContainer)
  }
  let answerAreas = projectConfig.value.answerAreas

  //计算填充answerAreaContainers
  let indexOfSheets = 0
  let indexOfAnswerAreaContainers = 0
  let heightLeftPx = heightOfAnswerAreaContainerPx.value - sizeOfInfoAreaPx.value

  for (let answerArea of answerAreas) {
    let answerAreaHeightPx = answerArea.height * pixelPerMm
    if (heightLeftPx < answerAreaHeightPx + gapBetweenAnswerAreaPx.value) {
      indexOfAnswerAreaContainers++
      heightLeftPx = heightOfAnswerAreaContainerPx.value
    }
    if (indexOfAnswerAreaContainers >= sheets.value[indexOfSheets].numOfAnswerAreaContainers) {
      indexOfSheets++
      indexOfAnswerAreaContainers = 0
      heightLeftPx = heightLeftPx - sizeOfInfoAreaPx.value
    }
    if (indexOfSheets >= projectConfig.value.sheets.length) {
      //需要新增一个sheet
      projectConfig.value.sheets.push({
        "numOfAnswerAreaContainers": 3
      })
      return answerAreaContainers
    }

    let answerAreaWidthPx = (widthOfSheetPx.value - (projectConfig.value.sheets[indexOfSheets].numOfAnswerAreaContainers - 1) * gapBetweenAnswerAreaContainerPx.value) / projectConfig.value.sheets[indexOfSheets].numOfAnswerAreaContainers - 2 * answerAreaContainerPaddingPx.value
    answerArea.width = answerAreaWidthPx / pixelPerMm
    answerArea.indexOfSheets = indexOfSheets
    answerArea.indexOfAnswerAreaContainers = indexOfAnswerAreaContainers
    answerAreaContainers[indexOfSheets][indexOfAnswerAreaContainers].push(
        {
          id: answerArea.id,
          type: answerArea.type,
          height: answerAreaHeightPx,
          // width: answerAreaWidthPx
        })
    heightLeftPx = heightLeftPx - answerAreaHeightPx - gapBetweenAnswerAreaPx.value
  }
  console.log(answerAreaContainers)
  return answerAreaContainers
}

function handleDrop(event) {
  event.preventDefault();
  const answerAreaContainer = event.currentTarget
  const y = event.clientY - answerAreaContainer.getBoundingClientRect().top
  const answerAreaArr = answerAreaContainer.children
  let idOfSubsequentAnswerArea = -1
  let idOfPreAnswerArea = -1
  for (const answerArea of answerAreaArr) {
    if (answerArea.children[0].className === 'info-area') {
      continue
    }
    let answerAreaY = answerArea.getBoundingClientRect().top - answerAreaContainer.getBoundingClientRect().top
    let answerAreaHeight = answerArea.getBoundingClientRect().height
    if (y < answerAreaY + answerAreaHeight / 2) {
      idOfSubsequentAnswerArea = answerArea.id
      break
    } else {
      idOfPreAnswerArea = answerArea.id
    }
  }
  const data = event.dataTransfer.getData('text/plain')
  let id
  if (data.startsWith('id is')) {
    id = data.split(' ')[2]
    reorderAnswerArea(Number(idOfPreAnswerArea), Number(idOfSubsequentAnswerArea), Number(id))
  }
  if (data.startsWith('new a')) {
    addAnswerArea(data.split(' ')[2], Number(idOfPreAnswerArea), Number(idOfSubsequentAnswerArea))
  }
}


function getAnswerAreaContainer(i, j) {
  return answerAreaContainers.value[i] && answerAreaContainers.value[i][j] ? answerAreaContainers.value[i][j] : []
}

function getAnswerArea(type) {
  const typeToAnswerAreaMap = {
    'otherAnswerArea': OtherAnswerArea,
    'multipleChoiceAnswerArea': MultipleChoiceAnswerArea,
    'essayAnswerArea': EssayAnswerArea,
    'calculatingAnswerArea': CalculatingAnswerArea,
    'fillBlanksAnswerArea': FillBlanksAnswerArea
  }
  return typeToAnswerAreaMap[type]
}

function startDrag(event) {
  console.log('startDrag')
  event.dataTransfer.setData("text/plain", 'id is ' + event.currentTarget.id)
}

function endDrag(event) {
  console.log('endDrag')
  event.preventDefault()
}

function handleAnswerAreaClick(event) {
  console.log('handleAnswerAreaClick')
  setClickEvent(event.currentTarget.className, event.currentTarget.id)
}

function handleSheetClick(event) {
  setClickEvent('sheet', event.currentTarget.id)
}

const resetZoomContainer = inject('resetZoomContainer')
const sheetContainer = ref(null)

onMounted(() => {
  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      resetZoomContainer()
    }
  })
  resizeObserver.observe(sheetContainer.value)
})
watch(downloadPDFState, () => {
  if (downloadPDFState.value === true) {
    getCoordinate()
  }
  downloadPDFState.value = false;
})

function findParentByClassName(element, className) {
  while (element && element !== document.body) {
    element = element.parentElement;
    if (element.classList.contains(className)) {
      return element;
    }
  }
  return null;
}

function getCoordinate() {
  const childrenWithClass = sheetContainer.value.querySelectorAll('.clientAnswer')
  childrenWithClass.forEach(
      el => {
        const questionNumber = el.getAttribute('question-number')
        const answerRect = el.getBoundingClientRect()
        const answerAreaContainer = findParentByClassName(el, 'answerAreaContainer')
        const answerAreaContainerRect = answerAreaContainer.getBoundingClientRect()
        const relativeLeftTopX = (answerRect.left - answerAreaContainerRect.left) / answerAreaContainerRect.width
        const relativeLeftTopY = (answerRect.top - answerAreaContainerRect.top) / answerAreaContainerRect.height
        const relativeRightBottomX = (answerRect.right - answerAreaContainerRect.left) / answerAreaContainerRect.width
        const relativeRightBottomY = (answerRect.bottom - answerAreaContainerRect.top) / answerAreaContainerRect.height
        const answer = getAnswer(questionNumber)
        answer.relativeLeftTopX = relativeLeftTopX
        answer.relativeLeftTopY = relativeLeftTopY
        answer.relativeRightBottomX = relativeRightBottomX
        answer.relativeRightBottomY = relativeRightBottomY
      }
  )
}
</script>

<template>
  <div id="sheetContainer" ref="sheetContainer">
    <div v-for="(sheet, i) in sheets" :key="i" class="sheet" :id="`sheet-${i}`"
         :style="{ width: widthOfSheetPx + 'px', height: heightOfSheetPx + 'px', padding: sheetsPaddingPx + 'px'
         , gap:gapBetweenAnswerAreaContainerPx+'px'}"
         @click="handleSheetClick">
      <div v-for="j in sheet.numOfAnswerAreaContainers" :key="j-1" class="answerAreaContainer"
           :style="{gap: gapBetweenAnswerAreaPx+'px',padding:answerAreaContainerPaddingPx+'px'}"
           @dragover.prevent
           @drop="handleDrop"
      >
        <div
            v-for="(answerArea) in getAnswerAreaContainer(i,j-1)"
            :key="answerArea.id"
            :id="answerArea.id != null ? answerArea.id : `infoArea-${i}`"
            :class="answerArea.type"
            :draggable="answerArea.type === 'infoArea' ? 'false' : 'true'"
            @dragstart="startDrag"
            @dragend="endDrag"
            @click.stop="handleAnswerAreaClick">
          <info-area v-if="answerArea.type==='infoArea'" :title="title" :index-of-sheets="i"
                     :project-id="projectConfig.projectId"
                     :size-of-info-area-px="sizeOfInfoAreaPx" :id="`infoArea-${i}`"></info-area>
          <component :is="getAnswerArea(answerArea.type)"
                     :height="answerArea.height"
                     :area-id="answerArea.id"
                     :indexOfSheets="i"
                     :indexOfAnswerAreaContainers="j-1"
                     :sheetContainer="sheetContainer"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>
<style>

#sheetContainer {
  display: flex;
  flex-direction: column;
  gap: 20px
}

.sheet {
  background: white;
  flex: 0 0 auto;
  display: flex;
}

.answerAreaContainer {

  border: 2.4px solid black;
  display: flex;
  flex-direction: column;
  flex: 1;
}

</style>