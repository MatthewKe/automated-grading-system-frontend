<script setup>
import {computed, onMounted, ref} from "vue";
import QRCodeSVG from 'qrcode-svg';

const props = defineProps({
  sizeOfInfoAreaPx: Number,
  title: String,
  indexOfSheets: Number,
  projectId: Number
})

const sizeOfBarcodePx = 127

const infoAreaStyle = computed(() => ({
  maxHeight: `${props.sizeOfInfoAreaPx}px`,
  minHeight: `${props.sizeOfInfoAreaPx}px`,
}))

const qrSVG = ref('');

onMounted(() => {
  const qr = new QRCodeSVG({
    content: props.projectId + '-' + props.indexOfSheets,
    padding: 2,
    width: sizeOfBarcodePx,
    height: sizeOfBarcodePx,
    color: "#000000",
    background: "#ffffff"
  });
  qrSVG.value = qr.svg();
});
</script>

<template>
  <div class="info-area" :style="infoAreaStyle">
    <div style="display: flex;">
      <div v-html="qrSVG"></div>
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