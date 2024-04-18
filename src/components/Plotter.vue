<script setup>
import {computed, createApp, onMounted, ref} from 'vue'
import BlankAnswerArea from "@/components/BlankAnswerArea.vue";

const sizes = {
  A3: {width: 420, height: 297},
  A4: {width: 297, height: 210}
}

const padding = 20
const dpi = 96
const mmToInch = 25.4
const pixelPerMm = dpi / mmToInch

const widthPx = computed(() => sizes.A3.width * pixelPerMm)
const heightPx = computed(() => sizes.A3.height * pixelPerMm)
console.log("heightPx" + heightPx.value)
const paddingPx = padding * pixelPerMm
const heightOfAnswerAreaContainerPx = heightPx.value
const heightOfInfoAreaPx = 200


const projectConfigJson = "{\n" +
    "  \"title\": \"答题卡(点我修改)珠海一中第一次联考理科\",\n" +
    "  \"numOfSheets\": 2,\n" +
    "  \"sizeOfSheet\": \"A3\",\n" +
    "  \"sheetsPadding\": 3,\n" +
    "  \"sheets\": [\n" +
    "    {\n" +
    "      \"numOfAnswerAreaContainers\": 3\n" +
    "    },\n" +
    "    {\n" +
    "      \"numOfAnswerAreaContainers\": 2\n" +
    "    }\n" +
    "  ],\n" +
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

const renderInfo = computed(() => {
  //生成answerAreaContainers，并且预装info-area
  let answerAreaContainers = []
  let sheets = projectConfig.value.sheets
  for (let i = 0; i < projectConfig.value.numOfSheets; i++) {
    let numOfAnswerAreaContainers = sheets[i].numOfAnswerAreaContainers
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
  for (let k = 0; k < 20; k++) {
    answerAreas.push({type: 'blankAnswerArea', height: 20})
  }
  let gapOfAnswerAreaPx = projectConfig.value.gapOfAnswerArea * pixelPerMm
  console.log("gapOfAnswerAreaPx" + gapOfAnswerAreaPx)
  //计算填充answerAreaContainers
  let i = 0
  let j = 0
  let heightLeftPx = heightOfAnswerAreaContainerPx - heightOfInfoAreaPx
  for (let answerArea of answerAreas) {
    let answerAreaHeightPx = answerArea.height * pixelPerMm
    if (heightLeftPx < answerAreaHeightPx + gapOfAnswerAreaPx) {
      j++
      heightLeftPx = heightOfAnswerAreaContainerPx
    }
    if (j >= sheets[i].numOfAnswerAreaContainers) {
      i++
      j = 0
      heightLeftPx = heightLeftPx - heightOfInfoAreaPx
    }
    if (i >= projectConfig.value.numOfSheets) {
      //需要新增一个sheet
    }
    answerAreaContainers[i][j].push(
        {
          type: answerArea.type,
          height: answerAreaHeightPx
        })
    heightLeftPx = heightLeftPx - answerAreaHeightPx - gapOfAnswerAreaPx
  }
  return {
    title: projectConfig.value.title,
    sheets: projectConfig.value.sheets,
    answerAreaContainers: answerAreaContainers,
    gapOfAnswerAreaPx: gapOfAnswerAreaPx
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
    <div v-for="(sheet, i) in renderInfo.sheets" :key="i" class="sheet"
         :style="{ width: widthPx + 'px', height: heightPx + 'px', padding: paddingPx + 'px' }">
      <div v-for="j in sheet.numOfAnswerAreaContainers" :key="j" class="AnswerAreaContainer"
           :style="{gap: renderInfo.gapOfAnswerAreaPx+'px'}">
        <div v-for="(answerArea,k) in renderInfo.answerAreaContainers[i][j-1]" :key="k">
          <div v-if="answerArea.type==='infoArea'" class="info-area">
            <div class="barcode"></div>
            <div class="title">
              <h1 style="text-align: center">{{ renderInfo.title }}</h1>
            </div>
          </div>
          <BlankAnswerArea v-if="answerArea.type==='blankAnswerArea'" :height="answerArea.height"></BlankAnswerArea>
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
  gap: 20px;
}

.AnswerAreaContainer {
  padding: 20px;
  border: 3px solid black;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
}

.info-area {
  display: flex;
  max-height: 200px;
  min-height: 200px;
}

#info-area > * {
  flex: 1;
}

.barcode {
  background: black;
  min-width: 200px;
  flex-basis: 200px; /* 设置默认的基础宽度 */
  flex-grow: 1; /* 允许div根据需要扩展 */
  flex-shrink: 0; /* 阻止div收缩 */
}


</style>