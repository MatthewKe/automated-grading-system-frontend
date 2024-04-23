<script setup>

import {computed} from 'vue'
import CalculatingAnswerAreaInPreSet from "@/components/answerArea/CalculatingAnswerAreaInPreSet.vue";
import OtherAnswerAreaInPreSet from "@/components/answerArea/OtherAnswerAreaInPreSet.vue";
import EssayAnswerAreaInPreSet from "@/components/answerArea/EssayAnswerAreaInPreSet.vue";
import FillBlanksAnswerAreaInPreSet from "@/components/answerArea/FillBlanksAnswerAreaInPreSet.vue";
import MultipleChoiceAnswerAreaInPreSet from "@/components/answerArea/MultipleChoiceAnswerAreaInPreSet.vue";

const props = defineProps({
  preSetWidth: Number
})

const componentHeight = computed(() => componentWidth.value / 2)
const componentWidth = computed(() => props.preSetWidth)

const answerAreaInPreSetArr = [
  MultipleChoiceAnswerAreaInPreSet,
  FillBlanksAnswerAreaInPreSet,
  CalculatingAnswerAreaInPreSet, EssayAnswerAreaInPreSet, OtherAnswerAreaInPreSet
]
</script>


<template>

  <div id="pre-set-container" :style="{width:preSetWidth+'px'}">
    <h1 style="margin: 0px">题型模板</h1>
    <component v-for="(answerAreaInPreSet) in answerAreaInPreSetArr" :is="answerAreaInPreSet"
               :height="componentHeight"
               :width="componentWidth"></component>


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