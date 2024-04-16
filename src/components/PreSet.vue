<script setup>

import {computed} from 'vue'
import BlankReplyAreaInPreSet from "@/components/BlankAnswerAreaInPreSet.vue";

const props = defineProps({
  preSetWidth: Number
})

const componentHeight = computed(() => props.preSetWidth / 2)

</script>

<template>
  <el-scrollbar>
    <div id="pre-set-container" :style="{width:preSetWidth+'px'}">
      <h1 style="margin: 0px">题型模板</h1>
      <BlankReplyAreaInPreSet :height="componentHeight" :width="preSetWidth"></BlankReplyAreaInPreSet>
      <BlankReplyAreaInPreSet :height="componentHeight" :width="preSetWidth"></BlankReplyAreaInPreSet>
      <BlankReplyAreaInPreSet :height="componentHeight" :width="preSetWidth"></BlankReplyAreaInPreSet>
      <BlankReplyAreaInPreSet :height="componentHeight" :width="preSetWidth"></BlankReplyAreaInPreSet>
      <BlankReplyAreaInPreSet :height="componentHeight" :width="preSetWidth"></BlankReplyAreaInPreSet>
    </div>
  </el-scrollbar>
</template>

<style scoped>
#pre-set-container {
  padding: 20px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  flex-wrap: nowrap;
  background: #f6f7f8;
}


</style>