<script setup>
import {onMounted} from "vue";

const props = defineProps({
  width: Number,
  height: Number,
  areaId: Number
})


onMounted(() => {
  const canvas = document.getElementById(props.areaId).getElementsByTagName('canvas')[0]
  const ctx = canvas.getContext('2d')
  ctx.font = '24px Arial'; // 设置字体大小和类型
  ctx.fillStyle = 'red';   // 设置字体颜色
  ctx.textAlign = 'center';// 设置文字对齐方式，可选 'left', 'right', 'center', 'start', 'end'
// 写字
  ctx.fillText(props.areaId, canvas.width / 2, canvas.height / 2)
})


</script>

<template>

  <canvas id="canvas" :width="width" :height="height" :style="{width: width+'px',height:height+'px'}"></canvas>

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