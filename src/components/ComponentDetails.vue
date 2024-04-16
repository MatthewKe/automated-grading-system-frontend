<script setup>
const props = defineProps({
  componentDetailsWidth: Number
})
</script>

<template>
  <div id="component-details-container" :style="{width:componentDetailsWidth}">
    <h1>dis is details area</h1>
  </div>

</template>

<style scoped>
#component-details-container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  background: #f6f7f8;
}
</style>