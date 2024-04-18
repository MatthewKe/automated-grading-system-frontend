<script setup>
import {ref, computed, createApp} from 'vue'
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
const paddingPx = padding * pixelPerMm

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
    <div class="sheet" :style="{width:widthPx+'px',height:heightPx+'px',padding:paddingPx+'px'}">
      <div class="AnswerAreaContainer"
           @dragover.prevent
           @drop="handleDrop"
           style="position: relative">
        <div id="info-area">
          <div id="barcode"></div>
          <div id="title"><h1 style="text-align: center">答题卡(点我修改)珠海一中第一次联考理科</h1></div>
        </div>
        <BlankAnswerArea></BlankAnswerArea>
      </div>
      <div class="AnswerAreaContainer"
           @dragover.prevent
           @drop="handleDrop"
           style="position: relative">
      </div>
      <div class="AnswerAreaContainer"
           @dragover.prevent
           @drop="handleDrop"
           style="position: relative">
      </div>
    </div>
    <div class="sheet" :style="{width:widthPx+'px',height:heightPx+'px',padding:paddingPx+'px'}">
      <div class="AnswerAreaContainer"
           @dragover.prevent
           @drop="handleDrop"
           style="position: relative">
        <div id="info-area">
          <div id="barcode"></div>
          <div id="title"><h1 style="text-align: center">答题卡(点我修改)珠海一中第一次联考理科</h1></div>
        </div>
        <BlankAnswerArea></BlankAnswerArea>
      </div>
      <div class="AnswerAreaContainer"
           @dragover.prevent
           @drop="handleDrop"
           style="position: relative">
      </div>
      <div class="AnswerAreaContainer"
           @dragover.prevent
           @drop="handleDrop"
           style="position: relative">
      </div>
    </div>
  </div>
</template>

<style scoped>
#sheetContainer {
  display: flex;
  flex-direction: column;
  gap: 40px
}

#title {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sheet {
  background: white;
  display: flex;
  gap: 20px;
}

#info-area {
  display: flex;
}

#info-area > * {
  flex: 1;
}

#barcode {
  background: black;
  max-width: 200px;
  max-height: 200px;
  min-width: 200px;
  min-height: 200px;
}

.AnswerAreaContainer {
  border: 3px solid black;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
}


</style>