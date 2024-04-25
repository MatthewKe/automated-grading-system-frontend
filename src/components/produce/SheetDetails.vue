<script setup>
import {computed, ref, watch, watchEffect} from "vue";
import clickEvent from "@/components/clickState.js";
import projectConfig, {getAnswerAreaAccordingId} from "@/components/projectConfig.js";
import MultipleChoiceAnswerAreaDetails from "@/components/produce/MultipleChoiceAnswerAreaDetails.vue";
import detailsInfo, {getAnswerArea4AnswerAreaDetails} from "@/components/detailsOfProduce.js";

const props = defineProps({
  componentDetailsWidth: Number
})


const sizeOptions = [
  {
    value: 'A3',
    label: 'A3'
  },
  {
    value: 'A4',
    label: 'A4',
  }
]

const layoutOptions = [
  {
    value: 1,
    label: '单列'
  },
  {
    value: 2,
    label: '两列'
  },
  {
    value: 3,
    label: '三列',
  }
]
const sheetIndex = computed(() => Number(detailsInfo.value.id.split('-')[1]))
const sheet = computed(() => projectConfig.value.sheets[sheetIndex.value])


</script>

<template>
  <div id="component-details-container" :style="{width:componentDetailsWidth+'px'}">
    <h1>答题卡详情</h1>
    <el-divider/>
    <h2>标题</h2>
    <el-input v-model="projectConfig.title"></el-input>
    <el-divider/>
    <h2>答题卡大小</h2>
    <el-select
        v-model="projectConfig.sizeOfSheet"
        placeholder="Select"
        size="large"
        style="width: 150px"
    >
      <el-option
          v-for="item in sizeOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
      />
    </el-select>
    <el-divider/>
    <h2>该页答题卡布局</h2>
    <el-select
        v-model="sheet.numOfAnswerAreaContainers"
        placeholder="Select"
        size="large"
        style="width: 150px"
    >
      <el-option
          v-for="item in layoutOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
      />
    </el-select>
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