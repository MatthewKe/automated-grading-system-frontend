<script setup>
import {computed} from "vue";
import projectConfig from "@/components/projectConfig.js";

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


const sheetTable = computed(() => {
  let sheets = projectConfig.value.sheets
  let sheetTable = []
  for (let i = 0; i < sheets.length; i++) {
    sheetTable.push({
      pageNumber: i + 1,
      numOfAnswerAreaContainers: Number(sheets[i].numOfAnswerAreaContainers)
    })
  }
  return sheetTable
})

function deleteSheet(index) {
  let sheets = projectConfig.value.sheets
  if (sheets.length === 1) {
    return false
  }
  projectConfig.value.sheets.splice(index, 1)
}

function addSheet() {
  projectConfig.value.sheets.push({
    "numOfAnswerAreaContainers": 3
  })
}

</script>

<template>
  <div id="component-details-container" :style="{width:componentDetailsWidth+'px'}">
    <h1>答题卡详情</h1>
    <el-divider/>
    <h2>标题</h2>
    <el-input v-model="projectConfig.title" maxlength="20"></el-input>
    <el-divider/>
    <h2>答题卡大小</h2>
    <el-select
        v-model="projectConfig.sizeOfSheet"
        placeholder="Select"
        size="default"
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
    <el-table ref="tableRef" :data="sheetTable" style="width: 80%" max-height="230">
      <el-table-column fixed prop="pageNumber" label="页数" width="60"/>
      <el-table-column prop="correctAnswer" label="列数" width="130">
        <template #default="scope">
          <el-input-number v-model="projectConfig.sheets[scope.$index].numOfAnswerAreaContainers"
                           size="small" :min="1" :max="3" style="width:90px"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="" width="40">
        <template #default="scope">
          <el-button
              link
              type="primary"
              size="small"
              @click.prevent="deleteSheet(scope.$index)"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button style="width: 80%" @click="addSheet">
      添加页数
    </el-button>
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