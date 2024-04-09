<script setup>

import PreSet from "@/components/PreSet.vue";
import TComponentDetails from "@/components/TComponentDetails.vue";
import BlueprintArea from "@/components/BlueprintArea.vue";
import {V3DragZoomContainer} from "v3-drag-zoom";

let containerHeight = window.innerHeight - document.getElementById('navigation-bar').getBoundingClientRect().height - 1


</script>

<template>
  <div id="container" style="display: flex" :style="{height: containerHeight+'px'}">
    <pre-set style="flex: 0 0 200px;background: red;"></pre-set>
    <div class="resizer" @mousedown="startResize(0)"></div>
    <v3-drag-zoom-container align="contain" style="background: lightgrey; flex: 1 1 0">
      <t-component-details style="flex-grow: 1; flex-basis: 0;"></t-component-details>
    </v3-drag-zoom-container>
    <div class="resizer" @mousedown="startResize(1)"></div>
    <blueprint-area style="flex: 0 0 200px;background: red;"></blueprint-area>
  </div>
</template>

<style scoped>
.resizer {
  cursor: col-resize;
  width: 3px;
  height: 100%;
}
</style>