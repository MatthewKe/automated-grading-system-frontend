<script setup>
import {ElButton} from "element-plus";

const props = defineProps({
  gradeInfo: Object
})
</script>

<template>

  <div class="grade-info">
    <div class="timestamp">{{ props.gradeInfo.timestamp }}</div>
    <div class="upload-count">
      <div class="upload-count-title">上传图片数</div>
      <h3 class="upload-count-number">{{ props.gradeInfo.numOfUploadImages }}</h3>
    </div>
    <div class="success-count">
      <div class="success-count-title">成功处理数</div>
      <h3 class="success-count-number">{{ props.gradeInfo.numOfSucceedProcessImages }}</h3>
    </div>
    <div class="title">
      <div class="title-title">答题卡标题</div>
      <h3 class="title-content">{{ props.gradeInfo.title }}</h3>
    </div>


  </div>

</template>


<style scoped>

.title {
  display: flex;
  align-items: baseline
}

.title-title {
  font-size: 30px;
  font-weight: bold;
  color: #277da1
}

.grade-info {
  display: flex;
  align-items: center;
  justify-content: space-around
}

.upload-count {
  display: flex;
  align-items: baseline
}

.upload-count-title {
  font-size: 30px;
  font-weight: bold;
  color: #f9c74f
}


.success-count-title {
  font-size: 30px;
  font-weight: bold;
  color: #90be6d;
}

.success-count {
  display: flex;
  align-items: baseline
}
</style>