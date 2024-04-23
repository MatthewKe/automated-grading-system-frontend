<script setup>
import {onMounted} from "vue";

const props = defineProps({
  width: Number,
  height: Number
})

function startDrag(event) {
  event.dataTransfer.setData("text/plain", "new a calculatingAnswerArea")
}

function endDrag(event) {
  event.preventDefault()
}

onMounted(() => {
  const canvas = document
      .getElementById('calculatingAnswerAreaInPreSet')
      .getElementsByTagName('canvas')[0]
  const ctx = canvas.getContext('2d')
  ctx.font = '20px Arial'; // 设置字体大小和类型
  ctx.fillStyle = 'black';   // 设置字体颜色
  ctx.textAlign = 'center';// 设置文字对齐方式
  ctx.textBaseline = 'middle'; // 设置文字垂直对齐方式为中点
  ctx.fillText('计算题', canvas.width / 2, canvas.height / 2)
})

</script>

<template>
  <div
      id="calculatingAnswerAreaInPreSet"
      draggable="true"
      @dragstart="startDrag"
      @dragend="endDrag"
  >
    <canvas :width="width" :height="height" :style="{width: width+'px',height:height+'px'}"></canvas>
  </div>
</template>

<style scoped>
canvas {
  box-sizing: border-box;
  border: 2px solid #000000;
}
</style>