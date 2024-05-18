<script setup>
import {onMounted} from "vue";

const props = defineProps({
  width: Number,
  height: Number
})

function startDrag(event) {
  event.dataTransfer.setData("text/plain", "new a otherAnswerArea")
}

function endDrag(event) {
  event.preventDefault()
}


</script>

<template>
  <div
      id="otherAnswerAreaInPreSet"
      draggable="true"
      @dragstart="startDrag"
      @dragend="endDrag"
      class="container"
      :style="{width: width+'px',height:height+'px',lineHeight:height+'px'}"
  >
  <span class="material-symbols-outlined">
other_admission
</span>
    其它题型
  </div>

</template>

<style scoped>

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 2px solid #000000;
  font-weight: bold;
  text-align: center;
  font-size: 20px;
}

canvas {
  border: 2px solid #000000;
}
</style>