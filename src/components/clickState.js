import {ref} from "vue";

const clickEvent = ref(
    {
        targetType: '',
        targetId: ''
    }
)

function setClickEvent(targetType, targetId) {
    clickEvent.value.targetType = targetType
    clickEvent.value.targetId = targetId
}

export default clickEvent
export {setClickEvent}