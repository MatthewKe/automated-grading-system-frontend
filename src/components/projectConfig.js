import {ref, watch} from "vue";

let projectConfigJson = ref('{}')

const projectConfig = ref({})
watch(projectConfigJson, () => {
    projectConfig.value = JSON.parse(projectConfigJson.value)
    for (let i = 1; i < 20; i++) {
        projectConfig.value.answerAreas?.push({
            "id": projectConfig.value.nextId,
            "type": "otherAnswerArea",
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

export function getAnswerArea(id) {
    return projectConfig.value.answerAreas.find((answerArea) => answerArea.id === Number(id))
}

export function deleteQuestion(answerAreaId, questionNumber) {
    console.log('deleteQuestion')
    console.log('answerAreaId:' + answerAreaId)
    console.log('questionNumber:' + questionNumber)
    let answerArea = getAnswerArea(answerAreaId)
    let questionNumbers = answerArea.questionNumbers
    let indexOfQuestion = questionNumbers.findIndex((q) => q === questionNumber)
    let answers = answerArea.answers
    answers.splice(indexOfQuestion, 1)
    questionNumbers.splice(indexOfQuestion, 1)
    //todo 需要处理后续题目序号
}

export function addQuestion(answerAreaId, answer) {
    console.log('addQuestion')
    console.log('answerAreaId:' + answerAreaId)
    console.log('answer:')
    console.log(answer)
    let answerArea = getAnswerArea(answerAreaId)
    let questionNumbers = answerArea.questionNumbers
    let nextQuestionNumber
    if (questionNumbers.length === 0) {
        nextQuestionNumber = answerArea.preQuestionNumber + 1
    } else {
        nextQuestionNumber = questionNumbers[questionNumbers.length - 1] + 1
    }
    if (nextQuestionNumber !== answer.questionNumber) {
        throw new Error('nextQuestionNumber !== answer.questionNumber')
    }
    questionNumbers.push(answer.questionNumber)
    let answers = answerArea.answers
    answers.push(answer)
    //todo 需要处理后续题目序号
}

export function addAnswerArea(type) {
    let id = projectConfig.value.nextId
    projectConfig.value.nextId++
    projectConfig.value.answerAreas.push({
        id: id,
        type: type,
        height: 40,
        answers: [],
        questionNumbers: []
    })
    return id
}

export default projectConfig
