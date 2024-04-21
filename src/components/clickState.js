import {reactive} from "vue";

const clickEvent = reactive({
    targetType: '',
    targetId: 0,
    set(targetType, targetId) {
        this.targetType = targetType
        this.targetId = targetId
        console.log(targetType);
        console.log(targetId);
    }
})

export default clickEvent