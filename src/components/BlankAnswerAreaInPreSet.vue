<script setup>
const props = defineProps({
  width: Number,
  height: Number
})

function startDrag(event) {
  event.dataTransfer.setData("text/plain", "blankAnswerArea")
  console.log(event)
}

function endDrag(event) {
  event.preventDefault()
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
  border: 2px solid #000000;
}
</style>