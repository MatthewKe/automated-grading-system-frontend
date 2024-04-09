<script setup>
import {ref, onMounted} from 'vue'

const canvasRef = ref(null)
const sizes = {
  A3: {width: 420, height: 297},
  A4: {width: 297, height: 210}
}
const margin = 25
const dpi = 96
const mmToInch = 25.4
const pixelPerMm = dpi / mmToInch

const widthPx = sizes.A3.width * pixelPerMm
const heightPx = sizes.A3.height * pixelPerMm
const marginPx = margin * pixelPerMm

onMounted
(() => {
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    ctx.font = "100px serif";
    ctx.strokeText("Hello world", marginPx, marginPx);
  }
})

function printDiv(divId) {
  let content = document.getElementById(divId).innerHTML;
  console.log(content)
  let printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Print</title>');
  printWindow.document.write('</head><body >');
  printWindow.document.write(content);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}

</script>

<template>
  <canvas id="canvas" ref="canvasRef" :width="widthPx" :height="heightPx"></canvas>
</template>

<style scoped>

</style>