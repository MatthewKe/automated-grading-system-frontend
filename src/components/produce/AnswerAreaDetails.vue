<script setup>
import {computed, ref, watch, watchEffect} from "vue";
import clickEvent from "@/components/clickState.js";
import projectConfig, {getAnswerArea} from "@/components/projectConfig.js";
import MultipleChoiceAnswerAreaDetails from "@/components/produce/MultipleChoiceAnswerAreaDetails.vue";

const props = defineProps({
  componentDetailsWidth: Number
})

const answerArea = computed(() => getAnswerArea(clickEvent.value.targetId))


const options = [
  {
    value: 'multipleChoiceAnswerArea',
    label: '选择题'
  },
  {
    value: 'calculatingAnswerArea',
    label: '计算题',
  },
  {
    value: 'essayAnswerArea',
    label: '作文题',
  },
  {
    value: 'fillBlanksAnswerArea',
    label: '填空题',
  },
  {
    value: 'otherAnswerArea',
    label: '其它',
  },
]

const typeToComponentMap = {
  'multipleChoiceAnswerArea': MultipleChoiceAnswerAreaDetails
}

</script>

<template>
  <div id="component-details-container" :style="{width:componentDetailsWidth+'px'}">
    <el-scrollbar>
      <h1>题目详情</h1>
      <el-divider/>
      <h2>题目类型</h2>
      <el-select
          v-model="answerArea.type"
          placeholder="Select"
          size="large"
          style="width: 150px"
      >
        <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.value"
            :label="item.label"
        />
      </el-select>
      <el-divider/>
      <Component :is="typeToComponentMap[answerArea.type]"></Component>
    </el-scrollbar>
  </div>
</template>

<style scoped>
#component-details-container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background: #f6f7f8;
  padding: 20px;
}

</style>