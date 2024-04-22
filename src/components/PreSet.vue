<script setup>

import {computed} from 'vue'
import BlankReplyAreaInPreSet from "@/components/answerArea/OtherAnswerAreaInPreSet.vue";
import CalculatingAnswerAreaInPreSet from "@/components/answerArea/CalculatingAnswerAreaInPreSet.vue";

const props = defineProps({
  preSetWidth: Number
})

const componentHeight = computed(() => componentWidth.value / 2)
const componentWidth = computed(() => props.preSetWidth)
</script>

<template>

  <div id="pre-set-container" :style="{width:preSetWidth+'px'}">
    <h1 style="margin: 0px">题型模板</h1>
    <BlankReplyAreaInPreSet :height="componentHeight" :width="componentWidth"></BlankReplyAreaInPreSet>
    <calculating-answer-area-in-pre-set :height="componentHeight"
                                        :width="componentWidth"></calculating-answer-area-in-pre-set>
  </div>

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