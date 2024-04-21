<script setup>
import {onMounted} from "vue";
import clickEvent from '@/components/clickState.js'

const props = defineProps({
  width: Number,
  height: Number,
  areaId: Number
})

function startDrag(event) {
  event.dataTransfer.setData("text/plain", 'id is ' + props.areaId)
}

function endDrag(event) {
  event.preventDefault()
}

onMounted(() => {
  const canvas = document.getElementById(props.areaId).getElementsByTagName('canvas')[0]
  const ctx = canvas.getContext('2d')
  ctx.font = '24px Arial'; // 设置字体大小和类型
  ctx.fillStyle = 'red';   // 设置字体颜色
  ctx.textAlign = 'center';// 设置文字对齐方式，可选 'left', 'right', 'center', 'start', 'end'
// 写字
  ctx.fillText(props.areaId, canvas.width / 2, canvas.height / 2)
})

function startClick(event) {
  clickEvent.set('blankAnswerArea', props.areaId)
}
</script>

<template>
  <div
      class="draggable"
      draggable="true"
      @dragstart="startDrag"
      @dragend="endDrag"
      @click="startClick"
  >
    <canvas id="canvas" :width="width" :height="height" :style="{width: width+'px',height:height+'px'}"></canvas>
  </div>
</template>

<style scoped>
canvas {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  display: block;
  border: 2px solid #000000;
}

.draggable {
  margin: 0;
  padding: 0;
}
</style>