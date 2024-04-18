<script setup>
import {computed, createApp, onMounted, ref} from 'vue'
import BlankAnswerArea from "@/components/BlankAnswerArea.vue";

const projectConfigJson = "{\n" +
    "  \"title\": \"答题卡(点我修改)珠海一中第一次联考理科\",\n" +
    "  \"numOfSheets\": 2,\n" +
    "  \"sizeOfSheet\": \"A3\",\n" +
    "  \"sheetsPadding\": 14,\n" +
    "  \"heightOfInfoArea\": 25,\n" +
    "  \"sheets\": [\n" +
    "    {\n" +
    "      \"numOfAnswerAreaContainers\": 3\n" +
    "    },\n" +
    "    {\n" +
    "      \"numOfAnswerAreaContainers\": 2\n" +
    "    }\n" +
    "  ],\n" +
    "  \"gapBetweenAnswerAreaContainer\": 3,\n" +
    "  \"answerAreaContainerPadding\": 3,\n" +
    "  \"gapBetweenAnswerArea\": 3,\n" +
    "  \"numOfAnswerAreas\": 10,\n" +
    "  \"answerAreas\": [\n" +
    "    {\n" +
    "      \"type\": \"blankAnswerArea\",\n" +
    "      \"height\": 30\n" +
    "    },\n" +
    "    {\n" +
    "      \"type\": \"blankAnswerArea\",\n" +
    "      \"height\": 30\n" +
    "    },\n" +
    "    {\n" +
    "      \"type\": \"blankAnswerArea\",\n" +
    "      \"height\": 30\n" +
    "    },\n" +
    "    {\n" +
    "      \"type\": \"blankAnswerArea\",\n" +
    "      \"height\": 30\n" +
    "    },\n" +
    "    {\n" +
    "      \"type\": \"blankAnswerArea\",\n" +
    "      \"height\": 30\n" +
    "    },\n" +
    "    {\n" +
    "      \"type\": \"blankAnswerArea\",\n" +
    "      \"height\": 30\n" +
    "    },\n" +
    "    {\n" +
    "      \"type\": \"blankAnswerArea\",\n" +
    "      \"height\": 30\n" +
    "    },\n" +
    "    {\n" +
    "      \"type\": \"blankAnswerArea\",\n" +
    "      \"height\": 30\n" +
    "    },\n" +
    "    {\n" +
    "      \"type\": \"blankAnswerArea\",\n" +
    "      \"height\": 30\n" +
    "    },\n" +
    "    {\n" +
    "      \"type\": \"blankAnswerArea\",\n" +
    "      \"height\": 30\n" +
    "    }\n" +
    "  ]\n" +
    "}"

const projectConfig = ref(JSON.parse(projectConfigJson))

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
    return sizes.A3.width * pixelPerMm - sheetsPaddingPx.value
  }
  if (projectConfig.value.sizeOfSheet === 'A4') {
    return sizes.A4.width * pixelPerMm - sheetsPaddingPx.value
  }
  return sizes.A3.width * pixelPerMm - sheetsPaddingPx.value
})

const heightOfSheetPx = computed(() => {
      if (projectConfig.value.sizeOfSheet === 'A3') {
        return sizes.A3.height * pixelPerMm - sheetsPaddingPx.value
      }
      if (projectConfig.value.sizeOfSheet === 'A4') {
        return sizes.A4.height * pixelPerMm - sheetsPaddingPx.value
      }
      return sizes.A3.height * pixelPerMm - sheetsPaddingPx.value
    }
)

const answerAreaContainerPaddingPx = computed(() => projectConfig.value.answerAreaContainerPadding * pixelPerMm)

const borderOfAnswerAreaContainerPx = 2.4

const heightOfAnswerAreaContainerPx = computed(() => heightOfSheetPx.value - 2 * answerAreaContainerPaddingPx.value - 2 * borderOfAnswerAreaContainerPx)

const heightOfInfoAreaPx = computed(() => projectConfig.value.heightOfInfoArea * pixelPerMm)

const title = computed(() => projectConfig.value.title)

const sheets = computed(() => projectConfig.value.sheets)

const gapBetweenAnswerAreaContainerPx = computed(() => projectConfig.value.gapBetweenAnswerAreaContainer * pixelPerMm)

const gapBetweenAnswerAreaPx = computed(() => projectConfig.value.gapBetweenAnswerArea * pixelPerMm)

const infoAreaStyle = computed(() => ({
      maxHeight: `${heightOfInfoAreaPx.value}px`,
      minHeight: `${heightOfInfoAreaPx.value}px`
    })
)

const barcodeStyle = computed(() => ({
  minWidth: `${heightOfInfoAreaPx.value}px`,
  maxWidth: `${heightOfInfoAreaPx.value}px`,
  flexBasis: `${heightOfInfoAreaPx.value}px`
}))

const renderInfo = computed(() => {
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
  let heightLeftPx = heightOfAnswerAreaContainerPx.value - heightOfInfoAreaPx.value

  for (let answerArea of answerAreas) {
    let answerAreaHeightPx = answerArea.height * pixelPerMm
    if (heightLeftPx < answerAreaHeightPx + gapBetweenAnswerAreaPx.value) {
      j++
      heightLeftPx = heightOfAnswerAreaContainerPx.value
    }
    if (j >= sheets.value[i].numOfAnswerAreaContainers) {
      i++
      j = 0
      heightLeftPx = heightLeftPx - heightOfInfoAreaPx.value
    }
    if (i >= projectConfig.value.numOfSheets) {
      //需要新增一个sheet
    }

    let answerAreaWidthPx = (widthOfSheetPx.value - (projectConfig.value.sheets[i].numOfAnswerAreaContainers - 1) * gapBetweenAnswerAreaContainerPx.value) / projectConfig.value.sheets[i].numOfAnswerAreaContainers - 2 * answerAreaContainerPaddingPx.value
    answerAreaContainers[i][j].push(
        {
          type: answerArea.type,
          height: answerAreaHeightPx,
          width: answerAreaWidthPx
        })
    heightLeftPx = heightLeftPx - answerAreaHeightPx - gapBetweenAnswerAreaPx.value
  }
  console.log(answerAreaContainers)
  return {
    answerAreaContainers: answerAreaContainers,
  }
})

onMounted(() => {

})


function handleDrop(event) {
  console.log(event)
  let type = event.dataTransfer.getData('text/plain')
  if (type === 'blankAnswerArea') {
    const newReplyArea = document.createElement('div')
    event.target.append(newReplyArea)
    createApp(BlankAnswerArea).mount(newReplyArea)
  }
}

</script>

<template>
  <div id="sheetContainer">
    <div v-for="(sheet, i) in sheets" :key="i" class="sheet"
         :style="{ width: widthOfSheetPx + 'px', height: heightOfSheetPx + 'px', padding: sheetsPaddingPx + 'px'
         , gap:gapBetweenAnswerAreaContainerPx+'px'}">
      <div v-for="j in sheet.numOfAnswerAreaContainers" :key="j" class="answerAreaContainer"
           :style="{gap: gapBetweenAnswerAreaPx+'px',padding:answerAreaContainerPaddingPx+'px'}">
        <div v-for="(answerArea,k) in renderInfo.answerAreaContainers[i][j-1]" :key="k">
          <div v-if="answerArea.type==='infoArea'" class="info-area" :style="infoAreaStyle">
            <div class="barcode" :style="barcodeStyle"></div>
            <div class="title">
              <h1 style="text-align: center">{{ title }}</h1>
            </div>
          </div>
          <BlankAnswerArea v-if="answerArea.type==='blankAnswerArea'" :height="answerArea.height"
                           :width="answerArea.width"></BlankAnswerArea>
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

.title {
  display: flex;
  align-items: center;
  justify-content: center;
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
  position: relative;
}

.info-area {
  display: flex;
}

#info-area > * {
  flex: 1;
}

.barcode {
  background: black;
  flex-grow: 1;
  flex-shrink: 0;
}


</style>