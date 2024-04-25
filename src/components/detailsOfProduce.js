import {ref, watch} from "vue";
import clickEvent from "@/components/clickState.js";
import {getAnswerAreaAccordingId} from "@/components/projectConfig.js";

const detailsInfo = ref({
    type: '',
    id: ''
})
export default detailsInfo

export function getAnswerArea4AnswerAreaDetails() {
    if (detailsInfo.value.type === 'AnswerArea') {
        return getAnswerAreaAccordingId(detailsInfo.value.id)
    } else {
        return undefined
    }
}

export function answerAreaUndefined() {
    detailsInfo.value.type = 'Sheet'
    detailsInfo.value.id = 'sheet-0'
}

watch(clickEvent, () => {
    if (clickEvent.value.targetType.includes('AnswerArea')) {
        detailsInfo.value.type = 'AnswerArea'
        detailsInfo.value.id = clickEvent.value.targetId
    }
    if (clickEvent.value.targetType.includes('sheet')) {
        detailsInfo.value.type = 'Sheet'
        detailsInfo.value.id = clickEvent.value.targetId
    }
}, {
    deep: true
})