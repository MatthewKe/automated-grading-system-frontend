import {ref, watch} from "vue";

let projectConfigJson = ref('{}')

const projectConfig = ref({})
watch(projectConfigJson, () => {
    projectConfig.value = JSON.parse(projectConfigJson.value)
    for (let i = 1; i < 20; i++) {
        projectConfig.value.answerAreas?.push({
            "id": projectConfig.value.nextId,
            "type": "blankAnswerArea",
            "height": 30
        })
        projectConfig.value.nextId++
    }
})

fetch('http://localhost:3000/read-file')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        projectConfigJson.value = data
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));

export default projectConfig