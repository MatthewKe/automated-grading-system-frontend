<script setup>
import {computed} from "vue";

const props = defineProps({
  sizeOfInfoAreaPx: Number,
  title: String
})

const sizeOfBarcodePx = 127

const barcodeStyle = computed(() => ({
  maxHeight: `${sizeOfBarcodePx}px`,
  minHeight: `${sizeOfBarcodePx}px`,
  minWidth: `${sizeOfBarcodePx}px`,
  maxWidth: `${sizeOfBarcodePx}px`,
  flexBasis: `${sizeOfBarcodePx}px`
}))

const infoAreaStyle = computed(() => ({
  maxHeight: `${props.sizeOfInfoAreaPx}px`,
  minHeight: `${props.sizeOfInfoAreaPx}px`,
}))

</script>

<template>
  <div class="info-area" :style="infoAreaStyle">
    <div style="display: flex;">
      <div class="barcode" :style="barcodeStyle"></div>
      <div class="title">
        <h1 style="text-align: center">{{ title }}</h1>
      </div>
    </div>
    <div style="display: flex;justify-content: space-around">
      <h2>姓名:___________</h2>
      <h2>学号:___________</h2>
    </div>
  </div>
</template>

<style scoped>
.info-area {
  display: flex;
  flex-direction: column;
}

#info-area > * {
  flex: 1;
}

.barcode {
  background: black;
  flex: 0 0 auto;
}

.title {
  display: flex;
  flex: 1 1 auto;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}
</style>