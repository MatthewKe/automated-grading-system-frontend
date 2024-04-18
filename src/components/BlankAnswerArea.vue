<script setup>
import {computed} from "vue";

const props = defineProps({
  width: Number,
  height: Number
})

function startDrag(event) {
  event.dataTransfer.setData("text/plain", "blankReplyArea")
  console.log(event)
}

function endDrag(event) {
  event.preventDefault()
  // event.target 指向触发事件的元素
  const callerElement = event.target;

  // 如果存在父元素，从DOM中移除元素
  if (callerElement.parentNode.parentNode) {
    callerElement.parentNode.parentNode.removeChild(callerElement.parentNode);
  }
}

</script>

<template>
  <div
      class="draggable"
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