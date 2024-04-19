<script setup>

import PreSet from "@/components/PreSet.vue";
import componentDetails from "@/components/ComponentDetails.vue";
import plotter from "@/components/Plotter.vue";
import {V3DragZoomContainer} from "@/components/v3-drag-zoom/dist/v3-drag-zoom.js";


let containerHeight = window.innerHeight - document.getElementById('navigation-bar').getBoundingClientRect().height - 1
const preSetWidth = 170
const componentDetailsWidth = 233
</script>

<template>
  <div id="container" :style="{height: containerHeight+'px'}">
    <pre-set :pre-set-width="preSetWidth"></pre-set>
    <div class="resizer" @mousedown="startResize(0)"></div>
    <v3-drag-zoom-container style="background: #EAECEE; flex: 1 1 0">
      <plotter style="flex:0 0 auto;"></plotter>
    </v3-drag-zoom-container>
  </div>
</template>

<style scoped>
#container {
  display: flex;
}

.resizer {
  cursor: col-resize;
  width: 3px;
  height: 100%;
}
</style>