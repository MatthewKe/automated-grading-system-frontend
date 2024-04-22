import {reactive, ref} from "vue";

const clickEvent = ref({
    targetType: '',
    targetId: 0,
})

function setClickEvent(targetType, targetId) {
    clickEvent.value.targetType = targetType
    clickEvent.value.targetId = targetId
    console.log(targetType);
    console.log(targetId);
}

export default clickEvent
export {setClickEvent}