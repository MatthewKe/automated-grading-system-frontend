<script setup>
import {computed} from "vue";

const props = defineProps({
  sizeOfInfoAreaPx: Number,
  title: String
})

const infoAreaStyle = computed(() =>
    ({
      maxHeight: `${props.sizeOfInfoAreaPx}px`,
      minHeight: `${props.sizeOfInfoAreaPx}px`
    })
)

const barcodeStyle = computed(() => ({
  maxHeight: `${props.sizeOfInfoAreaPx}px`,
  minHeight: `${props.sizeOfInfoAreaPx}px`,
  minWidth: `${props.sizeOfInfoAreaPx}px`,
  maxWidth: `${props.sizeOfInfoAreaPx}px`,
  flexBasis: `${props.sizeOfInfoAreaPx}px`
}))

</script>

<template>
  <div class="info-area" :style="infoAreaStyle">
    <div class="barcode" :style="barcodeStyle"></div>
    <div class="title">
      <h1 style="text-align: center">{{ title }}</h1>
    </div>
  </div>
</template>

<style scoped>
.info-area {
  display: flex;
}

#info-area > * {
  flex: 1;
}

.barcode {
  background: black;
  flex-grow: 1;
  flex-shrink: 0;
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>