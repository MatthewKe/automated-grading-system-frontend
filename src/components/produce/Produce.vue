<script setup>

import PreSet from "@/components/produce/PreSet.vue";
import plotter from "@/components/produce/Plotter.vue";
import {V3DragZoomContainer} from "@/components/v3-drag-zoom/dist/v3-drag-zoom.js";
import SheetDetails from "@/components/produce/SheetDetails.vue";
import detailsInfo from "@/components/detailsOfProduce.js";
import {provide, ref} from "vue";
import AnswerAreaDetails from "@/components/produce/answerAreaDetails/AnswerAreaDetails.vue";
import http from "@/components/http.js";
import projectConfig from "@/components/projectConfig.js";
import {useRoute} from "vue-router";

let containerHeight = window.innerHeight - document.getElementById('navigation-bar').getBoundingClientRect().height - 1

const preSetWidth = 150
const componentDetailsWidth = 300

const zoomContainer = ref()

const route = useRoute()

try {
  let response = await http.get(`/produce/getProjectConfig?projectId=${route.query.project_id}`)
  console.log('goToProduce successful:', response);
  projectConfig.value = JSON.parse(response.data.projectConfig)
} catch (error) {
  console.error('getProjectConfig failed:', error);
}

const resetZoomContainer = () => {
  if (zoomContainer && zoomContainer.value) {
    zoomContainer.value.reset()
  }
}

provide('resetZoomContainer', resetZoomContainer)


</script>

<template>
  <div id="container" ref="container" :style="{height: containerHeight+'px'}">
    <pre-set :pre-set-width="preSetWidth"></pre-set>
    <v3-drag-zoom-container ref="zoomContainer" style="background: #EAECEE; flex: 1 1 0">
      <plotter style="flex:0 0 auto;"></plotter>
    </v3-drag-zoom-container>
    <el-scrollbar>
      <AnswerAreaDetails v-if="detailsInfo.type.includes('AnswerArea')"
                         :component-details-width="componentDetailsWidth"></AnswerAreaDetails>
      <SheetDetails v-if="detailsInfo.type.includes('Sheet')"
                    :component-details-width="componentDetailsWidth"></SheetDetails>
    </el-scrollbar>
  </div>
</template>

<style scoped>
#container {
  display: flex;
}

</style>