<script setup>
import {computed, createApp, onBeforeMount, watch, ref, watchEffect} from 'vue'
import OtherAnswerArea from "@/components/answerArea/OtherAnswerArea.vue";
import InfoArea from "@/components/InfoArea.vue";
import projectConfig from "@/components/projectConfig.js";
import CalculatingAnswerArea from "@/components/answerArea/CalculatingAnswerArea.vue";

const sizes = {
  A3: {width: 420, height: 297},
  A4: {width: 297, height: 210}
}

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

const sizeOfInfoAreaPx = computed(() => projectConfig.value.heightOfInfoArea * pixelPerMm)

const title = computed(() => projectConfig.value.title)

const sheets = computed(() => projectConfig.value.sheets)

const gapBetweenAnswerAreaContainerPx = computed(() => projectConfig.value.gapBetweenAnswerAreaContainer * pixelPerMm)

const gapBetweenAnswerAreaPx = computed(() => projectConfig.value.gapBetweenAnswerArea * pixelPerMm)


let answerAreaContainers = ref([])

watch(projectConfig, () => {
  answerAreaContainers.value = updateAnswerAreaContainers()
}, {
  deep: true
})

function updateAnswerAreaContainers() {
  //生成answerAreaContainers，并且预装info-area
  let answerAreaContainers = []
  let numOfSheets = projectConfig.value.numOfSheets
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
    if (i >= projectConfig.value.numOfSheets) {
      //需要新增一个sheet
      projectConfig.value.sheets.push({
        "numOfAnswerAreaContainers": 3
      })
      projectConfig.value.numOfSheets++
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

// watch(() => projectConfig.value.numOfSheets, (newVal, oldVal) => {
//   if (newVal !== oldVal) {
//     updateAnswerAreaContainers();
//   }
// });


function handleDrop(event) {
  event.preventDefault();
  const answerAreaContainer = event.currentTarget
  const y = event.clientY - answerAreaContainer.getBoundingClientRect().top
  const answerAreaArr = answerAreaContainer.children
  let idOfSubsequentAnswerArea = -1
  let idOfPreAnswerArea = -1
  for (const answerArea of answerAreaArr) {
    console.log(answerArea)
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
  }
  if (data.startsWith('new a')) {
    id = projectConfig.value.nextId
    projectConfig.value.nextId++
    projectConfig.value.answerAreas.push({
      "id": id,
      "type": data.split(' ')[2],
      "height": 40
    })
  }
  reorderAnswerArea(Number(idOfPreAnswerArea), Number(idOfSubsequentAnswerArea), Number(id))
}

function reorderAnswerArea(idOfPreAnswerArea, idOfSubsequentAnswerArea, idOfAnswerArea) {
  console.log('idOfSubsequentAnswerArea' + idOfSubsequentAnswerArea)
  console.log('idOfPreAnswerArea' + idOfPreAnswerArea)
  if (idOfPreAnswerArea === idOfAnswerArea || idOfAnswerArea === idOfSubsequentAnswerArea) {
    return
  }
  let answerAreaArr = projectConfig.value.answerAreas
  let indexOfAnswerArea = answerAreaArr.findIndex((e) => e.id === idOfAnswerArea)
  let answerArea = answerAreaArr[indexOfAnswerArea]
  answerAreaArr.splice(indexOfAnswerArea, 1)
  if (idOfPreAnswerArea !== -1) {
    let indexOfPreAnswerArea = answerAreaArr.findIndex(
        (e) => e.id === idOfPreAnswerArea
    )
    answerAreaArr.splice(indexOfPreAnswerArea + 1, 0, answerArea)
  } else if (idOfSubsequentAnswerArea !== -1) {
    let indexOfSubsequentAnswerArea = answerAreaArr.findIndex(
        (e) => e.id === idOfSubsequentAnswerArea
    )
    answerAreaArr.splice(indexOfSubsequentAnswerArea, 0, answerArea)
  } else {
    answerAreaArr.splice(answerAreaArr.length, 0, answerArea)
  }
  projectConfig.value.answerAreas = answerAreaArr
}

</script>

<template>
  <div id="sheetContainer">
    <div v-for="(sheet, i) in sheets" :key="i" class="sheet"
         :style="{ width: widthOfSheetPx + 'px', height: heightOfSheetPx + 'px', padding: sheetsPaddingPx + 'px'
         , gap:gapBetweenAnswerAreaContainerPx+'px'}">
      <div v-for="j in sheet.numOfAnswerAreaContainers" :key="j" class="answerAreaContainer"
           :style="{gap: gapBetweenAnswerAreaPx+'px',padding:answerAreaContainerPaddingPx+'px'}"
           @dragover.prevent
           @drop="handleDrop">
        <div v-if="answerAreaContainers[i]&&answerAreaContainers[i][j-1]"
             v-for="(answerArea,k) in answerAreaContainers[i][j-1]"
             :key="answerArea.id"
             :id="answerArea.id"
             :class="answerArea.type">
          <InfoArea v-if="answerArea.type==='infoArea'"
                    :title="title"
                    :size-of-info-area-px="sizeOfInfoAreaPx"></InfoArea>
          <OtherAnswerArea v-if="answerArea.type==='otherAnswerArea'"
                           :height="answerArea.height"
                           :width="answerArea.width" :area-id="answerArea.id"></OtherAnswerArea>
          <calculating-answer-area v-if="answerArea.type==='calculatingAnswerArea'"
                                   :height="answerArea.height"
                                   :width="answerArea.width" :area-id="answerArea.id"></calculating-answer-area>
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