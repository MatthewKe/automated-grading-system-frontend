<script setup>
import {computed, inject, onMounted, ref, watch} from 'vue'
import OtherAnswerArea from "@/components/answerArea/OtherAnswerArea.vue";
import InfoArea from "@/components/InfoArea.vue";
import projectConfig, {addAnswerArea, reorderAnswerArea} from "@/components/projectConfig.js";
import CalculatingAnswerArea from "@/components/answerArea/CalculatingAnswerArea.vue";
import MultipleChoiceAnswerArea from "@/components/answerArea/MultipleChoiceAnswerArea.vue";
import EssayAnswerArea from "@/components/answerArea/EssayAnswerArea.vue";
import FillBlanksAnswerArea from "@/components/answerArea/FillBlanksAnswerArea.vue";
import {setClickEvent} from "@/components/clickState.js";

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

watch(projectConfig, () => {
  try {
    answerAreaContainers.value = updateAnswerAreaContainers()
  } catch (e) {
    //todo projectConfig的初始化
    console.log(e)
  }
}, {
  immediate: true,
  deep: true
})

function updateAnswerAreaContainers() {
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
  let i = 0
  let j = 0
  let heightLeftPx = heightOfAnswerAreaContainerPx.value - sizeOfInfoAreaPx.value

  for (let answerArea of answerAreas) {
    let answerAreaHeightPx = answerArea.height * pixelPerMm
    if (heightLeftPx < answerAreaHeightPx + gapBetweenAnswerAreaPx.value) {
      j++
      heightLeftPx = heightOfAnswerAreaContainerPx.value
    }
    if (j >= sheets.value[i].numOfAnswerAreaContainers) {
      i++
      j = 0
      heightLeftPx = heightLeftPx - sizeOfInfoAreaPx.value
    }
    if (i >= projectConfig.value.sheets.length) {
      //需要新增一个sheet
      projectConfig.value.sheets.push({
        "numOfAnswerAreaContainers": 3
      })
      return answerAreaContainers
    }

    let answerAreaWidthPx = (widthOfSheetPx.value - (projectConfig.value.sheets[i].numOfAnswerAreaContainers - 1) * gapBetweenAnswerAreaContainerPx.value) / projectConfig.value.sheets[i].numOfAnswerAreaContainers - 2 * answerAreaContainerPaddingPx.value
    answerArea.width = answerAreaWidthPx / pixelPerMm

    answerAreaContainers[i][j].push(
        {
          id: answerArea.id,
          type: answerArea.type,
          height: answerAreaHeightPx,
          width: answerAreaWidthPx
        })
    heightLeftPx = heightLeftPx - answerAreaHeightPx - gapBetweenAnswerAreaPx.value
  }
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
  return answerAreaContainers.value[i] && answerAreaContainers.value[i][j - 1] ? answerAreaContainers.value[i][j - 1] : []
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


</script>

<template>
  <div id="sheetContainer" ref="sheetContainer">
    <div v-for="(sheet, i) in sheets" :key="i" class="sheet" :id="`sheet-${i}`"
         :style="{ width: widthOfSheetPx + 'px', height: heightOfSheetPx + 'px', padding: sheetsPaddingPx + 'px'
         , gap:gapBetweenAnswerAreaContainerPx+'px'}"
         @click="handleSheetClick">
      <div v-for="j in sheet.numOfAnswerAreaContainers" :key="j" class="answerAreaContainer"
           :style="{gap: gapBetweenAnswerAreaPx+'px',padding:answerAreaContainerPaddingPx+'px'}"
           @dragover.prevent
           @drop="handleDrop"
      >
        <div
            v-for="(answerArea) in getAnswerAreaContainer(i,j)"
            :key="answerArea.id"
            :id="answerArea.id != null ? answerArea.id : `infoArea-${i}`"
            :class="answerArea.type"
            :draggable="answerArea.type === 'infoArea' ? 'false' : 'true'"
            @dragstart="startDrag"
            @dragend="endDrag"
            @click.stop="handleAnswerAreaClick">
          <info-area v-if="answerArea.type==='infoArea'" :title="title"
                     :size-of-info-area-px="sizeOfInfoAreaPx" :id="`infoArea-${i}`"></info-area>
          <component :is="getAnswerArea(answerArea.type)"
                     :height="answerArea.height"
                     :width="answerArea.width"
                     :area-id="answerArea.id"
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
  border-radius: 20px;
  border: 2.4px solid black;
  display: flex;
  flex-direction: column;
  flex: 1;
}


</style>