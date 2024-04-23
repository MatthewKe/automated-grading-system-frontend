import {reactive, ref} from "vue";

const clickEvent = ref(
    {
        targetType: '',
        targetId: 0
    }
)

function setClickEvent(targetType, targetId) {
    console.log('targetType:' + targetType)
    console.log('targetId:' + targetId)
    clickEvent.value.targetType = targetType
    clickEvent.value.targetId = Number(targetId)
}

export default clickEvent
export {setClickEvent}