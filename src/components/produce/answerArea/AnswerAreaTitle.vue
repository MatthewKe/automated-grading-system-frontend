<script setup>
import {computed} from "vue";

const props = defineProps({
  answerAreaIndex: Number,
  titleCtx: String
})

function integerToChinese(num) {
  const numbers = '零一二三四五六七八九';
  const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿'];
  let str = '', digit, pos = 0, zero = false;

  if (num < 0) return '负' + integerToChinese(-num);
  if (num === 0) return '零';

  while (num > 0) {
    digit = num % 10;
    if (digit === 0) {
      if (!zero) {
        zero = true;
        str = numbers[digit] + str;
      }
    } else {
      zero = false;
      str = numbers[digit] + units[pos] + str;
    }
    pos++;
    num = Math.floor(num / 10);
  }
  return str.replace(/^一十/, '十').replace(/零+$/, '').replace(/零+/g, '零');
}

const chineseAnswerAreaNumber = computed(() => integerToChinese(props.answerAreaIndex + 1))
</script>


<template>
  <h2>{{ chineseAnswerAreaNumber + ',' + titleCtx }}</h2>
</template>

<style scoped>
h2 {
  padding: 0;
  margin: 0;
}
</style>