import {ref, watch} from "vue";

let projectConfigJson = ref('{}')

const projectConfig = ref({})
watch(projectConfigJson, () => {
    projectConfig.value = JSON.parse(projectConfigJson.value)

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

function getAnswerAreaIndex(id) {
    return projectConfig.value.answerAreas.findIndex((answerArea) => answerArea.id === Number(id))
}

export function deleteQuestion(answerAreaId, questionNumber) {
    let answerArea = getAnswerArea(answerAreaId)
    let questionNumbers = answerArea.questionNumbers
    let indexOfQuestion = questionNumbers.findIndex((q) => q === questionNumber)
    let answers = answerArea.answers
    answers.splice(indexOfQuestion, 1)
    questionNumbers.splice(indexOfQuestion, 1)
    //处理后续题目序号
    decrementAfterIndex4questionNumbers(questionNumbers, indexOfQuestion)
    decrementAfterIndex4answers(answers, indexOfQuestion)
    for (let i = getAnswerAreaIndex(answerAreaId) + 1; i < projectConfig.value.answerAreas.length; i++) {
        let answerArea = projectConfig.value.answerAreas[i]
        decrementAfterIndex4questionNumbers(answerArea.questionNumbers, 0)
        decrementAfterIndex4answers(answerArea.answers, 0)
    }
}

function decrementAfterIndex4questionNumbers(questionNumbers, index) {
    for (let i = index; i < questionNumbers.length; i++) {
        questionNumbers[i] -= 1;
    }
}

function decrementAfterIndex4answers(answers, index) {
    for (let i = index; i < answers.length; i++) {
        answers[i].questionNumber -= 1
    }
}

function incrementAfterIndex4questionNumbers(questionNumbers, index) {
    for (let i = index; i < questionNumbers.length; i++) {
        questionNumbers[i] += 1;
    }
}

function incrementAfterIndex4answers(answers, index) {
    for (let i = index; i < answers.length; i++) {
        answers[i].questionNumber += 1
    }
}

export function getPreQuestionNumber(answerAreaId) {
    let answerAreaIndex = projectConfig.value.answerAreas.findIndex((answerArea) => answerArea.id === Number(answerAreaId))
    if (answerAreaIndex === 0) {
        return 0
    }
    return projectConfig.value.answerAreas[answerAreaIndex - 1].questionNumbers.slice(-1)[0]
}

export function addQuestion(answerAreaId, answer) {
    let answerArea = getAnswerArea(answerAreaId)
    let questionNumbers = answerArea.questionNumbers
    let nextQuestionNumber
    if (questionNumbers.length === 0) {
        let preQuestionNumber = getPreQuestionNumber(answerAreaId)

        nextQuestionNumber = preQuestionNumber + 1
    } else {
        nextQuestionNumber = questionNumbers[questionNumbers.length - 1] + 1
    }
    if (nextQuestionNumber !== answer.questionNumber) {
        console.log(nextQuestionNumber)
        console.log(answer.questionNumber)
        throw new Error('nextQuestionNumber !== answer.questionNumber')
    }
    questionNumbers.push(answer.questionNumber)
    let answers = answerArea.answers
    answers.push(answer)
    //处理后续题目序号
    incrementAfterIndex4questionNumbers(questionNumbers, nextQuestionNumber + 1)
    incrementAfterIndex4answers(answers, nextQuestionNumber + 1)
    for (let i = getAnswerAreaIndex(answerAreaId) + 1; i < projectConfig.value.answerAreas.length; i++) {
        let answerArea = projectConfig.value.answerAreas[i]
        incrementAfterIndex4questionNumbers(answerArea.questionNumbers, 0)
        incrementAfterIndex4answers(answerArea.answers, 0)
    }
}

export function addAnswerArea(type, idOfPreAnswerArea, idOfSubsequentAnswerArea) {
    let id = projectConfig.value.nextId
    projectConfig.value.nextId++
    projectConfig.value.answerAreas.push({
        id: id,
        type: type,
        height: 40,
        answers: [],
        questionNumbers: [],
    })
    reorderAnswerArea(idOfPreAnswerArea, idOfSubsequentAnswerArea, id)
}

export function reorderAnswerArea(idOfPreAnswerArea, idOfSubsequentAnswerArea, idOfAnswerArea) {
    if (idOfPreAnswerArea === idOfAnswerArea || idOfAnswerArea === idOfSubsequentAnswerArea) {
        return
    }
    let answerAreaArr = projectConfig.value.answerAreas
    let indexOfAnswerArea = answerAreaArr.findIndex((e) => e.id === idOfAnswerArea)
    let answerArea = answerAreaArr[indexOfAnswerArea]
    answerAreaArr.splice(indexOfAnswerArea, 1)
    if (idOfPreAnswerArea !== -1) {
        let indexOfPreAnswerArea = answerAreaArr.findIndex(
            (e) => e.id === idOfPreAnswerArea
        )
        answerAreaArr.splice(indexOfPreAnswerArea + 1, 0, answerArea)
    } else if (idOfSubsequentAnswerArea !== -1) {
        let indexOfSubsequentAnswerArea = answerAreaArr.findIndex(
            (e) => e.id === idOfSubsequentAnswerArea
        )
        answerAreaArr.splice(indexOfSubsequentAnswerArea, 0, answerArea)
    } else {
        answerAreaArr.splice(answerAreaArr.length, 0, answerArea)
    }
    projectConfig.value.answerAreas = answerAreaArr
}

export default projectConfig
