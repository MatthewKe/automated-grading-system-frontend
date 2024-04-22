<script setup>
import {computed, ref, watch, watchEffect} from "vue";
import clickEvent from "@/components/clickState.js";
import projectConfig from "@/components/projectConfig.js";

const props = defineProps({
  componentDetailsWidth: Number
})

const answerArea = computed(() =>
    projectConfig.value.answerAreas.find((answerArea) => answerArea.id === clickEvent.value.targetId)
)


const options = [
  {
    value: 'multipleChoiceAnswerArea',
    label: '选择题',
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

</script>

<template>
  <div id="component-details-container" :style="{width:componentDetailsWidth+'px'}">
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
    <h2>答题区域尺寸</h2>
    <div>
      <div>
        <h4>长度(mm)</h4>
        <el-input-number v-model="answerArea.height" :min="0" :precision="2"/>
      </div>

      <div>
        <h4>宽度(mm)</h4>
        <el-input-number v-model="answerArea.width" :min="0" :precision="2" :disabled="true"/>
      </div>

    </div>

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