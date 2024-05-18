<script setup>
import {computed, watch} from "vue";

import {answerAreaUndefined, getAnswerArea4AnswerAreaDetails} from "@/components/detailsOfProduce.js";
import {Delete} from '@element-plus/icons-vue'
import {deleteAnswerArea} from "@/components/projectConfig.js";
import MultipleChoiceAnswerAreaDetails
  from "@/components/produce/answerAreaDetails/MultipleChoiceAnswerAreaDetails.vue";
import FillBlanksAnswerAreaDetails from "@/components/produce/answerAreaDetails/FillBlanksAnswerAreaDetails.vue";
import CalculatingAnswerAreaDetails from "@/components/produce/answerAreaDetails/CalculatingAnswerAreaDetails.vue";
import EssayAnswerAreaDetails from "@/components/produce/answerAreaDetails/EssayAnswerAreaDetails.vue";

const props = defineProps({
  componentDetailsWidth: Number
})

const answerArea = computed(() => getAnswerArea4AnswerAreaDetails())

watch(answerArea, () => {
  if (answerArea.value === undefined) {
    answerAreaUndefined()
  }
})

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
  'multipleChoiceAnswerArea': MultipleChoiceAnswerAreaDetails,
  'fillBlanksAnswerArea': FillBlanksAnswerAreaDetails,
  'calculatingAnswerArea': CalculatingAnswerAreaDetails,
  'essayAnswerArea': EssayAnswerAreaDetails
}

</script>

<template>
  <div id="component-details-container" :style="{width:componentDetailsWidth+'px'}">
    <div v-if="answerArea">
      <div style="display: flex;justify-content: space-between;align-items: center;width: 90%">
        <h1>题目详情</h1>
        <el-button type="danger" :icon="Delete" circle @click="deleteAnswerArea(answerArea.id)"/>
      </div>
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
      <h2>题目标题</h2>
      <el-input v-model="answerArea.title" style="width: 80%"></el-input>
      <el-divider/>
      <Component :is="typeToComponentMap[answerArea.type]"></Component>
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